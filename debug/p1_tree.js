const automator = require('miniprogram-automator');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
process.on('uncaughtException', (e) => console.log('UNCAUGHT(ignored)', String(e).slice(0, 120)));

const probe = new Function(
  'var ns=document.querySelectorAll(".remain-label");' +
  'var out=[];' +
  'for(var i=0;i<ns.length;i++){' +
  'var chain=[];var n=ns[i];' +
  'for(var k=0;k<8&&n;k++){chain.push(n.tagName+"."+(n.className&&n.className.baseVal!==undefined?n.className.baseVal:n.className));n=n.parentElement;}' +
  'var r=ns[i].getBoundingClientRect();' +
  'out.push({top:Math.round(r.top),chain:chain});}' +
  'var pages=document.querySelectorAll(".page");' +
  'return JSON.stringify({count:ns.length,pageCount:pages.length,out:out});'
);

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  await mp.evaluate(new Function('wx.reLaunch({url:"/pages/home/Home"}); return 1;'));
  await wait(2800);
  console.log('TREE', await mp.evaluate(probe).catch((e) => 'ERR ' + String(e).slice(0, 120)));
  await mp.disconnect();
  console.log('DONE');
})().catch((e) => console.error('FATAL', String(e).slice(0, 200)));
