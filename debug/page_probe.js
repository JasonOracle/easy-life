/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：#28 污染范围判定——restartMiniProgram 到指定页后截图并读若干文本节点，用于区分单页坏与全局坏]
 */
const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', String(e).slice(0, 120)); process.exit(1); });
const path = process.argv[2] || '/pages/profile/Profile';
const out = process.argv[3] || 'shots/audit/n6_probe.png';
const sels = (process.argv[4] || '.name,.streak-days').split(',');
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  await mp.evaluate(new Function("wx.restartMiniProgram({path:'" + path + "'});return 1"));
  await new Promise((r) => setTimeout(r, 6000));
  const page = await mp.currentPage();
  console.log('PAGE=' + (page ? page.path : '(null)'));
  for (const sel of sels) {
    try {
      const els = await page.$$(sel);
      const n = els ? els.length : 0;
      const texts = [];
      for (let i = 0; i < Math.min(n, 3); i++) { try { texts.push(await els[i].text()); } catch (e) { texts.push('ERR'); } }
      console.log(sel + ' n=' + n + ' texts=' + JSON.stringify(texts));
    } catch (e) { console.log(sel + ' !! ' + String(e).slice(0, 70)); }
  }
  await mp.screenshot({ path: out }).catch((e) => console.log('shot!! ' + String(e).slice(0, 60)));
  console.log('SHOT=' + out);
  try { await mp.disconnect(); } catch (e) {}
  process.exit(0);
})().catch((e) => { console.error('ERR', String(e).slice(0, 150)); process.exit(1); });
