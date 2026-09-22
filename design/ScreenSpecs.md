# ScreenSpecs.md — 8 屏开发对照清单

<!--
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[§0 与 §10 的 TabBar 现状批注更新：两处「实际＝双 Tab 共享组件」更正为**三 Tab 悬浮液态玻璃胶囊**（首页／日历／我的，Records 升一级 Tab）。下一条日志中的「双 Tab」为当时批次原貌，不回改]
-->
<!--
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[1. 头部说明补充：设计稿导出实为 9 张（8 屏命名图＋一张 A 方案首页备选），清单仍覆盖 01-08 八屏；2. §0 TabbarWrap 与 §10「加号上凸」行加 midbutton 方案废止批注（实际＝双 Tab 共享组件 Tabbar.uvue＋首页右上 FAB）；3. §3/§11 食物库计数滞后修正：347 条/58 条菜品→353 条/59 条菜品；4. §2/§5 弹窗遮罩处补现状批注（弹层壳已迁移为微信原生 page-container）]
-->

> **来源**：Ardot 设计文件「CalTrack 高保真 UI」`fileId 727289305476547`，由 `batch_read`（readDepth 3）逐屏提取。
> **用途**：开发时照此写样式，不必反复回设计稿。
> **优先级**：几何/间距/层级 **以本文件为准**（设计稿实测值）；**色值以 `design/DesignTokens.md` 为准**（变量集）。
> **单位**：设计稿为 375×812 @1x，所有数值直接当 CSS px 用。
> **提取时间**：2026-09-19
> **稿面导出说明（2026-09-22 校准）**：`assets/exports/` 实际有 **9 个文件**＝下列 8 屏命名图（01-08）＋ `caltrack-A-home-v2.png`（A 方案首页备选）。本清单仍覆盖 8 屏（01 首页 ～ 08 设置）。

---

## 0. 通用框架（8 屏共用）

| 区域 | 规格 |
|---|---|
| 画板 | **375 × 812** |
| 背景 | `--ct-bg` |
| `StatusBar` | 高 **62**，padding-x **24**（左时间 15px Inter SemiBold，右图标组 70×12） |
| `Content` | `flex:1`，`gap 9`，`padding: 0 18px 8px` |
| `Header` | 日期 17px SemiBold `--ct-label` + 右侧 `EditGoalIcon` **20×20** |
| `TabbarWrap` | 见下 |
| 左右边距 | **18** |
| 卡片间距（Content gap） | **9** |

### TabbarWrap（首页/添加/选择/我的 四屏共用）

> ⚠️ 已废止（2026-09-22 校准）：midbutton（Tabbar 中间上凸加号）方案未采用，实际实现＝共享组件 `app/components/Tabbar.uvue`（**三 Tab 悬浮液态玻璃胶囊**：首页／日历／我的，Records 已升一级 Tab）＋首页右上 FAB 加号，见 `docs/progress.md`。以下保留为 v1 稿面存档。

```
TabbarHairline : h 0.5  fill #D6E9E1
Tabbar         : h 78   padding-bottom 21
                 fill rgba(255,255,255,.74)  backdrop-blur 20
  Tab-Home     : flex 1
  Tab-MidSpacer: w 58 h 10        ← 给上凸加号让位
  Tab-Profile  : flex 1
  AddButton    : 58×58  x=158.5  y=-14   ← 上凸 14
                 双层薄荷阴影：
                   drop 0 6 14  rgba(13,120,90,.32)  showBehind
                   drop 0 12 26  rgba(13,120,90,.18) showBehind
```

> `TabbarWrap` 必须 `clipsContent: false`，否则上凸的加号会被裁掉（旧坑，已修）。

---

## 1. 首页 `01 · 首页 Home`｜node `3:22`

