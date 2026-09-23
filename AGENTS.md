# AGENTS.md — 轻律生活 项目开发指引

> 本文件供 AI Agent 在当前项目中工作时读取，是项目静态宪法。
> **新会话启动顺序：先读 `docs/progress.md`（动态状态），再读本文件（静态规则）。**
> 两者冲突时，以 `progress.md` 为准。

## 项目概述

**轻律生活** — 轻量级卡路里追踪 App，帮助用户快速记录每日饮食，直观展示摄入数据。

- 版本：v1.0 MVP
- 状态：MVP 主体已落地（5 页 ＋ 8 组件 ＋ 5 store 在微信模拟器跑通，353 条食物库），处于「还原度收尾 ＋ 工程化加固」阶段
- 目标平台：uni-app x（Vue3 + TS + Pinia），本地存储，无服务器

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | uni-app x + Vue3 + TS + Pinia |
| 状态管理 | Pinia |
| 本地存储 | uni-app x 原生本地存储 |
| 数据处理 | Python（toolchain/） |
| 设计工具 | Pencil（当前视觉准绳）+ Figma/Pixso（外部）<br>_注：Ardot 已于 2026-09-21 废止，仅作为早期规格的历史参考。_ |

## 核心约束

### 视觉
- **薄荷液滴**是唯一视觉方向（v3.0），v2.0 Apple 材质主义已废止
- **色值以 `design/DesignTokens.md` 为唯一事实来源**（历史导出于废弃的 Ardot 变量集，当前作为静态色板快照，不再与线上平台绑定）
  - 主渐变 mint：`#7DEBC7 → #1FBF8F → #0D9C73`，深色 mint-deep `#0A7A5C`
  - 页面底 bg `#F2FAF5`，超标用珊瑚 `#FF9E7D`（不用红），接近上限用琥珀 `#E8B54D`
  - 文字三级：label-1 `#0A4F3D` ／ label-2 `#0F4F3D`@60% ／ label-3 `#0F4F3D`@34%
  - 玻璃底 glass-bg `#FFFFFF`@74%（**带透明度，实现时不能丢 alpha**）
  - 圆角 card 20 ／ chip 18 ／ sheet 34；字号 hero 46 ／ title 17 ／ section 15.5 ／ body 13.5 ／ caption 12
- 小字（≤15px）必须用 `mint-deep #0A7A5C`，因为 `#1FBF8F` 在白底只有 2.3:1 对比度
- **玻璃面（TabBar）**：三 Tab 悬浮液态玻璃胶囊。参数见 `design/DesignTokens.md` §7。（决策推演见 `docs/decisions/ADR-001-tabbar-glass-capsule.md`）
- **深色模式**：仅个人中心＋设置两页随动，临时色板。（决策推演见 `docs/decisions/ADR-005-dark-mode-scope.md`）
- **页底预留**：方案 A 动态安全区全避让（无小白条 92px / 有小白条 calc(82px + env())）
### 交互
- **每个交互点击都要有反馈**：动画 + 触觉 + 音效，三选一不可省
- **反馈分级**（按操作重要性，不是每个按钮都弹一下）：

| 级别 | 触发场景 | 动画 | 触觉 | 音效 |
|---|---|---|---|---|
| L1 轻 | 切换 tab、切换甜度 | Tab＝选中气泡四关键帧（按下压扁→飞行→落位，见「玻璃面」条）；切换甜度＝图标跳动 | `vibrateShort()` | 无 |
| L2 中 | 添加/删除食物、确认按钮 | 按压回弹 + 波纹 | `vibrateLong()` | 确认音 |
| L3 重 | 提交成功、目标变更 | 数字滚动 + Toast | 双击 | 成就音 |

- **动画反馈**：按压 `scale(0.945)` 回弹、波纹从触点扩散、Tab 图标弹跳、Sheet stagger 入场、数字 odometer 滚动、Toast 弹入、删除右滑淡出、新增高亮扫入
- **触觉反馈**：`uni.vibrateShort()` / `uni.vibrateLong()`，通过 `useDeviceStore().haptics` 按机型分档降级
- **音效**：Web Audio API（`assets/sound/`），4 种——确认/取消/删除/成就，音量可调，设置页可关
- **液体晃动**：34 段正弦波 + rAF 衰减，衰减系数 0.955（改了会晃 6s+ 变躁动）
- **首次进入不晃动**（安静开场）

### 设备能力分档（全局 Pinia store: useDeviceStore）

> 检测逻辑在 `composables/useDeviceCapability.ts`，App 启动时调用一次存进 Pinia，
> 所有组件通过 `const device = useDeviceStore()` 读取 getter（tier / haptics / liquidWave / sound / backdropBlur / platform）。

| 档位 | iOS 判定 | Android 判定 | 关闭的能力 |
|---|---|---|---|
| **high** | iPhone 11 及以后 (A13+) / iOS 15+ | Android 10+ / 非低端芯片 | 无 |
| **mid** | iPhone XS/XR/11 (A12/A13) / iOS 13-14 | Android 8-9 | 无 |
| **low** | iPhone 8 及以前 (A10-) + iPhone X (A11) / iOS 12- | Android 7- / Helio/SD4xx/旧 Exynos/展锐 | 触觉 + 液体波纹 + backdropBlur |

- iOS 机型按 model 字符串精确匹配（`iPhone10,5`=X, `iPhone11,2`=XS 等），未识别用系统版本兜底
- Android 用 API Level + 芯片关键词（helio / sd4 / mt67 / kirin710 / unisoc）双重判断
- low 档关闭触觉、液体波纹、backdropBlur；mid/high 全开（音效始终开启，开销极小）

### 数据
- 食物库全量内置，不联网下载
- v1.0 不做品牌，只做「奶茶」一个品类
- 食物数据结构：`vessel`（计量器具模板）+ `opts`（选项模板）+ `override`（记录级热量覆盖）
- 记录存冗余快照（foodName + source + schemaVersion），不存纯 foodId
- `USER_FOOD_ENABLED=false` 开关，禁止散落 if(支持自建)

### 工程
- `app/` 前端 + `toolchain/` Python 脚本，同仓单向流动（toolchain → `app/src/data/`，图标 → `app/static/icons/`）
- 以后需要联网/数据库时再建 `backend/` 文件夹
- App 不手写食物数据，产出带 fingerprint（版本+时间+来源清单+条数）

---

## 强制启动协议 (Model Bootstrapping Protocol)

**场景：新会话、切换模型、或新工具接手项目时，必须严格按以下顺序执行上下文初始化：**

1. **第一步（必做）：读取 `docs/progress.md`**
   - 定位：最高动态事实来源
   - 动作：阅读末尾的【接手检查清单】和【最新进度】，确认当前精确进行到哪一步
2. **第二步：校准 `AGENTS.md`（架构与实现规范）**
   - 定位：项目技术宪法
   - 动作：确认技术栈、核心约束、目录结构与当前状态一致
3. **第三步：按需查阅辅助文档**
   - `docs/PRD.md`（产品需求）：作为原始业务愿景参考
   - `docs/Review.md`（评审复盘）：作为决策依据参考
   - `design/VisualLanguage.md`（视觉语言）：做设计相关任务时读取
   - `app/prototype/CalTrack_Protoype.html`（交互原型）：做 UI/交互相关任务时读取

**⚠️ 绝对防冲突原则**：如果其他文档中的旧描述与 `progress.md` 或本文件中的最新记录发生冲突，**一律以 `progress.md` 为唯一准绳**。严禁脑补退回旧逻辑。

---

## Code Comment Governance

代码注释只能描述当前有效知识：

**允许**：
- 当前实现原因
- 技术限制
- 平台兼容问题
- 性能原因
- 业务规则

**禁止**：
- 日期修改记录
- AI模型名称
- 作者签名
- 修改过程
- 历史方案演进
- 临时方案记录
- 版本更新日志

**信息归属**：
- **Git**：负责记录修改历史
- **docs/decisions**：负责记录架构决策
- **docs/history**：负责保存历史过程
- **源码**：只保留当前有效解释

---

## 沟通即文档 (Anti-Lag & Zero-Context-Loss)

**场景：与 Boss 的日常沟通中会产生新的临时决策（UI 间距调整、组件废弃、字段改名等）。**

- **禁止依赖会话记忆**：严禁将 Boss 口头确认的新需求或变更仅保留在当前会话上下文（Context Window）中。
- **强制落地规则**：一旦修改落地并被 Boss 确认，必须**立即、主动**将变更同步到：
  - `docs/progress.md`（作为进度或备忘）
  - 本文件 `AGENTS.md`（如果涉及架构/公共组件/核心约束变动）
- **结构性变更**：凡涉及目录的**新增、删除、移动**，必须同步更新本文件「目录结构」块。
- **语义级改写**（某目录/组件职责定义变更）：需先向 Boss 简报确认后落笔；结构性记账可自主完成。

---

## 收尾与状态冻结协议 (End-of-Session Protocol)

**场景：开发周期暂停，或 Boss 下达"结束项目"、"今天先到这"、"总结一下"等指令时：**

1. **总结与状态固化**：
   - 提取最近修改的核心成果、踩过的坑点、未修复的 Bug、下一步待办
   - 写入 `docs/progress.md` 末尾（如：【X 阶段交接清单】）
2. **强制时间戳签名**：
   - 写入记录时**必须带精确到秒的时间戳**（`YYYY-MM-DD HH:MM:SS`），确立绝对时间线
3. **文档反向同步**：
   - 评估本次开发是否改变了核心约束或架构。如果有，反向刷新 `AGENTS.md` 和 `docs/PRD.md`
4. **Git 分支隔离**：
   - **日常备份**：提交代码到 `dev` 分支（不触发线上自动部署）
   - **线上发布**：仅当 Boss 明确要求"部署/发布/上线"时，才将 `dev` 合并入 `main`
   - **绝对禁止**：日常开发中直接向 `main` Push

---

## 大版本更迭协议 (Cross-Version Major Update Protocol)

**场景：识别到 Boss 的指令带有开启大版本更迭的意图（如 v1.0 → v1.1）时，禁止立即清空原文档，必须严格执行"三段式跃迁法则"：**

1. **第一阶段：需求冻结碰撞期**
   - 基于现有文档与 Boss 多轮碰撞新需求
   - **强制确认项**：数据库策略是增量迁移还是推倒重建？（v1.0 本地存储，v1.1+ 如有云端需确认）
   - 进入此阶段即代表代码冻结期，严禁穿插处理旧版本 Hotfix
   - 新决策仅允许记录在临时计划文件中推演，禁止修改 `AGENTS.md` / `docs/progress.md`
2. **第二阶段：宪法重审**
   - Boss 敲定新版实施计划后，重新审视本文件，判断新架构是否导致旧规则失效
   - 必要时先行修正本文件中的过时条款
3. **第三阶段：死生快照与换血**
   - **动作一**：`git tag -a v<老版本号>-final -m "End of version"` 保存死生存档点
   - **动作二**：将 `docs/progress.md` 及核心文档重命名加旧版本号后缀，移入 `docs/history/`
   - **动作三**：在原位置根据新计划全面覆写出纯净的新版本文档

---

## 编码与自测纪律 (Action & Testing Boundaries)

**场景：执行具体的代码落地、重构或 Bug 修复时：**

1. **大文件局部手术原则**：对于超过 300 行的核心代码文件，**严禁使用全量无脑覆写 (Full Rewrite)**。必须精准定位目标函数或代码块，进行局部的 SEARCH/REPLACE 修改，以防丢失未相关的历史逻辑。
2. **强制自测红线**：任何业务代码落地后，必须在终端里**至少完整跑通一次**相关的构建流程（如 `pnpm build` / `npm run build`）。
   - **严禁**：在未执行终端命令验证的情况下，主观凭借代码字面推测宣称"开发完成"或"Bug 已修复"。所有交付必须建立在终端绿灯通过的物理证据之上。

---

## App 端调试链路（AI 自主看效果与日志）

> **前置（Boss 一次性完成，勿动）**：HBuilderX 保持「运行 → 运行到小程序模拟器 → 微信开发者工具」长驻；
> 微信开发者工具已登录、服务端口开启；本地设置里**关闭「过滤无依赖文件」**（否则误杀 uni-app x 动态加载的页面模块）。
> ⚠️ uni-app x **不支持** `npm run dev:mp-weixin`（编译器在 HBuilderX 内部，无独立 npm 入口），勿再尝试。

**首选工作流（2026-09-19 定案，零窗口打扰）**：改代码 → HBuilderX watch 自动编译 → 微信工具自动热重载（3~8s）→ **官方 automator 协议**看效果/取数据：

```powershell
node debug\shot.js [输出路径]   # 截图 + 当前页面路径；窗口最小化/任意状态均可，完全不碰窗口
```

- `debug/shot.js` 基于官方 `miniprogram-automator`（连 `ws://127.0.0.1:9420`，npm 依赖在 `debug/`）
- **实测**：窗口最小化状态下，截图与 `currentPage` 均成功
- **能力不止截图**：`page.data()` 取页面数据、`element.tap()` 模拟点击、`page.$()` 查元素、`evaluate` 执行 JS、`callWxMethod` 调 API —— **视觉与数据层都能后台拿，不依赖窗口状态**
- wechatide 命令（下方）降级为辅助：仅 `-Reload` 场景（关窗重开）和 `get_simulator_console`（grep 日志）仍在用

```powershell
$wx   = "D:\soft\微信web开发者工具\wechatide.cmd"
$proj = "D:\project\other-porject\kaluli\app\unpackage\dist\dev\mp-weixin"  # 盘符大小写必须与微信工具记录一致（用 D:\）
$tok  = "<微信工具 设置→安全 里的 MCP Token>"

# 截图（返回 JPEG 路径，随后 read_file 读图）
& $wx -c codebuddy simulator_screenshot --project $proj --wait 3 --token $tok

# 控制台日志（grep 语法；空结果≠console为空）
& $wx -c codebuddy get_simulator_console --project $proj --command "grep -i error" --token $tok

# 强制重载（热重载失灵/出现瞬态错误时）
& $wx -c codebuddy close_project_window --project $proj --token $tok
& $wx -c codebuddy open_project_window  --project $proj --token $tok
```

**工具清单**（`wechatide -c codebuddy <tool> --help` 查参数）：ide 状态/开窗/关窗；project 导入/列表；simulator_screenshot / simulator_open_page / simulator_refresh；get_simulator_console；automation_*（element_action / evaluate / navigate / page_action / wx_api —— 模拟点击与执行 JS）。

**uni-app x 产物里操作组件内部节点（2026-09-21 FoodPicker 验收定案）**：
- automator `page.$$('.row')` / 组件标签名 / `组件名 >>> 类` **全部 0 命中**（页面自身 wxml 节点如 `.fab` 正常）；
  唯一有效锚定＝**`.page >>> .xxx`**，且 `$$` 只回**首个**匹配 → 组件内单元素可查，多行列表不可逐个点。
- 列表行点选＝`wechatide automation_element_action --action tap --x <cssPx> --y <cssPx>`（坐标触控，真实命中弹层内行）；
- **组件内节点 automator `el.tap()` 会静默落空**（2026-09-21 GoalModal 验收定案）：`.page >>> .xxx` 探针 found，但 offset 回吐页根矩形 → 点击打偏且不报错。**首选正解＝处理器直调**：查产物 wxml 该节点的 `bindtap="{{键}}"`，`mp.evaluate` 取子组件 `$scope.data[键]`（＝处理器名字符串），`sc[名字](event)` 直调，与输入框 v-model 同一模式（`debug/batch_check2.js`）；
- 输入框：automator `el.trigger('input',{value})` 不生效；数据侧核验＝`mp.evaluate` 走
  `getCurrentPages()[0].$vm.$children[N].$scope`（`data` 为混淆键，`data[<handlerName>]({detail:{value}})` 可直调 v-model 处理器，异步生效）；
