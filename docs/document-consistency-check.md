# 文档一致性检查报告 (Document Consistency Check)

**检查目标**：扫描 `AGENTS.md`, `docs/progress.md`, `docs/PRD.md`, `design/DesignTokens.md` 四份核心文档，识别工具引用、事实来源及废弃方案的冲突残留。

**执行时间**：2026-09-23
**当前事实基准**：当前设计源为 Pencil，Ardot 及相关链接均已废止（以 `progress.md` 为准）。

---

## 检查结果汇总

| 文档 | 状态 | 问题数量 | 主要冲突点 |
|---|:---:|:---:|---|
| **AGENTS.md** | ⚠️ 存在残留 | 2 处 | 工具链列表仍有 Ardot 词条；色值来源描述中仍有 Ardot 导出记录。 |
| **docs/progress.md** | ✅ 干净 / 已更新 | 0 处 | 明确记录了 Ardot 于 2026-09-21 废止，事实定义正确。 |
| **docs/PRD.md** | ✅ 干净 | 0 处 | 未发现与设计源或构建工具直接绑定的冲突信息。 |
| **design/DesignTokens.md** | ❌ 严重冲突 | >8 处 | 存在大量旧工具（Ardot）导出记录，且内部引用了旧版 AGENTS.md 规则。 |

---

## 详细异常清单

### 1. 事实来源冲突 (Source of Truth Conflicts)

- **`design/DesignTokens.md` (行 34)**：
  - **残留文本**：`按 AGENTS.md「以 Ardot 设计稿为唯一视觉准绳」的规则...`
  - **冲突说明**：此处不仅仍引用 Ardot，而且复述了一条**刚刚在 AGENTS.md 中被修改废止**的旧规则，形成典型的“事实同步滞后”冲突。

### 2. 已删除工具引用 (Deleted Tool References)

- **`AGENTS.md` (行 23)**：
  - **残留文本**：`| 设计工具 | Ardot（内置）+ Figma/Pixso（外部） |`
  - **冲突说明**：在“技术栈”表格中，Ardot 仍作为内置工具被列出，应替换为 Pencil。
- **`design/DesignTokens.md` (行 31 等多处)**：
  - **残留文本**：`提取方式：Ardot MCP export_variables / fetch_variables...`
  - **冲突说明**：记录了使用已废弃的 Ardot MCP 工具链及变量集。虽然作为历史记录有一定价值，但容易对新接入的 AI 造成“该工具依然可用”的幻觉。

### 3. 废弃方案残留 (Deprecated Solutions Residue)

- **`AGENTS.md` (行 29 等)**：
  - **残留文本**：`色值以 design/DesignTokens.md 为唯一事实来源（2026-09-19 从 Ardot 变量集导出...）`
  - **冲突说明**：虽然核心色值不变，但其来源注释未脱离对废止平台的绑定。
- **`design/DesignTokens.md` (行 156-157)**：
  - **残留文本**：`旧 Ardot 变量集...已于 2026-09-21 废止，故本节的值不再进 Ardot...`
  - **冲突说明**：文件自身甚至带有附录：`## 附：Ardot 变量集原始导出（供核对）`，由于工具已废除，该比对附录已失去业务价值，变为纯噪音。

## 结论与建议

目前已按指令**仅对 `AGENTS.md` 中的“唯一视觉准绳”条款执行了最小修复**。但系统中尤其是 `DesignTokens.md` 和 `AGENTS.md` 的其他段落中，存在较深的“工具历史烙印”。

**下一步建议**：
若要彻底消除多模型协作时的“工具幻觉”，建议发起一轮专项的《去 Ardot 化文本清理》，将 `DesignTokens.md` 中的历史变量映射表抹除，净化为纯粹的“当前色值字典表”。
