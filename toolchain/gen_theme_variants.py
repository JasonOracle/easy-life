"""主题资产重着色生成线（DesignTokens §8.4 矩阵）。

把 app/static/ 下的 SVG 按「主题档位」批量重着色，让三主题（mint/ocean/lavender）
与深浅两态（light/dark）不只换瓶身，而是换到每一枚图标。

## 档位是怎么算出来的

- 色相旋转：锚点取主绿 #58B984 的 hue，旋到各 accent 主色 hue，全库共用同一个 delta，
  保证不同图之间的相对明度/饱和关系不被打散。
- 中性色平移：灰底稿（如未选中 Tab 图标 #8A8A8A）不参与色相旋转（S=0 转了没变化），
  但暗态需要把它抬到暗色板的 ink3，否则在 #162924 上对比不足，故走 NEUTRAL_REMAP。

## 逐文件的入选判定

  - 彩色必须全部落在 mint 绿家族（hue 60°..200°）才允许染色；
  - 含家族外彩色（超标橙红、删除红、警示琥珀）＝语义色，整文件跳过并说明原因，
    绝不做「只转一半」的破坏性改写；
  - 无 mint 也无命中 NEUTRAL_REMAP 的文件跳过（转了还是同一张图，白增资产）。

[变更日志]
2026-09-27 Claude (WorkBuddy)：四处写出统一加 newline='\n'（清单 ts / 变体 svg / manifest json）。
  原因：Windows 下 Path.write_text 走文本模式会把 \n 译成 CRLF，themeAssetList.ts 被刷成 59 行 CRLF（HEAD 为 LF），
  每次重跑生成线都污染工作区并触发 git 的 CRLF 警告。生成物换行符应与仓库一致。

[变更日志] 2026-09-25 扩展为全库批处理（原仅 app/static/home 五张）：
新增中性/语义色判定、暗态中性平移、manifest 产出 debug/theme_asset_manifest.json
供页面接线核对。
"""
import colorsys
import json
import re
from pathlib import Path

STATIC = Path('app/static')
OUT = Path('debug/theme_asset_manifest.json')
# 白名单代码产物：页面据此判断「这张图有没有档位变体」，缺档会渲染成破图
LIST_OUT = Path('app/composables/themeAssetList.ts')
# 可染色底稿清单（供 app 端运行时判定某资产是否有主题变体，避免请求不存在的文件）
ASSETS_TS = Path('app/composables/themeAssets.ts')

SOURCE_ANCHOR = '#58B984'

# accent 主色锚点，与 app/composables/useTheme.ts 的 PALETTES 保持同源（light/dark 两态）
ACCENT_ANCHOR = {
    'mint': {'light': '#20C997', 'dark': '#52D6AC'},
    'ocean': {'light': '#2F9FE0', 'dark': '#5BC8FF'},
    'lavender': {'light': '#8B7BE8', 'dark': '#A99BFF'},
}

# 暗态「面」的落点带：lo=heroBg、hi=cardSoft（DesignTokens §8 三档暗色板，与 useTheme PALETTES 同源）。
# 淡底纹资产压暗后应落在「比页面底略亮一档」的位置，才不会既不成块面、也不糊进背景。
SURFACE_ANCHOR = {
    'mint': {'lo': '#0E211C', 'hi': '#1A3B2F'},
    'ocean': {'lo': '#0E1E26', 'hi': '#1A2E3B'},
    'lavender': {'lo': '#171126', 'hi': '#241E3C'},
}

# 暗态「墨」的落点：accentDeep（DesignTokens §8 里 chip 面上的 accent 系墨色，与徽章文字同源）
ACCENT_DEEP_ANCHOR = {
    'mint': {'light': '#064E3B', 'dark': '#A7F0DA'},
    'ocean': {'light': '#0B5E8F', 'dark': '#A8E4FF'},
    'lavender': {'light': '#4F3FA8', 'dark': '#D6CCFF'},
}

# 暗态下中性灰稿的落点（取 useTheme mint-dark / ocean-dark / lavender-dark 的 ink3）
NEUTRAL_REMAP = {
    '#8A8A8A': {
        'dark': '#8B9E94',
        'ocean_dark': '#8FA6B2',
        'lavender_dark': '#9E96BC',
    },
}

# 变体后缀，扫描时要先剔除，否则会把上轮产物当底稿二次旋转
VARIANT_SUFFIXES = ('_ocean', '_lavender', '_dark', '_amber', '_coral')
# 本生成线独占管理的后缀（amber/coral 属状态色轴，由 debug/gen_bottle_variants.py 产出，绝不清理）
MANAGED_SUFFIXES = ('_ocean', '_lavender', '_dark', '_ocean_dark', '_lavender_dark')

HEX_RE = re.compile(r'#([0-9A-Fa-f]{6})\b')
FUNC_RE = re.compile(r'rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)')

MINT_HUE_MIN = 60.0 / 360.0
MINT_HUE_MAX = 200.0 / 360.0
NEUTRAL_SAT = 0.06
# 明度平移只作用的中段带：淡底纹与深色文字级 mint 都在带外（详见 tint 文档）
MID_L_MIN = 0.30
MID_L_MAX = 0.70


def rgb_of(hexc):
    h = hexc.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def classify(r, g, b):
    """neutral（无彩，色相旋转无害）/ mint（主题染色区）/ foreign（语义色，禁转）"""
    h, l, s = colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)
    if s < NEUTRAL_SAT:
        return 'neutral'
    if MINT_HUE_MIN <= h <= MINT_HUE_MAX:
        return 'mint'
    return 'foreign'


def hue_of(hexc):
    r, g, b = rgb_of(hexc)
    return colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)[0]


def hls_of(hexc):
    r, g, b = rgb_of(hexc)
    return colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)


def audit(text):
    """返回 (mint 数, foreign 数)；foreign>0 即该文件不得参与主题化"""
    mint = foreign = 0
    for h in HEX_RE.findall(text):
        kind = classify(*rgb_of('#' + h))
        if kind == 'mint':
            mint += 1
        elif kind == 'foreign':
            foreign += 1
    for m in FUNC_RE.finditer(text):
        kind = classify(int(m.group(1)), int(m.group(2)), int(m.group(3)))
        if kind == 'mint':
            mint += 1
        elif kind == 'foreign':
            foreign += 1
    return mint, foreign


def mint_lightness(text):
    """列出文件内全部 mint 色的明度：判「这张图是不是纯淡色的面资产」用"""
    out = []
    for h in HEX_RE.findall(text):
        if classify(*rgb_of('#' + h)) == 'mint':
            out.append(hls_of('#' + h)[1])
    for m in FUNC_RE.finditer(text):
        r, g, b = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if classify(r, g, b) == 'mint':
            out.append(colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)[1])
    return out


def tint(text, delta, l_shift, mode, ink_floor=None, surface_band=None):
    """mint 色相旋转到目标 accent，并按明暗两态各自的语义重排明度。

    只做色相旋转会把结果压暗：图标底稿的主绿 #1FBF8F（L≈0.44）旋到蓝色族后仍是
    深蓝 #1F5DBF，看着"发闷"（同 L 下蓝色的视觉亮度远低于绿色）。
    校正量取「目标 accent − mint accent」的 L 差做**加法平移**而非各自拉向目标，
    同图内深浅绿的明度阶梯原样保留，只是整条曲线跟着档位走。

    中段带（MID_L）之外，明暗两态的语义相反，故只在暗态补两段落点：
      - 深色墨/线（L < MID_L_MIN，如 #0A7A5C L≈0.26）：压在 #2A4238 上只有 2.04:1，
        抬到该档 accentDeep 的明度（保色相与饱和，不会变纯白）；
      - 淡底纹（L > MID_L_MAX）：仅当**整张图的 mint 全是淡色**＝面/底纹资产时，
        才按原梯度压进 heroBg..cardSoft 明度带。混有中/低明度时那些淡色是图形高光
        或前景（瓶身高光、勾选标记），压暗会毁图，必须原样保留。
    光态两带维持原样：浅底上的浅面与深墨本就成立，改了只会被推成纯白或打乱层级。
    三档 accent 的饱和度都在 0.70~0.74，差不到 5%，故不设饱和校正项。
    """
    def fix(r, g, b):
        if classify(r, g, b) != 'mint':
            return None
        h, l, s = colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)
        if MID_L_MIN <= l <= MID_L_MAX:
            l = min(max(l + l_shift, 0.0), 1.0)
        elif mode == 'dark' and l < MID_L_MIN:
            l = min(max(max(l + l_shift, ink_floor), 0.0), 1.0)
        elif mode == 'dark' and surface_band is not None and l > MID_L_MAX:
            lo, hi = surface_band
            l = lo + (l - MID_L_MAX) / (1.0 - MID_L_MAX) * (hi - lo)
        r2, g2, b2 = colorsys.hls_to_rgb((h + delta) % 1.0, l, s)
        return round(r2 * 255), round(g2 * 255), round(b2 * 255)

    def sub_hex(m):
        out = fix(*rgb_of('#' + m.group(1)))
        if out is None:
            return m.group(0)
        return '#{:02X}{:02X}{:02X}'.format(*out)

    def sub_rgb(m):
        out = fix(int(m.group(1)), int(m.group(2)), int(m.group(3)))
        if out is None:
            return m.group(0)
        return 'rgb({}, {}, {})'.format(*out)

    text = HEX_RE.sub(sub_hex, text)
    return FUNC_RE.sub(sub_rgb, text)


