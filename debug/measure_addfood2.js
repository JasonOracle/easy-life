/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：AddFood 布局取证 v2——automator >>> 选择器命中页面根无效，
 *   改走 evaluate + wx.createSelectorQuery().in(组件 $scope) 量 .sheet/.meal-row/.meal-card/.meal-photo rect。
 *   组件定位＝遍历 $children 找 scope.data JSON 含 meal_breakfast 的实例。]
 */
const automator = require('miniprogram-automator')

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  const kick = await mp.evaluate(() => {
    const app = getApp()
    app.__mres = 'PENDING'
    const p = getCurrentPages()[0]
    let comp = null
    function walk(c, depth) {
      if (c == null || depth > 4 || comp != null) return
      try {
        const sc = c.$scope != null ? c.$scope : c
        if (sc != null && sc.data != null && JSON.stringify(sc.data).indexOf('meal_breakfast') >= 0) {
          comp = sc
          return
        }
      } catch (e) {}
      const kids = (c.$scope != null && c.$scope.$children) || c.$children || []
      for (let i = 0; i < kids.length; i++) walk(kids[i], depth + 1)
    }
    walk(p.$vm, 0)
    if (comp == null) {
      app.__mres = 'COMP_NOT_FOUND'
      return 'kick=COMP_NOT_FOUND'
    }
    const q = wx.createSelectorQuery().in(comp)
    q.select('.sheet')
    q.select('.meal-row')
    q.select('.meal-card')
    q.select('.meal-photo')
    q.select('.tray')
    q.select('.confirm-btn')
    q.exec((rs) => {
      const names = ['sheet', 'meal_row', 'meal_card', 'meal_photo', 'tray', 'confirm']
      const out = []
      for (let i = 0; i < rs.length; i++) {
        const r = rs[i]
        out.push(names[i] + '=' + (r == null ? 'null' : 'w' + Math.round(r.width) + ' h' + Math.round(r.height) + ' top' + Math.round(r.top) + ' bot' + Math.round(r.bottom)))
      }
      app.__mres = out.join(' | ')
    })
    return 'kick=OK'
  })
  console.log(kick)
  await new Promise((r) => setTimeout(r, 1200))
  const res = await mp.evaluate(() => getApp().__mres)
  console.log('RECTS=' + res)
  await mp.disconnect()
})().catch((e) => {
  console.error('ERR=' + e.message)
  process.exit(1)
})
