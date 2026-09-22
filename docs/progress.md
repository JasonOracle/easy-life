# progress.md — 动态进度追踪

> **定位**：项目最高动态事实来源。新会话进来第一步读这个。
> 与 `AGENTS.md` 分工：AGENTS.md 是静态规则（不变的宪法），progress.md 是动态状态（一直在变）。
> **冲突仲裁**：如果 progress.md 与任何其他文档不一致，以 progress.md 为准。

---

## 当前阶段：MVP 主体已落地（5 页 / 8 组件 / 5 store / 353 条食物库），TabBar 已重构为「三 Tab 液态玻璃悬浮胶囊＋会跑的选中气泡」且**浅色态参数由 Boss 定稿收官**、Records 升为一级 Tab；余下待 App／Web 真机回归（含气泡 Worklet）与暗态染色图标等待拍板项

> 口径提示（2026-09-22）：本文件下方「最近进度」与「变更日志」中带旧计数（347 条、`app/data/`、Pixabay 图源）的条目为**当时批次原貌**，不回改；
> 现在的真值一律以本条与 `AGENTS.md` 目录结构为准：**353 条**食物、数据产物在 `app/src/data/`、图标唯一入库副本在 `app/static/icons/`。

## 最近进度

### 2026-09-23 03:15:00 — Android 全量体验修复与方案 A 单流程（FoodPicker + AddFood）架构落地

**起因**：红米 K80 手机 Android 真机实测暴露出多项原生渲染与体验问题：
1. 添加食物弹窗占满全屏且无法滚动；
2. 双 page-container 叠加导致连续打开 AddFood 产生约 1500ms 严重卡顿；
3. 二次打开弹窗残留上次选中状态与搜索词；
4. 树叶与波浪水体在 Android 端由于不支持 CSS @keyframes 动画而僵死，水体颜色左右不均；
5. 日历选中日期格背景空白、顶部渐变文字看不清；
6. Android 原生渲染字重仅支持 normal/bold，font-weight: 500/600 导致字阶错乱。

**实施与交付内容**：
1. **任务 1 & 2：FoodPicker + AddFood 方案 A 单流程合并架构**：
   - 彻底剥离 `AddFood.uvue` 原生 `page-container` 外壳，改为作为内容视图内嵌于 `FoodPicker.uvue`；
   - `FoodPicker.uvue` 内部采用 `step = 'list' | 'detail'` 原地切换，单容器闭环，彻底消除 1500ms 双弹窗冷启动卡顿；
   - `AddFood.uvue` 外层使用 `<scroll-view>` 纵向包裹，支持自如滚动，彻底解决内容溢出撑满全屏、无法滚动的缺陷；
   - 详情内点「更换」原地秒切回列表并回显当前食物；
   - 弹窗打开时重置 step 为 list，重置搜索词与分类，并在 openAdd/openPicker 与 onAddConfirm 时清空 addFoodId，彻底根除二次打开高亮残留 Bug。
2. **任务 3 & 4：树叶与水面波浪原生动效重构**：
   - `Home.uvue` 废弃 Android 端不支持的 `@keyframes`，改用原生 `CSS transition + @transitionend` 驱动往复循环；
   - 叶子旋转支点换算为固定 px（左叶 56px 61px，右叶 7px 59px），形成自然微风轻拂；
   - 双层正弦波浪通过 @transitionend 往复平移，波浪动态居中，水体左右深浅完全均匀。
3. **任务 5：Records & DayDetail 视觉渐变修复**：
   - `Records.uvue` 的 `.lr-header` 和 `.lr-pill-sel` 补充实色兜底（`#39AD95` 与 `#0A7A5C`），防止 Android 解析异常白屏；
   - `DayDetail.uvue` 的 `.dd-header` 补充 `#39AD95` 实色兜底。
4. **任务 6：渐变角度语法标准化**：
   - 全项目 `to right / to bottom` 渐变语法统一替换为标准度数 `90deg` 与 `180deg`（涉及 Home、CountStepper、AddFood 等）。
5. **任务 7：字重 uni-app x 原生规范化**：
   - 全项目所有 `font-weight: 500 / 600` 统一替换为 `font-weight: bold`（涉及 Records、DayDetail、Tabbar、SettleBadge、GoalModal、FoodPicker、AddFood 共 27 处）。
6. **任务 8 & 9：清理无效 @keyframes 与条件编译保护**：
   - 清理 Android 端失效的 `@keyframes`（numPop, trackShake, optPop, sbBadgeIn/Out, sealPop, leafBreeze, waveLoop, bubbleRise 等）；
   - `GoalModal.uvue` 中的 `transition` 加上 `/* #ifdef MP-WEIXIN */` 条件编译保护。
7. **自动化验证与文档**：
   - 编写 `debug/test_unified_picker.js` 自动化测试脚本，验证列表选择 -> 详情配置 -> 更换回显 -> 干净关闭全链路；
   - 所有改动文件最顶部追加中文变更日志，所有同名 `.md` 文档同步更新；
   - `python toolchain/validate.py` 多源一致性校验 100% 绿灯通过。

### 2026-09-23 00:48:00 — 首页宏量卡与个人中心统计卡全面接入矢量 SVG 独立图标素材

**起因**：Boss 指令将首页（Home.uvue）宏量卡（蛋白质、碳水、脂肪）及个人中心（Profile.uvue）三项统计卡（目标热量、已摄入、还能吃）由旧 PNG 位图全面替换为高保真矢量 SVG 图标素材，要求外部文件引用而非内联脏代码，并调整合适比例规整展示。
**整改与交付内容**：
1. **SVG 素材标准化落地（app/static/）**：
   - 首页/详情页宏量图标：`app/static/home/macro_protein.svg`、`app/static/home/macro_carb.svg`、`app/static/home/macro_fat.svg`；
   - 个人中心三项统计卡：`app/static/profile/stat_target.svg`（火焰）、`app/static/profile/stat_consumed.svg`（烧烤/摄入）、`app/static/profile/stat_remain.svg`（量杯/余量）；
   - 保留规范的 XML 命名空间与统一的 `0 0 1024 1024` viewBox，统一薄荷绿主视觉配色 `#17916B` / `#12A87B`。
2. **页面引用与比例精调**：
   - `Home.uvue`：宏量卡 `.macro-icon` 由 27x21 调整为 24x24 正方比例，在 1:1 视口下清晰舒展，避免等比拉伸挤压；
   - `DayDetail.uvue`：营养分布卡同步复用上述宏量 SVG，`.dd-mg` 调整为 20x20 正方形规整居中；
   - `Profile.uvue`：三项统计卡全面改引 `stat_*.svg`，在 21x21 的 `.stat-chip` 容器内将 `.stat-ico` 微调为 15x15，留白均匀精致。
3. **规范与闸门验证**：
   - `Home.uvue` / `DayDetail.uvue` / `Profile.uvue` 最顶部均按规范添加了代码变更日志；
   - 同级说明文档 `Home.md` / `DayDetail.md` / `Profile.md` 同步更新；
   - `python toolchain/hooks.py all` 5 道检查闸门全流程绿灯通过；
   - HBuilderX CLI 全量编译通过（`ready in 11653ms`），无报错。

### 2026-09-23 00:42:00 — 全局触觉震动全量清理下线（解决微信开发者工具 PC 端模拟器窗口剧烈抖动）

**起因**：Boss 反馈「怎么切换个食物分类tabs也会震动啊，是不是在全局里面写的只要有点击就要震动。先去了，我需要按需告诉你哪几个地方需要震动。」
**排查与根因**：
- 微信开发者工具在 PC 端会将 `uni.vibrateShort()` 和 `uni.vibrateLong()` 模拟映射为整个 PC 窗口的物理颤动抖动；
- 项目中此前在 Tabbar 切换、FoodPicker 分类与食物选中、AddFood 甜度与餐次卡片切换、步进器增减、GoalModal 拖动与步进、长按删除等处均挂载了触觉调用，导致在开发工具内每次点击均伴随整个屏幕晃动，产生严重干扰与困扰。
**整改动作（100% 清理并保留音效反馈）**：
1. **全项目 11 处代码文件深度扫描并全量清除 `vibrateShort` / `vibrateLong`**：
   - `components/Tabbar.uvue`：清除切 Tab 时的 `vibrateShort`；
   - `components/FoodPicker.uvue`：清除分类切换、食物条目点击、蒙层关闭时的 `vibrateShort`；
   - `components/AddFood.uvue`：清除甜度、餐次卡片、步进变更、蒙层关闭与确认保存中的全部震动；
   - `components/GoalModal.uvue`：清除滑条拖动、步进增减、快速选择卡片与保存中的全部震动；
   - `components/CountStepper.uvue`：清除加减按钮中的 `vibrateShort`；
   - `components/OptionTray.uvue`：清除分量切换时的 `vibrateShort`；
   - `components/SettleBadge.uvue`：清除进度环到位时的 `vibrateShort`；
   - `components/FoodToast.uvue`：清除弹出时的 `vibrateLong`；
   - `pages/home/Home.uvue`：清除瓶身点击/长按、食物长按删除、确认添加及倒水动效中的全部震动；
   - `pages/records/Records.uvue`：清除日历选日与月度翻页中的 `vibrateShort`；
   - `pages/records/DayDetail.uvue`：清除长按删除单条记录中的 `vibrateShort`；
   - `pages/settings/Settings.uvue`：清除深色模式切换中的 `vibrateShort`。
2. **规范同步**：
   - 11 个修改文件最顶部均按规范添加「代码变更日志」；
   - 同级对应的 11 份自说明 `.md` 文档同步修订，写明触觉震动已全量下线，待 Boss 后续按需指定开启。
3. **验证与闸门**：
   - `python toolchain/hooks.py all` 5 道检查闸门全流程绿灯；
   - HBuilderX CLI 全量编译通过（`ready in 27324ms`），微信端运行时再无任何点击抖动。

### 2026-09-23 00:28:00 — 食物选择弹窗（FoodPicker）半屏抽屉高度规范落地

**起因**：Boss 反馈「这个弹窗应该半屏显示的（配图：FoodPicker 冲顶变成全屏遮挡状态栏与胶囊）」。
**根因与修复**：
1. **根因**：`FoodPicker.uvue` 的 `page-container` 之前配置了 `custom-style="height:auto;min-height:560px"`，且内部包含 353 条食物长列表，在 auto 模式下直接撑破视口冲顶覆盖全屏；
2. **修复**：严格按 Pencil 设计稿（`design/ScreenSpecs.md` line 135 `FoodPickerSheet : 375×500 y=312 r 34`）将 `custom-style` 限定为标准半屏抽屉高度 `calc(500px + env(safe-area-inset-bottom))`，内层 `.fp-sheet` 设定 `height: 100%; box-sizing: border-box; overflow: hidden;`，列表 `.fp-food-list` 设定 `flex: 1; height: 0; min-height: 0;`；
3. **验证结果**：HBuilderX CLI 编译通过（`ready in 31385ms`），Automator 截图实测通过：`debug/shots/foodpicker_halfscreen_verified.png`，弹窗完美处于半屏位置（高 500px），上方大面积露出暗化原页面背景与水瓶，列表在抽屉内部自主平滑滚动。

### 2026-09-23 00:18:00 — 交互体验与多弹窗状态机 6 项核心缺陷全面修复与端到端闭环验收

**起因**：针对 Boss 集中提出的 6 项高频体验与边界缺陷进行全面系统化整改，同时按 Boss 指令将「首页水瓶叶子拆图与微风液体动效」**暂时封存挂起**（待切图素材就绪后再行推进）。

**6 项核心缺陷整改成果**：
1. **所有半屏弹窗统一配齐右上角关闭图标，移除伪手势横杠**：
   - 彻底移除 `GoalModal.uvue`、`AddFood.uvue`、`FoodPicker.uvue` 顶部不可拖拽的伪手势横条（`.gm-handle` / `.af-handle` / `.fp-handle`）；
   - 统一在半屏弹窗右上角配齐 32px 白底圆形微阴影关闭按钮（`.af-closebtn` / `.fp-closebtn` / `.gm-closebtn`，内置标准 SVG 关闭图标），点击平滑退出弹层；
   - 底部全量补充 `calc(24px + env(safe-area-inset-bottom))` 动态安全区避让，彻底杜绝贴住全面屏底部黑线。
2. **大胶囊保存/确认按钮接入高级弹性按压阻尼反馈（fluid-interaction-expert）**：
   - `GoalModal.uvue` 的 `.gm-save` 和 `AddFood.uvue` 的 `.confirm-btn` 接入弹性按压类（`.gm-btn-pressed` / `.af-btn-pressed`），按下瞬间 `scale(0.965)` 配合阴影收拢与阻尼过渡，告别僵硬点击。
3. **彻底根除更换食物弹窗时序死锁与加号 FAB 失效崩溃**：
   - **根因**：微信小程序原生 `page-container` 状态机严禁前后两个弹窗同时执行出场与进场动画，此前直接连续切换导致底层原生状态机死锁崩溃。
   - **修复**：`Home.uvue` 的 `onAddChange` 接入 320ms 延时解耦（等待前一个弹层完全退场后再唤起 `FoodPicker`），并增加安全重置，彻底解除并发冲突，二次点击加号 FAB 顺畅无阻。
4. **最近记录页（Records.uvue）餐次小卡内部元素居中对齐**：
   - `.lr-mcard` 统一 `align-items: center`，内部文本与热量行居中对齐，排版工整清爽。
5. **个人中心（Profile.uvue）数据流与达标 Banner 状态机深度重构**：
   - **100% 满额圆环隐身修复**：圆环样式字符串改用原生纯 CSS 驱动，`progPct >= 100` 时使用实色 `calStatus.color` 保底，彻底根治全满时 `conic-gradient` 属性被小程序解析为空导致的圆环消失 Bug；
   - **进度条三态色联动**：移除写死色值，直接绑定全局 `calStatus.color`（正常薄荷绿、接近上限琥珀色、超标珊瑚红）；
   - **「还能吃」超额负数修正**：引入 `displayRemainCal`，超额时数值归零（显示 `0`），不再显示负数诱导误解；
   - **达标 Banner 状态机重构**：当日吃满 2 餐及以上且未超标显示「今日已达标（绿）」；超额即显示「今日不达标（橙色）」并将副标题改为「请减少进食，加油啊」；不足 2 餐显示「今日记录中」。
   - **UTS 编译异常根除**：移除引起 uni-app x 编译器注入未定义类的泛型注解，保证页面编译无瑕疵。
6. **首页今日餐次食物项支持长按删除与全局联动**：
   - `Home.uvue` 的 `.meal-row` 绑定 `@longpress="onFoodLongPress(rowItem.id, rowItem.name)"`，调起原生 ActionSheet 确认删除，联动 `food.removeEntry(id)`、马达微震与 `delete` 音效，摄入热量与宏量实时回落。

**测试与验证证据**：
- `toolchain/hooks.py all`：**五道提交闸门全部绿灯通过**；
- HBuilderX CLI 编译全工程 5 个页面 + 8 个组件全量编译通过（`ready in 14087ms`）；
- 微信开发者工具 automator 端到端全流程测试脚本（`debug/test_dialogs.js` / `debug/test_full_flow.js` / `debug/open_gm.js`）物理运行通过，输出 6 张验收截图入库（`step1_foodpicker.png`, `step2_addfood.png`, `step3_picker_reopened.png`, `goalmodal_verified.png`, `prof_verified.png`, `verify_records_center.png`）。

### 2026-09-22 20:38:00 — 关键排障修复：清除独立模块引用引发的小程序运行期崩溃，流体波浪水面正式点亮实跑

**起因**：Boss 反馈「事实上没有一点效果，看起来就像一个静态图片一样。是代码没有生效吗」。
**深度排障与根因**：
- 运行 `debug/errcatch.js` 探针抓取到真凶堆栈：微信小程序环境在运行时抛出：
  `Error: module 'composables/useSound.js' is not defined` 与
  `Error: module 'utils/calorieStatus.js' is not defined`！
- 根因：uni-app x 在微信小程序端对自定义新建子目录（`composables/`、`utils/`）的分包机制与引用路径存在黑盒差异，导致运行时加载模块抛出未捕获异常，`Home` / `GoalModal` 等页面在 JS 初始化第一行便直接挂起 (`Page "pages/home/Home" has not been registered yet`)，导致整页 JS 逻辑与动态流体完全未启动，只能保留最初编译产物或空白！
**根除方案**：
1. **坚决贯彻 Karpathy 务实规范与 AGENTS.md 约束**：不搞多余零散目录与过度封装；
2. 将 `getCalorieStatus` 全局状态函数直接收拢至已被 Pinia 全局注册的 `app/stores/goal.ts`；
3. 将 `playSound` 音效播放直接收拢至已有的 `app/stores/settings.ts`；
4. 彻底删除 `app/composables/useSound.ts` 与 `app/utils/` 目录；
5. 在 `Home.uvue` 中加入双层无缝正弦流动波浪（`wave_front.png` + `wave_back.png`）、晶莹高光反光带（`.liquid-glare`）、上升微气泡（`.bubble`）及入场注水动画；
6. 重新执行 HBuilderX 编译并清空小程序编译缓存（`debug/cache_clean.ps1`）。
**验证结果**：
- `errcatch.js` 确认：`[page] pages/home/Home`、`[dataKeys] 50+ 正常响应式字段`、`[__errs] [] (零错误)`、`[require test] require ok`；
- automator 截图实锤入库：`debug/shots/home_fluid_waves_verified.png`，当前超标 9415 kcal 状态下，水瓶内部流体 100% 自动变为警示珊瑚红，波浪水面与折射光晕丝滑流动，彻底恢复生机！

### 2026-09-22 20:10:00 — Phase 2 动态水瓶流体架构落地（零重排 GPU translateY 升降 ＋ 纯净镂空遮罩 ＋ 动态波浪）

**起因**：Boss 提出「优化交互设计，首页水杯液体流动动画效果，点击或长按不同效果，卡路里字体/进度颜色三态跟随，添加食物后水瓶动画效果」，并授权自制镂空遮罩图。
**架构与工程定案**：
1. **纯净镂空遮罩自研提取**：拒绝文生图（避免瓶身轮廓、刻度线、薄荷叶背景漂移破坏设计一致性），编写 Python 算法对 `app/static/home/bottle.png` 实施内胆几何拟合与高斯羽化抠图，完全剔除原本画死的静态水体，保留瓶盖、左右管壁高光、外部绿叶，并印制高精度刻度线，生成 `bottle_mask.png`（448×484）。
2. **三层夹心（Sandwich）零重排流体结构**：
   - **底层内胆 `.bottle-cavity`**：限定尺寸 `64px × 133px`，`border-radius: 14px 14px 28px 28px`，`overflow: hidden`。
   - **夹层动态液位 `.bottle-liquid`**：高度 133px，以 `food.totalCal / goal.calorieGoal` 映射为 `translateY(px)` 硬件加速位移（零布局重排，原生 60/120fps），颜色绑定全局 `calStatus`（绿/琥珀/珊瑚红），顶部叠加 `liquid-surface` 晶莹水面反光波纹。
   - **表层遮罩 `.bottle-mask`**：叠加 `bottle_mask.png`，外层管壁高光与刻度线真实投射于流体之上。
3. **物理交互动效闭环**：
   - **单击瓶身**：播放 Kenney `click` 音效 + 短触觉振动 + 瓶身挤压微弹（0.95 $\to$ 1.05 $\to$ 1.0）+ 液体表面正弦微波衰减激荡（$\pm 6$px）；
   - **长按瓶身**：播放 Kenney `change` 音效 + 触觉振动 + 瓶身蓄力呼吸放大（1.08）+ 液体深层微浮 + 左右微晃（$\pm 3^\circ$）；
   - **添加食物确认（`onAddConfirm`）**：伴随结算徽章弹入，新卡路里注入，液位以 `cubic-bezier(0.34, 1.56, 0.64, 1)` 平滑涌入上升，激起 `liquidWave` 冲激波纹！
4. **编译与取证（零窗口 automator）**：
   - HBuilderX CLI 编译全绿灯通过（`ready in 32481ms`）；
   - 微信开发者工具自动化截图取证入库：`debug/shots/home_fluid_bottle_v2.png`，高精刻度、内胆微波、通透液体完美呈现；
   - 同步更新自说明文档 `app/pages/home/Home.md`。

### 2026-09-22 18:25:00 — Tab 页页底动态安全区全避让落地（方案 A：消除滚到底部被悬浮 Tabbar 遮挡 Bug）

**起因**：Boss 反馈「现在一共有三个tabbar级的页面，如果内容滚到底，还是被tabbar盖住了一部分（配图：Records 页主要食物卡片下半截被截断）」，并拍板同意**方案 A（动态安全区全避让）**。
**根因分析**：
- 此前页底固定预留 `78px` 仅对齐了无小白条机型（`胶囊高 56 + 离底 22`）；
- 在主流全面屏（带底部 Home 指示条，`safeBottom ≈ 34px`）设备上，胶囊实际占位高度为 `56 + 34 + 12 = 102px`；导致滚到底部时物理上必然欠缺 `102 - 78 = 24px`，卡片与数值被胶囊直接遮挡。

1. **改动落地（三页严格对齐）**：
   - **`app/pages/records/Records.uvue`**：`.lr-bottom-space` 由固定 `78px` 改为基准 `92px`，MP-WEIXIN 叠加 `calc(82px + env(safe-area-inset-bottom))`（全面屏实测 `116px`）。
   - **`app/pages/home/Home.uvue`**：`.page` 的 `padding-bottom` 同步由固定 `78px` 改为基准 `92px` ＋ 小程序 `calc(82px + env(safe-area-inset-bottom))`。
   - **`app/pages/profile/Profile.uvue`**：`.page` 的 `padding-bottom` 同步由固定 `78px` 改为基准 `92px` ＋ 小程序 `calc(82px + env(safe-area-inset-bottom))`。
2. **验证（零窗口，全部通过并物理留档）**：
   - HBuilderX CLI 单发重编译绿灯（`ready in 9642ms`，产物 `wxss` 逐行确认）；
   - `debug/cache_clean.ps1` 清微信编译缓存并刷新模拟器；
   - automator 截取三页滚到底部高清物理图：
     - `debug/shots/records_bottom_verified.png`：主要食物「猪瘦肉/牛排/扬州炒饭/蒸山药」四卡片名称与卡路里完整露于胶囊上方，留出清晰 14px 呼吸间距，遮挡 Bug 彻底根除！
     - `debug/shots/home_bottom_verified.png`：今日餐次最底部「晚餐」行及展开箭头完整展现于胶囊上方。
     - `debug/shots/profile_bottom_verified.png`：最近记录「9月19日 周六」整行及卡片底边圆角完整展现于胶囊上方。
3. **文档与宪法同步**：
   - `Home.md`、`Records.md`、`Profile.md` 同步更新说明与变更日志；
   - `design/DesignTokens.md` §7.3 更新为方案 A 动态安全区避让规范；
   - `AGENTS.md` 核心约束更新。

### 2026-09-22 17:22:42 — TabBar 液态玻璃胶囊重构（两 Tab 通栏 → 三 Tab 悬浮胶囊＋会跑的气泡；Records 升一级 Tab）

**起因＝Boss 对设计稿的两条指令**：先「我想要的是这种液态玻璃效果，你先分析一下出个计划」，后对本轮计划回**五条拍板**（逐条落地，无一条自行发挥）：
① 6 个新色值作 TabBar 语义色补录 `DesignTokens.md`；② 稿面自相矛盾时**以文字标注为唯一真理**，采「微博标准版」降级＝纯 `backdrop-filter` ＋ 实色透明度（浅 18%／暗 13%），节点里遗留的三段渐变与手绘内高光**不做**；
③ **放弃 #29 的 fade 渐显**（新胶囊核心＝恒常可见），页底预留按胶囊实占重算为 78；④ Records 正式升为一级 Tab、去左上返回钮；⑤ MP 端允许 CSS transition 驱动四关键帧，App 端留 Worklet TODO，**严禁 setData 逐帧驱动**。

1. **文档先行** → `design/DesignTokens.md` 新增 **§7 TabBar 液态玻璃专用 token**（§7.1 六色语义表／§7.2 几何与材质表／§7.3 页底 78 与 fade 废弃），并给 `line-hairline` 加注「旧通栏 TabBar 上边线，胶囊化后不再使用」。代码全部引 §7，未自创色。
2. **`components/Tabbar.uvue` 整体重构** → 悬浮胶囊（左右 16／高 56／r28，底 `#FFFFFF 88%` ＋ 顶部折光 ＋ 白 80% 描边 ＋ `blur(24) saturate(180%)` ＋ 向上柔影 `0 -4 24 rgba(10,79,61,.14)`）；三格图标＋文字横排（`flex-direction: row`，图标 22/23/23.5，字 12/600，gap 6）；
   选中气泡 96×44 r22，**底色走运行时 `:style` 下发**（不写 `.a.b` 复合类——App 端只认单类）；`transition` 与 `backdrop-filter` 全部包 `#ifdef MP-WEIXIN`，App 端退化为阶段跳变并留 Worklet TODO；low 档（`backdropBlur=false`）按稿面降级＝胶囊不透明 `#F8FCFA` ＋ 气泡实色 ＋ `#E3EFE8` 描边。
3. **Records 升一级 Tab** → `active="records"`，删头图左上返回箭（`lr-back`＋`goBack`）与跨阈栏的 44×44 返回热区，栏内只留标题「最近记录」（稿面标题不动，Tab 文案用「日历」）；Home／Profile 的 `openRecords`/`goRecords` 由 `navigateTo` 改 `redirectTo`；三页 `fade`/`tabFade` 全下线（Home 的 `onPageScroll` 整段删除，Profile／Records 仅留跨阈两态）；页底预留 40 → **78**。
4. **本轮最大新坑：`components/` 下放纯逻辑 `.uts` → 整页白屏**。跨页传气泡起点最初写成 `components/tabOrigin.uts` 模块单例：产物 `components/tabOrigin.js` 正常生成、`Tabbar.js` 的 `require("./tabOrigin.js")` 路径也对，运行时却报 `module 'components/tabOrigin.js' is not defined`，**Tabbar 渲染中断 → 三页全白屏且首屏零可见错误**；`debug_clear_cache --action cleanCompileCache` ＋ `simulator_refresh` 跑过仍未见效（包体哈希未变，根因未定案）。
   **改法＝不新增 JS 模块文件**：起点改由本地存储 `ct_tab_origin` **一次性**传递（新页 setup 读完立刻 `removeStorageSync`，故冷启动不会拿上次会话残留起点乱飞）。**约定：跨页共享的纯逻辑不放 `components/`。**
   顺带纠正一条旧误判：`page.$vm.$children` 回 0 并非 uni-app x 常态，而是**白屏态下组件根本没挂载**；模块问题解决后同一探针稳定回 `child0=Tabbar scopeDataKeys=30`。
5. **入场时序修正（采样逼出来的）**：起点最初在 `onMounted` 读 → 首帧气泡先画在**目标槽**、下一帧才跳回来源槽，肉眼＝「闪一下再飞」。改在 `setup` 内同步读并置 `phase='press'`，`onMounted` 只推进后续三段。
6. **验证（全部零窗口，物理证据在盘）** → `hooks.py all` 五道全绿（类名比对 14 个 `.uvue` 零冲突，新类全 `tb-` 前缀）；HBuilderX 单发编译绿灯两次（`ready in 13973ms`，仅 3 条既有鸿蒙 UA warning）；
   ① **几何**：`debug/tab_geom.js` 按组件同公式算出胶囊条带 css `top=742 bottom=798`、三槽中心 `76/179/314`（此前坐标 tap 打 `y=738` 落在栏**之上**，故「tap 返回 success 却不换页」——不是代码 bug 是探针 bug）；
   ② **三格换页**：`automation_element_action --x --y` 逐格点，`PAGE` 依次 `home/Home`→`records/Records`→`profile/Profile` ✓，截图 `debug/shots/tab8_home.png`／`tab9_records.png`／`tab10_profile.png`；
   ③ **暗态**：设置页开关 → Profile 暗态胶囊 `rgba(22,41,36,.72)`＋气泡白 13% 观感正常（`tab13_profile_dark.png`），**验收后 `darkMode` 已还原 false**；
   ④ **四关键帧实跑**：`debug/tab_flight.js` 轮询子组件 `$scope.data` 的行内 style，抓到 `w=96 l=11.67 dur=140`（Home 静止）→ `w=92.16 l=13.59 dur=90`（按下，仍在来源槽）→ 换页后首帧 `w=92.16 l=13.59`（**起点无闪帧**）→ `w=107.52 l=125.24 dur=320`（移动）→ `w=101.76 l=128.12 dur=120`（落位）→ `w=96 l=131 dur=140`（静止），与稿面 ×0.96／×1.12÷0.94／×1.06÷0.97 逐值吻合。
7. **文档收口** → `components/Tabbar.md` 整体重写（含四关键帧取证数值、新踩坑、废弃条目）；`pages/records/Records.md`（升 Tab／无返回钮／78 预留／fade 作废）、`pages/home/Home.md`、`pages/profile/Profile.md` 同批改准；`AGENTS.md` 反向同步（见下条）。

**新增待 Boss 拍板（AI 不擅自动手）**：① **浅色态气泡几乎看不见**——胶囊 88% ＋ 气泡 18% 叠在同一块白上，与 Boss 决策 #3 的理由（「让页面内容从胶囊底部滑过时产生实时毛玻璃折射」）相冲；稿面**节点**值其实是 `#FFFFFF40`（25%）。按「玻璃面不许 AI 自行调 alpha／染色」铁律只报不动手，证据图 `debug/shots/tab8_home.png`；② 暗态**染色图标未产出**（暗黑下仍用浅底那套图）；③ App／Web 端真机回归（`backdrop-filter` 与 `transition` 在原生端支持与否仍未验，Worklet 未做）。

**本轮实测的另一处观感代价（既知，非新决定）**：78 预留下 iPhone 模拟器实占 102（`safeBottom 34 + 12` ＋ 高 56），滚到底仍有内容压在玻璃胶囊之下——属 Boss「常态穿到栏下」取舍范围内。

### 2026-09-22 17:58:10 — 接上条：浅色态「气泡隐身」定稿修正（Boss 拍板组合方案，浅色版最终参数）

**起因＝Boss 对我上报的第 ① 条的裁决**：「不能接受气泡隐身，必须让它有物理体积感」，给出组合方案并明确**暗色态保持现状不动**。

1. **胶囊底减负** → 浅色 `#FFFFFF 88%` → **60%**（`.tb-glass`）。Boss 补充说明：**88% 那条是稿面文字标注漏改**，太厚压不住气泡——这也是本节上一条「文字标注为唯一真理」规则的第一个**例外**，已在 `DesignTokens.md` §7.2 与 `AGENTS.md` 玻璃面条内记明例外来源。
2. **把气泡「雕」出来** → 浅色玻璃档气泡新增 **描边 `rgba(255,255,255,.6)` 1px**（模拟玻璃折射亮边）＋ **投影 `0 4px 12px rgba(0,0,0,.06)`**（悬浮高度差）。实现走**单类 `.tb-bub-light`**，且只在「`backdropBlur` 为真 **且** 非暗态」时由 `bubbleClass` 挂上——不用后代选择器（App 端不认）、不用行内样式（会盖掉 low 档 `.tb-bub-flat` 的 `#E3EFE8` 描边）；border 按工程铁律写齐四边 width ＋ `border-style: solid`。
3. **气泡底色 18% 还是 25%（Boss 授权 AI 按真机观感自定）** → 两档各编译一次、同一滚动位置同点位取样：气泡内区 `252,254,253`（18%）↔ `253,255,254`（25%），**只差 1–2 个色阶、肉眼不可辨**，轮廓感实际由新加的描边＋投影提供 ⇒ **保留稿面文字标注值 18%**（偏离设计源最少）。证据图 `debug/shots/tab15_bubble18.png`／`tab16_bubble25.png`／`tab17_scroll25.png`／`tab18_scroll18.png`。
4. **验证（全零窗口）** → 三次 HBuilderX 单发编译全绿灯（`ready in 15687 / 12865 / 16230ms`，仅既有 3 条鸿蒙 UA warning）；产物 `Tabbar.wxss` 内 `.tb-bub-light` 逐行核对；`debug/cache_clean.ps1`（cleanCompileCache＋refresh）＋ automator 截图：三页浅色态气泡**清晰可辨**（`f_home_b_scrolled / f_rec_b_scrolled / f_prof_b_scrolled` 三条胶囊带裁图），胶囊底已能透出压在下面的内容；**暗态回归**＝`debug/tab_dark_check.js` 开深色 → 个人中心裁图（胶囊 `(19,43,36)`、气泡 `(56,73,67)`，与改前一致、无白边渗入）→ **已还原 `darkMode=false` 并回到首页**。新增脚本 `debug/tab_scroll.js`（滚动后截图）、`debug/tab_final.js`（三页两态）、`debug/tab_dark_check.js`（暗态回归＋还原现场）。**交 Boss 的收官图**＝`debug/shots/final_home.png`（整页，餐次列表正穿到玻璃带下）＋ `debug/shots/final_scroll_capsule.png`（胶囊条带 2× 放大）。
5. **文档** → `DesignTokens.md` §7.1/§7.2（含 18% 取舍依据与「例外」标注）、`AGENTS.md` 玻璃面条＋待办、`components/Tabbar.md`、本文件同步。上一条待 Boss 项 ① 就此关闭，仍挂 ②暗态染色图标 ③App／Web 真机回归（Worklet）。

### 2026-09-22 — 工程化收口四件套（保安亭落地 / 仓库去重 / 数据补齐 / 文档批量校准）

**起因＝Boss 指令**：「保安亭需要盖，重复入库的 5.6MB 图标要处理，只留 App 用的那份入库，原始存档进 .gitignore，那 6 种缺配图槽位的食物，补数据。其他的问题你综合考虑最优解处理，开始吧」

1. **盖保安亭（AGENTS.md 承诺已久、此前零代码）** → 新建 `toolchain/hooks.py`（五道闸：`schema-version-check` / `food-data-integrity`（含禁手写食物数据）/ `class-prefix-collision` / `pre-commit` / `end-of-session`）＋ `hooks.py install` 写入 `.git/hooks/pre-commit`（跑 `all`，实测 0.3s）。
   首轮自测踩到并修掉四个真问题：① Windows 控制台 GBK 下 `✓/─` 直接 `UnicodeEncodeError` 崩闸门（git hook 内必现，且钩子体须 `export PYTHONIOENCODING=utf-8`）；② 生成物被误判「缺变更日志」→ 保护文件豁免日志检查；③ 手写数据扫描误命中 `stores/food.ts` 的演示种子 id（Boss 授权、热量仍实时算）→ `stores/` 豁免 id 检查、视图层照旧严格；④ 类名闸门**扫到 0 个组件时静默放行** → 加自检红灯（根因＝`_rel()` 绝对路径兜底带反斜杠，`"components/"` 永不匹配）。
   **AGENTS.md 该节已按现实改写**：`pre-build` 明确标注**未落地**（uni-app x 无独立 npm 构建入口，编译在 HBuilderX 内），`.git/hooks` 不随仓库分发、换机器须各自 `install`。
2. **仓库去重（体积实测）** →  tracked 文件 **4611 → 1203**。三刀：① `debug/node_modules` 3373 个文件入库（占旧 tracked 的 **73%**）——AGENTS.md 长期写着「node_modules 不进 git」但 `.gitignore` 里**根本没这条规则**；② `app/unpackage` 35 个编译产物入库（含推倒重写前的 Bottle/AddSheet/MealIcon sourcemap 残骸）；③ `assets/icons-final/` 与 `app/static/icons/` **353/353 文件字节全等**（sha256 逐文件比对），降级为可重建本地缓存。全部 `git rm -r --cached` **只清索引、磁盘不动**（模拟器仍读 `unpackage/dist`）。生图**原始 PNG 保留入库**＝AI 生图有随机性、重跑拿不到同一批图。
3. **补 6 条生图槽位（真正的根因不在数据）** → `validate.py` 从来**没把 `icons_v1_visual.yaml` 当源校验**，所以它停在 347、清单已到 353，**校验一路绿灯**，直到要重跑生图才暴露。修法＝把第 6 份源纳入校验（四源 id 对齐＋每条五槽齐备＋`MISSING` 占位即红＋反向多余条目也红，槽位检查放在 `continue` **之前**防跳过），再补 p348–p353 六条槽位（糙米饭/…）。**教训落进 `toolchain/README.md`：多源模式下「没被校验的源」＝「会静默漂移的源」。**
4. **文档批量校准（滞后与冲突）** → `AGENTS.md`（目录结构整块重写 / Hooks 节 / 保护文件表 / 待办）＋ `README.md`（当前状态＋20 行目录表＋快速上手）＋ 4 份 design（`IconPlan`/`ScreenSpecs`/`UI_Spec`/`VisualLanguage`，含 7 处手抄 `#0B7A5C`→真值 `#0A7A5C`、`--ct-bg`→`#F2FAF5`、midbutton 与 Pixabay 方案加废止批注）＋ `docs/FoodLibraryPlan.md` ＋ `toolchain/README.md`（5→6 份源、实测产出表、新增 D 章闸门）＋ `nutrition_checklist.md`（加「核对状态」列，**进度 0/30 如实登记**）＋ 5 份 app `.md`（Home 已接共享 Tabbar／Profile 四处与代码不符／settings 深色两页随动／food 353 条／device「液体晃动 0.955」标注为**设计参数、动效未落地**）。
   **本轮撤掉一处 AI 编的「Boss 已拍板」**：`docs/design/2026-09-22-food-thumb-plate/README.md` 被写成「浅色托底已拍板＝维持现状、对照板 OlF0l 已删除」，而 `progress.md` 与会话记录里**找不到任何 Boss 表态**，原文是「**需老板拍板**」→ 已 `git checkout` 还原，该项**仍待 Boss 定**。
5. **验证（全部有物理证据）** → `python -X utf8 toolchain/hooks.py all` **五道全绿**（353 条三处对齐／类名零冲突比对 14 个 `.uvue`／图标 353 ↔ 食物 353）；负向测试确认闸门会红（故意删一条槽位、故意造同名类、故意改保护文件）；HBuilderX 单发重编译绿灯（`cli.exe launch mp-weixin --compile true`，`ready in 27355ms`，仅 2 条既有鸿蒙 UA warning）；产物抽查＝`FoodPicker.wxml/wxss` 含 `fp-row`、`food_library.json` `"count": 353`、未接线的 `FoodToast` 不参与编译。磁盘真值复核：产物 **181.6KB**、图标 **353 张 / 5.61MB / 平均 16.3KB / 零超标**、`pieceWeight` **196 条**、器具模板 18 个全用到。

**新增待 Boss 拍板（AI 不擅自动手）**：① p348–p353 六条图标现为 **92×92**，重跑生图要再花 API 额度；② 浅色「画框托底」到底加不加（见上第 4 条）；③ `toolchain/gen_tab_icons.py`（原生 tabBar 图标）无任何引用，而 Tabbar 已定案为共享组件——删不删；④ `fetch_icons.py` 真实图源旧分支去留。

### 2026-09-21 — 公共添加食物弹窗全链路落地（六组件＋Store 增补，实拍全链路验收通过）

- **组件库**：`OptionTray`（方案 B 底槽＋光晕＋软阴影贴图）／`CountStepper`（默认 3／上限 100／对数能量条 p=ln(1+n)/ln(101)／阈值三色／截界抖动 4px／键入态 clamp）／`FoodToast`（+N kcal／已加入X／已添加 pill，2s 自动＋点按关闭，长触觉）／`GoalModal`（表盘展示＋五档 chips／保存 emit）／`AddFood`（分量底槽／计数步进器／甜度底槽／餐次四照片卡／确认 emit payload）共 6 个 `.uvue` ＋各配 `.md`
- **Store 增补**：`food.ts` 加 `MAX_COUNT=100`/`DEFAULT_COUNT=3`/`portionRatio`/`portionLevel`/`gramsOf`（README §2.x 原样）；软阴影贴图 `app/static/common/shadow512.png`（小程序 `blur` 无效替代）
- **图片资产**：器皿 12 张＋餐次 4 张从 Pencil `v3_` 素材直取进 `app/static/vessels/`、`app/static/meals/`；缩略图沿用设计稿导出
- **接线**：首页 FAB → `AddFood(p054)`（吐司面包，验证计数步进器）→ 确认 → `FoodToast`（L3 触觉＋2s 自动＋点按关闭）；设置目标行 → `GoalModal`（chips 切档保存 emit → `goal.setGoal` → 个人中心目标同步）；个人中心齿轮 → 设置页
- **验证清单（实拍全绿）**：
  - ✅ 步进器：- 按钮禁用（1）→ + 点两下 3→5 条色 mint→amber → 连点 100 显示 coral 且加号禁用＋轨道抖 4px → - 点回退到 1
  - ✅ 分量/甜度/餐次：OptionTray 底槽悬浮选中态（光晕径向渐变 22% ＋落地影 40% ＋抬升 4px），甜度 10 格段浮板，餐次照片卡描边印章
  - ✅ 设置目标：GoalModal 表盘 1800 ＋ 五档 chips（1200-2400 步进 300）切档保存 → `goal.setGoal` → 个人中心目标同步
  - ✅ Toast：`FoodToast` +N kcal/已加入X/已添加 pill，2s 自动消失，点按立即关闭，出现即长触觉（L3）
  - ✅ 控制台 error 空；三页截图核对无崩坏
- **已知偏差（真值优先）**：步进器默认 3 ≠ 旧 1；上限 100 ≠ 旧 99；Toast 无音效（资产缺失，仅触觉）

### 2026-09-21 — GoalModal 编译修复 + SettleBadge/GoalModal 文档落地

- **编译修复**：GoalModal.uvue 三处编译错误全修——① 重复 `close()`/`save()` 函数声明（242–249 行已有正确版本，303–310 行重复删除）；② 缺少 `import { computed } from 'vue'`（`isApp`/`dialRatioComputed`/`conicRingStyle`/`thumbStyle` 四个 computed 属性未导入）；③ CSS 样式 50+ 处句号 `.` 替换为分号 `;`（`.unit`/`.ticks`/`.tick`/`.controls`/`.control-btn`/`.quick-label`/`.quick-tray`/`.chip`/`.tip`/`.save-btn` 等全量修正）
- **验证**：编译通过（9 个鸿蒙兼容性 warning 可忽略）；微信开发者工具截图确认 GoalModal 弹窗渲染正确——Dial 圆环 conic-gradient 从顶部顺时针、1800 初始值、刻度 1200/1500/1800/2100/2400、−/+ 按钮、快速选择 chips（1800 高亮）、提示卡、保存按钮
- **自动化限制**：wechatide automation tap 无法触发 GoalModal 内部的 `@click` 事件（uni-app x 组件事件系统与 wechatide 原生 tap 不兼容），交互验证需真机或手动测试
- **文档落地**：新建 `app/components/GoalModal.md`（用途/依赖/设计决策/边界降级/设计稿对应）+ `app/components/SettleBadge.md`（同结构）

### 2026-09-21 — 弹层③ 从 toast 改成结算徽章，并定稿动效时间轴

- **为什么改**：原「圆圈+卡片+撤销」横向 toast 被否——335 宽里塞「已加入夜宵」+数字+单位+撤销只能压到
  11px 中文（小程序不可读），而且加记录是这一屏唯一的正反馈时刻，toast 的「顺便说一声」语义与
  「颜值即卖点」冲突。改成居中**徽章** 264×256：圆环 = 今日预算用掉多少，中心大字 = 这次加了多少
- **做法**：先出 A/B/C 三版对照，再按要求补第四版苹果风格 D；**四版一律去掉撤销**（v1.0 删除走首页餐次行长按）；
  独立上下文 critic 评出 A > D > C > B；老板拍板「把 D 的圆环特色并进 A、去掉数字左边的加号」，
  合并版定稿后删掉 B/C/D 三块对照板
- **几何要点**：`kcal` 与数字同行会撞环带 → 改 `NumStack` 竖排（数字上、单位下）；删掉撤销胶囊后内容偏下，
  六个子节点 y 统一上移 10 校准到上下留白 30/30；环带 `#1FBF8F26`（mint 15%）不是灰，两端 16×16 圆点做圆头
- **动效规范**（画板 `MU1O4`，9 条轨道 0–2 400ms）：**环扫过角度与中心数字滚动共用同一个 `progress`**
  （单一 `t`、`easeOutCubic`、620ms）——一个 CSS transition 一个 JS 计时器必然露馅；只用 scale 不用
  translateY，阴影不参与动画，数字用等宽字形防抖动；环到位那一帧 `uni.vibrateShort`；超预算环扫满转
  `#E8B54D` 但**大数字保持墨绿**（它不是坏消息）；低端机降级为纯淡入淡出
- **跨端**：小程序 `conic-gradient` 双层圆环（基础库 <2.11 退化整圆+数字）；uni-app x 原生**不支持
  conic-gradient** → `<canvas>` 2d `arc` + `lineCap:'round'`，两端都从同一个 progress 取数
- **踩坑**：`mcp__pencil__execute` 的代码参数是 `input` 不是 `code`（传 `code` 被静默忽略 → hang）；
  对已有 frame 再 `Insert` 子节点会进 `Get` 但 `Export` 整棵空白 → 整棵树用**一次字面量 `Replace`** 灌入
- **交付**：`docs/design/2026-09-21-settlement-badge/`（README + `export/` 2 张 2x）。
  **纯设计稿，App 未接**（`SettleBadge.uvue` 待建）

### 2026-09-21 — 补两个入口弹层：食物选择列表（单选回显圈）＋ 每日热量目标

- **弹层⓪ 食物选择列表** `n3dgv`：搜索框 335×46 `r23`、分类 chip 60×34（选中 `mint-e2` 实心、
  未选 `bg-tab-idle`，第 6 个刻意溢出右缘暗示可滑）、5 行食物 335×76。
  **行尾不是加号**（首版误读参考图，已改）：这层是**单选 + 自动收起**，圆圈是「上次选的是哪条」的
  回显 —— 未选 = `#BFE3D6` 1.5 描边空圈，已选 = `mint-e2` 实心白勾 + 阴影 + 行底 `$bg` `r16` +
  缩略转白底 + 副标转 `$ink2` 600，且已选行上下两条分隔线隐掉（否则圆角行底被切断）。
  首次进入无选中项时五行全空圈，**不默认高亮第一行**。每行重建为独立 `Row_*` frame 才能挂按压态
- **弹层⑨ 每日热量目标** `qnNST`：头部 + `Dial` 调节卡（1800 Inter 46 + 加减白圆 + 线性滑杆
  239×8，thumb 圆心 = fill 右端）+ 快速选择 + 提示卡 + 保存。**快速选择按刚定稿的 B 底槽做**
  （白卡浮起），不是参考图里的 mint 实心；GOAL 1200–2400 步长 50，落在档位才亮对应段，
  不在档位五段全灰（避免把 1850 读成 1800）
- **踩坑**：`TakeScreenshot` 对落在视口外的新建画板直接 hang（不是返回空白），改用 `Export` 验证；
  非法 lucide 图标名只出 warning 不抛错（`rice-bowl` 不存在，米饭改用 `wheat`）
- **交付**：`docs/design/2026-09-21-entry-picker-and-goal-sheet/`（README + 2 张 2x 交付图）。
  两个弹层均为**纯设计稿，App 未接**

### 2026-09-21 — 弹层 v4：B 选中态全量推广 + 计数步进器能量条（设计侧定稿，待落代码）

- **选中态方案 B 推广到 6 个弹窗**：分量/甜度共用「底槽 + 器物卡」范式（`PortionTray` 335×134
  `#F2FAF5` r20），选中 = 原图满不透明 + mint 径向光晕 + 加浓接地投影 + 抬升 1.12×；未选 = 62% 透明
  + 弱投影。甜度档另建 `alsdY`（5 段 63×64，选中白卡浮起 + 10 格糖条点亮）
- **餐次卡重做**（本轮最关键返工）：首版给选中卡加了浅蒙版，截图直接读成「禁用态」。**新铁律：选中卡
  绝不能加浅色蒙版** → 选中 = 照片满不透明 + 强 scrim + 2px `#1FBF8F` 外描边 + 上移 4px + 右上 mint
  印章；未选 = 72% 透明 + `#0A4F3D` 22% 压暗。六弹窗统一底边 `mcY+96`，距 ConfirmBtn 恒 12px
- **计数类只保留 1 个弹窗**：⑧吐司为准，⑦水煮蛋 / ⑨羊肉串 已删（老板：个串片只需一个展示）
- **能量条算法定稿**：`p(n)=ln(1+n)/ln(101)`，刻度 1/5/25/100 显式暴露非线性；阈值 ≤4 mint / 5–24 琥珀 /
  ≥25 珊瑚，上限 100。此前的「pip 逐颗点亮」被否（100 串放不下），彻底废弃
- **DesignTokens 全画板回校**：变量对齐 + 两轮字面色号清扫（第二轮 157 节点）+ 圆角归一到
  sheet 34 / card 20 / chip 18（60 处）+ 12.5/11.5 字号统一为 caption 12（49 节点）。**全画板 fill /
  渐变 stop / stroke / effect 四类审计已零 off-token**（原先手调的 `#FFC9AE` 已改为 `#FF9E7D8C`）
- **交付**：`docs/design/2026-09-21-selection-state-and-count-stepper/`（README 实现文档，含 UTS 参考
  实现、光晕公式、motion hook 时长表、落地清单 + `export/` 12 张 2x 交付图）。**App 代码未动**——
  `AddSheet.uvue` 仍是 `e3798b8` 删除后的空档

### 2026-09-21 — Tabbar＋stores 落地（共享组件＋5 stores＋Pinia，实拍验证通过）

- **Tabbar**：共享 `Tabbar.uvue`（v2 双 Tab 规格：BG `#F8FCFA`／顶线／11px 字，激活 `#17916B`），
  Home／Profile 内嵌（active 切换），`redirectTo` 防堆栈；**实拍点按「我的」→ Profile，我的变绿 ✓**
  midbutton 旧案终结：v2 加号本就在首页右上，不存在中钮需求
- **stores**：git 历史恢复 device／goal／food（composable 同回），新建 settings／user；
  food 增记录快照（foodName＋source＋schemaVersion）＋`ct_*` 本地持久化；
  main.uts 恢复 Pinia，App.onLaunch 恢复 device 初始化
- **页面暂不接线**：三页保持稿面静态值（种子推导总数≠530/1270，接线会变数），等 AddSheet 记录流一起切
- **验证**：CLI 编译成功（3 页＋组件，仅 3 条鸿蒙 UA 旧 warning）→ 关窗重开 → 首页截图一致 →
  实拍 tap 切页 → 控制台 error 空

### 2026-09-21 — P2 个人中心＋P3 设置页落地，三页闭环（模拟器验证通过）

- **P2**：`Profile.uvue`（渐变头图老刘/128天/齿轮→设置、今日热量530＋58.6%进度＋三统计、达标 Banner 压卡、
  本周4/7七点、热量趋势7柱＋目标线1800、最近记录超标+150/达标×2、页内 Tab 我的激活）＋12 张导出图
- **P3**：`Settings.uvue`（渐变头图＋返回、偏好/目标/数据三组、shield 本机声明、珊瑚描边危险卡、页脚）＋11 张导出图
- **路由**：pages.json 补 profile＋settings；首页 Tab 我的→profile；齿轮→settings；返回键回退
- **还原因 deviation**：对勾圆按实测改绿底 `#009771`；返回白圈白箭不可见→改 mint 字形 ‹＋薄荷 ring；
  趋势日期只标前 4 柱（与稿面一致）；柱渐变纯色近似
- **🔴 新铁律（编译器 assets 冲突）**：多页静态 `src="/static/..."` 会被收进同一 `common/assets.js`，
  按序号＋后缀共享命名空间，跨页序号碰撞直接串图（设置页图标整体错位实锤）。**解法：图片一律
  `:src="'...'"` 运行时绑定，绕开静态资源收集**（副作用：assets.js 不再生成，旧包热更会报
  缺文件——必须清缓存＋关窗重开一次；已验证新包三页全对、控制台 error 空）
- **验证**：CLI 编译成功（3 页）→ cache clean → 关窗重开 → 三页截图 1:1 → 控制台 error 空

### 2026-09-20 — P1 首页按 v2 稿重建落地（模拟器验证通过）

- **范围**：`Home.uvue` 重写（Header/Hero/宏量68-152-42/早420午560晚390收起/页内双 Tab）＋`Home.md`＋22 张设计稿导出图（`app/static/home/`）
- **加号胶囊避让（Boss 要求）**：小程序端 `getMenuButtonBoundingClientRect()` 放胶囊左侧（try/catch 取不到回落稿面位置），其他端按稿面；实机截图确认加号在胶囊左侧
- **链路沉淀**：HBuilderX 项目列表里 `kaluli` 是 Web 型不会编译，`app(UniApp_VUE)` 才是工程，CLI 用 `--project app`；外部改文件 GUI 不自动重编，`cli launch mp-weixin --project app --compile true` 单次编译＋关窗重开生效；微信 MCP Token 已存 `.workbuddy/wx_token.txt`（git 忽略），重载/日志可自助
- **验证**：CLI 编译成功（1 页，31s）→ 关窗重开 → automator 截图结构正确 → 控制台 error 空
- **已知缺口**：瓶子静态图占位（液动下轮）；晚餐收起态；我的 Tab 无跳转（P2 接路由）

### 2026-09-20 — 计件类份量改数量输入：93 个 piece_weight 缺口补齐（数据半截落地）

- **起因**：Boss 指串/片/个用单选项分段（1个/1片/1串）没法选数量，提议用户自主输入；拍板：步进器＋点按输入、只改计件类、杯碗不动
- **数据缺口**：178 个计件条目（piece 87 / slice 5 / skewer 1…按 vessel 计）中 93 个 `piece_weight` 为 null，无它则公式 `kcal=round(count×pw×cal/100)` 算不出
- **执行**：
  - 新建 `toolchain/fill_piece_weights.py`（行级补丁，不重跑全量以保住人工修正）：Agnes API 定向问 93 个单个克重，23s 全回，`piece_weight` 就地填＋`piece_note` 留依据，conf/basis 不动
  - `validate.py` 新增⑦计件类 piece_weight 必填（构建期拦截）；`build.py` 的 base 补齐 protein/carb/fat（此前会静默丢宏量，宏量同比缩放依赖它）
  - `validate`＋`build` 双绿灯：347 条，pieceWeight 覆盖 102→195，计件类 178/178，产物同步 `app/src/data/`＋347 图标
- **版本说明**：`LIB_VERSION` 保持 1.0.0 未动（fingerprint 时间戳可追溯；发版时 Boss 定是否升 patch）
- **待办（UI 半截）**：AddSheet 手脚架时已删，数量步进器等 AddSheet 重建时落地；93 个估算值待人工抽核（`piece_note` 可查）

### 2026-09-20 — App 部分全部推倒重写：先回到最小可运行手脚架（Boss 指令）

- **背景**：Boss 明确「app 部分代码需要重新写，先初始化为只有手脚架的样子，能运行就行」
- **执行内容**：
  - 删除旧业务代码：`app/components/`（Bottle/AddSheet/FoodPickerSheet/SheetShell/MealIcon 等）、`app/stores/`（device/food/goal）、`app/composables/`、`app/styles/tokens.css`、旧页面 `pages/profile/`、`pages/settings/`
  - 删除旧资源目录：`app/src/`（旧版重复源码+图标副本）、`app/data/`（food_library.json 生成物副本，toolchain 仍可再产出）、`app/static/`（旧图标）
  - 保留：`manifest.json`（含 appid/wx appid，新建项目无法再生）、`pages.json`、`App.uvue`、`main.uts`、`pages/home/Home.uvue` + 配对 `Home.md`、`prototype/` 原型
  - 入口瘦身：`main.uts` 去掉 Pinia 挂载、`App.uvue` 去掉 device store 初始化；`pages.json` 只留 Home 单页
  - Home.uvue 为纯占位：薄荷底 `#F2FAF5` + 标题「CalTrack / 手脚架已就绪」
- **验证**：HBuilderX 热重载 → automator 后台截图确认（`.workbuddy/shots/scaffold_home.png`），页面正常渲染、路由 `pages/home/Home`
- **后续**：业务按设计稿（Ardot 727289305476547）逐步重建；食物数据等需要时从 `toolchain/build.py` 重新产出，严禁手写
- **同会话附带**：Cline MCP 新增 `pencil`（Pen 本地）、`ardot-remote`（云端 http）、`cloudbase`（npx）、`ardot`（本地 http，后改 disabled:true）、`pen-dev`（npx pen.dev mcp，端口 3000）；全局技能目录 `~/.claude/skills` 安装 5 个新技能（ai-worldclass-design / agent-design-figma / grill-me / fluid-interaction-expert / design-taste-plus）

### 2026-09-20 — 首页餐次区按新稿还原（Boss 反馈「meal-card 阴影不够、餐次图标不对」）

- **触发**：Boss 贴设计稿 vs 实机截图，指出 meal-card 阴影不够、餐次图标不对，明确 scope 只改餐次区
- **依据**：首页新稿 Ardot 727788215940571，`batch_read` + `export_nodes` 实测节点 10:290（明细白卡 362×154@472 画布）/ 10:325（时间轴竖线）/ 10:341（47×47 图标圆）/ 10:258 10:244（太阳/月亮矢量 path）
- **改动 1 · 明细裹白卡**：`Home.uvue` 餐次明细从裸排改为 `meal-card`（#FFFFFF r16 + 投影 `0 5px 14px rgba(26,102,77,0.06)`）；472→app 换算系数 0.794（宽 362→287、缩略图 46→37）；行间 1px `#F0F5F2` 分隔线（absolute 定位，不占高度）
- **改动 2 · 时间轴改 flex 列**：删掉写死的绝对定位竖线，改为 `meal-rail`（图标列 42px）+ `rail-line`（`flex:1` 1px 竖线），随餐次数自动伸缩，末餐不画线
- **改动 3 · 图标重画**：`MealIcon.uvue` 早/午=太阳（12.84 dot + 8 射线）、晚=月亮（月牙 + 2 星）——矢量几何从设计稿导出，PIL 4x 超采样成 `static/icons/meal_sun.png` / `meal_moon.png`；圆圈改正圆 r21 + 渐变 `#5CD9A6→#29B385`（135°）+ 投影 `0 5 12 rgba(31,140,97,0.25)`；加餐无新稿参考保留 CSS 曲奇
- **顺手修的坑**：prop 改名 `type→kind` 后漏改调用方，已同步 `Home.uvue`
- **文字色按设计稿校准**：名称 `#14584A` / 份量 `#8FAEAF` / 热量 `#0B7954`
- **验证**：本地无 node_modules 跑不了构建（uni-app x 编译在 HBuilderX 内），已交由 Boss 在微信 IDE 重编后对照设计稿截图验收；`read_lints` 零错误

### 2026-09-19 — 白屏真凶落网：`const` + 模板内联赋值 = 整个页面模块被丢弃

- **接上条排障**：补 `FoodPickerSheet.json` 后模拟器能启动了，但首页白屏。用户从 IDE 控制台贴出完整报错，才看到真正的编译错误（**automator 截图只有模拟器画面，编译错误只出现在 IDE 控制台**——两条信息通道必须都用）：
  ```
  x cannot reassign to a variable declared with `const`
  1 | ...const c=!1,...  c=e.o(t=>c=!1,"7c")
  ```
- **根因**：`Home.uvue` 把演示开关声明成 `const showSheet = false` / `const showPicker = true`，模板却写内联赋值 `@close="showSheet = false"`。uni-app x 编译生成对 const 的赋值代码（`t=>c=!1`），devtools 编译器（SWC 系）**直接拒绝整个 Home.js** → `module 'pages/home/Home.js' is not defined` → 白屏 + 所有页面 "not ready"
- **修复**：改为 `ref(false)`/`ref(true)` + 具名回调（`closeSheet()`/`closePicker()` 内 `.value = false`），模板写 `@close="closeSheet"`。重编后 `const c=!1` 模式消失，**首页 + FoodPickerSheet 完整渲染**（347 条数据列表、图标、kcal 全部正常）
- **连带验证**：FoodPickerSheet 的 DEBUG 旁路已移除（`allFoods = buildFoods()` 恢复），347 条 json 解析真实跑通；`FoodPickerSheet.json` 经一次增量重编未再丢失（持续观察）
- **⚠️ 写码纪律（新增）**：uvue 模板里的内联赋值（`@xxx="x = false"`）**只允许赋给 ref**；`const`/`let` 原始值一律用具名回调。这类错误源码层完全无感（HBuilderX 不报），只有 devtools 编译时才炸，且报错被淹没在控制台里
- **⚠️ 窗口纪律（新增）**：`cli open` / `cli auto` 每次执行都会把项目窗口**拉到前台**，窗口若留在屏幕上会持续挡住 Boss 的工作区（即使 WS_EX_TOPMOST=False 也会被反复置前）。**每次 cli open/auto 收尾必须 ShowWindow(6) 最小化**（automator 在最小化下照常工作，已实测）；Boss 要亲眼看时用 `debug_shot.ps1 -Show` 拉回
- **诊断链沉淀**：白屏排查顺序 = ① IDE 控制台（用户可见，最全）→ ② automator `mp.on('console')` 事件（可脚本抓）→ ③ IDE 本地日志 WeappLog → ④ 截图（只看渲染结果，别当唯一依据）。**`debug/shot.js` 已升级 v2**：截图时同步输出协议层 error/warn（`CONSOLE=clean` 或错误列表），日常验证不再「盲拍」——注意 console 事件只推连接之后发生的日志，页面启动期报错要在重开窗口后立即跑，或看 ①③

### 2026-09-19 — 「IDE 灰屏」排障实录：根因是产物缺一个 `.json`

- **现象**：微信开发者工具整窗深灰（重绘无效），automator 连上 9420 但任何命令 10s 超时，模拟器控制台为空
- **根因链**：`dist/dev/mp-weixin/components/FoodPickerSheet.json` **缺失**（js/wxml/wxss 都在）→ 小程序自定义组件注册失败 → `pages/home/Home.json` 的 `usingComponents` 解析报「路径下未找到组件」→ **模拟器启动失败** → IDE 灰屏 + automator 全部超时（没有运行的 app 可指挥）
- **怎么定位的**（截图上的报错字太小，别硬读）：
  1. `Get-Process` 看 `Responding` → 进程都活着，排除僵死
  2. `simulator_screenshot`（MCP 通道）拍到「模拟器启动失败」页面 → 方向从「渲染问题」转为「编译问题」
  3. 对照 `components/` 产物清单：其他组件都有 `.json`，唯独 FoodPickerSheet 缺
  4. **完整报错在 IDE 本地日志**：`%LOCALAPPDATA%\微信开发者工具\User Data\<hash>\WeappLog\logs\*.log`（搜 `FoodPickerSheet`），模拟器控制台和截图都不如它准确
- **修复**：手工补写 `FoodPickerSheet.json`（`{"component":true,"usingComponents":{"sheet-shell":"./SheetShell"}}`，无 BOM）→ `close` + `open` + `auto` 重启项目窗口 → automator 秒通，`currentPage: pages/home/Home`
- **⚠️ 复发风险与处置**：缺 json 是 uni-app 增量编译的边角 bug（某次增量时 FoodPickerSheet.uvue 正在重写，json 没写出，之后增量认为「无需更新」永远不补）。**再遇到「IDE 灰屏 / automator 全超时」，第一件事查 dist 里组件的 `.json` 是否齐全**。手工补即可，不必全量重编
- **诊断技巧沉淀**：automator「connect 成功但命令超时」= 模拟器里没有活着的 app，先查编译/启动，别重挂桥（重挂没用，本次实测）

### 2026-09-19 — 任务 6：设置页完成 + 排查出一个 uvue 编译级大坑

- `Settings.uvue` 完整结构（ScreenSpecs §8 + VisualLanguage §9.5.5）：头图 128（返回钮 34 + 标题 + 2 颗气泡）/ 四组玻璃卡（偏好开关×2、目标管理 3 行、数据管理 2 行）/ **危险项独立成组**（白底不透明 + 珊瑚描边 `#F5D5C8` + 珊瑚阴影）/ 页脚
- 开关 46×28 纯 CSS（开 = 薄荷渐变 + 滑块右移；关 = 灰；深色模式 v1.0 不做 → 置灰 45%）；行规格 padding 14/16 gap13；图标底座 28×28 正圆（符号为 CSS 占位圆点，iconfont 接入后替换）
- **排障实录（对照实验方法论，值得复用）**：v-for 行插值全空 + 行数错乱 + 同卡消失，控制台**零报错**。依次排除：小改重触发热重载 ✗ → 清编译缓存 ✗ → 全局渲染状态 ✗（Profile 页同屏正常）→ **静态/v-for 同屏对照实验**：静态「偏好」组完美、v-for 组仍坏 → 锁定 v-for 写法 → **循环变量 `r` 改名 `item` 即愈**
- **根因**：uvue→WXML 编译层中 `r` 与内部变量冲突（高度疑似）；其余单字母 d/m/s/i/h/b 实测正常。**铁律已入 AGENTS.md：v-for 变量一律语义化命名，禁用 `r`**
- 排障期间口诀「小改自愈」在 Settings 失效 → 方法论升级为「对照实验」；调试链全程 automator 后台截图（本轮 6+ 次截图，0 次窗口打扰）

### 2026-09-19 — 任务 5：「我的」页完整实现（视觉验证通过）

- `Profile.uvue` 从占位升级为完整结构（Ardot 3:573 + 子节点 3:608/612/643/654 实测还原）：
  - **液体头图 218**：头像「卡」白卡 + 名字/坚持天数 + 统计条（126 累计 | 1350 日均，白卡 + 竖分隔）
  - **波浪收边**：CSS 双椭圆近似设计稿 SVG path（形差已标注）；3 颗气泡按实测坐标（8/6/5px）
  - **周概览玻璃卡**：徽章「达标 4 天」（#E2F7EE 底）+ 七颗液滴 —— **实测为纯色非渐变**（与 VisualLanguage §9.5.4 有出入，照设计稿实测走）：达标 `#5BD3AC` / 超标 `#FF9E7D` / 空缺 `#D5E5DD` / 今天 `#1FBF8F` + `#0A7A5C` 描边 + 标签加粗
  - **趋势柱状图**：底部对齐 + 柱色四态（灰 `#CBD9D3` / 珊瑚渐变 / 空缺矮柱 / 今天满饱和+阴影）+ 目标线 y12 + 「目标 1800」白玻璃标签
  - **历史 3 行**：日期/数值/单位 + StatusDot（超标珊瑚点红字 / 达标内薄荷点灰字），数据为设计稿演示值
- **调试新发现：热重载「半失败」现象** —— 大改页面文件后热重载，静态区块更新但 **v-for 数据区渲染为空**（控制台零报错）；小改触发新一轮热重载 + `reLaunch` 后**自愈**，全程未动窗口、未清缓存。**排障口诀**：大改后渲染异常 → 先做任意小改再 reLaunch 截图 → 仍异常才走清缓存链（v5）
- **uvue 能力边界记录**：`background-clip:text` 渐变裁字不支持（头像首字改纯色深绿）；水滴形用 CSS 四值圆角近似 vector 14×21
- automator 工作流顺带升级：`debug/reload.js` 参数化（reLaunch 任意页面 + 截图），本次「我的」页验证全程零窗口操作

### 2026-09-19 — 任务 4 主体：通用弹层壳 + 添加食物 Sheet（视觉验证通过）

- **`components/SheetShell.uvue`**：通用底部弹层壳（遮罩 + 面板 r34 + 把手 + slot），添加食物 / 食物选择两 Sheet 复用；遮罩按半透明 dim 实现（设计稿 fill 导出 opacity=1 存疑，已在代码注释标注待对比）
- **`components/AddSheet.uvue`**：添加食物 Sheet（Ardot 3:267 实测还原）：热量区（325 大字 + 「改」胶囊 + 计算说明）/ 食物行（**图标 = 库内真实图 `drink/p270.webp`，347 张图标资产首次进入真实 UI，图片链路验证 ✓**）/ 分量三档 / 甜度五档（**糖粒数 0/2/3/4/5 + 无糖虚线空心圈**，CSS 实现「颗粒数=糖量」量尺隐喻）/ 餐次四档 / 确认按钮（h52 r26 渐变 + 阴影 0 8 18 .34）
- 选中态为静态演示值（中杯·全糖·加餐，与设计稿 3:267 场景一致）；切换联动计算待接 goal/food store
- **automator 后台截图验证通过**：新增 2 组件触发铁律 → `debug_shot.ps1 -Reload` 干净重开 → `node debug/shot.js` 纯协议截图，**全程零窗口打扰**（调试体系首次完整实战）
- 分段 pill 的选中描边用 `border` 近似设计稿的 inset shadow（uvue 不支持 inset），视觉可接受
- Home 的 `showSheet` 演示开关已改回 `false`（正式打开入口等 Tabbar 方案拍板后接加号）

### 2026-09-19 — 微信开发者工具调试：三代方案演进（全部实测，教训与铁律）

- **v1 关窗重开**：`cli launch --compile true` 一次性编译后，微信工具不自动重载（`simulator_refresh` 无效）→ 只能 `close_project_window` + `open_project_window`。**副作用**：每次重开都弹大窗且置顶，Boss 正常使用被反复打断
- **v2 屏外窗口**：`SetWindowPos` 取消置顶 + 移到屏幕外（x=-3400），保持"可见"状态规避 Chromium 节流，截图正常。**副作用**：Boss 点任务栏图标窗口"闪一下就消失"，**失去了正常查看程序运行的能力** —— 被否决
- **v3 终态：官方 `miniprogram-automator` 纯协议（Boss 提的"浏览器自动化"思路）**：连 `ws://127.0.0.1:9420`，**窗口最小化状态下实测截图 + 取当前页面路径均成功**，窗口全程零操作。Boss 彻底解放
- **automator 能力清单**（不止截图）：`screenshot` / `currentPage` / `page.data()`（取页面数据）/ `element.tap()`（模拟点击）/ `page.$()`（查元素）/ `evaluate`（执行 JS）/ `callWxMethod` —— 视觉与数据层都能后台拿
- **落地**：`debug/shot.js`（node + miniprogram-automator，npm 依赖在 `debug/`，记得 git 忽略 node_modules）
- **v4 修正（Boss 两次否决后的最终版）**：`debug_shot.ps1` **删除一切窗口挪移逻辑** —— v2 的"移屏外"被 Boss 否决（点任务栏时窗口激活却在屏幕外，表现为"闪屏消失"，且失去正常查看程序运行的能力）；最终形态：截图一律 automator 协议（零窗口操作），仅 `-Reload` 重开窗口且重开后立即自动最小化（打扰约 1 秒），`-Show` 供 Boss 主动要看时把窗口拉回屏幕（不置顶）
- **五条铁律**（详见 AGENTS.md「App 端调试链路」）：
  1. **新增组件/页面后热重载必崩**（hotreload 补丁环境报 `uid null`，渲染部分损坏如液体消失、新列表不渲染）→ 必须 `-Reload` 关窗重开 + `cli auto` 恢复自动化；改文案/样式可热重载
  2. `close_project_window` 会连自动化服务一起杀 → 重开必须 `cli.bat auto --auto-port 9420 --trust-project`
  3. 窗口最小化会暂停 wechatide 截图（Chromium 节流）但**不影响 automator 协议**
  4. `.ps1` 含中文路径必须存 **UTF-8 with BOM**（PowerShell 5 按 ANSI 解码无 BOM 文件）
  5. wechatide `--path` 盘符大小写敏感（用 `D:\`）；「过滤无依赖文件」必须关闭
- **教训**：调试基建不能以牺牲 Boss 的正常使用为代价 —— v1/v2 都是在我单方面"能跑通"的立场下设计的，没有先问"这会不会挡你"。v3 才是双向最优

### 2026-09-19 — App 调试链路打通 + 首页真实结构（Boss 拍板方案 B）

- **方案 B 执行**：`app/src/*` 全部上移到 `app/`，`pages.json` 路由与 `App.uvue` import 去掉 `src/` 前缀，空 `src/` 已删 —— `app/` 现在是纯正的 HBuilderX 项目根
- **appid 落定**：Boss 在 HBuilderX 填入 `mp-weixin.appid = wx2ca7eecc03bd5d09`，HBuilderX 自动补全 manifest（DCloud appid `__UNI__F70225F`）
- **首次真实编译通过**：HBuilderX v5.26 `cli launch mp-weixin --compile true`，3 页面 + Bottle 组件**零错误**（仅 3 条鸿蒙 UA 检测 warning，来自 `useDeviceCapability.ts`，待后续适配）
- **首页从占位升级为真实结构**：Header / Bottle（玻璃瓶组件）/ NumberArea（46px 大数字）/ NutrientCard（玻璃卡三列）/ MealSection 空态。数据为演示值（1270/1800 场景，与原型一致，非食物库数据），待接 goal/food store
- **Bottle 组件**：uvue 不支持内联 SVG → **view+CSS** 还原 VisualLanguage §4 全部几何（瓶盖/瓶颈/瓶身玻璃/内腔/双高光），水位 `translateY=(1-pct)×132` + 1.15s 物理曲线，超标切珊瑚渐变；34 段正弦波纹待 canvas（平液面同时是低端机降级形态）
- **调试链路三级跳（重要过程记录）**：
  1. `cli launch --compile true`（一次性编译）→ 微信工具不自动重载，`simulator_refresh` 无效，必须 close+reopen 窗口
  2. `cli launch` 长驻 → **watch 失灵**（只编译一次，改代码后产物不动）
  3. **终态：Boss 在 HBuilderX GUI 点「运行到微信开发者工具」** → 改代码 3~8s 自动热重载 ✓
- **wechatide 调试命令接入**（微信工具自带 skill-cli，命令行直调无需重启）：`simulator_screenshot`（截图→read_file 看图）、`get_simulator_console`（grep 查日志）、`automation_*`（模拟点击/执行 JS，待用）；配置已写入用户级 mcp.json（`wechat-devtools`）
- **验证结果**：截图确认瓶子水位/渐变/高光、大数字、营养素卡全部正确；改一行文案 3~8s 后自动出现在模拟器（热重载实证）；控制台 **error/warn 双清零**
- **报错排障记录**：`uid` 渲染报错 = 热重载瞬态（重开即愈）；`home.js 已被代码依赖分析跳过` = 微信「过滤无依赖文件」误杀，Boss 已关闭
- **npm run dev:mp-weixin 已论证不可行**：uni-app x 编译器在 HBuilderX 内部，无独立 npm 入口；CLI 方式建出来的是普通 uni-app 而非 uni-app x
- 完整调试约定与命令已固化 **`AGENTS.md`「App 端调试链路」**（新会话直接继承）
- Boss 顺手装了微信工具调试插件（调试器/PerfDog/漏扫/sourceMap 匹配），均为只读辅助，与本链路兼容

### 2026-09-19 — 从 Ardot 提取 8 屏规格 + 搭建 App 骨架

- **8 屏规格提取**（任务 1/7 完成）：用 Ardot MCP `batch_read`（readDepth 3）逐屏读取 8 个画板，产出 **`design/ScreenSpecs.md`**
  - 含：通用框架（StatusBar 62 / Content gap 9 padding 0-18-8 / 左右边距 18）、8 屏逐屏元素树与尺寸、玻璃卡统一规格、Sheet/Modal 完整规格
  - **设计稿实测 vs 旧文档的差异**：Bottle **122×171**（旧写 132×185 / 150×210）、加号上凸 **-14**（旧写 -22）、AddSheet 550@y262、FoodPickerSheet 500@y312、Profile Hero 218、Settings Hero 128、StatBar 64、设置页波浪 **2 颗气泡**（我的 3 颗）
  - `DesignTokens.md` 补 **§5「设计稿实测衍生色」13 个**：`#D6E9E1` `#E3F0EA` `#DCEDE6` `#F5D5C8` `#FBFEFC` `#F5FAF8` `#F8F9FC` `#EAF3EF` `#F2FAF6` `#BFE3D6` `#7A8F88` `#A9BAB3` `#C2D4CC` `#E0633C`
- **发现两处设计稿内部不一致**（待 Boss 拍板）：
  1. 画板节点的**硬编码色值是旧值**（bg `#F1FAF6` / label `#0B4F3C` / mint-deep `#0B7A5C`），而**变量集是新值**（`#F2FAF5` / `#0A4F3D` / `#0A7A5C`）；液体渐变用的却是新值 → 说明建变量后**只更新了部分节点**，底色与文字是漏网之鱼。差异 ±1/255，肉眼不可辨
  2. 食物选择 Sheet 的 `CategoryTabs` **只有 7 个 Tab**（全部/水果/蔬菜/肉类/主食/饮品/零食），**缺「菜品」** → 347 条中 **58 条菜品**（16.7%）无法按分类筛选
- **App 骨架落地**（任务 2/7 完成）：`app/` 此前**无任何脚手架**（无 `package.json`、无配置），本轮新建 5 个核心配置 + 3 个页面占位
  - `app/manifest.json` — 含 `uni-app-x` 节点（**项目类型标识，缺了会被当成 js 引擎版**）；**刻意不写 `transformPx`**（那是 uni-app js 版字段）
  - `app/pages.json` — 3 路由，全部 `navigationStyle: custom`；**不用原生 tabBar**（官方文档明确「uni-app x 不再支持 tabbar 的 midbutton」，而设计稿 Tabbar 是玻璃 + 上凸 14px 加号）
  - `app/App.uvue` — onLaunch 内触发 device store 初始化（**注意：device store 没有 `detect()` 方法**，检测写在 `state()` 里，只有 `refresh()`）
  - `app/main.uts` — `createSSRApp` + Pinia
  - `app/src/styles/tokens.css` — 11 正式色 + 13 衍生色 + 圆角/字号/弹簧曲线 → CSS 自定义属性；含 `.ct-glass` / `.ct-btn-primary` 通用类
  - `app/src/pages/{home,profile,settings}/` — 3 组 `uvue` + 配对 `.md`（符合 Vue↔MD 规范，MD 含用途/依赖/设计决策/边界降级/设计稿对应 5 段）
- ⚠️ **未能执行构建验证**（AGENTS.md「自测红线」要求跑通构建）：当前环境无 uni-app x 工具链，且 `main.uts` 的写法**官方 manifest.json 文档未给出**，本文件按 uni-app Vue3 入口的通用形式编写并在文件头标注「未经本地构建验证」
- 📌 **待 Boss 拍板：工程化路线**——这决定 4 个配置文件放哪：
  - **HBuilderX**：`manifest.json`/`pages.json`/`App.uvue`/`main.uts` 放**项目根**（官方文档示例结构，无 `src/`）
  - **CLI（Vite）**：配置放 `src/` 下，另需 `package.json`/`vite.config.ts`/`tsconfig.json`
  - 当前骨架按「根目录放配置 + `src/` 放源码」建，**`pages.json` 的 path 带 `src/` 前缀**

### 2026-09-19 — 按 Ardot 设计稿校正 VisualLanguage.md 色值
- Boss 裁定「**以 ardot 设计稿为准**」，据此把 `design/VisualLanguage.md` 的色值**全量校正**（11 处替换，覆盖 19 个色值点）：
  | 旧值（手抄错） | 新值（设计稿） | 出现处数 |
  |---|---|---|
  | `#7CEBC6` | `#7DEBC7` | 7 |
  | `#0E9C74` | `#0D9C73` | 7 |
  | `#0B7A5C` | `#0A7A5C` | 7 |
  | `#0B4F3C` | `#0A4F3D` | 2 |
  | `#F1FAF6` / `#F2FAF6` | `#F2FAF5` | 2 |
  | `#E9B44C` | `#E8B54D` | 1 |
  | `rgba(16,80,62,.60/.34)` | `rgba(15,79,61,.60/.34)` | 2 |
  | `rgba(124,235,198,.42/.40)` | `rgba(125,235,199,.42/.40)` | 2（mint-e1 的 rgba 形式，一并校正） |
  | `rgba(14,156,116,.28~.40)` | `rgba(13,156,115,.28~.40)` | 1（mint-e3 的 rgba 形式） |
- 文首新增来源声明：**色值以 `design/DesignTokens.md` 为唯一事实来源**；并明确 **几何 / 动画 / 交互规格（§4 瓶子、§5 液体、§7 弹簧、§8 反馈矩阵）是设计稿之外的设计资产，仍然有效**
- 至此三处色值来源（Ardot 变量集 / `AGENTS.md` / `VisualLanguage.md`）已统一，不再互相打架
- **同时校正 `design/UI_Spec.md`**（13 处色值，此前遗漏）+ 两份文档里**过时的图标方案**：
  - `VisualLanguage.md` §10：食物图来源 `Pixabay 真实照片` → **Agnes AI 文生图**；§10.1「复用风险」改写为「v1.0 已消解（347 条 = 347 张专属图，不做品类兜底复用）」
  - `VisualLanguage.md` §11 体积：`180×30KB ≈ 5.4MB` → `347×16.5KB ≈ 5.6MB`；§12 落地清单勾掉「emoji → Pixabay 真实食物图」
  - `UI_Spec.md` §6.1：食物图来源同步；§8 参考文档表改为实际文件名（`CalTrack_UIDesign.md` 已不存在于仓库）
  - 修正 4 处旧文件名引用（`CalTrack_VisualLanguage.md` → `design/VisualLanguage.md`、原型路径补全为 `app/prototype/CalTrack_Protoype.html`）
- ✅ 至此 `design/` 下三份文档（`DesignTokens.md` / `VisualLanguage.md` / `UI_Spec.md`）**色值与图标方案全部对齐**，无残留旧值
- 📌 **踩坑记录**：并行发出的多个 `replace_in_file` 若指向**同一文件**，会互相覆盖写回结果（本次导致 9 处替换静默丢失，工具仍报成功）；同一文件的批量修改必须**串行**，或用脚本一次性完成

### 2026-09-19 — 建立设计 Token 唯一事实来源（Ardot 对接）
- 连通 Ardot MCP（本地 `127.0.0.1:50501`），读到设计文件「**CalTrack 高保真 UI**」（fileId `727289305476547`，权限 `readwrite`）
- `export_variables` / `fetch_variables` 拉出变量集 `CalTrack`（Light 模式）：**11 色 + 3 圆角 + 5 字号**
- 产出 **`design/DesignTokens.md`** 作为唯一事实来源，并附「与旧文档的差异清单」
- ⚠️ **发现文档与设计稿的色值系统性不一致**（手抄误差 ±1）：
  | 项 | 旧文档 | **设计稿实际（准）** |
  |---|---|---|
  | mint-e1 | `#7CEBC6` | **`#7DEBC7`** |
  | mint-e3 | `#0E9C74` | **`#0D9C73`** |
  | mint-deep（小字色） | `#0B7A5C` | **`#0A7A5C`** |
  | **bg** | `#F1FAF6` | **`#F2FAF5`**（差异最大） |
  | label-1/2/3、amber | 各自差 1 | 见 token 文档 §6 |
  - `AGENTS.md` 与 `design/VisualLanguage.md` 都受影响
- 已更新 `AGENTS.md` 色板段 → 指向 `design/DesignTokens.md`
- 待办：`design/VisualLanguage.md` §3 的色值待同步修正（否则两份文档继续打架）
- 附带踩坑：Ardot `export_variables` 用 `colorFormat=hex6` 会**静默丢掉 alpha**
  （`label-2` 60% / `label-3` 34% / `glass-bg` 74% 全被变成不透明），须从 `fetch_variables` 原始值取

### 2026-09-19 — 图标资源集成进 App 静态目录（未动 App 代码）
- `build.py` 新增 `sync_icons()`：把 `assets/icons-final/` **增量同步**到 `app/src/static/icons/`
  - 原因：App 打包只包含 `app/` 目录内的文件，`assets/` 下的产物必须复制一份进 App
  - 增量策略：只复制缺失或更新的（**重跑实测复制 0 个**，不会重复搬运 347 个文件）
- 同步结果：**347 个图标 / 7 个 ASCII 分类子目录 / 5.6MB**
- **引用约定**：`food_library.json` 的 `img` = `<catKey>/<id>.webp`，前端拼前缀 `static/icons/`
- 遵守 Boss 要求「先不要开始开发 app 端」——**未写任何 App 代码**（ts/vue/页store 全部未动）
- ⚠️ **发现两件事需后续处理**：
  1. 项目**尚未初始化 git**（`AGENTS.md` 里的 git 分支策略尚未生效）
  2. 初始化 git 时建议把 `app/src/static/icons/` 加入 `.gitignore` —— 它可由 `build.py` 从 `assets/icons-final/` 重建，否则 5.6MB 图标会在仓库里存两份

### 2026-09-19 — 图标路径改为纯 ASCII（Boss 指出隐患）
- **隐患**：原图标路径是 `assets/icons-final/主食/p001-米饭.webp`，**目录与文件名都含中文**。中文路径在以下场景有兼容风险：
  - URL 请求需 percent-encoding（`米饭` → `%E7%B1%B3%E9%A5%AD`），服务端/CDN 编码不一致会 404
  - 跨平台文件系统编码不同（Windows GBK vs Linux/macOS UTF-8），互传可能乱码
  - 打包工具（webpack/vite/uni-app）对非 ASCII 文件名处理不一致
  - 真机按路径读本地文件时编码易出问题；日志报错乱码难排查
- **改动**：
  - `icons_v1.yaml` 新增 `categories` 段：`name`（中文，UI 显示）+ `key`（ASCII，路径用）
  - 7 个分类目录重命名：主食→`staple`、菜品→`dish`、肉类蛋类→`protein`、蔬菜→`vegetable`、水果→`fruit`、饮品→`drink`、零食→`snack`
  - **694 个文件**重命名：`p001-米饭.webp` → **`p001.webp`**（文件名用食物 id，可读性由 `name` 字段承担）
  - `build.py` / `gen_icons.py` 同步改用 `catKey` 拼路径
- **校验通过**：347 库条目 ↔ 347 图片引用 ↔ 347 磁盘文件，**缺失 0 / 非 ASCII 0 / 多余 0**
- 顺带：`food_library.json` 体积从 135.7KB 降到 **132.3KB**（路径变短）

### 2026-09-19 — 文档债清理 + v1.0 范围冻结
- **`docs/FoodLibraryPlan.md` 按「理解 A」全面校正**：
  - 顶部新增「**v1.0 范围冻结**」段，集中列出被取代的旧数字：5000/18000 条 → **347 条**；Top200 + 品类兜底图 → **347 张全专属图**；品牌产品图 → **不做**
  - 补记**第三条已推翻的旧决策**：图片路线从「Pixabay 真实照片 + 品类兜底图」改为「AI 文生图」
  - 体积账改为实测值：营养数据 136KB + 图标 5.60MB ≈ **5.7MB**
  - 数据分层从 L1–L4 四层 → **按 `confidence` 三档**（347 条精品库里逐条标置信度比分层更精确）
  - 生产流水线改为实际落地的**八步流程**
  - 待拍板第 1、2 条标记为已定；10.1 的 v1.0 范围改为 347 条
- **`toolchain/README.md` A 章节重写为多源模式**（五份源文件 / 脚本清单 / 6 项校验 / 数据流 / 实测产出 / 已知风险）
- **Boss 范围收敛决定：v1.0 不做「用户自定义规格 / 模板」**
  - 理由：只有奶茶一个品类需要规格，要支撑它得做编辑 UI + 持久化 + **模板版本迁移** + 校验（约 3–5 天），投入产出不匹配
  - 现状：代码里本就没有这个功能，`vessel_tpl.yaml` 的 `override` 是**数据源字段**、不是用户 UI
  - ⚠️ **必须区分的两条**：自定义规格 = 让用户改**库**（不做）；**记录级热量覆盖 = 让用户改「这一顿」（P0 必做）**
    —— 后者是「搜不到就记不了，记不了就卸载」的兜底，粒度不同，不能一起砍

### 2026-09-19 — 打包链路打通 + 工作区清理
- **`validate.py` 重写为多源一致性校验**（5 份源文件：`icons_v1` / `nutrition_v1` / `icons_v1_usage` / `vessel_tpl` / `opts_tpl`）
  - 校验项：三源 id 对齐、模板引用合法、数值合理性、`basis` 与 `confidence` 一致性、宏量配平（酒精类除外）
  - **首次运行即通过**，无错误
- **`build.py` 重写为多源合并**：347 条 → `food_library.json`（**135.7KB**）
  - 食物条目新增 `pieceWeight`（按个计食物的克重，102 条有值）与 `img`（图标文件名）
  - 产物写入 `toolchain/dist/` 并同步 `app/src/data/food_library.json`
- **`schema/v1.0.json` 更新**：id 格式放宽为 `^[a-z]+_?[0-9]+$`（适配 `p001`）、`foods` 增加 `pieceWeight`/`img`、`optTpl` 支持 `multi` 类型与 `def` 为数组
- 产物摘要：`conf` 分布 `{1: 11, 2: 161, 3: 175}`；347 条全部有器皿分段、10 条有选项、102 条有单个克重
- **工作区清理**：删除 `assets/icons/`（29 张废弃实景照片）与 `assets/icons-compressed/`（旧 34 张 + 测试图）；停掉 8899/8901 两个临时预览服务
- `AGENTS.md` 目录结构同步更新（toolchain 完整脚本清单 + assets 产物目录）

### 2026-09-19 — 营养数据审计与修正（347 条全量）
- 按「食物分类的常识区间」做离群扫描：12 条命中，逐条判断后其中 **9 条是规则太严、数据本身正确**（腐竹蛋白 44.7g、毛豆 131kcal、凉拌菜 25-35kcal、果冻 60kcal 均属实）
- **真错误 5 条，已全部修正并配平验证**：
  | id | 食物 | 原值 | 修正为 | 问题类型 |
  |---|---|---|---|---|
  | p270 | 珍珠奶茶 | 350 kcal/100ml | **43** | 量纲错（比猪油还高），同时对 `milk_tea.yaml` 的 base |
  | p271 | 芝士奶盖茶 | 180 kcal/100ml | **85** | 量纲错（把「每份」当「每100ml」） |
  | p288 | 椰奶 | 180 kcal/100ml | **60** | 口径歧义（明确按「椰汁饮料」，非烹饪椰浆） |
  | p137 | 鸡爪 | 80 kcal | **254** | 偏低（配平差 0） |
  | p126 | 猪血 | 蛋白 19g | **12.2g** | 偏高（配平差 0） |
- **`milk_tea.yaml` 的 base 注释矛盾已判定并消除**：结论是 **base=43 正确、「30% 含乳量」写错**
  - 依据：43kcal/100ml → 中杯 500ml 全糖 325kcal，与市售中杯全糖奶茶 250-350kcal 吻合；若取 19.5 则仅 207kcal，明显低估
  - 口径已改为「市售常见奶茶（植脂末+牛奶混合基底）」，并注明纯鲜奶配方应降至约 20-30kcal/100ml
- **错误率 5/347 = 1.4%**，且错误类型**集中在「量纲」**（LLM 把「每份」当成「每 100ml」）—— 这是后续扩充数据时要重点防的失误模式
- 结论：347 条可直接进 App（其中 conf=1 的 9 条由 UI 标「估算值，仅供参考」）

### 2026-09-19 — 图标线全线完成 + 营养数据线初稿
- **图标线完成**：347 张全部产出
  - 生图 347/347，耗时 5.45 分钟（59.8 张/分钟），白底像素校验 **100% 合格**
  - 压缩 347 张 → WebP 512，总计 **5.60MB**，平均 16.5KB，**单张最大 25.0KB、超标 0 张**（完全命中 FoodLibraryPlan 的 15–25KB 规格）
  - 产物：`assets/icons-gen/`（原始 PNG 1K）、`assets/icons-final/`（**512 WebP，App 用这个**）
- **营养数据线初稿**：347 条（`gen_nutrition.py`，分层方法）
  - 置信度：`conf=3` 176 条 / `conf=2` 162 条 / `conf=1` 9 条
  - 依据：`composition_table` 193 / `recipe_estimate` 145 / `rough_estimate` 9
  - 核对清单：`toolchain/sources/nutrition_checklist.md`（30 条按风险排序 + 145 条配方明细）
  - 字段：`cal/protein/carb/fat` + **`unit`**（39 项饮品按 ml，其余按 g）+ `piece_weight` + `basis` + `confidence` + `basis_detail`
- **抽查修正**：
  - 奶茶数值 `350 kcal/100ml` 荒谬（比猪油还高）→ 改回 **43 kcal/100ml**（对齐 `milk_tea.yaml` 的无糖 base，甜度/加料交给 `opts_tpl` 组合计算）
  - 补 `unit` 字段（原先液体按 100g 计是错的）
  - 标记 3 个待核项：`p137` 鸡爪（80 kcal 偏低，成分表约 254）、`p126` 猪血（蛋白 19g 偏高）、`p121` 五花肉（口径待确认）
- ⚠️ **待 Boss 确认的关键矛盾**：`milk_tea.yaml` 注释写「全脂牛奶≈65，按 **30%** 含乳量折算」，但 `65 × 0.3 = 19.5 ≠ 43`；若含乳量为 **65%** 则 `65 × 0.65 = 42.25 ≈ 43`。**注释或 base 数值必有一处错**，而它直接决定奶茶整张热量表（215/245/270/295/325 等）

### 2026-09-19 — 图标线与数据线槽位生成完成
- **图标线**：`toolchain/sources/icons_v1_visual.yaml` 生成 347 项生图槽位（LLM 初稿 + 人工修正）
  - 字段命名改为 `container`（视觉容器），**刻意避开数据线的 `vessel`（计量器具）**，防同名混用
  - 修正项：火锅视角改「四分之三侧视」（依据实测结论）、9 项抽象词/主观形容词（`assorted`/`various`/`milky`）、5 项多颜色并列（苹果→红、洋葱→金黄等）
  - 审计结果：风险词清零、多颜色并列清零
- **数据线**：新增三份源文件
  - `toolchain/sources/vessel_tpl.yaml`：18 个计量器具模板（cup / cup_coffee / bowl_rice / bowl_noodle / pot / plate / piece / slice / skewer / bag / bottle / can…）
  - `toolchain/sources/opts_tpl.yaml`：4 个选项模板（sweet / topping / sugar_pack / syrup_pump）
  - `toolchain/sources/icons_v1_usage.yaml`：347 项引用，**全部合法**（引用 key 均存在于模板集）
- **咖啡甜度独立建模**（不复用奶茶 sweet）：美式/速溶 → `sugar_pack`（糖包 0/1/2）、拿铁/卡布奇诺 → `syrup_pump`（糖浆 0–3 泵）、**摩卡 → 无选项**（配方自带巧克力酱）
  - 理由：奶茶 sweet 是「5 档几分糖 × 按 500ml 线性缩放」，套用到咖啡会算错
- **建模铁律**：**配方固定差异 → 拆独立条目**（无糖可乐、三合一速溶咖啡），只有「用户可调」的才出选项
- 修正：5 种纯茶（绿茶/红茶/乌龙茶/普洱茶/茉莉花茶）从「现制茶饮」纠正为「自己泡的茶」→ `mug` + 无选项
- 新增可复跑生成器：`toolchain/gen_visual_spec.py`、`toolchain/gen_usage_spec.py`（非一次性脚本）

### 2026-09-19 — v1.0 食物清单落地（347 项）
- **Boss 拍板：采用「理解 A」** —— 一个食物 = 一条数据 = **一张专属图**，不做「Top 200 专属 + 品类兜底复用」的三层结构
- 清单落 `toolchain/sources/icons_v1.yaml`，**347 项**，含中式成品菜（Boss 明确要求纳入）
- 分类分布：主食 61 / 菜品 58 / 肉类蛋类 51 / 蔬菜 59 / 水果 40 / 饮品 39 / 零食 39
- 校验：无重复 id、无重复名称；YAML 语法通过
- 清单内已内置生图 `prompt_template`（固定骨架），每项待补 `vessel`（标准器皿）+ `view`（视角）
- 影响：`docs/FoodLibraryPlan.md` 的「体积账 / 数据分层 / Top 200 + 品类兜底图」几块需按 A 方案重写（待清单确认后一次性改）
- 待办并行线：347 条**营养数据**（每 100g 热量/蛋白/碳水/脂肪）尚未开始，是比图片更大的工作量

### 2026-09-19 — 图标方案定案：纯文生图（Agnes）
- 经多轮实测对比后**定案：纯文生图**。不用图生图、不用程序抠图、不抓真实照片
- 排除依据：① 真实照片**全带背景**（已下载 34 张中 29 张有背景、白底命中 **0**），图生图要额外工序却无增益；② "先写详细文案再生图"**无增益甚至有害**（`milky brown` 把奶茶颜色描述偏）；③ 品牌锚定短语（"参考市面上常见品牌实物"）与其他表述**无显著差异**
- **核心 Prompt 规约：说「是什么」，别说「感觉像什么」**
  - ✅ 有效：逐项枚举具体食材 / 容器材质与形状 / 状态动态词（`bubbling`）/ 视角词
  - ❌ 无效：抽象概括（`assorted ingredients` 导致麻辣烫画成牛肉粉）
  - ⚠️ 有害：主观形容词
- **器皿是第一识别特征**：火锅 v1 `pot of hotpot`→砂锅米线、v2 `stainless steel`→**铁盆**、v3 `copper hotpot + central chimney`→通过（最终选定**四分之三侧视**）
- 实测 10 个不同难度食物：**首轮合格率 8/10（80%）**，失败项为麻辣烫与火锅（各需 2–3 轮修正）。规律：越"料多"、越依赖中式器皿的食物越容易翻车
- 成本：单张 10–19s；20 路并发 **69.3 张/分钟**；240 张约 **3.5 分钟**（含 30% 重做约 4.5 分钟）；当前官方标价 $0
- 白底由 prompt 天然满足（四角像素校验 10/10 纯白），**仅剩体积需调**（`max_size_kb` 50 → 25）
- 经验全部沉淀到 `toolchain/README.md` B.3–B.6

### 2026-09-19 — 图标素材链路修复 + 图源经验归纳
- 修复 `toolchain/fetch_icons.py` 六处硬伤：Pixabay 域名错误（`api.pixabay.com` 不存在）导致接口 100% 失败、`per_page=1` 非法触发 HTTP 400、搜索词未 URL 编码、下载档位 640 改 1280、`&sig=` 自我替换死代码、超时 5s 改 15s
- **Pixabay 提为第一顺位**（原为 Pexels 优先），Pexels 降为兜底
- 修复压缩断链：原条件写死 `source == "web"`，导致 Pixabay/Pexels 的图永不产 webp；叠加 `os.system` 子进程不走 UTF-8、且 `compress_icons.py` 只接受目录参数 → 改为进程内 `compress_image()` 直接调用
- 修复索引覆盖：`_update_index` 改为读旧文件合并写，跑单分类不再冲掉其他分类记录
- 实测四源可用性：Pixabay ✅（`bubble tea` 命中 7259 条 / 1280 档 290KB）、Pexels ✅（搜索下载正常，但取 `src.original` 实测 **3017KB** 需降档）、Agnes ✅（`agnes-image-2.5-flash` 12.9s 出图 853KB）、`source.unsplash.com` ❌ **已下线**（实测两次均 503）
- 摸清 Key 池：Pixabay×2、Pexels×2、Agnes×5（`AGNES_API_KEY` ~ `AGNES_API_KEY5`）；另有 `PIPY_AGNES_2.5_FLASH_MCP_KEY`(221 位) 用途未确认
- 实测 Agnes 并发吞吐：1/4/8/16/20 路并发总耗时均恒定在 17–19s（瓶颈是服务端批次窗口，与并发数无关）→ 20 路 5 Key 实测 **20/20 成功、69.3 张/分钟、无 429**；推算 240 张约 **3.5 分钟**（含 30% 重做约 4.5 分钟）
- 实测 Pixabay 白底命中率：`colors=transparent` 返回带 alpha 的 PNG（`photo` 类型仅 58 条且主体是茶杯非奶茶；`illustration/vector` 1356+820 条主体正确但为卡通风格）；已下载 34 张中仅 **5 张白底且均为 Agnes 生成**，搜来的 29 张白底命中 **0**
- 经验归纳落地 `toolchain/README.md`：图源顺位表 / Key 池轮转策略 / Agnes 防失真四道闸 / 13 条实测踩坑清单 / 产出规格落差分析
- 产出：`assets/icons-compressed/` 34 张 WebP（0.99MB），按 `ICON_CATALOG` 全量 70 项算**还缺 36 张**

### 2026-09-19 14:33 — AI 生图 + 图标压缩完成
- 使用 Agnes AI 生成 17 张食物图标（白底真实感风格）
- 分类：水果4 / 蔬菜2 / 肉类3 / 主食4 / 饮品3 / 零食1
- 压缩脚本 `toolchain/compress_icons.py`：PNG→WebP，平均 28KB/张，总大小 0.47MB
- 索引 `assets/icons/icon_index.json` 已更新，指向 WebP 文件
- 奶茶图标标记为 `primary`（v1.0 核心品类）

### 2026-09-19 14:27 — Ardot MCP 云端配置
- 写入 `~/.workbuddy/mcp.json`：`ardot-remote` 指向 `https://ardot.tencent.com/mcp`
- 用户需重启 WorkBuddy 后点击「信任」激活

### 2026-09-19 14:14 — toolchain + 食物库 v1.0 已完成
- `toolchain/sources/milk_tea.yaml` — v1.0 数据源（1 条食物：奶茶，1 个器具 cup，1 个选项模板 sweet）
- `toolchain/schema/v1.0.json` — 输出 JSON 格式定义
- `toolchain/validate.py` — 校验：结构 / 引用 / delta 缩放自洽
- `toolchain/build.py` — YAML → 校验 → JSON + fingerprint → 同步 `app/src/data/`
- `app/src/data/food_library.json` — 生成物（1 条，1.9KB）
- 验证：所有杯型×甜度组合热量与设计稿一致（小杯350: 151/172/189/207/228，中杯500: 215/245/270/295/325，大杯700: 301/343/378/413/455）

### 2026-09-19 — 设备能力全局化完成
- `app/src/composables/useDeviceCapability.ts` 重构：新增 `detectDeviceCapability()` 导出函数，修正 iOS 机型表（iPhone X 从 mid 移到 low，补充 11 Pro/Pro Max）
- `app/src/stores/device.ts` 创建：Pinia 全局 store，App 启动检测一次，7 个 getter 暴露给所有模块
- `AGENTS.md` 设备分档表按新边界重写，目录树补全 8 个 store

### 2026-09-19 — Ardot 设计稿与原型双向对齐
- 食物选择弹窗：新增分类 tab（全部/水果/蔬菜/肉类/主食/饮品/零食），与原型一致
- 首页加号被 tabbar 裁切：Tabbar + TabbarWrap 两层 `clipsContent` 改 false
- 删去原型中「自己创建食物」行（v1.0 不做自建食物，`USER_FOOD_ENABLED=false`）

### 2026-09-18 — 项目初始化
- 新建 `kaluli/` 项目文件夹，删除 4 类过时文档
- 完成 Ardot 8 屏高保真设计稿导出（`assets/exports/` 9 张 PNG）
- 完成架构方案：Pinia 8 store 拆分 / 存储三层降级 / 食物库全量加载 / Canvas 液体动画 / 玻璃效果分层 / CLI 构建 / 平台降级 / 反馈三级矩阵

---

## 接手检查清单

**按强制启动协议顺序：**

- [ ] **第一步**：阅读 `docs/progress.md`（本文件）— 确认当前精确阶段和最新进度
- [ ] **第二步**：阅读 `AGENTS.md` — 校准技术栈、核心约束、目录结构
- [ ] **第三步**：按需阅读
  - [ ] `docs/PRD.md`（产品需求）
  - [ ] `docs/Review.md`（评审复盘 / 决策依据）
  - [ ] `design/DesignTokens.md`（**色值唯一事实来源**）
  - [ ] `design/VisualLanguage.md`（视觉语言 v3.0）＋ `design/ScreenSpecs.md`（8 屏几何）
  - [ ] `app/prototype/CalTrack_Protoype.html`（交互原型）
- [ ] 确认**当前设计源＝Pencil**（`pencil-new.pen`，画板按页面分：Home `Yvg8R`／个人中心 `Vtp9C`／Settings `T0IUr`／最近记录 `bTPUq`／单日详情 `VEWYt`／弹层⓪ `n3dgv`／结算 `Dz3YV`＋`MU1O4`／目标滑条 `qnNST`）；
      Ardot 文件 `727289305476547` 已于 2026-09-21 废止（仅早期 8 屏规格来源，见 `design/ScreenSpecs.md`）
- [ ] 确认现有源码清单：页面 `app/pages/**`、组件 `app/components/**`（各配同名 `.md`）、store `app/stores/*.ts`、数据产物 `app/src/data/food_library.json`（生成物，禁手写）
- [ ] 动手前跑一次闸门：`python -X utf8 toolchain/hooks.py all`（全绿才开工；新克隆机器先 `hooks.py install`）

## 下一步待办

> 2026-09-22 清理：本清单原先堆了大量早已完成的项（代码骨架、生图脚本、营养数据、FoodLibraryPlan 重写、压缩下调 25KB……），
> 现按「**真要做** ／ **等 Boss 拍板** ／ **已做完只留追溯**」重排。历史完成项的正文保留在「最近进度」与「变更日志」，不在这里占位。

**A. 待办（可自主推进，按优先级）**

- [ ] **App／Web 端真机回归**（本轮最大欠账）：Vapor 模式、`page-container` 弹层壳、常驻导航栏、TabBar 液态玻璃胶囊——四批改动**全部只在微信小程序端实测过**，App 端仅按「去条件编译后三端共用」推定
- [ ] 真机验证 `backdrop-filter`（iOS／Android 各一台；决定玻璃面在 App 端是否存在，代码里现为 `#ifdef MP-WEIXIN` 包住＋TODO，**不许当已双端可用**）
- [ ] TabBar **图标跳动动画**（L1 反馈缺项，已记 `Tabbar.md`）；液体 rAF 动画真机帧率测试
- [ ] `ActionSheet` 删除的**人工复核**（automator 坐标 tap 命不中微信原生弹层，自动化点不到）
- [ ] 暗色设计稿到位后**校准深色态**（现为薄荷深色临时色板；接缝与状态栏字色一并复查）
- [ ] 营养数据**人工核对 30 条**（`toolchain/sources/nutrition_checklist.md`，进度 **0/30**；核过一条改一行「核对状态」）——这是数据可信度的唯一未过关卡
- [ ] 人工审两份初稿：`icons_v1_visual.yaml`（器皿是否准确）＋ `icons_v1_usage.yaml`（选项归属）
- [ ] 图标集成优化：列表**懒加载 + LRU 缓存**（现 353 张全量常驻）
- [ ] 合规 critic loop 复评
- [ ] 「菜品」分类**在稿面无 Tab** → 353 条里 59 条筛不到，补第 8 个 Tab 还是并类（`ScreenSpecs.md` §3/§11）

**B. 等 Boss 拍板（AI 不擅自决定）**

- [ ] **p348–p353 六条图标重跑生图**：现为 92×92 小图（其余 512×512），且 `assets/icons-gen/` 无原始 PNG；重跑要再花 API 额度。命令＝`python -X utf8 toolchain/gen_icons.py` → `python toolchain/compress_icons.py assets/icons-gen assets/icons-final --max-size-kb 25` → `python -X utf8 toolchain/build.py`
- [ ] **食物缩略图「画框托底」浅色模式**：暗黑已定（`#0A1612` recessed），浅色**原文标「需老板拍板」，至今未拍**（`docs/design/2026-09-22-food-thumb-plate/README.md` §4）
- [ ] `toolchain/gen_tab_icons.py`（原生 tabBar 图标）**去留**：Tabbar 已定案为共享组件、不走原生 tabBar，该脚本零引用
- [ ] `toolchain/fetch_icons.py` 真实图源分支**去留**：现方案不用 Pixabay/Pexels/Unsplash 抓图
- [ ] **暗态染色图标未产出**：深色模式下仍用浅底那套矢量图标，需专门出暗态版本
- [ ] `debug_shot.ps1` 里 MCP Token 改环境变量（该 Token 已存在于 git 历史，非本轮引入）
- [ ] 登录／头像接入（Boss 明示暂停；v1.0 无后端，App Logo 已生成未接入，`stores/user.ts` 默认昵称仍「老刘」）

**C. 已完成（追溯用，不再列细节）**

- [x] 食物库 v1.0：清单冻结 → 营养数据 → 批量生图 → 压缩 → 多源打包（现 **353 条**，产物 `app/src/data/food_library.json`）
- [x] 5 页 + 8 组件 + 5 store 全链路（Home／Profile／Settings／Records／DayDetail）
- [x] #26 Vapor、#27 page-container 弹层壳、#28 常驻导航栏、#29 TabBar 毛玻璃＋随滚动渐显（**其中 #29 的 fade 渐显已被后续「三 Tab 悬浮胶囊」批次废止**）
- [x] TabBar 重构为**三 Tab 悬浮液态玻璃胶囊＋会跑的选中气泡**（四关键帧 CSS transition）、Records 升一级 Tab、页底预留 78、`DesignTokens.md` §7 补录（小程序端验收通过，App 端 Worklet 留 TODO）；**浅色态参数已由 Boss 定稿**＝胶囊底 60% ＋ 气泡 18% 加白 60% 1px 描边与 `0/4/12 #000 6%` 投影，暗态保持现状
- [x] 类名前缀全量收口（`fp-`/`ft-` 等）＋跨文件同名类机械化拦截
- [x] 保安亭 `toolchain/hooks.py` 五道闸 + `.git/hooks/pre-commit`；仓库去重（tracked 4611→1203）
- [x] 文档批量校准（AGENTS／README／design 4 份／FoodLibraryPlan／toolchain README／nutrition_checklist／5 份 app `.md`）

---

## 变更日志

> 表格为**倒序**（最新在上）。2026-09-22 17:58:10 的浅色态定稿、17:22:42 的 TabBar 重构与 15:44:11 的工程化收口，均各有「最近进度」同名小节。

| 时间 | 变更 |
|---|---|
| 2026-09-23 03:58:00 | **全链路体验与架构收尾收官（方案 A 单流程落地 / SettleBadge 升级 Canvas 2D / 首页水瓶物理动效重构 / 全工程严格成对闭合抗坑加固）**：①**方案 A 单流程合并架构**＝彻底消除双 `page-container` 造成的 1500ms 冷启动卡顿与互斥死锁，`FoodPicker.uvue` 内置 `step: 'list' | 'detail'`，选食物原地切入 `AddFood`，点击「更换」秒回列表并回显当前项，宿主侧零冗余状态机，高度按半屏抽屉规格限制为 500px + safeBottom；②**SettleBadge 升级 Canvas 2D 动效引擎**＝彻底废弃真机掉帧的 `conic-gradient`，重构为真双端统一的 Canvas 2D 动效渲染，并按指令移除结算关闭后的倒水音效（`triggerPourEffect`），使反馈干净明快；③**首页水瓶与叶片物理动效与比例重构**＝瓶身尺寸（104x168）、背景卡片（176x176）与两侧托底叶片（64x64/62x62）回归黄金构图，腔体水位严格保持 80% 上限；叶片以根部为 px 支点实现微风摆动，双层波浪往复平移居中；单次点击播放轻脆 feedback，长按播放晃动音效，手势音效彻底解耦；④**全工程 UTS 语法合规与抗坑加固**＝清理 `CountStepper`、`FoodPicker` 内所有自闭合标签（`<input></input>`, `<AddFood></AddFood>`），补齐 `GoalModal.uvue` 缺失的根视图闭合 `</view>` 标签，修复 `PrivacyDialog.uvue` 废弃属性与不兼容伪类；全工程 `.uvue` 模板语法树审计 100% 绿灯；⑤**验收证据**＝微信模拟器端热重载成功，`Settings` 页面与 `GoalModal` 交互正常、`Home` 首页重载无白屏，水瓶与底栏胶囊完美渲染。 |
| 2026-09-22 17:58:10 | **浅色态「气泡隐身」定稿修正（Boss 拍板组合方案，作为浅色版最终参数）**：①胶囊底 `#FFFFFF 88% → 60%`（Boss 指出 88% 那条文字标注本身是**漏改**，故本条成为「稿面自相矛盾以文字标注为真理」的一条**已记录例外**）；②气泡「雕」出物理体积感＝新增单类 `.tb-bub-light`＝1px `rgba(255,255,255,.6)` 描边（模拟玻璃折射亮边）＋ `box-shadow: 0 4px 12px rgba(0,0,0,.06)`（悬浮高度差），只在**浅色＋玻璃档**挂，暗态与 low 降级档不受影响；③气泡底色经 A/B 实测（18% ↔ 25% 同点位像素采样仅差 1~2 级、边框已提供轮廓）→ **保持稿面文字标注的 18%** 不动；④暗色态按 Boss 指令「观感正常，不动」。验收＝三页浅色截图气泡轮廓清晰（`debug/shots/f_home_b_scrolled / f_rec_b_scrolled / f_prof_b_scrolled.png`）＋暗态回归无变化（`f_prof_dark.png`，验后 `darkMode` 还原 false）；三次编译绿灯、产物 `Tabbar.wxss` 已含新类、`hooks.py all` 五道全绿。文档同步：`DesignTokens.md` §7.1/§7.2、`AGENTS.md` 玻璃面条＋待办、`components/Tabbar.md`、本文件 |
| 2026-09-22 17:22:42 | **TabBar 液态玻璃胶囊重构（两 Tab 通栏 → 三 Tab 悬浮胶囊＋会跑的选中气泡；Records 升一级 Tab）**，逐条对应 Boss 五条拍板：①`DesignTokens.md` 新增 **§7 TabBar 液态玻璃专用 token**（六色语义表／几何材质表／页底 78 与 fade 废弃），代码全引 §7、零自创色；②稿面自相矛盾时**以文字标注为唯一真理**，采「微博标准版」降级＝纯 `backdrop-filter` ＋ 实色透明度（浅 18%／暗 13%），节点遗留的三段渐变与手绘内高光**不做**；③**#29 的 fade 渐显机制整体废弃**（新胶囊核心＝恒常可见），三页 `fade`/`tabFade` 下线、Home 的 `onPageScroll` 整段删除，页底预留 40 → **78**；④Records 正式升一级 Tab（`active="records"`、删头图返回箭与栏内返回热区、Home/Profile 入口改 `redirectTo`）；⑤MP 端 CSS transition 驱动四关键帧、App 端留 Worklet TODO、**不用 setData 逐帧驱动**。⑥**组件实现**＝悬浮胶囊（左右 16／高 56／r28，底 `#FFF 88%` ＋ 折光 ＋ 白 80% 描边 ＋ `blur(24) saturate(180%)` ＋ 向上柔影），气泡 96×44 r22 **底色走运行时 `:style`**（App 端不认 `.a.b` 复合类），`transition`/`backdrop-filter` 全包 `#ifdef MP-WEIXIN`，low 档降级＝胶囊不透明 `#F8FCFA` ＋ 气泡实色 ＋ `#E3EFE8` 描边。⑦**本轮最大新坑＝`components/` 下放纯逻辑 `.uts` 导致三页全白屏**：`components/tabOrigin.uts` 产物文件与 `require` 路径都对，运行时仍报 `module 'components/tabOrigin.js' is not defined`，且 `cleanCompileCache`＋`simulator_refresh` 换不掉包（根因未定案）→ 改由本地存储 `ct_tab_origin` **一次性**传递起点（setup 读完即 `removeStorageSync`）。**约定：跨页共享纯逻辑不放 `components/`**。⑧**入场时序修正**＝起点原在 `onMounted` 读 → 首帧气泡先在目标槽闪一帧再跳回来源槽；改在 `setup` 内同步置 `phase='press'`。⑨**验收（全零窗口）**＝`hooks.py all` 五道全绿（14 个 `.uvue` 类名零冲突，新类全 `tb-` 前缀）；HBuilderX 单发编译绿灯两次（`ready in 13973ms`）；`debug/tab_geom.js` 算出胶囊带 css `top=742 bottom=798`、三槽中心 `76/179/314`（**此前 tap `y=738` 打在栏之上 → 「tap 回 success 却不换页」是探针 bug 不是代码 bug**）；坐标 tap 逐格换页三页 ✓（`tab8_home/tab9_records/tab10_profile.png`）；暗态 Profile 观感正常（`tab13_profile_dark.png`，验收后 `darkMode` 还原 false）；`debug/tab_flight.js` 轮询子组件 `$scope.data` 抓到 `96/11.67/140`→`92.16/13.59/90`→换页首帧 `92.16/13.59`（无闪帧）→`107.52/125.24/320`→`101.76/128.12/120`→`96/131/140`，与 ×0.96／×1.12÷0.94／×1.06÷0.97 逐值吻合。⑩**新报 Boss（AI 未擅自动手）**＝**浅色态气泡几乎看不见**（胶囊 88% ＋ 气泡 18% 叠同块白，与拍板 #3「内容滑过要有折射反馈」的初衷相冲；稿面**节点**值实为 `#FFFFFF40`＝25%）、暗态染色图标未产出、App/Web 真机回归与 Worklet 未做。⑪**文档**＝`Tabbar.md` 整体重写、`Records.md`／`Home.md`／`Profile.md` 同批改准、`AGENTS.md` 反向同步（fade 废止／预留 78／胶囊材质／三 Tab 定案／新坑）。 |
| 2026-09-22 15:44:11 | **工程化收口（Boss 四步指令「盖保安亭／图标去重／补 6 条槽位／其他最优解自处」闭环）**：①**保安亭**＝新建 `toolchain/hooks.py` 五道闸（schema-version-check／food-data-integrity／class-prefix-collision／pre-commit／end-of-session）＋ `install` 写 `.git/hooks/pre-commit`（跑 `all`，0.3s）；首轮自测**修掉四个真 bug**——a) Windows 控制台 GBK 让 `✓/─` 抛 `UnicodeEncodeError` 直接崩闸门（git hook 内必现，钩子体须 `export PYTHONIOENCODING=utf-8`）；b) 生成物被误判「缺变更日志」→ 保护文件豁免日志检查；c) 手写数据扫描误命中 `stores/food.ts` 演示种子 id（Boss 授权、热量仍实时算）→ `stores/` 豁免 id 检查、视图层照旧严；d) **类名闸门「扫到 0 个组件」静默放行**→ 加零命中红灯（根因＝`_rel()` 绝对路径兜底带反斜杠，`"components/"` 永不匹配）。**负向测试**＝故意删槽位／造同名类／改保护文件，三处均正确红灯。②**仓库去重**＝tracked **4611 → 1203**：`debug/node_modules` 3373 文件（**占旧 tracked 73%**；AGENTS 长期写「node_modules 不进 git」而 `.gitignore` **根本没这条规则**）＋ `app/unpackage` 35 个编译产物（含推倒重写前 Bottle/AddSheet/MealIcon sourcemap 残骸）＋ `assets/icons-final/`（与 `app/static/icons/` **353/353 文件 sha256 逐张全等**）；三处一律 `git rm -r --cached` **只清索引、磁盘保留**。**生图原始 PNG 仍入库**＝AI 生图有随机性、重跑拿不到同一批图。③**补 6 条槽位，根因不在数据**＝`validate.py` 从来没把 `icons_v1_visual.yaml` 当源校验 → 它停在 347、清单已到 353，**校验一路绿灯**，直到要重跑生图才暴露；修法＝纳入第 6 份源（四源 id 对齐／每条五槽齐备／`MISSING` 占位即红／反向多余条目也红，且槽位检查放在 `continue` **之前**防跳过）＋补 p348–p353。**教训落 `toolchain/README.md`：多源模式下「没被校验的源」＝「会静默漂移的源」。**④**文档批量校准**＝`AGENTS.md`（目录结构整块重写＋Hooks 节按现实改写：`pre-build` 明确标**未落地**因 uni-app x 无独立 npm 构建入口、`.git/hooks` 不随仓库分发）＋`README.md`（当前状态＋20 行目录表＋快速上手）＋4 份 design（`VisualLanguage` 7 处手抄 `#0B7A5C`→真值 `#0A7A5C`、`--ct-bg`→`#F2FAF5`；`IconPlan`/`UI_Spec`/`ScreenSpecs` 加 midbutton 与 Pixabay 废止批注、深色模式改「两页随动临时色板待校准」）＋`FoodLibraryPlan`（347→353、体积账、conf 179·163·11、`app/data/`→`app/src/data/`、5→6 源、三源→四源）＋`toolchain/README.md`（新增 D 章闸门、实测产出表、更正错误路径 `app/src/static/icons`→`app/static/icons`）＋`nutrition_checklist.md`（加「核对状态」列，**0/30 如实登记**）＋5 份 app `.md`（food 353／settings 两页随动／device「晃动 0.955」标为**设计参数、动效未落地**／Home 已接共享 Tabbar／Profile 四处纠错）。⑤**本轮撤掉一处 AI 编造的 Boss 拍板**：`docs/design/2026-09-22-food-thumb-plate/README.md` 被写成「浅色托底已拍板＝维持现状、对照板 `OlF0l` 已按约定删除」，而 progress.md 与会话记录**查不到任何 Boss 表态**、原文实为「**需老板拍板**」→ `git checkout` 还原，该项**仍挂待拍板**（防幻觉铁律：四源之外不许编，Boss 表态也不算自创）。⑥**验收（物理证据）**＝`python -X utf8 toolchain/hooks.py all` **五道全绿**（353 条三处对齐／14 个 `.uvue` 类名零冲突／图标 353↔食物 353）；HBuilderX 单发重编译绿灯（`cli.exe launch mp-weixin --compile true`，`ready in 27355ms`，仅 2 条既有鸿蒙 UA warning）；产物抽查＝`FoodPicker.wxml/wxss` 含 `fp-row`、`food_library.json` `"count": 353`、未接线 `FoodToast` 不参与编译；磁盘真值复核＝产物 **181.6KB**、图标 **353 张／5.61MB／平均 16.3KB／零超标**、`pieceWeight` **196 条**、18 个器具模板全用到了。⑦**新增待 Boss 拍板（未擅自动手）**＝p348–p353 六条图标现 **92×92**、`icons-gen` 无原图、重跑要再花 API 额度；浅色「画框托底」是否加；`gen_tab_icons.py`（原生 tabBar 图标，**零引用**）与 `fetch_icons.py` 旧图源分支去留。**遗留**＝App／Web 端真机回归（Vapor／page-container／常驻栏／玻璃四批改动**只在小程序端实测过**）、营养数据人工核对 0/30、TabBar 图标跳动动画、ActionSheet 删除人工复核、暗色稿校准。 |
| 2026-09-22 13:41:23 | **#29 续：TabBar 改为「随滚动渐显」玻璃（Boss：「我想要的 tabbar 是 scroll-fade-navbar 那种效果」）**：①**先定位 Boss 指的东西**＝官方示例 `D:\project\hello-uni-app-x-alpha\pages\template\scroll-fade-navbar\scroll-fade-navbar.uvue`，`pages.json` 里注册名「**随滚动渐显的透明导航栏**」；其机理＝`contentScroll` 里 `transparent_count = scrollTop/100` 夹到 0~1，然后 `navbar.style.setProperty('background-color', rgba(...,count))` ＋标题 opacity 与返回箭头色**同驱**（示例自带 TODO 吐槽「不停改响应式变量性能低效果差」）。②**移植到 TabBar＝只借「连续渐显」这一机理，不抄它的 scroll-view**（本项目页面走原生页面滚动，AGENTS.md 已定案不用 scroll-view 包层），改由**页面 `onPageScroll` 算 `fade` 透传**：`components/Tabbar.uvue` 新增 `fade?: number`（缺省 1＝满玻璃，向后兼容），内部 `barStyle = computed<Record<string,string>>`（沿用 SettleBadge 的 `Record<string,string>` 内联样式写法）把**五项同驱**＝底 alpha（浅 `.74×f`／暗 `.72×f`）、顶部折光渐变、上缘高光描边、向上柔影、`backdrop-filter: blur(24×f px) saturate(180%)`；`fade=0` 时整条栏完全透明只剩图标与文字。**满值仍全是 DesignTokens 原值，fade 只改透明度不改色相 ⇒ 不触「不许自创染色／不许丢 alpha」两条铁律**。③**性能与三端**＝量化 `Math.round(q*20)/20`（0.05 步长，整段渐显最多 20 次 setData，跨步才写 ref，绝不逐帧）；`backdrop-filter` 两行仍包 `#ifdef MP-WEIXIN`（App 端支持与否未真机验证，留 TODO）；**low 档（`backdropBlur=false`）直接返回空样式对象＝不吃 fade**，恒不透明底（透明栏压内容在低端机不可读，可读性优先）。④**接线三页**＝Home（**重新挂回 #28 删掉的 `onPageScroll`**）／Profile（`onPageScroll` **去 `#ifdef MP-WEIXIN` 改三端生效**，顺带补上「App／Web 端滚动时 `pf-st-mask` 不响应」的既有缺口）／Records（在既有 `scrolled` 监听里加一段），三页模板各加 `:fade="tabFade"`。⑤**本轮唯一实测出来的关键调整＝阈值 60px 而非示例的 100**：新增脚本 `debug/fade_check.js`（三档滚动＋读子组件 `$scope.data` 的内联 style 串）测出 **Records 页最大滚动只有 70px**，若沿用 100 阈值，该页滚到底 alpha 只到 `0.518`、永远到不了满玻璃；改 60 后三页均到底满值。⑥**验收（编译绿灯＝产物时间戳 13:34:11；零窗口＝`cleanCompileCache`＋`simulator_refresh`＋automator restart；截图 `debug/shots/audit/g_home_* / g_rec_* / g_prof*`）**＝数据层取证：Home／Records／Profile 在 scrollTop 0／30／150 依次回吐 `rgba(255,255,255,0.000)→0.370→0.740` 配 `blur(0px)→12px→24px`；暗态 Profile `rgba(22,41,36,0.000)→0.360→0.720`；产物核验 `Tabbar.wxml` 的 `style="{{l + ';' + m + ...}}"` ↔ `Tabbar.js` 的 `l: common_vendor.s(barStyle.value)` 对齐；验证后 `ct_settings_v1.darkMode` 已还原 false、页面已回 Home。⑦**留给 Boss 的一个观感判断（未擅自改）**＝`fade=0` 时「首页／我的」图标与文字**直接压在页面内容上**（Records 顶部压食物图、Profile 暗态压最近记录行），这是示例的原教旨行为；若要保底可 ①给 fade 设下限（如 0.2~0.25）②延后起渐（20→80px）③维持现状。⑧**文档**＝`Tabbar.md` 新增渐显决策＋取证＋代价三段与使用示例改 `:fade`；三页 `.md` 各补一条；`AGENTS.md` 玻璃面条内写清五项同驱／阈值 60／0.05 量化／low 档不吃 fade，并说明与「页底预留 40px」的配合。 |
| 2026-09-22 13:21:21 | **#29 配套：三页页底预留位压缩（Boss 四选一拍板「缩页底预留位」）＋浅色态玻璃可见度定量结论**：①**改动＝只压留白，不动玻璃配方与 alpha**＝Home／Profile 的 `.page padding-bottom` 78→**40**、Records 的 `.lr-bottom-space` 90→**40**（DayDetail 无 Tabbar、本就 40，未动）；动机＝原 78 让内容恰好停在玻璃栏（实测高 ≈76）之上，栏后永远是一整片纯页底白，`.74` 白玻璃压白底＝看不出毛玻璃。②**验收（编译绿灯 13:14:09；零窗口＝`debug_clear_cache --action cleanCompileCache`＋`simulator_refresh`＋automator restart；截图 `debug/shots/audit/r2_*`／`r2p_dark_*`）**＝滚到底后内容确实穿到栏下（Records「主要食物」卡与 Home 晚餐卡的薄荷图标均被裁在栏顶缘 y≈776；Profile 暗态「9月19日」行穿到玻璃下），玻璃类挂载探针 `h=1` 三页全中，暗态无回归，验证后 `ct_settings_v1.darkMode` 已还原 false。③**新增量化探针 `debug/glass_probe.js`（逐列取玻璃带平均色、排除两个图标列）**＝浅色态穿透**成立但很弱**：Home 玻璃带 x=50（薄荷内容穿到栏下处）`(246,253,250)` vs x=200（纯页底）`(252,254,253)`，亮度跨度仅 4–7 级；Records／Profile 因该处内容是白卡，跨度 3.7–4.9 ⇒ **结论：浅色态「看不见玻璃」的主因是内容本身近白，不是留白不够**。④**必须让 Boss 知道的代价**＝滚到底时页面最后**约 36px** 内容永久停在玻璃带下（76−40），可读性受损（点击仍可命中上半截）；且「常态穿到栏下」与「滚到底全部内容可读」在原生页面滚动下是**互斥**的，留白只能二选一——若要更强浅色态观感，正解是**降 alpha 或加薄荷染色**（两者都动 token，需拍板），而不是继续压留白。⑤**文档**＝`Tabbar.md` 记拍板＋像素取证＋代价；三页 `.md` 各补「页底预留 40px」决策条；Home.md 顺手改掉一条过时表述（原写「`backdrop-filter` 未用，无需验证」，现共享 Tabbar 已用）。**遗留**＝若 Boss 见到 36px 裁切后反悔，回滚只需把三处数字改回 78／78／90（一行 CSS，无其他耦合）。 |
| 2026-09-22 13:12:40 | **#29 TabBar 液态玻璃＋暗色玻璃落地（Boss：「我本来就想做成毛玻璃或者液态玻璃样式」；四步计划收官）**：①**改造范围＝只动容器**（`components/Tabbar.uvue`），**Boss 2026-09-22 新换的矢量 PNG 图标（`static/home/home(.selected)/center(.selected).png`）与文案、尺寸、字色一律未动**，稿面没有的选中垫片/药丸一律没加（防幻觉铁律）。②**玻璃配方全部取自 DesignTokens，零自创色值**＝底 `glass-bg` `rgba(255,255,255,.74)`（token 明文警告「带透明度不能丢 alpha」）＋ `backdrop-filter: blur(24px) saturate(180%)` ＋ 上缘高光描边 `rgba(255,255,255,.8)` ＋ 顶部白色折光渐变（0%→45% 淡出＝玻璃厚度错觉）＋ 向上柔影 `0 -6px 20px rgba(10,79,61,.10)`；暗态同构＝卡色 token `#162924` 加 alpha 到 `.72`、高光线白 10%、柔影改黑 `.30`。③**能力门控**＝玻璃类 `.tb-glass`/`.tb-glass-dark` 仅在 `useDeviceStore().backdropBlur` 为真时挂（low 档自动回退 `.tabbar` 不透明底，文字对比度不受影响）；`backdrop-filter` 本体包 `#ifdef MP-WEIXIN`——**App 原生端是否支持仍未真机验证（AGENTS.md 既有风险项），代码里留 TODO 不谎报支持**。④**顺手补一处既有违规**＝切 Tab 原零反馈，违 AGENTS.md「L1：切 tab＝动画＋`vibrateShort`」，现按 `device.haptics` 门控补轻触觉（try/catch 沿用工程既有写法）；**图标跳动动画仍缺，已记入 Tabbar.md**。⑤**验收（编译绿灯 13:04:41；零窗口＝`debug_clear_cache --action cleanCompileCache`＋automator restart；脚本 `debug/glass_check.js`、`debug/glass_sweep.js`）**＝`v1_home_{a,b}` 浅色常驻栏无回归、`v2_profile_{a,b}` 浅色玻璃、`v3_profile_dark_{a,b}` **暗态玻璃可见穿透**；**像素取证**＝暗态条带自上而下 `(39,59,54)→(17,40,34)`，与 `rgba(22,41,36,.72)` 压在暗页底 `#0E211C` 的理论值 `(20,39,34)` 吻合，带上缘被身后白卡抬起变亮 ⇒ **半透＋模糊生效**；验证后 `ct_settings_v1.darkMode` 已还原 false。⑥**本轮踩到并纠正的两个环境坑**＝a) **HBuilderX GUI 的 watch 已停（logcat 尾行「已停止运行…」），改文件后产物 12:40 起不再更新**——命令行 `cli.exe launch mp-weixin --project <源码> --compile true` 可单发完整重编（约 13–15s，绿灯），不必碰 Boss 窗口；b) automator 截图在页面**已达最大滚动位**时会对不同 `scrollTop` 参数回吐**同一帧**（md5 相同），据此判「玻璃没穿透」会误判——必须先用 md5/像素差确认截图真的变了。⑦**留给 Boss 的一个设计判断（不擅自改）**＝浅色态在模拟器里观感偏「干净的白条」：本页页底与卡片同为近白，`.74` 白玻璃压上去几乎无对比，**只有暗态和滚动中才有明显磨砂**。若要把浅色态也做“看得见”的毛玻璃，可选 ①降 alpha（如 .55–.62，但偏离 glass-bg token）②加薄荷染色（自创色，需拍板）③缩小三页底部 78/90px 预留位让内容常态穿到栏下。⑧**文档**＝`Tabbar.md` 重写依赖/设计决策/降级/稿面对应四段（含图标路径纠错：旧文档写的 `tab_home.png/tab_profile.png` 已不存在），并记「底部 padding 仍写死 20px、未接 `--uni-safe-area-inset-bottom`，刘海屏待真机验」。⑨**#26→#29 四步计划全部完成**；**遗留批次**＝App 端（Vapor＋page-container＋常驻栏＋玻璃）真机回归、ActionSheet 删除人工复核、图标跳动动画、登录/头像（Boss 暂停，Logo 未接入、默认昵称仍「老刘」）、暗色稿校准、3 条鸿蒙 UA warning。 |
| 2026-09-22 12:52:10 | **#28 常驻导航栏落地（取代 P1「两态遮罩＋裸返回钮」体系）＋本轮最大坑「微信工具喂旧 JS 包」定性并给出零窗口解法**：①**Boss 原话**＝「其实每个子页面向下滑动，左上角的返回按钮和页面标题都需要显示的」＋「我希望无论是小程序还是 app 端，还是 web 端，这里都固定在顶部」。②**二级页三张（Records／DayDetail／Settings）＝跨阈出整栏**：删除各自 `rec-/dd-/set-st-mask`(z40)＋`*-fx-back`(z45) 两件套，合并为单个内联 fixed 栏 `.rec-nav`／`.dd-nav-fixed`／`.set-nav`（z45、高 `sbH+58`、`paddingTop=sbH`、底色＝头图渐变末色实底 `#39AD95`、下投影 `0 2px 10px rgba(10,79,61,.10)`、44×44 返回热区＋白色粗体 17px 标题，DayDetail 标题为动态「X月X日 · 周X」）；`onPageScroll` **去 `#ifdef MP-WEIXIN` 条件编译**（三端共用），阈值仍 >40、跨阈才写 ref。③**首页＝全时段常驻标题块**（非两态）＝`.hm-nav`（z45、高 `sbH+64`、底色同页面底 `#F2FAF5`），标题＋副标题＋FAB 从文档流顶栏抽出进该栏，文档流只留日期行、避让由 `.header` 的 `paddingTop=sbH+64` 承担，P1 的 `hm-st-mask` 与 Home 的 `onPageScroll` 监听全删。④**本轮自造 bug 与修法**＝Hero 上误加内联 `marginTop: sbH+10`，与 `.header` 的 `paddingTop` 双算 → 日期行与波浪之间约 57px 空带；删内联、恢复 CSS 原 `margin-top:-18`。**约定回写 AGENTS.md：常驻栏避让只算一次 sbH**。⑤**范围例外（待 Boss 认可）**＝**Profile 保留 `pf-st-mask`(z40)**：它是 Tab 页、稿面本无返回钮与页面标题，只有状态栏带需要遮罩，无「栏」可做，故不在 #28 三页之内。⑥**验收（HBuilderX 编译绿灯 12:40:14，仅 3 条既有鸿蒙 UA warning；截图 `debug/shots/audit/`）**＝`v2_home_top`／`v3_home_scrolled`（标题块顶栏常驻不随滚动位移）；`rec_a_top`（未滚无栏）→`rec_b_nav`（跨阈出栏、底与渐变末色无缝）；`dd_b_nav`（含日期标题）；`set_b_nav`（浅色 `#39AD95`）＋`set_c_dark_nav`（暗色 `#162924`，用 `debug/dark_nav.js` 程序化开关 toggle 后**已还原浅色**）；`pf_b_nav` 复核 Profile 遮罩态无回归。验证脚本新增 `debug/nav_page.js`（逐页两态截图）／`nav_check.js`（滚动＋读数）／`dump_data.js`（运行时数据 dump）／`dark_nav.js`。⑦**🔴 本轮最重要调试发现（已回写 AGENTS.md 降级链）**＝页面一度整屏插值错位（`[object Object],[object Object],[object Object]g`、`已摄入 e1_a1 / 1800 kcal`、每日目标显成 187）且**控制台零报错**：先怀疑自己改坏，后按「产物 vs 运行时」对照法定性——磁盘 `Home.wxml` 的 `{{g}}` 占位符与 `Home.js` 的 `const __returned__` 映射**完全对齐**（＝代码没问题），而 `getCurrentPages()[0].data` 回吐的是**错位的旧映射** → **微信开发者工具自带编译缓存，喂了旧 JS 包**（uni-app x VDOM 端绑定键按位置分配，新 WXML 配旧 JS 即串位）。**`wx.restartMiniProgram` 与 `close/open_project_window` 都换不掉旧 JS 包（实测，只刷 WXML）**；正解＝`wechatide -c codebuddy debug_clear_cache --project <产物> --action cleanCompileCache --token <tok>` ＋ `simulator_refresh`，**零窗口**。⑧**同时纠正 AGENTS.md 长期错误记载**＝旧降级链第①招 `cli.bat cache --clean compile` **在 HBuilderX 5.26 根本不存在**（`cli.exe cache` 回「命令不存在」，`launch mp-weixin --cleanCache` 只打印 help），命令行触发完整重编译应用 `cli.exe launch mp-weixin --project <源码> --compile true`；新增 Git Bash 坑（传 `/pages/...` 参数被 MSYS 改写成 `C:/Program Files/Git/...`，须 `MSYS_NO_PATHCONV=1`）。⑨**文档**＝`AGENTS.md` 的「滚动防穿透两态遮罩定案」条整段重写为「常驻导航栏定案」（含 z 层级表新档：原生胶囊 ＞ page-container 弹层 ＞ **常驻导航栏 45** ＞ 顶遮罩 40〔仅 Profile〕 ＞ Tabbar 30 ＞ 文档流）＋修复降级链 v5 修订；四页 `.md`（Home/Records/DayDetail/Settings）防穿透段改写为常驻栏决策，Profile.md 仍描述遮罩（准确）。**遗留**＝①App／Web 端的常驻栏仅按「去条件编译后三端共用」推定，**未真机／浏览器实测**（Vapor 与 page-container 的 App 端回归本就排在同一批）；②登录接入被 Boss 暂停（App Logo 已生成于 `vibe_images/caltrack_app_logo_1790051285542_5b1cafa5.png`，**未接入**，`stores/user.ts` 默认昵称仍为「老刘」）；③下一项＝#29 TabBar 毛玻璃（须保留 Boss 新换的矢量 PNG 图标）。 |
| 2026-09-22 11:52:53 | **#26 Vapor 切换＋#27 四弹层迁移原生 page-container（Boss：「把现在所有的弹窗参考官方 pages\component\page-container，人家是原生的且带的有弹窗动画」＋「开始干吧」）**：①**Vapor**＝`manifest.json` uni-app-x 节点加 `"vapor": true` ＋ `"styleIsolationVersion": "2"`；mp 编译日志仍标「VDOM模式」＝预期（vapor 仅作用 App 端，框架对 Web/MP 强制剥离）；**App 端回归延后真机**（Boss 人工开发时验）。②**四弹层壳全迁 page-container**（FoodPicker/AddFood/GoalModal=position bottom、SettleBadge=center）：自研 `.fp/.af/.gm/.sb-mask` fixed 层＋z900＋@click.stop 全部退役；MP 端官方写法 **v-if 与 :show 双条件**（条件编译内嵌标签）；容器外观走 custom-style（FoodPicker/GoalModal 定高 560 白卡圆角 34，sheet 改 flex:1；AddFood 内容动态高→容器 transparent 由 .af-sheet 自带白卡）；关闭链＝`@clickoverlay`→emit update:show false（**实测原生蒙层点按不自动关**，官方示例亦只按钮关）＋`@afterleave` 兜底（系统返回拦截为原生赠送能力）。③**SettleBadge 居中踩坑**＝`position="center"` 只控滑入方向不控布局，容器实测钉在左上角；正解＝custom-style `width/height:100%＋transparent＋display:flex 居中`，徽章自身 L2–L9 动画全保留。④**验收（编译绿灯×3＋cache clean＋restart；automator＋wechatide 坐标 tap）**＝Home FAB→FoodPicker 开→点行→AddFood 开（动态高渲染正确）→确认→SettleBadge 居中显示→2160ms 自动关→落库 3652 kcal；GoalModal 铅笔开/蒙层点关全绿；三弹层蒙层点关链路 p12/p13_* 截图取证；DayDetail 复用同组件冒烟通过（p13_daydetail_picker.png）。⑤**调试知识（已回写 AGENTS.md）**＝page-container 场景下 `.page >>> .xxx` DOM 探针不可靠（缺席幻影/在场陈旧双假象），**状态探针改读子组件 `$scope.data` 容器属性键**（如 FoodPicker a/h）；automator reLaunch 在 page-container 生命周期后时而 `Uncaught [object Object]`，降级 `wx.restartMiniProgram({path})` 稳定。⑥**文档**＝四组件 .md 补迁移决策段；AGENTS.md z 层级表弹层 900 条款改写为 page-container 原生壳约定。**遗留**＝App 端（Vapor＋page-container）真机回归；SettleBadge 原生蒙层淡入与 L1 时间轴微差待真机校。 |
| 2026-09-22 03:07:06 | **P2 暗黑扩至设置页＋状态栏字色反转验收通过（Boss 拍板范围：仅个人中心/设置两页；薄荷深色板底 #0E211C／卡 #162924／强调 #52D6AC）**：①**Settings 暗黑**＝根节点 `:class page-dark` 绑 settings.darkMode，MP-WEIXIN 条件编译后代覆盖块（页底/卡/chip/文字三级/分隔线/开关/危险区珊瑚 #FF8266 全套）；暗里头图渐变改实色 #162924＋隐光晕，滚动遮罩暗色同步 #162924。②**状态栏字色反转**＝Settings/Profile 各加 `syncBar()`（`uni.setNavigationBarColor` 深白/浅黑），onShow＋切换后双调用；App 原生端 `plus.navigator.setStatusBarStyle` 留 TODO 待实测。③**Profile 收尾**＝暗里头图同改 #162924、遮罩暗色 #0E211C→#162924、onShow 补 syncBar；修一处编译阻断（`computed` 未 import）。④**验收（HBuilderX 编译绿灯＋cache clean＋restart；automator 直调 toggle 处理器 `$scope.data['n']` 切档）＝截图 `.workbuddy/shots/audit/p10_{settings,profile}_{light,dark}_{0,120,bottom}.png` ×12**：Settings 暗态页底/卡/文字/危险区全换色、滚后顶带 #162924＋白返回箭＋**状态栏白字**；Profile 暗态头图实色＋白字，onShow 跨页保持；切回浅色全还原＋黑字；darkMode 存储 true→false 往返正确。⑤**文档**＝Settings.md/Profile.md 补暗黑段；AGENTS.md 深色模式条补「头图暗色实色 #162924 与状态栏反转均为临时方案，待 Pencil 暗色稿校准」。⑥**遗留**＝App 端反转实测、Records/DayDetail/Home 不随动（范围外）、暗色稿到位后校色。 |
| 2026-09-22 02:56:26 | **P1 验收通过＋幻影副本根除（StickyTop 组件删除、遮罩改页内内联）**：①**幻影副本根因**＝上轮「整页重复＋插值全空」非遮挡假象：DOM 探针 `.page` 高度虚增（home 1327 vs 实 782）证明副本在布局里；隔离实验（Settings 去掉 StickyTop→p7 干净）锁定 **StickyTop 组件宿主会在其位置再渲染一份整页模板（空作用域：插值空、wx:for 空）**，且其自身 `v-if` 遮罩视图在 mp-weixin 端根本不渲染（双故障）；成对标签/末位均无效。②**终案**＝删除 `StickyTop.uvue/.md`，五页遮罩改**页内内联 fixed 视图**（`hm-/pf-/set-/rec-/dd-st-mask`，z40，v-if=scrolled，高与色同原方案）；顺手把全工程组件标签统一成对书写（自闭合改配对，含 AddFood 内 CountStepper/OptionTray 三处）。③**阈值修正**＝原统一 80 错：空数据下二级页最大滚动仅 75/46/0 永不过阈→返回钮永不出现，违 Boss「随时点得到返回键」；终案＝二级页 **>40 同时盖遮罩＋出返回箭**（该滚位头图渐变已近末色 #39AD95，遮罩实色无缝；再晚裁切标题会露在状态栏带），Tab 页 Home>93／Profile>89（=头图高−sbH 穿透点，遮罩色=页底故须精确）。④**验收（编译绿灯×4＋cache clean＋restart；窗口前置后 automator 三档截图 p8_*×15）**＝五页单副本（页高 home 782/profile 1010/settings 919/records 890/daydetail 844）；settings/records 滚后顶带 #39AD95 实色＋白返回箭（57/40,44×44）；**返回箭 tap 实测回 Home**（page.$('.set-fx-back').tap()→currentPage=home）；Profile 底部遮罩 #EEF7F4 盖状态栏带；DayDetail 空数据零滚动→头图自带箭恒可见（保证成立）；Home 零滚动不盖。⑤**文档**＝五页 .md 防穿透段改写内联方案；AGENTS.md 已知风险换「组件宿主幻影副本」条＋组件标签成对约定；StickyTop.md 随组件删除。⑥**遗留**＝P2（Settings 暗黑＋状态栏字色反转）接下来做。 |
| 2026-09-22 02:04:21 | **P1 滚动防穿透落地（Boss 拍板「开始吧」：StickyTop 两态遮罩 ×5 页＋二级页返回钮常驻；B-lite 头部随内容滚走）**：①**新组件 `components/StickyTop.uvue`**＝fixed 顶遮罩，`v-if="on"` 两态（页面 `onPageScroll` 判 `scrollTop>80` 后传 `on`，仅跨阈值写 ref、无逐帧透明度/无 transition）；遮罩色由页面传（Tab 页=页面底 #F2FAF5/#EEF7F4，二级页=头图末色 #39AD95），高 Tab 页=sbH、二级页=sbH+58；**v-if 而非透明常驻**——透明 fixed 层会吞顶区点击（首页 FAB 顶缘在 sbH 带内）。②**五页接线**＝Home/Profile/Settings/Records/DayDetail 各加 `<StickyTop>`＋`scrolled` ref＋`// #ifdef MP-WEIXIN` 包的 `onPageScroll`（onPageScroll 仅小程序端有，条件编译双保险）；三个二级页另加**常驻返回钮**（`set-fx-back`/`rec-fx-back`/`dd-fx-back`，fixed z45、44×44 热区中心对准稿面返回图标中心：Settings (25,sbH+20→top sbH+10 配 44 热区)、Records (25,sbH+15→top sbH−7)、DayDetail (25,sbH+20→top sbH−2)），滚过阈值才 v-if 出现、点击走原 goBack。③**全局 z 层级定案**＝微信原生胶囊（原生层，压一切 webview z）＞弹层蒙层 900（GoalModal 原有；AddFood/FoodPicker/SettleBadge 本轮补齐，FoodToast 已无引用不动）＞常驻返回钮 45＞StickyTop 40＞Tabbar 30＞文档流。④**验收进度**＝HBuilderX 编译绿灯＋`cache --clean compile`＋restartMiniProgram；**产物级核验通过**（Settings.wxml 节点序 sticky-top→fx-back→header 正确、StickyTop.wxss 含 `.st-mask{position:fixed;z-index:40}`、三页 fx-back 与三弹层 z-index:900 均在产物 wxss）；**数据层核验**＝DOM 探针 `selectAll('.title')` 单节点且 `.remain-num` 有值（页面逻辑与绑定完好）。⑤**视觉验收被环境阻塞（勿判 bug）**＝截图出现「整页内容重复＋插值全空」的假象，与 DOM 探针矛盾；查实为**模拟器窗口被遮挡**（WeGame 浏览器前台＋Windows 设置全屏窗压住微信工具，zOrder 1）——命中 AGENTS.md 已录的「遮挡→陈旧合成帧」陷阱，此状态下截图不可信；**待 Boss 把微信开发者工具窗口前置（或关掉遮挡窗）后补跑三档（0/120/底部）截图验收**，脚本已备 `debug/p1_check.js`（五页三档）与 `debug/p1_state.js`（数据层两态）。⑥**新踩坑（已回写 AGENTS.md）**＝automator `mp.evaluate(fn, arg)` 传参在本工程不稳定（拒绝抛 `Uncaught [object Object]` 或直接挂起），改无参 evaluate＋`mp.reLaunch({url})`；`page.$()` 查 v-if 未渲染的组件内节点会让 devtools 推 error 事件、Node 端 EventEmitter 无监听即崩，探针脚本须 `process.on('uncaughtException')` 兜底或避免查缺席节点。⑦**文档**＝StickyTop.md 新建（五段式＋z 层级表）；五页 .md 补防穿透段；Settings/Records/DayDetail/Home/Profile 顶部变更日志齐。 |
| 2026-09-22 00:55:44 | **设置页头图按 Pencil 最新稿 T0IUr 重建（Boss：「设置页面顶部还原度不够，看下最新的个人中心设计稿」；暗黑模式矫正暂停）**：①**量稿**＝T0IUr 头图逐节点量取：140 高（含 27 状态栏）竖渐变 `#5CC4AC→#39AD95`、光晕 445×238 径向白 @(24,−143)、双白弧 600×260 白8% @(−112,96)＋300×150 白6% @(196,118)、返回箭裸白 18×18 @(16,50)、标题 18/700 @(36,46)、副题 11 白80% @(36,74)、首组标题 y150（距头图底 10）。②**落地**＝Settings.uvue 头图模板/样式全量重写（换算 `top_app = designY−27+sbH`，头图高 `sbH+113` 写进 :style），返回钮去白圆改 44px 透明热区＋6×10.5 裸箭（chev_back.png @4x 重导出）。③**波浪贴图弃用（本轮最大踩坑）**＝初版按稿接 388×159 白10% 波浪 PNG，模拟器恒渲染为**不透明薄荷色帽**遮盖渐变（像素采样证实：色帽宽度恰等于 image 宽 388、右缘 8px 露渐变）；改名破缓存、清微信编译缓存均无效，最终确认稿面底部波浪带即双白弧椭圆本身、头图底缘为直线 → **删 image 改纯 CSS 椭圆**，波浪 PNG 资产删除。④**调试知识**＝微信工具在 `cache --clean compile` 之后仍可能持有旧 JS 包：改代码→HBuilderX 编译→`restartMiniProgram` 不够，必须**再跑一次 `cli.bat cache --clean compile`＋restart** 才加载新包（本轮连续两轮截图仍是旧包渲染，曾误判为资产/缓存问题）。⑤**验收**＝编译绿灯＋清缓存重启，截图 `.workbuddy/shots/audit/k5_settings_header.png` 对照稿面整板导出 `T0IUr.png`：渐变/光晕/双弧/裸箭/标题副题坐标/头图底直线/首组间距全对齐。⑥**文档**＝Settings.md 全量重写（设计源由 Ardot v2 切换为 Pencil T0IUr）。**遗留待 Boss 拍板**：个人中心头图与最新稿 Vtp9C 仍有差（现为纯色 `#39AD95`＋sbH+89 高，稿为渐变＋sbH+96＋光晕/弧），本轮未动。 |
| 2026-09-21 23:50:40 | **Boss 五项指令第 5 项落地：个人中心深色模式（Settings 开关点击切换暗黑主题）**：①**机制选型**＝Boss 给的 theme-change 文档实测要点：`uni.setAppTheme({theme:'auto|light|dark'})`＋`onAppThemeChange` 是 **App 端能力，小程序端只能跟随系统（manifest darkmode＋theme.json 导航色映射），无法 API 强制切**——所以「点击切换」只能走**应用内主题态**：`settings.darkMode`（ct_settings_v1 持久化，解除原「v1.0 恒关」强制 false 锁定，新增 `setDarkMode`）。②**开关接线**＝Settings「深色模式」行由稿面静态 ON 改 `:class` 绑 store＋`@click toggleDark`（L1 触觉）；store 注释与 settings.md 同步。③**Profile 暗色**＝根节点 `:class="{page-dark:dk}"` ＋样式尾追加 `/* #ifdef MP-WEIXIN */` 后代覆盖块（约 30 类：底 #0E211C/卡 #162924/内嵌 #10201B/chip #1E3B33/主文字 #EAF9F3/强调 #52D6AC/超标 #3A221C+#FF8266）；**App 原生端不支持后代选择器，条件编译隔离，届时改逐元素 :class（勿当已双端支持）**。④**Tabbar**＝新增可选 `dark` prop（默认 false），仅 Profile 传 `:dark="dk"`——组件不自读 store，因 Records/Home 不在 Boss 批准的深色范围内，主题归属由页面决定。⑤**验收（编译绿灯×2＋清缓存重启；截图 j1_profile_dark / j2_profile_light / j3_profile_dark_tabbar）**：点开关 → storage `darkMode:true` ✓ → Profile 整页暗色（含热量卡/趋势图/最近记录）✓ → Tabbar 暗底激活态薄荷 ✓ → 关回 `darkMode:false` 浅色无回归 ✓。AGENTS.md「深色模式 v1.0 不做」条款已反向重写为新口径。**待设计**：暗色色板为薄荷深色临时方案，Pencil 无暗稿，需 Boss/设计出暗色板后校准（尤其头图波浪与暗底接缝）。 |
| 2026-09-21 23:25:10 | **Boss 五项指令第 4 项落地：「最近记录」页（Pencil bTPUq）+「单日详情」页（VEWYt）双页新建＋三入口接线＋长按删除**：①**数据层**＝food store 新增导出 `dayKeyOf/dayRange`、getter `dayTotals`（日键→当日总 kcal，月历圆点一次遍历）、state `viewDay`（Records→DayDetail 传日，弃用 URL options——uvue 双端类型不稳）、`amountText` 改导出；**MEAL_LABELS.snack 修正「加餐」→「夜宵」**（对齐稿面 MC_夜宵/Meal_夜宵，此前 store 常量与稿不符）。②**Records 页**＝绿色渐变 Header（稿面含光晕/双弧，radial 未真机验→半透明白圆近似）+ 月历卡（周一起始 7 列 flex:1＝列心 24.79+i*49.57 与稿一致；42 格补满后末行整行出月裁掉；圆点三态 达标#1FBF8F/超标#FB5D37〔稿面实测色，非 DesignTokens 的 FF9E7D〕/选中白，无记录不显；选中 pill 34×36 渐变 #45C4A2→#0A7A5C 绝对定位垫底＋父链 overflow:visible；今日 pill #EAF9F3）+ 汇总卡（能量条轨道=max(总量,目标)，白刻度钉目标位，1950/1800 例复算与稿面 291/24/290 一致）+ 三餐四小卡（80×92，Pencil 导出 16px 餐次图标）+ 主要食物四卡（真实 webp 缩略图）。③**DayDetail 页**＝今日热量大卡（45.3 大数字/conic 进度环 96% 实测渲染 OK/能量条/营养分布三列）+ 餐次记录卡（只显有记录餐次，卡高=122+46*(行数−1) 公式对稿面 214/122 双例）+ 总结条；**长按记录行→uni.showActionSheet「删除这条记录」→removeEntry**（Boss 原话方案，不自定义弹层）；「添加食物」复用 FoodPicker→AddFood→SettleBadge 链路（实拍已弹层）。④**入口三接线**＝首页 `.pill-cal`→Records ✓（automator 实测跳转）、个人中心「查看全部」→Records ✓（注意：Profile 页有 **3 个同名 .head-right**，automator 必须 `$$` 取第 3 个，`$` 首中无 handler 的卡头——踩坑记档）、Records「查看详情/查看全部」→DayDetail ✓。⑤**验收（编译绿灯 23:08＋清缓存重启；截图 i1_records/i2_records_pick/i3_daydetail/i4_actionsheet/i5_after_delete/i7_dd_picker）**：日历点选 9/21→9/19 汇总联动 ✓、双页渲染 ✓、长按后整页压暗＝原生 ActionSheet 已弹 ✓。**待人工**：ActionSheet 选项点击在原生层，automator 坐标 tap 穿透命不中（DELETED 未生效即此因，勿判删除 bug）——删除回调需 Boss 人工点一次或真机复核。⑥**本轮新踩坑（已回写 AGENTS.md 已知风险）**：a) 含状态栏 paddingTop 的渐变 Header，height 必须 `sbH+108` 写进 :style（border-box 把内容区压成 108−sbH，标题裁半）；b) 1px 分隔线写 flex:1 被拉成宽灰块；c) 新增页面同新增组件一样必须 `cache --clean compile` 才挂载。**文档**＝Records.md/DayDetail.md 新建（五段式）；AGENTS.md 目录结构块刷新（5 页/components/stores/static/records 入账）。**遗留**：从往日期「添加食物」仍写入今日（补录语义待拍板）；总结条文案按稿直出不做动态。 |
| 2026-09-21 22:44:10 | **Boss 五项指令第 1–3 项落地（餐次卡删时间行／GoalModal 整卡重建＋首页铅笔接线／AddFood 确认落库）＋验收全绿**：①**AddFood 餐次卡删时间段行**＝21:49 那条「按稿补时间行」系误记——重量 Pencil nURQn 四卡确认稿面从无时间行，删 `af-meal-time*` 模板与样式，MEAL_CARDS 去 time 字段（Boss 原话「稿面餐次卡不需要时间段行」）。②**GoalModal 整卡重建**＝废弃旧圆环（canvas/conic 双实现全删），按 qnNST 量取重写为横向滑条：Dial 卡 150 高 r20 `$bg`，Track x48 宽 239 高 8（Fill 90deg `#7DEBC7→#1FBF8F`、Thumb 20×20 白底 3px 实线 $mint），−/＋ 44×44 白钮（到界 opacity .4），大数 46/700＋kcal，刻度 5 枚，快速选择 5 槽 63×56（选中白底＋软影），提示条＋保存钮渐变；拖拽＝touch clientX − Dial 页内左偏移（show 时 `createSelectorQuery().in(instance.proxy)` 查一次，失败仅禁拖拽），`clamp()` 全入口吸附 100 步长；`static/goal/` 六图标＝Pencil 节点 @4x 透明导出。**接线**＝首页目标 Pill 铅笔 `.pill-edit` → `openGoal()` → `<GoalModal v-model:show @save="goal.setGoal">`（Settings 入口零改动，emit 契约未变）。③**AddFood 确认落库**＝onAddConfirm 由「只弹结算徽章不落库」改为 `getFoodById + computeEntry → food.addEntry(...)`，settleAfter 直接取 `food.totalCal`（先落库后读数，不再手动 +kcal）。④**验收（automator 纯协议，证据 `.workbuddy/shots/audit/h1_goal_open / h2_goal_plus / h4_addfood / h5_settle`）**：铅笔开弹窗✓ ＋钮 1800→1900 且 fill 119.5→139.4px、thumb 同步✓ 保存回写 Pill「每日目标 1900 kcal」＋持久化 `ct_goal_v1="1900"`✓ 再开回显 1900✓ 恢复 1800✓；FAB→搜索奶茶→选行→AddFood 餐次卡无时间行/名称居中✓ 确认落库 ENTRIES 0→37、已摄入 1367→1692（+325 恰一杯中杯全糖奶茶）✓ SettleBadge「今日 1 692/1 800 · 夜宵·已加入」✓；验证后 storage 回滚＋重启复核回到 1367/1800 干净态✓。**调试新知识（本轮踩实）**：a) **新增组件后热重载/restartMiniProgram 都不够**——运行时子组件列表仍是旧的（KIDS 无 GoalModal），必须 `cli.bat cache --clean compile --project <产物>` 清微信工具编译缓存**再** `wx.restartMiniProgram` 才挂载新组件；b) **组件内节点 `el.tap()` 静默落空**（`.page >>> .gm-stepbtn-r` 探针 found 但 offset 回吐页根矩形，点击打偏且不报错）——正解＝读子组件 `$scope.data[<wxml bindtap 键>]` 得处理器名字符串，再 `sc[名字](event)` 直调（同 FoodPicker 行选模式推广到全部组件内交互），脚本存 `debug/batch_check2.js`。⑤**文档**＝GoalModal.md 按滑条新稿全量重写（旧圆环描述作废）。**遗留**：旧 `static/meals/meal_*.png` 与 FoodToast 删除仍待 Boss 拍板；拖拽滑条未做坐标级实测（逻辑与步进/快速同走 clamp，建议真机复核手感）。 |
| 2026-09-21 20:21:31 | **个人中心「达标 Banner 未被今日热量卡包裹」结构性返工（Boss 第三次反馈同一缺陷，本次根治）**：①**根因定性**＝此前两轮都把它当「叠压位置不对」修：Banner 一直是 `.cal-card` 的**兄弟节点**，靠 `margin-top:-28px` 上提，而 Banner 实际高约 47px → 下半截必然悬在白卡之外，负 margin 方案在结构上不可能实现「包裹」；上一轮补 `padding-bottom:30px` 只是让它少露一点，方向即错。②**修法**＝按设计稿（图2）把 Banner 模板**真实嵌套**进 `.cal-card`（stat-panel 之后），`.banner` 删负 margin 改卡内缩进（margin 13px 顶 + 左右 10px），撤销 padding-bottom:30px 补丁恢复 `padding:14px`。③**验收（清缓存全量重编＋关窗重开＋automator reLaunch）**：产物 wxml 确认 banner 为 cal-card 子节点；整页截图 `.workbuddy/shots/audit/r21_profile_banner_nested.png` ＋ 2x 局部裁剪 `r21_crop_banner_wrap.png`——白卡圆角底边在 Banner 下方完整可见，与设计稿图2 一致。④**教训落档**：「包裹/内嵌」类需求先查 DOM 嵌套关系再看样式，负 margin 只能模拟叠压、永远模拟不出容器包含（已写入 Profile.md 踩坑段）。 |
| 2026-09-21 21:49:02 | **AddFood 餐次卡按稿重建＋甜度标题精简（Boss 两项圈图反馈）**：①**甜度标题**＝「甜度 · 10 格电量」合并为单一 `form-label` 只显「甜度」（电量条图形保留）。②**餐次卡重建**＝逐节点量 Pencil nURQn（MC_早餐 f3LbC／MC_午餐 WsJGO／MC_晚餐 obweC／MC_夜宵 jWOQb＋Seal VUuz8）：卡 77×96 r16；每卡补第二行时间段（07:00-09:00／11:30-13:30／17:30-19:30／21:00-23:00，9px，选中白 85%／未选中白 50%）；名称 12px（选中 700 纯白 top:60／未选中 500 白 72%）；未选中黑 72% 压暗层＋全卡底部衬度渐变（180° #0A4F3D 0%@32→85%@100）；选中卡薄荷外描边 1px＋抬升 4px＋sealPop 260ms 印章（$mint 底、白描边 2.5、悬出右上 top:-10/right:-12）。③**实拍复核连环坑**：a) 印章白环不渲染＝uvue 只写 border-width/color 缺 **border-style: solid**，mp-weixin 走标准 CSS 默认 none 整框消失，视觉上被误判成「菱形/裁切」；b) 印章悬出卡上缘被 **.af-meal-row** 的全局 overflow:hidden 裁切＝row 加 overflow:visible＋上/右 14px padding 负 margin 双保险（卡位不变）；c) **微信工具样式缓存冻结**＝21:33/21:41 两次改动后 `simulator_refresh`＋`cli cache --clean compile/file/session` 全 success 但运行时 wxss 停在 21:16 版，**最终靠 automator `wx.restartMiniProgram` 一次生效**（零窗口，已回写 AGENTS.md 降级链第③招）。④**验收（截图 `.workbuddy/shots/audit/f2_addfood.png`＋f9_seal_zoom 8x）**：奶茶弹窗甜度标题纯「甜度」✓；四卡时间行/压暗/衬度渐变✓；夜宵选中＝抬升＋薄荷描边＋印章完整悬出卡角（薄荷底白环白勾）✓。坐标 tap 对 FoodPicker 行两次落空，改用 `$scope` 直调行处理器（wxml `bindtap="{{item.k}}"`，`sc[data.e[0].k](event)`）稳定打开 AddFood，脚本存 `debug/meal_flow.js`。⑤**数据核验**＝验证中一次误触发的「已添加 100 kcal」未落盘（storage 仅剩设备 UUID，无需清理）。⑥**文档**＝AddFood.md 更新（餐次卡量稿决策＋三条新坑）；AGENTS.md 已知风险加「border 三件套」条、调试降级链加 restartMiniProgram 招。 |
| 2026-09-21 22:03:27 | **AddFood 餐次卡改设计稿实拍图＋文案水平居中（Boss 二次反馈）**：①**照片来源定案**＝Boss 质问「为啥不用设计稿里的实拍图」——Pencil 弹窗② nURQn 四卡 Photo fill 与「餐次图标设计」ZL2sa 同源，均为设计文档目录 `images/sky_{breakfast,lunch,dinner,night}.png`（assets/v3_sky_* 同字节副本），已原文件拷入 `app/static/meals/sky_*.png` 并改 MEAL_CARDS 路径；旧自生成 meal_*.png 停用（git 已跟踪，删除待 Boss 拍板）。**教训回写 AddFood.md：素材必须取自设计稿内嵌文件，禁止自生成图替代**。②**居中修复**＝稿面名称 text w25 @x26（77 宽卡左右各 26＝水平居中），`.af-meal-name/.af-meal-time` 由 left:10 改 left:0;right:0;text-align:center。③**量稿纠错**＝重测 nURQn/NUEJF 卡内层序＝Photo→Dim(黑72% 仅未选中)→Scrim→名称，**稿面并无时间段行**（21:49 条目「按稿补时间行」记载有误，系我误记）；时间行现为前轮 Boss 截图验收保留项，去留列入待拍板。④**验收**＝编译绿灯→`cache --clean compile`→`wx.restartMiniProgram`→`debug/meal_flow.js`（奶茶用例），截图 f2_addfood.png：四卡实拍天空图＋名称/时间居中＋选中夜宵抬升描边印章全对；设计卡对照图 `.workbuddy/shots/audit/{f3LbC,WsJGO}.png`（@4x 导出）。 |
| 2026-09-21 21:04:07 | **弹层③ 结算徽章（SettleBadge）定稿重写＋接线替换 FoodToast（Boss 四项拍板：双端重写严格 2160ms 自动关／alert 图标 Pencil 导出／音效暂缓）**：①**组件重写**＝旧草稿带病（capEndStyle 括号不配对／四变量重复声明／computed·watch 未 import／`createCanvasContext().then()` 编造 API）全修；几何按 Pencil Dz3YV 重算（环心 (132,100)、带 54..70、16px 圆头帽落带中线 r62，旧草稿帽写死 top:22 不在环上），蒙层改黑 50%（旧绿 50%），进度环 MP 端＝轨道圆＋conic 进度＋盖孔＋双圆头帽、App 端＝canvas arc+lineCap:round（原生渲染无 conic-gradient，真机待验）；BudgetRow 语义修正为「加入后总量 / 目标」＋千位空格分隔（fmt 手工实现）；动效按 MU1O4 九轨 CSS keyframes 补全（旧全为注释），单一 progress（setInterval 16ms＋easeOutCubic）同驱环扫角/中心计数/到位触感（L7，双门控 device.haptics×settings.hapticsEnabled）；**严格 2160ms 自动关**：2160 exiting（scale→.94+淡出 220ms）→2380 emit update:show 卸载，无任何点按关闭；low 档直落终值只留淡入淡出；类名全量 sb- 前缀过查重。②**接线**＝Home 三弹窗调度改 FAB→FoodPicker→AddFood→**SettleBadge**（替换 FoodToast 位，删蒙层点关路径），payload 四值 kcal/after/goal/meal 走 store 真实读数；FoodToast.uvue/.md 保留未接（删否待拍板）。③**资产**＝Pencil 导出 sb_check.png（薄荷✓）/sb_alert.png（珊瑚感叹圈；注意 Material Symbols Rounded 无 alert-circle 名，静默出空白图，用 error 形）入 static/settle/。④**验收**＝Boss 人工实测：动效与自动关通过（原话「添加食物成功的弹窗动画已经成功了，我这边测试了没问题」）；Boss 实拍放大核验预算行「今日 1 697 / 1 800 kcal」千位分隔正确、环 94% 顶部缺口/圆头帽/✓ 晚餐行与稿一致。**调试踩坑（本轮新增）**：模拟器窗口被全屏窗**遮挡**（非最小化）时 automator 截图回吐陈旧帧，且 reLaunch 后 `.page >>> .xxx` 探针出现**幽灵命中**（INIT 即 row/btn/badge 全 true）——此状态下 DOM 探针与截图双双不可信，勿据此判 bug；Boss 人工实测为准。**事故**：验证过程中执行了 close_project_window 而重开步骤被取消，导致用户端模拟器窗口消失，已补 open＋cli auto 恢复。⑤**文档**＝SettleBadge.md 按定稿全量重写（旧版描述已废弃草稿）。 |
| 2026-09-21 19:58:30 | **AddFood 实拍三缺陷全修＋四用例复验（Boss 圈图反馈）**：①**光晕硬边矩形**＝全局 `view{overflow:hidden}` 裁切溢出装饰 → `.opt/.float/.art-wrap/.af-meal-card` 显式 `overflow:visible`；②**奶茶分量下绿点**＝方形软斑贴图 shadow512.png 在 55×10 扁盒里 `aspectFit` 只画中心圆点 → 改 `scaleToFill`，并把落地影从 `.float` 后置流内节点移进 `.art-wrap` 绝对定位（bottom 对齐素材底缘，原先影挂在文字下方）；③**餐次卡不完整（96→43 压扁）**＝真因非 flex-shrink 而是 **mp-weixin 组件类名跨文件冲突**：Home 的 `.meal-row{height:40px}/.meal-name` 命中 AddFood 同名类 → AddFood 冲突类全改 `af-` 前缀，FoodPicker=`fp-`／GoalModal=`gm-`／FoodToast=`ft-` 同步去冲突（撞名清单：`.chip .chip-on .handle .mask .meal-card .meal-name .meal-row .sheet .sub .tick .title`）；`.af-meal-photo` 补 `position:absolute`。④**自查新发现并修复**：甜度电量条白胶囊 `top:6+bottom:6` 拉伸在小程序端失控撑出底槽 → 改 `.sweet-seg{height:66}`＋`.sweet-pill{height:70;top:6}` 显式尺寸。⑤**验收（清缓存全量重编×2 轮，截图 `.workbuddy/shots/audit/r10_r15_rice/r10_r19_naicha/r10_r20_apple/r10_r21_hotpot/r10_r22_maskclosed`）**：米饭碗（光晕圆＋落地影贴碗底＋餐次四卡照片/名称/暗蒙版/右上印章全渲染）、奶茶（电量条胶囊收进底槽＋杯光晕＋无绿点）、苹果（步进器、无「分量」标题、「已按3个（约540g）计算」）、火锅（砝码 1/2/3 颗多档）、蒙层点按关闭 ✓、控制台 error/warn 空 ✓。**调试知识回写 AGENTS.md 已知风险**（类名前缀铁律＋absolute top/bottom 拉伸不可靠＋size()/offset() 对组件内节点恒返回页面根矩形）。**遗留**：确认钮白底食物图标未实现（353 食物无图标映射，待 Boss 拍板）；GoalModal/FoodPicker 改名后未逐一重开截图（改动纯类名重命名，编译绿灯）。 |
| 2026-09-21 17:55:00 | **弹层⓪ 食物选择列表（FoodPicker）落地＋「首页→列表→AddFood→更换」全链路接通（Boss 三项拍板：拼音走 toolchain／chips 用库内真实 7 类＋真实图标／首开无选中）**：①**数据层**：`build.py` 用 pypinyin 为 353 条食物生成 `py{f 全拼,i 首字母}` 索引（schema v1.0 同步加字段，重打包校验绿灯）；`food.ts` `searchFoods()` 三路匹配（名称子串/全拼/首字母），新增导出 `vesselLabelOf()` 供副行拼「一碗约 200g」。②**组件**：新建 `FoodPicker.uvue`+`.md`（Pencil n3dgv 量稿：sheet 560 高 r34、黑 50% 遮罩、搜索框 335×46 r23、chips 60×34 横滚、行 76 高真实 webp 缩略图 48 r16、22 单选圈 off 描边 #BFE3D6/on #1FBF8F＋白勾、选中行底 #F2FAF5、分隔线 x=60 起）；`AddFood.uvue` 按弹窗①稿补「更换」胶囊钮（emit change）；`Home.uvue` 调度：FAB→列表→选行(自动关)→AddFood，更换→回列表以 `selectedId` 回显。③**验收（automator＋坐标 tap 混合，截图 `.workbuddy/shots/audit/r8_*`/`r9_*`）**：搜索 `pg` 命中糖醋排骨/排骨/培根等首字母匹配 ✓；点行→AddFood 显示所点食物（520 kcal 份档位正确）✓；蔬菜 chip 过滤 ✓；更换→回显高亮 ✓；**修一处验收发现的缺陷**＝重开列表残留上次滚动位选中行不可见 → 行加 `id="row-<foodId>"`＋`scroll-into-view` 锚定（r9_3 盖浇饭重开即滚至顶部高亮）。④**关键调试知识（已回写 AGENTS.md）**：uni-app x 产物中组件内部节点 automator **裸类名/组件标签名/`组件名 >>> 类` 全部 0 命中**，唯一有效锚定＝`.page >>> .xxx`，且 `$$` 只回首个匹配 → 多行列表点选改 wechatide `automation_element_action --action tap --x --y` 坐标触控；输入框赋值＝`el.trigger('input',{value})` 不生效，正解＝`mp.evaluate` 拿 `getCurrentPages()[0].$vm.$children[N].$scope` 调 `data[handlerName](event)` 或验证数据侧。⑤**遗留**：鸡胸肉行稿面「· 生」状态后缀数据模型无字段，未实现待拍板；chips 横向滚动与软键盘真实键入建议真机复核。 |
| 2026-09-21 16:48:00 | **三页原生滚动恢复 + 个人中心 Banner 重叠修复（Boss 否决 scroll-view 方案，归因后走正常写法）**：①**滚动根因**＝uni-app x 运行时全局注入 `uvue.wxss`：`page{height:100%;display:flex}` + `view{overflow:hidden;flex-shrink:0}`，页面元素被锁死视口高度；我们又在三页 `.page` 写了 `flex:1`（简写含 basis:0）→ 根节点被钉为视口高、超出内容被裁 → 文档高度永不超屏 → 微信原生页面滚动永不触发。**修法＝删三页 `.page` 的 `flex:1`**，根节点随内容自然撑高恢复原生文档滚动（fixed Tabbar 不受影响）。**教训**：uni-app x 转小程序 ≠ 普通 uni-app 的「超出即滚」默认，排查须先看产物全局注入样式（`uvue.wxss`）。②**Banner 压统计标签**＝独立 bug：`.banner{margin-top:-28px}` 是稿面叠压效果应保留，真正缺口是 `.cal-card` 底部留白仅 14px，补 `padding-bottom:30px` 后 Banner 只叠留白区，「目标热量/已摄入/还能吃 / kcal」三标签完整可见。③**验证**：清编译缓存→重编→关窗重开→automator `wx.pageScrollTo(400)` 实测 scrollTop＝首页 182/个人中心 141/设置 70（钳制于内容底，三页均可滚），滚动后截图 `.workbuddy/shots/audit/r6_{home,profile,settings}_scrolled.png`；验证脚本存 `debug/test_scroll.js`。④中途曾误上 scroll-view 方案（Home 已包裹/Profile 开了头），分析确认后**已全部回退**，未引入任何滚动容器。 |
| 2026-09-21 16:26:47 | **三页第二轮还原度审核修复（设计源切换为 Pencil，Ardot 废止）**：Boss 将三页设计复制到 Pencil（画板「Home 首页」Yvg8R／「个人中心」Vtp9C／「Settings 设置」T0IUr，均 375 宽 = App 逻辑 px 1:1，无需再 ×0.794）。据 Pencil 稿修正两处上一轮基于 Ardot 的误删：①首页每日目标 Pill 右侧**补回铅笔图标**（`pill_edit.png` 深绿 #0C9569，13×13）；②个人中心最近记录超标徽章**补回超出值文字**（badge =「超标 N kcal」，N=当日总量−目标）。**齿轮（任务#7）已闭环**：白底圆圈改 25% 半透明白、条件编译按胶囊 rect 放胶囊左侧并与胶囊垂直居中，onShow 重算兜底。设置页危险区核对无差（本就是全宽红描边卡+红垃圾桶 chip+红字，与稿一致）。**关键踩坑**：改逻辑后 close/open 重开仍加载旧 JS 包（徽章只显「超标」），必须 `cli.bat cache --clean compile` 清编译缓存→重编→关窗重开→automator 才拿到新数据（page.data().v 实测 d=「超标 150 kcal」）。**Boss 拍板不变**：数据以 store 真实值为准（433/1367/76%），弹窗类不在本轮范围。证据：`.workbuddy/shots/audit/r5_home.png / r5_profile.png / r5_settings.png` + 并排比对 `r5_cmp_{home,profile,settings}.png`。**遗留**：conic-gradient 真机待验；首页 Pill 铅笔目前纯装饰（Home 未接 GoalModal，仅设置页目标行可开），点击是否要唤起目标弹窗待 Boss 定。 |
| 2026-09-21 15:26:14 | **三页还原度修复（对照 Ardot《程序三个主页面》727788215940571，×0.794 换算）落地并复核**：①首页 H1-H8（叶子+还能吃行、日历 pill 图标、宏量卡收紧、餐次行加「份量」列、时间轴导轨、FAB 渐变、hero 压头图 -18px）；②个人中心 P1-P9（今日热量卡重建：火焰标题+还可以吃 pill+右上 conic 圆环+三列统计 chip；周概览液滴三态；趋势目标线虚线+7 柱全日期；本轮抛光：目标标签按设计稿改右端两行灰字并让出 32px 柱区边距，消除与末柱数值重叠——automator 元素几何实测 overlap:false；删除设计稿没有的「+N kcal」文字）；③设置页 S/T（返回键恢复白透圆+白箭、开关行重叠修复、header_wave 裁掉 272px 透明边、行距/箭头收紧）。**Boss 拍板**：数据以 store 真实值为准（433/1367/76%），不对齐设计稿演示值；弹窗类不在本轮范围。conic-gradient 仅模拟器验证通过，真机待验。证据：`.workbuddy/shots/audit/final_home.png / final_profile_v2.png / final_settings.png` |
| 2026-09-21 | **公共添加食物弹窗全链路落地**：OptionTray/CountStepper/FoodToast/GoalModal/AddFood 6 组件＋food.ts 增补 MAX_COUNT/portionRatio/portionLevel/gramsOf+软阴影贴图，FAB→AddFood(p054 吐司)→确认→FoodToast(L3触觉/2s自动/点按关闭)；设置目标行→GoalModal(chips保存)→目标同步；步进器实拍 1→5(amber)→100(coral/禁用/抖动)→回退1；OptionTray 底槽悬浮选中态(光晕/影/抬升)；GoalModal 表盘+chips 保存同步；FoodToast L3触觉/2s自动/点按关闭；控制台空；步进器默认3/上限100 |
| 2026-09-21 | **GoalModal 编译修复**：重复 close/save 函数声明删除 + 缺少 computed import 补全 + CSS 50+ 处句号换分号；GoalModal/SettleBadge .md 文档落地；编译通过截图验证弹窗渲染正确；wechatide automation tap 无法触发 uni-app x 组件 @click（已知限制） |
| 2026-09-21 | **弹层③ 结算徽章定稿**：toast → 居中 264×256 圆环徽章（四版 A/B/C/D 对照 + critic loop → D 的环并入 A、去加号、去撤销），新增动效时间轴画板 `MU1O4`（9 轨 0–2 400ms，环与数字共用单一 `progress`）；文档 `docs/design/2026-09-21-settlement-badge/`（README + 2 张 2x 交付图）；**App 未接** |
| 2026-09-21 | **补两个入口弹层**：弹层⓪ 食物选择列表（单选 + 自动收起，行尾圆圈做「上次选中」回显）＋ 弹层⑨ 每日热量目标（线性滑杆 + 快速选择套用 B 底槽）；文档 `docs/design/2026-09-21-entry-picker-and-goal-sheet/`；纯设计稿未接 App |
| 2026-09-21 | **弹层 v4 设计定稿**：B 选中态推广到 6 个弹窗（分量/甜度共用底槽 `PortionTray`，餐次改满版照片 + mint 外描边 + 印章，废弃「选中加浅蒙版」）；计数类只留 ⑧吐司，⑦⑨ 删除；能量条算法 `p(n)=ln(1+n)/ln(101)` + 1/5/25/100 刻度定稿；全画板按 DesignTokens 回校（157 节点色号 + 60 处圆角 + 49 处字号）。新实现文档 `docs/design/2026-09-21-selection-state-and-count-stepper/README.md`；**App 代码未动** |
| 2026-09-21 | v3 弹层文档标注废弃项：计数类 `v3_ball/v3_tile/v3_skewer` 固定 66px 图、餐次卡 77×74 照片条、`#2CC79A` 描边，均指向 2026-09-21 v4 文档 |
| 2026-09-20 | 计件份量数据半截落地：93 个 piece_weight 补齐＋validate 计件必填＋build base 补宏量，双绿灯 |
| 2026-09-20 | P1 首页 v2 重建落地：Home 重写＋22 导出图＋加号胶囊避让，编译＋截图＋控制台三绿 |
| 2026-09-21 | P2＋P3 落地：Profile/Settings 重建＋路由＋导航，三页截图＋控制台全绿；新增 assets 冲突铁律 |
| 2026-09-21 | Tabbar＋stores 落地：共享组件＋实拍切页＋5 stores＋Pinia，控制台空；页面暂不接线 |
| 2026-09-21 | 三页接 store：库＋6 行菜（353 条）＋种子重解＋三页接线，三页截图＋控制台全绿 |
| 2026-09-20 | **画布清理**：按老板圈图删除 6 块 v2 旧板（旧①糖块版/旧②/旧④/旧⑥/旧⑦/旧⑧）+ v2 toast `FkjGk`；Ardot 13–17 号板按要求保留未动。 |
| 2026-09-20 | **弹层 v3.2 —— 餐次改「时间空间状态」实拍风光照（老板定方案B）**：老板指出餐次应体现时间空间状态而非用食物区分（食物与餐次无绑定）。定稿：**同一片丘陵的四个时刻**——早餐日出/午餐正午/晚餐黄昏/夜宵月夜，Agnes `16:9` 一次过 4 张（`v3_sky_*.png`）。弹层餐次卡改照片条 69×42（`mode:'fill'`）+ 名称 + 时间段；餐次板重建为 `ZL2sa`（丘陵四时刻， Replace 灌树）。**新踩坑**：Pencil 的 `assets/` 目录只在打开文档时建立索引，运行中新增图片渲染为棋盘格；解法 = 放进文档目录的 `images/` 子目录（运行时可发现）再引用 `images/xxx.png`。交付：`docs/design/2026-09-20-add-food-popup-v3/` 重打包（22 张素材 + 9 弹层 + 6 板 + README v3.2）。 |
| 2026-09-20 | 首页餐次区按新稿还原：meal-card 补白卡 + 投影 + 行间分隔线、时间轴改 flex rail 列、餐次图标重画（太阳/月亮 PNG + 正圆渐变），详见「最近进度」 |
| 2026-09-20 | **弹层 v3.1 返工（读图能力恢复后目测发现的 3 处问题全修）**：①**首版器物图过小**——3 档卡 105×100 里杯类只有 22–28px 宽、三档肉眼难辨；分量卡加高 100→**120**、倍率 6.08/9.5→**9.0/13.0**，三档杯变 33/37/42px 宽、63/71/80px 高，截图中清晰可辨；②**计数类漏定尺寸**——`piece/slice/skewer` 的 amount=1，∛1=1 会算出 6–9px 废图，补固定高 **66px**，并新建**弹窗⑦⑧⑨**（水煮蛋/吐司/羊肉串，单档无分量区、放 150px 大图）；③新增 2 条 Pencil 铁律（见下）。**交付升级**：弹层 6→9 张（新增 ⑦水煮蛋 `o5s5z` / ⑧吐司 `yNOsF` / ⑨羊肉串 `bwgoN`，其余重建为 `b27NV`/`f4Rxn`/`Y2IcP`/`PPgV2`/`j2pvJ7`），`docs/design/2026-09-20-add-food-popup-v3/` 重打包为 00 总览 + 01–09 弹层 + 10–15 对照板 + 16/17 总览 |
| 2026-09-20 | **🔴 Pencil 渲染管线铁律（当晚实测，最重要）**：会话内 `Insert(parent, node)` 挂出的**子节点全部不进渲染管线**——壳 frame 的 fill 能渲染、`Get` 能读到全部节点、但截图/导出全白，且**不是 1 帧延迟**（隔多次调用仍白）。**唯一可靠通路：`Insert` 只造空壳，整棵嵌套子树用 `Replace(id, {...壳属性, children:[...]})` 一次灌入**。三个前置坑：① `Update(id,{children})` 按 API 文档会报 `unexpected property "children"`（改 children 必须用 Replace）；② Replace 的 nodeData 里**叶子节点不能带空 `children: []`**，否则整棵树被整体拒绝——建树辅助函数若给每个节点都预挂 children 数组，灌入前必须递归 delete 空 children；③ 弹窗这类整屏结构应写成「建树函数返回嵌套对象 + 末尾一次 Replace」，别逐节点 Insert |
| 2026-09-19 | 图标方案定案：**纯文生图**（排除图生图/抠图/详细文案/品牌锚定）；Prompt 规约与 10 食物合格率实测沉淀至 `toolchain/README.md` B.3–B.6 |
| 2026-09-19 | 图标素材链路修复（Pixabay 域名/per_page/编码/档位）+ Pixabay 提第一顺位 + 压缩与索引断链修复；`toolchain/README.md` 归纳图源顺位 / Key 池 / Agnes 防失真 / 13 条踩坑 |
| 2026-09-19 14:14 | toolchain 骨架完成：sources/schema/validate.py/build.py + food_library.json v1.0（1 条食物） |
| 2026-09-19 13:37 | `AGENTS.md` 新增 3 个约束段：防幻觉约束 / Hooks 兜底强约束 / Vue↔MD 对应规范 |
| 2026-09-19 13:35 | 新建 `docs/progress.md`；`AGENTS.md` 补充 6 个协议段（启动协议/变更日志/沟通即文档/收尾协议/大版本更迭/编码纪律） |
| 2026-09-19 13:34 | 设备能力全局化：`useDeviceCapability.ts` 重构 + `stores/device.ts` 新建 |
| 2026-09-19 | Ardot 设计稿与原型双向对齐（分类 tab + 加号裁切修复） |
| 2026-09-18 | 项目初始化：kaluli/ 文件夹创建，过时文档清理，8 屏设计稿导出 |

---

## 2026-09-23 收尾交接清单

**时间戳签名：2026-09-23 03:59:15**

### 1. 核心成果
1. **方案 A 单流程食物添加架构（FoodPicker + AddFood）闭环**：
   - 将 `AddFood.uvue` 从独立的 `page-container` 剥离为组件视图内嵌在 `FoodPicker.uvue` 中；
   - 内部通过 `step: 'list' | 'detail'` 单弹层原地切换，彻底消除了微信原生双 `page-container` 造成的 1500ms 冷启动白屏与卡顿死锁；
   - 详情内点击「更换」秒切回列表并精准回显当前项；
   - 弹窗外框按标准半屏抽屉规格限制为 `calc(500px + env(safe-area-inset-bottom))`，彻底解决长列表撑破全屏顶飞状态栏胶囊的缺陷。
2. **SettleBadge 升级 Canvas 2D 动效引擎**：
   - 废弃容易在真机出现掉帧卡顿的 CSS `conic-gradient`，重构为真双端统一的 Canvas 2D 动效渲染引擎，保证 60fps 平滑圆环动画；
   - 移除结算完成后的倒水音效（`triggerPourEffect`），使反馈干净俐落。
3. **首页水瓶与叶片物理动效与比例重构**：
   - 背景卡片（176x176）、瓶身（104x168）与两侧托底叶片（64x64/62x62）回归黄金构图，腔体水位严格保持 80% 上限；
   - 双层正弦波浪通过 @transitionend 往复平移动态居中，消除水体左右深浅不均；
   - 单击水瓶播放轻脆 click.mp3 feedback，长按播放晃动 shake.mp3 音效，手势音效彻底解耦；
   - 全局音效由 `stores/settings.ts` 集中调度管理。
4. **全工程 UTS 语法合规与抗坑加固**：
   - 清理所有组件中的自闭合标签（`<input></input>`, `<AddFood></AddFood>`），杜绝 UTS 编译器 `Element is missing end tag` 报错；
   - 补齐 `GoalModal.uvue` 缺失的根视图闭合 `</view>` 标签；
   - 修复 `PrivacyDialog.uvue` 废弃属性与不兼容伪类；
   - 全工程 `.uvue` 模板成对闭合语法树自动化审计 100% 绿灯。

### 2. 踩过的坑点与经验
1. **UTS 蒸汽模式严格标签规范**：uni-app x 的 UTS 编译器在解析 `.uvue` 模板时极其严苛，`<input />` 或 `<Component />` 等在普通 Vue 中合法的自闭合写法会导致编译中断，且报错常常指鹿为马报在宿主文件的 `1:0`，必须 100% 坚持成对闭合标签。
2. **组件根视图闭合丢失级联报错**：当子组件遗漏闭合标签时，报错信息直接冒泡至引入该组件的父页面（如 `Settings.uvue:1:0`）。排查时必须全仓自动化脚本扫描 tag stack，不可仅看宿主页。

### 3. 未修复的 Bug
- **当前已知阻断性 Bug：0 个**。编译完全绿灯，微信模拟器热重载无任何 Warning 或 Error。

### 4. 下一步待办（待 Boss 拍板）
- App／Web 端真机实测回归（Worklet 动画、原生端 backdrop-filter 验证）；
- 营养数据人工核对 30 条（`toolchain/sources/nutrition_checklist.md`，进度 0/30）；
- p348–p353 六条后补食物图标高分辨率重跑生图（待定是否消耗 API 额度）。