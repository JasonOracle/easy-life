# AGENTS.md — CalTrack 项目开发指引

> 本文件供 AI Agent 在当前项目中工作时读取，是项目静态宪法。
> **新会话启动顺序：先读 `docs/progress.md`（动态状态），再读本文件（静态规则）。**
> 两者冲突时，以 `progress.md` 为准。

## 项目概述

**CalTrack** — 轻量级卡路里追踪 App，帮助用户快速记录每日饮食，直观展示摄入数据。

- 版本：v1.0 MVP
- 状态：设计完成，开发未开始
- 目标平台：uni-app x（Vue3 + TS + Pinia），本地存储，无服务器

## 目录结构

```
kaluli/
├── README.md                  # 项目总览
├── AGENTS.md                  # 本文件
├── docs/                      # 产品文档
│   ├── progress.md            # 动态进度追踪（最高动态事实来源，新会话先读）
│   ├── PRD.md                 # 产品需求文档
│   ├── Review.md              # 评审复盘（决策依据）
│   └── FoodLibraryPlan.md     # 食物库方案
├── design/                    # 设计文档
│   ├── VisualLanguage.md      # 视觉语言 v3.0（薄荷液滴）
│   ├── IconPlan.md            # 图标方案
│   ├── UI_Spec.md             # Figma/Pixso 交付规格
│   └── Critique_Lenny.md      # 设计审视（独特性诊断）
├── app/                       # 前端（uni-app x 项目根）⚠️ 2026-09-20 起推倒重写，当前为最小手脚架
│   ├── manifest.json          # 应用配置（含 uni-app-x 节点=项目类型标识；appid 已分配 __UNI__F70225F）
│   ├── pages.json             # 页面路由（当前仅 1 页占位；全部 navigationStyle:custom）
│   ├── App.uvue               # 应用根组件（手脚架阶段无启动初始化）
│   ├── main.uts               # 启动入口（仅 createSSRApp；Pinia 等业务挂载待重建）
│   ├── pages/home/            # 唯一路由页（手脚架占位，配 Home.md）
│   ├── prototype/             # 交互原型
│   │   └── CalTrack_Protoype.html
│   └── （待重建）components/ stores/ composables/ styles/ data/ static/  # 按设计稿逐步重建；
│                              #   data/ 与 static/icons/ 仍为生成物（toolchain/build.py 产出），严禁手写
├── debug/                     # App 调试工具（node）：miniprogram-automator 后台截图/取数据（shot.js）
│                              #   ⚠️ node_modules 不进 git
├── toolchain/                 # 数据与素材处理（Python，不进 App 包）
│   ├── sources/               # 数据源（人可读 YAML）
│   │   ├── icons_v1.yaml          # 347 项食物清单（图标线 + 数据线的共同事实来源）
│   │   ├── icons_v1_visual.yaml   # 生图槽位（container/content/toppings/state/view）
│   │   ├── icons_v1_usage.yaml    # 份量与选项引用（vessel_tpl / opts_tpl）
│   │   ├── nutrition_v1.yaml      # 营养数据（每 100g/100ml + basis + confidence）
│   │   ├── nutrition_checklist.md # 人工核对清单（30 条按风险排序）
│   │   ├── vessel_tpl.yaml        # 计量器具模板集（18 个，带容量档位）
│   │   ├── opts_tpl.yaml          # 选项模板集（sweet/topping/sugar_pack/syrup_pump）
│   │   └── milk_tea.yaml          # 旧：首版单条数据源（已被上面取代，保留追溯）
│   ├── schema/v1.0.json       # 输出 JSON 格式定义（App 启动校验用）
│   ├── validate.py            # 多源一致性校验（三源 id 对齐 + 引用 + 宏量配平）
│   ├── build.py               # 多源合并 → dist/ + 同步 app/src/data/
│   ├── gen_icons.py           # 批量生图（20 路并发 + Key 池 + 429 退避 + 白底校验）
│   ├── compress_icons.py      # PNG → 512 WebP（目标 ≤25KB）
│   ├── gen_nutrition.py       # 营养数据初稿生成（分层：成分表值 / 配方推算）
│   ├── gen_visual_spec.py     # 生图槽位生成
│   ├── gen_usage_spec.py      # 份量与选项引用生成
│   ├── fetch_icons.py         # 旧：真实图源抓取（当前纯文生图方案不用，保留备用）
│   └── dist/food_library.json # 打包中间产物
├── assets/                    # 素材资源
│   ├── exports/               # 8 屏设计稿 @2x PNG
│   ├── icons-gen/             # 生图原始 PNG（1K，347 张，~800KB/张）
│   └── icons-final/           # 最终 512 WebP（347 张，≤25KB，共 5.6MB）★ App 引用
└── .workbuddy/                # 会话数据（不进 git）
```

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | uni-app x + Vue3 + TS + Pinia |
| 状态管理 | Pinia |
| 本地存储 | uni-app x 原生本地存储 |
| 数据处理 | Python（toolchain/） |
| 设计工具 | Ardot（内置）+ Figma/Pixso（外部） |

## 核心约束

### 视觉
- **薄荷液滴**是唯一视觉方向（v3.0），v2.0 Apple 材质主义已废止
- **色值以 `design/DesignTokens.md` 为唯一事实来源**（2026-09-19 从 Ardot 变量集导出，此前文档中的色值是手抄的、普遍差 1）
  - 主渐变 mint：`#7DEBC7 → #1FBF8F → #0D9C73`，深色 mint-deep `#0A7A5C`
  - 页面底 bg `#F2FAF5`，超标用珊瑚 `#FF9E7D`（不用红），接近上限用琥珀 `#E8B54D`
  - 文字三级：label-1 `#0A4F3D` ／ label-2 `#0F4F3D`@60% ／ label-3 `#0F4F3D`@34%
  - 玻璃底 glass-bg `#FFFFFF`@74%（**带透明度，实现时不能丢 alpha**）
  - 圆角 card 20 ／ chip 18 ／ sheet 34；字号 hero 46 ／ title 17 ／ section 15.5 ／ body 13.5 ／ caption 12
- 小字（≤15px）必须用 `mint-deep #0A7A5C`，因为 `#1FBF8F` 在白底只有 2.3:1 对比度
- 深色模式 v1.0 不做

### 交互
- **每个交互点击都要有反馈**：动画 + 触觉 + 音效，三选一不可省
- **反馈分级**（按操作重要性，不是每个按钮都弹一下）：

| 级别 | 触发场景 | 动画 | 触觉 | 音效 |
|---|---|---|---|---|
| L1 轻 | 切换 tab、切换甜度 | 图标跳动 | `vibrateShort()` | 无 |
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
- `app/` 前端 + `toolchain/` Python 脚本，同仓单向流动（toolchain → app/data/）
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

## 文件变更日志规范 (File Header & Change Log)

任何时候只要**修改已有文件**（包括代码、配置、文档），必须在文件的**最顶部**严格按以下格式添加或更新中文注释日志（不破坏已有日志流，追加在最上方）。

**【绝对红线】**
1. **严禁 AI 擅自在变更日志中发明、猜测或递增任何版本号**（禁止出现 v1.4, v2.0, v1.x 等字眼）。
2. 在没有用户明确指定当前版本号的情况下，日志内容**只允许客观描述动作**，绝不允许带任何版本前缀。
3. 此禁令仅针对代码/配置文件内部。`progress.md` 的版本时间戳不受此限。

✅ 正确格式：
```javascript
/**
 * [变更日志]
 * 修改时间：2026-XX-XX
 * AI模型：CodeBuddy (GLM)
 * 修改内容：[1. 精简重构了某功能; 2. 修复了某边界Bug]
 */
```

❌ 错误格式（严禁）：
```javascript
* 修改内容：[v1.5: 修复了某边界Bug]
```

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

**踩坑**：
- HBuilderX CLI（`cli launch mp-weixin`）的 watch **只编译一次**，不能替代 GUI 运行模式
- 微信工具对 uni-app x 产物**不会自主重载**：无 watch 驱动时 `simulator_refresh` 也无效，必须关窗重开
- **热重载对「新增组件/页面」不可靠**：hotreload 补丁环境解析不了新注册组件，报 `uid null` 并导致渲染部分损坏（如液体消失、新列表不渲染）。**改文案/样式可热重载；新增组件后必须关窗重开**
- `close_project_window` 会**连自动化服务一起杀**：重开后必须执行 `cli.bat auto --project <产物路径> --auto-port 9420 --trust-project` 恢复，否则截图报 `waitForAutomatorReady timeout`
- **零窗口操作（v4 定案）**：截图/取数据**一律走 automator 纯协议**（`node debug/shot.js`），**任何情况都不碰用户窗口**。v2 的"移屏外"方案**已废弃**（Boss 点任务栏时窗口"闪屏消失"，被否决两次）
- **热重载崩（uid null，新增组件后渲染损坏）的修复降级链（v5，源自 Boss 人工开发经验的 CLI 化）**：
  ① **`cli.bat cache --clean compile --project <产物路径>`** —— 清编译缓存触发完整重编译 = 人工操作「清缓存→刷新模拟器」的命令行版。**已实测跑通、零窗口操作**。⚠️ 勿用 `--clean all`（会连登录态一起清，要重新扫码）
  ② `node debug/reload.js` —— automator `reLaunch` 重启页面（协议已实测），可与 ① 配合使用
  ③ `debug_shot.ps1 -Reload` —— 重开窗口保底（闪现约 1 秒自动缩任务栏），前两招无效才用
- **窗口最小化的影响边界**：wechatide 的 `simulator_screenshot` 会超时（Chromium 节流）；**automator 协议不受影响（实测）** —— 所以截图一律走 automator，wechatide 只用于 -Reload 与 grep 日志
- **ps1 中文路径编码坑**：PowerShell 5 按 ANSI 解码无 BOM 文件，含中文路径的 `.ps1` 必须**存为 UTF-8 with BOM**，否则运行时报"路径不存在"。修复：`[IO.File]::WriteAllText($f,$c,(New-Object Text.UTF8Encoding $true))`
- 命令行调用必须显式传 `--token`（MCP Token）
- `--path` 必须 `D:\` 开头（小写 `d:\` 报 project window not found）
- HBuilderX 编译报错看 `cli logcat mp-weixin --project <源码项目> --mode lastBuild`（产物目录路径传给 wechatide、源码路径传给 HBuilderX cli，两者不同勿混）

---

## 防幻觉约束 (Anti-Hallucination Constraints)

**原则：AI 在本项目中所有输出必须可追溯到「设计稿 / 原型 / 已有文档 / Boss 原话」四者之一，四者之外的一律不许编。**

### 1. 数据幻觉（最高频）
- **不编食物数据**：`app/data/food_library.json` 是生成物，**严禁 AI 直接编辑或手写**。任何食物数据必须来自 `toolchain/` 脚本产出，产出带 fingerprint（版本+时间+来源清单+条数）。
- **不编热量值**：热量数字只能来自已确认的食物库条目或 Boss 明确给出的数值。不确定就说「待确认」，不许四舍五入一个看起来合理的数。
- **不编品牌/品类**：v1.0 只有「奶茶」一个品类（Boss 已拍板）。不许 AI 自行追加咖啡/果汁/快餐等品类——哪怕「感觉用户会需要」。

### 2. 设计幻觉
- **以 Ardot 设计稿 + 原型为唯一视觉准绳**：`https://ardot.tencent.com/file/727289305476547` + `app/prototype/CalTrack_Protoype.html`。
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

### 钩子清单（按触发时机）

| 阶段 | 钩子 | 检查内容 | 失败动作 |
|---|---|---|---|
| **写代码时** | `schema-version-check` | `app/data/food_library.json` 的 schemaVersion 是否与 `toolchain/schema/` 一致 | 不一致 → 终端红灯报错，禁止继续 |
| **写代码时** | `no-handwritten-food-data` | 扫描 `app/src/` 下是否有人工编写的 food 数据或热量常量 | 命中 → 红灯 + 指向 `toolchain/` |
| **构建前** | `pre-build` | TypeScript 编译 + `food_library.json` fingerprint 完整性 | 失败 → 构建中断，不产出 bundle |
| **提交前** | `pre-commit` | 变更日志是否已写（改了文件但没写 `[变更日志]`）+ 禁止修改的文件是否被改 | 缺日志 → 拒绝提交；保护文件被改 → 拒绝提交 |
| **收口时** | `end-of-session` | `progress.md` 是否已更新 + 文档是否已反向同步 | 未更新 → 提示补全后再收口 |

