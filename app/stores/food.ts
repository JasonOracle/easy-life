/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[「最近记录/单日详情」两页数据支撑：新增导出 dayKeyOf(ts)（YYYY-MM-DD 日键）与
 *           dayRange(key)（该日 [起,止) 毫秒区间）；store 新增 getter dayTotals
 *           （日键→当日总 kcal，供月历圆点/超标判定一次遍历）；state 新增 viewDay
 *           （Records→DayDetail 跳转传日，免 URL options 兼容问题）；
 *           amountText 改为导出（单日详情行份量用）；MEAL_LABELS.snack 修正为「夜宵」
 *           （对齐 Pencil 稿 MC_夜宵/Meal_夜宵 命名，原「加餐」与稿不符）。]
 */
/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[1. FoodBase 增 py 拼音索引（build.py 新产物字段）；searchFoods 支持
 *            名称子串 / 全拼 / 首字母三种匹配，供弹层⓪ 食物选择列表搜索。
 *          2. 新增导出 vesselLabelOf()：取器具模板中文名（碗/杯/盘…），
 *            供 FoodPicker 副行「一碗约 200g」拼句。]
/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Muse Spark
 * 修改内容：[增补计数步进器三件套 MAX_COUNT/DEFAULT_COUNT/portionRatio/portionLevel（设计稿规格）]
﻿/**
 * [变更日志]
 * 修改时间：2026-09-20
 * AI模型：CodeBuddy
 * 修改内容：[1. 【P0-Bug 修复】按「个/片/串」计的食物热量算错约 80 倍——原 computeEntry
 *            一律按 amount/100 缩放，而这类食物 vessel 档位 amount=1（单位「个」），
 *            base 却是每 100g，必须先乘 pieceWeight 再缩放。实测馒头(p017,pw=75)
 *            正确 167 kcal 却算出 2 kcal。影响面 piece 170 条 / pieceWeight 非空 102 条。
 *            改法：新增导出的 COUNT_UNITS + gramsOf()，computeEntry 增加 unit 入参，
 *            遇计数单位时先 gramsOf 折算 grams 再缩放。g/ml 类行为保持不变（回归项）。
 *          2. 【P0-Bug 修复】sweetOptsOf() 硬返回 []，而 AddSheet 判断写的是
 *            "sweets !== null" → [] !== null 恒真 → 甜度段对所有食物都渲染且内部空。
 *            改法：库解析补读 optTpl（此前只读了 vesselTpl），新增 optGroupsOf(food)
 *            按条目 opts 字段真读模板；AddSheet 改按 groups 渲染且空则不渲染整段。
 *          3. 明细行结构化：MealRow.details 由 string[] 改为 FoodLine[]
 *            （含 img / amountText / kcal / time），供首页每条食物显示自身时分秒 + 缩略图。
 *            Home.uvue 模板同步改造（v-for key 改 d.key）。
 *          4. 选项真正计入热量：OptGroup 补 scale / baseAmount（来自 opts_tpl.yaml
 *             的 scale: by_capacity + base_amount: 500），新增 optDeltaOf()；
 *             computeEntry 增第 5 参 extraKcal——此前选「全糖」热量纹丝不动。]
 */