def swap_neutral(text, gray, target):
    """把灰底稿的指定中性色整体平移到暗态落点（大小写不敏感）"""
    return re.sub(re.escape(gray), lambda m: target.upper()
                  if m.group(0).isupper() else target, text, flags=re.IGNORECASE)


def clean_managed():
    """删掉上一轮产出的变体再重生成：本轮判定为「无变化」的档位若不清，
    旧档位留下的错色文件会继续留在盘上被页面引用。
    只删「同名底稿存在」的 —— encyclopedia/back_dark.svg 这类手画资产
    （_dark 是语义名而非变体档）底稿不存在，天然不会被误删。"""
    removed = 0
    for path in sorted(STATIC.rglob('*.svg')):
        stem = path.stem
        hit = next((s for s in MANAGED_SUFFIXES if stem.endswith(s)), None)
        if hit is None:
            continue
        if not path.with_name(stem[:-len(hit)] + path.suffix).exists():
            continue
        path.unlink()
        removed += 1
    return removed


def write_runtime_index(included):
    """产出 app 端运行时用的「可染色底稿」清单（相对 /static、不含扩展名）。

    页面拼的是 `xxx_ocean.svg` 这类文件名，而语义色（删除红／火焰橙）与无彩稿
    根本没有变体，拼错路径在 App 端是**静默空白图标 + 零报错**。有这张清单，
    接线处一句 `themeAsset('/static/xxx.svg')` 就能自己判该不该换档。
    入选条件＝五档变体齐全（见主循环：included 的每张都无条件落盘五份）。
    """
    keys = sorted(item['src'][:-4] for item in included)
    lines = [
        '// [变更日志] 由 toolchain/gen_theme_variants.py 自动生成，请勿手改；',
        '//   改资产或改档位后重跑该脚本。内容＝拥有五档主题变体的底稿（/static 相对路径、无扩展名）。',
        'export const THEMEABLE_ASSETS: string[] = [',
    ]
    for k in keys:
        lines.append('  ' + json.dumps(k, ensure_ascii=False) + ',')
    lines.append(']')
    LIST_OUT.parent.mkdir(parents=True, exist_ok=True)
    LIST_OUT.write_text('\n'.join(lines) + '\n', encoding='utf-8', newline='\n')
    return len(keys)


