# Profile.uvue — 个人中心（v2 稿 P2 还原）

## 💡 核心思想

按 Ardot v2 稿（727788215940571 · 10:6）1:1 还原个人中心静态结构：渐变头图／今日热量卡／
达标 Banner（压卡 overlapping）／本周概览（七点）／热量趋势（柱状＋目标线）／最近记录 3 行／
共享 Tabbar（我的激活）。头图／数字／进度／周点／趋势／历史全部走 user＋goal＋food store；
种子精确还原历史（1950超+150／1720／1580）与趋势前 5 柱；周 badge 与 bar6-7 按真值走（见 progress 归档）。

## 💻 使用示例

`pages.json` 第二路由。首页 Tab「我的」`navigateTo` 进入；齿轮进设置页；本页 Tab「首页」`navigateBack`。

## 依赖

- user／goal／food store；`app/static/profile/*.png` ＋ 三项统计卡图标 `stat_target.svg / stat_consumed.svg / stat_remain.svg` ＋ Tab 图复用 `app/static/home/`

## 设计决策
- **滚动防穿透（2026-09-22 P1，Boss 拍板 B-lite）**：页末内联 fixed 遮罩 `.pf-st-mask`（`v-if="scrolled"`、高 `sbH`、色随暗黑 `dk ? '#162924' : '#EEF7F4'`、z40），`onPageScroll` 两态 `scrollTop>89`（=头图高−sbH 穿透点；该监听已去条件编译、三端生效，与仍在 `MP-WEIXIN` 块内的 onShow 分离）（2026-09-22 校准）；**不做组件**（StickyTop 实测宿主幻影副本＋遮罩不渲染，已删）
- **为什么本页不参与 #28 常驻导航栏（2026-09-22）**：#28 的动机是 Boss「子页面向下滑动后左上角的**返回按钮＋页面标题**必须常驻」，而本页是 Tab 页——稿面（Pencil Vtp9C）既无返回钮也无页面标题，只有一条状态栏带需要遮色，**没有「栏」可做**，故保留 `.pf-st-mask`（z40）。**原「已知代价」（onPageScroll 包在 `#ifdef MP-WEIXIN` 内、App／Web 端无遮罩）已消除**：`onPageScroll` 现已去条件编译、三端生效（见本页「TabBar 随滚动渐显」条），与其余三页口径一致（2026-09-22 校准）。

- 页底 `#EEF7F4`（稿面 10:6 实测，非首页的 `#F2FAF5`）；头图为实色 `#39AD95`＋导出波浪 `.header-wave`（CSS `background-color` 是纯色，稿面渐变色以实色底＋波浪图近似；`#5BC4AC` 全代码无出处，不作实现口径）（2026-09-22 校准）
- 今日热量卡 `#F7FCFA`；其余白卡 `#FBFDFD`；**达标 Banner＝白卡内嵌件**（真实嵌套进 `.cal-card`，
  卡内水平缩进 10px＋margin-top 13px，卡片在 Banner 下方仍留 14px 白底），非叠加悬浮件
- 进度条 1270/1800＝58.6%；柱 1-6 薄荷渐变（CSS 纯色近似）、柱 7 珊瑚渐变（近似）
- 趋势 7 柱全标日期（模板在 `v-for="barItem in bars"` 内对每柱渲染 `.bar-date`；`bars` 源自 `food.weekTotals`，日期取每日 `fmtMD`）（2026-09-22 校准）
- **深色模式（2026-09-21 Boss 指令第 5 项）**：根节点 `:class="{ 'page-dark': dk }"`（dk＝`settings.darkMode`），
  Tabbar 传 `:dark="dk"`；覆盖样式全部写在 `/* #ifdef MP-WEIXIN */` 块内用后代选择器——
  uvue 原生端不支持后代选择器，App 端适配时须改逐元素 :class。色板为薄荷深色**临时方案**
  （底 `#0E211C`／卡 `#162924`／内嵌 `#10201B`／chip `#1E3B33`／主文字 `#EAF9F3`／强调 `#52D6AC`／
  超标底 `#3A221C`＋字 `#FF8266`），Pencil 暂无暗色稿，待设计校准。开关在 Settings「深色模式」行。
  **P2 收尾（2026-09-22）**：暗里头图渐变改实色 `#162924`（`.page-dark .header`，隐光晕由覆盖块处理）、
  遮罩暗色同步 `#162924`；`syncBar()`（`uni.setNavigationBarColor` 深白/浅黑）于 onShow 调用，
  跨页保持状态栏字色与主题一致（App 端 plus.navigator 留 TODO）。
  验收：`.workbuddy/shots/audit/j1_profile_dark.png`（页体）＋ `j3_profile_dark_tabbar.png`（含 Tabbar 暗底）
  ＋ `p10_profile_{dark,light}_{0,120,bottom}.png`（P2 三档浅深对照）

## 踩坑（2026-09-21 Boss 三次反馈后定案）

- **「包裹」不能靠负 margin 模拟**：Banner 原为 `.cal-card` 兄弟节点＋`margin-top:-28px` 上提，
  Banner 实际高约 47px → 下半截必然悬出白卡底缘；后续补 `padding-bottom:30px` 只是少露一点，
  方向即错。设计稿语义＝Banner 是卡内嵌件，唯一正确解＝模板真实嵌套进卡片容器。
  验收证据：`.workbuddy/shots/audit/r21_profile_banner_nested.png` ＋ 2x 裁剪 `r21_crop_banner_wrap.png`
  （白卡圆角底边在 Banner 下方完整可见）。

## 边界与降级

- v-for 语义化命名（dayItem／barItem／recItem）；系统字体降级
- 趋势图为静态 view 柱，非 canvas，后续接真实数据时重算柱高即可
- **页底预留（2026-09-22 方案A动态避让）**：`.page padding-bottom` 升级为动态安全区全避让：无小白条基准 92px，带小白条机型（MP-WEIXIN）自动叠加 `calc(82px + env(safe-area-inset-bottom))`（实测 116px）。确保最近记录列表末行滚到底时完整展示于 Tabbar 悬浮胶囊上方，并留出 14px 呼吸间距。
- **~~TabBar 随滚动渐显（#29 续）~~ 已废弃（2026-09-22，Boss 拍板第 3 条）**：`tabFade` 删除，Tabbar 调用只留
  `active` 与 `:dark`；**`onPageScroll` 本页仍保留**，但只剩 `.pf-st-mask` 的 `scrollTop>89` 两态用途
  （去条件编译、三端生效这一事实不变，故上方「为什么本页不参与 #28」条里指向『TabBar 随滚动渐显』的引用改指本条）
- 暗态胶囊验收（2026-09-22 零窗口 automator）：`debug/shots/tab10_profile.png`（浅态，我的格激活 `#17916B`）
  ＋ `tab13_profile_dark.png`（暗态胶囊 `rgba(22,41,36,.72)` ＋ 气泡白 13%，验收后 `darkMode` 已还原 false）

## 与设计稿的对应

- 文案全对稿：老刘／128天／还可以吃530／1270·1800／今日已达标／4/7天／1580-1950柱／9月18超标+150
- 不一致：柱渐变用纯色近似；齿轮/返回等小图标用导出 PNG；Banner 箭头用导出图
