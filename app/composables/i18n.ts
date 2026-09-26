// [变更日志] 全 App i18n 字典层：t(key) 查扁平面包键（'en:' 前缀＝英文，缺省回落中文），
//       各页把界面文案换成 t() 调用即完成双语；新增词条只改本文件 DICT。
import { resolveLang } from './useLocale'

const DICT = new Map<string, string>()

/** 登记一对文案：zh 为缺省语言，en 缺登记时自动回落 zh */
export function reg(key: string, zh: string, en: string): void {
  DICT.set(key, zh)
  DICT.set('en:' + key, en)
}

/** 取当前语言文案；未登记的键原样返回（便于渐进替换） */
export function t(key: string): string {
  const en = resolveLang() == 'en'
  if (en) {
    const hit = DICT.get('en:' + key)
    if (hit != null) return hit
  }
  const zh = DICT.get(key)
  return zh != null ? zh : key
}

/** 带占位符取词：模板内 {0}/{1}… 依序替换为 args */
export function tf(key: string, args: Array<string>): string {
  let s = t(key)
  for (let i = 0; i < args.length; i++) {
    s = s.replace('{' + i.toString() + '}', args[i])
  }
  return s
}

// ===== 词条登记（按模块分组） =====

// Tabbar 三 Tab
reg('tab.home', '首页', 'Home')
reg('tab.records', '日历', 'Calendar')
reg('tab.me', '我的', 'Me')

// Profile 个人中心
reg('pf.streak', '已连续记录  {0} 天  ·  每日目标  {1} kcal', 'Streak {0} days · Daily goal {1} kcal')
reg('pf.todayCal', '今日热量', 'Today')
reg('pf.remain', '还可以吃', 'Remaining')
reg('pf.over', '已超标', 'Over')
reg('pf.consumed', '已摄入', 'Consumed')
reg('pf.goal', '目标', 'Goal')
reg('pf.statGoal', '目标热量 / kcal', 'Goal / kcal')
reg('pf.statConsumed', '已摄入 / kcal', 'Consumed / kcal')
reg('pf.statRemain', '还能吃 / kcal', 'Left / kcal')
reg('pf.bannerOverT', '今日不达标', 'Over budget')
reg('pf.bannerOverS', '请减少进食，加油啊', 'Ease off a little — you got this')
reg('pf.bannerOkT', '今日已达标', 'On target today')
reg('pf.bannerOkS', '继续保持，做得很好！', 'Keep it up, nicely done!')
reg('pf.bannerPendT', '今日记录中', 'Logging today')
reg('pf.bannerPendS', '记录 2 餐及以上且未超标即算达标', 'Log 2+ meals under budget to hit target')
reg('pf.weekTitle', '本周概览', 'This Week')
reg('pf.weekLbl', '天达标', 'days ok')
reg('pf.trend', '热量趋势', 'Trend')
reg('pf.viewAll', '查看全部', 'View all')
reg('pf.recent', '最近记录', 'Recent')
reg('pf.mdLong', '{0}月{1}日', '{0}/{1}')
reg('pf.badgeOver', '超标 {0} kcal', '+{0} kcal')
reg('pf.badgeOk', '达标', 'OK')
// 周点标签（一..日，英文取首字母）
reg('pf.w1', '一', 'M')
reg('pf.w2', '二', 'T')
reg('pf.w3', '三', 'W')
reg('pf.w4', '四', 'T')
reg('pf.w5', '五', 'F')
reg('pf.w6', '六', 'S')
reg('pf.w0', '日', 'S')
// 周几全名（周X → Mon..Sun）
reg('pf.d1', '周一', 'Mon')
reg('pf.d2', '周二', 'Tue')
reg('pf.d3', '周三', 'Wed')
reg('pf.d4', '周四', 'Thu')
reg('pf.d5', '周五', 'Fri')
reg('pf.d6', '周六', 'Sat')
reg('pf.d0', '周日', 'Sun')

