const automator = require('miniprogram-automator');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
process.on('uncaughtException', (e) => console.log('UNCAUGHT(ignored)', String(e).slice(0, 120)));
const probe = new Function(
  'return new Promise(function(res){' +
  'var q=wx.createSelectorQuery();' +
  'q.selectAll(".set-fx-back").boundingClientRect();' +
  'q.selectViewport().scrollOffset();' +
  'var p=getCurrentPages()[0];var vm=p.$vm||p;var sc=null;' +
  'try{sc=vm.scrolled;}catch(e){}' +
  'var ss=null;try{ss=vm.$.setupState.scrolled;}catch(e){}' +
  'q.exec(function(o){res(JSON.stringify({back:(o[0]||[]).map(function(x){return [Math.round(x.top),Math.round(x.height)];}),st:o[1]&&Math.round(o[1].scrollTop),sc:sc,ss:ss}));});});'
);
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  await mp.evaluate(new Function('wx.reLaunch({url:"/pages/settings/Settings"}); return 1;'));
  await wait(2800);
  console.log('S0', await mp.evaluate(probe).catch((e) => 'ERR ' + String(e).slice(0, 120)));
  await mp.evaluate(() => { wx.pageScrollTo({ scrollTop: 200, duration: 0 }); return 1; });
  await wait(1500);
  console.log('S200', await mp.evaluate(probe).catch((e) => 'ERR ' + String(e).slice(0, 120)));
  await mp.disconnect();
  console.log('DONE');
})().catch((e) => console.error('FATAL', String(e).slice(0, 200)));
