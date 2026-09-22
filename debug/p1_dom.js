const automator = require('miniprogram-automator');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const r = await mp.evaluate(() => {
    return new Promise((res) => {
      const q = wx.createSelectorQuery();
      q.selectAll('.title').boundingClientRect();
      q.selectAll('.remain-label').boundingClientRect();
      q.select('.remain-num').boundingClientRect();
      q.exec((out) => {
        res(JSON.stringify({
          titles: (out[0] || []).map((o) => [Math.round(o.top), Math.round(o.height)]),
          remains: (out[1] || []).map((o) => [Math.round(o.top), Math.round(o.height)]),
          remainNum: out[2] && [Math.round(out[2].top), Math.round(out[2].height)],
        }));
      });
    });
  });
  console.log('DOM:', r);
  const data = await mp.evaluate(() => {
    const p = getCurrentPages()[0];
    const vm = p.$vm;
    return JSON.stringify({ path: p.route, keys: vm ? Object.keys(vm.$data || {}).slice(0, 12) : null });
  });
  console.log('VM:', data);
  await mp.disconnect();
})().catch((e) => console.error('ERR', String(e).slice(0, 300)));
