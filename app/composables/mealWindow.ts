// [变更日志] 餐次时间窗工具：早餐 05:00-10:59 / 午餐 11:00-16:59 / 晚餐 17:00-21:59 / 夜宵 22:00-04:59，键与 stores/food.ts 餐次 map 对齐（breakfast/lunch/dinner/snack）

export type MealKey = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export const MEAL_WINDOWS = [
  { key: 'breakfast' as MealKey, label: '早餐', startHour: 5, endHour: 10 },
  { key: 'lunch' as MealKey, label: '午餐', startHour: 11, endHour: 16 },
  { key: 'dinner' as MealKey, label: '晚餐', startHour: 17, endHour: 21 },
  { key: 'snack' as MealKey, label: '夜宵', startHour: 22, endHour: 4 },
]

export function mealKeyByHour(hour: number): MealKey {
  if (hour >= 5 && hour < 11) return 'breakfast'
  if (hour >= 11 && hour < 17) return 'lunch'
  if (hour >= 17 && hour < 22) return 'dinner'
  return 'snack'
}

export function currentMealKey(): MealKey {
  return mealKeyByHour(new Date().getHours())
}

export function mealLabel(key: MealKey): string {
  for (let i = 0; i < MEAL_WINDOWS.length; i++) {
    if (MEAL_WINDOWS[i].key == key) return MEAL_WINDOWS[i].label
  }
  return '夜宵'
}
