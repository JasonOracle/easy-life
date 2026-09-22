/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：数据侧探针（不依赖截图/DOM 探针）——直接调页面 bindtap 处理器，
 *   读 GoalModal 子组件 show prop 与 picked 值，验证铅笔接线与步进保存逻辑。]
 */
const automator = require('miniprogram-automator')
const wait = (ms) => new Promise(r => setTimeout(r, ms))

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  const page = await mp.currentPage()
  const data = await page.data()
  const fns = Object.keys(data).filter(k => typeof data[k] === 'function')
  const bools = {}
  for (const k of Object.keys(data)) if (typeof data[k] === 'boolean') bools[k] = data[k]
  console.log('PAGE_FNS=' + fns.join(',') + ' BOOLS=' + JSON.stringify(bools))
  const r1 = 'skip'
  console.log(r1)

  // 调 openGoal：wxml 中 pill-edit bindtap="{{i}}" → data.i 即处理器
  const r2 = await mp.evaluate(() => {
    const p = getCurrentPages()[0]
    const sc = p.$vm && p.$vm.$scope ? p.$vm.$scope : p.$scope
    if (sc && typeof sc.data.i === 'function') { sc.data.i({}); return 'invoked-i' }
    return 'no-handler sc=' + !!sc
  })
  console.log('OPEN_GOAL=' + r2)
  await wait(800)

  // 读 GoalModal 子组件状态
  const r3 = await mp.evaluate(() => {
    const p = getCurrentPages()[0]
    const kids = (p.$vm && p.$vm.$children) || []
    for (const k of kids) {
      let nm = ''
      try { nm = (k.$ && k.$.type && (k.$.type.name || k.$.type.__name)) || '' } catch (e) {}
      if (nm !== 'GoalModal') continue
      const s = k.$scope
      const out = { name: nm, dataKeys: Object.keys(s.data).slice(0, 30) }
      // 找 show 类布尔与 picked 数字
      const bools = {}, nums = {}
      for (const key of Object.keys(s.data)) {
        const v = s.data[key]
        if (typeof v === 'boolean') bools[key] = v
        else if (typeof v === 'number' && v >= 1000 && v <= 3000) nums[key] = v
      }
      out.bools = bools; out.nums = nums
      return JSON.stringify(out)
    }
    return 'GoalModal-child-not-found kids=' + kids.length
  })
  console.log('GM=' + r3)

  // 若 show=true，调 step(+1)：找子组件里名为 step 的处理器不易，改点 wxml bindtap
  const r4 = await mp.evaluate(() => {
    const p = getCurrentPages()[0]
    const kids = (p.$vm && p.$vm.$children) || []
    for (const k of kids) {
      let nm = ''
      try { nm = (k.$ && k.$.type && (k.$.type.name || k.$.type.__name)) || '' } catch (e) {}
      if (nm !== 'GoalModal') continue
      const s = k.$scope
      // wxml: gm-stepbtn-r bindtap="{{X}}" — 遍历 data 找函数并逐个打印键名
      const fns = Object.keys(s.data).filter(key => typeof s.data[key] === 'function')
      return 'gmFns=' + fns.join(',')
    }
    return 'nf'
  })
  console.log(r4)
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })
