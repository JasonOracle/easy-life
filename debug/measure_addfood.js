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
 * 修改内容：[新建：Boss 反馈三缺陷的几何取证——餐次卡被压扁/光晕成硬边矩形/选中项下绿点。
 *   链路=FAB→首个 .row（米饭）→ 量 .meal-card/.meal-photo/.halo/.opt-shadow/.sheet 尺寸与关键样式。]
 */
const automator = require('miniprogram-automator')
const DIR = '.workbuddy/shots/audit/'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  await mp.evaluate(() => {
    wx.reLaunch({ url: '/pages/home/Home' })
  })
  await wait(2500)
  const page = await mp.currentPage()
  await (await page.$('.fab')).tap()
  await wait(900)
  const row0 = await page.$('.page >>> .fp-row')
  console.log('ROW0=' + (row0 ? await row0.text() : 'MISSING'))
  await row0.tap()
  await wait(1200)
  await mp.screenshot({ path: DIR + 'r11_m_1_rice.png' })

  async function probe(sel, label) {
    const el = await page.$(sel)
    if (el == null) {
      console.log(label + '=MISSING')
      return
    }
    const s = await el.size()
    const o = await el.offset()
    const br = await el.style('border-radius')
    const ov = await el.style('overflow')
    console.log(label + ' size=' + JSON.stringify(s) + ' offset=' + JSON.stringify(o) + ' radius=' + br + ' overflow=' + ov)
  }

  await probe('.page >>> .sheet', 'SHEET')
  await probe('.page >>> .meal-row', 'MEAL_ROW')
  await probe('.page >>> .meal-card', 'MEAL_CARD')
  await probe('.page >>> .meal-photo', 'MEAL_PHOTO')
  await probe('.page >>> .meal-name', 'MEAL_NAME')
  await probe('.page >>> .halo', 'HALO')
  await probe('.page >>> .opt-shadow', 'OPT_SHADOW')
  await probe('.page >>> .art-wrap', 'ART_WRAP')
  await mp.disconnect()
  console.log('DONE')
})().catch((e) => {
  console.error('ERR=' + e.message)
  process.exit(1)
})
