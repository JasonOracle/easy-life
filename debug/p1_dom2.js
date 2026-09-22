const automator = require('miniprogram-automator');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
process.on('uncaughtException', (e) => console.log('UNCAUGHT(ignored)', String(e).slice(0, 120)));

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  await mp.evaluate(() => { wx.reLaunch({ url: '/pages/settings/Settings' }); return 1; });
  await wait(3000);
  const r = await mp.evaluate(() => {
    return new Promise((res) => {
      const q = wx.createSelectorQuery();
      q.selectAll('.hd-title').boundingClientRect();
      q.selectAll('.sec-first').boundingClientRect();
      q.selectAll('.card').boundingClientRect();
      q.select('.header').boundingClientRect();
      q.select('.page').boundingClientRect();
      q.selectViewport().scrollOffset();
      q.exec((out) => {
        res(JSON.stringify({
          hdTitle: (out[0] || []).map((o) => Math.round(o.top)),
          secFirst: (out[1] || []).map((o) => Math.round(o.top)),
          cards: (out[2] || []).length,
          header: out[3] && [Math.round(out[3].top), Math.round(out[3].height)],
          page: out[4] && [Math.round(out[4].top), Math.round(out[4].height)],
          scroll: out[5] && out[5].scrollTop,
        }));
      });
    });
  });
  console.log('SETTINGS DOM:', r);
  await mp.screenshot({ path: '../.workbuddy/shots/audit/p6_settings_domcheck.png' });
  console.log('shot saved');
  await mp.disconnect();
})().catch((e) => console.error('FATAL', String(e).slice(0, 200)));
