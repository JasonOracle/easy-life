const automator = require('miniprogram-automator');
const fs = require('fs');
(async () => {
  const mini = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const page = await mini.currentPage();

  // 1) 点击「我的」tab
  const tabItems = await page.$$('.tab-item');
  if (tabItems.length >= 2) {
    await tabItems[1].tap();
    console.log('1. TAPPED 我的 tab');
    await new Promise(r => setTimeout(r, 1200));
  }

  // 2) 点击齿轮图标进入设置
  const gearEl = await page.$('.gear-circle');
  if (gearEl) {
    await gearEl.tap();
    console.log('2. TAPPED gear-circle');
    await new Promise(r => setTimeout(r, 1200));
  }

  // 3) 截图看设置页
  const shot1 = await mini.screenshot();
  fs.writeFileSync('D:/project/other-porject/kaluli/debug/settings_page.png', shot1);
  console.log('3. SCREENSHOT settings_page saved');

  // 4) 点击「每日目标」行
  const goalEl = await page.$('.goal-row');
  if (goalEl) {
    await goalEl.tap();
    console.log('4. TAPPED goal-row');
  } else {
    // fallback: 按坐标
    await page.tap({ x: 200, y: 280 });
    console.log('4. TAPPED by coord');
  }
  await new Promise(r => setTimeout(r, 1500));

  // 5) 截图看 GoalModal
  const shot2 = await mini.screenshot();
  fs.writeFileSync('D:/project/other-porject/kaluli/debug/goalmodal_open.png', shot2);
  console.log('5. SCREENSHOT goalmodal_open saved');

  await mini.disconnect();
})().catch(e => console.error(e));
