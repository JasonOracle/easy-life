/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[FoodPicker 列表行类名去冲突：探针选择器由 .page >>> .row 改 .page >>> .fp-row
 *   （组件类名统一加 fp- 前缀，避免与 Settings 页同名 .row 在小程序端互相污染）]
 */
/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：弹层③ 数据层探针——FAB→行→确认 后轮询 page.data() 中
 *   pickerShow/addShow/settleShow 与 sb-badge 存在性，验证 2380ms 自动关闭是否触发。]
 */
const automator = require('miniprogram-automator')

const pick = (d) => {
  if (d == null) return 'null'
  const keys = ['pickerShow', 'addShow', 'settleShow']
  const out = {}
  for (const k of keys) if (k in d) out[k] = d[k]
  return JSON.stringify(out)
}

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  await mp.reLaunch('/pages/home/Home')
  await new Promise(r => setTimeout(r, 2500))
  let page = await mp.currentPage()
  console.log('INIT data=' + pick(await page.data()))
  await (await page.$('.fab')).tap()
  await new Promise(r => setTimeout(r, 1200))
  page = await mp.currentPage()
  console.log('AFTER_FAB=' + pick(await page.data()))
  const row = await page.$('.page >>> .fp-row')
  console.log('ROW=' + (row != null))
  await row.tap()
  await new Promise(r => setTimeout(r, 1200))
  page = await mp.currentPage()
  console.log('AFTER_ROW=' + pick(await page.data()))
  const btn = await page.$('.page >>> .confirm-btn')
  console.log('CONFIRM=' + (btn != null))
  const t0 = Date.now()
  await btn.tap()
  for (const at of [300, 900, 1800, 2400, 2800, 3400]) {
    await new Promise(r => setTimeout(r, Math.max(at - (Date.now() - t0), 20)))
    page = await mp.currentPage()
    const d = await page.data()
    const badge = await page.$('.page >>> .sb-badge')
    console.log('t=' + (Date.now() - t0) + ' ' + pick(d) + ' badge=' + (badge != null))
  }
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + (e && e.message ? e.message : JSON.stringify(e))); process.exit(1) })
