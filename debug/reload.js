/**
 * [变更日志]
 * 修改时间：2026-09-19
 * AI模型：CodeBuddy (DeepSeek-V4.1-Flash)
 * 修改内容：[1. 新建：automator reLaunch 实验（替代重开窗口）；
 *            2. 参数化：node reload.js [页面路径] [截图输出]，默认首页。]
 *
 * 用法：node reload.js [/pages/profile/Profile] [输出路径]
 */
const automator = require('miniprogram-automator')
const pagePath = process.argv[2] || '/pages/home/Home'
const out = process.argv[3] || (require('os').tmpdir() + '\\ct_relaunch.png')

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  await mp.reLaunch(pagePath)
  console.log('RELAUNCH=' + pagePath)
  await new Promise(r => setTimeout(r, 2000))
  await mp.screenshot({ path: out })
  console.log('SHOT=' + out)
  const page = await mp.currentPage()
  console.log('PAGE=' + (page ? page.path : '(null)'))
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })
