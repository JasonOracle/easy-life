/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[暗黑模式诊断 v3：验证 settings.darkMode 在 computed 中是 ref 还是 boolean]
 */
const automator = require('miniprogram-automator')

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })

  const result = await mp.evaluate(() => {
    const r = {}
    const p = getCurrentPages()[0]
    const vm = p.$vm

    // Access the settings store via the setup context
    // The setup function returns the store, but in compiled output it's called as useSettingsStore()
    try {
      // Re-create the store to inspect
      const store = require('../../stores/settings.js').useSettingsStore()
      r.storeDarkMode = store.darkMode
      r.storeDarkModeType = typeof store.darkMode
      r.storeDarkModeValue = (typeof store.darkMode === 'object' && store.darkMode !== null) ? store.darkMode.value : 'N/A'
    } catch (e) { r.storeErr = e.message }

    // Check what the computed dk returns
    try {
      // Access the render context which has the computed values
      const renderCtx = vm.$scope
      r.scopeKeys = Object.keys(renderCtx.data || {}).join(',')
    } catch (e) { r.scopeErr = e.message }

    return r
  })
  console.log(JSON.stringify(result, null, 2))

  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })