# FoodToast.uvue — 添加成功 toast

<!--
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[1. 核实并写明本组件当前无任何页面 import（L3 已由 SettleBadge 接管），故其类名不参与编译、不会污染页面；2. 记入 `ft-` 类名全量前缀收口；3. 使用示例改为成对标签写法（AGENTS 铁律：自闭合在本工程 mp 产物有宿主幻影副本风险）]
-->

## 💡 核心思想

添加食物确认后的 L3 重反馈：绿杯徽＋`+N kcal`＋`已加入X`＋`已添加` pill。
2s 自动消失，点按立即关闭；出现即长触觉（受设备档＋设置开关门控）。

## 💻 使用示例

```html
<FoodToast v-model:show="toastShow" :kcal="325" meal-label="夜宵" />
```

## 依赖

- device／settings store（触觉门控）
- **当前无任何页面 import 本组件**（2026-09-22 文档审计核实）：L3 重反馈链路已由 `SettleBadge` 接管
  （Home 确认后挂 SettleBadge），本组件作为轻量 toast 备选**保留未接线**。
  编译产物里也没有 `FoodToast.wxss`——未被引用即不参与编译，故它的类名**不会**污染任何页面（历史污染风险见下条）。

## 设计决策

- **类名 `ft-` 全量前缀**（2026-09-22 补齐）：上一轮只改了 `.mask/.sub`，`.pill/.pill-text` 仍与
  **Profile 页目标胶囊**同名（AGENTS 类名前缀铁律），另把 `toast/toast-card/cup-circle/cup-glyph/plus-num/plus-unit`
  一并加前缀收口；样式数值零改动。
- 音效资产（`assets/sound/`）缺失，L3 只落触觉＋动画，音效待补
- 定时器在 unmount／重入时清理，不野留

## 边界与降级

- 低端机（haptics 关）静默只弹视觉；`show` 外部单一事实来源

## 与设计稿的对应

- pencil 弹窗③：`+325／已加入夜宵／已添加`；杯徽用 ✓ 字形（SVG 资产化前过渡）
