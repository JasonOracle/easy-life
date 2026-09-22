/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：甜度电量条布局取证——selectorQuery 量 .sweet-tray/.sweet-pill/.sweet-seg 实际矩形，
 *   经 storage 桥接两次 evaluate 读回（evaluate 不 await Promise、上下文不互通，storage 为唯一跨调用通道）。]
 */
const automator = require('miniprogram-automator')

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  await mp.evaluate(() => {
    wx.createSelectorQuery()
      .select('.sweet-tray').boundingClientRect()
      .select('.sweet-pill').boundingClientRect()
      .selectAll('.sweet-seg').boundingClientRect()
      .exec((res) => {
        wx.setStorageSync('ct_dbg_rects', JSON.stringify(res))
      })
    return 'queued'
  })
  await new Promise((r) => setTimeout(r, 1500))
  const out = await mp.evaluate(() => wx.getStorageSync('ct_dbg_rects') || 'EMPTY')
  console.log('RECTS=' + out)
  await mp.evaluate(() => { wx.removeStorageSync('ct_dbg_rects'); return 1 })
  await mp.disconnect()
})().catch((e) => { console.error('ERR=' + e.message); process.exit(1) })
