// [变更日志] 语言解析助手：settings.locale 为空时跟随系统语言，产出统一 'zh'/'en' 供各页取双语字段
import { useSettingsStore } from '../stores/settings'

export function resolveLang(): string {
  const settings = useSettingsStore()
  const pref = settings.locale
  if (pref == 'zh' || pref == 'en') return pref
  let sysLang = ''
  try {
    sysLang = uni.getSystemInfoSync().language ?? ''
  } catch (e) {
    sysLang = ''
  }
  return sysLang.indexOf('zh') == 0 ? 'zh' : 'en'
}
