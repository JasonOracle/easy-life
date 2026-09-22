/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：#29 玻璃态取证——逐档 pageScrollTo 截图，用 PIL 量「导航条带内、避开图标与文字的中区」最暗像素：
   不透明底时该值恒等于底色；半透＋模糊时深色内容（餐次标题绿字）穿过会被抬亮成雾影。
   本脚本只产出截图，量算交给 python 一次性跑]
 */
const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', String(e).slice(0, 200)); process.exit(1); });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const offs = [300, 330, 360, 390, 420, 450];

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  await mp.evaluate(new Function("wx.restartMiniProgram({path:'/pages/home/Home'});return 1"));
  await wait(7000);
  for (const y of offs) {
    await mp.evaluate(new Function('wx.pageScrollTo({scrollTop:' + y + ',duration:100});return 1'));
    await wait(900);
    await mp.screenshot({ path: 'shots/audit/sweep_' + y + '.png' });
    console.log('shot ' + y);
  }
  await mp.evaluate(new Function('wx.pageScrollTo({scrollTop:0,duration:100});return 1'));
  await mp.disconnect();
})().catch((e) => { console.error('FAIL', String(e).slice(0, 200)); process.exit(1); });
