// FoodPicker 开合状态验证：读 Home 页面 vm.pickerShow（DOM 探针在 page-container 场景不可靠）
// 用法：node p3_show.js [open|check]
const automator = require('miniprogram-automator')
process.on('uncaughtException', e => { console.log('ASYNC_ERR', String(e && (e.message || JSON.stringify(e))).slice(0, 200)) })

const stateFn = new Function(`
  var pages = getCurrentPages();
  var vm = pages[pages.length - 1].$vm;
  var out = {};
  function walk(cs) {
    for (var i = 0; i < cs.length; i++) {
      var c = cs[i];
      var t = (c.$ && c.$.type) ? c.$.type : null;
      var nm = t ? (t.name || t.__name || (t.options && t.options.name) || '?') : '?';
      if (c.$scope && c.$scope.data) out[nm] = { h: c.$scope.data['h'], a: c.$scope.data['a'] };
      if (c.$children) walk(c.$children);
    }
  }
  walk(vm.$children || []);
  return JSON.stringify(out);
`)

async function main() {
  const mode = process.argv[2] || 'check'
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  if (mode === 'open') {
    const page = await mp.currentPage()
    const fab = await page.$('.fab')
    if (fab == null) { console.log('NO_FAB'); return }
    await fab.tap()
    await new Promise(r => setTimeout(r, 1500))
  }
  console.log('state:', JSON.stringify(await mp.evaluate(stateFn)))
  process.exit(0)
}
main().catch(e => { console.log('ERR', String(e && (e.message || JSON.stringify(e))).slice(0, 200)); process.exit(1) })
