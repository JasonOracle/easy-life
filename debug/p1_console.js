const EE = require('events').EventEmitter;
const origEmit = EE.prototype.emit;
EE.prototype.emit = function (type, ...args) {
  if (type === 'error' && this.listenerCount('error') === 0) {
    console.log('SWALLOWED-ERROR-EVENT:', JSON.stringify(args).slice(0, 600));
    return false;
  }
  return origEmit.call(this, type, ...args);
};

const automator = require('miniprogram-automator');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  mp.on('console', (m) => {
    const t = m && m.messages ? m.messages.join(' ') : String(m);
    console.log('CONSOLE:', t.slice(0, 300));
  });
  mp.on('exception', (m) => console.log('EXCEPTION:', JSON.stringify(m).slice(0, 400)));

  const url = process.argv[2] || '/pages/home/Home';
  await mp.evaluate((u) => wx.reLaunch({ url: u }), url);
  await wait(5000);
  console.log('captured-done');
  await mp.disconnect();
})().catch((e) => console.error('ERR', String(e).slice(0, 200)));
