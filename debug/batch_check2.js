/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：batch_check v2——组件内节点 el.tap 不可靠（offset 回吐页根矩形），
 *   全部交互改走 $scope 数据侧处理器直调（bindtap 键→处理器名字符串→sc[name]()），
 *   页面级节点（.pill-edit/.fab/.consumed/.goal-pill-text）仍用真实 tap/text。
 *   覆盖：GoalModal 铅笔开/＋步进/保存回写/回显/恢复 + AddFood 确认落库（storage 前后对比后回滚）。]
 */
const automator = require('miniprogram-automator')
const DIR = 'D:/project/other-porject/kaluli/.workbuddy/shots/audit/'
const wait = (ms) => new Promise(r => setTimeout(r, ms))

async function childScope(mp, name) {
  return mp.evaluate((childName) => {
    const p = getCurrentPages()[0]
    const kids = (p.$vm && p.$vm.$children) || []
    for (const k of kids) {
      let nm = ''
      try { nm = (k.$ && k.$.type && (k.$.type.name || k.$.type.__name)) || '' } catch (e) {}
      if (nm !== childName) continue
      const sc = k.$scope
      const t = {}
      for (const key of Object.keys(sc.data)) {
        const v = sc.data[key]
        t[key] = typeof v === 'function' ? 'FN' : (typeof v === 'object' ? 'OBJ' : JSON.stringify(v).slice(0, 30))
      }
      return JSON.stringify(t)
    }
    return 'NO-CHILD'
  }, name)
}

async function callChild(mp, childName, dataKey, arg) {
  return mp.evaluate(({ cn, dk, a }) => {
    const p = getCurrentPages()[0]
    const kids = (p.$vm && p.$vm.$children) || []
    for (const k of kids) {
      let nm = ''
      try { nm = (k.$ && k.$.type && (k.$.type.name || k.$.type.__name)) || '' } catch (e) {}
      if (nm !== cn) continue
      const sc = k.$scope
      const fnName = sc.data[dk]
      if (typeof fnName !== 'string') return 'key-not-string:' + JSON.stringify(fnName)
      if (typeof sc[fnName] !== 'function') return 'no-fn:' + fnName
      sc[fnName](a || {})
      return 'called:' + fnName
    }
    return 'no-child'
  }, { cn: childName, dk: dataKey, a: arg })
}

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  await mp.evaluate(() => wx.restartMiniProgram({ path: '/pages/home/Home' }))
  await wait(6000)
  let page = await mp.currentPage()

  // ---- A. GoalModal：真实 tap 铅笔开弹窗 → 数据侧驱动 ＋/保存 ----
  await (await page.$('.pill-edit')).tap()
  await wait(900)
  const gmOpen = await childScope(mp, 'GoalModal')
  console.log('GM_OPEN=' + gmOpen)
  await mp.screenshot({ path: DIR + 'h1_goal_open.png' })

  console.log('PLUS=' + await callChild(mp, 'GoalModal', 'f'))
  await wait(500)
  const gmPlus = await childScope(mp, 'GoalModal')
  console.log('GM_PLUS=' + gmPlus)
  await mp.screenshot({ path: DIR + 'h2_goal_plus.png' })

  console.log('SAVE=' + await callChild(mp, 'GoalModal', 'q'))
  await wait(800)
  console.log('PILL_AFTER_SAVE=' + await (await page.$('.goal-pill-text')).text())
  const goalStor = await mp.evaluate(() => {
    const ks = wx.getStorageInfoSync().keys
    const out = {}
    for (const k of ks) if (/goal/i.test(k)) out[k] = JSON.stringify(wx.getStorageSync(k)).slice(0, 150)
    return JSON.stringify(out)
  })
  console.log('GOAL_STORAGE=' + goalStor)

  // 恢复 1800：重开 → minus(d) → save(q)
  await (await page.$('.pill-edit')).tap()
  await wait(800)
  await mp.screenshot({ path: DIR + 'h3_goal_reopen.png' })
  await callChild(mp, 'GoalModal', 'd')
  await wait(300)
  await callChild(mp, 'GoalModal', 'q')
  await wait(600)
  console.log('RESTORED_PILL=' + await (await page.$('.goal-pill-text')).text())

  // ---- B. AddFood 确认落库：FAB→FoodPicker(搜索+行选)→AddFood→confirm 处理器直调 ----
  const before = await mp.evaluate(() => wx.getStorageSync('ct_food_entries_v1'))
  await (await page.$('.fab')).tap()
  await wait(1000)
  const fnSrc = "function(){var p=getCurrentPages()[0];var kids=(p.$vm&&p.$vm.$children)||[]" +
    ";for(var i=0;i<kids.length;i++){var k=kids[i];try{" +
    "var nm=(k.$&&k.$.type&&(k.$.type.name||k.$.type.__name))||'';" +
    "if(nm!=='FoodPicker')continue;var sc=k.$scope;" +
    "if(!sc||typeof sc.e0_c2!=='function')continue;" +
    "sc.e0_c2({detail:{value:'奶茶'}});return 'called';}catch(e){}}" +
    "return 'not-found';}"
  console.log('SEARCH=' + await mp.evaluate(eval('(' + fnSrc + ')')))
  await wait(1000)
  const row = await mp.evaluate(function () {
    var p = getCurrentPages()[0]
    var kids = (p.$vm && p.$vm.$children) || []
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i]
      try {
        var nm = (k.$ && k.$.type && (k.$.type.name || k.$.type.__name)) || ''
        if (nm !== 'FoodPicker') continue
        var sc = k.$scope
        var r0 = sc.data.e[0]
        sc[r0.k]({ currentTarget: { id: r0.h, dataset: {} }, target: { id: r0.h, dataset: {} } })
        return 'invoked:' + r0.k
      } catch (err) { return 'err:' + err.message }
    }
    return 'not-found'
  })
  console.log('ROW=' + row)
  await wait(1400)
  await mp.screenshot({ path: DIR + 'h4_addfood.png' })
  const afDump = await childScope(mp, 'AddFood')
  console.log('AF_DUMP=' + afDump)

  const consumedBefore = await (await page.$('.consumed')).text()
  console.log('CONFIRM=' + await callChild(mp, 'AddFood', 't'))
  await wait(900)
  await mp.screenshot({ path: DIR + 'h5_settle.png' })
  const after = await mp.evaluate(() => wx.getStorageSync('ct_food_entries_v1'))
  const parse = (s) => { try { const v = typeof s === 'string' ? JSON.parse(s) : s; return Array.isArray(v) ? v.length : 0 } catch (e) { return -1 } }
  console.log('ENTRIES ' + parse(before) + ' -> ' + parse(after))
  await wait(2600)
  page = await mp.currentPage()
  console.log('CONSUMED ' + consumedBefore + ' => ' + await (await page.$('.consumed')).text())

  // 回滚：storage 还原 + 页面重启（seed 数据不受影响）
  await mp.evaluate((snap) => {
    if (snap) wx.setStorageSync('ct_food_entries_v1', snap)
    else wx.removeStorageSync('ct_food_entries_v1')
    return 'rolled'
  }, before)
  await mp.evaluate(() => wx.reLaunch({ url: '/pages/home/Home' }))
  await wait(2500)
  page = await mp.currentPage()
  console.log('ROLLBACK_CONSUMED=' + await (await page.$('.consumed')).text())
  console.log('DONE')
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })
