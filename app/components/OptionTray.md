# OptionTray.uvue — 方案 B 单选底槽

## 💡 核心思想

一组单选项共享一条 `$bg` 底槽。按 pOYw3「去卡片、用体积与光」定案：**带素材的选中项不套白卡**，
靠 抬升 4px＋动态光晕＋动态落地影＋文字加粗 浮起；纯文字段（糖包/糖浆）保留白卡样式。
分量／糖包等单选组复用本组件，只换 options 数据。选中时同步触发 `card` 听觉反馈。触觉震动已按指令统一移除。

## 💻 使用示例

```html
<OptionTray :options="sizeOpts" v-model="sizeKey" />
```

`TrayOption{key,label,sub,art,artW,artH,count,contact,solid}`；
`art` 为空即纯文字段；`count`＝并排颗数（砝码 1/2/3 颗，单颗尺寸固定）；
`contact`＝接触宽；`solid`＝实心不透明素材（压暗 0.85 而非 0.62）。

## 依赖

- `app/static/common/shadow512.png`（软阴影贴图，小程序 `blur` 无效处的替代）
- 被 AddFood 依赖；触觉震动已全量下线，待按需开启

## 设计决策

- 光晕/落地影按 pOYw3 修正公式动态算：`haloW=objW×1.5`、`haloH=max(objH×1.35,objW×0.45)`、
  `shadowW=objW×contact×1.35`（ar≥1.6 时 ×1.5）、`blur≈shadowW×0.16`（贴图高度等效）
- 接触宽只填设计实测值（瓶/罐 0.93、碗/杯 0.64、盘 0.49），未实测器形取 0.64 保守值
- 多颗砝码按「组宽」参与公式（颗间 4px），单颗 33×30 由父传入
- 光晕用纯色低透明圆（`rgba(46,207,160,0.22)`，mint token #2ECFA0），不用渐变
- 选中件 `optPop` scale 0.94→1 弹性入场（220ms overshoot 曲线）

## 边界与降级

- 动效 `transition`/`animation` 不支持时静默无动画，选中态终值不受影响
- 空 options 渲染空底槽（父应保证非空）
- 串/球类小接触面（contact<0.2）的「上升＋环形描边」降级未实现——此类食物走计数步进器，不进底槽

## 踩坑（2026-09-21 Boss 实拍定案）

- **光晕溢出必被裁**：uni-app x 小程序运行时全局注入 `view{overflow:hidden}`，
  光晕（haloW=1.5×objW）超出 `.art-wrap` 内容盒后被裁成**硬边矩形色块**。
  修复＝`.opt/.float/.art-wrap` 显式 `overflow:visible`（类选择器特异性压过全局元素选择器）。
- **shadow512.png 是方形软斑贴图**：`aspectFit` 放进 55×10 扁盒只渲染中间 10×10 → 表现为「绿点」。
  落地影必须 `mode="scaleToFill"` 拉成扁影。
- **落地影必须挂在 `.art-wrap` 内绝对定位**（bottom 对齐素材底缘）：原为 `.float` 后置流内节点，
  影被挤到文字下方，视觉上像标签下面多了一块墨。
- 底槽/浮起件加 `flex-shrink:0`，防弹窗 sheet 压缩时整排变形。

## 与设计稿的对应

- pencil pOYw3 选择态方案：分量选中=光晕+体积+影（无白卡）；甜度白胶囊方案已移至 AddFood 电量条
- 不一致：光晕为素色圆（非径向渐变）；盘类 ar≥1.6 的影系数已按修正公式实现，待真机复核
