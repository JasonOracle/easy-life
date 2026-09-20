# progress.md — 动态进度追踪

> **定位**：项目最高动态事实来源。新会话进来第一步读这个。
> 与 `AGENTS.md` 分工：AGENTS.md 是静态规则（不变的宪法），progress.md 是动态状态（一直在变）。
> **冲突仲裁**：如果 progress.md 与任何其他文档不一致，以 progress.md 为准。

---

## 当前阶段：图标资源已生成，待集成到 App

## 最近进度

### 2026-09-20 — 首页餐次区按新稿还原（Boss 反馈「meal-card 阴影不够、餐次图标不对」）

- **触发**：Boss 贴设计稿 vs 实机截图，指出 meal-card 阴影不够、餐次图标不对，明确 scope 只改餐次区
- **依据**：首页新稿 Ardot 727788215940571，`batch_read` + `export_nodes` 实测节点 10:290（明细白卡 362×154@472 画布）/ 10:325（时间轴竖线）/ 10:341（47×47 图标圆）/ 10:258 10:244（太阳/月亮矢量 path）
- **改动 1 · 明细裹白卡**：`Home.uvue` 餐次明细从裸排改为 `meal-card`（#FFFFFF r16 + 投影 `0 5px 14px rgba(26,102,77,0.06)`）；472→app 换算系数 0.794（宽 362→287、缩略图 46→37）；行间 1px `#F0F5F2` 分隔线（absolute 定位，不占高度）
- **改动 2 · 时间轴改 flex 列**：删掉写死的绝对定位竖线，改为 `meal-rail`（图标列 42px）+ `rail-line`（`flex:1` 1px 竖线），随餐次数自动伸缩，末餐不画线
- **改动 3 · 图标重画**：`MealIcon.uvue` 早/午=太阳（12.84 dot + 8 射线）、晚=月亮（月牙 + 2 星）——矢量几何从设计稿导出，PIL 4x 超采样成 `static/icons/meal_sun.png` / `meal_moon.png`；圆圈改正圆 r21 + 渐变 `#5CD9A6→#29B385`（135°）+ 投影 `0 5 12 rgba(31,140,97,0.25)`；加餐无新稿参考保留 CSS 曲奇
- **顺手修的坑**：prop 改名 `type→kind` 后漏改调用方，已同步 `Home.uvue`
- **文字色按设计稿校准**：名称 `#14584A` / 份量 `#8FAEAF` / 热量 `#0B7954`
- **验证**：本地无 node_modules 跑不了构建（uni-app x 编译在 HBuilderX 内），已交由 Boss 在微信 IDE 重编后对照设计稿截图验收；`read_lints` 零错误

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
| 2026-09-20 | **画布清理**：按老板圈图删除 6 块 v2 旧板（旧①糖块版/旧②/旧④/旧⑥/旧⑦/旧⑧）+ v2 toast `FkjGk`；Ardot 13–17 号板按要求保留未动。 |
| 2026-09-20 | **弹层 v3.2 —— 餐次改「时间空间状态」实拍风光照（老板定方案B）**：老板指出餐次应体现时间空间状态而非用食物区分（食物与餐次无绑定）。定稿：**同一片丘陵的四个时刻**——早餐日出/午餐正午/晚餐黄昏/夜宵月夜，Agnes `16:9` 一次过 4 张（`v3_sky_*.png`）。弹层餐次卡改照片条 69×42（`mode:'fill'`）+ 名称 + 时间段；餐次板重建为 `ZL2sa`（丘陵四时刻， Replace 灌树）。**新踩坑**：Pencil 的 `assets/` 目录只在打开文档时建立索引，运行中新增图片渲染为棋盘格；解法 = 放进文档目录的 `images/` 子目录（运行时可发现）再引用 `images/xxx.png`。交付：`docs/design/2026-09-20-add-food-popup-v3/` 重打包（22 张素材 + 9 弹层 + 6 板 + README v3.2）。 |
| 2026-09-20 | 首页餐次区按新稿还原：meal-card 补白卡 + 投影 + 行间分隔线、时间轴改 flex rail 列、餐次图标重画（太阳/月亮 PNG + 正圆渐变），详见「最近进度」 |
| 2026-09-20 | **弹层 v3.1 返工（读图能力恢复后目测发现的 3 处问题全修）**：①**首版器物图过小**——3 档卡 105×100 里杯类只有 22–28px 宽、三档肉眼难辨；分量卡加高 100→**120**、倍率 6.08/9.5→**9.0/13.0**，三档杯变 33/37/42px 宽、63/71/80px 高，截图中清晰可辨；②**计数类漏定尺寸**——`piece/slice/skewer` 的 amount=1，∛1=1 会算出 6–9px 废图，补固定高 **66px**，并新建**弹窗⑦⑧⑨**（水煮蛋/吐司/羊肉串，单档无分量区、放 150px 大图）；③新增 2 条 Pencil 铁律（见下）。**交付升级**：弹层 6→9 张（新增 ⑦水煮蛋 `o5s5z` / ⑧吐司 `yNOsF` / ⑨羊肉串 `bwgoN`，其余重建为 `b27NV`/`f4Rxn`/`Y2IcP`/`PPgV2`/`j2pvJ7`），`docs/design/2026-09-20-add-food-popup-v3/` 重打包为 00 总览 + 01–09 弹层 + 10–15 对照板 + 16/17 总览 |
| 2026-09-20 | **🔴 Pencil 渲染管线铁律（当晚实测，最重要）**：会话内 `Insert(parent, node)` 挂出的**子节点全部不进渲染管线**——壳 frame 的 fill 能渲染、`Get` 能读到全部节点、但截图/导出全白，且**不是 1 帧延迟**（隔多次调用仍白）。**唯一可靠通路：`Insert` 只造空壳，整棵嵌套子树用 `Replace(id, {...壳属性, children:[...]})` 一次灌入**。三个前置坑：① `Update(id,{children})` 按 API 文档会报 `unexpected property "children"`（改 children 必须用 Replace）；② Replace 的 nodeData 里**叶子节点不能带空 `children: []`**，否则整棵树被整体拒绝——建树辅助函数若给每个节点都预挂 children 数组，灌入前必须递归 delete 空 children；③ 弹窗这类整屏结构应写成「建树函数返回嵌套对象 + 末尾一次 Replace」，别逐节点 Insert |
| 2026-09-19 | 图标方案定案：**纯文生图**（排除图生图/抠图/详细文案/品牌锚定）；Prompt 规约与 10 食物合格率实测沉淀至 `toolchain/README.md` B.3–B.6 |
| 2026-09-19 | 图标素材链路修复（Pixabay 域名/per_page/编码/档位）+ Pixabay 提第一顺位 + 压缩与索引断链修复；`toolchain/README.md` 归纳图源顺位 / Key 池 / Agnes 防失真 / 13 条踩坑 |
| 2026-09-19 14:14 | toolchain 骨架完成：sources/schema/validate.py/build.py + food_library.json v1.0（1 条食物） |
| 2026-09-19 13:37 | `AGENTS.md` 新增 3 个约束段：防幻觉约束 / Hooks 兜底强约束 / Vue↔MD 对应规范 |
| 2026-09-19 13:35 | 新建 `docs/progress.md`；`AGENTS.md` 补充 6 个协议段（启动协议/变更日志/沟通即文档/收尾协议/大版本更迭/编码纪律） |
| 2026-09-19 13:34 | 设备能力全局化：`useDeviceCapability.ts` 重构 + `stores/device.ts` 新建 |
| 2026-09-19 | Ardot 设计稿与原型双向对齐（分类 tab + 加号裁切修复） |
| 2026-09-18 | 项目初始化：kaluli/ 文件夹创建，过时文档清理，8 屏设计稿导出 |