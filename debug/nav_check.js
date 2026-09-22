/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：#28 验收脚本——滚到指定偏移后截图，并读常驻导航栏/遮罩节点的渲染状态]
 */
const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', String(e).slice(0, 160)); process.exit(1); });
const y = Number(process.argv[2] || 300);
const out = process.argv[3] || 'shots/audit/nav_check.png';
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  await mp.evaluate(new Function('wx.pageScrollTo({scrollTop:' + y + ',duration:120});return 1'));
  await new Promise((r) => setTimeout(r, 1500));
  const page = await mp.currentPage();
  console.log('PAGE=' + (page ? page.path : '(null)') + ' scrollTop=' + y);
  const info = await mp.evaluate(() => {
    const p = getCurrentPages()[0];
    const d = p.data || {};
    const nav = ['a', 'b', 'c', 'd', 'e', 'f', 'm'].map((k) => k + '=' + String(d[k])).join(' ');
    return JSON.stringify({ route: p.route, scrollTop: p.__scrolltop__ === undefined ? 'n/a' : p.__scrolltop__, nav: nav });
  });
  console.log(info);
  await mp.screenshot({ path: out });
  console.log('SHOT=' + out);
  try { await mp.disconnect(); } catch (e) {}
  process.exit(0);
})().catch((e) => { console.error('ERR', String(e).slice(0, 200)); process.exit(1); });
