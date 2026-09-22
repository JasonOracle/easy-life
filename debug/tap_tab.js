/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Muse Spark
 * 修改内容：[新建：automator 点按 Tabbar 第二项并截图，用于验证 redirectTo 跨页切换]
 *
 * 用法：node debug/tap_tab.js [输出路径]
 */
const automator = require('miniprogram-automator')
const out = process.argv[2] || (require('os').tmpdir() + '\\ct_tap.png')

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  const page = await mp.currentPage()
  const tabs = await page.$$('.tab-item')
  console.log('TABS=' + tabs.length)
  await tabs[1].tap()
  await new Promise(r => setTimeout(r, 2500))
  const cur = await mp.currentPage()
  console.log('PAGE=' + (cur ? cur.path : '(none)'))
  await mp.screenshot({ path: out })
  console.log('SHOT=' + out)
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })
