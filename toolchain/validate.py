#!/usr/bin/env python3
# [变更日志]
# 修改时间：2026-09-19
# AI模型：CodeBuddy (DeepSeek-V4.1-Flash)
# 修改内容：[1. 单源校验改为「多源一致性校验」：icons_v1 / nutrition_v1 / icons_v1_usage
#              / vessel_tpl / opts_tpl 五份源文件;
#           2. 新增三源 id 对齐校验（清单里有、营养或引用缺失即报错）;
#           3. 新增数值合理性、模板引用、basis 与 confidence 一致性、宏量配平校验;
#           4. 保留 load_yaml 供 build.py 复用;
#           5. 新增计件类（piece/slice/skewer）piece_weight 必填校验
#             （数量步进器热量公式依赖，构建期拦掉缺口）]

"""validate.py — 食物库数据源校验（多源模式）

五份源文件的分工：
    icons_v1.yaml         食物清单（id / name / cat）
    nutrition_v1.yaml     营养数据（cal/protein/carb/fat/unit/piece_weight/basis/confidence）
    icons_v1_usage.yaml   份量与选项引用（vessel_tpl / opts_tpl）
    vessel_tpl.yaml       计量器具模板集
    opts_tpl.yaml         选项模板集

校验项：
    1. 清单无重复 id
    2. 三源 id 完全对齐（清单 ↔ 营养 ↔ 引用），且无清单外的多余条目
    3. 数值合理性（cal ≥ 0、unit ∈ {g,ml}、confidence ∈ {1,2,3}）
    4. 模板引用合法（vessel_tpl / opts_tpl 的 key 必须存在）
    5. basis 与 confidence 不矛盾（估算不该标权威）
    6. 宏量配平（蛋白×4 + 碳水×4 + 脂肪×9 ≈ 标称热量；酒精类除外）

用法：python -X utf8 toolchain/validate.py
退出码：0 = 通过，1 = 失败，2 = 源文件缺失
"""

import sys
from pathlib import Path

import yaml

BASE = Path(__file__).resolve().parent

SOURCES = {
    "list": BASE / "sources" / "icons_v1.yaml",
    "nutrition": BASE / "sources" / "nutrition_v1.yaml",
    "usage": BASE / "sources" / "icons_v1_usage.yaml",
    "vessel_tpl": BASE / "sources" / "vessel_tpl.yaml",
    "opts_tpl": BASE / "sources" / "opts_tpl.yaml",
}


def load_yaml(path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_sources() -> dict:
    """读取五份源文件。缺文件直接抛 FileNotFoundError。"""
    data = {}
    for key, path in SOURCES.items():
        if not Path(path).exists():
            raise FileNotFoundError(path)
        data[key] = load_yaml(path)
    return data


def validate_sources(src: dict) -> list:
    errors = []

    foods = src["list"]["foods"]
    nutrition = src["nutrition"]
    usage = src["usage"]
    vessel_keys = set(src["vessel_tpl"]["templates"].keys())
    opt_keys = set(src["opts_tpl"]["opt_templates"].keys())

    # ① 重复 id
    ids = [f["id"] for f in foods]
    if len(ids) != len(set(ids)):
        dup = sorted({i for i in ids if ids.count(i) > 1})
        errors.append(f"清单存在重复 id: {dup}")

    seen = set()
    for food in foods:
        fid, name = food["id"], food["name"]
        seen.add(fid)
        prefix = f"{fid} {name}"

        # ② 三源对齐
        if fid not in nutrition:
            errors.append(f"{prefix}: nutrition_v1.yaml 缺该条")
            continue
        if fid not in usage:
            errors.append(f"{prefix}: icons_v1_usage.yaml 缺该条")
            continue

        nut, use = nutrition[fid], usage[fid]
        cal = nut.get("cal")

        # ③ 数值合理性
        if not isinstance(cal, (int, float)) or cal < 0:
            errors.append(f"{prefix}: cal 非法（{cal}）")
        if nut.get("unit") not in ("g", "ml"):
            errors.append(f"{prefix}: unit 非法（{nut.get('unit')}）")
        if nut.get("confidence") not in (1, 2, 3):
            errors.append(f"{prefix}: confidence 非法（{nut.get('confidence')}）")

        # ④ 模板引用
        if use.get("vessel_tpl") not in vessel_keys:
            errors.append(f"{prefix}: vessel_tpl '{use.get('vessel_tpl')}' 不存在于 vessel_tpl.yaml")
        for opt in (use.get("opts_tpl") or []):
            if opt not in opt_keys:
                errors.append(f"{prefix}: opts_tpl '{opt}' 不存在于 opts_tpl.yaml")

        # ⑤ basis 与 confidence 一致性
        basis, conf = nut.get("basis"), nut.get("confidence")
        if basis == "recipe_estimate" and conf == 3:
            errors.append(f"{prefix}: recipe_estimate 不应标 conf=3（配方推算不是权威值）")
        if basis == "rough_estimate" and conf == 3:
            errors.append(f"{prefix}: rough_estimate 不应标 conf=3（粗略估算不是权威值）")

        # ⑦ 计件类 piece_weight 必填（数量步进器热量公式的输入，缺了算不出）
        vessel_tpl = use.get("vessel_tpl")
        if vessel_tpl in ("piece", "slice", "skewer"):
            pw = nut.get("piece_weight")
            if not isinstance(pw, (int, float)) or pw <= 0:
                errors.append(f"{prefix}: 计件类（{vessel_tpl}）piece_weight 缺失或非法（{pw}）")

        # ⑥ 宏量配平（酒精类天然对不上：酒精 7kcal/g 不计入三大营养素）
        protein, carb, fat = nut.get("protein"), nut.get("carb"), nut.get("fat")
        if all(isinstance(x, (int, float)) for x in (cal, protein, carb, fat)):
            if cal > 20 and "酒" not in name:
                derived = protein * 4 + carb * 4 + fat * 9
                if abs(derived - cal) > max(35, cal * 0.35):
                    errors.append(
                        f"{prefix}: 配平偏差（标称 {cal} kcal / 折算 {round(derived)} kcal）"
                    )

    # 反向检查：营养/引用里有没有清单外的多余条目
    extra_nut = sorted(set(nutrition) - seen)
    extra_use = sorted(set(usage) - seen)
    if extra_nut:
        errors.append(f"nutrition_v1.yaml 存在清单外的 id: {extra_nut}")
    if extra_use:
        errors.append(f"icons_v1_usage.yaml 存在清单外的 id: {extra_use}")

    return errors


def main():
    try:
        src = load_sources()
    except FileNotFoundError as exc:
        print(f"ERROR: 源文件不存在 — {exc}")
        sys.exit(2)

    errors = validate_sources(src)

    if errors:
        print(f"❌ 校验失败 — {len(errors)} 个错误：")
        for err in errors[:50]:
            print(f"  • {err}")
        if len(errors) > 50:
            print(f"  ... 还有 {len(errors) - 50} 个未显示")
        sys.exit(1)

    print("✅ 校验通过")
    print(f"   食物      {len(src['list']['foods'])} 条")
    print(f"   器具模板  {len(src['vessel_tpl']['templates'])} 个")
    print(f"   选项模板  {len(src['opts_tpl']['opt_templates'])} 个")
    print(f"   源文件    {len(SOURCES)} 份，三源 id 完全对齐")


if __name__ == "__main__":
    main()
