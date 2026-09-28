# 音效播放延迟与丢音：根因分析与实测

- 日期：2026-09-28
- 触发：Boss 反馈「首次滑动听不到声音，第二次滑动有声音，偶尔有滞后的声音；下面的卡片点击前两次没声音，之后有」
- 结论：**不是音频资源问题，也不是"快速切换"本身的问题**，而是 `innerAudioContext` 在 App 端**每次播放都重建底层播放器**（MediaCodec 解码器 + AudioTrack），实测单次重建耗时 **25~131ms**，而滑动时两次播放的间隔只有 **30~40ms** —— 重建还没完成就被下一次打断。
- 状态：**本文件只做分析，未改任何代码**；设备端做过归因实验，产物已完整还原（md5 与本地编译产物一致）。

---

## 0. 结论摘要

| 现象 | 直接原因 |
|---|---|
| 首次滑动听不到声音 | 首次播放 `slide.mp3` 要付 **131ms** 的"重建+首载"成本，而滑动时相邻两次播放只隔 **30~40ms** → 还没出声就被下一次打断 |
| 第二次滑动有声音 | 文件进了 page cache、音频服务已热，重建降到 **25~39ms**，与调用间隔相当，勉强来得及出声 |
| 卡片点击前两次没声音 | 音频池有 **2** 个实例，两个槽各自需要一次"首次加载 `switch.mp3`"（131ms 级）；两次之后变快 |
| 偶尔听到滞后的声音 | 每次播放都有 **25~131ms** 的固有延迟 —— 就是"playSound 已调用"到"解码器就绪"的间隔 |
| 是不是快速切换的问题？ | **是"暴露方式"不是"根因"**。根因是每次播放都重建播放器；快速切换把这个固定开销的代价放大了 |

**技术结论（已双向证伪）**：JS 侧无论怎么改调用姿势都救不回来 ——

| 实验 | 改动 | 结果 |
|---|---|---|
| 基线 | 原样 | 滑动触发 13 次播放 → **13 次重建** |
| A | `src` **仅在变化时**赋值（滑动时 src 恒为 `slide.mp3`，实测 6 次走"不赋值"分支） | 8 次播放 → **8 次重建（100%）** |
| B | `stop()` → `pause()` | 5 次播放 → **4 次重建（80%）** |

实验 A 里 6 次 **完全没有赋值 `src`** 的播放**照样重建**，直接排除「`src` 赋值是元凶」；实验 B 排除「`stop()` 是元凶」。**是框架层 `play()` 路径的行为。**

---

## 1. 现状代码

`app/stores/settings.ts`（全部播放入口的唯一实现，池是**模块级、跨页面共享**）：

```ts
const audioPool: any[] = []
let poolCursor = 0

function getAudioContext(): any {
  if (audioPool.length < 2) {            // ← 池大小 = 2
    const a1 = uni.createInnerAudioContext()
    const a2 = uni.createInnerAudioContext()
    audioPool.push(a1, a2)
  }
  const ctx = audioPool[poolCursor]
  poolCursor = (poolCursor + 1) % audioPool.length   // ← 轮询
  return ctx
}

function playSound(type: SoundType): void {
  if (!soundEnabled.value) return
  const src = AUDIO_FILES[type]
  if (!src) return
  try {
    const ctx = getAudioContext()
    ctx.src = src        // ①
    ctx.stop()           // ②
    ctx.seek(0)          // ③
    ctx.play()           // ④
  } catch (e) {}         // ← 全静默，错误不可见
}
```

音源映射（`AUDIO_FILES`）：`click`/`delete` → `click2.mp3`、`card`/`switch` → `switch.mp3`、`success`/`shake`/`slide`/`confirm` 各自一份。

音频素材实测参数：

| 文件 | 体积 | 码率 | 时长 |
|---|---|---|---|
| `slide.mp3` | 2507 B | 256 kbps | **0.08 s** |
| `click2.mp3` | 4584 B | 128 kbps | 0.29 s |
| `confirm.mp3` | 10031 B | 256 kbps | 0.31 s |
| `switch.mp3` | 18390 B | 256 kbps | 0.57 s |
| `shake.mp3` | 27585 B | 256 kbps | 0.86 s |
| `success.mp3` | 58514 B | 256 kbps | **1.83 s** |

---

## 2. 实测方法与原始数据

### 2.1 方法：改设备上的运行时产物做 A/B，不必重新编译

`HBuilderX` GUI 未运行（`cli.exe launch` 在本机无条件挂死），无法热编译。但 App 端逻辑跑的是 **未压缩明文** `app-service.js`：

- 设备路径：`/data/data/io.dcloud.uniappx/apps/__UNI__F70225F/www/app-service.js`
- 与本地 `app/unpackage/dist/dev/app-android/app-service.js` **字节完全一致**（642191 B，纯 LF，md5 `af9216c2faf0f040f4639ff7f1a202d5`）

于是可以：本地复制 → 改函数体 + 加 `console.log` 探针 → `adb push` 到 `/data/local/tmp` → `run-as cp` 覆盖 → 重启 App → 抓 logcat 归因 → **用本地产物原样还原**。

设备端音频资源本身是完整的（6 个 mp3，字节数与本地逐一致），**排除"文件缺失/同步不全"**。

### 2.2 观测手段

| 指标 | logcat 特征 |
|---|---|
| 解码器被重建 | `CCodec  : allocate(c2.android.mp3.decoder)` + `DMCodecAdapterFactory: Creating an asynchronous MediaCodec adapter` + `Created component [c2.android.mp3.decoder]` |
| 播放被打断/结束 | `AudioTrack: stop(N): called with M frames delivered`（N 为 session id，**每次都是新 id** ＝ AudioTrack 也是新建的） |
| JS 侧调用 | 自己插的 `console.log('[AUDIO_PROBE] ...')`，落在 tag `JSConsole` |

### 2.3 原始数据

**基线（原实现）** —— 滑动一次（`input swipe` 拖过整条轨道）：

```
播放调用 13 次  →  解码器 allocate 13 次   （100% 重建）
每次 allocate 间隔 ≈ 35ms
每次 AudioTrack stop 时 delivered 3456 frames = 78ms（＝ slide.mp3 完整时长）
```

**实验 A（`src` 仅在变化时赋值 + 探针）**：

```
playSound 调用 8 次（SET=2 / REUSE=6） | 解码器 allocate 8 次 | AudioTrack stop 5 次
→ 每次调用伴随重建的比例：8/8 = 100%

15:17:48.082 SET   slide slot=0  allocate 15:17:48.213   ← 延迟 131ms
15:17:48.172 SET   slide slot=1  allocate 15:17:48.214   ← 延迟  42ms
15:17:48.200 REUSE slide slot=0  allocate 15:17:48.271   ← 延迟  71ms（未赋值 src 仍重建）
15:17:48.246 REUSE slide slot=1  allocate 15:17:48.271   ← 延迟  25ms（未赋值 src 仍重建）
15:17:48.279 REUSE slide slot=0  allocate 15:17:48.308   ← 延迟  29ms
15:17:48.315 REUSE slide slot=1  allocate 15:17:48.345   ← 延迟  30ms
15:17:48.394 REUSE slide slot=0  allocate 15:17:48.423   ← 延迟  29ms
15:17:48.422 REUSE slide slot=1  allocate 15:17:48.461   ← 延迟  39ms
```

**实验 B（`stop()` → `pause()`）**：`调用 5 次 / allocate 4 次 / AudioTrack stop 2 次`，重建率仍 80%。

**关键读数**：从 `playSound` 被调用到解码器就绪，**已热状态 25~39ms，首次加载某个文件 131ms**。这个窗口就是"滞后感"的物理量。

---

## 3. 根因链

```
playSound()
  └─ getAudioContext()          池轮询取 2 个实例之一
  └─ ctx.src = src              ①（实测非元凶：不赋值也重建）
  └─ ctx.stop() / ctx.pause()   ②（实测非元凶：换了也一样重建）
  └─ ctx.seek(0)
  └─ ctx.play()                 ④ ← 到这里，框架重建整个播放器
                                   CCodec allocate + 新建 MediaCodec adapter
                                   + 新建 AudioTrack（session id 递增）
        耗时：已热 25~39ms ｜ 首次加载某文件 131ms
```

**推论**：`play()` 是个"重量级"动作。单次点击听感上只是"慢半拍"，一旦调用间隔小于重建耗时，播放就会互相踩踏。

滑动场景的算术：
- 相邻两次播放间隔 ≈ **30~40ms**
- 重建耗时 ≈ **25~131ms**
- → 绝大多数播放请求在"自己还没准备好"时就被下一次打断，或与前一次重叠成糊音

---

## 4. 为什么恰好是「前两次」

音频池大小正好是 **2**，两个槽各自都要为某个新文件付一次"首次加载"成本：

| 顺序 | 命中的槽 | 该槽上次装的是 | 本次要装 | 延迟 |
|---|---|---|---|---|
| 第 1 次 | slot 0 | `slide.mp3` 或空 | `switch.mp3` | **131ms 级** |
| 第 2 次 | slot 1 | `slide.mp3` 或空 | `switch.mp3` | **131ms 级** |
| 第 3 次起 | slot 0 | `switch.mp3`（已在 page cache） | `switch.mp3` | 25~40ms |

前两次每次要 131ms 才出声，而 0.57s 的音效在这种状态下通常只播了几十毫秒就被下一次 `stop()` 掐断 → **听感上就是"没声音"**；第三次起延迟降到 30ms 级，能正常播完。

同理「首次滑动无声、第二次有声」：第一次滑要付 `slide.mp3` 的首载成本，第二次滑动时文件已缓存。

**推论（重要）**：这个"前两次"现象会在**每次跨音效类型切换后重新出现** —— 比如先滑动（两个槽都装成 `slide.mp3`）再点卡片，前两次又会有延迟；来回切换就间歇性地丢音。

---

## 5. 影响面：项目内全部播放入口

所有播放**共用同一个 `playSound` + 同一个全局音频池**，因此问题性质相同，只是暴露程度不同。

| 位置 | 音效 | 触发频率 | 暴露程度 |
|---|---|---|---|
| `GoalModal` 滑块拖动（`updateFromTouch`） | `slide` | **每跨 1 格播 1 次**（实测一次滑动 8~13 次调用） | **最严重** |
| `GoalModal` 快速选择卡 / `AddFood` 甜度·餐次卡 / `OptionTray` / 分类 chip | `card` | 人手连点 200~300ms | **严重**（跨类型切换时前 2 次听不到） |
| `GoalModal` 松手（`onDragEnd`） | `slide` | 松手时**额外再播 1 次**（与最后一格几乎同时） | 加剧打断 |
| `Home` 点瓶子 / 点日期 / FAB / `FoodPicker` 选食物 | `click` | 单次 | 轻微（有 25~131ms 延迟，冷启动首次最明显） |
| `Home` 删除条目 / 百科 CTA / 保存成功 / `GoalModal` 保存 | `delete`/`confirm`/`success` | 单次 | 轻微；`success.mp3` 58KB / 1.83s，**首次加载最慢** |
| `Home` 长按摇瓶 | `shake` | **仅 1 次**（`shakeStep` 递归只做动画，不播音） | **无** |

另外两个顺带发现（与本问题相关）：

1. **`maxDurationMs` 是死参数**：`settings.ts:198` 的 `playSound(type, maxDurationMs)` 声明了第二参，但内部 `s.playSound(type)` 没往下传，store 里的实现也只收一个参数。曾经想做的"限制播放时长"从未生效。
2. **错误全静默**：`catch (e) {}` 吞掉一切，且没有任何 `onError` 监听 → 播放失败、状态非法都无迹可查。**本次排查最大的阻力就在这里**：只能从 Android 底层日志倒推。
3. `obeyMuteSwitch` / `mixWithOther` 只在 `#ifdef MP-WEIXIN` 里设置，**App 端没有**对应设置。

---

## 6. 修复方案（三档，可组合）

### 方案 1：节流（最小改动，立刻见效，治标）

给高频音效加**最小触发间隔**，把"每格一次"降成"每 N ms 一次"：

```ts
let lastPlayAt = 0
const MIN_GAP = 90        // ms，应 ≥ 已热态重建耗时上限
function playSound(type: SoundType): void {
  const now = Date.now()
  if (type === 'slide') {                 // 只对高频音效节流
    if (now - lastPlayAt < MIN_GAP) return
    lastPlayAt = now
  }
  ...
}
```

