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
      return { ...def, ...parsed, darkMode: false }
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

  return {
    darkMode,
    mealReminders,
    soundEnabled,
    hapticsEnabled,
    setMealReminders,
    setSoundEnabled,
    setHapticsEnabled,
  }
})
