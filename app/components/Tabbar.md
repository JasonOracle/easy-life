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
- ⚠️ **材质参数以 `design/DesignTokens.md` §7.2 为唯一事实来源**（v4，2026-09-28 定稿）。
  本文件下方为要点摘录，**改设计前先改 DesignTokens，再回写此处**。
- **胶囊几何**（DesignTokens §7.2）：左右各 16、高 56、r28；底 **`#FFFFFF 68%`** ＋ 顶部折光 `#FFFFFF 70%→0`
  ＋ 白 80% 描边 ＋ **`blur 20`**（**App 端不可带 `saturate`** —— Vapor 引擎下写 `saturate()` 整条 `backdrop-filter` 失效，
  已隔离进 `#ifdef MP-WEIXIN`）＋ **白色光晕 `0 -3 10 #FFFFFFE6`**
  （**浅色态不用深投影**：外阴影必然画在元素身下，半透胶囊一定会把它显出来，三档深投影实测都把内部压到比页面底更暗＝看着像灰玻璃；
  改白光晕后内部干净偏亮，且兼作内高光。深色态仍用黑投影）。
  ⚠️ 68% 是演进结果：稿面文字标88% → 2026-09-22 降到 60% → **2026-09-28 定稿 68%**
  （52% 在近白页上只高 5 级、读不出「白磨砂」）。调 alpha 只能由 Boss 拍板。
  ⚠️ 不得加 `inset` 阴影：拍平(Vapor)引擎不支持，值里带上它整条 `box-shadow` 会被丢弃。
- **选中气泡**（96×44 r22，完全内嵌）：浅色底 **`rgba(26,26,26,0.08)` 中性加暗**／暗色底 `#FFFFFF 13%` ＋ `blur 28px` ＋ 投影 `0/6/18/#00038%`。
  **不带品牌色相**，未选中＝不透明白磨砂、选中＝更透的磨砂（参考外部 `tab-bar.vue` 的 `.active`）；
  品牌色只由图标与文字承担。浅色态**删描边、删投影、删自身 blur**——四层叠加会被撑成实心色块（真机实测 L0.55）。
  中间曾试过 `accent 12%` 淡染，Boss 判定方向相反（会把「选中」读成「一块绿」）→ 已否。
  底色由 `bubbleStyle` **运行时下发**，不写成 `.tb-bub-on.tb-bub-glass` 复合类——App 端只认单类选择器。
- **四关键帧**（稿面「Tab 关键帧」）：静止 96×44 → 按下 ×0.96／90ms → 移动 ×1.12÷0.94／320ms
  `cubic-bezier(.34,1.56,.64,1)` → 落位 ×1.06÷0.97／120ms → 静止。压扁／拉伸用 **width/height** 实现
  （本栈不用 `scale`），左边缘由宽反算所以天然居中；文字高亮比气泡晚 40ms（wxss `transition-delay`）。
- **只在 MP-WEIXIN 下发 CSS transition**：`transition`／`@keyframes` 在 uni-app x 原生（Vapor）端属禁用属性，
  故补间包在 `#ifdef MP-WEIXIN` 的 `bubbleStyle` 分支里；**App 端留 Worklet TODO 未实现**（Boss 批准：
  「真机若卡再单独用 Worklet 优化」）。JS 侧只写 4 次阶段值，**不用 setData 逐帧驱动**。
- **入场起点必须在 `setup` 内同步读**：放 `onMounted` 会先在目标槽渲染一帧再跳回起点（采样实测到「闪一下」）。
- **`dark` prop 由页面显式传入而非组件自读 settings**：主题归属由页面决定，组件不自行决定。
- **未选中文字色 `#5F6B66`**（2026-09-28：原 `#8A8A8A` 压在白胶囊上仅 2.6:1，改后≈5.3:1 中性灰）。
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
- **页底预留＝方案 A 动态安全区全避让**（DesignTokens §7.3）：无小白条机型 **92px**（＝胶囊 56 ＋ 离底 22 ＋ 呼吸留白 14）；
  有小白条全面屏机型 **`calc(82px + env(safe-area-inset-bottom))`**（以 safeBottom 34px 计实占 116px）。
  实现为 `184rpx`（无小白条）／`calc(164rpx + env(safe-area-inset-bottom))`（有小白条），取代早期写死的 78px 与 #29 的 40。
  同条**废弃 #29 的随滚动渐显（fade）机制**——新胶囊的设计前提是「恒常可见」。
- **已关闭：浅色态气泡可见度**（原记「胶囊 88% ＋ 气泡 18% ⇒ 模拟器里几乎看不见，与拍板 #3 的折射初衷相冲」）。
  经多轮实机 A/B 终定为 v4：**胶囊 68% 白磨砂 ＋ 选中格 `rgba(26,26,26,0.08)` 中性加暗**（= 更透的观感，非加白）。
  暗态观感正常，保持现状不动。
- **仍待 Boss 定**：暗态**染色图标**尚未产出（深色下仍用浅底那套矢量图）。
