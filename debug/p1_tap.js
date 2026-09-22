const automator = require('miniprogram-automator');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
process.on('uncaughtException', (e) => console.log('UNCAUGHT(ignored)', String(e).slice(0, 120)));
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  await mp.evaluate(new Function('wx.reLaunch({url:"/pages/home/Home"}); return 1;'));
  await wait(2500);
  await mp.evaluate(new Function('wx.navigateTo({url:"/pages/settings/Settings"}); return 1;'));
  await wait(2500);
  await mp.evaluate(() => { wx.pageScrollTo({ scrollTop: 60, duration: 0 }); return 1; });
  await wait(1200);
  const page = await mp.currentPage();
  const el = await page.$('.set-fx-back');
  console.log('el found:', !!el);
  if (el) { await el.tap(); await wait(1500); }
  const cur = await mp.currentPage();
  console.log('after tap path:', cur && cur.path);
  await mp.disconnect();
  console.log('DONE');
})().catch((e) => console.error('FATAL', String(e).slice(0, 200)));
