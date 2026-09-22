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
 * 修改内容：[新建：update:show 关闭链路决定性轮询——每步前/后查 row/confirm/badge 三元素存在性，
 *   确认点击后 200ms 粒度轮询徽章挂载直至 5s，判定子→父 update:show 是否真正驱动 v-if 卸载。]
 */
const automator = require('miniprogram-automator')

async function has(page, sel) { return (await page.$(sel)) != null }

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  await mp.reLaunch('/pages/home/Home')
  await new Promise(r => setTimeout(r, 2500))
  let page = await mp.currentPage()
  console.log('INIT row=' + await has(page, '.page >>> .fp-row') + ' btn=' + await has(page, '.page >>> .confirm-btn') + ' badge=' + await has(page, '.page >>> .sb-badge'))
  await (await page.$('.fab')).tap()
  await new Promise(r => setTimeout(r, 1200))
  page = await mp.currentPage()
  console.log('AFTER_FAB row=' + await has(page, '.page >>> .fp-row') + ' badge=' + await has(page, '.page >>> .sb-badge'))
  await (await page.$('.page >>> .fp-row')).tap()
  await new Promise(r => setTimeout(r, 1200))
  page = await mp.currentPage()
  console.log('AFTER_ROW row=' + await has(page, '.page >>> .fp-row') + ' btn=' + await has(page, '.page >>> .confirm-btn'))
  await (await page.$('.page >>> .confirm-btn')).tap()
  const t0 = Date.now()
  const marks = []
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 200))
    page = await mp.currentPage()
    const b = await has(page, '.page >>> .sb-badge')
    marks.push((Date.now() - t0) + ':' + (b ? 'Y' : 'n'))
    if (!b) break
  }
  console.log('BADGE_POLL ' + marks.join(' '))
  page = await mp.currentPage()
  console.log('FINAL row=' + await has(page, '.page >>> .fp-row') + ' btn=' + await has(page, '.page >>> .confirm-btn'))
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + (e && e.message ? e.message : JSON.stringify(e))); process.exit(1) })
