#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
半自动生成 project-map.md —— 扫描 app/ 下的 .uvue/.ts 文件，提取：
- 组件合同（defineProps / defineEmits）
- Pinia store 结构（state / getters / actions）
- 路由表（从 pages.json 读取）
- 类名前缀冲突检测

用法：
    python toolchain/gen_project_map.py > project-map.md

[变更日志] 2026-09-25: 新建脚本，支持 pages.json 首行 // 注释跳过 + Windows UTF-8 输出兜底
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APP_DIR = ROOT / "app"
PAGES_JSON = APP_DIR / "pages.json"


def scan_component_contracts():
    """扫描 components/*.uvue，提取 defineProps / defineEmits"""
    contracts = []
    comp_dir = APP_DIR / "components"
    if not comp_dir.exists():
        return contracts

    for f in sorted(comp_dir.glob("*.uvue")):
        name = f.stem
        content = f.read_text(encoding="utf-8")

        # 提取 defineProps
        props_match = re.search(r'defineProps<\{([^}]+)\}>', content, re.DOTALL)
        props_block = props_match.group(1).strip() if props_match else ""

        # 提取 defineEmits
        emits_match = re.search(r"defineEmits<\{\s*\(([^)]+)\)", content, re.DOTALL)
        emits_block = emits_match.group(1).strip() if emits_match else ""

        contracts.append({
            "name": name,
            "props": props_block,
            "emits": emits_block,
        })
    return contracts


def scan_store_structure():
    """扫描 stores/*.ts，提取 state / getters / actions"""
    stores = []
    store_dir = APP_DIR / "stores"
    if not store_dir.exists():
        return stores

    for f in sorted(store_dir.glob("*.ts")):
        name = f.stem
        content = f.read_text(encoding="utf-8")

        # 简单启发式：找 defineStore 内的 key
        state_keys = re.findall(r'(\w+):\s*(ref|reactive|computed)', content)
        action_names = re.findall(r'(const \w+ = \([^)]*\) =>|function \w+\()', content)

        stores.append({
            "name": name,
            "state_keys": [k[0] for k in state_keys],
            "action_count": len(action_names),
        })
    return stores


def read_pages_json():
    """从 pages.json 读取路由表（跳过首行 // 注释）"""
    if not PAGES_JSON.exists():
        return []
    raw = PAGES_JSON.read_text(encoding="utf-8")
    # uni-app x 的 pages.json 首行允许 // 注释，json.loads 不认
    lines = raw.splitlines()
    if lines and lines[0].strip().startswith("//"):
        raw = "\n".join(lines[1:])
    data = json.loads(raw)
    pages = data.get("pages", [])
    return [{"path": p["path"], "style": p.get("style", {})} for p in pages]


def detect_class_prefix_collisions():
    """检测跨文件类名冲突"""
    from collections import Counter
    class_counter: dict[str, list[str]] = {}

    for f in APP_DIR.rglob("*.uvue"):
        rel = str(f.relative_to(APP_DIR))
        content = f.read_text(encoding="utf-8")
        # 匹配 .class-name 模式
        classes = re.findall(r'\.([a-z][a-z0-9_-]*)', content)
        for cls in classes:
            if cls not in class_counter:
                class_counter[cls] = []
            class_counter[cls].append(rel)

    collisions = {k: v for k, v in class_counter.items() if len(v) > 1}
    return collisions


def generate_markdown():
    """生成 project-map.md 内容"""
    contracts = scan_component_contracts()
    stores = scan_store_structure()
    pages = read_pages_json()
    collisions = detect_class_prefix_collisions()

    lines = [
        "# Project Map — AI 专用结构事实",
        "",
        "> 本文件由 `toolchain/gen_project_map.py` 半自动生成。",
        "> 修改后请运行 `python toolchain/gen_project_map.py > project-map.md` 更新。",
        "",
        "---",
        "",
        "## 1. 组件合同 (Component Contracts)",
        "",
        "| 组件 | Props | Emits |",
        "|---|---|---|",
    ]

    for c in contracts:
        props_preview = c["props"][:80].replace("\n", " ") + ("…" if len(c["props"]) > 80 else "")
        emits_preview = c["emits"][:80].replace("\n", " ") + ("…" if len(c["emits"]) > 80 else "")
        lines.append(f"| **{c['name']}** | `{props_preview}` | `{emits_preview}` |")

    lines.extend([
        "",
        "---",
        "",
        "## 2. Pinia Store 结构",
        "",
        "| Store | State Keys | Actions |",
        "|---|---|---|",
    ])

    for s in stores:
        keys_str = ", ".join(s["state_keys"][:5])
        if len(s["state_keys"]) > 5:
            keys_str += "…"
        lines.append(f"| **{s['name']}** | `{keys_str}` | {s['action_count']} 个 |")

    lines.extend([
        "",
        "---",
        "",
        "## 3. 路由表 (Routing Table)",
        "",
        "| 路径 | navigationStyle |",
        "|---|---|",
    ])

    for p in pages:
        nav_style = p["style"].get("navigationStyle", "default")
        lines.append(f"| `{p['path']}` | {nav_style} |")

    lines.extend([
        "",
        "---",
        "",
        "## 4. 类名前缀冲突检测",
        "",
    ])

    if collisions:
        lines.append("**以下类名在多个文件中出现，需加组件前缀：**")
        lines.append("")
        for cls, files in sorted(collisions.items()):
            lines.append(f"- `.{cls}` → {', '.join(files)}")
    else:
        lines.append("✅ 无跨文件类名冲突")

    lines.extend([
        "",
        "---",
        "",
        "## 5. 存储键 registry",
        "",
        "| Key | 用途 | Store |",
        "|---|---|---|",
        "| `ct_user_v1` | 用户档案 | user |",
        "| `ct_food_entries_v1` | 今日食物记录 | food |",
        "| `ct_settings_v1` | 全局设置（深色/主题色/语言/音效/触觉） | settings |",
        "| `ct_goal_v1` | 每日热量目标 | goal |",
        "| `ct_pending_add` | 百科页「添加到本餐」一次性交接 | — |",
        "| `ct_tab_origin` | TabBar 气泡飞行起点一次性传递 | — |",
        "",
        "---",
        "",
        "## 6. 平台坑位 (Platform Quirks)",
        "",
        "- **App 端 Canvas 2D**：`stroke()` 零输出，必须用 `fill()`；`@ready` 不可靠，需 `onMounted` + `setTimeout(500)` 兜底",
        "- **mp-weixin 组件类名冲突**：同名类跨文件污染，必须带组件前缀（af-/fp-/gm- 等）",
        "- **uni-app x 页面滚动**：根 view 严禁写 `flex: 1`，应自然高度撑开走原生页面滚动",
        "- **差量编译假绿**：`cli.exe launch app-android` 完整重编才生成 bytes，watch 差量不重编视图层字节码",
        "",
    ])

    return "\n".join(lines)


if __name__ == "__main__":
    # Windows PowerShell/CMD 下 sys.stdout 默认 GBK，需强制 UTF-8
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    print(generate_markdown())
