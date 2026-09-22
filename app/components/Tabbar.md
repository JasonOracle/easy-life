# Tabbar.uvue — 底部液态玻璃胶囊（三 Tab 共享）

<!--
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[浅色态最终定稿参数回填（Boss 拍板组合方案）：
1. 胶囊底 #FFFFFF 88% → 60%（88% 那条稿面文字标注本身是漏改，故记为「文字标注为真理」的一条例外）；
2. 气泡新增「雕边」材质＝1px rgba(255,255,255,.6) 描边 ＋ box-shadow 0 4px 12px rgba(0,0,0,.06)，
   实现为单类 .tb-bub-light，只在「浅色 ＋ 玻璃档」挂载，暗态与 low 降级档不变；
3. 气泡底色经 18% ↔ 25% 实机 A/B 像素比对后保持稿面的 18%；
4. 补录本轮验收截图与「待 Boss 定」条目的关闭]
-->
<!--
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[按「液态玻璃胶囊三 Tab」重构整体重写本文件：
1. 通栏底槽 → 悬浮胶囊，两 Tab → 三 Tab（首页／日历／我的），Records 升一级 Tab；
2. 删除 fade 随滚动渐显整节（Boss 拍板：胶囊前提＝恒常可见），改为追溯条目；
3. 新增会跑的选中气泡与四关键帧（含 automator 采样取证数值）；
4. 色值改引 DesignTokens §7；页底预留 40 → 78；
5. 记录「components/ 下新增纯逻辑 .uts 不进微信包体」这一新踩坑与改用存储载体的结论]
-->


## 💡 核心思想

悬浮玻璃胶囊 ＋ 一颗会在三格之间「跑」的选中气泡（Pencil `gFuXt`「Home Tab / Tab 关键帧 (微博标准版)」）。
三页（Home／Records／Profile）各挂一份，切换用 `redirectTo`（不堆栈）；因换页会重挂载组件，
气泡的**飞行起点**靠本地存储 `ct_tab_origin` 一次性传递。

```html
<Tabbar active="home" ></Tabbar>
<Tabbar active="records" ></Tabbar>
<Tabbar active="profile" :dark="dk" ></Tabbar>   <!-- dark 可选：个人中心深色模式随动 -->
```

props 只有两个：`active`（`home`|`records`|`profile`）、`dark`（缺省 false）。
**#29 的 `fade` prop 已删除**（见下「已废弃」）。

## 依赖

- 素材：`app/static/home/{home,rili,center}.png` ＋ 各自 `-selected.png`（Boss 2026-09-22 换成矢量 PNG；
  组件只做路径切换不改图。⚠️ **暗态染色图标尚未产出**，暗黑下仍是浅底那套图）
- `stores/device`：`backdropBlur` 决定挂玻璃类还是降级实色、`haptics` 决定切 Tab 触觉
- 本地存储键 `ct_tab_origin`（一次性：新页 setup 读完即 `removeStorageSync`）
- 被引用：`pages/home/Home`、`pages/records/Records`、`pages/profile/Profile`
- 色值与几何：`design/DesignTokens.md` §7（TabBar 专用 token，2026-09-22 补录）

## 设计决策

- **不用原生 tabBar**：要胶囊＋气泡＋逐阶段补间，原生定制能力不足；且 v2 稿起就没有 midbutton 需求。
- **胶囊几何**（DesignTokens §7.2）：左右各 16、高 56、r28；底 `#FFFFFF 60%` ＋ 顶部折光 ＋ 白 80% 描边
  ＋ `blur(24px) saturate(180%)` ＋ 向上柔影 `0 -4px 24px rgba(10,79,61,.14)`；
  离底＝有小白条时 `safeAreaInsets.bottom + 12`，无小白条时 22（稿面「距 Home 指示条 12」）。
  ⚠️ 60% 不是稿面值：文字标注写的是 88%，Boss 2026-09-22 复看实机后判定「88% 太厚、且当时漏改」，
  亲自降到 60%——这是「稿面自相矛盾以文字标注为真理」这条规则的**已登记例外**（调 alpha 只能由 Boss 拍板）。
- **气泡（稿面 96×44 r22）**：Boss 拍板「文字标注为唯一真理」→ **纯 `backdrop-filter` ＋ 实色透明度**
  （浅 18%／暗 13% ＋ blur28），节点里遗留的三段渐变与手绘内高光**刻意不做**。
  底色由 `bubbleStyle` **运行时下发**，不写成 `.tb-bub-on.tb-bub-glass` 复合类——App 端只认单类选择器。
