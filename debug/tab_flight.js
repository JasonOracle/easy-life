/*
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建＋改版：零窗口验证 Tabbar 气泡四关键帧是否真的跑起来。
 *   探针路径＝getCurrentPages()[last].$vm.$children[0].$scope.data（实测该子组件即 Tabbar，30 个 setData 键），
 *   从其中筛出含 transition-duration 的行内 style 串，取 width／left／duration 三元组；
 *   以 25ms 间隔连续轮询 4s，打印出现过的不同快照。
 *   触发方式＝本脚本后台先起轮询，另开 wechatide 坐标 tap 走真实用户路径（onTap→写 origin→redirectTo→新页 onMounted 飞入）。
 *   看到宽 92→107→102→96 四段＝按下／移动／落位／静止全部生效。
 *   ⚠️ 遵守本工程铁律：evaluate 一律无参，常量写进函数字面量。
 *   用法：node debug/tab_flight.js [轮询毫秒]]
 */
const automator = require('miniprogram-automator')

const MS = parseInt(process.argv[2] || '4000')

const probe = () => {
  var ps = getCurrentPages()
  var p = ps[ps.length - 1]
  var kids = (p.$vm && p.$vm.$children) || []
  for (var i = 0; i < kids.length; i++) {
    var c = kids[i]
    var d = (c.$scope && c.$scope.data) || {}
    for (var k in d) {
      var v = d[k]
      if (typeof v === 'string' && v.indexOf('transition-duration') >= 0) {
        var w = (v.match(/width:([\d.]+)px/) || [])[1]
        var l = (v.match(/left:([\d.-]+)px/) || [])[1]
        var t = (v.match(/transition-duration:([\d.]+)ms/) || [])[1]
        return p.route + ' bub w=' + w + ' l=' + l + ' dur=' + t
      }
    }
  }
  return p.route + ' bub none'
}

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  const t0 = Date.now()
  const seen = []
  let last = ''
  let n = 0
  while (Date.now() - t0 < MS) {
    let r = ''
    try { r = await mp.evaluate(probe) } catch (e) { r = 'probe-err' }
    n++
    if (r.indexOf('w=') >= 0 && r != last) {
      last = r
      seen.push(((Date.now() - t0)) + 'ms  ' + r)
    }
    await new Promise(res => setTimeout(res, 20))
  }
  console.log('--- 气泡行内 style 快照（按出现顺序，共 ' + n + ' 次采样）---')
  seen.forEach(s => console.log(s))
  console.log('DISTINCT=' + seen.length)
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })
