const automator = require('miniprogram-automator');
const OUT = '../.workbuddy/shots/audit/';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// automator 对不存在的组件内节点做 page.$ 会让 devtools 推一条 error 事件，
// EventEmitter 无监听即抛「Uncaught [object Object]」→ 这里只做滚动+截图，并兜住意外事件
process.on('uncaughtException', (e) => console.log('UNCAUGHT(ignored)', JSON.stringify(e).slice(0, 120)));

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const url = process.argv[2];
  const tag = process.argv[3];

  await mp.evaluate((u) => wx.reLaunch({ url: u }), url);
  await wait(3000);

  for (const y of [0, 120, 300, 99999]) {
    await mp.evaluate((v) => wx.pageScrollTo({ scrollTop: v, duration: 0 }), y);
    await wait(1800);
    await mp.screenshot({ path: OUT + 'p2_' + tag + '_' + y + '.png' });
    console.log('shot', tag, y);
  }

  await mp.disconnect();
  console.log('DONE');
})();
