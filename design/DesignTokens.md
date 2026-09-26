<!--
  [变更日志]
  修改时间：2026-09-26
  AI模型：CodeBuddy (GLM)
  修改内容：[§3 字号正式重写为 Typography v2 —— 来源由「Ardot 变量集导出」改为「反向测绘当前实施事实」
    （207 条 font-size 规则 / 31 档 / 16 个 .uvue，稿面口径 稿面 1pt@375 = 代码 2rpx）。
    Boss 已拍板五项：①Body 26 / Body Strong 28 / Body Small 24 / Caption 22，旧 body 27rpx 退役但代码不动、
    登记为 Input Text；②Micro 19 / Micro Dense 18 / Micro Tight 17 三档并存不统一；③34 固定为 Title 家族，
    35＝Stat Number·DayDetail 与 36＝Stat Number·Profile 暂时并存（P2 Backlog）；④104rpx＝Hero XL，
    scope: Home only，已有真机验收，禁止降为 92；⑤采纳 Unit Modifier（派生 + ±2rpx 容差 + Exception 登记）。
    本章分层为 A 正式全局 / B Component-specific / C 不进入 Typography（Glyph・Chart・Modifier）。
    **本轮 .uvue 字号实际改动 = 0**；§1 颜色 / §2 圆角 / §4 / §5 / §6 / §7 / §8 及附录均未改动]
-->
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[§7.2 浅色态材质定稿修正（Boss 拍板「不接受气泡隐身」）：胶囊底 88% → **60%**（88% 系稿面文字标注漏改）；
    浅色气泡新增白 60% 1px 描边 ＋ 投影 0/4/12 #000 6%，暗态与降级档明写「保持现状不动」；
    并登记「浅色气泡保留文字标注值 18%、不取节点 25%」的实测依据（同帧同点位仅差 1–2 色阶）。
    §7.1 的 tb-bubble-line 用途随之更正（浅色玻璃档此后并非无描边）。上一条日志的「无描边」为当时原貌，不回改]
-->
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[新增 §7「TabBar 液态玻璃专用 token」——Boss 批准把 Pencil gFuXt「Tab 关键帧（微博标准版）」
    文字规格里的 6 个色值（#17916B / #8A8A8A / #52D6AC / #8B9E94 / #F8FCFA / #E3EFE8）正式补录为
    TabBar 语义色，并补记胶囊/气泡几何与材质（气泡＝纯 backdrop-filter + 18%／13% 实色透明，
    无描边、无内高光：Boss 裁定「文字标注为唯一真理，忽略节点遗留渐变」）。
    §5.1 的 line-hairline 用途加注：通栏 TabBar 上边线随 2026-09-22 胶囊化退役]
-->
<!--
  [变更日志]
  修改时间：2026-09-19
  AI模型：CodeBuddy (GLM)
  修改内容：[首版：由 Ardot 变量集 CalTrack 经 export_variables 提取，11 色 + 3 圆角 + 5 字号，
    并附「与旧文档差异清单」§6（此前 AGENTS／VisualLanguage 手抄色值普遍差 1）]
-->

# CalTrack 设计 Token（唯一事实来源）

> **来源**：Ardot 设计文件「CalTrack 高保真 UI」（fileId `727289305476547`）的变量集 `CalTrack`（Light 模式）
> **提取方式**：Ardot MCP `export_variables` / `fetch_variables`　｜　**提取时间**：2026-09-19
>
> ⚠️ **为什么必须有这份文件**：`AGENTS.md` 与 `design/VisualLanguage.md` 里的色值是**手抄的，普遍差 1 甚至数值不同**
> （如 bg 写成 `#F1FAF6`，设计稿实际是 `#F2FAF5`）。按 `AGENTS.md`「**以 Ardot 设计稿为唯一视觉准绳**」的规则，
> **本文件为准**。
>
> ✅ **2026-09-19 已同步**：`AGENTS.md` / `VisualLanguage.md` / `UI_Spec.md` 三份文档的色值**已按本文件全量校正**
> （Boss 裁定「以 ardot 设计稿为准」，共修正 22 处），差异清单见 §6（保留作追溯）。

---

## 1. 颜色（11 个）

| Token | 值 | 用途 |
|---|---|---|
| `mint-e1` | `#7DEBC7` | 液面高光、浅色填充 |
| `mint-e2` | `#1FBF8F` | 液体主体、按钮底、激活态 |
| `mint-e3` | `#0D9C73` | 瓶底深、渐变终点 |
| `mint-deep` | `#0A7A5C` | **小字（≤15px）专用深色** |
| `bg` | `#F2FAF5` | 页面底 |
| `label-1` | `#0A4F3D` | 主文字 |
| `label-2` | `#0F4F3D` **@ 60%** | 次级文字 |
| `label-3` | `#0F4F3D` **@ 34%** | 占位、未激活 |
| `coral` | `#FF9E7D` | 超标（温和，不用红） |
| `amber` | `#E8B54D` | 接近上限 |
| `glass-bg` | `#FFFFFF` **@ 74%** | 玻璃卡片底 |

> ⚠️ `label-2` / `label-3` / `glass-bg` **带透明度**。实现时必须输出 rgba 或 hex8，
> **不能丢 alpha**（用 hex6 导出会静默丢掉，得到不透明的错误值）。
>
> 对应 rgba：`label-2` = `rgba(15,79,61,0.6)` ｜ `label-3` = `rgba(15,79,61,0.34)` ｜ `glass-bg` = `rgba(255,255,255,0.74)`

## 2. 圆角（3 个）

| Token | 值 | 用途 |
|---|---|---|
| `radius-card` | `20px` | 卡片 |
| `radius-chip` | `18px` | 标签 / chip |
| `radius-sheet` | `34px` | 底部 Sheet |

## 3. 字号（Typography v2 · 2026-09-26 定稿）

> **本章自 v2 起不再是「Ardot 变量集导出值」，而是反向测绘得到的「当前实施事实」。**
> 测绘口径：`app/**/*.uvue` 的 `<style>` 块，共 **207 条 `font-size` 规则 / 31 个不同字号 / 16 个文件**；
> 稿面对照口径 `稿面 1pt @375 = 代码 2rpx`（Pencil Home / Profile / Records / DayDetail 四板可读）。
> 旧导出值保留在文末附录「Ardot 变量集原始导出（供核对）」，不删不改，仅作历史追溯。
>
> ⚠️ **本章的作用是「登记」，不是「规范」。** v2 定稿时**未修改任何 `.uvue` 字号（实际改动 = 0）**。
> 凡代码中与本章登记值不同者，**以代码现有值为准**，登记为 Component-specific 或 Exception。
> **严禁因为「不符合本章」而直接改代码** —— 这正是 v1（5 档）造成的误判来源。
>
> 🔒 **单位换算**：`1px = 2rpx`（即 46px = 92rpx）。下表统一以 `rpx（px）` 双写。

### 3.1 A · 正式全局 Token（跨页面复用同一语义）

| 分类 | Token | rpx | px | 现状使用位置 | 稿面证据 |
|---|---|---:|---:|---|---|
| Display | `type-display-hero` | 92 | 46 | `Profile.bignum` / `DayDetail.dd-bignum` / `GoalModal.gm-bignum` / `Detail.ec-cal-num`（4 文件，对象＝当日总量） | ✔ 双板 45.5pt |
| Title | `type-title-page` | 48 | 24 | `Home.title`「轻律生活」（单点，但语义唯一） | ✔ 23.8pt |
| Title | `type-title-screen` | 38 | 19 | `Records.lr-title` / `DayDetail.dd-title` / `Settings.hd-title`（＋`Home.remain-label`、`Home.remain-unit`） | ✔ |
| Title | `type-title-nav` | 34 | 17 | `*-nav-title` **跨 4 页一致**，＋`Home.meal-section-title`、`GoalModal.gm-title`、`AddFood.food-name`、`Home.meal-name`、`DayDetail.dd-meal-num`（10 处 / 7 文件） | ✔ |
| Title | `type-title-card` | 31 | 15.5 | `FoodPicker.fp-row-name`、`AddFood.form-label`、`Detail.ec-card-title` 等卡片标题（6 处） | 间接 |
| Title | `type-title-block` | 30 | 15 | `DayDetail.dd-sec` / `Settings.sec-title` / `Home.meal-kcal` / `Home.hm-macro-val` / `GoalModal.gm-qnum` / `Detail.ec-cal-unit` / `AddFood.confirm-text`（9 处 / 6 文件） | 间接 |
| Body | `type-body-strong` | 28 | 14 | `Records.lr-mkcal` / `lr-mlabel`、`Profile.rec-num` / `ring-pct`、`Settings.row-title` / `danger-text`、`Dialog.dialog-text`（18 处 / 8 文件，语义＝数值・强调・行标题） | ✔ 14pt |
| Body | `type-body` | 26 | 13 | `Home.subtitle` / `meal-row-name`、`DayDetail.dd-row-name`、`Records.lr-sum-date`、`OptionTray.opt-name`、`Profile.card-title`（**21 处 / 12 文件**，语义＝列表正文） | ✔✔ 双板 13pt |
| Body | `type-body-sm` | 24 | 12 | `Tabbar.tb-label`、`FoodPicker.fp-row-sub`、`AddFood.change-text`、`GoalModal.gm-sub`、`DayDetail.dd-empty-txt`（**25 处 / 13 文件**） | ✔✔ |
| Body | `type-caption` | 22 | 11 | `Home.hm-macro-cap`、`Records.lr-wd` / `lr-sub`、`OptionTray.opt-sub`、`Detail.ec-guide-text`、`Settings.hd-sub`（20 处 / 10 文件） | ✔✔ |
| Micro | `type-micro` | 19 | 9.5 | `DayDetail.dd-plabel` / `dd-punit` / `dd-stat-title`、`Records.lr-sum-in` / `lr-overtxt` | ✔ |
| Micro | `type-micro-dense` | 18 | 9 | `Profile` 全部 7 条（`stat-lbl` / `week-lbl` / `rec-unit` / `bar-val-over` …，页内自洽） | ✔ 9pt × 7 逐条对应 |
| Micro | `type-micro-tight` | 17 | 8.5 | `Records.lr-mtime` / `lr-mcount`、`DayDetail.dd-stat-lbl` / `dd-overtxt` | ✔ |

