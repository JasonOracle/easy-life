# AddFood.uvue — 公共添加食物弹窗

## 💡 核心思想

pencil 弹窗①–⑥⑧ 的统一结构：奶茶有甜度组，其余只有分量＋餐次。
计件类（个／片／串）分量区走步进器，其余走器皿分段（单图按容量缩放）；
餐次四照片卡；确认只组装 payload emit，不写库（Boss 决策）。

## 💻 使用示例

```html
<AddFood v-model:show="addShow" food-id="p270" @confirm="onConfirm" />
```

payload：`{foodId, amount, unit, meal, sweets, extraKcal, kcal}`。

## 依赖

- food store（`getFoodById`／`vesselSizesOf`／`optGroupsOf`／`optDeltaOf`／`gramsOf`）
- OptionTray／CountStepper；器皿图 `app/static/vessels/`；餐次图 `app/static/meals/`
- 被首页 FAB 依赖（演示珍珠奶茶）

## 设计决策

- multi 型选项组（加料）本轮不渲染（pencil ① 无此区）；默认选中各组 `def`
- 甜度 delta 用 `optDeltaOf` 按实际克数缩放（全糖 500ml 口径线性）
- 默认餐次按当前小时推断；`export type` 内联 setup，编译若报则外提

## 边界与降级

- 未知 foodId 整单不渲染；单档 vessel 默认选中唯一档
- 器皿图缺失（`VESSEL_ART` 未覆盖）退化为纯文字段

## 与设计稿的对应

- pencil 弹窗①结构：thumb／名／大热量／计算说明／分量底槽／甜度底槽／餐次卡／确认
- ⑧ 吐司验证：计件类＝步进器＋无分量底槽；⑥ 砝码＝plate 三档类推
