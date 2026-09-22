const automator = require('miniprogram-automator');
const OUT = '../.workbuddy/shots/audit/';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
process.on('uncaughtException', (e) => console.log('UNCAUGHT(ignored)', String(e).slice(0, 120)));

const PAGES = [
  ['home', '/pages/home/Home', '.header', ''],
  ['profile', '/pages/profile/Profile', '.header', ''],
  ['settings', '/pages/settings/Settings', '.header', '.set-fx-back'],
  ['records', '/pages/records/Records', '.lr-header', '.rec-fx-back'],
  ['daydetail', '/pages/records/DayDetail', '.dd-header', '.dd-fx-back'],
];

const probe = (sel, selBack) => new Function(
  'var SB="' + selBack + '";' +
  'return new Promise(function(res){' +
  'var q=wx.createSelectorQuery();' +
  'q.selectAll("' + sel + '").boundingClientRect();' +
  'q.select(".page").boundingClientRect();' +
  'q.selectViewport().scrollOffset();' +
  'if(SB){q.selectAll(SB).boundingClientRect();}' +
  'q.exec(function(o){res(JSON.stringify({' +
  'hd:(o[0]||[]).map(function(r){return [Math.round(r.top),Math.round(r.height)];}),' +
  'page:o[1]&&[Math.round(o[1].top),Math.round(o[1].height)],' +
  'st:Math.round(o[2]?o[2].scrollTop:-1),' +
  'back:SB?((o[3]||[]).map(function(r){return [Math.round(r.top),Math.round(r.height)];})):"-"}));});});'
);

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });

  for (const [name, url, sel, back] of PAGES) {
    await mp.evaluate(new Function('wx.reLaunch({url:"' + url + '"}); return 1;'));
    await wait(2800);
    console.log(name, 'TOP', await mp.evaluate(probe(sel, back)).catch((e) => 'ERR ' + String(e).slice(0, 80)));
    await mp.screenshot({ path: OUT + 'p8_' + name + '_top.png' }).catch(() => {});

    await mp.evaluate(() => { wx.pageScrollTo({ scrollTop: 120, duration: 0 }); return 1; });
    await wait(1300);
    console.log(name, 'S120', await mp.evaluate(probe(sel, back)).catch((e) => 'ERR ' + String(e).slice(0, 80)));
    await mp.screenshot({ path: OUT + 'p8_' + name + '_120.png' }).catch(() => {});

    await mp.evaluate(() => { wx.pageScrollTo({ scrollTop: 99999, duration: 0 }); return 1; });
    await wait(1300);
    console.log(name, 'BOT', await mp.evaluate(probe(sel, back)).catch((e) => 'ERR ' + String(e).slice(0, 80)));
    await mp.screenshot({ path: OUT + 'p8_' + name + '_bottom.png' }).catch(() => {});
  }

  await mp.disconnect();
  console.log('ALL DONE');
})().catch((e) => console.error('FATAL', String(e).slice(0, 200)));