**旧 5 档 Token 去向（追溯用）**

| 旧 Token | 值 | v2 处置 |
|---|---:|---|
| `type-hero` | 46px = 92rpx | ✅ **仍然有效** → 继承为 `type-display-hero` |
| `type-title` | 17px = 34rpx | ⚠ **语义已变窄** → 改名 `type-title-nav`（只覆盖导航栏标题，未覆盖页面主标题）；真・页面标题另设 `Page 48` / `Screen 38` |
| `type-section` | 15.5px = 31rpx | ⚠ **语义已变窄** → 改名 `type-title-card`；通用分节标题实际主力是 `Block 30` / `Nav 34` |
| `type-body` | 13.5px = 27rpx | ❌ **退役** → 正文由 `26rpx` 接任；27rpx 转 Component-specific `type-input-text`（代码值不动） |
| `type-caption` | 12px = 24rpx | ⚠ **语义拆分** → 旧值成为 `type-body-sm 24`；真正的 caption 由 **22rpx** 新设 |

### 3.2 B · Component-specific Token（有稳定语义，但不跨页复用）

| Token | rpx | px | scope | 备注 |
|---|---:|---:|---|---|
| `type-hero-xl` | 104 | 52 | **Home only（page-private）** | 🔒 **冻结**：已有真机验收记录，**禁止因体系统一降为 92**。承载对象＝「剩余额度」，与 Hero＝「当日总量」是不同对象 |
| `type-hero-number` | 72 | 36 | `AddFood.big-kcal` | |
| `type-serving-number` | 68 | 34 | `CountStepper.capsule-num`、`SettleBadge.sb-big-num` | |
| `type-stepper-number` | 60 | 30 | `CountStepper.capsule-input` / `capsule-num-small`、`FoodToast.ft-plus-num` | |
| `type-records-hero` | 42 | 21 | `Records.lr-sum-num` | 稿面 21pt |
| `type-stat-number` | 35 | 17.5 | `DayDetail.dd-stat-num` | 稿面 17.5pt × 3 逐项吻合 |
| `type-stat-number-alt` | 36 | 18 | `Profile.stat-num` | ⚠ **P2 Backlog**：同一语义角色两值并存；稿面双板均为 35rpx，疑 Profile 侧 1rpx 漂移。**现阶段不改代码**（1rpx = 0.5 逻辑像素，无视觉证据） |
| `type-tab-label` | 24 | 12 | `Tabbar.tb-label` | |
| `type-ring-pct` | 29 | 14.5 | `DayDetail.dd-ring-pct`、`dd-bigunit` | Profile 同角色用 28（落在 Body Strong 带内） |
| `type-ring-label` | 16 | 8 | `DayDetail.dd-ring-label`、`Profile.ring-lbl` | |
| `type-input-text` | 27 | 13.5 | `FoodPicker.fp-search-input`、`Detail.ec-review-text` / `ec-hot-title`、`GoalModal.gm-tip-title` | **旧 `type-body` 值的继任。代码中的 27rpx 保持不动** —— 它是输入框的 comfortable 命中档，不是正文 |
| `type-body-long` | 28 | 14 | `PrivacyDialog.dialog-text`（`lh 44rpx`，ratio 1.57） | 长段落；字号虽同 Body Strong，换档时必须单独考虑 |

### 3.3 C · 不进入 Typography Token 的值

| 项 | 值 | 为什么不进 Typography Token |
|---|---|---|
| **Glyph Scale** | 17 条装饰字符，跨 20–68rpx（`＋ − ✓ › ⌕ ✕ !` 及 emoji） | 是「视觉图标」而非文字，按其自身视觉尺寸档位管理。**注意 44rpx 整档只有一条 `Detail.ec-result-chev`（字符 `›`）**，该档在字号体系中不应存在 |
| **Chart Axis** | 14rpx（7px） | `Profile.ax` / `ax-green` / `bar-val` / `target-tag-text` —— 纯图表刻度，稿面 7pt；**明确不并入正文体系** |
| **Chart Label** | 16rpx（8px） | `Profile.bar-date`（柱状图日期） |
| **Unit Modifier** | 派生值，见 3.4 | 单位字号随宿主数字变化，**不建静态字号 Token** |

### 3.4 Modifier · 单位字号派生规则（机制，不是数值）

```
unit-size 由 host（相邻数字）档位派生，禁止直接书写固定字号：

  host ≥ 92rpx        → unit 28rpx   （容差 27–30）
  host 60–72rpx       → unit 26rpx   （容差 22–28）
  host 22–42rpx       → unit 19rpx   （容差 16–20）
  host ≤ 21rpx        → 与 host 同字（inline）

  · 容差规则：±2rpx 以内可按版面需要调整；越出必须登记为 Exception
  · 现状核对：全项目 15 处单位字号中，14 处落在上述容差带内
  · 禁止新增 `kcal-unit` / `unit` / `unit-sm` 之类的独立字号 Token
```

**Exception 登记（唯一一处）**

| 值 | 位置 | 理由 |
|---|---|---|
| `Home.remain-unit` 38rpx | `Home.remain-unit` | 属 **Hero XL 组合构图**（连同 `.remain-label 38rpx`、`.remain-num` 的 `lh 116rpx` 一并冻结），不是普通「单位」；**保持不变** |

### 3.5 未登记值说明（防止后人误读为 Bug）

代码中还有 **25 / 23 / 21 / 20rpx** 四档（共 24 条规则）未进入本章。它们均落在相邻正式 Token 的
**±2rpx 容差带内**（Body 26 / Caption 22 / Body Small 24 / Micro 19），属版面局部微调，
**现阶段不动**；未来重绘稿面时可自然收敛。

### 3.6 已知未 Token 化的维度（本章只记录事实，不处理）

- **`line-height`**：207 条字号规则中仅 **19 条（9%）** 声明行高；同为 92rpx 的 4 处 lh 分别为 `96 / 100 / 110 / 112` —— **纵向节奏尚未 token 化**。
- **`font-weight`**：未声明 106 条 / `bold` 79 条 / `700` 16 条 / `800` 4 条 / `normal` 2 条 —— `bold` 与 `700` 数值同义却两种写法。

## 4. 文字/背景分级规则（重要）

薄荷绿 `mint-e2 #1FBF8F` 在白底上对比度仅约 **2.3:1**，**不能直接用于小字**。

| 场景 | 用哪个 |
|---|---|
| 小字强调（≤15px） | `mint-deep` `#0A7A5C` |
| 大数字 / 标题 | `label-1` `#0A4F3D` |
| 按钮底 / 标签底 | `mint-e2` `#1FBF8F`（配白字，对比度够） |
| 主渐变 | `mint-e1 #7DEBC7 → mint-e2 #1FBF8F → mint-e3 #0D9C73` |

## 5. 设计稿实测衍生色（组件级，未定义为变量）

以下色值**在 Ardot 变量集里没有定义**，但**画板节点实际在用**（2026-09-19 用 `batch_read` 逐屏提取，
完整出现位置见 `design/ScreenSpecs.md` §9）。实现时直接写死即可，不占用正式 token。

### 5.1 描边与分隔

