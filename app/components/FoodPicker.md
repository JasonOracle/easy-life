# FoodPicker.uvue — 弹层⓪ 食物选择列表

<!--
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[1. 记入本轮类名 `fp-` 全量收口的范围、连带改动的 debug/ 探针脚本与验收脚本；2. 更正遮罩条目——四弹层已迁微信原生 page-container，自研 `.fp-mask` 与「黑 50% vs 墨绿 35%」两套遮罩色对比同时作废；3. 图标张数按实测改准（347+ → 353）]
-->

> 对应代码：`app/components/FoodPicker.uvue`
> 设计稿：Pencil 画板 `n3dgv`「弹层⓪ 食物选择列表」（375×812，@2x 导出 `shots/n3dgv.png`）

## 用途

底部弹层形式的食物选择列表：搜索 + 分类筛选 + 单选，点行即选中并关闭，把 foodId 交给宿主
（首页）再唤起弹窗① AddFood。是「添加食物」链路的第一跳。

## 依赖

- **数据**：`stores/food.ts` 的 `ALL_FOODS`（分类 chips 去重序）、`searchFoods()`（名称/全拼/首字母
  三路匹配，拼音索引 `py` 由 `toolchain/build.py` 生成）、`vesselLabelOf()` / `vesselSizesOf()`（副行
  「一碗约 200g」拼句）
- **素材**：`/static/icons/<catKey>/<id>.webp`（库内真实食物图标，353 张）、
  `/static/common/search_icon.png`（从 Pencil `SearchIcon` 节点 @4x 导出）
- **被谁用**：`pages/home/Home.uvue`（FAB → 本弹层 → AddFood；AddFood「更换」→ 本弹层回显）、
  `pages/records/DayDetail.uvue`（dd-add → 本弹层 → AddFood）
- **原生壳**：page-container（微信内置组件，产物 json 无需 usingComponents 注册；2026-09-22 迁移）
- **组件对**：`AddFood.uvue`（弹窗①，其 `.change-btn` emit `change` 触发本弹层重开）

## 设计决策

- **弹层壳＝原生 page-container**（2026-09-22，Boss 拍板迁移，参考官方示例 pages/component/page-container）：
  自研 `.fp-mask` fixed 层＋z900＋点蒙层关闭全部退役；position=bottom 原生滑入滑出＋原生蒙层＋拦截系统返回。
  容器外观（560 高/白底/顶圆角 34）走 `custom-style`，`.fp-sheet` 只留 `flex:1`＋内边距。
  **MP 端必须 v-if 与 :show 双条件**（官方写法，条件编译内嵌标签）；**原生蒙层点按不自动关闭**（实测），
  须绑 `@clickoverlay` 回传 `update:show=false`，`@afterleave` 兜底同步（系统返回路径）
- **类名 `fp-` 前缀**（2026-09-21）：mp-weixin 端同名类跨组件文件污染（`.sheet{height:560}` 曾强加给
  AddFood/GoalModal 的 sheet，`.mask/.chip` 三家各异互覆），冲突类统一加前缀
- **类名 `fp-` 全量收口**（2026-09-22 文档审计发现）：上一轮只给「当时已知冲突」的类加了前缀，
  `.row/.row-text/.row-sub/.row-div` 仍与 **Settings 页**同名类互污（页面 wxss 与组件 wxss 同池，后加载者胜）。
  现组件内**所有**类一律 `fp-`（row 家族 8 个 + search-box/search-icon/search-input/chip-bar/chip-text/chip-text-on/food-list/radio/radio-on/radio-check），
  样式数值零改动。滚动定位用的 `id="row-<foodId>"` 是元素 ID 不是类名，保持原样。
  **连带**：`debug/` 里以 `.page >>> .row` 探首行的脚本（measure_addfood／settle_probe／settle_probe2／settle_probe3／settle_diag）已改 `.page >>> .fp-row`；
  验收脚本＝`debug/prefix_check.js`（截图 `debug/shots/audit/prefix_*.png`）

| 决策 | 原因 |
|---|---|
| 弹层内部用 `scroll-view`（chips 横向 + 列表纵向） | Boss 否决的是**页面级** scroll-view；定高 560 弹层内部滚动在小程序端无原生替代。页面滚动仍走原生（见 AGENTS.md 已知风险首条） |
| 分类 chips 用库内真实 7 类（全部＋首次出现序去重），不硬编码设计稿上的 5 类 | Boss 拍板「按照库里实际 7 类做」；稿面第 6 chip 被裁切即暗示横向可滚 |
| 缩略图用真实 webp 食物图标，不用稿面 lucide 线性图标 | Boss 拍板「图标也按真实的来」 |
| 首次打开无选中（`selectedId=''` 时无任何高亮行） | Boss 拍板；回显只服务于「更换」路径 |
| 点行 = 选中 + 立即关闭（无确认钮） | 稿面单选圈仅表达回显，交互流定义在需求原话：「选择食物后，变成添加食物弹窗」 |
| 每次打开重置搜索词与分类（watch show） | 上一轮搜索词残留会让「更换」重开时列表只剩几条，与回显语义冲突 |
| 列表 `scroll-into-view="row-<selectedId>"` | 验收截图发现重开后残留滚动位、选中行不在视野内；弹层关闭即卸载，挂载时该属性天然生效 |
| 副行后缀规则：有 opts → 「支持杯型与甜度」；否则器具默认档为 g/ml → 「一{器具}约 {克重}」；计件类（个/片/串）无后缀 | 对齐稿面三种行：珍珠奶茶 / 米饭（熟）/ 香蕉·苹果。稿面鸡胸肉的「· 生」是状态修饰词，数据模型无此字段，**未实现**（待 Boss 定夺是否加 source 后缀字段） |
| 遮罩＝原生 page-container 默认蒙层（不再自绘） | 2026-09-22 校准：本组件与 AddFood 均已迁原生壳，自研 `.fp-mask` 与「黑 50% vs 墨绿 35%」的两套遮罩色对比**同时作废**，蒙层观感由原生统一给 |

## 边界与降级

- 搜索无结果：列表为空（稿面未定义空态，不擅自加文案）
- 拼音数据缺失（`py` 为空）：仅名称匹配仍工作（searchFoods 内 null 防护）
- 353 行一次性渲染：小程序端 image 懒加载未验证，如真机卡顿再上窗口化
- 触觉：chips/行点击 `uni.vibrateShort()`（L1 档），无触觉设备 try/catch 静默

## 与设计稿的对应

- Sheet：稿 y=252 起、高 560、顶圆角 34 → `height:560px; border-top-*-radius:34px`
- Handle 41×4 r2 #DCEDE6；搜索框 335×46 r23 #F5FAF8 描边 #EAF3EF，图标 18×18
- Chips 60×34 r17 间距 8：选中 #1FBF8F 白字 13/600，未选 #F8F9FC 字 #8FAEAF
- 行 335×76 r16：缩略图 48×48 r16 底 #EAF9F3；名称 15.5/700 #0A4F3D；副行 12px #8FAEAF；
  单选圈 22×22（off 描边 #BFE3D6 1.5px / on #1FBF8F＋白 ✓）；分隔线 x=60 起 1px #EAF3EF
- 选中行：底 #F2FAF5、副行 #0F4F3D 600
- 不一致处：稿面示例数据（52 kcal 苹果等）与库内真实值不同 — 一律以真实数据渲染（Boss 定规）

## 验收记录（2026-09-21，模拟器 390×844）

- `r8_2` FAB → 列表打开，全部/7 类 chips、真实图标行、副行后缀正确
- `r8_3d` 输入 `pg` → 糖醋排骨/排骨/培根等首字母命中（经组件 bindinput 处理器直调验证）
- 坐标点行 → AddFood 打开且食物＝糖醋排骨（520 kcal，份/半份/一份/两份 底槽正确）
- `r7_4`/`r7_5` 更换 → 列表回显高亮（选中行 mint 底＋绿圈白勾）；蔬菜 chip → 列表只剩蔬菜
- 遗留：chips 横向滚动、搜索框软键盘真实键入未在协议层验证（逻辑层已证）
