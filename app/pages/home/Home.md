# Home.uvue — 首页（v2 稿 P1 还原）

## 💡 核心思想

按 Ardot v2 稿（727788215940571 · 10:223）1:1 还原首页结构：Header／Hero／宏量卡／三餐／共享 Tabbar。
数字、宏量、餐次（行名／行 kcal／餐 kcal／餐时间／行图）全部走 food＋goal store（今日种子精确还原 v2 行）；
图片行图走库内图标（`/static/icons/`），其余装饰图用设计稿 `export_nodes` 导出 PNG；字体用系统默认降级。

## 💻 使用示例

`pages.json` 首屏，HBuilderX 运行到微信开发者工具即见。右上加号：小程序端用
`uni.getMenuButtonBoundingClientRect()` 算出胶囊左侧位置（`fabRight/fabTop`），其他端用稿面位置。

## 依赖

- 静态资源 `app/static/home/*.png`（22 张设计稿导出）
- food／goal store（数字／宏量／餐次）；被 `pages.json` 首屏引用
- 稿面「1270／530」与餐和 1370 自相矛盾，页显 store 真值（1367／433），见 progress 归档

## 设计决策

- 缩放 0.794（472→375）；瓶子首版用导出图静态占位，液体动画下轮
- 晚餐按稿面收起态渲染（仅头行＋展开钮，无明细卡）
- Tabbar 终案前用页内自绘双 Tab 过渡（首页激活绿／我的灰）

## 边界与降级

- 取不到胶囊信息（非小程序／API 缺失）→ 加号回落稿面默认位置，不崩
- 图片缺失 → 空位，后续补；v-for 变量语义化命名（meal／rowItem），禁用单字母 r
- 小程序端需真机确认加号与胶囊间距；`backdrop-filter` 未用，无需验证

## 与设计稿的对应

- v2 稿 10:223 下全部节点：Title 轻律生活／530 还能吃／68g-152g-42g／早420午560晚390／Tab 首页·我的
- 不一致：Leaf 小叶图标略去（贴纸已含装饰）；Goal Pill 日历图标略去（文字保留）；波浪用导出整图
