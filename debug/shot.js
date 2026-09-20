/**
 * [变更日志]
 * 修改时间：2026-09-19
 * AI模型：CodeBuddy (DeepSeek-V4.1-Flash)
 * 修改内容：[新建：官方 miniprogram-automator 后台截图验证脚本。
 *           通过 ws://127.0.0.1:9420 协议直连模拟器（零窗口操作），
 *           验证窗口最小化状态下能否截图 —— 若可行即取代窗口挪移方案。]
 *
 * 用法：node shot.js [输出路径]
 */
const automator = require('miniprogram-automator')

const out = process.argv[2] || (require('os').tmpdir() + '\\ct_automator.png')

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  await mp.screenshot({ path: out })
  console.log('SHOT=' + out)
  // 顺带验证页面信息能力（后台取数据的关键能力）
  const page = await mp.currentPage()
  console.log('PAGE=' + (page ? page.path : '(null)'))
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })
