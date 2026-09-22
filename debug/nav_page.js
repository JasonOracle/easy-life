/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：#28 二级页验收——restartMiniProgram 到指定页（automator reLaunch 不稳，改用官方重启），
   先拍未滚动，再 pageScrollTo 跨阈拍常驻导航栏出现；同时读页面 data 键数与滚动状态]
 */
const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', String(e).slice(0, 160)); process.exit(1); });
const url = process.argv[2];
const tag = process.argv[3] || 'p';
const y = Number(process.argv[4] || 200);
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  await mp.evaluate(new Function("wx.restartMiniProgram({path:'" + url + "'});return 1"));
  await new Promise((r) => setTimeout(r, 7000));
  let page = await mp.currentPage();
  console.log('PAGE=' + (page ? page.path : '(null)'));
  await mp.screenshot({ path: 'shots/audit/' + tag + '_a_top.png' });
  try { await mp.evaluate(new Function('wx.pageScrollTo({scrollTop:' + y + ',duration:120});return 1')); }
  catch (e) { console.log('scroll!! ' + String(e).slice(0, 60)); }
  await new Promise((r) => setTimeout(r, 1800));
  await mp.screenshot({ path: 'shots/audit/' + tag + '_b_nav.png' });
  const st = await mp.evaluate(() => {
    const p = getCurrentPages()[0];
    const d = p.data || {};
    return JSON.stringify({ route: p.route, keys: Object.keys(d).length });
  });
  console.log(st);
  console.log('SHOT=' + tag + '_a_top.png , ' + tag + '_b_nav.png');
  try { await mp.disconnect(); } catch (e) {}
  process.exit(0);
})().catch((e) => { console.error('ERR', String(e).slice(0, 200)); process.exit(1); });
