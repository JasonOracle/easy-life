// [变更日志] 设置持久化 store：新增 accent（主题色 mint/ocean/lavender）与 locale（'' = 跟随系统）两字段，随 ct_settings_v1 一并落盘
// [变更日志] 2026-09-28: 音效默认改为关闭（Boss 指令）——soundEnabled 出厂默认 false，设置页可手动开启；已落盘的用户偏好不受影响
// [变更日志] 2026-09-28: 音效丢音修复 v3（根因定案）—— 真机 [AUD] 探针取证：方案A 分实例后仍丢音，
//   因 App 端 InnerAudioContext 的 src→stop→seek→play 重启序列「起播即结束」（onPlay 零触发、
//   onEnded ~170ms 即到，玩家被 stop 打成 0 音量空壳）。正解＝置空 src → 20ms 后重设 src+play。
//   方案A（每类型独立实例 + 按类型最小间隔）保留，取证见 docs/analysis-2026-09-28-audio-playback.md
// [变更日志] 2026-09-28: 音效丢音修复 v2（方案A·音频池）—— 每类型独立 InnerAudioContext + 按类型最小间隔，
//   替代「单实例 + 全局 130ms 互斥」。单实例下长素材（shake 862ms / success 1.32s）起播即锁死全 App 音效窗口；
//   分实例后类型间互不干扰，同类型重启代价只剩热态重建 25~39ms。
import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'ct_settings_v1'

/**
 * 音效最小触发间隔（按类型，毫秒）。
 * 间隔只约束「同一类型连点」：click 类素材 96ms + 热态重建 25~39ms ≈ 130ms 为能播完的下限
 * （同口径 A/B 实测值，见 docs/analysis-2026-09-28-audio-playback.md 第 8 章）；
 * 长素材（confirm/shake/success）取 1/4 素材长作连点保护——连点语义＝「重头再听」，
 * 允许中途重启，只挡人手速极限以下的误触发连击。不同类型各走各的实例，互不占用窗口。
 */
const MIN_PLAY_INTERVAL_MS: Record<string, number> = {
  click: 130, switch: 130, card: 130, slide: 130, delete: 130,
  confirm: 350, shake: 320, success: 320,
}
const DEFAULT_PLAY_INTERVAL_MS = 130
const lastPlayTsByType: Record<string, number> = {}

/** v1.0 功能开关：自建食物不做 */
export const USER_FOOD_ENABLED = false

interface SettingsState {
  darkMode: boolean
  mealReminders: boolean
  soundEnabled: boolean
  hapticsEnabled: boolean
  accent: string
  locale: string
}

function loadSettings(): SettingsState {
  const def: SettingsState = {
    darkMode: false,
    mealReminders: false,
    soundEnabled: false,
    hapticsEnabled: true,
    accent: 'mint',
    locale: '',
  }
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    if (typeof raw === 'string' && raw.length > 2) {
      const parsed = JSON.parse(raw) as Partial<SettingsState>
      return { ...def, ...parsed }
    }
  } catch (e) {
    // 存储不可用时用默认值
  }
  return def
}

