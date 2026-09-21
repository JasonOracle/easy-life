# 选中态系统 B + 计数步进器能量条 —— 实现文档

> 2026-09-21 ｜ 设计稿：Pencil `pencil-new.pen`（弹窗①–⑥⑧ 已全部换装）
> 色值一律以 `design/DesignTokens.md` 为准，本文不重复抄色板，只引用 token 名。

## 0. 一句话结论

- **单选选中态统一为「共用底槽 + 悬浮选中件」（方案 B）**：一组选项不再各画一张描边卡片，而是共享一条 `$bg` 底槽，选中项靠**光晕 + 落地影 + 提亮 + 抬升**从底槽里"浮起来"。
- **计数单位（个/片/串）不再配计量图**，改为步进器 + 一条**对数刻度的份量能量条**，上限 100。

---

## 1. 选中态系统 B

### 1.1 三组的具体规格

| 组 | 底槽 | 未选中 | 选中 |
|---|---|---|---|
| 分量（杯/碗/瓶/砝码） | 335×134 `r20` `fill=$bg` | 物件 opacity .62、影 `#0A4F3D1F` blur3、名 `$muted`、kcal `$faded` | 物件 ×1.12 + opacity 1、**径向光晕**、影 `#0A4F3D40` blur5、名 `$ink` 700、kcal `$ink2` |
| 甜度（10 格电量） | 335×72 `r18` `fill=$bg` | 段透明、名 `$muted`、`x/10` `$faded` | 段 `#FFFFFF` `r14` + 阴影 `#0A4F3D2E` y2 blur9、名 `$ink` 700、`x/10` `$ink2` |
| 餐次（丘陵四时刻） | 无底槽，4 张 77×96 满版照片卡 `r16` | 照片 opacity .72 + 压暗层 `$ink` 22% + scrim 85%、名 `#FFFFFFB8`、时间 `#FFFFFF80` | 照片 opacity 1（**不压暗**）+ scrim 91%、名 `#FFFFFF` 700、时间 `#FFFFFFD9`、**描边 `mint` 2px 外对齐**、抬升 4px、右上角印章 |

餐次组为什么和其他两组不一样：照片卡放不下白底浮板，改用「亮/暗对比 + 描边 + 印章」表达选中。
压暗层（Dim）只加在未选中卡上，**选中卡绝不能加浅色蒙版**——早前一版给选中卡叠了 `bg` 42% 的提亮层，实拍夜景照被洗成灰白，反而更像禁用态，已废弃。

### 1.2 光晕 / 落地影公式（含盘类修正）

物件尺寸记 `objW × objH`，`ar = objH / objW`，`cf` = 该素材的**接触宽系数**（素材底部 10% 带内的最大行跨度 / 素材宽）。

```
haloW   = max(objW × 1.5, objH × 0.6)
haloH   = max(objH × 1.35, objW × 0.45)      // 不是 ×1.05，见下
shadowW = objW × cf × 1.35                   // ar ≥ 1.6 时 ×1.5
shadowH = shadowW × 0.16
blur    = shadowW × 0.16
halo 填充：radial，$mint → $mint00，整体 opacity 0.22
影 填充：  #0A4F3D，选中 40% / 未选中 1F%
```

**为什么 haloH 是 ×1.35 而不是 ×1.05**：2026-09-20 在对照板 `pOYw3` 的验证行里跑了三种长宽比，瓶 `ar=0.34`、碗 `ar=1.12` 通过，**盘 `ar=2.52` 失败**——`max(objH×1.25, objW×1.05)` 会把 30px 高的盘子包进 80px 的绿云里。改成上面的公式后三类都成立。

接触宽实测值（新素材必须重测）：

| 素材 | cf |
|---|---|
| `v3_bottle` / `v3_can` | 0.93 |
| `v3_cup` / `v3_plate` | 0.64 / 0.49 |
| `v3_bowl` | 0.64 |
| `v3_skewer` / `v3_ball` | 0.13 —— **过窄，不要用光晕**，改用「抬升 + 印章环」 |

### 1.3 动效钩子（下个版本接）

