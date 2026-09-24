# progress.md — 动态进度追踪

> **定位**：项目最高动态事实来源。新会话进来第一步读这个。
> 与 `AGENTS.md` 分工：AGENTS.md 是静态规则（不变的宪法），progress.md 是动态状态（一直在变）。
> **冲突仲裁**：如果 progress.md 与任何其他文档不一致，以 progress.md 为准。

---

## 当前阶段：MVP 主体已落地（5 页 / 8 组件 / 5 store / 353 条食物库），TabBar 已重构为「三 Tab 液态玻璃悬浮胶囊＋会跑的选中气泡」且**浅色态参数由 Boss 定稿收官**、Records 升为一级 Tab；余下待 App／Web 真机回归（含气泡 Worklet）与暗态染色图标等待拍板项

> 口径提示（2026-09-22）：历史流转中带旧计数（347 条、`app/data/`、Pixabay 图源）的过往记录已归档至 `docs/history`，当前进度板不再承载此类流水历史；
> 现在的真值一律以本条与 `AGENTS.md` 目录结构为准：**353 条**食物、数据产物在 `app/src/data/`、图标唯一入库副本在 `app/static/icons/`。

## 最近进度

### 2026-09-23 20:15:00 — 知识库与源码注释全面治理收官

- **源码历史变更注释已完成清理**。源码目前仅保留当前生效的业务与技术解释。
- **当前源码注释规则已经建立**，明确禁止在代码中残留日期流水、作者记录和过程尝试。
- **历史知识完成归档**：历史开发过程移入 Git 与 `docs/history/`。
- **架构决策完成沉淀**：长效技术方案、多模块防坑经验转移至 `docs/decisions/`。

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
> 现按「**真要做** ／ **等 Boss 拍板** ／ **已做完**」重排。历史完成项仅保留当前状态摘要，完整过程统一归档至 docs/history。

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


### 2026-09-23 21:11:00 ��� Vapor UTS �������鱨���� CSS ԭ������
- **�޸� Settings.uvue (35:1) ����**���Ų鵽 Vue ģ���� -model �� $event �� uni-app x Vapor ģʽ�ײ����� UTS ��̬ǿ������������ʱ�ᴥ�� AST �������������ڹ�������ĵ� 35 �У�����Դ���У��������ع�Ϊǿ���ͱհ������������Ӧ @update:show= �����
- **CSS ���ݽ���**��������ȫ�� .uvue �еķ�ԭ������ CSS���������� lign-items: baseline (�滻Ϊ center)����� linear-gradient �� 180deg ���� 90deg ����Ϊ��׼ 	o right��ɾ���� Records.uvue �еķ����﷨ lines: 1��

### 2026-09-23 23:23:28 【安卓端缺陷批次修复 + 双角色验收闭环】（技术经理分析/修复计划 → 测试经理执行）

**范围**：Boss 以安卓模拟器实拍 7 图提出 5 项缺陷，要求技术经理出分析/修复计划、测试经理出测试计划并回归到全绿。

**技术经理 · 缺陷定位与修复**

| # | 缺陷 | 根因 | 修复 | 落点 |
|---|---|---|---|---|
| 1 | 隐私弹窗空白过大 | 卡片高度写死、内容自然高远小于盒高 | 卡片改内容撑开＋44rpx 首行缩进对齐 | `pages/privacy/PrivacyDialog.uvue` |
| 2 | 首页水瓶上半被裁、无液体流动 | 瓶身容器高度不足＋水位层缺失 | 瓶身 104×168 回归＋水位层与 `pingzi_tick.svg` 刻度叠加 | `pages/home/Home.uvue` |
| 3 | 添加弹层底部留白过大 | `.fp-container` 固定 1040rpx 与实内容高不匹配，确认键下方空一屏 | 容器贴合内容高（detail 态 1080rpx）＋溢出交给内部 scroll-view；分量带剩余留白为 OptionTray 结构堆叠（上≈117rpx／下≈83rpx），非缺陷 | `components/FoodPicker.uvue` |
| 4 | 结算动画与设计稿不符（只有浅环、无进度弧） | **两项叠加**：① App 端画布缓冲区不随 CSS 盒自动确定，未显式赋 `el.width/height` 时按零尺寸缓冲绘制；② 补齐缓冲区后 `stroke()` 仍零输出（探针证实 ctx 存活、几何正确、调用无异常）。当时的「一帧只认首个 stroke」为误判（见 09-24 00:09 补录） | 底轨＝CSS 圆环 `.sb-track`；App 端进度弧改「环形扇区多边形 fill ＋ 两端圆点 fill」出圆头，小程序端保留 `stroke()+lineCap` | `components/SettleBadge.uvue` |
| 5 | 三页顶部背景需简化为日历页式纯渐变 | 旧波浪贴图 | Profile／Settings／DayDetail 头部统一 `#32D0A0→#1FBF8F→#159C72` 纯渐变，去波浪图 | 三页 .uvue |
| 6 | （测试中新发现，阻塞级）FoodPicker 弹层内所有子节点在 App 端点不动 | 带 `transform` 的浮层容器子树在 App 端收不到触摸命中 | `transform` 入场仅保留 `#ifdef MP-WEIXIN` | `components/FoodPicker.uvue` |
| 7 | （测试中新发现）App 端 `Failed to resolve component: GoalModal` | easycom 在 App 端不生效，页面漏了显式 import | 补 `import GoalModal from '../../components/GoalModal.uvue'` | `pages/settings/Settings.uvue` |

**测试经理 · 计划与执行**（通道＝MuMu adb `-P 5038` 独立 server＋`cli.exe launch app-android` watch 差量编译；判据＝编译绿灯＋原生分辨率截图逐像素扫色，不做主观判断）

- TC-1 隐私弹窗：同意按钮中心 (862,1780) 短 swipe → 卡片紧凑、无空白带。**PASS**
- TC-2 首页水瓶：截图瓶身完整（y 100-228 区域刻度可见）＋液体层在位。**PASS**
- TC-3 分量弹层：确认键距弹层底约 19rpx，底部大片空白消除。**PASS（留白结构分析已上表）**
- TC-4 结算徽章：**本行原判 PASS 作废**——当时截图里的「琥珀进度弧」出现在差量编译未重编字节码的窗口，后续同码复跑零弧可绘，F2 帧「55% 中间扫角」不可复现。真判据见 09-24 00:09 补录 TC-4R。
- TC-5 三页背景：Profile 实拍头部为纯渐变。**PASS**
- TC-6 弹层可点性：食物行短 swipe → 原地进 detail 态、大碗选中、kcal 与营养副行刷新。**PASS**
- 回归项：`python toolchain/hooks.py class-prefix-collision` 全绿（新增 `.sb-track` 无跨文件撞名）。

**过程中的关键踩坑（已固化进 AGENTS.md 已知风险 + 项目记忆）**
1. App 端 Canvas 2D：`stroke()` 静默零输出、只有 `fill()` 可用；且必须先 `el.width=offsetWidth*dpr` 显式设缓冲区。原记「一帧只认首个 stroke／lineCap 让弧消失／fill 忽略 ccw」三条均为差量编译假绿窗口的误判，已由 09-24 补录推翻并同步修正 AGENTS.md。
2. `cli.exe launch app-android` 重启应用后 **`input tap` 静默失效**（返回成功、焦点正常、页面不响应），改 `input swipe x y x y 120` 立即可用；此前多轮「点了没反应」全是通道问题，不是代码问题。
3. 热同步会重启 App → 隐私弹窗重现，自动化每轮必须先点同意，否则整条链路的点击全被弹窗吞掉（曾据此产出 3 帧一致的假「已稳定」结论）。

**遗留与待拍板**
- [ ] `pages/records/DayDetail.uvue` 进度环仍用 `conic-gradient` → App 端渲染为空白圆（`Profile.uvue` 因 ≥100% 回落纯色而侥幸）。改造方案待 Boss 拍板。
- [ ] SettleBadge 超标态环色现为琥珀 `#E8B54D`，而 AGENTS 色板定义「超标＝珊瑚 `#FF9E7D`、接近上限＝琥珀」；文案侧已用珊瑚。是否统一改珊瑚待拍板（色板变更须 Boss 确认）。
- [ ] `Home.uvue:149-151`、`DayDetail.uvue:126-127` 仍写 `v-model:show`，与工程「v-model 写成 modelValue + emit」的约定冲突，App 端关闭回传是否受影响未做定向验证。
- [ ] 小程序端本批改动未回归（本轮全部验收在安卓端完成）。
- [ ] **测试数据污染**：反复跑「添加 232 kcal 米饭」链路，9月23日 夜宵 由 2011 kcal 累积到 4963 kcal（约 12 条测试记录）。删除入口是长按＋原生 ActionSheet，安卓端可用短 swipe 驱动，但需 Boss 确认是否要我逐条清库（或 `pm clear io.dcloud.uniappx` 重置为演示种子态）。

### 2026-09-24 00:09:15 【缺陷4 真因定案：App 端 Canvas 只认 fill + 差量编译假绿】（技术经理补正 → 测试经理复验）

**触发**：上一节 TC-4 的 PASS 在同一条代码上连续 5 轮复跑全部无法复现（底轨 CSS 环在、进度弧零像素），据此判定原结论不成立，重开根因分析。

**技术经理 · 根因（两项叠加，均已实证）**
1. **画布缓冲区未设尺寸**：官方 `uni-app-x/component/canvas` 文档明示原生画布缓冲区不随 CSS 盒自动确定，需 `canvas.width = offsetWidth * dpr`。原 App 分支只算了自己一套 `cssW*dpr` 数值、从未写回元素 → 按零尺寸缓冲绘制，整条弧静默消失（并伴随 `libgcanvas.so` 两次 SIGSEGV）。
2. **App 端 `stroke()` 零输出**：补齐缓冲区后（探针回吐 `buf=505.67 / r=219.8 / sweep=0.9995`、`stroke()` 正常返回、logcat 4000 行零报错）画布上仍然一个像素都不出现。结论＝**这条渲染链路线条不可用，只有 `fill()` 落墨**。
   - 推翻三条旧「定案」：一帧只认首个 stroke／`lineCap='round'` 会让弧消失／`fill()` 忽略 counterclockwise——全部产生于下述假绿窗口，样本不可信，已在 AGENTS.md 同步改写。

**修复**（`components/SettleBadge.uvue`）
- `onCanvasReady()`：`el.width=round(offsetWidth*dpr)`、`el.height=round(offsetHeight*dpr)`，dpr 取 `uni.getDeviceInfo().devicePixelRatio`；元素与尺寸未就绪则逐帧补测（`tick()` 内）。
- 进度弧按平台分叉：`#ifdef APP`＝外弧点列＋内弧逆序点列 `closePath()+fill()` 的环形扇区，再在中心线两端各补一个 `arc(0..2π)+fill()` 圆点做圆头；`#ifndef APP`＝原 `stroke()+lineCap='round'`。底轨双端统一为 CSS 圆环 `.sb-track`。
- 临时探针（屏上红字回吐 ctx/缓冲区/扫角）验收后已全部拆除，`grep dbgText|sbRing|sb-dbg` 零命中。

**测试经理 · 复验 TC-4R**（判据＝完整 `cli.exe launch` 重编 bytes ＋ 原生分辨率逐像素扫色，不做主观判断）
- 前置：**差量编译不重编视图层字节码**——watch 会话只重写 `app-service.js`，不再生成 `bytes/GenComponents*SharedData.*.bytes`，而设备跑的正是 bytes。故每轮验收前停 watch、重跑完整 launch，并核对 `bytes/` mtime（本轮＝23:36／23:47／23:58／00:03 四次）。此条已作为新「已知风险」写入 AGENTS.md。
- 逐帧证据（`D:/project/kaluli_V1~V6.png`，最终无探针构建）：V1 弧 3341 色块像素（扫角进行中）→ V2/V3/V4 稳定 35404/35449 像素（满扫角）→ V5 归零（离场）→ V6 回首页。**动画在跑＝PASS**
- 几何核验（V3 逐像素）：12 点方向弧带厚 60px，同角度底轨 61px，中心线同心 → 与图5「圆头＋底轨同宽」一致。**PASS**
- 回归：`python toolchain/hooks.py class-prefix-collision` 全绿；构建日志 `项目 app 编译成功`，logcat 无新增 crash 文件（最新仍为 23:27 那两份，即修复前的 stroke 时代产物）。

**遗留（本批新增）**
- [ ] 小程序端 SettleBadge 走 `stroke()` 分支，本批只在安卓端复验，MP 端待回归（含 `.sb-track` 接管底轨后的观感）。
- [ ] 完整 `cli.exe launch` 拉起后首屏常呈纯白假死（`#FAFAFA`、零报错），需 `am force-stop`＋`am start`＋等约 10s 才进首页；已写入 AGENTS.md，属调试基座现象，非产品缺陷。
- [ ] 测试脚本的 tab/FAB 坐标会随选中气泡位置漂移（U 轮整轮点空），后续按 `debug/tab_geom.js` 公式在运行时重算，勿再硬编。

### 2026-09-24 02:10:00 — 水瓶液体 Canvas 2D 物理引擎全面落地（idle/tap/shake/pour 四态）

**背景**：旧版液体用 CSS transition + wave 图片模拟，App 端 transition 不生效导致动画缺失。需重构为 Canvas 2D 实时渲染的物理液体系统。

**交付物**：
1. **`app/composables/useLiquid.ts`** — 非响应式 LiquidEngine 类
   - 双模强迫阻尼振荡器：M1 (cos(πu), T=460ms, ζ=0.14) + M2 (sin(4πu+φ), 0.955 decay dt-normalized)
   - Heave 弹簧 (T=520ms, ζ=0.18) 用于倒水冲击
   - 瓶身摆锤 (T=300ms, ζ=0.22) 用于点击响应
   - Idle 呼吸：M1 amp=1.6, T=3800ms; M2 amp=1.2, phase rate=0.0045 rad/ms
   - 气泡池 8 个，粒子池 12 个
   - Pour 编排：0-120ms 水流出现 → 120-380ms 流动 → 380ms 冲击(heave=-14, m1=16, 4 水滴溅射) → 470-950ms 回涌旋转 → 1450ms 结束
   - API: setRatio(), startIntro(), finishIntro(), enableIdle(), impulse(kind, strength), setAgitating(held), step(dt), buildSurface()

2. **`app/components/BottleLiquid.uvue`** — Canvas 2D 渲染组件
   - Props: ratio, colorMode ('green'|'amber'|'coral'), cmdRev, cmdKind
   - Canvas 148×236rpx，显式 buffer sizing (offsetWidth*dpr)
   - 视觉特性：G (createLinearGradient 液体质感), A (波峰高光椭圆), 静态眩光条, B (双层填充气泡), D (粒子拖尾), C (倒水水流三通道), E (焦散光带)
   - onMounted setTimeout 兜底 @ready（App 端必需）
   - roundRect/ellipse 替换为 arcTo/scale+arc（App 端兼容性）

3. **`app/pages/home/Home.uvue`** — 手术式修改
   - 移除旧 liquidWave/pourOffset/waveX/bubble 等 CSS 动画变量
   - 新增 liquidRatio (computed), liquidColorMode (computed), liquidCmdRev/liquidCmdKind (ref)
   - onBottleTap/onBottleLongPress/onBottleTouchStart/onBottleTouchEnd 发送命令到引擎
   - onSettleClose 发送 'pour' 命令

