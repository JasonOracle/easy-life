/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[暗黑模式诊断 v2：直读 settings store 的 darkMode ref 值 + 枚举页面 $children 找 Tabbar 组件]
 */
const automator = require('miniprogram-automator')

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })

  const result = await mp.evaluate(() => {
    const r = {}
    const p = getCurrentPages()[0]
    const vm = p.$vm

    // 1. Try to access settings store via vm.$store
    try {
      const store = vm.$store
      r.hasStore = !!store
      if (store) {
        const s = store.state.value ? store.state.value.settings : null
        r.storeSettings = s ? { darkMode: s.darkMode } : null
      }
    } catch (e) { r.storeErr = e.message }

    // 2. Try to access settings via the setup context
    try {
      r.vmKeys = Object.keys(vm).filter(k => k !== '$' && k !== '$el' && k !== '$parent' && k !== '$root')
    } catch (e) { r.vmKeysErr = e.message }

    // 3. Enumerate children to find Tabbar
    try {
      const kids = vm.$children || []
      r.childrenCount = kids.length
      r.children = kids.map((k, i) => {
        let nm = ''
        try { nm = (k.$ && k.$.type && (k.$.type.name || k.$.type.__name)) || '' } catch (e) {}
        let darkVal = ''
        try {
          // Try to read dark prop
          const props = k.$ && k.$.props
          if (props && props.dark !== undefined) darkVal = 'dark=' + props.dark
        } catch (e) {}
        return { idx: i, name: nm, dark: darkVal }
      })
    } catch (e) { r.childrenErr = e.message }

    // 4. Read storage directly
    try {
      r.storageSettings = JSON.parse(wx.getStorageInfoSync().keys.includes('ct_settings_v1')
        ? wx.getStorageSync('ct_settings_v1') : '{}')
    } catch (e) { r.storageErr = e.message }

    return r
  })
  console.log(JSON.stringify(result, null, 2))

  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })