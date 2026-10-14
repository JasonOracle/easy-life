#!/usr/bin/env python3
# [变更日志]
# 修改时间：2026-09-19
# AI模型：CodeBuddy (DeepSeek-V4.1-Flash)
# 修改内容：[1. 修复 Pixabay 域名错误 api.pixabay.com 导致接口 100% 失败;
#           2. 修正 per_page=1 非法取值(文档要求 3-200)触发 HTTP 400;
#           3. 搜索词补 URL 编码, 避免带空格关键词构造非法 URL;
#           4. 下载档位由 webformatURL(640) 改为 largeImageURL(1280), 提升图标清晰度;
#           5. 清理 download_image 处 &sig= 自我替换的死代码;
#           6. 补充 safesearch/lang/最小尺寸过滤, 并延长超时至 15s;
#           7. 将 Pixabay 提为第一顺位, Pexels 降为兜底;
#           8. 修复压缩断链: 原本只压 source=="web", 导致 Pixabay/Pexels 的图不产 webp;
#           9. 修复索引覆盖: _update_index 改为合并写, 避免跑单分类冲掉其他分类记录]
"""fetch_icons.py — 食物图标批量获取

优先级：
  1. Pixabay API（免费，需配置 PIXABAY_IMAGE_API_KEY）
  2. 直接从 Unsplash/Pexels 下载（不涉及版权）
  3. Agnes AI 生成（兜底）

用法：
  python fetch_icons.py [--category fruits|vegetables|meat|staple|drinks|snacks]
  python fetch_icons.py --all
"""

import os
import sys
import json
import time
import random
from pathlib import Path
from datetime import datetime
from typing import Optional, List, Dict
from dataclasses import dataclass

# 进程内直接复用压缩函数：
# 原先用 os.system 起子进程调 compress_icons.py 有两个坑——
#   1) 子进程不走 -X utf8，Windows GBK 控制台打印 emoji 直接崩溃；
#   2) compress_icons.py 的 main() 只接受「目录」参数，传单个 PNG 路径时
#      rglob 扫不到任何文件，等于永远压不出 webp。
try:
    from compress_icons import compress_image
except ImportError as exc:  # 例如缺 Pillow，只跳过压缩，不阻断下载
    compress_image = None
    print(f"  ⚠️ 压缩模块不可用，将跳过压缩: {exc}", file=sys.stderr)

# ── 配置 ──────────────────────────────────────────────────────────────────────
PIXABAY_API_KEY = os.environ.get("PIXABAY_IMAGE_API_KEY", "")
PEXELS_API_KEY = os.environ.get("PEXELS_API_KEY", "") or os.environ.get("PEXELS_API_KEY2", "")
AGNES_API_KEY = os.environ.get("AGNES_API_KEY", "")

OUTPUT_DIR = Path("assets/icons-compressed")
SOURCE_DIR = Path("assets/icons")
INDEX_FILE = Path("assets/icons/icon_index.json")
LOG_FILE = Path("toolchain/icon_fetch.log")

PIXABAY_RATE_LIMIT = 100  # requests per minute
PEXELS_RATE_LIMIT = 200 // 60  # 200 requests per minute

# ── 食物图标清单 ───────────────────────────────────────────────────────────────
ICON_CATALOG = {
    "fruits": [
        ("apple", ["apple", "red apple", "fruit"]),
        ("banana", ["banana", "yellow banana"]),
        ("orange", ["orange", "mandarin", "citrus"]),
        ("strawberry", ["strawberry", "fresh strawberry"]),
        ("grape", ["grape", "purple grapes"]),
        ("watermelon", ["watermelon", "melon slice"]),
        ("mango", ["mango", "tropical mango"]),
        ("pineapple", ["pineapple", "tropical fruit"]),
        ("peach", ["peach", "fresh peach"]),
        ("cherry", ["cherry", "red cherries"]),
        ("kiwi", ["kiwi", "kiwi fruit"]),
        ("lemon", ["lemon", "citrus lemon"]),
        ("pear", ["pear", "fresh pear"]),
        ("coconut", ["coconut", "tropical coconut"]),
    ],
    "vegetables": [
        ("broccoli", ["broccoli", "green broccoli"]),
        ("carrot", ["carrot", "fresh carrot"]),
        ("tomato", ["tomato", "red tomato"]),
        ("cucumber", ["cucumber", "fresh cucumber"]),
        ("potato", ["potato", "sweet potato"]),
        ("onion", ["onion", "red onion"]),
        ("garlic", ["garlic", "fresh garlic"]),
        ("lettuce", ["lettuce", "green lettuce"]),
        ("pepper", ["bell pepper", "colored pepper"]),
        ("eggplant", ["eggplant", "aubergine"]),
        ("pumpkin", ["pumpkin", "winter squash"]),
        ("spinach", ["spinach", "leafy greens"]),
        ("corn", ["corn", "sweet corn"]),
        ("mushroom", ["mushroom", "shiitake"]),
    ],
    "meat": [
        ("beef", ["beef steak", "raw beef"]),
        ("chicken", ["chicken breast", "fried chicken"]),
        ("pork", ["pork meat", "pork chop"]),
        ("fish", ["fish fillet", "salmon"]),
        ("shrimp", ["shrimp", "prawn"]),
        ("egg", ["egg", "chicken egg"]),
        ("bacon", ["bacon", "pork bacon"]),
        ("tofu", ["tofu", "silken tofu"]),
        ("duck", ["duck meat", "roast duck"]),
        ("lamb", ["lamb meat", "lamb chop"]),
    ],
    "staple": [
        ("rice", ["rice bowl", "white rice"]),
        ("noodles", ["noodles", "ramen bowl"]),
        ("bread", ["bread loaf", "fresh bread"]),
        ("pasta", ["pasta", "spaghetti"]),
        ("dumpling", ["dumpling", "jiaozi"]),
        ("burger", ["hamburger", "cheeseburger"]),
        ("sandwich", ["sandwich", "toast"]),
        ("pizza", ["pizza", "cheese pizza"]),
        ("sushi", ["sushi", "sushi roll"]),
        ("curry", ["curry rice", "japanese curry"]),
        ("hotpot", ["hot pot", "shabu shabu"]),
        ("skewer", ["kebab", "meat skewer"]),
    ],
    "drinks": [
        ("bubble_tea", ["bubble tea", "boba milk tea"]),
        ("coffee", ["coffee", "cappuccino"]),
        ("milk", ["milk", "glass of milk"]),
        ("juice", ["orange juice", "fresh juice"]),
        ("tea", ["tea", "green tea"]),
        ("smoothie", ["smoothie", "fruit smoothie"]),
        ("soy_milk", ["soy milk", "plant milk"]),
        ("soda", ["soda", "cola drink"]),
        ("water", ["water glass", "mineral water"]),
        ("matcha", ["matcha", "green tea latte"]),
    ],
    "snacks": [
        ("fries", ["french fries", "potato fries"]),
        ("chips", ["potato chips", "crisps"]),
        ("cookie", ["cookie", "biscuit"]),
        ("cake", ["cake slice", "dessert cake"]),
        ("ice_cream", ["ice cream", "scoop ice cream"]),
        ("popcorn", ["popcorn", "cinema popcorn"]),
        ("chocolate", ["chocolate", "chocolate bar"]),
        ("donut", ["donut", " glazed donut"]),
        ("nuts", ["mixed nuts", "trail mix"]),
        ("yogurt", ["yogurt", "greek yogurt"]),
    ],
}


@dataclass
class FetchResult:
    food_id: str
    category: str
    source: str  # "pixabay" | "web" | "agnes"
    url: Optional[str]
    local_path: Optional[Path]
    size_kb: int
    success: bool
    error: Optional[str] = None


