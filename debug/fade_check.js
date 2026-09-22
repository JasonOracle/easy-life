/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：#29 续「scroll-fade TabBar」验收——同页在 scrollTop 0/30/150 三档各截一图，
   并从子组件 $scope.data 里读出 Tabbar 的内联 style 串（键 l），直接核验底 alpha／blur 是否随滚动线性抬升;
   2. 第 4 个参数可选 on/off＝按 glass_check.js 同一套读-改-写 ct_settings_v1.darkMode（验暗态渐显）]
 */
const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', String(e).slice(0, 200)); process.exit(1); });

const url = process.argv[2];
const tag = process.argv[3] || 'fade';
const stops = [0, 30, 150];
const dark = process.argv[4]; // 'on' | 'off' | undefined=不动（同 glass_check.js 约定）

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });

  if (dark === 'on' || dark === 'off') {
    const want = dark === 'on' ? 'true' : 'false';
    await mp.evaluate(new Function(
      "var raw = wx.getStorageSync('ct_settings_v1');" +
      "var s = {};" +
      "try { s = JSON.parse(typeof raw === 'string' && raw.length > 2 ? raw : '{}'); } catch (e) { s = {}; }" +
      "s.darkMode = " + want + ";" +
      "wx.setStorageSync('ct_settings_v1', JSON.stringify(s));" +
      "return 1;"
    ));
  }
  await mp.evaluate(new Function("wx.restartMiniProgram({path:'" + url + "'});return 1"));
  await wait(7000);
  const page = await mp.currentPage();
  console.log('PAGE=' + (page ? page.path : '(null)'));

  for (const y of stops) {
    await mp.evaluate(new Function('wx.pageScrollTo({scrollTop:' + y + ',duration:120});return 1'));
    await wait(1400);
    await mp.screenshot({ path: 'shots/audit/' + tag + '_' + y + '.png' });
    const style = await mp.evaluate(new Function(
      "var ps = getCurrentPages(); var p = ps[ps.length-1];" +
      "var kids = p.$vm ? p.$vm.$children : [];" +
      "for (var i=0;i<kids.length;i++) {" +
      "  var d = kids[i].$scope && kids[i].$scope.data;" +
      "  if (d && typeof d.l === 'string' && d.l.indexOf('backdrop-filter') >= 0) { return d.l; }" +
      "}" +
      "for (var j=0;j<kids.length;j++) {" +
      "  var e = kids[j].$scope && kids[j].$scope.data;" +
      "  if (e && typeof e.l === 'string' && e.l.length > 0) { return 'NBLUR|' + e.l; }" +
      "}" +
      "return '(tabbar style key not found)';"
    ));
    console.log('scrollTop=' + y + '  STYLE=' + style);
  }
  await mp.disconnect();
})().catch((e) => { console.error('FAIL', String(e).slice(0, 200)); process.exit(1); });
