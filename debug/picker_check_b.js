/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：FoodPicker 链路验收 B 段：读 AddFood 食物名 → 点更换 → 列表回显截图。]
 */
const automator = require('miniprogram-automator')
const DIR = '.workbuddy/shots/audit/'
const wait = (ms) => new Promise(r => setTimeout(r, ms))

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  const page = await mp.currentPage()
  const nm = await page.$('.page >>> .food-name')
  console.log('ADDFOOD_NAME=' + (nm ? await nm.text() : 'MISSING'))
  await mp.screenshot({ path: DIR + 'r8_4_addfood.png' })
  const chg = await page.$('.page >>> .change-btn')
  console.log('CHANGE=' + (chg ? 'ok' : 'MISSING'))
  await chg.tap()
  await wait(900)
  await mp.screenshot({ path: DIR + 'r8_5_picker_echo.png' })
  console.log('DONE')
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })
