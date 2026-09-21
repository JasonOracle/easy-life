#!/usr/bin/env python3
# [变更日志]
# 修改时间：2026-09-20
# AI模型：Muse Spark
# 修改内容：[新建定向补克重脚本：只为计件类（piece/slice/skewer）且 piece_weight 为 null
#   的条目补「1 个/片/串 = 多少克」，行级补丁不碰其他字段与人工修正；
#   依据随条目原有 basis 走，估算项在 piece_note 留痕，conf 不升级]

"""fill_piece_weights.py —— 定向补计件克重（行级补丁模式）

背景：计件类 vessel（piece/slice/skewer）UI 要做数量步进器，热量公式
    kcal = round(count × piece_weight × cal/100) 依赖 piece_weight，
    但 93 个计件条目的 piece_weight 为 null（构建期数据缺口，运行时离线无法补）。

与 gen_nutrition.py 的区别：全量重跑会重写整个 nutrition_v1.yaml，
冲掉已有人工修正；本脚本只给目标条目做行级补丁，其他字节不动。

输入：toolchain/sources/nutrition_v1.yaml
      toolchain/sources/icons_v1_usage.yaml（取 vessel_tpl 判定计件类）
输出：就地更新 nutrition_v1.yaml（目标行的 piece_weight: null → 整数，
      并在其下方追加 piece_note: <依据一句话>）
      终端打印补丁表（id / 名称 / 克重 / 备注），供 progress.md 归档

用法：python -X utf8 toolchain/fill_piece_weights.py
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

BASE = Path(__file__).resolve().parent
NUTRITION = BASE / "sources" / "nutrition_v1.yaml"
USAGE = BASE / "sources" / "icons_v1_usage.yaml"
ENDPOINT = "https://apihub.agnes-ai.com/v1/chat/completions"
MODEL = "agnes-2.5-flash"
BATCH_SIZE = 25
PIECE_VESSELS = ("piece", "slice", "skewer")


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

SYSTEM = """你是营养学数据专家。只做一件事：给出常见食物「1 个/片/串」的可食部克重（整数 g）。

输出 JSON 数组，每项字段：
- id           食物 id（原样回传）
- piece_weight 1 个/片/串的可食部克重，整数 g。如不常见、波动极大，给最常见的中等规格
- piece_note   一句话依据（20 字内），如"标准鸡蛋约60g"、"常见羊肉串带签约25g"

严格要求：
1. 按「常见市售/堂食规格」：鸡蛋=带壳约60g、水煮蛋去壳约50g、包子约80g、馒头约75g、
   香蕉约100g（去皮）、苹果约200g、羊肉串约25g、吐司约40g/片、西瓜约500g/片、披萨约150g/片
2. 拿不准的往常见中等规格靠，piece_note 写明"中等规格估算"
3. 只输出 JSON，不要 markdown 代码块，不要解释文字"""


def parse_json_array(text):
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.MULTILINE).strip()
    return json.loads(text)


def call_batch(idx, batch):
    key = KEYS[idx % len(KEYS)]
    items = [
        {"id": f["id"], "name": f["name"], "cat": f["cat"], "unit_label": f["unit_label"]}
        for f in batch
    ]
    payload = json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": "给出以下食物的单个克重：\n" + json.dumps(items, ensure_ascii=False)},
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


def find_targets():
    nutrition = yaml.safe_load(NUTRITION.read_text(encoding="utf-8"))
    usage = yaml.safe_load(USAGE.read_text(encoding="utf-8"))
    targets = []
    for fid, nut in nutrition.items():
        if not isinstance(nut, dict) or nut.get("piece_weight") is not None:
            continue
        use = usage.get(fid)
        if not isinstance(use, dict) or use.get("vessel_tpl") not in PIECE_VESSELS:
            continue
        vessel = use["vessel_tpl"]
        label = {"piece": "个", "slice": "片", "skewer": "串"}[vessel]
        targets.append({
            "id": fid,
            "name": nut.get("name", ""),
            "cat": nut.get("cat", ""),
            "unit_label": f"1{label}",
        })
    return targets


def apply_patch(results: dict) -> int:
    """行级补丁：只改目标条目的 piece_weight 行并追加 piece_note 行。返回补丁数。"""
    lines = NUTRITION.read_text(encoding="utf-8").split("\n")
    out = []
    current_fid = None
    patched = 0
    for line in lines:
        m = re.match(r"^([a-z]+_?[0-9]+):\s*$", line)
        if m:
            current_fid = m.group(1)
        if (
            current_fid in results
            and line.strip() == "piece_weight: null"
        ):
            pw, note = results[current_fid]
            out.append(f"  piece_weight: {pw}")
            out.append(f"  piece_note: {note}")
            patched += 1
            continue
        out.append(line)
    NUTRITION.write_text("\n".join(out), encoding="utf-8")
    return patched


def main():
    if not KEYS:
        sys.exit("ERROR: 未发现 AGNES_API_KEY")
    targets = find_targets()
    print(f"待补 {len(targets)} 项")
    if not targets:
        print("无缺口，直接退出")
        return

    batches = [targets[i:i + BATCH_SIZE] for i in range(0, len(targets), BATCH_SIZE)]
    print(f"共 {len(batches)} 批并发提交...\n")
    start = time.time()
    with ThreadPoolExecutor(max_workers=len(batches)) as pool:
        raw = list(pool.map(lambda kv: call_batch(kv[0], kv[1]), enumerate(batches)))
    print(f"耗时 {time.time() - start:.1f}s")

    results = {}
    for idx, batch, items, error in sorted(raw):
        if items is None:
            print(f"  [FAIL] 批次 {idx}: {error}")
            continue
        valid_ids = {f["id"] for f in batch}
        for item in items:
            if not isinstance(item, dict) or item.get("id") not in valid_ids:
                continue
            try:
                pw = int(item["piece_weight"])
            except (TypeError, ValueError):
                print(f"  [SKIP] {item.get('id')}: piece_weight 非法（{item.get('piece_weight')}）")
                continue
            if pw <= 0 or pw > 2000:
                print(f"  [SKIP] {item.get('id')}: piece_weight 越界（{pw}）")
                continue
            note = str(item.get("piece_note") or "中等规格估算")[:40]
            results[item["id"]] = (pw, note)

    missing = [f["id"] for f in targets if f["id"] not in results]
    if missing:
        print(f"  [WARN] {len(missing)} 项未拿到结果: {missing}")
        print("  先不写文件，请重跑本脚本补齐剩余项")
        sys.exit(1)

    patched = apply_patch(results)
    print(f"\nOK: 行级补丁 {patched}/{len(targets)} 项")
    print("\n补丁表（id | 名称 | 1个克重 | 依据）：")
    by_id = {f["id"]: f for f in targets}
    for fid in sorted(results):
        pw, note = results[fid]
        print(f"  {fid} | {by_id[fid]['name']} {by_id[fid]['unit_label']} | {pw}g | {note}")


if __name__ == "__main__":
    main()
