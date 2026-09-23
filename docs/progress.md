# progress.md — 动态进度追踪

> **定位**：项目最高动态事实来源。新会话进来第一步读这个。
> 与 `AGENTS.md` 分工：AGENTS.md 是静态规则（不变的宪法），progress.md 是动态状态（一直在变）。
> **冲突仲裁**：如果 progress.md 与任何其他文档不一致，以 progress.md 为准。

---

## 当前阶段：MVP 主体已落地（5 页 / 8 组件 / 5 store / 353 条食物库），TabBar 已重构为「三 Tab 液态玻璃悬浮胶囊＋会跑的选中气泡」且**浅色态参数由 Boss 定稿收官**、Records 升为一级 Tab；余下待 App／Web 真机回归（含气泡 Worklet）与暗态染色图标等待拍板项

> 口径提示（2026-09-22）：本文件下方「最近进度」与「变更日志」中带旧计数（347 条、`app/data/`、Pixabay 图源）的条目为**当时批次原貌**，不回改；
> 现在的真值一律以本条与 `AGENTS.md` 目录结构为准：**353 条**食物、数据产物在 `app/src/data/`、图标唯一入库副本在 `app/static/icons/`。

## 最近进度

### 2026-09-23 19:30:00 — 项目地图超精细工程全景蓝图重构完成（涵盖9大技术维度）

**背景与动机**：
- 用户明确提出「项目地图不够精细」的架构级需求；
- 针对前版概览粗颗粒度、无法指导底层开发与全景排障的问题，执行从系统级到代码级的工业级重构。

**重构核心内容与交付物**：
1. **路由流向与生命周期全景 (Navigation Topology & Page Lifecycle)**：
   - 绘制从 `App.uvue` 初始化到 3 个一级 Tab、3 个二级页及 4 大原地 `page-container` 弹层的 Mermaid 拓扑图；
   - 梳理 6 大页面的进栈方式、传参契约、状态栏反转 (`syncBar`) 与生命周期行为规范。
2. **源码级物理拓扑与符号索引 (Source-Level Topology & Symbol Index)**：
   - 细化每个目录、文件职责、代码行数规模与关键导出符号（类型定义、函数、类名、数据源落脚点）。
3. **页面微架构与 DOM 挂载树 (Page Micro-Architecture & Visual Hierarchy)**：
   - 为 Home、Records、DayDetail、Profile、Settings、PrivacyDialog 绘制字符级 DOM 容器树，标明 `z-index`、尺寸与前缀类名。
4. **组件契约、插槽与事件矩阵 (Component Contracts & Events)**：
   - 覆盖 8 大公共组件，列出完整的 Props 类型、Emits 事件签名与载荷、内部性能机制（如 FoodPicker 20 条分页秒开、SettleBadge Canvas 2D 比例换算）。
5. **领域实体模型与数据字典规范 (Domain Model & Data Dictionary)**：
   - 详细列出 `FoodBase`、`FoodEntry`（冗余快照机制）、`MealRow`、`FoodLine`、`VesselTpl`、`OptGroup` 等核心 TypeScript 接口定义与字段语义。
6. **全局响应式状态总线与持久化拓扑 (State & Storage Topology)**：
   - 绘制 Pinia 5 大 Store 到内存 State/Getters 再到 `uni.setStorageSync` 本地落盘 Key 的数据流动图。
7. **硬件分档降级与多端适配规则矩阵 (Device Tier & Platform Degradation)**：
   - 明确 High/Mid/Low 机型与芯片判定准则，建立触觉、水波、毛玻璃、音效的分级开关矩阵与原生/小程序条件编译规范。
8. **核心算法与物理动效数学模型 (Core Physics & Mathematical Algorithms)**：
   - 披露水瓶晃动 34 段离散正弦波指数衰减物理公式（$\lambda=0.955$）、对数刻度份量映射公式及 Canvas 2D 环形进度弧极坐标缓动计算模型。
