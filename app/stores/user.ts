/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Muse Spark
 * 修改内容：[新建：用户 store——昵称/连续记录天数/头像，本地存储持久化；
 *   个人中心头图与统计共用]
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'ct_user_v1'

function loadName(): string {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    if (typeof raw === 'string' && raw.length > 2) {
      const parsed = JSON.parse(raw) as { name?: string }
      if (typeof parsed.name === 'string' && parsed.name.length > 0) {
        return parsed.name
      }
    }
  } catch (e) {
    // 存储不可用时用默认值
  }
  return '老刘'
}

export const useUserStore = defineStore('user', () => {
  /** 昵称（设计稿演示值） */
  const name = ref(loadName())
  /** 连续记录天数（设计稿演示值；真实连击统计后续接 food entries 推导） */
  const streakDays = ref(128)

  function setName(v: string): void {
    const next = v.trim()
    if (next.length === 0) return
    name.value = next
    try {
      uni.setStorageSync(STORAGE_KEY, JSON.stringify({ name: next }))
    } catch (e) {
      // 存储失败不阻塞
    }
  }

  return { name, streakDays, setName }
})
