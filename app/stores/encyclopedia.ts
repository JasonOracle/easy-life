// [变更日志] 食物百科伴生表读取层：import food_encyclopedia.json（toolchain 生成物，只读），
//       提供条目/类目/点评模板/徽章/三列指引查询与 review 模板运行时填充；页面按 id 与 food_library 联接。
import encJson from '../src/data/food_encyclopedia.json'

export type LText = { zh: string; en: string }

export type EncEntry = {
  id: string
  en: string
  cat: string
  cls: string
  conf: string
  related: string[]
}

export type Guidance = {
  audience: LText
  cautions: LText
  serving: LText
}

type EncRaw = {
  categories: Record<string, { name: LText; intro: LText }>
  reviews: Record<string, LText>
  badges: Record<string, LText>
  guidance: Record<string, Guidance>
  entries: Array<{ id: string; en: string; cat: string; cls: string; conf: string; related: string[] }>
}

const raw = encJson as EncRaw

const _entries: EncEntry[] = raw.entries.map((e): EncEntry => ({
  id: e.id, en: e.en, cat: e.cat, cls: e.cls, conf: e.conf, related: e.related,
}))

const _index: Map<string, EncEntry> = new Map<string, EncEntry>()
for (const e of _entries) {
  _index.set(e.id, e)
}

export function getEncEntry(id: string): EncEntry | null {
  const e = _index.get(id)
  return e != null ? e : null
}

/** 全部英文名（供 searchFoods 的英文匹配扩展） */
export function englishNames(): string[] {
  return _entries.map((e): string => e.en)
}

/** id → 英文名，缺条目回空串 */
export function enNameOf(id: string): string {
  const e = _index.get(id)
  return e != null ? e.en : ''
}

/** 类目展示名（双语） */
export function categoryName(cat: string): LText {
  const c = raw.categories[cat]
  return c != null ? c.name : { zh: cat, en: cat }
}

/** 类目介绍（双语） */
export function categoryIntro(cat: string): LText {
  const c = raw.categories[cat]
  return c != null ? c.intro : { zh: '', en: '' }
}

/** cls 徽章（双语） */
export function badgeOf(cls: string): LText {
  const b = raw.badges[cls]
  return b != null ? b : { zh: '', en: '' }
}

/** cls 三列指引 */
export function guidanceOf(cls: string): Guidance {
  const g = raw.guidance[cls]
  return g != null ? g : { audience: { zh: '', en: '' }, cautions: { zh: '', en: '' }, serving: { zh: '', en: '' } }
}

/** 热门搜索固定 id（数据层豁免 id 红线：鸡蛋/牛奶/米饭/鸡胸肉/西兰花） */
export function hotFoodIds(): string[] {
  return ['p143', 'p284', 'p001', 'p134', 'p186']
}

/** 从图标路径（"protein/p143.webp" 或全路径）解析食物 id；解析失败回空串 */
export function foodIdFromImg(img: string): string {
  const slash = img.lastIndexOf('/')
  let base = slash >= 0 ? img.substring(slash + 1) : img
  const dot = base.lastIndexOf('.')
  if (dot > 0) base = base.substring(0, dot)
  return base
}

/**
 * 点评正文：取 cls 模板并把 {cal} {p} {c} {f} 占位符填成每 100g 营养值。
 * 数值只来自食物库条目，文案零手写。
 */
export function reviewText(cls: string, lang: string, cal: number, p: number, c: number, f: number): string {
  const t = raw.reviews[cls]
  if (t == null) return ''
  let s = lang == 'en' ? t.en : t.zh
  s = s.replace('{cal}', cal.toString())
  s = s.replace('{p}', p.toString())
  s = s.replace('{c}', c.toString())
  s = s.replace('{f}', f.toString())
  return s
}
