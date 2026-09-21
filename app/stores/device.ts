/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Muse Spark
 * 修改内容：[手脚架重建后恢复：从 git 历史取回实现并接线（新文件头；food.ts 数据源路径改为 src/data；其余逻辑原样）]
 */
// stores/device.ts — 设备能力 Pinia store
// 全局单例，App 启动时检测一次，所有组件通过 useDeviceStore() 读取。
// 检测逻辑来自 composables/useDeviceCapability.ts，这里只做存储和暴露。

import { defineStore } from 'pinia'
import { detectDeviceCapability } from '../composables/useDeviceCapability'
import type { DeviceCapability } from '../composables/useDeviceCapability'

export const useDeviceStore = defineStore('device', {
  state: (): { capability: DeviceCapability } => ({
    capability: detectDeviceCapability(),
  }),
  getters: {
    tier: (state) => state.capability.tier,
    haptics: (state) => state.capability.haptics,
    liquidWave: (state) => state.capability.liquidWave,
    sound: (state) => state.capability.sound,
    backdropBlur: (state) => state.capability.backdropBlur,
    platform: (state) => state.capability.platform,
  },
  actions: {
    /** 运行时重新检测（极少需要，如插拔蓝牙键盘后） */
    refresh() {
      this.capability = detectDeviceCapability()
    },
  },
})