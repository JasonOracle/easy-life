// [变更日志] 主题 token 层：三角色轴 (角色, mode, accent) 查表，色板值以 design/DesignTokens.md §8 为唯一事实来源
import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'
import { THEMEABLE_ASSETS } from './themeAssetList'

export type ThemeMode = 'light' | 'dark'

// 角色键与 DesignTokens.md §8.1 一一对应（kebab → camel）
export type ThemeTokens = {
  bg: string
  card: string
  cardSoft: string
  chip: string
  line: string
  ink1: string
  ink2: string
  ink3: string
  accent: string
  accent2: string
  accentDeep: string
  onAccent: string
  glassBg: string
  glassScrim: string
  thumbStroke: string
  dashLine: string
  heroBg: string
  sysIndicator: string
  /** TabBar 选中态文字（§7.1 tb-text-on 系）。浅档＝同色相压暗、暗档＝该档 accent 本体 */
  tbTextOn: string
  /** TabBar 暗黑态胶囊底＝该档 card 加 72% alpha（§7.2 玻璃面不丢 alpha）；浅态不取用 */
  tbBarDark: string
}

const PALETTES: Record<string, ThemeTokens> = {
  'mint-light': {
    bg: '#F6FBF8', card: '#FFFFFF', cardSoft: '#EEFAF6', chip: '#E6F9F6', line: '#D8EFE5',
    ink1: '#0A4F3D', ink2: '#475569', ink3: '#8BA7A0',
    accent: '#20C997', accent2: '#2BD6A3', accentDeep: '#064E3B', onAccent: '#FFFFFF',
    glassBg: '#FFFFFFF2', glassScrim: '#F6FBF8A6', thumbStroke: '#EAF9F3', dashLine: '#0A4F3D1F',
    heroBg: '#E4F2E9', sysIndicator: '#B9C9C3',
    tbTextOn: '#17916B',
    tbBarDark: 'rgba(22, 41, 36, 0.72)',
  },
  'mint-dark': {
    bg: '#0A1612', card: '#162924', cardSoft: '#1A3B2F', chip: '#2A4238', line: '#24443A',
    ink1: '#FFFFFF', ink2: '#FFFFFFB8', ink3: '#8B9E94',
    accent: '#52D6AC', accent2: '#6FE3BF', accentDeep: '#A7F0DA', onAccent: '#0A1612',
    glassBg: '#FFFFFF14', glassScrim: '#0A1612A6', thumbStroke: '#2A4238', dashLine: '#FFFFFF1F',
    heroBg: '#0E211C', sysIndicator: '#3A4F47',
    tbTextOn: '#52D6AC',
    tbBarDark: 'rgba(22, 41, 36, 0.72)',
  },
  'ocean-light': {
    bg: '#F5FAFD', card: '#FFFFFF', cardSoft: '#EAF4FB', chip: '#E1F0FA', line: '#D2E7F3',
    ink1: '#0F2A3D', ink2: '#3D5A6E', ink3: '#7E96A6',
    accent: '#2F9FE0', accent2: '#4FB8F0', accentDeep: '#0B5E8F', onAccent: '#FFFFFF',
    glassBg: '#FFFFFFF2', glassScrim: '#F5FAFDA6', thumbStroke: '#E3F0F9', dashLine: '#0F2A3D1F',
    heroBg: '#E2F0F9', sysIndicator: '#B4C6D1',
    tbTextOn: '#1B7BB3',
    tbBarDark: 'rgba(20, 35, 46, 0.72)',
  },
  'ocean-dark': {
    bg: '#0A1218', card: '#14232E', cardSoft: '#1A2E3B', chip: '#1E3A4C', line: '#24424F',
    ink1: '#FFFFFF', ink2: '#FFFFFFB8', ink3: '#8FA6B2',
    accent: '#5BC8FF', accent2: '#7AD6FF', accentDeep: '#A8E4FF', onAccent: '#0A1218',
    glassBg: '#FFFFFF14', glassScrim: '#0A1218A6', thumbStroke: '#1E3A4C', dashLine: '#FFFFFF1F',
    heroBg: '#0E1E26', sysIndicator: '#33464F',
    tbTextOn: '#5BC8FF',
    tbBarDark: 'rgba(20, 35, 46, 0.72)',
  },
  'lavender-light': {
    bg: '#FAF8FE', card: '#FFFFFF', cardSoft: '#F3EFFC', chip: '#EFEAFC', line: '#E3DCF5',
    ink1: '#241D47', ink2: '#4E4675', ink3: '#9A93B8',
    accent: '#8B7BE8', accent2: '#A48CF0', accentDeep: '#4F3FA8', onAccent: '#FFFFFF',
    glassBg: '#FFFFFFF2', glassScrim: '#FAF8FEA6', thumbStroke: '#EEEAF9', dashLine: '#241D471F',
    heroBg: '#EDE7F7', sysIndicator: '#C3BCD6',
    tbTextOn: '#5A44DE',
    tbBarDark: 'rgba(29, 24, 48, 0.72)',
  },
  'lavender-dark': {
    bg: '#100D1A', card: '#1D1830', cardSoft: '#241E3C', chip: '#2B2350', line: '#372D5E',
    ink1: '#FFFFFF', ink2: '#FFFFFFB8', ink3: '#9E96BC',
    accent: '#A99BFF', accent2: '#BFB2FF', accentDeep: '#D6CCFF', onAccent: '#100D1A',
    glassBg: '#FFFFFF14', glassScrim: '#100D1AA6', thumbStroke: '#2B2350', dashLine: '#FFFFFF1F',
    heroBg: '#171126', sysIndicator: '#413A55',
    tbTextOn: '#A99BFF',
    tbBarDark: 'rgba(29, 24, 48, 0.72)',
  },
}

