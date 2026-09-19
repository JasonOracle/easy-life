#!/usr/bin/env python3
# [新建文件]
# 用途：为 icons_v1.yaml 的每个食物指定「计量器具模板 + 选项模板」引用
#       （数据线前置，与 gen_visual_spec.py 的视觉槽位是两条独立线）

"""gen_usage_spec.py —— 批量生成食物的份量与选项引用

输入：toolchain/sources/icons_v1.yaml（347 项）
依赖：toolchain/sources/vessel_tpl.yaml（计量器具模板集）
      toolchain/sources/opts_tpl.yaml（选项模板集）
输出：toolchain/sources/icons_v1_usage.yaml

用法：
    python -X utf8 toolchain/gen_usage_spec.py
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
VESSEL_TPL = Path("toolchain/sources/vessel_tpl.yaml")
OPTS_TPL = Path("toolchain/sources/opts_tpl.yaml")
OUT = Path("toolchain/sources/icons_v1_usage.yaml")
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


def load_template_keys(path):
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    key = "templates" if "templates" in data else "opt_templates"
    return list(data[key].keys())


VESSEL_KEYS = load_template_keys(VESSEL_TPL)
OPTS_KEYS = load_template_keys(OPTS_TPL)

SYSTEM = f"""你是食物份量建模专家。为每个食物指定「计量器具模板」与「选项模板」引用。

【vessel_tpl 可选值】只能从这些里选，选最贴近的：
- cup         现制茶饮（奶茶/水果茶）小杯350/中杯500/大杯700 ml
- cup_coffee  咖啡 中杯355/大杯473 ml
- cup_soda    汽水/快餐杯 330/500/700 ml
- mug         马克杯：牛奶/豆浆/豆奶/椰奶/奶昔 300 ml
- glass       玻璃杯：水/果汁/椰子水/冰沙 250 ml
- glass_wine  葡萄酒杯 150 ml
- shot        白酒/烈酒小杯 50 ml
- bottle      瓶装：啤酒/矿泉水 330/550 ml
- can         罐装：可乐/雪碧/功能饮料 330 ml
- bowl_rice   米饭/粥/拌饭/炒饭 150/200/300 g
- bowl_noodle 面条/米粉/米线/螺蛳粉 250/400 g
- bowl_soup   汤类 250 g
- pot         火锅/麻辣烫/冒菜/麻辣香锅/大盘鸡 400/700/1000 g
- plate       菜品/沙拉/西式主菜 半份100/一份200/两份400 g
- piece       按个计：水果/鸡蛋/包子/汉堡/蛋糕/粽
- slice       按片计：面包/披萨/西瓜
- skewer      按串计：羊肉串/串串香
- bag         袋装：薯片/饼干/坚果 50/100 g

【opts_tpl 可选值】可多选；不需要任何选项则填空数组 []：
- sweet       奶茶甜度 5 档（仅现制茶饮）
- topping     奶茶加料（仅现制茶饮）
- sugar_pack  咖啡加糖包（仅本身无糖的咖啡：美式/速溶）
- syrup_pump  咖啡糖浆泵数（仅奶咖：拿铁/卡布奇诺）

【关键规则，必须遵守】
1. 摩卡咖啡配方自带巧克力酱，甜度固定 → opts_tpl 为 []
2. 「配方固定差异」而非「用户可调」的，不出选项（如无糖可乐应是独立条目，不是"可乐 + 无糖选项"）
3. 只有用户真正能调的才给 opts
4. 主食、菜品、蔬菜、水果、肉类、零食绝大多数不需要 opts
5. 现制茶饮（珍珠奶茶/水果茶/柠檬茶/芝士奶盖茶）→ ["sweet", "topping"]
6. 杨枝甘露/烧仙草这类现制甜品饮品 → ["sweet"]
7. 火锅/麻辣烫/冒菜/麻辣香锅/串串香 → vessel_tpl 用 "pot"
8. 汉堡/三明治/牛角包用 "piece"；披萨用 "slice"；吐司用 "slice"
9. 纯茶叶品类（绿茶/红茶/乌龙茶/普洱茶/茉莉花茶）默认是「自己泡的茶」，不含糖 →
   vessel_tpl 用 "mug"，opts_tpl 为 []。只有茶饮店现制产品（水果茶/柠檬茶/芝士奶盖茶）
   才给 ["sweet", "topping"]

输出：仅 JSON 数组，每项 {{"id","vessel_tpl","opts_tpl"}}，opts_tpl 为字符串数组。
不要任何解释文字，不要 markdown 代码块。"""


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
            {"role": "user", "content": "为以下食物指定份量与选项引用：\n" + json.dumps(items, ensure_ascii=False)},
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
    print(f"清单 {len(foods)} 项 | vessel 模板 {len(VESSEL_KEYS)} 个 | opts 模板 {len(OPTS_KEYS)} 个")

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
        for item in items:
            if isinstance(item, dict) and item.get("id"):
                spec[item["id"]] = item

    print(f"耗时 {elapsed:.1f}s   覆盖 {len(spec)}/{len(foods)} 项")

    # 校验：引用是否都存在于模板集
    bad_vessel, bad_opts = [], []
    for fid, item in spec.items():
        if item.get("vessel_tpl") not in VESSEL_KEYS:
            bad_vessel.append((fid, item.get("vessel_tpl")))
        for opt in (item.get("opts_tpl") or []):
            if opt not in OPTS_KEYS:
                bad_opts.append((fid, opt))

    lines = [
        "# 份量与选项引用（LLM 生成初稿，待人工审核）",
        "# 生成脚本：toolchain/gen_usage_spec.py",
        "# vessel_tpl 引用 vessel_tpl.yaml 的模板 key；opts_tpl 引用 opts_tpl.yaml 的 key",
        "",
    ]
    for food in foods:
        item = spec.get(food["id"])
        if not item:
            lines.append(f'{food["id"]}: {{ name: {food["name"]}, MISSING: true }}')
            continue
        opts = json.dumps(item.get("opts_tpl") or [], ensure_ascii=False)
        lines.append(
            f'{food["id"]}: {{ name: {food["name"]}, cat: {food["cat"]}, '
            f'vessel_tpl: {item.get("vessel_tpl")}, opts_tpl: {opts} }}'
        )

    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"✅ 已写出 {OUT}")

    if bad_vessel:
        print(f"\n⚠️ 非法 vessel_tpl 引用 {len(bad_vessel)} 处: {bad_vessel[:10]}")
    if bad_opts:
        print(f"⚠️ 非法 opts_tpl 引用 {len(bad_opts)} 处: {bad_opts[:10]}")
    if not bad_vessel and not bad_opts:
        print("✅ 所有引用均合法")


if __name__ == "__main__":
    main()
