const automator = require('miniprogram-automator');
const fs = require('fs');
(async () => {
  const mini = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const page = await mini.currentPage();

  // 先点「我的」tab
  await page.$$('.tab-item').then(tabs => {
    if (tabs.length >= 2) return tabs[1].tap();
  });
  await new Promise(r => setTimeout(r, 800));

  // 点齿轮进设置
  await page.$('.gear-circle').then(el => el && el.tap());
  await new Promise(r => setTimeout(r, 1200));

  // 截图设置页
  const s1 = await mini.screenshot();
  fs.writeFileSync('D:/project/other-porject/kaluli/debug/settings_page.png', s1);
  console.log('settings_page OK');

  // 点「每日热量目标」行
  const page2 = await mini.currentPage();
  await page2.$$('.row').then(rows => {
    console.log('rows:', rows.length);
    if (rows.length > 0) return rows[0].tap();
  });
  await new Promise(r => setTimeout(r, 1500));

  const s2 = await mini.screenshot();
  fs.writeFileSync('D:/project/other-porject/kaluli/debug/goalmodal_open.png', s2);
  console.log('goalmodal_open OK');

  await mini.disconnect();
})().catch(e => console.error(e));
