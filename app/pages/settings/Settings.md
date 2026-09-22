# Settings.uvue — 设置页（Pencil 稿 T0IUr 还原）

> 变更记录：
> - 2026-09-23（OpenCode / Gemini 底层）：按指令清除切换深色模式开关(toggleDark)时的 vibrateShort 触觉震动，避免微信模拟器窗口剧烈抖动，待后续按需开启。

## 💡 核心思想

按 Pencil 最新稿「Settings 设置」画板 T0IUr（375 宽 = App 逻辑 px 1:1）还原设置页：
渐变头图（光晕＋双白弧＋裸返回箭＋标题/副题）／偏好组／目标管理组／数据管理组／
本机声明／危险区独立卡／页脚。深色模式行接 `settings.darkMode` 真实切换；
目标管理行接 goal store 读数并可开 GoalModal。

## 💻 使用示例

`pages.json` 第三路由。个人中心齿轮 `navigateTo` 进入；返回钮 `navigateBack`。

## 依赖

- 静态资源 `app/static/settings/*.png`（行图标×6＋trash＋shield＋chev_back＋leaf）
- 行右箭头复用 `app/static/home/chev_right.png`
- store：`settings`（darkMode 开关）、`goal`（目标读数）

## 设计决策
- **常驻导航栏（2026-09-22 #28，Boss 拍板「子页面下滑后左上角返回钮＋标题必须显示，三端都固定在顶部」）**：头图仍随内容滚走；P1 的「`.set-st-mask` 遮罩 ＋ `.set-fx-back` 裸返回钮」两件套合并为**一条整栏** `.set-nav`（页内内联 fixed，z45，高 `sbH+58`，`paddingTop=sbH`），内含 44×44 返回热区（`chev_back.png`）＋白色粗体 17px 标题「设置」；**底色随暗黑**：`:style` 里 `backgroundColor: dk ? '#162924' : '#39AD95'`（浅色＝头图渐变末色，与滚走的头图无缝接续；深色＝暗黑临时底）。`onPageScroll` 两态 `scrollTop>40` 已**去条件编译**（三端共用），跨阈才写 ref；返回走原 `goBack`；**不做组件**（StickyTop 实测宿主幻影副本，已删）

- **整页暗黑（2026-09-22 P2，Boss 拍板范围仅设置＋个人中心）**：根节点 `:class="{ 'page-dark': dk }"`，
  `/* #ifdef MP-WEIXIN */` 后代覆盖块换全套色（页底 #0E211C／卡 #162924／chip #1E3B33／文字三级／
  分隔线／开关底／危险区珊瑚 #FF8266）；暗里头图渐变改实色 #162924＋`.hd-glow` 隐去；
  `syncBar()`＝`uni.setNavigationBarColor` 深白/浅黑，onShow＋toggleDark 后双调用（App 端 TODO）；
  验收 `.workbuddy/shots/audit/p10_settings_{light,dark}_{0,120,bottom}.png`

- 头图按 T0IUr 量稿重建：竖渐变 `#5CC4AC→#39AD95`；光晕＝445×238 椭圆径向白 50%→0 @(24, sbH−170)；
  双白弧＝600×260 白 8% @(−112, sbH+69) ＋ 300×150 白 6% @(196, sbH+91)（稿面底部波浪带即此二弧，
  **不用波浪贴图**：模拟器端该 image 恒渲染为不透明薄荷色帽遮盖渐变，且稿面底缘本为直线）；
  头图总高 `sbH+113`（稿 140 含 27 状态栏）
- 返回钮＝44px 透明热区＋6×10.5 裸白箭（chev_back.png），不再画白圆底
- 标题 18/700 白 @(36, sbH+19)；副题 11 白 80% @(36, sbH+47)
- 白卡 `#FCFFFF` r23；危险卡白底＋珊瑚描边 `#FBA095`
- 行图标按 y 坐标归属：moon-T1／bell-T2／target-T3／mega-T4／down-T5／up-T6／leaf-页脚

## 边界与降级

- 系统字体降级；v-for 未使用，无 r 坑；头图装饰全为 CSS 渐变/圆角椭圆，无图片依赖

## 与设计稿的对应

- 文案全对稿：深色模式／用餐提醒＋即将上线／每日热量目标1800／自定义餐次／导出·备份到本地／
  导入·从文件恢复／所有数据仅保存在本机／清空所有数据／轻律生活 CalTrack／v1.0.0
- 头图几何逐节点对齐 T0IUr（换算 `top_app = designY − 27 + sbH`）；验收截图
  `.workbuddy/shots/audit/k5_settings_header.png` 对照稿面导出 `T0IUr.png`
- 不一致：稿面光晕/弧为矢量椭圆，实现用 border-radius:50% ＋ radial-gradient 近似，边缘衰减略异
