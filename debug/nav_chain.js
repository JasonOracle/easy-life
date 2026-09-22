/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：#28 诊断——读运行时 .title 祖先链的 class 实际值与 computed position，判定 hm-nav 类名/样式落地情况]
 */
const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', String(e).slice(0, 120)); process.exit(1); });
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const r = await mp.evaluate(function () {
    return new Promise((res) => {
      wx.createSelectorQuery().select('.title').fields({ node: true }, function (n) {
        if (n == null || n.node == null) { res('title node null'); return; }
        let el = n.node;
        const chain = [];
        let cur = el;
        for (let i = 0; i < 6 && cur != null; i++) {
          const cs = (typeof getComputedStyle === 'function') ? getComputedStyle(cur) : null;
          chain.push({
            tag: cur.tagName || cur.nodeName,
            cls: String(cur.className || ''),
            pos: cs ? cs.position : '?',
          });
          cur = cur.parentElement || (cur.parentNode && cur.parentNode.host) || null;
        }
        res(JSON.stringify(chain));
      }).exec();
    });
  });
  console.log('ancestor-chain=' + r);
  try { await mp.disconnect(); } catch (e) {}
  process.exit(0);
})().catch((e) => { console.error('ERR', String(e).slice(0, 150)); process.exit(1); });
