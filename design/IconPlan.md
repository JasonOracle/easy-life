# CalTrack - 图标方案（Pixabay + iconfont.cn 混合策略）

<!--
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[首部「现行方案」表按实际状态校准：食物图标计数 347→353（p348–p353 六条后补，其中 6 张现为 92×92 小图待重生图）；产物唯一入库副本改为 app/static/icons/（assets/icons-final/ 已列入 .gitignore，仅作压缩中间产物）；补 assets/icons-gen/ 现状（347 张原始 PNG，六条后补项无原图）。正文历史方案部分未动]
-->

> ⚠️ **本方案已废止（2026-09-19），仅作决策历史保留**
>
> 本文是项目早期的图标方案。其中**核心论证已被推翻**——§3.1「为什么用 Pixabay 而不是 AI 生成」的结论
> 与最终决策**相反**：实测 Pixabay/Pexels 的真实照片**全部带背景**，与设计要求「白底 + 柔和投影」冲突
> （已下载 34 张中，白底命中 **0**，仅有的 5 张白底图还是早期 Agnes 生成的）。
>
> **现行方案**（以这两份为准）：
> | 项 | 现方案 |
> |---|---|
> | 食物图标 | **Agnes AI 文生图**（`agnes-image-2.5-flash`），353 张**全专属图**，已完成（2026-09-22 校准：库现 353 条＝首批 347 ＋ p348–p353 六条后补；**已知待办**：这六条无原始生图 PNG，且在 App 内为 92×92 小图（其余 512×512），重跑生图需 API 额度） |
> | 流程与 Prompt 规约 | `toolchain/README.md` B 章节 |
> | 范围与产出规格 | `docs/FoodLibraryPlan.md`「v1.0 范围冻结」 |
> | 产物 | **唯一入库副本** `app/static/icons/<catKey>/<id>.webp`（353 张）。`assets/icons-final/` 为压缩中间产物（与 App 副本逐文件全等），2026-09-22 起列入 `.gitignore` 不再入库；`assets/icons-gen/` 仍入库＝347 张原始 PNG + `_report.json`（p348–p353 六条无原图） |
> | UI 图标 | iconfont.cn SVG —— **这部分仍然有效**，见 §5/§6 |
>
> **实测对比**：真实照片方案白底命中率 **0/29**；AI 文生图方案白底命中率 **347/347（100%）**。
>
> **保留本文的原因**：记录早期决策与论证过程（含被推翻的理由），供追溯。

## 一、视觉风格定位

参考截图中的图标风格：
- **真实感**：食物摄影风格，非扁平化图标
- **白底**：纯白或浅色背景，圆角
- **阴影**：轻微投影，有立体感
- **构图**：食物居中，俯视或45度角
- **统一性**：同类食物风格一致

## 二、混合策略总览

```
┌──────────────────────────────────────────────────┐
│                  CalTrack 图标体系                  │
├──────────────────────┬───────────────────────────┤
│   食物分类图标        │   App UI 图标              │
│   (~100-150个)       │   (~30-50个)               │
├──────────────────────┼───────────────────────────┤
│   来源：Pixabay       │   来源：iconfont.cn        │
│   格式：PNG 真实照片   │   格式：SVG 矢量            │
│   用途：食物列表展示   │   用途：导航/按钮/设置      │
│   尺寸：512×512       │   尺寸：24×24 viewBox      │
└──────────────────────┴───────────────────────────┘
```

**核心逻辑：**
- 食物图标需要**真实感** → Pixabay 摄影照片最合适
- UI 图标需要**矢量缩放** → iconfont.cn SVG 最合适
- 两套体系互不替代，各用其所长

## 三、Pixabay 食物图标方案

### 3.1 为什么用 Pixabay 而不是 AI 生成

| 维度 | AI 生成 | Pixabay |
|------|---------|---------|
| 真实感 | 取决于模型能力 | 已有 90,000+ 真实食物照片 |
| 一致性 | 需要反复调 prompt | 同一摄影师风格天然统一 |
| 时间成本 | ~180 张 × 2-3 分钟 | 搜索 + 筛选 + 下载 |
| 风格控制 | 需要反复迭代 | 搜索结果直接可见，按缩略图挑选 |
| 成本 | 每张消耗 token | 免费（有 API key） |

### 3.2 Pixabay API 关键参数

```
API Endpoint: https://pixabay.com/api/
API Key: 用户已注册
速率限制: 100 requests / 60 seconds
结果缓存: 24 小时
禁止: 热链（必须下载到本地）
支持格式: photos (PNG/JPEG), vectors (SVG)
```

### 3.3 搜索策略

每个食物分类的搜索流程：

```
1. 构建搜索词（英文，具体描述）
   例: "apple white background studio" / "steamed bun mantou"

2. 调用 API: GET /api/v1/photos/?q=...&image_type=photo&per_page=20

3. 按缩略图人工/AI 筛选：
   - 食物主体清晰
   - 背景简洁（白底优先）
   - 构图居中
   - 光线均匀

4. 下载 medium/2x 分辨率原图

5. 后处理：
   - 统一白色背景
   - 裁剪为正方形 512×512
   - 添加统一柔和阴影
```

### 3.4 分类图标清单（Pixabay 搜索词）

#### 水果类（15个）
```
apple.png         → "apple white background isolated"
banana.png        → "banana white background"
orange.png        → "orange fruit white background"
grape.png         → "grapes white background"
watermelon.png    → "watermelon slice"
strawberry.png    → "strawberries white background"
mango.png         → "mango fruit"
pineapple.png    → "pineapple"
peach.png         → "peach fruit"
cherry.png        → "cherries"
kiwi.png          → "kiwi fruit sliced"
lemon.png         → "lemon"
pear.png          → "pear"
melon.png         → "cantaloupe melon"
coconut.png       → "coconut"
```

#### 蔬菜类（15个）
```
broccoli.png      → "broccoli white background"
carrot.png        → "carrot"
tomato.png        → "tomato white background"
cucumber.png      → "cucumber"
potato.png        → "potato"
onion.png         → "onion"
garlic.png        → "garlic"
lettuce.png       → "lettuce"
pepper.png        → "bell pepper"
eggplant.png      → "eggplant"
pumpkin.png       → "pumpkin"
sweet_potato.png  → "sweet potato"
spinach.png       → "spinach"
celery.png        → "celery"
corn.png          → "corn on the cob"
```

#### 肉类/蛋白质（15个）
```
beef.png          → "raw beef steak"
chicken.png       → "chicken breast"
pork.png          → "pork meat"
lamb.png          → "lamb meat"
fish.png          → "fish whole"
shrimp.png        → "shrimp raw"
egg.png           → "egg white background"
bacon.png         → "bacon slices"
steak.png         → "cooked steak"
tofu.png          → "tofu block"
squid.png         → "squid"
crab.png          → "crab"
oyster.png        → "oyster"
duck.png          → "duck meat"
ham.png           → "ham sliced"
```

#### 主食类（15个）
```
rice.png          → "bowl of white rice"
noodles.png       → "noodles bowl"
bread.png         → "bread loaf"
pasta.png         → "pasta spaghetti"
dumpling.png      → "dumplings"
biscuit.png       → "biscuit cookies"
mooncake.png      → "mooncake"
vermicelli.png    → "vermicelli noodles"
skewer.png        → "meat skewer kebab"
hotpot.png        → "hot pot"
curry_rice.png    → "curry rice"
soup.png          → "soup bowl"
sandwich.png     → "sandwich"
burrito.png      → "burrito"
burger.png       → "hamburger cheeseburger"
```

#### 饮品类（15个）
```
milk.png          → "glass of milk"
coffee.png        → "coffee cup"
tea.png           → "tea cup"
juice.png         → "orange juice glass"
soda.png          → "soda can cola"
beer.png          → "beer glass"
wine.png          → "wine glass"
bubble_tea.png    → "bubble tea"
soy_milk.png      → "soy milk"
cocktail.png      → "cocktail"
water.png         → "water glass"
energy_drink.png  → "energy drink can"
smoothie.png      → "smoothie bowl"
kefir.png         → "kefir yogurt drink"
matcha.png        → "matcha tea bowl"
```

#### 零食类（15个）
```
fries.png         → "french fries"
popcorn.png       → "popcorn bowl"
chocolate.png     → "chocolate bar"
cookie.png        → "cookies"
candy.png         → "candy"
ice_cream.png     → "ice cream scoop"
nuts.png          → "mixed nuts"
cake.png          → "cake slice"
pancake.png       → "pancake stack"
donut.png         → "donut"
chips.png         → "potato chips"
cheese.png        → "cheese block"
yogurt.png        → "yogurt cup"
honey.png         → "honey jar"
protein_bar.png   → "protein bar"
```

#### 调味品类（10个）
```
olive_oil.png     → "olive oil bottle"
salt.png          → "salt shaker"
soy_sauce.png     → "soy sauce bottle"
vinegar.png       → "vinegar bottle"
honey.png         → "honey jar"  (与零食类共用)
sugar.png         → "sugar cubes"
chili_sauce.png   → "chili sauce"
peanut_butter.png → "peanut butter jar"
butter.png        → "butter stick"
sesame_oil.png    → "sesame oil bottle"
```

#### 品牌 Logo（50-100个）

品牌 Logo 不从 Pixabay 获取，直接从品牌官网/公开素材下载或使用已有矢量素材：

```
麦当劳、肯德基、星巴克、瑞幸、必胜客、赛百味、汉堡王、达美乐、华莱士、
海底捞、喜茶、奈雪、蜜雪冰城、古茗、茶百道、CoCo、一点点、书亦、益禾堂、
吉野家、食其家、和府捞面、味千拉面、西贝、外婆家、绿茶、望湘园、广州酒家、
陶陶居、稻香、大三元、杨国福、张亮麻辣烫、正新鸡排、德克士、塔斯贝尔、
全聚德、东来顺、兰州拉面、沙县小吃、黄焖鸡米饭、隆江猪脚饭、煲仔饭、
石锅拌饭、拉面、刀削面、热干面、过桥米线、小笼包、生煎、灌汤包、烧麦、
叉烧包、糯米鸡、肠粉、虾饺、烧鹅、白切鸡、烤鸭
```

品牌 Logo 处理方式：统一白色背景、透明 PNG、保持品牌原始配色。

### 3.5 后处理流程

```
Pixabay 原图下载
    ↓
1. 去除复杂背景（AI 抠图或手动）
2. 统一白色背景
3. 裁剪为 512×512 正方形
4. 添加统一柔和投影（bottom shadow, 10px blur, opacity 15%）
5. PNG 压缩（目标 < 50KB/张）
6. 命名规范：{category}/{name}.png
```

### 3.6 工作量估算

| 步骤 | 预估时间 |
|------|---------|
| 搜索词准备 + 分类整理 | 2 小时 |
| Pixabay 搜索 + 筛选（~100个分类） | 3-4 小时 |
| 下载 + 后处理（批量脚本） | 2 小时 |
| 质量检查 + 替换不佳图标 | 2 小时 |
| 品牌 Logo 收集整理 | 2 小时 |
| **总计** | **~11-12 小时** |

比 AI 生成方案（~180 张 × 2-3 分钟 + prompt 调优）更可控，风格更统一。

## 四、iconfont.cn App UI 图标方案

### 4.1 用途

App 内的**矢量 UI 图标**，不是食物图标：

```
底部导航栏：首页、加号、我的
顶部导航：返回、搜索、设置
功能按钮：删除、编辑、分享、收藏
状态图标：完成、警告、空状态
图表元素：环形图、趋势图
```

### 4.2 为什么用 iconfont.cn

- **矢量 SVG**：任意缩放，高清不模糊
- **免费商用**：阿里出品，规范可靠
- **搜索丰富**：中文搜索，精准匹配
- **AI 生图**：内置 AI 图标生成
- **格式统一**：viewBox 一致，便于批量处理

### 4.3 iconfont 搜索/下载流程

```
1. iconfont.cn 搜索关键词（中文）
   例: "首页" / "加号" / "设置" / "返回"

2. 筛选：
   - 单色图标（适合 UI）
   - 风格统一（全部同一种风格）
   - 2px 线宽

3. 下载 SVG（不要 iconfont 默认的 JS/CSS）

4. 后处理：
   - 统一 viewBox 为 "0 0 24 24"
   - 统一 stroke 颜色通过 CSS 变量控制
   - 去除多余 metadata
```

### 4.4 UI 图标清单（~30-50个）