class IconFetcher:
    def __init__(self):
        self.pixabay_rate_limit = PIXABAY_RATE_LIMIT
        self.pexels_rate_limit = PEXELS_RATE_LIMIT
        self.last_pixabay_time = 0
        self.stats: Dict[str, int] = {"pixabay": 0, "pexels": 0, "web": 0, "agnes": 0}

    def _wait_for_pixabay_rate_limit(self):
        """遵守 Pixabay 速率限制"""
        if not PIXABAY_API_KEY:
            return
        now = time.time()
        elapsed = now - self.last_pixabay_time
        if elapsed < 60 / self.pixabay_rate_limit:
            time.sleep(60 / self.pixabay_rate_limit - elapsed)
        self.last_pixabay_time = time.time()

    def _fetch_from_pixabay(self, search_terms: List[str]) -> Optional[str]:
        """从 Pixabay API 获取图片 URL

        依据官方文档 https://pixabay.com/api/docs/ ：
        - 域名必须为 pixabay.com/api/，不存在 api.pixabay.com 子域
        - per_page 合法区间为 3-200，传 1 会直接返回 HTTP 400
        - q 需 URL 编码，否则带空格的关键词会构造出非法 URL
        - 普通 Key 最大只能取到 largeImageURL(1280px)，
          imageURL / fullHDURL 需要额外申请完整 API 权限
        - 返回的图片 URL 有效期仅 24 小时，必须即时下载落盘，禁止长期热链接
        """
        if not PIXABAY_API_KEY:
            return None

        import urllib.parse
        import urllib.request

        for term in search_terms:
            try:
                self._wait_for_pixabay_rate_limit()
                query = urllib.parse.urlencode({
                    "key": PIXABAY_API_KEY,
                    "q": term,
                    "lang": "en",
                    "image_type": "photo",
                    "min_width": 640,
                    "min_height": 640,
                    "safesearch": "true",
                    "order": "popular",
                    "per_page": 3,
                })
                url = f"https://pixabay.com/api/?{query}"
                with urllib.request.urlopen(url, timeout=15) as resp:
                    data = json.loads(resp.read().decode())
                    if data.get("hits"):
                        return data["hits"][0]["largeImageURL"]
            except Exception as e:
                print(f"  ⚠️ Pixabay '{term}' 失败: {e}", file=sys.stderr)
                continue
        return None

    def _wait_for_pexels_rate_limit(self):
        """遵守 Pexels 速率限制"""
        if not PEXELS_API_KEY:
            return
        now = time.time()
        elapsed = now - self.last_pixabay_time
        if elapsed < 60 / self.pexels_rate_limit:
            time.sleep(60 / self.pexels_rate_limit - elapsed)
        self.last_pixabay_time = time.time()

    def _fetch_from_unsplash(self, search_term: str) -> Optional[str]:
        """从 Unsplash 获取免费图片（不依赖 API）"""
        try:
            import urllib.request
            # Unsplash Source API（注意：官方已弃用，但临时可用）
            url = f"https://source.unsplash.com/300x300/?{search_term.replace(' ', ',')}"
            # 直接返回 URL，后续下载
            return url
        except Exception as e:
            print(f"  ⚠️ Unsplash 失败: {e}", file=sys.stderr)
            return None

    def _fetch_from_pexels(self, search_terms: List[str]) -> Optional[str]:
        """从 Pexels API 获取图片 URL"""
        if not PEXELS_API_KEY:
            return None

        for term in search_terms:
            try:
                self._wait_for_pexels_rate_limit()
                import urllib.parse
                import urllib.request
                encoded_term = urllib.parse.quote(term)
                url = (
                    f"https://api.pexels.com/v1/search?query={encoded_term}&per_page=1"
                )
                req = urllib.request.Request(
                    url,
                    headers={
                        "Authorization": PEXELS_API_KEY,
                        "User-Agent": "EasyLife/1.0"
                    }
                )
                with urllib.request.urlopen(req, timeout=10) as resp:
                    data = json.loads(resp.read().decode())
                    if data.get("photos"):
                        # 返回原图 URL（高质量版本）
                        photo = data["photos"][0]
                        return photo["src"]["original"]
            except Exception as e:
                print(f"  ⚠️ Pexels '{term}' 失败: {e}", file=sys.stderr)
                continue
        return None

    def _generate_with_agnes(self, prompt: str, output_path: Path) -> bool:
        """调用 Agnes AI 生成图片"""
        if not AGNES_API_KEY:
            print(f"  ❌ 无 Agnes API Key", file=sys.stderr)
            return False

        try:
            # 使用 DeferExecuteTool 调用 ImageGen
            # 由于是 CLI 脚本，这里用系统命令或直接调用
            import subprocess
            # 注：实际部署时需要通过 MCP 调用 ImageGen
            # 这里简化处理，返回 False 表示需要手动生图
            return False
        except Exception as e:
            print(f"  ❌ Agnes 生成失败: {e}", file=sys.stderr)
            return False

    def download_image(self, url: str, output_path: Path) -> bool:
        """下载图片到本地"""
        try:
            import urllib.request
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
                output_path.parent.mkdir(parents=True, exist_ok=True)
                output_path.write_bytes(data)
                return True
        except Exception as e:
            print(f"  ❌ 下载失败: {e}", file=sys.stderr)
            return False

    def fetch_icon(
        self,
        food_id: str,
        category: str,
        search_terms: List[str],
    ) -> FetchResult:
        """获取单个食物图标，按优先级尝试三种来源"""
        output_path = OUTPUT_DIR / category / f"{food_id}.webp"
        source_dir = SOURCE_DIR / category

        # 检查是否已存在
        if output_path.exists():
            size_kb = output_path.stat().st_size // 1024
            return FetchResult(
                food_id=food_id,
                category=category,
                source="existing",
                url=None,
                local_path=output_path,
                size_kb=size_kb,
                success=True,
            )

        # 1. 尝试 Pixabay（第一顺位）
        if PIXABAY_API_KEY:
            pixabay_url = self._fetch_from_pixabay(search_terms)
            if pixabay_url:
                png_path = source_dir / f"{food_id}.png"
                if self.download_image(pixabay_url, png_path):
                    self.stats["pixabay"] += 1
                    print(f"  ✓ Pixabay: {food_id}")
                    return FetchResult(
                        food_id=food_id,
                        category=category,
                        source="pixabay",
                        url=pixabay_url,
                        local_path=png_path,
                        size_kb=png_path.stat().st_size // 1024,
                        success=True,
                    )

        # 2. 尝试 Pexels（Pixabay 无命中或下载失败时兜底）
        if PEXELS_API_KEY:
            pexels_url = self._fetch_from_pexels(search_terms)
            if pexels_url:
                png_path = source_dir / f"{food_id}.png"
                if self.download_image(pexels_url, png_path):
                    self.stats["pexels"] += 1
                    print(f"  ✓ Pexels: {food_id}")
                    return FetchResult(
                        food_id=food_id,
                        category=category,
                        source="pexels",
                        url=pexels_url,
                        local_path=png_path,
                        size_kb=png_path.stat().st_size // 1024,
                        success=True,
                    )

        # 3. 尝试 Unsplash（直接下载）
        for term in search_terms:
            unsplash_url = f"https://source.unsplash.com/800x800/?{term.replace(' ', ',')}"
            png_path = source_dir / f"{food_id}.png"
            if self.download_image(unsplash_url, png_path):
                self.stats["web"] += 1
                print(f"  ✓ Unsplash: {food_id}")
                return FetchResult(
                    food_id=food_id,
                    category=category,
                    source="web",
                    url=unsplash_url,
                    local_path=png_path,
                    size_kb=png_path.stat().st_size // 1024,
                    success=True,
                )

        # 4. Agnes AI 兜底（标记为待生成）
        self.stats["agnes"] += 1
        print(f"  ⏳ 需要 AI 生成: {food_id}")
        return FetchResult(
            food_id=food_id,
            category=category,
            source="agnes_pending",
            url=None,
            local_path=None,
            size_kb=0,
            success=False,
            error="需要手动调用 ImageGen 生成",
        )


def main():
    """主入口"""
    import argparse
    parser = argparse.ArgumentParser(description="批量获取食物图标")
    parser.add_argument("--category", choices=list(ICON_CATALOG.keys()), help="指定分类")
    parser.add_argument("--all", action="store_true", help="获取所有图标")
    parser.add_argument("--skip-existing", action="store_true", help="跳过已存在的图标")
    args = parser.parse_args()

    # 初始化
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)

    fetcher = IconFetcher()
    results: List[FetchResult] = []

    # 确定要处理的分类
    categories = [args.category] if args.category else list(ICON_CATALOG.keys())
    if args.all:
        categories = list(ICON_CATALOG.keys())

    print(f"\n🎨 开始获取图标...")
    print(f"   Pixabay API: {'✅ 已配置' if PIXABAY_API_KEY else '❌ 未配置'}")
    print(f"   Agnes API: {'✅ 已配置' if AGNES_API_KEY else '❌ 未配置'}\n")

    for category in categories:
        print(f"\n📁 {category.upper()}")
        for food_id, search_terms in ICON_CATALOG[category]:
            result = fetcher.fetch_icon(food_id, category, search_terms)
            results.append(result)

            # 所有新下载的 PNG 都要压缩，不能只压已停服的 Unsplash("web") 来源，
            # 否则 Pixabay/Pexels 的图永远不产 webp，索引里的路径就是死链
            if result.success and result.local_path and result.source != "existing":
                png_path = result.local_path
                webp_path = OUTPUT_DIR / category / f"{food_id}.webp"
                if png_path.exists() and not webp_path.exists() and compress_image:
                    compress_image(png_path, webp_path)

    # 打印统计
    print(f"\n{'='*50}")
    print(f"📊 统计:")
    print(f"   Pixabay 下载: {fetcher.stats['pixabay']}")
    print(f"   网络下载: {fetcher.stats['web']}")
    print(f"   待 AI 生成: {fetcher.stats['agnes']}")
    print(f"{'='*50}\n")

    # 更新索引
    if results:
        _update_index(results)


def _update_index(results: List[FetchResult]):
    """更新 icon_index.json（与磁盘上已有索引合并写入）

    原实现只写当次 results，跑单个分类会把其他分类的记录整段冲掉，
    这里改为先读旧索引再合并，stats 按合并后的真实条数重算。
    """
    index: Dict = {"icons": {}}

    if INDEX_FILE.exists():
        raw = INDEX_FILE.read_bytes()
        # 历史上该文件用系统默认编码(GBK)写过，逐个编码尝试，读不通就重建
        for enc in ("utf-8-sig", "gbk"):
            try:
                old_icons = json.loads(raw.decode(enc)).get("icons")
                if isinstance(old_icons, dict):
                    index["icons"] = old_icons
                    break
            except Exception:
                continue
        else:
            print("  ⚠️ 旧索引无法解析，将重建", file=sys.stderr)

    index["version"] = "1.1.0"
    index["generated"] = datetime.now().isoformat()
    index["source"] = "fetch_icons.py"
    index["notes"] = [
        "图标来源优先级：Pixabay > Pexels > Unsplash > Agnes AI",
        "部分图标需要手动调用 ImageGen 生成",
    ]

    for r in results:
        cat = r.category
        fid = r.food_id
        index["icons"].setdefault(cat, {})

        entry = {
            "file": f"icons-compressed/{cat}/{fid}.webp" if r.local_path else None,
            "source": r.source,
            "url": r.url,
            "size_kb": r.size_kb,
        }
        if not r.success:
            entry["pending"] = True
            entry["error"] = r.error

        index["icons"][cat][fid] = entry

    index["stats"] = {cat: len(items) for cat, items in index["icons"].items()}

    INDEX_FILE.write_text(
        json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"✅ 索引已更新: {INDEX_FILE}")


if __name__ == "__main__":
    main()
