# 入口两弹层：食物选择列表 + 每日热量目标

> 2026-09-21 ｜ 画板 `n3dgv`（弹层⓪ 食物选择列表）、`qnNST`（弹层⑨ 每日热量目标）
> 色值/圆角/字号一律引用 `design/DesignTokens.md`，本文只写结构与算法。
> 选中态沿用 [`../2026-09-21-selection-state-and-count-stepper/README.md`](../2026-09-21-selection-state-and-count-stepper/README.md) 的方案 B。

## 1. 弹层⓪ 食物选择列表 `n3dgv`

这是点首页「＋」之后的**第一层**，选中一行才进入弹窗①–⑧。Sheet 375×560 `r34`，与其余弹层同底边节奏。

| 区块 | 规格 |
|---|---|
| Handle | 41×4 `r2` `$line` |
| 搜索框 | 335×46 `r23` `bg-input #F5FAF8` + `line-card #DCEDE6` 1px；`search` 18 `$faded`；占位 13.5 `$faded` |
| 分类 chip | 60×34 `r17`，间距 8；选中 `mint-e2` 底 + 白字 13/600，未选 `bg-tab-idle #F8F9FC` + `$muted` 13/500；**第 6 个刻意溢出画板右缘**，用裁切暗示可横滑 |
| 食物行 | `Row_<名称>` 335×76 `r16` `layout:none`，内含 48×48 `r16` `$mintsoft` 缩略 + `lucide` 24 `$ink2`、名称 15.5/700 `$ink`、副标 12 `$muted`、行尾 275×1 `#EAF3EF` 分隔线 |
| 行尾选择器 | 22×22 `r11`，x=303（行内）｜**未选**：透明底 + `#BFE3D6` 1.5px 描边 ｜**已选**：`mint-e2` 实心 + 白 `check` 12 + 阴影 `#1FBF8F4D` y2 blur6 |

### 1.1 单选回显（这层是单选，不是「添加到餐次」）

点一行 = 选定该食物并**自动收起本弹层**，直接进入下一级（弹窗①–⑧ 配规格）。所以列表里**没有加号**，
行尾那个圆圈是**「上次选中的是哪一条」的回显**：用户从下一级点「更换」再回来时，必须能立刻看到当前食物。

| 状态 | 行底 | 缩略底 | 副标 | 圆圈 |
|---|---|---|---|---|
| 未选 | `#FFFFFF00` | `$mintsoft` | 12 `$muted` normal | 描边圈 `#BFE3D6` 1.5 |
| 已选 | `$bg #F2FAF5` `r16` | `#FFFFFF`（在白字行底上不刷白会糊成一片） | 12 `$ink2` **600** | `mint-e2` 实心 + 白勾 |
| 按压 | 行底 → `$bg`，整行 `translateX` +2px | —— | —— | 120ms ease-out |

- 已选行的**上下两条分隔线都要隐掉**（`i == SEL-1` 与 `i == SEL` 不画线），否则圆角行底会被线切断。
- 首次进入（还没有选择）时**五行全是未选态**，不要默认高亮第一行。
- 搜索/切分类后，若当前选中项不在结果里，圆圈自然消失——**不要**为此另存"隐藏选中"状态。

实现要求：**每行必须是带 `name: Row_*` 的独立 frame**（已按此重建），否则按压缩放与行底会拆开。
分类 chip 是筛选 Tab 不是单选组，**不套用 B 底槽**，保持 `bg-tab-idle` 实心胶囊这套既有规格。

## 2. 弹层⑨ 每日热量目标 `qnNST`

Sheet 375×560 `r34`，自上而下：头部 → 调节卡 → 快速选择 → 提示卡 → 保存。