```
导航类：
home.png / home_filled.png     - 首页（空心/填充）
plus.png                       - 加号/添加
user.png / user_filled.png     - 我的（空心/填充）

功能类：
search.png                     - 搜索
back.png                       - 返回
settings.png                   - 设置
delete.png                     - 删除
edit.png                       - 编辑
share.png                      - 分享
favorite.png / filled.png      - 收藏
cart.png                       - 食物库
camera.png                     - 拍照
mic.png                        - 语音
history.png                    - 历史
trend.png                      - 趋势
calorie.png                    - 卡路里
food.png                       - 食物（通用 fallback）

状态类：
success.png                    - 成功
warning.png                    - 警告
empty.png                     - 空状态
loading.png                    - 加载中
offline.png                    - 离线
update.png                     - 更新
```

### 4.5 图标使用规范

```css
/* SVG 颜色通过 CSS 变量控制，支持主题切换 */
.icon {
  width: 24px;
  height: 24px;
  stroke: var(--icon-color, #18191C);
  stroke-width: 2;
  fill: none;
}

/* 填充态切换 */
.icon.filled {
  fill: var(--icon-color, #18191C);
  stroke: none;
}
```

## 五、两套图标的协作关系

```
┌──────────────────────────────────────────────────┐
│                   App 界面                        │
│                                                    │
│  ┌── 食物列表 ───────────────────────────────┐     │
│  │ 🍎 苹果              [Pixabay PNG]         │     │
│  │ 🍚 米饭              [Pixabay PNG]         │     │
│  │ 🍔 汉堡              [Pixabay PNG]         │     │
│  │ 🥗 沙拉              [Pixabay PNG]         │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
│  ┌── UI 控件 ────────────────────────────────┐     │
│  │ 🔍 [iconfont SVG]    💚 [iconfont SVG]    │     │
│  │ ← [iconfont SVG]              ⚙️ [iconfont] │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
│  └── TabBar ──────────────────────────────────┐   │
│     🏠 [iconfont]    ➕ [iconfont]    👤 [iconfont]│   │
│     └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

**关键原则：**
- 食物图标 = 真实感优先 → Pixabay PNG
- UI 图标 = 矢量/缩放优先 → iconfont SVG
- 两套图标**不混用**，各司其职

## 六、fallback 策略

```
食物图标：
  苹果 → icons/fruits/apple.png ✅
  青苹果 → icons/fruits/apple.png ✅（同类共享）
  未知食物 → icons/default/food.png ⚠️（通用 fallback）

UI 图标：
  首页 → ui/home.svg ✅
  未知操作 → ui/unknown.svg ⚠️
```

## 七、性能考虑

| 指标 | 食物图标 (Pixabay PNG) | UI 图标 (iconfont SVG) |
|------|----------------------|----------------------|
| 格式 | PNG 512×512 | SVG 24×24 |
| 单个体积 | < 50KB | < 5KB |
| 总体积 | < 10MB | < 200KB |
| 加载方式 | 懒加载 + LRU 缓存 | 内联 SVG / 雪碧图 |
| 内存占用 | LRU 缓存 < 20MB | 几乎为零 |
| 缩放 | 固定尺寸（不缩放） | 任意缩放 |

## 八、工作流程

### 8.1 食物图标（Pixabay）

```
1. 准备 ~100 个分类搜索词
2. 批量调用 Pixabay API 搜索
3. AI/人工筛选最佳匹配
4. 下载原图
5. 批量后处理（抠图 + 白底 + 阴影 + 压缩）
6. 质量检查 + 替换不佳图标
7. 构建 icon_index.json
```

### 8.2 UI 图标（iconfont.cn）

```
1. 准备 ~40 个 UI 图标关键词
2. iconfont.cn 搜索 + 筛选
3. 下载 SVG
4. 统一 viewBox + stroke-width
5. 构建 ui_icon_index.json
```

### 8.3 集成

```
food_library/
├── icons/              # Pixabay 食物图标
│   ├── fruits/
│   ├── vegetables/
│   ├── meat/
│   ├── staple/
│   ├── drinks/
│   ├── snacks/
│   ├── condiments/
│   └── default/
├── ui_icons/           # iconfont UI 图标
│   ├── nav/
│   ├── action/
│   └── status/
├── brands/             # 品牌 Logo
└── index.json          # 食物数据 + 图标映射
```