| 名称 | 值 | 用途 |
|---|---|---|
| `line-hairline` | `#D6E9E1` | 旧通栏 TabBar 上边 0.5px（2026-09-22 胶囊化后 TabBar 不再使用，见 §7） |
| `line-nutrient` | `#E3F0EA` | 营养素三项之间的 1×32 竖线 |
| `line-card` | `#DCEDE6` | 卡片 / 输入框描边 |
| `line-danger` | `#F5D5C8` | 危险卡描边 |

### 5.2 底色

| 名称 | 值 | 用途 |
|---|---|---|
| `bg-sheet` | `#FBFEFC` | 两个 Sheet 的底面 |
| `bg-input` | `#F5FAF8` | 3 个 Modal 的输入框底 |
| `bg-tab-idle` | `#F8F9FC` | 未选中的分类 Tab 底 |
| `bg-minus` | `#EAF3EF` | 目标设置的减号按钮底 |
| `bg-chip-reset` | `#F2FAF6` | 「恢复」chip 底（描边 `#BFE3D6`） |

### 5.3 文字（实测视觉值）

| 名称 | 值 | 用途 |
|---|---|---|
| `text-2` | `#7A8F88` | 次级文字（即 `label-2` 叠在白底上的视觉结果） |
| `text-3` | `#A9BAB3` | 三级文字 / 占位 / 提示 |
| `text-footer` | `#C2D4CC` | 设置页页脚副文案 |

### 5.4 其他

| 名称 | 值 | 用途 |
|---|---|---|
| `shadow-danger` | `#E0633C` | 危险卡阴影色（用其 8% 透明） |
| Blue | `#38A3F5` | 链接、次要操作 |
| Purple | `#A88BE8` | 预留（营养素） |
| 分隔线 | `rgba(18,110,85,0.10)` | 通用 0.5px hairline |

## 6. 与旧文档的差异清单（已修正，保留追溯）

| 项 | 旧文档值 | **设计稿实际值（准）** | 出错位置 |
|---|---|---|---|
| mint-e1 | `#7CEBC6` | **`#7DEBC7`** | `AGENTS.md` 色板 ／ `VisualLanguage.md` §3.1 |
| mint-e2 | `#1FBF8F` | `#1FBF8F` ✅ 一致 | —— |
| mint-e3 | `#0E9C74` | **`#0D9C73`** | `AGENTS.md` ／ `VisualLanguage.md` §3.1 |
| mint-deep | `#0B7A5C` | **`#0A7A5C`** | `AGENTS.md` ／ `VisualLanguage.md` §3.4 |
| bg | `#F1FAF6` | **`#F2FAF5`** | `AGENTS.md` ／ `VisualLanguage.md` §3.3 |
| label-1 | `#0B4F3C` | **`#0A4F3D`** | `VisualLanguage.md` §3.3 |
| label-2 | `rgba(16,80,62,.60)` | **`rgba(15,79,61,.60)`** | `VisualLanguage.md` §3.3 |
| label-3 | `rgba(16,80,62,.34)` | **`rgba(15,79,61,.34)`** | `VisualLanguage.md` §3.3 |
| amber | `#E9B44C` | **`#E8B54D`** | `VisualLanguage.md` §3.2 |
| coral | `#FF9E7D` | `#FF9E7D` ✅ 一致 | —— |
| glass-bg | `rgba(255,255,255,.74)` | `rgba(255,255,255,.74)` ✅ 一致 | —— |

> **差异性质**：多为 ±1 的抄写误差，视觉上几乎不可辨；但 `bg`（`#F1FAF6` vs `#F2FAF5`）差异更大。
> 既然 `AGENTS.md` 规定「设计稿是唯一准绳」，一律以设计稿值为准。

## 7. TabBar 液态玻璃专用 token（2026-09-22 补录）

> **来源**：Pencil 设计稿 `gFuXt`「Tab 关键帧 (微博标准版)」的**文字规格**（Boss 2026-09-22 拍板：
> 文字标注为唯一真理，同一张稿里气泡节点遗留的三段渐变与手绘内高光**一律不实现**）。
> 这六个色**只服务 TabBar**，不得挪作其他组件；旧 Ardot 变量集（§1~§3 的来源）已于 2026-09-21 废止，
> 故本节的值不再进 Ardot，只在此处登记。

### 7.1 文字与降级底色

