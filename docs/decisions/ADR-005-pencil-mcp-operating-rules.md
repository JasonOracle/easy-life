# ADR-005：Pencil MCP 操作铁律（设计稿读改的踩坑沉淀）

> 文档：`/C:/Users/Administrator/.pencil/documents/f6dea36f-a24c-415c-93e9-1f457de67005/pencil-new.pen`
> **47 块画板**（2026-09-27 全量实测）。取板法：遍历时计 `parentCtx` 深度，`d0`＝板（47 个）、
> `d1`＝板内节点（809 个）。早期记的 `hOLqf` / `YXLFE` 等 id 是估的，**已作废**。
> 反哺进度：40 块全部完成（基准图见 `debug/evidence_20260927/backfill2/`）。
> 暗弹层在 Replace 之后的新壳 id＝`X8wtJp`（目标暗）/ `p09pr0`（添加成功暗），旧 id 作废。
>
> 本文件原为 `.workbuddy/memory/MEMORY.md` 的一节，2026-09-28 因长期记忆超预算拆出。

## 脚本环境

- 脚本**没有返回值、没有 console**。
  - 只读取数：`throw new Error(数据串)` 把数据带出来，**一次 ≤ 7 行**；写 `return` 会报错。
  - 变更脚本**禁止 `throw`**（会回滚整个执行块）→ 正常结尾，用「读回哨兵值」验证。
- 可用 API 只有：`Get` / `Update` / `Insert` / `Replace` / `Delete`。失败重试带 `edits` + `editId`。
- **`Update`/`Get` 第一参传名字也能解析**（只在「multiple named」时才暴露）
  → 必须用真实节点 id。

## 结构改动

- **Delete 父容器会「孤儿提升」子节点**，被删容器的子节点仍会渲染 → **删容器前必须先删光子节点**，
  删后 `Get` 复查。
- **`Replace(id, props)` 删旧建新并返回新 id，原壳 id 直接失效。**
- **`Insert` 子树可能不进渲染管线** → 可靠写法是 **`Insert` 空壳 + 一次 `Replace` 灌入整棵树**；
  叶子节点**禁止**空 `children: []`。
- **`frame` 必须显式 `layout: 'none'`**，否则子节点被流式布局挤成一行；
  且 `layout` 只能写在 `Replace` 的顶层目标上，子节点带 `layout` 会报 Invalid properties。

## 渲染与验收

- **`Export` 有 2~3 个调用周期的滞后**：刚改完立刻导出拿到的是字节级旧图。
  等约 20s，再用 PIL 数特征色像素验收。Export 输出 **2.0 px/pt**，单节点可单独导出。

## fill / 图片

- 纯色：`'#RRGGBB(AA)'` 字符串。
- 图片：`{type:'image', enabled:true, url:'images/x.png', mode:'fill'}`；
  `mode` 只有 `stretch` / `fill` / `fit`，**没有 `cover`**，圆角用 `cornerRadius`。
- 运行中加图要放进文档的 `images/` 子目录；`assets/` 索引只在打开文档时建立。
- **单板图片节点 ≤ 8 张** 才安全。

## 稿面关键数值（2026-09-27 取证，供代码核对）

- Home `Timeline 1/2`＝ 2pt 宽，fill `#BFE8D5`（x=39）。
- `早餐圈` ellipse 37pt，fill＝gradient 315° `#5CD9A6→#29B285`。
- `早餐卡/午餐卡/晚餐卡` **`sh: null`＝设计无阴影**。
- **主按钮渐变（全库统一 14 个节点）**：各弹窗 `ConfirmBtn` + GoalModal `SaveBtn` ＝
  **335×54、rotation 180、`#7DEBC7→#1FBF8F`**（导出处像素实测顶 `#7EEBC7`→底 `#25C293`）。
  - **token 层唯一对应写法＝`accent2→accent`**（跨 6 档自洽）。
  - ⚠️ **不许写成 `accent→accentMid`**：`accentMid` 是该档「暗档」色（mint 亮 `#17916B`），
    会把按钮整条压暗（2026-09-27 两例：AddFood CTA、GoalModal 保存钮）。
- **色板代差最终方案（2026-09-28 凌晨老板定）**：新增 token **`accentSoft`**＝按钮专用浅端
  （mint-light `#7DEBC7`＝v1 稿面原值；暗档＝各档现 `accent2` 视觉不变；
  ocean-light `#82C5EC` / lavender-light `#B9B0F1` 自拟同比例提亮）。
  → **按钮类（FAB / 百科 CTA / AddFood 确认钮 / GoalModal 保存钮）＝`accentSoft→accent`；
  进度条 / 滑轨 / 页头渐变仍用 `accent2` 系。** 两 token 分工。
- `Vtp9C/BannerChev` frame **12.7pt**（内含 4.8×8.5pt 矢量 path，fill `#98A8B4`）；`RecChev` 5×8pt。

## 自拟图标规范（无设计稿时）

- 沿用全局风格：`width/height = 24`、`viewBox="0 0 24 24"`、`fill="none"` +
  `stroke-width="2"` + `stroke-linecap/linejoin="round"`。
- 颜色**只能写死在文件里**（`<image>` 无法继承 `currentColor`）；要随亮暗变就出两套
  `xxx.svg` / `xxx_dark.svg`。
- **走不走 `themeAsset` 的判据**：
  - 图标「跟随当前主题」→ **走**（stem 须登记进 `THEMEABLE_ASSETS`）。
  - 图标「代表各自主题」（如主题选择器里的三个）→ **不走**，直接用各主题品牌色，
    否则三个选项会长得一模一样。
- 查图标名：递归筛 `type === 'icon'`，取 `library` / `icon` 字段（lucide + Material Symbols Rounded 混用）。
  MSR 的 SVG 直链：`fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/{icon}/default/24px.svg`
  （描边**只有 default**；`fill0` / `wght400` 全 404）；
  viewBox 是 `0 -960 960 960`，需 `<g transform="scale(0.025) translate(0,960)">` 转换（**不翻转**）。
