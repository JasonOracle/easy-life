const automator = require('miniprogram-automator');
const fs = require('fs');
(async () => {
  const mini = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const page = await mini.currentPage();
  
  const rows = await page.$$('.row');
  console.log('Found', rows.length, '.row elements');
  
  // 第 3 个 row = 每日热量目标 (index 2)
  if (rows.length >= 3) {
    await rows[2].tap();
    console.log('TAPPED rows[2] = 每日热量目标');
  }
  
  await new Promise(r => setTimeout(r, 2000));
  
  const shot = await mini.screenshot();
  fs.writeFileSync('D:/project/other-porject/kaluli/debug/goalmodal_open.png', shot);
  console.log('SCREENSHOT saved');
  
  await mini.disconnect();
})().catch(e => console.error(e));
