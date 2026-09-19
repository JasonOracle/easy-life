// useDeviceCapability.ts — 设备能力检测
// 按平台 + 机型 + 系统版本分档，决定哪些反馈可以开。
// 不依赖任何运行时探测，纯静态规则，改规则改这里就行。

import { ref } from 'vue'

// ── 类型 ──────────────────────────────────────────────
export type PerfTier = 'high' | 'mid' | 'low'

export interface DeviceCapability {
  platform: 'ios' | 'android'
  tier: PerfTier
  /** 是否支持触觉反馈 */
  haptics: boolean
  /** 是否播放液体波纹动画 */
  liquidWave: boolean
  /** 是否播放音效 */
  sound: boolean
  /** 是否尝试 backdrop-filter（iOS 13+ / Android 部分支持） */
  backdropBlur: boolean
}

// ── iOS 机型分代（A 系列芯片）────────────────────────
// 分界：A11 (iPhone X, 2017) 及以前 = low；A12/A13 = mid；A14+ = high
// 未在列表中的机型（如 iPhone9,3 SE2）走系统版本兜底
const IOS_LOW_MODELS = new Set([
  // iPhone 6s / 6s Plus (A9, 2015)
  'iPhone6,1', 'iPhone6,2',
  // iPhone 7 / 7 Plus (A10, 2016)
  'iPhone7,1', 'iPhone7,2',
  // iPhone 8 / 8 Plus (A10, 2017)
  'iPhone8,1', 'iPhone8,2',
  // iPhone SE 1 代 (A9, 2016)
  'iPhone8,4',
  // iPhone 7 / 7 Plus (iOS 16+ 重新标识)
  'iPhone9,1', 'iPhone9,2',
  // iPhone 8 / 8 Plus (iOS 16+ 重新标识)
  'iPhone10,1', 'iPhone10,2', 'iPhone10,3', 'iPhone10,4',
  // iPhone X (A11, 2017)
  'iPhone10,5', 'iPhone10,6',
])

const IOS_MID_MODELS = new Set([
  // iPhone XS / XS Max (A12, 2018)
  'iPhone11,2', 'iPhone11,4', 'iPhone11,6',
  // iPhone 11 / 11 Pro / 11 Pro Max (A13, 2019)
  'iPhone12,1', 'iPhone12,3', 'iPhone12,5',
])

// ── Android 低性能机型特征 ──────────────────────────
// 判断逻辑：系统版本 + 芯片特征（从 model 字符串推断）
const ANDROID_LOW_VERSION = 25   // Android 7.1.2 及以下
const ANDROID_MID_VERSION = 28   // Android 9 及以下算 mid

// 已知低端芯片关键词（MediaTek Helio / Snapdragon 4xx / 旧款 Exynos / 紫光展锐）
const ANDROID_LOW_CHIP_KEYWORDS = [
  'helio', 'mt67',
  'snapdragon 4', 'sd4',
  'exynos 7870', 'exynos 7880', 'exynos 7885',
  'exynos 960', // 2016 旗舰，现在算低端
  'kirin 710', 'kirin 710a', 'kirin 710f',
  'unisoc', 'spreadtrum', 'sc98',
]

// ── 检测函数 ─────────────────────────────────────────
function detectPlatform(): 'ios' | 'android' {
  // #ifdef APP-PLUS
  const info = uni.getSystemInfoSync()
  return info.platform as 'ios' | 'android'
  // #endif
  // H5 / 其他端默认 android
  return 'android'
}

function detectTier(platform: 'ios' | 'android'): PerfTier {
  // #ifdef APP-PLUS
  const info = uni.getSystemInfoSync()
  const model = (info.model || '').toLowerCase()
  const systemVersion = info.systemVersion || ''

  if (platform === 'ios') {
    return detectIOSTier(model, systemVersion)
  } else {
    return detectAndroidTier(model, systemVersion)
  }
  // #endif
  return 'high'
}

function detectIOSTier(model: string, systemVersion: string): PerfTier {
  // 机型判断优先
  if (IOS_LOW_MODELS.has(model)) return 'low'
  if (IOS_MID_MODELS.has(model)) return 'mid'

  // 未识别机型用版本推断（SE2/SE3 等不在列表中的走这里）
  const iosMajor = parseInt(systemVersion.split('.')[0], 10) || 0
  if (iosMajor <= 12) return 'low'
  if (iosMajor <= 14) return 'mid'
  return 'high'
}

function detectAndroidTier(model: string, systemVersion: string): PerfTier {
  const apiLevel = parseInt(systemVersion.split('.')[0], 10) || 0

  // 芯片关键词判断
  const isLowChip = ANDROID_LOW_CHIP_KEYWORDS.some(k => model.includes(k))

  if (apiLevel <= ANDROID_LOW_VERSION || isLowChip) return 'low'
  if (apiLevel <= ANDROID_MID_VERSION) return 'mid'
  return 'high'
}

// ── 对外接口 ─────────────────────────────────────────

/** 检测当前设备能力，返回完整 DeviceCapability 对象 */
export function detectDeviceCapability(): DeviceCapability {
  const _platform = detectPlatform()
  const _tier = detectTier(_platform)

  return {
    platform: _platform,
    tier: _tier,
    // 触觉：low 档关，mid/high 开
    haptics: _tier !== 'low',
    // 液体波纹：low 档关，mid/high 开
    liquidWave: _tier !== 'low',
    // 音效：所有档都开（音效开销极小）
    sound: true,
    // backdrop-filter：low 档关，mid/high 开
    backdropBlur: _tier !== 'low',
  }
}

/** 预计算实例（App 启动时用一次），供非 Vue 上下文使用 */
export const deviceCapability: DeviceCapability = detectDeviceCapability()

/** 在组件中响应式获取（如果以后支持动态切换） */
export function useDeviceCapability() {
  return ref(deviceCapability)
}