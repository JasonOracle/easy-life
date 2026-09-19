#!/usr/bin/env python3
# [新建文件]
# 用途：为 icons_v1.yaml 的 347 项食物生成营养数据初稿（分层方法：成分表值 / 配方推算）
# 重要：产物是「可核对的初稿」，不是权威数据。conf=3 的条目必须抽样人工核对后才可定稿。

"""gen_nutrition.py —— 批量生成食物营养数据初稿

分层方法（依据「有没有权威数据」分流）：
    L1 基础食材（蔬果肉蛋奶）→ composition_table  成分表标准值  conf=3
    L2 复合食物（菜品/主食/现饮）→ recipe_estimate  配方推算（附可复核拆解）conf=2，波动大降 1
    L3 包装食品（零食/瓶罐）→ composition_table 或 rough_estimate

输入：toolchain/sources/icons_v1.yaml（347 项：id/name/cat）
输出：toolchain/sources/nutrition_v1.yaml        （营养数据初稿）
      toolchain/sources/nutrition_checklist.md   （人工核对清单，按风险排序）

用法：
    python -X utf8 toolchain/gen_nutrition.py
"""

import json
import os
import re
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import yaml

SRC = Path("toolchain/sources/icons_v1.yaml")
OUT = Path("toolchain/sources/nutrition_v1.yaml")
CHECKLIST = Path("toolchain/sources/nutrition_checklist.md")
ENDPOINT = "https://apihub.agnes-ai.com/v1/chat/completions"
MODEL = "agnes-2.5-flash"
BATCH_SIZE = 25
CHECKLIST_SIZE = 30


def discover_keys(prefix):
    keys = []
    for name in sorted(os.environ):
        suffix = name[len(prefix):]
        if name == prefix or (name.startswith(prefix) and suffix.isdigit()):
            value = os.environ[name].strip()
            if value:
                keys.append(value)
    return keys


KEYS = discover_keys("AGNES_API_KEY")

SYSTEM = """你是营养学数据专家。为食物给出营养成分（每 100g 可食部）。

输出 JSON 数组，每项字段：
- id, name
- cal      热量 kcal/100g
- protein  蛋白质 g/100g
- carb     碳水 g/100g
- fat      脂肪 g/100g
- piece_weight  若该食物按「个/只/根/片」计，给出 1 个的可食部克重（整数 g）；
                 若按「碗/份/杯/瓶」计，给 null
- basis    数值依据，只能是三者之一：
             "composition_table" 食物成分表标准值（仅基础食材：蔬果肉蛋奶、米面粮油）
             "recipe_estimate"   配方推算（中式菜品/复合主食/现制饮品必须有这个）
             "rough_estimate"    粗略估算（波动极大的，如麻辣烫、火锅）
- basis_detail  依据说明。recipe_estimate 必须列出主料及各自用量（克），格式：
                 "主料A Xg + 主料B Yg + 油Zg，总约 Ng 成品"
- confidence   3=权威可核 / 2=较可靠 / 1=估算

严格要求：
1. 严禁编造精确到小数位的数值来假装权威；宁可写整数估算
2. 中式菜品（宫保鸡丁、红烧肉、麻婆豆腐等）必须 recipe_estimate + 配方拆解
3. 现制饮品（奶茶、拿铁等）用 recipe_estimate，拆解奶/茶/糖/糖浆
4. 火锅/麻辣烫/冒菜这类极度依赖点单的，用 rough_estimate + confidence 1
5. 数值默认按「常见食用状态」：米饭=熟米饭、面条=煮熟、肉类=生鲜可食部
6. 只输出 JSON，不要 markdown 代码块，不要解释文字"""


def parse_json_array(text):
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.MULTILINE).strip()
    return json.loads(text)


def call_batch(idx, batch):
    key = KEYS[idx % len(KEYS)]
    items = [{"id": f["id"], "name": f["name"], "cat": f["cat"]} for f in batch]
    payload = json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": "为以下食物给出营养成分：\n" + json.dumps(items, ensure_ascii=False)},
        ],
        "stream": False,
    }).encode()

    last_error = None
    for _ in range(2):
        req = urllib.request.Request(
            ENDPOINT,
            data=payload,
            headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"},
        )
        try:
            resp = json.loads(urllib.request.urlopen(req, timeout=300).read().decode())
            return idx, batch, parse_json_array(resp["choices"][0]["message"]["content"]), None
        except Exception as exc:
            last_error = f"{type(exc).__name__}: {str(exc)[:80]}"
            time.sleep(2)
    return idx, batch, None, last_error


