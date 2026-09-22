/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：弹层③ SettleBadge 链路验收脚本。step1=FAB 开列表；step2=确认钮触发徽章并连拍
 *   中间帧(≈300ms)/终态(≈950ms)/自动关后(≈2900ms)。FoodPicker 行点选由 wechatide 坐标 tap 完成。]
 *
 * 用法：node settle_flow.js step1 | step2
 */
const automator = require('miniprogram-automator')
const step = process.argv[2] || 'step1'
const SHOTS = __dirname + '/../.workbuddy/shots/audit/'

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  const page = await mp.currentPage()
  if (step === 'step1') {
    await mp.reLaunch('/pages/home/Home')
    await new Promise(r => setTimeout(r, 2500))
    const fab = await (await mp.currentPage()).$('.fab')
    await fab.tap()
    await new Promise(r => setTimeout(r, 1500))
    await mp.screenshot({ path: SHOTS + 'r22_step1_picker.png' })
    console.log('STEP1 OK picker shot')
  } else if (step === 'step2') {
    let p = await mp.currentPage()
    await new Promise(r => setTimeout(r, 1500))
    await mp.screenshot({ path: SHOTS + 'r22_step2_addfood.png' })
    p = await mp.currentPage()
    const btn = await p.$('.page >>> .confirm-btn')
    if (btn == null) { console.log('CONFIRM BTN NOT FOUND'); await mp.disconnect(); return }
    const t0 = Date.now()
    await btn.tap()
    // L3 中途帧：环扫+计数进行中
    await new Promise(r => setTimeout(r, Math.max(300 - (Date.now() - t0), 60)))
    await mp.screenshot({ path: SHOTS + 'r22_step3_badge_mid.png' })
    // 终态帧：≈950ms（环到位、三行齐）
    await new Promise(r => setTimeout(r, Math.max(950 - (Date.now() - t0), 60)))
    await mp.screenshot({ path: SHOTS + 'r22_step4_badge_final.png' })
    // 自动关验证：≈2900ms > 2380ms
    await new Promise(r => setTimeout(r, Math.max(2900 - (Date.now() - t0), 60)))
    await mp.screenshot({ path: SHOTS + 'r22_step5_after_close.png' })
    console.log('STEP2 OK shots: mid=' + (950 - (Date.now() - t0)))
  }
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + (e && e.message ? e.message : JSON.stringify(e))); process.exit(1) })