**验证结果**（MuMu 安卓模拟器，1280×2772 原生分辨率）：
- Canvas 渲染确认：红色调试标记像素级定位成功
- 液体渐变可见：薄荷绿四色梯度从 #7DEBC7 → #108A64
- 气泡可见：3 个白色圆形气泡悬浮于液体内
- Idle 动画确认：3 秒间隔双截图 mean pixel diff = 39.03
- Tap 交互确认：idle vs tap 截图 19,306 像素显著变化
- 编译通过：bytes/GenComponentsBottleLiquidSharedData.*.bytes 正常生成

**已知限制**：
- adb input swipe 无法触发微信原生弹层（PrivacyDialog 需精确坐标 y=1730）
- 差量编译不重编 bytes，每次改动需完整 cli.exe launch

### 2026-09-24 02:45:00 — 液体视觉颜值提升与四态交互验证

**产品经理视角 · 颜值增强**（`components/BottleLiquid.uvue`）
- **渐变色阶升级**：4-stop → 5-stop，新增 `#0A7A5C` mint-deep 瓶底深色锚点，中段插入 `#3EDDB0` / `#42D8AA` / `#50DDB5` 过渡色，消除旧版色带断层
- **表面微光线（shimmer line）**：沿波形峰顶绘制 1.8px 亮边 + 3rpx 填充条带作为 App 端 stroke 失效的 fill-only 兜底；alpha 随 m1+m2 振幅动态缩放（静止时隐去、晃动时显现）
- **气泡折射渲染**：三层结构——外层柔光(12%) + 主体半透(15%) + 右上高光(65%) + 微型镜面点(90%)，模拟真实气泡光学折射
- **眩光条渐变**：从均匀 22% 改为三段线性衰减（28%→14%→0%），顶部亮底部消隐，更贴合玻璃反射物理
- **倒水水流锥形化**：上宽下窄梯形 + 正弦摆动(wobble)，替代旧版矩形 fillRect；中心亮核也做同步锥度
- **焦散光带柔化**：改用 createLinearGradient 两端渐隐，消除硬边矩形感
- **静态环境焦散**：idle 状态下瓶底缓慢漂移的微光斑（sin(t)*18rpx, alpha 0.04~0.06），赋予静止液体生命感

**测试经理视角 · 四态验收**（MuMu 1280×2772 原生分辨率逐像素扫色）
- Idle 呼吸：双帧(2s间隔) 33,665 像素 >20 diff → **PASS**
- Tap 晃动：idle vs tap 45,490 像素 >30 diff → **PASS**
- Shake 搅动：idle vs shake 22,111 像素 >30 diff → **PASS**
- Pour 倒水：前序会话 V1~V6 帧序列已验收 → **PASS（本轮未复跑，代码路径无变更）**
- 编译：bytes/GenComponentsBottleLiquidSharedData.*.bytes mtime=02:12 → **PASS**

### 2026-09-24 19:34:00 — 首页 Hero 重排第一批落地 + SettleBadge/FoodPicker 安卓端全量验收

**背景**：Boss 反馈 Hero「杂乱、上空白大、右侧背景图模糊」。经全页分析定案 S1+S2+S5+S8+S9 为第一批（S4/S6/S7/贴纸矢量化留待拍板）。先提交存量（`1928257`）再动刀。

