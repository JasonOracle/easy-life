/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：浅色态材质定稿验收——逐 Tab 页重启后截「首屏」与「滚到底」两帧（后者让内容穿到玻璃胶囊下，
   验证 60% 胶囊底 ＋ 气泡描边/投影是否真的把选中气泡雕出来）。evaluate 一律无参，页面路径写死在字面量数组]
 */
const automator = require('miniprogram-automator');
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', String(e).slice(0, 160)); process.exit(1); });
const PAGES = ['/pages/home/Home', '/pages/records/Records', '/pages/profile/Profile'];
const TAGS = ['f_home', 'f_rec', 'f_prof'];
(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  for (let i = 0; i < PAGES.length; i++) {
    const url = PAGES[i];
    const tag = TAGS[i];
    await mp.evaluate(new Function("wx.restartMiniProgram({path:'" + url + "'});return 1"));
    await new Promise((r) => setTimeout(r, 6000));
    const page = await mp.currentPage();
    await mp.screenshot({ path: 'debug/shots/' + tag + '_a_top.png' });
    await mp.evaluate(new Function('wx.pageScrollTo({scrollTop:400,duration:120});return 1'));
    await new Promise((r) => setTimeout(r, 1600));
    await mp.screenshot({ path: 'debug/shots/' + tag + '_b_scrolled.png' });
    console.log(tag + ' PAGE=' + (page ? page.path : '(null)'));
  }
  try { await mp.disconnect(); } catch (e) {}
  process.exit(0);
})().catch((e) => { console.error('ERR', String(e).slice(0, 200)); process.exit(1); });
