const automator = require('miniprogram-automator');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
process.on('uncaughtException', (e) => console.log('UNCAUGHT(ignored)', String(e).slice(0, 120)));

const probe = new Function(
  'return new Promise(function(res){' +
  'var q=wx.createSelectorQuery();' +
  'var sels=["tabbar","food-picker","add-food","settle-badge","goal-modal","sticky-top",".page",".meal-section-head"];' +
  'for(var i=0;i<sels.length;i++){q.selectAll(sels[i]).boundingClientRect();}' +
  'q.exec(function(o){var r={};for(var i=0;i<sels.length;i++){r[sels[i]]=(o[i]||[]).map(function(x){return [Math.round(x.top),Math.round(x.height)];});}' +
  'res(JSON.stringify(r));});});'
);

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  await mp.evaluate(new Function('wx.reLaunch({url:"/pages/home/Home"}); return 1;'));
  await wait(2800);
  console.log('HOSTS', await mp.evaluate(probe).catch((e) => 'ERR ' + String(e).slice(0, 120)));
  await mp.disconnect();
  console.log('DONE');
})().catch((e) => console.error('FATAL', String(e).slice(0, 200)));
