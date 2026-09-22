/*
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：零窗口直调 Tabbar 的 onTap 处理器（AGENTS「处理器直调」定案模式）。
 *   原因＝组件内节点 automator el.tap() 会静默落空、坐标 tap 受胶囊遮挡与视口高度影响不稳。
 *   做法＝从子组件 $scope.data[绑定键] 取处理器名（产物 Tabbar.wxml 里 bindtap="{{键}}"，
 *   当前编译＝首页 e／日历 h／我的 k）→ sc[名字]() 直调。
 *   ⚠️ 遵守本工程铁律：evaluate 一律无参（带参传不稳定），故键名在 Node 侧拼进函数字面量。
 *   用法：node debug/tab_tap.js <wxml绑定键>]
 */
const automator = require('miniprogram-automator')

const key = process.argv[2] || 'k'
if (!/^[A-Za-z_$][\w$]*$/.test(key)) {
  console.log('ERR bad key')
  process.exit(1)
}

const src = `(function () {
  var pages = getCurrentPages()
  var page = pages[pages.length - 1]
  var kids = (page.$vm && page.$vm.$children) || []
  for (var i = 0; i < kids.length; i++) {
    var c = kids[i]
    var d = c.$scope && c.$scope.data
    if (d && typeof d.__KEY__ === 'string') {
      var name = d.__KEY__
      if (typeof c[name] === 'function') { c[name](); return 'called __KEY__ -> ' + name }
      return 'key found, method missing: ' + name
    }
  }
  return 'key __KEY__ not found among ' + kids.length + ' children'
})`

const fn = eval(src.replace(/__KEY__/g, key))

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  const r = await mp.evaluate(fn)
  console.log('TAP=' + r)
  const cur = await mp.currentPage()
  console.log('PAGE=' + cur.path)
  await mp.disconnect()
})().catch((e) => { console.log('ERR ' + e.message); process.exit(1) })