| Token | 值 | 用途 |
|---|---|---|
| `tb-text-on` | `#17916B` | 浅色态·选中 Tab 文字 |
| `tb-text-off` | `#8A8A8A` | 浅色态·未选中 Tab 文字 |
| `tb-text-on-dark` | `#52D6AC` | 暗黑态·选中 Tab 文字 |
| `tb-text-off-dark` | `#8B9E94` | 暗黑态·未选中 Tab 文字 |
| `tb-bar-idle` | `#F8FCFA` | **降级档**（`device.backdropBlur=false`）胶囊不透明底 |
| `tb-bubble-line` | `#E3EFE8` | **降级档**气泡描边（浅色玻璃档另有白 60% 折射亮边，见 §7.2；暗态玻璃气泡无描边） |

### 7.2 几何与材质（同稿实测 ＋ 浅色态 2026-09-22 定稿修正）

| 项 | 浅色 | 暗黑 | 降级（无模糊） |
|---|---|---|---|
| 胶囊 | 343×56，r28，距两侧 16，**底 `#FFFFFF 60%`**（定稿值；稿面文字标注原写 88%，Boss 判定「太厚、压不住气泡」＝漏改） ＋ 顶部折光 `#FFFFFF 60%→0`（占上 45%）＋ 描边 `#FFFFFF 80%` 1px ＋ `blur 24` ＋ 投影 `0 / -4 / 24 / #0A4F3D 14%` | 底 `#162924 72%` ＋ 折光 `#FFFFFF 10%→0` ＋ 描边 `#FFFFFF 10%` ＋ 投影 `0 / 8 / 24 / #000 30%`（**保持现状不动**） | 底改不透明 `tb-bar-idle`，折光／投影保留 |
| 选中气泡 | 96×44，r22，完全内嵌（上下各留 6、左右各留 4），底 `#FFFFFF 18%` ＋ `backdrop-filter blur(20px)` ＋ **定稿新增**：描边 `#FFFFFF 60%` 1px（模拟玻璃折射亮边）＋ 投影 `0 / 4 / 12 / #000 6%`（悬浮高度差）。**仍不做**节点遗留的三段渐变与手绘内高光 | 底 `#FFFFFF 13%` ＋ `blur 28px`，投影 `0 / 6 / 18 / #000 38%`，**无描边**（保持现状不动） | 气泡实色 `#FFFFFF 88%` ＋ 描边 `tb-bubble-line`，动画保留 |
| 图标 | 首页 22 ／ 日历 23 ／ 我的 23.5（源图留白不等，按视觉等大回调） | 需另出染色 PNG（**尚未产出**，当前暗态暂用浅色图标） | 同浅色 |
| 文字 | Inter 12 / 600，图标与文字 gap 6 | 同 | 同 |

> **浅色气泡底色取 18% 而非稿面节点的 25%（Boss 授权 AI 按真机观感自定）**：模拟器同帧同点位实测
> 18% 与 25% 的气泡内区仅差 1–2 个色阶（`252,254,253` ↔ `253,255,254`），肉眼不可辨；
> 轮廓感实际由新增的描边＋投影提供，故保留**文字标注值 18%**（更少偏离稿面）。

### 7.3 页底预留

Tab 页内容底部预留统一采用**方案 A 动态安全区全避让**：
- **无小白条机型**：基准 **92px**（＝胶囊 56 ＋ 离底 22 ＋ 呼吸留白 14）。
- **有小白条全面屏机型（如 iPhone 系列）**：**`calc(82px + env(safe-area-inset-bottom))`**（以标准 safeBottom 34px 计实占 **116px** ＝ 胶囊 56 ＋ 贴安全区 12 ＋ safeBottom 34 ＋ 呼吸留白 14）。
确保用户将页面滚到最底端时，内容末行完整清晰暴露在 Tabbar 胶囊上方，不发生任何截断或遮挡。同时**废弃 #29 的随滚动渐显（fade）机制**——新胶囊的设计前提是「恒常可见」，在滚动浏览过程中产生实时折射。

---

## 8. 主题 token 角色表（2026-09-25 定稿，三主题 × 亮/暗双态）

> **来源**：Pencil「食物百科 · 详情页」`Nnctn`（fd-* 变量体系）与「食物百科 · 搜索态 v2」`POU8h`（旧 mint 直值）
> 全量提取 + Mint Dark 13 帧聚合色板。两页色板不一致（fd-title `#0F172A` slate vs ink `#0A4F3D` 绿墨），
> 由本表统一；搜索页向 fd-* 对齐。
> **用法**：代码只写角色名，经 `composables/useTheme.ts` 按 `(角色, mode, accent)` 查表取 hex。
> 严禁在页面里新增裸 hex——新色必须先登记为本表角色或 §8.3 固定色。

