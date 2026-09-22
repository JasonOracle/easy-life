/*
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：读取模拟器运行时窗口尺寸与安全区，按 Tabbar 组件同款公式算出胶囊的
 *   css 像素矩形（含三个 Tab 槽位中心），供坐标 tap 使用。
 *   原因＝此前坐标 tap 的 y=738 属猜测，点击「返回 success 但页面不变」；
 *   且白底卡片与胶囊同色，无法用像素剖面反推条带。
 *   ⚠️ 遵守本工程铁律：evaluate 一律无参。]
 */
const automator = require('miniprogram-automator')

const fn = () => {
  var s = wx.getSystemInfoSync()
  return JSON.stringify({
    windowWidth: s.windowWidth,
    windowHeight: s.windowHeight,
    statusBarHeight: s.statusBarHeight,
    safeBottom: s.safeArea ? s.screenHeight - s.safeArea.bottom : -1,
    pixelRatio: s.pixelRatio,
    screenHeight: s.screenHeight
  })
}

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  const raw = await mp.evaluate(fn)
  const info = JSON.parse(raw)
  console.log('INFO=' + raw)

  // 与 Tabbar.uvue 同一套常量
  const MARGIN = 16, BAR_H = 56
  const safeBottom = info.safeBottom > 0 ? info.safeBottom : 0
  const bottom = safeBottom > 0 ? safeBottom + 12 : 22
  const topY = info.windowHeight - bottom - BAR_H
  const slotW = (info.windowWidth - MARGIN * 2) / 3
  const centers = [0, 1, 2].map(i => Math.round(slotW * (i + 0.5) + MARGIN))
  console.log('BAR css: top=' + topY + ' bottom=' + (topY + BAR_H) + ' left=' + MARGIN + ' right=' + (info.windowWidth - MARGIN))
  console.log('CENTER css: ' + centers.map((x, i) => ['首页', '日历', '我的'][i] + '=' + x + ',' + (topY + BAR_H / 2)).join('  '))
  console.log('DEVICE px (x' + info.pixelRatio + '): ' + centers.map((x, i) => ['首页', '日历', '我的'][i] + '=' + Math.round(x * info.pixelRatio) + ',' + Math.round((topY + BAR_H / 2) * info.pixelRatio)).join('  '))
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })
