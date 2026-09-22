// 直调 FoodPicker 的 clickoverlay 处理器，验证 emit→父级 show=false→容器离场链路
const automator = require('miniprogram-automator')
process.on('uncaughtException', e => { console.log('ASYNC_ERR', String(e && (e.message || JSON.stringify(e))).slice(0, 200)) })

async function main() {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  const r0 = await mp.evaluate(new Function(`
    var pages = getCurrentPages();
    var vm = pages[pages.length - 1].$vm;
    var names = [];
    function walk(cs) {
      for (var i = 0; i < cs.length; i++) {
        var c = cs[i];
        var t = c.$ && c.$.type ? c.$.type : null;
        var nm = t ? (t.name || t.__name || (t.options && t.options.name) || '?') : '?';
        names.push(nm);
        if (c.$children) walk(c.$children);
      }
    }
    walk(vm.$children || []);
    return names.join(',');
  `))
  console.log('names:', JSON.stringify(r0))
  const r = await mp.evaluate(new Function(`
    var pages = getCurrentPages();
    var vm = pages[pages.length - 1].$vm;
    var found = null, names = [];
    function walk(cs) {
      for (var i = 0; i < cs.length; i++) {
        var c = cs[i];
        var t = (c.$ && c.$.type) ? c.$.type : null; var nm = t ? (t.name || t.__name || (t.options && t.options.name) || '?') : '?';
        names.push(nm);
        if (nm === 'FoodPicker') found = c;
        if (c.$children) walk(c.$children);
      }
    }
    walk(vm.$children || []);
    if (found == null) return 'NOT_FOUND in [' + names.join(',') + ']';
    var sc = found ? found.$scope : null;
    if (sc == null) return JSON.stringify({ names: names });
    var key = null;
    // 找 data 中值为字符串且对应 handler 的键：直接列 data 键值供核对
    var dump = {};
    for (var k in sc.data) { if (typeof sc.data[k] === 'string' && sc.data[k].indexOf && String(sc.data[k]).length < 40) dump[k] = String(sc.data[k]); }
    return JSON.stringify({ i: sc.data['i'], dumpKeys: Object.keys(dump).slice(0, 20) });
  `))
  console.log('probe:', JSON.stringify(r))
  const r2 = await mp.evaluate(new Function(`
    var pages = getCurrentPages();
    var vm = pages[pages.length - 1].$vm;
    var found = null;
    function walk(cs) { for (var i = 0; i < cs.length; i++) { var c = cs[i]; var t = (c.$ && c.$.type) ? c.$.type : null; var nm = t ? (t.name || t.__name || (t.options && t.options.name) || '?') : '?'; if (nm === 'FoodPicker') found = c; if (c.$children) walk(c.$children); } }
    walk(vm.$children || []);
    if (found == null) return 'NOT_FOUND';
    var sc = found.$scope;
    var n = sc.data['i'];
    if (typeof sc[n] !== 'function') return 'HANDLER_MISS n=' + n;
    sc[n]({});
    return 'CALLED ' + n;
  `))
  console.log('call:', JSON.stringify(r2))
  await new Promise(rr => setTimeout(rr, 1200))
  const page = await mp.currentPage()
  let open = false
  try { const s = await page.$('.page >>> .fp-sheet'); open = s != null } catch (e) { console.log('probe_fail') }
  console.log('picker_open_after_direct_call=' + open)
  await mp.disconnect().catch(() => {})
}
main().catch(e => { console.log('ERR', String(e && (e.message || JSON.stringify(e))).slice(0, 200)); process.exit(1) })
