const automator = require('miniprogram-automator');
const OUT = '../.workbuddy/shots/audit/';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
process.on('uncaughtException', (e) => console.log('UNCAUGHT(ignored)', String(e).slice(0, 120)));

const PAGES = [
  ['home', '/pages/home/Home'],
  ['profile', '/pages/profile/Profile'],
  ['settings', '/pages/settings/Settings'],
  ['records', '/pages/records/Records'],
  ['daydetail', '/pages/records/DayDetail'],
];

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });

  for (const [name, url] of PAGES) {
    await mp.evaluate(new Function('wx.reLaunch({url:"' + url + '"}); return 1;'));
    await wait(2500);
    await mp.screenshot({ path: OUT + 'p5_' + name + '_top.png' });

    await mp.evaluate(() => { wx.pageScrollTo({ scrollTop: 120, duration: 0 }); return 1; });
    await wait(1200);
    await mp.screenshot({ path: OUT + 'p5_' + name + '_120.png' });

    await mp.evaluate(() => { wx.pageScrollTo({ scrollTop: 99999, duration: 0 }); return 1; });
    await wait(1200);
    await mp.screenshot({ path: OUT + 'p5_' + name + '_bottom.png' });
    console.log('done', name);
  }

  await mp.disconnect();
  console.log('ALL DONE');
})().catch((e) => console.error('FATAL', String(e).slice(0, 200)));