- **浅色态气泡加「雕边」（Boss 2026-09-22 定稿，本模块收官参数）**：60% 胶囊底上 18% 白气泡仍偏隐身，
  Boss 给方案＝描边 `1px solid rgba(255,255,255,.6)`（玻璃折射亮边）＋ `box-shadow: 0 4px 12px rgba(0,0,0,.06)`（悬浮高度差）。
  落地为**单类 `.tb-bub-light`**（由 `bubbleClass` 在 `glass && !dark` 时 push），既避开 App 端不认复合选择器，
  又不与 low 档 `.tb-bub-flat` 的 `#E3EFE8` 描边互相覆盖；暗态与 low 档观感不变（Boss：「暗色态保持现状」）。
  底色 18% ↔ 25% 做过实机 A/B（两张同点位截图采样气泡中心：`252,254,253` ↔ `253,255,254`，差 1~2 级肉眼无感），
  故保持稿面文字标注的 **18%**，轮廓交给描边承担。
- **四关键帧**（稿面「Tab 关键帧」）：静止 96×44 → 按下 ×0.96／90ms → 移动 ×1.12 ÷0.94／320ms
  `cubic-bezier(.34,1.56,.64,1)` → 落位 ×1.06 ÷0.97／120ms → 静止。压扁／拉伸用 **width/height** 实现
  （本栈不用 `scale`），左边缘由宽反算所以天然居中；文字高亮比气泡晚 40ms（wxss `transition-delay`）。
- **只在 MP-WEIXIN 下发 CSS transition**：`transition`／`@keyframes` 在 uni-app x 原生（Vapor）端属禁用属性，
  故补间包在 `#ifdef MP-WEIXIN` 的 `bubbleStyle` 分支里；**App 端留 Worklet TODO 未实现**（Boss 批准：
  「真机若卡再单独用 Worklet 优化」）。JS 侧只写 4 次阶段值，**不用 setData 逐帧驱动**。
- **入场起点必须在 `setup` 内同步读**：放 `onMounted` 会先在目标槽渲染一帧再跳回起点（采样实测到「闪一下」）。
- **`dark` prop 由页面显式传入而非组件自读 settings**：深色范围 Boss 只批了个人中心＋设置，组件不自行决定主题归属。
- **切 Tab＝L1 反馈**（AGENTS 交互铁律）：气泡压扁 ＋ `vibrateShort`（按 `device.haptics` 门控＋try/catch）。

### 已废弃：#29「随滚动渐显（fade）」

Boss 2026-09-22 拍板：「新的液态胶囊设计核心就在于恒常可见」→ fade 机制整体下线，
`fade` prop、页面侧 `onPageScroll→tabFade` 透传、`barStyle` 五属性同驱全部删除；
Home 的 `onPageScroll` 随之删除，Profile／Records 的 `onPageScroll` 仅保留「跨阈出常驻导航栏」用途。

### 新踩坑：`components/` 下放纯逻辑 `.uts` → 运行时模块缺失、整页白屏

产物侧 `components/tabOrigin.js` 正常生成、`Tabbar.js` 的 `require("./tabOrigin.js")` 路径也对，
但微信工具运行时报 `module 'components/tabOrigin.js' is not defined`，Tabbar 渲染中断 → **整页白屏且首屏无任何可见错误**；
`debug_clear_cache --action cleanCompileCache` ＋ `simulator_refresh` 跑过仍未见效（包体哈希未变）。根因未定案。
**结论：跨页共享的纯逻辑不要放 `components/`；本工程改用本地存储载体，不新增 JS 模块文件。**

## 边界与降级

- 点当前页 Tab 直接 return，不触发动画与跳转；`redirectTo` 失败静默停留。
- `backdropBlur=false`（low 档）→ 胶囊不透明 `#F8FCFA`、气泡实色 ＋ `#E3EFE8` 描边，折光／投影／四关键帧动画照留。
  ⚠️ 此时**不挂** `.tb-bub-light`，故浅色玻璃态的白描边与柔影不会污染降级档。
- 存储读不到起点（冷启动、存储被清、`removeStorageSync` 已消费）→ 不播入场飞入，气泡直接静止在目标槽。
- 窄屏：气泡宽 `min(96, slotW-8)`，保证在胶囊内嵌不外溢。
- `ct_tab_origin` 解析失败（非数字）→ 同「读不到」处理。

## 与设计稿的对应

- Pencil `gFuXt`「Home Tab (微博标准版)」＝胶囊几何与三 Tab 排布；「Tab 关键帧 (微博标准版)」＝四段气泡形变与时长。
  两处**文字标注**为唯一真理（Boss 拍板），节点参数中的渐变／内高光不实现。
- 稿面无深色态与 low 档降级：暗态沿用工程临时薄荷深色板（卡色 `#162924` 加 alpha 到 `.72`），待暗色稿校准。
- 稿面 Home Indicator 为系统条，不自绘。
- **页底预留＝78px**（Boss 拍板「按胶囊实际占用空间重算」）：Home／Profile 的 `.page padding-bottom`
  与 Records 的 `.lr-bottom-space` 统一 78，取代 #29 配套的 40。
- **已关闭：浅色态气泡可见度**（原记「胶囊 88% ＋ 气泡 18% ⇒ 模拟器里几乎看不见，与拍板 #3 的折射初衷相冲」）。
  Boss 2026-09-22 拍板组合方案＝**胶囊降 60% ＋ 气泡加白描边与柔影**，并明确「浅色版最终定稿参数」；
  稿面文字标注的 88% 被 Boss 判定为漏改，故这一处不再走「文字标注为真理」。**暗态观感正常，保持现状不动。**
- **仍待 Boss 定**：暗态**染色图标**尚未产出（深色下仍用浅底那套矢量图）。

## 验收取证（2026-09-22，全部零窗口）

- 三页渲染与激活态：`debug/shots/tab8_home.png`／`tab9_records.png`／`tab10_profile.png`；暗态 `tab13_profile_dark.png`。
- 三格坐标 tap 均正确换页（胶囊条带 css y=770，由 `debug/tab_geom.js` 按组件同公式算出）。
- 四关键帧实跑（`debug/tab_flight.js` 轮询子组件 `$scope.data` 的行内 style）：
  `w=96 l=11.67 dur=140`（Home 静止）→ `w=92.16 l=13.59 dur=90`（按下，仍在来源槽）→
  换页后首帧 `w=92.16 l=13.59`（起点无闪帧）→ `w=107.52 l=125.24 dur=320`（移动）→
  `w=101.76 l=128.12 dur=120`（落位）→ `w=96 l=131 dur=140`（静止）。
  ⚠️ 实测阶段推进比稿面标称慢（页面挂载占住 JS 线程，`setTimeout` 被推迟：按下→移动实测 260ms，标称 16ms），
  观感为「整段略长」，不影响形状；App 端 Worklet 化后可消掉此延迟。

### 浅色态定稿（60% 胶囊底 ＋ 描边/投影气泡）验收

- 三次单发编译绿灯；产物 `unpackage/dist/dev/mp-weixin/components/Tabbar.wxss` 内确认 `.tb-bub-light` 的
  四边 `border-*-width` ＋ `border-style: solid` ＋ 四边色 ＋ `box-shadow` 已完整下发（uvue 只写 `border-width` 会整体不渲染）。
- 三页浅色、内容穿过胶囊带（`debug/tab_final.js`：`reLaunch` → 截图 → `wx.pageScrollTo({scrollTop:300})` → 再截图）：
  `debug/shots/f_home_a_top / f_home_b_scrolled`、`f_rec_*`、`f_prof_*`（`_crop` 为胶囊条带放大图）
  ⇒ 气泡轮廓清晰可辨，页面内容在胶囊下仍可读。
- 暗态回归（`debug/tab_dark_check.js`：设置页开关 → Profile 截图 → 复位）：`f_prof_dark.png`／`f_prof_dark_crop.png`
  与定稿前一致（Boss 指令「暗色态保持现状」），验收后 `darkMode` 已还原 `false`、应用回到 Home。
- 18% ↔ 25% A/B 取证：`tab15_bubble18.png` ↔ `tab16_bubble25.png`（静止）、`tab18_scroll18.png` ↔ `tab17_scroll25.png`（滚动）；
  同点位像素采样气泡内区 `252,254,253` ↔ `253,255,254` → 取稿面文字标注 18%。
- `python -X utf8 toolchain/hooks.py all` 五道全绿（新类 `tb-bub-light` 无跨文件同名冲突）。
- 交 Boss 的收官图：`debug/shots/final_home.png`（整页，可见餐次列表穿到玻璃带下）与
  `debug/shots/final_scroll_capsule.png`（胶囊条带 2× 放大，气泡描边／投影轮廓清晰）。
