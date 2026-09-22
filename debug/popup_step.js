/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：验收通用小工具。argv: step(open|shot|close) tag [shotName]
 *   open=reLaunch Home + 点 FAB 开弹层⓪ + 截图；shot=仅截图；close=坐标点蒙层位截图前动作（留给外部点）。]
 */
const automator = require('miniprogram-automator')
const DIR = '.workbuddy/shots/audit/'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

;(async () => {
  const step = process.argv[2] || 'shot'
  const tag = process.argv[3] || 'x'
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  if (step === 'open') {
    await mp.evaluate(() => {
      wx.reLaunch({ url: '/pages/home/Home' })
    })
    await wait(2500)
    const p = await mp.currentPage()
    console.log('PAGE=' + p.path)
    await (await p.$('.fab')).tap()
    await wait(900)
    await mp.screenshot({ path: DIR + 'r10_' + tag + '_picker.png' })
  } else {
    await mp.screenshot({ path: DIR + 'r10_' + tag + '.png' })
    const p = await mp.currentPage()
    console.log('PAGE=' + p.path)
  }
  await mp.disconnect()
  console.log('OK ' + step + ' ' + tag)
})().catch((e) => {
  console.error('ERR=' + e.message)
  process.exit(1)
})
