/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：batch_check 结果存疑后的纯协议探针——tap 铅笔后查 .gm-mask 是否真实存在、
 *   枚举 storage 全部键与食物记录键、检查 setGoal 持久化值。]
 */
const automator = require('miniprogram-automator')
const wait = (ms) => new Promise(r => setTimeout(r, ms))

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  let page = await mp.currentPage()
  console.log('PAGE=' + page.path)

  // 1) storage 全键枚举
  const info = await mp.evaluate(() => {
    const i = wx.getStorageInfoSync()
    const out = {}
    for (const k of i.keys) {
      const v = wx.getStorageSync(k)
      out[k] = typeof v === 'string' ? v.slice(0, 120) : JSON.stringify(v).slice(0, 120)
    }
    return out
  })
  console.log('STORAGE_KEYS=' + JSON.stringify(Object.keys(info)))
  for (const k of Object.keys(info)) {
    if (k.indexOf('goal') >= 0 || k.indexOf('entries') >= 0) console.log('  ' + k + ' = ' + info[k])
  }

  // 2) tap 铅笔 → 查 .gm-mask / .gm-stepbtn-r 是否出现（纯 DOM 探针，多查几次）
  await (await page.$('.pill-edit')).tap()
  await wait(1000)
  const m1 = await page.$('.page >>> .gm-mask')
  const m2 = await page.$('.page >>> .gm-stepbtn-r')
  console.log('AFTER_TAP mask=' + !!m1 + ' plus=' + !!m2)
  // 页面 vm 状态
  const vmState = await mp.evaluate(() => {
    const p = getCurrentPages()[0]
    const vm = p.$vm
    const keys = []
    try { keys.push(...Object.keys(vm.$data || {})) } catch (e) {}
    const probe = {}
    for (const k of keys) {
      if (/goal|show|Goal|Show/i.test(k)) probe[k] = String(vm.$data[k])
    }
    return { keys: keys.slice(0, 40), probe }
  })
  console.log('VM=' + JSON.stringify(vmState))

  // 3) 若 mask 存在 → 点 plus → 读大数字文本
  if (m2) {
    await m2.tap()
    await wait(500)
    const bignum = await page.$('.page >>> .gm-bignum')
    if (bignum) console.log('BIGNUM=' + await bignum.text())
    const save = await page.$('.page >>> .gm-save')
    if (save) { await save.tap(); await wait(700) }
    const pillText = await (await page.$('.goal-pill-text')).text()
    console.log('PILL_AFTER_SAVE=' + pillText)
    const g = await mp.evaluate(() => {
      const ks = wx.getStorageInfoSync().keys
      for (const k of ks) if (/goal/i.test(k)) return k + '=' + JSON.stringify(wx.getStorageSync(k)).slice(0, 200)
      return 'none'
    })
    console.log('GOAL_STORAGE=' + g)
  } else {
    console.log('MODAL_NOT_OPEN — skip steps')
  }
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })
