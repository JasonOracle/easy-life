#!/usr/bin/env python3
# [新建文件]
# 用途：按 icons_v1.yaml + icons_v1_visual.yaml 批量生成食物图标（纯文生图）
# 特性：20 路并发 / Key 池轮转 / 429 冷却退避 / 白底像素自动校验 / 不合格自动重试 / 断点续跑

"""gen_icons.py —— 批量生成食物图标

输入：toolchain/sources/icons_v1.yaml        （347 项清单：id/name/cat）
      toolchain/sources/icons_v1_visual.yaml （生图槽位：container/content/toppings/state/view）
输出：assets/icons-gen/<cat>/<id>-<name>.png
      assets/icons-gen/_report.json          （生成报告：成功/失败/白底不合格明细）

用法：
    # 抽样 21 个代表性食物（含此前翻车过的火锅/麻辣烫）
    python -X utf8 toolchain/gen_icons.py --sample

    # 指定 id
    python -X utf8 toolchain/gen_icons.py --ids p105,p104,p270

    # 全量 347 张
    python -X utf8 toolchain/gen_icons.py --all

    # 只看结果不重新生成（已存在且白底合格的文件默认跳过）
    python -X utf8 toolchain/gen_icons.py --all --dry-run

Prompt 拼装规则（依据实测沉淀，见 toolchain/README.md B.3）：
    {container}, {content}, with {toppings}, {state}, {view} + 固定骨架
    空槽位自动跳过，避免出现连续逗号。
"""

import argparse
import io
import itertools
import json
import os
import sys
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import yaml
from PIL import Image

SRC_LIST = Path("toolchain/sources/icons_v1.yaml")
SRC_VISUAL = Path("toolchain/sources/icons_v1_visual.yaml")
OUT_DIR = Path("assets/icons-gen")
ENDPOINT = "https://apihub.agnes-ai.com/v1/images/generations"
MODEL = "agnes-image-2.5-flash"

CONCURRENCY = 20          # 实测 20 路总耗时仍稳定在 ~18s，吞吐 69 张/分钟
MAX_RETRY = 3             # 含首次；白底不合格或 429 都会触发重试
KEY_COOLDOWN = 60         # 撞 429 后该 Key 冷却秒数
WHITE_THRESHOLD = 235     # 四角像素三通道都 > 此值判为白底

SKELETON = (
    "pure white background, soft drop shadow, product photography, "
    "even studio lighting, square composition, high detail, "
    "no text, no watermark, no logo, no people, no hands"
)

# 抽样清单：覆盖 7 个分类 + 此前翻车过的项（火锅 / 麻辣烫）
SAMPLE_IDS = [
    "p001", "p002", "p030", "p044", "p051",          # 主食
    "p065", "p101", "p104", "p105", "p117",          # 菜品（含火锅、麻辣烫）
    "p143", "p150", "p155",                          # 肉类蛋类
    "p196", "p214",                                  # 蔬菜
    "p230", "p241", "p258",                          # 水果
    "p270", "p276",                                  # 饮品（奶茶、美式）
    "p309",                                          # 零食
]


# ── Key 池：轮转 + 429 冷却 ──────────────────────────────────────────────────
class KeyPool:
    def __init__(self, keys):
        self._keys = keys
        self._cooldown = [0.0] * len(keys)
        self._counter = itertools.count()
        self._lock = threading.Lock()

    def acquire(self):
        """取一个可用 Key；全部冷却中则等待最早恢复的那个。返回 (索引, key)。"""
        while True:
            idx = next(self._counter) % len(self._keys)
            with self._lock:
                if time.time() >= self._cooldown[idx]:
                    return idx, self._keys[idx]
                # 找一个冷却已过的
                for offset in range(len(self._keys)):
                    cand = (idx + offset) % len(self._keys)
                    if time.time() >= self._cooldown[cand]:
                        return cand, self._keys[cand]
                wait = min(self._cooldown) - time.time()
            time.sleep(max(0.5, min(wait, 5.0)))
            if wait <= 0:
                continue

    def cool_down(self, idx):
        with self._lock:
            self._cooldown[idx] = time.time() + KEY_COOLDOWN

    def snapshot(self):
        with self._lock:
            now = time.time()
            return [round(max(0.0, t - now), 1) for t in self._cooldown]


def discover_keys(prefix):
    keys = []
    for name in sorted(os.environ):
        suffix = name[len(prefix):]
        if name == prefix or (name.startswith(prefix) and suffix.isdigit()):
            value = os.environ[name].strip()
            if value:
                keys.append(value)
    return keys


# ── prompt 拼装 ──────────────────────────────────────────────────────────────
def build_prompt(visual):
    """空槽位自动跳过，避免 'a, , b' 这类畸形 prompt。"""
    parts = []
    if visual.get("container"):
        parts.append(visual["container"])
    if visual.get("content"):
        parts.append(visual["content"])
    toppings = visual.get("toppings") or []
    if toppings:
        parts.append("with " + ", ".join(toppings))
    if visual.get("state"):
        parts.append(visual["state"])
    if visual.get("view"):
        parts.append(visual["view"])
    return ", ".join(parts) + ", " + SKELETON


# ── 白底校验 ────────────────────────────────────────────────────────────────
def corner_whiteness(image_bytes):
    """返回四角中「接近纯白」的个数（0-4）。"""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    w, h = img.size
    corners = [
        img.getpixel((2, 2)),
        img.getpixel((w - 3, 2)),
        img.getpixel((2, h - 3)),
        img.getpixel((w - 3, h - 3)),
    ]
    return sum(1 for c in corners if min(c) > WHITE_THRESHOLD), corners, f"{w}x{h}"


# ── 单张生成 ────────────────────────────────────────────────────────────────
def generate_one(food, visual, pool, cat_key):
    """生成单张图。返回 dict 结果。"""
    prompt = build_prompt(visual)
    last_error = ""

    for attempt in range(1, MAX_RETRY + 1):
        key_idx, key = pool.acquire()
        payload = json.dumps({
            "model": MODEL,
            "prompt": prompt,
            "size": "1K",
            "ratio": "1:1",
        }).encode()
        req = urllib.request.Request(
            ENDPOINT,
            data=payload,
            headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"},
        )
        try:
            resp = json.loads(urllib.request.urlopen(req, timeout=300).read().decode())
            url = resp["data"][0]["url"]
        except urllib.error.HTTPError as exc:
            if exc.code == 429:
                pool.cool_down(key_idx)
                last_error = f"429 限流（Key#{key_idx} 冷却 {KEY_COOLDOWN}s）"
                continue
            last_error = f"HTTP {exc.code}: {exc.read().decode()[:80]}"
            continue
        except Exception as exc:
            last_error = f"{type(exc).__name__}: {str(exc)[:60]}"
            continue

        try:
            raw = urllib.request.urlopen(url, timeout=120).read()
        except Exception as exc:
            last_error = f"下载失败 {str(exc)[:50]}"
            continue

        white, corners, size = corner_whiteness(raw)
        if white < 3:
            last_error = f"白底不合格（白角 {white}/4，四角 {corners}）"
            continue  # 重试

        out_path = OUT_DIR / cat_key / f"{food['id']}.png"
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_bytes(raw)
        return {
            "id": food["id"], "name": food["name"], "cat": food["cat"],
            "ok": True, "attempt": attempt, "white": white, "size": size,
            "path": str(out_path), "prompt": prompt, "prompt_len": len(prompt),
        }

    return {
        "id": food["id"], "name": food["name"], "cat": food["cat"],
        "ok": False, "attempt": MAX_RETRY, "error": last_error,
        "prompt": prompt, "prompt_len": len(prompt),
    }


