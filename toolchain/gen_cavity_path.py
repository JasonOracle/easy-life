# -*- coding: utf-8 -*-
# [变更日志]
# 修改时间：2026-09-26
# AI模型：WorkBuddy (DeepSeek-V4.1-Flash)
# 修改内容：[新建：水瓶内胆轮廓（Canvas clip 路径）生成器。从 app/static/home/pingzi.svg 的
#   #A9DCC2 轮廓环里取出 evenodd 内轮廓子路径，按「420x680 aspectFit 进 208x336rpx」换算到
#   .bottle-cavity 局部 rpx 坐标，产出可直接粘进 BottleLiquid.uvue 的 CAVITY_PATH 字面量。
#   背景：.bottle-cavity 是矩形，四边不随瓶身轮廓，瓶肩两侧各外露 50.5rpx；改用真实内腔轮廓
#   作 clip 边界以根治。手抄路径会引入误差，故一律由本脚本生成。]

"""
生成 BottleLiquid.uvue 的「瓶内腔」clip 路径（内胆局部 rpx 坐标）。
数据源：app/static/home/pingzi.svg 中 #A9DCC2 轮廓环（fill-rule=evenodd）的**内轮廓子路径**。
换算链：pingzi.svg 420x680 aspectFit -> .bottle-wrap 208x336rpx
        -> 1 SVG 单位 = 0.4941176 rpx  (336/680)
        -> 1 rpx = 2.0238095 SVG 单位
"""
import io, re, json

SVG = io.open('app/static/home/pingzi.svg', encoding='utf-8').read()

# 取 A9DCC2 环的 d
m = re.search(r'fill="#A9DCC2"[^>]*d="([^"]+)"', SVG)
assert m, 'ring path not found'
d = m.group(1)

# 按 M 切子路径
subs = [s for s in d.split('M') if s.strip()]
assert len(subs) == 2, 'expect 2 subpaths, got %d' % len(subs)
inner = 'M' + subs[1]          # 第二条 = evenodd 的内轮廓 = 瓶内腔
print('内轮廓子路径长度:', len(inner))

# --- 解析 M/L/Q/Z ---
toks = re.findall(r'[MLQZ]|-?\d+(?:\.\d+)?', inner)
cmds, i = [], 0
while i < len(toks):
    t = toks[i]
    if t == 'M':
        cmds.append(('M', float(toks[i+1]), float(toks[i+2]))); i += 3
    elif t == 'L':
        cmds.append(('L', float(toks[i+1]), float(toks[i+2]))); i += 3
    elif t == 'Q':
        cmds.append(('Q', float(toks[i+1]), float(toks[i+2]), float(toks[i+3]), float(toks[i+4]))); i += 5
    elif t == 'Z':
        cmds.append(('Z',)); i += 1
    else:
        raise SystemExit('unexpected token %s' % t)
print('命令数:', len(cmds), {c[0]: sum(1 for x in cmds if x[0] == c[0]) for c in cmds})

# --- 换算：ring local(+62,+106) -> svg -> 内胆局部 rpx ---
TX, TY = 62.0, 106.0                       # ring path 的 translate
WRAP_W, WRAP_H = 208.0, 336.0
SVG_W, SVG_H = 420.0, 680.0
K = min(WRAP_W / SVG_W, WRAP_H / SVG_H)    # rpx / svg-unit = 0.49411765
OFF_X = (WRAP_W - SVG_W * K) / 2.0         # aspectFit 水平居中留白 = 0.2353rpx
CAV_L, CAV_T = 30.0, 80.0                  # .bottle-cavity left/top (rpx)
UPR = 1.0 / K                              # 2.0238095 svg-unit / rpx

def conv(px, py):
    svg_x = px + TX
    svg_y = py + TY
    wrap_x = OFF_X + svg_x * K
    wrap_y = svg_y * K
    return (wrap_x - CAV_L, wrap_y - CAV_T)   # wrap_x/y 本身已是 rpx

out = []
for c in cmds:
    if c[0] == 'M':
        x, y = conv(c[1], c[2]); out.append('M %.2f %.2f' % (x, y))
    elif c[0] == 'L':
        x, y = conv(c[1], c[2]); out.append('L %.2f %.2f' % (x, y))
    elif c[0] == 'Q':
        x1, y1 = conv(c[1], c[2]); x, y = conv(c[3], c[4])
        out.append('Q %.2f %.2f %.2f %.2f' % (x1, y1, x, y))
    else:
        out.append('Z')

print()
print('=== 内胆局部 rpx 路径 ===')
print(' '.join(out))

# --- 关键点自检 ---
pts = []
for c in cmds:
    if c[0] in ('M', 'L'):
        pts.append(conv(c[1], c[2]))
xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
print()
print('内腔 bbox (rpx): x %.2f..%.2f  y %.2f..%.2f' % (min(xs), max(xs), min(ys), max(ys)))
print('canvas 尺寸 = 148 x 236 rpx')
# 直壁段左右（应约 1.24 / 146.76）
print('直壁左 x=%.2f  右 x=%.2f  (canvas 宽 148)' % (pts[0][0] + 0, max(xs)))
# 上沿 y=0 处的裁剪宽度
print()
print('=== 各高度处的裁剪 span（rpx）===')
for yy in [0, 8, 24, 48, 72, 89, 120, 180, 236]:
    seg = []
    # 采样：对每条 Q/L 段做参数扫描，找 y 附近的 x
    cur = None
    for c in cmds:
        pass
    print(' y=%3d -> (见下)' % yy)

# 精确采样：把路径离散化，按 y 分桶
def sample(cmds, n=80):
    pts = []
    cur = None
    for c in cmds:
        if c[0] == 'M':
            cur = (c[1], c[2]); pts.append(conv(*cur))
        elif c[0] == 'L':
            nxt = (c[1], c[2])
            for t in range(n + 1):
                k = t / n
                pts.append(conv(cur[0] + (nxt[0] - cur[0]) * k, cur[1] + (nxt[1] - cur[1]) * k))
            cur = nxt
        elif c[0] == 'Q':
            p1 = (c[1], c[2]); nxt = (c[3], c[4])
            for t in range(n + 1):
                k = t / n
                a = (1 - k) ** 2; b = 2 * (1 - k) * k; cc = k * k
                pts.append(conv(a * cur[0] + b * p1[0] + cc * nxt[0], a * cur[1] + b * p1[1] + cc * nxt[1]))
            cur = nxt
    return pts

sp = sample(cmds)
print()
print('=== 内腔在给定 y 处的横向 span（rpx，canvas 坐标）===')
for yy in [0, 4, 8, 12, 16, 24, 36, 48, 60, 72, 80, 89, 100, 120, 160, 200, 220, 236]:
    row = [p[0] for p in sp if abs(p[1] - yy) < 0.6]
    if row:
        print('  y=%3d  x %6.2f .. %6.2f   (宽 %6.2f)' % (yy, min(row), max(row), max(row) - min(row)))
    else:
        print('  y=%3d  (无采样)' % yy)

# --- 生成 TS 数组字面量 ---
print()
print('=== TS 字面量 ===')
ts = []
for c in cmds:
    if c[0] == 'M':
        x, y = conv(c[1], c[2]); ts.append("    ['M', %.2f, %.2f]," % (x, y))
    elif c[0] == 'L':
        x, y = conv(c[1], c[2]); ts.append("    ['L', %.2f, %.2f]," % (x, y))
    elif c[0] == 'Q':
        x1, y1 = conv(c[1], c[2]); x, y = conv(c[3], c[4])
        ts.append("    ['Q', %.2f, %.2f, %.2f, %.2f]," % (x1, y1, x, y))
    else:
        ts.append("    ['Z'],")
print('\n'.join(ts))
print()
print('共 %d 条命令' % len(ts))
