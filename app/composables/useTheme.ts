// [变更日志] 主题 token 层：三角色轴 (角色, mode, accent) 查表，色板值以 design/DesignTokens.md §8 为唯一事实来源
import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'

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
}

const PALETTES: Record<string, ThemeTokens> = {
  'mint-light': {
    bg: '#F6FBF8', card: '#FFFFFF', cardSoft: '#EEFAF6', chip: '#E6F9F6', line: '#D8EFE5',
    ink1: '#0A4F3D', ink2: '#475569', ink3: '#8BA7A0',
    accent: '#20C997', accent2: '#2BD6A3', accentDeep: '#064E3B', onAccent: '#FFFFFF',
    glassBg: '#FFFFFFF2', glassScrim: '#F6FBF8A6', thumbStroke: '#EAF9F3', dashLine: '#0A4F3D1F',
    heroBg: '#E4F2E9', sysIndicator: '#B9C9C3',
  },
  'mint-dark': {
    bg: '#0A1612', card: '#162924', cardSoft: '#1A3B2F', chip: '#2A4238', line: '#24443A',
    ink1: '#FFFFFF', ink2: '#FFFFFFB8', ink3: '#8B9E94',
    accent: '#52D6AC', accent2: '#6FE3BF', accentDeep: '#A7F0DA', onAccent: '#0A1612',
    glassBg: '#FFFFFF14', glassScrim: '#0A1612A6', thumbStroke: '#2A4238', dashLine: '#FFFFFF1F',
    heroBg: '#0E211C', sysIndicator: '#3A4F47',
  },
  'ocean-light': {
    bg: '#F5FAFD', card: '#FFFFFF', cardSoft: '#EAF4FB', chip: '#E1F0FA', line: '#D2E7F3',
    ink1: '#0F2A3D', ink2: '#3D5A6E', ink3: '#7E96A6',
    accent: '#2F9FE0', accent2: '#4FB8F0', accentDeep: '#0B5E8F', onAccent: '#FFFFFF',
    glassBg: '#FFFFFFF2', glassScrim: '#F5FAFDA6', thumbStroke: '#E3F0F9', dashLine: '#0F2A3D1F',
    heroBg: '#E2F0F9', sysIndicator: '#B4C6D1',
  },
  'ocean-dark': {
    bg: '#0A1218', card: '#14232E', cardSoft: '#1A2E3B', chip: '#1E3A4C', line: '#24424F',
    ink1: '#FFFFFF', ink2: '#FFFFFFB8', ink3: '#8FA6B2',
    accent: '#5BC8FF', accent2: '#7AD6FF', accentDeep: '#A8E4FF', onAccent: '#0A1218',
    glassBg: '#FFFFFF14', glassScrim: '#0A1218A6', thumbStroke: '#1E3A4C', dashLine: '#FFFFFF1F',
    heroBg: '#0E1E26', sysIndicator: '#33464F',
  },
  'lavender-light': {
    bg: '#FAF8FE', card: '#FFFFFF', cardSoft: '#F3EFFC', chip: '#EFEAFC', line: '#E3DCF5',
    ink1: '#241D47', ink2: '#4E4675', ink3: '#9A93B8',
    accent: '#8B7BE8', accent2: '#A48CF0', accentDeep: '#4F3FA8', onAccent: '#FFFFFF',
    glassBg: '#FFFFFFF2', glassScrim: '#FAF8FEA6', thumbStroke: '#EEEAF9', dashLine: '#241D471F',
    heroBg: '#EDE7F7', sysIndicator: '#C3BCD6',
  },
  'lavender-dark': {
    bg: '#100D1A', card: '#1D1830', cardSoft: '#241E3C', chip: '#2B2350', line: '#372D5E',
    ink1: '#FFFFFF', ink2: '#FFFFFFB8', ink3: '#9E96BC',
    accent: '#A99BFF', accent2: '#BFB2FF', accentDeep: '#D6CCFF', onAccent: '#100D1A',
    glassBg: '#FFFFFF14', glassScrim: '#100D1AA6', thumbStroke: '#2B2350', dashLine: '#FFFFFF1F',
    heroBg: '#171126', sysIndicator: '#413A55',
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

export function useTheme() {
  const settings = useSettingsStore()
  const isDark = computed<boolean>(() => settings.darkMode)
  const accentId = computed<string>(() => settings.accent)
  const theme = computed<ThemeTokens>(() => paletteFor(accentId.value, isDark.value))
  return { theme, isDark, accentId }
}
