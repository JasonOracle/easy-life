// P2 验收：Settings/Profile × 浅色/深色 × 三档滚动(0/120/底) 截图 + darkMode 状态核验
const automator = require('miniprogram-automator')
const path = require('path')
process.on('uncaughtException', (e) => { console.log('UNCAUGHT', e.message); process.exit(1) })

const OUT = 'D:/project/other-porject/kaluli/.workbuddy/shots/audit'
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function shoot3(mp, tag) {
  for (const [name, top] of [['0', 0], ['120', 120], ['bottom', 99999]]) {
    await mp.evaluate(new Function('wx.pageScrollTo({scrollTop:' + top + ',duration:0});return 1;'))
    await sleep(900)
    const off = await mp.evaluate(new Function(`
      return new Promise(function(res){
        wx.createSelectorQuery().selectViewport().scrollOffset(function(q){ res((q&&q.scrollTop)||0) }).exec()
      });
    `))
    const f = path.join(OUT, 'p10_' + tag + '_' + name + '.png')
    await mp.screenshot({ path: f })
    console.log(tag, name, 'scrollTop=' + off, '->', f)
  }
}

;(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' })

  const getDark = () => mp.evaluate(new Function(`
    var s = wx.getStorageSync('ct_settings_v1');
    try { s = typeof s === 'string' ? JSON.parse(s) : s } catch(e) {}
    return 'darkMode=' + (s && s.darkMode);
  `))

  // 1) Settings，先确保浅色
  await mp.evaluate(new Function('wx.reLaunch({url:"/pages/settings/Settings"});return 1;'))
  await sleep(2200)
  let st = await getDark()
  console.log('initial', st)
  if (st.indexOf('true') >= 0) {
    await mp.evaluate(new Function(`
      var sc = getCurrentPages()[0].$vm.$scope;
      var n = sc.data['n'];
      sc[n]({});
      return 1;
    `))
    await sleep(1200)
    console.log('toggled to light:', await getDark())
  }
  await shoot3(mp, 'settings_light')

  // 2) 切深色（直调 toggle 处理器 e1_6d）
  const tog = await mp.evaluate(new Function(`
    var sc = getCurrentPages()[0].$vm.$scope;
    var n = sc.data['n'];
    if (typeof sc[n] !== 'function') return 'handler missing: ' + n;
    sc[n]({});
    return 'called ' + n;
  `))
  console.log('toggle:', tog)
  await sleep(1500)
  console.log('after toggle:', await getDark())
  await shoot3(mp, 'settings_dark')

  // 3) Profile 深色（onShow syncBar 应保白字）
  await mp.evaluate(new Function('wx.reLaunch({url:"/pages/profile/Profile"});return 1;'))
  await sleep(2200)
  await shoot3(mp, 'profile_dark')

  // 4) 回 Settings 关深色
  await mp.evaluate(new Function('wx.reLaunch({url:"/pages/settings/Settings"});return 1;'))
  await sleep(2200)
  const tog2 = await mp.evaluate(new Function(`
    var sc = getCurrentPages()[0].$vm.$scope;
    var n = sc.data['n'];
    if (typeof sc[n] !== 'function') return 'handler missing: ' + n;
    sc[n]({});
    return 'called ' + n;
  `))
  console.log('toggle back:', tog2)
  await sleep(1200)
  console.log('final:', await getDark())

  // 5) Profile 浅色
  await mp.evaluate(new Function('wx.reLaunch({url:"/pages/profile/Profile"});return 1;'))
  await sleep(2200)
  await shoot3(mp, 'profile_light')

  await mp.disconnect()
  process.exit(0)
})()