- 验证脚本存 `debug/picker_check.js` / `picker_check_b.js` / `batch_check2.js`。
- **新增组件后 `restartMiniProgram` 单独不够**（同日 GoalModal 定案）：运行时 `$vm.$children` 仍是旧列表（新组件未挂载、页面级 tap 全无反应且零报错），必须**先**清编译缓存（命令见下方降级链 ①，2026-09-22 已更正为 wechatide `debug_clear_cache`）**再** `wx.restartMiniProgram`；挂载核验＝evaluate 枚举 children 的 `$.type.name`。

- 微信工具旧 JS 包/遮挡假象/幻影副本等调试坑位及排查规约，见 `docs/decisions/ADR-003-debug-chain-pitfalls.md`。
  ① **严禁写 `min-height: 100%`**：官方仅支持 `number` 或 `pixel`，写百分比会直接触发 `[plugin:uni:app-uvue-css] ERROR` 致命编译中断。让页面铺满视口必须使用 `flex: 1` 配合父容器伸缩；
  ② **严禁 `linear-gradient` 携带角度（如 `180deg` / `90deg`）**：原生端会发出 `WARNING: Invalid linear-gradient value`，必须写纯色标（如 `linear-gradient(#E2F5EC, #F6FCF9)`）；
  ③ **App 原生端严禁后代选择器**：样式必须保持 class-only 单类定义，杜绝 `.a .b` 嵌套选择器；
  ④ **`:style` 严禁拼接跨单位计算**：`calc(116rpx + px)` 在原生端会导致编译白屏报错，必须在 UTS/TS 层计算为确切数值后再传入 `:style`。
- **UTS / <script setup> 变量唯一声明与原子初始化规范（2026-09-23 定案）**：
  ① 在页面顶层，`sbH` 等通用变量**严禁在不同位置重复 `let/const` 声明**（导致 `Identifier has already been declared`）；
  ② **严禁顶层拆分赋值**：严禁写成 `const sbH = ref(0); sbH.value = ...` 这种在 `<script setup>` 顶层的裸副作用赋值，UTS 编译器在 AST 转换时会报 `Unexpected token (xx:1)`。**必须统一采用原子内联强类型初始化**：
     `const sbH = ref<number>(uni.getSystemInfoSync().statusBarHeight ?? 0)`。

---

## 防幻觉约束 (Anti-Hallucination Constraints)

**原则：AI 在本项目中所有输出必须可追溯到「设计稿 / 原型 / 已有文档 / Boss 原话」四者之一，四者之外的一律不许编。**

### 1. 数据幻觉（最高频）
- **不编食物数据**：`app/src/data/food_library.json` 是生成物，**严禁 AI 直接编辑或手写**。任何食物数据必须来自 `toolchain/` 脚本产出，产出带 fingerprint（版本+时间+来源清单+条数）。
- **不编热量值**：热量数字只能来自已确认的食物库条目或 Boss 明确给出的数值。不确定就说「待确认」，不许四舍五入一个看起来合理的数。
- **不编品牌/品类**：v1.0 只有「奶茶」一个品类（Boss 已拍板）。不许 AI 自行追加咖啡/果汁/快餐等品类——哪怕「感觉用户会需要」。

### 2. 设计幻觉
- **以 Pencil 设计稿 + 原型为唯一视觉准绳**：`app/prototype/CalTrack_Protoype.html`（Ardot 及其链接已于 2026-09-21 废止，不再作为参考）。
- **不在设计稿上的元素不许加**：设计稿里没有的 tab、按钮、卡片、动效，AI 不许「顺手补上」。觉得应该加 → 先问 Boss。
- **不编色值**：色板已在 `AGENTS.md` 核心约束里固化，不许 AI 自行调一个「看起来差不多」的颜色。

### 3. 能力幻觉
- **未验证的功能不宣称支持**：`backdrop-filter` 在真机验证前，不许写「支持毛玻璃」——只能写「降级方案：半透明白 + 分层阴影」。
- **不编 API**：v1.0 无后端、无联网。不许写 `fetch(...)` / `axios(...)` / 任何网络请求代码，除非 Boss 明确要求。
- **不编 uni-app 能力**：不确定某个 `uni.*` API 在 uni-app x 上是否支持 → 写 TODO 注释，不许猜一个替代方案就当已验证。

### 4. 文档幻觉
- **不引用不存在的文件**：引用前先确认文件存在。不确定就 `Read` 一下，不许凭印象写路径。
- **不引用别的项目当依据**：TiKu 的 agent.md 是参考，不是本项目的规则来源。吸收了什么、为什么吸收，必须在 `progress.md` 变更日志里写清楚。
- **不编版本号**：已在「文件变更日志规范」红线中禁止，此处重申。

---

## Hooks 兜底强约束 (Hooks Safety Net)

**原则：关键约束不能只靠 AI 自觉，必须有自动化钩子在提交/构建/收口时强制校验。**

**落地状态（2026-09-22）**：闸门本体＝`toolchain/hooks.py`（此前只有本节的承诺、零代码）。

```powershell
python toolchain\hooks.py list          # 看有哪些闸
python toolchain\hooks.py all           # 全跑一遍（约 0.3s，红灯＝退出码 1）
python toolchain\hooks.py install       # 把 all 写进 .git/hooks/pre-commit（本机生效）
```

⚠️ `.git/hooks` **不随仓库分发**：新克隆的机器必须自己跑一次 `install`，否则保安亭不上岗。

### 钩子清单（按触发时机；名称＝`hooks.py` 的子命令）

| 阶段 | 钩子 | 检查内容 | 失败动作 |
|---|---|---|---|
| **写代码时** | `schema-version-check` | `app/src/data/food_library.json` 的 schemaVersion 是否与 `toolchain/schema/` 一致（文件名 v1.0 ↔ 数据 v1.0.x）＋ 必填顶层键 ＋ 无未声明键 ＋ fingerprint 四字段齐全 | 不一致 → 终端红灯报错，禁止继续 |
| **写代码时** | `food-data-integrity` | ①条数三处对齐（`icons_v1.yaml` ↔ `fingerprint.count` ↔ `foods` 数组）；②`dist` 与 `app/src/data` 两份副本 sha256 一致；③视图层（pages/components/composables）出现 `pNNN` 字面量或内联 name+img 条目＝手写食物数据；④App 图标张数 ↔ 食物条数（不等只警告） | 命中 → 红灯 + 指向 `toolchain/`。**stores/ 豁免 id 检查**（演示种子计划按 Boss 授权引用 id，热量仍实时算） |
| **写代码时** | `class-prefix-collision` | 组件定义的类名若同时被别的文件定义或使用 → 命中（mp-weixin 样式同池互污，见「已知风险」） | 拒绝提交 → 要求加组件前缀 |
| **提交前** | `pre-commit` | 暂存的代码/配置（.uvue/.uts/.ts/.py/.ps1/.js/.json）前 4000 字符内必须有 `[变更日志]`；生成物（`app/src/data/food_library.json`、`app/static/icons/`）被单独改动而 `toolchain/` 无源变更 → 命中 | 缺日志 → 拒绝提交；保护文件被手改 → 拒绝提交 |
| **收口时** | `end-of-session` | 改了 `app/` 下的文件但 `docs/progress.md` 未同批更新 | **只警告不拦**（AGENTS 规定此闸的动作就是「提示补全」） |
| **构建前** | ~~`pre-build`~~ | **未落地**：uni-app x 无独立 npm 构建入口（编译器在 HBuilderX 内部），挂不了 TS 编译门禁 | 由纪律替代＝改完必须在终端跑通编译（见「强制自测红线」）＋ automator 截图验收 |

### 关键保护文件（AI 不得直接修改，只能由脚本生成）

| 文件 | 生成方式 | 保护理由 |
|---|---|---|
| `app/src/data/food_library.json` | `toolchain/build.py` 产出 | 手写会破坏 fingerprint 机制，且数据无来源追溯 |
| `toolchain/dist/food_library.json` | 同上（中间产物，已进 .gitignore） | 同上 |
| `app/static/icons/**.webp` | `gen_icons.py → compress_icons.py → build.py` 同步 | 图标必须由生图线产出，禁止手 P／禁止从别处拷 |
| `AGENTS.md` 中的色板/约束表 | Boss 拍板后 AI 落笔 | 非 Boss 确认的视觉改动不算数 |

> `app/data/food_library.json` 这一份**已随目录删除**（2026-09-20 推倒重写时清掉），旧文档里指向它的引用一律以 `app/src/data/` 为准。

---

## Vue 文件 ↔ MD 文档对应规范 (Vue-MD Pairing Rule)

**原则：每个 `.vue` 文件必须有且仅有一个对应的 `.md` 文件解释它。代码告诉你「怎么写」，MD 告诉你「为什么这么写」。**

### 对应关系

```
app/src/
├── pages/
│   ├── Home.vue          ←  pages/Home.md          # 用户流程 + 数据依赖 + 边界状态
│   ├── AddFood.vue       ←  pages/AddFood.md
│   └── ...
├── components/
│   ├── Bottle.vue        ←  components/Bottle.md   # props/events/slots + 降级策略
│   ├── FoodPicker.vue    ←  components/FoodPicker.md
│   └── ...
├── stores/
│   ├── food.ts           ←  stores/food.md         # state 结构 + actions 副作用 + 扩展点
│   └── ...
└── composables/
    ├── useLiquid.ts      ←  composables/useLiquid.md     # 设计决策 + 参数来源 + 帧率实测
    └── ...
```

### 每个 MD 必须含的 5 个段

1. **用途**（一句话：这个文件干什么）
2. **依赖**（它依赖哪些 store / composable / 数据文件；被谁依赖）
3. **设计决策**（关键选择 + 为什么选这个，不选另一个）
4. **边界与降级**（空数据、超长文本、低端机、网络失败等场景怎么处理）
5. **与设计稿的对应**（对应 Pencil 哪个节点 ID；原型哪个交互；不一致的地方在哪）

### 例外（不需要 MD 的文件）

- 纯样式文件（`*.css` / `*.scss`）
- 纯配置文件（`vite.config.ts` / `tsconfig.json` / `package.json`）
- `main.ts` / `App.vue`（入口文件，只在 `AGENTS.md` 目录结构里说明即可）
- 第三方库的类型声明（`*.d.ts`）

