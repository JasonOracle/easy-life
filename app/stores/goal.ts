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
