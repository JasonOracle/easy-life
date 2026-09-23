# Settings.md - 历史日志归档

> 变更记录：
> - 2026-09-23（OpenCode / Gemini 底层）：彻底根除编译器报错 Identifier 'sbH' has already been declared：清理 script 尾部冗余声明的 let sbH 块，保持统一的 sbH 响应式状态管理。
> - 2026-09-23（OpenCode / Gemini 底层）：基于 ai-worldclass-design 落地高颜值全局顶栏：淘汰粗硬 hd-arc 几何圆切线与高斯光晕，统一接入 liquid_wave.svg 纯矢量有机双层贝塞尔水波，浅色模式升级为全 App 统一双色温薄荷水体渐变 (#4EE2B6 -> #1FBF8F -> #0A7A5C)，深色模式保持 #162924 静谧暗夜，微调偏好分组标题呼吸留白。
> - 2026-09-23（OpenCode / Gemini 底层）：彻底修复 Android 端顶部背景丢失 Bug：重构 header 为状态栏独立占位层并恢复绿色双波浪渐变；全量将 settings 内所有 PNG 位图升级为高清晰矢量 SVG（chev_back/icon_moon/icon_bell/icon_target/icon_mega/icon_down/icon_up/icon_shield/icon_trash/icon_leaf）。
> - 2026-09-23（Gemini 系列）：全面升级向右箭头为高清晰矢量 SVG（chev_right.svg），保持与全局矢量图标规范一致。
> - 2026-09-23（Gemini 系列）：全量将页面样式改造为 750rpx 规范（1px = 2rpx），头图波浪与双弧、常驻导航栏、各功能卡片与字体全部等比适配真机。
> - 2026-09-23（OpenCode / Gemini 底层）：按指令清除切换深色模式开关(toggleDark)时的 vibrateShort 触觉震动，避免微信模拟器窗口剧烈抖动，待后续按需开启。