def main():
    if not KEYS:
        sys.exit("❌ 未发现 AGNES_API_KEY")

    foods = yaml.safe_load(SRC.read_text(encoding="utf-8"))["foods"]
    print(f"清单 {len(foods)} 项 | Key {len(KEYS)} 个 | 每批 {BATCH_SIZE} 项")

    batches = [foods[i:i + BATCH_SIZE] for i in range(0, len(foods), BATCH_SIZE)]
    print(f"共 {len(batches)} 批并发提交...\n")

    start = time.time()
    with ThreadPoolExecutor(max_workers=len(batches)) as pool:
        results = list(pool.map(lambda kv: call_batch(kv[0], kv[1]), enumerate(batches)))
    elapsed = time.time() - start

    spec = {}
    for idx, batch, items, error in sorted(results):
        if items is None:
            print(f"  ✗ 批次 {idx} 失败: {error}")
            continue
        valid_ids = {f["id"] for f in batch}
        for item in items:
            if not isinstance(item, dict) or not item.get("id"):
                continue
            if item["id"] not in valid_ids:
                # LLM 偶发幻觉 id（如把 p061 写成 p0511），会让真条目变 MISSING
                print(f"  ⚠️ 丢弃未知 id: {item['id']} ({item.get('name')})")
                continue
            spec[item["id"]] = item

    # 一致性校验：配方推算 / 粗略估算不该标 conf=3（等于给估算值盖权威章）
    for item in spec.values():
        basis, conf = item.get("basis"), item.get("confidence")
        if basis == "recipe_estimate" and conf == 3:
            item["confidence"] = 2
        elif basis == "rough_estimate" and conf == 3:
            item["confidence"] = 1

    print(f"耗时 {elapsed:.1f}s   覆盖 {len(spec)}/{len(foods)} 项")

    # ── 写营养数据 ─────────────────────────────────────────────────────────
    lines = [
        "# 营养数据初稿（每 100g 可食部）—— 由 gen_nutrition.py 生成，待人工核对",
        "#",
        "# 分层方法：",
        "#   composition_table  成分表标准值（基础食材）        conf=3",
        "#   recipe_estimate    配方推算（菜品/复合主食/现饮）  conf=2，波动大的降 1",
        "#   rough_estimate     粗略估算（麻辣烫/火锅等）       conf=1",
        "#",
        "# ⚠️ conf=3 的条目必须抽样人工核对后才可定稿；",
        "#    basis_detail 用于可复核性追溯，进 App 的 food_library.json 时需裁掉。",
        "",
    ]
    for food in foods:
        item = spec.get(food["id"])
        fid = food["id"]
        if not item:
            lines.append(f"{fid}: {{ name: {food['name']}, cat: {food['cat']}, MISSING: true }}")
            continue
        pw = item.get("piece_weight")
        detail = json.dumps(item.get("basis_detail") or "", ensure_ascii=False)
        lines.append(f"{fid}:")
        lines.append(f"  name: {food['name']}")
        lines.append(f"  cat: {food['cat']}")
        lines.append(f"  cal: {item.get('cal')}")
        lines.append(f"  protein: {item.get('protein')}")
        lines.append(f"  carb: {item.get('carb')}")
        lines.append(f"  fat: {item.get('fat')}")
        lines.append(f"  piece_weight: {pw if pw else 'null'}")
        lines.append(f"  basis: {item.get('basis')}")
        lines.append(f"  confidence: {item.get('confidence')}")
        lines.append(f"  basis_detail: {detail}")
        lines.append("")

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"✅ 已写出 {OUT}")

    # ── 生成人工核对清单（按风险排序）───────────────────────────────────────
    def risk_rank(fid):
        """优先级：conf=3（要权威，错了最丢人）> conf=1（波动大）> conf=2；同类按 id 顺序。"""
        item = spec.get(fid, {})
        conf = item.get("confidence")
        return {3: 0, 1: 1, 2: 2}.get(conf, 3)

    ordered = sorted(spec.keys(), key=lambda k: (risk_rank(k), k))
    checklist = [
        "# 营养数据人工核对清单",
        "",
        f"共 {len(spec)} 条，以下 {min(CHECKLIST_SIZE, len(spec))} 条按风险排序优先核对。",
        "",
        "**核对要点**：",
        "- `conf=3`（成分表值）：**这类标了权威，错了最伤信任**，优先核。可对照《中国食物成分表》或常识值",
        "- `conf=1`（粗略估算）：确认是否需要进一步拆解或拆分条目",
        "- `conf=2`（配方推算）：检查 `basis_detail` 的配方是否合理（主料种类、用量、油量）",
        "",
        "---",
        "",
        f"| id | 食物 | 分类 | 热量 | 蛋白 | 碳水 | 脂肪 | 1个克重 | 依据 | conf |",
        "|---|---|---|---|---|---|---|---|---|---|",
    ]
    foods_by_id = {f["id"]: f for f in foods}
    for fid in ordered[:CHECKLIST_SIZE]:
        item = spec.get(fid)
        if not item:
            continue
        pw = item.get("piece_weight")
        checklist.append(
            f"| {fid} | {item['name']} | {foods_by_id.get(fid, {}).get('cat', '')} | {item.get('cal')} | "
            f"{item.get('protein')} | {item.get('carb')} | {item.get('fat')} | "
            f"{pw if pw else '—'} | {item.get('basis')} | {item.get('confidence')} |"
        )

    checklist += ["", "---", "", "## 配方推算明细（conf=2 的拆解，用于判断合理性）", ""]
    for fid in ordered:
        item = spec.get(fid)
        if item and item.get("basis") == "recipe_estimate":
            checklist.append(f"- **{item['name']}**：{item.get('basis_detail') or '（未给出拆解）'}")

    CHECKLIST.write_text("\n".join(checklist) + "\n", encoding="utf-8")
    print(f"✅ 已写出 {CHECKLIST}")

    # ── 统计 ───────────────────────────────────────────────────────────────
    conf_count: dict = {}
    basis_count: dict = {}
    for item in spec.values():
        conf_count[item.get("confidence")] = conf_count.get(item.get("confidence"), 0) + 1
        basis_count[item.get("basis")] = basis_count.get(item.get("basis"), 0) + 1

    print(f"\n置信度分布: {dict(sorted(conf_count.items(), key=lambda kv: str(kv[0])))}")
    print(f"依据分布  : {basis_count}")
    missing = len(foods) - len(spec)
    if missing:
        print(f"⚠️ 缺 {missing} 项，重跑本脚本可补齐")


if __name__ == "__main__":
    main()
