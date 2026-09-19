#!/usr/bin/env python3
# [新建文件]
# 用途：为 icons_v1.yaml 的每个食物生成「生图描述槽位」初稿（container/content/toppings/state/view）
# 注意：此处的 container 是「生图用的视觉容器描述」（英文）
#       与数据线的 vessel（计量器具模板，小/中/大杯带 ml）同名不同义，故改名区分
# 说明：产物是「初稿」，必须人工审核 vessel 字段后再用于生图

"""gen_visual_spec.py —— 批量生成食物图标的生图描述槽位

输入：toolchain/sources/icons_v1.yaml（347 项食物清单）
输出：toolchain/sources/icons_v1_visual.yaml（每项一行 flow style，便于人工扫读审核）

用法：
    python -X utf8 toolchain/gen_visual_spec.py

设计依据（来自实测踩坑，已编码进 SYSTEM 提示）：
    1. container 是第一识别特征 —— 火锅写成 "stainless steel" 会画成铁盆
    2. 禁止抽象词 —— "assorted ingredients" 会让麻辣烫画成牛肉粉
    3. 禁止主观形容词 —— "milky brown" 会把奶茶颜色带偏
    4. toppings 必须逐项枚举具体食材
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import yaml

SRC = Path("toolchain/sources/icons_v1.yaml")
OUT = Path("toolchain/sources/icons_v1_visual.yaml")
ENDPOINT = "https://apihub.agnes-ai.com/v1/chat/completions"
MODEL = "agnes-2.5-flash"
BATCH_SIZE = 20


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

SYSTEM = """你是食物视觉描述专家，为 AI 生图准备英文描述槽位。严格遵守：

1. container（视觉容器）—— 最关键字段，决定整张图成败：
   - 写明现实中实际使用的容器「材质 + 形状」
   - 中式食物尤其注意：火锅必须是 "traditional Chinese copper hotpot with a tall
     cylindrical chimney in the center"，绝不是不锈钢盆、砂锅或铁锅
   - 麻辣烫是 "a large bowl"，不是面碗
   - 无容器盛装的食物（如苹果、鸡翅、坚果）写 ""
   - 例：珍珠奶茶 -> "a tall clear plastic cup"；米饭 -> "a white ceramic bowl"

2. content（内容物）—— 客观描述颜色与形态：
   - 严禁主观形容词（milky / delicious / appetizing / tasty 一律不用）
   - 只写可观察的客观特征
   - 反例："milky brown"（会误导）；正例："light brown"、"pale yellow"

3. toppings（配料，数组）—— 逐项枚举具体食材：
   - 严禁抽象概括："assorted ingredients"、"vegetables"、"various toppings"
   - 必须列具体名称，如 ["lotus root slices", "corn segments", "meatballs"]
   - 无配料写 []

4. state（状态）—— 动态/温度/质感，如 "bubbling"、"steam rising"、"golden and crispy"；无则写 ""

5. view（视角）—— 只能从这三个里选：
   - "three-quarter side view"（默认，多数食物）
   - "from directly above"（火锅、披萨、汤面等俯视更清晰）
   - "front view"（层叠类，如汉堡、三明治）

输出：仅 JSON 数组，每项 {"id","container","content","toppings","state","view"}。
不要任何解释文字，不要 markdown 代码块。"""


def build_user_prompt(batch):
    items = [{"id": f["id"], "name": f["name"], "cat": f["cat"]} for f in batch]
    return "为以下食物生成生图描述槽位：\n" + json.dumps(items, ensure_ascii=False)


def parse_json_array(text):
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.MULTILINE).strip()
    return json.loads(text)


def call_batch(idx, batch):
    key = KEYS[idx % len(KEYS)]
    payload = json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": build_user_prompt(batch)},
        ],
        "stream": False,
    }).encode()

    last_error = None
    for attempt in (1, 2):
        req = urllib.request.Request(
            ENDPOINT,
            data=payload,
            headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"},
        )
        try:
            resp = json.loads(urllib.request.urlopen(req, timeout=300).read().decode())
            content = resp["choices"][0]["message"]["content"]
            return idx, batch, parse_json_array(content), None
        except Exception as exc:
            last_error = f"{type(exc).__name__}: {str(exc)[:80]}"
            time.sleep(2)
    return idx, batch, None, last_error


def main():
    if not KEYS:
        sys.exit("❌ 未发现 AGNES_API_KEY，无法调用文本模型")

    data = yaml.safe_load(SRC.read_text(encoding="utf-8"))
    foods = data["foods"]
    print(f"清单 {len(foods)} 项，Key {len(KEYS)} 个，每批 {BATCH_SIZE} 项")

    batches = [foods[i:i + BATCH_SIZE] for i in range(0, len(foods), BATCH_SIZE)]
    print(f"共 {len(batches)} 批，并发提交...\n")

    start = time.time()
    with ThreadPoolExecutor(max_workers=len(batches)) as pool:
        results = list(pool.map(lambda kv: call_batch(kv[0], kv[1]), enumerate(batches)))
    elapsed = time.time() - start

    spec = {}
    failed_batches = []
    for idx, batch, items, error in sorted(results):
        if items is None:
            failed_batches.append((idx, error))
            print(f"  ✗ 批次 {idx} 失败: {error}")
            continue
        expected = {f["id"] for f in batch}
        got = {item.get("id") for item in items if isinstance(item, dict)}
        missing = expected - got
        if missing:
            print(f"  ⚠️ 批次 {idx} 缺 {len(missing)} 项: {sorted(missing)}")
        for item in items:
            if isinstance(item, dict) and item.get("id"):
                spec[item["id"]] = item

    print(f"\n耗时 {elapsed:.1f}s   覆盖 {len(spec)}/{len(foods)} 项")

    lines = [
        "# 生图描述槽位（LLM 生成初稿，务必人工审核 vessel 字段）",
        "# 生成脚本：toolchain/gen_visual_spec.py",
        "# 审核重点：vessel 是否为该食物在现实中的标准器皿（器皿错则整张图废）",
        "",
    ]
    for food in foods:
        fid = food["id"]
        item = spec.get(fid)
        if not item:
            lines.append(f'{fid}: {{ name: {food["name"]}, cat: {food["cat"]}, MISSING: true }}')
            continue
        toppings = json.dumps(item.get("toppings") or [], ensure_ascii=False)
        lines.append(
            f'{fid}: {{ name: {food["name"]}, cat: {food["cat"]}, '
            f'container: {json.dumps(item.get("container") or item.get("vessel") or "", ensure_ascii=False)}, '
            f'content: {json.dumps(item.get("content") or "", ensure_ascii=False)}, '
            f'toppings: {toppings}, '
            f'state: {json.dumps(item.get("state") or "", ensure_ascii=False)}, '
            f'view: {json.dumps(item.get("view") or "", ensure_ascii=False)} }}'
        )

    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"✅ 已写出 {OUT}")

    if failed_batches:
        print(f"\n⚠️ {len(failed_batches)} 个批次失败，重跑本脚本即可补齐（已成功项会被覆盖）")
    if len(spec) < len(foods):
        print(f"⚠️ 还有 {len(foods) - len(spec)} 项缺失（标了 MISSING）")


if __name__ == "__main__":
    main()
