# settings.ts — 设置 store

## 💡 核心思想

偏好开关集中管理（深色模式 v1.0 恒关／用餐提醒／音效／触觉），`USER_FOOD_ENABLED=false` 唯一落点，
本地持久化。

## 💻 使用示例

```ts
const settings = useSettingsStore()
settings.setSoundEnabled(false)
```

## 依赖

- 本地存储 `ct_settings_v1`；被设置页开关（后续接线）依赖

## 设计决策

- 自建食物开关放这里，不在各处散落 if（AGENTS 约束）
- 深色模式读出恒为 false（v1.0 不做，对齐稿面置灰）

## 边界与降级

- 存储失败用默认值，不阻塞

## 与设计稿的对应

- 设置页偏好组两行；「即将上线」pill 对应 mealReminders 未启用态
