# DayDetail.md - 历史日志归档

> 变更记录：
> - 2026-09-23（OpenCode / Gemini 底层）：基于 ai-worldclass-design 落地高颜值全局顶栏：统一接入 liquid_wave.svg 纯矢量有机双层贝塞尔水波，升级为全 App 统一双色温薄荷水体渐变 (#4EE2B6 -> #1FBF8F -> #0A7A5C)，今日热量卡升级为统一自然浮岛层叠 (-32rpx)，消除单日详情页与其它页面的视觉割裂。
> - 2026-09-23（OpenCode / Gemini 底层）：彻底防范 Android 端 calc(rpx+px) 动态高度失效，重构 dd-header 为状态栏独立占位层；升级 flame 位图为高清晰矢量 SVG。
> - 2026-09-23（Gemini 系列）：餐次记录完整保留四大餐次（早/中/晚/夜宵），未记录时展示 empty 状态“尚未添加”；全面升级餐次与导航图标为高清晰矢量 SVG（lr_back/lr_meal_breakfast/lr_meal_lunch/lr_meal_dinner/lr_meal_snack/dd_add/dd_sum），消除位图失真；优化餐次头部垂直居中与空状态卡片排版。
> - 2026-09-23（Gemini 系列）：全量将页面样式改造为 750rpx 规范（1px = 2rpx），今日热量大卡、能量条（638rpx）、餐次卡、营养分布与总结条全面等比缩放适配真机。
> - 2026-09-23（Gemini 系列）：接入方案 A 单流程 FoodPicker 架构，移除宿主端 addShow/onPickFood/onAddChange 等状态机。
> - 2026-09-23（Gemini 系列）：.dd-header 补实色兜底；字重 500/600 转为 bold；openPicker 与 onAddConfirm 清空 addFoodId。
> - 2026-09-23（OpenCode / Gemini 底层）：营养分布卡（蛋白质、碳水、脂肪）图标同步更新为矢量 SVG 素材引用（macro_protein.svg / macro_carb.svg / macro_fat.svg），并微调 .dd-mg 为 20x20 正方比例。
> - 2026-09-23（OpenCode / Gemini 底层）：按指令清除长按删除单条饮食记录时的 vibrateShort 触觉震动，避免微信模拟器窗口剧烈抖动，待后续按需开启。