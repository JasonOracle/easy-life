# Audit — 轻律生活 CalTrack（状态色一致性走查）

- **生成时间**：2026-09-24 22:10
- **走查对象**：Boss 提供 4 张实拍截图（首页 / 日历 / 日详情 / 结算弹窗）＋ 代码仓库 `app/`
- **走查页面数**：7（Home / DayDetail / Records / SettleBadge / GoalModal / BottleLiquid / goal.ts）
- **走查模式**：自动（代码扫描）＋ 截图对照
- **优先维度**：consistency（Boss 明确提的「圆环/进度条/液体/文字同一规则」）

## 总览

| 严重度 | 数量 |
| --- | --- |
| 🔴 Blocker | 2 |
| 🟠 Major | 3 |
| 🟡 Minor | 2 |

**按维度分布**：

| 维度 | findings 数 |
| --- | --- |
| consistency | 5 |
| visibility | 1 |
| error-prevention | 1 |
| aesthetic | 1 |

---

## 改版机会点（按优先级排序）

### 🥇 高优先级 — 机会点 1：统一状态色系统（单一 source of truth）

- **关联 findings**：audit-1, audit-2, audit-5, audit-7
- **优先级理由**：四个 finding 指向同一根因——状态色定义散在 5 处，其中两处是坏的（BottleLiquid palette 写绿、status-bg-* 类不存在）。Boss 的核心诉求「圆环/进度条/液体/文字同一个规则」必须有一个统一入口才能保证不漂移。
- **影响范围**：Home（文字+液体）、DayDetail（进度条+圆环）、Records（进度条）、SettleBadge（圆环）、GoalModal（进度条+文字）、BottleLiquid（液体）

### 🥈 高优先级 — 机会点 2：全部改为比例阈值，禁用固定值

- **关联 findings**：audit-3
- **优先级理由**：Boss 明确说「不能设置固定值，因为后期热量设置弹窗可能把可选阈值弄更高」。GoalModal 的 1800/2100 是全工程唯一的固定值阈值，与 goal.ts 的 ratio 设计矛盾，目标改高后必然错位。
- **影响范围**：GoalModal（目标设置弹窗）

### 🥉 中优先级 — 机会点 3：SettleBadge 升级为三态

- **关联 findings**：audit-4
- **优先级理由**：结算弹窗是用户加餐后的关键反馈点，目前只有「超标/未超标」两态，缺了「接近上限」的琥珀预警。与首页/日历页三态不一致。
- **影响范围**：SettleBadge（结算弹窗圆环+文字）

### 🟢 低优先级 — 机会点 4：清理死代码 ringClass

- **关联 findings**：audit-6
- **优先级理由**：接口里留着未实现的字段会误导后续维护者。要么落地，要么删。
- **影响范围**：goal.ts（接口定义）

---

## 完整 Findings 清单

### 维度 4：consistency（一致性与标准）— 5 条

**1. 🔴 [blocker] BottleLiquid 调色板写错——超标液体仍是绿色**
- **出现位置**：`app/components/BottleLiquid.uvue:28-29`
- **证据**：`amber: ['#A8F0D8','#42D8AA','#1FBF8F','#0D9C73']`，`coral: ['#B8F4E0','#50DDB5','#25CE9C','#16A277']`——四个值全是薄荷绿变种，不是琥珀/珊瑚
- **修复建议**：按 DesignTokens §1（coral=#FF9E7D, amber=#E8B54D）重写两个 palette 为 4 级渐变，顶色带薄荷过渡底避免 100%→超标 跳变
- **修复成本**：quick-win（2 行）

**2. 🔴 [blocker] status-bg-* / status-ring-* 类名引用了但从未定义**
- **出现位置**：`app/stores/goal.ts:53-80` 定义引用；`app/pages/records/DayDetail.uvue:32`、`app/pages/records/Records.uvue:57` 绑定 bgClass
- **证据**：全仓 grep `status-bg-` / `status-ring-` 仅命中 goal.ts，零定义。DayDetail 的 `dd-fill` 和 Records 的 `lr-bar-green` 绑定静默失效——进度条在超标时不会变色
- **修复建议**：补定义六个类（bg 对应底色、ring 对应圆环描边色），或从接口删掉死字段
- **修复成本**：quick-win

