# GoalModal — 每日热量目标弹窗

## 用途
从设置页打开的底部弹窗，让用户调整每日热量目标（1200–2400 kcal，步长 100）。包含可拖拽 Dial 圆环、减/加按钮、快速选择 chips、保存按钮。

## 依赖
- **Store**：`useGoalStore`（读 `calorieGoal`，写 `setGoal`）
- **父组件**：`Settings.uvue`（`v-model:show` + `@save`）
- **无子组件依赖**

## 设计决策
- **Dial 圆环**：小程序用 `conic-gradient` 降级，App 端用 `canvas 2d arc`
- **Thumb 定位**：根据 ratio 计算角度 → 圆周坐标，`position: absolute` 定位
- **快速选择**：`ticks` 数组 `[1200, 1500, 1800, 2100, 2400]`，点击触发 `pick()`
- **保存 emit**：`emit('save', picked.value)` + `emit('update:show', false)`

## 边界与降级
- 空数据：`initial` 默认 1800
- 超长数值：`Math.min(Math.max(...))` 钳位
- 低端机：Dial 圆环自动降级为 conic-gradient（canvas 2d 需 App 端）

## 与设计稿的对应
- Pencil 设计稿 `qnNST` 节点
- 设置页「每日热量目标」行 → 弹出 GoalModal
