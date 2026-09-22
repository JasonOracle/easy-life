# Home.uvue 组件设计说明

> 变更记录：
> - 2026-09-23（Gemini 系列）：① 树叶自然微风摇摆重构为 @transitionend 往复循环并固定根部 px 支点；② 水面波浪通过 @transitionend 往复平移流动；③ 渐变语法替换为 180deg；④ 清理 Android 不支持的 @keyframes 动画；⑤ openAdd 与 onAddConfirm 清空 addFoodId 防止残留旧选中。
> - 2026-09-23（OpenCode / Gemini 底层）：修复水瓶点击与长按音效解耦：单次点击水瓶（onBottleTap）播放轻脆反馈 click.mp3（playSound('click')），长按水瓶（onBottleLongPress）保持播放震颤音效 shake.mp3。
> - 2026-09-23（OpenCode / Gemini 底层）：水瓶与背景尺寸适度放大回归黄金比例：
>   ① 背景卡片由 162x162 放大至 176x176，瓶身由 94x152 适度放大至 104x168（解决视觉偏小问题，饱满大气）；
>   ② 两侧叶片等比微调至 64x64 / 62x62，保持 V 形托底舒展优美构图；
>   ③ 流体腔体适配重算（CAVITY_HEIGHT = 118px，宽 73px），严格保持 80% 最高水位限制。
> - 2026-09-23（OpenCode / Gemini 底层）：水瓶与叶子排布和视觉比例重构（对照参考图精调）：
>   ① 瓶身尺寸缩小精细化（112x180 -> 94x152），居中于背景卡片，预留充足呼吸空间；
>   ② 叶片尺寸按参考图小巧化（88px -> 58px），排布在瓶底后方两侧呈 V 形斜向上舒展托底；
>   ③ 流体腔体适配重算（CAVITY_HEIGHT = 106px，宽 66px），严格保持 80% 最高水位限制。
> - 2026-09-23（OpenCode / Gemini 底层）：水瓶与叶子动效全量落地（接入 4 张独立矢量 SVG 素材：bg.svg / yezi-zuo.svg / yezi-you.svg / pingzi.svg）：
>   ① 结构与动效物理彻底解耦：两侧叶子独立微风错相摆动，完全脱离瓶身 DOM，不随瓶身晃动粘连；
>   ② 基于 fluid-interaction-expert 规范实现点击二阶欠阻尼钟摆（小狗抖毛）与反相惯性晃水联动，长按 28Hz 高频横向微震颤；
>   ③ 严格落实水瓶最高水位不超过 80% 约束规则，预留 20% 空腔注水；
>   ④ 接入倒水冲击凹陷（-14px）与回弹涌浪（+12px）阻尼平息时序。
> - 2026-09-23（OpenCode / Gemini 底层）：宏量卡（蛋白质、碳水、脂肪）图标全面升级引用高保真矢量 SVG 素材（macro_protein.svg / macro_carb.svg / macro_fat.svg），并微调 .macro-icon 尺寸为 24x24 正方契合。
> - 2026-09-23（OpenCode / Gemini 底层）：按指令清除水瓶点击/长按、食物长按删除、添加食物确认与倒水动效中的触觉震动(vibrateShort/vibrateLong)，避免微信模拟器窗口剧烈抖动，待后续按需开启。
> - 2026-09-22（Gemini 系列）：餐次食物行长按删除与弹窗时序修复：①首页「今日餐次」食物行接入 @longpress 长按调出 uni.showActionSheet 确认删除链路，联动 food.removeEntry 响应式更新；②修复 AddFood「更换」时前后 page-container 并发冲突导致的状态机锁死 bug（增加 320ms 延时解耦）。
> - 2026-09-22（Gemini 系列）：水瓶与叶子高级微交互升级：①点击动效重构为「小狗甩水」物理阻尼钟摆（整体向左-15°再向右+30°随后振荡衰减归零，内部液体波澜联动，零缩放）；②长按动效重构为整体瓶身水平密集平移 shake 震颤（±6px 归零）；③两侧树叶（.bottle-bg-leaves）接入微风轻拂持续摆动动画（leavesBreeze）；④音效接入：点击与长按全面接入 shake.mp3，倒水配合 2 秒注水波澜起伏动画闭环。
> - 2026-09-22（Gemini 系列）：水瓶物理动效与轻绿质感全面重构：①提取独立静态背景叶子层（.bottle-bg-leaves），彻底解决瓶身晃动带着周围树叶一起晃的问题；②改造点击与长按物理规则：单次点击由瓶底为支点斜向左右摆动（角度衰减阻尼钟摆）且水面正弦波浪联动；长按改为水平快速平移震颤（translateX 手机震动感），不旋转不放大；③优化水瓶颜色设计为治愈系清透薄荷轻绿渐变；④接入添加食物成功后倒水物理效果：监听 SettleBadge @close 事件，弹层退场后播放 drop-water.mp3 倒水音效，伴随液位物理上涌、水流冲击超冲鼓包与波浪激荡。
> - 2026-09-22（Gemini 系列）：落地 Phase 2 动态水瓶流体架构：将原有静态图片升级为「底层内胆 .bottle-cavity + 夹层动态液位 .bottle-liquid + 表层刻度高光遮罩 .bottle-mask」三层夹心结构；采用零重排 GPU translateY 驱动液位升降（绑定摄入/目标比例）与三态色彩联动（绿/琥珀/珊瑚红）；接入点击微波激荡、长按蓄力呼吸、食物添加平滑涌入物理动效。
> - 2026-09-22（Gemini 系列）：页底预留 78px 升级为动态避让 `92px / calc(82px + env(safe-area-inset-bottom))`，解决全面屏下内容滚到底被悬浮胶囊遮挡的问题，保持 14px 呼吸间距。
> - 2026-09-22（Qoder）：液态玻璃悬浮胶囊重构配套——①删 `tabFade` 与 `onPageScroll`（新胶囊恒常可见）；
>   ②页底预留 40 → 78（Boss 拍板按胶囊实占重算）；③目标 Pill 日历图标 `.pill-cal` 的 `openRecords()` 由 navigateTo 改 redirectTo（Records 已升一级 Tab，不压栈）；
>   ④验收图 `debug/shots/tab8_home.png` 入库。
> - 2026-09-22（Qoder）：#29 配套（Boss 拍板「缩页底预留位」）：`.page padding-bottom` 78 → 40。
> - 2026-09-22（Qoder）：#29 续（Boss：「我想要的 tabbar 是 scroll-fade-navbar 那种效果」）：
>   重新挂回 `onPageScroll`，按 0→60px 线性算 `tabFade` 透传给 Tabbar（2026-09-22 胶囊化后已随 fade 一并废弃，留作追溯）。

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