def main():
    parser = argparse.ArgumentParser(description="批量生成食物图标")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--all", action="store_true", help="生成全部 347 项")
    group.add_argument("--sample", action="store_true", help="生成 21 项抽样")
    group.add_argument("--ids", type=str, help="逗号分隔的 id 列表")
    parser.add_argument("--dry-run", action="store_true", help="只统计，不实际生成")
    parser.add_argument("--force", action="store_true", help="已存在的也重新生成")
    args = parser.parse_args()

    keys = discover_keys("AGNES_API_KEY")
    if not keys:
        sys.exit("❌ 未发现 AGNES_API_KEY")

    list_data = yaml.safe_load(SRC_LIST.read_text(encoding="utf-8"))
    foods = list_data["foods"]
    cat_key_map = {c["name"]: c["key"] for c in list_data.get("categories", [])}
    visuals = yaml.safe_load(SRC_VISUAL.read_text(encoding="utf-8"))

    if args.all:
        selected = foods
    elif args.sample:
        wanted = set(SAMPLE_IDS)
        selected = [f for f in foods if f["id"] in wanted]
    else:
        wanted = {x.strip() for x in args.ids.split(",") if x.strip()}
        selected = [f for f in foods if f["id"] in wanted]

    if not selected:
        sys.exit("❌ 未选中任何食物，检查 --ids")

    # 断点续跑：已存在且白底合格的跳过
    todo, skipped = [], 0
    for food in selected:
        path = OUT_DIR / cat_key_map.get(food["cat"], "misc") / f"{food['id']}.png"
        if path.exists() and not args.force:
            skipped += 1
            continue
        todo.append(food)

    print(f"选中 {len(selected)} 项 | 跳过已存在 {skipped} 项 | 待生成 {len(todo)} 项")
    print(f"并发 {CONCURRENCY} | Key {len(keys)} 个 | 模型 {MODEL}")
    if args.dry_run:
        for food in todo[:10]:
            print(f"  {food['id']} {food['name']:<10} {build_prompt(visuals.get(food['id'], {}))[:90]}...")
        print(f"  ... 共 {len(todo)} 项")
        return

    if not todo:
        print("✅ 无待生成项")
        return

    pool = KeyPool(keys)
    start = time.time()
    results = []

    def worker(food):
        visual = visuals.get(food["id"])
        if not visual:
            return {"id": food["id"], "name": food["name"], "cat": food["cat"],
                    "ok": False, "error": "缺少 visual 槽位"}
        result = generate_one(food, visual, pool, cat_key_map.get(food["cat"], "misc"))
        flag = "✓" if result["ok"] else "✗"
        detail = f"白角{result['white']}/4" if result["ok"] else result["error"]
        print(f"  {flag} {result['id']} {result['name']:<10} {detail}")
        return result

    with ThreadPoolExecutor(max_workers=CONCURRENCY) as executor:
        for result in executor.map(worker, todo):
            results.append(result)

    elapsed = time.time() - start
    ok_items = [r for r in results if r["ok"]]
    bad_items = [r for r in results if not r["ok"]]

    report = {
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "model": MODEL,
        "total_selected": len(selected),
        "skipped_existing": skipped,
        "attempted": len(results),
        "success": len(ok_items),
        "failed": len(bad_items),
        "elapsed_sec": round(elapsed, 1),
        "key_cooldown_remaining": pool.snapshot(),
        "failed_items": bad_items,
        "results": results,
    }
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"\n{'=' * 60}")
    print(f"成功 {len(ok_items)}/{len(results)}   耗时 {elapsed:.1f}s"
          f"   ({len(ok_items) / elapsed * 60:.1f} 张/分钟)")
    if bad_items:
        print(f"\n失败 {len(bad_items)} 项：")
        for r in bad_items:
            print(f"  ✗ {r['id']} {r['name']}: {r.get('error')}")
    print(f"\n报告: {OUT_DIR / '_report.json'}")
    print(f"图片: {OUT_DIR}/<分类>/")


if __name__ == "__main__":
    main()
