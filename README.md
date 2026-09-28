# CalTrack — 卡路里管理 App

轻量级卡路里追踪 App，快速记录饮食，直观展示摄入数据。

## 当前状态

**MVP 主体已落地**：8 条路由（首页／日历／我的 三 Tab ＋ 单日详情／设置／食物百科／隐私弹窗 ＋ 开发期探针页）＋ 9 组件 ＋ 6 个 store 模块（5 个 Pinia 总线 ＋ 百科只读索引），353 条食物库＋353 条百科伴生数据内置，弹层为页面内自绘浮层（蒙层＋阶段类补间，已不用 `page-container`），TabBar＝三 Tab 悬浮液态玻璃胶囊（首页／日历／我的，选中气泡会飞行；「最近记录」已升为一级 Tab）。**表现层已完成系统化**：三主题色（薄荷／海洋／薰衣草）× 亮暗双模式＝6 档全 App 逐元素 token 随动，界面文案中英双语（177 组词条，设置页即点即换），首页水瓶为 Canvas 2D 实时物理液体。当前阶段＝还原度收尾 ＋ 工程化加固（提交闸门 `toolchain/hooks.py` 已上岗）。动态进度与接手清单见 **`docs/progress.md`**（最高事实来源）。

> **验证主端＝Android 真机／模拟器（uni-app x 原生渲染）**，微信开发者工具为辅助链路。App 端改动验收前必须跑完整 `cli.exe launch app-android`（差量编译不重编视图层字节码＝假绿源）。

## 技术栈

uni-app x（Vue3 语法 ＋ UTS/TS 编译为原生）＋ Pinia，本地存储，无服务器；数据处理与素材生成线为 `toolchain/` Python。

## 视觉方向

薄荷液滴（Mint Drop）—— 记完一顿饭，水位涨一截、晃两下、归于平静。主题色为薄荷／海洋／薰衣草三档，各随亮暗两态，但「液滴」的物理质感与卡片体系不随主题改变。

## 界面预览

> 全部截图取自 **Android 模拟器 / uni-app x 原生渲染**（1280×2772 原图缩至 640 宽），演示数据为内置 7 天种子阶梯（4 天达标／3 天超标）。原图归档于 `debug/shots/full/`（`debug/` 已 gitignore）。

### 首页与记录流

| | |
|---|---|
| ![首页](docs/screenshots/01_home.png) | ![首页超标态](docs/screenshots/05_home_over.png) |
| **首页（达标态）**：还能吃 172 kcal、水瓶液体停在肩线 80% 上限内、三大宏量、今日餐次时间轴、三 Tab 悬浮玻璃胶囊。 | **首页（超标态）**：液体与贴纸整体转琥珀色（非红），文案随档位换成「今天很棒 再坚持一下」，Hero 转「已超标 60 kcal」。 |
| ![日历](docs/screenshots/06_records.png) | ![单日详情](docs/screenshots/07_daydetail.png) |
| **日历 Tab**：月历每日带达标色点（绿＝达标／橙＝超标），下方为选中日概览＋三餐摄入＋主要食物（点卡片进百科）。 | **单日详情**：热量环卡＋营养分布＋按餐次分组的记录流水；行长按弹「删除这条记录」。 |

### 添加食物（单弹层两步，无二次冷启动）

| | | |
|---|---|---|
| ![食物列表](docs/screenshots/02_picker_list.png) | ![分量与餐次](docs/screenshots/03_picker_detail.png) | ![结算徽章](docs/screenshots/04_settle_badge.png) |
| **列表步**：搜索支持拼音／别名，分类 chip 横滑，353 条内置食物带缩略图与「每 100g／一碗约」双口径。 | **分量步**：点选后原地切步（不销毁重建），器具三档图示＋餐次四卡（按餐窗自动预选），底部胶囊实时算出 kcal。 | **结算徽章**：Canvas 2D 环形＋本次 kcal 数字滚动＋「今日 x／目标」与餐次落位提示；App 端走 fill-only 路径出圆头环。 |

### 百科 · 我的 · 设置

| | | |
|---|---|---|
| ![食物百科](docs/screenshots/11_encyclopedia.png) | ![我的](docs/screenshots/08_profile.png) | ![设置](docs/screenshots/09_settings.png) |
| **食物百科**：热量＋标签＋主要营养成分占比＋营养点评／适宜人群／注意事项／推荐吃法＋相关食物横滑，底部一键按当前餐次添加。 | **我的**：今日热量三格、达标 banner、本周概览 7 点、热量趋势柱状（超标日用珊瑚色而非红）。 | **设置**：深色模式／音效／用餐提醒（即将上线占位）／主题切换／语言切换 ＋ 目标管理；底部明示「所有数据仅保存在本机」，无联网与账号。 |

### 目标弹窗与主题

| | | |
|---|---|---|
| ![每日热量目标](docs/screenshots/10_goal_modal.png) | ![主题切换](docs/screenshots/16_theme_sheet.png) | ![海洋暗态](docs/screenshots/17_settings_ocean_dark.png) |
| **每日热量目标**：步进圆钮＋滑杆＋五档快速选择（1200／1500／1800／2100／2400），确认后全 App 环与色档随动。 | **主题切换**：薄荷／海洋／薰衣草三档，各随亮暗＝6 档 token 矩阵，图标走生成线产出的染色变体。 | **海洋·暗态**：换主题不只换主色——图标、贴纸、液体渐变、玻璃胶囊一并随动（逐元素 `:style` 绑定，原生端无 CSS 变量通道）。 |

暗态另见 [`13_home_dark.png`](docs/screenshots/13_home_dark.png)／[`14_records_dark.png`](docs/screenshots/14_records_dark.png)／[`15_profile_dark.png`](docs/screenshots/15_profile_dark.png)／[`12_settings_dark.png`](docs/screenshots/12_settings_dark.png)。
（隐私授权弹窗仅在首次启动出现，需清存储复现，未入图。）

## 快速上手

```powershell
python toolchain\validate.py              # 六份源文件一致性校验
python toolchain\build.py                 # 合并 → app/src/data/ ＋ 同步图标
python toolchain\build_encyclopedia.py    # 食物库 + 元数据 → 百科伴生表（353 条）
python toolchain\gen_theme_variants.py    # SVG 底稿 → ocean/lavender 变体 + 白名单
python toolchain\hooks.py all             # 跑五道闸门
python toolchain\hooks.py install         # 新机器必跑：把闸门装进 .git/hooks
node debug\shot.js out.png                # 微信模拟器后台截图（需工具已开自动化端口）
```

App 编译在 HBuilderX 图形模式里跑（uni-app x 无独立 npm 构建入口）；**验收主端是安卓真机／模拟器**，无头编译与截图取证：

```powershell
& "D:\soft\HBuilderX\cli.exe" launch app-android --project "D:\project\other-porject\kaluli\app"
# 差量编译不重编视图层字节码＝假绿；改模板/样式后必须跑一次完整 launch，并核对 bytes/ 的 mtime
```

## 目录结构

详见 **`project-map.md`**（AI 专用结构事实：组件合同、存储键、路由表、类名前缀、平台坑位）。

| 路径 | 说明 |
|---|---|
| `AGENTS.md` | 项目静态宪法（规则／约束／踩坑定案），新会话先读 progress.md 再读它 |
| `docs/progress.md` | 动态进度追踪（最高动态事实来源） |
| `docs/PRD.md` | 产品需求文档 |
| `docs/Review.md` | 评审复盘 |
| `docs/decisions/` | 架构决策记录 ADR-001（TabBar 玻璃胶囊）／002（page-container 迁移）／003（调试链路坑位）／004（uni-app x 渲染红线） |
| `design/DesignTokens.md` | ★ 色值／圆角／字号唯一事实来源（§7 玻璃面几何；§8 三主题×亮暗 20 角色 token 矩阵） |
| `design/VisualLanguage.md` | 视觉语言（薄荷液滴） |
| `app/` | 前端（uni-app x 项目根：`pages/`＋`components/`＋`stores/`＋`composables/`＋`static/`） |
| `app/src/data/` | 生成物，严禁手写：`food_library.json`（353 条，`build.py`）＋ `food_encyclopedia.json`（353 条伴生档案，`build_encyclopedia.py`） |
| `app/static/` | 分域素材：`icons/`（食物 512px WebP，生图线产出）＋ `encyclopedia/`／`home/`／`goal/`／`meals/`／`profile/`／`records/`／`settings/`／`settle/`／`vessels/`／`common/`／`audio/`；带 `_ocean`／`_lavender`／`_dark` 后缀者是主题线生成物 |
| `toolchain/` | 数据处理与生成脚本（Python，不进 App 包）：`build.py`／`build_encyclopedia.py`／`gen_theme_variants.py`／`gen_icons.py`／`compress_icons.py` ＋ 提交闸门 `hooks.py` |
| `debug/` | 零窗口调试脚本（automator 后台截图／探针／取数据） |
| `assets/icons-gen/` | 生图原始 PNG（入库留档，AI 生图有随机性不可复现） |

## 当前待办

- [ ] **App／Web 端真机回归**：气泡动画的 Worklet 实现（现仅 MP 端 CSS transition，App 端阶段跳变＋TODO）、`backdrop-filter` 原生端支持度（未验，代码用 `#ifdef MP-WEIXIN` 包住）
- [ ] **p348–p353 六条后补食物的图标是 92×92**（其余 347 张为 512×512），且 `assets/icons-gen/` 里没有它们的原始 PNG。要提清晰度须跑 `gen_icons.py`（花生图额度）→ **等 Boss 拍板**
- [ ] `toolchain/gen_tab_icons.py` 现无任何文档/脚本引用（疑似一次性工具）→ 去留待 Boss
- [ ] **食物缩略图「画框托底」只做了暗黑态**：浅色态该节原文标「**需老板拍板**」，至今未拍 ⇒ 浅色**保持现状不加托底**，AI 不得自行显影 `.row-thumb` 里那句 `#EAF9F3`
- [ ] `toolchain/debug_shot.ps1` 与 `debug/records_check.js` 内含**明文微信工具 MCP Token**（且已进 git 历史）→ 是否改环境变量待 Boss
- [ ] 营养数据人工核对 **0/30**（`toolchain/sources/nutrition_checklist.md`），当前数值＝AI 初稿＋脚本配平，未经权威来源确认
- [ ] 新克隆的机器须跑一次 `python toolchain/hooks.py install`（`.git/hooks` 不随仓库分发）
- [ ] 合规 critic loop 复评

> 完整待办清单（含历史决策、接手检查清单）见 `docs/progress.md`。
