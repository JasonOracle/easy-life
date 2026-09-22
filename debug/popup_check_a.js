/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：保存食物弹窗还原度验收。链路=FAB开列表 → $scope 直调 v-model 处理器注入搜索词
 *   （uni-app x 产物 el.trigger('input') 不生效的既定绕法）→ wechatide 坐标点首行 → AddFood 截图
 *   → 点蒙层关闭（兼验蒙层 bug 修复）。目标四例：奶茶(甜度电量)/米饭(碗三档)/苹果(步进器)/火锅(砝码多颗)
 * 2026-09-21 Qoder (Claude)：散弹式直调会误触 tab 切换处理器（截图跑到 Profile 页）——
 *   收紧为只调函数源码含 detail.value 的输入类处理器，并打印页面路径校验。]
 */
const automator = require('miniprogram-automator')
const DIR = '.workbuddy/shots/audit/'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

function shot(name) {
  return DIR + name + '.png'
}

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  const word = process.argv[2] || '奶茶'
  const tag = process.argv[3] || 'x'

  await mp.evaluate(() => {
    wx.reLaunch({ url: '/pages/home/Home' })
  })
  await wait(2500)
  const page = await mp.currentPage()
  console.log('PAGE=' + page.path)
  await (await page.$('.fab')).tap()
  await wait(900)

  // 直调 FoodPicker 搜索框的 v-model 处理器（混淆键：data 里指向方法名的字符串值）
  // 只调源码含 detail 的输入类处理器，避免误触 tab 切换等其他处理器
  const injected = await mp.evaluate((txt) => {
    const p = getCurrentPages()[0]
    const hits = []
    function walk(c, path, depth) {
      if (c == null || depth > 4) return
      try {
        const sc = c.$scope != null ? c.$scope : c
        const d = sc != null ? sc.data : null
        if (d != null) {
          for (const k in d) {
            const v = d[k]
            if (typeof v === 'string' && v.length > 0 && v.length <= 10 && typeof sc[v] === 'function' && sc[v].toString().indexOf('detail') >= 0) {
              try {
                sc[v]({ detail: { value: txt } })
                hits.push(path + '.' + k + '->' + v)
              } catch (e) {}
            }
          }
        }
      } catch (e) {}
      const kids = (c.$scope != null && c.$scope.$children) || c.$children || []
      for (let i = 0; i < kids.length; i++) walk(kids[i], path + '/' + i, depth + 1)
    }
    walk(p.$vm, 'page', 0)
    return hits.join(' , ')
  }, word)
  console.log('INJECTED=' + injected)
  await wait(1200)
  await mp.screenshot({ path: shot('r10_' + tag + '_1_search') })

  await mp.disconnect()
  console.log('STEP1_DONE now coordinate-tap row0 (187,462) then reopen automator in step2')
})().catch((e) => {
  console.error('ERR=' + e.message)
  process.exit(1)
})