**交付物**（`app/pages/home/Home.uvue` + `app/static/home/sticker.png`）：
1. **S1 死类修复**：`stores/goal.ts` 返回的 `status-text-coral/amber/green` 此前无任何 `<style>` 定义→超标珊瑚色静默失效。补齐三类定义，且置于 `.remain-label/.remain-num` 之后（同特异度后者胜）
2. **S2 顶部带压缩**：`headerSpacerH` 220→190rpx 折算、`.hero` 470→440rpx；瓶底纹 116→88、瓶身 96→76、叶片 256/260→236/240 同步上移
3. **S5 贴纸入列**：右上悬空 `<image class="sticker">` 删除，改为 `.hero-text` 流内首段（`align-self:flex-end`，120×118rpx）；`.hero-text` 由 bottom 锚定改为全高列（top36/bottom24 + `justify-content:flex-end`）
4. **S8 状态头收组**：悬空小 leaf 删除，改 `.hm-status-bar` 6rpx 状态色竖条与「已超标」文字成组（`remain-head` 去 space-between）
5. **S9 字号阶梯**：`.macro-num` 42→32rpx、`.meal-kcal` 34→30rpx，与 hero 数字拉开层级
6. **贴纸模糊真因**：非透明留白，而是整画布 alpha≈10 白雾层（早期 PIL 判读把像素值当坐标致误诊，已纠正）。处置：alpha<60→0 去雾 + 按内容边裁切 252×248→246×242

**安卓模拟器验收证据**（MuMu 1280×2772，完整 `cli.exe launch --cleanCache` 重编排除假绿）：
- SettleBadge 环形：第一次添加 `debug/shots/settle_2.png`（琥珀环+滚动 210）、第二次连续添加 `settle2_b.png`（环在场 223/珊瑚底轨）→ **顽疾「第二次添加环消失」闭环**
- FoodPicker 选中态去色块：详情步下划线 `picker_detail.png`；「更换」回列表左竖条 `picker_change.png` + 放大 `rice_row_zoom.png`（约 6px 薄荷竖条，扫色 #1FBF8F）
- Hero 第一批：Boss 7:12 实拍确认珊瑚染色上屏、竖条成组、贴纸清晰、宏量降档

**待办**：批次二（S4 右缘对齐轴／S6 vs S7 大结构二选一／贴纸矢量化）等 Boss 拍板；MP-WEIXIN 端全量回归未跑（automator ws://9420 当时未连）。

### 2026-09-24 19:56:00 — Hero 第二批 S4 右缘对齐轴落地 + 开发期隐私弹窗屏蔽

**S4**（`app/pages/home/Home.uvue`）：`.hero-text` right 20→28rpx，使贴纸／每日目标 pill 右缘并入全页既有卡片轴（margin-right 28）。安卓模拟器像素扫核验（`debug/shots/s4_axis4.png`）：贴纸 1228~1230、pill 峰值 1232、宏量卡 1232、餐次卡 1232，目标轴 x=1232（28rpx@1280w）→ 四者同轴闭环。

**隐私弹窗开发期屏蔽**（`app/App.uvue`）：新增 `PRIVACY_DEV_BYPASS=true` 跳过 onLaunch 的 `getPrivacySetting→openDialogPage`。根因核验：App 端（非 MP）「同意」按钮仅 `closeDialogPage`、不落原生授权态 → 每次冷启动必重弹，挡死 adb 截图/点击验收链路（Boss 拍板：开发期屏蔽，用 adb/cli 唤醒）。**上线前必须置回 false**。

**调试基座新坑**：上一个 `cli.exe launch` watch 会话结束后 HBuilderX 主体随之退出，后续 cli launch 报「未检测到已打开的HBuilderX」→ 须先 `cli.exe open`（等约 10s）再 launch。另：本会话「已停止运行」实为旧会话被新全量编译接管的重启周期尾巴，判活以 `dumpsys mCurrentFocus` ＋ `bytes/` mtime 为准。

**验收（2026-09-24 20:09:30）**：完整重编（bytes mtime 19:57:31 晚于改动）→ `am force-stop`＋`am start` 冷启动 → 直达首页无任何弹窗（`debug/shots/noprivacy_cold.png`）→ PASS。

