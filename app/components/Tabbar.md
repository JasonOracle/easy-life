# Tabbar.uvue — 底部液态玻璃胶囊（三 Tab 共享）

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
- **切 Tab＝L1 反馈**：气泡四阶段几何压扁与飞行补间；触觉震动已按指令全量下线，避免微信模拟器窗口抖动，待后续按需开启。

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
