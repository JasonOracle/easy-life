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
 * 修改内容：[新建：弹层③ 决定性探针——确认点击后读 sb-big-num/sb-budget-text 文本、
 *   FoodPicker 行与 AddFood 确认钮存在性、当场截图，区分「挂而不动」vs「截图陈旧帧」。]
 */
const automator = require('miniprogram-automator')
const SHOTS = __dirname + '/../.workbuddy/shots/audit/'

async function txt(page, sel) {
  try {
    const el = await page.$(sel)
    if (el == null) return 'NOEL'
    return JSON.stringify(await el.text())
  } catch (e) { return 'ERR:' + e.message }
}

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  await mp.reLaunch('/pages/home/Home')
  await new Promise(r => setTimeout(r, 2500))
  let page = await mp.currentPage()
  await (await page.$('.fab')).tap()
  await new Promise(r => setTimeout(r, 1200))
  page = await mp.currentPage()
  await (await page.$('.page >>> .fp-row')).tap()
  await new Promise(r => setTimeout(r, 1200))
  page = await mp.currentPage()
  console.log('AFTER_ROW pickerRow=' + (await page.$('.page >>> .fp-row') != null) + ' confirmBtn=' + (await page.$('.page >>> .confirm-btn') != null))
  const t0 = Date.now()
  await (await page.$('.page >>> .confirm-btn')).tap()
  await new Promise(r => setTimeout(r, Math.max(900 - (Date.now() - t0), 50)))
  page = await mp.currentPage()
  console.log('t900 badge=' + (await page.$('.page >>> .sb-badge') != null) +
    ' bigNum=' + await txt(page, '.page >>> .sb-big-num') +
    ' budget=' + await txt(page, '.page >>> .sb-budget-text') +
    ' meal=' + await txt(page, '.page >>> .sb-meal-text'))
  await mp.screenshot({ path: SHOTS + 'r24_probe_t900.png' })
  await new Promise(r => setTimeout(r, Math.max(3200 - (Date.now() - t0), 50)))
  page = await mp.currentPage()
  console.log('t3200 badge=' + (await page.$('.page >>> .sb-badge') != null))
  await mp.screenshot({ path: SHOTS + 'r24_probe_t3200.png' })
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + (e && e.message ? e.message : JSON.stringify(e))); process.exit(1) })