---

## 已知风险

- **uni-app x 小程序端页面滚动陷阱**（2026-09-21 实测定案）：运行时全局注入 `uvue.wxss` 强制 `page{height:100%;display:flex}` + `view{overflow:hidden;flex-shrink:0}`，**页面根 view 严禁写 `flex: 1`**——会把根节点钉死为视口高度、超出被裁，原生页面滚动永不触发（普通 uni-app 的「超出即滚」在 uni-app x 不成立）。正确做法：根 view 自然高度撑开走**原生页面滚动**；**不要用 scroll-view 包一层**（Boss 已否决：多一层滚动容器且非必要）
- **弹层 sheet 子项压扁 + 溢出裁切**（2026-09-21 AddFood 实拍定案）：mp-weixin 端弹层内容超可视高时子项被压扁（餐次卡 96→40、确认钮 52→43），且全局 `view{overflow:hidden}` 把**溢出型装饰**（光晕、外置印章、抬升阴影）裁成硬边矩形色块。对策：弹层各内容块显式 `flex-shrink:0`；凡依赖子元素溢出父盒的装饰，父链（`.opt/.float/.art-wrap/.meal-card` 等）显式 `overflow:visible`；方形软影贴图（shadow512.png）放扁盒必须 `scaleToFill`（`aspectFit` 会缩成圆点）
- **mp-weixin 组件类名跨文件冲突**（2026-09-21 AddFood 餐次卡二次修复定案）：同名类（Home 的 `.meal-row{height:40px}` vs AddFood 的 96 高餐次行；FoodPicker `.sheet{height:560px}` vs AddFood/GoalModal；三弹窗 `.mask/.handle/.chip` 各异）在小程序端互相污染——**组件样式表按文件加载但同名选择器全局命中**，后加载者胜。**铁律：组件内所有类名必须带组件前缀**（af-/fp-/gm-/ft-/cs-/ot- 等），页面类名同样不得与组件重名。新增组件时先查重＝`python toolchain/hooks.py class-prefix-collision`（机械比对各 .uvue 的类名集合，跨文件命中即红灯，已挂进 pre-commit）；产物侧仍可用 `grep -h '^\.[a-z]' unpackage/dist/dev/mp-weixin/**/*.wxss | sort | uniq -d` 复核
- **absolute 元素 top+bottom 拉伸在小程序端不可靠**（2026-09-21 甜度胶囊实测）：`position:absolute; top:6; bottom:6` 的白胶囊渲染高度与父盒对不上、溢出底槽；改为**显式 height + top**（父容器内容高度也固定），视觉用像素扫描核验（automator/wechatide 的 size()/offset() 对组件内节点一律返回页面根矩形，不可用于量高）
- **「包裹/内嵌」类稿面关系严禁用负 margin 叠压模拟**（2026-09-21 个人中心达标 Banner 三次返工定案）：设计稿说 B 在 A 卡片内（A 底缘在 B 下方继续延伸）＝B 必须是 A 容器的**子节点**；负 margin 只能模拟叠压，被叠件高于叠压深度时下半截必然悬出容器外，改多少 px 留白都修不好。排查此类缺陷第一步看模板嵌套，而非样式数值
- **uvue 写 border 三件套必须齐全**（2026-09-21 AddFood 印章定案）：`border-width`＋`border-color` 缺 `border-style: solid` 时，mp-weixin 端走标准 CSS（默认 none）**边框整体不渲染**；uvue 原生端的默认 solid 不会迁移到小程序产物。凡写 border 必补 style，且以截图核验（控制台零报错）
- **`components/` 下放纯逻辑 `.uts` → 运行时「module is not defined」整页白屏**（2026-09-22 Tabbar 定案）：为跨页传递气泡飞行起点新建 `components/tabOrigin.uts`，产物 `components/tabOrigin.js` **正常生成**、`Tabbar.js` 里 `require("./tabOrigin.js")` 路径**也对**，运行时却报 `module 'components/tabOrigin.js' is not defined` → Tabbar 渲染中断、**三个 Tab 页全白屏且首屏零可见错误**；`debug_clear_cache --action cleanCompileCache` ＋ `simulator_refresh` 跑过仍无效（包体哈希未变，**根因未定案**）。**约定：跨页共享的纯逻辑不放 `components/`**（改本地存储一次性传递，如 `ct_tab_origin` 读完即 `removeStorageSync`）。顺带纠正一条旧误判：`page.$vm.$children` 回 0 **不是** uni-app x 常态，而是白屏态下组件根本没挂载
- **悬浮元素的坐标 tap 必须先算真实命中带**（2026-09-22 Tabbar 定案）：`automation_element_action --x --y` 对悬浮胶囊按**猜测**坐标（`y=738`）点击会落在栏**之上**的页面内容 → 回 `success` 却不换页，极易被误读成「点击处理器没接上」。**正解＝按组件自己的常量在运行时重算矩形**（脚本 `debug/tab_geom.js`：读 `windowInfo` 后套同公式输出胶囊带 `top/bottom` 与三槽中心），截图像素剖面在此不可用（截图约 1:1 css 缩放、白卡片垫在胶囊之后分不清）。**同一坑的另一半＝入场时序**：气泡起点原在 `onMounted` 读 → 首帧先画在目标槽、下一帧才跳回来源槽（肉眼＝「闪一下再飞」），必须在 `setup` 内同步定起点与 `phase`
- **给组件传「跨页状态」时 redirectTo 会重挂载组件，模块级状态不可靠**：Tabbar 每次换页都是全新实例，任何「上一个 Tab 是什么」的信息必须走持久化载体（本地存储一次性消费），不能指望内存里的单例活着
- **App 端动画禁用 setData 逐帧驱动**（Boss 2026-09-22 拍板 #5）：`transition`/`@keyframes` 在 uni-app x 原生渲染不生效，故本工程所有过渡样式包在 `#ifdef MP-WEIXIN` 内，小程序端由 **CSS transition 自主跑帧**（JS 只切阶段类／四个时长）；App 端正解＝Worklet（**尚未实现，仅 TODO**）。副作用已知：JS 线程被页面挂载占住时阶段推进会滞后（实测 press→travel 迟约 260ms，稿面 16ms）——这属「动画靠 transition 不靠 setData」的既定取舍，勿改回逐帧写 style
- **含状态栏 padding 的渐变 Header，height 必须算进 :style**（2026-09-21 Records 页实拍定案）：`height` 是 border-box，CSS 写死 `height:108px` ＋ `:style{paddingTop:sbH}` 会把内容区压成 `108−sbH`，标题被裁/卡位全乱。正解＝`:style="{ paddingTop: sbH+'px', height: (108+sbH)+'px' }"`
- **分隔线严禁 flex:1**（2026-09-21 DayDetail 营养分布实拍定案）：1px 分隔列写 `flex:1 + width:1px` 时 flex-basis 生效被拉成宽灰块；分隔线只写固定 width/height，父行用 `justify-content: space-between` 分布列
- **automator 坐标 tap 命不中微信原生弹层**（ActionSheet/Modal 在原生层渲染，2026-09-21 DayDetail 删除验收定案）：长按后整页压暗可证弹层已开，但 `automation_element_action --x --y` 的点击穿透到页面底下；选项点击只能人工/真机复核，勿据此判「删除无效」
- `backdrop-filter` 在 uni-app x 原生渲染大概率不支持 → 搭骨架后第一时间真机验证
- **CSS 自定义属性（`var()`）在 uni-app x 原生端是否支持未经真机验证** → 现状＝**根本没有 tokens.css**（`app/src/styles/` 目录不存在，推倒重写时删除），色值按 `design/DesignTokens.md` 逐页内联进各 .uvue。将来若要建变量层，必须先真机验证 `var()` 支持度，勿先建文件
- 液体 rAF 动画低端机可能要去掉波纹，只留水位 transition（已由 useDeviceStore.liquidWave 自动处理）
- 音效在静音模式下不应触发 → 加系统静音检测 `uni.getSystemInfoSync().audioStatus`
- **uvue 模板 v-for 循环变量禁用单字母 `r`**（2026-09-19 Settings 页实测）：症状为该 v-for 块插值全空、行数错乱、同页其他 v-for 卡片消失，**控制台零报错**；静态对照实验定位后，改名 `item` 即愈。其余单字母 d/m/s/i/h/b 实测正常，`r` 高度疑似与 WXML 编译产物内部变量冲突 —— **v-for 变量一律语义化命名（item/row/drop）**

- **uni-app x UTS 蒸汽模式严禁自闭合标签（2026-09-23 编译排错铁律）**：`<input />`、`<Component />` 等自闭合标签在 UTS 编译器中会导致语法树解析中断，抛出 `[plugin:uts] Element is missing end tag. at ...:1:0` 假象报错。所有标签必须严格写作 `<input></input>`、`<Component></Component>`。
- **组件模板根层级闭合标签缺失级联报错**（2026-09-23 GoalModal 实测）：当子组件深层嵌套（如 `.overlay > .container > .sheet`）遗漏闭合 `</view>` 标签时，编译器无法匹配父级元素，往往不在子组件报错，而是直接导致引用它的父页面（如 `Settings.uvue:1:0`）报语法错误。排查排错第一步使用 AST/正则全量检查成对闭合。
- **方案A单流程食物添加架构（2026-09-23 定案）**：微信原生 `page-container` 连续销毁重建有约 1500ms 冷启动白屏且状态机容易死锁。因此将「列表选择」与「分量添加」统一合并于 `FoodPicker.uvue` 内部（`step: 'list' | 'detail'`），单弹层原地无缝切换，点击「更换」秒回列表并回显当前项，宿主侧零冗余状态机。
- **SettleBadge 结算徽章 2D Canvas 环形渲染（2026-09-23 定案）**：真机环境下 CSS `conic-gradient` 极易出现掉帧、卡顿与渲染异常。重构为标准 Canvas 2D 动效引擎驱动，确保双端 60fps 丝滑满帧扫环；同时结算弹窗关闭后去除倒水音效，保持交互干净明快。
- **水瓶卡片物理比例与微风动效（2026-09-23 定案）**：水瓶尺寸（104x168）、背景卡片（176x176）与两侧托底叶片（64x64/62x62）回归黄金构图，腔体水位严格保持 80% 上限；单次点击播放轻脆 feedback，长按播放晃动音效，手势音效彻底解耦。

## 当前待办