**3. 🟠 [major] GoalModal 用固定值阈值（1800/2100），与全局 ratio 设计矛盾**
- **出现位置**：`app/components/GoalModal.uvue:130-136`
- **证据**：`if (picked.value <= 1800) ... else if (picked.value <= 2100) ...`——目标设为 2400 时分档完全错位
- **修复建议**：改成 `ratio = picked / goalVal`，复用 goal.ts 的 1.0 / 1.15 阈值
- **修复成本**：medium

**4. 🟠 [major] SettleBadge 只有两态，全工程其他地方都是三态**
- **出现位置**：`app/components/SettleBadge.uvue:79`
- **证据**：`const ringColor = overBudget ? 'rgba(232,181,77,1)' : 'rgba(31,191,143,1)'`——只有琥珀/绿，没有珊瑚
- **修复建议**：接入 `getCalorieStatus(after, goal)` 拿三态，ringColor 走 coral/amber/green 三选一
- **修复成本**：medium

**5. 🟡 [minor] 状态色命名两套并存（status-* vs gm-*）**
- **出现位置**：`Home.uvue:691-699`（status-text-*）vs `GoalModal.uvue:447-465`（gm-bg-*/gm-clr-*）
- **证据**：同一套 coral/amber/green 语义有两个命名族，维护时容易漏改
- **修复建议**：统一为 status-*（goal.ts 已在用），GoalModal 迁移过去
- **修复成本**：medium

### 维度 1：visibility（系统状态可见性）— 1 条

**6. 🟠 [major] DayDetail / Records 进度条在超标时视觉不变色**
- **出现位置**：`app/pages/records/DayDetail.uvue:32`、`app/pages/records/Records.uvue:57`
- **证据**：绑定 `calStatus.bgClass` → `status-bg-coral`（不存在），进度条永远是底色。用户只能靠文字「已超标」判断状态
- **修复建议**：同 finding 2——补定义 status-bg-* 类
- **修复成本**：quick-win

### 维度 9：error-prevention（错误预防）— 1 条

**7. 🟡 [minor] ringClass 死代码**
- **出现位置**：`app/stores/goal.ts:44` 定义，全仓零消费
- **证据**：grep `ringClass` 仅命中 goal.ts，无任何 .uvue 使用
- **修复建议**：要么实现（首页百分比圆环、DayDetail 圆环接状态色），要么从接口删掉
- **修复成本**：quick-win

---

## Boss 截图对应的实际现状

| 截图位置 | 圆环 | 进度条 | 液体 | 文字 | 实际状态 |
| --- | --- | --- | --- | --- | --- |
| 首页 Hero | — | — | 🟢 绿（错） | 🟠 珊瑚 #FF9E7D ✅ | 液体未跟随文字 |
| 首页百分比圆环 | 🟠 珊瑚 ✅ | — | — | 🟠 珊瑚 ✅ | 正常 |
| 日历页 | — | 🟠 珊瑚 ✅ | — | 🟠 珊瑚 ✅ | 正常 |
| 日详情页 | — | ⚪ 无色（类不存在） | — | 🟠 珊瑚 ✅ | 进度条静默失效 |
| 结算弹窗 | 🟡 琥珀（二态） | — | — | 🟡 琥珀 | 只有两态 |

---

## 下一步建议

- **改版方向**：基于机会点 1（统一状态色系统）和机会点 2（比例阈值），建议下一步走 Brief 把「单一 `getStatusColor(ratio)` 函数 + DesignTokens 状态色扩展」沉淀为一页纸。
- **修复优先**：Blocker 项（audit-1 调色板、audit-2 缺类）建议在改版工程启动前先修——都是 quick-win，修完立刻有视觉变化。