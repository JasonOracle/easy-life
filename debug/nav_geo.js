/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：#28 验收——reLaunch Home 后量 hm-nav/hero/macro-num 矩形并截图，判定常驻栏几何与数据绑定]
 */
const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', String(e).slice(0, 120)); process.exit(1); });
const q = function (mp, sel) {
  return mp.evaluate(new Function('return new Promise((res)=>{wx.createSelectorQuery().selectAll("' + sel + '").boundingClientRect(function(l){const o=[];for(let i=0;i<(l||[]).length;i++)o.push(Math.round(l[i].top)+"x"+Math.round(l[i].height));res(sel+"="+JSON.stringify(o));}).exec();})'));
};
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  await mp.reLaunch({ url: '/pages/home/Home' });
  const page = await mp.currentPage();
  await page.waitFor(4000);
  console.log(await q(mp, '.hm-nav'));
  console.log(await q(mp, '.hero'));
  console.log(await q(mp, '.macro-num'));
  console.log(await q(mp, '.page'));
  const els = await page.$$('.macro-num');
  console.log('macro-num count=' + (els ? els.length : 0));
  if (els) {
    for (let i = 0; i < els.length; i++) {
      console.log('macro-num[' + i + '] text=' + JSON.stringify(await els[i].text()));
    }
  }
  const t = await page.$('.title');
  console.log('title text=' + (t ? JSON.stringify(await t.text()) : 'null'));
  await mp.screenshot({ path: 'shots/audit/n5_home_relaunch.png' });
  try { await mp.disconnect(); } catch (e) {}
  process.exit(0);
})().catch((e) => { console.error('ERR', String(e).slice(0, 150)); process.exit(1); });
