/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：三页批量截图脚本，逐页 reLaunch 后后台截图，供第二轮还原度审核比对。]
 */
const automator = require('miniprogram-automator')

const outDir = process.argv[2] || '.workbuddy/shots/audit'
const pages = [
  ['pages/home/Home', 'r5_home'],
  ['pages/profile/Profile', 'r5_profile'],
  ['pages/settings/Settings', 'r5_settings']
]

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  for (const [path, name] of pages) {
    const page = await mp.reLaunch('/' + path)
    await page.waitFor(3500)
    await mp.screenshot({ path: `${outDir}/${name}.png` })
    console.log('OK ' + name + ' -> ' + (await (await mp.currentPage()).path))
  }
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })
