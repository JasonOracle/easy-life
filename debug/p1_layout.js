const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => console.log('UNCAUGHT', JSON.stringify(e).slice(0, 120)));

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const r = await mp.evaluate(() => {
    return new Promise((res) => {
      const q = wx.createSelectorQuery();
      q.selectAll('.page > view, .page > text, .page > sticky-top').boundingClientRect();
      q.selectViewport().scrollOffset();
      q.exec((out) => {
        const list = (out[0] || []).map((o) => ({ c: String(o.className || o.id || '?').slice(0, 24), t: Math.round(o.top), h: Math.round(o.height) }));
        res(JSON.stringify({ list, scroll: out[1] && out[1].scrollTop }));
      });
    });
  });
  console.log(r);
  await mp.disconnect();
})().catch((e) => console.error('ERR', String(e).slice(0, 200)));
