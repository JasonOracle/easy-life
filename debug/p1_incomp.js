const automator = require('miniprogram-automator');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
process.on('uncaughtException', (e) => console.log('UNCAUGHT(ignored)', String(e).slice(0, 120)));

const probe = new Function(
  'var p=getCurrentPages()[0];' +
  'var names=["tabbar","food-picker","add-food","settle-badge","goal-modal","sticky-top"];' +
  'var out={};var done=0;' +
  'return new Promise(function(res){' +
  'if(names.length===0){res("{}");}' +
  'names.forEach(function(nm){' +
  'var c=null;try{c=p.selectComponent(nm);}catch(e){}' +
  'if(!c){out[nm]="no-comp";done++;if(done===names.length)res(JSON.stringify(out));return;}' +
  'var q=wx.createSelectorQuery().in(c);' +
  'q.select(".remain-label").boundingClientRect();' +
  'q.select(".header").boundingClientRect();' +
  'q.exec(function(o){' +
  'out[nm]={remain:o[0]?[Math.round(o[0].top),Math.round(o[0].height)]:null,header:o[1]?[Math.round(o[1].top),Math.round(o[1].height)]:null};' +
  'done++;if(done===names.length)res(JSON.stringify(out));});' +
  '});});'
);

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  await mp.evaluate(new Function('wx.reLaunch({url:"/pages/home/Home"}); return 1;'));
  await wait(2800);
  console.log('IN-COMP', await mp.evaluate(probe).catch((e) => 'ERR ' + String(e).slice(0, 150)));
  await mp.disconnect();
  console.log('DONE');
})().catch((e) => console.error('FATAL', String(e).slice(0, 200)));
