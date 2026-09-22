/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：验证三页删 flex:1 后原生页面滚动——wx.pageScrollTo 滚到 400，page.scrollTop() 取证，滚动前后截图]
 */
const automator = require('miniprogram-automator')
const pages = [['pages/home/Home','r6_home'],['pages/profile/Profile','r6_profile'],['pages/settings/Settings','r6_settings']]
;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  for (const [path, name] of pages) {
    const page = await mp.reLaunch('/' + path)
    await page.waitFor(3000)
    await mp.evaluate(function () { wx.pageScrollTo({ scrollTop: 400, duration: 0 }) })
    await page.waitFor(1000)
    const st = await page.scrollTop()
    console.log(name + ' scrollTopAfter400=' + st)
    await mp.screenshot({ path: `.workbuddy/shots/audit/${name}_scrolled.png` })
  }
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })
