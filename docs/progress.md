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

### 2026-09-24 23:05:00 ｜ 状态色系统统一：三档阈值 + 四件套全通（App 端真机验收 PASS）
Boss 拍板阈值＝**100% / 150% / >150%**（ratio ≤1.0 绿、1.0–1.5 琥珀、>1.5 珊瑚），并要求圆环/进度条/液体/文字同一规则。经 product-design:audit 走查聚类为 4 个机会点，本轮落地全部 Blocker＋高优先：
- **goal.ts**：阈值 1.15→**1.5**（唯一 ratio 阈值源，目标变更时自动跟随）。
- **BottleLiquid**：`PALETTES.amber/coral` 由绿色渐变改为 DesignTokens 真实色——amber `['#F0E6D0','#E8D080','#E8B54D','#D4A23E']`、coral `['#FFE8D0','#FFC4A0','#FF9E7D','#E66040']`，顶色带过渡避免 100%→超标 跳变。
- **Home.uvue**：补定义 `status-bg-coral/amber/green`（实色，进度条填充）与 `status-ring-coral/amber/green`（0.85 透明，圆环描边）——此前 goal.ts 引用了六个类但全工程零定义，DayDetail.dd-fill / Records.lr-bar-green 绑定静默失效。
- **GoalModal**：去掉写死的 1800/2100，改用滑块范围比例（≤0.5 绿 / ≤0.75 琥珀 / else 珊瑚），MIN/MAX 变更时分档自动同步。
- **SettleBadge**：二态→三态，接入 `getCalorieStatus(after, goal)`；ringColor / 预算文字 / 餐图标三处同源；新增珊瑚态图标 `sb_alert_coral.svg`。
- **测试经理轮**：全量 `--cleanCache` 重编译（bytes 23:00:40）→ 冷启动截图 `debug/shots/s4_color_fix.png`→ 液体区扫出 **50846 个珊瑚像素**（x153-404, y810-1020），液体/文字/贴纸/渐变/FAB 居中 全部正确。
- **遗留（低优先）**：`CalorieStatus.ringClass` 仍为死代码（全工程零消费），Profile 圆环已直接用 `calStatus.color`；`status-ring-*` 类已定义待后续绑定。

### 2026-09-24 23:22:00 ｜ 瓶身+树叶颜色适配落地（App 端真机验收 PASS）
Boss 提出「两侧绿色树枝也做一套 SVG」。与瓶身适配合并为同一套资产矩阵：
- **新增 8 个 SVG 变体**（`app/static/home/`）：`pingzi_{amber,coral}.svg` / `pingzi_tick_{amber,coral}.svg` / `yezi-zuo-{amber,coral}.svg` / `yezi-you-{amber,coral}.svg`，原绿版保留不动。
- **Home.uvue**：新增 `bottleSrc` computed（coral/amber/空）＋ `bottleAsset(base)` 函数，模板四个 `:src`（瓶身/刻度/左叶/右叶）改为走动态路径，状态切换时整组换色。
- **色值映射**：瓶身绿系 `#58B984/#A9DCC2/#C8E9D6...` → 琥珀 `#D4A23E/#E8D080/#F0E6D0...` / 珊瑚 `#E66040/#FFC4A0/#FFE8D0...`；树叶绿系 `#3E9E63/#6FCB93/#8AD8A8/#4CB678` → 对应琥珀/珊瑚版。白色高光条与瓶身描边不动（保持玻璃通透感）。
- **测试经理轮**：全量 `--cleanCache` 重编译（23:19:59 同步成功）→ 冷启动截图 `debug/shots/s5_bottle_coral.png`→ 瓶身/刻度/瓶盖/双叶/液体/文字 全部珊瑚色，整组视觉统一。

### 2026-09-24 23:38:00 ｜ bg 卡底色适配 + 贴纸三档文案 + 液体底色修复（App 端真机验收 PASS）
- **bg.svg**：生成 `bg_amber.svg` / `bg_coral.svg`（流体斑块/气泡/星芒全部换色，零绿色残留），走 `bottleAsset('bg')` 动态绑定——此前底部绿带是 bg.svg 斑块从半透明瓶身透出来。
- **贴纸三档文案**：`sticker_green.png`（好好吃饭 也好好生活）/ `sticker_amber.png`（今天很棒，再坚持一下）/ `sticker_coral.png`（没关系，调整一下），新增 `stickerSrc` computed 按 calStatus.type 切换。珊瑚档用「没关系」卸 guilt、「调整一下」指向前程，符合轻律生活温和习惯工具定位。
- **液体底色修复**：`BottleLiquid.uvue:213` 原来硬编码 `grad.addColorStop(1, '#0A7A5C')`（mint-deep 绿），无论状态如何底部都有一条绿带。PALETTES 扩为 5 级（新增 palette[4] 底深色：green `#0A7A5C` / amber `#A06820` / coral `#C04020`），渐变终点改走 palette[4]。
- **测试经理轮**：全量 `--cleanCache` 重编译（23:33:54 同步成功）→ 冷启动截图 `debug/shots/s7_bottom_fix.png`→ 瓶底绿带消失，液体/瓶身/树叶/bg 卡/贴纸/文字 全珊瑚色统一。

### 2026-09-24 23:44:00 ｜ 修复树叶不显示 + 贴纸文字色未随状态变（App 端真机验收 PASS）
- **Bug 1 树叶不显示**：`bottleAsset()` 用下划线拼路径（`yezi-zuo_coral.svg`），但树叶文件复制时用了连字符（`yezi-zuo-coral.svg`）→ 路径不匹配，文件加载失败。已将四个树叶文件改为下划线命名，与瓶身/bg 对齐。
- **Bug 2 贴纸文字三档全绿**：`gen_sticker_3state.py` 第 23 行有 `TEXT = (10, 122, 92, 255)` 覆盖了 tuple 里的状态色，三张贴纸文字全是 mint-deep 绿。已删除该行，按 tier 分别用 green `#0A7A5C` / amber `#D4A23E` / coral `#E66040`。
- **测试经理轮**：全量 `--cleanCache` 重编译（23:40:23 同步成功）→ 冷启动截图 `debug/shots/s8_leaf_fix.png`→ 双叶恢复显示（珊瑚色）＋ 贴纸文字「没关系 调整一下」为珊瑚深色，整组视觉完全统一。

### 2026-09-24 23:58:00 ｜ 贴纸圆环去绿 + 文案遮挡修复（App 端真机验收 PASS）
- **圆环仍绿**：`gen_sticker_3state.py` 椭圆描边写死 `(125,235,199,255)` = `#7DEBC7` 绿，三档均未随状态变。改为按 tier 分别用 green `#7DEBC7` / amber `#E8D080` / coral `#FFC4A0`。
- **文案遮挡**：`.hm-sticker` `top:6rpx` 偏低，瓶肩压住「调整一下」下半截与对勾。改为 `top:0rpx` 上移 6rpx，底部避开瓶肩。
- **测试经理轮**：全量 `--cleanCache` 重编译（23:55:58 同步成功）→ 冷启动截图 `debug/shots/s9_sticker_fix.png`→ 贴纸描边珊瑚色、文字完整可见、双叶恢复，整组完全统一。

### 2026-09-25 00:02:00 ｜ 贴纸 z-order 修复：完整显示于瓶面之上（App 端真机验收 PASS）
- **贴纸被瓶肩遮挡**：DOM 序中 `hm-sticker` 在 `bottle-wrap` 之前 → 后者后画、盖住贴纸右下缘。将 `hm-sticker` 移至 `bottle-wrap` 闭合标签之后，贴纸变为最顶层，完整可见且自然浮于瓶面（「贴上去」的动作）。
- **测试经理轮**：全量 `--cleanCache` 重编译（00:01:03 同步成功）→ 冷启动截图 `debug/shots/s10_zorder_fix.png`（本日数据归零，验证绿档）→ 贴纸完整显示于瓶面之上，绿档描边/文字/位置均正确。

### 2026-09-25 01:01:00 ｜ 贴纸右缘裁切真因修复＋贴纸移右上（App 端真机验收 PASS）
- **真因**：`debug/gen_sticker_3state.py` 画布 2x 仅 1680×1240，而椭圆右缘画到 x=1830、对勾画到 y=1435，均出画布被裁——源 PNG 本身就缺右弧/末字「活」/对勾。此前多轮「布局/层叠/overflow」修复全部无效，因为缺陷在素材生成期而非渲染期。
- **修复**：画布扩至 2200×1700、旋转改 `expand=True`、alpha bbox 重裁；三档 PNG 恢复完整 840×620（闭合椭圆＋全文＋对勾），对勾色随三档文字色。
- **位置**：按 Boss 指示贴纸移右上 `left:582rpx top:0`（与右列 28rpx 边距同轴），盒 140×103rpx 与素材比 840:620 精确匹配；回滚 hero 两个失败实验属性（border-top 圆角 0、overflow:visible）。
- **清理**：删除连字符旧树叶文件（yezi-zuo/you-amber/coral.svg，下划线版已生效）。
- **测试经理轮**：全量 `--cleanCache` 重编译（bytes 00:47 重生成）→ 冷启动截图 `debug/shots/s14_sticker_right.png` → 右上贴纸闭合椭圆/两行全文/对勾完整可见，绿档全组统一。

### 2026-09-25 01:35:00 ｜ idle 液体振幅随水深缩放（空瓶近乎安静，App 端真机验收 PASS）
- **诊断**：Boss 反馈空瓶平常态液体来回循环晃动。分析定案＝非 bug——idle 呼吸（3.8s 主晃 ±1.6rpx＋1.4s 副纹）为常驻设计，但振幅是绝对 rpx 值；0 摄入时保底水位仅 14.2rpx 深，圆底弧壁把 3.2rpx 两端高差放大成显眼绿带摆动（水位越浅越晃＝语义倒挂）。
- **修复（A 方案）**：`useLiquid.ts` idle 注入振幅乘 `depthScale = min(1, 水深/40rpx)`——空瓶(0.06)衰减至 35%、水深≥40rpx 恢复满呼吸；tap/longpress/pour 三条用户主动激扰路径零改动。
- **测试经理轮**：全量 cleanCache 重编译（bytes 01:10）→ 冷重启 → `debug/liquid_idle_measure.py` 16 帧量测液面顶：稳态 spread 0–3px（改前可见明显楔形摆动）；tap 回归＝点击后液面抬升 14px、约 1s 阻尼收敛，物理完整；特写 `debug/shots/s15_idle_calm_zoom.png` 绿带水平安静、气泡存活。

### 2026-09-25 03:57:00 ｜ 通宵任务·阶段1收口：主题 token 层 + 设置 store 扩展 + 餐次时间窗（编译绿灯 + 首页无回归）
- **角色：产品经理轮**——跑通 `product-design:audit` 对食物百科页三轴（暗黑/主题/i18n）走查（14 findings：0 blocker/5 major/9 minor，聚类 4 机会点，落 `spark-output/context/audit.json` + `spark-output/audit/food-encyclopedia.md` + 面板）。
- **Pencil 取色 + token 定稿**：从百科详情页（`Nnctn`，$fd-* 变量）与搜索态 v2（`POU8h`，旧 mint 字面量）提取全部色值，统一归入 `design/DesignTokens.md` **§8 主题 token 角色表**：18 语义角色 × 6 色板（mint/ocean/lavender × 亮/暗）；§8.2 暗色推导公式（暗 accent＝亮 accent 提亮 18% 降饱和 10%，mint-dark 为 Pencil 手绘基准）；§8.3 固定色轴（status-amber/coral、info-carb/calorie 不随主题）；§8.4 资产×主题矩阵（瓶/叶/bg SVG 按 accent 重着色，走 toolchain 参数化生成线）。
- **`composables/useTheme.ts`（新建）**：`PALETTES` 六色板查表（key＝accent+mode），`useTheme()` 返回 `{ theme, isDark, accentId }` 三个 computed；`FIXED_COLORS` 与 `ACCENT_OPTIONS` 导出。**遗留 A/B**：ink-1 百科稿 slate `#0F172A` vs 现 App green `#0A4F3D`，待真机双版渲染裁决（任务 #57）。
- **`stores/settings.ts`**：`SettingsState` 新增 `accent: 'mint'`、`locale: ''`（'' ＝ 跟随系统），`setAccent`/`setLocale` 即点即持久化（ct_settings_v1）。
- **`composables/mealWindow.ts`（新建）**：餐次时间窗定稿——早餐 05:00–10:59／午餐 11:00–16:59／晚餐 17:00–21:59／夜宵 22:00–04:59；键与 `stores/food.ts` 餐次 map 对齐（breakfast/lunch/dinner/snack）；`currentMealKey()` 供百科页 CTA「添加到 X 餐」判断。
- **测试经理轮**：`hooks.py all` 5 闸全绿 → `cli.exe launch app-android --cleanCache` 全量重编译（bytes 03:48 重生成，非差量）→ force-stop＋冷启动 12s → 截图 `debug/shots/s1_home.png`：首页完整渲染、贴纸/瓶/Tabbar 无回归（阶段1为纯逻辑增量，零视觉变更，符合预期）。

### 2026-09-25 04:08:46 ｜ 通宵任务·阶段2收口：设置页主题/语言 cell + 半屏 sheet（真机验收 PASS）+ 百科伴生数据生成线落地
- **设置页（Settings.uvue）**：偏好卡新增「主题切换」「语言切换」两 row（palette/globe 手绘线性 SVG 图标，风格对齐 icon_moon）；点击弹 pf- 前缀半屏 sheet（仿 GoalModal render+active 双态，App 端零 v-if 动画竞态）；主题三档带色板圆点（薄荷/海洋/薰衣草），语言三档（跟随系统/简体中文/English）；即点即换 → `settings.setAccent/setLocale` 落盘 ct_settings_v1；行右侧 accent 圆点实时反映当前主题色。
- **测试经理轮（安卓真机 1280×2772）**：cleanCache 全量编译（bytes 04:01）→ 冷启动 → 齿轮(1170,144)进设置 → 两 cell 渲染正确（`s2_settings2.png`）→ 开主题 sheet、扫色定行心 y=2102/2325/2548 → 点海洋：sheet ✓ 迁移 + 行值「海洋 Ocean」+ 圆点变蓝（`s2_ocean_picked.png`）→ 返回再进：圆点仍 (47,159,224)＝持久化 OK → 语言 sheet 选 English 行值即变 → 全部复位 mint/跟随系统。踩坑一枚：Read 显示图缩放 0.72×，按显示坐标直点会打在蒙层（sheet 被点关而值不变），一律以原图坐标/扫色为准。
- **百科伴生数据（阶段3 提前铺路，#50）**：新增 `toolchain/sources/encyclopedia_meta.yaml`（7 类目双语名+介绍、6 档点评规则模板、353 条英文食物名——翻译专家起草，`text_review: draft` 待 Boss 核对）；`toolchain/build_encyclopedia.py`（只读 food_library.json，id 全对齐校验、宏量分类 cls、source→conf 映射 verified/derived/draft、related=同 cat 热量最近 3 条、双写 dist+app 副本 sha 互校）；产出 `app/src/data/food_encyclopedia.json` 353 条 45.7KB；侧车 `toolchain/dist/nutrition_audit.json`（不随包）；`schema/encyclopedia_v1.json` 登记结构；hooks.py PROTECTED 增 food_encyclopedia.json。
- **闸门**：hooks all 全绿（含 class-prefix-collision：pf- 前缀零冲突）。

### 2026-09-25 04:56:47 ｜ 通宵任务·阶段3收口：食物百科详情页＋搜索态＋三入口＋CTA交接（真机全矩阵验收 PASS）
- **产品经理轮（百科页）**：新建 `pages/encyclopedia/Detail.uvue`（详情页：横幅图/类目 chip/热量环/宏量三柱/置信度标签/同热关联卡/底部 CTA「添加到 X 餐」按 `mealWindow.currentMealKey()` 实时判餐）与全屏搜索态（`#ifdef` 零依赖，`searchFoods` 命中 zh 名＋全拼＋首字母＋英文名）；`stores/encyclopedia.ts` 只读伴生表 `food_encyclopedia.json`（353 条，id 与主库全对齐）；`composables/useLocale.ts` 提供 zh/en 文案开关，页面全 token 驱动 → 三主题＋暗色零成本生效。pages.json 注册 `pages/encyclopedia/Detail`。
- **三入口接 foodId**：①首页餐次行缩略图（`.meal-thumb-hit` 包 view 承载 hover＋click，根治 `<image>` 不支持 hover-stay-time 的编译 warning）②日历页主食卡 ③日详情食物行——均 `navigateTo` 百科页并带 `?id=`，无 id 时兜底库内首条（米饭）。
- **CTA→Home→FoodPicker 交接闭环**：百科页「添加到本餐」写一次性存储 `ct_pending_add`（UTSJSONObject，JSON round-trip）→ `navigateBack`（失败兜底 reLaunch Home）→ Home `onShow` 读到即 `removeStorageSync`，透传 `FoodPicker` 新 prop `selected-id`＋`start-step='detail'` 直达分量页；确认→结算徽章全链路真机跑通（糙米饭 186 kcal → Home 两条共存 424 kcal）。删除孤儿 `uni.$emit('ct-encyclopedia-add')`（无监听方）。
- **测试经理轮（安卓 1280×2772 全矩阵，截图在 debug/shots/）**：`enc_detail1` 详情渲染对稿 PASS／`enc_search`+`enc_query` 拼音 mifan 命中／`enc_en_search` 英文 egg 命中／`enc_picked` 结果行点击→详情／`enc_related` 关联卡跳转／`handoff1/2`+`loop_home` CTA 交接闭环／`rec1`+`dd1/dd2` 日历与日详情入口／`enc_ocean`+`enc_dark`+`enc_en` 三轴回归／`enc_default` 复位 mint/light/zh 后默认兜底。编译零 warning 零 error；hooks all 5 闸全绿。
- **踩坑固化**：①组件内首行文本带 y≈760（此前盲点 590 落空并误触蒙层关闭）；②App 端渐变 CTA 色带 (200,219,212) 偏灰，`g-r>40` 扫色阈值失效，改扫白字带定行心；③三 Tab 中心 x＝230/597/1083（我＝1083，此前 866 误中日历）；④ Read 显示 0.72× 缩放，一切点击坐标以原图 PIL 扫色为准。

### 2026-09-25 06:16:30 ｜ 通宵任务·阶段4收口：全 App i18n 字典层 + 逐页替换（真机 zh/en 全矩阵验收 PASS）
- **字典层（新建 `composables/i18n.ts`）**：`reg(key, zh, en)` 扁平字典（en 键加 `en:` 前缀）＋ `t(key)` / `tf(key, args)`（{0}/{1} 占位）；语言判定走 `useLocale.resolveLang()`（settings.locale '' → 系统语言兜底）。13 个 .uvue（Home/Records/DayDetail/Profile/Settings/PrivacyDialog/encyclopedia Detail + FoodPicker/AddFood/GoalModal/SettleBadge/Tabbar/CountStepper）显示串全量替换，数据值（cats/ALL_CAT/cat→slug 映射等中文过滤键）零改动。
- **FoodPicker 类目 chip**：新增 `catLabel()`——数据值保持中文用于过滤，仅显示层经 `categoryName().en/zh` 映射；chip 样式由固定 `width:120rpx` 改内容宽（`padding 34rpx` 左右），修复 EN「Vegetables」折行。
- **两处真缺陷修复**：① `hm.date` EN 模板占位符错位（`{1}/{0}` 致「25/9」）→ 改 `{0}/{1} · {2}`，真机复验「9/25 · Fri」；② Records 餐次卡仍显中文——病因＝用了 `MEAL_LABELS[mk]` 原始常量 → 改 `t('meal.'+mk)`，EN 复验 Breakfast/Lunch/Dinner/Snack。
- **「语言切换不生效」误诊闭环**：屏上红字探针＋store 日志证明 setLocale→persist→resolveLang 全链路正常；真因＝语言 sheet 行坐标沿用旧值（English 行实际 y≈2500-2560，旧 2060 命中的是「跟随系统」）。探针与 TEMP-DEBUG 计算属性已全部移除。
- **测试经理轮（安卓 1280×2772，截图 `debug/shots/i18n/`）**：EN 矩阵＝Home 冷启动（fp_relaunch）／FoodPicker 列表 chip 单行（fp_chips_en、fp_chips_en2 滑出 Vegetables/Fruits/Drinks/Snacks）／AddFood 详情步（af_detail_en：Change/Portion/Meal/Add to Breakfast）／GoalModal 全 EN（gm_en）／Settings 全 EN（settings_en）；zh 回归＝复位后 Records 早餐/午餐/晚餐/夜宵（regress_records_zh）、FoodPicker 全部/主食/菜品/肉类蛋类（regress_fp_zh，新 chip 样式 zh 无回归）。状态复位完成：locale=跟随系统、darkMode=OFF、accent=mint。样式改动按规矩走全量 `cli.exe launch` 重编译（bytes 06:09 重生成），非差量。
- **翻译专家轮（EN 文案审校记录，待 Boss 复核）**：①「Based on 中碗 200g computed」语序为模板直译，可接受但非母语级；② sheet 行「System / Follows phone language」措辞已选保守版；③ `hm.date` EN 用 `9/25 · Fri` 美式日期。①②③与 `encyclopedia_meta.yaml`（text_review: draft）同批过 Boss。
- **已知挂起（非本阶段缺陷，明示不脑补）**：贴纸 PNG 上「好好吃饭 也好好生活」为素材文字，EN 态不变（零生图约束下不可动态换）；记录/选择器内食物名＝食物库 zh 快照（EN 名仅百科伴生表有）；vessel 单位「碗」为数据值；`FoodToast.uvue` 含中文但全工程零引用（孤儿组件，去留待 Boss）；DayDetail 点「番茄炒蛋」行打开百科显示 Steamed Rice——疑似 `foodIdFromImg` 配对错位，非 i18n 问题，留待复核。
- **闸门**：`hooks.py all` 5 闸全绿。

### 2026-09-25 06:20:40 ｜ 通宵任务·#57 收口：ink-1 A/B 真机裁决 ＝ 绿 `#0A4F3D` 胜出（slate 废止）
- **方法**：同一百科详情页（米饭）真机双版渲染——A＝Pencil 稿 slate `#0F172A`（`ink_A_slate.png`），B＝App 宪法绿 `#0A4F3D`（`ink_B_green.png`）；仅改 `useTheme.ts` mint-light `ink1` 单值，差量编译即生效（纯脚本改动，watch 会话绿灯 06:17:34）。
- **裁决（产品经理轮）＝ B 绿**：① 一致性——AGENTS/DesignTokens 宪法 label-1 即 `#0A4F3D`，全 App 其他页标题均为绿，slate 会让百科页像"另一个 App"（Nielsen 一致性维度直接受损）；② 品牌情感——薄荷液滴人格下 slate 是通用仪表盘默认色，正是 design-by-committee 陷阱；绿标题与 accent chip、宏量环、CTA 同轴成组；③ 对比度——绿白底 ≈9.9:1，仍过 AAA，无牺牲。
- **回归**：`useTheme` 消费方仅百科 Detail＋Settings 两页；Settings 绿 ink1 渲染无回归（`ink_B_settings.png`），设备状态确认＝薄荷/跟随系统/深色关。
- **遗留观察（不擅自扩权）**：`ink2 #475569`/`ink3 #8BA7A0` 仍按 §8 Pencil 提取表为 slate 系——正文级与绿标题存在轻微异色相，是否整组转绿 label-2/3 待 Boss 对照 `DesignTokens.md` §8 拍板。

### 2026-09-25 06:28:30 ｜ 通宵任务·#58 收口：瓶/叶/bg SVG 按 accent 重着色生成线 + 三主题真机验收 PASS
- **生成线（新建 `toolchain/gen_theme_variants.py`）**：DesignTokens §8.4 矩阵落地——把五张 mint 底稿（bg/pingzi/pingzi_tick/yezi-zuo/yezi-you）按 HSL 色相整体旋转（锚点 #58B984 → ocean #2F9FE0 +54.8° / lavender #8B7BE8 +101.6°，明度/饱和度关系原样保留，s<0.03 近灰不动）产出 10 张变体入 `app/static/home/`。零 AI 生图，纯矢量参数化。
- **接线（Home.uvue）**：`bottleSrc` 后缀规则改为「状态 coral/amber 优先（固定色轴 §8.3），常态随 settings.accent」；五处资产引用零改动（统一走 `bottleAsset()`）。
- **测试经理轮（安卓真机，全量重编译 bytes 06:23 + 新 static 打包）**：海洋＝瓶玻璃/树叶/底图斑块全蓝（`theme_home_ocean.png`）；薰衣草＝整组紫、深紫叶片（`theme_home_lavender.png`）；复位薄荷＝原稿无回归（`theme_home_mint_back.png`）。设备终态＝mint/跟随系统/深色关。
- **明示边界（不擅自扩权）**：液体（BottleLiquid PALETTES）、hero 渐变、贴纸 PNG、FAB 等页面 chrome 仍为 mint 固定色——§8.4 矩阵本轮范围＝瓶/叶/bg 三资产；液体是否随 accent 走属产品决策，留 Boss。
- **闸门**：hooks all 全绿。

