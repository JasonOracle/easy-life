const automator = require('miniprogram-automator');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// 数据层核验：StickyTop 的 props（wxml 里 u-p="{{a}}"）随 onPageScroll 两态翻转
// 注意：automator evaluate 传参在本工程不稳定（拒绝/挂起），一律无参 + automator 自带 reLaunch
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const url = process.argv[2];
  const tag = process.argv[3];

  await mp.reLaunch({ url });
  await wait(3000);

  const read = () => mp.evaluate(() => {
    try {
      const p = getCurrentPages()[0];
      const sc = p.$vm && p.$vm.$scope;
      const d = sc ? sc.data : null;
      return JSON.stringify({ route: p.route, a: d ? d.a : null, b: d ? d.b : null });
    } catch (e) {
      return 'THREW:' + (e && e.message);
    }
  });

  console.log(tag, 'top   ', await read());
  await mp.evaluate(() => { wx.pageScrollTo({ scrollTop: 120, duration: 0 }); return 1; });
  await wait(1200);
  console.log(tag, 's120  ', await read());
  await mp.evaluate(() => { wx.pageScrollTo({ scrollTop: 0, duration: 0 }); return 1; });
  await wait(1200);
  console.log(tag, 'back0 ', await read());

  await mp.disconnect();
})().catch((e) => console.error('ERR', String(e).slice(0, 300)));