9. **数据供应链与五道自动化质量闸门 (Data Supply Chain & Quality Gates)**：
   - 固化从 6 份 YAML 源数据到 `validate.py` 校验、`build.py` 生成及 `hooks.py` 五道强约束闸门的完整流向图。

**质检与交付结果**：
- `toolchain/hooks.py all` 提交闸门 5 项检查全绿通过；
- [README.md](file:///d:/project/other-porject/kaluli/README.md) 扩充至 520 行，全景高精蓝图全部就绪。

### 2026-09-23 18:45:00 — 深度复盘与防呆机制沉淀：彻底根除 Identifier 'sbH' 重复声明与 min-height: 100% 编译报错

**起因与问题根源**：
用户在编译运行日志中遇到两项典型报错：
1. `Identifier 'sbH' has already been declared. (Settings.uvue:309:4)`
2. `[plugin:uni:app-uvue-css] ERROR: property value 100% is not supported for min-height (Records.uvue:492:2)`

**问题根因剖析**：
- **sbH 重复声明**：在多次敏捷迭代修改中，头部声明了响应式 `const sbH = ref(0)`，尾部又残留了原生获取代码 `let sbH = 0`。UTS 编译器对 `<script setup>` 作用域执行强类型单命名空间校验，遇到同名变量直接中断编译；
- **min-height: 100%**：Web CSS 直觉与 uni-app x 原生渲染引擎冲突。uni-app x 官方明确规定 `min-height` 仅支持数字或具体像素单位（`number | pixel`），不支持百分比，写 `100%` 会直接触发 CSS 编译器 Fatal 错误。

**修复与落地动作**：
1. **Settings.uvue**：彻底移除尾部多余的 `let sbH` 声明块，全页统一采用顶层统一的 `sbH`；
2. **Records.uvue**：将 `.page` 的 `min-height: 100%` 重写为 `flex: 1`，配合外层视口自适应伸缩，完全符合原生规范；
3. **知识沉淀与防呆宪法**：已将两项铁律正式写入 `AGENTS.md`「uni-app x CSS 原生渲染红线」与「UTS / <script setup> 变量唯一声明规范」，建立前置静态检查意识，绝不再犯。

**起因与设计审视**：
用户针对多页顶部背景提出严肃质问：“为什么这几个页面的顶部背景，明明在设计图上是一致的，做出来却大相径庭，都不一样。不然直接简单点做成绿色渐变吧。我的需求是好看，颜值要高”。
基于 `ai-worldclass-design`（Lenny / Apple R&D 设计体系）进行审美诊断：
- 之前各页面各自为政拼接的机械圆弧（如 1200rpx 巨大圆弧被 `overflow:hidden` 硬切出的怪异雷达圈）与拉伸位图（模糊的 `header_wave.png`）是造成页面粗糙、割裂的根本祸根；
- 简单单色纯绿渐变虽然稳妥，但缺乏辨识度与液态生命力，无法满足用户对“高颜值、好看”的绝对要求；
- 正统解法是**建立全 App 统一的薄荷水体视觉系统**：统一渐变、统一水波、统一浮岛层叠。

**实施与交付内容**：
1. **新建全工程统一纯矢量水波素材**：
   - 编写 `app/static/common/liquid_wave.svg`（ViewBox 0 0 750 72）：由两条极度舒展连贯的有机贝塞尔曲线构成，后浪带 10% 微透明形成水深透视，前浪 18% 柔白并嵌 1px 精细高光反光边，赋予界面呼吸感与流动液态玻璃质感，全屏与任何 Android 设备均绝对无损。
2. **Records.uvue（最近记录页）顶栏升级**：
   - 彻底剔除粗硬的 `.lr-arc1`、`.lr-arc2` 机械圆弧及硬性光晕；
   - 统一采用正统薄荷水体双色温渐变（`linear-gradient(#4EE2B6, #1FBF8F, #0A7A5C)`）；
   - 底部引入 `liquid_wave.svg`；月历卡自然上叠 `-32rpx`，形成优雅自然的白色浮岛。
3. **Profile.uvue（个人中心）顶栏升级**：
   - 彻底淘汰模糊锯齿的旧位图 `header_wave.png`，替换为统一矢量 `liquid_wave.svg`；
   - 接入全 App 统一薄荷水体渐变，优化头像、昵称、打卡天数行与水面的留白呼吸；
   - 今日热量卡上叠负边距规范统一至 `-32rpx`。
4. **Settings.uvue（设置页）顶栏升级**：
   - 清除粗糙的 `.hd-arc1`、`.hd-arc2` 巨大椭圆与径向光晕；
   - 浅色模式接入统一薄荷水体渐变与 `liquid_wave.svg`，深色模式维持 `#162924` 静谧纯色底；
   - 返回箭头与标题垂直居中规整排列。
5. **DayDetail.uvue（单日详情页）顶栏补齐与对齐**：
   - 结束原本空荡荡的割裂感，全量引入统一薄荷水体渐变与 `liquid_wave.svg`；
   - 今日热量卡负边距统一归位至 `-32rpx`，与 Records/Profile 保持像素级同一语言。
6. **工程验证与文档同源**：
   - 严格同步更新 `Records.md`、`Profile.md`、`Settings.md`、`DayDetail.md` 四份自说明文档；
   - `python -X utf8 toolchain/validate.py` 严格校验 100% 绿灯通过。

## 接手检查清单

**按强制启动协议顺序：**

- [ ] **第一步**：阅读 `docs/progress.md`（本文件）— 确认当前精确阶段和最新进度
- [ ] **第二步**：阅读 `AGENTS.md` — 校准技术栈、核心约束、目录结构
- [ ] **第三步**：按需阅读
  - [ ] `docs/PRD.md`（产品需求）
  - [ ] `docs/Review.md`（评审复盘 / 决策依据）
  - [ ] `design/DesignTokens.md`（**色值唯一事实来源**）
  - [ ] `design/VisualLanguage.md`（视觉语言 v3.0）＋ `design/ScreenSpecs.md`（8 屏几何）
  - [ ] `app/prototype/CalTrack_Protoype.html`（交互原型）
- [ ] 确认**当前设计源＝Pencil**（`pencil-new.pen`，画板按页面分：Home `Yvg8R`／个人中心 `Vtp9C`／Settings `T0IUr`／最近记录 `bTPUq`／单日详情 `VEWYt`／弹层⓪ `n3dgv`／结算 `Dz3YV`＋`MU1O4`／目标滑条 `qnNST`）；
      Ardot 文件 `727289305476547` 已于 2026-09-21 废止（仅早期 8 屏规格来源，见 `design/ScreenSpecs.md`）
- [ ] 确认现有源码清单：页面 `app/pages/**`、组件 `app/components/**`（各配同名 `.md`）、store `app/stores/*.ts`、数据产物 `app/src/data/food_library.json`（生成物，禁手写）
- [ ] 动手前跑一次闸门：`python -X utf8 toolchain/hooks.py all`（全绿才开工；新克隆机器先 `hooks.py install`）

## 下一步待办

> 2026-09-22 清理：本清单原先堆了大量早已完成的项（代码骨架、生图脚本、营养数据、FoodLibraryPlan 重写、压缩下调 25KB……），
> 现按「**真要做** ／ **等 Boss 拍板** ／ **已做完只留追溯**」重排。历史完成项的正文保留在「最近进度」与「变更日志」，不在这里占位。

**A. 待办（可自主推进，按优先级）**

- [ ] **App／Web 端真机回归**（本轮最大欠账）：Vapor 模式、`page-container` 弹层壳、常驻导航栏、TabBar 液态玻璃胶囊——四批改动**全部只在微信小程序端实测过**，App 端仅按「去条件编译后三端共用」推定
- [ ] 真机验证 `backdrop-filter`（iOS／Android 各一台；决定玻璃面在 App 端是否存在，代码里现为 `#ifdef MP-WEIXIN` 包住＋TODO，**不许当已双端可用**）
- [ ] TabBar **图标跳动动画**（L1 反馈缺项，已记 `Tabbar.md`）；液体 rAF 动画真机帧率测试
- [ ] `ActionSheet` 删除的**人工复核**（automator 坐标 tap 命不中微信原生弹层，自动化点不到）
- [ ] 暗色设计稿到位后**校准深色态**（现为薄荷深色临时色板；接缝与状态栏字色一并复查）
- [ ] 营养数据**人工核对 30 条**（`toolchain/sources/nutrition_checklist.md`，进度 **0/30**；核过一条改一行「核对状态」）——这是数据可信度的唯一未过关卡
- [ ] 人工审两份初稿：`icons_v1_visual.yaml`（器皿是否准确）＋ `icons_v1_usage.yaml`（选项归属）
- [ ] 图标集成优化：列表**懒加载 + LRU 缓存**（现 353 张全量常驻）
- [ ] 合规 critic loop 复评
- [ ] 「菜品」分类**在稿面无 Tab** → 353 条里 59 条筛不到，补第 8 个 Tab 还是并类（`ScreenSpecs.md` §3/§11）

**B. 等 Boss 拍板（AI 不擅自决定）**

- [ ] **p348–p353 六条图标重跑生图**：现为 92×92 小图（其余 512×512），且 `assets/icons-gen/` 无原始 PNG；重跑要再花 API 额度。命令＝`python -X utf8 toolchain/gen_icons.py` → `python toolchain/compress_icons.py assets/icons-gen assets/icons-final --max-size-kb 25` → `python -X utf8 toolchain/build.py`
- [ ] **食物缩略图「画框托底」浅色模式**：暗黑已定（`#0A1612` recessed），浅色**原文标「需老板拍板」，至今未拍**（`docs/design/2026-09-22-food-thumb-plate/README.md` §4）
- [ ] `toolchain/gen_tab_icons.py`（原生 tabBar 图标）**去留**：Tabbar 已定案为共享组件、不走原生 tabBar，该脚本零引用
- [ ] `toolchain/fetch_icons.py` 真实图源分支**去留**：现方案不用 Pixabay/Pexels/Unsplash 抓图
- [ ] **暗态染色图标未产出**：深色模式下仍用浅底那套矢量图标，需专门出暗态版本
- [ ] `debug_shot.ps1` 里 MCP Token 改环境变量（该 Token 已存在于 git 历史，非本轮引入）
- [ ] 登录／头像接入（Boss 明示暂停；v1.0 无后端，App Logo 已生成未接入，`stores/user.ts` 默认昵称仍「老刘」）

**C. 已完成（追溯用，不再列细节）**

- [x] 食物库 v1.0：清单冻结 → 营养数据 → 批量生图 → 压缩 → 多源打包（现 **353 条**，产物 `app/src/data/food_library.json`）
- [x] 5 页 + 8 组件 + 5 store 全链路（Home／Profile／Settings／Records／DayDetail）
- [x] #26 Vapor、#27 page-container 弹层壳、#28 常驻导航栏、#29 TabBar 毛玻璃＋随滚动渐显（**其中 #29 的 fade 渐显已被后续「三 Tab 悬浮胶囊」批次废止**）
- [x] TabBar 重构为**三 Tab 悬浮液态玻璃胶囊＋会跑的选中气泡**（四关键帧 CSS transition）、Records 升一级 Tab、页底预留 78、`DesignTokens.md` §7 补录（小程序端验收通过，App 端 Worklet 留 TODO）；**浅色态参数已由 Boss 定稿**＝胶囊底 60% ＋ 气泡 18% 加白 60% 1px 描边与 `0/4/12 #000 6%` 投影，暗态保持现状
- [x] 类名前缀全量收口（`fp-`/`ft-` 等）＋跨文件同名类机械化拦截
- [x] 保安亭 `toolchain/hooks.py` 五道闸 + `.git/hooks/pre-commit`；仓库去重（tracked 4611→1203）
- [x] 文档批量校准（AGENTS／README／design 4 份／FoodLibraryPlan／toolchain README／nutrition_checklist／5 份 app `.md`）

---

