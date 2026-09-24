// [变更日志] 2026-09-24: 修复 catch 块残缺注释导致的编译格式塌陷（存储失败不阻塞写入）
import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'ct_goal_v1'

function loadGoal(): number {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    if (typeof raw === 'string' && raw.length > 0) {
      const v = Math.round(Number(JSON.parse(raw)))
      if (v > 0) return v
    }
  } catch (e) {
    // 存储不可用时用默认值
  }
  return 1800
}

export const useGoalStore = defineStore('goal', () => {
  /** 每日热量目标 kcal（设计稿演示场景值；设置页「目标管理」可改） */
  const calorieGoal = ref(loadGoal())

  function setGoal(v: number): void {
    if (v > 0) {
      calorieGoal.value = Math.round(v)
      try {
        uni.setStorageSync(STORAGE_KEY, JSON.stringify(calorieGoal.value))
      } catch (e) {
        // 存储失败不阻塞
      }
    }
  }

  return { calorieGoal, setGoal }
})

export type CalorieStatusType = 'green' | 'amber' | 'coral'

export interface CalorieStatus {
  type: CalorieStatusType
  textClass: string
  bgClass: string
  ringClass: string
  color: string
}

export function getCalorieStatus(current: number, goalVal: number): CalorieStatus {
  if (goalVal <= 0) {
    return {
      type: 'green',
      textClass: 'status-text-green',
      bgClass: 'status-bg-green',
      ringClass: 'status-ring-green',
      color: '#1FBF8F'
    }
  }
  const ratio = current / goalVal
  if (ratio > 1.5) {
    return {
      type: 'coral',
      textClass: 'status-text-coral',
      bgClass: 'status-bg-coral',
      ringClass: 'status-ring-coral',
      color: '#FF9E7D'
    }
  } else if (ratio > 1.0) {
    return {
      type: 'amber',
      textClass: 'status-text-amber',
      bgClass: 'status-bg-amber',
      ringClass: 'status-ring-amber',
      color: '#E8B54D'
    }
  } else {
    return {
      type: 'green',
      textClass: 'status-text-green',
      bgClass: 'status-bg-green',
      ringClass: 'status-ring-green',
      color: '#1FBF8F'
    }
  }
}

