// [变更日志] 2026-09-24: 新增液体物理引擎——双模强迫阻尼振荡器（M1/M2）+ 气泡/粒子池，四态（idle/tap/longpress/pour），非响应式设计由调用方逐帧驱动
// [变更日志] 2026-09-26: CAVITY_H 注释校准（取值未变）——canvas 实高已改 242rpx 以覆盖瓶底，引擎坐标系仍为 236
// [变更日志] 2026-10-15: 新增 getSharedEngine()——引擎实例提到模块级跨页复用。tabBar 用 uni.redirectTo 切换（关闭当前页+新建目标页），
//   BottleLiquid 每次挂载都 new LiquidEngine() + startIntro()（把 currentRatio 强制归 0.06），切回首页时水位就会重新爬升，
//   表现为「重新加载、卡一下」。单例复用后第二次起只 setRatio()——setRatio 内部在 introSettled 为 true 时直接置终值，
//   水位瞬间到位，且弹簧相位/气泡池/粒子池一并保留。首次冷启动仍走 startIntro()（安静开场的设计意图不变）。
let sharedEngine: LiquidEngine | null = null

/** 跨页复用的引擎单例。首次调用走完整 intro（水位从 6% 缓升），其后只更新目标水位。 */
export function getSharedEngine(ratio: number): LiquidEngine {
  if (sharedEngine == null) {
    sharedEngine = new LiquidEngine()
    sharedEngine.setRatio(ratio)
    sharedEngine.startIntro()
  } else {
    sharedEngine.setRatio(ratio)
  }
  return sharedEngine
}

/** 仅测试用：丢弃单例，让下次 getSharedEngine() 重新走 intro。 */
export function resetSharedEngine(): void {
  sharedEngine = null
}
// Liquid physics engine: dual-mode forced damped oscillator + bubble/particle pool
// Non-reactive by design (per nonreactive-engine pattern); caller drives step() per frame.

const CAVITY_W = 148 // rpx, matches .bottle-cavity width
const CAVITY_H = 236 // rpx, 引擎纵向坐标空间（= 玻璃内胆可视高）。canvas 实高 242rpx，多出的 6rpx 仅用于覆盖瓶底余量
const MAX_FILL = 0.68 // visual shoulder-line cap (was 0.80; 0.68 keeps liquid below bottleneck)
const AMP_CAP = 18 // rpx hard cap to prevent overflow at 68% fill

// Mode 1: slosh (half-wavelength across width), cos(πu) shape
const T1 = 460 // ms natural period
const W1 = (2 * Math.PI) / T1
const Z1 = 0.10 // damping ratio → ~60% per swing (was 0.14 for stronger tap response)

// Mode 2: ripple (2 full wavelengths), sin(4πu + φ) shape
const DECAY_0955_PER_16MS = 0.955 // documented constant, dt-normalized

// Heave (vertical bob for pour impact)
const T0 = 520
const W0 = (2 * Math.PI) / T0
const Z0 = 0.18

// Bottle body pendulum (tap response)
const TB = 300
const WB = (2 * Math.PI) / TB
const ZB = 0.22

// Idle breathing
const IDLE_M1_AMP = 1.6
const IDLE_T = 3800 // ms
const IDLE_W = (2 * Math.PI) / IDLE_T
const IDLE_M2_AMP = 1.2
const IDLE_PHASE_RATE = 0.0045 // rad/ms

// Bubble config
const BUBBLE_POOL_SIZE = 8
const BUBBLE_SPAWN_IDLE_MIN = 900
const BUBBLE_SPAWN_IDLE_MAX = 2400
const BUBBLE_RISE_SPEED_MIN = 0.022 // rpx/ms
const BUBBLE_RISE_SPEED_MAX = 0.038
const BUBBLE_RADIUS_MIN = 2.5
const BUBBLE_RADIUS_MAX = 5.5
const BUBBLE_DRIFT_AMP = 3.0
const BUBBLE_DRIFT_FREQ = 0.004