- [x] **已定（实践中定型，2026-09-22 文档校准确认）：工程化路线＝HBuilderX 图形模式** —— 配置文件（`manifest.json`/`pages.json`）放 `app/` **项目根**，`pages.json` 的 path **不带** `src/` 前缀（实测五条页面路径均为 `pages/...`）；`app/src/` 只放 build.py 产出的 `data/`。CLI 路线（`package.json`+`vite.config.ts`）不采用：uni-app x 编译器在 HBuilderX 内部，`npm run dev:mp-weixin` 不存在
- [x] **已定（2026-09-21 起案，2026-09-22 Boss 拍板 #4 定稿）：Tabbar 方案** —— 共享 `Tabbar.uvue`
  组件（`redirectTo` 切换），不用原生 tabBar；不存在 midbutton 需求（加号在首页右上 FAB，小程序端避胶囊）。
  **终态＝三 Tab**：「首页／日历／我的」，其中「日历」＝ `pages/records/Records.uvue`（Boss 拍板 #4 由二级页升为一级 Tab，删左上返回钮，Tab 文案用「日历」、页内标题保留稿面「最近记录」）。
  三 Tab 的选中态与玻璃材质见「核心约束／玻璃面」条（色值几何以 `DesignTokens.md` §7 为准）
- [x] **已完成（2026-09-23）：方案A单流程食物添加架构** —— `FoodPicker.uvue` 内置两态 `step: 'list' | 'detail'`，选食物原地切入 `AddFood`，消除双 `page-container` 造成的 1500ms 冷启动卡顿与互斥；宿主侧零冗余状态机；弹窗高度限制为标准半屏抽屉规格。
- [x] **已完成（2026-09-23）：SettleBadge 升级 Canvas 2D 动效** —— 废弃 conic-gradient，重构为真双端统一的 Canvas 2D 动效渲染，移除弹层结束倒水音效。
- [x] **已完成（2026-09-23）：首页水瓶与叶片物理动效与比例重构** —— 水瓶卡片回归黄金比例（瓶身 104x168，卡片 176x176，叶子 64x64/62x62）；单击播放轻脆 feedback，长按播放晃动音效；枝叶微风摆动与双层波浪往复动效；`stores/settings.ts` 集中管理全 App 音效。
- [x] **已完成（2026-09-23）：全工程 UTS 语法合规与抗坑加固** —— 清理所有组件中的自闭合标签（`<input></input>`, `<AddFood></AddFood>`）；修复 `GoalModal.uvue` 缺失的根视图闭合标签；修复 `PrivacyDialog.uvue` 废弃属性与不兼容伪类。
- [x] **已完成（2026-09-22，Boss 五条拍板）：TabBar 液态玻璃重构** —— 两 Tab 通栏 → **三 Tab 悬浮胶囊＋会跑的选中气泡**（四关键帧，MP 端 CSS transition）；Records 升一级 Tab（删返回钮、入口改 `redirectTo`）；#29 的 fade 渐显**整条废弃**；页底预留 40 → **78**；6 色值＋几何入 `DesignTokens.md` §7。小程序端验收（三格换页／暗态／四关键帧逐值吻合，证据见 `docs/progress.md` 同日前端进度与 `debug/shots/tab8~13*.png`）
- [x] **已完成（2026-09-22，Boss 定稿）：浅色态「气泡隐身」修正** —— 胶囊底 88%→**60%**、气泡加白 60% 1px 描边（折射亮边）＋ 投影 `0 4 12 rgba(0,0,0,.06)`（悬浮高度差）；暗态与 low 降级档未动。验收＝三页浅底截图 ＋ 暗态回归 `debug/shots/f_prof_dark.png`
- [ ] **暗态染色图标未产出**（深色模式下仍用浅底那套矢量图标，需专门出暗态版本）
- [ ] **App／Web 端真机回归**：气泡动画的 **Worklet 实现**（现仅 MP 端 CSS transition，App 端阶段跳变＋TODO）、`backdrop-filter` 原生端支持度（未验，代码用 `#ifdef MP-WEIXIN` 包住）
- [ ] **p348–p353 六条后补食物的图标是 92×92**（其余 353−6＝347 张为 512×512），且 `assets/icons-gen/` 里没有它们的原始 PNG。要提清晰度须跑 `gen_icons.py`（花生图额度）→ **等 Boss 拍板**
- [ ] `toolchain/gen_tab_icons.py` 现无任何文档/脚本引用（疑似一次性工具）→ 去留待 Boss
- [ ] **食物缩略图「画框托底」只做了暗黑态**（`docs/design/2026-09-22-food-thumb-plate/README.md`）：浅色态该节原文标「**需老板拍板**」，至今未拍 ⇒ 浅色**保持现状不加托底**，AI 不得自行显影 `.row-thumb` 里那句 `#EAF9F3`
- [ ] `toolchain/debug_shot.ps1` 与 `debug/records_check.js` 内含**明文微信工具 MCP Token**（且已进 git 历史）→ 是否改环境变量待 Boss
- [ ] 营养数据人工核对 **0/30**（`toolchain/sources/nutrition_checklist.md`），当前数值＝AI 初稿＋脚本配平，未经权威来源确认
- [ ] 新克隆的机器须跑一次 `python toolchain/hooks.py install`（`.git/hooks` 不随仓库分发）
- [ ] 合规 critic loop 复评

> 完整待办清单（含历史决策、接手检查清单）见 `docs/progress.md`。