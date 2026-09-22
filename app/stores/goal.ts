/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Gemini 系列
 * 修改内容：[将 getCalorieStatus 函数收拢至 goal store，彻底解决独立 utils 文件在小程序运行期 module is not defined 导致页面崩溃不加载的致命Bug]
 */
/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Muse Spark
 * 修改内容：[手脚架重建后恢复：从 git 历史取回实现并接线（新文件头；food.ts 数据源路径改为 src/data；其余逻辑原样）]
 */
/**
 * [变更日志]
 * 修改时间：2026-09-19
 * AI模型：CodeBuddy (GLM-5.3-Flash)
 * 修改内容：[新建：目标 store——每日热量目标（默认 1800，设计稿演示值）。
 *           首页液体/大数字、设置页「目标管理」共用。持久化待接 storage。]
 */

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
  if (ratio > 1.15) {
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

