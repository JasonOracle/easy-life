# OptionTray.uvue — 方案 B 单选底槽

## 💡 核心思想

一组单选项共享一条 `$bg` 底槽，选中项靠光晕＋落地影＋提亮＋抬升 4px 从底槽"浮起来"
（设计稿选中态系统 B）。分量／甜度／糖包等单选组复用本组件，只换 options 数据。

## 💻 使用示例

```html
<OptionTray :options="sizeOpts" v-model="sizeKey" />
```

`TrayOption{key,label,sub,art,artW,artH}`；`art` 为空即纯文字段。

## 依赖

- `app/static/common/shadow512.png`（软阴影贴图，小程序 `blur` 无效处的替代）
- 被 AddFood 依赖；选中触发 `vibrateShort`（L1）

## 设计决策

- 光晕用纯色低透明圆（`rgba(31,191,143,0.22)`），不用渐变——uvue radial-gradient 口径待验证
- 落地影用贴图而非 `blur()`（README 2.x 小程序约束）
- 物件 ×1.12 用内容放大等效（artW/H 由父按档位算好传入）

## 边界与降级

- 动效 `transition` 不支持时静默无动画，选中态（色／影／位移终值）不受影响
- 空 options 渲染空底槽（父应保证非空）

## 与设计稿的对应

- pencil 选中态 B：底槽 335×134 r20 `$bg`；选中名 `$ink` 700、kcal `$ink2`；未选 opacity .62
- 不一致：光晕简化为素色椭圆；物件缩放由父预计算传入