- 效果：一次滑动从 8~13 次降到 3~5 次，明显改善糊音与丢音
- 代价：手感上"每格都响"变成"隔着响"，需要用真机调 `MIN_GAP`
- 风险：低。**建议先做这一档。**

### 方案 2：换成 SoundPool（根治，需要写 UTS 插件）

Android 原生 `SoundPool` 就是为这类短音效设计的：预加载解码到内存、播放延迟通常 < 10ms、不重建解码器、支持多路并发。

- 做法：写一个 UTS 插件封装 `SoundPool`（`load()` 预加载 6 个音效 → `play()`），`settings.ts` 里按平台切换实现
- 效果：**根治**，所有入口同时受益，延迟从 25~131ms 降到 ~10ms 级
- 代价：需要新增 UTS 插件（要能编译验证；建议同时保留 JS 实现作为小程序端回落）
- 风险：中。需要真机验证多路并发、音量、`release()` 时机

### 方案 3：预热 + 可观测性（配套，成本低）

- **预热**：App 启动后（`onLaunch`）对 6 个音效各静默播一次（`volume = 0`），把"首次加载"成本提前付掉。**注意**：这会触发 6 次重建，要在启动空闲时做，别和首屏动画抢资源。
- **可观测性**（强烈建议，与方案无关，是基本卫生）：
  - 去掉 `catch (e) {}`，改为 `console.error` 输出
  - 给池内每个实例挂 `onError`，记录 errCode/errMsg
  - `slide` 这类高频音效的调用点加采样计数日志（只在调试构建里开）

### 方案 4：素材层面（辅助）

`success.mp3` 58KB / 1.83s、`shake.mp3` 27.6KB / 0.86s 相对提示音的定位偏重（首次加载最慢）。若走方案 2 则可忽略；若维持现状，可考虑把 `success` 压到 96kbps 或裁短。

---

## 7. 附录：实验复现步骤

```bash
# 0. 前置：设备端 www/app-service.js 必须与本地编译产物字节一致
ADB="D:/soft/i4Tools9/files/adb/adb.exe"
P="/data/data/io.dcloud.uniappx/apps/__UNI__F70225F/www"

# 1. 取运行时产物（务必用 exec-out，shell cat 会把 LF 换成 CRLF）
"$ADB" -s emulator-5554 exec-out "run-as io.dcloud.uniappx cat $P/app-service.js" > /tmp/app-service.device.js

# 2. 本地改函数体 + 插 console.log 探针，node --check 验语法
# 3. 灌入（/data/local/tmp 是 0771，可穿透读）
"$ADB" -s emulator-5554 push /tmp/exp.js /data/local/tmp/exp.js
"$ADB" -s emulator-5554 shell "run-as io.dcloud.uniappx cp /data/local/tmp/exp.js $P/app-service.js"

# 4. 重启 App 生效（app-service.js 只在启动时加载）
"$ADB" -s emulator-5554 shell am force-stop io.dcloud.uniappx
"$ADB" -s emulator-5554 shell monkey -p io.dcloud.uniappx -c android.intent.category.LAUNCHER 1

# 5. 抓日志（探针落在 tag JSConsole）
"$ADB" -s emulator-5554 logcat -c
"$ADB" -s emulator-5554 shell input swipe 280 1457 1080 1457 400     # GoalModal 滑块
"$ADB" -s emulator-5554 logcat -d > slide.log
grep -c "CCodec  : allocate" slide.log                                # 重建次数

# 6. ★必须还原★
"$ADB" -s emulator-5554 push app/unpackage/dist/dev/app-android/app-service.js /data/local/tmp/restore.js
"$ADB" -s emulator-5554 shell "run-as io.dcloud.uniappx cp /data/local/tmp/restore.js $P/app-service.js"
"$ADB" -s emulator-5554 shell "run-as io.dcloud.uniappx md5sum $P/app-service.js"   # 应为 af9216c2faf0f040f4639ff7f1a202d5
```

**踩坑提醒**：`adb shell cat` 会把 LF 转成 CRLF（642191 → 664537 字节），比对/回灌前一定用 `exec-out`。本次实验产物与日志留在 `debug/audio_probe/`（该目录已被 `.gitignore` 忽略）。