### 8.1 角色 × 主题矩阵（19 角色）

| 角色 | 用途 | mint·亮 | mint·暗 | ocean·亮 | ocean·暗 | lav·亮 | lav·暗 |
|---|---|---|---|---|---|---|---|
| `bg` | 页面底 | `#F6FBF8` | `#0A1612` | `#F5FAFD` | `#0A1218` | `#FAF8FE` | `#100D1A` |
| `card` | 卡片底 | `#FFFFFF` | `#162924` | `#FFFFFF` | `#14232E` | `#FFFFFF` | `#1D1830` |
| `card-soft` | 点评/次级卡底 | `#EEFAF6` | `#1A3B2F` | `#EAF4FB` | `#1A2E3B` | `#F3EFFC` | `#241E3C` |
| `chip` | 标签/图标托底 | `#E6F9F6` | `#2A4238` | `#E1F0FA` | `#1E3A4C` | `#EFEAFC` | `#2B2350` |
| `line` | 分隔线/描边 | `#D8EFE5` | `#24443A` | `#D2E7F3` | `#24424F` | `#E3DCF5` | `#372D5E` |
| `ink-1` | 一级文字 | `#0F172A`* | `#FFFFFF` | `#0F2A3D` | `#FFFFFF` | `#241D47` | `#FFFFFF` |
| `ink-2` | 二级文字 | `#475569`* | `#FFFFFFB8` | `#3D5A6E` | `#FFFFFFB8` | `#4E4675` | `#FFFFFFB8` |
| `ink-3` | 辅助/占位文字 | `#8BA7A0`* | `#8B9E94` | `#7E96A6` | `#8FA6B2` | `#9A93B8` | `#9E96BC` |
| `accent` | 品牌主色 | `#20C997` | `#52D6AC` | `#2F9FE0` | `#5BC8FF` | `#8B7BE8` | `#A99BFF` |
| `accent-2` | 渐变亮端 | `#2BD6A3` | `#6FE3BF` | `#4FB8F0` | `#7AD6FF` | `#A48CF0` | `#BFB2FF` |
| `accent-deep` | 强调深字/图标（**极端档**） | `#064E3B` | `#A7F0DA` | `#0B5E8F` | `#A8E4FF` | `#4F3FA8` | `#D6CCFF` |
| `accent-mid` | 渐变深端 / 次级强调字（2026-09-27 补） | `#17916B` | `#52D6AC` | `#1B7BB3` | `#5BC8FF` | `#5A44DE` | `#A99BFF` |
| `on-accent` | accent 底上文字 | `#FFFFFF` | `#0A1612` | `#FFFFFF` | `#0A1218` | `#FFFFFF` | `#100D1A` |
| `glass-bg` | 玻璃面板底 | `#FFFFFFF2` | `#FFFFFF14` | `#FFFFFFF2` | `#FFFFFF14` | `#FFFFFFF2` | `#FFFFFF14` |
| `glass-scrim` | 玻璃遮罩 | `#F6FBF8A6` | `#0A1612A6` | `#F5FAFDA6` | `#0A1218A6` | `#FAF8FEA6` | `#100D1AA6` |
| `thumb-stroke` | 食物缩略图托边 | `#EAF9F3` | `#2A4238` | `#E3F0F9` | `#1E3A4C` | `#EEEAF9` | `#2B2350` |
| `dash-line` | 虚线分隔 | `#0A4F3D1F` | `#FFFFFF1F` | `#0F2A3D1F` | `#FFFFFF1F` | `#241D471F` | `#FFFFFF1F` |
| `hero-bg` | 首页 hero 渐变端 | `#E4F2E9` | `#0E211C` | `#E2F0F9` | `#0E1E26` | `#EDE7F7` | `#171126` |
| `sys-indicator` | Home Indicator | `#B9C9C3` | `#3A4F47` | `#B4C6D1` | `#33464F` | `#C3BCD6` | `#413A55` |

\* `ink-1/2/3` mint·亮列取百科稿 slate 值（`#0F172A`/`#475569`/`#8BA7A0`）。**A/B 待测**：测试轮将真机对比
slate 墨（稿面新意图）vs 绿墨（现全 App `#0A4F3D`/`#0F4F3D99`/`#0F4F3D57`），按「与品牌色协调 + 长文可读性」
择一锁定；未裁决前现有页面保持绿墨，百科新页用本表值。

