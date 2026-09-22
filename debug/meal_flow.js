/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：分步截图流程 reLaunch→FAB→过滤→行处理器直调，每步留证，用于 AddFood 餐次卡验收。]
 */
const automator = require('miniprogram-automator')
const DIR = 'D:/project/other-porject/kaluli/.workbuddy/shots/audit/'
const wait = (ms) => new Promise(r => setTimeout(r, ms))

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  await mp.evaluate(() => wx.reLaunch({ url: '/pages/home/Home' }))
  await wait(2500)
  const page = await mp.currentPage()
  await (await page.$('.fab')).tap()
  await wait(1000)
  const fnSrc = "function(){var p=getCurrentPages()[0];var kids=(p.$vm&&p.$vm.$children)||[];" +
    "for(var i=0;i<kids.length;i++){var k=kids[i];try{" +
    "var nm=(k.$&&k.$.type&&(k.$.type.name||k.$.type.__name))||'';" +
    "if(nm!=='FoodPicker')continue;var sc=k.$scope;" +
    "if(!sc||typeof sc.e0_c2!=='function')continue;" +
    "sc.e0_c2({detail:{value:'奶茶'}});return 'called';}catch(e){}}" +
    "return 'not-found';}"
  console.log('SEARCH=' + await mp.evaluate(eval('(' + fnSrc + ')')))
  await wait(1000)
  await mp.screenshot({ path: DIR + 'f1_picker.png' })
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
        if (typeof sc[r0.k] !== 'function') return 'missing:' + r0.k;
        sc[r0.k]({ currentTarget: { id: r0.h, dataset: {} }, target: { id: r0.h, dataset: {} } });
        return 'invoked:' + r0.k;
      } catch(err){ return 'err:' + err.message; }
    }
    return 'not-found';
  })
  console.log('ROWCALL=' + called)
  await wait(1500)
  await mp.screenshot({ path: DIR + 'f2_addfood.png' })
  console.log('DONE')
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })
