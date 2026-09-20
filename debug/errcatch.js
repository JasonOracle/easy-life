/**
 * [变更日志]
 * 创建时间：2026-09-20
 * AI模型：CodeBuddy (GLM-5.3-Flash)
 * 创建内容：临时排障脚本——连接 automator，挂 console/exception 监听后 reLaunch
 *           首页，抓取启动期完整报错（此前 console clean 是错误发生在连接前）。
 *           用法：node errcatch.js [页面路径，默认 /pages/home/Home]
 */
const automator = require('miniprogram-automator')
const pagePath = process.argv[2] || '/pages/home/Home'

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  const logs = []
  mp.on('console', (msg) => {
    logs.push('[' + msg.type + '] ' + (msg.args || []).map((a) => {
      try { return typeof a === 'string' ? a : JSON.stringify(a) } catch (e) { return String(a) }
    }).join(' '))
  })
  mp.on('exception', (err) => {
    logs.push('[exception] ' + (err && err.message ? err.message : JSON.stringify(err)))
  })
  // 注册全局未捕获 rejection/错误 钩子，把被吞掉的对象内容捞出来
  try {
    await mp.evaluate(() => {
      // @ts-ignore
      globalThis.__errs = []
      // @ts-ignore
      if (wx.onUnhandledRejection) {
        // @ts-ignore
        wx.onUnhandledRejection(function (res) {
          // @ts-ignore
          const r = res && res.reason
          // @ts-ignore
          globalThis.__errs.push(r && (r.message || JSON.stringify(r)))
        })
      }
      // @ts-ignore
      if (wx.onError) {
        // @ts-ignore
        wx.onError(function (msg) {
          // @ts-ignore
          globalThis.__errs.push('onError: ' + msg)
        })
      }
    })
  } catch (e) {
    logs.push('[hook fail] ' + (e && e.message))
  }
  try {
    await mp.reLaunch(pagePath)
  } catch (e) {
    let detail = ''
    try { detail = JSON.stringify(e) } catch (e2) { detail = String(e) }
    logs.push('[reLaunch fail] ' + detail + ' | msg=' + (e && e.message) + ' | keys=' + (e ? Object.keys(e).join(',') : ''))
  }
  await new Promise((r) => setTimeout(r, 3000))
  const page = await mp.currentPage()
  logs.push('[page] ' + (page ? page.path : '(null)'))
  if (page) {
    try {
      const data = await page.data()
      logs.push('[dataKeys] ' + JSON.stringify(Object.keys(data)))
    } catch (e) {
      logs.push('[data fail] ' + e.message)
    }
  }
  try {
    // @ts-ignore
    const errs = await mp.evaluate(() => { return globalThis.__errs })
    logs.push('[__errs] ' + JSON.stringify(errs))
  } catch (e) {
    logs.push('[__errs fail] ' + (e && e.message))
  }
  // 手动 require 页面模块，直接抓加载期异常的真实堆栈
  try {
    // @ts-ignore
    const r = await mp.evaluate(() => {
      try {
        // @ts-ignore
        require('pages/home/Home.js')
        return 'require ok'
      } catch (err) {
        return 'THROW: ' + (err && err.stack ? err.stack : (err && err.message) || String(err))
      }
    })
    logs.push('[require test] ' + r)
  } catch (e) {
    logs.push('[require test fail] ' + (e && e.message))
  }
  console.log(logs.join('\n'))
  await mp.disconnect()
})().catch((e) => { console.error('ERR=' + (e && e.message)) })