### 关键保护文件（AI 不得直接修改，只能由脚本生成）

| 文件 | 生成方式 | 保护理由 |
|---|---|---|
| `app/data/food_library.json` | `toolchain/build.py` 产出 | 手写会破坏 fingerprint 机制，且数据无来源追溯 |
| `app/src/data/food_library.json` | 同上 | 同上 |
| `AGENTS.md` 中的色板/约束表 | Boss 拍板后 AI 落笔 | 非 Boss 确认的视觉改动不算数 |

> **实现方式**：在 `toolchain/` 下放一个 `hooks.py`（或 `package.json` 的 `scripts`），CI/本地提交时自动跑。v1.0 至少落地前 3 个钩子（schema-version-check / no-handwritten-food-data / pre-commit-log）。

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
5. **与设计稿的对应**（对应 Ardot 哪个节点 ID；原型哪个交互；不一致的地方在哪）

### 例外（不需要 MD 的文件）

- 纯样式文件（`*.css` / `*.scss`）
- 纯配置文件（`vite.config.ts` / `tsconfig.json` / `package.json`）
- `main.ts` / `App.vue`（入口文件，只在 `AGENTS.md` 目录结构里说明即可）
- 第三方库的类型声明（`*.d.ts`）

---

## 已知风险

- `backdrop-filter` 在 uni-app x 原生渲染大概率不支持 → 搭骨架后第一时间真机验证
- **CSS 自定义属性（`var()`）在 uni-app x 原生端是否支持未经真机验证** → 若不支持，`app/src/styles/tokens.css` 的字面值改为内联进各 uvue（值不变）
- 液体 rAF 动画低端机可能要去掉波纹，只留水位 transition（已由 useDeviceStore.liquidWave 自动处理）
- 音效在静音模式下不应触发 → 加系统静音检测 `uni.getSystemInfoSync().audioStatus`
- **uvue 模板 v-for 循环变量禁用单字母 `r`**（2026-09-19 Settings 页实测）：症状为该 v-for 块插值全空、行数错乱、同页其他 v-for 卡片消失，**控制台零报错**；静态对照实验定位后，改名 `item` 即愈。其余单字母 d/m/s/i/h/b 实测正常，`r` 高度疑似与 WXML 编译产物内部变量冲突 —— **v-for 变量一律语义化命名（item/row/drop）**

## 当前待办

- [ ] **等 Boss 拍板：工程化路线** —— HBuilderX（`manifest.json` 等放**项目根**，官方示例结构无 `src/`）vs CLI（配置放 `src/` 下，另需 `package.json`/`vite.config.ts`）。当前骨架按「根目录放配置 + `src/` 放源码」建，`pages.json` 的 path 带 `src/` 前缀
- [ ] **等 Boss 拍板：Tabbar 方案** —— 设计稿是玻璃 + 上凸 14px 加号，但官方文档明确「uni-app x **不再支持** tabbar 的 midbutton」。候选：① 页面内自绘 Tabbar 组件（最贴近设计稿）② 用 uni-ui x 的 `uni-tab-bar` ③ 用原生 tabBar 的 `blurEffect` 但**放弃上凸加号**
- [ ] **等 Boss 拍板：色值口径** —— 画板节点硬编码是旧值（bg `#F1FAF6` / label `#0B4F3C`）、变量集是新值（`#F2FAF5` / `#0A4F3D`），差 ±1。文档已统一按**变量集**
- [ ] **等 Boss 拍板：「菜品」Tab** —— 设计稿 `CategoryTabs` 只 7 个 Tab、缺菜品，347 条中 58 条菜品无法筛选
- [ ] 真机验证 `backdrop-filter`
- [ ] 真机验证 CSS 自定义属性（`var()`）
- [ ] 补齐 7 个 store（food / goal / settings / library / vessel / opt / user）
- [ ] 实现组件：Tabbar / Bottle / Sheet / Modal / 各 Icon
- [ ] 合规 critic loop 复评

> 完整待办清单（含历史决策、接手检查清单）见 `docs/progress.md`。