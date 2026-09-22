/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：#28 诊断——读运行时页面 setData 负载，判定绑定键错位的层级]
 */
const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', String(e).slice(0, 160)); process.exit(1); });
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const r = await mp.evaluate(() => {
    const p = getCurrentPages()[0];
    const d = p.data || {};
    const brief = {};
    Object.keys(d).forEach((k) => {
      const v = d[k];
      if (v === null || v === undefined) { brief[k] = String(v); return; }
      const t = typeof v;
      if (t === 'object') {
        if (Array.isArray(v)) brief[k] = 'Array(' + v.length + '):' + JSON.stringify(v).slice(0, 90);
        else brief[k] = 'Obj:' + Object.keys(v).slice(0, 8).join(',');
      } else brief[k] = t + ':' + String(v).slice(0, 60);
    });
    return JSON.stringify({ route: p.route, keys: brief });
  });
  console.log(r);
  try { await mp.disconnect(); } catch (e) {}
  process.exit(0);
})().catch((e) => { console.error('ERR', String(e).slice(0, 200)); process.exit(1); });