### 8.2 派生规则（ocean / lavender 的暗黑未手绘，按此公式从 mint 推导）

- 暗态 `bg`/`card`/`card-soft`/`chip`/`line` = 对应亮态主题色相、饱和度压至 ~25%、明度按 mint 暗黑梯级（`#0A1612`→`#2A4238` 的 5 档）平移
- 暗态 `accent` = 亮态 accent 明度 +18%、饱和 −10%（mint 校验：`#20C997`→`#52D6AC` ✓ 与 Pencil Mint Dark 实测一致）
- **`accent-deep` 与 `accent-mid` 的分工（2026-09-27 补录）**：`accent-deep` 是**极端档**（浅态 mint 亮态 L≈0.19 近黑 / 暗态 L≈0.85 近白），只用于「深底上的高对比强调」；
  `accent-mid` 是**中间暗档**（浅态＝同色相压暗 accent，≈4:1；暗态＝该档 accent 本体），用于①渐变深端 ②需要色彩层次的强调字/数值。
  **反面教材**：此前 8 处 `linear-gradient(accent, accent-deep)` 与 30+ 处「强调字 = accent-deep」，导致按钮右下角发黑、强调文字与 `ink-1` 标题同色而失去层次（2026-09-27 统一整改）。
- 暗态 `accent-deep` 反转提亮（深底上强调字必须浅色）；暗态 `on-accent` 反转为该主题暗底（浅 accent 上白字对比不足）

### 8.3 固定色（不随主题/模式变，与 accent 严格分轴）

| Token | 值 | 用途 |
|---|---|---|
| `status-mint` | 即 `accent` 轴 | 热量正常档（跟随主题） |
| `status-amber` | `#E8B54D` | 接近上限档（永不换） |
| `status-coral` | `#FF9E7D` | 超标档（永不换） |
| `danger` | `#FF6B6B`（暗态）/ `#FF9E7D`（亮态） | 破坏性操作警示 |
| `info-carb` | `#FCA212` | 营养环·碳水图标 |
| `info-calorie` | `#FC7130` | 营养环·热量图标 |
| `info-protein` / `info-fat` | 即 `accent` | 营养环·蛋白/脂肪图标（跟随主题） |

> 排除红/橙/黄系做主题色的原因：与 `status-amber`/`status-coral`/`info-*` 色相冲突，会让用户分不清
> 「这是警告语义还是配色」。

### 8.4 资产 × 主题矩阵

- 瓶身/树叶/bg 卡 SVG：`status=amber/coral` 两套全局共用；正常态一套随主题换色相（toolchain 参数化重着色，零生图额度）
- 贴纸 PNG：三档文案色中 green 档跟随 `accent`，amber/coral 档固定
- 液体渐变（useLiquid PALETTES）：green 档基色改读 `accent` 轴
- Tabbar 气泡/选中文字：`tb-text-on` 系列改读 `accent`（§7 值降级为 mint 主题的历史基准）

---

## 附：Ardot 变量集原始导出（供核对）

```css
/* export_variables format=css colorFormat=hex6 numberUnit=px 的原始输出
   —— 注意 hex6 会丢 alpha，故 label-2/label-3/glass-bg 在此输出中不准，以上文 §1 为准 */
:root {
  --CalTrack-mint-e1: #7DEBC7;
  --CalTrack-mint-e2: #1FBF8F;
  --CalTrack-mint-e3: #0D9C73;
  --CalTrack-mint-deep: #0A7A5C;
  --CalTrack-bg: #F2FAF5;
  --CalTrack-label-1: #0A4F3D;
  --CalTrack-label-2: #0F4F3D;   /* 实际 60% 透明 */
  --CalTrack-label-3: #0F4F3D;   /* 实际 34% 透明 */
  --CalTrack-coral: #FF9E7D;
  --CalTrack-amber: #E8B54D;
  --CalTrack-glass-bg: #FFFFFF;  /* 实际 74% 透明 */
  --CalTrack-radius-card: 20px;
  --CalTrack-radius-chip: 18px;
  --CalTrack-radius-sheet: 34px;
  --CalTrack-type-hero: 46px;
  --CalTrack-type-title: 17px;
  --CalTrack-type-section: 15.5px;
  --CalTrack-type-body: 13.5px;
  --CalTrack-type-caption: 12px;
}
```
