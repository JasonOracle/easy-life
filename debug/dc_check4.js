/**
 * [变更日log]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[暗黑模式诊断 v4：直接读 settings.darkMode 的类型与值，确认 Pinia 是否自动 unwrap]
 */
const automator = require('miniprogram-automator')

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })

  const result = await mp.evaluate(() => {
    const r = {}
    const p = getCurrentPages()[0]
    const vm = p.$vm

    // The settings store is created in setup() — try to access it via the component's setup state
    // In the compiled code, the render function accesses settings.darkMode directly
    // Let's check what _self (the setup context) contains
    try {
      const self = vm._self
      r.selfType = typeof self
      if (self) {
        r.selfKeys = Object.keys(self).filter(k => !k.startsWith('$') && !k.startsWith('_')).join(',')
        // Check if settings is on _self
        if (self.settings) {
          r.settingsType = typeof self.settings
          r.settingsDarkMode = self.settings.darkMode
          r.settingsDarkModeType = typeof self.settings.darkMode
          if (self.settings.darkMode && typeof self.settings.darkMode === 'object') {
            r.settingsDarkModeValue = self.settings.darkMode.value
            r.settingsDarkModeValueType = typeof self.settings.darkMode.value
          }
        }
      }
    } catch (e) { r.selfErr = e.message }

    // Try via $scope (the component's data/scope)
    try {
      const sc = vm.$scope
      if (sc) {
        r.scopeDataKeys = Object.keys(sc.data || {}).join(',')
      }
    } catch (e) { r.scopeErr = e.message }

    return r
  })
  console.log(JSON.stringify(result, null, 2))

  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })