# 总结 uni-app x 项目的坑与经验（轻律生活 EasyLife · 截至 2026-09-28）

> 素材来源：`AGENTS.md` 已知风险、`docs/progress.md`、`.workbuddy/memory/2026-09-19·20·25·26·27·28.md` ＋ `MEMORY.md`、ADR-001／004／005、`docs/analysis-2026-09-28-audio-playback.md`，以及本轮会话实证。
> 写法约定：每条按 **症状 → 根因 → 解法 → 落点** 落，能追到行号／函数的一律带上。
> **落点 ＝ 这个坑发生在本项目代码里的位置**（文件:行号 ＋ 函数／类名），行号按 2026-09-28 的工作区实测，后续代码演进可能漂移，但函数名／类名不会失效。
> 凡日志未定案的，标「未定案」而不编根因。

---

## 一、编译期硬红线（写了就断，且常常零报错）

| 坑 | 症状 | 根因 ／ 正解 | 落点 |
|---|---|---|---|
| 自闭合标签 `<input />` | `[plugin:uts] Element is missing end tag … 1:0`（假象报错） | 蒸汽模式 AST 解析中断；必须 `<input></input>` | 全工程 `<input></input>` 写法，如 `app/components/AddFood.uvue`、`app/components/GoalModal.uvue` 表单区 |
| 深层漏 `</view>` 的报错落在**父页面** | 子组件缺闭合，编译器在 `Settings.uvue:1:0` 报语法错 | AST 无法匹配父级 → 报错位置与真因不同文件 | 真因在 `app/components/GoalModal.uvue` 根视图闭合；表现点在 `app/pages/settings/Settings.uvue:1` |
| `min-height: 100%` | 致命编译 ERROR | 官方只认 `number\|pixel`；铺满用 `flex:1` | 已在各页根容器规避（`app/pages/**/*.uvue` 根 view） |
| `linear-gradient(180deg, …)` | `WARNING: Invalid linear-gradient value` | 原生端不接受角度，只写色标 | 全站渐变均无角度，例 `app/pages/home/Home.uvue` 页底渐变、`app/components/GoalModal.uvue` 主按钮 `accentSoft→accent` |
| `backdrop-filter: blur() saturate()` | uvue-css ERROR **且整条声明作废**（模糊从未生效） | App 侧只允许 `none\|blur()`；`saturate()`／`-webkit-` 隔离进 MP 分支 | `app/components/Tabbar.uvue:283`（App 裸 `blur(20px)`）vs `:287-288`（`#ifdef MP-WEIXIN` 内的 `saturate(150%)`），坑史记在 `:1` 与 `:278-279` |
| `max-height: 90%` | **整条静默丢弃**（反编译 `style.bytes` 无该字段）→ 09-27 那次「弹层贴合内容」在 App 端从未生效 | 只认 px；改运行时 `:style` 下发 `windowHeight*0.9+'px'` | `app/components/FoodPicker.uvue:131-139` `fpContainerStyle()`（`st['max-height']` 在 `:136`）；类侧说明 `:354-355`、`:376` `min-height:0` |
| `box-shadow` 含 `inset` | **整条 box-shadow 失效**（只剩白色光晕） | 拍平引擎不支持 inset，同条声明出现 inset 即整条丢弃 | `app/components/Tabbar.uvue:262`（注释标注）＋ 修正后的 `:261` `border-style` 邻域外阴影 |
| `border-width`＋`border-color` 缺 `border-style` | 边框整体不渲染、零报错 | 三件套必须齐全（小程序端走标准 CSS，默认 `none`） | 复发两次：`app/pages/settings/Settings.uvue:156 .card-danger`（修记 `:10`）、`app/components/AddFood.uvue` 甜度胶囊 `.sweet-pill`；正确写法样板见 `app/components/SettleBadge.uvue:403`、`app/components/CountStepper.uvue:251` |
| 后代选择器 `.a .b` | App 端无效（样式变死代码） | 原生端 class-only、无层叠；`var()` 未真机验证 → **根本没有 tokens.css**，色值逐页内联 | `app/components/Tabbar.uvue:1` 变更日志（原 MP 暗态后代规则在 App 上是死代码，已改逐元素 `:style`）；主题查表 `app/composables/useTheme.ts:121 paletteFor()` |
| `:style` 里 `calc(116rpx + px)` | 白屏＋编译中断 | 必须在 UTS/TS 层算成确切数值 | 正解样板：`app/components/FoodPicker.uvue:136`、`app/pages/home/Home.uvue:291 railFill` |
| 单字母 `r` 作 `v-for` 变量 | 该块插值全空＋其他卡片消失，**零报错** | 与 WXML 产物内部变量冲突；其余单字母正常 | `app/pages/settings/Settings.uvue` 列表 v-for（已统一 `item/row/drop`） |
| 跨 `.uvue` 的 `import type`／`export type` | **Web(H5) 整页白屏** `does not provide an export named 'AddPayload'`（App／MP 正常） | Vite 变换后 `import type` 变**值导入**、`.uvue` 的 `export type` 被擦除 → 共享类型只放 `.ts/.uts` | 类型已迁至 `app/composables/pickerTypes.ts`（根因说明在 `:3`）；消费点 `app/components/AddFood.uvue:106`、`app/components/OptionTray.uvue:44`、`app/components/FoodPicker.uvue:84`、`app/pages/home/Home.uvue:213`、`app/pages/records/DayDetail.uvue:158` |
| `components/` 下放纯逻辑 `.uts` | 运行时 `module 'components/tabOrigin.js' is not defined` → 三 Tab 页全白屏、零可见错误 | 产物与 require 路径都对，运行时找不到模块（**根因未定案**）；改一次性本地存储 | 旧 `components/tabOrigin.uts` 已删；现方案 `app/components/Tabbar.uvue:51 ORIGIN_KEY='ct_tab_origin'` ＋ `:66-69` 读后即删 |
| 页面根 view 写 `flex: 1` | 页面永不滚动（超出被裁） | 运行时 `uvue.wxss` 强制 `page{height:100%;display:flex}`＋`view{overflow:hidden;flex-shrink:0}` | 踩坑页 `app/pages/records/DayDetail.uvue` 根容器（删 `flex:1` 一行修复）；对照正常写法 `app/pages/home/Home.uvue` 靠 `padding-bottom` 自然生长 |
| `linear-gradient` 之外的 `conic-gradient` | App 端渲染**空白圆** | 原生不支持；改 Canvas 双路径 | `app/pages/records/DayDetail.uvue:279`（MP 通路，App 端未接，注释已标真机待验）、`app/pages/profile/Profile.uvue:325-331 ringStyle()` |
| `pages.json` 缺 `app/index.html`（Web 端） | GUI 报「根目录缺少 index.html」后停机 | 从 `default-x.zip` 拷入，勿手搓 | `app/index.html` |
| H5 端 `createInnerAudioContext().play()` | `NotAllowedError`（自动播放策略） | 静默预热必须包 `#ifdef APP \|\| MP-WEIXIN` | `app/stores/settings.ts:256-258 warmupAudio()` |
| 变更日志插在 `*/` 之后 | 块外裸文本 `Unexpected token (:217)` | 锚点行以 `*/` 结尾时，插入内容必须把 `*/` 挪到最后一行尾 | 两轮均发生在 `app/components/GoalModal.uvue` / `app/components/AddFood.uvue` 的 script 头注释 |

---

## 二、布局 · 层叠 · 命中区（yoga 与 Web 直觉的偏差）

1. **命中区不随 border-box 扩展**。`padding + 负 margin` 撑热区：布局达成但 padding 延伸区（+40px）**点不动**，只有文字中心可点。正解＝扩热区只能用**真实占位**（`min-height`／固定尺寸容器）。整轮「方案 A」因此还原返工。
   落点：`app/pages/records/DayDetail.uvue` 添加区 `.dd-add`（在 `.dd-secrow` 内，靠固定尺寸而非 padding 扩热区）；返工记录见 `.workbuddy/memory/2026-09-26.md:L344-353`。
2. **`pointer-events: none` 父级设了子级救不回**（探针实证：带内 0 命中／带外 2 命中）→ **做不了「不挡触摸的全宽托底层」**，TabBar「托底渐隐条」永久否决。
   落点：`app/components/Tabbar.uvue:1`（v2 的 `.tb-scrim` 已撤）、`:7` 结构注释；仍在使用且安全的纯装饰层＝`app/pages/home/Home.uvue:650/670/679/692/721/729/737`（这些层内无可点子元素）。
3. **零高度 fixed 父级把后代全裁**（Android `clipChildren`，fixed 子节点也一起消失）→ **结构铁律：根节点＝胶囊本体**。
   落点：`app/components/Tabbar.uvue` 根节点（fixed ＋ `:style` 下发几何）；几何常量 `:37-70`（`KEYS`／`PAGES`／按 750rpx 基准的稿面几何注释 `:37`）。
4. **弹层「写死高度＋内容顶对齐」是架构病**：溢出全落底部，`padding-bottom` 与确认钮被推出屏外（奶茶 1365.4rpx 时完全出屏）。根源＝同一弹层内列表步底距放在**不滚动的 `.fp-sheet`**、详情步放在**滚动内容里的 `.af-sheet`**。口径：容器 `height:auto` ＋ 运行时 px `max-height` ＋ `flex column` ＋ 子层 `min-height:0`；`padding-bottom` 只放不滚动的层；App 端底距＝设计值 ＋ `safeAreaInsets.bottom` px。
   落点：`app/components/FoodPicker.uvue` `.fp-container-detail`（原写死 1080rpx，现 `:131-139` 运行时下发）＋ `.fp-detail-wrap` `min-height:0`（`:376` 邻域）＋ `.fp-sheet` 底距；对照错误侧 `app/components/AddFood.uvue` `.af-sheet` / `.af-scroll`。
5. **`position:absolute; top:100%` 原生端不渲染** → 改 `fixed` ＋ 显式 px top。落点：`app/pages/encyclopedia/Detail.uvue` 渐变遮罩（原 absolute 方案已改 fixed ＋ `headerSpacerH`）。
6. **全局 `view{overflow:hidden}` 把溢出型装饰裁成硬边矩形色块**（光晕、外置印章、抬升阴影）→ 父链显式 `overflow:visible`；方形软影贴图放扁盒必须 `scaleToFill`（`aspectFit` 会缩成圆点）。落点：`app/components/AddFood.uvue` `.opt/.float/.art-wrap/.meal-card` 父链。
7. **「包裹／内嵌」稿面关系严禁用负 margin 叠压模拟**（Banner 三次返工）：被叠件高于叠压深度时下半截必然悬出容器外，改多少留白都修不好。排查第一步看模板嵌套，而非样式数值。落点：`app/pages/profile/Profile.uvue` 达标 Banner（B 必须是 A 的子节点）。
8. **含状态栏 padding 的渐变 Header，height 必须算进 `:style`**：CSS 写死 108px ＋ `:style{paddingTop:sbH}` 会把内容压成 `108−sbH`，标题被裁。正解＝`{paddingTop: sbH+'px', height:(108+sbH)+'px'}`。落点：`app/pages/records/Records.uvue` Header。
9. **`margin-left: auto` 在 uni-app x 是支持的**（真机证实空时间行 kcal 靠右分离）——别把想当然的「yoga 不支持」当结论。真正不可靠的是 `top+bottom` 拉伸（须显式 height＋top）与 `flex:1` 的 1px 分隔列（被拉成宽灰块，分隔线只写固定 width/height ＋ 父行 `space-between`）。落点：`app/pages/records/DayDetail.uvue` 营养分布分隔列。
10. **样式无 scoped，18 个 `<style>` 全局合并**：改 `.card` margin 28→46rpx 会串 7 组跨文件同名类（`.card/.header/.page/.dd-fill/.lr-bar-green/.pf-st-mask/.title`）。原本差 2rpx 看不出来，改到 46rpx 差 20rpx 必歪一页。铁律＝组件类名带前缀（`af-/fp-/gm-/lr-/dd-/pf-/st-`）。
    ⚠️ **闸门盲区**：`toolchain/hooks.py:223 check_class_collision()` 只比对「组件 ↔ 其他文件」（函数内以 `APP/"components"` 为源），**页面 ↔ 页面同名类完全在盲区**——绿灯 ≠ 无污染，动页面通用类名前必须自查类名交集。落点示例：Settings 的 `.st-card` 即由 `.card` 改名而来。
11. **UTS/`<script setup>` 声明纪律**：顶层同变量严禁重复 `let/const`；严禁 `const sbH = ref(0); sbH.value = …` 的裸副作用赋值（报 `Unexpected token (xx:1)`），必须原子内联强类型初始化。落点：各页 `sbH`，样板 `app/pages/records/Records.uvue`（`ref<number>(uni.getSystemInfoSync().statusBarHeight ?? 0)`）。
12. **跨页状态不能靠内存单例**：`redirectTo` 每次换页都是全新 Tabbar 实例。落点：`app/components/Tabbar.uvue:51/66-69`。
13. **App 端动画禁 setData 逐帧驱动**：过渡样式全包在 `#ifdef MP-WEIXIN` 由 CSS 自主跑帧；App 端正解＝Worklet（**仍是 TODO**）。已知代价＝JS 线程被挂载占住时阶段推进滞后（实测 press→travel 迟 260ms，稿面 16ms）。落点：`app/components/Tabbar.uvue` 气泡四关键帧 ＋ 阶段类切换。

---

## 三、Canvas 与动效

- **App 端 `stroke()` 零输出，只有 `fill()` 落墨**（安卓模拟器探针定案）：ctx 非空、缓冲区正确、调用无异常，画布上一个像素都不出现。线条／环必须改写为填充路径（外弧点列＋内弧逆序 `closePath()+fill()`，圆头＝两端各补 `arc(0..2π)+fill()`）；静态底轨用 CSS 圆环 view 承担。
  落点：`app/components/SettleBadge.uvue:211`（根因注释）＋ App 端填充路径 `:130-260`、MP 端 `stroke()` 分支 `:250`、CSS 底轨 `.sb-track`；`app/components/BottleLiquid.uvue:316` 属 MP 分支（App 分支全程 `fill()`）。
- **必须显式 `el.width = offsetWidth*dpr`**：未赋值整条静默不落墨。落点：`app/components/BottleLiquid.uvue:94-100`、`app/components/SettleBadge.uvue:134-140`、`app/pages/probe/LiquidProbe.uvue:99-103`（三处同范式）。
- **`<canvas @ready>` 在 App 端首挂载可能不触发**：必须 `onMounted` 加 `setTimeout(…, 500)` 兜底 ＋ `readyFired` 防重复；`v-if` 组件每次重开都要重置标志。落点：`app/components/BottleLiquid.uvue:2`（`@ready`）、`:86-90 readyFired`、`:112` 兜底；`app/components/SettleBadge.uvue:6` ＋ `:23`（曾五路抢跑初始化，surface 未附加时 `getContext` 拿到死上下文并锁死 `readyFired`，真 `@ready` 反被吞）。
- **`ellipse()` / `roundRect()` 在 App 端不可靠** → `scale+arc` / `arcTo`。落点：`app/components/BottleLiquid.uvue` 液面与气泡绘制。
- **SVG `evenodd` 镂空在原生端渲染为实心** → 瓶肩两侧漏半透明矩形「层」（各 50.5rpx 楔形侧漏）。解法＝Canvas `clip()` 到内腔路径，**且必须同时撤父容器 `overflow:hidden` 与 4 个 `border-radius`**（clip 只「不画外面」，补不回「被父切掉的」）——这条迭代两轮才修完。落点：`app/components/BottleLiquid.uvue:41 CAVITY_PATH`、`:76-77 traceCavityPath()`、`:261-266`（不支持 clip 时的降级说明 ＋ `c.clip()`）；容器侧 `app/pages/home/Home.uvue:57/708 .bottle-cavity`、`:264 CAVITY_HEIGHT`（注意：容器已 242rpx，该常量现无引用）。
- **改 canvas 高度必须同步改 `scaleY` 分母**（236→242rpx 同步改），否则水位漂移。落点：`app/components/BottleLiquid.uvue:7` 变更日志 ＋ 绘制段 scaleY。
- 液体物理调试要点：时间单位（ms）与弹簧形式必须一致；impulse 设的是**位移**不是速度；判据用**多帧阻尼振荡包络**。参数引擎落点：`app/composables/useLiquid.ts`（M1 cos(πu) T=460ms ζ=0.14 ＋ M2 sin(4πu+φ) 0.955 decay）；水位视觉上限受瓶肩约束＝`app/composables/useLiquid.ts:8 MAX_FILL=0.68`（曾 0.80 溢出瓶颈），同值镜像在 `app/pages/home/Home.uvue:265 MAX_FILL_RATIO`——**两处必须同步改**。
- **App-Android 的 canvas 拿不到「位图」，所以 `drawImage` 事实上不可用**（2026-09-29 在兄弟项目 mini 的四档渲染 spike 探针定案）：`createImage` / `loadImage` / `Image` 在 `ctx`、canvas 元素、`ctx.canvas`、`el._nativeCanvasElement`、`el.ext`、`uni` **六处宿主上全部不存在**；`uni` 上唯一带 canvas 字样的键是 `createCanvasContextAsync`，调用后**返回 null**；`drawImage` 函数本身在 ctx 上存在、喂字符串路径也不抛异常，但 `toDataURL` 长度 266→266 一字节未变＝零落墨。结论：**「把 PNG 贴进 canvas」这一整类方案（骨骼图／序列帧／精灵表）在此基座上没有入口**，别再为它排期。落点：`mini/app/pages/spike/Spike.uvue` 的 `probeD0()`／`probeHosts()`／`probeDrawString()`；证据行 `SPK| D0-host createImage=[ctx:false el:false cvs:false native:false ext:false]`。
- 上条的附带发现：走 `uni.getElementById('canvas节点')` 拿到的元素，**`el.width = Math.floor(offsetWidth*dpr)` 会被忽略**——赋 558 后读回仍是 558.75（＝200×2.79375），backing store 已按 dpr 自算。这与本节「必须显式设 width*dpr 才落墨」**并存不矛盾**（那三处落点是 `<canvas>` 组件＋自带上下文的路线），但说明它不是通用真理：换一条取用路径就要重新探针。

---

## 四、音效（最长的一条排查线，三轮才收敛）

- **根因＝框架层**：App 端 `innerAudioContext` **每次 `play()` 都重建底层播放器**（logcat 实证 `DMCodecAdapterFactory` + `CCodec allocate(c2.android.mp3.decoder)` ＋ 新 AudioTrack session，**allocate 次数 ≡ 起播次数**）；单次重建 25~39ms（已热）／131ms（首载）→ 相邻音效互踩丢音。
- **两个「看起来对」的方案已双向证伪**：①「`src` 没变就不重赋值」——4 次点击仍 4 次 allocate；②「`stop()` → `pause()`」。另：`src→stop→seek→play` 序列本身就是失败路径（stop 拆掉玩家后同值赋 src 是空操作，play 静默失败＝「起播即结束」）。
  **正解落点**：`app/stores/settings.ts:116 playSound()` → `:126-133`（`ctx.src=''` → 20ms 后重设 src ＋ `play()`），实例池 `:232-248 getAudioContext()`，按类型最小间隔 `:22-28 MIN_PLAY_INTERVAL_MS`（click 类 130／confirm 350／shake·success 320）＋ `:122-124` 闸门，静音开关 `:221-227 applyMuteOption()`（仅 `#ifdef MP-WEIXIN`），预热 `:256-282 warmupAudio()`（`App.uvue:18` 启动 1.5s 后调用），模块级转发 `:284 playSound()`。
- **判据纠错（重要）**：`AudioTrack: stop(N) called with M frames delivered` 的 M（slide 恒 3456＝3×1152、switch 25344＝22×1152）**只证明数据全写进缓冲，不证明听见了**；可用判据＝**`onEnded` 是否触发** ＋ session 存活时长 vs 素材时长 ＋ 端到端耗时。
- **已落地**：全局单实例 ＋ **130ms 互斥**（滑动场景完整播出率 25%→100%；**单实例只减开销，互斥才是解决听感的关键**）。随后再发现「130ms 是照短素材调的」→ 补上第二条机制（每次 `play()` 会掐掉上一次未播完的）→ 素材换短。判据公式：能否被听见＝下一次点击是否晚于「起播开销 ≈75ms ＋ 素材时长」。高暴露顺序：GoalModal 滑块（一次滑动 8~13 次调用）> 连点卡片 > 单次点击。
  **调用点落点**：`app/components/GoalModal.uvue:268 card / :272 slide / :343 success`（滑块＝最高危）、`app/components/AddFood.uvue:403 / :472 card`（餐次/选项连点）、`app/components/OptionTray.uvue:78 card`、`app/components/FoodPicker.uvue:238 / :243 click`、`app/pages/home/Home.uvue:414 shake / :543 success`、`app/pages/encyclopedia/Detail.uvue:378 confirm`。
- **素材与映射的当前事实**（本轮 ffprobe 复测，务必以此为准，别引用旧值）：`AUDIO_FILES` 在 `app/stores/settings.ts:206-215`，现存 4 个文件＝`click2.mp3 96ms`／`confirm.mp3 313ms`／`shake.mp3 862ms`／`success.mp3 1320ms`；`click/switch/card/slide/delete` **全部映射到 click2**。演进史记在同一文件 `:188-203`：`switch.mp3(575ms)`、`tap.mp3(131ms)`、`slide.mp3`、`click3(1104ms)`、`click4(888ms)` **均已删除**（曾出现 `switch.mp3` 文件不存在、`click2` 零引用的孤儿期）。
  ⚠️ 本条推翻两处旧记录：①「`playSound('confirm')` 不在 `AUDIO_FILES` → 百科 CTA 静默无声」**已修**（现映射齐全）；②「`maxDurationMs` 是死参数」**已不存在**（全仓 grep 零命中）。仍开放＝`composables/useDeviceCapability.ts:18/:127` 与 `stores/device.ts:17` 的 `sound` 档位**没有任何消费者**（`playSound` 只读 `soundEnabled`），low 档不会因此关音效＝装饰性字段。
- **走过的弯路**：换 `click3`／`click4` 都比原素材**更长更重＝换了更差**；调互斥阈值只会更稀疏。点击音业界惯例 50~150ms。社区方案 destroy+新建**不可照搬**（场景频率差两个数量级），只吸收「`autoplay=true` 规避 src 未加载完就播的静默窗口」。
- **排查最大阻力**＝业务代码 `catch(e){}` 全静默 ＋ 无 `onError`，只能从 Android 底层日志倒推（现已在 `getAudioContext()` 里补 `ctx.onError` ＋ `console.error`，logcat tag `JSConsole`）。
- 素材裁剪注意：ffmpeg 裁 120ms 成品 157ms（mp3 padding 撑长）；`tap.mp3` 当时＝82ms 裁 ＋ 5ms 淡入 ＋ 32ms 淡出 → 131ms。
- **根治方向**＝Android **SoundPool**（<10ms、不重建解码器），但 `hp-soundpool` 的 uni-app x Android 列是 `-` → 须自写 UTS 插件，列 1.1。
- 架构约束：统一入口 `stores/settings.ts`（`AUDIO_FILES` ＋ `SoundType` ＋ `playSound`），**其余文件禁写 `/static/audio/*`**；总开关 UI 在 `app/pages/settings/Settings.uvue:56 knob / :265 setSoundEnabled / :313 soundToggleFill`。

---

## 五、真机链路与「假绿」——本项目最贵的一类坑

1. **差量编译不重编视图层字节码（第三类假绿）**：watch 只重写 `app-service.js`，**不再生成 `bytes/GenComponents*SharedData.{kt,cpp,style}.bytes`**，而设备 Vapor 跑的就是 bytes → 「改代码＋编译成功＋同步成功」真机仍跑旧逻辑（SettleBadge 连续 5 轮验收无效）。**判据＝`bytes/` mtime 晚于源码 mtime**；只有纯 `app-service` 侧（无模板／样式）变更才可信任差量。
   落点：产物目录 `app/unpackage/dist/dev/app-android/bytes/`；踩坑对象 `app/components/SettleBadge.uvue`。
2. **本地编译好 ≠ 设备生效**：必须比文件数／md5。实测推送中断——设备 `www` **469 vs 本地 813**、`app-service.js` 缺失、`static/` 只拷 3/14 → **白屏**（等 20s 无增长才确认）。三个反直觉点：adb push 出来 0775（run-as 读得到）；**不能写 `cp -r src/. dst/`**（www 0771 无 readdir 权限）；**`cp -r src/static dst/` 目标已存在时会套成 `static/static`** → 先 rm 再 cp。落点：设备资源树 `apps/__UNI__F70225F/www/`（`run-as io.dcloud.uniappx`）。
3. **⚠️ 需更正一条已入 MEMORY 的结论**：workbuddy 记「**`cli.exe launch` 无条件挂死 → 重编唯一路径＝GUI watch 会话**」（`2026-09-27:L150/L426/L437`、`docs/progress.md` L982/L999-1001/L1547）。但本轮与历史多轮实际用 **`cli.exe launch app-android` 全量重编成功**，证据：`ready in 14462ms`（Boss 贴的 20:48 控制台）、`ready in 42222/41336/70494/14725ms`（progress L527/L580/L335/L939），且 bytes mtime 均晚于源码。
   **更可能的机制＝「cli 跑完进程不退出（watch 语义），前台调用必然超时」被记成了「挂死」**——09-27 日志自己就写过「靠 `ready in` 判完成，不要等 task 通知」。真正约束应记为：① 必须用工具自带后台模式（`nohup cli.exe launch … &` 会被沙箱连带杀掉，日志停在「正在编译中」、`dist/` 被清空）；② 上一个 watch 会话结束后 HBuilderX 主体随之退出，需先 `cli.exe open`（等约 10s）再 launch；③ **退出码 0 ≠ 编译发生**；④ `--compile true` 只编译不装机（34~53s），真机回归必须走不带 `--compile` 的完整 launch；全量构建 3~6min。
4. **坐标取证是头号误判源**：
   - 目测缩放截图推坐标必错（估 y1024／实际 y1130 偏 106px；另一轮三点失败实为偏上约 70px）。正解＝**PIL 按特征色扫 bbox 取中心**（accent≈`#20C997`）。
   - **滚动后旧坐标必失效**：本轮把「DayDetail 添加按钮点七次无反应」判成控件死，实为沿用了另一滚动态的 y≈885（落在营养分布卡）；同帧重扫得 x1033..1231 / y1146..1184，一击即开。**纪律：判控件失效前必须在当帧截图重测命中带。**
   - **按钮视觉 ≠ 命中区**（深色开关实为 x995..1155 / y635..725，比视觉小）。
   - **量圆角容器垂直尺寸一律取水平中心列**（沿「边缘列」扫白会把 36rpx 圆角区读成页面底色，系统性低估）。
   - **对比图必须先等页宽对齐**：非满宽截图（552×1097 裁剪）直接当页宽算 K → 得出「边距=0」假象；可靠换算法＝用两个已知比例元件（图标圆底 76rpx、开关 94×56）反查 K。
   - **采样前先确认类归属**：曾把 `.dd-card-title` 当 `.dd-ring-label` 采样，差点得出「改动没生效」。
   - 「最深像素」判据被抗锯齿污染 → 改用笔画色直方图 top-N。
   落点：被测控件 `app/pages/records/DayDetail.uvue` `.dd-add`、`app/pages/settings/Settings.uvue` 开关 `.knob`、量高对象 `.card` 圆角 20rpx。
5. **自动化工具能力边界**：`uiautomator dump` 对 uni-app x 全盲（节点全 `clickable=false`）；automator 的 `size()/offset()` 对组件内节点一律回吐页面根矩形；组件内节点 `el.tap()` **静默落空**（正解＝处理器直调：查产物 wxml 的 `bindtap="{{键}}"` → `mp.evaluate` 取 `$scope[键]` → 直调）；`el.trigger('input',{value})` 不生效；**坐标 tap 打不中微信原生弹层**（ActionSheet/Modal 在原生层渲染，勿据此判「删除无效」——本项目删除入口＝`app/pages/records/DayDetail.uvue confirmDelete()` 的 `uni.showActionSheet`）；`page.$$('.row')`／组件标签名／`组件名 >>> 类` 全 0 命中，唯一锚定＝`.page >>> .xxx` 且只回首个匹配。验证脚本落点：`debug/picker_check.js`、`debug/batch_check2.js`。
6. **adb／触控通道**：`cli.exe launch` 后 **`input tap` 静默失效** → 同点短 `input swipe x y x y 80~120`，长按 `… 900`；截图为原生分辨率（1280×2772）故 **PNG 像素 == 点击坐标**。取文件用 `exec-out`（`shell cat` 把 LF 转 CRLF：642191→664537）。Git Bash 需 `export MSYS_NO_PATHCONV=1`。MuMu 自带 adb 须走 `-P 5038`（与 HBuilderX 5037 抢端口会踢掉设备会话）。`pm clear` 连调试基座资源一起清 → 必须重跑全量 launch。落点：助手脚本 `debug/shot_android.sh`（`cap/tap/hold/scroll`，gitignore）。
7. **零日志先怀疑自己的产物**：把 `let lastPlayTs` 拼进 `if` 块内 → `ReferenceError` 被原代码 `catch(e2){}` 吞掉 → 一个字都没打出来，极易误判「方案无效」。落点：当时探针位置 `app/stores/settings.ts` play 分支（现规范声明在 `:27 lastPlayTsByType`，函数体外顶层）。
8. **A/B 探针本身会扰动时序**：`console.log` 走桥接有开销，同一动作无探针 25 次重建 vs 有探针 18 次 → **要比较的两组必须同款同位置探针**；且探针必须能证明改动生效（`SET`/`REUSE` 分支计数；只比总次数会被「滑动距离不同→调用次数不同」骗到，13 vs 8 就是噪声）。
9. **锚点写错键＝四组实验打同一份素材**：本想改 `card:`，锚点抄成 `click:`（两行形状一模一样）→ 四组结果完全相同，差点写成「换素材没用」。规则：动手前 `grep -o '<键>: "<值>"'` 确认命中行；**结果「过于一致」是最强警报**。落点：`app/stores/settings.ts:207-213`（click／switch／card／slide／delete 五行值完全相同，正是这个陷阱的现场）。同族：`count==1` 只证明锚点唯一，**不证明语义正确**。
10. **脚本插入静默吞行两轮**：09-27 误用 replace 吞掉 `2026-09-24 Header` 日志条目；09-28 改 `card:` 时 old 带两行、new 只写一行 → `success:` 被吞。**插入类 new 必须完整带上 old。**
11. **shell／正则坑（两天第三次犯）**：heredoc 吃 `\d`/`\s`（`\d:` 变 `/d` → 统计出 0，差点误判「没播放」）、`python -c` 里的反引号被当命令替换吞 → **含正则的脚本一律 Write 成文件再跑**；`re.match` 的 `$` 吞行尾换行致 13 行合并；`grep -c '[AP]'` 是**字符类**（无探针产物也报 1088）→ 计数用 `grep -cF`；一条正则套所有事件会漏项（`EV onEnded` 不带 `t=` 被跳过 → 算出「完整播完 0」）；Git Bash `/tmp` 与 Windows python `/tmp` 不同目录（解析成 `C:\tmp`）；`adb logcat -d` 在 Windows 输出 CRLF；`sed` 远程改设备产物报 `bad pattern 's/A'`。
12. **`git add | head` 会 SIGPIPE 中途杀 add 且 exit 0 掩盖事故** → 用 `find -print0 | xargs -0 git add --`。
13. **CRLF**：`git status` 干净 ≠ 无 CRLF 污染——`core.autocrlf=true` ＋ `.gitattributes` 的 `* text=auto eol=lf` 在比较前归一化，**残留被掩盖**（实测 4 文件中招，含 `docs/progress.md`）。还原写回用 `newline='\n'`，且**读时必须 `newline=''`**。批量改完一律 python 统一验。
14. **git 自身判据坑**：判「代码零改动」须 **diff ＋ mtime 双判据**；`git checkout` 会把还原文件 mtime 刷成当下，勿据此判改动；假 `M`（diff 0 行）用 `git update-index --refresh`——曾对 `app/App.uvue` 误判。
15. **其他假绿来源**：验收截图撞上未同步旧包（第一轮六档截图全采的旧包）；差量期间基座脏状态（点击乱跳／路由栈异常）→ 必须 `force-stop` 干净再验收；全量 launch 后首屏常纯白假死（`#FAFAFA`、零报错）需 force-stop＋start＋等 10s（**调试基座现象，不是产品缺陷**）；沙箱黑名单拦 `wmic.exe` 会让 HBuilderX 自启即死（零代码改动时直接 adb monkey 拉已装包）。
16. **不重编译热调试（已固化 skill `uni-app-x-runtime-hot-patch`）**：App 端跑未压缩明文 `app-service.js` → `exec-out` 取产物 → 本地改＋插探针 → `push` → `run-as cp` → `force-stop` ＋ monkey（~15s）→ 归因 → **本地正式产物原样还原 ＋ md5 核对、探针清零、`/data/local/tmp` 清空**。动手前必须 md5 证明设备产物 == 本地产物。落点：设备 `/data/data/io.dcloud.uniappx/apps/__UNI__F70225F/www/app-service.js` ↔ 本地 `app/unpackage/dist/dev/app-android/app-service.js`。
17. **调试通道要按基座重验，不能沿用**：`console.log` 在本项目落 logcat tag `JSConsole`（`adb logcat -d | grep` 直读），但 2026-09-29 在兄弟项目 mini（同 HBuilderX、vapor＋`vapor-render-target:"bytecode"`、MuMu 同版本链）上**完全不落 logcat**，logcat 里只有系统行。那边的唯一通道是 HBuilderX CLI 的标准输出（把 `cli.exe launch` 重定向到文件再 tail）。**开工先发一条 log、两头各查一次，别假设。**
18. **纯逻辑／边界改动无需真机**：把判据按源码**逐行同构**抄进 node 脚本、喂真日期跑 21 条断言（左右双灰／翻到边界后灰／连翻 18 个月被拦／点未来日拒绝且不跳月）即可收口。落点：被测逻辑 `app/pages/records/Records.uvue:306 ymOf() / :321 firstDataYM / :331-332 canPrev·canNext`、`app/pages/records/DayDetail.uvue` 餐窗判定。
19. **弹窗自关抓证**：AddFood「添加到夜宵」弹层 <1.5s 自动关闭，**必须点击后立即 screencap**。落点：`app/components/AddFood.uvue` 确认提交后的自动收起链路。
20. **触控假死恢复**：`am force-stop` ＋ monkey。FAB 重启可恢复，TabBar 三次重启仍无法触达（弹层正常）——此类只能留人工。
21. **合成点击不可靠 → 要测的东西别让手点**：MuMu 上 `adb shell input swipe x y x y 100` 打在按网格量准的按钮上仍零反应（mini 两次尝试：一次偏 ~130px，一次量准仍不响应）。凡设备回合要取数，**把「点按钮」换成「挂载后自动跑完序列」**，shell 侧靠日志里的 `ARMSTART`／`ARMEND` 标记对齐 `dumpsys gfxinfo reset` 与 `dumpsys meminfo`。落点：`mini/app/pages/spike/Spike.uvue` 的 `autoSeq`／`startSeq()`／`seqNext()`，采集脚本 `mini/toolchain/out/gfx-watch.sh`。
22. **`uni.getElementById` 在 App-Android＋bytecode/V8 下确实可用**（此前两项目史上零调用，属未证原语）：18 个逐 id 节点一次全取到；每帧 18 次 `el.style.setProperty('transform', …)`、60ms 单时钟下 gapP50 62／gapP95 65–76／gapMax 74–85ms，gfxinfo 488 帧 **0 jank**，PSS 比响应式 `:style` 档低约 20MB。落点：`mini/app/pages/spike/Spike.uvue` `ensureSized()`；完整四档数据表在 mini 项目记忆 `pet-stage0-verdict.md`。

---

## 六、数据 · 素材 · 主题管线

- **生成物不可手改**：食物库只走 `toolchain/build.py`（产出带 fingerprint：版本＋时间＋来源清单＋条数）；`opts` 改选项／默认值只改 `toolchain/sources/opts_tpl.yaml`（json 是产物，pre-commit 校验「源码零手写」）。单向流动：`toolchain/sources/*.yaml` → `app/src/data/*.json` ＋ 图标 → `app/static/icons/`。闸门落点：`toolchain/hooks.py`（`schema-version-check`／`food-data-integrity`／`class-prefix-collision`／`pre-commit`／`end-of-session`），`python toolchain/hooks.py all`。
- **`piece` 单位 kcal 差约 80×**（09-19 最贵的数据 bug）：计数单位除以 100 却不折克重 → 「1 个馒头」算成 2 kcal（正确 167），波及 170/347＝49% 食物。**已修**，落点：`app/stores/food.ts:311 computeEntry()` 先过 `gramsOf(food, amount, unit)`（`:305-309` 的 ⚠️ 注释即此坑留档）；组件侧克重来源 `app/components/AddFood.uvue:215 pieceWeight` / `:219` / `:430-431`，百科侧 `app/pages/encyclopedia/Detail.uvue:250`。
- **假数据清算**：`p348~p353` 六条是 `toolchain/add_foods.py` 为凑设计稿补的演示行（脚本自述「跑完即废」）→ 353→347，全链四源对齐、build「本次复制 0 个」、产物旧名 0 命中；种子换真实食材且**热量守恒 1367 不变**。遗留：这六条图标 92×92（其余 347 张 512），`assets/icons-gen/` 无原始 PNG，提清晰度要跑 `gen_icons.py`（等拍板）。演示数据曾被并行任务污染（夜宵 ＋2 条米饭 2914/1800）。落点：`app/src/data/food_library.json`（生成物，禁手改）、种子记录 `app/stores/food.ts` `seedEntries()`／`loadEntries()`（`STORAGE_KEY` 见 `:510`）。
- **暗态明度通道缺失是「图标在暗底看不见」的统一根因**：`toolchain/gen_theme_variants.py` 只做「色相旋转 ＋ `MID_L[0.30,0.70]` 明度平移 ＋ 服务灰稿 NEUTRAL_REMAP」→ `bg.svg` 全色 L=0.72~0.97 带外**净零变化**（`bg_dark` 与 `bg` **md5 相同**）、深色线 `#0A7A5C`(L 0.259) 带外不抬亮。修法＝`tint()` 加 HIGH 带压深（`(L-0.70)/0.30×-0.42`，饱和度减半防荧光）与 LOW 带抬亮（`0.30+L×0.25`）；全库命中 13 个未抬亮资产，修后餐次图标对比 **2.04:1 → 8.72:1**。落点：`toolchain/gen_theme_variants.py tint()` ＋ 运行时白名单 `app/composables/themeAssetList.ts`（**自动生成禁手改**）。
- **主题化必须连原生配置一起查**：`app/pages.json:8/15/22/29/36/50/57` 逐页 `backgroundColorContent` ＋ `:63` 全局（静态浅绿，百科页底部稳定 47px 漏白的色值来源）、`:64 navigationBarTextStyle:"black"` 写死——**主题开关碰不到（未修）**。**状态栏字色唯一有效 API＝`uni.setNavigationBarColor({frontColor})`**（`plus.navigator.setStatusBarStyle` 在 uni-app x 是空操作）落点：`app/composables/useTheme.ts:161 syncStatusBarStyle()`，接线在 `App.uvue onLaunch` ＋ 各页 `onShow`（例 `app/pages/home/Home.uvue:522`、`app/pages/encyclopedia/Detail.uvue:191`）。
- **隐形回归**：换更淡的 token 会「元素还在但看不见」——`.rail-line` 换 `theme.line` 后压页底对比 **1.13:1**；AddFood CTA 误改 `accent→accentMid`（真机底端精确命中 accentMid 坐实）。修法＝`useTheme.alphaOf(hex,a)` 手写两位十六进制（不依赖 `parseInt` radix，本仓无先例），rail 取 `accent@0.37` 跨 6 档自洽。落点：`app/composables/useTheme.ts:174 alphaOf()`、`app/pages/home/Home.uvue:291 railFill` ＋ `:123 .rail-line` 绑定；CTA 正确 token 对＝`accentSoft→accent`（同 `app/pages/encyclopedia/Detail.uvue` 与 Home FAB）。**换 token 前先算对比度**（文字 4.5:1／图形 3:1）。
- **命名即意图**：`accentDeep` 本是深色文字档，却被 30+ 处当渐变深端／强调／数据色滥用 → **三个独立症状同一病因**（渐变尾色发黑／强调字与标题同色／数据色不属同色系）。根因级修法＝补 token 档 `accent-mid`，而这六个值恰好等于既有 `tbTextOn`。落点：`app/composables/useTheme.ts:121 paletteFor()` 的 6 档矩阵 ＋ `design/DesignTokens.md` §8；典型误用点 `app/components/GoalModal.uvue .gm-save` 渐变尾色（commit `66e199b`）。
- **改默认值救不了存量**：昵称已落盘 `ct_user_v1`＝'老刘'，只改 `loadName()` 的默认 return **在这台设备永远不生效**。解法＝旧值设为 `LEGACY_PLACEHOLDER`，读到即视为「从未自定义」。落点：`app/stores/user.ts:8 STORAGE_KEY / :13 LEGACY_PLACEHOLDER / :21` 判定。**凡「改默认值」类需求先问：存量落盘里是否已有旧值？**
- **纯本机 storage 扛不住卸载**：5 个 key 全在沙盒，Android/iOS **卸载即清**；iOS 只有 Keychain 能跨卸载。落点：`app/stores/food.ts:510 ct_food_entries_v1`、`app/stores/goal.ts:5 ct_goal_v1`、`app/stores/settings.ts:13 ct_settings_v1`、`app/stores/user.ts:8 ct_user_v1`、`ct_pending_add`。1.0 决策＝Settings「数据管理」整块 HTML 注释、**刻意保留 i18n 键与图标**（`st.dataSec/st.export*/st.import*`）挪 1.1；`food.ts` 无 `replaceAll` action，恢复需新增。合规联动：`st.shield`「所有数据仅保存在本机」一旦上云必须同步改文案。
- **图标视觉尺寸三重叠加**：CSS 12×22rpx，但 `chev_right.svg` 是 24×24 正方形 viewBox、箭头本体只占 6×12，`aspectFit` **先被宽度约束** → 画布缩到 12×12，实测仅 2.6×4.5dp。规则：**判图标真实尺寸必须看 ①viewBox ②图形占比 ③aspectFit 约束方向**。落点：`app/pages/home/Home.uvue:114 + :883 .chev-right`、`app/pages/profile/Profile.uvue:98 .banner-chev / :109/:130/:164 .chev-mini`（同类 chevron 全项目四档并存 4.5/5.2/5.9/8.9dp，稿面资产 `app/static/*/chev_right.svg`）。另：自绘笔画失控（`M15 19L8 12L15 5` stroke 2.4 比稿面 lucide 粗一倍）；emoji（👥⚠️🍳🍽）在 App 端渲染成豆腐块；Material Symbols 描边版**只有 `/default/24px.svg`**，`fill0`/`wght400`/`regular` 全 404。
- **状态色不随主题轮值 → 不登记 themeAsset**（走查表反会被主题染色）；用 opacity 压深绿只会得到「浅绿」不是「灰」。落点：`app/composables/useTheme.ts:142 themeAsset()`（未登记自动回落底稿，**App 端引用缺失资源＝静默空白图标、零报错**）；漏配样例＝`Home.stickerSrc` 曾只按状态返回不走 themeAsset，而 `BottleLiquid` 不含 accent 属**既定设计**（要与真漏配区分）；灰箭头 4 张 `lr_*_off*.svg`＝禁用状态色，**不登记**。
- **验收口径「还原一次＝出 6 档」**：颜色改 useTheme 六张表；资产改底稿后必须重跑 `gen_theme_variants` 并在 `themeAssetList` 登记，暗态必须过带外规则，**验收要 6 档逐一截图，不能只验 mint-light**。
- **三档色唯一权威**＝`app/stores/goal.ts getCalorieStatus(已吃, 目标)`（≤100% 绿／100~150% 琥珀 `#E8B54D`／>150% 珊瑚 `#FF9E7D`，暗态提亮），消费者＝`app/pages/home/Home.uvue:233`、`app/components/SettleBadge.uvue:81`、Records/DayDetail/Profile；**新进度 UI 必走它，禁自定阈值**（唯一例外 GoalModal 的滑杆比值语义，已认可）。
- 暗态阴影：深绿影压在暗色 card 上**不可见** → `rgba(0,0,0,0.45)` 或白色光晕。阴影量级基线：卡片 0.04~0.06／关闭钮 0.14／按压浮起 0.35（个例）→ 常态白块浮起合理带 **alpha 0.16~0.22**。
- 性能细节：全宽托底层**刻意不加 blur**（省第三条 GPU 通道）；`success.mp3` 最重；跨音效类型切换后**前两次无声会重现**（音频池 2 实例轮询，两槽各需一次首载）。

---

## 七、设计稿工具链（Pencil / Ardot）

- **`execute` 脚本无返回值**（不 return 也不 console）→ 用 `throw new Error(JSON.stringify(data))` 把数据从错误信息带出；可用 API 仅 Get/Update/Insert/Replace/Delete。**但变更脚本里的 `throw` 会回滚整个执行块——throw 只用于只读脚本。**
- **渲染／导出滞后 2~3 个调用周期**：改完立刻 Export 拿到的是旧画面（字节级不变），等约 20s；`takeScreenshot` 偶发滞后一轮（全白）→ 隔一轮再截。验证用 PIL 数特征色，别肉眼比缓存图。单板图片 ≤8 张。
- **Delete 父 frame 会把子节点孤儿提升继续渲染**（删 OverPill 后 OverTxt 挂到 SumCard）→ **删除顺序必须「先子后父」**，删完立刻 Get 复查。
- `Get(id, visit)` 读 `bounds.y` **恒偏 +50** → 位置以 raw `n.y` 为准；flex 容器内 text 的 x/y 被忽略（warning）；`frame` 必须显式 `layout:'none'` 且只能写在 Replace 顶层；Replace 会换 id（旧壳失效须重新 Get，例暗弹层新壳 `X8wtJp`/`p09pr0`）；Update/Get 第一参数传名字也能解析（只有 `Found multiple descendants` 才暴露）。
- `U(node, {svg})` **静默 no-op** → 必须 `Delete()+Insert()`；node 级 `opacity` ≠ `fills[].opacity`（改错层＝没改）；`clipsContent` ＋越界 absolute＝静默消失；Insert 的新节点不进渲染管线；素材索引只在文档打开时构建（要读图用 `images/`）。
- 取板法：遍历计 `parentCtx` 深度，**`d0` 才是画板（47 块）**，按 `d1` 取到的是板内子节点；`MPI5w`/`rHdQ5` 只是 `ref` 引用不是独立版面。
- **稿面会滞后于代码**：ocean／lavender 两套主题在 47 块板里**没有任何页面板**（只有色板 `tpTAn` 记色值），Mint Dark 9 块最滞后；稿面 4 个选中气泡尺寸互不一致（96×44/92×42/108×41/102×43），真机已统一 192×88rpx；稿面并存 v1／v2 两代色板（弹层旧代色是 Pencil 滞后）。2026-09-25 审计结论：**不得据稿面反向改代码**。
- 主按钮渐变 token 唯一写法＝`accentSoft→accent`（禁 `accent→accentMid`）；气泡 v4 色、FoodPicker 选中圈等反哺明细见 `docs/decisions/ADR-005-pencil-mcp-operating-rules.md`。
- 字号口径：`design/typography-v2-registry.md` **是登记不是规范**——代码值与登记值不同以代码为准。实例：`Home` Hero XL **104rpx**（`app/pages/home/Home.uvue:768`）已真机验收冻结，禁因体系统一降为 92。

---

## 八、被反复验证有效的方法论（真正的「经验」部分）

