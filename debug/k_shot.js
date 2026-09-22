const automator = require('miniprogram-automator');

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  await mp.evaluate(() => wx.reLaunch({ url: '/pages/settings/Settings' }));
  await new Promise(r => setTimeout(r, 3000));
  await mp.screenshot({ path: '../.workbuddy/shots/audit/k2_settings_header.png' });
  console.log('saved');
  await mp.disconnect();
})();
