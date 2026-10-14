# settings.ts — 设置 store

## 💡 核心思想

偏好开关集中管理（深色模式／音效／触觉／用餐提醒／主题色／语言），`USER_FOOD_ENABLED=false` 唯一落点，
本地持久化（`ct_settings_v1`）。集中调度全局 `playSound`：**每类型一个常驻 InnerAudioContext 实例 + 按类型最小触发间隔**，
并在 App 启动后 `warmupAudio()` 静默预热消冷启动首载延迟。

## 💻 使用示例

```ts
const settings = useSettingsStore()
settings.setSoundEnabled(false)  // 总音效开关（设置页「音效」行）
settings.setDarkMode(true)       // 深色主题开关（Settings 页点击）

// 触发特定反馈音效
playSound('shake')   // 水瓶晃动
playSound('slide')   // 滑块拖动
playSound('card')    // 选项切换（餐次/甜度/分类）
playSound('click')   // 轻点击（FAB/日期/食物行）
playSound('success') // 操作成功
```

## 依赖

- 本地存储 `ct_settings_v1`；被设置页「深色模式」「音效」两个 toggle 与 Profile 页等全App 页面消费
- 素材在 `app/static/audio/`（click2 96ms／confirm 313ms／shake 862ms／success 1320ms），映射表 `AUDIO_FILES`
- `App.uvue` onLaunch 延迟 1.5s 调 `warmupAudio()`

## 设计决策

- 自建食物开关放这里，不在各处散落 if（AGENTS 约束）
- 深色模式 2026-09-21 起解除恒关锁定（Boss 指令第 5 项）：`setDarkMode` 持久化；
  全App 逐元素随动（7 页 8 组件均接 `composables/useTheme.ts`，早期「仅两页 ＋ `page-dark` 类」方案已废弃），不走 `uni.setAppTheme`（App 端能力，小程序端无法强制切系统主题）（2026-09-22 校准）
- **音频层＝方案A（Boss 2026-09-28 拍板）**：曾试过「单实例 + 全局 130ms 互斥」，实测长素材
  （shake/success）起播即锁死全 App 音效窗口（连点餐次卡多次才响一次）。改为每类型独立实例后
  类型间并行；间隔只留「同类型连点保护」：click 类 130ms（96ms 素材 + 热态重建 25~39ms 实测下限）、
  confirm 350ms、shake/success 320ms（≈1/4 素材长，连点语义＝重头再听）。
  取证与 A/B：`docs/analysis-2026-09-28-audio-playback.md`
- **App 端重启播放的唯一正解＝`ctx.src=''` → 20ms 后重设 `src`+`play()`**（v3 根因定案，同文档第 10 章）：
  `src→stop→seek→play` 序列实测「起播即结束」（onPlay 零触发、onEnded ~170ms 即到）——stop 拆掉底层玩家后，
  对相同 src 值再赋值是空操作（setter 同值不重装载），play 面对空壳静默失败。**严禁改回 stop/seek 重启**
- 播放失败/实例创建失败不再静默吞（`console.error` + 每实例 `onError`），零日志是上轮排查最大阻力
- 根治候选（1.1）：自写 UTS 插件走 Android SoundPool（现成插件 hp-soundpool 不支持 uni-app x）

## 边界与降级

- 存储失败用默认值，不阻塞
- `soundEnabled=false` 时 `playSound` 首行即返回（触觉不受该开关影响，另有 `hapticsEnabled`）
- 实例创建失败返回 null，本次静默跳过（已打 error 日志），不抛到调用方

## 与设计稿的对应

- 设置页偏好组：「深色模式」下新增「音效」toggle 行（Boss 指令，图标 `settings/icon_sound.svg` 生图线五档变体）；
  「即将上线」pill 对应 mealReminders 未启用态
- 深色模式开关稿面画的是 ON 态；实际默认 OFF，点击后 ON（状态由 store 驱动，不再稿面静态）
