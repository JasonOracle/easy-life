const automator = require('miniprogram-automator');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
process.on('uncaughtException', (e) => console.log('UNCAUGHT(ignored)', String(e).slice(0, 120)));

const probe = new Function(
  'return new Promise(function(res){' +
  'var q=wx.createSelectorQuery();' +
  'q.selectAll(".remain-label").boundingClientRect();' +
  'q.selectAll(".macro-card").boundingClientRect();' +
  'q.selectAll(".fab").boundingClientRect();' +
  'q.selectAll(".st-mask").boundingClientRect();' +
  'q.selectAll(".header").boundingClientRect();' +
  'q.select(".page").boundingClientRect();' +
  'q.selectViewport().scrollOffset();' +
  'q.exec(function(o){res(JSON.stringify({' +
  'remain:(o[0]||[]).map(function(r){return [Math.round(r.top),Math.round(r.height)];}),' +
  'macro:(o[1]||[]).map(function(r){return [Math.round(r.top),Math.round(r.height)];}),' +
  'fab:(o[2]||[]).map(function(r){return [Math.round(r.left),Math.round(r.top),Math.round(r.width)];}),' +
  'mask:(o[3]||[]).map(function(r){return [Math.round(r.top),Math.round(r.height)];}),' +
  'hd:(o[4]||[]).map(function(r){return [Math.round(r.top),Math.round(r.height)];}),' +
  'page:o[5]&&[Math.round(o[5].top),Math.round(o[5].height)],' +
  'st:Math.round(o[6]?o[6].scrollTop:-1)}));});});'
);

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  await mp.evaluate(new Function('wx.reLaunch({url:"/pages/home/Home"}); return 1;'));
  await wait(2800);
  console.log('TOP', await mp.evaluate(probe));
  await mp.evaluate(() => { wx.pageScrollTo({ scrollTop: 483, duration: 0 }); return 1; });
  await wait(1300);
  console.log('BOT', await mp.evaluate(probe));
  await mp.screenshot({ path: '../.workbuddy/shots/audit/p9_home_bot.png' }).catch(() => {});
  await mp.disconnect();
  console.log('DONE');
})().catch((e) => console.error('FATAL', String(e).slice(0, 200)));
