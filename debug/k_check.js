const automator = require('miniprogram-automator');

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  try {
    await mp.evaluate(() => wx.restartMiniProgram({ path: '/pages/settings/Settings' }));
  } catch (e) {
    console.log('restart err', e.message);
  }
  await new Promise(r => setTimeout(r, 3500));
  try {
    await mp.evaluate(() => wx.reLaunch({ url: '/pages/settings/Settings' }));
  } catch (e) {}
  await new Promise(r => setTimeout(r, 2500));
  await mp.screenshot({ path: '../.workbuddy/shots/audit/k1_settings_header.png' });
  console.log('screenshot saved');
  await mp.disconnect();
})();
