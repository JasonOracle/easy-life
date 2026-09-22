# SettleBadge — 结算徽章（弹层③）

## 用途
添加食物成功后的结算弹层：264×256 居中徽章，进度环扫角与中心数字滚动由**单一 progress 变量**同驱（620ms easeOutCubic），严格 2160ms 自动关闭，无任何点按关闭。

## 依赖
- **Store**：`useDeviceStore`（`tier`/`haptics` 降级判断）、`useSettingsStore`（`hapticsEnabled` 开关）
- **Props**：`show`（v-model:show）· `kcal`（本次加入热量）· `after`（加入后今日总量）· `goal`（每日目标）· `meal`（餐次中文名，Home 侧 `MEAL_LABELS` 映射）
- **父组件**：`Home.uvue`（`onAddConfirm` 写入四值后置 `settleShow=true`）
- **静态资产**：`/static/settle/sb_check.png`（薄荷 ✓）· `/static/settle/sb_alert.png`（珊瑚感叹圈），均从 Pencil 稿导出
- **替代了** `FoodToast.uvue` 的链路位（FoodToast 文件保留但未接线）

## 设计决策
- **单一 progress 驱动**（MU1O4「灵魂条款」）：`setInterval(16ms)` 推进 `progress = easeOutCubic((now-animStart)/620)`，环扫角（`sweep = finalRatio × progress`）、中心计数（`Math.round(kcal × progress)`）、到位触感三者在同一帧更新，杜绝数字与环不同步。未用 rAF——mp-weixin 端 setInterval 更稳且帧粒度足够
- **环双端两套实现**：MP 端 `conic-gradient` 圆环带（轨道 `rgba(31,191,143,.15)` 整圆 + 进度 conic + 中心盖孔 + 两端 16px 圆头帽沿 r62 中线三角函数定位）；App 端 `<canvas>` `arc + lineCap:'round'`（原生渲染不支持 conic-gradient）。`ringTimer` 每 tick 同时喂 MP 的 computed style 与 App 的 `drawRing()`
- **严格 2160ms 自动关**（Boss 拍板）：`exitTimer` 2160ms 置 `exiting=true`（触发 scale→0.94+淡出 220ms），`closeTimer` 2380ms `emit('update:show', false)` 真卸载；蒙层**不绑** tap 关闭
- **弹层壳＝原生 page-container**（2026-09-22 迁移）：自研 `.sb-mask` 压暗层退役，改原生蒙层（`overlay-style` 黑 50%，L1 两轨由原生淡入淡出承担）；
  **实测坑：`position="center"` 只控制滑入方向，容器不居中**（渲染在左上角）→ `custom-style` 设
  `width/height:100%＋transparent＋flex 居中`，徽章 `.sb-badge` 自带外观与 L2–L9 全部动画不动；
  `@afterleave` 兜底同步父级关闭态
- **超预算分支**：`after > goal` 时环色 `#E8B54D` 琥珀、budget 文字 `#FF9E7D` 珊瑚、图标换 alert，**中心数字保持墨色**（稿面语义：超标警示在环与预算行，不在数字）；扫角封顶 100%
- **千位空格分隔**：`fmt()` 手工实现（稿面「1 697 / 1 800」），不依赖 `Intl`/正则的端侧兼容性
- **类名全量 `sb-` 前缀**：遵守小程序组件类名跨文件冲突铁律

## 边界与降级
- low 档（`device.tier==='low'`）：`progress` 直落 1，行/图标不再各自入场（`.sb-badge-low` 关子动画），只留淡入淡出
- 触感：`device.haptics && settings.hapticsEnabled` 双门才 `vibrateShort`（L7 环到位帧）
- `goal<=0` 兜底：`finalRatio=1`，不除零
- 重复打开：`watch(show)` 先 `clearTimers()` 再 `open()`，无定时器泄漏；`onUnmounted` 兜底清理
- 音效：Boss 拍板暂缓，全链路跑通后统一接

## 与设计稿的对应
- 结构＝Pencil 画板 Dz3YV「弹层③ 结算徽章」；动效时间轴＝MU1O4 九轨（L1 蒙层 200ms → L2 徽章 360ms out-expo → L3 环∥数字 140ms 起 620ms → L4 预算行 480ms → L5 餐次行 600ms → L6 图标 620ms spring → L7 触感 ~760ms → L8 驻留 → L9 2160ms 退出 220ms）
- 规格文档：`docs/design/2026-09-21-settlement-badge/README.md`
- 验收：Boss 人工实测（2026-09-21）动效与自动关通过；实拍 `.workbuddy` 截图核验环几何/千位分隔/✓ 行与稿一致
- 不一致处：App 端 canvas 环为**真机待验**项（模拟器只走 MP 分支）