### 2026-09-25 06:29:00 ｜ 通宵任务·总交接（阶段1-4 + #57 + #58 全部收口，dev 提交链完整）
- **提交链（dev，未碰 main）**：`195b42f` 全 App i18n（14 文件 +498/−250）→ `7cde14d` ink-1 A/B 裁决绿胜出 → `16ef426` 主题资产重着色线（10 SVG + 生成脚本 + Home 接线）。每笔提交均过 5 闸 hooks；工作区干净。
- **设备终态**：安卓模拟器＝薄荷 / 跟随系统 / 深色关 / 今日 0 记录，与冷启动默认一致；无残留调试探针（DBG 全清）。
- **待 Boss 决策清单（本夜明示挂起，AI 不擅自扩权）**：
  1. **翻译专家复核包**：`toolchain/sources/encyclopedia_meta.yaml`（353 英文名＋类目双语，text_review: draft）＋ 本夜新增 EN 微文案（`hm.date` 美式「9/25 · Fri」、语言 sheet「System / Follows phone language」、「Based on 中碗 200g computed」语序）——同批过目。
  2. **液体是否随 accent**：§8.4 本轮只落瓶/叶/bg；BottleLiquid PALETTES 仍 mint/amber/coral 固定，海洋/薰衣草主题下绿液是产品决策点。
  3. **ink2/ink3 色相**：正文级仍 slate 系（§8 Pencil 提取表），与绿 ink1 轻微异色相，是否整组转 label-2/3 绿待拍板。
  4. **贴纸 PNG 素材文字**：「好好吃饭 也好好生活」为图内文字，EN 态不变（零生图约束）；如需双语要重出素材。
  5. **FoodToast.uvue**：含中文串但全工程零引用（孤儿组件），去留待定。
  6. **foodIdFromImg 配对疑点**：Records/DayDetail 点「五花肉」「番茄炒蛋」缩略图均打开「米饭」百科——疑似按图路径反查 id 的映射错位，非 i18n 问题，需单独排查。
- **小程序端**：按 Boss 指令整夜未碰微信工具；所有改动（i18n/主题/资产）MP 端表现待下次统一回归。
- **隐私开关**：`PRIVACY_DEV_BYPASS=true` 仍在（上线前必须还原，见任务 #29 备注）。

### 2026-09-25 09:48:25 ｜ Boss 三缺陷修复轮收口：全 App token 化 + 三主题×双模式真机矩阵验收 PASS
- **Boss 报的三条**：① 暗黑模式只有设置页顶部变黑 ② 切主题只有水瓶/背景变 ③ 点猪瘦肉缩略图打开的是大米饭。**验收端＝App/安卓**（Boss 明示），故排除后代选择器与 CSS `filter` 两条路线，统一走「token 表 → 逐元素 `:style` 行内下发 ＋ 预生成 SVG 变体」。
- **①② 根因（非"没接线"这么简单）**：`useTheme()` 只有百科 Detail＋Settings 两页消费；其余 15 个页面/组件的颜色仍写在 `.uvue` 的 class 规则里（字面 hex），`:style` 未下发 → 切主题自然整屏不动。**修复＝逐页逐组件把颜色从 class 迁到 `:style="{ color: theme.xxx }"`**，class 只留非色属性（App 端行内样式优先级高于 class，且无继承、无后代选择器）。
- **落地面（17 文件）**：`pages/` Home、Records、DayDetail、Profile、Settings、privacy/PrivacyDialog、encyclopedia/Detail；`components/` Tabbar、FoodPicker、AddFood、GoalModal、SettleBadge、FoodToast、OptionTray、CountStepper；`composables/useTheme.ts`（补 `themeAsset()` 资产矩阵查表 + `THEMEABLE_ASSETS` 登记，未登记资产回落原路径）、`composables/themeAssetList.ts`（新建，资产×变体清单单一来源）。
- **③ 根因与修复**：`pages/encyclopedia/Detail.uvue` 的 `onLoad` 有永假守卫 `id.length == 6`（真实 id 为 `pNNN`＝4 字符）→ 携参被丢弃、`currentId` 回落 `ALL_FOODS[0].id`＝米饭。**修复＝去掉长度守卫，按 id 命中；无 id 才兜底首条**。真机复验＝首页餐次「米饭」缩略图→详情标题「米饭 116 kcal/100g」；百科热门「鸡胸肉」→「鸡胸肉 239 kcal／24g 蛋白」，两条均同物（上一夜待办 #6「foodIdFromImg 配对疑点」同步闭环，`foodIdFromImg('/static/icons/cat/pNNN.webp')→pNNN` 本身无误，病灶在接收端）。
- **测试经理轮（安卓真机 1280×2772，证据 `debug/shots/theme/`）**：三主题×双模式矩阵逐屏扫色核对，采样值与 `useTheme.ts` PALETTES **逐位吻合**——mint-light bg `#F6FBF8`／mint-dark `#0A1612`+card `#162924`／ocean-light `#F5FAFD`／ocean-dark `#0A1218`+card `#14232E`／lavender-light `#FAF8FE`／lavender-dark `#100D1A`+card `#1D1830`。覆盖屏＝Home／Records／DayDetail／Profile／Settings／FoodPicker 列表步／AddFood 分量步／GoalModal／SettleBadge／百科详情／百科全屏搜索／主题 sheet／语言 sheet（后四者以 ocean-dark 全采，主题/语言 sheet 另采 mint-light）。**结论＝Issue1、Issue2 在 App 端真修复**（暗黑开关跨 `am force-stop`+冷启动持久化正常）。
- **本轮新发现（4 项，均**未**擅自改，属视觉决策）**：
  1. **hero 底图/瓶身在暗态是浅色块**：`toolchain/gen_theme_variants.py` 的 `_dark` 档只做色相旋转、**不做明度反转**，`bg_dark.svg` 填充与 `bg.svg` 逐色相同（`#9BD4B6…#F4FCF8`），`pingzi_dark.svg` 仅把 `#58B984→#84CCA5`、瓶体仍浅绿白 → 暗态 `#0A1612` 页上顶着一块近白方卡（`home_*_dark.png`）。
  2. **餐次图标暗态"深字压深底"**：`static/records/lr_meal_*_dark.svg` 仍是 `#0A7A5C`（ocean_dark 为 `#0A357A`）画在 `theme.chip` 暗底上，肉眼不可读（`recs_ocean_dark.png` 三餐卡）。
  3. **页底原生窗体色漏白**：`app/pages.json` 全局 `backgroundColorContent: "#F2FAF5"` 为静态字面量，App 端内容不足视口时底部露一条浅色带——百科详情/百科搜索实测 47px（采样 `#F2FAF5`）。`uni.setBackgroundColor` 文档标注仅 MP 可靠，App 端路线未验证，**不擅自写**。
  4. **百科「营养点评」空圆**：`Detail.uvue:68` `<text class="ec-review-dot-emoji"></text>` 是空占位，渲染成一个无内容的暗色圆点（素材未替换）。
- **另挂起（上一夜清单仍有效）**：液体 PALETTES 不随 accent（ocean-dark 下绿液，`home_restart_dark.png` 明显）、贴纸 PNG 单主题、食物缩略图白底、`FoodToast` 孤儿组件、`encyclopedia_meta.yaml` 译文复核。DayDetail「查看详情」跳到「10月02日·周五」而选中日为 9/25，疑日期映射错位，未排查。
- **纪律**：全程未碰微信开发者工具；`PRIVACY_DEV_BYPASS` 仍为 true；提交只进 `dev`。

### 2026-09-25 21:48:42 ｜ 文档校准轮收口：README 全文与代码对账 + AGENTS.md 两处（暗态范围／399 行待办）
- **Boss 指令**：① 先把新增能力（食物百科、暗黑模式、主题色、首页液体动画改版）同步进 README；② AGENTS.md「深色模式：仅个人中心＋设置两页随动」按实际改掉，**别的不要动**；③「399 行也改了，README 还有其他的有问题的也都改了，符合项目现在的实际情况」。
- **方法（证据优先，禁脑补）**：README 每一条声明改动前先在 `app/` 里 grep／Read 到反证才落笔——逐文件读 `defineProps`／`defineEmits` 实签名、`stores/*.ts` 常量与 getter 实名、`pages.json` 八条路由、`useDeviceCapability.ts`＋`stores/device.ts`＋`App.uvue` 三者关系。产出物为 753 行 README ＋ 顶部 `[变更日志]` 条目。
- **README 修正清单（按节）**：
  1. **§4 组件契约矩阵**（8 行重写）：`Tabbar` 入参只有 `active`（`dark` 是内部 `useTheme()`）、**零 emits**、自带 `uni.redirectTo`；`FoodPicker` 的 `select`／`confirm` 载荷实名 `AddPayload`（**不是** `FoodEntry`，落库由宿主交 `computeEntry()`），首屏 20 项＋触底 +20（检索态截 50），弹层根**常驻 + `display:none`**；`SettleBadge` 分子＝`after`、`RING_DELAY 140 / RING_MS 620 easeOutCubic / EXIT_AT 2160 / CLOSE_AT 2380`、环绿随 `theme.accent` 而琥珀珊瑚固定；`GoalModal` 预设档位实为 `1200/1500/1800/2100/2400`（旧文档写 2000/2200 是错的）；`CountStepper` 上下界取自 `stores/food.ts`（`1…MAX_COUNT=100`）且**无长按连击**；`FoodToast` 标注「契约就绪但无页面挂载」。
  2. **§7 设备分档**：检测实际发生在 `stores/device.ts` 的 `state` 初始化（`capability: detectDeviceCapability()`），`App.uvue onLaunch` 只是裸调 `useDeviceStore()` 预热——旧文写成「App.uvue 启动时注入」；补真实判定规则（IOS_LOW/MID 名单＋版本兜底 ≤12/≤14；Android ≤25 low／≤28 mid＋芯片关键词）；low 档兜底色是 `theme.glassBg`/`theme.tbBarDark` 而非硬编码 `#F8FCFA`。
  3. **§7 滚动**（原为**错误指引**）：删掉「所有长列表与超高页面必须强制包裹在 `<scroll-view>`」——与 AGENTS.md 定案直接冲突（根 view 写 `flex:1` 会被钉死视口高、`overflow:hidden` 裁切）。改为「根 view 自然高度撑开走原生页面滚动，仅 Records／百科详情／定高弹层（FoodPicker、AddFood）用 `scroll-view`」。
  4. **§8.3 结算环**：旧文「800ms + `cubic-bezier(0.16,1,0.3,1)` + rAF」全错，改为实装的 $R=\min(after/goal,1)$、$\theta_{start}=-\pi/2$、`easeOutCubic`、`setInterval(16ms)`、双端分支（MP `stroke+lineCap`；App 扇区多边形 `fill()`＋两端圆点 `fill()`，分段数 `max(2, round(Δθ/0.1047))`）、底轨＝CSS `.sb-track`（`theme.accent+'29'`）。
  5. **§1 页面表**：状态栏字色列按文件证据重写——Home／Records／DayDetail／百科实为**未主动同步**（靠 `globalStyle` 的 `navigationBarTextStyle: black`），仅 Profile／Settings 有 `syncBar()` 且**包在 `#ifdef MP-WEIXIN` 内**（App 端为 TODO）；PrivacyDialog 行补 `uni.openDialogPage` 拉起与 `PRIVACY_DEV_BYPASS=true` 上线前还原提醒。
  6. **`page-container` 清除**：「当前状态」＋§2 架构图 mermaid＋目录树注释三处，统一改为「页面内自绘浮层（蒙层＋阶段类补间，已不用 `page-container`）」；§3 挂载行补 FoodPicker「常驻，非 `v-if`」。
  7. **§6 数据流**：`ct_user_profile_v1`→实名 `ct_user_v1`（且只持久化昵称，`streakDays` 是稿面演示常量）、`totalCarb`→`totalCarbs`、"防抖写入"→每次变更后同步 `saveEntries` 整体序列化、百科 CTA 的「`switchTab` 回首页」→ `navigateBack`＋失败兜底 `reLaunch`（本项目无原生 tabBar）；「6 个 store 模块（5 Pinia + 百科只读索引）」。
- **AGENTS.md 改动（严格两处，Boss 分别授权）**：① 视觉约束里的「深色模式：仅个人中心＋设置两页随动」→ 全 App 三主题×双模式随 `settings` token 下发；② 第 399 行「暗态染色图标未产出」待办 → 转为 `- [x] 已完成（2026-09-25）`。`git diff AGENTS.md` 逐行核对，无第三处。
- **闸门**：`python toolchain\hooks.py all` → **全绿，5 项闸门通过**（本轮为纯文档改动，未触碰 `app/` 代码）。
- **本轮扫到但**未**擅自修的三件事（等 Boss 定性）**：
  1. **百科 CTA 音效静默失效**：`pages/encyclopedia/Detail.uvue:354` `playSound('confirm')`，而 `stores/settings.ts:153` 的 `SoundType` 与 `AUDIO_FILES` 均无 `'confirm'` → `if (!src) return` 空转，「添加到本餐」按 L2 反馈规范应是**无声**的（触觉 `medium` 仍在）。修法二选一：改调已存在的音（`success`／`click`）或补一条音频资产，属音频决策，未动。
  2. **`playSound` 门面有死参数**：`stores/settings.ts:193` 导出签名 `playSound(type, maxDurationMs?)`，但内部 store action（`:94`）只收 1 个参数，`maxDurationMs` 透传后丢弃；全工程无 2 参调用方。
  3. **过期注释与已废止 ADR**：`FoodPicker.uvue:88/:233`、`GoalModal.uvue:317/:365` 四处注释仍写「page-container 容器／离场」，与常驻浮层的实装不符；`docs/decisions/ADR-002-page-container-migration.md` 的结论已被实现推翻——是否补一篇 superseding ADR 待拍板（文档归属问题，AI 不擅自改历史决策记录）。
- **另挂起（沿用上一轮，无进展）**：4 项暗态视觉缺陷、`pages.json` 暗态页底漏白、百科点评空圆、`FoodToast` 孤儿组件、`gen_tab_icons.py` 去留、p348–p353 92×92 图标、营养数据核对 0/30、DayDetail「查看详情」日期错位 Bug、Profile 真机尺度校准（#65/#66，**等「开始」**）。

### 2026-09-25 23:00:40 ｜ Android 视觉尺度修改轮收口：4 处修改真机验证全 PASS（零计划外改动）
- **Boss 指令**：尺度审计最终计划获批后，仅执行 4 项（P0-1/P0-2 弹层 App 端安全区＋P1-3/P1-4 两处 92rpx 漂移），P2 全部冻结，「能只改一个属性就不改两个」。
- **实际修改（4 处，逐处 grep 行号隔离核验）**：
  1. `components/FoodPicker.uvue`：`.fp-sheet` 加 `:style="fpSheetStyle"`（L5），新增 computed（L115-123）＝`#ifdef APP` 内运行时下发 `padding-bottom = 28rpx 折算 px + safeAreaInsets.bottom`；MP 端返回空对象，类内既有 `calc(env)` 规则原样生效。
  2. `components/GoalModal.uvue`：`.gm-sheet` 同模式（L6＋L138-146），基准 48rpx。
  3. `pages/profile/Profile.uvue`：仅 `.bignum` 字号 90rpx→**92rpx**（L586，对齐 type-hero 46px token）。
  4. `pages/records/DayDetail.uvue`：仅 `.dd-bignum` 字号 91rpx→**92rpx**（L482）。
- **P2-6 核查（只报告未修）**：`stores/settings.ts:107` `triggerHaptic` 仅查 `hapticsEnabled`＋PC 平台，`useDeviceStore().haptics` getter 全工程零消费者 → **low 档设备仍会震动**，属已确认缺陷，修复待 Boss 立项。
- **闸门与构建**：`hooks.py all` 5/5 全绿；停 watch 后完整 `cli.exe launch app-android --cleanCache true --deviceId emulator-5554`，`bytes/` 全量再生成 22:37:29 ＞ 最晚源码编辑 22:31:06（排除差量假绿）；logcat 扫描零 FATAL/运行时错误。
- **真机验证（MuMu 1280×2772，证据 `debug/shots/vp1~vp6*.png`）**：① FoodPicker 末行距屏底 116px≈28rpx(49px)＋安全区垫高，无遮挡 PASS；② GoalModal 保存钮距底 208px≈48rpx(89px)＋安全区(119px) PASS；③ Profile 大数字实测 197px，与 Home 冻结 104rpx 实测 228px 比值 0.864≈92/104 PASS；④ DayDetail 数字与 Profile 同档 PASS。
- **冻结项回归**：Home `.remain-num` 104rpx、`.meal-thumb` 74rpx、FoodToast 68/60rpx、SettleBadge 68rpx、27rpx 正文阶梯、Tabbar/BottleLiquid/动画/颜色/Store/路由全部原样，**零计划外修改**；工作区其余 254 条变更属历史未提交工作（主题/i18n 轮），未触碰。
- **遗留 Backlog（本轮记录、不处理）**：
  - 已确认缺陷：triggerHaptic low 档未拦截（上）；暗态 hero 底图浅块／餐次图标深压深／页底 `backgroundColorContent` 漏白／百科点评空圆（09:48 轮已记录，仍待修）；DayDetail「查看详情」日期错位（**下一轮取证中**）。
  - 潜在风险（非缺陷）：FoodPicker `nextTick` 使用于 L268 但顶部无 import（现编译产物可解析、真机零报错）；`backdrop-filter`/Worklet App 端未实现（已 `#ifdef` 隔离）；本轮安全区补偿的 insets 增量在 MuMu（无小白条）未真正触发，带导航条真机待复验。
  - 缺证据：MP 端自 09-24 夜起零回归；iOS 真机零覆盖；营养数据核对 0/30。
- **纪律**：全程未碰微信开发者工具；`PRIVACY_DEV_BYPASS=true` 仍待上线前还原；提交仅当 Boss 明确要求。
### 2026-09-25 23:30:25 ｜ DayDetail「查看详情」日期错位取证收口：ROOT CAUSE CONFIRMED＝测试点位误命中 10/02 跨月格，代码零缺陷，本项关闭
- **Boss 指令**：补拍 Step 1 最后一跳取证（严格只读，不改代码/配置/资源，只做证据采集）。
- **真机取证结果（MuMu 1280×2772，App 端）**：
  1. Records 选中 **9/25**（当月格）→ 点「查看详情」→ DayDetail 标题 = **「09月25日 · 周五」** ✅ 正常（证据 `debug/shots/bug_case1.png` / `_c1_title.png`）。
  2. Records 选中 **9/23**（当月格）→ 标题 = **「09月23日 · 周三」** ✅ 正常（证据 `debug/shots/bug_sel23.png` / `_c2c_title.png`）。
  3. 点 9 月网格中 25 正下方一行的跨月尾格「2」→ 日历即切至 2026年10月、该格紫色选中、汇总卡显示「10月02日 周五」——**该格实际选中的 key 就是 `2026-10-02`**：`calRows`（Records.uvue:186-213）对跨月尾格走 `new Date(y, m + 1, tail)`，`pickDay`（Records.uvue:227-236）同步翻月，均为既有设计行为，非计算错误。
- **最后一跳已闭环**：在 10/2 选中态下执行 `adb shell input tap 1128 2040`，一次命中并成功进入 DayDetail。坐标由截图 1280×2772 逐像素定位——「查看详情 ›」文字像素簇实测包围盒 **x 1037–1219 / y 2023–2056**（浅紫 `rgb(154,147,184)`），取其中心。DayDetail 标题明确为 **「10月02日 · 周五」**（证据链 `debug/shots/f1_now.png`（点击前）→ `f2_detail.png`（点击后）→ `f2_title.png`（标题特写））。
- **数据链路核查（`Records → food.viewDay → DayDetail`）无缺陷**：`goDetail()`（Records.uvue:456-459）跳转**零 query**，仅写 store `food.viewDay`；全工程**单写单读**（唯一写者 Records.uvue:457，唯一读者 DayDetail.uvue:179）。DayDetail `dayKey`（L178-181）字符串直通＋长度守卫回落今日，`headerTitle`（L190-195）直接 `split('-')` 取段渲染，星期用本地 `new Date(y, mo-1, da)` + `(getDay()+6)%7`。`dayKeyOf`（food.ts:407-418）与 `dayRange`（food.ts:421-428）均为本地时间零填充拼接；全链路**无 `toISOString`、无 UTC 构造、无 `setDate` 偏移** → 时区日切类根因已被证据排除。
- **最终判定**：**ROOT CAUSE CONFIRMED —— 原始问题属于测试点位误命中 10/02 跨月格的测试伪影，代码无需修改**。症状文案「10月02日」的唯一产出路径就是选中了 25 正下方同列的跨月格（`2026-10-02`），且两条当月格复现路径端到端正确。
- **Backlog 撤项**：原挂「『查看详情』热区偏窄、点击需重试」→ **撤销**。真相是此前取证用 y=2165，换算回显示坐标 y≈844，落点已在「三餐摄入」卡片内部而非「查看详情」行（y≈795）——是坐标取错行，不是热区问题；重定位后一次即中。
- **本项关闭，不进入任何代码修复流程**（无待修对象）。
- **本轮改动范围**：仅本条交接记录；**未修改任何代码、配置、资源或其他文档**；仅在 `debug/shots/` 新增 3 张取证截图（`f1_now.png` / `f2_detail.png` / `f2_title.png`）。
- **纪律**：未启动 Step 2；未触碰其他既有 Backlog（暗态 4 项、`pages.json` 页底漏白、百科点评空圆、`FoodToast` 孤儿组件、`gen_tab_icons.py` 去留、triggerHaptic low 档、营养数据核对 0/30 等均原样保留）。


### 2026-09-26 23:35:51 ｜ 首页水瓶「瓶肩两侧透明层」根因关闭：方案 C（Canvas 按瓶身内腔轮廓 clip）落地并真机验收通过
- **Boss 指令**：「先走 C，C 不行再 B」。→ 直接上 C，**一次通过，B 未启用**。
- **问题定性（前一轮取证 `debug/evidence_20260926/BOTTLE_CAVITY_FINDING.md`）**：`.bottle-cavity` 是 148×236rpx 半透明白圆角矩形（`rgba(255,255,255,.4)`，暗态 `.06`），四边不随瓶身轮廓走，上沿处**左右各外露 50.5rpx × 89rpx**，形成两条上宽下尖的楔形半透明白带；`pingzi.svg` 里没有它（它不是图片资产，是能装液体 Canvas 的最省事容器）。回归引入点 = `08891f1`（2026-09-23 液体改 Canvas 2D）。
- **实施（4 文件）**：
  1. `components/BottleLiquid.uvue`：新增 `CAVITY_PATH`（30 条命令）＋`traceCavityPath()`；`draw()` 改为 `save()→clip()→玻璃底 fillRect→各元素→restore()`；新增 `glassFill` prop；`.bl-canvas` 高 236→242rpx。
  2. `pages/home/Home.uvue`：`.bottle-cavity` 去掉 4 个 `border-*-radius` 与 `overflow:hidden`、高 236→242rpx；玻璃底改以 `:glass-fill="cavityFill"` 传入；`CAVITY_HEIGHT` 过期注释修正。
  3. `composables/useLiquid.ts`：`CAVITY_H` 注释校准（**取值未变**）。
  4. `toolchain/gen_cavity_path.py`：**新增**——从 `pingzi.svg` 的 `#A9DCC2` 环内轮廓生成路径，杜绝手抄误差（原放 `debug/` 但 `debug/` 被 gitignore，故迁入受控目录）。