/**
 * [变更日志]
 * 修改时间：2026-09-19
 * AI模型：CodeBuddy
 * 修改内容：[1. 食物 store——库解析（347 条一次，模块级缓存）+ 当日记录（entries）
 *           + 宏量营养素总计（protein/carb/fat，供首页营养素卡）;
 *           2. 接入 app/data/food_library.json 真实数据（含 protein/carb/fat，
 *              由 build.py 从 nutrition_v1.yaml 合并，2026-09-19 补入 base 字段）;
 *           3. 演示数据全部删除，改为从 JSON 加载。
 *           4. 修复：漏 import pinia 的 defineStore，编译产物输出裸全局引用，
 *              运行时 ReferenceError: defineStore is not defined（拖垮 AddSheet/MealIcon）。
 *           5. 修复：mealRows 返回字段（label/entries）与 Home 模板消费字段（name/
 *              active/details）不一致，m.details.length 报 reading 'length'；已对齐
 *              MealRow 结构（key/name/active/cal/details），details 恒为数组。
 *           6. 灌演示数据（Boss 授权）：SEED_PLAN 七天（今日四餐 + 前 6 天），
 *              热量全走 computeEntry 按库值计算；所有统计 getter 改为按日过滤
 *              （todayEntries / weekTotals 新增）；totalCal 从 state 改 getter
 *              （保证与 entries 恒一致，删 totalCal 手工加减的重复状态）。
 *           7. UI 还原度评审 Round1 修复：FoodEntry 增 amount/unit、MealRow 增
 *              time（餐次最早记录 HH:MM）、明细改「名称 份量 · kcal」格式——
 *              对齐设计稿「早餐 · 07:30」「燕麦片 40g · 150 kcal」。]
 * 触发重编译：2026-09-19T22:02
 * ⚠️ 用 .ts 而非 .uts：UTS 编译器会破坏 .uts 里的中文字符串，.ts 编译产物中文完好。
 */

import { defineStore } from 'pinia'
import foodLibraryJson from '../src/data/food_library.json'

// ===== 类型定义 =====
/** 搜索拼音索引（build.py 生成）：f=全拼连写，i=首字母串 */
export interface FoodPinyin {
  f: string
  i: string
}

export interface FoodBase {
  id: string
  name: string
  cat: string
  kcal: number          // 每 100g / 100ml 热量
  unit: string          // g 或 ml
  protein?: number      // g / 100g|ml
  carb?: number
  fat?: number
  pieceWeight?: number  // 按个计食物的克重
  vessel?: string
  opts?: string[]
  img?: string
  conf?: number
  /** 数据来源标识（composition_table / recipe_estimate / rough_estimate），记录快照用 */
  source?: string
  /** 搜索拼音索引（全拼 f + 首字母 i），build.py 生成 */
  py?: FoodPinyin
}

export interface VesselTplEntry {
  k: string
  name: string
  amount: number
  unit: string
}

export interface VesselTpl {
  label: string
  sizes: VesselTplEntry[]
}

export interface SweetTpl {
  label: string
  options: OptItem[]
}

export interface OptItem {
  k: string
  name: string
  deltaKcal: number
  /** 是否为量级估算（toolchain/sources/opts_tpl.yaml 的 estimate 字段） */
  estimate?: boolean
}

/** 选项模板组（对应 opts_tpl.yaml 的一个 opt_templates 条目） */
export interface OptGroup {
  key: string
  label: string
  hint: string
  type: string // single | multi
  def: string
  /** delta_kcal 的缩放方式：by_capacity（按容量线性）/ none（定值） */
  scale: string
  /** scale=by_capacity 时的基准量（ml），opts_tpl.yaml sweet.base_amount=500 */
  baseAmount: number
  estimate: boolean
  items: OptItem[]
}

/** 计数类单位：这类单位的 amount 是「几个」，必须借 pieceWeight 折算成克 */
export const COUNT_UNITS = ['个', '片', '串'] as const

/** 计数步进器上限（设计稿 CountStepper 规格：n ∈ [1, 100]，默认 3） */
export const MAX_COUNT = 100

/** 默认计数（步进器首次打开） */
export const DEFAULT_COUNT = 3

/** 份量能量条：对数刻度，返回 0..1 的条宽比例 */
export function portionRatio(n: number): number {
  const k = Math.min(Math.max(n, 1), MAX_COUNT)
  return Math.log(1 + k) / Math.log(1 + MAX_COUNT)
}

/** 条色阈值：0 mint（≤4）/ 1 amber（5–24）/ 2 coral（≥25） */
export function portionLevel(n: number): number {
  if (n <= 4) return 0
  if (n <= 24) return 1
  return 2
}

/** 把「计数单位 × 个数」折算成等效克/ml；g/ml 类原样返回 */
export function gramsOf(food: FoodBase, amount: number, unit: string): number {
  const isCount = COUNT_UNITS.some((u): boolean => u === unit)
  if (isCount && food.pieceWeight != null) {
    return amount * food.pieceWeight
  }
  return amount
}

export interface FoodEntry {
  id: string
  name: string
  kcal: number
  protein: number
  carb: number
  fat: number
  ts: number
  meal: string
  amount?: number  // 记录时的等效 g/ml（计数类已折算），明细行展示用
  unit?: string    // 展示单位（计数类已归一为 g）
  img?: string     // "<catKey>/<id>.webp"
  /** 冗余快照（AGENTS.md 数据约束）：不存纯 foodId，改版/删库后记录仍可读 */
  foodName?: string
  source?: string
  schemaVersion?: string
}

/** 计数类单位：这类单位的 amount 是「几个」，必须借 pieceWeight 折算成克 */

/** 首页餐次下的单条食物明细（结构化，替代原 string[] —— 供图片 + 时分秒展示） */
export interface FoodLine {
  key: string       // 同餐同名会重复，必须带唯一后缀
  img: string       // "<catKey>/<id>.webp"，App 前缀 static/icons/
  name: string
  amountText: string // "40g" / "1 个" / "350ml"
  kcal: number
  time: string      // "08:12:34"（时分秒；多次添加同一食物靠它区分）
}

export interface MealRow {
  key: string
  name: string
  /** 该餐次最早记录时间 HH:MM（无记录为空串），设计稿「早餐 · 07:30」格式 */
  time: string
  active: boolean
  cal: number | string
  details: FoodLine[]
}

// ===== 常量 =====
export const MEAL_KEYS = ['breakfast', 'lunch', 'dinner', 'snack'] as const
export const MEAL_LABELS: Record<string, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '夜宵',
}

// ===== 库数据（模块级缓存） =====
let _lib: { foods: FoodBase[]; vessels: Record<string, VesselTpl>; optTpl: Record<string, OptGroup> } | null = null

function loadLibrary(): { foods: FoodBase[]; vessels: Record<string, VesselTpl>; optTpl: Record<string, OptGroup> } {
  if (_lib) return _lib
  const raw = foodLibraryJson as {
    foods: Array<{
      id: string
      name: string
      cat: string
      base: { cal: number; per: number; unit: string; protein?: number; carb?: number; fat?: number }
      pieceWeight?: number
      vessel?: string
      opts?: string[]
      img?: string
      conf?: number
      py?: FoodPinyin
    }>
    vesselTpl: Record<string, { label: string; sizes: VesselTplEntry[] }>
    optTpl?: Record<string, {
      key: string
      label: string
      hint?: string
      type: string
      def: string
      scale?: string
      base_amount?: number
      opts: Array<{ k: string; name: string; delta_kcal: number; estimate?: boolean }>
    }>
  }

  const foods: FoodBase[] = raw.foods.map((f) => ({
    id: f.id,
    name: f.name,
    cat: f.cat,
    kcal: f.base.cal,
    unit: f.base.unit,
    protein: f.base.protein ?? 0,
    carb: f.base.carb ?? 0,
    fat: f.base.fat ?? 0,
    pieceWeight: f.pieceWeight ?? undefined,
    vessel: f.vessel,
    opts: f.opts,
    img: f.img,
    conf: f.conf,
    source: (f as { source?: string }).source ?? '',
    py: f.py,
  }))

  // 从 vesselTpl 构建 vessels 索引（key → { label, sizes }）
  const vessels: Record<string, VesselTpl> = {}
  for (const [k, v] of Object.entries(raw.vesselTpl)) {
    vessels[k] = { label: v.label, sizes: v.sizes }
  }

  // 从 optTpl 构建选项索引（此前漏读 —— 这正是「甜度段永远空」的根因）
  const optTpl: Record<string, OptGroup> = {}
  for (const [k, v] of Object.entries(raw.optTpl ?? {})) {
    optTpl[k] = {
      key: v.key,
      label: v.label,
      hint: v.hint ?? '',
      type: v.type,
      def: v.def,
      scale: v.scale ?? 'none',
      baseAmount: v.base_amount ?? 0,
      estimate: v.opts.some((o): boolean => o.estimate === true),
      items: v.opts.map((o): OptItem => ({
        k: o.k,
        name: o.name,
        deltaKcal: o.delta_kcal,
        estimate: o.estimate === true,
      })),
    }
  }

  _lib = { foods, vessels, optTpl }
  return _lib
}

