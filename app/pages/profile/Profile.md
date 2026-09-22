# Profile.uvue — 个人中心（v2 稿 P2 还原）

## 💡 核心思想

按 Ardot v2 稿（727788215940571 · 10:6）1:1 还原个人中心静态结构：渐变头图／今日热量卡／
达标 Banner（压卡 overlapping）／本周概览（七点）／热量趋势（柱状＋目标线）／最近记录 3 行／
共享 Tabbar（我的激活）。头图／数字／进度／周点／趋势／历史全部走 user＋goal＋food store；
种子精确还原历史（1950超+150／1720／1580）与趋势前 5 柱；周 badge 与 bar6-7 按真值走（见 progress 归档）。

## 💻 使用示例

`pages.json` 第二路由。首页 Tab「我的」`navigateTo` 进入；齿轮进设置页；本页 Tab「首页」`navigateBack`。

## 依赖

- user／goal／food store；`app/static/profile/*.png`（12 张设计稿导出）＋ Tab 图复用 `app/static/home/`

## 设计决策
- **滚动防穿透（2026-09-22 P1，Boss 拍板 B-lite）**：页末内联 fixed 遮罩 `.pf-st-mask`（`v-if="scrolled"`、高 `sbH`、色随暗黑 `dk ? '#162924' : '#EEF7F4'`、z40），`onPageScroll` 两态 `scrollTop>89`（=头图高−sbH 穿透点，与 onShow 同处 MP-WEIXIN 条件编译块）；**不做组件**（StickyTop 实测宿主幻影副本＋遮罩不渲染，已删）
- **为什么本页不参与 #28 常驻导航栏（2026-09-22）**：#28 的动机是 Boss「子页面向下滑动后左上角的**返回按钮＋页面标题**必须常驻」，而本页是 Tab 页——稿面（Pencil Vtp9C）既无返回钮也无页面标题，只有一条状态栏带需要遮色，**没有「栏」可做**，故保留 `.pf-st-mask`（z40）。**已知代价**：`onPageScroll` 仍包在 `#ifdef MP-WEIXIN` 内，App／Web 端滚动时状态栏带无遮罩（与其余三页去条件编译后的口径不一致），待暗色稿到位后统一处理。

- 页底 `#EEF7F4`（稿面 10:6 实测，非首页的 `#F2FAF5`）；头图渐变 `#5BC4AC→#39AD95`＋导出波浪
- 今日热量卡 `#F7FCFA`；其余白卡 `#FBFDFD`；**达标 Banner＝白卡内嵌件**（真实嵌套进 `.cal-card`，
  卡内水平缩进 10px＋margin-top 13px，卡片在 Banner 下方仍留 14px 白底），非叠加悬浮件
- 进度条 1270/1800＝58.6%；柱 1-6 薄荷渐变（CSS 纯色近似）、柱 7 珊瑚渐变（近似）
- 趋势日期只标前 4 柱（9/12-9/15），与稿面一致
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
- **页底预留 40px（2026-09-22 #29 配套，Boss 拍板「缩页底预留位」）**：原 78px → 40，让最近记录列表末行常态穿到玻璃 Tabbar 之下，
  玻璃才有东西可透（浅色页底近白，透感弱；暗态透感明显）。取舍与像素取证见 `components/Tabbar.md`
- **TabBar 随滚动渐显（2026-09-22 #29 续，Boss 点名 scroll-fade-navbar 效果）**：`onPageScroll` 里除 `scrolled` 外再算 `tabFade`
  （`scrollTop/60` 夹 0~1、0.05 量化）透传给 Tabbar；**该监听原包在 `#ifdef MP-WEIXIN` 内，现去条件编译三端生效**，
  顺带补上 App／Web 端滚动时 `pf-st-mask` 不响应的既有缺口（该缺口此前记在案，未真机验证）

## 与设计稿的对应

- 文案全对稿：老刘／128天／还可以吃530／1270·1800／今日已达标／4/7天／1580-1950柱／9月18超标+150
- 不一致：柱渐变用纯色近似；齿轮/返回等小图标用导出 PNG；Banner 箭头用导出图
