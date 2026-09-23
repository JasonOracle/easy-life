# Home.md - 历史日志归档

> 变更记录：
> - 2026-09-23（Gemini 系列）：解决首页顶部截断与背景混乱缺陷：① 将 .header-spacer 占位高度由 176rpx 提升至 220rpx，并重置 .hero 的 margin-top 为 0，彻底消除 Hero 内容上插被固定导航栏腰斩遮挡的问题，日期文案与水瓶瓶盖完整舒展露出；② 移除背景杂乱的 hero_wave 位图素材，.hero 接入纯净清爽的薄荷绿自然平滑渐变 (#E6F8EF -> #F2FAF5)。
> - 2026-09-23（OpenCode / Gemini 底层）：首页深度视觉与交互修复：
>   ① 根治顶部日期看不到：重构 .hm-nav 与 .header 占位高度，将日期行直接整合进常驻导航栏，确保在不同分辨率与机型下 100% 完整舒展露出；
>   ② 清除 FAB 加号和餐次圆圈下方难看变形的深绿脏阴影，改用纯净清透背景；
>   ③ 晚餐（dinner）餐次有食物时默认平铺展开：移除 showDinner 折叠状态机与右侧展开按钮 (.meal-expand / chev_down.svg)，交互体验统一连贯。
> - 2026-09-23（Gemini 系列）：今日餐次体验与图标大升级：① 餐次增加无食物时的 empty 状态展示（“尚未添加”）；② 调整 .meal-head 高度与 align-items:center，实现左侧圆圈图标与右侧餐次文案精准垂直居中；③ 补齐夜宵（snack）餐次与专属矢量图标；④ 全面升级餐次与公共图标为高清晰矢量 SVG（date_icon/pill_calendar/pill_edit/chev_right/chev_down/meal_sun/meal_sun_l/meal_moon/meal_snack），彻底根除午餐图标下方被截断与位图模糊问题。
> - 2026-09-23（Gemini 系列）：全量适配 750rpx 设计规范（1px=2rpx）：
>   ① 标题常驻导航栏、FAB、Hero 区域、宏量卡、今日餐次列表项样式全量转为 rpx；
>   ② 水瓶腔体高度由 118px 换算为 236rpx（CAVITY_HEIGHT = 236），动效位移（钟摆晃动、微波浪振幅、长按高频震颤、倒水冲击）全面适配 rpx 规范；
>   ③ 保留 1px/2px 物理线防止 Android 端次像素抖动，动态安全区避让采用 `calc(164rpx + env(safe-area-inset-bottom))`。
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