```
StatusBar (62)
Content (gap 9, padding 0 18 8)
├─ Header            → 日期 + EditGoalIcon 20×20
├─ BottleWrap
│   └─ Bottle        → 122 × 171          ⚠️ 不是 132×185
├─ NumberArea (gap 2)
│   ├─ NumLabel      → 「还能吃」12px SemiBold  色 --ct-mint-deep
│   ├─ NumRow (gap 6)→ 大数字 46px/700/-1.6px tabular-nums + 「✏️」20×20
│   └─ NumSub        → 「已摄入 1270 / 1800 kcal」13.5px Regular 色 --ct-label-2
├─ NutrientCard      → gap 0, padding 14, r 20
│   ├─ N-Protein (gap 3)
│   ├─ N-Divider1    → 1 × 32  fill #E3F0EA
│   ├─ N-Carb  (gap 3)
│   ├─ N-Divider2    → 1 × 32  fill #E3F0EA
│   └─ N-Fat   (gap 3)
└─ MealSection (gap 8)
    ├─ MealTitle     → 「今日餐次」15.5px SemiBold --ct-label
    └─ MealList (gap 8)
```

**NutrientCard 玻璃规格**（全项目玻璃卡统一）：

```
fill     : rgba(255,255,255,.74)
stroke   : rgba(255,255,255,.60)
radius   : 20
effects  : backdrop-blur 20
           drop 0 6 18   rgba(13,120,90,.10)
           inner 0 1 2   rgba(255,255,255,.60)
```

---

## 2. 添加食物 Sheet `02 · 添加食物 Sheet`｜node `3:144`

底层是首页（同 §1），上面盖：

> ⚠️ 现状批注（2026-09-22 校准）：四个弹层实际已迁移为微信原生 `page-container` 作壳，蒙层由原生组件提供，下述自研全屏遮罩色（`--ct-label`）仅为 v1 稿面存档。

```
SheetMask  : 375×812  fill 全屏遮罩色 --ct-label
AddSheet   : 375×550  y=262  r 34  gap 13  padding 10 18 18
             fill #FBFEFC
             drop 0 -8 32  rgba(10,79,61,.18)     ← 向上投影
├─ SheetHandle    : 36×4  r 2  x=169.5 y=8  fill --ct-label
├─ CalArea (gap 4, padding-top 10)
│   ├─ CalRow (gap 8) → 「325」28px/700 +「kcal」+「改」胶囊 + ✏️
│   └─ CalSub        → 「已按 中杯 500ml · 全糖 计算」12px Regular --ct-label-2
├─ FoodRow           : gap 10, padding 12, r 20, fill #fff, stroke #DCEDE6
│   ├─ FoodIcon      : 40×40
│   └─ FoodTextCol (gap 2)
├─ PortionSection (gap 8)
│   ├─ PortionLabel  → 「分量」13.5px Medium --ct-label-2
│   └─ SegmentRow (gap 8)
├─ SweetSection (gap 8)
│   ├─ SweetLabel    → 「甜度 · 估算」13.5px Medium --ct-label-2
│   └─ SweetRow (gap 6)
├─ MealSection (gap 8)
│   ├─ MealLabel     → 「餐次」13.5px Medium --ct-label-2
│   └─ MealRow (gap 6)
└─ ConfirmButton     : h 52  r 26
                      grad 160°(--ct-e1 → --ct-e2)
                      drop 0 8 18  rgba(13,120,90,.34)
                      ConfirmText 15.5px SemiBold  #fff
```

**Sheet 通用规格**：`r 34` + 向上阴影 `0 -8 32`。食物选择 Sheet 的 `gap` 是 **12**（这里 13），其余相同。

---

## 3. 食物选择 Sheet `03 · 食物选择 Sheet`｜node `3:371`

```
FoodPickerSheet : 375×500  y=312  r 34  gap 12  padding 10 18 18
├─ SheetHandle   : 36×4 r 2
├─ SearchBar     : h 44  r 22  fill #fff  stroke #DCEDE6
│                  padding-x 14  gap 8
│   ├─ SearchIcon: 18×18
│   └─ 占位文字   : 「搜索食物 · 支持拼音 / 别名」13.5px Regular --ct-label-3
├─ CategoryTabs  : gap 8  padding 4 0  fill #fff  stroke #F1FAF6
│   ├─ CatTag 选中: padding 6 14  r 20  fill --ct-e2   文字 #fff
│   └─ CatTag 未选: padding 6 14  r 20  fill #F8F9FC   文字 --ct-label-2
└─ FoodList (gap 2)
    └─ FoodItem  : gap 12  padding 8   （图标 + 名称 + kcal/100g）
```

