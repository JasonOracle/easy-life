const automator = require('miniprogram-automator');
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  await mp.evaluate(() => { wx.restartMiniProgram({ path: '/pages/home/Home' }); return 1; }).catch((e) => console.log('E1', String(e).slice(0, 80)));
  console.log('restart issued');
  try { await mp.disconnect(); } catch (e) {}
})().catch((e) => console.error('FATAL', String(e).slice(0, 200)));
