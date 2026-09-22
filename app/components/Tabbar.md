# Tabbar.uvue — 共享底部 Tab

## 💡 核心思想

v2 稿只有两 Tab（首页／我的，加号在右上，不存在 midbutton 问题），做成共享组件供两页复用，
保证视觉与行为一致。切换用 `redirectTo`（不堆栈）；图标 `:src` 运行时绑定。

## 💻 使用示例

```html
<Tabbar active="home" :fade="tabFade" />
<Tabbar active="profile" :dark="dk" :fade="tabFade" />   <!-- dark 可选：个人中心深色模式随动 -->
```

`fade`（0~1）由页面 `onPageScroll` 驱动＝随滚动渐显；不传＝满玻璃常开。

## 依赖

- `app/static/home/home.png` / `home-selected.png` / `center.png` / `center-selected.png`（Boss 2026-09-22 换成矢量 PNG，**未激活＝单色线、激活＝薄荷描边**，组件只做路径切换不改图）；被 Home／Profile／Records 引用
- `stores/device`（`backdropBlur` 决定玻璃态是否挂类、`haptics` 决定切 Tab 触觉）

## 设计决策

- 不用原生 tabBar（要 1:1 白底＋顶线＋指定字色，原生定制不足）
- 非激活页图标不变色（稿面只给单态图），仅标签变灰
- `dark` prop 由页面显式传入而非组件自读 settings：Records 页也引用了本组件，但深色范围
  Boss 只批了个人中心——组件不自行决定主题归属
- **液态玻璃（2026-09-22 #29，Boss：「我本来就想做成毛玻璃或者液态玻璃样式」）**：
  底＝`glass-bg` token `rgba(255,255,255,.74)`（**不可丢 alpha**）＋ `backdrop-filter: blur(24px) saturate(180%)` ＋
  上缘高光描边 `rgba(255,255,255,.8)` ＋ 顶部白色折光渐变（0%→45% 淡出，做「玻璃厚度」错觉）＋ 向上柔影 `0 -6px 20px rgba(10,79,61,.10)`；
  暗态同构（底＝卡色 token `#162924` 加 alpha 到 `.72`，高光线白 10%，柔影改黑 .30）。
  **玻璃类 `.tb-glass` / `.tb-glass-dark` 只在 `device.backdropBlur` 为真时挂**（low 档关模糊 → 回退基样式的不透明底），
  且 `backdrop-filter` 本体包在 `#ifdef MP-WEIXIN` 内——**App 原生端是否支持未真机验证（AGENTS.md 已知风险），届时按逐元素 :class 方案处理**
- **随滚动渐显（2026-09-22 #29 续，Boss：「我想要的 tabbar 是 scroll-fade-navbar 那种效果」）**：
  玻璃底由「常开」改为**随页面滚动线性渐显**，照官方示例 `hello-uni-app-x` 的 `pages/template/scroll-fade-navbar`（「随滚动渐显的透明导航栏」）。
  接口＝新增 `fade` prop（0~1，缺省 1＝满玻璃）；组件内 `barStyle` computed 把**五项同驱**：底 alpha（浅 `.74×f`／暗 `.72×f`）、
  顶部折光渐变、上缘高光描边、向上柔影、`backdrop-filter` 模糊半径（`blur(24×f px)`）——`fade=0` 时整条栏完全透明，只剩图标与文字。
  **满值仍是 DesignTokens 原值，未自创色**；fade 只改透明度不改色相，故不触「不许自创染色」红线。
  **驱动方＝页面**（`onPageScroll` 算 `tabFade` 透传）：阈值取 **60px** 而非示例的 100，因实测 Records 页最大滚动只有 70px，
  用 100 该页永远到不了满玻璃；按 0.05 量化（整段最多 20 次 setData，绝不逐帧写）。
  **low 档（`backdropBlur=false`）不吃 fade**：`barStyle` 直接返回空对象，恒用 `.tabbar` 不透明底——透明栏在低端机文字压内容上不可读，可读性优先。
  App 端 `backdrop-filter` 是否支持仍未真机验证（fade 的底／影是普通 CSS，不受影响）
- **实测取证（数据层，`debug/fade_check.js` 读子组件 `$scope.data` 的内联 style 串）**：
  Home／Records／Profile 三页在 scrollTop 0／30／150 分别回吐 `rgba(255,255,255,0.000)→0.370→0.740` 与 `blur(0px)→12px→24px`；
  暗态 Profile 为 `rgba(22,41,36,0.000)→0.360→0.720`（验证后 `darkMode` 已还原 false）
- **已知观感代价（待 Boss 定）**：`fade=0` 时「首页／我的」图标与文字直接压在页面内容上（Records 顶部压食物图、Profile 暗态压最近记录行）。
  这是示例的原教旨行为；若要保底，可给 fade 设下限（如 0.2~0.25）或让渐显延后若干像素再起（20→80），两者都属观感调整，AI 不擅自改
- **实测取证（像素级）**：暗态玻璃带内自上而下 `(39,59,54)→(17,40,34)`，与 `rgba(22,41,36,.72)` 压在暗页底 `#0E211C` 上的理论值 `(20,39,34)` 吻合，
  且带上缘明显被身后白卡抬起变亮 ⇒ **半透＋穿透成立**；浅色态因页底与卡片同为近白，观感偏「干净的白条」
- **浅色态可见度：Boss 2026-09-22 拍板「缩页底预留位」**（四选一里选的那条，不动 alpha）：三页底部预留由 78／90 压到 **40**
  （Home／Profile 的 `.page padding-bottom`、Records 的 `.lr-bottom-space`），让内容常态穿到栏（实测高 ≈76）之下，玻璃才有东西可透。
  **实测代价（必须知道）**：滚到底时页面最后 **约 36px** 内容永久停在玻璃带下——可读性受损但可点（上半截仍可命中），
  像素取证见 `debug/glass_probe.js`：Home 玻璃带 x=50（薄荷图标穿到栏下处）`(246,253,250)` vs x=200（纯页底）`(252,254,253)`，
  色差真实但仅 ~6 级 ⇒ 浅色态仍是「微弱透」，若 Boss 要更强观感，正解是降 alpha／加薄荷染色，而不是再缩预留位
- **切 Tab 补 L1 反馈**（AGENTS.md 交互铁律：切 tab＝图标跳动＋`vibrateShort`，原实现零反馈）：现按 `device.haptics` 门控＋try/catch 降级；**图标跳动动画仍缺**

## 边界与降级

- 点击当前页无操作；`redirectTo` 失败（如路由缺失）静默停留
- `backdropBlur=false`（low 档）→ 不挂玻璃类，走 `.tabbar` 不透明底 `#F8FCFA`（暗态 `#10201B`），文字对比度不受影响

## 与设计稿的对应

- v2 10:333：BG `#F8FCFA` h78／顶线 `#E3EFE8`／图标 29×27·25×25／字 11px（激活 `#17916B`／灰 `#5C7570`）
  —— **玻璃底为 Boss 2026-09-22 口头新增，稿面尚无（无暗色稿、无玻璃稿），色值全部取 DesignTokens 的 glass-bg／card 两个 token，未自创**
- 深色态（2026-09-21 临时色板，无稿）：BG `#10201B`／顶线 `#1E352F`／激活 `#52D6AC`／灰 白@50%；
  MP-WEIXIN 条件编译后代选择器实现，App 端不支持（届时改逐元素 :class）
- 不一致：Home Indicator 为系统条，不自绘；底部 `padding-bottom` 仍写死 20px，**未接 `--uni-safe-area-inset-bottom`**（组件根节点已带该 CSS 变量，真机刘海屏待验后再改）