### ⚠️ 分类 Tab 缺项

设计稿只有 **7 个 Tab**：`全部 / 水果 / 蔬菜 / 肉类 / 主食 / 饮品 / 零食`

但食物库有 **7 个分类**（`staple` 主食 / `dish` 菜品 / `protein` 肉类蛋类 / `vegetable` 蔬菜 / `fruit` 水果 / `drink` 饮品 / `snack` 零食）

**「菜品」Tab 设计稿里没有** → 353 条中 **59 条菜品**（占 16.7%）无法按分类筛选。
**决策待定**：补第 8 个 Tab、还是把菜品并入其他分类。

---

## 4. 个人中心 `04 · 个人中心 Profile`｜node `3:573`

```
LiquidHero   : h 218  padding-x 18  grad 180°(--ct-e1 → --ct-e2)
├─ StatusBar  : 62
├─ AvatarRow  : gap 14  padding 8 0 18 0
│   ├─ Avatar : 62×62  r 20  fill #fff  stroke #fff  backdrop-blur 8
│   └─ NameCol: gap 4  （首字 26px/700/-1px 薄荷渐变裁字 + 名字）
└─ StatBar    : h 64  r 18  fill #fff  stroke #fff  backdrop-blur 12
    ├─ Stat1        (gap 2)
    ├─ StatDivider  : 1 × 30  fill #fff
    └─ Stat2        (gap 2)
                ↑ 数字 20px/700/-0.5px tabular-nums #fff；标签 11px rgba(255,255,255,.82)

HeroWave     : 375×46  y=172（贴在 LiquidHero 底部）
├─ Vector    : 375×44  y=2  fill --ct-bg      ← 波浪收边
├─ Ellipse   : 8×8  @ (66, 10)
├─ Ellipse   : 6×6  @ (297, 15)
└─ Ellipse   : 5×5  @ (212.5, 5.5)            ← 3 颗气泡

WeekWrap     : gap 12  padding 10 18 0 18
├─ WeekCard  : r 20  padding 16  （同 NutrientCard 玻璃规格）
│   ├─ WeekHead  (gap 0)
│   └─ WeekDrops (gap 0)   ← 7 颗液滴
└─ TrendSection (gap 8)
    ├─ TrendTitle  → 「历史趋势 · 本周」15.5px SemiBold
    ├─ TrendChart  : h 100  gap 10  padding-x 2
    ├─ HistoryList : padding-top 6
    └─ ViewAllRow  : gap 3  padding-top 8
```

---

## 5. 目标设置 Modal `05 · 目标设置 Modal`｜node `3:687`

> ⚠️ 现状批注（2026-09-22 校准）：Modal 壳同 §2，实际＝微信原生 `page-container`（蒙层原生提供），`ModalMask` 为 v1 稿面存档。

```
ModalMask   : 375×812  fill --ct-label（全屏遮罩）
GoalModal   : w 312  x=31.5  y=288  r 20  gap 14  padding 20  fill #fff
              drop 0 16 40  rgba(10,79,61,.22)
├─ ModalHead  : 标题 17px SemiBold + CloseIcon 20×20
├─ InputRow   : h 56  r 16  fill #F5FAF8  stroke #DCEDE6  padding-x 10
│   ├─ MinusBtn : 36×36  r 12  fill #EAF3EF
│   ├─ InputValue: 24px Inter Bold  --ct-label   （flex 居中）
│   └─ PlusBtn  : 36×36  r 12  grad 180°(--ct-e1 → --ct-e2)
├─ QuickChips : gap 8
│   ├─ Chip 未选   : h 36  r 12  fill #fff  stroke #DCEDE6
│   └─ Chip 选中   : h 36  r 12  grad 180°(--ct-e1 → --ct-e2)  文字 #fff
├─ ModalHint  : 11.5px Regular --ct-label-3  text-align center
└─ SaveButton : h 48  r 24  grad 160°  drop 0 6 14 rgba(13,120,90,.32)
                SaveText 15px SemiBold #fff
```

---

## 6. 热量校准 Modal `06 · 热量校准 Modal`｜node `3:835`

