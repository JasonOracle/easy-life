# AddFood.uvue — 公共添加食物弹窗

> 变更记录：
> - 2026-09-23（Gemini 系列）：剥离外层 page-container，改为内容视图嵌入 FoodPicker 单流程，外层加 scroll-view 支持自如滚动；90deg 渐变与字重 bold 规范化；清理 sealPop 动画。
> - 2026-09-23（OpenCode / Gemini 底层）：按指令清除甜度切换、餐次卡片、步进变更、蒙层关闭与确认保存中的触觉震动(vibrateShort/vibrateLong)，避免微信模拟器窗口剧烈抖动，待后续按需开启。
> - 2026-09-22（Gemini 系列）：移除顶部伪手势横杠（.af-handle）；右上角新增统一 32px 圆形关闭按钮（.af-closebtn）；底部确认按钮升级 fluid-interaction-expert 弹性阻尼按压反馈（.btn-capsule-pressed）；底部追加动态安全区避让（calc(24px + env(safe-area-inset-bottom))）。
> - 2026-09-22（Gemini 系列）：接入 selected-card.mp3 音效，在用户切换甜度（pickSweet）和切换餐次卡片（pickMeal）时提供轻快干脆的听觉确认。

## 💡 核心思想

pencil 弹窗①–⑥⑧ 的统一结构：茶饮有甜度电量条，咖啡有糖包/糖浆底槽，其余只有分量＋餐次。
计件类（个／片／串）分量区走步进器（**不展示计量单位图**，Boss 拍板；弹窗⑧ 亦无「分量」标题），
其余走器皿底槽（同族一张图按档位 scale 0.60/0.80/1.00）；砝码类按「颗数=份数」渲染；
餐次四照片卡（设计稿**实拍图** sky_*.png＋名称水平居中单行，2026-09-21 Boss 定案：稿面无时间段行，已删）；
选项切换与餐次点击均触发 `card` 听觉反馈；
确认只组装 payload emit，不写库（Boss 决策）。

## 💻 使用示例

```html
<AddFood v-model:show="addShow" :food-id="addFoodId" @confirm="onConfirm" @change="onChange" />
```

payload：`{foodId, amount, unit, meal, sweets, extraKcal, kcal}`。
`change`＝点「更换」，宿主页关本弹窗并唤起 FoodPicker 以 `selectedId` 回显。

## 依赖

- food store（`getFoodById`／`vesselSizesOf`／`optGroupsOf`／`optDeltaOf`／`gramsOf`）
- OptionTray／CountStepper；器皿图 `app/static/vessels/`（`VESSEL_ART` 元数据表带
  natW/natH 原始比例、contact 接触宽、solid 实心素材、unitFixed 按份计数标记）；
  餐次图 `app/static/meals/`；更换钮图标 `app/static/common/change_icon.png`（Pencil @4x 导出）
- 被首页依赖：FAB → 弹层⓪ FoodPicker 选食物 → 本弹窗

## 设计决策

- 数据核查（2026-09-21，353 条）：**sweet 甜度组仅 6 条茶饮**（珍珠奶茶/芝士奶盖茶/水果茶/柠檬茶/杨枝甘露/烧仙草）；
  咖啡 4 条（美式/拿铁/卡布奇诺/速溶）为 sugar_pack/syrup_pump 单选组，走通用 OptionTray；
  multi 加料本轮不渲染（pencil ① 无此区）
- 甜度「10 格电量」内联实现（不拆组件）：格数映射 `SWEET_BARS{none:0,light:3,half:5,less:7,full:10}`
  为展示层口径（三分/五分/七分/全糖的语义），热量仍按 `optDeltaOf` 实际克数缩放计算；
  选中白胶囊=绝对定位 left 百分比位移（段不动只动胶囊，240ms）＋条高 13→15
- 头部副行=每 100 单位热量（计件类=每单位）；「已按 X 计算」右对齐三段文本，步进器变体带「约 Ng」
- 蒙层中性黑 rgba(0,0,0,0.5)（Boss 拍板，与 FoodPicker 统一）；2026-09-22 起为 page-container 原生蒙层
- **弹层壳＝原生 page-container**（2026-09-22 迁移，同 FoodPicker 模式）：position=bottom＋原生蒙层＋拦截系统返回；
  与 FoodPicker 的差异：**本弹窗内容高度随食物动态**（甜度组/步进器有无不定），故容器 `custom-style` 只设
  `background-color:transparent`，白卡圆角仍由 `.af-sheet` 自带，容器随内容自适应（实测渲染正确）；
  `@clickoverlay` 回传关闭＋`@afterleave` 兜底
- 砝码单颗固定 33×30，小份/一份/大份=1/2/3 颗（pOYw3 钩子：只变颗数不变单体，实心素材压暗 0.85）
- 确认钮渐变胶囊文案「添加到X餐 · N kcal」；稿上的白色食物小图标**未接**
  （353 条食物无行图标映射规则，待 Boss 定，见 progress 遗留）
