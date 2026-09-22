/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：#28 常驻导航栏验收——Home 滚动后截图（验证 fixed 标题块常驻＋内容从其下滚过）]
 */
const automator = require('miniprogram-automator');
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const page = await mp.currentPage();
  await page.waitFor(2000);
  await mp.evaluate(function () { wx.pageScrollTo({ scrollTop: 300, duration: 0 }); });
  await page.waitFor(1200);
  const st = await page.scrollTop();
  console.log('home scrollTop=' + st);
  await mp.screenshot({ path: 'shots/audit/n2_home_scrolled.png' });
  try { await mp.disconnect(); } catch (e) {}
  process.exit(0);
})().catch((e) => { console.error('ERR', String(e).slice(0, 150)); process.exit(1); });
