/**
 * [变更日志]
 * 修改时间：2026-09-23
 * AI模型：Gemini 系列
 * 修改内容：[根据指令彻底清理 pour 倒水音效类型、音频路径映射与相关定时器逻辑]
 */
/**
 * [变更日志]
 * 修改时间：2026-09-23
 * AI模型：Gemini 系列
 * 修改内容：[升级 playSound 为双缓冲音频实例轮转池机制，设置 mixWithOther 属性并在触发时强制 seek(0)，彻底解决快速连点/连续切换卡片时底层音频实例忙导致吞音与不响的缺陷]
 */
/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Gemini 系列
 * 修改内容：[1. 新增 shake（水瓶晃动）、slide（拖动滑块）、card（切换卡片/选项）音效类型与音频路径映射；2. 增加倒水音频 pour 配合动画在 2 秒后自动停止机制]
 */
/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Gemini 系列
 * 修改内容：[新增 pour 倒水音效类型与 /static/audio/pour.mp3 映射，支撑食物结算后水瓶注水物理动效]
 */
/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Gemini 系列
 * 修改内容：[将 playSound 音效逻辑集中集成在 settings store 中，彻底解决独立 composables 文件在小程序运行期 module is not defined 导致页面崩溃不加载的致命Bug]
 */
/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[darkMode 解除「v1.0 恒关」锁定：加载时不再强制 false（Boss 拍板个人中心深色模式），
 *   新增 setDarkMode()（持久化 + 供 Settings 开关点击）。]
 */
/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Muse Spark
 * 修改内容：[新建：设置 store——偏好开关（深色模式 v1.0 置灰、用餐提醒）/ 音效 / 触觉，
 *   本地存储持久化；USER_FOOD_ENABLED=false 集中在此，不散落各处 if]
 */

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
}

function loadSettings(): SettingsState {
  const def: SettingsState = {
    darkMode: false,
    mealReminders: false,
    soundEnabled: true,
    hapticsEnabled: true,
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

  function persist(): void {
    try {
      uni.setStorageSync(STORAGE_KEY, JSON.stringify({
        darkMode: darkMode.value,
        mealReminders: mealReminders.value,
        soundEnabled: soundEnabled.value,
        hapticsEnabled: hapticsEnabled.value,
      }))
    } catch (e) {
      // 存储失败不阻塞
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
    setMealReminders,
    setSoundEnabled,
    setHapticsEnabled,
    setDarkMode,
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