1. **无视觉证据不动代码**；「能只改一个属性就不改两个」。
2. **mtime 判据排假绿**——两天内贯穿使用，本项目最重要的一条纪律。
3. **差异实验**：把参数改成极端值（`max-height` 上限临时 0.5）看是否精确命中（容器顶边落在 y1385/2772 == 50.0%），比目视强得多。落点：该实验对象＝`app/components/FoodPicker.uvue:136`。
4. **反编译产物判定 CSS 是否进产物**：`bytes/*.style.bytes` 为 `SBS2` 格式（block=`[属性][type][len][类名]`，长度按 rpx 原值、颜色 `B,G,R,alpha`）→ **只有字符串类名能 grep 命中**，`grep '46rpx'`／`'border-style'` 必 miss，别当成「没编译进去」。
5. **单变量归因 ＋ 双向证伪**：A 排除 src 赋值、B 排除 `stop()`，才敢锁定「`play()` 的框架行为」。
6. **先量再画**（像素测量 ＋ 字号反推公式）；**纵向预算先行**（首页 1:1 复刻 v1→v14 的根因就是没有整屏高度账）。
7. **廉价验证优先**：`capture_layout(problemsOnly)`、node 断言脚本、纯逻辑不上真机（见五.18）。
8. **量化验收**：亮度剖面互相关 ≤1.4px、区域 MAE；稿面导出 2.0 px/pt 比截图干净可量。
9. **delta 法调间距**：`新margin = 原margin −(实测 − 稿面)`；**别去推算 line-height**（margin 控「行盒」、稿面测「字形」）。
10. **做不到就删**（托底条、inset 高光）；**整屏重做＝新画板**；**降级要声明**。
11. **口径必须带阶段限定**：「按稿还原」是为 1.0 定稿服务的阶段性口径，定稿后方向反转（实现→稿面反哺）。**口径变了要连带重判旧结论，不能只对新问题用新尺子**（Settings 三轮改判的原文教训）。
12. **参考实现要抄「机制」，不能只抄「删掉什么」**：TabBar 气泡 v1→v4——只抄了「去描边／去投影／去自身 blur」，却把底色换成主题绿淡染，方向恰好相反，被老板两次推翻。正解＝`rgba(26,26,26,0.08)` 中性加暗（暗态 13% 白加亮），品牌色只由图标／文字承担。落点：`app/components/Tabbar.uvue:1` 变更日志 (6)；`accentTint()` 已删。另：胶囊从 60% 提到 80% 等于把早先被否的方案又做了一遍。
13. **客观 bug 与需拍板项分栏排队**，不混挂互相阻塞（清单混装导致已闭环项空等好几轮）。
14. **元素归属先回模板确认**（老板把 `OptionTray.opt-underline` 与 `FoodPicker.fp-row-accent` 当成同一个「添加食物选中态」）；**页面归属先跨页扫一遍**（「Home 底部漏白」实为百科页；截图文案反查 i18n key → 按 key 前缀定位组件）。落点：`app/composables/i18n.ts`（如 `:86 reg('st.sound', …)`）。
15. **凡「当前值／目标值」必带文件行号＋稿面出处**，否则列 P2；写作前 prefix 字节级校验防「重写历史」；每轮 `hooks.py all` ＋ `git diff --numstat` ＋ 时间窗内唯一写入文件清单 ＋ 暂存区禁词 grep。
16. **AI 审计报告必须强制取证**：09-25 第 2 版报告建立在第 1 版未核实数据上，逐行复验后撤销大部分结论（12 条 Type A 多数证伪）；「日期错位 bug」最终判为**自动化点错行的测试伪影，代码零缺陷**。判「控件失效」之前先怀疑几何测量——「层叠遮挡」结论必须晚于坐标实测（曾为此加了 2 行 `z-index` 防御代码，误判更正后 checkout 还原）。
17. **只改有据的，不猜**：变量名与用途错位是硬证据（`infoCarb` 用在脂肪上），但「脂肪该用什么色」文档无答案 → 保持不动；数据实证前不动（`max-width:144rpx` 未动，因为 353 条食物名仅 2 条 6 字且不在任何日期里）；幻影死代码要清（`status-*` 零消费者导致「v1 绿还活着」的误判）。
18. **备份先行**：删 6 张假插画前备份 `debug/removed_assets_20260927/`；换头像前备份 `debug/avatar_prev_20260928.png`；`debug/` 全在 .gitignore 但 `debug/goalmodal_open.png` 是**已跟踪文件**——覆盖后要 `git checkout --` 还原。
19. **混合工作区按语义拆 commit**；剥某类改动用「备份 → python `count==1` 强校验 → add → 还原」免交互。
20. **MEMORY 分层瘦身**：25.4KB→7.7KB（超限被截断注入，强制精编）；hot 内容前移、明细拆 ADR／registry。
21. **暗态不回归**是每条视觉改动的必查项；取证后必须还原设备设置（深色模式关回、原设置恢复）；**未拍板不动手**。
22. **引用型改动先确认落点存在、不扩权**；改动前先 grep 全项目确认类名作用域只在本页。

---

## 九、需更正或仍开放

- ⚠️ **`cli.exe launch`「无条件挂死／重编唯一路径＝GUI watch」与本轮实证冲突**（见五.3），应改记为「前台调用必然超时＋须后台模式＋判据看 `ready in`／bytes mtime＋无 GUI 先 `cli.exe open`」。**这条已写进 `.workbuddy/memory/MEMORY.md`，需要修订。**
- **本文件顺带更正的两条旧记录**（已按当前代码核实）：`playSound('confirm')` 静默无声 → **已修**（`app/stores/settings.ts:214` 有映射）；`maxDurationMs` 死参数 → **全仓已不存在**。
- **仍开放的音效债**：`useDeviceCapability.ts:18/:127` 与 `stores/device.ts:17` 的 `sound` 字段零消费者（low 档不会关音效）＝装饰性；`DeviceCapability` 分档未接音效链路。
- **未修／未定案**：`pages.json` 的 `backgroundColorContent`／`navigationBarTextStyle` 不随主题（`app/pages.json:8-64`）；`DayDetail.uvue:279` 进度环 App 端 Canvas 通路未接（注释自标真机待验）；`Home.uvue:264 CAVITY_HEIGHT` 现无引用（待清）；Profile 滚到底「查看全部」无响应（疑似底部遮挡）；Home「+」两次点击无响应（疑似漏绑）；百科页「下滑＝返回手势」根因；`components/` 纯逻辑 `.uts` 报 module not defined 的根因。
- **安全债**：`toolchain/debug_shot.ps1` 与 `debug/records_check.js` 内含**明文微信工具 MCP Token，且已进 git 历史**（是否改环境变量待拍板）。
- 音效 v3 的耳朵验收仍欠；根治＝自写 SoundPool UTS 插件（`hp-soundpool` 不支持 uni-app x），列 1.1。
- 稿面遗留：`docs/design/ScreenSpecs.md:115/226` 文案仍写「已按 中杯 500ml · 全糖 计算」，默认改五分糖后**文案与行为不符**（纯文案）。
- **待查（新证据，2026-09-28 21:48）**：安卓端 `libgcanvas.so` **SIGSEGV（signal 11, si_code 128）**崩溃两连，栈全在 gcanvas 内（`#00-#07` 同一 so），发生在首页水瓶液体 canvas 运行期间；**09-24 19:28 那次崩溃同款同库**。落点：日志 `app/dist/logs/android/20260928_214802_097_io.dcloud.uniappx_crash.log`、`:20260928_214811_420_…log`、`20260924_192854_452_…log`。疑似 MuMu 的 x86→arm 转译层（日志里刷的全是 `houdini`），但**未定案**——上真机（非模拟器）复跑一次首页长驻液体动画即可判定是模拟器还是产品。
- 语言切换代码在（`app/pages/settings/Settings.uvue:375 setLocale` → `app/stores/settings.ts:111`）但稿面无该项——老板拍板保留。