// 固定色轴：状态/营养信息语义，不随主题与模式变化（DesignTokens.md §8.3）
export const FIXED_COLORS = {
  statusAmber: '#E8B54D',
  statusCoral: '#FF9E7D',
  infoCarb: '#FCA212',
  infoCalorie: '#FC7130',
}

export const ACCENT_OPTIONS = [
  { id: 'mint', label: '薄荷', swatch: '#20C997' },
  { id: 'ocean', label: '海洋', swatch: '#2F9FE0' },
  { id: 'lavender', label: '薰衣草', swatch: '#8B7BE8' },
]

function paletteFor(accent: string, dark: boolean): ThemeTokens {
  const key = (accent === 'ocean' ? 'ocean' : accent === 'lavender' ? 'lavender' : 'mint') + (dark ? '-dark' : '-light')
  const p = PALETTES[key]
  return p != null ? p : PALETTES['mint-light']
}

const STATIC_PREFIX = '/static/'
const SVG_EXT = '.svg'

function assetSuffix(accent: string, dark: boolean): string {
  if (accent === 'ocean') return dark ? '_ocean_dark' : '_ocean'
  if (accent === 'lavender') return dark ? '_lavender_dark' : '_lavender'
  return dark ? '_dark' : ''
}

/**
 * 把页面里写死的 `/static/x.svg` 换成当前 (accent, mode) 档的变体。
 * 只有 THEMEABLE_ASSETS 登记的底稿有变体——语义色资产（删除红／火焰橙）与无彩稿没有，
 * 而 App 端引用不存在的资源是**静默空白图标、零报错**，所以必须查表后再替换，
 * 命中不了就原样回落底稿路径。
 */
export function themeAsset(accent: string, dark: boolean, src: string): string {
  const suffix = assetSuffix(accent, dark)
  if (suffix.length === 0) return src
  if (src.indexOf(STATIC_PREFIX) !== 0) return src
  if (src.indexOf(SVG_EXT) !== src.length - SVG_EXT.length) return src
  const stem = src.substring(STATIC_PREFIX.length, src.length - SVG_EXT.length)
  if (THEMEABLE_ASSETS.indexOf(stem) < 0) return src
  return STATIC_PREFIX + stem + suffix + SVG_EXT
}

/**
 * 状态栏前景色随主题同步。
 * pages.json 的 navigationBarTextStyle 是构建期静态项，运行时切主题碰不到它，暗态下
 * 就成了黑字压深色底（实测 #040907 对 #0A1612 仅 1.09:1）。
 * 本 App 全部页面都是 navigationStyle:custom：此时 setNavigationBarColor 改不了状态栏
 * 背景（恒透明，各页自己画），但会改状态栏前景色——正是需要的开关；frontColor 只接受
 * #ffffff / #000000 两值。原生端没有 plus.navigator 通道（uni-app x 无 5+ 运行时），
 * 故三端同一条路径，静态配置退居兜底。
 */
export function syncStatusBarStyle(dark: boolean): void {
  uni.setNavigationBarColor({
    frontColor: dark ? '#ffffff' : '#000000',
    backgroundColor: '#000000',
  })
}

export function useTheme() {
  const settings = useSettingsStore()
  const isDark = computed<boolean>(() => settings.darkMode)
  const accentId = computed<string>(() => settings.accent)
  const theme = computed<ThemeTokens>(() => paletteFor(accentId.value, isDark.value))
  return { theme, isDark, accentId }
}
