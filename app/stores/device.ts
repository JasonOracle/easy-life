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