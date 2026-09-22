const automator = require('miniprogram-automator');
(async () => {
  const mini = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const page = await mini.currentPage();

  // 点击「我的」tab
  const tabs = await page.$$('.tab-item');
  for (const tab of tabs) {
    const wxml = await tab.toString();
    if (wxml.includes('我的')) {
      await tab.tap();
      console.log('TAPPED 我的 tab');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // 截图看当前页
  const fs = require('fs');
  const shotResult = await mini.screenshot();
  fs.writeFileSync('D:/project/other-porject/kaluli/debug/tap_settings.png', shotResult);
  console.log('SCREENSHOT saved');

  await mini.disconnect();
})().catch(e => console.error(e));
