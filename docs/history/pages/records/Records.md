# Records.md - 历史日志归档

<!--
[变更日志]
修改时间：2026-09-23
AI模型：Gemini 系列
修改内容：[解决图3顶部水波异样与图4页面无法滚动缺陷：
  1. 移除 Header 里的 liquid_wave 水波图，改为纯净平滑的自然绿色渐变 (#32D0A0 -> #1FBF8F -> #159C72)，视觉纯净治愈；
  2. 全页面内容包裹在 scroll-view(direction="vertical") 独立滚动容器内，解除 Android/小程序端因 flex:1 视口锁定导致的无法向下滚动 Bug，确保主要食物与三餐摄入丝滑滑动到底部完整露出]
-->

<!--
[变更日志]
修改时间：2026-09-23
AI模型：OpenCode / Gemini 底层
修改内容：[彻底根除编译器报错 property value 100% is not supported for min-height：遵循 uni-app x 原生规范，将 .page 的 min-height: 100% 替换为 flex: 1 原生弹性伸缩]
-->

<!--
[变更日志]
修改时间：2026-09-23
AI模型：OpenCode / Gemini 底层
修改内容：[基于 ai-worldclass-design 重构三餐摄入四小卡片排版：优化内边距、字号比例与时间项数排布，采用 space-between 纵向黄金比例，注入轻微卡片浮层投影，彻底消除四卡紧凑并排时的拥挤压抑感]
-->

<!--
[变更日志]
修改时间：2026-09-23
AI模型：OpenCode / Gemini 底层
修改内容：[基于 ai-worldclass-design 落地高颜值全局顶栏：淘汰粗硬 lr-arc 几何圆切线与高斯光晕，统一接入 liquid_wave.svg 纯矢量有机双层水波，浅色模式升级为全 App 统一双色温薄荷水体渐变 (#4EE2B6 -> #1FBF8F -> #0A7A5C)，月历卡上叠统一为自然浮岛 -32rpx]
-->

<!--
[变更日志]
修改时间：2026-09-23
AI模型：OpenCode / Gemini 底层
修改内容：[彻底修复 Android 端月历卡遮挡页面标题 Bug：重构 lr-header 布局，移除不支持的 calc(rpx+px) 动态高度，采用状态栏独立占位层并优化月历卡负边距，标题副标题完整舒展露出；升级 flame 图标为矢量 SVG]
-->

<!--
[变更日志]
修改时间：2026-09-23
AI模型：Gemini 系列
修改内容：[全面升级月历翻页、查看详情箭头与餐次图标为高清晰矢量 SVG（lr_prev/lr_next/lr_chev/lr_meal_breakfast/lr_meal_lunch/lr_meal_dinner/lr_meal_snack），消除位图锯齿与模糊]
-->

<!--
[变更日志]
修改时间：2026-09-23
AI模型：Gemini 系列
修改内容：[全量将月历卡、能量条、各餐次与食物小卡改造为 750rpx 规范（1px = 2rpx），能量条按 630rpx 比例计算，彻底解决真机元素过小问题]
-->

<!--
[变更日志]
修改时间：2026-09-23
AI模型：Gemini 系列
修改内容：[1. 修复 Android 选中日期空白与顶部渐变异常：.lr-pill-sel 和 .lr-header 补充 background-color 实色兜底；2. 遵循 uni-app x 原生规范，将 font-weight: 500/600 统一为 bold]
-->

<!--
[变更日志]
修改时间：2026-09-23
AI模型：OpenCode / Gemini 底层
修改内容：[按指令清除日历日期选择(pickDay)与月份翻页(prevMonth/nextMonth)中的 vibrateShort 触觉震动，避免微信模拟器窗口剧烈抖动，待后续按需开启]
-->

<!--
[变更日志]
修改时间：2026-09-22
AI模型：Gemini 系列
修改内容：[对齐修复：餐次卡 .lr-mcard 内部图标、标题、热量行及脚部项数行全量实现水平轴心对齐居中（align-items: center / justify-content: center），消除视觉偏左偏差]
-->

<!--
[变更日志]
修改时间：2026-09-22
AI模型：Gemini 系列
修改内容：[实施方案A：页底预留高度升级为动态安全区全避让。
.lr-bottom-space 升级为动态避让 `92px / calc(82px + env(safe-area-inset-bottom))`，消除全面屏下「主要食物」卡片滚到底被悬浮胶囊遮挡的问题，保持 14px 呼吸间距]
-->

<!--
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[1. 本页由二级页升级为一级 Tab 页（TabBar 中间格「日历」）：删头图返回钮与常驻栏返回热区，
共享 Tabbar 由「挂两格、误显首页为激活」改为本页激活格（`active="records"`）；2. #29 的 fade 随滚动渐显整条作废（胶囊恒常可见），
改记追溯条目；3. 页底预留 40 → 78（按胶囊实际占位重算）；4. 入口改法记准（首页 Pill 与个人中心改 redirectTo）]
-->