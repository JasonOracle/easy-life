# progress.md — 动态进度追踪

> **定位**：项目最高动态事实来源。新会话进来第一步读这个。
> 与 `AGENTS.md` 分工：AGENTS.md 是静态规则（不变的宪法），progress.md 是动态状态（一直在变）。
> **冲突仲裁**：如果 progress.md 与任何其他文档不一致，以 progress.md 为准。

---

---

## 【2026-09-20 Ardot 设计稿改版（Boss 指派）】交接记录 · 2026-09-20 01:40:41

### 0. 先认一个流程错误（已补救）
Boss 的原话是「我想改一下 ardot 设计稿」，正确顺序应是 **先改设计稿 → Boss 过目 → 再按稿改代码**。
我误先动了 App 代码。补救动作：
- 立即停下来，切回 Ardot 改稿（本轮已全部完成）；
- 发现 `app/` 整个目录此前**从未进过 git**（全为未跟踪），改动无法回滚 → 已补基线提交 `1100d79`。
- 已被改动但**尚未编译验证**的文件：`app/stores/food_store.ts`、`app/components/AddSheet.uvue`、`app/pages/home/Home.uvue`。
  这 3 个文件的内容方向与新稿一致，但必须等 Boss 确认稿面后，再拿着新稿逐项复核才能算数。

### 1. 本次已完成的设计稿改动（fileId 727289305476547）

| # | Boss 要求 | 落地节点 | 做法 |
|---|---|---|---|
| 1 | 首页顶部显示程序名「轻律生活」 | `3:36` Header | 新增 `HeaderLeft`（程序名 17px SemiBold `#0A4F3D` + 日期降为 12.5px 副标题） |
| 2 | 右上编辑图标换成加号，点击新增食物 | 删除 `3:38` EditGoalIcon，新增 `AddEntry` | 44×44 热区 + 30×30 薄荷渐变圆钮 + 白色十字 SVG |
| 3 | 只要两个 tabbar（首页 / 我的），删悬浮加号 | 首页删 `3:141` AddButton + `3:135` MidSpacer；Profile 删 `3:677` + `3:675` | Tab-Home / Tab-Profile 改 counterAxisAlignItems=CENTER，两栏各占一半 |
| 4 | 食物加精美图片（颜值核心资产） | `3:90` MealDetail-Breakfast 三行重做 | 每行＝28×28 cornerRadius 8 薄荷渐变底衬占位 + 名称 13px + 份量 11.5px `#A9BAB3` + **自身时分秒** 11px + 右对齐热量 12.5px `#0A7A5C` |
| 5 | 同一食物可重复添加（不加数量步进器） | 设计稿数据 | 三条时间为 07:30:12 / 07:31:47 / 07:33:05，首条与餐次标题「早餐 · 07:30」自洽 |
| 6 | 个人中心缺「设置」图标 | `3:587` AvatarRow | 行尾新增 32×32 半透明白(0.22)+blur 8 圆钮 + 白色齿轮 SVG；行改 SPACE_BETWEEN |
| 7 | 柱状图「目标 1800」语义含糊 | `3:653` GoalTagText、`3:592` UserSub | 统一改为「每日目标 1800」 / 「记录 128 天 · 每日目标 1800 kcal」（1800 本就是每日目标，见下） |
| 8 | 「查看30天」本版本没做此页面 | 删除 `3:1203` ViewAllRow | 连带 `3:1204` 文案 + `3:1205` chevron 一并删除 |
| 9 | 三行历史记录设计稿上看不出来 | `3:654` HistoryList → HistoryCard | 整块包成白卡（opacity .74 / blur 12 / radius 16 / 轻投影）；每行 HDate 设 layoutGrow=1 拉开 kcal 与状态标签 |

### 2. 「1800 到底是当日还是每日」——结论：每日
三条证据：`app/stores/goal.uts:14`（注释即写「每日热量目标」）、`app/pages/settings/Settings.uvue:96`（「每日热量目标 · 当前 1800 kcal」）、首页设计稿本身。
所以柱状图标准条**没有错，只是文案没写清**。真正的遗留限制：本地存储没有 `history: {ts, value}[]`，跨天下钻时只能拿「今天的目标」当基准——v1.2 候选，Boss 已确认本轮属于 v1.0，不做。

### 2b. 波形与目标线：一次翻车 + 最终定案 · 2026-09-20 01:48:49
**翻车记录（必须记住）**：第 2 轮我试图用「一个收窄的矩形 + 两个圆角矩形」去拼波形回落，
结果两个圆角块以 #F1FAF6 实色**浮在薄荷渐变上，渲染成两块白色药丸**，比原稿更丑。
Boss 原话：「ardot 感觉都没改啊，还更严重了」。
**铁律：波浪/曲线一律用一条 SVG path 画完，绝不能用矩形+圆角拼——渐变上的浅色圆角块必然读成白色胶囊。**

同一轮翻车点 2：「每日目标 1800」标签用「前插占位块 GoalSpacer(182×1)」推居中**完全没生效**，
标签依旧贴在右侧。此后不再尝试用占位块控制 inline 布局位置。

**最终定案（Boss 拍板）**：目标横线 `3:651` GoalLine 与标签 `3:652` GoalTag **整组删除**，不做折中。
理由：`3:643` TrendChart 是 `layout: horizontal`，子元素宽度全是 `fill_container`，
无法把一条 335px 的绝对横线放到 375 宽画布的水平正中；做不居中就不做，避免误导用户。

**波形最终实现**：删掉 `3:602`(WaveFlat) + `31:33`/`31:34`(两个白色药丸) + 三个装饰球，
新增单个 `31:35` WavePath = 一条 375×46 SVG：主路径 `M0 8 C52 8 82 31 142 31 C202 31 228 19 282 19 C325 19 351 8 375 8 L375 46 L0 46 Z` 填充 `#F1FAF6`，
三个高光孔（`circle` r 3.5/3/2.5，opacity .72/.60/.55）直接写在同一份 SVG 里，位置与曲线走向对齐（左缓降段一颗、谷底一颗、右侧回落段一颗）。

---

### 3. ②号红圈（由 Boss 圈定并修复）· 2026-09-20 01:46:58
Boss 截图圈定后确认：②号框圈的是 **`3:601` HeroWave**，不是我先前猜的 `StatBar 3:593`。
原稿波形只在左侧平缓下降，右侧尾部是低幅细波，显得空且脏。改法：
`3:602` Vector 收窄到 235×44（左侧平缓下降段），右侧用两个圆角块 `31:33`(46×22 @x220) + `31:34`(40×18 @x278) 做逐步回落，
三个装饰点重排到「左侧密、主曲线旁一颗、右侧尾部一颗」，透明度递减（2:0.75 / 3:0.70 / 4:0.60）避免糊在一起。

### 3b. 同轮另两项修复 · 2026-09-20 01:46:58
- **头像与文字间距**：`3:587` AvatarRow gap 14 → **18**（62px 头像旁的文字不再挤）
- **设置图标像太阳**：根因是我上一轮把「圆 + 8 道放射线」当齿轮用了，读起来就是太阳。
  已删 `31:27`(内圆) + `31:28`(放射线)，换成**真齿轮路径 SVG** `31:29`（17×17，含圆心孔 + 齿廓 + 大圆轮廓），白色描边 1.5。
  教训：设置图标必须用 gear 齿形路径，不能用「圆 + 放射线」——后者在任何界面上都会被读成明暗主题切换。
- **第三行历史缺日期/状态示例**：Boss 以为只有两行有示例。排查后确认**三行数据都在**（`3:655` 9月18日·周五 1950 超标 / `3:663` 9月17日·周四 1720 达标内 / `3:1195` 9月16日·周三 1580 达标内），
  是**可读性不足**：`HCal` 与 `HStatus` 贴在一起、状态文字 12px 偏淡。改法：三行 `HCalVal` 合并单位成「1950 kcal」并删掉 `HCalUnit`，
  腾出的宽度让日期在左、数值在中、状态标签在右三段自然拉开（`HDate` 已在上一轮设 layoutGrow=1）。
  同时把「每日目标 1800」标签 `3:652` 从默认靠右改成**居中悬浮**：`3:643` TrendChart 首插 `31:32` GoalSpacer(182×1) 占位，
  让标签落在图表正中（182 + 标签宽 + 182 ≈ 375），不再和周日柱打架。

---

### 4. 待 Boss 复核（更早记录，保留）我从结构上看有三个候选：`StatBar 3:593`（64px 白条里只有两列数字横向撑满，最空）、`HeroWave 3:601`（46px 波浪过渡）、`TrendChart 3:643` 上方留白。改稿前请你圈一下，或直接告诉我。

### 4. 尚未闭环的遗留项（与代码相关，非本轮设计稿范围）
- **93 条食物缺 pieceWeight**：`piece/slice/skewer` 计数 vessel 但没给单件克重（例 `p130 牛排` base 270 却只能算出 3 kcal、`p120 猪瘦肉` 143→1、`p051 披萨`(slice) 266→3）。分布：肉类蛋类 44 / 蔬菜 35 / 零食 7 / 主食 6 / 菜品 1。
  根因在 `toolchain/sources/nutrition_v1.yaml` 的数据 schema，**AGENTS.md 明令禁止我手写食物数据**，需 Boss 决定是否让我改 toolchain 或在 toolchain 补齐 pieceWeight。
- App 侧 3 个已改文件待编译验证（`pnpm build` / 微信开发者工具）。

---

## 当前阶段：图标资源已生成，待集成到 App

## 最近进度

### 2026-09-20 — UI 还原度评审 Round 2（截图复核）+ P-1 结案 + 删组件残留坑

- **P-1 结案（Boss 确认）**：设计稿 hero 确实有统计条——之前是 04 导出图分辨率低误判，实现不动
- **删组件残留坑（新增踩坑记录）**：删除 TabBar 组件后，HBuilderX 增量编译**不会清理 dist 里的旧引用**——`app.json` 残留 TabBar 项导致 devtools 报 `WXSS/WXML 文件编译错误 ENOENT components/TabBar.wxss/wxml`。**核对了 Home.js 却漏了 app.json**。修复：重跑 `cli auto` 触发全量重编译即自愈。**铁律补充：删组件/页面后必须全量重编译，且核对范围要含 app.json**
- **Round 2 复核通道**：automator 9420 未恢复（cli auto 需 Boss 手动跑），改用 wechatide `simulator_screenshot`（窗口可见时可用，token 在 `~/.codebuddy/mcp.json` 的 wechat-devtools 节点）+ `automation_navigate switchTab` 切页，实测跑通；缺点：截图 164×355 分辨率低，像素级复核受限
- **复核结果**：首页——餐次时间/份量明细/瓶子水位与数据自洽/头部热区 ✓；我的——老刘文案/统计条 126|1350/波浪/七颗液滴多状态/趋势柱+目标线/历史真实派生数据/「查看全部 30 天记录」 ✓，结构与设计稿一致 → **Round 2 判 PASS**
- **遗留**：像素级细节（液滴形状/柱状图圆角/玻璃质感）受截图分辨率限制未终审，automator 恢复后可补；automator 恢复命令：`cli.bat auto --project <产物路径> --auto-port 9420 --trust-project`

### 2026-09-19 — UI 还原度评审 Round 1（agent-design-figma skill · L4 五维模型，READ_ONLY 模式）

