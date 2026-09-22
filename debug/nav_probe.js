/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：#28 诊断——Home 滚动后量 .hm-nav 元素 rect，判定 fixed 是否生效]
 */
const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', String(e).slice(0, 120)); process.exit(1); });
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const page = await mp.currentPage();
  await page.waitFor(1500);
  await mp.evaluate(function () { wx.pageScrollTo({ scrollTop: 300, duration: 0 }); });
  await page.waitFor(1500);
  const el = await page.$('.page >>> .hm-nav');
  if (el == null) { console.log('hm-nav probe = null'); }
  else {
    const off = await el.offset();
    const size = await el.size();
    console.log('hm-nav offset top=' + off.top + ' left=' + off.left + ' size w=' + size.width + ' h=' + size.height);
  }
  const st = await mp.evaluate(function () { return new Promise((res) => { wx.createSelectorQuery().select('.hm-nav').boundingClientRect((r) => { res(JSON.stringify(r)); }).exec(); }); });
  console.log('selquery hm-nav rect=' + st);
  const st2 = await mp.evaluate(function () { return new Promise((res) => { wx.createSelectorQuery().select('.page').boundingClientRect((r) => { res(JSON.stringify(r)); }).exec(); }); });
  console.log('selquery page rect=' + st2);
  try { await mp.disconnect(); } catch (e) {}
  process.exit(0);
})().catch((e) => { console.error('ERR', String(e).slice(0, 150)); process.exit(1); });
