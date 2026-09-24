# OptionTray.uvue — 方案 B 单选底槽

## 💡 核心思想

一组单选项共享一条 `$bg` 底槽。按 2026-09-24「选中态去色块」定案：**带素材的选中项不套白卡、不垫任何底色/影贴图**，
靠 抬升 4px＋文字加粗＋薄荷绿下划短线（`.opt-underline`）浮起；纯文字段（糖包/糖浆）保留白卡样式。
分量／糖包等单选组复用本组件，只换 options 数据。选中时同步触发 `card` 听觉反馈。触觉震动已按指令统一移除。

## 💻 使用示例

```html
<OptionTray :options="sizeOpts" v-model="sizeKey" />
```

`TrayOption{key,label,sub,art,artW,artH,count,contact,solid}`；
`art` 为空即纯文字段；`count`＝并排颗数（砝码 1/2/3 颗，单颗尺寸固定）；
`contact`＝接触宽（保留字段，当前选中态不再消费）；`solid`＝实心不透明素材（压暗 0.85 而非 0.62）。

## 依赖

- 被 AddFood 依赖；触觉震动已全量下线，待按需开启

## 设计决策

- **废弃 `.halo` 光晕与 `shadow512.png` 落地影**（2026-09-24 Boss 实拍定案）：
  ① halo 为实心圆角色块，垫在白色器形图上形成「绿纸贴白纸」观感；uvue 无 radial-gradient/伪元素，做不出稿面的柔和径向光。
  ② `shadow512.png` 贴图本身是 `#0A4F3D` 薄荷调色，白底渲染即用户所见「图片底部绿光」。
  色彩信号收敛为一条 48×6rpx 下划短线（mint #1FBF8F），与 FoodPicker 列表行左侧竖条同一语言。
- 未选中素材压暗：透明/浅色 0.62，实心不透明（金属砝码）0.85。
- 选中件 `optPop` scale 0.94→1 弹性入场（220ms overshoot 曲线）

## 边界与降级

- 动效 `transition`/`animation` 不支持时静默无动画，选中态终值不受影响
- 空 options 渲染空底槽（父应保证非空）
- 串/球类小接触面（contact<0.2）的「上升＋环形描边」降级未实现——此类食物走计数步进器，不进底槽

## 踩坑（历史定案，机制虽废、结论仍可复用）

- **全局注入 `view{overflow:hidden}`**：任何溢出 `.art-wrap` 内容盒的装饰都会被裁成硬边矩形色块；
  浮层型装饰的父链（`.opt/.float/.art-wrap`）必须显式 `overflow:visible`（类选择器特异性压过全局元素选择器）。
- **方形软斑贴图放扁盒必须 `mode="scaleToFill"`**：`aspectFit` 只渲染中间方块，表现为「绿点」。
- 底槽/浮起件加 `flex-shrink:0`，防弹窗 sheet 压缩时整排变形。

## 与设计稿的对应

- pencil pOYw3 原方案＝光晕+体积+影；Boss 2026-09-24 实拍否决垫色方案，浅色态改为「抬升＋下划线」，
  稿面径向光晕在 uvue 无等价实现（无 radial-gradient/伪元素），此为有意偏离，以 Boss 最新指令为准。
