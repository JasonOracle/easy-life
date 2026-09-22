/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：弹层③ 单连接诊断流——挂 console/exception 钩子后走
 *   FAB→FoodPicker 首行(.page >>> .row)→AddFood 确认钮→连拍徽章三帧＋sb-badge 存在性探针。]
 */
const automator = require('miniprogram-automator')
const SHOTS = __dirname + '/../.workbuddy/shots/audit/'

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  const logs = []
  mp.on('console', (msg) => {
    logs.push('[' + msg.type + '] ' + (msg.args || []).map((a) => {
      try { return typeof a === 'string' ? a : JSON.stringify(a) } catch (e) { return String(a) }
    }).join(' '))
  })
  mp.on('exception', (err) => logs.push('[exception] ' + (err && err.message ? err.message : JSON.stringify(err))))

  await mp.reLaunch('/pages/home/Home')
  await new Promise(r => setTimeout(r, 2500))
  let page = await mp.currentPage()
  await (await page.$('.fab')).tap()
  await new Promise(r => setTimeout(r, 1200))

  page = await mp.currentPage()
  const row = await page.$('.page >>> .row')
  console.log('ROW found=' + (row != null))
  if (row == null) { console.log('LOGS:\n' + logs.join('\n')); await mp.disconnect(); return }
  await row.tap()
  await new Promise(r => setTimeout(r, 1200))

  page = await mp.currentPage()
  const btn = await page.$('.page >>> .confirm-btn')
  console.log('CONFIRM found=' + (btn != null))
  if (btn == null) { console.log('LOGS:\n' + logs.join('\n')); await mp.disconnect(); return }
  const t0 = Date.now()
  await btn.tap()
  await new Promise(r => setTimeout(r, Math.max(250 - (Date.now() - t0), 50)))
  await mp.screenshot({ path: SHOTS + 'r23_badge_t250.png' })
  page = await mp.currentPage()
  const badge = await page.$('.page >>> .sb-badge')
  console.log('BADGE@' + (Date.now() - t0) + 'ms found=' + (badge != null))
  await new Promise(r => setTimeout(r, Math.max(900 - (Date.now() - t0), 50)))
  await mp.screenshot({ path: SHOTS + 'r23_badge_t900.png' })
  await new Promise(r => setTimeout(r, Math.max(2000 - (Date.now() - t0), 50)))
  await mp.screenshot({ path: SHOTS + 'r23_badge_t2000.png' })
  await new Promise(r => setTimeout(r, Math.max(2900 - (Date.now() - t0), 50)))
  await mp.screenshot({ path: SHOTS + 'r23_badge_t2900.png' })
  const badge2 = await (await mp.currentPage()).$('.page >>> .sb-badge')
  console.log('BADGE@2900 found=' + (badge2 != null))
  console.log('LOGS:\n' + logs.filter(l => !/^\[log\]/.test(l)).slice(0, 30).join('\n'))
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + (e && e.message ? e.message : JSON.stringify(e))); process.exit(1) })
