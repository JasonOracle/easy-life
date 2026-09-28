// [变更日志] 设置持久化 store：新增 accent（主题色 mint/ocean/lavender）与 locale（'' = 跟随系统）两字段，随 ct_settings_v1 一并落盘
// [变更日志] 2026-09-28: 音效丢音修复 —— 全局单实例 + 130ms 互斥（真机 A/B 实测完整播出率 8% → 100%）
import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'ct_settings_v1'

/**
 * 音效最小播放间隔（互斥）。
 * 背景：App 端 innerAudioContext 每次 play() 都会重建底层播放器（热态 25~39ms、首载 131ms），
 * 而滑动相邻音效只隔 30~40ms → 互相顶掉，表现为「没声音 / 声音滞后 / 滑动快就出问题」。
 * 130ms = 最短板素材 slide.mp3（78ms）+ 重建余量。
 * 取证与 7 组真机 A/B：docs/analysis-2026-09-28-audio-playback.md
 */
const MIN_PLAY_INTERVAL_MS = 130
let lastPlayTs = 0

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
    soundEnabled: true,
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
    // 互斥：间隔不足直接跳过，避免相邻音效互相顶掉（真机实测这是丢音的主因）
    const now = Date.now()
    if (now - lastPlayTs < MIN_PLAY_INTERVAL_MS) return
    lastPlayTs = now
    try {
      const ctx = getAudioContext()
      ctx.src = src
      ctx.stop()
      ctx.seek(0)
      ctx.play()
    } catch (e) {}
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
  switch: '/static/audio/switch.mp3',
  card: '/static/audio/tap.mp3',
  success: '/static/audio/success.mp3',
  shake: '/static/audio/shake.mp3',
  slide: '/static/audio/slide.mp3',
  delete: '/static/audio/click2.mp3',
  confirm: '/static/audio/confirm.mp3',
}

// 全局单实例（真机 A/B：双实例轮询会让「同一文件的前两次播放」各付一次首载成本，
// 也正是老板看到的「前两次点击没声音」）。单实例 + 上面的 130ms 互斥 = 完整播出率 100%。
const audioPool: any[] = []

function getAudioContext(): any {
  if (audioPool.length < 1) {
    try {
      const a1 = uni.createInnerAudioContext()
      // #ifdef MP-WEIXIN
      if ((uni as any).setInnerAudioOption != null) {
        (uni as any).setInnerAudioOption({
          obeyMuteSwitch: false,
          mixWithOther: true,
        })
      }
      // #endif
      audioPool.push(a1)
    } catch (e) {}
  }
  if (audioPool.length === 0) {
    return uni.createInnerAudioContext()
  }
  return audioPool[0]
}

export function playSound(type: SoundType, maxDurationMs?: number): void {
  try {
    const s = useSettingsStore()
    s.playSound(type, maxDurationMs)
  } catch (e) {}
}

export function triggerHaptic(type: 'light' | 'medium' | 'heavy'): void {
  try {
    const s = useSettingsStore()
    s.triggerHaptic(type)
  } catch (e) {}
}

