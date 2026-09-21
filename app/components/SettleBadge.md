# SettleBadge — 结算徽章

## 用途
添加食物后的结算弹层，居中显示 264×256 徽章，环扫过角 + 数字滚动同步 620ms easeOutCubic。点击任意位置关闭。

## 依赖
- **Store**：`useFoodStore`（读 `totalCal`）
- **父组件**：`Home.uvue`（`v-model:show` + `:before`/`:after`/`:mealLabel`）
- **无子组件依赖**

## 设计决策
- **双层圆环**：小程序用 `conic-gradient` 降级，App 端用 `canvas 2d arc`
- **CapStart/CapEnd**：圆头端点，根据 ratio 计算角度 → 圆周坐标
- **数字滚动**：`requestAnimationFrame` + easeOutCubic 缓动，620ms
- **超预算分支**：环描边换 amber `#E8B54D`、BudgetRow 珊瑚文字、MealRow 换 `!` 图标

## 边界与降级
- 低端机（`deviceStore.tier === 'low'`）：仅淡入淡出，无环扫动效、无触感
- 空数据：`before`/`after` 默认 0
- 超长数值：数字栈自适应宽度

## 与设计稿的对应
- `docs/design/2026-09-21-settlement-badge/README.md` 规格
- 首页 FAB → 添加食物 → 确认 → SettleBadge 弹出