- 默认餐次按当前小时推断；「更换」钮只 emit `change` 不自行开列表（避免弹窗叠弹窗）
- 餐次卡按稿面量取重建（2026-09-21，pencil nURQn 逐节点测量）：卡 77×96 r16、间距由
  space-between 自然成 9；名称 12px **水平居中单行**（稿面 w25 @x26，top:65.5；选中 700 纯白／未选中 500 白72%）；
  未选中黑 72% 压暗层＋全卡底部衬度渐变
  （180° #0A4F3D 0%@32→85%@100）；选中卡薄荷外描边 1px＋抬升 4px＋薄荷印章 24×24
  （白描边 2.5）悬出右上（top:-10/right:-12，sealPop 260ms 回弹）；
  照片必须用设计稿实拍图 `app/static/meals/sky_*.png`（自生成图替代被 Boss 打回）
- 甜度组标题只写「甜度」（Boss 圈删「· 10 格电量」提示；电量条图形本身保留）

## 边界与降级

- 未知 foodId 整单不渲染；单档 vessel（B 族玻璃器皿）底槽仅一项且默认选中
- 器皿图缺失（`VESSEL_ART` 未覆盖）退化为纯文字段
- pieceWeight=0 的计件类「已按」行省略「约 Ng」段

## 踩坑（2026-09-21 Boss 实拍定案）

- **组件类名必须带 `af-` 前缀**：mp-weixin 端同名类跨文件互相污染——Home 的 `.meal-row{height:40px}`
  把本组件 96 高餐次行压成 40（加 flex-shrink:0 也无效，真因是选择器冲突）。
  `.mask/.sheet/.handle/.meal-*` 已全部改 `af-` 前缀；FoodPicker=fp-／GoalModal=gm-／FoodToast=ft-。
- **甜度白胶囊勿用 top+bottom 拉伸**：`position:absolute; top:6; bottom:6` 在小程序端渲染高度失控、撑出底槽；
  改 `.sweet-seg{height:66}`＋`.sweet-pill{height:70; top:6}` 显式尺寸。
- **sheet 子项必须显式 `flex-shrink:0`**：mp-weixin 端弹层内容超高时子项被等比压扁
  （餐次卡 96→40、确认钮 52→43），uvue 全局 `view{overflow:hidden}` 也会裁掉
  餐次卡右上角外置印章（top:-9）。修复＝各块 `flex-shrink:0`＋`.af-meal-card{overflow:visible}`。
- **uvue 写 border 必须补 `border-style: solid`**（2026-09-21 印章实拍定案）：uvue 原生端默认 solid，
  但编译到 mp-weixin 走标准 CSS（默认 none）——只写 width/color 时边框整体不渲染，
  薄荷印章的 2.5px 白环消失后与白底sheet相接，视觉上被误判成「菱形/裁切」。
- **印章悬出卡上缘仍被 row 裁切**：`.af-meal-card{overflow:visible}` 不够，裁切发生在 `.af-meal-row`
  （全局 view overflow:hidden）。双保险＝row 加 `overflow:visible` ＋ 上/右 14px padding 负 margin
  （把印章纳入 row 裁切框同时卡位不变）。
- **微信工具样式缓存可能冻结**：改 wxss 后 `simulator_refresh`＋`cli cache --clean compile/file/session`
  全部 success 但运行时仍是旧样式（本轮 21:16 版 wxss 冻结三次刷新不松）；
  **零窗口解法＝automator `mp.evaluate(()=>wx.restartMiniProgram({path:'/pages/home/Home'}))`**，
  强制小程序实例重建＋bundle 重载，实测一次生效。
- 光晕/落地影两连坑见 `components/OptionTray.md`。

## 与设计稿的对应

- pencil 弹窗①NUEJF（奶茶+甜度）／②nURQn（米饭碗）／④B51pW（咖啡两档杯）／⑤v9Ruwg（橙汁两档瓶）／
  ⑥u1vpbN（番茄牛腩锅码多颗）／AtxDr（吐司步进器，无分量标题）；
  选中态公式与动效=pOYw3；步进器规格=smBjH；器皿家族=对照A/B/C/D
- 餐次卡实拍图＝设计文档内同源文件 `images/sky_{breakfast,lunch,dinner,night}.png`
  （弹窗①② 卡片 Photo fill 与「餐次图标设计」ZL2sa 一致），已拷入 `app/static/meals/sky_*.png`；
  旧自生成 `meal_*.png` 已停用（文件暂留待拍板删除）
- 稿面餐次卡精确事实（2026-09-21 nURQn/NUEJF 量取）：卡 77×96；层序 Photo→Dim(黑72%,仅未选中)→Scrim(渐变)→名称；
  名称 text w25 @x26 水平居中 y65.5，字号 12；**稿面无时间段行**（2026-09-21 Boss 拍板删除）；
  选中卡上移 4px（y10 vs 14）＝现有 translateY(-4px)
- 不一致：确认钮无图标；餐次卡未做「蒙版 0→72% 淡入」过渡（终态已按稿）；电量条胶囊用 left 过渡非 transform
