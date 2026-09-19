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

## 3. 字号（5 个）

| Token | 值 | 用途 |
|---|---|---|
| `type-hero` | `46px` | 首页大数字 |
| `type-title` | `17px` | 标题 |
| `type-section` | `15.5px` | 分节标题 |
| `type-body` | `13.5px` | 正文 |
| `type-caption` | `12px` | 说明文字 |

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
| `line-hairline` | `#D6E9E1` | Tabbar 上边 0.5px |
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