```
CalOverrideModal : w 312  x=31.5  y=300  r 20  gap 14  padding 20  fill #fff
├─ ModalHead   : 「调整热量」17px SemiBold + CloseIcon 20×20
├─ ModalSub    : 「珍珠奶茶 · 中杯 500ml · 全糖」12.5px Regular --ct-label-2
├─ InputRow    : h 56  r 16  fill #F5FAF8  stroke #DCEDE6  padding-x 16
│   ├─ InputValue : 「325」24px Inter Bold
│   └─ InputUnit  : 「kcal」13.5px Inter Medium --ct-label-3
├─ QuickAdjust : gap 8    ← 三个 chip：-50 / +50 / 恢复
│   ├─ AdjustChip       : h 36  r 12  fill #fff  stroke #DCEDE6
│   └─ AdjustChip-Reset : h 36  r 12  fill #F2FAF6  stroke #BFE3D6
├─ ModalNote   : 「只调整这一次记录…」11.5px --ct-label-3  center
└─ SaveButton  : h 48  r 24  文字 14.5px SemiBold #fff
```

---

## 7. 添加分量 Modal `07 · 添加分量 Modal`｜node `3:977`

```
PortionModal : w 312  x=31.5  y=296  r 20  gap 14  padding 20  fill #fff
├─ ModalHead : 「添加自定义分量」17px SemiBold + CloseIcon 20×20
├─ FieldLabel: 「名称」13.5px Medium --ct-label-2
├─ FieldInput: h 48  r 14  fill #F5FAF8  stroke #DCEDE6  padding-x 14
│              FieldText 15px Medium --ct-label
├─ FieldLabel: 「容量 / 克数」13.5px Medium --ct-label-2
├─ FieldInput: h 48  r 14  gap 6  FieldText 15px Inter SemiBold + FieldUnit 13px Inter Regular --ct-label-3
├─ ModalHint : 11.5px --ct-label-3  center
└─ SaveButton: h 48  r 24  文字 15px SemiBold #fff
```

> 设计稿有这一屏，但 **v1.0 已冻结「不做用户自定义规格/模板」** → 本屏 **v1.0 不实现**（v1.1 预留）。

---

## 8. 设置 `08 · 设置 Settings`｜node `3:1115`

```
SettingsHero   : h 128  padding-x 18  gap 10  grad 180°(--ct-e1 → --ct-e2)
├─ BackButton  : 34×34  r 17  fill #fff  stroke #fff
│   └─ BackIcon: 16×16
└─ SettingsTitle: 「设置」17px SemiBold #fff

SettingsWave   : 375×40  y=90
├─ Vector      : 375×38  y=2  fill --ct-bg
├─ Ellipse     : 7×7  @ (86.5, 8.5)
└─ Ellipse     : 5×5  @ (277.5, 11.5)     ← 2 颗气泡（比「我的」少一颗）

SettingsContent: gap 14  padding 8 18 18 18
├─ Group-Preference (gap 8)   → GroupTitle 12px SemiBold --ct-label-2 + GroupCard
├─ Group-Goal       (gap 8)   → 同
├─ Group-Data       (gap 8)   → 同
├─ Group-Danger     (gap 8)   → GroupCard-Danger（无 GroupTitle）
│      fill #fff（不透明）  stroke #F5D5C8  r 20
│      drop 0 4 14  rgba(224,99,60,.08)
└─ Footer (gap 3)
    ├─ FooterText : 「CalTrack v1.0.0」11px Inter Medium --ct-label-3
    └─ FooterSub  : 「所有数据仅保存在本机」10.5px Regular #C2D4CC
```

**GroupCard（设置页玻璃卡）**：同 NutrientCard，但阴影更轻 —— `drop 0 4 14 rgba(13,120,90,.08)`。

**分组顺序**：偏好 → 目标管理 → 数据管理 → **危险项独立** → 页脚。

---

## 9. 设计稿里有、但变量集里没有的色值（衍生色）

以下 **13 个色值只在画板节点里出现，未定义为变量**，需补进 `DesignTokens.md`：

