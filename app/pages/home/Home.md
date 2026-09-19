# Home.uvue — 首页

## 1. 用途

展示今日摄入总览：瓶子水位 + 大数字 + 营养素 + 今日餐次时间轴。整个 App 的主屏。

## 2. 依赖

| 方向 | 对象 | 说明 |
|---|---|---|
| 依赖 | `stores/device.ts` | 低端机降级：`liquidWave` 关波纹、`backdropBlur` 关玻璃 |
| 依赖 | `stores/food.ts` | 今日记录、已摄入总量（*待实现*） |
| 依赖 | `stores/goal.ts` | 每日目标热量（*待实现*） |
| 依赖 | `stores/library.ts` | 食物库全量加载（*待实现*） |
| 依赖 | `composables/useLiquid.ts` | 液体晃动动画（*待实现*） |
| 依赖 | `components/Bottle.uvue` | 瓶子组件（*待实现*） |
| 依赖 | `components/Tabbar.uvue` | 底部导航（*待实现*） |
| 被依赖 | `pages.json` | 第 1 条路由即应用首页 |

## 3. 设计决策

- **`navigationStyle: custom`**：设计稿的状态栏与标题行是自绘的，用原生导航栏会对不上。
- **状态栏高度写死 62px**：设计稿 `StatusBar` 节点高 62（含系统状态栏区）。真机需按 `uni.getSystemInfoSync().statusBarHeight` 动态校正 —— **待真机验证**，暂不猜。
- **页面不整体滚动**：设计稿 `Content` 高度是 `fill_container`，滚动交给内部列表。

## 4. 边界与降级

| 场景 | 处理 |
|---|---|
| 首次进入 | 直接设定水位，**不晃动**（安静开场） |
| 无任何记录 | 水位 0，大数字显示「还能吃 = 目标值」 |
| 超标 | 液体转珊瑚 `#FF9E7D`，数字变色 |
| 剩余 ≤ 200 | 转琥珀 `#E8B54D` |
| 低端机 | 去掉液体波纹，只留水位 transition（`useDeviceStore.liquidWave`） |
| 不支持 `backdrop-filter` | 玻璃卡降级为「半透明白 + 亮边 + 分层阴影」 |

## 5. 与设计稿的对应

- Ardot：`01 · 首页 Home`，节点 `3:22`
- 完整尺寸/间距清单：`design/ScreenSpecs.md` §1
- 视觉语言（液体隐喻、动画时序）：`design/VisualLanguage.md` §4/§5
- 原型交互：`app/prototype/CalTrack_Protoype.html`

**当前状态**：仅骨架占位，未实现任何视觉。