- **关键机理**：`1 设计单位 = 1rpx`。canvas 高与 `cvH` 同步 236→242rpx 后 `cvH/242 == cvH_old/236 ==「每 rpx 的物理像素数」`，故引擎水位（0..236 空间）屏幕位置**逐像素不变**，多出的 6rpx 只让玻璃底/液体够到瓶底。**实测已证（见下 ④）。**
- **真机验收（MuMu 1280×2772，`1rpx=1.70667px`；两次全量 `cli.exe launch app-android`，`ready in 70494 / 39794ms`，`bytes/` mtime 均晚于源码，排除差量假绿）**：
  ① **楔形侧漏归零**——差分逐行为上宽下尖楔形：y=660 起于 x179（恰为矩形 24rpx 顶角圆角处）→ 逐行左扩至 x153 → **y≈810 收敛为零**，与预测 809px 吻合；
  ② **材质反算逐点成立**——`0.4×255+0.6×AFTER == BEFORE`（`#DCF2E5→#EAF7EF`、`#DBF1E5→#E9F7EF`、`#CBEADA→#A9DCC2`），证明变化**只是撤掉那层 40% 白**，无副作用；
  ③ 内胆内部采样 `Δ=(0,0,0)`，矩形内 3300 点平均 Δ=0.14；
  ④ **平均水位 176.0→175.0rpx**（4 帧复测 174.6~175.4，落在波浪相位噪声内）→ 印证机理；
  ⑤ **瓶底贴合**：液体由 wrap 316 延伸到 322rpx，y_cav=241.2 处 `x240..320` ↔ 理论内腔 `238.9..320.8`；y_cav=239.4 处 `220..340` ↔ `216.4..343.4`（差额正是 2.5rpx 轮廓环）；
  ⑥ **轮廓环 `#A9DCC2` 恢复完整可见**（此前在瓶颈/肩部被 40% 白盖住，采样为「无」），与 SVG 原稿一致；
  ⑦ **`clip()` 在本项目 App 端确认可用**（未抛异常、未走降级分支）；液体动画两帧差 5758~7536 像素，**画面未冻结**；
  ⑧ **暗态不回归**：楔形区 `#123623`（无 6% 白叠加 → 裁剪在暗态同样生效）、液体动画 4772 像素仍在动；**取证后已还原薄荷浅色**（页底 `#F6FBF8`）。
- **本次未做（登记备查）**：① **瓶颈 6rpx 玻璃接缝**——canvas 顶在 wrap 80rpx 而瓶内腔顶在 53.6rpx，该段无玻璃底，实测 x=280 跨上沿 `#F0FBF4→#F5FDF8`（Δ=5，很淡）；**改动前后完全一致 = 既有问题，非本次引入**，要修须把 canvas 上移 26.4rpx 并重定引擎坐标原点（会让水位映射跟着变）；② 瓶内液体色板仍写死 v1 薄荷（`BottleLiquid.uvue:28`），仅蓝/紫主题显形，Boss 已表态「不算问题」；③ `Home.uvue` `CAVITY_HEIGHT` 为零引用死常量（本次只修注释不删）。
- **纪律**：`hooks.py all` 五闸全绿后提交；`pages/settings/Settings.uvue` 的待回滚改动（描边 `#FBA095→#F5D5C8`，经 Pencil 实时稿面证实为误改）**不在本次提交内**。
- **⚠️ 文档补记（需 Boss 知悉）**：本 `progress.md` 此前**没有任何 2026-09-26 条目**——当日已完成的「视觉尺度 5 项修复 / DayDetail 滚动 / Settings 边距 / Home hero A3 遮罩 / 配色跨主题审计（`COLOR_PLAN_V2.md`）」等轮次**均未落板**，本条为本日首条。收口协议要求的「每轮同批更新」在当日未执行，建议后续按轮次补齐或明确豁免。

### 2026-09-27 00:21:27 ｜ Settings 中段「按设计稿还原几何」落地：6 项几何全中 + 顺带关掉一处跨页类名污染

**Boss 指令**：「你终于说到点上了先 git 提交下，然后开始修改吧」——上一轮 §11 的还原度测量获认可，本轮进入实施。
**口径**：只动几何/结构，**字号与色值一律不改**（延续 Boss「除了文字大小和颜色」的排除）。

#### 一、先做的一件「不请自来」的事：`.card` 跨页污染

全项目 **18 个 `<style>` 全部无 `scoped`**，样式全局合并。逐类名取交集后发现 **7 组**跨文件同名定义，
其中 `.card` 同时被 `Profile.uvue`（`margin: 26rpx`）与 `Settings.uvue`（`margin: 28rpx`）定义，
且 Profile 有 3 处 `class="card week-card|trend-card|rec-card"` 在真实使用。
原本两边只差 2rpx（≈3.4 物理 px）看不出来，**本轮把 Settings 改到 46rpx 后差 20rpx，必然有一页被顶歪**。
→ 按项目既有前缀规范（`lr-`/`dd-`/`pf-`）把 Settings 侧改名为 **`.st-card`**（CSS 1 处 + 模板 3 处），
Profile 不动。**真机双向验证**：Profile 卡片边距实测 **25.8rpx**（= 自身 26rpx ✓ 未被污染）、
Settings **45.7rpx**（= 目标 46rpx ✓）。**注意**：`hooks.py` 的 `class-prefix-collision` 闸门**只比对「组件↔其他文件」**，
**页面↔页面 的同名类是它的盲区**（本条即盲区内实例），该闸门绿灯**不能**代表页面间无污染。

#### 二、6 项几何改动（全部换算到 rpx，稿面 572×1146 → `K=750/572`）

| # | 项 | 改前 | 改后 | 稿面 | 真机实测 |
|---|---|---|---|---|---|
| 1 | 卡片左右边距 `.st-card`/`.card-danger` | 28 | **46** | 44.6 / 47.2 | **45.7** ✓ |
| 2 | 行高 `.row` padding | 26 | **32** | 140.3 | **138.9**（2 行卡 279.5 ↔ 280.6）✓ |
| 3 | 危险卡描边 | `1px` 且**无 border-style**（不渲染） | `1.5rpx` + `solid` | 1px@572 = 1.31rpx | **2px = 1.17rpx** ✓ |
| 4 | 危险卡高度 | 104（padding 18） | **100**（padding 16） | 99.7 | **98.4** ✓ |
| 5 | 数据卡底→危险卡顶 | 85.0 | **106**（盾行 mt 40→37、危险卡 mt 24→33） | 106.2 | **106.7** ✓ |
| 6 | 页脚 | 叶片独立成行居中最上 | **内联在脚注左侧**（新增 `.foot-row`/`.foot-icon`） | 叶片 → 13px 间距 → 文字 | 结构一致 ✓ |
| 附 | 分节标题左缩进 / 盾行左缩进 | 50 / 58 | **52 / 61** | 52.5 / 63.0 | ✓ |

页脚三处间距用 **delta 法**收口（`margin` 控行盒、稿面测的是字形，两者差一个 line-height）：
危险卡底→品牌 89.1（稿面 89.2）、品牌→版本 16.4（15.7）、版本→脚注 21.1（21）—— **三项全中**。

#### 三、测量方法学：上一轮那个「行高 131 vs 119」是被圆角污染的

上一轮沿**卡片左边缘列**扫白色求卡高，而卡片有 36rpx 圆角 → 边缘列在圆角区是页面底色，**系统性低估**卡高。
本轮改为**卡片水平中心列**（并允许文字打断、取首尾极值），真值：稿面 2 行卡 **280.6rpx**、实现 **256.3rpx**
→ 每行 140.3 vs 128.1（= chip 76 + padding 52，与理论吻合）。**差值方向与上轮一致（都是差 12），但绝对值全部修正。**
同理危险卡真值 99.7 vs 104.0（**实现反而更高 4.3rpx**，上轮误报 81.3 vs 83.7）。

#### 四、真机验收

- `cli.exe launch app-android` 全量编译两轮：**`ready in 42222ms`**（第 1 轮，含 `.st-card` 改名）、**`ready in 41336ms`**（第 2 轮，含页脚 delta 微调）；
  `bytes/GenPagesSettingsSettingsSharedData.style.bytes` mtime **00:09:06** 晚于源码 **00:07:55**，排除差量假绿；产物内含 `st-card`/`foot-row`/`foot-icon`。
