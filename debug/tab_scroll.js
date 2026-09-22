/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：把首页滚到指定位置后零窗口截图，用于让 TabBar 玻璃胶囊压在真实内容上，
 *   以便对比浅色气泡底色 18% 与 25% 的通透度（静止首屏下气泡压在白卡上，两档像素几乎无差）]
 */
const path = require('path')
const automator = require(path.join(__dirname, 'node_modules/miniprogram-automator'))

const OUT = process.argv[2] || 'debug/shots/tab_scroll.png'

async function main() {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  const page = await mp.currentPage()
  // evaluate 一律无参（工程铁律：带参 evaluate 时而拒绝时而永久挂起），滚动值写进字面量
  await mp.evaluate(() => {
    wx.pageScrollTo({ scrollTop: 300, duration: 0 })
  })
  await new Promise(r => setTimeout(r, 900))
  await mp.screenshot({ path: OUT })
  console.log('SHOT=' + OUT + ' scrollTop=300 PAGE=' + page.path)
  await mp.disconnect()
}

main().catch(e => { console.log('ERR ' + e.message); process.exit(1) })
