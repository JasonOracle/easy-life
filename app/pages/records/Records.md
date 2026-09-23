# Records — 最近记录页（一级 Tab「日历」）

## 用途
一级 Tab「日历」：月历 + 选中日汇总，查看过去饮食记录。绿色渐变 Header、月历卡（记录圆点/超标红点/选中渐变 pill/今日浅 mint pill）、
选中日汇总卡（火焰总量/超标 pill/目标刻度能量条）、三餐摄入四小卡、主要食物四卡。

## 依赖
- **Store**：`useFoodStore`（`entries` / `dayTotals` getter / `dayKeyOf` / `dayRange` / `viewDay`）、`useGoalStore`（目标线）
- **子组件**：`Tabbar.uvue`（`active="records"`＝三槽胶囊中间格「日历」）
- **资产**：`static/records/lr_{prev,next,chev}.png` + `lr_meal_{breakfast,lunch,dinner,snack}.png`
  （Pencil bTPUq 图标节点 @4x 透明导出）；火焰复用 `static/profile/flame.png`；食物图复用 `static/icons/<catKey>/<id>.webp`
  （`lr_back.png` 随返回钮退役，文件仍在素材目录未删）
- **入口**：底部 TabBar「日历」格（一级 Tab，`redirectTo`）、首页目标 Pill 日历图标（Home `.pill-cal`）、
  个人中心最近记录「查看全部」（Profile `.head-right` 第三个）——后两者 2026-09-22 起也改 `redirectTo`
- **出口**：「查看详情 / 查看全部」→ `uni.navigateTo('/pages/records/DayDetail')`（跳转前写 `food.viewDay`）

## 设计决策
- **常驻导航栏（2026-09-22 #28，Boss 拍板「子页面下滑后左上角返回钮＋标题必须显示，三端都固定在顶部」）**：P1 的「`.rec-st-mask` 遮罩 ＋ `.rec-fx-back` 裸返回钮」两件套合并为**一条整栏** `.rec-nav`（页内内联 fixed，z45，高 `sbH+58`，`paddingTop=sbH`，底色取头图渐变末色 `#39AD95` ＋ `0 2px 10px rgba(10,79,61,.10)` 投影），内含 44×44 返回热区（`lr_back.png` 18×18）＋白色粗体 17px 标题「最近记录」，滚动跨阈后与头图**无缝接续**。`onPageScroll` 两态 `scrollTop>40` 已**去条件编译**（小程序/App/web 三端共用），跨阈才写 ref 以免逐帧 setData；头图内原有返回钮保留（未滚动时随内容滚走）；**不做组件**（StickyTop 实测宿主幻影副本，已删）
  ↳ **2026-09-22 胶囊化后本条仅「整栏」部分仍生效**：返回热区与头图返回钮已随「升为一级 Tab」全部删除，见下条
- **页面间传日走 store（`food.viewDay`）而非 URL 参数**：uvue 页面对 `getCurrentPages().options` 的类型在双端不一致，store 零风险
- **月历列＝7 个 `flex:1` 单元格**：列心 24.79+i*49.57 与稿面逐像素一致，避免硬编码 49.57 小数宽
- **网格 5 或 6 行**：先补满 42 格，末行整行出月则裁掉（稿面 2025 年 9 月恰 5 行）；前置/后置出月日号 `#C6D6CE` 无圆点
- **圆点三态**：`>目标 → #FB5D37`、`>0 → #1FBF8F`、选中日白点（无记录则不显）；色值取自稿面 Dot 节点实测，
  超标珊瑚用稿面 `#FB5D37` 而非 DesignTokens 的 `#FF9E7D`（稿面即事实来源）
- **选中 pill 用绝对定位垫底**（top:-9，34×36 r11，渐变 `#45C4A2→#0A7A5C`）：数字/圆点保持流内，pill 只做背景；
  父链 `.lr-cell/.lr-drow/.lr-cal` 全部 `overflow:visible`（全局 `view{overflow:hidden}` 会裁掉 -9 上缘）
- **能量条**：轨道 = `max(当日总量, 目标)` 满轨，绿色段到目标位、珊瑚段为超出、白刻度钉在目标位置（稿面 1950/1800 例：绿 291 + 珊瑚 24 + 刻度 290 复算一致）
- **Header 高度 = sbH + 108 写在 :style**：uvue/mp `height` 为 border-box，写 CSS 固定值会被 paddingTop 吃掉（本轮实拍踩坑）
- **类名 `lr-` 前缀**：mp-weixin 组件类名跨文件冲突铁律

## 边界与降级
- 选中日无记录：汇总卡显 0、三餐卡显 0 kcal 0 项、主要食物区显「这一天还没有记录」
- 未超标：超标 pill 整体 `v-if` 隐藏（稿面只有超标态）
- 点出月日期：选中并自动翻到该月
- Header 光晕/弧线：稿面为 radial 渐变椭圆，App 端 radial-gradient 未真机验证 → 用半透明白 ellipse 近似（降级方案）
- **常驻导航栏无返回钮（2026-09-22 胶囊化，Boss 拍板第 4 条）**：本页升为一级 Tab 后，跨阈出栏＝末色底＋标题「最近记录」，
  44×44 返回热区与 `goBack` 一并退役（一级 Tab 无返回语义）；头图左上返回箭同删，`.lr-navtxt` 的 `margin-left` 归零。
  栏标题保留稿面「最近记录」，Tab 文案用「日历」（Boss：「视具体 UI 而定，优先保证一级 Tab 的独立性」）
- **页底预留（2026-09-22 方案A动态避让）**：`.lr-bottom-space` 升级为动态安全区全避让：无小白条基准 92px，带小白条机型（MP-WEIXIN）自动叠加 `calc(82px + env(safe-area-inset-bottom))`（实测 116px）。确保「主要食物」卡片滚到最底端时完整展示于 Tabbar 悬浮胶囊上方，并留出 14px 呼吸间距。
- **~~TabBar 随滚动渐显（#29 续）~~ 已废弃（2026-09-22）**：`tabFade` 与 0.05 量化整段删除，`onPageScroll`
  只留 `rec-nav` 的 >40 两态阈值。留档一条实测事实仍有用：**本页最大滚动只有 70px**

## 与设计稿的对应
- Pencil `bTPUq`「最近记录」（板 727788215940571 同组），逐节点量取：Header `k8TS5`、CalCard `mUXLj`、
  SumCard `f2EPgc`、餐次小卡 `oOMaa/jMv0T/ORWAt/bjRNa`、食物卡 `ARxS8/SCwy2/lsyBw/ZCGIH`
- 验收（2026-09-21 模拟器实拍 `.workbuddy/shots/audit/i1_records.png / i2_records_pick.png`）：
  首页日历图标→本页 ✓；点日期格选中态迁移 + 汇总卡联动（9/21→9/19）✓；查看详情→DayDetail ✓；个人中心入口 ✓
- 升一级 Tab 后复验（2026-09-22 零窗口，automator）：`debug/shots/tab9_records.png` ＝ 头图无返回箭、
  跨阈栏仅标题、胶囊中间格「日历」显激活色 `#17916B` ✓；由胶囊「首页」格 tap 回 Home 亦通过
- 不一致处：稿面演示数据为 2025 年 9 月，本页按真实系统日期渲染