| 位置 | 属性 | 时长 / 曲线 |
|---|---|---|
| 光晕 | opacity 0→.22 + scale .8→1 | 220ms `cubic-bezier(.22,1,.36,1)` |
| 落地影 | width 跟物件同步、opacity .12→.25 | 同上 |
| 物件 | translateY 0→-4、scale 1→1.12 | 220ms 同上 |
| 甜度浮板 | 白底 + 阴影淡入（阴影 blur 0→9） | 180ms ease-out |
| 餐次描边 | 用 `scaleX/Y` 画一圈，不要 animating border-width | 200ms |
| 印章 | scale 0→1.15→1 + rotate -20°→0 | 260ms 弹性 |

实现约束：**光晕和落地影都是代码画的径向/模糊椭圆，不需要为每种器型出一批图**；全项目最多需要一张 512px 的软阴影贴图，其余靠 `radial-gradient` + `filter: blur()`。

---

## 2. 计数步进器（个 / 片 / 串）

### 2.1 结构

`COUNT_UNITS = ['个','片','串']`（`app/stores/food.ts:117`）的食物，弹窗里的图片区替换为 `CountBlock`：

```
CountBlock  335×150  r20  fill=$bg
├─ Row1     减号 44×44 圆 · 数字胶囊 · 加号 44×44 圆
├─ BarTrack x48 y74 239×8 r4  fill=line-card(#DCEDE6)
├─ BarFill  x48 y74 W×8   r4  linear-gradient(mint-e1 → mint-e2, 90°)
├─ Ticks    1 / 5 / 25 / 100 四个刻度字（$faded, Inter 10）
└─ Row3     每片 ≈ 75g · 82 kcal（text-2）
```

数字胶囊：1 位数宽 89、2 位 99、3 位 110；字号 1/2 位 34、3 位 30；`Inter 700 $ink` + 单位 `13 600 $label-3`。
减/加号图标 `mint-deep #0A7A5C`（20px 图标在白底上 `mint-e2` 对比度只有 2.3:1，必须用 deep）。
**禁用态 = 去掉阴影 + 图标换 `text-3`**，底保持白色；不要用浅灰底，会和 `$bg` 融掉（第一版就踩了）。

### 2.2 能量条算法

```
p(n) = ln(1 + n) / ln(1 + 100)        // n ∈ [1, 100]，结果即条宽比例
fillW = trackW × p(n)
```

| n | 1 | 2 | 3 | 5 | 10 | 25 | 50 | 100 |
|---|---|---|---|---|---|---|---|---|
| p | 15% | 23% | 30% | 39% | 52% | 70% | 85% | 100% |

为什么用对数而不是线性：计数类的实际分布集中在 1–10（没人点 100 串），线性条会让 1→3 几乎看不出变化；对数刻度在小数量段灵敏，同时天然封顶，**100 也不会溢出轨道**。

刻度标 1/5/25/100（不等距）是故意的——把对数刻度暴露给用户，避免"条到一半 = 50"的误读。

### 2.3 条色阈值

| n | 条色（渐变 90°，亮端 = token 色 55% alpha，不另调新色值） |
|---|---|
| ≤ 4 | `mint-e1 #7DEBC7 → mint-e2 #1FBF8F`（主渐变前两段，token 现成） |
| 5 – 24 | `amber` `#E8B54D` 55% → 100% |
| ≥ 25 | `coral` `#FF9E7D` 55% → 100% |

阈值只表达"吃多了"，不表达对错；文案与 kcal 数字不变色，避免和超标告警抢注意力。

### 2.4 上限与输入

- `MAX_COUNT = 100`，到界时对应侧按钮转禁用态 + track 抖动 4px（不要静默吞掉点击）。
- 点数字胶囊直接进入键入态：胶囊加 `mint` 2px 描边 + 光标，键入完成后 clamp 到 [1,100]。
- kcal 实时 = `round(kcalPer100g × pieceWeight × n / 100)`，与 `gramsOf(food, n, unit)` 同一条链路，不要另算。

### 2.5 UTS 参考实现

```uts
// app/stores/food.ts 追加
export const MAX_COUNT = 100

/** 份量能量条：对数刻度，返回 0..1 的条宽比例 */
export function portionRatio(n: number): number {
  const k = Math.min(Math.max(n, 1), MAX_COUNT)
  return Math.log(1 + k) / Math.log(1 + MAX_COUNT)
}

/** 条色阈值：0 mint / 1 amber / 2 coral */
export function portionLevel(n: number): number {
  if (n <= 4) return 0
  if (n <= 24) return 1
  return 2
}
```