- **评分**：首页 8.8（Layout 8.6/Color 9.2/Consistency 8.8/Commercial 8.5/Usability 9.0）、我的 8.7——均 ≥8 但带 medium issue，按 Boss 还原度诉求选 FIX
- **证据通道**：源码常量 ↔ 设计稿导出图（assets/exports）/ScreenSpecs 结构化比对；automator 9420 未在跑，App 截图目视复核待恢复自动化后补
- **已修（仅 issue 涉及节点）**：H-1 餐次行补时间「早餐 · 07:30」（MealRow+time）；H-2 明细补份量「燕麦片 40g · 150 kcal」（FoodEntry+amount/unit）；H-4 头部「＋」热区 44×44（视觉 30 不变）；P-2「查看全部 30 天记录 ›」；P-3 文案对齐设计稿（老刘/记录 128 天·目标 1800/头像白卡无字）。产物 js+wxml 全部核对 ✓
- **P-1 待 Boss 拍板**：hero 统计条两份设计资产矛盾——ScreenSpecs 记载含统计条（Ardot 3:573 实测），04-个人中心.png 导出图无统计条。需 Ardot readback 确认，未擅动
- **不计 issue（已拍板项）**：头部「＋」保留、原生 tabBar 无加号
- Round 2（截图目视复核 + 液滴/柱状图形状细节）待恢复 automator 后执行

### 2026-09-19 — Boss 拍板：原生 tabBar 取代自绘 TabBar + 灌七天演示数据

- **原生 tabBar 落地**：Boss 拍板「用 uniapp 的 tabbar 也可以，把中间的加号去掉」（添加入口保留首页头部「＋」）——设计稿玻璃+上凸加号的唯一非原生理由消失，原生 tabBar（uni-app x 支持标准形态，不支持的是 midbutton）
  - `pages.json` 增 tabBar 节点（首页/我的，selectedColor `#0A4F3D`）
  - 图标：`toolchain/gen_tab_icons.py`（PIL 矢量绘制，**非 AI 生图**——原生 tabBar 只认 PNG，且 UI 线性图形不适合 Agnes 白底实物图管线）→ `app/static/tab/` 4 张 81×81 透明 PNG（idle `#A9BAB3` / active `#1FBF8F`）
  - 自绘 `TabBar.uvue/.md` 删除，两页引用与 96px 底部预留一并移除（原生 tabBar 不占页面高度）
- **七天演示数据（Boss 授权）**：`food_store.ts` 增 `SEED_PLAN`（今日四餐齐全 + 前 6 天，含一个大餐日/一个轻断食日），**热量全部经 computeEntry 按库内 base 值计算，零手写 kcal**；食材 id 实测自库（p001 米饭 / p143 鸡蛋 / p286 豆浆 / p065 宫保鸡丁 / p069 红烧肉 / p062 番茄炒蛋 / p130 牛排 / p230 苹果 / p231 香蕉 / p270 珍珠奶茶）
  - **统计 getter 全部改按日过滤**：新增 `todayEntries` / `weekTotals`；否则七天数据会全堆进今日餐次
  - **totalCal 从 state 改 getter**：删掉 addEntry/removeEntry 手工加减 totalCal 的重复状态（与 entries 恒一致）
  - `Profile.uvue` 周概览/趋势柱/历史 3 行/达标徽章全部改由 `weekTotals` + goal 派生，demo 硬编码删除
- 产物核对 ✓：app.json 含 tabBar / food_store.js 含 seed+weekTotals / Profile.js 已接 store / Home.js 无 TabBar 残留；pages.json 结构变更后已 cache clean 全量重编译
- 待办遗留：`clearToday` 语义已改为「只清今日，保留历史」；设置页「数据管理」接 store 时留意

### 2026-09-19 — 连排三坑：defineStore 漏 import / mealRows 字段错位 / mealLabels 冒充数组 + 真机胶囊适配 + TabBar 落地

- **三连坑（同源：uni-app x 编译器对「类型撒谎」零拦截）**：
  1. `food_store.ts` 漏 `import { defineStore } from 'pinia'` → 编译产物裸全局引用 → `ReferenceError: defineStore is not defined`，连锁拖垮 AddSheet/MealIcon/Home
  2. `mealRows` getter 返回 `{key,label,entries,cal}`，模板消费 `{key,name,active,details}` → `m.details.length` 报 `reading 'length'`。已对齐 MealRow 结构，details 恒为数组
  3. `AddSheet` 的 `mealLabels: string[] = MEAL_LABELS`（Record 冒充数组）→ 数字索引得 undefined，确认按钮显示「添加到undefined」。已 MEAL_KEYS.map 数组化
  - **全量核对结论**：9 条 store↔模板链路逐一过账，其余全部对齐；FoodPickerSheet 分类 Tab（中文）与 json `cat` 值域（实测全中文）一致
- **真机胶囊适配**：status-bar 写死 62px，真机微信胶囊底 ~80px，右上「＋」被压 → Home 的占位改 `uni.getMenuButtonBoundingClientRect().bottom + 8` 动态撑高（`#ifdef MP-WEIXIN`，默认回退 62）
- **TabBar 组件落地**（Boss 拍板 + 图标用 CSS 不用 Agnes——白底实物图在玻璃底上露白块，MealIcon 先例）：
  - `components/TabBar.uvue` + `TabBar.md`：ScreenSpecs「TabbarWrap」规格（hairline 0.5 / 玻璃 h78 / 页签 flex1 ×2 / 加号 58×58 上凸14 双层薄荷阴影）；跳转 `uni.reLaunch`；加号 `emit('add')` 页面自决（Home→openPicker，Profile→v1 暂跳首页）；安全区 `env(safe-area-inset-bottom)` 叠加带回退
  - 两页 content 底部 padding 96px 防尾行被盖；TabBar 放 Sheet 之前（DOM 靠后者盖前者）
  - 新增组件触发铁律 → `cache --clean compile` 全量重编译，产物核对：TabBar.js/json/wxml 齐全 + 两页 json 已注册 ✓

### 2026-09-19 — Agent 自身教训：命令卡死 + 「module not found」误诊（Boss 强退对话多次后复盘）

- **事故一：会话反复卡死**。Agent 反复执行了两类**长阻塞命令**：
  1. `cli.bat auto --auto-port 9420` —— 这是**常驻进程**，启动后永不返回，Agent 却在等它结束 → 会话挂死
  2. 「关窗 → 开窗 → 恢复 auto」完整重启序列 —— 每步 `--wait` 时长叠加，总时长远超单次命令上限 → 被系统判为"后台执行"，Boss 侧看不到任何进展
  - **铁律（已入 AGENTS.md）**：会话内**只允许秒级返回的命令**（automator 截图/取数、grep 日志、cache clean）；常驻进程与多步重启序列**一律不跑**，需要时给 Boss 手动操作指引即可
- **事故二：`module 'stores/food.js' is not defined` 反复改不好**。
  - 真相：源码 import 和编译产物（`AddSheet.js` require `../stores/food_store.js`）**全程都是对的**，产物目录 grep `stores/food.js` **0 处残留**；报错来自微信工具缓存的**旧 bundle**（`getmainpackagebundle.js?v=xxx`），是文件改名 `food.ts → food_store.ts` 之前热重载没刷掉的遗留
  - **误诊过程**：Agent 在没核对编译产物的情况下，反复怀疑源码 import 路径并来回改动 → 白烧多轮
  - **诊断铁律（新增，遇 `module not found` 类报错必走）**：
    1. 先 grep **产物目录**（`dist/dev/mp-weixin`）：报错里的 require 路径在产物里是否存在、与产物文件名是否一致
    2. 产物一致 → 是**微信工具旧 bundle 缓存**，不是代码问题 → 清编译缓存 / Boss 重启运行即可，**严禁改源码**
    3. 产物不一致 → 才是真编译问题，去查源码
- **元教训**：Boss 亲述「调试器控制台能看到报错，你却找不到」—— **Boss 贴的控制台报错是最直接的事实来源**，先做产物/源码核对实验（只读、秒级），再动手改代码；无证据不改动

### 2026-09-19 — 微信工具 CLI 全量摸底，沉淀 `toolchain/WxCliReference.md`

- Boss 要求「把微信工具的 CLI 全部命令了解完、了解透」。已完成：**19 个命令逐个 `-h` 实测**（本机 `2.02.2609162`）+ 官方文档比对，产出 **`toolchain/WxCliReference.md`**（速查表 + 全量参数 + 标准操作序列），`AGENTS.md` 已挂入口
- **直接命中本次排障的发现**：
  - **`--disable-gpu` 是 CLI 全局选项**——GPU 渲染崩坏（灰屏）时官方解法就是 `cli --disable-gpu open`，不必去找 exe 直启
  - **`cli quit` 存在**——优雅退出整个 IDE，优于 `Stop-Process -Force`
  - **`cli reset-fileutils`**——重建文件监听（增量丢文件类问题的新解法，比 cache clean 轻，下次优先试）
  - **`--trust-project` 官方文档未收录**但本地存在（auto 必加，免信任弹窗）
  - **`cli open` 官方语义是"自动打开模拟器和调试器"**——Boss 观察到"没开调试器"，说明窗口可能处于 pure-simulator 类精简模式，待留意
  - **`cli agent` 子系统**（get-dom/get-card-image 等）——automator 之外的备援取数通道，暂未实测
  - `cli preview -i` 可输出**代码包体积**——将来体积红线验证用它替代手工看

### 2026-09-19 — 白屏真凶落网：`const` + 模板内联赋值 = 整个页面模块被丢弃

- **接上条排障**：补 `FoodPickerSheet.json` 后模拟器能启动了，但首页白屏。用户从 IDE 控制台贴出完整报错，才看到真正的编译错误（**automator 截图只有模拟器画面，编译错误只出现在 IDE 控制台**——两条信息通道必须都用）：
  ```
  x cannot reassign to a variable declared with `const`
  1 | ...const c=!1,...  c=e.o(t=>c=!1,"7c")
  ```
- **根因**：`Home.uvue` 把演示开关声明成 `const showSheet = false` / `const showPicker = true`，模板却写内联赋值 `@close="showSheet = false"`。uni-app x 编译生成对 const 的赋值代码（`t=>c=!1`），devtools 编译器（SWC 系）**直接拒绝整个 Home.js** → `module 'pages/home/Home.js' is not defined` → 白屏 + 所有页面 "not ready"
- **修复**：改为 `ref(false)`/`ref(true)` + 具名回调（`closeSheet()`/`closePicker()` 内 `.value = false`），模板写 `@close="closeSheet"`。重编后 `const c=!1` 模式消失，**首页 + FoodPickerSheet 完整渲染**（347 条数据列表、图标、kcal 全部正常）
- **连带验证**：FoodPickerSheet 的 DEBUG 旁路已移除（`allFoods = buildFoods()` 恢复），347 条 json 解析真实跑通；`FoodPickerSheet.json` 经一次增量重编未再丢失（持续观察）
- **⚠️ 写码纪律（新增）**：uvue 模板里的内联赋值（`@xxx="x = false"`）**只允许赋给 ref**；`const`/`let` 原始值一律用具名回调。这类错误源码层完全无感（HBuilderX 不报），只有 devtools 编译时才炸，且报错被淹没在控制台里
- **⚠️ 窗口纪律（新增）**：`cli open` / `cli auto` 每次执行都会把项目窗口**拉到前台**，窗口若留在屏幕上会持续挡住 Boss 的工作区（即使 WS_EX_TOPMOST=False 也会被反复置前）。**每次 cli open/auto 收尾必须 ShowWindow(6) 最小化**（automator 在最小化下照常工作，已实测）；Boss 要亲眼看时用 `debug_shot.ps1 -Show` 拉回
- **诊断链沉淀**：白屏排查顺序 = ① IDE 控制台（用户可见，最全）→ ② automator `mp.on('console')` 事件（可脚本抓）→ ③ IDE 本地日志 WeappLog → ④ 截图（只看渲染结果，别当唯一依据）。**`debug/shot.js` 已升级 v2**：截图时同步输出协议层 error/warn（`CONSOLE=clean` 或错误列表），日常验证不再「盲拍」——注意 console 事件只推连接之后发生的日志，页面启动期报错要在重开窗口后立即跑，或看 ①③

### 2026-09-19 — 「IDE 灰屏」排障实录：根因是产物缺一个 `.json`

- **现象**：微信开发者工具整窗深灰（重绘无效），automator 连上 9420 但任何命令 10s 超时，模拟器控制台为空
- **根因链**：`dist/dev/mp-weixin/components/FoodPickerSheet.json` **缺失**（js/wxml/wxss 都在）→ 小程序自定义组件注册失败 → `pages/home/Home.json` 的 `usingComponents` 解析报「路径下未找到组件」→ **模拟器启动失败** → IDE 灰屏 + automator 全部超时（没有运行的 app 可指挥）
- **怎么定位的**（截图上的报错字太小，别硬读）：
  1. `Get-Process` 看 `Responding` → 进程都活着，排除僵死
  2. `simulator_screenshot`（MCP 通道）拍到「模拟器启动失败」页面 → 方向从「渲染问题」转为「编译问题」
  3. 对照 `components/` 产物清单：其他组件都有 `.json`，唯独 FoodPickerSheet 缺
  4. **完整报错在 IDE 本地日志**：`%LOCALAPPDATA%\微信开发者工具\User Data\<hash>\WeappLog\logs\*.log`（搜 `FoodPickerSheet`），模拟器控制台和截图都不如它准确
- **修复**：手工补写 `FoodPickerSheet.json`（`{"component":true,"usingComponents":{"sheet-shell":"./SheetShell"}}`，无 BOM）→ `close` + `open` + `auto` 重启项目窗口 → automator 秒通，`currentPage: pages/home/Home`
- **⚠️ 复发风险与处置**：缺 json 是 uni-app 增量编译的边角 bug（某次增量时 FoodPickerSheet.uvue 正在重写，json 没写出，之后增量认为「无需更新」永远不补）。**再遇到「IDE 灰屏 / automator 全超时」，第一件事查 dist 里组件的 `.json` 是否齐全**。手工补即可，不必全量重编
- **诊断技巧沉淀**：automator「connect 成功但命令超时」= 模拟器里没有活着的 app，先查编译/启动，别重挂桥（重挂没用，本次实测）

### 2026-09-19 — 任务 6：设置页完成 + 排查出一个 uvue 编译级大坑

- `Settings.uvue` 完整结构（ScreenSpecs §8 + VisualLanguage §9.5.5）：头图 128（返回钮 34 + 标题 + 2 颗气泡）/ 四组玻璃卡（偏好开关×2、目标管理 3 行、数据管理 2 行）/ **危险项独立成组**（白底不透明 + 珊瑚描边 `#F5D5C8` + 珊瑚阴影）/ 页脚
- 开关 46×28 纯 CSS（开 = 薄荷渐变 + 滑块右移；关 = 灰；深色模式 v1.0 不做 → 置灰 45%）；行规格 padding 14/16 gap13；图标底座 28×28 正圆（符号为 CSS 占位圆点，iconfont 接入后替换）
- **排障实录（对照实验方法论，值得复用）**：v-for 行插值全空 + 行数错乱 + 同卡消失，控制台**零报错**。依次排除：小改重触发热重载 ✗ → 清编译缓存 ✗ → 全局渲染状态 ✗（Profile 页同屏正常）→ **静态/v-for 同屏对照实验**：静态「偏好」组完美、v-for 组仍坏 → 锁定 v-for 写法 → **循环变量 `r` 改名 `item` 即愈**
- **根因**：uvue→WXML 编译层中 `r` 与内部变量冲突（高度疑似）；其余单字母 d/m/s/i/h/b 实测正常。**铁律已入 AGENTS.md：v-for 变量一律语义化命名，禁用 `r`**
- 排障期间口诀「小改自愈」在 Settings 失效 → 方法论升级为「对照实验」；调试链全程 automator 后台截图（本轮 6+ 次截图，0 次窗口打扰）

### 2026-09-19 — 任务 5：「我的」页完整实现（视觉验证通过）

- `Profile.uvue` 从占位升级为完整结构（Ardot 3:573 + 子节点 3:608/612/643/654 实测还原）：
  - **液体头图 218**：头像「卡」白卡 + 名字/坚持天数 + 统计条（126 累计 | 1350 日均，白卡 + 竖分隔）
  - **波浪收边**：CSS 双椭圆近似设计稿 SVG path（形差已标注）；3 颗气泡按实测坐标（8/6/5px）
  - **周概览玻璃卡**：徽章「达标 4 天」（#E2F7EE 底）+ 七颗液滴 —— **实测为纯色非渐变**（与 VisualLanguage §9.5.4 有出入，照设计稿实测走）：达标 `#5BD3AC` / 超标 `#FF9E7D` / 空缺 `#D5E5DD` / 今天 `#1FBF8F` + `#0A7A5C` 描边 + 标签加粗
  - **趋势柱状图**：底部对齐 + 柱色四态（灰 `#CBD9D3` / 珊瑚渐变 / 空缺矮柱 / 今天满饱和+阴影）+ 目标线 y12 + 「目标 1800」白玻璃标签
  - **历史 3 行**：日期/数值/单位 + StatusDot（超标珊瑚点红字 / 达标内薄荷点灰字），数据为设计稿演示值
- **调试新发现：热重载「半失败」现象** —— 大改页面文件后热重载，静态区块更新但 **v-for 数据区渲染为空**（控制台零报错）；小改触发新一轮热重载 + `reLaunch` 后**自愈**，全程未动窗口、未清缓存。**排障口诀**：大改后渲染异常 → 先做任意小改再 reLaunch 截图 → 仍异常才走清缓存链（v5）
- **uvue 能力边界记录**：`background-clip:text` 渐变裁字不支持（头像首字改纯色深绿）；水滴形用 CSS 四值圆角近似 vector 14×21
- automator 工作流顺带升级：`debug/reload.js` 参数化（reLaunch 任意页面 + 截图），本次「我的」页验证全程零窗口操作

### 2026-09-19 — 任务 4 主体：通用弹层壳 + 添加食物 Sheet（视觉验证通过）

- **`components/SheetShell.uvue`**：通用底部弹层壳（遮罩 + 面板 r34 + 把手 + slot），添加食物 / 食物选择两 Sheet 复用；遮罩按半透明 dim 实现（设计稿 fill 导出 opacity=1 存疑，已在代码注释标注待对比）
- **`components/AddSheet.uvue`**：添加食物 Sheet（Ardot 3:267 实测还原）：热量区（325 大字 + 「改」胶囊 + 计算说明）/ 食物行（**图标 = 库内真实图 `drink/p270.webp`，347 张图标资产首次进入真实 UI，图片链路验证 ✓**）/ 分量三档 / 甜度五档（**糖粒数 0/2/3/4/5 + 无糖虚线空心圈**，CSS 实现「颗粒数=糖量」量尺隐喻）/ 餐次四档 / 确认按钮（h52 r26 渐变 + 阴影 0 8 18 .34）
- 选中态为静态演示值（中杯·全糖·加餐，与设计稿 3:267 场景一致）；切换联动计算待接 goal/food store
- **automator 后台截图验证通过**：新增 2 组件触发铁律 → `debug_shot.ps1 -Reload` 干净重开 → `node debug/shot.js` 纯协议截图，**全程零窗口打扰**（调试体系首次完整实战）
- 分段 pill 的选中描边用 `border` 近似设计稿的 inset shadow（uvue 不支持 inset），视觉可接受
- Home 的 `showSheet` 演示开关已改回 `false`（正式打开入口等 Tabbar 方案拍板后接加号）

### 2026-09-19 — 微信开发者工具调试：三代方案演进（全部实测，教训与铁律）

- **v1 关窗重开**：`cli launch --compile true` 一次性编译后，微信工具不自动重载（`simulator_refresh` 无效）→ 只能 `close_project_window` + `open_project_window`。**副作用**：每次重开都弹大窗且置顶，Boss 正常使用被反复打断
- **v2 屏外窗口**：`SetWindowPos` 取消置顶 + 移到屏幕外（x=-3400），保持"可见"状态规避 Chromium 节流，截图正常。**副作用**：Boss 点任务栏图标窗口"闪一下就消失"，**失去了正常查看程序运行的能力** —— 被否决
- **v3 终态：官方 `miniprogram-automator` 纯协议（Boss 提的"浏览器自动化"思路）**：连 `ws://127.0.0.1:9420`，**窗口最小化状态下实测截图 + 取当前页面路径均成功**，窗口全程零操作。Boss 彻底解放
- **automator 能力清单**（不止截图）：`screenshot` / `currentPage` / `page.data()`（取页面数据）/ `element.tap()`（模拟点击）/ `page.$()`（查元素）/ `evaluate`（执行 JS）/ `callWxMethod` —— 视觉与数据层都能后台拿
- **落地**：`debug/shot.js`（node + miniprogram-automator，npm 依赖在 `debug/`，记得 git 忽略 node_modules）
- **v4 修正（Boss 两次否决后的最终版）**：`debug_shot.ps1` **删除一切窗口挪移逻辑** —— v2 的"移屏外"被 Boss 否决（点任务栏时窗口激活却在屏幕外，表现为"闪屏消失"，且失去正常查看程序运行的能力）；最终形态：截图一律 automator 协议（零窗口操作），仅 `-Reload` 重开窗口且重开后立即自动最小化（打扰约 1 秒），`-Show` 供 Boss 主动要看时把窗口拉回屏幕（不置顶）
- **五条铁律**（详见 AGENTS.md「App 端调试链路」）：
  1. **新增组件/页面后热重载必崩**（hotreload 补丁环境报 `uid null`，渲染部分损坏如液体消失、新列表不渲染）→ 必须 `-Reload` 关窗重开 + `cli auto` 恢复自动化；改文案/样式可热重载
  2. `close_project_window` 会连自动化服务一起杀 → 重开必须 `cli.bat auto --auto-port 9420 --trust-project`
  3. 窗口最小化会暂停 wechatide 截图（Chromium 节流）但**不影响 automator 协议**
  4. `.ps1` 含中文路径必须存 **UTF-8 with BOM**（PowerShell 5 按 ANSI 解码无 BOM 文件）
  5. wechatide `--path` 盘符大小写敏感（用 `D:\`）；「过滤无依赖文件」必须关闭
- **教训**：调试基建不能以牺牲 Boss 的正常使用为代价 —— v1/v2 都是在我单方面"能跑通"的立场下设计的，没有先问"这会不会挡你"。v3 才是双向最优

### 2026-09-19 — App 调试链路打通 + 首页真实结构（Boss 拍板方案 B）

- **方案 B 执行**：`app/src/*` 全部上移到 `app/`，`pages.json` 路由与 `App.uvue` import 去掉 `src/` 前缀，空 `src/` 已删 —— `app/` 现在是纯正的 HBuilderX 项目根
- **appid 落定**：Boss 在 HBuilderX 填入 `mp-weixin.appid = wx2ca7eecc03bd5d09`，HBuilderX 自动补全 manifest（DCloud appid `__UNI__F70225F`）
- **首次真实编译通过**：HBuilderX v5.26 `cli launch mp-weixin --compile true`，3 页面 + Bottle 组件**零错误**（仅 3 条鸿蒙 UA 检测 warning，来自 `useDeviceCapability.ts`，待后续适配）
- **首页从占位升级为真实结构**：Header / Bottle（玻璃瓶组件）/ NumberArea（46px 大数字）/ NutrientCard（玻璃卡三列）/ MealSection 空态。数据为演示值（1270/1800 场景，与原型一致，非食物库数据），待接 goal/food store
- **Bottle 组件**：uvue 不支持内联 SVG → **view+CSS** 还原 VisualLanguage §4 全部几何（瓶盖/瓶颈/瓶身玻璃/内腔/双高光），水位 `translateY=(1-pct)×132` + 1.15s 物理曲线，超标切珊瑚渐变；34 段正弦波纹待 canvas（平液面同时是低端机降级形态）
- **调试链路三级跳（重要过程记录）**：
  1. `cli launch --compile true`（一次性编译）→ 微信工具不自动重载，`simulator_refresh` 无效，必须 close+reopen 窗口
  2. `cli launch` 长驻 → **watch 失灵**（只编译一次，改代码后产物不动）
  3. **终态：Boss 在 HBuilderX GUI 点「运行到微信开发者工具」** → 改代码 3~8s 自动热重载 ✓
- **wechatide 调试命令接入**（微信工具自带 skill-cli，命令行直调无需重启）：`simulator_screenshot`（截图→read_file 看图）、`get_simulator_console`（grep 查日志）、`automation_*`（模拟点击/执行 JS，待用）；配置已写入用户级 mcp.json（`wechat-devtools`）
- **验证结果**：截图确认瓶子水位/渐变/高光、大数字、营养素卡全部正确；改一行文案 3~8s 后自动出现在模拟器（热重载实证）；控制台 **error/warn 双清零**
- **报错排障记录**：`uid` 渲染报错 = 热重载瞬态（重开即愈）；`home.js 已被代码依赖分析跳过` = 微信「过滤无依赖文件」误杀，Boss 已关闭
- **npm run dev:mp-weixin 已论证不可行**：uni-app x 编译器在 HBuilderX 内部，无独立 npm 入口；CLI 方式建出来的是普通 uni-app 而非 uni-app x
- 完整调试约定与命令已固化 **`AGENTS.md`「App 端调试链路」**（新会话直接继承）
- Boss 顺手装了微信工具调试插件（调试器/PerfDog/漏扫/sourceMap 匹配），均为只读辅助，与本链路兼容

### 2026-09-19 — 从 Ardot 提取 8 屏规格 + 搭建 App 骨架

- **8 屏规格提取**（任务 1/7 完成）：用 Ardot MCP `batch_read`（readDepth 3）逐屏读取 8 个画板，产出 **`design/ScreenSpecs.md`**
  - 含：通用框架（StatusBar 62 / Content gap 9 padding 0-18-8 / 左右边距 18）、8 屏逐屏元素树与尺寸、玻璃卡统一规格、Sheet/Modal 完整规格
  - **设计稿实测 vs 旧文档的差异**：Bottle **122×171**（旧写 132×185 / 150×210）、加号上凸 **-14**（旧写 -22）、AddSheet 550@y262、FoodPickerSheet 500@y312、Profile Hero 218、Settings Hero 128、StatBar 64、设置页波浪 **2 颗气泡**（我的 3 颗）
  - `DesignTokens.md` 补 **§5「设计稿实测衍生色」13 个**：`#D6E9E1` `#E3F0EA` `#DCEDE6` `#F5D5C8` `#FBFEFC` `#F5FAF8` `#F8F9FC` `#EAF3EF` `#F2FAF6` `#BFE3D6` `#7A8F88` `#A9BAB3` `#C2D4CC` `#E0633C`
- **发现两处设计稿内部不一致**（待 Boss 拍板）：
  1. 画板节点的**硬编码色值是旧值**（bg `#F1FAF6` / label `#0B4F3C` / mint-deep `#0B7A5C`），而**变量集是新值**（`#F2FAF5` / `#0A4F3D` / `#0A7A5C`）；液体渐变用的却是新值 → 说明建变量后**只更新了部分节点**，底色与文字是漏网之鱼。差异 ±1/255，肉眼不可辨
  2. 食物选择 Sheet 的 `CategoryTabs` **只有 7 个 Tab**（全部/水果/蔬菜/肉类/主食/饮品/零食），**缺「菜品」** → 347 条中 **58 条菜品**（16.7%）无法按分类筛选
- **App 骨架落地**（任务 2/7 完成）：`app/` 此前**无任何脚手架**（无 `package.json`、无配置），本轮新建 5 个核心配置 + 3 个页面占位
  - `app/manifest.json` — 含 `uni-app-x` 节点（**项目类型标识，缺了会被当成 js 引擎版**）；**刻意不写 `transformPx`**（那是 uni-app js 版字段）
  - `app/pages.json` — 3 路由，全部 `navigationStyle: custom`；**不用原生 tabBar**（官方文档明确「uni-app x 不再支持 tabbar 的 midbutton」，而设计稿 Tabbar 是玻璃 + 上凸 14px 加号）
  - `app/App.uvue` — onLaunch 内触发 device store 初始化（**注意：device store 没有 `detect()` 方法**，检测写在 `state()` 里，只有 `refresh()`）
  - `app/main.uts` — `createSSRApp` + Pinia
  - `app/src/styles/tokens.css` — 11 正式色 + 13 衍生色 + 圆角/字号/弹簧曲线 → CSS 自定义属性；含 `.ct-glass` / `.ct-btn-primary` 通用类
  - `app/src/pages/{home,profile,settings}/` — 3 组 `uvue` + 配对 `.md`（符合 Vue↔MD 规范，MD 含用途/依赖/设计决策/边界降级/设计稿对应 5 段）
- ⚠️ **未能执行构建验证**（AGENTS.md「自测红线」要求跑通构建）：当前环境无 uni-app x 工具链，且 `main.uts` 的写法**官方 manifest.json 文档未给出**，本文件按 uni-app Vue3 入口的通用形式编写并在文件头标注「未经本地构建验证」
- 📌 **待 Boss 拍板：工程化路线**——这决定 4 个配置文件放哪：
  - **HBuilderX**：`manifest.json`/`pages.json`/`App.uvue`/`main.uts` 放**项目根**（官方文档示例结构，无 `src/`）
  - **CLI（Vite）**：配置放 `src/` 下，另需 `package.json`/`vite.config.ts`/`tsconfig.json`
  - 当前骨架按「根目录放配置 + `src/` 放源码」建，**`pages.json` 的 path 带 `src/` 前缀**

### 2026-09-19 — 按 Ardot 设计稿校正 VisualLanguage.md 色值
- Boss 裁定「**以 ardot 设计稿为准**」，据此把 `design/VisualLanguage.md` 的色值**全量校正**（11 处替换，覆盖 19 个色值点）：
  | 旧值（手抄错） | 新值（设计稿） | 出现处数 |
  |---|---|---|
  | `#7CEBC6` | `#7DEBC7` | 7 |
  | `#0E9C74` | `#0D9C73` | 7 |
  | `#0B7A5C` | `#0A7A5C` | 7 |
  | `#0B4F3C` | `#0A4F3D` | 2 |
  | `#F1FAF6` / `#F2FAF6` | `#F2FAF5` | 2 |
  | `#E9B44C` | `#E8B54D` | 1 |
  | `rgba(16,80,62,.60/.34)` | `rgba(15,79,61,.60/.34)` | 2 |
  | `rgba(124,235,198,.42/.40)` | `rgba(125,235,199,.42/.40)` | 2（mint-e1 的 rgba 形式，一并校正） |
  | `rgba(14,156,116,.28~.40)` | `rgba(13,156,115,.28~.40)` | 1（mint-e3 的 rgba 形式） |
- 文首新增来源声明：**色值以 `design/DesignTokens.md` 为唯一事实来源**；并明确 **几何 / 动画 / 交互规格（§4 瓶子、§5 液体、§7 弹簧、§8 反馈矩阵）是设计稿之外的设计资产，仍然有效**
- 至此三处色值来源（Ardot 变量集 / `AGENTS.md` / `VisualLanguage.md`）已统一，不再互相打架
- **同时校正 `design/UI_Spec.md`**（13 处色值，此前遗漏）+ 两份文档里**过时的图标方案**：
  - `VisualLanguage.md` §10：食物图来源 `Pixabay 真实照片` → **Agnes AI 文生图**；§10.1「复用风险」改写为「v1.0 已消解（347 条 = 347 张专属图，不做品类兜底复用）」
  - `VisualLanguage.md` §11 体积：`180×30KB ≈ 5.4MB` → `347×16.5KB ≈ 5.6MB`；§12 落地清单勾掉「emoji → Pixabay 真实食物图」
  - `UI_Spec.md` §6.1：食物图来源同步；§8 参考文档表改为实际文件名（`CalTrack_UIDesign.md` 已不存在于仓库）
  - 修正 4 处旧文件名引用（`CalTrack_VisualLanguage.md` → `design/VisualLanguage.md`、原型路径补全为 `app/prototype/CalTrack_Protoype.html`）
- ✅ 至此 `design/` 下三份文档（`DesignTokens.md` / `VisualLanguage.md` / `UI_Spec.md`）**色值与图标方案全部对齐**，无残留旧值
- 📌 **踩坑记录**：并行发出的多个 `replace_in_file` 若指向**同一文件**，会互相覆盖写回结果（本次导致 9 处替换静默丢失，工具仍报成功）；同一文件的批量修改必须**串行**，或用脚本一次性完成

### 2026-09-19 — 建立设计 Token 唯一事实来源（Ardot 对接）
- 连通 Ardot MCP（本地 `127.0.0.1:50501`），读到设计文件「**CalTrack 高保真 UI**」（fileId `727289305476547`，权限 `readwrite`）
- `export_variables` / `fetch_variables` 拉出变量集 `CalTrack`（Light 模式）：**11 色 + 3 圆角 + 5 字号**
- 产出 **`design/DesignTokens.md`** 作为唯一事实来源，并附「与旧文档的差异清单」
- ⚠️ **发现文档与设计稿的色值系统性不一致**（手抄误差 ±1）：
  | 项 | 旧文档 | **设计稿实际（准）** |
  |---|---|---|
  | mint-e1 | `#7CEBC6` | **`#7DEBC7`** |
  | mint-e3 | `#0E9C74` | **`#0D9C73`** |
  | mint-deep（小字色） | `#0B7A5C` | **`#0A7A5C`** |
  | **bg** | `#F1FAF6` | **`#F2FAF5`**（差异最大） |
  | label-1/2/3、amber | 各自差 1 | 见 token 文档 §6 |
  - `AGENTS.md` 与 `design/VisualLanguage.md` 都受影响
- 已更新 `AGENTS.md` 色板段 → 指向 `design/DesignTokens.md`
- 待办：`design/VisualLanguage.md` §3 的色值待同步修正（否则两份文档继续打架）
- 附带踩坑：Ardot `export_variables` 用 `colorFormat=hex6` 会**静默丢掉 alpha**
  （`label-2` 60% / `label-3` 34% / `glass-bg` 74% 全被变成不透明），须从 `fetch_variables` 原始值取

### 2026-09-19 — 图标资源集成进 App 静态目录（未动 App 代码）
- `build.py` 新增 `sync_icons()`：把 `assets/icons-final/` **增量同步**到 `app/src/static/icons/`
  - 原因：App 打包只包含 `app/` 目录内的文件，`assets/` 下的产物必须复制一份进 App
  - 增量策略：只复制缺失或更新的（**重跑实测复制 0 个**，不会重复搬运 347 个文件）
- 同步结果：**347 个图标 / 7 个 ASCII 分类子目录 / 5.6MB**
- **引用约定**：`food_library.json` 的 `img` = `<catKey>/<id>.webp`，前端拼前缀 `static/icons/`
- 遵守 Boss 要求「先不要开始开发 app 端」——**未写任何 App 代码**（ts/vue/页store 全部未动）
- ⚠️ **发现两件事需后续处理**：
  1. 项目**尚未初始化 git**（`AGENTS.md` 里的 git 分支策略尚未生效）
  2. 初始化 git 时建议把 `app/src/static/icons/` 加入 `.gitignore` —— 它可由 `build.py` 从 `assets/icons-final/` 重建，否则 5.6MB 图标会在仓库里存两份

### 2026-09-19 — 图标路径改为纯 ASCII（Boss 指出隐患）
- **隐患**：原图标路径是 `assets/icons-final/主食/p001-米饭.webp`，**目录与文件名都含中文**。中文路径在以下场景有兼容风险：
  - URL 请求需 percent-encoding（`米饭` → `%E7%B1%B3%E9%A5%AD`），服务端/CDN 编码不一致会 404
  - 跨平台文件系统编码不同（Windows GBK vs Linux/macOS UTF-8），互传可能乱码
  - 打包工具（webpack/vite/uni-app）对非 ASCII 文件名处理不一致
  - 真机按路径读本地文件时编码易出问题；日志报错乱码难排查
- **改动**：
  - `icons_v1.yaml` 新增 `categories` 段：`name`（中文，UI 显示）+ `key`（ASCII，路径用）
  - 7 个分类目录重命名：主食→`staple`、菜品→`dish`、肉类蛋类→`protein`、蔬菜→`vegetable`、水果→`fruit`、饮品→`drink`、零食→`snack`
  - **694 个文件**重命名：`p001-米饭.webp` → **`p001.webp`**（文件名用食物 id，可读性由 `name` 字段承担）
  - `build.py` / `gen_icons.py` 同步改用 `catKey` 拼路径
- **校验通过**：347 库条目 ↔ 347 图片引用 ↔ 347 磁盘文件，**缺失 0 / 非 ASCII 0 / 多余 0**
- 顺带：`food_library.json` 体积从 135.7KB 降到 **132.3KB**（路径变短）

### 2026-09-19 — 文档债清理 + v1.0 范围冻结
- **`docs/FoodLibraryPlan.md` 按「理解 A」全面校正**：
  - 顶部新增「**v1.0 范围冻结**」段，集中列出被取代的旧数字：5000/18000 条 → **347 条**；Top200 + 品类兜底图 → **347 张全专属图**；品牌产品图 → **不做**
  - 补记**第三条已推翻的旧决策**：图片路线从「Pixabay 真实照片 + 品类兜底图」改为「AI 文生图」
  - 体积账改为实测值：营养数据 136KB + 图标 5.60MB ≈ **5.7MB**
  - 数据分层从 L1–L4 四层 → **按 `confidence` 三档**（347 条精品库里逐条标置信度比分层更精确）
  - 生产流水线改为实际落地的**八步流程**
  - 待拍板第 1、2 条标记为已定；10.1 的 v1.0 范围改为 347 条
- **`toolchain/README.md` A 章节重写为多源模式**（五份源文件 / 脚本清单 / 6 项校验 / 数据流 / 实测产出 / 已知风险）
- **Boss 范围收敛决定：v1.0 不做「用户自定义规格 / 模板」**
  - 理由：只有奶茶一个品类需要规格，要支撑它得做编辑 UI + 持久化 + **模板版本迁移** + 校验（约 3–5 天），投入产出不匹配
  - 现状：代码里本就没有这个功能，`vessel_tpl.yaml` 的 `override` 是**数据源字段**、不是用户 UI
  - ⚠️ **必须区分的两条**：自定义规格 = 让用户改**库**（不做）；**记录级热量覆盖 = 让用户改「这一顿」（P0 必做）**
    —— 后者是「搜不到就记不了，记不了就卸载」的兜底，粒度不同，不能一起砍

### 2026-09-19 — 打包链路打通 + 工作区清理
- **`validate.py` 重写为多源一致性校验**（5 份源文件：`icons_v1` / `nutrition_v1` / `icons_v1_usage` / `vessel_tpl` / `opts_tpl`）
  - 校验项：三源 id 对齐、模板引用合法、数值合理性、`basis` 与 `confidence` 一致性、宏量配平（酒精类除外）
  - **首次运行即通过**，无错误
- **`build.py` 重写为多源合并**：347 条 → `food_library.json`（**135.7KB**）
  - 食物条目新增 `pieceWeight`（按个计食物的克重，102 条有值）与 `img`（图标文件名）
  - 产物写入 `toolchain/dist/` 并同步 `app/src/data/food_library.json`
- **`schema/v1.0.json` 更新**：id 格式放宽为 `^[a-z]+_?[0-9]+$`（适配 `p001`）、`foods` 增加 `pieceWeight`/`img`、`optTpl` 支持 `multi` 类型与 `def` 为数组
- 产物摘要：`conf` 分布 `{1: 11, 2: 161, 3: 175}`；347 条全部有器皿分段、10 条有选项、102 条有单个克重
- **工作区清理**：删除 `assets/icons/`（29 张废弃实景照片）与 `assets/icons-compressed/`（旧 34 张 + 测试图）；停掉 8899/8901 两个临时预览服务
- `AGENTS.md` 目录结构同步更新（toolchain 完整脚本清单 + assets 产物目录）

### 2026-09-19 — 营养数据审计与修正（347 条全量）
- 按「食物分类的常识区间」做离群扫描：12 条命中，逐条判断后其中 **9 条是规则太严、数据本身正确**（腐竹蛋白 44.7g、毛豆 131kcal、凉拌菜 25-35kcal、果冻 60kcal 均属实）
- **真错误 5 条，已全部修正并配平验证**：
  | id | 食物 | 原值 | 修正为 | 问题类型 |
  |---|---|---|---|---|
  | p270 | 珍珠奶茶 | 350 kcal/100ml | **43** | 量纲错（比猪油还高），同时对 `milk_tea.yaml` 的 base |
  | p271 | 芝士奶盖茶 | 180 kcal/100ml | **85** | 量纲错（把「每份」当「每100ml」） |
  | p288 | 椰奶 | 180 kcal/100ml | **60** | 口径歧义（明确按「椰汁饮料」，非烹饪椰浆） |
  | p137 | 鸡爪 | 80 kcal | **254** | 偏低（配平差 0） |
  | p126 | 猪血 | 蛋白 19g | **12.2g** | 偏高（配平差 0） |
- **`milk_tea.yaml` 的 base 注释矛盾已判定并消除**：结论是 **base=43 正确、「30% 含乳量」写错**
  - 依据：43kcal/100ml → 中杯 500ml 全糖 325kcal，与市售中杯全糖奶茶 250-350kcal 吻合；若取 19.5 则仅 207kcal，明显低估
  - 口径已改为「市售常见奶茶（植脂末+牛奶混合基底）」，并注明纯鲜奶配方应降至约 20-30kcal/100ml
- **错误率 5/347 = 1.4%**，且错误类型**集中在「量纲」**（LLM 把「每份」当成「每 100ml」）—— 这是后续扩充数据时要重点防的失误模式
- 结论：347 条可直接进 App（其中 conf=1 的 9 条由 UI 标「估算值，仅供参考」）

### 2026-09-19 — 图标线全线完成 + 营养数据线初稿
- **图标线完成**：347 张全部产出
  - 生图 347/347，耗时 5.45 分钟（59.8 张/分钟），白底像素校验 **100% 合格**
  - 压缩 347 张 → WebP 512，总计 **5.60MB**，平均 16.5KB，**单张最大 25.0KB、超标 0 张**（完全命中 FoodLibraryPlan 的 15–25KB 规格）
  - 产物：`assets/icons-gen/`（原始 PNG 1K）、`assets/icons-final/`（**512 WebP，App 用这个**）
- **营养数据线初稿**：347 条（`gen_nutrition.py`，分层方法）
  - 置信度：`conf=3` 176 条 / `conf=2` 162 条 / `conf=1` 9 条
  - 依据：`composition_table` 193 / `recipe_estimate` 145 / `rough_estimate` 9
  - 核对清单：`toolchain/sources/nutrition_checklist.md`（30 条按风险排序 + 145 条配方明细）
  - 字段：`cal/protein/carb/fat` + **`unit`**（39 项饮品按 ml，其余按 g）+ `piece_weight` + `basis` + `confidence` + `basis_detail`
- **抽查修正**：
  - 奶茶数值 `350 kcal/100ml` 荒谬（比猪油还高）→ 改回 **43 kcal/100ml**（对齐 `milk_tea.yaml` 的无糖 base，甜度/加料交给 `opts_tpl` 组合计算）
  - 补 `unit` 字段（原先液体按 100g 计是错的）
  - 标记 3 个待核项：`p137` 鸡爪（80 kcal 偏低，成分表约 254）、`p126` 猪血（蛋白 19g 偏高）、`p121` 五花肉（口径待确认）
- ⚠️ **待 Boss 确认的关键矛盾**：`milk_tea.yaml` 注释写「全脂牛奶≈65，按 **30%** 含乳量折算」，但 `65 × 0.3 = 19.5 ≠ 43`；若含乳量为 **65%** 则 `65 × 0.65 = 42.25 ≈ 43`。**注释或 base 数值必有一处错**，而它直接决定奶茶整张热量表（215/245/270/295/325 等）

### 2026-09-19 — 图标线与数据线槽位生成完成
- **图标线**：`toolchain/sources/icons_v1_visual.yaml` 生成 347 项生图槽位（LLM 初稿 + 人工修正）
  - 字段命名改为 `container`（视觉容器），**刻意避开数据线的 `vessel`（计量器具）**，防同名混用
  - 修正项：火锅视角改「四分之三侧视」（依据实测结论）、9 项抽象词/主观形容词（`assorted`/`various`/`milky`）、5 项多颜色并列（苹果→红、洋葱→金黄等）
  - 审计结果：风险词清零、多颜色并列清零
- **数据线**：新增三份源文件
  - `toolchain/sources/vessel_tpl.yaml`：18 个计量器具模板（cup / cup_coffee / bowl_rice / bowl_noodle / pot / plate / piece / slice / skewer / bag / bottle / can…）
  - `toolchain/sources/opts_tpl.yaml`：4 个选项模板（sweet / topping / sugar_pack / syrup_pump）
  - `toolchain/sources/icons_v1_usage.yaml`：347 项引用，**全部合法**（引用 key 均存在于模板集）
- **咖啡甜度独立建模**（不复用奶茶 sweet）：美式/速溶 → `sugar_pack`（糖包 0/1/2）、拿铁/卡布奇诺 → `syrup_pump`（糖浆 0–3 泵）、**摩卡 → 无选项**（配方自带巧克力酱）
  - 理由：奶茶 sweet 是「5 档几分糖 × 按 500ml 线性缩放」，套用到咖啡会算错
- **建模铁律**：**配方固定差异 → 拆独立条目**（无糖可乐、三合一速溶咖啡），只有「用户可调」的才出选项
- 修正：5 种纯茶（绿茶/红茶/乌龙茶/普洱茶/茉莉花茶）从「现制茶饮」纠正为「自己泡的茶」→ `mug` + 无选项
- 新增可复跑生成器：`toolchain/gen_visual_spec.py`、`toolchain/gen_usage_spec.py`（非一次性脚本）

### 2026-09-19 — v1.0 食物清单落地（347 项）
- **Boss 拍板：采用「理解 A」** —— 一个食物 = 一条数据 = **一张专属图**，不做「Top 200 专属 + 品类兜底复用」的三层结构
- 清单落 `toolchain/sources/icons_v1.yaml`，**347 项**，含中式成品菜（Boss 明确要求纳入）
- 分类分布：主食 61 / 菜品 58 / 肉类蛋类 51 / 蔬菜 59 / 水果 40 / 饮品 39 / 零食 39
- 校验：无重复 id、无重复名称；YAML 语法通过
- 清单内已内置生图 `prompt_template`（固定骨架），每项待补 `vessel`（标准器皿）+ `view`（视角）
- 影响：`docs/FoodLibraryPlan.md` 的「体积账 / 数据分层 / Top 200 + 品类兜底图」几块需按 A 方案重写（待清单确认后一次性改）
- 待办并行线：347 条**营养数据**（每 100g 热量/蛋白/碳水/脂肪）尚未开始，是比图片更大的工作量

### 2026-09-19 — 图标方案定案：纯文生图（Agnes）
- 经多轮实测对比后**定案：纯文生图**。不用图生图、不用程序抠图、不抓真实照片
- 排除依据：① 真实照片**全带背景**（已下载 34 张中 29 张有背景、白底命中 **0**），图生图要额外工序却无增益；② "先写详细文案再生图"**无增益甚至有害**（`milky brown` 把奶茶颜色描述偏）；③ 品牌锚定短语（"参考市面上常见品牌实物"）与其他表述**无显著差异**
- **核心 Prompt 规约：说「是什么」，别说「感觉像什么」**
  - ✅ 有效：逐项枚举具体食材 / 容器材质与形状 / 状态动态词（`bubbling`）/ 视角词
  - ❌ 无效：抽象概括（`assorted ingredients` 导致麻辣烫画成牛肉粉）
  - ⚠️ 有害：主观形容词
- **器皿是第一识别特征**：火锅 v1 `pot of hotpot`→砂锅米线、v2 `stainless steel`→**铁盆**、v3 `copper hotpot + central chimney`→通过（最终选定**四分之三侧视**）
- 实测 10 个不同难度食物：**首轮合格率 8/10（80%）**，失败项为麻辣烫与火锅（各需 2–3 轮修正）。规律：越"料多"、越依赖中式器皿的食物越容易翻车
- 成本：单张 10–19s；20 路并发 **69.3 张/分钟**；240 张约 **3.5 分钟**（含 30% 重做约 4.5 分钟）；当前官方标价 $0
- 白底由 prompt 天然满足（四角像素校验 10/10 纯白），**仅剩体积需调**（`max_size_kb` 50 → 25）
- 经验全部沉淀到 `toolchain/README.md` B.3–B.6

### 2026-09-19 — 图标素材链路修复 + 图源经验归纳
- 修复 `toolchain/fetch_icons.py` 六处硬伤：Pixabay 域名错误（`api.pixabay.com` 不存在）导致接口 100% 失败、`per_page=1` 非法触发 HTTP 400、搜索词未 URL 编码、下载档位 640 改 1280、`&sig=` 自我替换死代码、超时 5s 改 15s
- **Pixabay 提为第一顺位**（原为 Pexels 优先），Pexels 降为兜底
- 修复压缩断链：原条件写死 `source == "web"`，导致 Pixabay/Pexels 的图永不产 webp；叠加 `os.system` 子进程不走 UTF-8、且 `compress_icons.py` 只接受目录参数 → 改为进程内 `compress_image()` 直接调用
- 修复索引覆盖：`_update_index` 改为读旧文件合并写，跑单分类不再冲掉其他分类记录
- 实测四源可用性：Pixabay ✅（`bubble tea` 命中 7259 条 / 1280 档 290KB）、Pexels ✅（搜索下载正常，但取 `src.original` 实测 **3017KB** 需降档）、Agnes ✅（`agnes-image-2.5-flash` 12.9s 出图 853KB）、`source.unsplash.com` ❌ **已下线**（实测两次均 503）
- 摸清 Key 池：Pixabay×2、Pexels×2、Agnes×5（`AGNES_API_KEY` ~ `AGNES_API_KEY5`）；另有 `PIPY_AGNES_2.5_FLASH_MCP_KEY`(221 位) 用途未确认
- 实测 Agnes 并发吞吐：1/4/8/16/20 路并发总耗时均恒定在 17–19s（瓶颈是服务端批次窗口，与并发数无关）→ 20 路 5 Key 实测 **20/20 成功、69.3 张/分钟、无 429**；推算 240 张约 **3.5 分钟**（含 30% 重做约 4.5 分钟）
- 实测 Pixabay 白底命中率：`colors=transparent` 返回带 alpha 的 PNG（`photo` 类型仅 58 条且主体是茶杯非奶茶；`illustration/vector` 1356+820 条主体正确但为卡通风格）；已下载 34 张中仅 **5 张白底且均为 Agnes 生成**，搜来的 29 张白底命中 **0**
- 经验归纳落地 `toolchain/README.md`：图源顺位表 / Key 池轮转策略 / Agnes 防失真四道闸 / 13 条实测踩坑清单 / 产出规格落差分析
- 产出：`assets/icons-compressed/` 34 张 WebP（0.99MB），按 `ICON_CATALOG` 全量 70 项算**还缺 36 张**

### 2026-09-19 14:33 — AI 生图 + 图标压缩完成
- 使用 Agnes AI 生成 17 张食物图标（白底真实感风格）
- 分类：水果4 / 蔬菜2 / 肉类3 / 主食4 / 饮品3 / 零食1
- 压缩脚本 `toolchain/compress_icons.py`：PNG→WebP，平均 28KB/张，总大小 0.47MB
- 索引 `assets/icons/icon_index.json` 已更新，指向 WebP 文件
- 奶茶图标标记为 `primary`（v1.0 核心品类）

### 2026-09-19 14:27 — Ardot MCP 云端配置
- 写入 `~/.workbuddy/mcp.json`：`ardot-remote` 指向 `https://ardot.tencent.com/mcp`
- 用户需重启 WorkBuddy 后点击「信任」激活

### 2026-09-19 14:14 — toolchain + 食物库 v1.0 已完成
- `toolchain/sources/milk_tea.yaml` — v1.0 数据源（1 条食物：奶茶，1 个器具 cup，1 个选项模板 sweet）
- `toolchain/schema/v1.0.json` — 输出 JSON 格式定义
- `toolchain/validate.py` — 校验：结构 / 引用 / delta 缩放自洽
- `toolchain/build.py` — YAML → 校验 → JSON + fingerprint → 同步 `app/src/data/`
- `app/src/data/food_library.json` — 生成物（1 条，1.9KB）
- 验证：所有杯型×甜度组合热量与设计稿一致（小杯350: 151/172/189/207/228，中杯500: 215/245/270/295/325，大杯700: 301/343/378/413/455）

### 2026-09-19 — 设备能力全局化完成
- `app/src/composables/useDeviceCapability.ts` 重构：新增 `detectDeviceCapability()` 导出函数，修正 iOS 机型表（iPhone X 从 mid 移到 low，补充 11 Pro/Pro Max）
- `app/src/stores/device.ts` 创建：Pinia 全局 store，App 启动检测一次，7 个 getter 暴露给所有模块
- `AGENTS.md` 设备分档表按新边界重写，目录树补全 8 个 store

### 2026-09-19 — Ardot 设计稿与原型双向对齐
- 食物选择弹窗：新增分类 tab（全部/水果/蔬菜/肉类/主食/饮品/零食），与原型一致
- 首页加号被 tabbar 裁切：Tabbar + TabbarWrap 两层 `clipsContent` 改 false
- 删去原型中「自己创建食物」行（v1.0 不做自建食物，`USER_FOOD_ENABLED=false`）

### 2026-09-18 — 项目初始化
- 新建 `kaluli/` 项目文件夹，删除 4 类过时文档
- 完成 Ardot 8 屏高保真设计稿导出（`assets/exports/` 9 张 PNG）
- 完成架构方案：Pinia 8 store 拆分 / 存储三层降级 / 食物库全量加载 / Canvas 液体动画 / 玻璃效果分层 / CLI 构建 / 平台降级 / 反馈三级矩阵

---

## 接手检查清单

**按强制启动协议顺序：**

- [ ] **第一步**：阅读 `docs/progress.md`（本文件）— 确认当前精确阶段和最新进度
- [ ] **第二步**：阅读 `AGENTS.md` — 校准技术栈、核心约束、目录结构
- [ ] **第三步**：按需阅读
  - [ ] `docs/PRD.md`（产品需求）
  - [ ] `docs/Review.md`（评审复盘 / 决策依据）
  - [ ] `design/VisualLanguage.md`（视觉语言 v3.0）
  - [ ] `app/prototype/CalTrack_Protoype.html`（交互原型）
- [ ] 查看 Ardot 设计稿：`https://ardot.tencent.com/file/727289305476547`
- [ ] 确认 `app/src/` 现有文件清单

## 下一步待办

- [ ] **等 Boss 拍板**：出 uni-app x 代码骨架 vs 继续打磨设计
- [ ] 真机验证 backdrop-filter（iOS/Android 各一台）
- [x] emoji → 真实食物图（已完成，Agnes AI 生成，见 `assets/icons-compressed/`）
- [x] 配置 Pixabay API Key 替换部分 AI 图（已完成，Pixabay 已提为第一顺位并实测跑通）
- [x] **Boss 拍板**：采用「理解 A」——一个食物一张专属图，不做品类兜底复用
- [x] **347 项清单冻结**：Boss 确认全做（清单含中式成品菜）
- [x] **补视觉容器 + 视角**：`icons_v1_visual.yaml` 已生成，字段名 `container`（避开数据线 `vessel`）
- [x] **建计量器具模板集**：`vessel_tpl.yaml`（18 个器具，带容量档位）
- [x] **设计咖啡甜度模型**：`opts_tpl.yaml`（`sugar_pack` / `syrup_pump` / 摩卡无选项）
- [x] **补 347 项份量与选项引用**：`icons_v1_usage.yaml`（已修正 5 项纯茶误判）
- [ ] **人工审两份初稿**：`icons_v1_visual.yaml`（器皿是否准确）+ `icons_v1_usage.yaml`（选项归属）
- [ ] **实现 Agnes 批量生图脚本**：20 路并发 + Key 池轮转 + 429 退避 + 白底自动校验（四角像素）
- [ ] **347 条营养数据**（每 100g 热量/蛋白/碳水/脂肪）：比图片更大的工作量，尚未开始
  - ⚠️ `piece` 类 170 项（占 49%）的 `amount = 1`，**必须补「1 个 = 多少克」**才能算热量
- [ ] **重写 `docs/FoodLibraryPlan.md`**：按 A 方案调整体积账 / 数据分层 / 图片策略
- [ ] **压缩目标下调**：`max_size_kb` 50 → 25，对齐 FoodLibraryPlan 的 15–25KB/张（并调整 `quality <= 50` 的 break 条件）
- [ ] **确认旧 34 张图去留**：29 张实景照片 + 5 张 Agnes 白底图，新方案下是否废弃重做
- [ ] **决定 `fetch_icons.py` 真实图源分支去留**：方案已不用 Pixabay/Pexels/Unsplash 抓图，这几段是否清理
- [ ] 图标集成到 App 前端（懒加载 + LRU 缓存）
- [ ] 合规 critic loop 复评
- [ ] 液体 rAF 动画真机帧率测试

---

## 变更日志

| 时间 | 变更 |
|---|---|
| 2026-09-20 | **新增「添加食物」流程 5 块画板（老板第 19 轮，fileId `727289305476547`，全部 375×812）**：按老板设计说明图（1024×1536 = 主图 + 3 张状态小图 + 6 条分区注解）新建 —— `13 · 首页 Home（基线）`=`88:1`、`14 · 添加食物 Sheet（默认态）`=`88:170`、`15 · 添加食物 Sheet（选择态 · 全糖）`=`88:448`、`16 · 添加成功（动效）`=`88:726`、`17 · 首页 Home（添加后）`=`88:1004`，x 依次 4750 / 5225 / 5700 / 6175 / 6650（**与并行会话的 12 号板 `31:1050`、13 号板零冲突**）。做法：先建 13 号基线，其余四块 `C()` 复制后再改，避免把首页画四遍。**老板第 19 轮四条口径**：①糖的热量不计入总数，325 保持不变（"设计稿随便写无所谓，现在只讨论设计稿"）；②甜度选中态用**轻量款**（浅底 `#E8F8F1` + 绿描边 `#2ECFA0` 1.5px + 绿字 `#2E9E7C`）；③首页以本次新设计为准（无头像、三行标题、无目标胶囊），12 号旧板不动；④时间轴要**完整四条**（早/午/晚/夜宵），不能只画夜宵一行 |
| 2026-09-20 | **弹层 6 区结构定稿（14/15 号板）**：①食物行（52 图块 r14 `#EAF4FA` + 牛奶杯 SVG ｜ 全脂牛奶 17px SemiBold `#0A4F3D` + 65 kcal/100ml 13px `#8CA79C` ｜ 右列 325 30px Bold `#0E6B52` + kcal 15px + 「⇄ 更换」`#E0F5ED` 胶囊 + 「已按 **中杯 500ml · 全糖** 计算」）；②分量 3 卡（小杯350/227 · **中杯500/325 选中=实心薄荷渐变+白字+右上白勾** · 大杯700/455）；③甜度 5 胶囊（两行式 = 名称 13px + kcal 11px；无糖0/三分13/**五分26**/七分39/全糖52）；④餐次 4 卡（**每卡带时间段** 07:00–09:00 / 11:30–13:30 / 17:30–19:30 / 21:00–23:00，**夜宵选中=实心薄荷+白字+白月亮**）；⑤底部全宽薄荷渐变胶囊「添加到夜宵 · 325 kcal」+ 牛奶杯图标；⑥遮罩 `#06231A` @0.45 + 弹层 r34 / y172 / h640。**14 号板忠于原稿**：甜度选「五分」（轻量选中）而副行写「已按…全糖计算」——这是设计图自身的不一致，老板已明示不必修 |
| 2026-09-20 | **16 号板「添加成功」按原稿实测重画（一处返工）**：`U(node,{svg})` 对 SVG 节点静默失败的铁律再次生效 —— 首版把圆球画成**实心薄荷渐变 + 白杯**，与原稿不符，必须 `D("88:1169")` 删掉再 `I()` 新建。原稿实测（从 ② 缩略图按横向比例反算，横向量测可靠）：**圆球是极浅薄荷 `#EDF8F3` 圆 + 杯身是绿色**（杯口/杯壁 `#2ECFA0`、液面 `#21C08D`、液面高光 `#7BE3C0`、杯内两颗白色星形闪点），直径 ≈123 逻辑px；**「已添加」胶囊**跨在球底与卡顶（各 17px），≈104×34；**白卡 r28 ≈303×123**，内含 `+325` + `kcal` **同为薄荷绿**（原稿两段都是绿的，不是深绿+薄荷两色）+「已加入夜宵」灰字，卡左上角另有一个 24px 浅薄荷描边小圆环（纯装饰）。**竖向尺寸不可信**：缩略图是"裁切过的弹层区域"（宽高比 0.85 ≠ 375:812），纵向比例失真，只有横向比例可反算 |
| 2026-09-20 | **③ 首页（添加后）原稿实测**：还能吃 **205** kcal（530−325）、已摄入 **1595 / 1800** kcal（1270+325，两处自洽 ✓）、三格营养 **68g 蛋白质 / 152g 碳水 / 42g 脂肪 不变**（设计图没重算三格，属 mock 未刷新）、今日餐次出现「**夜宵 · 22:15** ｜ **全脂牛奶 500ml** ｜ **325 kcal**」，缩略图带**绿色 ✓ 徽标叠在牛奶杯缩略图左上角**。**发现原稿遗留缺陷**：③ 的「今日餐次」只画了「夜宵」一行（早/午/晚全无），老板已明确要求补成**完整四条**；另 **水瓶液面在原稿里没有变化**（前后都在瓶身 55% 左右），故本轮不联动液面 |
| 2026-09-20 | **个人中心 1:1 复刻板（`31:1226`）纵向溢出修复——修掉 273px 出画**：编辑器停在该板，读布局即发现 4 张卡实高 820px 塞进 589.5px 的 Content，**「最近记录」整块掉在画布外（y 849→1017）、趋势卡被 Tabbar 压住**。从参考稿 `clipboard-2026-09-19T19-09-14-242Z-1ef90466.jpg`（851×1847，比例 0.4607 ≈ 375/812）反算正确纵向预算：绿头 112 + 今日热量 244 + 本周 79 + 趋势 122 + 最近 130 + Tabbar 81 = 812。改法**全是 `U()`，无一次 D/M**：TopZone 164→112、Tabbar 58.5→80、Content gap 10 / paddingBottom 0、四张卡 padding+gap 全档收紧、卡内字号 16→14 一档、三格卡 62→44、达标条 64→45、卡内圆 34→24、进度条填充 239→222（71%）|
| 2026-09-20 | **趋势图三处结构性纠错（同一画板）**：①**`ChartBody` 是 `layout:horizontal`，把 `PlotArea`(153) 与 `AxisRow`(153) 并排** → 7 根柱被压进 153 宽、实际间距只剩 15.5px 互相重叠，日期整体跑到右半边（这就是截图里那团糊掉的坐标轴）；②柱列是 hug 高度 + 顶对齐，**1950 那根的底沿比 1580 低 22px**，而参考稿所有柱坐同一基线 → 改列高 62 + `primaryAxisAlignItems:"MAX"`；③`PlotArea` 用 SPACE_BETWEEN（柱间距 45.5）而 `AxisRow` 用 gap 10（日期间距 39.5）→ 两排横向错位，改 `MIN` + 两侧 padding 34/2 后柱/日期间距同为 40 精确对齐。另 `ChartBody` 改 `layout:none` 收绝对定位层（ChartRow y0 h62 / AxisRow y65 h13），Y 轴 2400/1800/1200/600 按参考稿压到 plot 内、目标虚线 1800 落到柱顶上方、删除多余的「0」刻度 |
| 2026-09-20 | **新铁律：flex 容器里两个 `fill_container` 兄弟节点会平分宽度**（313 宽的 ChartBody 里两个子节点各得 153）——**图表这类「上下两层」结构必须把父容器设成 `layout:none`**，否则自动排成左右并排；另外 `layout:none` 容器里的子节点 `layoutPositioning` 会被 Ardot 归一化成 `AUTO`，但显式 `x`/`y` 仍然生效，不必强行写 ABSOLUTE |
| 2026-09-20 | **发现并行会话在同一画板操作**：`ChartBody` 里出现非 31 号段的容器 `66:1 ChartRow`（把 PlotArea+YAxis2 包起来）、`PlotArea` 的 paddingLeft 被从 30 改成 8、`AxisRow` 改成 44 —— 都不是本会话的改动。**同一 Ardot 画板被多会话同时编辑会互相覆盖，排查布局异常时先确认节点是否为本会话所建** |
| 2026-09-20 | **首页复刻返工：563 矮屏 → 375×812 标准屏（老板打回「高度小、太拥挤」）**：根因是按参考 PNG 的 2:3 图面比例机械换算，全部字号间距被压小 30%。返工不改结构只改尺寸：画板 812、TopZone 280（状态栏40+头部48+Hero 180）、HeroCard 180/圆角24、水瓶 SVG 重建为 110×162（viewBox 坐标 ×1.31 重写，**SVG frame 拉大 children vector 不跟缩**）、530→42px、营养卡 62 高/disc 34、餐次圆 28、食物行 32/图 24、**Tabbar 改 ABSOLUTE 固定 y:728 h:84**（layoutGrow 会把内容顶出去，固定底栏更稳）、虚线按新坐标 D+I 重建。纵向预算：内容 722 + tabbar 84 = 806 ≤ 812 ✓ |
| 2026-09-20 | **首页整屏复刻（「轻律生活」参考 PNG）**：新建画板 `12 · 首页 Home（复刻）` = `31:1050`（375×563，x:4275，原 12 画板零改动）。结构：TopZone 绝对定位容器（状态栏+头像行+Hero 绿块，复刻参考图「头像行压绿块顶边」的层叠）+ 营养三格卡 + 今日餐次时间轴（早/午白卡 3 行+晚餐组头）+ 双 tab 底栏。6 张食物图复用项目图标库（p013 小米粥→燕麦片、p143 鸡蛋、p284 牛奶、p117 蔬菜沙拉→鸡胸肉沙拉、p001 米饭→糙米饭、p186 西兰花），register_assets→curl PUT→upload_images 三步上传；头像复用 04 画板 imageHash（同文件 hash 复用可行）。**新铁律：flex 流式表达不了「头部与 Hero 重叠」——顶层套 layout:none 的 TopZone 收绝对定位；绘制层级=children 顺序，M() 把 Header 移到 HeroWrap 之后即修复绿块盖头像** |
| 2026-09-20 | **个人中心 1:1 还原（第 13 轮，老板实测只达 70%）** 定位两处结构性错：①**渐变区 250px 里 156px 是空底** —— `31:722` 的子节点只占 62(状态栏)+90(头像行)=152px，剩余全是空渐变；且 `31:1030` 波浪原先 `y:190 h:60`（底边=250）被 `clipsContent` 裁到只剩 6px 可见 → 观感就是一块平直深绿板。改为 `31:722` 渐变改 4 段停靠 `#8BF0D0`(0) → `#2ECFA0`(0.30) → `#2ECFA0`(0.56) → `#1FBF8F`(1)、`31:723` 58→62、`31:725` padding top10/bottom50、**`31:1046` 波浪 `y:188` + `x:-18`**（抵消父容器 18px 水平 padding，波浪铺满 375 全宽且完整可见）。②**圆环 `31:747` 根本不是圆环** —— 内里两个 ELLIPSE 是并排平躺的（外部工具写入的原始数据不可靠），整块重建为 `31:1192`：`74×74` SVG 双 `<circle r=30 stroke-width=7>`，底环 `#DCEFE7` + 进度环 `#2ECFA0 dasharray 134/188.5 rotate(-90 37 37)`，另加环端白点 `31:1197`；③状态胶囊改色：超标 `#DBE6E2`/`#E0633C`、达标 `#E4F7EF`/`#2E9E7C`，字号 9.5px |
| 2026-09-20 | **Ardot SVG 三条新铁律（实测对照得出）**：①**`U(node,{svg})` 更新已有 SVG 节点静默失败** —— 对同一节点连发 3 次带 `svg` 的 `U()` 全部返回成功但 `children` 恒为空，删空 children 后重发仍 `updated:{}`；对照 `I(parent,{svg})` 一次即成功。**结论：波浪/圆环/图表这类要重画的一律「删旧建新」，不得原地更新**。②**`<path>` 用 `C` 三次贝塞尔写大弧会被判 degenerate geometry 而整条 Insert 失败**，改用 `Q`+`T` 二次贝塞尔立刻通过，全平 `L` 折线也通过 → 问题在 `C` 的控制点解析。③**`I()` 插入 SVG 时子 VECTOR 的 `y` 被解析器整体平移**（写 y≈0 却返回 `y:6 h:54`），**不要依赖回读坐标，以截图为准**；位置不对就调父 frame 的 `y`（本轮靠 `31:1046` 的 y 修正波浪） |
| 2026-09-20 | **个人中心整屏重做（按 ChatGPT 新设计稿）**，新建画板 `11 · 个人中心 Profile（新）` = `31:601`（原 `3:573` 保留作备份）。新信息架构：①Header 文案改「已**连续**记录 128 天」，齿轮改实心白；②**新增「今日热量」主卡** = 标题行(🔥+「还可以吃」胶囊) + `530 kcal` 46px 大数字 + **71% 圆环** + **横向进度条** + 两端标注(已摄入1270/目标1800) + **三格浅绿小方块** + **达标提示条**；③本周概览由水滴改**圆形打勾/叹号/灰圆**（Day1-4 绿✓ / Day5 橙! / Day6 灰 / Day7 深绿✓）；④热量趋势加 **Y 轴刻度 + 目标虚线 + 柱顶数值 + 日期轴**；⑤最近记录加**状态胶囊 + 箭头**；⑥Tabbar 首页灰 / 我的绿 |
| 2026-09-20 | **Ardot 操作铁律（本轮新增 3 条）**：①**整屏重做必须新建画板从零搭**，禁止在旧画板上删改（历史证明必丢节点）；②**SVG 节点 viewBox 宽高比必须严格等于节点实际宽高**，否则横向拉伸导致所有内容错位（本轮 `31:853` 因节点 343 vs viewBox 312 被拉伸）；③**进度条须用「容器 + 子节点」两层结构**，两个并列 `layout:none` 的 frame 会各占一行 |
| 2026-09-20 | **Profile 三格区视觉定稿（本轮）**：①**删除左侧绿色竖杠** `31:556`（mint 渐变 3×30 彩条）——纯装饰、无语义、右侧无对称物，读起来像 bug；②三格卡改 **`fill white 0.86` 半透明 + 1px 白描边(.75) + BACKGROUND_BLUR 12 + 薄荷投影**，从"实心白块"变为"浮在渐变上的玻璃片"，成为 hero 收尾而非外挂卡；③`3:574` gap 12 / height 334、`3:606` padding-top 16，消除与「本周概览」的粘连（原间距仅 10px，两张白卡读作一块被切两半的白板） |
| 2026-09-20 | **🔴 两条操作铁律（事故沉淀）**：①**禁止用 `M()` 做结构性重排**——`fill_container` 宽度依赖兄弟节点相对关系，跨容器搬运后按新容器重算但 `padding` 不跟着变，导致内外边距错配、内容挤成一团（实测出现 `128626` 两段数字压一行的怪象）；要重排必须整块 `I()` 重建。②**删除父容器前必须 `batch_read` 确认它已空**——`D("31:555")` 连带删除了 5 个子容器 + 6 个 text（三格数据全灭），即使同批次里先 `M()` 搬走过也不行；三格已整块重建为 `31:589`（1800/1270/530 数据来自首页 `3:22`） |
| 2026-09-20 | **删除孤儿绝对定位叠层 `3:601 HeroWave`**：它是 Profile 画板直接子节点、`layoutPositioning: ABSOLUTE`、`y:172 h:190`（底边 362 > `3:574` 的 268，**超出 94px 横穿下方**），内里只剩删 HeroFade 时残留的白波浪 → 即老板圈出的"把白胶囊劈开"的断层。整块删除，`3:606` WeekWrap padding-top 76→18。**排查手法：找孤儿元素要看画板顶层 children，绝对定位节点不出现在 flex children 列表里** |
| 2026-09-20 | **修复 StatBar 白底白字**（`3:593` 内部 `3:595`/`3:596`/`3:599`/`3:600` fills 全是纯白，白胶囊上完全不可见）：值改 `#0A4F3D` 17px Inter Bold、标签改 `#7A8F88` 11px，胶囊补 `stroke white .7` + 薄荷阴影。它此前"看起来有内容"是因为 `3:593` 带 `opacity: 0.30` 半透明透出绿底 —— **改 opacity 回 1 会把被掩盖的缺陷全部暴露，改之前必须先检查内部对比度** |
| 2026-09-20 | **Profile 顶部结构重排**：`3:574` 加 `gap:10`、height 268→328（StatusBar62+AvatarRow88+StatBar64+gap10+GoalTriple92）；`31:555` height 96→92。解决两张白卡上下贴死（原观感像一块被切两半的白板）。**高度必须每改必重算，否则子元素重叠** |
| 2026-09-20 | **设置页返回按钮正解**（`3:1117`）：上一轮只改 `fills` 漏了**节点级 `opacity: 0.26`**，导致"改成半透明"后观感仍是一片白。正解 = 清 `opacity:1` + fills `white .22` + **1px 白色描边（.45, INSIDE）**——半透明白底无描边时边界糊掉仍读作白块。**铁律：改透明观感必须同时处理节点级 opacity 与 fills[].opacity，二者作用域不同** |
| 2026-09-20 | **三格卡片去掉渐变，改回纯白卡**（老板拍板；此前「渐变延伸」方案两次翻车——跨元素纵向渐变拼接必留横缝）：`31:555` GoalTriple 改 `fill #FFFFFF` 实色 + `cornerRadius 20` + 薄荷 DROP_SHADOW，删 `31:547` HeroFade，`3:574` 高度回 284；左侧彩条 `31:556` 2.5×32 薄荷渐变；三格数字靠 padding 抹平基线（Target/Intake/Left 各让 6px）；**`530` 31px Bold 主角 > `1800`/`1270` 25px SemiBold** |
| 2026-09-20 | **头像"透明层"实锤**：`3:588` 存在**节点级 `opacity: 0.28`**（非 fills 数组内的 opacity，前者极易漏读）→ 改 `opacity: 1` + 1.5px 白色内描边（白 85%）+ `3:587` gap 22→24。**教训：读节点必须显式请求 `opacity`/`blendMode`，只看 fills 会误判"没有透明层"** |
| 2026-09-20 | **设置页两处**：①「白色圆圈」实为 `3:1117` 返回按钮——纯白填充 + 白色箭头导致箭头不可见，改为 `rgba(255,255,255,0.22)`（不是要删除的元素）；②「用餐提醒」右侧 Toggle-On(`3:1144`) 删除，`C()` 复制餐次管理的 ComingBadge(`3:1166`) 保证视觉一致，新 id `31:545`，文案改「早中晚各提醒一次。敬请期待」 |
| 2026-09-20 | **结构勘误**：`HeroWave(3:601)` / `WeekWrap(3:606)` 两个容器**已不存在**，其子节点被提升进 `3:574 LiquidHero` 成为直接子节点 → 在 `3:574` 内插入任何装饰元素都会占掉一个真实纵向槽位（插到哪格毁哪格）。**排查手法：`batch_read` 父节点 readDepth=1 先看 children 顺序再定 index；id 报 not found 是子节点被提升的信号** |
| 2026-09-20 | **餐次定死为「早餐/午餐/晚餐/夜宵」**（老板要求 ardot 上锁死）：全稿替换「下午茶/加餐」→「夜宵」，涉及首页 `3:126`、添加食物弹层 `3:368`+`3:370`+`3:363`、板 09 `31:204`+`31:203`、板 10 `31:433`+`31:432`；夜宵图标由「奶茶珍珠小圆点」换成**月亮+星星** SVG（4 处）；详情行「未记录」统一 13px `#A9BAB3` |
| 2026-09-20 | **首页文字层级重新分档**（老板第 2 条：圈1太粗、圈2圈3没区分）：原「餐次名 15.5 SemiBold / 营养汇总 15.5 Bold / 餐次热量 15 Bold」**三者同色同重导致糊成一片** → 改为 **餐次热量 16px Bold `#0A4F3D`（主角） > 营养汇总 15.5px SemiBold `#0A4F3D` > 餐次名 14px Medium `#0A7A5C`（降档）**；`3:88`/`3:103`/`3:113`/`3:126` 四处餐次名同步降档 |
| 2026-09-20 | **个人中心 HeroWave 改为「三格拆解」卡片**（老板选定，与上方 StatBar 同构）：HeroWave 46→112px、`3:574` LiquidHero 218→284px、`3:606` WeekWrap padding-top 0→76；新建 `31:517` GoalTriple（375×66，水平三格 + 2 条白色半透明分割线）→ 目标 1800 / 已摄入 1270 / **还能吃 530（34px Bold 白色主角）**；前两格 26px SemiBold 白 82%、标签 11px 白 62%。原「每日目标 1800 kcal · 今日还剩 530」单行 11px 文案删除 |
| 2026-09-20 | **设计稿 P1–P5 全部落地 + 普通食物样例补齐**（Ardot `727289305476547`）：①头像换真实照片(248px) + 投影 + 间距 22px；②设置图标改实心齿轮(18px)；③HeroWave 补「每日目标 1800 kcal · 今日还剩 530」；④**新增 2 块普通食物样例画板**——`09 · 添加食物（普通食物）`(白米饭/三档碗) 与 `10 · 添加食物（计数单位 · 个）`(鸡蛋/单档)，二者均**不含选项组区块**，覆盖 341/347 (98.3%) 的无选项分支；⑤空瓶加薄荷描边 + 3 刻度线；⑥餐次热量三级层级(15px Bold / 12.5px SemiBold / 11px 辅助) |
| 2026-09-20 | **波浪画法教训定案**：曲线必须画成**一条带起伏的 SVG path**（viewBox 与节点尺寸严格相等），**严禁用矩形拼波浪**；用矩形会在浅色叠加场景渲染成"两条白边"，比原稿更糟。实测波幅需 ≥20px 才能在 375×46 容器里看出形状 |
| 2026-09-19 | Agent 自身教训沉淀：会话命令卡死（常驻进程/长阻塞序列）+ `module not found` 误诊（旧 bundle 缓存）；两条铁律入 `AGENTS.md` 调试链路踩坑清单 |
| 2026-09-19 | 图标方案定案：**纯文生图**（排除图生图/抠图/详细文案/品牌锚定）；Prompt 规约与 10 食物合格率实测沉淀至 `toolchain/README.md` B.3–B.6 |
| 2026-09-19 | 图标素材链路修复（Pixabay 域名/per_page/编码/档位）+ Pixabay 提第一顺位 + 压缩与索引断链修复；`toolchain/README.md` 归纳图源顺位 / Key 池 / Agnes 防失真 / 13 条踩坑 |
| 2026-09-19 14:14 | toolchain 骨架完成：sources/schema/validate.py/build.py + food_library.json v1.0（1 条食物） |
| 2026-09-19 13:37 | `AGENTS.md` 新增 3 个约束段：防幻觉约束 / Hooks 兜底强约束 / Vue↔MD 对应规范 |
| 2026-09-19 13:35 | 新建 `docs/progress.md`；`AGENTS.md` 补充 6 个协议段（启动协议/变更日志/沟通即文档/收尾协议/大版本更迭/编码纪律） |
| 2026-09-19 13:34 | 设备能力全局化：`useDeviceCapability.ts` 重构 + `stores/device.ts` 新建 |
| 2026-09-19 | Ardot 设计稿与原型双向对齐（分类 tab + 加号裁切修复） |
| 2026-09-18 | 项目初始化：kaluli/ 文件夹创建，过时文档清理，8 屏设计稿导出 |