# -*- coding: utf-8 -*-
"""
[变更日志]
创建时间：2026-09-19
AI模型：CodeBuddy (GLM-5.3-Flash)
创建内容：原生 tabBar 图标生成（PIL 矢量绘制，非 AI 生图）。
          原因：原生 tabBar 只认 PNG 图片文件，而 UI 线性图形不适合走
          Agnes 白底实物图管线（玻璃/白底上露白块）。用 PIL 画房子/人形
          两个字形，81×81 透明底，idle #A9BAB3 / active #1FBF8F。
          产物：app/static/tab/{home,home-active,profile,profile-active}.png
"""
import os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'app', 'static', 'tab'))

SIZE = 81
IDLE = (169, 186, 179, 255)    # #A9BAB3（label-3 衍生色）
ACTIVE = (31, 191, 143, 255)   # #1FBF8F（mint-e2）

SS = 4  # 超采样抗锯齿倍率


def draw_home(color):
    img = Image.new('RGBA', (SIZE * SS, SIZE * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    c = color
    # 房顶：三角形（含短屋檐出挑）
    d.polygon([(40 * SS, 12 * SS), (10 * SS, 42 * SS), (70 * SS, 42 * SS)], fill=c)
    # 房身：圆角矩形（顶部两角小圆角）
    d.rounded_rectangle([(20 * SS, 40 * SS), (60 * SS, 70 * SS)],
                        radius=5 * SS, fill=c)
    # 门：抠掉一块（透明）制造门洞
    d.rounded_rectangle([(34 * SS, 50 * SS), (46 * SS, 70 * SS)],
                        radius=3 * SS, fill=(0, 0, 0, 0))
    return img.resize((SIZE, SIZE), Image.LANCZOS)


def draw_profile(color):
    img = Image.new('RGBA', (SIZE * SS, SIZE * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    c = color
    # 头：圆
    d.ellipse([(28 * SS, 12 * SS), (52 * SS, 36 * SS)], fill=c)
    # 肩：上半圆
    d.pieslice([(16 * SS, 42 * SS), (64 * SS, 90 * SS)], 180, 360, fill=c)
    return img.resize((SIZE, SIZE), Image.LANCZOS)


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, fn in [('home', draw_home), ('profile', draw_profile)]:
        fn(IDLE).save(os.path.join(OUT, name + '.png'))
        fn(ACTIVE).save(os.path.join(OUT, name + '-active.png'))
    print('done:', OUT)


if __name__ == '__main__':
    main()
