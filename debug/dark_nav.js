/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：#28 设置页暗色导航栏验收——tap 页面根节点 .toggle 切深色，滚动跨阈截图，再切回浅色恢复现场]
 */
const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', String(e).slice(0, 160)); process.exit(1); });
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const page = await mp.currentPage();
  console.log('PAGE=' + (page ? page.path : '(null)'));
  const el = await page.$('.toggle');
  if (!el) { console.log('NO .toggle'); process.exit(1); }
  await el.tap();
  await new Promise((r) => setTimeout(r, 1500));
  await mp.evaluate(new Function('wx.pageScrollTo({scrollTop:200,duration:120});return 1'));
  await new Promise((r) => setTimeout(r, 1500));
  await mp.screenshot({ path: 'shots/audit/set_c_dark_nav.png' });
  console.log('SHOT=set_c_dark_nav.png');
  await mp.evaluate(new Function('wx.pageScrollTo({scrollTop:0,duration:120});return 1'));
  await new Promise((r) => setTimeout(r, 800));
  const el2 = await mp.currentPage().then((p) => p.$('.toggle'));
  if (el2) { await el2.tap(); console.log('restored to light'); }
  await new Promise((r) => setTimeout(r, 1200));
  try { await mp.disconnect(); } catch (e) {}
  process.exit(0);
})().catch((e) => { console.error('ERR', String(e).slice(0, 200)); process.exit(1); });
