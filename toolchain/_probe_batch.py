"""一次性探针：同一 prompt 批量生成 20 张文生图，测「一致性 / 不合格率」。

产出一批图到 assets/icons-compressed/_compare/batch-text2img/，供用户肉眼扫。
用完删脚本。
"""

import io
import json
import os
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from PIL import Image

OUT_DIR = "assets/icons-compressed/_compare/batch-text2img"
N = 20

KEYS = sorted(
    value
    for name, value in os.environ.items()
    if name.startswith("AGNES_API_KEY")
    and (name == "AGNES_API_KEY" or name[len("AGNES_API_KEY"):].isdigit())
)

PROMPT = (
    "a tall clear plastic cup of bubble milk tea with black tapioca pearls and a fat straw, "
    "centered on pure white background, soft drop shadow, product photography, "
    "even studio lighting, square composition, high detail, "
    "no text, no watermark, no logo, no people, no hands"
)

os.makedirs(OUT_DIR, exist_ok=True)


def gen(idx):
    body = json.dumps({
        "model": "agnes-image-2.5-flash",
        "prompt": PROMPT,
        "size": "1K",
        "ratio": "1:1",
    }).encode()
    req = urllib.request.Request(
        "https://apihub.agnes-ai.com/v1/images/generations",
        data=body,
        headers={"Authorization": "Bearer " + KEYS[idx % len(KEYS)], "Content-Type": "application/json"},
    )
    start = time.time()
    try:
        data = json.loads(urllib.request.urlopen(req, timeout=300).read().decode())
        return idx, time.time() - start, data["data"][0]["url"]
    except Exception as exc:
        return idx, time.time() - start, f"ERR {str(exc)[:50]}"


print(f"批量生成 {N} 张，并发 {N}，Key 池 {len(KEYS)} 个\n")
t0 = time.time()
with ThreadPoolExecutor(max_workers=N) as pool:
    results = [f.result() for f in [pool.submit(gen, i) for i in range(N)]]
total = time.time() - t0

ok = 0
white_stats = []
for idx, cost, url in sorted(results):
    if url.startswith("ERR"):
        print(f"  #{idx:<2} 失败: {url}")
        continue
    try:
        raw = urllib.request.urlopen(url, timeout=90).read()
        img = Image.open(io.BytesIO(raw)).convert("RGB")
        w, h = img.size
        cs = [img.getpixel((2, 2)), img.getpixel((w - 3, 2)), img.getpixel((2, h - 3)), img.getpixel((w - 3, h - 3))]
        white = sum(1 for c in cs if min(c) > 235)
        white_stats.append(white)
        img.save(f"{OUT_DIR}/{idx+1:02d}.png")
        ok += 1
    except Exception as exc:
        print(f"  #{idx:<2} 下载失败: {str(exc)[:50]}")

print(f"\n成功 {ok}/{N}  总耗时 {total:.1f}s  平均 {total/N:.1f}s/张")
if white_stats:
    full_white = sum(1 for w in white_stats if w == 4)
    print(f"白底合格（四角全白）: {full_white}/{len(white_stats)}")
print(f"\n图已存到: {OUT_DIR}")
