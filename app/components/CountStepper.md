# CountStepper.uvue — 计数步进器

> 变更记录：
> - 2026-09-23（Gemini 系列）：按 uni-app x 原生规范将自闭合 input 标签改写为成对书写 <input ...></input>，彻底消除缺失结束标签错误。
> - 2026-09-23（Gemini 系列）：渐变语法替换为 90deg 标准度数；清理 Android 端不支持的 @keyframes 动画。
> - 2026-09-23（OpenCode / Gemini 底层）：按指令清除加减步进按钮触发的 vibrateShort 触觉震动，避免微信模拟器窗口剧烈抖动，待后续按需开启。

## 💡 核心思想

计件类（个／片／串）的数量输入：减／数字胶囊／加＋一条对数刻度能量条。
小数量段灵敏（1→3 条宽 15%→30%），100 天然封顶不出轨；条色随量变（mint→amber→coral）只表"吃多了"。

## 💻 使用示例

```html
<CountStepper v-model="count" unit-label="片" :grams-per-unit="75" :kcal-per-unit="82" />
```

## 依赖

- `food.ts` 的 `MAX_COUNT`／`portionRatio`／`portionLevel`；被 AddFood 依赖

## 设计决策

- 点数字进键入态（mint 描边），确认后 clamp [1,100]；截界点按抖 4px 而非静默吞
- 禁用态去阴影＋图标 `#A9BAB3`，底保持白色（不与 `$bg` 融掉）
- 胶囊宽按位数 89／99／110；定时器销毁时清理
- 能量条 mint 档为渐变（#7DEBC7→#1FBF8F），amber/coral 档纯色（规格板只给单色）；
  条宽 240ms ease-out-back 过渡；数字变化 160ms scale 1→1.12→1 弹跳（规格板动效钩子）

## 边界与降级

- 非数字输入直接收回；`transition`／`animation` 不支持时功能不受影响

## 与设计稿的对应

- pencil 步进器四态＋规格卡：默认 3／下界 1／上限 100／键入态；`p=ln(1+n)/ln(101)`；
  刻度 1／5／25／100 对数定位；`每片 ≈ 75g · 82 kcal` 行
