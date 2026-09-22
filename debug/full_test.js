const automator = require('miniprogram-automator');
const fs = require('fs');
(async () => {
  const mini = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const page = await mini.currentPage();

  // 1) 点击「我的」tab (第 2 个 tab-item)
  const tabs = await page.$$('.tab-item');
  console.log('tabs:', tabs.length);
  if (tabs.length >= 2) {
    await tabs[1].tap();
    console.log('1. TAPPED 我的');
  }
  await new Promise(r => setTimeout(r, 1200));

  // 2) 截图确认在 Profile 页
  let shot = await mini.screenshot();
  fs.writeFileSync('D:/project/other-porject/kaluli/debug/step2_profile.png', shot);
  console.log('2. step2_profile.png');

  // 3) 点击齿轮
  const page2 = await mini.currentPage();
  const gear = await page2.$('.gear-circle');
  if (gear) {
    await gear.tap();
    console.log('3. TAPPED gear');
  } else {
    console.log('3. gear-circle NOT FOUND');
  }
  await new Promise(r => setTimeout(r, 1500));

  // 4) 截图确认在 Settings 页
  shot = await mini.screenshot();
  fs.writeFileSync('D:/project/other-porject/kaluli/debug/step4_settings.png', shot);
  console.log('4. step4_settings.png');

  // 5) 点击每日热量目标行 (第 3 个 .row)
  const page3 = await mini.currentPage();
  const rows = await page3.$$('.row');
  console.log('5. rows:', rows.length);
  if (rows.length >= 3) {
    await rows[2].tap();
    console.log('5. TAPPED rows[2]');
  }
  await new Promise(r => setTimeout(r, 2000));

  // 6) 截图 GoalModal
  shot = await mini.screenshot();
  fs.writeFileSync('D:/project/other-porject/kaluli/debug/step6_goalmodal.png', shot);
  console.log('6. step6_goalmodal.png');

  await mini.disconnect();
})().catch(e => console.error(e));