| 用途 | 值 | 出现在 |
|---|---|---|
| Tabbar 上边 hairline | `#D6E9E1` | 4 屏 Tabbar |
| 营养素分隔线 | `#E3F0EA` | 首页 NutrientCard |
| 卡片 / 输入框描边 | `#DCEDE6` | 全项目 |
| 未选 Tab 底 | `#F8F9FC` | 食物选择 |
| 输入框底 | `#F5FAF8` | 3 个 Modal |
| 减号按钮底 | `#EAF3EF` | 目标设置 |
| 「恢复」chip 底 / 描边 | `#F2FAF6` / `#BFE3D6` | 热量校准 |
| 危险卡描边 / 阴影 | `#F5D5C8` / `#E0633C` | 设置 |
| Sheet 底面 | `#FBFEFC` | 两个 Sheet |
| 次级文字 `--ct-label-2` 实测 | 视觉 ≈ `#7A8F88` | 全项目 |
| 三级文字 `--ct-label-3` 实测 | 视觉 ≈ `#A9BAB3` | 全项目 |
| 页脚字 | `#C2D4CC` | 设置 |

> 这些不影响 `DesignTokens` 的 11 个正式变量，是**组件级衍生色**。已补进 `DesignTokens.md` §7。

---

## 10. 与旧文档的差异（本文件为准）

> ⚠️ 批注（2026-09-22 校准）：下表「加号上凸 -22/-14」两值均针对已废止的 midbutton 方案（现实现＝三 Tab 悬浮胶囊 Tabbar ＋首页右上 FAB，见 §0 批注），仅保留为稿面历史对照，勿再据此实现。

| 项 | 旧文档值 | **设计稿实测** |
|---|---|---|
| Bottle 尺寸 | `VisualLanguage` §9：132×185<br>`UI_Spec` §3：150×210 | **122 × 171** |
| AddSheet 高度 | `UI_Spec`：未写 | **550**（y=262） |
| FoodPickerSheet 高度 | `UI_Spec`：未写 | **500**（y=312） |
| Avatar | `VisualLanguage`：62×62 r20 ✅ | 62×62 r20 ✅ 一致 |
| StatBar 高度 | 未写 | **64** |
| 「我的」波浪气泡 | 3 颗 ✅ | 3 颗（8/6/5px）✅ |
| 「设置」波浪气泡 | 未写 | **2 颗**（7/5px） |
| 设置 Hero 高度 | 未写 | **128** |
| 我的 Hero 高度 | 未写 | **218** |
| 加号上凸 | `-22`（`UI_Spec`） | **-14**（y=-14，Tabbar 高 78 + padding-bottom 21） |

---

## 11. 两处需要拍板的不一致

### ① 色值：画板硬编码是旧值，变量集是新值

| 项 | 画板节点（硬编码） | 变量集（`fetch_variables`） |
|---|---|---|
| 页面底 | `#F1FAF6` | **`#F2FAF5`** |
| 小字深绿 | `#0B7A5C` | **`#0A7A5C`** |
| 主文字 | `#0B4F3C` | **`#0A4F3D`** |
| 液体渐变 | `#7DEBC7` ✅ | **`#7DEBC7`** |

**现象**：渐变用的是**新值**，底色/文字用的是**旧值** —— 说明设计师建变量后**只更新了部分节点**，底色与文字是漏网之鱼。

**现状处理**：文档按 **变量集（新值）** 统一（Boss 已裁定「以 ardot 设计稿为准」，而变量集是设计稿的正式接口）。
**差异量级**：±1/255，**肉眼不可辨**，工程上无影响。

### ② 食物选择 Sheet 缺「菜品」Tab

见 §3。**353 条里 59 条菜品无法筛选**，需决定是补 Tab 还是并类。

---

## 附：本文件未覆盖的部分

以下内容**不在本次提取范围**（`readDepth 3` 到组件层为止）：

- `Bottle` 内部的液体/高光/描边图层细节（`VisualLanguage.md` §4 有完整 SVG 坐标，继续以它为准）
- `WeekDrops` / `TrendChart` / `HistoryList` 的子元素（需要时可单独 `batch_read` 这些 nodeId）
- 图标 SVG 路径数据（`iconfont.cn` 待接入）

需要哪块的细节，我用 `batch_read` 单独拉对应 nodeId 即可。
