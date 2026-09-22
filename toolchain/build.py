#!/usr/bin/env python3
# [变更日志]
# 修改时间：2026-09-21
# AI模型：Qoder (Claude)
# 修改内容：[食物条目新增 py 拼音索引字段（{"f": 全拼连写, "i": 首字母串}），
#            由 pypinyin 词级转换、非汉字字符剔除；供弹层⓪ 食物选择列表的
#            「支持拼音」搜索使用。schema v1.0 同步补 py 属性。]
# [变更日志]
# 修改时间：2026-09-19
# AI模型：CodeBuddy (DeepSeek-V4.1-Flash)
# 修改内容：[1. 由「单 YAML 源」重写为「多源合并」：
#              icons_v1（清单）+ nutrition_v1（营养）+ icons_v1_usage（引用）
#              + vessel_tpl / opts_tpl（模板集）→ food_library.json;
#           2. 食物条目新增 pieceWeight（按个计食物的克重）与 img（图标文件名）;
#           3. 打包前统一走 validate.validate_sources() 校验，不通过即中止;
#           4. basis_detail / audit_note 等源文件注释字段不进产物（省体积）;
#           5. base 补齐 protein / carb / fat（与 dist 现货对齐，计件热量公式依赖宏量同比缩放）]

"""build.py — 食物库打包（多源合并模式）

用法：python -X utf8 toolchain/build.py

流程：
  1. 读取五份源文件（见 validate.SOURCES）
  2. 多源一致性校验，任一错误即中止
  3. 合并为列式友好结构 + fingerprint
  4. 写入 toolchain/dist/ 并同步到 app/src/data/

产物字段：
  v            库版本
  generated    生成时间 ISO 8601
  fingerprint  版本 + 来源清单 + 条数 + 时间（出事可回溯）
  vesselTpl    计量器具模板集
  optTpl       选项模板集
  foods        347 条食物条目
"""

import json
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

from pypinyin import pinyin, Style
from validate import SOURCES, load_sources, validate_sources

BASE = Path(__file__).resolve().parent
DIST_OUT = BASE / "dist" / "food_library.json"
APP_DEST = BASE.parent / "app" / "src" / "data" / "food_library.json"

LIB_VERSION = "1.0.0"
ICON_BASE_DIR = "icons-final"
ICON_SRC = BASE.parent / "assets" / ICON_BASE_DIR          # 产物：<catKey>/<id>.webp
ICON_DEST = BASE.parent / "app" / "static" / "icons"  # App 静态资源目录（uni-app x 以 app/ 为项目根，static 常驻）


def pinyin_index(name: str) -> dict:
    """名称 → 搜索拼音索引。pypinyin 词级转换（多音字按词取音），非汉字剔除。
    如「米饭（熟）」→ {"f": "mifanshu", "i": "mfs"}。"""
    syl = [s[0] for s in pinyin(name, style=Style.NORMAL, errors="ignore")]
    return {"f": "".join(syl), "i": "".join(s[0] for s in syl if s)}


def build(src: dict) -> dict:
    """把五份源合并成 food_library.json 的结构。"""
    # 分类中文名 → ASCII key。目录与文件名必须纯 ASCII，避免中文路径在
    # URL 编码、跨平台文件系统、打包工具与真机文件 API 上的兼容问题。
    cat_key_map = {c["name"]: c["key"] for c in src["list"]["categories"]}
    foods_out = []

    for food in src["list"]["foods"]:
        fid = food["id"]
        nut = src["nutrition"][fid]
        use = src["usage"][fid]
        cat_key = cat_key_map.get(food["cat"], "misc")

        foods_out.append({
            "id": fid,
            "name": food["name"],
            "cat": food["cat"],                   # 中文，供 UI 显示
            "base": {
                "cal": nut["cal"],
                "per": 100,                       # 统一按每 100g / 100ml
                "unit": nut["unit"],
                "protein": nut["protein"],        # 计件数量步进器做宏量同比缩放时用
                "carb": nut["carb"],
                "fat": nut["fat"],
            },
            "pieceWeight": nut.get("piece_weight"),
            "vessel": use.get("vessel_tpl"),
            "opts": use.get("opts_tpl") or [],
            # 路径全 ASCII：assets/icons-final/<catKey>/<id>.webp
            "img": f"{cat_key}/{fid}.webp",
            "conf": nut["confidence"],
            "editable": True,                     # v1.0 全部允许记录级覆盖
            "source": nut["basis"],
            "py": pinyin_index(food["name"]),     # 弹层⓪ 搜索：全拼 + 首字母
        })

    now = datetime.now(timezone.utc)
    return {
        "v": LIB_VERSION,
        "generated": now.isoformat(),
        "fingerprint": {
            "version": LIB_VERSION,
            "sources": [Path(p).name for p in SOURCES.values()],
            "count": len(foods_out),
            "generatedAt": now.isoformat(),
        },
        "vesselTpl": src["vessel_tpl"]["templates"],
        "optTpl": src["opts_tpl"]["opt_templates"],
        "foods": foods_out,
    }


def sync_icons():
    """把图标产物增量同步进 App 静态资源目录。

    App 打包只会包含 app/ 目录内的文件，所以 assets/ 下的产物图标必须复制一份进去。
    增量策略：只在目标缺失或源更新时才复制，重复执行不会重复搬运 347 个文件。
    返回 (本次复制数, 源文件总数)。
    """
    if not ICON_SRC.exists():
        return 0, 0

    sources = sorted(ICON_SRC.rglob("*.webp"))
    copied = 0
    for src_file in sources:
        dest_file = ICON_DEST / src_file.relative_to(ICON_SRC)
        if dest_file.exists() and dest_file.stat().st_mtime >= src_file.stat().st_mtime:
            continue
        dest_file.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src_file, dest_file)
        copied += 1
    return copied, len(sources)


def main():
    try:
        src = load_sources()
    except FileNotFoundError as exc:
        print(f"ERROR: 源文件不存在 — {exc}")
        sys.exit(2)

    print(f"📄 读取 {len(SOURCES)} 份源文件")
    for key, path in SOURCES.items():
        print(f"   • {key:<11} {Path(path).name}")

    # ── 校验 ──────────────────────────────────────────────────────────────
    errors = validate_sources(src)
    if errors:
        print(f"\n❌ 打包中止 — 校验发现 {len(errors)} 个错误：")
        for err in errors[:50]:
            print(f"  • {err}")
        if len(errors) > 50:
            print(f"  ... 还有 {len(errors) - 50} 个未显示")
        sys.exit(1)
    print("\n✅ 校验通过")

    # ── 构建 ──────────────────────────────────────────────────────────────
    output = build(src)

    DIST_OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(DIST_OUT, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
        f.write("\n")

    size_kb = DIST_OUT.stat().st_size / 1024
    print(f"\n✅ 打包完成 → {DIST_OUT}")
    print(f"   条数 {output['fingerprint']['count']}  |  体积 {size_kb:.1f}KB")

    # ── 同步到 app/src/data/ ───────────────────────────────────────────────
    APP_DEST.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(DIST_OUT, APP_DEST)
    print(f"✅ 已同步 → {APP_DEST}")

    # ── 同步图标到 App 静态资源目录 ────────────────────────────────────────
    # 引用约定：food_library.json 的 img 字段为 <catKey>/<id>.webp，
    #          前端拼前缀后即 static/icons/<catKey>/<id>.webp。
    if ICON_SRC.exists():
        copied, total = sync_icons()
        print(f"✅ 图标已同步 → {ICON_DEST}")
        print(f"   本次复制 {copied} 个 / 源共 {total} 个")
    else:
        print(f"⚠️ 图标产物不存在，跳过同步：{ICON_SRC}")

    # ── 摘要 ──────────────────────────────────────────────────────────────
    by_conf: dict = {}
    by_cat: dict = {}
    for food in output["foods"]:
        by_conf[food["conf"]] = by_conf.get(food["conf"], 0) + 1
        by_cat[food["cat"]] = by_cat.get(food["cat"], 0) + 1

    print("\n📋 摘要")
    print(f"   置信度分布: {dict(sorted(by_conf.items()))}")
    print(f"   分类分布  : {by_cat}")
    print(f"   器具模板  : {len(output['vesselTpl'])} 个  |  选项模板: {len(output['optTpl'])} 个")

    vessel_used = sum(1 for f in output["foods"] if f["vessel"])
    opts_used = sum(1 for f in output["foods"] if f["opts"])
    piece_used = sum(1 for f in output["foods"] if f["pieceWeight"])
    print(f"   有器皿分段: {vessel_used} 条  |  有选项: {opts_used} 条  |  有单个克重: {piece_used} 条")


if __name__ == "__main__":
    main()
