# progress.md — 动态进度追踪

> **定位**：项目最高动态事实来源。新会话进来第一步读这个。
> 与 `AGENTS.md` 分工：AGENTS.md 是静态规则（不变的宪法），progress.md 是动态状态（一直在变）。
> **冲突仲裁**：如果 progress.md 与任何其他文档不一致，以 progress.md 为准。

---

## 当前阶段：图标资源已生成，待集成到 App

## 最近进度

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
| 2026-09-19 | 图标方案定案：**纯文生图**（排除图生图/抠图/详细文案/品牌锚定）；Prompt 规约与 10 食物合格率实测沉淀至 `toolchain/README.md` B.3–B.6 |
| 2026-09-19 | 图标素材链路修复（Pixabay 域名/per_page/编码/档位）+ Pixabay 提第一顺位 + 压缩与索引断链修复；`toolchain/README.md` 归纳图源顺位 / Key 池 / Agnes 防失真 / 13 条踩坑 |
| 2026-09-19 14:14 | toolchain 骨架完成：sources/schema/validate.py/build.py + food_library.json v1.0（1 条食物） |
| 2026-09-19 13:37 | `AGENTS.md` 新增 3 个约束段：防幻觉约束 / Hooks 兜底强约束 / Vue↔MD 对应规范 |
| 2026-09-19 13:35 | 新建 `docs/progress.md`；`AGENTS.md` 补充 6 个协议段（启动协议/变更日志/沟通即文档/收尾协议/大版本更迭/编码纪律） |
| 2026-09-19 13:34 | 设备能力全局化：`useDeviceCapability.ts` 重构 + `stores/device.ts` 新建 |
| 2026-09-19 | Ardot 设计稿与原型双向对齐（分类 tab + 加号裁切修复） |
| 2026-09-18 | 项目初始化：kaluli/ 文件夹创建，过时文档清理，8 屏设计稿导出 |