# food.ts — 食物库＋记录 store

## 💡 核心思想

一库一账：模块级缓存解析 347 条食物库（base／vessel／opts 模板），`entries` 存当日及历史记录，
getter 按日过滤供首页／个人中心消费。热量公式 `computeEntry`（计数类先 `gramsOf` 折算）。

## 💻 使用示例

```ts
const food = useFoodStore()
food.addEntry(computeEntry(getFoodById('p017')!, 1, '个', 'breakfast', 0))
food.totalCal // 今日总热量
```

## 依赖

- 产物 `app/src/data/food_library.json`（toolchain 生成，禁手写）；被未来 AddSheet／FoodPicker 依赖

## 设计决策

- 记录存冗余快照（foodName＋source＋schemaVersion），不存纯 foodId
- 本地存储持久化（`ct_food_entries_v1`），读失败回落 Boss 授权演示种子
- 用 `.ts` 而非 `.uts`（UTS 编译器破坏中文字符串）

## 边界与降级

- 未知 foodId 的种子项跳过；存储失败不阻塞记录
- `USER_FOOD_ENABLED` 见 settings store，本模块不建分支

## 与设计稿的对应

- MealRow 结构对首页餐次（名称／最早时间／明细行时分秒）；weekTotals 对个人中心周概览