```uts
// 组件里
const ratio = computed((): number => portionRatio(this.count))
const barW  = computed((): number => Math.round(239 * ratio.value))
const barC  = computed((): string[] => {
  const lv = portionLevel(this.count)
  return lv == 0 ? ['#7DEBC7', '#1FBF8F'] : (lv == 1 ? ['#E8B54D8C', '#E8B54D'] : ['#FF9E7D8C', '#FF9E7D'])
})
```

小程序端 `filter: blur()` 在部分基础库上对 `view` 无效，落地影请改用一张 512px 软阴影贴图 + `background-size`，光晕用 `radial-gradient` 没问题。

---

## 3. 落地清单

| 文件 | 改动 |
|---|---|
| `app/stores/food.ts` | 加 `MAX_COUNT` / `portionRatio` / `portionLevel`；`gramsOf` 不动 |
| `app/components/AddSheet.uvue`（`e3798b8` 已删，需重建） | 三组选项改走「底槽 + 悬浮件」结构；计数类走 CountBlock |
| 新建 `app/components/OptionTray.uvue` | 承载底槽 + slot，统一选中态样式与动效钩子 |
| 新建 `app/components/CountStepper.uvue` | 步进器 + 能量条 + 键入态 |
| `design/DesignTokens.md` | 无需改（本轮已按它回校全画板，见 §6） |

> 新建组件按 `AGENTS.md` 的 Vue↔MD 对应规范同步配一份同名 `.md`（参照 `app/components/Tabbar.md`）。

## 4. 设计稿对应

| 内容 | 画板 / 节点 |
|---|---|
| 选中态 A/B 对照 + 光晕公式验证行 | `pOYw3` |
| 计数步进器四态 + 规格卡 | `p6sArE` / `gAYFq` / `U8WEoH` / `J34Rk3` / `smBjH` |
| 计数类唯一示例弹窗 | `AtxDr`（弹窗⑧ 吐司面包） |
| 已换装的其余弹窗 | `NUEJF`① `nURQn`② `B51pW`④ `v9Ruwg`⑤ `u1vpbN`⑥ |

## 5. 交付图（`export/`，2x PNG）

| 文件 | 内容 |
|---|---|
| `01-milktea-portion-sweet-meal.png` | 弹窗①：分量底槽 + 甜度底槽 + 餐次照片卡，三区同屏基准 |
| `02-rice-bowl.png` / `04-coffee-two-size.png` / `05-orangejuice-two-size.png` / `06-pot-weights.png` | 碗 / 两档杯 / 两档瓶 / 砝码重复件 |
| `08-toast-count-stepper.png` | 弹窗⑧：计数步进器 + 能量条 + 餐次卡（计数类唯一示例） |
| `20-stepper-default.png` ~ `23-stepper-focus.png` | 步进器四态：默认 3 / 下界 1（减号禁用）/ 上限 100（加号禁用 + coral）/ 键入态 |
| `24-stepper-spec.png` | 步进器规格卡（尺寸、字号、阈值、算法） |
| `30-selection-A-B-compare.png` | A（描边卡）vs B（底槽悬浮）对照 + 光晕公式三长宽比验证行 |

## 6. 本轮 DesignTokens 回校记录

- 画板变量全部改为 token 引用：`ink #0A4F3D`、`ink2/mint-deep #0A7A5C`、`mint #1FBF8F`、`mint-e1 #7DEBC7`、
  `mintsoft/bg #F2FAF5`、`muted`、`faded`、`line #DCEDE6`。
- 字面色号两轮清扫（第二轮 157 节点）后做过全画板审计（fill / 渐变 stop / stroke / effect 四类）：
  **零 off-token 色值**。上限态能量条亮端原来是手调的 `#FFC9AE`，已按 §2.3 改成 `#FF9E7D8C`。
- 圆角归一到 token：sheet 34 / card 20 / chip 18 / 照片卡 16，内层同心圆角同步（60 处）。
- 字号归一：12.5 与 11.5 全部并到 caption 12（49 处）。9 / 9.5 / 11 的微标签与 30px BigKcal
  **有意未动**——强行提到 12 会撑破 77px 餐次卡和 70px 热量框。