// ===== 查询函数 =====
export const ALL_FOODS: FoodBase[] = []

// 模块加载时立即从 JSON 初始化（确保 FoodPickerSheet 等组件拿到数据）
const _lib0 = loadLibrary()
ALL_FOODS.push(..._lib0.foods)

export function getFoodById(id: string): FoodBase | undefined {
  return ALL_FOODS.find((f) => f.id === id)
}

export function vesselSizesOf(vesselKey: string): VesselTplEntry[] {
  const lib = loadLibrary()
  return lib.vessels[vesselKey]?.sizes ?? []
}

/** 器具模板中文名（碗/杯/盘/瓶…），无模板返回空串 */
export function vesselLabelOf(vesselKey: string): string {
  const lib = loadLibrary()
  return lib.vessels[vesselKey]?.label ?? ''
}

/**
 * 按食物条目的 opts 字段真实取选项模板组（替换原硬返回 [] 的 sweetOptsOf）。
 * 例：珍珠奶茶 opts=['sweet','topping'] → 返回甜度组 + 加料组；米饭 opts 为空 → 返回 []。
 */
export function optGroupsOf(food: FoodBase | null): OptGroup[] {
  if (food == null) return []
  const lib = loadLibrary()
  const out: OptGroup[] = []
  for (const k of food.opts ?? []) {
    const g = lib.optTpl[k]
    if (g != null) out.push(g)
  }
  return out
}

/**
 * 选项项的附加热量（kcal）。
 * opts_tpl.yaml 里只有 sweet 声明了 scale: by_capacity + base_amount: 500，
 * 即「全糖 +110 kcal」是 500ml 的口径，实际按容量线性缩放；其余组为定值（scale: none）。
 */
export function optDeltaOf(group: OptGroup, item: OptItem, grams: number): number {
  if (group.scale === 'by_capacity' && group.baseAmount > 0) {
    return Math.round(item.deltaKcal * (grams / group.baseAmount))
  }
  return item.deltaKcal
}

/** @deprecated 恒返回空数组（历史遗留），保留仅为避免外部误引；请改用 optGroupsOf */
export function sweetOptsOf(sweetKey: string): OptItem[] {
  return []
}

/** 按分类筛选食物 */
export function foodsByCat(cat: string): FoodBase[] {
  return ALL_FOODS.filter((f) => f.cat === cat)
}

/** 搜索食物（名称子串 / 全拼 / 首字母，均不区分大小写） */
export function searchFoods(query: string): FoodBase[] {
  const q = query.trim().toLowerCase()
  if (!q) return ALL_FOODS
  return ALL_FOODS.filter((f) =>
    f.name.toLowerCase().includes(q) ||
    (f.py != null && (f.py.f.includes(q) || f.py.i.includes(q)))
  )
}

/**
 * 计算一条记录的营养素（按实际分量缩放）
 * ⚠️ amount 的语义由 unit 决定：计数单位（个/片/串）需先经 gramsOf 折算，
 *    否则「1 个馒头」会按 1/100 缩放得到 2 kcal（正确值 167 kcal）。
 * @param extraKcal 选项附加热量（甜度/加料/糖包/糖浆），无则传 0
 */
export function computeEntry(food: FoodBase, amount: number, unit: string, meal: string, extraKcal: number): FoodEntry {
  const grams = gramsOf(food, amount, unit)
  const ratio = grams / 100 // base 是每 100g/100ml
  const kcal = food.kcal * ratio + extraKcal
  return {
    id: `${food.id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: food.name,
    kcal: Math.round(kcal),
    protein: Math.round((food.protein ?? 0) * ratio * 10) / 10,
    carb: Math.round((food.carb ?? 0) * ratio * 10) / 10,
    fat: Math.round((food.fat ?? 0) * ratio * 10) / 10,
    ts: Date.now(),
    meal,
    amount: grams,
    unit: COUNT_UNITS.some((u): boolean => u === unit) ? 'g' : unit,
    img: food.img ?? '',
    foodName: food.name,
    source: food.source ?? '',
    schemaVersion: '1.0',
  }
}

// ===== 演示数据（Boss 授权灌入）=====
// 热量/营养全部经 computeEntry 按库内 base 值实时计算，不手写任何 kcal；
// 食材/克重选择为演示场景值。7 天 = 今天 + 前 6 天，供首页今日餐次与「我的」页周概览。

interface SeedItem { id: string; amount: number; meal: string; hour: number }
type SeedDay = SeedItem[]

const SEED_PLAN: SeedDay[] = [
  /* 6 天前（回测 1581，趋势柱 1） */
  [
    { id: 'p231', amount: 90, meal: 'breakfast', hour: 8 },
    { id: 'p130', amount: 310, meal: 'lunch', hour: 12.5 },
    { id: 'p089', amount: 190, meal: 'lunch', hour: 12.5 },
    { id: 'p230', amount: 218, meal: 'dinner', hour: 18.5 },
    { id: 'p065', amount: 289, meal: 'dinner', hour: 18.5 },
  ],
  /* 5 天前（回测 1722，趋势柱 2） */
  [
    { id: 'p231', amount: 268, meal: 'breakfast', hour: 8 },
    { id: 'p069', amount: 230, meal: 'lunch', hour: 12.5 },
    { id: 'p130', amount: 210, meal: 'lunch', hour: 12.5 },
    { id: 'p270', amount: 230, meal: 'snack', hour: 15.5 },
  ],
  /* 4 天前（回测 1649，趋势柱 3） */
  [
    { id: 'p143', amount: 190, meal: 'breakfast', hour: 8 },
    { id: 'p062', amount: 208, meal: 'lunch', hour: 12.5 },
    { id: 'p089', amount: 290, meal: 'lunch', hour: 12.5 },
    { id: 'p230', amount: 122, meal: 'dinner', hour: 18.5 },
    { id: 'p130', amount: 350, meal: 'dinner', hour: 18.5 },
  ],
  /* 3 天前（回测 1579，历史 R3 达标） */
  [
    { id: 'p286', amount: 214, meal: 'breakfast', hour: 8 },
    { id: 'p065', amount: 270, meal: 'lunch', hour: 12.5 },
    { id: 'p069', amount: 320, meal: 'dinner', hour: 18.5 },
  ],
  /* 2 天前（回测 1719，历史 R2 达标） */
  [
    { id: 'p286', amount: 200, meal: 'breakfast', hour: 8 },
    { id: 'p069', amount: 80, meal: 'breakfast', hour: 8 },
    { id: 'p062', amount: 300, meal: 'lunch', hour: 12.5 },
    { id: 'p069', amount: 270, meal: 'dinner', hour: 18.5 },
    { id: 'p230', amount: 332, meal: 'snack', hour: 15.5 },
  ],
  /* 昨天（回测 1948，历史 R1 超标） */
  [
    { id: 'p143', amount: 150, meal: 'breakfast', hour: 8 },
    { id: 'p062', amount: 112, meal: 'lunch', hour: 12.5 },
    { id: 'p089', amount: 320, meal: 'lunch', hour: 12.5 },
    { id: 'p130', amount: 200, meal: 'dinner', hour: 18.5 },
    { id: 'p130', amount: 330, meal: 'dinner', hour: 18.5 },
  ],
  /* 今天（v2 稿行菜：早 420 / 午 560 / 晚 390，合计 1368；行热量走库值精确还原） */
  [
    { id: 'p348', amount: 40, meal: 'breakfast', hour: 7.5 },
    { id: 'p349', amount: 83, meal: 'breakfast', hour: 7.5 },
    { id: 'p350', amount: 231, meal: 'breakfast', hour: 7.5 },
    { id: 'p351', amount: 350, meal: 'lunch', hour: 12.17 },
    { id: 'p352', amount: 161, meal: 'lunch', hour: 12.17 },
    { id: 'p353', amount: 100, meal: 'lunch', hour: 12.17 },
    { id: 'p230', amount: 400, meal: 'dinner', hour: 18.33 },
    { id: 'p286', amount: 360, meal: 'dinner', hour: 18.33 },
    { id: 'p270', amount: 140, meal: 'dinner', hour: 18.33 },
  ],
]

function isSameDay(a: number, b: number): boolean {
  const da = new Date(a)
  const db = new Date(b)
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate()
}

/** 日键 YYYY-MM-DD（最近记录月历 / 单日详情共用） */
export function dayKeyOf(ts: number): string {
  const d = new Date(ts)
  const m = d.getMonth() + 1
  const day = d.getDate()
  return (
    d.getFullYear() +
    '-' +
    (m < 10 ? '0' + m.toString() : m.toString()) +
    '-' +
    (day < 10 ? '0' + day.toString() : day.toString())
  )
}

/** 日键 → 该日 [起, 止) 毫秒区间 */
export function dayRange(key: string): number[] {
  const parts = key.split('-')
  const y = parseInt(parts[0])
  const mo = parseInt(parts[1])
  const da = parseInt(parts[2])
  const start = new Date(y, mo - 1, da).getTime()
  return [start, start + 24 * 60 * 60 * 1000]
}

/** 按 SEED_PLAN 生成 7 天记录（ts 落在对应日期的对应餐点时刻） */
function seedEntries(): FoodEntry[] {
  const out: FoodEntry[] = []
  const now = new Date()
  for (let d = 0; d < SEED_PLAN.length; d++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (SEED_PLAN.length - 1 - d))
    for (const item of SEED_PLAN[d]) {
      const food = getFoodById(item.id)
      if (food == null) continue
      const ts = new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(item.hour), Math.round((item.hour % 1) * 60)).getTime()
      const entry = computeEntry(food, item.amount, food.unit, item.meal, 0)
      entry.ts = ts
      out.push(entry)
    }
  }
  return out
}

// ===== Store =====

/** HH:MM:SS（补零）—— Boss 要求每条食物显示自身时分秒，用于区分多次添加同一食物 */
function hhmmss(ts: number): string {
  const d = new Date(ts)
  const p = (n: number): string => (n < 10 ? '0' + n.toString() : n.toString())
  return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds())
}

/** 份量展示文案：g/ml 紧贴数值，计数单位留空格（设计稿「水煮蛋 1 个」格式） */
export function amountText(e: FoodEntry): string {
  if (e.amount == null || e.unit == null || e.unit === '') return ''
  return `${e.amount}${e.unit}`
}

interface FoodState {
  entries: FoodEntry[]
  /** 单日详情页查看日（YYYY-MM-DD）：Records 跳转前写入，页面间传参走 store 免 URL options 兼容问题 */
  viewDay: string
}

const STORAGE_KEY = 'ct_food_entries_v1'

/** 从本地存储恢复记录；失败或为空则回落演示种子（Boss 授权灌入） */
function loadEntries(): FoodEntry[] {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    if (typeof raw === 'string' && raw.length > 2) {
      const parsed = JSON.parse(raw) as FoodEntry[]
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    // 存储不可用时回落种子数据
  }
  return seedEntries()
}

function saveEntries(entries: FoodEntry[]): void {
  try {
    uni.setStorageSync(STORAGE_KEY, JSON.stringify(entries))
  } catch (e) {
    // 存储失败不阻塞记录
  }
}

const state = (): FoodState => ({
  entries: loadEntries(),
  viewDay: '',
})

export const useFoodStore = defineStore('food', {
  state,
  getters: {
    /** 今日条目（所有统计按日过滤，7 天历史不串入今日） */
    todayEntries(state): FoodEntry[] {
      const now = Date.now()
      return state.entries.filter((e) => isSameDay(e.ts, now))
    },

    /** 今日总热量 */
    totalCal(): number {
      return this.todayEntries.reduce((s, e) => s + e.kcal, 0)
    },

    mealRows(): MealRow[] {
      const todays = this.todayEntries
      return MEAL_KEYS.map((k) => {
        const entries = todays.filter((e) => e.meal === k)
        const cal = entries.reduce((s, e) => s + e.kcal, 0)
        // 餐次时间 = 该餐最早记录（设计稿「早餐 · 07:30」）
        let firstTs = 0
        for (const e of entries) {
          if (firstTs === 0 || e.ts < firstTs) firstTs = e.ts
        }
        let time = ''
        if (firstTs > 0) {
          const d = new Date(firstTs)
          const hh = d.getHours() < 10 ? '0' + d.getHours().toString() : d.getHours().toString()
          const mm = d.getMinutes() < 10 ? '0' + d.getMinutes().toString() : d.getMinutes().toString()
          time = hh + ':' + mm
        }
        // 字段必须与 Home.uvue 模板消费一致（m.name/m.time/m.active/m.cal/m.details），
        // details 恒为数组：模板有 m.details.length 判断，undefined 会在 v-for 渲染时炸
        return {
          key: k,
          name: MEAL_LABELS[k] ?? k,
          time,
          active: entries.length > 0,
          cal: entries.length ? cal : '未记录',
          // 结构化明细：每条食物自带图片 / 份量 / 热量 / 时分秒
          // （原 string[] 承载不了图片与时间；同餐同名的多条靠 index 保证 key 唯一）
          details: entries.map((e, i): FoodLine => ({
            key: `${e.id}_${i}`,
            img: e.img ?? '',
            name: e.name,
            amountText: amountText(e),
            kcal: e.kcal,
            time: hhmmss(e.ts),
          })),
        }
      })
    },

    /** 总蛋白质 (g)（今日） */
    totalProtein(): number {
      return Math.round(this.todayEntries.reduce((s, e) => s + e.protein, 0) * 10) / 10
    },

    /** 总碳水 (g)（今日） */
    totalCarbs(): number {
      return Math.round(this.todayEntries.reduce((s, e) => s + e.carb, 0) * 10) / 10
    },

    /** 总脂肪 (g)（今日） */
    totalFat(): number {
      return Math.round(this.todayEntries.reduce((s, e) => s + e.fat, 0) * 10) / 10
    },

    /** 近 7 天逐日总量（含无记录日，0 占位）；Profile 周概览/趋势消费 */
    weekTotals(state): Array<{ ts: number; total: number }> {
      const now = new Date()
      const out: Array<{ ts: number; total: number }> = []
      for (let i = 6; i >= 0; i--) {
        const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i).getTime()
        const dayEnd = dayStart + 24 * 60 * 60 * 1000
        const total = state.entries
          .filter((e) => e.ts >= dayStart && e.ts < dayEnd)
          .reduce((s, e) => s + e.kcal, 0)
        out.push({ ts: dayStart, total })
      }
      return out
    },

    /** 日键 → 当日总 kcal（全部历史一次遍历；月历圆点 / 超标判定共用） */
    dayTotals(state): Record<string, number> {
      const map: Record<string, number> = {}
      for (const e of state.entries) {
        const k = dayKeyOf(e.ts)
        map[k] = (map[k] ?? 0) + e.kcal
      }
      return map
    },
  },
  actions: {
    addEntry(entry: FoodEntry) {
      this.entries.push(entry)
      saveEntries(this.entries)
    },
    removeEntry(id: string) {
      const idx = this.entries.findIndex((e) => e.id === id)
      if (idx >= 0) {
        this.entries.splice(idx, 1)
        saveEntries(this.entries)
      }
    },
    /** 清空今日记录（保留历史，供「数据管理」危险项用） */
    clearToday() {
      const now = Date.now()
      this.entries = this.entries.filter((e) => !isSameDay(e.ts, now))
      saveEntries(this.entries)
    },

    /** 初始化：从 JSON 加载 347 条食物库 */
    initLibrary() {
      const lib = loadLibrary()
      ALL_FOODS.length = 0
      ALL_FOODS.push(...lib.foods)
    },
  },
})