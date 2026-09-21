# 弹层③ 结算徽章（加记录成功反馈）

> 2026-09-21 ｜ 画板 `Dz3YV`（结算徽章）、`MU1O4`（动效时间轴）
> 色值/圆角/字号一律引用 `design/DesignTokens.md`，本文只写结构、算法与动效。
> 组件名：`components/SettleBadge.uvue`（配对文档 `SettleBadge.md`，按 AGENTS.md 的 Vue↔MD 规范）。

## 0. 为什么不是 toast

首版做的是「圆圈 + 卡片 + 撤销」的横向 toast（`ToastCircle`/`ToastCard`/`AddedPill`），评审否掉的理由有两条：

1. **宽度不够装中文**：335 里要放下「已加入夜宵」+ 数字 + 单位 + 撤销按钮，只能把字压到 11，
   而 11px 中文在小程序里已经不可读了。
2. **它把成果说成了通知**：加记录是这一屏唯一的正反馈时刻，toast 的语义是「顺便告诉你一声」，
   与「颜值即卖点」的定位冲突。

改成一枚居中的**徽章**：圆环 = 今日预算用掉了多少，中心大字 = 这次加了多少。
**不做撤销**（四版对照一致要求去掉，v1.0 记录删除走首页餐次行的长按）。

## 1. 结构 `Dz3YV`

| 区块 | 规格 |
|---|---|
| Mask | 375×812 `#00000080`，全屏；不放把手、不放关闭按钮 |
| Medallion_A | **264×256**，页内居中（x56 y278）`r28` `fill $bg` + 阴影 `#0A4F3D24` y14 blur36；`layout:none`，子节点绝对定位 |
| Track | `ellipse` x70 y38 124×124，`stroke #1FBF8F26` 16px（= mint 15% alpha，不是灰） |
| Progress | `path` x0 y-10 264×256，`fill $mint`，圆心 (132,126)、R70 / r54（见 §1.2） |
| CapStart / CapEnd | `ellipse` 16×16 `$mint`，装在环形带中线两端 → 圆头收尾（Pencil 与小程序都能画，原生 canvas 用 `lineCap:'round'`） |
| NumStack | frame x0 y70 264×60 竖排居中 gap1：`BigNum` Inter 34/700 `$ink`（325）+ `Unit` `$fb` 11/600 `$muted`（kcal）。**数字与单位上下排，不放同一行**——同一行会与环带撞 |
| BudgetRow | frame x0 y182 264×20 居中 → `今日 1 120 / 1 800 kcal` 13/600 `$ink2` |
| MealRow | frame x0 y208 264×18 居中 gap4 → `lucide:check` 12 `$mint` + `夜宵 · 已加入` 12 `$muted` |

- **上下留白必须相等**（30/30）。删掉撤销胶囊后内容整体会偏下，六个子节点的 y 已统一上移 10 校准；
  后续若加/删一行，按 §1.3 的垂直节奏重算，不要只改 `y`。
- `BigNum` 用**等宽数字**（`font-variant-numeric: tabular-nums`；小程序直接 `Inter`，UC 无 tabular 时见 §3 备注）。
- 千位分隔用空格不用逗号（`1 120`），与首页大数字一致。

### 1.2 环的几何（画板里是死路径，实现要按公式算）

设计稿里 `Progress` 的 path 是**手工算好的一次性几何**，实现时按下面的公式生成：

```uts
// 环形扇区：圆心(cx,cy)，外半径 R，内半径 r，从 12 点顺时针扫 ratio(0..1)
export function ringSector(cx: number, cy: number, R: number, r: number, ratio: number): string {
  const k = Math.min(Math.max(ratio, 0), 1)
  const a0 = -Math.PI / 2
  const a1 = a0 + k * Math.PI * 2
  const la = (a1 - a0) > Math.PI ? 1 : 0
  const p = (rad: number, ang: number): string =>
    (cx + rad * Math.cos(ang)).toFixed(2) + ' ' + (cy + rad * Math.sin(ang)).toFixed(2)
  return 'M' + p(R, a0) + ' A' + R + ' ' + R + ' 0 ' + la + ' 1 ' + p(R, a1) +
         ' L' + p(r, a1) + ' A' + r + ' ' + r + ' 0 ' + la + ' 0 ' + p(r, a0) + ' Z'
}
```

**但真机不要走这条路。** 扇区填充每个弧角都要重算路径，60fps 下会掉帧，两端圆头还得额外补。
真机统一按 §3 的**双层圆环 / canvas 描边弧**实现；上面的公式只用来校准画板上那条 path 的起止点。

### 1.3 垂直节奏

徽章内 264 宽、256 高，`r=54` 的环带内径约 108，所以**只有环心 108×108 那块能放字**。
可用列宽 264，行高从上到下：环顶留 30 → 环 124 → `NumStack` 60（压进环内 y70）→
`BudgetRow` 20 → `MealRow` 18 → 下留 30。加行会挤掉环，**这个徽章最多三行文本**。

## 2. 动效规范（`MU1O4` 时间轴，画板 1010×420）

时间到画板 x 的映射：`x = 200 + ms × 0.225`。

