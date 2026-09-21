# FoodToast.uvue — 添加成功 toast

## 💡 核心思想

添加食物确认后的 L3 重反馈：绿杯徽＋`+N kcal`＋`已加入X`＋`已添加` pill。
2s 自动消失，点按立即关闭；出现即长触觉（受设备档＋设置开关门控）。

## 💻 使用示例

```html
<FoodToast v-model:show="toastShow" :kcal="325" meal-label="夜宵" />
```

## 依赖

- device／settings store（触觉门控）；被 AddFood 的挂载页依赖

## 设计决策

- 音效资产（`assets/sound/`）缺失，L3 只落触觉＋动画，音效待补
- 定时器在 unmount／重入时清理，不野留

## 边界与降级

- 低端机（haptics 关）静默只弹视觉；`show` 外部单一事实来源

## 与设计稿的对应

- pencil 弹窗③：`+325／已加入夜宵／已添加`；杯徽用 ✓ 字形（SVG 资产化前过渡）
