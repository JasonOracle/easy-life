/**
 * [变更日志]
 * 修改时间：2026-09-19
 * AI模型：CodeBuddy (DeepSeek-V4.1-Flash)
 * 修改内容：[v2：新增 console/exception 协议层监听（不依赖 IDE 调试器面板）。
 *           此前只截图不抓报错，白屏排障时盲拍三轮才靠专项探针看到
 *           「module not defined」。现在每次截图同时输出本次连接期间
 *           捕获的 error/warn，截图与报错不再割裂。]
 *
 * 用法：node shot.js [输出路径]
 * 输出：SHOT=截图路径 / PAGE=当前页 / CONSOLE=clean 或捕获的错误列表
 *       （注意：console 事件只推「连接之后」发生的日志；要看页面启动期
 *        的报错，重开窗口后立即跑本脚本，或用 IDE 控制台/WeappLog）
 */
const automator = require('miniprogram-automator')

const out = process.argv[2] || (require('os').tmpdir() + '\\ct_automator.png')

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })

  // ── 协议层报错监听：error/warn 都收，debug 忽略 ──
  const logs = []
  mp.on('console', (msg) => {
    if (msg.type !== 'error' && msg.type !== 'warn') return
    const args = (msg.args || []).map(a => {
      if (typeof a === 'string') return a
      try { return JSON.stringify(a) } catch { return String(a) }
    })
    logs.push(`[${msg.type}] ${args.join(' ')}`.slice(0, 300))
  })
  mp.on('exception', (err) => {
    logs.push(`[EXCEPTION] ${err.message}`.slice(0, 300))
  })

  await mp.screenshot({ path: out })
  console.log('SHOT=' + out)
  // 顺带验证页面信息能力（后台取数据的关键能力）
  const page = await mp.currentPage()
  console.log('PAGE=' + (page ? page.path : '(null)'))

  // 给 console 事件一点到达时间
  await new Promise(r => setTimeout(r, 1200))

  if (logs.length === 0) {
    console.log('CONSOLE=clean')
  } else {
    console.log(`CONSOLE=${logs.length} 条 error/warn:`)
    logs.forEach(l => console.log('  ' + l))
  }
  await mp.disconnect()
})().catch(e => { console.error('ERR=' + e.message); process.exit(1) })