export const useSettingsStore = defineStore('settings', () => {
  const initial = loadSettings()
  const darkMode = ref(initial.darkMode)
  const mealReminders = ref(initial.mealReminders)
  const soundEnabled = ref(initial.soundEnabled)
  const hapticsEnabled = ref(initial.hapticsEnabled)
  const accent = ref(initial.accent)
  // '' 表示未显式选择，运行时按系统 locale 兜底；setLocale 后固定
  const locale = ref(initial.locale)

  function persist(): void {
    try {
      uni.setStorageSync(STORAGE_KEY, JSON.stringify({
        darkMode: darkMode.value,
        mealReminders: mealReminders.value,
        soundEnabled: soundEnabled.value,
        hapticsEnabled: hapticsEnabled.value,
        accent: accent.value,
        locale: locale.value,
      }))
    } catch (e) {
      }
  }

  function setMealReminders(v: boolean): void {
    mealReminders.value = v
    persist()
  }

  function setSoundEnabled(v: boolean): void {
    soundEnabled.value = v
    persist()
  }

  function setHapticsEnabled(v: boolean): void {
    hapticsEnabled.value = v
    persist()
  }

  function setDarkMode(v: boolean): void {
    darkMode.value = v
    persist()
  }

  function setAccent(v: string): void {
    accent.value = v
    persist()
  }

  function setLocale(v: string): void {
    locale.value = v
    persist()
  }

  function playSound(type: SoundType): void {
    if (!soundEnabled.value) return
    const src = AUDIO_FILES[type]
    if (!src) return
    // 同类型连点保护：间隔不足直接跳过（不同类型各有实例，互不影响）
    const now = Date.now()
    const gate = MIN_PLAY_INTERVAL_MS[type] ?? DEFAULT_PLAY_INTERVAL_MS
    if (now - (lastPlayTsByType[type] ?? 0) < gate) return
    lastPlayTsByType[type] = now
    const ctx = getAudioContext(type)
    if (ctx == null) return
    try {
      // App 端重启正解：置空 src 再重设（真机探针取证——原 src→stop→seek→play 序列
      // 会「起播即结束」：onPlay 零触发、onEnded ~170ms 即到，玩家被 stop 打死，只剩 0 音量空壳）
      ctx.src = ''
      setTimeout(() => {
        ctx.src = src
        ctx.play()
      }, 20)
    } catch (e) {
      console.error('[audio] play failed:', type, e)
    }
  }

  function triggerHaptic(type: 'light' | 'medium' | 'heavy'): void {
    if (!hapticsEnabled.value) return
    
    // PC 开发工具环境拦截：防止模拟器窗口剧烈抖动
    try {
      const info = uni.getSystemInfoSync()
      if (info.platform === 'windows' || info.platform === 'mac') {
        return
      }
    } catch (e) {}

    try {
      if (type === 'light') {
        uni.vibrateShort({ type: 'light' } as any) // 类型声明可能缺失
      } else if (type === 'medium') {
        uni.vibrateShort({ type: 'medium' } as any)
      } else if (type === 'heavy') {
        uni.vibrateShort({ type: 'heavy' } as any)
        setTimeout(() => {
          uni.vibrateShort({ type: 'heavy' } as any)
        }, 100)
      }
    } catch (e) {
      // 兜底不带参数的调用
      uni.vibrateShort()
    }
  }

  return {
    darkMode,
    mealReminders,
    soundEnabled,
    hapticsEnabled,
    accent,
    locale,
    setMealReminders,
    setSoundEnabled,
    setHapticsEnabled,
    setDarkMode,
    setAccent,
    setLocale,
    playSound,
    triggerHaptic,
  }
})

export type SoundType = 'click' | 'switch' | 'success' | 'shake' | 'slide' | 'card' | 'delete' | 'confirm'