// Settings 设置页
reg('st.title', '设置', 'Settings')
reg('st.sub', '管理你的饮食记录与偏好', 'Manage records & preferences')
reg('st.pref', '偏好', 'Preferences')
reg('st.dark', '深色模式', 'Dark mode')
reg('st.remind', '用餐提醒', 'Meal reminders')
reg('st.remindSub', '早中晚各提醒一次，敬请期待', 'Once per main meal — coming soon')
reg('st.soon', '即将上线', 'Soon')
reg('st.theme', '主题切换', 'Theme')
reg('st.lang', '语言切换', 'Language')
reg('st.goalSec', '目标管理', 'Goals')
reg('st.goalDaily', '每日热量目标', 'Daily calorie goal')
reg('st.goalCur', '当前目标 {0} kcal', 'Current goal {0} kcal')
reg('st.mealCustom', '自定义餐次', 'Custom meals')
reg('st.mealCustomSub', '早餐、午餐、晚餐、加餐…', 'Breakfast, lunch, dinner, snack…')
reg('st.dataSec', '数据管理', 'Data')
reg('st.export', '导出数据', 'Export data')
reg('st.exportSub', '备份到本地', 'Back up on this device')
reg('st.import', '导入数据', 'Import data')
reg('st.importSub', '从文件恢复', 'Restore from a file')
reg('st.shield', '所有数据仅保存在本机', 'All data stays on this device')
reg('st.clear', '清空所有数据', 'Erase all data')
reg('st.brand', '轻律生活  CalTrack', 'CalTrack')
reg('st.foot', '数据仅保存在本机', 'Data stays on this device')
reg('st.mint', '薄荷 Mint', 'Mint')
reg('st.mintSub', '清透绿意，品牌本色', 'Crisp green, house colour')
reg('st.ocean', '海洋 Ocean', 'Ocean')
reg('st.oceanSub', '沉静蓝调，专注记录', 'Calm blue, focused logging')
reg('st.lav', '薰衣草 Lavender', 'Lavender')
reg('st.lavSub', '柔和紫调，轻松氛围', 'Soft violet, easy vibe')
reg('st.sys', '跟随系统', 'System')
reg('st.sysSub', '按手机语言自动选择', 'Follows phone language')
reg('st.zh', '简体中文', '简体中文')
reg('st.zhSub', 'Simplified Chinese', 'Simplified Chinese')
reg('st.en', 'English', 'English')
reg('st.enSub', '英语', 'English')

// Records 日历页
reg('rec.title', '最近记录', 'Recent Logs')
reg('rec.sub', '查看过去的饮食记录与热量摄入', 'Past meals & calorie intake')
reg('rec.in', '已摄入', 'Consumed')
reg('rec.over', '超标 {0} kcal', 'Over by {0} kcal')
reg('rec.goal', '目标 {0} kcal', 'Goal {0} kcal')
reg('rec.meals', '三餐摄入', 'Meals')
reg('rec.detail', '查看详情', 'Details')
reg('rec.itemN', '{0}项', '{0} items')
reg('rec.mains', '主要食物', 'Main Foods')
reg('rec.all', '查看全部', 'View all')
reg('rec.empty', '这一天还没有记录', 'No logs for this day')
reg('rec.year', '{0}年{1}月', '{1}/{0}')
reg('rec.md', '{0}月{1}日', '{0}/{1}')

// DayDetail 日详情页
reg('dd.today', '今日热量', 'Today')
reg('dd.ring', '已摄入', 'Consumed')
reg('dd.goal', '目标', 'Goal')
reg('dd.nutrition', '营养分布', 'Nutrition')
reg('dd.protein', '蛋白质', 'Protein')
reg('dd.carb', '碳水', 'Carbs')
reg('dd.fat', '脂肪', 'Fat')
reg('dd.meals', '餐次记录', 'Meal Logs')
reg('dd.add', '添加食物', 'Add food')
reg('dd.none', '尚未添加', 'None yet')
reg('dd.sumTitle', '今日饮食总结', "Today's Summary")
reg('dd.sumSub', '继续保持，明天会更好！', 'Keep it up — tomorrow will be better!')
reg('dd.mdw', '{0}月{1}日 · {2}', '{0}/{1} · {2}')
reg('dd.del', '删除这条记录', 'Delete this log')

// Home 首页
reg('hm.brand', '轻律生活', 'CalTrack')
reg('hm.tagline', '让健康饮食成为一种习惯', 'Make healthy eating a habit')
reg('hm.date', '{0}月{1}日 · {2}', '{0}/{1} · {2}')
reg('hm.remain', '还能吃', 'Left')
reg('hm.consumed', '已摄入 {0} / {1} kcal', 'Consumed {0} / {1} kcal')
reg('hm.goalPill', '每日目标 {0} kcal', 'Daily goal {0} kcal')
reg('hm.mealSec', '今日餐次', 'Today’s Meals')
reg('hm.allRec', '全部记录', 'All logs')
reg('hm.del', '删除「{0}」', 'Delete “{0}”')
// 餐次（全局共享）
reg('meal.breakfast', '早餐', 'Breakfast')
reg('meal.lunch', '午餐', 'Lunch')
reg('meal.dinner', '晚餐', 'Dinner')
reg('meal.snack', '夜宵', 'Snack')

