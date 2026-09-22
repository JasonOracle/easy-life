/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[暗黑模式诊断 v5：用 selectorQuery 在 page context 内查 tabbar 节点真实 class 与 computed bg]
 */
const automator = require('miniprogram-automator')

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })

  const result = await mp.evaluate(() => {
    const r = {}

    // 1. Check storage
    try {
      r.storage = JSON.parse(wx.getStorageSync('ct_settings_v1'))
    } catch (e) { r.storageErr = e.message }

    // 2. Use selectorQuery to find tabbar elements
    return new Promise((resolve) => {
      wx.createSelectorQuery().select('.tabbar').fields({ node: true, computedStyle: ['background-color', 'border-top-color'] }, (res) => {
        r.tabbarQuery = res || null
        wx.createSelectorQuery().select('.page').fields({ node: true, computedStyle: ['background-color'] }, (res2) => {
          r.pageQuery = res2 || null
          resolve(r)
        }).exec()
      }).exec()
    })
  })
  console.log('RESULT:', JSON.stringify(result, null, 2))

  // 3. Also try the automator's element API
  const page = await mp.currentPage()
  const tabbar = await page.$('.page >>> .tabbar')
  if (tabbar) {
    const cls = await tabbar.property('class')
    console.log('AUTOMATOR_TABBAR_CLASS:', cls)
  } else {
    console.log('AUTOMATOR_TABBAR: not found')
  }

  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })