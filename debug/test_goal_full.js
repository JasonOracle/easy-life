const automator = require('miniprogram-automator');
const fs = require('fs');
(async () => {
  const mini = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });

  // 1) 导航到设置页
  await mini.navigateTo('/pages/settings/Settings');
  console.log('1. NAVIGATED to Settings');
  await new Promise(r => setTimeout(r, 2000));

  // 2) 截图设置页
  let shot = await mini.screenshot();
  fs.writeFileSync('D:/project/other-porject/kaluli/debug/settings2.png', shot);
  console.log('2. settings2.png saved');

  // 3) 获取当前页面并点目标行
  const page = await mini.currentPage();
  const path = page ? page.path : '(null)';
  console.log('3. currentPage:', path);

  // 用 wxml 查找含「每日热量目标」的 row
  const allEls = await page.$$('.row');
  console.log('4. .row count:', allEls.length);

  // 逐个检查 row 的 innerHTML
  for (let i = 0; i < allEls.length; i++) {
    const elStr = allEls[i].toString();
    if (elStr.includes('每日热量目标') || elStr.includes('openGoal') || elStr.includes('goal')) {
      console.log('5. Found goal row at index', i);
      await allEls[i].tap();
      console.log('6. TAPPED goal row');
      break;
    }
  }

  await new Promise(r => setTimeout(r, 2000));

  // 7) 截图 GoalModal
  shot = await mini.screenshot();
  fs.writeFileSync('D:/project/other-porject/kaluli/debug/goalmodal2.png', shot);
  console.log('7. goalmodal2.png saved');

  await mini.disconnect();
})().catch(e => console.error(e));