// GoalModal 目标弹窗
reg('gm.title', '设置每日热量目标', 'Set Daily Calorie Goal')
reg('gm.sub', '根据你的目标，调整每日摄入热量', 'Adjust your daily intake target')
reg('gm.quick', '快速选择', 'Quick pick')
reg('gm.tipT', '合理的热量目标有助于健康减重', 'A sensible calorie goal supports healthy weight loss')
reg('gm.tipS', '建议根据你的性别、年龄、身高、体重和运动量进行设置', 'Base it on sex, age, height, weight and activity')
reg('gm.save', '保存设置', 'Save')

// SettleBadge 结算徽章
reg('sb.budget', '今日 {0} / {1} kcal', 'Today {0} / {1} kcal')
reg('sb.added', '{0} · 已加入', '{0} · added')

// FoodToast 添加成功提示
reg('ft.added', '已加入{0}', 'Added to {0}')
reg('ft.done', '已添加', 'Added')

// FoodPicker 选择弹层
reg('fp.searchPh', '搜索食物 · 支持拼音 / 别名', 'Search food · pinyin / alias')
reg('fp.all', '全部', 'All')
reg('fp.optsHint', ' · 支持杯型与甜度', ' · cup size & sweetness')
reg('fp.unitHint', ' · 一{0}约 {1}{2}', ' · 1 {0} ≈ {1}{2}')

// AddFood 分量弹层
reg('af.change', '更换', 'Change')
reg('af.calcHead', '已按 ', 'Based on ')
reg('af.calcTail', ' 计算', ' computed')
reg('af.calcTailP', '（约 {0}g） 计算', ' (≈{0}g) computed')
reg('af.portion', '分量', 'Portion')
reg('af.mealSec', '餐次', 'Meal')
reg('af.confirm', '添加到{0} · {1} kcal', 'Add to {0} · {1} kcal')
reg('af.uCup', '杯', 'cup')
reg('af.uBottle', '瓶', 'bottle')
reg('af.uCan', '罐', 'can')
reg('af.uBowl', '碗', 'bowl')
reg('af.uPot', '份', 'portion')
reg('af.uBag', '包', 'bag')
reg('af.uPiece', '个', 'piece')
reg('af.uSlice', '片', 'slice')
reg('af.uSkewer', '串', 'skewer')

// CountStepper 步进器
reg('cs.meta', '每{0} ≈ {1}g · {2} kcal', 'Per {0} ≈ {1}g · {2} kcal')

// PrivacyDialog 隐私弹窗
reg('pd.title', '个人信息保护指引', 'Privacy Notice')
reg('pd.run1', '欢迎使用 轻律生活。我们将通过', 'Welcome to CalTrack. Our ')
reg('pd.agreement', '《用户服务协议》', 'Terms of Service')
reg('pd.run2', '及', ' and ')
reg('pd.policy', '《隐私政策》', 'Privacy Policy')
reg('pd.run3', '帮助您了解我们如何收集、处理个人信息。本应用将在征得您同意后使用震动反馈功能，并数据存本地设备上。', ' explain how we collect and process personal data. With your consent we use haptic feedback, and all data stays on this device.')
reg('pd.run4', '\n\n如您同意，请点击“同意”按钮接受我们的服务。', '\n\nTap “Agree” to accept our services.')
reg('pd.reject', '不同意', 'Disagree')
reg('pd.agree', '同意', 'Agree')
reg('pd.browser', '请在外部浏览器访问: {0}', 'Open in browser: {0}')

// 食物百科 Detail（营养列标签复用 dd.protein/carb/fat，餐次复用 meal.*，CTA 复用 af.confirm）
reg('ec.title', '食物百科', 'Food Encyclopedia')
reg('ec.nutrition', '主要营养成分', 'Main Nutrition')
reg('ec.per100', '（每100g）', ' (per 100g)')
reg('ec.review', '营养点评', 'Nutrition Review')
reg('ec.related', '相关食物', 'Related Foods')
reg('ec.cancel', '取消', 'Cancel')
reg('ec.hot', '热门搜索', 'Trending Searches')
reg('ec.empty', '没有找到相关食物，换个关键词试试', 'No matches — try another name or pinyin')
reg('ec.searchPh', '搜索食物名称 · 拼音 · 别名', 'Search food, pinyin or alias')
reg('ec.calorie', '热量', 'Calories')
reg('ec.hiP', '高蛋白', 'High protein')
reg('ec.loF', '低脂肪', 'Low fat')
reg('ec.hiF', '脂肪偏高', 'Higher fat')
reg('ec.loC', '低碳水', 'Low carb')
reg('ec.hiC', '碳水偏高', 'High carb')
reg('ec.audience', '适宜人群', 'Good for')
reg('ec.cautions', '注意事项', 'Take care')
reg('ec.serving', '推荐吃法', 'How to enjoy')
reg('ec.pcUnit', '个', 'pc')
reg('ec.piece', '1 个（约{0}g）', '1 pc (~{0}g)')
reg('ec.per100u', '每 100{0}', 'per 100{0}')
