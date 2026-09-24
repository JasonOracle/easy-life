#!/usr/bin/env python3
# [变更日志]
# 内容：新增食物百科伴生数据生成线（Boss 授权通宵任务·阶段3）。
#       输入 = app/src/data/food_library.json（只读）+ sources/encyclopedia_meta.yaml；
#       输出 = toolchain/dist/food_encyclopedia.json → 同步 app/src/data/，
#              另产出营养置信度侧车 toolchain/dist/nutrition_audit.json（不随包）。
#       点评文案 = 六档规则模板（分类阈值见 meta 文件头），零手写、零生图。
#       2026-09-25 增补：badges（cls 徽章双语）与 guidance（详情页三列指引模板）随伴生表一并产出。
"""build_encyclopedia.py — 食物百科伴生表打包

用法：python -X utf8 toolchain/build_encyclopedia.py

流程：
  1. 读食物库产物（只读，不修改）+ 百科 meta 源
  2. 逐条校验 id 对齐、英文名齐全（缺一条即中止）
  3. 按宏量分类规则给每条打 review 档位 + 营养置信度映射
  4. related = 同 cat 内热量最近的 3 条（排除自身，确定性排序）
  5. 写 dist 并同步 app/src/data/，附 fingerprint；侧车 audit 只留 dist
"""
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import yaml

BASE = Path(__file__).resolve().parent
LIB_FILE = BASE.parent / "app" / "src" / "data" / "food_library.json"
META_FILE = BASE / "sources" / "encyclopedia_meta.yaml"
DIST_FILE = BASE / "dist" / "food_encyclopedia.json"
APP_FILE = BASE.parent / "app" / "src" / "data" / "food_encyclopedia.json"
AUDIT_FILE = BASE / "dist" / "nutrition_audit.json"

ENC_VERSION = "1.0.0"

# source(basis) → 营养置信度（方案：USDA 比对=verified / 配方台账=derived / 草稿=draft）
CONF_MAP = {
    "composition_table": "verified",
    "recipe_estimate": "derived",
    "rough_estimate": "draft",
}


def classify(cal: float, p: float, c: float, f: float) -> str:
    pcal, ccal, fcal = p * 4, c * 4, f * 9
    tot = pcal + ccal + fcal
    if tot <= 0:
        return "balanced"
    if cal >= 300:
        return "dense"
    if pcal / tot >= 0.40:
        return "protein_rich"
    if fcal / tot >= 0.45:
        return "fat_heavy"
    if ccal / tot >= 0.65:
        return "carb_heavy"
    if cal <= 80:
        return "light"
    return "balanced"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:16]


def main():
    if not LIB_FILE.exists():
        print(f"缺少食物库产物：{LIB_FILE}", file=sys.stderr)
        return 1
    lib = json.loads(LIB_FILE.read_text(encoding="utf-8"))
    meta = yaml.safe_load(META_FILE.read_text(encoding="utf-8"))

    en_names = meta["en_names"]
    cats_zh = {c for c in meta["categories"]}

    errors = []
    lib_ids = [f["id"] for f in lib["foods"]]
    missing = [i for i in lib_ids if i not in en_names]
    extra = [i for i in en_names if i not in lib_ids]
    if missing:
        errors.append(f"缺英文名 {len(missing)} 条：{missing[:5]} ...")
    if extra:
        errors.append(f"英文名多出 {len(extra)} 条（库中无此 id）：{extra[:5]} ...")
    unknown_cat = {f["cat"] for f in lib["foods"]} - cats_zh
    if unknown_cat:
        errors.append(f"meta 缺类目定义：{sorted(unknown_cat)}")
    cls_keys = set(meta["reviews"].keys())
    for section in ("badges", "guidance"):
        keys = set(meta.get(section, {}).keys())
        if keys != cls_keys:
            errors.append(f"meta.{section} 键集与 reviews 不一致：缺 {sorted(cls_keys - keys)} 多 {sorted(keys - cls_keys)}")
    if errors:
        print("校验失败：\n  " + "\n  ".join(errors), file=sys.stderr)
        return 1

    by_cat = {}
    for food in lib["foods"]:
        by_cat.setdefault(food["cat"], []).append(food)

    entries = []
    audit = []
    for food in lib["foods"]:
        cal = float(food["base"]["cal"])
        p = float(food["base"].get("protein") or 0)
        c = float(food["base"].get("carb") or 0)
        f = float(food["base"].get("fat") or 0)
        cls = classify(cal, p, c, f)
        conf = CONF_MAP.get(food["source"], "draft")
        peers = sorted(
            (x for x in by_cat[food["cat"]] if x["id"] != food["id"]),
            key=lambda x: (abs(float(x["base"]["cal"]) - cal), x["id"]),
        )
        entries.append({
            "id": food["id"],
            "en": en_names[food["id"]],
            "cat": food["cat"],
            "cls": cls,
            "conf": conf,
            "related": [x["id"] for x in peers[:3]],
        })
        audit.append({
            "id": food["id"], "conf": conf, "method": food["source"],
            "cal": cal, "protein": p, "carb": c, "fat": f, "reviewClass": cls,
        })

    now = datetime.now(timezone.utc)
    output = {
        "_changelog": "[变更日志] 生成物：由 toolchain/build_encyclopedia.py 产出，禁止手改。伴生表以 id 关联 food_library.json，英文名与文案为 AI 起草（text_review=draft）待核对。",
        "v": ENC_VERSION,
        "generated": now.isoformat(),
        "text_review": meta.get("text_review", "draft"),
        "fingerprint": {
            "version": ENC_VERSION,
            "sources": ["food_library.json:" + sha256(LIB_FILE), "encyclopedia_meta.yaml:" + sha256(META_FILE)],
            "count": len(entries),
            "generatedAt": now.isoformat(),
        },
        "categories": meta["categories"],
        "reviews": meta["reviews"],
        "badges": meta["badges"],
        "guidance": meta["guidance"],
        "entries": entries,
    }

    DIST_FILE.parent.mkdir(parents=True, exist_ok=True)
    DIST_FILE.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    APP_FILE.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    AUDIT_FILE.write_text(json.dumps(audit, ensure_ascii=False, indent=1), encoding="utf-8")

    dist_sha = sha256(DIST_FILE)
    app_sha = sha256(APP_FILE)
    if dist_sha != app_sha:
        print("dist 与 app 副本 sha 不一致", file=sys.stderr)
        return 1

    size_kb = APP_FILE.stat().st_size / 1024
    print(f"百科伴生表产出 OK：{len(entries)} 条 | {size_kb:.1f}KB | sha {app_sha}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