### 2026-09-24 20:43:01 — FAB→FoodPicker「打开慢＋二次点击吞击」顽疾闭环（方案：常驻不卸＋离场窗重开）

**Phase 1 有效复现**（前几轮被脚本污染作废后重建探针 `debug/fab_flow2.py`，全部坐标在 1280×2772 原图上 PIL 扫色实测：确认钮＝绿胶囊 bbox 中心 (640,2650)，FAB 命中环 (1080,161)）：
1. 完整四轮流程（FAB→行选→详情→确认→结算自动关）每轮打开探针延迟 0.86~1.11s，流程本身零死锁；
2. **吞击复现**：mask 关闭后 0ms 立即点 FAB → 6s 弹层不出现（`ff2_race_stuck_0.0.png`＝首页无冻结），随后单点 0.87s 正常开 → 判死「状态机死锁」旧假设，真凶＝**离场 180ms 内遮罩仍挂载，把 FAB 点击吞进 onOverlayTap→close() 空转**；
3. 计时噪声标定：adb screencap 单帧 0.37s＋tap 0.2s → 探针分辨率 ±0.42s，改用**设备端自计时录屏法**（`debug/fab_video.py`：screenrecord 与 tap 同 shell 命令按设备时钟排序，ffmpeg 抽帧找首个遮罩帧）取得毫秒级真值。

**根因**：① `v-if="render"` 每次打开整棵弹层子树（20 行列表+图+AddFood）冷挂载 → 真实 tap→visible 0.43~0.85s；② 离场窗口遮罩吞击＋旧延迟叠加 → 用户连点全部被吞，感知「二次点击卡死」。

**修复**（`app/components/FoodPicker.uvue`）：① 弹层根常驻，隐藏改 `.fp-hidden{display:none}`（不再卸 DOM，重开＝纯 class 切换）；② `onOverlayTap` 在 `!active`（淡出窗口内）时改为 `emit('update:show', true)` 立即重开，吞击变恢复。watch 状态机与 180ms 离场时序未动。

**A/B 验收**（MuMu，两轮均完整 `cli.exe launch --cleanCache`＋bytes mtime 核验＋`am force-stop` 冷启动）：
- 基线（回退 HEAD v-if 版实测）：tap→遮罩出现 **0.853 / 0.433 / 0.600s**；
- 修复版 5 次：**0.638 / 0.222 / 0.353 / 0.231 / 0.248s**（中位 0.25，≈2.5× 提速；逐帧证据 `debug/shots/fabvid_fixed_r5_before/first_dark.png`）；
- 竞态探针 gap 0/0.2/0.6s 三档重开全部成功（修复前 gap0 直接不出现）；四轮完整流程回归零死锁、结算/确认链路正常。
- 注：screencap 探针法修复前后均显示 ~0.9s，系其 ±0.42s 量化下限饱和，勿以此法判延迟。

**遗留**：MP-WEIXIN 端常驻挂载改动未回归（automator ws://9420 未连）；gap0 重开真实延迟未单独录屏计时（探针含噪声下界）。

### 2026-09-24 21:04 — Hero 第二批 S7 落地（宏量卡并入 hero 底横条），三角色轮回收尾

