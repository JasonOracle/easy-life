/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：#28 诊断——查运行时是否存在新 bundle 独有节点（hm-nav/header/fab），判定 devtools 是否加载旧产物]
 */
const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', String(e).slice(0, 120)); process.exit(1); });
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const r = await mp.evaluate(function () {
    return new Promise((res) => {
      wx.createSelectorQuery().selectAll('.hm-nav').boundingClientRect(function (list) {
        const dump = [];
        for (let i = 0; i < (list || []).length; i++) dump.push(Math.round(list[i].top) + 'x' + Math.round(list[i].height));
        res('hm-nav=' + JSON.stringify(dump));
      }).exec();
    });
  });
  console.log(r);
  const r2 = await mp.evaluate(function () {
    return new Promise((res) => {
      wx.createSelectorQuery().selectAll('.title-row').boundingClientRect(function (list) {
        res('title-row(old bundle marker)=' + (list || []).length);
      }).exec();
    });
  });
  console.log(r2);
  try { await mp.disconnect(); } catch (e) {}
  process.exit(0);
})().catch((e) => { console.error('ERR', String(e).slice(0, 150)); process.exit(1); });
