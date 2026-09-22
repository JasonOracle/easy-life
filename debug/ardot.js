/**
 * [变更日志]
 * 修改时间：2026-09-20
 * AI模型：CodeBuddy (GLM)
 * 修改内容：[新建：Ardot 本地 MCP 命令行封装。供主会话与子 agent 以零依赖方式
 *           调用设计稿读取/导出能力，避免每个会话重复手写协议样板]
 *
 * 用法：
 *   node debug/ardot.js call <toolName> <argsJson>          调用任意工具，打印文本结果
 *   node debug/ardot.js read <nodeId> [outJsonl]            batch_read 并落盘
 *   node debug/ardot.js export <nodeId> <outPng> [scale]    export_nodes 导出 PNG
 *   node debug/ardot.js shot <nodeId> <outPng>              capture_screenshot 截图
 */
const http = require('http')
const fs = require('fs')
const path = require('path')

function post(body) {
  return new Promise((res, rej) => {
    const req = http.request({
      host: '127.0.0.1',
      port: 50501,
      path: '/api/v1/mcp',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream' }
    }, (r) => {
      let d = ''
      r.on('data', (c) => (d += c))
      r.on('end', () => res(d))
    })
    req.on('error', rej)
    req.end(body)
  })
}

async function callTool(name, args, id) {
  const raw = await post(JSON.stringify({ jsonrpc: '2.0', id: id, method: 'tools/call', params: { name: name, arguments: args } }))
  const m = raw.match(/data: (.*)/s)
  if (!m) throw new Error('bad response: ' + raw.substring(0, 300))
  const j = JSON.parse(m[1])
  if (j.error) throw new Error(JSON.stringify(j.error))
  return j.result
}

function textOf(result) {
  return (result.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n')
}

;(async () => {
  // initialize（无 session，直连即可）
  await post(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'ardot-cli', version: '0.1' } } }))

  const cmd = process.argv[2]

  if (cmd === 'call') {
    const name = process.argv[3]
    const args = JSON.parse(process.argv[4] || '{}')
    const r = await callTool(name, args, 10)
    console.log(textOf(r))
    return
  }

  if (cmd === 'read') {
    const nodeId = process.argv[3]
    const out = process.argv[4]
    const r = await callTool('batch_read', { nodeIds: [nodeId] }, 10)
    const t = textOf(r)
    // batch_read 会把数据写入临时 jsonl 并在文本里给出路径
    const f = t.match(/written to:\s*\n?\s*(\S+\.jsonl)/)
    if (out && f) {
      fs.mkdirSync(path.dirname(out), { recursive: true })
      fs.copyFileSync(f[1], out)
      console.log('SAVED=' + out)
    } else {
      console.log(t)
    }
    return
  }

  if (cmd === 'export') {
    const nodeId = process.argv[3]
    const out = process.argv[4]
    const scale = Number(process.argv[5] || 2)
    const r = await callTool('export_nodes', { nodeIds: [nodeId], format: 'png', scale: scale }, 10)
    const t = textOf(r)
    // 返回内容里可能含 base64 或文件路径，按两种形态兼容
    const img = (r.content || []).find((c) => c.type === 'image')
    fs.mkdirSync(path.dirname(out), { recursive: true })
    if (img && img.data) {
      fs.writeFileSync(out, Buffer.from(img.data, 'base64'))
      console.log('SAVED=' + out)
    } else {
      const f = t.match(/(\S+\.png)/i)
      if (f && fs.existsSync(f[1])) {
        fs.copyFileSync(f[1], out)
        console.log('SAVED=' + out)
      } else {
        console.log('RAW=' + t.substring(0, 2000))
      }
    }
    return
  }

  if (cmd === 'shot') {
    const nodeId = process.argv[3]
    const out = process.argv[4]
    const r = await callTool('capture_screenshot', { nodeIds: [nodeId] }, 10)
    const t = textOf(r)
    const img = (r.content || []).find((c) => c.type === 'image')
    fs.mkdirSync(path.dirname(out), { recursive: true })
    if (img && img.data) {
      fs.writeFileSync(out, Buffer.from(img.data, 'base64'))
      console.log('SAVED=' + out)
    } else {
      const f = t.match(/(\S+\.png)/i)
      if (f && fs.existsSync(f[1])) {
        fs.copyFileSync(f[1], out)
        console.log('SAVED=' + out)
      } else {
        console.log('RAW=' + t.substring(0, 2000))
      }
    }
    return
  }

  console.error('unknown cmd: ' + cmd)
  process.exit(1)
})().catch((e) => { console.error('ERR=' + e.message); process.exit(1) })