| # | 元素 | 属性 | 起点 | 时长 / 曲线 |
|---|---|---|---|---|
| L1 | 压暗层 | opacity 0→1 | 0ms | 200ms linear |
| L2 | 徽章 | scale 0.86→1 + opacity | 0ms | 360ms `cubic-bezier(.16,1,.3,1)`（out-expo） |
| L3 | **环 ∥ 数字** | 扫过角 & 计数 | 140ms | **620ms easeOutCubic**，共用同一个 `t` |
| L4 | 今日行 | opacity + 上移 8px | 480ms | 240ms ease-out |
| L5 | 夜宵行 | opacity | 600ms | 200ms ease-out |
| L6 | 对勾 | scale 0.4→1 | 620ms | 260ms spring |
| L7 | 触感 | `uni.vibrateShort` | 环到位那一帧（≈760ms） | 单帧 |
| L8 | 静默 hold | 无动画 | 880ms | 1 280ms |
| L9 | 退出 | scale 1→0.94 + opacity→0 | 2 160ms | 220ms `cubic-bezier(.4,0,1,1)` |

**L3 是整个反馈的灵魂**：环扫多少度与数字涨到多少必须来自**同一个进度变量**，不能一个用 CSS transition、
一个用 JS 计时器——两者曲线不同就会露馅（数字到顶了环还在转 = 假）。

```uts
const RING_MS = 620
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3)

// 单一进度源：一个 rAF/interval 驱动三处显示
start = Date.now()
tick(): void {
  const p = easeOutCubic((Date.now() - this.start) / RING_MS)
  this.progress = p                        // 环：strokeDashoffset = C * (1 - p)
  this.shown = Math.round(p * this.kcal)   // 数字
  if (p >= 1 && !this.done) { this.done = true; uni.vibrateShort({ type: 'light' }) }
}
```

- **只用 scale，不用 translateY**。位移会让徽章在压暗层上"飘"，读起来像没对齐；缩放配合
  out-expo 才有"落定"感。
- **阴影不做动画**。Pencil 的 effect 与小程序的 `box-shadow` 都不可补间（会掉帧），静态挂上即可。
- 数字滚动期间宽度会变（325 → 3 位、1 120 → 5 位）：`NumStack` 是居中竖排，等宽字形 + 居中对齐
  已经把抖动压到最低；uni-app x 无 `tabular-nums` 时用 `width: 3ch` 的固定宽容器兜住。
- **超预算分支**：`after > goal` 时环扫满（ratio=1）、描边换 `$amber #E8B54D`（渐变浅端写作
  token 色 + 55% alpha = `#E8B54D8C`），`BudgetRow` 转珊瑚文字，`MealRow` 前缀对勾换 `alert-circle`。
  **中心大数字保持墨绿 `$ink`**——它是"这次吃了多少"，不是坏消息，变红会把两条信息混成一件事。
- **降级**：`deviceStore.level == 'low'` 时只留 L1/L9 的淡入淡出，L3 直接落终值、去掉 vibrate。

## 3. 环的跨端实现

| 端 | 方案 |
|---|---|
| 微信小程序 | 双层圆环 CSS：外圈 `border-radius:50%` + `background: conic-gradient($mint 0turn, $mint ratio*1turn, transparent 0)`，内圈同圆心盖一层 `$bg` 圆 → 得到环形带；两端圆头用两个 16×16 mint 圆点定位在弧的两端（**圆头随 ratio 移动，位置由 `sin/cos` 算，别写死**） |
| uni-app x（App） | 原生 CSS **不支持 `conic-gradient`**。改用 `<canvas>` 2d：`arc(cx, cy, 62, -π/2, -π/2 + ratio*2π)`，`lineWidth = 16`，`lineCap = 'round'`，一次 `stroke()` 就是带圆头的环。每帧 `clearRect` + 重画，`requestAnimationFrame` 驱动 |
| 两端共用 | **描边弧 + dashoffset** 也可行（`stroke-dasharray = C`、`stroke-dashoffset = C*(1-p)`），小程序 `view` 画不出描边，所以只在 App 端 canvas 里用它；关键是**两端都从同一个 `progress` 取数**，别各算各的 |

小程序 `conic-gradient` 需要基础库 ≥2.11 且不支持 `from` 角度变量的低端机会退化成整圆：
渲染前先 `wx.getSystemInfoSync().SDKVersion` 判断，低于阈值直接显示完整环 + 数字（信息不丢）。

## 4. 交付图

| 文件 | 内容 |
|---|---|
| `export/50-settlement-badge.png` | 弹层③：325 kcal 结算徽章（环扫 62%、今日 1 120 / 1 800、夜宵已加入），2x |
| `export/51-motion-timeline.png` | `MU1O4` 动效时间轴：9 条轨道 0–2 400ms，标出 760ms 的 vibrate 单帧 |

## 5. 落地清单

- [ ] `components/SettleBadge.uvue` + `SettleBadge.md`：props `kcal / before / after / goal / meal`，
      内部 `progress` 单一进度源
- [ ] 确认环的两端实现（小程序 conic / App canvas），两端都吃同一个 `progress`
- [ ] 触发时机：`food` store 写入记录成功后由调用页 `show`，不要在组件里自己发请求
- [ ] 时长表（§2）里的 ms 数值建议提到 `styles/tokens.css`，与 v4 的 motion 时长一起管