def main():
    removed = clean_managed()
    src_h = hue_of(SOURCE_ANCHOR)
    # 旋转量：底稿主绿锚点 → 各档 accent 主色（全库共用，保住图与图之间的相对色相关系）
    # 平移量：同模式下「本档 accent − mint accent」的明度差（暗态 accent 更亮，需分开算）
    rotations = {}
    mint_light_l = hls_of(ACCENT_ANCHOR['mint']['light'])[1]
    for tier in ('mint', 'ocean', 'lavender'):
        for mode in ('light', 'dark'):
            h, l, _s = hls_of(ACCENT_ANCHOR[tier][mode])
            # mint 档只做明度校正，不做色相旋转（底稿本就是绿，转了反而偏离品牌色）
            rotations[(tier, mode)] = (0.0 if tier == 'mint' else h - src_h,
                                       l - mint_light_l)

    # 档位矩阵：后缀 → (accent 档, 模式, 中性灰落点键)；光态不动中性灰（灰与主题无关）
    tiers = [('_ocean', 'ocean', 'light', None),
             ('_lavender', 'lavender', 'light', None),
             ('_dark', 'mint', 'dark', 'dark'),
             ('_ocean_dark', 'ocean', 'dark', 'ocean_dark'),
             ('_lavender_dark', 'lavender', 'dark', 'lavender_dark')]

    # 暗态两段落点：墨 → 该档 accentDeep 的明度；面 → 该档 heroBg..cardSoft 明度带
    dark_ink_l = {t: hls_of(ACCENT_DEEP_ANCHOR[t]['dark'])[1] for t in ACCENT_ANCHOR}
    dark_surface_l = {t: (hls_of(SURFACE_ANCHOR[t]['lo'])[1],
                          hls_of(SURFACE_ANCHOR[t]['hi'])[1]) for t in ACCENT_ANCHOR}

    included, skipped_foreign, skipped_idle = [], [], []

    for path in sorted(STATIC.rglob('*.svg')):
        stem = path.stem
        if any(stem.endswith(s) for s in VARIANT_SUFFIXES):
            continue
        text = path.read_text(encoding='utf-8')
        mint, foreign = audit(text)
        rel = str(path.relative_to(STATIC)).replace('\\', '/')
        grays = [g for g in NEUTRAL_REMAP if re.search(re.escape(g), text, re.I)]
        # 纯淡色稿＝面/底纹资产（home/bg.svg）；混有墨色的稿其淡色是高光或前景，不得压暗
        mls = mint_lightness(text)
        is_surface = mint > 0 and len(mls) > 0 and min(mls) > MID_L_MAX

        if foreign > 0:
            skipped_foreign.append(rel)
            continue
        if mint == 0 and not grays:
            skipped_idle.append(rel)
            continue

        variants = {}
        for suffix, tier, mode, gray_key in tiers:
            delta, l_shift = rotations[(tier, mode)]
            ink_floor = dark_ink_l[tier] if mode == 'dark' else None
            surface_band = dark_surface_l[tier] if (mode == 'dark' and is_surface) else None
            out = tint(text, delta, l_shift, mode, ink_floor, surface_band) if mint > 0 else text
            if gray_key is not None:
                for gray in grays:
                    out = swap_neutral(out, gray, NEUTRAL_REMAP[gray][gray_key])
            # 五个档位一律落盘（哪怕内容与底稿相同）：页面按 `<基名>_<档>.svg`
            # 拼路径，缺文件在 App 端是静默空白图标，宁可留一份同色副本
            dst = path.with_name(stem + suffix + path.suffix)
            dst.write_text(out, encoding='utf-8', newline='\n')
            variants[suffix.lstrip('_')] = str(dst.relative_to(STATIC)).replace('\\', '/')

        included.append({'src': rel, 'variants': variants})

    manifest = {
        'source_anchor': SOURCE_ANCHOR,
        'accent_anchors': ACCENT_ANCHOR,
        'hue_delta_deg': {t + '-' + m: round(v[0] * 360, 1)
                          for (t, m), v in rotations.items() if t != 'mint'},
        'lightness_shift': {t + '-' + m: round(v[1], 3)
                            for (t, m), v in rotations.items()},
        'cleaned_stale': removed,
        'included_count': len(included),
        'included': included,
        'skipped_semantic': skipped_foreign,
        'skipped_no_color_change': skipped_idle,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(manifest, ensure_ascii=False, indent=2),
                   encoding='utf-8', newline='\n')
    listed = write_runtime_index(included)

    print('染色资产 %d 张（清理上轮残留 %d 个），变体清单见 manifest'
          % (len(included), removed))
    print('运行时索引 → %s（%d 条）' % (LIST_OUT, listed))
    for suffix, tier, mode, _g in tiers:
        d, l = rotations[(tier, mode)]
        print('  %-16s 色相 %+.1f° 明度 %+.3f' % (suffix, d * 360, l))
    print('语义色跳过（禁转）%d 张:' % len(skipped_foreign))
    for f in skipped_foreign:
        print('   ', f)
    print('无彩可旋跳过 %d 张' % len(skipped_idle))
    print('manifest →', OUT)


if __name__ == '__main__':
    main()
