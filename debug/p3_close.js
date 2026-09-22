const automator = require('miniprogram-automator')
const path = require('path')
process.on('uncaughtException', (e) => { console.log('UNCAUGHT', e.message); process.exit(1) })
const sleep = (ms) => new Promise(r => setTimeout(r, ms))
;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  const page = await mp.currentPage()
  // 蒙层点按（顶部 100,100）
  await page.touchscreen.tap(100, 100)
  await sleep(1500)
  const sheet = await page.$('.page >>> .fp-sheet')
  console.log('after overlay tap, fp-sheet:', sheet == null ? 'GONE(closed OK)' : 'still there')
  await mp.screenshot({ path: path.join('D:/project/other-porject/kaluli/.workbuddy/shots/audit', 'p11_after_overlay_tap.png') })
  // 再开一次，验证系统返回拦截：navigateBack 场景模拟器难模拟，跳过；测点行选中链路（坐标 tap 第一行 y≈560+76 行区）
  await (await page.$('.fab')).tap()
  await sleep(1200)
  await page.touchscreen.tap(190, 620)  // 米饭行（sheet 顶≈288，行首≈420 起）
  await sleep(1500)
  const sheet2 = await page.$('.page >>> .fp-sheet')
  console.log('after row tap, fp-sheet:', sheet2 == null ? 'GONE(select+close OK)' : 'still there')
  await mp.screenshot({ path: path.join('D:/project/other-porject/kaluli/.workbuddy/shots/audit', 'p11_after_row_tap.png') })
  await mp.disconnect(); process.exit(0)
})()