export type ColorMode = 'green' | 'amber' | 'coral'

interface Bubble {
  active: boolean
  x: number
  y: number
  r: number
  speed: number
  phase: number
  life: number // 0..1 normalized travel
}

interface Particle {
  active: boolean
  x: number
  y: number
  vx: number
  vy: number
  r: number
  life: number // ms remaining
  maxLife: number
  histX: number[]
  histY: number[]
}

export class LiquidEngine {
  // State
  m1 = 0 // mode-1 amplitude (rpx)
  v1 = 0 // mode-1 velocity
  m2 = 0 // mode-2 amplitude
  phase2 = 0 // mode-2 phase
  heave = 0 // vertical displacement
  vHeave = 0

  // Container forcing
  tiltDeg = 0
  containerX = 0
  prevTiltDeg = 0
  prevContainerX = 0

  // Idle
  idleTime = 0
  idleActive = false
  introSettled = false

  // Agitation (long press)
  agitated = false
  agitateTimer = 0
  agitateDir = 1 // directional consistency: +1 or -1, set on agitation start

  // Pour
  pouring = false
  pourTime = 0
  pourMode: 'normal' | 'overflow' = 'normal'
  targetRatio = 0
  currentRatio = 0
  preAddRatio = 0

  // Spring-mass surface (pour mode only)
  springs: { p: number; v: number }[] = []
  springTension = 0.025
  springDampening = 0.05
  springSpread = 0.25
  numSprings = 7

  // Pools
  bubbles: Bubble[] = []
  particles: Particle[] = []
  bubbleSpawnTimer = 0

  // Surface path cache
  surfacePoints: number[] = [] // [x0,y0, x1,y1, ...] in canvas coords

