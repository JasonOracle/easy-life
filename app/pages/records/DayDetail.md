# DayDetail — 单日详情页

## 用途
查看某一天的完整饮食记录：今日热量大卡（大数字/进度环/能量条/营养分布）+ 按餐次分组的记录行 + 今日饮食总结条。
记录行**长按 → uni.showActionSheet 底部菜单「删除这条记录」**（Boss 拍板的删除交互）。

## 依赖
- **Store**：`useFoodStore`（`viewDay` 查看日、`entries`、`dayRange`、`amountText`、`removeEntry`、`addEntry`）、`useGoalStore`
- **子组件**：`FoodPicker / AddFood / SettleBadge`（「添加食物」复用首页同款链路）
- **资产**：`static/records/dd_add.png`（添加食物＋号）、`dd_sum.png`（总结嫩芽）、`lr_back.png`、`lr_meal_*.png`；
  火焰复用 `static/profile/flame.png`，宏量图标复用 `static/home/macro_*.png`
- **入口**：Records 页「查看详情 / 查看全部」（跳转前写 `food.viewDay`；空则回落今日）

## 设计决策
- **常驻导航栏（2026-09-22 #28，Boss 拍板「子页面下滑后左上角返回钮＋标题必须显示，三端都固定在顶部」）**：P1 的「`.dd-st-mask` 遮罩 ＋ `.dd-fx-back` 裸返回钮」两件套合并为**一条整栏** `.dd-nav-fixed`（页内内联 fixed，z45，高 `sbH+58`，`paddingTop=sbH`，底色取头图渐变末色 `#39AD95` ＋ `0 2px 10px rgba(10,79,61,.10)` 投影），内含 44×44 返回热区（`lr_back.png` 18×18）＋白色粗体 17px 日期标题（`headerTitle`，与头图同源），滚动跨阈后与头图无缝接续。`onPageScroll` 两态 `scrollTop>40` 已**去条件编译**（三端共用），跨阈才写 ref；注意页内头图仍有一个同名不同元素的 `.dd-nav` 行（文档流），二者非同一节点；**不做组件**（StickyTop 实测宿主幻影副本，已删）
- **只渲染有记录的餐次卡**（稿面夜宵 1 行卡 122 高＝`122 + 46*(行数-1)` 公式），空餐次不占位
- **进度环 MP 端 conic-gradient**（SettleBadge 已验证通路）：外环 72 轨道 `#E5F1F0`，进度 `#3AC39A→#009B7A`，
  内孔白圆盖孔；App 端 canvas 未接 → 真机待验，文档不宣称双端支持
- **能量条与 Records 汇总卡同一算法**：轨道 = max(总量, 目标)
- **长按删除**＝`@longpress` → `uni.showActionSheet({itemList:['删除这条记录']})` → success 里 `removeEntry(id)` + `vibrateShort`；
  不做自定义弹层（Boss 原话「长按 uni.showActionSheet …加个删除选项就行了」）
- **营养分布数值取整**（稿面 68g/248g/62g 为整数），三列 `justify-content: space-between` + 1px 分隔线
  （分隔线严禁 `flex:1`——会被拉成灰块，本轮实拍踩坑）
- **总结条文案为稿面固定文案**：「继续保持，明天会更好！」按稿直出，不擅自做按超标态变文案的逻辑（要做得 Boss 拍板）
- **类名 `dd-` 前缀**；Header 高度 `sbH+108` 写 :style（border-box 坑同 Records）

## 边界与降级
- `viewDay` 为空/非法 → 回落今日
- 超标 pill：仅超标时出现；未超标整行隐藏
- 无记录日：热量卡显 0 / 环 0%，餐次区整段为空（稿面无空态设计，暂不补插画——避免设计幻觉）
- 从往日期「添加食物」：记录仍写入当前时刻（今日），查看日列表不因此变化——语义与首页一致，如需「补录到查看日」待 Boss 拍板

## 与设计稿的对应
- Pencil `VEWYt`「单日详情」（375×1325.6，原生滚动），逐节点量取：Header `P1xTZv`、今日热量卡 `Gk5fA`、
  餐次卡 `ukFvF/rk7nx/Up9Rp/WYLli`、总结条 `JpExx`、添加食物 `kJ73b+L4I2dj`
- 验收（2026-09-21 模拟器实拍 `.workbuddy/shots/audit/i3_daydetail.png / i4_actionsheet.png / i5_after_delete.png / i7_dd_picker.png`）：
  页面渲染/96% 环/营养分布三列 ✓；「添加食物」拉起 FoodPicker ✓；长按后整页压暗＝原生 ActionSheet 已弹出 ✓
- **待人工复核**：ActionSheet 选项「删除这条记录」的点击落在原生层，automator 坐标 tap 命中不了模拟器原生弹层，
  删除回调（removeEntry→落库→列表刷新）需 Boss 人工点一次或真机验证
