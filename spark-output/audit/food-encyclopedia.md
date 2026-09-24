# Audit — 轻律生活·食物百科页

- **生成时间**：2026-09-25T02:30:00+08:00
- **走查对象**：初版设计稿截图（详情页 + 搜索弹窗）
- **走查页面数**：2
- **走查模式**：引导对话（截图）+ 沿用上一轮暗黑/i18n/主题色调研结论作为 baseline
- **焦点**：暗黑模式 / 多主题色 / i18n 三轴预留缺口

## 总览

| 严重度 | 数量 |
| --- | --- |
| 🔴 Blocker | 0 |
| 🟠 Major | 5 |
| 🟡 Minor | 9 |

**按维度分布**：

| 维度 | findings 数 |
| --- | --- |
| consistency | 3 |
| recognition | 2 |
| real-world-match | 2 |
| aesthetic | 2 |
| responsive | 1 |
| visibility | 1 |
| user-control | 1 |
| error-prevention | 1 |
| flexibility | 1 |
| error-recovery / help-docs / performance | 0 |

## 改版机会点（按优先级排序）

### 🥇 高优先级

**机会点 1：建立食物百科页 token 角色映射表（暗黑+主题双轴一次到位）**
- 关联 findings：audit-1, audit-2, audit-3, audit-8, audit-9, audit-10, audit-11（7 个）
- 优先级理由：7 个 finding 全部指向"颜色/样式未绑定语义角色"，是三轴预留的根因。解决这一个，暗黑色板落地和多主题扩展都变成填表工作
- 影响范围：详情页全区块 + 搜索弹窗 + 未来所有新增页面
- 新增 token 角色候选：`chip-neutral` / `chip-accent` / `ring-accent` / `ring-neutral` / `overlay-mask-light` / `overlay-mask-dark` / `ink-icon` / `ink-icon-muted`

**机会点 2：i18n 词条结构按"模板+插值"而非"整句"设计**
- 关联 findings：audit-5, audit-6, audit-7, audit-13, audit-14（5 个）
- 优先级理由：5 个 finding 都是"文案写死导致翻译后破版或无法复用"。现在定好词条 schema（单位键/插值模板/括号拆分），后续 700-800 词条录入不走弯路
- 影响范围：详情页文案 + 搜索空态 + CTA + 全 App 复用词条
- 新增词典 category 候选：`unit.*` / `search.empty` / `action.add_to_meal` / `eating_method.*_note`

### 🥈 中优先级

**机会点 3：搜索弹窗交互态补全（三态+关闭通道+空态）**
- 关联 findings：audit-4, audit-11, audit-12, audit-13（4 个）
- 优先级理由：搜索是百科页入口，当前设计稿只覆盖了理想路径；补全异常态是上线前必做，顺带把 i18n 空态词条和暗态遮罩一起定了
- 影响范围：搜索弹窗组件

### 🥉 低优先级（细节优化包）

**机会点 4：信息密度与暗态层级复核**
- 关联 findings：audit-8
- 优先级理由：需要出新设计稿（Mint Dark 详情页 frame），工作量较大；建议在机会点 1 的 token 表定完后，用 token 驱动快速出暗态稿，避免手工调色返工
- 影响范围：详情页整体

## 完整 Findings 清单

### 维度 4：consistency（一致性与标准）

1. **[major]** 详情页主色（优质蛋白标签/营养tag/CTA按钮）硬编码薄荷绿，暗黑色板对应值未定义
   - 出现位置：详情页截图——优质蛋白标签、高蛋白/低脂肪/低碳水三tag、底部添加到早餐按钮
   - 修复建议：Pencil 绑定到 `accent` token；Mint Dark frame 赋 `#52D6AC`
   - 修复成本：quick-win

2. **[major]** 搜索弹窗热门搜索tag（灰底）与详情页营养tag（绿底）视觉语言不一致，暗黑下区分策略未定
   - 出现位置：搜索页🔥热门搜索5tag vs 详情页3营养tag
   - 修复建议：定义 `chip-neutral` vs `chip-accent` 两个token角色；暗态分别赋值
   - 修复成本：quick-win

3. **[minor]** 顶栏返回/搜索icon暗态是否反白未覆盖
   - 出现位置：详情页顶栏左返回+右搜索icon
   - 修复建议：归入 `ink-icon` token，暗态 `#FFFFFF`；多主题下跟随 `ink-1` 不跟随 accent
   - 修复成本：quick-win

### 维度 6：recognition（识别优于回忆）

4. **[major]** 热门搜索仅5固定词，无最近搜索；i18n后词条数翻倍可能溢出
   - 出现位置：搜索页底部🔥热门搜索5项
   - 修复建议：hot-search词条做有序数组；UI自适应换行或横滚；加最近搜索（本地存储无需翻译）
   - 修复成本：medium

5. **[minor]** 相关食物卡片单位混用（个/100g/5个），i18n需独立单位词条
   - 出现位置：相关食物区4卡片
   - 修复建议：i18n词典预留 `unit.piece` / `unit.per100g` / `unit.per5pieces`；UI拼接 `{value} {unit}`
   - 修复成本：medium

### 维度 2：real-world-match（系统与现实匹配）

6. **[major]** 营养点评长文本中文60字，译文×1.5-2倍可能溢出
   - 出现位置：详情页营养点评段落
   - 修复建议：`<text>` 组件+lines兜底；设计预留弹性高度；Pencil用auto-layout模拟最长译文
   - 修复成本：medium

7. **[minor]** 推荐吃法括号补充说明在RTL语言下方向反转
   - 出现位置：详情页推荐吃法列
   - 修复建议：括号内容拆为独立key；v1保证LTR多语言不破版，RTL作v2议题
   - 修复成本：medium

### 维度 8：aesthetic（美学与极简）

8. **[major]** 详情页9视觉区块挤一屏，暗态对比度压缩后层级易糊
   - 出现位置：详情页全貌
   - 修复建议：出Mint Dark详情页frame逐区块核对对比度≥3:1；多主题下accent色相变化同步验证圆环辨识度
   - 修复成本：major-rework

9. **[minor]** 4营养圆环纯色填充，暗态是否需要描边未定义
   - 出现位置：详情页主要营养素4圆环
   - 修复建议：`ring-accent` / `ring-neutral` token；暗态加1px `#FFFFFF20` 内描边
   - 修复成本：quick-win

### 维度 11：responsive（响应式适配）

10. **[major]** 搜索弹窗高度未标注，小屏可能遮挡列表；暗态遮罩透明度未定
    - 出现位置：搜索页整体布局
    - 修复建议：max-height=`min(60vh,480px)`；遮罩暗态 `#000000B0`；token `overlay-mask-light` / `overlay-mask-dark`
    - 修复成本：medium

### 维度 1：visibility（系统状态可见性）

11. **[minor]** 搜索框清空按钮三态未展示，暗态对比度需校验
    - 出现位置：搜索栏右侧X图标
    - 修复建议：补空/聚焦/有词三态；X色归 `ink-icon-muted`，暗态对比度≥4.5:1
    - 修复成本：quick-win

### 维度 3：user-control（用户控制与自由）

12. **[minor]** 搜索弹窗关闭路径仅取消按钮，遮罩/下滑/ESC未明示
    - 出现位置：搜索页顶栏取消按钮
    - 修复建议：明确三种关闭通道；取消文案复用全局 `action.cancel`
    - 修复成本：quick-win

### 维度 5：error-prevention（错误预防）

13. **[minor]** 搜索无结果态未展示，i18n需插值词条
    - 出现位置：搜索页仅有结果态
    - 修复建议：补空态设计；词条 `search.empty` 带 `{keyword}` 插值；插图用单色SVG跟随accent
    - 修复成本：medium

### 维度 7：flexibility（灵活性）

14. **[minor]** CTA把餐次名写死，未动态跟随当前时段；i18n餐次名应复用store枚举
    - 出现位置：详情页底部绿色按钮
    - 修复建议：模板化 `action.add_to_meal: "添加到 {meal} · {kcal} kcal"`；meal从store取默认餐次
    - 修复成本：medium

## 与上一轮调研结论的对齐检查

| 上一轮结论 | 本页是否兼容 | 缺口 |
|---|---|---|
| token (角色,mode,accent) 二维表 | ✅ 机会点1直接落地 | 需新增 chip/ring/overlay-mask/icon 4组角色 |
| accent/status 分轴 | ✅ 营养tag用accent，热量超标警示用status | 本页暂无status色使用场景，CTA确认是accent非status |
| i18n自有TS词典 | ✅ 机会点2词条schema可直接写入 | 单位键/插值模板需在词典schema新增category |
| ~700-800词条量级 | ⚠️ 本页新增约40-50词条 | 量级可控；需确认food_library.json 353食物名是否进词典（上一轮定案A1外部id-keyed map） |

## 下一步建议

- **改版方向**：基于机会点1-2，建议下一步走 `/brief` 把"食物百科页三轴预留规范"沉淀为一页纸，作为 Pencil 落地和后续开发的契约
- **修复优先**：audit-1 / audit-2 / audit-8 三个 major 项建议在 Pencil 完成初版后立即补 Mint Dark frame 验证，不要等开发阶段再返工
- **Blocker 预检**：本次无 blocker，但机会点1若不在 Pencil 阶段解决，开发期会变成 120+ 处 hex 手工替换 → 升级为 blocker 风险