  constructor() {
    for (let i = 0; i < BUBBLE_POOL_SIZE; i++) {
      this.bubbles.push({
        active: false, x: 0, y: 0, r: 0, speed: 0, phase: 0, life: 0
      })
    }
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        active: false, x: 0, y: 0, vx: 0, vy: 0, r: 0,
        life: 0, maxLife: 0, histX: [], histY: []
      })
    }
    for (let i = 0; i < this.numSprings; i++) {
      this.springs.push({ p: 0, v: 0 })
    }
  }

  setRatio(ratio: number): void {
    this.targetRatio = Math.min(Math.max(ratio, 0), MAX_FILL)
    if (!this.pouring && this.introSettled) {
      this.currentRatio = this.targetRatio
    }
  }

  startIntro(): void {
    this.currentRatio = 0.06
    this.introSettled = false
    this.idleActive = false
  }

  finishIntro(): void {
    this.introSettled = true
    this.currentRatio = this.targetRatio
  }

  enableIdle(): void {
    if (this.introSettled && this.currentRatio > 0.01) {
      this.idleActive = true
    }
  }

  impulse(kind: string, strength: number): void {
    if (kind === 'tap') {
      // Set initial displacement for M1 (like tilting the glass then releasing)
      this.m1 = strength * 0.8
      this.v1 = 0
      // M2 gets a velocity kick for high-frequency surface ripples
      this.v1 += strength * 0.3
      this.m2 = Math.max(this.m2, strength * 0.5)
      this.spawnBubble()
    } else if (kind === 'shake') {
      this.agitated = true
      this.agitateTimer = 0
    } else if (kind === 'pour') {
      this.pouring = true
      this.pourTime = 0
      this.preAddRatio = this.currentRatio
      const delta = this.targetRatio - this.preAddRatio
      this.pourMode = delta < 0.01 ? 'overflow' : 'normal'
    } else if (kind === 'bubblePop') {
      this.m2 = Math.max(this.m2, 0.8)
    }
  }

  setAgitating(held: boolean): void {
    this.agitated = held
    if (held) {
      this.agitateTimer = 0
      // Pick a random direction at agitation start and hold it
      this.agitateDir = Math.random() < 0.5 ? -1 : 1
    }
  }

  step(dt: number): void {
    if (dt <= 0 || dt > 100) dt = 16.67
    const dtS = dt // keep in ms for all calculations

    // Intro rise (critically damped approach to target)
    if (!this.introSettled) {
      const diff = this.targetRatio - this.currentRatio
      if (Math.abs(diff) < 0.002) {
        this.currentRatio = this.targetRatio
        this.introSettled = true
      } else {
        this.currentRatio += diff * Math.min(1, dtS / 200)
      }
      return // no physics during intro
    }

    // Level approach (critically damped when not pouring)
    if (!this.pouring) {
      const diff = this.targetRatio - this.currentRatio
      if (Math.abs(diff) > 0.001) {
        this.currentRatio += diff * Math.min(1, dtS / 250)
      } else {
        this.currentRatio = this.targetRatio
      }
    }

    // Compute tilt target from container motion
    const tiltRad = this.tiltDeg * Math.PI / 180
    const tiltTarget = -Math.sin(tiltRad) * CAVITY_W * 0.3

    // Mode 1: forced damped oscillator (standard spring form, dt in ms)
    const accel1 = -W1 * W1 * this.m1 - 2 * Z1 * W1 * this.v1
    this.v1 += accel1 * dtS
    this.m1 += this.v1 * dtS

    // Agitation: continuous directional torque (not discrete pulses)
    if (this.agitated) {
      // Continuous acceleration in fixed direction (per-frame, proportional to dt)
      this.v1 += this.agitateDir * 0.15 * dtS
      // Progressive m2 accumulation for increasing surface chaos
      this.m2 = Math.min(AMP_CAP, this.m2 + 0.02 * dtS)
      // Probabilistic bubble spawn (natural rhythm, not mechanical double-burst)
      if (Math.random() < 0.03) this.spawnBubble()
      // Amplitude floor: gentle nudge in same direction if damping eats it all
      if (Math.abs(this.m1) < 3) {
        this.v1 += this.agitateDir * 0.08 * dtS
      }
    }

    // Mode 2: decaying ripple (0.955 per 16.67ms)
    const decayFactor = Math.pow(DECAY_0955_PER_16MS, dtS / 16.67)
    this.m2 *= decayFactor
    if (this.m2 < 0.06) this.m2 = 0

    // Phase advance
    let phaseRate = IDLE_PHASE_RATE
    if (this.agitated) phaseRate = 0.012
    if (this.pouring && this.pourTime > 100 && this.pourTime < 1100) phaseRate = 0.02
    this.phase2 += phaseRate * dtS

    // Idle breathing (nonlinear: amp modulated by slow sine)
    if (this.idleActive && !this.agitated && !this.pouring) {
      this.idleTime += dtS
      // 振幅随水深缩放：薄水层里同样的倾侧被圆底弧壁放大成显眼摆动，浅水应近乎安静；水深≥40rpx 恢复满呼吸
      const depthScale = Math.min(1, (CAVITY_H * this.currentRatio) / 40)
      const breathMod = 0.5 + 0.5 * Math.sin(this.idleTime * 0.0017)
      const idleM1 = IDLE_M1_AMP * breathMod * Math.sin(this.idleTime * IDLE_W) * depthScale
      const idleM2 = IDLE_M2_AMP * Math.sin(this.phase2) * depthScale
      // Blend idle into state (additive, doesn't override forced motion)
      if (Math.abs(this.m1) < 3 && Math.abs(this.v1) < 0.01) {
        this.m1 = this.m1 * 0.95 + idleM1 * 0.05
      }
      if (this.m2 < 1.5) {
        this.m2 = Math.max(this.m2, idleM2 * 0.3)
      }
    }

    // Heave spring
    const accelH = W0 * W0 * (-this.heave) - 2 * Z0 * W0 * this.vHeave
    this.vHeave += accelH * (dtS / 1000)
    this.heave += this.vHeave * (dtS / 1000)
    if (Math.abs(this.heave) < 0.1 && Math.abs(this.vHeave) < 0.01) {
      this.heave = 0
      this.vHeave = 0
    }

    // Amplitude cap
    if (this.m1 > AMP_CAP) { this.m1 = AMP_CAP; this.v1 *= 0.5 }
    if (this.m1 < -AMP_CAP) { this.m1 = -AMP_CAP; this.v1 *= 0.5 }

    // Pour choreography
    if (this.pouring) {
      this.pourTime += dtS
      this.updatePour(dtS)
    }

    // Bubbles
    this.updateBubbles(dtS)

    // Particles (splash droplets)
    this.updateParticles(dtS)

    // Build surface path
    this.buildSurface()
  }

  private updatePour(dtS: number): void {
    const t = this.pourTime

    if (this.pourMode === 'overflow') {
      // Overflow mode: thin stream, shallow ripple, no level change
      if (t < 250) {
        this.m2 = Math.max(this.m2, 2)
      }
      if (t >= 250 && t < 250 + dtS + 5) {
        this.m1 = 4
        this.v1 = 0
        this.m2 = Math.max(this.m2, 5)
        for (let i = 0; i < 2; i++) {
          this.spawnParticle(
            CAVITY_W * 0.4 + Math.random() * CAVITY_W * 0.2,
            this.getWaterLevelY() - 3,
            (Math.random() - 0.5) * 0.8,
            -(0.3 + Math.random() * 0.2),
            1.5 + Math.random(),
            200
          )
        }
      }
      if (t >= 800) {
        this.pouring = false
        this.currentRatio = this.targetRatio
      }
      return
    }

    // Normal pour mode with spring-mass surface
    // Reset springs on pour start
    if (t < dtS + 5) {
      this.resetSprings()
    }

    // Phase 1: Stream appears (0-100ms)
    if (t < 100) {
      this.m2 = Math.max(this.m2, 1.5)
    }

    // Phase 2: Stream flowing, continuous impact force (100-1100ms)
    if (t >= 100 && t <= 1100) {
      // Continuous downward force on center springs each frame
      this.applyPourImpact()
      // Spawn splash particles continuously
      if (Math.random() < 0.4) {
        this.spawnParticle(
          CAVITY_W / 2 + (Math.random() - 0.5) * 10,
          this.getWaterLevelY() - 5,
          (Math.random() - 0.5) * 4,
          -(Math.random() * 3 + 2),
          2 + Math.random() * 1.5,
          280
        )
      }
      // Spawn bubbles below impact point (dense cluster like reference)
      if (Math.random() < 0.4) {
        const bx = CAVITY_W / 2 + (Math.random() - 0.5) * 15
        const by = this.getWaterLevelY() + 10 + Math.random() * 40
        this.spawnBubbleAt(bx, by)
      }
      // Extra bubble burst near surface at higher probability
      if (Math.random() < 0.25) {
        this.spawnBubbleAt(CAVITY_W / 2 + (Math.random() - 0.5) * 20, this.getWaterLevelY() + 5)
      }
      // Update springs
      this.updateSprings()
    }

    // Water level rises linearly during pour (100-1100ms)
    if (t > 100 && t <= 1100) {
      const riseRate = (this.targetRatio - this.preAddRatio) / 1000
      this.currentRatio += riseRate * dtS
      if (this.currentRatio > this.targetRatio) this.currentRatio = this.targetRatio
    }

    // Phase 3: Residual settle after stream stops (1100-1200ms)
    if (t > 1100 && t <= 1200) {
      this.updateSprings()
      if (t >= 1200) {
        this.currentRatio = this.targetRatio
      }
    }

    // End pour
    if (t >= 1200) {
      this.pouring = false
      this.currentRatio = this.targetRatio
    }
  }

  private updateSprings(): void {
    // Update each spring independently
    for (let i = 0; i < this.numSprings; i++) {
      const s = this.springs[i]
      const force = -this.springTension * s.p - this.springDampening * s.v
      s.v += force
      s.p += s.v
    }
    // Neighbor propagation (8 passes for smooth wave spread)
    for (let pass = 0; pass < 8; pass++) {
      const leftDeltas: number[] = []
      const rightDeltas: number[] = []
      for (let i = 0; i < this.numSprings; i++) {
        leftDeltas.push(0)
        rightDeltas.push(0)
      }
      for (let i = 0; i < this.numSprings; i++) {
        if (i > 0) {
          leftDeltas[i] = this.springSpread * (this.springs[i].p - this.springs[i - 1].p)
          this.springs[i - 1].v += leftDeltas[i]
        }
        if (i < this.numSprings - 1) {
          rightDeltas[i] = this.springSpread * (this.springs[i].p - this.springs[i + 1].p)
          this.springs[i + 1].v += rightDeltas[i]
        }
      }
      for (let i = 0; i < this.numSprings; i++) {
        if (i > 0) this.springs[i - 1].p += leftDeltas[i]
        if (i < this.numSprings - 1) this.springs[i + 1].p += rightDeltas[i]
      }
    }
  }

  private applyPourImpact(): void {
    // Apply downward velocity to center spring and neighbors
    const centerIdx = Math.floor(this.numSprings / 2)
    this.springs[centerIdx].v -= 2.0
    if (centerIdx > 0) this.springs[centerIdx - 1].v -= 1.0
    if (centerIdx < this.numSprings - 1) this.springs[centerIdx + 1].v -= 1.0
  }

  private resetSprings(): void {
    for (let i = 0; i < this.numSprings; i++) {
      this.springs[i].p = 0
      this.springs[i].v = 0
    }
  }

  private updateBubbles(dtS: number): void {
    const waterY = this.getWaterLevelY()
    const spawnInterval = this.agitated
      ? BUBBLE_SPAWN_IDLE_MIN / 4
      : BUBBLE_SPAWN_IDLE_MIN + Math.random() * (BUBBLE_SPAWN_IDLE_MAX - BUBBLE_SPAWN_IDLE_MIN)

    this.bubbleSpawnTimer += dtS
    if (this.bubbleSpawnTimer > spawnInterval && this.currentRatio > 0.05) {
      this.bubbleSpawnTimer = 0
      this.spawnBubble()
    }

    for (let i = 0; i < this.bubbles.length; i++) {
      const b = this.bubbles[i]
      if (!b.active) continue
      b.y -= b.speed * dtS
      b.life = 1 - (b.y - waterY) / (CAVITY_H - waterY + 40)
      if (b.y < waterY - 5) {
        b.active = false
        this.impulse('bubblePop', 0.8)
      }
    }
  }

  private updateParticles(dtS: number): void {
    const G = 0.0035 // rpx/ms²
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]
      if (!p.active) continue
      p.vy += G * dtS
      p.x += p.vx * dtS
      p.y += p.vy * dtS
      p.life -= dtS
      // Store history for trail
      p.histX.push(p.x)
      p.histY.push(p.y)
      if (p.histX.length > 3) { p.histX.shift(); p.histY.shift() }
      if (p.life <= 0) p.active = false
    }
  }

  private spawnBubble(): void {
    const waterY = this.getWaterLevelY()
    const x = 10 + Math.random() * (CAVITY_W - 20)
    this.spawnBubbleAt(x, CAVITY_H - 5)
  }

  private spawnBubbleAt(x: number, y: number): void {
    for (let i = 0; i < this.bubbles.length; i++) {
      if (!this.bubbles[i].active) {
        const b = this.bubbles[i]
        b.active = true
        b.x = x
        b.y = y
        b.r = BUBBLE_RADIUS_MIN + Math.random() * (BUBBLE_RADIUS_MAX - BUBBLE_RADIUS_MIN)
        b.speed = BUBBLE_RISE_SPEED_MIN + Math.random() * (BUBBLE_RISE_SPEED_MAX - BUBBLE_RISE_SPEED_MIN)
        b.phase = Math.random() * Math.PI * 2
        b.life = 0
        return
      }
    }
  }

  private spawnParticle(x: number, y: number, vx: number, vy: number, r: number, life: number): void {
    for (let i = 0; i < this.particles.length; i++) {
      if (!this.particles[i].active) {
        const p = this.particles[i]
        p.active = true
        p.x = x; p.y = y; p.vx = vx; p.vy = vy
        p.r = r; p.life = life; p.maxLife = life
        p.histX = []; p.histY = []
        return
      }
    }
  }

  getWaterLevelY(): number {
    // Returns the Y position of the water surface top (in cavity-local coords, 0=top)
    return CAVITY_H * (1 - this.currentRatio)
  }

  getStreamProgress(): number {
    if (!this.pouring) return 0
    if (this.pourMode === 'overflow') {
      if (this.pourTime < 60) return this.pourTime / 60
      if (this.pourTime < 250) return 1
      return Math.max(0, 1 - (this.pourTime - 250) / 150)
    }
    if (this.pourTime < 100) return this.pourTime / 100
    if (this.pourTime < 1100) return 1
    return Math.max(0, 1 - (this.pourTime - 1100) / 100)
  }

  getCausticPhase(): number {
    if (!this.pouring || this.pourMode === 'overflow') return -1
    if (this.pourTime < 100 || this.pourTime > 1100) return -1
    return (this.pourTime - 100) / 1000
  }

  getImpactPhase(): number {
    if (!this.pouring) return -1
    const impactAt = this.pourMode === 'overflow' ? 250 : 100
    const dur = this.pourMode === 'overflow' ? 300 : 1000
    if (this.pourTime < impactAt || this.pourTime > impactAt + dur) return -1
    return (this.pourTime - impactAt) / dur
  }

  buildSurface(): void {
    const N = 34
    const pts: number[] = []
    const waterY = this.getWaterLevelY() + this.heave

    // During pour, use spring-mass surface for local impact deformation
    if (this.pouring && this.pourMode === 'normal') {
      const springSpacing = CAVITY_W / (this.numSprings - 1)
      for (let i = 0; i <= N; i++) {
        const u = i / N
        const x = u * CAVITY_W
        // Interpolate spring displacement at this x position
        const springIdx = x / springSpacing
        const idx0 = Math.floor(springIdx)
        const idx1 = Math.min(idx0 + 1, this.numSprings - 1)
        const frac = springIdx - idx0
        const springDisp = this.springs[idx0].p * (1 - frac) + this.springs[idx1].p * frac
        // Blend with idle M2 ripple for natural look
        const s2 = this.m2 * Math.sin(4 * Math.PI * u + this.phase2) * 0.3
        const y = waterY + springDisp + s2
        pts.push(x, y)
      }
    } else {
      // Non-pour mode: original dual-mode oscillator
      for (let i = 0; i <= N; i++) {
        const u = i / N
        const x = u * CAVITY_W
        const s1 = this.m1 * Math.cos(Math.PI * u)
        const s2 = this.m2 * Math.sin(4 * Math.PI * u + this.phase2)
        const y = waterY + s1 + s2
        pts.push(x, y)
      }
    }
    this.surfacePoints = pts
  }

  getPeakX(): number {
    // Find x of highest surface point (lowest y value)
    let minY = 9999
    let peakX = CAVITY_W / 2
    for (let i = 0; i < this.surfacePoints.length; i += 2) {
      if (this.surfacePoints[i + 1] < minY) {
        minY = this.surfacePoints[i + 1]
        peakX = this.surfacePoints[i]
      }
    }
    return peakX
  }
}
