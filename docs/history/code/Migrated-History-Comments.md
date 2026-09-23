# 迁移的历史记录注释

**文件**: `app/components/GoalModal.uvue`
```
/**
 * 设置每日热量目标（Pencil qnNST 整卡量取重建）。
 * 横向滑条：Track x48 宽 239（值域 1200–2400 吸附 100），Fill/Thumb 由 ratio 驱动；
 * 拖拽用 touch clientX − Dial 卡页面左偏移换算，Dial 左偏移在弹窗打开时查询一次，
 * 查询失败仅禁用拖拽（−/＋钮与快速选择始终可用）。保存 emit 给父调 setGoal。
 */
```

**文件**: `app/pages/home/Home.uvue`
```
TabBar 随滚动渐显（#29）已于 2026-09-22 随液态玻璃胶囊重构整体废弃：新胶囊恒常可见，
本页因此不再需要任何滚动监听（#28 定案的常驻标题块 .hm-nav 无阈值）
```

**文件**: `app/pages/profile/Profile.uvue`
```
三端生效（原包在 MP-WEIXIN 内，App／Web 端滚动时状态栏遮罩无响应是既有缺口）
#29 的 tabFade 渐显已随 2026-09-22 液态玻璃胶囊重构废弃（新胶囊恒常可见）
```

**文件**: `app/stores/food.ts`
```
/** 从本地存储恢复记录；失败或为空则回落演示种子（Boss 授权灌入） */
```

**文件**: `app/stores/food.ts`
```
存储失败不阻塞记录
```

**文件**: `app/stores/goal.ts`
```
存储失败不阻塞
```

**文件**: `app/stores/settings.ts`
```
存储失败不阻塞
```

**文件**: `app/stores/user.ts`
```
存储失败不阻塞
```
