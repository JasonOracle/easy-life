# CountStepper.uvue — 计数步进器

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

## 边界与降级

- 非数字输入直接收回；`transition`／`animation` 不支持时功能不受影响

## 与设计稿的对应

- pencil 步进器四态＋规格卡：默认 3／下界 1／上限 100／键入态；`p=ln(1+n)/ln(101)`；
  刻度 1／5／25／100 对数定位；`每片 ≈ 75g · 82 kcal` 行