| 区块 | 规格 |
|---|---|
| 头部 | 44×44 `r14` `$mintsoft` + `target` 22 `$ink2`；标题 17/700 `$ink`；副标 12 `$muted`；右上 32×32 白圆 + 阴影 + `x` 16 `$muted` |
| 调节卡 `Dial` | 335×150 `r20` `$bg`；减/加 44×44 白圆 + 阴影、图标 20 `mint-deep`；`1800` Inter 46/700 `$ink` + `kcal` 13.5/600 `$ink3`，**两者作为一组在卡内水平居中、底部对齐** |
| 滑杆 | Track 239×8 `r4` `$line`，左右各内缩 48；Fill = Track × ratio，`mint-e1→mint-e2` 90°；Thumb 20×20 白圆 + `mint-e2` 3px 描边，圆心 = Fill 右端 |
| 刻度 | 5 个标签居中于 `48 + i×59.75`，Inter 12；当前值 `$ink2` 700，其余 `$faded` normal |
| 快速选择 | 335×64 `r18` `$bg` 底槽 + 5 段 63×56 `r14`；**选中段 = 白卡浮起 + 阴影 `#0A4F3D2E` y2 blur9 + 数值 `$ink` 700 + 单位 `$ink2`**，未选数值 `$muted`、单位 `$faded` —— 即方案 B，与甜度底槽同一套 |
| 提示卡 | 335×76 `r18` `$mintsoft`；`lightbulb` 20 `$ink2`；标题 13.5/600 `$ink`；正文 12 `$muted` 定宽 240 折两行；`chevron-right` 16 `$faded` 收在卡内 x303 |
| 保存 | 335×54 `r27` 主渐变 180° + 阴影 `#1FBF8F55` y6 blur16，文案 15.5/700 白 |

### 2.1 滑杆算法（与计数能量条的区别，别混用）

目标是**线性**滑杆，用户拖的是连续值；计数类是**对数**能量条，见 v4 文档 §2.2。

```uts
export const GOAL_MIN = 1200
export const GOAL_MAX = 2400
export const GOAL_STEP = 50          // 加减按钮与拖拽都按 50 取整

/** 0..1 线性比例；clamp 后再算，避免越界把 thumb 甩出轨道 */
export function goalRatio(v: number): number {
  const k = Math.min(Math.max(v, GOAL_MIN), GOAL_MAX)
  return (k - GOAL_MIN) / (GOAL_MAX - GOAL_MIN)
}
```

```uts
// 组件里：track 宽 239
const fillW = computed((): number => Math.round(239 * goalRatio(this.goal)))
const thumbX = computed((): number => 48 + fillW.value - 10)   // thumb 直径 20，居中
```

- 加减按钮：`goal = clamp(goal ± 50, 1200, 2400)`；到界时**去阴影 + 图标换 `text-3`**，底保持白色（同计数步进器，别用灰底，会和 `$bg` 融掉）。
- 点快速选择：`goal` 直接跳到该值，滑杆与数字同步；**当前值落在某个档位时，对应档位转成 B 选中态**，不在档位上（如 1850）则五段全部回到未选中，不要留一个"最接近的"亮着——那会让用户以为 1850 就是 1800。

### 2.2 动效钩子

| 位置 | 属性 | 时长 / 曲线 |
|---|---|---|
| 数字 | 值变化时 `translateY` 6→0 + opacity .4→1 | 160ms ease-out |
| Fill / Thumb | 宽与圆心同步 | 180ms `cubic-bezier(.22,1,.36,1)`；**拖拽中不加过渡**，松手后才补间 |
| 快速选择白卡 | 位移 + 阴影淡入 | 200ms 同曲线 |
| 弹层入场 | Sheet `translateY` 100%→0 + Mask opacity | 260ms `cubic-bezier(.22,1,.36,1)` |

## 3. 交付图

| 文件 | 内容 |
|---|---|
| `export/40-food-picker-sheet.png` | 弹层⓪：搜索 + 分类 chip + 5 行食物（末行珍珠奶茶为已选态，前四行空圈） |
| `export/41-daily-goal-sheet.png` | 弹层⑨：1800 kcal 目标调节（滑杆居中 + B 底槽快速选择） |
