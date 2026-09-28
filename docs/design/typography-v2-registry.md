# Typography v2 登记表（2026-09-26 定稿）

> **性质：登记，不是规范。代码不符时以代码为准。**
> 本表原在 `.workbuddy/memory/MEMORY.md`，因长期记忆超出注入预算于 2026-09-28 拆出。

## A. 全局字号（13 档）

| 名称 | rpx | 用途 |
|---|---|---|
| Hero | 92 | 首页「还能吃」级别 |
| Page | 48 | 页面大标题 |
| Screen | 38 | |
| Nav | 34 | |
| Card | 31 | |
| Block | 30 | |
| BodyStrong | 28 | |
| Body | 26 | |
| BodySmall | 24 | |
| Caption | 22 | |
| Micro | 19 | |
| MicroDense | 18 | |
| MicroTight | 17 | |

**已退役（禁用）**：`body27`、`section31`、`title34`。

## B. 组件专用值（不进全局）

| 名称 | rpx | 备注 |
|---|---|---|
| Hero XL | 104 | **仅 Home，禁降** |
| HeroNumber | 72 | |
| Serving | 68 | |
| Stepper | 60 | |
| RecordsHero | 42 | |
| StatNumber | 35 / 36 | DayDetail / Profile，两个并存属 P2 |
| TabLabel | 24 | |
| RingPct | 29 | |
| RingLabel | 16 | |
| InputText | 27 | |
| BodyLong | 28 | |

**明确不进全局**：Glyph Scale、`ChartAxis 14`、`ChartLabel 16`。

## C. Unit Modifier（单位后缀随宿主字号）

| 宿主字号 | 单位字号 |
|---|---|
| ≥ 92 | 28 |
| 60–72 | 26 |
| 22–42 | 19 |
| ≤ 21 | 同行 inline |

容差 ±2rpx。

## D. 换算与冻结

- 稿面 `1pt @375` = **2rpx**
- `1rpx` = **1.70667px**（MuMu 1280×2772 / 447dpi）= **0.6109dp**
- 屏幕 1280px 宽 = 稿面 375pt

**冻结值（不得调）**：`Home.remain-num` 104rpx、弹层大数字 68 / 72 / 60、
`meal-thumb` 74rpx、弹层关闭钮 32rpx。
