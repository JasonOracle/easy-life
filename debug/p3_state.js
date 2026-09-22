const automator = require('miniprogram-automator')
process.on('uncaughtException', (e) => { console.log('UNCAUGHT', e.message); process.exit(1) })
const sleep = (ms) => new Promise(r => setTimeout(r, ms))
;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })
  const page = await mp.currentPage()
  console.log('route:', page && page.path ? page.path : 'unknown')
  const data = await page.data()
  const v = data && data.data ? data.data : data
  const keys = Object.keys(v || {})
  console.log('data keys:', keys.join(','))
  const hits = []
  for (const k of keys) {
    const val = v[k]
    if (typeof val === 'boolean' && /show|picker|food|goal|settle|add/i.test(k)) hits.push(k + '=' + val)
  }
  console.log('bool flags:', hits.join(' | '))
  await mp.disconnect(); process.exit(0)
})()
