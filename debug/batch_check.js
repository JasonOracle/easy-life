/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：GoalModal 重建验收（Pill 铅笔开弹窗/＋钮步进/保存回写/再开回显）＋
 *   AddFood 确认落库验收（storage 快照前后对比，验证后回滚不污染数据）＋餐次卡无时间行截图。]
 */
const automator = require('miniprogram-automator')
const DIR = 'D:/project/other-porject/kaluli/.workbuddy/shots/audit/'
const wait = (ms) => new Promise(r => setTimeout(r, ms))

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  await mp.evaluate(() => wx.restartMiniProgram({ path: '/pages/home/Home' }))
  await wait(6000)
  let page = await mp.currentPage()

  // ---- A. GoalModal：Pill 铅笔 → 弹窗 → ＋步进 → 保存 → 回显 ----
  const pill = await page.$('.pill-edit')
  console.log('PILL=' + (pill ? 'found' : 'MISSING'))
  await pill.tap()
  await wait(800)
  await mp.screenshot({ path: DIR + 'g1_goal_open.png' })
  const plus = await page.$('.page >>> .gm-stepbtn-r')
  console.log('PLUS=' + (plus ? 'found' : 'MISSING'))
  await plus.tap()
  await wait(400)
  await mp.screenshot({ path: DIR + 'g2_goal_1900.png' })
  const save = await page.$('.page >>> .gm-save')
  await save.tap()
  await wait(600)
  const pillText = await (await page.$('.goal-pill-text')).text()
  console.log('AFTER_SAVE_PILL=' + pillText)
  // 再开回显 1900，然后步进回 1800 恢复原目标
  await (await page.$('.pill-edit')).tap()
  await wait(800)
  await mp.screenshot({ path: DIR + 'g3_goal_reopen.png' })
  await (await page.$('.page >>> .gm-stepbtn')).tap()
  await wait(300)
  await (await page.$('.page >>> .gm-save')).tap()
  await wait(500)
  console.log('RESTORED_PILL=' + await (await page.$('.goal-pill-text')).text())

  // ---- B. AddFood 确认落库（storage 快照→验证→回滚） ----
  const before = await mp.evaluate(() => wx.getStorageSync('ct_food_entries_v1'))
  await (await page.$('.fab')).tap()
  await wait(900)
  const fnSrc = "function(){var p=getCurrentPages()[0];var kids=(p.$vm&&p.$vm.$children)||[];" +
    "for(var i=0;i<kids.length;i++){var k=kids[i];try{" +
    "var nm=(k.$&&k.$.type&&(k.$.type.name||k.$.type.__name))||'';" +
    "if(nm!=='FoodPicker')continue;var sc=k.$scope;" +
    "if(!sc||typeof sc.e0_c2!=='function')continue;" +
    "sc.e0_c2({detail:{value:'奶茶'}});return 'called';}catch(e){}}" +
    "return 'not-found';}"
  await mp.evaluate(eval('(' + fnSrc + ')'))
  await wait(900)
  const called = await mp.evaluate(function(){
    var p = getCurrentPages()[0];
    var kids = (p.$vm && p.$vm.$children) || [];
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i];
      try {
        var nm = (k.$ && k.$.type && (k.$.type.name || k.$.type.__name)) || '';
        if (nm !== 'FoodPicker') continue;
        var sc = k.$scope;
        var r0 = sc.data.e[0];
        sc[r0.k]({ currentTarget: { id: r0.h, dataset: {} }, target: { id: r0.h, dataset: {} } });
        return 'invoked:' + r0.k;
      } catch(err){ return 'err:' + err.message; }
    }
    return 'not-found';
  })
  console.log('ROWCALL=' + called)
  await wait(1200)
  await mp.screenshot({ path: DIR + 'g4_meal_notimerow.png' })
  const consumedBefore = await (await page.$('.consumed')).text()
  await (await page.$('.page >>> .confirm-btn')).tap()
  await wait(900)
  await mp.screenshot({ path: DIR + 'g5_settle.png' })
  const after = await mp.evaluate(() => wx.getStorageSync('ct_food_entries_v1'))
  const nB = before ? JSON.parse(before).length : 0
  const nA = after ? JSON.parse(after).length : 0
  console.log('ENTRIES ' + nB + ' -> ' + nA)
  // 等结算徽章自动关（2380ms）后回滚 storage 并重启，不污染演示数据
  await wait(2600)
  page = await mp.currentPage()
  const consumedAfter = await (await page.$('.consumed')).text()
  console.log('CONSUMED ' + consumedBefore + ' => ' + consumedAfter)
  await mp.evaluate((snap) => {
    if (snap) wx.setStorageSync('ct_food_entries_v1', snap)
    else wx.removeStorageSync('ct_food_entries_v1')
    return 'rolled'
  }, before)
  await mp.evaluate(() => wx.reLaunch({ url: '/pages/home/Home' }))
  await wait(2500)
  page = await mp.currentPage()
  console.log('CONSUMED_ROLLBACK=' + await (await page.$('.consumed')).text())
  console.log('DONE')
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })
