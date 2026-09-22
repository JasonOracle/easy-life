/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[search 模式参数化关键字（argv[3]，供苹果/火锅用例复用）；
 *   evaluate 只序列化函数源码，node 侧变量带不进小程序——关键字改为内联进源码字符串后 eval 构函数。]
 */
/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：奶茶用例验收——开 FoodPicker → 诊断 $children/$scope 输入处理器 →
 *   注入 keyword='奶茶' 过滤列表 → 坐标点首行开 AddFood → 截图。]
 */
const automator = require('miniprogram-automator')
const DIR = '.workbuddy/shots/audit/'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const MODE = process.argv[2] || 'probe'
const KW = process.argv[3] || '奶茶'

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  await mp.evaluate(() => wx.reLaunch({ url: '/pages/home/Home' }))
  await wait(2500)
  const page = await mp.currentPage()
  await (await page.$('.fab')).tap()
  await wait(900)

  if (MODE === 'probe') {
    const info = await mp.evaluate(() => {
      const p = getCurrentPages()[0]
      const kids = (p.$vm && p.$vm.$children) || []
      const out = []
      for (let i = 0; i < kids.length; i++) {
        const k = kids[i]
        let name = ''
        try { name = (k.$ && k.$.type && (k.$.type.name || k.$.type.__name)) || k.componentName || '' } catch (e) { name = 'ERR' }
        let hasC = false
        try { hasC = !!(k.$scope && k.$scope.data && typeof k.$scope.data.c === 'function') } catch (e) { hasC = false }
        let hasQuanbu = false
        try {
          const d = k.$scope && k.$scope.data
          if (d) { for (const key in d) { const v = d[key]; if (Array.isArray(v) && v.indexOf('全部') >= 0) hasQuanbu = true } }
        } catch (e) {}
        out.push(i + '|' + name + '|c=' + hasC + '|cats=' + hasQuanbu)
      }
      return out.join(' ;; ')
    })
    console.log('KIDS=' + info)
  } else if (MODE === 'search') {
    // evaluate 只序列化函数源码，node 侧变量不会带入——关键字必须内联进源码字符串
    const fnSrc = 'function(){var p=getCurrentPages()[0];var kids=(p.$vm&&p.$vm.$children)||[];' +
      'for(var i=0;i<kids.length;i++){var k=kids[i];try{' +
      "var nm=(k.$&&k.$.type&&(k.$.type.name||k.$.type.__name))||'';" +
      "if(nm!=='FoodPicker')continue;var sc=k.$scope;" +
      "if(!sc||typeof sc.e0_c2!=='function')continue;" +
      'sc.e0_c2({detail:{value:' + JSON.stringify(KW) + '}});' +
      "return 'called child#'+i;}catch(e){}}" +
      "return 'not-found';}"
    // eslint-disable-next-line no-eval
    const fn = eval('(' + fnSrc + ')')
    const res = await mp.evaluate(fn)
    console.log('SEARCH=' + res)
    await wait(900)
    await mp.screenshot({ path: DIR + 'r16_naicha_filtered.png' })
  }
  await mp.disconnect()
})().catch((e) => { console.error('ERR=' + e.message); process.exit(1) })
