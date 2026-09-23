# Home.uvue 组件设计说明

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
- **常驻标题块导航栏（2026-09-22 #28，Boss 拍板「三端都固定在顶部」）**：品牌标题＋副标题＋FAB 从文档流顶栏抽出，合并为页内内联全时段 fixed 的 `.hm-nav`（z45、高 `sbH+64`、底色同页面底 `#F2FAF5`），**无滚动阈值、无透明态**——非透明常驻层本身就挡住了状态栏带，故 P1 的 `.hm-st-mask` 两态遮罩与 `onPageScroll` 监听一并删除。文档流只留日期行 `.header`，由它的 `paddingTop = sbH+64` 承担整栏避让；**Hero 保持原 `margin-top:-18`，不得再叠一次 `sbH`**（曾误加 `sbH+10` → 日期行与波浪之间出现约 57px 空带）。仍守「不做组件」约定（StickyTop 实测宿主幻影副本＋遮罩不渲染，已删）

- 缩放 0.794（472→375）；水瓶已全面升级为 4-SVG 独立物理架构（独立底层背景 bg.svg + 左右独立微风叶片 yezi-zuo.svg / yezi-you.svg + 瓶身内胆 .bottle-cavity 与表层刻度遮罩 pingzi.svg）：
  ① 物理彻底解耦：背景叶子与瓶体分属不同 DOM，瓶身晃动时两侧叶子纹丝不动，仅受自身独立微风 CSS 关键帧驱动（左叶 4.8s 支点 88% 96%，右叶 6.2s 支点 11% 95%）；
  ② 动力学模型（fluid-interaction-expert）：点击为二阶欠阻尼钟摆甩水（-14° → +24° → -16° → +8° → -3° → 0°，385ms）联动反相惯性剪切（skewX）与波浪位移；长按为 28Hz 密集水平微震颤（±4px 往复平移，无旋转无缩放）；
  ③ 最高水位硬约束：内胆高 126px，水深严格限制不超过 80%（MAX_FILL_RATIO = 0.80），留出 20% 冲击空腔；
  ④ 倒水注入物理时序：水柱冲入伴随水流划入瓶口，重力砸下凹陷（translateY +14px）→ 回弹涌浪（translateY -12px）→ 阻尼平息。
- 晚餐按稿面收起态渲染（仅头行＋展开钮，无明细卡）
- 底部 Tab 用共享 `<Tabbar active="home" ></Tabbar>`（三槽悬浮玻璃胶囊的左起第一格；页内自绘双 Tab 过渡方案早已替换）。
  **2026-09-22 胶囊化后 `fade` prop 已删**——新胶囊恒常可见，本页不再有任何 `onPageScroll` 监听

## 边界与降级

- 取不到胶囊信息（非小程序／API 缺失）→ 加号回落稿面默认位置，不崩
- 图片缺失 → 空位，后续补；v-for 变量语义化命名（meal／rowItem），禁用单字母 r
- 小程序端需真机确认加号与胶囊间距；本页自身不用 `backdrop-filter`（共享 Tabbar 的玻璃模糊除外，见 `components/Tabbar.md`）
- **页底预留（2026-09-22 方案A动态避让）**：`.page padding-bottom` 升级为动态安全区全避让：无小白条基准 92px，带小白条机型（MP-WEIXIN）自动叠加 `calc(82px + env(safe-area-inset-bottom))`（实测 116px）。确保内容滚到最底端时完整展示于 Tabbar 悬浮胶囊上方，并留出 14px 呼吸间距。
- **~~TabBar 随滚动渐显（#29 续）~~ 已废弃（2026-09-22，Boss 拍板第 3 条）**：`tabFade` 与整段 `onPageScroll`
  删除，胶囊恒常可见；#28 时「常驻栏不透明故无需监听」的结论重新成立

## 与设计稿的对应

- v2 稿 10:223 下全部节点：Title 轻律生活／530 还能吃／68g-152g-42g／早420午560晚390／Tab 首页·我的
  （**Tab 数已变**：2026-09-22 液态玻璃胶囊为三格「首页·日历·我的」，见 `components/Tabbar.md`；v2 稿面尚未同步重画）
- 验收（2026-09-22 零窗口 automator）：`debug/shots/tab8_home.png` ＝ 悬浮胶囊三格、首页格激活色 `#17916B`、
  内容自胶囊下方穿过 ✓；点「日历」格 → `pages/records/Records` ✓（气泡四关键帧取证见 Tabbar.md）
- 不一致：Leaf 小叶图标略去（贴纸已含装饰）；Goal Pill 日历图标略去（文字保留）；波浪用导出整图
