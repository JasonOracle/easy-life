/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：FoodPicker 链路验收 A 段。uni-app x 产物组件内节点 automator 命中法＝
 *           「.page >>> .xxx」（$$ 只回首个匹配；多行点选交给 wechatide 坐标 tap）。
 *           步骤：reLaunch → FAB 开列表 → trigger input 'pg' 搜索 → 截图。]
 */
const automator = require('miniprogram-automator')
const DIR = '.workbuddy/shots/audit/'
const wait = (ms) => new Promise(r => setTimeout(r, ms))

async function shot(mp, name) {
  await mp.screenshot({ path: DIR + name + '.png' })
  console.log('SHOT=' + name)
}

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  await mp.evaluate(() => wx.reLaunch({ url: '/pages/home/Home' }))
  await wait(2500)
  const page = await mp.currentPage()
  await shot(mp, 'r8_1_home')

  await (await page.$('.fab')).tap()
  await wait(900)
  await shot(mp, 'r8_2_picker_open')

  const inp = await page.$('.page >>> .search-input')
  console.log('INPUT=' + (inp ? 'ok' : 'MISSING'))
  await inp.trigger('input', { value: 'pg' })
  await wait(900)
  await shot(mp, 'r8_3_search_pg')
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })
