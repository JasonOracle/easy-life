const automator = require('miniprogram-automator');

const PAGES = [
  ['home', '/pages/home/Home'],
  ['profile', '/pages/profile/Profile'],
  ['settings', '/pages/settings/Settings'],
  ['records', '/pages/records/Records'],
  ['daydetail', '/pages/records/DayDetail'],
];
const OUT = '../.workbuddy/shots/audit/';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });

  for (const [name, url] of PAGES) {
    await mp.evaluate((u) => wx.reLaunch({ url: u }), url);
    await wait(2500);

    // 顶部态
    await mp.screenshot({ path: OUT + 'p1_' + name + '_top.png' });

    // 120px 态
    await mp.evaluate(() => wx.pageScrollTo({ scrollTop: 120, duration: 0 }));
    await wait(900);
    const st1 = await mp.evaluate(() => {
      const p = getCurrentPages()[0];
      return { scroll: p.$vm ? p.$vm.scrolled : 'n/a' };
    }).catch((e) => ({ err: String(e) }));
    await mp.screenshot({ path: OUT + 'p1_' + name + '_120.png' });

    // 底部态
    await mp.evaluate(() => wx.pageScrollTo({ scrollTop: 99999, duration: 0 }));
    await wait(900);
    await mp.screenshot({ path: OUT + 'p1_' + name + '_bottom.png' });

    // 探针：遮罩与常驻返回钮是否挂上
    let probe = {};
    try {
      const page = await mp.currentPage();
      const mask = await page.$('.page >>> .st-mask');
      probe.mask = mask != null;
      if (mask != null) {
        const s = await mask.size();
        probe.maskSize = s.width + 'x' + s.height;
      }
    } catch (e) { probe.maskErr = String(e); }
    console.log(name, JSON.stringify(st1), JSON.stringify(probe));
  }

  await mp.disconnect();
  console.log('DONE');
})();