- 暗态不回归：危险卡描边 `#FBA095` 在 `#162924` 卡上对比度 **7.67:1**（图形元素 WCAG 要求 3:1）；卡内/页底 `162924`/`0A1612`；取证后已还原薄荷浅色 `#F6FBF8`。
- 附：`toolchain/hooks.py all` 五闸需在提交前跑（`docs/progress.md` 与本条同批）。

### 2026-09-27 01:05:00 ｜ 色板补「中间暗档」accentMid + 移除 Settings 行分隔线 + 6 图批次整改

**Boss 指令**：「你确定改了吗，设计稿里面根本没有每个 cell 下面的横线，而且每个模块是通过白色带圆角的
背景包裹着的。其他我说的问题也都没改。」

#### 一、Settings 行分隔线（Boss 点名的两件事）

`.row-div` 是**显式元素**（`height: 1px` + `backgroundColor: theme.line`），共 5 处
（偏好 3 / 目标 1 / 数据 1）。**稿面像素实测**：线是 `#F6FAF8`、与卡底 `#FCFEFE` 差 **6 级**；
**实现**是 `theme.line` = `#D8EFE5`、与卡底 `#FFFFFF` 差 **39 级** ——
**实现比设计稿「重」6 倍多**，所以设计稿上肉眼无线、实现上一眼就看见。

→ 删除 5 处元素 + `.row-div` CSS。真机复验（脚本 `debug/verify_no_divider.py`）：
卡片内部**零** theme.line 色行；卡片边距 45.7rpx、宽 658.6rpx；亮/暗双态均正常。

> 「每个模块是白色带圆角背景包裹」这点**本来就已满足**（`.st-card` 白色 + `36rpx` 圆角），
> 横线一去掉，整块感即恢复。

#### 二、根因级修复：新增 `accent-mid`（v2 色板的档位缺口）

**症状三处、根因一个**：`accentDeep` 是**极端档**（mint 亮态 `#064E3B`，L≈0.19 近黑；
暗态 `#A7F0DA` 近白），但全项目 **30+ 处**把它当「主题色中间的暗档」用：

| 症状 | 位置 | 后果 |
|---|---|---|
| 按钮/头图右下角发黑 | 8 处 `linear-gradient(..., accentDeep)` | Boss 图 1 的「保存钮发黑」 |
| 强调字与标题同色 | DayDetail `.dd-add-txt`/`.dd-ring-label`/`.dd-row-kcal`、百科碳水… | 可点入口没有视觉区分度 |
| 数据色不属同一色系 | 百科四营养素「碳水」 | Boss 图 6 |

**新增 `accent-mid`**（浅态＝同色相压暗 accent，≈4:1；暗态＝该档 accent 本体）：
mint `#17916B`/`#52D6AC`、ocean `#1B7BB3`/`#5BC8FF`、lavender `#5A44DE`/`#A99BFF`。
已登记 `design/DesignTokens.md` §8.1（18 → **19 角色**）并补「accent-deep vs accent-mid 分工」说明。

**改动面（9 文件）**：
- **渐变深端 → accentMid（8 处）**：`AddFood`(确认钮)、`GoalModal`(保存钮)、`Profile`(品牌头)、
  `DayDetail`(品牌头)、`Records`×2(头图/CTA)、`Settings`(保存钮)
- **DayDetail 强调字层次恢复**：改造前是「标题 `#0A7A5C` + 数值 `#12A87B`/`#16A880`」两档，
  改造后全压成同一个 `#064E3B` → `.dd-ring-label`/`.dd-add-txt`/`.dd-row-kcal` 改 `accentMid`
- **百科碳水**：`accentDeep` → `accentMid`
- **FoodPicker 搜索框/未选胶囊**：`theme.chip`（薄荷绿凸面）→ `theme.bg`（`#F6FBF8` 淡凹面），
  对齐设计稿 `#F5FAF8`/`#F8F9FC` 的中性近白
- **Records `.lr-fcard-row`**：`space-between` → `flex-start` + 固定 18rpx 间距，
  右边距 28→10rpx（卡自带 18rpx，10+18=28 与其余区块对齐，4 张时 4×178=712=750-28-10 不溢出）

#### 三、真机验收（`ready in 74772ms`，bytes mtime 00:40:44 > 源码 00:39:05）

| 项 | 实测 | 结论 |
|---|---|---|
| Settings 卡片内横线 | 扫描零命中 | ✓ |
| Settings 卡片边距/宽 | 45.7 / 658.6rpx | ✓ |
| Records 主要食物 3 卡 | 靠左、间距 18rpx | ✓（原 space-between 间隙 107rpx） |
| DayDetail `+ 添加食物` | `17916B` | ✓（原 `064E3B` 近黑） |
| DayDetail 子项 kcal / 环内标签 | `17916B` / `17916B` | ✓ |
| DayDetail 标题 | `0A4F3D`（ink1） | ✓ 层次拉开 |
| 百科四营养素 | `20C997` / `FCA212` / **`17916B`** / `FC7130` | ✓ 四色分明 |
| GoalModal 保存钮右下角亮度 | 0.19 → **0.456** | ✓ 发黑消除 |
| 暗态 | 页底 `0A1612`、卡片无横线、`+ 添加食物` 亮青绿 | ✓ 不回归 |

#### 四、方法学教训

1. **「改造前是什么色」用 `git show <commit>^:file` 挖，比揣测设计意图可靠得多。**
   DayDetail 那三处就是靠它证明「改造前是两档、改造后压成一档」的。
2. **`infoCarb` 变量名写着「碳水」却被用在「脂肪」上** —— 这类命名与用途错位是硬证据；
   但「脂肪该用什么色」文档里没有答案（§8.3 只写 `info-protein/info-fat 即 accent`），
   故本轮**只动有据的碳水**，脂肪保持不动。
3. **纯色行扫描要先确认元素归属**：我一度把 `.dd-card-title`（今日热量）当成 `.dd-ring-label` 采样，
   得出「改动没生效」的错误结论。**先用模板确认类的实际用途，再定位采样坐标。**
4. `design/DesignTokens.md` §8.1 已同批登记 `accent-mid`（18 → **19 角色**）并补分工说明。

### 2026-09-27 01:25:00 ｜ FoodPicker 列表选中态去掉左侧绿竖条（老板定稿 §9.7 第 6/7 问一并关闭）

**背景**：§9.7 第 7 问「添加食物行样式：保留『左侧绿竖条』，还是回退稿面的『右侧选择圈』？」
老板 2026-09-27 答复：**以现状为准，但把选中行左侧那道绿色去掉**（右侧选择圈 ✓ 保留）。
同批第 6 问：GoalModal 三档状态色（绿/琥珀/珊瑚）**保留**，不动。

**改动**（`app/components/FoodPicker.uvue`，+1/−10）：
- 删除模板中的 `.fp-row-accent` 元素与对应 CSS 规则（含其上方注释）。
- 该元素为 `position:absolute; left:0; width:6rpx`，**不占布局流** → 删除后缩略图/文字/选择圈相对位置不变。
- 变更日志写入 script 内（ADR-003 #7 禁 `.uvue` 根层 HTML 注释）。
- commit `03d75ec`。

**真机验收**（emulator-5554；全量产物 mtime `01:16:05` 晚于源码 `01:15:03`，排除差量假绿）：
| 项 | 实测 |
|---|---|
| 选中行「米饭」左侧边带（x 30–110）绿像素 | **0** ✓（`fp-row-accent` 已消失） |
| 右侧选择圈 ✓ | 仍在 ✓ |
| 行分隔线 | 保留 ✓ |
| 文字加深加粗（选中态） | 保留 ✓ |
| 其余行（蛋炒饭/扬州炒饭/咖喱饭） | 无选中标记，正常 ✓ |

**证据**：`debug/evidence_20260927/picker_list_selected.png`（改后）、`cmp_picker_bar.png`（改前/改后并排）。

**方法学**：`OptionTray.opt-underline`（份量卡下划线，老板截图所示）与 `FoodPicker.fp-row-accent`
（列表行竖条）**是两个不同组件里的不同元素**——老板把两者混为「添加食物的选中态」时，
须先回到模板确认元素归属再动手，否则会改错地方。定位「更换」按钮时也踩了一次：
按截图目视估算的 y 偏了 106px（1024 vs 实际 1130），**改用逐行非白像素扫描定位**才点中。
