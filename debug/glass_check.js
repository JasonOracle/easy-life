/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：#29 TabBar 液态玻璃验收——可选写 ct_settings_v1.darkMode（读-改-写，不动其余字段），
   restartMiniProgram 到指定页，未滚动拍一张（玻璃态在纯底色上的观感），滚动跨阈再拍一张（内容从玻璃下穿过的效果）]
 */
const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', String(e).slice(0, 200)); process.exit(1); });

const url = process.argv[2];
const tag = process.argv[3] || 'g';
const y = Number(process.argv[4] || 320);
const dark = process.argv[5]; // 'on' | 'off' | undefined=不动

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });

  if (dark === 'on' || dark === 'off') {
    const want = dark === 'on' ? 'true' : 'false';
    const r = await mp.evaluate(new Function(
      "var raw = wx.getStorageSync('ct_settings_v1');" +
      "var s = {};" +
      "try { s = JSON.parse(typeof raw === 'string' && raw.length > 2 ? raw : '{}'); } catch (e) { s = {}; }" +
      "s.darkMode = " + want + ";" +
      "wx.setStorageSync('ct_settings_v1', JSON.stringify(s));" +
      "return JSON.stringify(s);"
    ));
    console.log('SETTINGS=' + r);
  }

  await mp.evaluate(new Function("wx.restartMiniProgram({path:'" + url + "'});return 1"));
  await wait(7000);
  const page = await mp.currentPage();
  console.log('PAGE=' + (page ? page.path : '(null)'));

  await mp.screenshot({ path: 'shots/audit/' + tag + '_a.png' });

  await mp.evaluate(new Function('wx.pageScrollTo({scrollTop:' + y + ',duration:120});return 1'));
  await wait(1200);
  await mp.screenshot({ path: 'shots/audit/' + tag + '_b.png' });

  // 玻璃类是否真挂上（组件宿主节点 class 由页面 >>> 探针查）
  const cls = await mp.evaluate(new Function(
    "var ps = getCurrentPages(); var p = ps[ps.length-1];" +
    "var kids = p.$vm ? p.$vm.$children : [];" +
    "var names = [];" +
    "for (var i=0;i<kids.length;i++) { names.push((kids[i].$scope && kids[i].$scope.data && kids[i].$scope.data.h!==undefined) ? ('h=' + kids[i].$scope.data.h) : ''); }" +
    "return names.filter(function(x){return x.length;}).join('|') || '(no tabbar scope)';"
  ));
  console.log('TABBAR_GLASS_FLAG=' + cls);
  await mp.disconnect();
})().catch((e) => { console.error('FAIL', String(e).slice(0, 200)); process.exit(1); });
