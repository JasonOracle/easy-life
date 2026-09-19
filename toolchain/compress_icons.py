#!/usr/bin/env python3
# [变更日志]
# 修改时间：2026-09-19
# AI模型：CodeBuddy (DeepSeek-V4.1-Flash)
# 修改内容：[1. 目标体积默认值由 50KB 下调为 25KB（对齐 FoodLibraryPlan 的 15-25KB/张）;
#           2. 修正降档循环：原 break 条件为 quality<=50，导致压不到 25KB 以下就停;
#           3. 新增 --max-size-kb 命令行参数; 4. 改用 argparse 并支持位置参数兼容旧用法]

"""compress_icons.py — 批量压缩图标为 WebP，目标 ≤25KB/张

用法：
    python compress_icons.py [input_dir] [output_dir] [--max-size-kb 25]
    python compress_icons.py assets/icons-gen assets/icons-compressed --max-size-kb 25

注意：参数语义是「目录 → 目录」。传单个 PNG 路径时 rglob 扫不到任何文件，
      批量流程内应直接 import compress_image() 调用函数。
"""

import os
import sys
from pathlib import Path
from PIL import Image


def compress_image(input_path: Path, output_path: Path, max_size_kb: int = 25) -> bool:
    """压缩单张图片，返回是否成功"""
    try:
        img = Image.open(input_path)

        # 转为 RGB（去掉透明度）
        if img.mode in ('RGBA', 'P', 'LA'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if 'A' in img.mode else None)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        # 缩放到合适尺寸（512x512）
        img = img.resize((512, 512), Image.LANCZOS)

        # 保存为 WebP
        output_path.parent.mkdir(parents=True, exist_ok=True)

        quality = 85
        while quality >= 40:
            output_path = output_path.with_suffix('.webp')
            img.save(output_path, 'WEBP', quality=quality, optimize=True)
            size_kb = output_path.stat().st_size / 1024
            # 原条件 quality <= 50 会让降档提前停止，压不到 25KB 以下；改为降到循环下限
            if size_kb <= max_size_kb or quality <= 40:
                break
            quality -= 5

        size_kb = output_path.stat().st_size / 1024
        print(f"  ✓ {input_path.name} → {size_kb:.1f}KB (quality={quality})")
        return True

    except Exception as e:
        print(f"  ✗ {input_path.name}: {e}")
        return False


def main():
    import argparse

    parser = argparse.ArgumentParser(description="批量压缩图标为 WebP")
    parser.add_argument("input_dir", nargs="?", default="assets/icons", help="输入目录（默认 assets/icons）")
    parser.add_argument("output_dir", nargs="?", default="assets/icons-compressed", help="输出目录（默认 assets/icons-compressed）")
    parser.add_argument("--max-size-kb", type=int, default=25, help="单张目标上限 KB（默认 25）")
    args = parser.parse_args()

    input_dir = Path(args.input_dir)
    output_dir = Path(args.output_dir)

    if not input_dir.exists():
        print(f"ERROR: 目录不存在 — {input_dir}")
        sys.exit(1)

    print(f"📁 输入目录: {input_dir}")
    print(f"📁 输出目录: {output_dir}")
    print(f"🎯 目标大小: ≤{args.max_size_kb}KB/张\n")

    output_dir.mkdir(parents=True, exist_ok=True)

    total = 0
    success = 0

    for png_file in input_dir.rglob("*.png"):
        total += 1
        rel_path = png_file.relative_to(input_dir)
        output_path = output_dir / rel_path.with_suffix('.webp')

        if compress_image(png_file, output_path, max_size_kb=args.max_size_kb):
            success += 1

    print(f"\n✅ 完成: {success}/{total} 张")

    # 计算总大小
    total_size = sum(f.stat().st_size for f in output_dir.rglob("*.webp"))
    print(f"📦 总大小: {total_size / 1024 / 1024:.2f}MB")


if __name__ == "__main__":
    main()
