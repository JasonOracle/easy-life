<!--
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[1. 源文件口径 5 份 → 6 份：icons_v1_visual.yaml（生图槽位）已纳入 validate.py，
              校验项由「三源 id 对齐」改为「四源 id 对齐」，并在数据流一节登记「漏校验导致绿灯放过计数漂移」这一坑;
           2. 实测产出表按磁盘真值刷新：347 条 / 181.6KB / conf 179·163·11 / 有单个克重 196 条;
           3. 图标目录口径改准：唯一入库副本 app/static/icons（347 张，**全部 512×512**），
              assets/icons-final 已进 .gitignore 降级为可重建缓存，同步目标路径 app/src/static/icons 系错误写法已更正;
           4. 新增 D 章节登记构建闸门 hooks.py（五道闸 + install 到 .git/hooks）；脚本表补齐实际存在的脚本，
              并标注 gen_tab_icons.py 无任何引用、去留待 Boss 拍板;
           5. C 章节引用分布表按 347 条实测重算；已知风险登记人工核对进度 0/30]
-->

<!--
[变更日志]
修改时间：2026-09-19
AI模型：CodeBuddy (DeepSeek-V4.1-Flash)
修改内容：[1. 补全素材获取流水线说明（fetch_icons.py / compress_icons.py）;
          2. 记录四张图源的实测顺位与各自可用性;
          3. 沉淀 Key 池发现与轮转策略;
          4. 沉淀 Agnes AI 防失真的四道闸方案;
          5. 汇总本轮实测踩坑清单;
          6. 标注产出规格与 FoodLibraryPlan 要求的落差;
          7. A 章节重写为「多源模式」：五份源文件 + validate/build 多源合并 + 实测产出;
          8. B 章定案：图片路线改为纯文生图（排除图生图 / 抠图 / 详细文案 / 品牌锚定）;
          9. 新增 C 章节：份量与选项数据线，含 vessel（计量器具）与 container（视觉容器）的命名区分;
         10. 沉淀 Prompt 规约：说「是什么」别说「感觉像什么」]
-->

# toolchain/ — 食物库数据 + 素材处理

**不进 App 包，产物单向流动。** 数据线（A）与素材线（B）互不依赖，C 是 A 的一条子线，D 守住 A/B 的产物：

| 流水线 | 输入 | 产物 | 消费方 |
|---|---|---|---|
| **A. 营养数据** | `sources/*.yaml`（6 份） | `app/src/data/food_library.json`（347 条 / 181.6KB） | App 启动加载 |
| **B. 图标素材** | Agnes 文生图（`gen_icons.py`） | 原始 PNG `assets/icons-gen/`（347 张，入库存档）→ 压缩 `assets/icons-final/`（本地缓存，已 gitignore）→ **App 唯一入库副本 `app/static/icons/`（347 张 / 5.61MB）** | App 图片资源 |
| **C. 份量与选项** | `vessel_tpl.yaml` + `opts_tpl.yaml` + `icons_v1_usage.yaml` | 合并进 A 的产物（`vessel` / `opts` / `pieceWeight` 字段） | App 热量计算 |
| **D. 构建闸门** | 源码树 + 生成物 + git 暂存区 | `hooks.py` 五道闸（见文末 D 章） | 提交/构建前拦截 |

> **图标的已知缺口（2026-09-22）**：`app/static/icons/` 里 347 张是 512×512，
> ⚠️ **已作废（2026-09-27）**：后补的 p348–p353 六张曾是 92×92 小图（`assets/icons-gen/` 里没有它们的原始 PNG，
> 因为它们没跑过批量生图）。重跑这 6 张要再花 API 额度，**尚未做**。

---

# A. 营养数据流水线（多源模式）

## 六份源文件

| 文件 | 内容 | 谁维护 |
|---|---|---|
| `sources/icons_v1.yaml` | **347 项食物清单**（id / name / cat） | 人工维护（**唯一事实来源**） |
| `sources/nutrition_v1.yaml` | 营养数据（cal/protein/carb/fat/unit/piece_weight/basis/confidence） | `gen_nutrition.py` 生成 + 人工核 |
| `sources/icons_v1_usage.yaml` | 份量与选项引用（vessel_tpl / opts_tpl） | `gen_usage_spec.py` 生成 + 人工审 |
| `sources/icons_v1_visual.yaml` | 生图槽位（container / content / toppings / state / view） | `gen_visual_spec.py` 生成 + 人工审（**2026-09-22 起纳入校验**） |
| `sources/vessel_tpl.yaml` | 计量器具模板集（18 个） | 人工设计 |
| `sources/opts_tpl.yaml` | 选项模板集（4 个） | 人工设计 |

> `sources/milk_tea.yaml` 是首版单条数据的历史留档，**不参与校验与打包**（已被上面六份取代）。

## 脚本

| 文件 | 作用 |
|---|---|
| `gen_nutrition.py` | 分层生成营养数据初稿：基础食材→成分表值，复合食物→配方推算（附可复核拆解） |
| `gen_visual_spec.py` | 生成生图槽位源（`icons_v1_visual.yaml`） |
| `gen_usage_spec.py` | 生成份量与选项引用 |
| `fill_piece_weights.py` | 批量补齐「1 个 = 多少克」（`piece_weight`），供 `piece` / `slice` / `skewer` 类算热量 |
| `validate.py` | **多源一致性校验**：四源 id 对齐 / 模板引用 / 数值合理性 / basis-confidence 一致 / 宏量配平 |
| `build.py` | **多源合并** → `dist/food_library.json` + 同步 `app/src/data/` + 增量同步 `app/static/icons/` |
| `schema/v1.0.json` | 输出 JSON 格式定义（App 启动时校验用） |
| `hooks.py` | **构建闸门**（五道闸，见文末 D 章） |
| `gen_tab_icons.py` | 原生 tabBar 图标生成（PIL 矢量绘制 81×81 透明底，非 AI 生图；脚本声明的产物 `app/static/tab/*.png` **当前仓库里并不存在**）。⚠️ **未被任何文档或脚本引用，去留待 Boss 拍板（2026-09-22）**——App 实际用的是共享组件 `Tabbar.uvue`，不走原生 tabBar |

## 用法

```bash
python -X utf8 toolchain/gen_nutrition.py    # 重新生成营养数据初稿
python -X utf8 toolchain/validate.py         # 校验六份源文件的一致性
python -X utf8 toolchain/build.py            # 打包 → dist/ + app/src/data/ + 同步 app/static/icons/
python -X utf8 toolchain/hooks.py all        # 跑全部五道构建闸门（见 D 章）
```

> `validate.py` 的校验项：清单无重复 id、**四源 id 完全对齐**（清单 ↔ 营养 ↔ 引用 ↔ 生图槽位）、模板引用合法、
> `unit ∈ {g,ml}`、`confidence ∈ {1,2,3}`、`recipe_estimate` 不得标 `conf=3`、
> 宏量配平（`蛋白×4 + 碳水×4 + 脂肪×9 ≈ 标称热量`，酒精类自动跳过）。

## 三条铁律

1. **App 里绝不手写食物数据** — `food_library.json` 是生成物，改数据必须走 toolchain
2. **每次产出带指纹** — `fingerprint` 含版本 + **6 份源文件清单** + 条数 + 生成时间，出事可回溯
3. **启动时校验 schema** — App 启动时比对 `schemaVersion`，不匹配直接报错

## 数据流

```
icons_v1.yaml ────────┐
nutrition_v1.yaml ────┤
icons_v1_usage.yaml ──┼→ validate.py ─→ build.py ─→ dist/food_library.json
icons_v1_visual.yaml ─┤                                  ↓
vessel_tpl.yaml ──────┤               app/src/data/food_library.json（只读）
opts_tpl.yaml ────────┘
```

> ⚠️ **为什么「四源对齐」是后补的（2026-09-22 踩坑登记）**：`icons_v1_visual.yaml`（生图槽位）此前**完全不在
> `validate.py` 的校验范围内**，于是它停在 347 条、清单已经补到 347 条，**校验一路绿灯**，直到要重跑生图时
> 才发现这六条没有槽位。**教训：多源模式下「没被校验的源」等于「会静默漂移的源」**——
> 新增任何一份 `sources/*.yaml` 都必须同时进 `validate.py` 的 `SOURCES`。
> 现该闸已加：生图槽位缺条目、或残留 `gen_visual_spec.py` 的 `MISSING: true` 占位，**validate 直接红**。

## 实测产出（2026-09-22 复核磁盘真值）

| 项 | 值 |
|---|---|
| 食物条数 | **347**（定案时 347，p348–p353 为后补六条） |
| 产物体积 | **181.6KB** |
| 分类分布 | 主食 63 ｜ 菜品 59 ｜ 肉类蛋类 52 ｜ 蔬菜 60 ｜ 水果 40 ｜ 饮品 40 ｜ 零食 39 |
| 置信度分布 | `conf=3` 179 ｜ `conf=2` 163 ｜ `conf=1` 11 |
| 有器皿分段 | 347 条（全部） ｜ 器具模板 18 个 ｜ 选项模板 4 个 |
| 有选项 | 10 条 ｜ 有单个克重（`piece_weight`）**196 条** |
| 图标 | `app/static/icons/` 347 张 / **5.61MB** / 平均 16.3KB ｜ 347 张 512×512 ＋ p348–p353 六张 92×92 |

## 图标同步（打包时一并处理）

App 打包只会包含 `app/` 目录内的文件，所以 `assets/` 下的产物图标必须复制一份进 App：

```
assets/icons-final/<catKey>/<id>.webp        ← 压缩中间产物（toolchain 侧，已进 .gitignore = 本地缓存）
        ↓  build.py 增量同步（只复制缺失或更新的）
app/static/icons/<catKey>/<id>.webp          ← App 侧副本 = **唯一入库副本**（347 张）
```

**入库分工（2026-09-22 去重定案）**：
- `assets/icons-gen/` — 生图**原始 PNG 入库**（347 张 + `_report.json`）。AI 生图有随机性，重跑拿不到同一批图，原图必须留档
- `assets/icons-final/` — 512 WebP 压缩产物**不再入库**（与 App 副本字节全等），内容与 `app/static/icons/` 重复。重建命令：
  `python toolchain/compress_icons.py assets/icons-gen assets/icons-final --max-size-kb 25`
- `app/static/icons/` — **唯一入库副本**，App 直接引用。新克隆机器没有 `icons-final/` 也能正常跑（`build.py` 会打印跳过提示）
- ⚠️ **缺口（已消解）**：p348–p353 六条没有原始 PNG、App 内曾是 **92×92 小图**（其余 512×512）；
  重跑生图要再花 API 额度，**尚未做**

**引用约定**：
- `food_library.json` 的 `img` 字段 = `<catKey>/<id>.webp`（如 `staple/p001.webp`）
- 前端拼前缀 `static/icons/` 即得完整路径
- `cat` 字段**保持中文**（供 UI 显示），**只有路径是 ASCII**

## 已知风险

- `conf=3` 的 179 条通过了自动筛查（分类区间 + 宏量配平），但**未逐条对照权威成分表**；
  `sources/nutrition_checklist.md` 列了 30 条按风险排序的优先核对项，
  **截至 2026-09-22 人工核对进度 0/30**——营养数值仍属「AI 初稿 + 脚本配平」，未经权威来源逐条确认
- 失误模式集中在**量纲**（LLM 把「每份」的热量误标为「每 100ml」）—— 扩充数据时重点防
- `basis_detail` / `audit_note` 是可追溯字段，**不进 App 产物**（`build.py` 已裁掉）

---

# B. 图标素材流水线

## 文件

| 文件 | 作用 |
|---|---|
| `gen_icons.py` | **生图（当前主路线）**：按 `icons_v1.yaml` + `icons_v1_visual.yaml` 批量纯文生图，20 路并发 + Key 池轮转 + 429 退避 + 白底像素校验，落盘 `assets/icons-gen/<catKey>/<id>.png`（另有 `_report.json`） |
| `compress_icons.py` | 压图：PNG → WebP 512×512，自适应 quality，`--max-size-kb`（默认 25）控体积，输出 `assets/icons-final/`（已 gitignore 的中间产物，最终入库副本由 `build.py` 同步到 `app/static/icons/`） |
| `fetch_icons.py` | ⚠️ **旧路线（真实图源抓取），当前纯文生图方案不用，保留备用**。落盘 `assets/icons/` |
| `assets/icons/icon_index.json` | 旧路线索引：每张图的来源 / URL / 大小 / 本地路径（`fetch_icons.py` 生成，当前目录未落盘） |
| `fetch.log` / `icon_fetch.log` | 旧路线抓取日志 |

## 用法

```powershell
cd d:/project/other-porject/kaluli

# 生图（当前主路线）：全量 / 抽样 / 指定 id
python -X utf8 toolchain/gen_icons.py --all
python -X utf8 toolchain/gen_icons.py --sample
python -X utf8 toolchain/gen_icons.py --ids p105,p104,p270

# 压缩（icons-gen → icons-final，单张上限 25KB）
python -X utf8 toolchain/compress_icons.py assets/icons-gen assets/icons-final --max-size-kb 25

# 旧路线（真实图源抓取，当前不用）
python -X utf8 toolchain/fetch_icons.py --category fruits
python -X utf8 toolchain/fetch_icons.py --all
```

> ⚠️ **Windows 上 `-X utf8` 不能省。** 脚本里有 emoji 输出，GBK 控制台会直接 `UnicodeEncodeError` 退出。
> `compress_icons.py` 的参数语义是「**目录 → 目录**」，不接受单文件路径（传单文件时 `rglob` 扫不到任何东西，静默不产出）。

## 数据流

```
icons_v1_visual.yaml 槽位  →  gen_icons.py（Agnes 文生图）  →  assets/icons-gen/<catKey>/<id>.png   (原始 1024×1024，~800KB，入库存档)
                                                     ↓
                                       compress_icons.py --max-size-kb 25
                                                     ↓
                                  assets/icons-final/<catKey>/<id>.webp  (512×512，≤25KB —— 中间产物，已 gitignore)
                                                     ↓
                                       build.py 增量同步 → app/static/icons/（唯一入库副本，App 引用）

【旧路线，当前不走】图源 API → fetch_icons.py → assets/icons/*.png → compress_icons.py → assets/icons-compressed/*.webp
```

**跳过判据（仅旧路线）**：`fetch_icons.py` 只看 `assets/icons-compressed/*.webp` 是否存在。webp 在 → 整项跳过；webp 不在 → **即使 PNG 已存在也会重新下载并覆盖**。
**`gen_icons.py` 的跳过判据**：目标 PNG 已存在且白底校验合格即跳过（`--dry-run` 可只看结果不重生成）。

---

## B.1 图源顺位（实测结论，非文档推测）

| 顺位 | 图源 | 类型 | 实测结果 | 下载档位 |
|---|---|---|---|---|
| **0** | `existing` | — | `icons-compressed/*.webp` 已存在则直接跳过 | — |
| **1** | **Pixabay** | 真实照片 | ✅ 可用。`q=bubble tea` 命中 7259 条 | `largeImageURL` 1280px / ~290KB |
| **2** | **Pexels** | 真实照片 | ✅ 可用。搜索与下载均正常 | ⚠️ 当前取 `src.original`，**实测 3017KB**，需降档到 `src.large` |
| **3** | ~~Unsplash~~ | — | ❌ **已死**。`source.unsplash.com` 实测两次均返回 **503**（官方 2024-05 下线该服务） | — |
| **4** | **Agnes** | **AI 生成** | ✅ 可用。`agnes-image-2.5-flash` 实测 **12.9s** 出一张 1K 图，853KB | 响应 `data[0].url` |

**降级规则**：
- **来源之间串行** —— 任一来源下载成功即 `return`，不再往下试
- **来源内部轮询** —— 每个食物配 2 个 `search_terms` 备选词（如 `bubble_tea` 配 `bubble tea` / `boba milk tea`），第一个词失败自动换第二个。Pixabay 偶发 `SSL: UNEXPECTED_EOF_WHILE_READING`（连接抖动）就是靠这层自愈的

> **档位选择原则**：真实照片只取 **≥1280px** 档。太大（Pexels 原图 3MB）纯浪费流量和磁盘，太小（Pixabay 640 档）压到 512 会糊。

---

## B.2 Key 池（多 Key 轮转）

当前环境变量实测构成：

| 图源 | 环境变量名 | 数量 | 长度 | 限流 |
|---|---|---|---|---|
| Pixabay | `PIXABAY_IMAGE_API_KEY`、`PIXABAY_IMAGE_API_KEY2` | **2** | 34 | 100 次/分钟/Key |
| Pexels | `PEXELS_API_KEY`、`PEXELS_API_KEY2` | **2** | 56 | 200 次/分钟/Key |
| Agnes | `AGNES_API_KEY` ~ `AGNES_API_KEY5` | **5** | 51 | 图像按分辨率分别限速（未公开具体值）；Free 档文本 20 RPM |

### Agnes 并发实测（2026-09-19）

| 并发 | 总耗时 | 吞吐 | 成功率 |
|---|---|---|---|
| 1（串行） | 11.2s | 5.4 张/分 | 1/1 |
| 4 | 17.8s | 13.5 张/分 | 4/4 |
| 8 | 17.8s | 27.0 张/分 | 7/8（1 次 SSL 抖动） |
| 16 | 19.2s | 50.1 张/分 | 16/16 |
| **20** | **17.3s** | **69.3 张/分** | **20/20** |

> **关键结论**：总耗时恒定在 **17–19s**，与并发数和 Key 数**基本无关**——瓶颈是服务端的批次窗口，不是请求数量。因此**吞吐与并发数成正比**，而且实测 20 路未触发 429。
> **推论**：加 Key 的价值不在提速（吞吐由并发数决定），而在**抗限流**——240 张分摊到 5 个 Key，单 Key 只背 48 张，更不容易撞配额。
> **推算**：240 张 @20 路 ≈ **3.5 分钟**；计入 30% 不合格重做（312 张）≈ **4.5 分钟**。
| ？ | `PIPY_AGNES_2.5_FLASH_MCP_KEY` | 1 | 221 | **用途未确认**，勿擅自使用 |

### 为什么要做 Key 池

单个 Key 撞限流（HTTP 429）会中断整批抓取。多 Key 的核心价值是**绕过 RPM 上限**：Pexels 2 个 Key = 400 次/分钟，Agnes 4 个 Key = 4 倍配额。

### 实现约定（**待落地**）

```python
def _discover_keys(prefix: str) -> List[str]:
    """按前缀自动发现 Key 池，避免硬编码 KEY / KEY2 / KEY3 名字。

    匹配规则：精确等于 prefix，或 prefix + 纯数字后缀。
    这样能命中 PEXELS_API_KEY / PEXELS_API_KEY2，
    也不会误吞 PIPY_AGNES_2.5_FLASH_MCP_KEY 这类无关变量。
    """
    keys = []
    for name in sorted(os.environ):          # 排序保证轮转顺序确定
        if name == prefix or (name.startswith(prefix)
                              and name[len(prefix):].isdigit()):
            value = os.environ[name].strip()
            if value:
                keys.append(value)
    return keys
```

| 策略 | 说明 |
|---|---|
| **自动发现** | 按前缀扫描，不硬编码 Key 名字。以后追加 `PEXELS_API_KEY3` 自动生效 |
| **轮转** | 每次取「最久未使用」的 Key（记 `last_used[name]`），而非固定用第一个 |
| **429 冷却** | 收到 429 时给该 Key 打冷却戳（60s），立即换下一个，不 sleep 等 |
| **全部冷却** | 全部 Key 都在冷却时，等到最早恢复的那个再发 |
| **不可打印 Key** | 日志只输出 `KEY[0]` 索引与长度，绝不打印 Key 值 |

> ⚠️ **本轮已修的限流坑**：`_wait_for_pexels_rate_limit()` 里 `PEXELS_RATE_LIMIT = 200 // 60 = 3`（整数除法写残），导致 `60/3 = ` **20 秒/次**，比正确的 0.3 秒慢 66 倍；且该函数误读写 `self.last_pixabay_time`，与 Pixabay 计时互相污染。做 Key 池时一并修正。

---

## B.3 Agnes 生图 Prompt 规约 ⭐ 定案方案

**方案定案：纯文生图（text-to-image）。不用图生图、不用抠图、不抓真实照片。**

定案依据（实测对比后确认）：

| 被排除的方案 | 排除原因 |
|---|---|
| 图生图（真实照片当参考） | 需要真实图源，但**真实照片全带背景**（实测 29/34 张有背景，白底 0 命中），多一道工序却没换来更好效果 |
| 程序抠图（rembg 等） | 要引 170MB 依赖，且抠图本身也是 AI 活、同样会出错，细边（吸管/珍珠）易毛糙 |
| 先写详细文案再生图 | 实测**无增益甚至有害**——`milky brown`、`opaque` 这类主观形容词会把颜色带偏 |
| 品牌锚定短语（"参考市面上常见品牌实物"） | 实测与其他表述**无显著差异**（简单场景下都差不多） |

### 核心原则：说「是什么」，别说「感觉像什么」

| 写法 | 效果 | 实测证据 |
|---|---|---|
| **逐项列举具体食材** | ✅ 有效 | 麻辣烫 v1 用 `assorted vegetables` → 画成牛肉粉；v2 枚举 8 种食材 → 通过 |
| **容器材质 + 形状** | ✅ 有效（但必须准确） | 火锅 v1 `pot of hotpot` → 砂锅米线；v2 `stainless steel` → **铁盆**；v3 `copper hotpot with central chimney` → 通过 |
| **状态 / 动态词** | ✅ 有效 | `bubbling`、`steam rising`、`pearls settled at bottom` |
| **视角词** | ✅ 有效 | `three-quarter side view`（火锅最终选定侧视而非俯视） |
| **主观形容词** | ⚠️ **有害** | `milky brown` / `opaque milky brown tea liquid` 把奶茶颜色描述偏了，反而不如简单 prompt |
| **抽象概括** | ❌ 无效 | `assorted ingredients` / `什锦食材` 对 AI 毫无约束力，它按最省事的画 |

### Prompt 模板（骨架 100% 固定）

只有 `{...}` 部分可变，其余一字不改——这是 240 张风格一致的前提：

```
{器皿}, {内容物}, {逐项枚举配料}, {状态词}, {视角},
pure white background, soft drop shadow, product photography,
even studio lighting, square composition, high detail,
no text, no watermark, no logo, no people, no hands
```

负面词必须显式写全（`no text / watermark / logo / people / hands`），否则模型会加文字、水印、多余手指。

### 器皿是第一识别特征 —— 必须人工维护对照表 ⚠️

同样一锅红油辣椒：**装铁盆里是「水煮鱼」，装铜锅里是「火锅」**。器皿错了整张图就错了，而且 **AI 自己发现不了这种偏差**——它只知道"金属锅"，不知道中式火锅该是铜锅带烟囱。

必须人工维护一份对照表（建议放 `toolchain/sources/`，人可读可改）：

| 食物 | 标准器皿 | 视角 | 必填特征 |
|---|---|---|---|
| 火锅 | 铜锅 + 中央圆柱烟囱 | 四分之三侧视 | 红油、逐项食材、沸腾 |
| 麻辣烫 | 大碗、料堆满 | 侧视 | 需枚举 8+ 种食材，禁写 `noodles`（会把主体变成面） |
| 珍珠奶茶 | 透明塑料杯 | 侧视 | 封膜、粗吸管、珍珠沉底 |
| 蛋炒饭 | 白瓷碗 | 侧视 | 米粒分明、蛋块、葱花 |
| 卤肉饭 | 浅口碗 | 侧视 | 肉燥浇头 + 半颗卤蛋 |

**这张表 = 文案审核的核心内容**：只需扫「器皿」一列，5 秒判断一个，比看图片快得多。审核前置到这一步，就不会再出现"烧完一批图才发现器皿错了"。

### 尺寸档位锁死

用 `size: "1K"` + `ratio: "1:1"`（= 1024×1024）：
- 与压缩目标 **512×512 恰好 2:1**，降采样无插值畸变
- 改用 `1024x768` 这类精确像素写法时，官方文档说明**可能被标准化到最接近档位**，尺寸就不确定了

### 生成后强制人工过目

AI 图**必须逐张人工检查**，重点四项：
1. 主体是不是目标食物（别把「奶茶」画成「咖啡」）
2. **器皿对不对**（最容易错的一项）
3. 有没有文字、水印、logo、多余手指
4. 白底是否干净（四角像素可自动校验，`min(c) > 235` 判为白）

不合格 → **改 prompt 重做**，不允许「差不多就留下」。索引里 `source` 标 `agnes` 便于追溯。

### 实测合格率（10 个不同难度食物）

| 食物 | 难度 | 首轮 | 结果 |
|---|---|---|---|
| 苹果 / 香蕉 / 冰可乐 | 简单 | ✅ | 通过 |
| 珍珠奶茶 / 薯条 | 中等 | ✅ | 通过 |
| 杨枝甘露 / 蛋炒饭 / 卤肉饭 | 困难 | ✅ | 通过 |
| **麻辣烫** | 困难 | ❌ | v1 画成牛肉粉 → 枚举 8 种食材后通过 |
| **火锅** | 极难 | ❌ | v1 砂锅米线 → v2 铁盆 → v3 铜锅侧视通过 |

**首轮合格率 8/10（80%）**；2 个失败项各需 2–3 轮 prompt 修正。规律：**越"料多"、越依赖中式器皿的食物越容易翻车。**

### 成本实测

| 项 | 数据 |
|---|---|
| 单张耗时 | 10–19s |
| 并发吞吐 | **69.3 张/分钟**（20 路并发 · 5 Key） |
| 240 张（首轮） | **约 3.5 分钟** |
| 240 张（含 30% 重做） | **约 4.5 分钟** |
| 费用 | 当前官方标价 $0（免费） |

---

## B.4 ⚠️ 产出规格与设计要求的落差（制作食物库前必须解决）

`docs/FoodLibraryPlan.md` 对图标的要求是：

| 要求项 | 设计目标 | 文生图方案现状 | 结论 |
|---|---|---|---|
| 尺寸 | WebP **512** | 1K(1024) 生成 → 降采样 512 | ✅ 天然满足（347 张；后补 p348–p353 六张暂为 92×92，未重跑生图） |
| 体积 | **15–25KB/张** | 实测平均 **16.3KB/张**，最大 25.0KB，**超标 0 张** | ✅ 已收口（`--max-size-kb` 默认已改 25） |
| 背景 | **白底 + 柔和投影** | prompt 直接指定，实测四角像素 4/4 纯白 | ✅ 天然满足 |
| 张数 | 每食物一张专属图 | **353 张已产出并入库** `app/static/icons/`（合计 5.61MB） | ✅ 已完成（旧规划「200 专属 + 40 兜底 ≈240 张」已作废，兜底图取消） |

**白底问题已被文生图方案天然解决**——prompt 里直接写 `pure white background, soft drop shadow`，实测 10/10 张四角纯白。**不再需要抠图、图生图或 CSS 套底。**

**体积一项已改完**：`compress_icons.py` 的 `max_size_kb` 默认已下调到 **25KB**（`--max-size-kb` 参数），降档循环终止条件同步调整，实测 347 张零超标。

---

## B.5 实测踩坑清单（本轮验证过，别再踩）

| # | 坑 | 现象 | 正确做法 |
|---|---|---|---|
| 1 | Pixabay 域名 | 写成 `api.pixabay.com` → 100% 失败 | 正确是 **`pixabay.com/api/`**，没有 `api.` 子域 |
| 2 | Pixabay `per_page` | 填 `1` → HTTP 400 | 官方要求 **3–200**，别填 1 或 2 |
| 3 | 搜索词未编码 | 带空格的关键词构造出非法 URL | 一律走 `urllib.parse.urlencode()` |
| 4 | 图片 URL 有效期 | Pixabay 返回的 URL **24 小时失效** | 必须**即时下载落盘**，不能存 URL 后续再用 |
| 5 | 热链接 | 直接引用 Pixabay 图片 URL | **禁止永久热链接**，必须下载到自己服务器/本地 |
| 6 | 署名 | 展示搜索结果需标明来源 | 若 App 内做图片署名位，标 **Pixabay** |
| 7 | SVG/附件权限 | 想要 1920px 全高清图 | `fullHDURL` / `imageURL` / `vectorURL` 需**额外申请完整 API 权限**，普通 Key 最大只有 1280 档 |
| 8 | Pexels 原图 | `src.original` 实测 **3017KB** | 改用 `src.large`（约 940px） |
| 9 | Windows 编码 | emoji 打印 → `UnicodeEncodeError` 崩溃 | 一律 `python -X utf8` |
| 10 | 压缩参数契约 | 给 `compress_icons.py` 传单文件 → 静默不产出 | 它只接受**目录→目录**；批量内调用应 import `compress_image()` 直接调函数 |
| 11 | 索引覆盖 | 跑 `--category fruits` 把 `icon_index.json` 冲成只剩 fruits | 索引必须**读旧文件合并写**，`stats` 按合并后真实条数重算 |
| 12 | 压缩子进程 | `os.system('python compress_icons.py ...')` 起的子进程不走 `-X utf8` | 改成**进程内 import 调用**，无编码问题也无契约问题 |
| 13 | PowerShell 读文件 | `Get-Content` 读 UTF-8 中文文件乱码 | 用正确编码读取，别用控制台默认 GBK 解码 |
| 14 | **Prompt 抽象词** | `assorted ingredients` → AI 只画 3–4 样（麻辣烫画成牛肉粉） | 必须**逐项枚举**具体食材（6–10 种） |
| 15 | **Prompt 器皿词** | `stainless steel hotpot` → 画成**铁盆**；`pot of hotpot` → **砂锅米线** | 器皿是第一识别特征，必须准确，靠**人工对照表**兜住 |
| 16 | **Prompt 主观形容词** | `milky brown` / `opaque` 把奶茶颜色描述偏，不如简单 prompt | 说「是什么」，别说「感觉像什么」 |
| 17 | 文案夹带背景 | 文本模型给苹果写 `sitting on wooden surface` → 会画出木桌 | 模板强制追加背景锁 + `no table, no props` |
| 18 | 文案夹带品牌 | 文本模型给薯条写 `red and white striped paper tray`（麦当劳包装） | 违反「v1.0 不做品牌」，文案审核时过滤 |
| 19 | 白底校验可自动化 | 人眼看白底容易漏 | 四角像素 `min(c) > 235` 判白，可脚本批量校验 |
| 20 | **中文文件名（路径必须 ASCII）** | 原名 `主食/p001-米饭.webp`，路径含中文 → URL 需 percent-encoding、Windows(GBK) 与 Linux/macOS(UTF-8) 互传乱码、打包工具与真机文件 API 兼容性不确定 | 目录用分类 ASCII key、文件名用食物 id：`staple/p001.webp`。可读性由 `food_library.json` 的 `name` 字段承担，不靠文件名 |

---

## B.6 制作食物库图标的执行顺序（定案流程）

> **执行状态（2026-09-22）**：本流程已跑完一轮，产出 347 张原始 PNG（`assets/icons-gen/`）→ 512 WebP → App 副本。
> 下面第 1 步的「240 张 / 5000 vs 18000 条」是当时的规划口径，现已定为**每食物一张专属图**（现库 347 条 = 347 张）；
> 后补的 p348–p353 六条**没走本流程**（无原始 PNG、曾用 92×92 小图）—— **该六条已于 2026-09-27 整体摘除，本流程无需补跑**从第 2 步起照常执行。

1. **定食物清单**：每个食物一张专属图（现 353 条；曾规划 Top 200 专属图 + ~40 品类兜底图 ≈ 240 张，兜底方案已作废）
   - 前置条件：~~Boss 拍板 v1.0 食物库做 **5000 条**还是 **18000 条**~~ → ✅ 已定 **347 条起步**（后补至 347 条）
2. **建器皿对照表**：人工维护「食物 → 标准器皿 + 视角 + 必填特征」，建议落 `toolchain/sources/icons.yaml`
3. **人工审对照表**（审核前置）：只看器皿一列，5 秒/个。**这是唯一能挡住"铁盆当火锅"这类错误的关卡**
4. **按模板拼 prompt**：`{器皿} + {内容物} + {逐项枚举配料} + {状态词} + {视角}` + 固定骨架
5. **批量生图**：20 路并发，347 张实测 5.45 分钟
6. **自动校验白底**：四角像素 `min(c) > 235`
7. **人工过目**：重点看器皿与主体。首轮预期合格率 **80%**
8. **失败项改 prompt 重做**：预期每个失败项 1–3 轮（越"料多"的食物越容易翻车）
9. **压缩**：`max_size_kb` 下调到 25KB，输出 512 WebP
10. **核对规格**：抽 10 张确认体积 15–25KB、白底干净、器皿与主体正确

---

# C. 份量与选项（数据线）

图标是「画什么」，这一节是「怎么算」——两条线共用同一份食物清单，但字段不要混。

## 三份源文件

| 文件 | 作用 | 谁维护 |
|---|---|---|
| `sources/vessel_tpl.yaml` | **计量器具模板集**（18 个器具：杯/碗/盘/个/串/包…，各带容量档位） | 人工维护 |
| `sources/opts_tpl.yaml` | **选项模板集**（`sweet` / `topping` / `sugar_pack` / `syrup_pump`） | 人工维护 |
| `sources/icons_v1_usage.yaml` | 347 项食物各自引用哪个器具模板、哪些选项模板 | 脚本生成（`gen_usage_spec.py`）+ 人工审 |

架构依据（`FoodLibraryPlan.md` 10.2 / 10.2.1）：**模板 + 引用**，不给任何单品硬编码字段。
食物条目不写死容量与选项，只写 `vessel_tpl: cup` / `opts_tpl: [sweet, topping]`。

## ⚠️ 命名区分：两个「容器」概念，严禁混用

| 名称 | 定义在哪 | 含义 | 例子 |
|---|---|---|---|
| **`vessel`** | `vessel_tpl.yaml`（**数据线**） | 计量器具模板，带容量档位 | `cup` = 小杯350 / 中杯500 / 大杯700 ml |
| **`container`** | `icons_v1_visual.yaml`（**图标线**） | 生图视觉容器描述（英文） | `a tall clear plastic cup` |

前者用来**算热量**，后者用来**画图**。取名时已刻意分开，改动时不要合并。

## 咖啡甜度为什么不能复用奶茶模板

奶茶的 `sweet` 是「5 档几分糖 × 按容量线性缩放」，而咖啡的甜度来源完全不同：

| 咖啡品类 | 选项模板 | 理由 |
|---|---|---|
| 美式咖啡 | `sugar_pack`（0/1/2 包） | 本身无糖，甜度靠另加白砂糖。1 包 4g × 4 kcal/g = 16 kcal |
| 速溶咖啡 | `sugar_pack` | 同上 |
| 拿铁 / 卡布奇诺 | `syrup_pump`（0–3 泵） | 奶咖，甜度来自风味糖浆，按泵计（1 泵约 5ml） |
| **摩卡** | **无选项** | 配方自带巧克力酱，甜度固定，不由用户选 |

**硬套奶茶的 `sweet` 会算错**（糖浆按 500ml 比例缩放的模型，用不到咖啡上）。

## 一条建模铁律：配方固定差异 → 拆独立条目

**只有「用户可调」的才出选项；「配方固定不同」的拆成独立食物条目。**

| 场景 | 错误做法 | 正确做法 |
|---|---|---|
| 无糖可乐 | 「可乐」条目 + 无糖选项 | 拆成独立条目 |
| 三合一速溶咖啡 | 「速溶咖啡」+ 全糖甜的选项 | 拆成独立条目（否则双计糖） |
| 摩卡 | 给甜度选项 | 无选项（配方固定） |
| 纯茶（绿茶/红茶/乌龙/普洱/茉莉花茶） | 给 `sweet` + `topping` | **自己泡的茶不含糖** → `mug` + 无选项；只有茶饮店现制产品（水果茶/柠檬茶）才给 `sweet` |

## 当前引用分布（347 项，实测自产物 `foods` 字段）

| vessel_tpl | 数量 | | opts_tpl | 数量 |
|---|---|---|---|---|
| piece（按个） | 171 | | `[sweet, topping]` 现制茶饮 | 4 |
| plate（按份） | 71 | | `[sweet]` 现制甜品饮品 | 2 |
| bag（袋装） | 20 | | `[sugar_pack]` 美式/速溶 | 2 |
| bowl_rice | 18 | | `[syrup_pump]` 拿铁/卡布 | 2 |
| bowl_noodle | 11 | | 其余 343 项 | 无选项 |
| cup（现制茶饮） | 6 | | | |
| 其余 12 类 | 56 | | | |

> `piece` 占比最高（171 项，约 48%）是正常的——水果、单块肉、蛋、单个零食都按「个」计。
> 但注意：`piece` 的 `amount = 1`，**必须由食物条目提供「1 个 = 多少克」**（现 196 条带 `pieceWeight`），否则无法算热量。

---

# D. 构建闸门（`hooks.py`）

`AGENTS.md`「Hooks 兜底强约束」一节原本只有承诺、零代码，**2026-09-22 落地为 `toolchain/hooks.py`**。
它把关键约束从「AI 自觉」变成自动化红灯拦截。

## 五道闸

| 闸门名 | 检查内容 | 失败动作 |
|---|---|---|
| `schema-version-check` | 产物 `app/src/data/food_library.json` 的顶层键与必填字段必须匹配 `toolchain/schema/v1.0.json`，且版本号对得上（schema 文件 v1.0 ↔ 数据 `v` 1.0.x）、`fingerprint` 完整 | 红灯拦截 |
| `food-data-integrity` | ① 条数三处对齐（`icons_v1.yaml` ↔ `fingerprint.count` ↔ `foods` 数组）；② `dist/` 与 `app/src/data/` 副本 sha256 一致；③ **禁手写食物数据**扫描：视图层（`pages`/`components`/`composables`）出现 `"pNNN"` id 字面量或 `name+img` 内联条目即拒；④ App 图标张数 ≠ 食物条数 → 警告 | 红灯拦截（图标数不等仅警告）。`stores/` 因演示种子计划经 Boss 授权引用 id，**豁免 id 检查但仍查内联条目** |
| `class-prefix-collision` | 组件（`app/components/`）定义的类名若同时被别的文件定义或使用 → 拒（mp-weixin 样式同池，同名互污） | 红灯拦截 |
| `pre-commit` | ① 暂存区内改过的代码/配置文件顶部必须含 `[变更日志]`；② 生成物（`app/src/data/food_library.json`、`app/static/icons/`）必须与 `toolchain/` 源变更同批提交 | 红灯拦截（`app/unpackage/`、`debug/shots/` 与生成物本身豁免） |
| `end-of-session` | 改了 `app/` 文件但 `docs/progress.md` 未进本次变更 | **只警告不拦**（AGENTS 规定失败动作＝提示补全） |

## 用法

```bash
python -X utf8 toolchain/hooks.py list        # 打印说明 + 可用检查
python -X utf8 toolchain/hooks.py all         # 依次跑全部五道闸（全绿 exit 0，任一红灯 exit 1）
python -X utf8 toolchain/hooks.py pre-commit  # 只跑提交闸
python -X utf8 toolchain/hooks.py install     # 把闸门写进 .git/hooks/pre-commit（可重复执行，重跑即更新）
```

> ⚠️ **`.git/hooks` 不随仓库分发**：换机器或新克隆后，闸门不会自动生效，**必须各自跑一次 `install`**。
> `install` 生成的钩子会跑 `all`（五道全跑），并在找不到 python 时打印提示后放行（不阻塞提交）。
> Windows 控制台 GBK 下脚本已把 stdout/stderr 降级为 `errors="replace"`，emoji 不再崩闸门。
