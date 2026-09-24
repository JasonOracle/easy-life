"""主题资产重着色生成线（DesignTokens §8.4 矩阵）。

把 app/static/home/ 的五张 mint 底稿 SVG（bg / pingzi / pingzi_tick / yezi-zuo /
yezi-you）按色相旋转产出 ocean / lavender 变体。保持每张图的明度与饱和度关系，
仅整体旋转色相：锚点取主绿 #58B984 的 hue，旋到各 accent 主色 hue。

[变更日志] 2026-09-25 新建：三主题资产矩阵落地（任务 #58），
源色只读、输出覆盖 *_ocean.svg / *_lavender.svg；amber/coral 状态档为固定色轴，
由 debug/gen_bottle_variants.py 早先单独生成，不在本线范围内。
"""
import colorsys
import re
from pathlib import Path

HOME = Path('app/static/home')
BASES = ['bg', 'pingzi', 'pingzi_tick', 'yezi-zuo', 'yezi-you']

SOURCE_ANCHOR = '#58B984'
TARGET_ANCHORS = {
    'ocean': '#2F9FE0',
    'lavender': '#8B7BE8',
}

HEX_RE = re.compile(r'#([0-9A-Fa-f]{6})\b')


def hue_of(hex_color: str) -> float:
    r, g, b = (int(hex_color[i:i + 2], 16) / 255 for i in (1, 3, 5))
    return colorsys.rgb_to_hls(r, g, b)[0]


def rotate(hex_color: str, delta: float) -> str:
    r, g, b = (int(hex_color[i:i + 2], 16) / 255 for i in (1, 3, 5))
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    if s < 0.03:
        return hex_color
    h = (h + delta) % 1.0
    r2, g2, b2 = colorsys.hls_to_rgb(h, l, s)
    return '#{:02X}{:02X}{:02X}'.format(round(r2 * 255), round(g2 * 255), round(b2 * 255))


def main() -> None:
    src_h = hue_of(SOURCE_ANCHOR)
    for tier, anchor in TARGET_ANCHORS.items():
        delta = hue_of(anchor) - src_h
        for base in BASES:
            src = HOME / (base + '.svg')
            text = src.read_text(encoding='utf-8')
            out = HEX_RE.sub(lambda m: rotate('#' + m.group(1), delta), text)
            dst = HOME / '{}_{}.svg'.format(base, tier)
            dst.write_text(out, encoding='utf-8')
            print(dst, '(delta {:.1f} deg)'.format(delta * 360))


if __name__ == '__main__':
    main()