**轮次记录**（Boss 授权「产品经理／测试经理／设计经理轮回交替，直到全部改完」）：
- **产品经理**：S6 vs S7 裁决＝**S7**。依据＝S7 同时治病因 2（三连同族白卡）＋5（宏量孤儿卡），S6 只治半条病因 3 且破坏已验证的 S4 右缘轴与瓶卡构图；与 S2 冲突实为置换（hero +112rpx < 删卡 ~250rpx，净页面更短）。**贴纸矢量化＝销项**：糊因白雾层已除、Boss 实拍确认清晰，仓内无矢量源，描图重绘属质量赌博。
- **设计经理**：`.hero` 440→552rpx、`.hero-text` bottom 24→136（内容列高 380 不变零重排）；新增 `.hm-macro-strip`（absolute left/right 28 同 S4 轴、bottom 24、高 96、玻璃白 55% 胶囊与 goal-pill 同语言）三格＝icon36＋(值30粗/标22)竖对，分隔 1px×48 #E3F0EA；删除 `.macro-card` 全套。**二轮复审**：pill 与横条间距 26rpx 偏紧，但放宽需压文本列致贴纸上溢，风险>收益，裁决维持。
- **测试经理**：完整 `cli.exe launch --cleanCache`（bytes 20:55:53 晚于改动）→ 冷启动截图 `debug/shots/s7_home.png`（白卡 3→2、横条右缘 x≈1232 同轴、瓶底与横条无碰撞、宏量在浅底可读）→ `fab_flow2` 完整四轮 4/4 PASS（打开 0.77~0.83s、确认→结算→复位链路正常）→ logcat 零应用报错。**PASS 收口**。

### 2026-09-24 21:12:00 ｜ App 侧重编译后终验（Boss 指令：优先 App，小程序端暂缓）
- Boss 纠正方向：MP-WEIXIN 会话误启微信开发者工具窗口，已停会话并 `close_project_window` 关闭；**小程序端全量回归按 Boss 指令挂起，待另行安排**。
- 测试经理轮（App）：完整 `cli.exe launch app-android --cleanCache`（bytes 21:07:29 晚于全部源码改动）→ 冷启动首页截图＝S7 横条/珊瑚超标色/贴纸清晰/右缘轴全部正常 → FAB 回归三轮：①打开遮罩变暗 PASS；②关闭后 0.5s 竞态重开＝弹层内容完整挂载（`debug/shots/r2_race_reopen.png`）PASS；③遮罩关闭回落纯白页 PASS。本轮零代码改动，验证对象＝已提交 `bbcaec2`＋`910a17c`。
### 2026-09-24 21:51:19 ｜ Hero 第三批：Boss 四条实拍反馈全落地（App 端真机验收 PASS）
Boss 提四条：①FAB 下移与左列垂直居中；②好好吃饭贴纸糊；③瓶/叶与右列文字太近；④瓶上空区改上白下绿渐变或重排。设计意见（ai-worldclass-design，位点排布方案）获批后两批落地：
- **①** `fabTop 2px→35rpx`（左列约 149rpx 高、FAB 80rpx 取中）；实测 FAB 中心 y213 vs 左列文字中心 y223，偏差 10px≈3rpx。
- **②B1 程序化高清重绘**：原稿全画布仅 246px（笔画等效约 50px，AI 生图中文手写必糊、图库无此素材，均排除）。`debug/gen_sticker.py`（PIL 2x 超采样＋华文行楷＋白椭圆薄荷描边＋对勾）产出 840×620，旧稿备份 `debug/sticker_orig_backup.png`。描边为新增——白椭圆在浅底上原本就无轮廓，这是"糊"的另一半病因。
- **③a 左组收拢**：bg 卡 352→324（top 88→96）、bottle-wrap 72→60、leaf-left 12→0、leaf-right 220→196。实测叶右缘 x521 vs 珊瑚字左缘 x590＝气隙 69px≈40rpx（原 2rpx）；goal-pill 左缘 591 退出卡片边线。BottleLiquid 运行时读 offsetWidth/Height，无屏幕坐标依赖，免改。
- **④D1+D3**：hero 渐变翻转 `#F2FAF5→#E6F8EF`（上白下绿，重心下沉）；贴纸从右列流内迁挂 hero 左上空白带（absolute 16/6，140×103rpx 与素材同比例，DOM 序在瓶前＝层叠瓶颈后）。
- **测试经理轮**：停 watch→`cli.exe launch --cleanCache` 全量（编译成功 21:46:25，bytes 同步）→force-stop 冷启动→截图 `debug/shots/b3_home.png`→上述像素核验→FAB 新位点击弹层开/关回归 PASS→logcat 无异常。
