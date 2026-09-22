// page-container 打样验收：Home 开 FoodPicker → 截图 → 点蒙层关 → 确认回首页态
const automator = require('miniprogram-automator')
const path = require('path')
process.on('uncaughtException', (e) => { console.log('UNCAUGHT', e.message); process.exit(1) })
const OUT = 'D:/project/other-porject/kaluli/.workbuddy/shots/audit'
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  await mp.evaluate(new Function('wx.reLaunch({url:"/pages/home/Home"});return 1;'))
  await sleep(2500)

  const page = await mp.currentPage()
  const fab = await page.$('.fab')
  if (fab == null) { console.log('NO FAB'); process.exit(1) }
  await fab.tap()
  await sleep(1200) // 原生滑入动画
  await mp.screenshot({ path: path.join(OUT, 'p11_picker_open.png') })
  console.log('shot open')

  // 点蒙层（屏幕上方 1/4 处，sheet 高 560 视口 844，蒙层在顶部空带）
  await mp.evaluate(new Function(`
    var p = getCurrentPages()[0];
    return p.route;
  `)).then(r => console.log('route:', r))

  const sheet = await page.$('.page >>> .fp-sheet')
  console.log('fp-sheet probe:', sheet == null ? 'null' : 'found')

  // 用原生点击蒙层：automator 没有坐标 tap，走 wx 模拟不可行 → 直接调 afterleave 链路核验：
  // 置 show=false 走父页（Home）data。Home 的 pickerShow 在页 vm 上
  const cur = await mp.evaluate(new Function(`
    var vm = getCurrentPages()[0].$vm;
    var names = [];
    for (var k in vm) { try { if (/show|picker/i.test(k)) names.push(k + '=' + vm[k]) } catch(e){} }
    return names.join(',');
  `))
  console.log('home vm show flags:', cur)

  await mp.disconnect(); process.exit(0)
})()
