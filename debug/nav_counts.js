/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：#28 幻影鉴别——数运行时 .hm-nav/.page 节点个数与标题 text 节点数，对照页高，判定整页重复渲染]
 */
const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', String(e).slice(0, 120)); process.exit(1); });
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const r = await mp.evaluate(function () {
    return new Promise((res) => {
      wx.createSelectorQuery().selectAll('.hm-nav').boundingClientRect(function (list) {
        const out = [];
        for (let i = 0; i < list.length; i++) {
          const b = list[i];
          out.push({ top: b.top, left: b.left, w: b.width, h: b.height });
        }
        res('hmNavCount=' + JSON.stringify(out));
      }).exec();
    });
  });
  console.log(r);
  const r2 = await mp.evaluate(function () {
    return new Promise((res) => {
      wx.createSelectorQuery().selectAll('.title').boundingClientRect(function (list) {
        const out = [];
        for (let i = 0; i < list.length; i++) out.push({ top: list[i].top, h: list[i].height });
        res('titleCount=' + list.length + ' ' + JSON.stringify(out));
      }).exec();
    });
  });
  console.log(r2);
  const r3 = await mp.evaluate(function () {
    return new Promise((res) => {
      wx.createSelectorQuery().selectAll('.hm-nav-inner').boundingClientRect(function (list) {
        res('navInnerCount=' + list.length);
      }).exec();
    });
  });
  console.log(r3);
  try { await mp.disconnect(); } catch (e) {}
  process.exit(0);
})().catch((e) => { console.error('ERR', String(e).slice(0, 150)); process.exit(1); });
