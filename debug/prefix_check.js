/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[类名去冲突验收探针——导航/取页改用本项目已验证范式（evaluate restartMiniProgram + 7s +
 *   mp.currentPage()；automator reLaunch 抛 Uncaught [object Object]、mp.page() 不存在，均已弃用）：
 *   ① Settings 页自身 .row/.row-text 未被组件改名波及；
 *   ② Home → .fab 开 FoodPicker 后 .fp-row/.fp-search-input/.fp-radio 命中、旧裸 .row 不命中；
 *   ③ Profile 目标胶囊 .pill 命中；④ 三页各存一张截图供肉眼比对。全程无参 evaluate。]
 */
const automator = require('miniprogram-automator')
process.on('uncaughtException', e => console.log('UNCAUGHT=' + String(e).slice(0, 160)))

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function goto(mp, path) {
  await mp.evaluate(new Function("wx.restartMiniProgram({path:'" + path + "'});return 1"))
  await sleep(7000)
  return await mp.currentPage()
}

async function has(page, sel) {
  try { return (await page.$(sel)) != null } catch (e) { return 'ERR' }
}
async function txt(page, sel) {
  try { const el = await page.$(sel); return el ? String((await el.text())).trim() : 'null' } catch (e) { return 'ERR' }
}

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })

  let page = await goto(mp, '/pages/settings/Settings')
  console.log('PAGE=' + (page ? page.path : '(null)'))
  console.log('SETTINGS .row=' + await has(page, '.page >>> .row')
    + ' .row-text=' + await has(page, '.page >>> .row-text')
    + ' text=' + await txt(page, '.page >>> .row-text'))
  await mp.screenshot({ path: 'shots/audit/prefix_settings.png' })

  page = await goto(mp, '/pages/home/Home')
  const fab = await page.$('.fab')
  console.log('FAB=' + (fab != null))
  if (fab) {
    await fab.tap()
    await sleep(2200)
    console.log('PICKER .fp-row=' + await has(page, '.page >>> .fp-row')
      + ' .fp-search-input=' + await has(page, '.page >>> .fp-search-input')
      + ' .fp-radio=' + await has(page, '.page >>> .fp-radio')
      + ' oldbare-row=' + await has(page, '.page >>> .row'))
    await mp.screenshot({ path: 'shots/audit/prefix_picker.png' })
  }

  page = await goto(mp, '/pages/profile/Profile')
  console.log('PROFILE .pill=' + await has(page, '.page >>> .pill')
    + ' .pill-text=' + await txt(page, '.page >>> .pill-text'))
  await mp.screenshot({ path: 'shots/audit/prefix_profile.png' })

  try { await mp.disconnect() } catch (e) {}
  console.log('DONE')
  process.exit(0)
})().catch(e => { console.log('FAIL=' + String(e).slice(0, 200)); process.exit(1) })
