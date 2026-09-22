# GoalModal — 每日热量目标弹窗

## 用途
底部弹窗，用户调整每日热量目标（1200–2400 kcal，步长 100）。含横向滑条 Dial 卡（−/＋ 步进钮、拖拽、刻度）、快速选择槽、保存钮。

## 依赖
- **Store**：`useGoalStore`（读 `calorieGoal`，父组件收 `@save` 后调 `setGoal`）
- **父组件**：
  - `Settings.uvue`（设置页「每日热量目标」行，`v-model:show` + `@save`）
  - `Home.uvue`（首页目标 Pill 铅笔图标 `.pill-edit` → `openGoal()`，2026-09-21 Boss 拍板新增入口）
- **资产**：`app/static/goal/gm_{target,close,minus,plus,bulb,chev}.png`（Pencil qnNST 图标节点 @4x 透明导出，严禁自生成替代）

## 设计决策
- **整卡重建为横向滑条**（2026-09-21，Boss 拍板「整卡重建吧」）：旧版圆环 Dial（canvas/conic 双实现）全部废弃，
  按 Pencil `qnNST` 量取重建 — 稿面本就是 Track 直条，圆环属于当年误读
- **类名 `gm-` 前缀**：mp-weixin 端同名类跨组件文件污染（`.mask/.sheet/.chip/.title` 等互覆），全量前缀化
- **滑条几何来自稿面**：Dial 卡内 Track 左缘 x48、宽 239、高 8 r4 `$line #DCEDE6`；Fill 为 mint 渐变（90deg `#7DEBC7→#1FBF8F`）；
  Thumb 20×20 白底 3px 实线 `$mint`（border 必带 style，见 AGENTS 已知风险）
- **拖拽坐标换算**：touch `clientX − Dial 卡页面左偏移 − TRACK_X`；Dial 左偏移在 `show` 变 true 后
  `nextTick + createSelectorQuery().in(instance.proxy)` 查询一次；查询失败置 −1 **仅禁用拖拽**，
  −/＋ 钮与快速选择不受影响（降级而非报错）
- **`clamp()` 吸附**：任何入口（initial/拖拽/步进/快速）都先四舍五入到 100 步长再钳位，杜绝 1850 这类中间值
- **保存**：`emit('save', picked)` + `emit('update:show', false)`，落库由父组件调 store 完成（组件不直接碰 store）
- **触觉**：步进/快速/拖拽落点均 `vibrateShort()`（L1 轻反馈），try/catch 兜底无触觉设备

## 边界与降级
- `initial` 越界或带零头 → `clamp()` 归位
- 快速选择槽：picked 不在 `[1200,1500,1800,2100,2400]`（如 1900）时全部不亮 — 属预期，稿面无「最近档高亮」
- 蒙层点击关闭：2026-09-22 起走原生 page-container 壳（position=bottom，容器 custom-style 560 高/白底/顶圆角 34，
  `.gm-sheet` 改 flex:1 只留内边距）；原生蒙层**不自动关闭**，`@clickoverlay` 回传 `update:show=false`，
  `@afterleave` 兜底（系统返回）；右上角 × 仍直调 `close()`
- 低端机：无 canvas/渐变依赖，纯 view 实现

## 与设计稿的对应
- Pencil `qnNST`「设置每日热量目标弹窗」（板 727788215940571），sheet 节点 `D3308`（高 560 顶圆角 34）、
  handle `EYi92`、Dial 卡 `#gm-dial`；图标节点 O2Wha/SjnTP/YCoHv/y2TvVh/y63agJ/cr1T2 → `static/goal/`
- 验收（2026-09-21 模拟器实拍 h1–h3）：铅笔开弹窗 ✓ ＋钮 1800→1900 且 fill/thumb 同步右移 ✓
  保存回写 Pill「每日目标 1900 kcal」＋持久化 `ct_goal_v1` ✓ 再开回显 1900 ✓
- 不一致处：稿面无拖拽中间态标注，交互按 Boss 口头确认（滑条可拖）
