/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[暗黑模式诊断：查 storage / store / page data / tabbar class 四处，定位 tabbar 不变暗的根因]
 */
const automator = require('miniprogram-automator')

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })

  // 1. Storage + store + page data (all via mp.evaluate which runs in page context)
  const result = await mp.evaluate(() => {
    const r = {}

    // Storage
    try { r.storage = { keys: wx.getStorageInfoSync().keys } }
    catch (e) { r.storage = { error: e.message } }

    // Store state
    try {
      const p = getCurrentPages()[0]
      const store = p.$vm.$store
      if (store && store.state.value) {
        const s = store.state.value.settings
        r.store = s ? { darkMode: s.darkMode, type: typeof s.darkMode } : { error: 'no settings state' }
      } else {
        r.store = { error: 'no store or state', hasStore: !!store }
      }
    } catch (e) { r.store = { error: e.message } }

    // Page data
    try {
      const p = getCurrentPages()[0]
      r.pageData = { dk: p.data.dk }
    } catch (e) { r.pageData = { error: e.message } }

    return r
  })
  console.log('STORAGE:', JSON.stringify(result.storage))
  console.log('STORE:', JSON.stringify(result.store))
  console.log('PAGE_DATA:', JSON.stringify(result.pageData))

  // 2. Tabbar class
  const page = await mp.currentPage()
  const tabbar = await page.$('.page >>> .tabbar')
  if (tabbar) {
    const cls = await tabbar.property('class')
    console.log('TABBAR_CLASS:', cls)
  } else {
    console.log('TABBAR: not found via .page >>> .tabbar')
  }

  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })