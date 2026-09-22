/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：#28 验收分步探针——每步独立 try/catch，量 .hm-nav/.hero/.macro-num 矩形与 .macro-num 文本]
 */
const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', String(e).slice(0, 120)); process.exit(1); });
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const step = async (label, fn) => {
    try { console.log(label + ' => ' + JSON.stringify(await fn())); }
    catch (e) { console.log(label + ' !! ' + String(e).slice(0, 90)); }
  };
  await step('relaunch', async () => { const p = await mp.reLaunch({ url: '/pages/home/Home' }); return p ? 'ok' : 'null'; });
  await new Promise((r) => setTimeout(r, 4000));
  for (const sel of ['.hm-nav', '.hero', '.macro-num', '.page']) {
    await step('rect ' + sel, async () => {
      return await mp.evaluate(new Function('return new Promise((res)=>{wx.createSelectorQuery().selectAll("' + sel + '").boundingClientRect(function(l){const o=[];for(let i=0;i<(l||[]).length;i++)o.push(Math.round(l[i].top)+"x"+Math.round(l[i].height));res(o);}).exec();})'));
    });
  }
  await step('texts .macro-num', async () => {
    const els = await mp.currentPage().then((p) => p.$$('.macro-num'));
    if (!els) return 'null';
    const out = [];
    for (let i = 0; i < els.length; i++) { try { out.push(await els[i].text()); } catch (e) { out.push('ERR'); } }
    return out;
  });
  await mp.screenshot({ path: 'shots/audit/n5_home_relaunch.png' }).catch((e) => console.log('shot!! ' + String(e).slice(0, 60)));
  try { await mp.disconnect(); } catch (e) {}
  process.exit(0);
})().catch((e) => { console.error('ERR', String(e).slice(0, 150)); process.exit(1); });
