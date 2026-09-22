/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：浅色态材质改动后的暗态回归——进设置页开深色 → 重启到个人中心截胶囊条带 → 回设置页关掉还原现场
   （浅色气泡描边/投影走 .tb-bub-light 单类且只在非暗态挂，此脚本用于证明暗态确实未被动到）]
 */
const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', String(e).slice(0, 160)); process.exit(1); });
async function go(mp, url, wait) {
  await mp.evaluate(new Function("wx.restartMiniProgram({path:'" + url + "'});return 1"));
  await new Promise((r) => setTimeout(r, wait));
}
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  await go(mp, '/pages/settings/Settings', 6000);
  let el = await (await mp.currentPage()).$('.toggle');
  if (!el) { console.log('NO .toggle'); process.exit(1); }
  await el.tap();
  await new Promise((r) => setTimeout(r, 1500));
  await go(mp, '/pages/profile/Profile', 6000);
  await mp.screenshot({ path: 'debug/shots/f_prof_dark.png' });
  console.log('SHOT=f_prof_dark.png PAGE=' + (await mp.currentPage()).path);
  await go(mp, '/pages/settings/Settings', 6000);
  el = await (await mp.currentPage()).$('.toggle');
  if (el) { await el.tap(); console.log('darkMode 已还原 false'); }
  await new Promise((r) => setTimeout(r, 1200));
  await go(mp, '/pages/home/Home', 5000);
  try { await mp.disconnect(); } catch (e) {}
  process.exit(0);
})().catch((e) => { console.error('ERR', String(e).slice(0, 200)); process.exit(1); });
