/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：蒙层点击关闭验证 — automator 点首页 FAB 打开 FoodPicker 后断开，
 *   交棒 wechatide 坐标点击蒙层，再 shot.js 截图确认关闭]
 */
// 用法：node debug/mask_test.js   （从仓库根目录运行）
const automator = require('miniprogram-automator')

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  const page = await mp.reLaunch('/pages/home/Home')
  await new Promise((r) => setTimeout(r, 3000))
  const fab = await page.$('.fab')
  if (fab == null) {
    console.error('FAB not found')
    process.exit(1)
  }
  await fab.tap()
  await new Promise((r) => setTimeout(r, 1500))
  await mp.disconnect()
  console.log('picker opened via fab; now tap mask with wechatide coordinate action')
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
