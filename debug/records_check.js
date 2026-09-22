/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：最近记录/单日详情两页验收——首页日历图标→Records（月历/汇总卡截图）、
 *   点日期格换选中日、查看详情→DayDetail（热量卡/餐次卡截图）、长按记录行弹 ActionSheet、
 *   删除前后 storage 与当日总量对比，验证后回滚 storage 不污染演示数据。]
 */
const automator = require('miniprogram-automator')
const DIR = 'D:/project/other-porject/kaluli/.workbuddy/shots/audit/'
const wait = (ms) => new Promise(r => setTimeout(r, ms))

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  await mp.evaluate(() => wx.restartMiniProgram({ path: '/pages/home/Home' }))
  await wait(6000)
  let page = await mp.currentPage()
  console.log('START=' + page.path)

  // ---- 1. 首页日历图标 → Records ----
  await (await page.$('.pill-cal')).tap()
  await wait(2000)
  page = await mp.currentPage()
  console.log('AFTER_CAL=' + page.path)
  try { await mp.screenshot({ path: DIR + 'i1_records.png' }) } catch (e) { console.log('SHOT1_ERR=' + e.message.slice(0, 60)) }

  // ---- 2. 点日期格（页面级节点，$$ 可用）----
  let cells = null
  try { cells = await page.$$('.lr-cell') } catch (e) { console.log('CELLS_ERR=' + e.message.slice(0, 60)) }
  console.log('CELLS=' + (cells ? cells.length : 0))
  if (cells && cells.length >= 20) {
    try {
      const dBefore = await (await page.$('.lr-sum-date')).text()
      await cells[19].tap() // 第 3 行第 6 列附近（种子数据日）
      await wait(900)
      let dAfter = await (await page.$('.lr-sum-date')).text()
      if (dAfter === dBefore) {
        console.log('CELL_TAP_NOEFFECT fallback=handler-invoke')
        const inv = await mp.evaluate(() => {
          const pages = getCurrentPages()
          const p = pages[pages.length - 1]
          const sc = (p.$vm && p.$vm.$scope) ? p.$vm.$scope : p.$scope
          if (!sc || !sc.data) return 'no-scope'
          // 行对象里再嵌 cells 数组：三层扫描找带 .f（bindtap 处理器名）的 cellItem
          const tryCell = (c) => {
            return c && typeof c === 'object' && typeof c.f === 'string' && typeof sc[c.f] === 'function' ? c : null
          }
          const callCell = (cell) => {
            const id = cell.h != null ? cell.h : ''
            sc[cell.f]({ currentTarget: { id: id, dataset: {} }, target: { id: id, dataset: {} } })
            return 'invoked:' + cell.f
          }
          for (const key of Object.keys(sc.data)) {
            const v = sc.data[key]
            if (!Array.isArray(v)) continue
            for (const it of v) {
              if (Array.isArray(it)) {
                for (const c2 of it) { const cell = tryCell(c2); if (cell) return callCell(cell) }
              } else if (it && typeof it === 'object') {
                const cell = tryCell(it)
                if (cell) return callCell(cell)
                for (const k2 of Object.keys(it)) {
                  const inner = it[k2]
                  if (Array.isArray(inner)) {
                    for (const c3 of inner) { const cc = tryCell(c3); if (cc) return callCell(cc) }
                  }
                }
              }
            }
          }
          return 'no-cell-handler'
        })
        console.log('CELL_INV=' + inv)
        await wait(900)
        dAfter = await (await page.$('.lr-sum-date')).text()
      }
      console.log('SEL_DATE ' + dBefore + ' -> ' + dAfter)
      await mp.screenshot({ path: DIR + 'i2_records_pick.png' })
    } catch (e) { console.log('PICK_ERR=' + e.message.slice(0, 60)) }
  }

  // ---- 3. 查看详情 → DayDetail ----
  try {
    const link = await page.$('.lr-sec-link')
    if (link) { await link.tap(); await wait(1800) }
  } catch (e) { console.log('LINK_ERR=' + e.message.slice(0, 60)) }
  page = await mp.currentPage()
  console.log('DETAIL=' + page.path)
  try { await mp.screenshot({ path: DIR + 'i3_daydetail.png' }) } catch (e) { console.log('SHOT3_ERR=' + e.message.slice(0, 60)) }

  // ---- 4. 长按记录行 → ActionSheet（处理器直调，wxml bindlongpress="{{rowItem.f}}"）----
  const snap = await mp.evaluate(() => wx.getStorageSync('ct_food_entries_v1'))
  const cnt = (s) => { try { const v = typeof s === 'string' ? JSON.parse(s) : s; return Array.isArray(v) ? v.length : 0 } catch (e) { return -1 } }
  console.log('SNAP_COUNT=' + cnt(snap))
  const trig = await mp.evaluate(() => {
    const pages = getCurrentPages()
    const p = pages[pages.length - 1]
    const sc = (p.$vm && p.$vm.$scope) ? p.$vm.$scope : p.$scope
    if (!sc || !sc.data) return 'no-scope'
    const tryRow = (c) => (c && typeof c === 'object' && typeof c.f === 'string' && typeof sc[c.f] === 'function' ? c : null)
    const call = (r) => {
      const id = r.h != null ? r.h : ''
      sc[r.f]({ currentTarget: { id: id, dataset: {} }, target: { id: id, dataset: {} } })
      return 'invoked:' + r.f
    }
    for (const key of Object.keys(sc.data)) {
      const v = sc.data[key]
      if (!Array.isArray(v)) continue
      for (const it of v) {
        if (Array.isArray(it)) {
          for (const c2 of it) { const r = tryRow(c2); if (r) return call(r) }
        } else if (it && typeof it === 'object') {
          const r = tryRow(it)
          if (r) return call(r)
          for (const k2 of Object.keys(it)) {
            const inner = it[k2]
            if (Array.isArray(inner)) {
              for (const c3 of inner) { const rr = tryRow(c3); if (rr) return call(rr) }
            }
          }
        }
      }
    }
    return 'no-row-array'
  })
  console.log('LONGPRESS=' + trig)
  await wait(1200)
  try { await mp.screenshot({ path: DIR + 'i4_actionsheet.png' }) } catch (e) { console.log('SHOT4_ERR=' + e.message.slice(0, 50)) }
  // 坐标点「删除这条记录」选项行（单选项+取消的底部菜单，选项行中心约 y=718）
  const { execSync } = require('child_process')
  try {
    const r = execSync('"D:\\\\soft\\\\微信web开发者工具\\\\wechatide.cmd" -c codebuddy automation_element_action --action tap --x 187 --y 718 --project "D:\\\\project\\\\other-porject\\\\kaluli\\\\app\\\\unpackage\\\\dist\\\\dev\\\\mp-weixin" --token n2K67KULlA73gHNkOfxskdSpEPDd3LbZ',
      { encoding: 'utf8', timeout: 30000 })
    console.log('TAP_OPT=' + r.replace(/\s+/g, ' ').slice(0, 120))
  } catch (e) { console.log('TAP_ERR=' + e.message.slice(0, 120)) }
  await wait(1200)
  await mp.screenshot({ path: DIR + 'i5_after_delete.png' })
  const afterDel = await mp.evaluate(() => wx.getStorageSync('ct_food_entries_v1'))
  console.log('DELETED: storage ' + cnt(snap) + ' -> ' + cnt(afterDel))
  await mp.evaluate(() => wx.navigateBack({ delta: 1 }))
  await wait(800)
  await mp.evaluate(() => wx.navigateBack({ delta: 1 }))
  await wait(800)
  page = await mp.currentPage()
  console.log('BACK=' + page.path)

  // ---- 5. 回滚 storage + 重启 ----
  await mp.evaluate((s) => {
    if (s) wx.setStorageSync('ct_food_entries_v1', s)
    else wx.removeStorageSync('ct_food_entries_v1')
    return 'ok'
  }, snap)
  await mp.evaluate(() => wx.reLaunch({ url: '/pages/home/Home' }))
  await wait(2500)
  console.log('DONE')
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })
