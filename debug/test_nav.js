const automator = require('miniprogram-automator');
const fs = require('fs');
(async () => {
  const mini = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });

  // 检查当前页面
  const page = await mini.currentPage();
  const info = await page.evaluate(() => {
    return {
      path: __wxConfig?.pages || [],
      current: getCurrentPages()?.map(p => p.route) || []
    };
  });
  console.log('Pages info:', JSON.stringify(info));

  // 直接跳转到设置页
  await page.evaluate(() => {
    uni.redirectTo({ url: '/pages/settings/Settings' });
  });
  console.log('REDIRECTED to Settings');
  await new Promise(r => setTimeout(r, 2000));

  // 截图
  const shot = await mini.screenshot();
  fs.writeFileSync('D:/project/other-porject/kaluli/debug/settings_direct.png', shot);
  console.log('SCREENSHOT saved');

  await mini.disconnect();
})().catch(e => console.error(e));
