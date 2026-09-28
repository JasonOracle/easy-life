
// [变更日志] 2026-09-28: 默认昵称「老刘」→「轻律生活」（老板随新头像一并指定）；
//   旧值按「历史占位符」处理——落盘里读到 '老刘' 即视为用户从未自定义，直接显示新名，
//   否则已装机的设备因存储里留着 '老刘' 而永远看不到新名（改默认值救不了存量数据）。
import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'ct_user_v1'

/** 展示名默认值（v1.0 品牌名） */
const DEFAULT_NAME = '轻律生活'
/** 历史占位昵称：v1.0 之前所有装机设备的落盘值，读到即等同于「未自定义」 */
const LEGACY_PLACEHOLDER = '老刘'

function loadName(): string {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    if (typeof raw === 'string' && raw.length > 2) {
      const parsed = JSON.parse(raw) as { name?: string }
      if (typeof parsed.name === 'string' && parsed.name.length > 0) {
        if (parsed.name == LEGACY_PLACEHOLDER) return DEFAULT_NAME
        return parsed.name
      }
    }
  } catch (e) {
    // 存储不可用时用默认值
  }
  return DEFAULT_NAME
}

export const useUserStore = defineStore('user', () => {
  /** 昵称：默认「轻律生活」（v1.0 品牌名），存量设备上的历史占位「老刘」在 loadName 里被换掉 */
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
      }
  }

  return { name, streakDays, setName }
})
