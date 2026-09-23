# Profile.md - 历史日志归档

<!--
[变更日志]
修改时间：2026-09-23
AI模型：OpenCode / Gemini 底层
修改内容：[基于 ai-worldclass-design 落地高颜值全局顶栏：淘汰粗硬模糊的 header_wave.png 位图，全量接入 liquid_wave.svg 纯矢量有机双层贝塞尔水波，升级为全 App 统一双色温薄荷水体渐变 (#4EE2B6 -> #1FBF8F -> #0A7A5C)，优化今日热量浮岛卡片自然叠层 (-32rpx)]
-->

<!--
[变更日志]
修改时间：2026-09-23
AI模型：OpenCode / Gemini 底层
修改内容：[全量排查并升级页面内所有位图图标为高清晰矢量 SVG：替换 gear.svg、flame.svg、check.svg、trend_icon.svg，并将所有微型箭头统一为矢量 chev_right.svg，彻底消除位图锯齿与残留]
-->

<!--
[变更日志]
修改时间：2026-09-23
AI模型：Gemini 系列
修改内容：[全量将页面样式改造为 750rpx 规范（1px = 2rpx），今日热量卡、三项宏量卡、趋势图柱状（最高200rpx）与历史记录全量适配真机]
-->

<!--
[变更日志]
修改时间：2026-09-23
AI模型：OpenCode / Gemini 底层
修改内容：[个人中心三项热量卡（目标热量、已摄入、还能吃）图标全面升级引用高保真矢量 SVG 素材（stat_target.svg / stat_consumed.svg / stat_remain.svg），调整合适比例规整展示]
-->

<!--
[变更日志]
修改时间：2026-09-22
AI模型：Gemini 系列
修改内容：[解决 uni-app x 编译器将 BannerState 泛型编译为运行时 new BannerState 导致 setup 崩溃白屏的致命Bug，改用纯对象推导；修正 calStatus.color 取值]
-->

<!--
[变更日志]
修改时间：2026-09-22
AI模型：Gemini 系列
修改内容：[今日热量卡与达标Banner业务状态机深度重构：①修复 100% 满额时 conic-gradient 解析异常导致外圆环隐身消失的问题，改用实色与渐变自适应兼容；②解决进度条写死 #23B391 导致全局超标珊瑚色失效的问题；③修复「还能吃」数值超标时显示负数的Bug，超标归零并切换标签；④重构「今日达标/不达标」Banner 状态机：当日吃满 2 餐及以上且未超标显示「今日已达标（绿）」，超额转为「今日不达标（橙色 + 请减少进食，加油啊）」]
-->

<!--
[变更日志]
修改时间：2026-09-22
AI模型：Gemini 系列
修改内容：[实施方案A：页底预留高度升级为动态安全区全避让。
.page padding-bottom 升级为动态避让 `92px / calc(82px + env(safe-area-inset-bottom))`，消除全面屏下内容滚到底被悬浮胶囊遮挡的问题，保持 14px 呼吸间距]
-->

<!--
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[TabBar 液态玻璃胶囊配套：①Tabbar 调用去 `:fade`（渐显废弃），`onPageScroll` 只留 `.pf-st-mask` 的 >89 两态；
②`.page padding-bottom` 40 → 78（按胶囊实占重算）；③「最近记录·查看全部」goRecords 由 navigateTo 改 redirectTo；
④补暗态胶囊验收截图口径]
-->

<!--
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[校准四处与代码不符：①②滚动监听 onPageScroll 已由 #ifdef MP-WEIXIN 去条件编译、三端生效（Profile.uvue line 327 及注释 line 326；原「与 onShow 同处条件编译块」「已知代价：仍包在 MP-WEIXIN 内」两条已过期，且与本页「边界与降级」的「TabBar 随滚动渐显」条自相矛盾）；③趋势日期由「只标前 4 柱」更正为 7 柱全标（模板 v-for bars 内每柱渲染 bar-date，bars 源自 food.weekTotals 每日 fmtMD，代码变更日志 line 91）；④头图由「渐变 #5BC4AC→#39AD95」更正为实色 #39AD95＋导出波浪（.header background-color 实为纯色，#5BC4AC 全代码无出处）。]
-->