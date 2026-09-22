// 弹层关闭链路验证（分步日志版）
const automator = require('miniprogram-automator')
process.on('uncaughtException', e => { console.log('ASYNC_ERR', String(e && (e.message || JSON.stringify(e))).slice(0, 200)) })

async function main() {
  const mode = process.argv[2] || 'check'
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  console.log('connected')
  if (mode === 'open') {
    try { await mp.reLaunch({ url: '/pages/home/Home' }) } catch (e) { console.log('relaunch_fail', String(e).slice(0, 120)) }
    console.log('relaunched')
    await new Promise(r => setTimeout(r, 2500))
    const page = await mp.currentPage()
    const fab = await page.$('.fab')
    if (fab == null) { console.log('NO_FAB'); await mp.disconnect(); return }
    await fab.tap()
    console.log('fab_tapped')
    await new Promise(r => setTimeout(r, 1500))
  }
  const page2 = await mp.currentPage()
  let open = false
  try {
    const sheet = await page2.$('.page >>> .fp-sheet')
    open = sheet != null
  } catch (e) { console.log('probe_fail', String(e).slice(0, 120)) }
  console.log('picker_open=' + open)
  await mp.disconnect().catch(() => {})
}
main().catch(e => { console.log('ERR', String(e && (e.message || JSON.stringify(e))).slice(0, 200)); process.exit(1) })