// [变更日志] 2026-09-28: 音源三次重整（老板指定）——
//   slide（滑块拖动）与 switch 的音源 switch.mp3 → click2.mp3，switch.mp3 已删
//   click2.mp3 已由老板替换为 96ms 短版（原 504ms）；tap.mp3 已删
//   现存素材时长（ffprobe 复核）：click2 96ms / confirm 313ms / shake 862ms / success 1320ms（老板换 1s 档）
// [变更日志] 2026-09-28: 音源二次重整（老板指定）——
//   card（选项切换/甜度/餐次/分类）tap.mp3 → click2.mp3
//   slide（滑块拖动）slide.mp3 → switch.mp3，slide.mp3 已删
//   click3.mp3 / click4.mp3 已删（本就零引用）
//   时长实测（ffprobe）：click2 504ms / switch 575ms / confirm 313ms / shake 862ms / success 1829ms
// [变更日志] 2026-09-28: 音源重整（老板指定）——
//   click / delete 改用 click2.mp3（原 click.mp3、delete.mp3 已删）
//   card 改用 switch.mp3（原 selected-card.mp3 已删）
//   新增 confirm（百科详情页「添加到某餐」CTA；此前该类型缺失 → 静默无声）
//   移除 change（无任何调用，且 change.mp3 已删，留着会指向不存在的文件）
// [变更日志] 2026-09-28: card 改用 tap.mp3（131ms，由 click2 裁剪 + 淡出生成）——
//   实测连点 4 张餐次卡完整播完率：switch(575ms)=1/4、tap(131ms)=4/4（见
//   docs/analysis-2026-09-28-audio-playback.md 第 9 章）。130ms 互斥是照短素材调的，
//   长素材（≥500ms）等于没保护，「点四次第 5 次才响」的根因就是素材太长。
const AUDIO_FILES: Record<string, string> = {
  click: '/static/audio/click2.mp3',
  switch: '/static/audio/click2.mp3',
  card: '/static/audio/click2.mp3',
  success: '/static/audio/success.mp3',
  shake: '/static/audio/shake.mp3',
  slide: '/static/audio/click2.mp3',
  delete: '/static/audio/click2.mp3',
  confirm: '/static/audio/confirm.mp3',
}

// 每类型一个常驻实例：长素材（shake/success）起播不再占用其他类型的窗口，
// 类型间彻底并行；同类型连点由上面的按类型间隔兜底。
const contexts: Record<string, any> = {}

function applyMuteOption(): void {
  // #ifdef MP-WEIXIN
  if ((uni as any).setInnerAudioOption != null) {
    (uni as any).setInnerAudioOption({
      obeyMuteSwitch: false,
      mixWithOther: true,
    })
  }
  // #endif
}

function getAudioContext(type: string): any {
  let ctx = contexts[type]
  if (ctx == null) {
    try {
      ctx = uni.createInnerAudioContext()
      applyMuteOption()
      ctx.onError((res: any) => {
        console.error('[audio] onError', type, res.errCode, res.errMsg)
      })
      contexts[type] = ctx
    } catch (e) {
      console.error('[audio] create failed:', type, e)
      return null
    }
  }
  return ctx
}

/**
 * 启动预热：逐个类型静默（volume=0）起播一次，把「冷态首载 131ms」的成本提前付掉，
 * 用户第一次点击就有声音。在 onLaunch 空闲时段延迟调用，不与首屏动画抢资源。
 * Web 端整体跳过：浏览器 autoplay 政策拒绝无手势起播（8 类型 × NotAllowedError），
 * 且预热本为消原生播放器冷载，HTML audio 无此成本。
 */
export function warmupAudio(): void {
  // #ifdef APP || MP-WEIXIN
  const types: SoundType[] = ['click', 'switch', 'card', 'success', 'shake', 'slide', 'delete', 'confirm']
  for (let i = 0; i < types.length; i++) {
    setTimeout(() => {
      const type = types[i]
      const src = AUDIO_FILES[type]
      if (!src) return
      const ctx = getAudioContext(type)
      if (ctx == null) return
      try {
        ctx.volume = 0
        ctx.src = src
        ctx.play()
        setTimeout(() => {
          try {
            ctx.stop()
            ctx.volume = 1
          } catch (e) {}
        }, 260)
      } catch (e) {
        console.error('[audio] warmup failed:', type, e)
      }
    }, i * 160)
  }
  // #endif
}

export function playSound(type: SoundType): void {
  try {
    const s = useSettingsStore()
    s.playSound(type)
  } catch (e) {
    console.error('[audio] playSound dispatch failed:', type, e)
  }
}

export function triggerHaptic(type: 'light' | 'medium' | 'heavy'): void {
  try {
    const s = useSettingsStore()
    s.triggerHaptic(type)
  } catch (e) {}
}

