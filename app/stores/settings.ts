// [变更日志] 设置持久化 store：新增 accent（主题色 mint/ocean/lavender）与 locale（'' = 跟随系统）两字段，随 ct_settings_v1 一并落盘
import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'ct_settings_v1'

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

export type SoundType = 'click' | 'switch' | 'change' | 'success' | 'shake' | 'slide' | 'card' | 'delete'

const AUDIO_FILES: Record<string, string> = {
  click: '/static/audio/click.mp3',
  switch: '/static/audio/switch.mp3',
  change: '/static/audio/change.mp3',
  success: '/static/audio/success.mp3',
  shake: '/static/audio/shake.mp3',
  slide: '/static/audio/slide.mp3',
  card: '/static/audio/selected-card.mp3',
  delete: '/static/audio/delete.mp3',
}

const audioPool: any[] = []
let poolCursor = 0

function getAudioContext(): any {
  if (audioPool.length < 2) {
    try {
      const a1 = uni.createInnerAudioContext()
      const a2 = uni.createInnerAudioContext()
      // #ifdef MP-WEIXIN
      if ((uni as any).setInnerAudioOption != null) {
        (uni as any).setInnerAudioOption({
          obeyMuteSwitch: false,
          mixWithOther: true,
        })
      }
      // #endif
      audioPool.push(a1, a2)
    } catch (e) {}
  }
  if (audioPool.length === 0) {
    return uni.createInnerAudioContext()
  }
  const ctx = audioPool[poolCursor]
  poolCursor = (poolCursor + 1) % audioPool.length
  return ctx
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

