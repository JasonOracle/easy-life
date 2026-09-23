# 源码注释治理审查报告 (Code Comment Audit Report)

## 1. 扫描统计
- 扫描文件数量：27 个 (.uvue, .vue, .ts, .js, .json)
- 提取注释总数：635 处
- 排除路径：`unpackage/`, `dist/`, `node_modules/`

## 2. 分类统计
- **A类 (删除 - 历史变更日志)**：197 处
- **B类 (迁移 - 历史方案讨论)**：9 处
- **C类 (保留 - 有效工程知识)**：429 处

## 3. 待处理明细

### 文件: `app/App.uvue`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Muse Spark
  修改内容：[恢复 device store 启动初始化（启动检测一次，全局复用）]
  修改时间：2026-09-20
  AI模型：CodeBuddy (GLM)
  修改内容：[重构为最小手脚架：移除 device store 初始化及全部业务依赖，仅保留空 onLaunch]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[彻底根除底部确认按钮泛白发虚缺陷：废除浅青白渐变(#7DEBC7)，重构为饱满翠绿渐变(#1FBF8F → #0D9C73)，文字白反差达到 4.8:1，清晰高质感]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 7
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[修复底部确认按钮 .confirm-btn 在 Android 原生端被识别为半透蒙层缺陷：增加实色背景 #1FBF8F 兜底，移除 transition 与按压不必要透明度，确保按钮本体清晰立体可见]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 13
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[实施方案A响应式重构：食物行、甜度电量条、餐次照片卡(154×192rpx)、确认按钮及文字字号全量按 1px=2rpx 换算为 750rpx 规范]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 19
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[1. 架构升级：剥离外层 page-container，改为由 FoodPicker 统一宿主作为内容视图展示，解决双弹窗冷启动 1500ms 卡顿问题；2. 外层使用 scroll-view 包裹，解决在小屏或内容过长时无法滚动的问题；3. 渐变语法替换为 90deg；4. 遵循原生规范将 font-weight: 500/600 统一为 bold；5. 清理 sealPop 动画]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 25
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[按指令清除甜度切换、餐次卡片、步进变更、蒙层关闭与确认保存中的触觉震动(vibrateShort/vibrateLong)，避免微信模拟器窗口剧烈抖动，待后续按需开启]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 31
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[音效接入升级：甜度切换（pickSweet）与餐次卡片切换（pickMeal）接入 selected-card.mp3 音效]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 37
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[弹层壳迁移到原生 page-container（同 FoodPicker 模式）：自研 .af-mask 固定层＋点蒙层关闭＋z900 退役；
    容器改透明（本弹窗内容为动态高度：甜度组/步进器有无不定，白卡圆角仍由 .af-sheet 自带，容器不写死 height）；
    MP 端 v-if 与 :show 双条件（条件编译内嵌标签）；@clickoverlay 回传 update:show=false＋@afterleave 兜底同步]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 45
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[组件标签一律成对书写（禁自闭合）：CountStepper/OptionTray 三处自闭合改配对——实测本工程 mp-weixin
    VDOM 产物中任一自闭合组件标签会在该宿主内以空作用域重渲染整页模板（幻影副本：插值全空、wx:for 空、页高虚增）]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 52
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[.af-mask 补 z-index:900——接入 StickyTop 滚动遮罩（z40）后统一全局层级：
    弹层蒙层 900 ＞ 常驻返回钮 45 ＞ 滚动遮罩 40 ＞ Tabbar 30，防弹层被遮罩压住]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 59
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[Boss 反馈三项：①餐次卡照片改用 Pencil 设计稿实拍图——从设计文档目录拷入
    sky_breakfast/lunch/dinner/night.png（弹窗② nURQn 四卡 fill 与「餐次图标设计」ZL2sa 同源），
    替换旧自生成 meal_*.png 占位图；②「X餐」名称水平居中（稿面 text w25 居 77 宽卡正中），
    .af-meal-name 由 left:10 改 left:0;right:0;text-align:center；③时间段行删除——Boss 拍板
    稿面无此行（重测 nURQn/NUEJF 卡内仅 Photo→Dim→Scrim→名称四层），
    .af-meal-time 样式与 MEAL_CARDS.time 字段移除，名称回归稿面 top:65.5]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 70
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[Boss 两项反馈：①奶茶甜度标题删「· 10 格电量」提示文字（只留「甜度」，
    合并 v-if/v-else 两分支为单一 form-label）；②餐次区按 Pencil「弹窗② 米饭」稿量取重建——
    补每卡第二行时间段（07:00-09:00 等，9px，选中 85%/未选中 50% 白）、名称改 12px
    （选中 700 纯白／未选中 500 白72%，位置由 bottom:10 改稿面 top:60/77）、
    选中卡补薄荷外描边 #1FBF8F 1px（稿面 MC_午餐 stroke）、印章改 $mint 底+白描边 2.5
    并悬出右上外侧（top:-10/right:-12，旧 #2ECFA0/2px/-9）、
    新增全卡底部衬度渐变 .af-meal-shade（稿面 Scrim 180° #0A4F3D 0%@32→85%@100）、
    卡宽 76→77（稿面 4×77+3×9=335 恰满内容宽）；
    实拍复核后补修：.af-meal-row 加 overflow:visible + 上/右 14px 内衬负 margin 双保险
    ——全局 view{overflow:hidden} 实测把悬出卡上缘的印章裁掉上半]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 85
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[奶茶用例实拍修复：甜度电量条白胶囊 top+bottom 拉伸在小程序端失效（撑出底槽）——
    改 .sweet-seg 固定高 66 + .sweet-pill 显式 height:70 top:6]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 92
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[修复餐次卡仍被压扁的真因：uni-app x 小程序端把组件样式平铺进同一页 wxss，
    组件类名跨文件全局生效——Home 的 .meal-row{height:40px}/.meal-name 污染本组件餐次区。
    将冲突类统一加 af- 前缀（mask/sheet/handle/meal-row/meal-card/meal-card-on/meal-photo/meal-scrim/meal-name），
    .af-meal-photo 补 position:absolute；FoodPicker(fp-)/GoalModal(gm-)/FoodToast(ft-) 同步去冲突]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 101
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[Boss 实拍反馈修复：mp-weixin 端 sheet 子项被 flex-shrink 压扁（餐次卡 96→40、确认钮 52→43），
    对 sheet/food-row/form-label/sweet-tray/meal-row/meal-card/meal-photo/confirm-btn/CountStepper.block
    统一加 flex-shrink:0；餐次卡加 overflow:visible 使右上角印章不被裁；
    OptionTray 光晕溢出被全局 view overflow:hidden 裁成硬边矩形——.opt/.float/.art-wrap 改 overflow:visible；
    落地影贴图 aspectFit 把方形软影缩成「绿点」——改 scaleToFill]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 111
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[按 pencil 弹窗①–⑧ + 选择态 pOYw3 板还原：蒙层改中性黑 50%（Boss 拍板）；
    头部副行改「N kcal / 100单位」（计件类为每单位）；「按所选分量与选项估算」改右对齐「已按 X 计算」
    （步进器变体含「约 Ng」）；计件分支去「分量」标题（弹窗⑧无标题）；餐次卡去时间文案（Boss 拍板：
    餐次无时间概念，时间由端上注入）、去选中边框、未选中盖 0.72 黑蒙版、印章移到卡片右上角外侧；
    确认钮改「添加到X餐 · N kcal」；砝码(份)类改多颗渲染（单颗 33×30 固定，小份/一份/大份=1/2/3 颗）；
    sweet 甜度组改「10 格电量」条＋滑动白胶囊（数据核查：仅 6 条茶饮有 sweet，咖啡的糖包/糖浆走通用底槽）]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 122
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[修复蒙层点击不关闭 bug：mask 加 @click closeMask（L1 轻触觉），sheet @click.stop 阻断冒泡]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 128
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[按弹窗① 设计稿补「更换」胶囊钮（food-row 右侧，#EAF9F3 r13 + arrow-left-right 图标），
    点击 emit change，由宿主页唤起弹层⓪ FoodPicker 回显当前食物]
-->
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 135
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Muse Spark
  修改内容：[新建：公共添加食物弹层（分量底槽/计数步进器/甜度底槽/餐次照片卡/确认 emit）；
    奶茶外无甜度组时甜度区整段隐藏；multi 选项组本轮不渲染；确认不写库（只组装 payload）]
-->
```

### 文件: `app/components/CountStepper.uvue`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[实施方案A响应式重构：全量 px 尺寸、间距、宽高与字号按 1px=2rpx 换算为 750rpx 规范]
-->
```

### 文件: `app/components/CountStepper.uvue`
- **行号**: 7
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[按 uni-app x 原生规范将自闭合 input 标签改写为成对书写 <input ...></input>，彻底杜绝编译端缺失结束标签错误]
-->
```

### 文件: `app/components/CountStepper.uvue`
- **行号**: 13
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[1. 渐变语法替换为标准度数：linear-gradient(to right, ...) -> linear-gradient(90deg, ...)；2. 清理 Android 原生不支持的 @keyframes numPop 与 trackShake 及相关动画属性]
-->
```

### 文件: `app/components/CountStepper.uvue`
- **行号**: 19
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[按指令清除加减步进按钮触发的 vibrateShort 触觉震动，避免微信模拟器窗口剧烈抖动，待后续按需开启]
-->
```

### 文件: `app/components/CountStepper.uvue`
- **行号**: 25
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[按「计数步进器·规格」板补齐：能量条改三段静态渐变类（mint 渐变/amber/coral，
    阈值不变），条宽 240ms ease-out-back 过渡；数字变化 scale 1→1.12→1 160ms 弹跳；
    2026-09-21 Boss 实拍修复：.block 加 flex-shrink:0 防被 sheet 压扁]
-->
```

### 文件: `app/components/CountStepper.uvue`
- **行号**: 33
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Muse Spark
  修改内容：[新建：计数步进器（默认 3，上限 100，对数能量条＋阈值三色＋键入态＋截界抖动）；
    算法与阈值来自 food store（portionRatio/portionLevel/MAX_COUNT）]
-->
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[解决点击添加按钮弹窗响应缓慢缺陷：引入 pageSize 分批虚拟截断机制，初始优先渲染首屏 25 条食物极速秒开，支持滚动到底部增量加载，彻底消除一次性实例化 353 条食物 DOM 节点导致的 1~2 秒主线程严重卡死]
-->
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 7
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[解决 AddFood 详情抽屉遮挡底部确认按钮缺陷：引入 .fp-container-detail 状态类，在 detail 状态下将半屏高度从 1040rpx 自适应提升至 1240rpx，确保一屏完整露出底部操作按钮无需手动滑动]
-->
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 13
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[解决弹窗弹出迟滞与卡顿感：1. 弹层唤起由 setTimeout(50) 优化为 nextTick 下一帧即刻推入；2. 过渡时间从 300ms 压缩至 180ms 并采用 cubic-bezier(0.16, 1, 0.3, 1) 抽屉物理曲线，开闭轻快顺滑]
-->
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 19
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[实施方案A响应式重构：全量抽屉尺寸(1040rpx)、搜索框、分类 chips、食物列表每一项的缩略图与文字按 1px=2rpx 换算为 750rpx 规范]
-->
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 25
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[修复 Android 原生端半屏抽屉高度失效缺陷：.fp-container 的 height 设置 520px 实数兜底，仅在小程序端走 calc(520px + env(safe-area-inset-bottom))，彻底解决 Android 原生 CSS 解析器因不识别 env() 废除整行 height 导致列表无约束撑高全屏并冲出屏幕顶部的 Bug]
-->
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 31
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[按 uni-app x 原生规范将自闭合 input 与 AddFood 组件标签改写为成对书写，彻底杜绝 Element is missing end tag 编译错误]
-->
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 37
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[1. 实施方案A单流程合并架构：内部引入 step（list | detail）两态切换，点选食物原地切换至 AddFood 内容视图，消除双 page-container 冷启动造成的 1500ms 严重卡顿与状态机互斥；2.「更换」按钮原地秒切回列表，完美回显当前食物；3. 打开重置 step 为 list，清空搜索与分类，彻底绝杀二次打开残留旧高亮 bug；4. 遵循原生渲染规范将 font-weight 500/600 统一为 bold]
-->
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 43
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[按指令清除分类切换、选食物与弹层关闭中的 vibrateShort 触觉震动，避免误触震动]
-->
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 49
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[半屏抽屉规范落地：按 Pencil 设计稿（ScreenSpecs 375×500 y=312）将 custom-style 限制为标准半屏抽屉高度 calc(500px + env(safe-area-inset-bottom))，.fp-sheet 设 height:100% 且 .fp-food-list 设 flex:1/height:0，彻底解决长列表将弹窗撑满全屏、遮挡状态栏胶囊的严重缺陷]
-->
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 55
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[组件类名全量加 fp- 前缀（row/row-on/row-thumb/row-text/row-name/row-sub/row-sub-on/row-div/search-box/search-icon/search-input/chip-bar/chip-text/chip-text-on/food-list/radio/radio-on/radio-check）：其中 .row/.row-text/.row-sub/.row-div 与 Settings 页同名类在 mp-weixin 全局命中互污（AGENTS 类名前缀铁律），其余为同族一致性收敛；滚动定位 id 前缀 row- 与 scroll-into-view 为元素 ID 非类名，保持不变；样式数值与结构零改动]
-->
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 61
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[弹层壳迁移到原生 page-container（参考官方示例 pages/component/page-container）：
    自研 .fp-mask 固定层＋点蒙层关闭＋z900 全部退役，改 position=bottom 原生滑入滑出＋原生蒙层＋
    拦截系统返回＋afterleave 回传 update:show；MP 端按官方写法 v-if 与 :show 双条件（条件编译内嵌标签）；
    容器外观（560 高/白底/顶圆角 34）走 custom-style，内容布局不变；
    模拟器验收发现原生蒙层点按不自动关闭（官方示例亦仅靠按钮改 show），补 @clickoverlay→回传 update:show=false]
-->
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 71
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[.fp-mask 补 z-index:900，与 StickyTop 滚动遮罩（z40）统一全局层级（弹层恒在最上）]
-->
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 77
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[mp-weixin 组件样式平铺导致跨组件类名冲突（与 AddFood/GoalModal 的 .mask/.sheet/.handle/.chip/.chip-on
    互相污染），本组件冲突类统一加 fp- 前缀]
-->
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 84
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[修复蒙层点击不关闭 bug：mask 加 @click closeMask（L1 轻触觉），sheet @click.stop 阻断冒泡]
-->
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 90
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[新建：弹层⓪ 食物选择列表（pencil n3dgv 还原）——
    搜索框（名称/全拼/首字母，走 stores/food.searchFoods 同规则）、
    分类 chips 取库内真实 7 类（全部＋首次出现序）、行缩略图用真实 webp 图标、
    单选点行即选中并关闭；selectedId 回显高亮，首次打开无选中；
    重开时 scroll-into-view 把选中行滚进视野（验收截图发现残留滚动位不露选中行）]
-->
```

### 文件: `app/components/FoodToast.uvue`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[实施方案A响应式重构：全量 px 按 1px=2rpx 换算为 750rpx 规范，确保各类屏幕下比例自适应一致]
-->
```

### 文件: `app/components/FoodToast.uvue`
- **行号**: 7
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[按指令清除Toast弹出时的 vibrateLong 触觉震动，避免微信模拟器窗口剧烈抖动，待后续按需开启]
-->
```

### 文件: `app/components/FoodToast.uvue`
- **行号**: 13
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[组件类名加 ft- 前缀（pill/pill-text/toast/toast-card/cup-circle/cup-glyph/plus-num/plus-unit）：.pill/.pill-text 与 Profile 页目标胶囊同名，按铁律消除跨文件污染；样式数值零改动]
-->
```

### 文件: `app/components/FoodToast.uvue`
- **行号**: 19
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[mp-weixin 组件样式平铺导致跨组件类名冲突（.mask/.sub 与 AddFood/FoodPicker/GoalModal 互相污染），
    本组件冲突类统一加 ft- 前缀]
-->
```

### 文件: `app/components/FoodToast.uvue`
- **行号**: 26
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Muse Spark
  修改内容：[新建：添加成功 toast（+N kcal／已加入X／已添加 pill），2s 自动＋点按关闭；
    L3 反馈（成就触觉，长按型）；定时器销毁清理]
-->
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[解决类名前缀冲突：按 AGENTS 规范将局部颜色样式统一收敛为 gm- 前缀 (.gm-bg-mint/.gm-bg-amber/.gm-bg-coral/.gm-clr-mint/.gm-clr-amber/.gm-clr-coral)，彻底杜绝与 App.uvue 全局类名互污]
-->
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 7
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[1:1 像素级复刻图3设计稿：1. 滑块轨道加粗为 24rpx 胶囊饱满圆角，滑钮增大为 52rpx 带柔和投影；2. 快速选择废除灰色大托盘，改为 5 个独立白底药丸胶囊（边距独立、选中态高反差绿字+柔阴影）；3. 保存按钮重构为设计稿深翠绿渐变(#1FBF8F → #0D9C73)，彻底根除泛白发虚]
-->
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 13
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[1. 补齐滑块已拖动区缺少的高亮背景样式 .bg-mint/.bg-amber/.bg-coral 与文字高亮样式，解决已拖动轨道无颜色显示Bug；2. 修复保存按钮 .gm-save 安卓原生蒙层遮挡问题：补充纯色背景兜底，移除 transition 与不必要透明度；3. 弹窗唤起改用 nextTick 提速，消除弹出迟滞]
-->
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 19
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[全量换算为 750rpx 规范（1px = 2rpx）：滑条轨道、按钮、字体、边距均转为 rpx，结合动态 scaleRatio 计算触摸吸附坐标，解决大屏真机偏小问题]
-->
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 25
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[补齐 .gm-overlay 根节点缺失的闭合 </view> 标签，彻底解决 UTS 编译器 Element is missing end tag 编译中断错误]
-->
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 31
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[1. 遵循 uni-app x 原生规范，将 font-weight: 500/600 统一为 bold；2. 为 .gm-fill 与 .gm-thumb 的 transition 添加 MP-WEIXIN 条件编译保护，避免 App 原生端样式失效]
-->
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 37
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[按指令清除滑块拖动、步进增减、快速选择与保存目标中的触觉震动(vibrateShort/vibrateLong)，避免微信模拟器窗口剧烈抖动，待后续按需开启]
-->
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 43
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[音效接入升级：拖动滑条与步进加减接入 slide.mp3 滑动音效，快速选择热量预设卡片接入 selected-card.mp3 卡片切换音效]
-->
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 49
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[将 playSound 迁移至 settings store 引入，彻底消除独立 composables 模块在小程序运行期 module is not defined 导致页面崩溃的严重Bug]
-->
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 55
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[弹层壳迁移到原生 page-container（同 FoodPicker 模式）：自研 .gm-mask 固定层＋点蒙层关闭＋z900 退役；
    position=bottom 原生滑入滑出＋原生蒙层＋拦截系统返回；容器外观（560 高/白底/顶圆角 34）走 custom-style，
    .gm-sheet 改 flex:1 只留内边距；MP 端 v-if 与 :show 双条件（条件编译内嵌标签）；
    @clickoverlay 回传 update:show=false＋@afterleave 兜底同步]
-->
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 64
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[Boss 拍板整卡重建：按 Pencil qnNST 量稿把「圆环表盘」改为「横向滑条卡」——
    删除 canvas/conic 环、编造的 createCanvasContext().then() API、模板重复的 BigNum/unit 节点；
    新结构＝handle 41×4＋头部(44 徽章 target 图标/标题17·700/副标12/32 白圆关闭钮)＋
    Dial 卡 335×150 $bg r20(左右 44 白圆 −/＋钮、BigNum 46+unit 13.5 底部对齐、
    Track 239×8 r4 $line＋渐变 Fill＋20 白 Thumb($mint 描边3)、5 档刻度 26..287 当前档加粗)＋
    快速选择 335×64 $bg r18 内 5 槽 63×56(选中＝白底+阴影，非旧薄荷实底)＋
    提示卡 335×76 $mintsoft r18(bulb+两行+chevron)＋保存钮 335×54 渐变 r27；
    蒙层改黑 50%（旧绿 35%，与四弹窗统一）；拖拽＝touch clientX→Track 比例→吸附 100 步长；
    图标 6 枚 Pencil @4x 导出入 static/goal/；对外 props/emits 不变（Settings 零改动，Home Pill 铅笔新增接入）]
-->
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 78
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[mp-weixin 组件样式平铺导致跨组件类名冲突（与 Home/AddFood/FoodPicker/FoodToast/CountStepper 的
    .mask/.sheet/.handle/.chip/.chip-on/.title/.sub/.tick 互相污染），本组件冲突类统一加 gm- 前缀]
-->
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 85
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[弹窗手势与安全区规范落地：
    1. 移除顶部静态灰色横杠（.gm-handle）；
    2. 保存按钮 .gm-save 升级 fluid-interaction-expert 物理弹性按压动效（btn-capsule-pressed）；
    3. 底部追加 calc(24px + env(safe-area-inset-bottom)) 动态安全区避让，彻底消除小黑条遮挡]
-->
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 94
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[修复蒙层点击不关闭 bug：mask 加 @click close，sheet @click.stop 阻断冒泡]
-->
```

### 文件: `app/components/OptionTray.uvue`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[实施方案A响应式重构：全量 px 尺寸、间距、字号与位移动画按 1px=2rpx 换算为 750rpx 规范]
-->
```

### 文件: `app/components/OptionTray.uvue`
- **行号**: 7
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[清理 Android 原生不支持的 @keyframes optPop 及其相关动画属性，避免控制台报警并保持静态直出规范]
-->
```

### 文件: `app/components/OptionTray.uvue`
- **行号**: 13
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[按指令清除器皿/分量选项切换时的 vibrateShort 触觉震动，避免微信模拟器窗口剧烈抖动，待后续按需开启]
-->
```

### 文件: `app/components/OptionTray.uvue`
- **行号**: 19
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[音效接入升级：分量切换（select）接入 selected-card.mp3 卡片选项切换音效]
-->
```

### 文件: `app/components/OptionTray.uvue`
- **行号**: 25
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[落地影改挂进 .art-wrap 绝对定位在素材底部（原为 .float 后置流内节点，影被挤到文字下方）]
-->
```

### 文件: `app/components/OptionTray.uvue`
- **行号**: 31
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[Boss 实拍反馈修复：光晕/抬升溢出部分被运行时全局 view{overflow:hidden} 裁成硬边矩形色块——
    .opt/.float/.art-wrap 显式 overflow:visible；.tray/.float 加 flex-shrink:0 防压扁；
    落地影 shadow512.png 为方形软斑贴图，aspectFit 在 55×10 盒里只画出中间小圆点（「绿点」bug）——改 scaleToFill 拉成扁影]
-->
```

### 文件: `app/components/OptionTray.uvue`
- **行号**: 39
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[按 pencil 选择态 pOYw3 板还原：TrayOption 增 count/contact/solid 字段；
    光晕/落地影改按公式动态计算（haloW=objW×1.5，haloH=max(objH×1.35,objW×0.45)，
    shadowW=objW×接触宽×1.35（ar≥1.6 时 ×1.5），blur=shadowW×0.16）；
    砝码类多颗渲染（单颗固定尺寸只变颗数）；未选中压暗分档（透明/浅色素材 0.62、实心不透明 0.85）；
    器皿类选中去白卡（设计「去卡片、用体积与光」），选中件加 scale 0.94→1 弹性入场；
    文本类选项（糖包/糖浆）保留白卡样式]
-->
```

### 文件: `app/components/OptionTray.uvue`
- **行号**: 50
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Muse Spark
  修改内容：[新建：方案 B 单选底槽——共用底槽＋悬浮选中件（光晕＋落地影＋抬升＋提亮）；
    图片 :src 运行时绑定（绕开编译器 assets 跨页碰撞铁律）]
-->
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[彻底根除左上角多余圆圈与环形动效缺失 Bug：
    1. 移除冗余的 CSS .sb-track 与 .sb-hole 双重圆环节点，杜绝与 Canvas 绘制冲突；
    2. 将 Canvas 容器尺寸限定为 296rpx 正方并正中排布，圆心动态取中心 (w/2, h/2)，线宽等比缩放；
    3. 小程序端采用 fields({ node: true, size: true }) 动态获取真实像素并结合 dpr 缩放，确保底轨与进度弧 100% 居中且动画流畅扫出]
-->
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 10
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[1. 彻底修复 Android/小程序环形转圈动效缺失 Bug：优化 Canvas 异步上下文就绪与重绘防抖机制，改用 Canvas 一体化绘制饱满圆头进度弧与浅薄荷绿底轨；2. 严格按图2设计稿校准环心与厚度（R=64, line=20）；3. 替换 sb_check 与 sb_alert 为矢量 SVG]
-->
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 16
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[实施方案A响应式重构：全量 px 尺寸、间距、宽高与字号按 1px=2rpx 换算为 750rpx 规范]
-->
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 22
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[1. 遵循 uni-app x 原生规范，将 font-weight: 600 统一为 bold；2. 清理 Android 端不支持的 @keyframes 动画（sbFadeIn, sbBadgeIn, sbBadgeOut, sbRise, sbIcoPop）及相关 animation 属性，保持静态直出规范]
-->
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 28
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[按指令清除结算徽章进度环扫完时的 vibrateShort 触觉震动，避免微信模拟器窗口剧烈抖动，待后续按需开启]
-->
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 34
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[在 defineEmits 中新增 close 事件定义，并在退场完成与关闭时派发 close，供首页监听以触发倒水物理动效]
-->
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 40
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[弹层壳迁移到原生 page-container（position=center，同 FoodPicker 模式）：自研 .sb-mask 压暗层＋z900 退役，
    改原生蒙层（overlay-style 黑 50%）＋容器透明、.sb-badge 自带外观与全部进出场动画（exiting/lowMode 类不动）；
    严格 2160ms 自动关仍由内部计时 emit update:show=false 驱动，@afterleave 兜底同步；MP 端 v-if 与 :show 双条件]
-->
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 48
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[.sb-mask 补 z-index:900，与 StickyTop 滚动遮罩（z40）统一全局层级（弹层恒在最上）]
-->
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 54
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[弹层③ 定稿重写（Boss 拍板：双端实现／严格 2160ms 自动关／音效暂缓）：
    ①修复旧草稿编译必炸问题（capEndStyle 括号不配对、badgeRef/animFrame/startTime/easeOutCubic
      重复声明、computed/watch 未 import、animate 死分支、createCanvasContext().then() 编造 API、
      device.level 不存在→store getter 为 tier）；
    ②几何按 Dz3YV 重算：环心 (132,100)、带 54..70、圆头帽在带中线 r62（旧 cap-start 写死 top:22 不在环上）；
    ③蒙层改黑 50%（旧为绿 50%）；进度环改 140 圆环带 conic（旧铺满 264×256 圆角矩形=方形色块）＋补 mint15% 轨道；
    ④BudgetRow 语义修正为「今日 加入后总量 / 目标」（旧误为 before/after），千位空格分隔；
    ⑤动效按 MU1O4 九轨补全：L4 今日行 480ms 上移淡入／L5 夜宵行 600ms／L6 图标 620ms 弹入／
      L9 退出 scale→0.94+淡出 220ms（旧全为注释未实现）；单一 progress 同驱环扫角+中心计数+触感帧；
    ⑥严格自动关：删掉旧草稿的蒙层点按关闭；⑦类名全量 sb- 前缀（旧 .mask/.badge 裸名违反铁律）。]
  修改时间：2026-09-21
  AI模型：Muse Spark
  修改内容：[新建：结算徽章（弹层③）首版草稿（未接线未编译）]
-->
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[实施方案A响应式重构：全量胶囊尺寸(112rpx)、气泡尺寸(192×88rpx)、四阶段动画位移与字号按 750rpx 规范（1px=2rpx）重构]
-->
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 7
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[遵循 uni-app x 原生渲染规范，将 .tb-label 的 font-weight: 600 统一为 bold]
-->
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 13
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[按指令清除切换 Tabbar 时的 vibrateShort 触觉震动，避免微信模拟器窗口剧烈抖动，待后续按需开启]
-->
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 19
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[浅色态气泡在白底上立体投影强化（对齐设计稿）：
    将 .tb-bub-light 的单层弱投影升级为双层墨绿复合柔影（0 2px 6px rgba(0,0,0,0.08), 0 6px 18px rgba(10,79,61,0.14)），
    确保胶囊滑过白色卡片时气泡依然具有清晰的物理悬浮感与立体轮廓]
-->
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 27
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[浅色态「气泡隐身」定稿修正（Boss 拍板：不接受气泡隐身，要有物理体积感）：
    1. 胶囊底减负＝#FFFFFF 88% → **60%**（Boss 说明：88% 那条是稿面文字标注漏改）；
    2. 气泡「雕」出来＝浅色玻璃档新增极细半透明白描边 rgba(255,255,255,.6) 1px（模拟折射亮边）
       ＋ 向下轻投影 0/4/12 rgba(0,0,0,.06)（悬浮高度差）；气泡底色在 18% 与 25% 之间由 AI 看真机截图自定；
    3. 暗色态与 low 档降级方案**保持现状不动**（观感正常）。描边/投影走单类 .tb-bub-light
       （只在 glass 且非暗态时挂），不用后代选择器也不写行内样式，保 App 端可用]
-->
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 38
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[液态玻璃胶囊重构（Pencil gFuXt「Tab 关键帧 (微博标准版)」，Boss 五条拍板）：
    1. 通栏底槽 → 悬浮胶囊（左右各 16、高 56、r28，底＝#FFFFFF 88% ＋ 顶部折光 ＋ 白 80% 描边
       ＋ blur24 ＋ 向上投影 0/-4/24 #0A4F3D 14%）；
    2. 两 Tab → 三 Tab（首页／日历／我的），日历＝Records 升级一级 Tab；
    3. 新增会跑的选中气泡 96×44 r22（Boss 拍板「文字标注为唯一真理」：纯 backdrop-filter blur(20px)
       ＋ 实色 #FFFFFF 18%（暗态 13% ＋ blur28），**不做**节点里遗留的三段渐变与手绘内高光）；
    4. 四关键帧动画：按下 ×0.96／90ms → 移动 ×1.12÷0.94／320ms cubic-bezier(.34,1.56,.64,1)
       → 落位 ×1.06÷0.97／120ms → 静止；图标弹跳滞后 40ms。CSS transition 只在 MP-WEIXIN 下发
       （App／Vapor 禁用 transition），App 端 Worklet 原生线程动画留 TODO 未实现；
    5. 删除 #29 的 fade 渐显 prop 与 barStyle 五属性同驱（Boss：新胶囊前提是恒常可见）；
    6. 色值全部改用 DesignTokens §7 的 TabBar 语义 token；low 档（backdropBlur=false）按稿面降级
       ＝胶囊不透明 #F8FCFA ＋ 气泡实色 ＋ #E3EFE8 描边，折光／投影／动画保留；
    7. 切页起点（气泡从哪一格飞来）改由本地存储 ct_tab_origin 一次性传递。原方案是 components/tabOrigin.uts
       模块单例，实测产物已正确产出 components/tabOrigin.js，运行时却报
       `module 'components/tabOrigin.js' is not defined` → Tabbar 渲染中断、整页白屏；
       cleanCompileCache＋simulator_refresh 跑过仍未见效（包体哈希未变，根因未定案）。
       改走存储载体后不再依赖新模块文件，且天然满足「换页重挂载后仍读得到」；
    8. 入场起点改在 setup 内同步读（首帧即画在上一格）——automator 采样实测到原 onMounted 读法
       会先在目标槽渲染一帧 rest 再跳回起点，出现「闪一下」]
-->
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 62
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[#29 续（Boss：「我想要的 tabbar 是 scroll-fade-navbar 那种效果」）：玻璃底由「常开」改为
    「随滚动渐显」——新增 fade prop(0~1)，底 alpha／顶部折光／上缘高光描边／向上柔影／blur 半径
    全部按 fade 线性抬升；low 档不参与渐显。
    （2026-09-22 液态玻璃胶囊重构中该机制已按 Boss 指令整体废弃，此条留作追溯）]
-->
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 71
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[#29 毛玻璃：底槽改玻璃态＋切 Tab 补 L1 触觉反馈（vibrateShort，按 device.haptics 降级）]
-->
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 77
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Muse Spark
  修改内容：[新建：共享底部 Tab（首页/我的），v2 稿 10:333 规格；redirectTo 切换防栈堆积；
    图片 :src 运行时绑定（绕开编译器 assets 跨页碰撞铁律）]
-->
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Muse Spark
 * 修改内容：[手脚架重建后恢复：从 git 历史取回实现并接线（新文件头；food.ts 数据源路径改为 src/data；其余逻辑原样）]
 */
```

### 文件: `app/manifest.json`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/*
 * [变更日志]
 * 修改时间：2026-09-23
 * AI模型：Gemini 系列
 * 修改内容：[启用 vapor-render-target 字节码目标、配置 Android 图标与启动屏、补充震动权限与微信隐私授权检查]
 */
```

### 文件: `app/pages.json`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/*
 * [变更日志]
 * 修改时间：2026-09-23
 * AI模型：Gemini 系列
 * 修改内容：[注册隐私保护授权弹窗页面 pages/privacy/PrivacyDialog]
 */
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[解决首页顶部截断与背景混乱缺陷：
    1. 将 .header-spacer 占位高度由 176rpx 提升至 220rpx，并重置 .hero 的 margin-top 为 0，彻底消除 Hero 内容上插被固定导航栏腰斩遮挡的问题，日期文案与水瓶瓶盖完整舒展露出；
    2. 移除背景杂乱的 hero_wave 位图素材，.hero 接入纯净清爽的薄荷绿自然平滑渐变 (#E6F8EF -> #F2FAF5)]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 9
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[首页深度视觉与交互修复：
    1. 根治顶部日期看不到：重构 .hm-nav 与 .header 占位高度，确保日期行（date-row）在不同分辨率与平台下 100% 舒展外露；
    2. 清除图标下方难看变形的脏深阴影：重构 .fab 与 .meal-circle 投影，移除生硬深绿暗晕，改用极轻纯净微柔光；
    3. 晚餐（dinner）餐次有食物时默认平铺展开：移除 showDinner 折叠状态机与右侧展开按钮 (.meal-expand / chev_down.svg)，交互体验统一连贯]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 18
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[1. 今日餐次增加无食物时的 empty 状态展示（尚未添加）；2. 调整 .meal-head 高度与 align-items:center，实现左侧圆圈图标与右侧餐次文案精准垂直居中；3. 补齐夜宵（snack）餐次与专属矢量图标；4. 全面升级餐次与公共图标为高清晰矢量 SVG（date_icon/pill_calendar/pill_edit/chev_right/chev_down/meal_sun/meal_sun_l/meal_moon/meal_snack），彻底根除午餐图标下方被截断与位图模糊问题]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 24
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[全量适配 750rpx 设计规范：1. 导航栏、Hero、水瓶腔体与动效位移、宏量卡、餐次列表按 1px=2rpx 改造为 rpx；2. 保留 1px/2px 物理线与状态栏避让；3. 水瓶内胆 CAVITY_HEIGHT 设为 236rpx，波浪与流体物理参数同步适配]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 30
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[接入方案A单流程架构：FAB点击拉起整合版 FoodPicker，内部无缝切换列表与详情，删除宿主侧 addShow/onPickFood/onAddChange 冗余状态机，彻底消除双 page-container 冷启动 1500ms 卡顿]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 36
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[1. 树叶微风摇摆重构：以枝茎根部为 px 支点，通过 CSS transition + @transitionend 实现往复微摆动；2. 水面波浪动效：双层 wave 通过 @transitionend 往复平移动态居中；3. 渐变语法替换为 180deg；4. 清理 Android 端不支持的 @keyframes 动画；5. 打开食物选择与添加确认时清空 addFoodId 防止残留旧选中]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 42
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[修复水瓶点击与长按音效解耦：单次点击水瓶（onBottleTap）播放轻脆反馈 click.mp3（playSound('click')），长按水瓶（onBottleLongPress）保持播放震颤音效 shake.mp3]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 48
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[水瓶与背景尺寸适度放大回归黄金比例：
    1. 背景卡片由 162x162 放大至 176x176，瓶身由 94x152 适度放大至 104x168（解决视觉偏小问题，饱满大气）；
    2. 两侧叶片等比微调至 64x64 / 62x62，保持 V 形托底舒展优美构图；
    3. 流体腔体适配重算（CAVITY_HEIGHT = 118px，宽 73px），严格保持 80% 最高水位限制]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 57
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[水瓶与叶子排布和视觉比例重构（对照参考图精调）：
    1. 瓶身尺寸缩小精细化（112x180 -> 94x152），居中于背景卡片，预留充足呼吸空间；
    2. 叶片尺寸按参考图小巧化（88px -> 58px），排布在瓶底后方两侧呈 V 形斜向上舒展托底；
    3. 流体腔体适配重算（CAVITY_HEIGHT = 106px，宽 66px），严格保持 80% 最高水位限制]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 66
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[水瓶与叶子动效全量落地（接入 4 张独立矢量 SVG 素材：bg.svg / yezi-zuo.svg / yezi-you.svg / pingzi.svg）：
    1. 结构与动效物理彻底解耦：两侧叶子独立微风错相摆动，完全不随瓶身晃动；
    2. 基于 fluid-interaction-expert 规范实现点击二阶欠阻尼钟摆（小狗抖毛）与反相惯性晃水联动，长按高频横向微震颤；
    3. 严格落实水瓶最高水位不超过 80% 约束规则，接入倒水冲击凹陷与回弹涌浪时序]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 75
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[宏量卡（蛋白质、碳水、脂肪）图标全面升级引用高保真矢量 SVG 素材（macro_protein.svg / macro_carb.svg / macro_fat.svg），并微调 .macro-icon 尺寸为 24x24 正方契合]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 81
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[按指令清除水瓶点击/长按、食物长按删除、添加食物确认与倒水动效中的触觉震动(vibrateShort/vibrateLong)，避免微信模拟器窗口剧烈抖动，待后续按需开启]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 87
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[食物删除链路与弹窗时序修复：
    1. 首页今日餐次列表项（.meal-row）接入 @longpress 长按删除确认弹窗，联动 food.removeEntry；
    2. 修复更换食物时前后两个 page-container 并发动画冲突导致的状态机锁死 bug（增加 320ms 延时解耦）]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 95
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[图层架构重构——彻底解决「瓶身随叶子一起晃动」问题：
    1. 废弃 bottle_bg_leaves.png（该图含瓶身白色区域，是分层问题根源）；
    2. 背景光晕改为纯 CSS view 实现（.bottle-bg-glow）；
    3. 左叶/右叶改为独立 image（leaves_left.png / leaves_right.png），各自单独旋转支点和不同动画周期，实现自然错开的微风效果；
    4. 增加倒水水流视觉元素（.pour-stream），配合 triggerPourEffect 从左侧滑入消失，强化注水物理感]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 105
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[水瓶与叶子高级微交互升级：
    1. 点击动效重构为「小狗甩水」物理阻尼钟摆（整体往左-15°再往右+30°随后振荡衰减归零），内部液体正弦波动态联动，彻底摒除缩放感；
    2. 长按动效重构为瓶体水平高频平移 shake 震颤（密集往复平移归零）；
    3. 音效接入升级：点击与长按切换为 shake.mp3 真实晃动音效，倒水 drop-water.mp3 配合 2 秒注水波澜起伏动画精准闭环]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 114
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[水瓶物理动效与轻绿质感全面重构（对齐物理规则与治愈系主题）：
    1. 彻底解决「晃动时周围树叶跟着动」：提取独立静态背景叶子层（.bottle-bg-leaves），瓶身遮罩（.bottle-mask）完全剔除外围叶片，瓶体晃动时背景叶子静止伫立；
    2. 改造点击与长按物理规则：单次点击由瓶底为支点斜向左右摆动（角度衰减阻尼钟摆）且水面正弦波浪联动；长按改为水平快速平移震颤（translateX 手机震动感），不旋转不放大；
    3. 全局优化水瓶颜色设计：水体统一为轻律生活治愈系清透薄荷轻绿多层通透渐变，彻底告别沉重橙色；
    4. 接入添加食物成功后倒水物理效果：监听 SettleBadge @close 事件，弹层消失后播放 drop-water.mp3 倒水音效，伴随液位物理上涌、水流冲击超冲鼓包与波浪激荡]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 124
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[彻底重构水瓶液体质感与动效（解决「没有液体的感觉」Bug）：
    1. 增加双层无缝正弦波浪水面（wave_front + wave_back），不同相位无限循环激荡流动；
    2. 增加水体内部晶莹折射高光带（.liquid-glare）与底部徐徐升起的微气泡（.bubble-1 / .bubble-2）；
    3. 接入入场注水动画（Fill-up Intro），冷启动平滑注水抬升；
    4. 增强水体深层渐变对比度，彻底摆脱单一平面色块感]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 134
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[实施 Phase 2 动态水瓶流体架构：
    1. 将原有静态单图 .bottle 升级为三层夹心结构（底层内胆 .bottle-cavity + 夹层动态液位 .bottle-liquid + 表层刻度遮罩 .bottle-mask）；
    2. 基于零重排 GPU translateY 驱动液位升降与状态色彩联动（绿/琥珀/珊瑚红）；
    3. 接入点击微波激荡、长按蓄力呼吸、食物添加平滑涌入物理动效]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 143
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[实施方案A：页底预留高度升级为动态安全区全避让。
    .page padding-bottom 由固定 78px 改为 92px 并在小程序端结合 calc(82px + env(safe-area-inset-bottom))，
    消除全面屏下内容滚到底被 Tabbar 遮挡的问题，保持 14px 舒适呼吸间距]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 151
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[TabBar 液态玻璃胶囊配套（Boss 拍板第 3/4 条）：
    1. 删除 #29 的 tabFade 计算与 onPageScroll 监听（新胶囊恒常可见，渐显机制整体废弃），
       Tabbar 调用去 :fade 属性；本页再无滚动监听（#28 起首页标题块常驻无阈值）；
    2. .page padding-bottom 由 40 恢复为 78＝悬浮胶囊实占（高 56 ＋ 离底 22，即无小白条机型；
       带小白条机型离底＝safeBottom+12，实占更高，内容仍穿到栏下——Boss 已接受的既知代价）；
    3. 目标 Pill 日历图标 .pill-cal 的 openRecords() 由 navigateTo 改 redirectTo——Records 已升级为
       一级 Tab 页，页内不再有返回钮，必须换页而非压栈]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 163
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[#29 配套（Boss 拍板「缩页底预留位」）：.page 的 padding-bottom 由 78 压到 40，
    让内容常态穿到玻璃 Tabbar（高约 76）之下，玻璃才有东西可透；末屏约 36px 内容会落在半透栏下;
    2. #29 续（Boss：「我想要的 tabbar 是 scroll-fade-navbar 那种效果」）：重新挂回 onPageScroll
    （#28 曾删），按 0→60px 线性算 tabFade（0.05 量化）透传给 Tabbar，底槽随滚动渐显
    （2026-09-22 胶囊化后该机制已按 Boss 指令整体废弃，此条留作追溯）]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 173
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[#28 常驻标题块导航栏（Boss 拍板 Home 标题块三端固定顶部）：标题＋副标题＋FAB 从文档流顶栏抽出，
    合并为全时段 fixed 的 hm-nav（z45，底色同页面底 #F2FAF5，高 sbH+64）；文档流仅留日期行，
    由 .header 的 paddingTop=sbH+64 承担整栏避让（Hero 保持原 -18 上叠，勿重复加 sbH，否则出现空带）；
    删除 P1 hm-st-mask 两态遮罩与 onPageScroll 监听（非透明常驻栏无穿透）]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 182
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[滚动遮罩弃 StickyTop 组件改页内内联 fixed 视图：该组件实测双故障——其 v-if 遮罩视图在 mp-weixin
    端不渲染，且其宿主节点内会再渲染一份整页模板的幻影副本（插值全空、页高虚增）；内联视图与 fx-back 同机制已验证]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 189
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[组件标签一律成对书写（禁自闭合）＋StickyTop 置模板最末：实测本工程 mp-weixin VDOM 产物中任一自闭合
    组件标签会在该宿主内以空作用域重渲染整页模板（幻影副本：插值全空、wx:for 空、页高虚增，首个自闭合标签决定幻影位置）；
    fixed 遮罩与文档序无关，末位安全]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 197
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[接 StickyTop 防穿透遮罩（Boss 拍板 P1）：onPageScroll 两态 scrollTop>80 →
    遮罩以页面底色 #F2FAF5 盖住状态栏带，白卡上滚不再穿透时间/WiFi/电量区]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 204
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[目标 Pill 日历图标 .pill-cal 接 openRecords → navigateTo /pages/records/Records
    （Boss 指令：首页顶部日历图标点击跳转最近记录页）]
-->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 211
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[①AddFood 确认链路补落库：onAddConfirm 调 food.addEntry(computeEntry(...)) 写真实记录
    （Boss 拍板，为最近记录/单日详情页供数；settleAfter 改取落库后的 food.totalCal）；
    ②每日目标 Pill 铅笔图标接 GoalModal（qnNST 重建版），保存直连 goal.setGoal]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[添加成功反馈由 FoodToast（旧横排 toast，设计稿 §0 已否决）替换为弹层③ SettleBadge 结算徽章；
    confirm 后传 kcal／加入后今日总量（food.totalCal+本次，当前不写库）／goal／餐次中文标签]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[接入弹层⓪ FoodPicker：FAB 改为先开食物选择列表 → 选中后开 AddFood；
    AddFood「更换」→ 关自身、重开 FoodPicker 并回显当前 addFoodId]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[页面无法滚动修复：删除 .page 的 flex:1。根因＝uni-app x 运行时 uvue.wxss 强制
    page{height:100%;display:flex}，而 flex:1 简写把根节点钉死为视口高度＋view 默认 overflow:hidden
    裁掉超出内容 → 文档高度永不超屏 → 微信原生页面滚动不触发；删后根节点随内容自然撑高，恢复原生滚动。
    未引入 scroll-view（Boss 否决：多一层滚动容器且非必要）。]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[第二轮还原度修复（设计源改为 Pencil，Ardot 废止）：
    每日目标 Pill 右侧按 Pencil「Home 首页」稿补回铅笔图标（pill_edit.png，深绿 #0C9569，
    13×13，左距 10）——撤销上一轮基于 Ardot 的「删铅笔」，以 Pencil 稿为唯一视觉准绳。]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[还原度修复（对照 Ardot 画板 10:223 ×0.794 换算）：
    餐次明细行增「份量」列（store amountText）；「还能吃」右侧补叶图标；
    kcal 单位改为贴数字底部上提对齐；Goal Pill 改为左侧日历图标结构（删铅笔）；
    宏量卡按稿面 98 高重排（padding/分隔线 47.6）；FAB 改双色渐变；时间轴加粗为 2px 稿面色；
    hero 文本块下移至稿面基线；行高 40]
  修改时间：2026-09-21
  AI模型：Muse Spark
  修改内容：[FAB 接 AddFood 弹窗（演示珍珠奶茶），确认弹 FoodToast（不写库）]
  修改时间：2026-09-21
  AI模型：Muse Spark
  修改内容：[接 store 读数：数字/宏量/餐次走 food＋goal；晚餐默认收起可展开；行图走库内图标]
  修改时间：2026-09-21
  AI模型：Muse Spark
  修改内容：[页内 Tab 替换为共享 Tabbar 组件（active=home），删冗余样式]
  修改时间：2026-09-21
  AI模型：Muse Spark
  修改内容：[我的 Tab 接 navigateTo 个人中心页]
  修改时间：2026-09-20
  AI模型：Muse Spark
  修改内容：[按 v2 设计稿（727788215940571）重建首页 P1：Header/Hero/宏量卡/三餐/页内 Tab；
    小程序端加号胶囊避让（getMenuButtonBoundingClientRect）；图片用设计稿导出 PNG；系统字体降级]
  修改时间：2026-09-20
  AI模型：CodeBuddy (GLM)
  修改内容：[重构为最小手脚架首页：清空业务结构，仅保留品牌标题占位以验证工程可运行]
-->
```

### 文件: `app/pages/privacy/PrivacyDialog.uvue`
- **行号**: 31
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-23
 * AI模型：Gemini 系列
 * 修改内容：[全量换算为 750rpx 规范（1px = 2rpx），弹窗尺寸、滚动区、按钮及字体全部自适应大屏与真机]
 */
```

### 文件: `app/pages/privacy/PrivacyDialog.uvue`
- **行号**: 37
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-23
 * AI模型：Gemini 系列
 * 修改内容：[新建隐私政策授权弹窗页面，支持双端同意逻辑与链接点击]
 */
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[彻底修复图4达标Banner图标视觉Bug：1. 将 check-circle 背景色从深墨绿 #009771 纠正为设计稿正统亮薄荷绿 #1FBF8F；2. 替换内部图标为纯白矢量 check_white.svg，消除颜色发灰与色块变形]
-->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 7
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[基于 ai-worldclass-design 落地高颜值全局顶栏：1. 淘汰粗硬模糊的 header_wave.png 位图；2. 统一接入纯矢量有机双层水波 liquid_wave.svg；3. 升级为全 App 统一高保真双色温薄荷水体渐变 (#4EE2B6 -> #1FBF8F -> #0A7A5C)；4. 优化今日热量浮岛卡片自然叠层 (-32rpx)]
-->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 13
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[全量排查并升级页面内所有位图图标为高清晰矢量 SVG：替换 gear.svg、flame.svg、check.svg、trend_icon.svg，并将所有微型箭头统一为矢量 chev_right.svg，彻底消除位图锯齿与残留]
-->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 19
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[全量换算为 750rpx 规范（1px = 2rpx）：头图、今日热量卡、三项宏量卡、周概览液滴、趋势柱状图与历史列表全量自适应真机]
-->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 25
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[个人中心三项热量卡（目标热量、已摄入、还能吃）图标全面升级引用高保真矢量 SVG 素材（stat_target.svg / stat_consumed.svg / stat_remain.svg），调整合适比例规整展示]
-->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 31
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[解决 uni-app x 编译器将 BannerState 泛型编译为运行时 new BannerState 导致 setup 崩溃白屏的致命Bug，改用纯对象推导；修正 calStatus.color 取值]
-->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 37
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[今日热量卡与达标Banner业务状态机深度重构：
    1. 修复 100% 满额时 conic-gradient 属性解析异常导致外圆环隐身消失的问题，改用实色与渐变自适应兼容；
    2. 解决进度条写死 #23B391 导致全局超标珊瑚色失效的问题，支持绿/琥珀/珊瑚红三态自适应；
    3. 修复「还能吃」数值超标时显示负数诱导误解的Bug，超标归零并切换标签；
    4. 重构「今日达标/不达标」Banner 状态机：当日吃满 2 餐及以上且未超标显示「今日已达标（绿）」，超额即转为「今日不达标（橙色 + 请减少进食，加油啊）」]
-->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 47
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[将 getCalorieStatus 改为从 goal store 直接引入，消除独立 utils 模块在小程序运行期 module is not defined 导致页面崩溃的严重Bug]
-->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 53
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[实施方案A：页底预留高度升级为动态安全区全避让。
    .page padding-bottom 由固定 78px 改为 92px 并在小程序端结合 calc(82px + env(safe-area-inset-bottom))，
    消除全面屏下内容滚到底被 Tabbar 遮挡的问题，保持 14px 舒适呼吸间距]
-->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 61
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[TabBar 液态玻璃胶囊配套（Boss 拍板第 3/4 条）：删 tabFade（渐显机制废弃，
    新胶囊恒常可见），Tabbar 调用去 :fade；onPageScroll 保留（pf-st-mask 两态仍依赖它）；
    .page padding-bottom 40 → 78＝悬浮胶囊实占（高 56 ＋ 离底 22）；
    goRecords 由 navigateTo 改 redirectTo（Records 升为一级 Tab 页，页内无返回钮）]
-->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 70
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[#29 配套（Boss 拍板「缩页底预留位」）：.page 的 padding-bottom 由 78 压到 40，
    让内容常态穿到玻璃 Tabbar（高约 76）之下，玻璃才有东西可透;
    2. #29 续（Boss：「我想要的 tabbar 是 scroll-fade-navbar 那种效果」）：onPageScroll 按 0→60px
    线性算 tabFade（0.05 量化）透传给 Tabbar；该监听原包在 #ifdef MP-WEIXIN 内，现去条件编译三端生效
    （顺带补上 App／Web 端滚动时 pf-st-mask 不响应的既有缺口）
    （2026-09-22 胶囊化后 fade 已按 Boss 指令废弃，此条留作追溯）]
-->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 81
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[P2 暗黑收尾：①头部薄荷渐变在暗色下改实色 #162924（深色卡面色，Pencil 无暗色稿的临时方案）；
    ②滚动遮罩暗色同步 #0E211C→#162924；③状态栏字色随暗黑反转——onShow 与切换后调 uni.setNavigationBarColor
    （深色白字/浅色黑字），App 原生端 plus.navigator 方案留 TODO 待实测]
-->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 89
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[滚动遮罩弃 StickyTop 组件改页内内联 fixed 视图：该组件实测双故障——其 v-if 遮罩视图在 mp-weixin
    端不渲染，且其宿主节点内会再渲染一份整页模板的幻影副本（插值全空、页高虚增）；内联视图与 fx-back 同机制已验证]
-->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 96
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[组件标签一律成对书写（禁自闭合）＋StickyTop 置模板最末：实测本工程 mp-weixin VDOM 产物中任一自闭合
    组件标签会在该宿主内以空作用域重渲染整页模板（幻影副本：插值全空、wx:for 空、页高虚增，首个自闭合标签决定幻影位置）；
    fixed 遮罩与文档序无关，末位安全]
-->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 104
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[接 StickyTop 防穿透遮罩（Boss 拍板 P1）：onPageScroll 两态 scrollTop>80；
    遮罩色随暗黑切换（浅 #EEF7F4 / 深 #0E211C）]
-->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 111
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[深色模式适配（Boss 指令第 5 项）：根节点 :class page-dark 绑 settings.darkMode，
    样式末尾追加 MP-WEIXIN 条件编译的后代覆盖块（薄荷深色临时色板，Pencil 暂无暗色稿）]
-->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 118
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[最近记录卡「查看全部」接 goRecords → navigateTo /pages/records/Records（Boss 指令：个人中心「查看详情」→最近记录页）]
-->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[彻底修复编译器报错与警告：1. 移除 uni-app x 不支持的 min-height: 100%，改用原生规范属性；2. 修复 linear-gradient 携带角度 (180deg/90deg) 的语法警告，规范为无角度标准渐变；3. 解决 .dd-prog-right .dd-pnum 非法后代选择器，重构为单类 .dd-pnum-target；4. 修复 :style 中 calc(116rpx + px) 混合计算在原生端的报错，改由 computed navBarH 像素安全累加计算]
-->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 7
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[基于 ai-worldclass-design 落地高颜值全局顶栏：1. 接入统一 liquid_wave.svg 纯矢量有机双层水波；2. 升级为全 App 统一双色温薄荷水体渐变 (#4EE2B6 -> #1FBF8F -> #0A7A5C)；3. 今日热量卡升级为统一自然浮岛层叠 (-32rpx)，彻底消除单日详情页与其它页面的视觉割裂]
-->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 13
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[1. 彻底防范 Android 端 calc(rpx+px) 动态高度失效，重构 dd-header 为状态栏独立占位层；2. 升级 flame 位图为高清晰矢量 SVG]
-->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 19
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[1. 餐次记录完整保留四大餐次（早/中/晚/夜宵），未记录时展示 empty 状态“尚未添加”；2. 全面升级餐次与导航图标为高清晰矢量 SVG（lr_back/lr_meal_breakfast/lr_meal_lunch/lr_meal_dinner/lr_meal_snack/dd_add/dd_sum），消除位图失真；3. 优化餐次头部垂直居中与空状态卡片排版]
-->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 25
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[全量换算为 750rpx 规范（1px = 2rpx）：Header、今日热量大卡、营养分布三列、餐次列表及总结条全量自适应大屏]
-->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 31
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[接入方案A单流程架构：点击添加食物拉起整合版 FoodPicker，移除 addShow/addFoodId/onPickFood/onAddChange 等冗余状态机，消除双弹窗 1500ms 延迟]
-->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 37
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[1. 修复 Android 端顶部渐变异常：.dd-header 补充 background-color: #39AD95 兜底实色；2. 遵循 uni-app x 原生规范，将 font-weight: 500/600 统一为 bold；3. openPicker 与 onAddConfirm 时清空 addFoodId，防止二次打开残留旧选中]
-->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 43
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[营养分布卡（蛋白质、碳水、脂肪）图标同步更新为矢量 SVG 素材引用（macro_protein.svg / macro_carb.svg / macro_fat.svg），并微调 .dd-mg 为 20x20 正方比例]
-->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 49
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[按指令清除长按删除单条饮食记录时的 vibrateShort 触觉震动，避免微信模拟器窗口剧烈抖动，待后续按需开启]
-->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 55
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[将 getCalorieStatus 改为从 goal store 直接引入，消除独立 utils 模块在小程序运行期 module is not defined 导致页面崩溃的严重Bug]
-->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 61
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[#28 常驻导航栏（Boss 拍板三端固定顶部）：删除 P1 两件套（dd-st-mask 顶遮罩＋dd-fx-back 常驻返回钮），
    合并为单个 fixed 导航栏 dd-nav-fixed（z45，滚动 >40 出现＝渐变末色 #39AD95 实底＋返回箭＋白色粗体动态日期标题＋下投影）；
    onPageScroll 去 MP-WEIXIN 条件编译改三端生效，仍跨阈值才写 ref]
-->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 69
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[滚动遮罩弃 StickyTop 组件改页内内联 fixed 视图：该组件实测双故障——其 v-if 遮罩视图在 mp-weixin
    端不渲染，且其宿主节点内会再渲染一份整页模板的幻影副本（插值全空、页高虚增）；内联视图与 fx-back 同机制已验证]
-->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 76
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[组件标签一律成对书写（禁自闭合）＋StickyTop 置模板最末：实测本工程 mp-weixin VDOM 产物中任一自闭合
    组件标签会在该宿主内以空作用域重渲染整页模板（幻影副本：插值全空、wx:for 空、页高虚增，首个自闭合标签决定幻影位置）；
    fixed 遮罩与文档序无关，末位安全]
-->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 84
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[P1 滚动防穿透（Boss 拍板 B-lite：头部随内容滚走＋返回钮常驻）：
    接 StickyTop 两态遮罩（scrollTop>80 显示，色取 Header 渐变末色 #39AD95，高 sbH+58）；
    新增常驻返回钮 dd-fx-back（fixed z45，44×44 热区中心对准稿面 dd-back 图标中心 (25, sbH+20)）；
    onPageScroll 走 MP-WEIXIN 条件编译，仅跨阈值写 ref]
-->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 93
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[新建：还原 Pencil「单日详情」页 VEWYt（绿色渐变 Header 日期标题 + 今日热量大卡〔火焰标题/超标 pill/
    大数字/进度环 conic/能量条/营养分布三列〕+ 餐次记录四卡（记录行长按 → uni.showActionSheet 删除，
    Boss 拍板交互）+ 今日饮食总结条）；查看日＝food.viewDay（Records 跳转前写入）；
    「添加食物」复用 FoodPicker→AddFood→SettleBadge 链路。]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[解决图3顶部水波异样与图4页面无法滚动缺陷：
    1. 移除 Header 里的 liquid_wave 水波图，改为纯净平滑的自然绿色渐变 (#32D0A0 -> #1FBF8F -> #159C72)，视觉纯净治愈；
    2. 全页面内容包裹在 scroll-view(direction="vertical") 独立滚动容器内，解除 Android/小程序端因 flex:1 视口锁定导致的无法向下滚动 Bug，确保主要食物与三餐摄入丝滑滑动到底部完整露出]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 9
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[彻底根除编译器报错 property value 100% is not supported for min-height：遵循 uni-app x 原生规范，将 .page 的 min-height: 100% 替换为 flex: 1 原生弹性伸缩]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 15
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[基于 ai-worldclass-design 重构三餐摄入四小卡片排版：优化内边距、字号比例与时间项数排布，采用 space-between 纵向黄金比例，注入轻微卡片浮层投影，彻底消除四卡紧凑并排时的拥挤压抑感]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 21
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[基于 ai-worldclass-design 落地高颜值全局顶栏：1. 淘汰粗硬的 lr-arc 切线与高斯光晕；2. 统一全 App 顶级双色温薄荷渐变 (#4EE2B6 -> #1FBF8F -> #0A7A5C)；3. 接入统一 liquid_wave.svg 纯矢量有机双层贝塞尔水波，实现自然浮岛层叠]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 27
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[1. 彻底修复 Android 端月历卡遮挡页面标题 Bug：重构 lr-header 布局，移除不支持的 calc(rpx+px) 动态高度，采用状态栏独立占位层并优化月历卡负边距，标题副标题完整舒展露出；2. 升级 flame 图标为矢量 SVG]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 33
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[全面升级月历翻页、查看详情箭头与餐次图标为高清晰矢量 SVG（lr_prev/lr_next/lr_chev/lr_meal_breakfast/lr_meal_lunch/lr_meal_dinner/lr_meal_snack），消除位图锯齿与模糊]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 39
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[全量换算为 750rpx 规范（1px = 2rpx）：月历卡、选中日汇总、能量条轨道（630rpx）、餐次卡、食物卡全部等比缩放适配真机]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 45
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[1. 修复 Android 选中日期空白与顶部渐变异常：.lr-pill-sel 和 .lr-header 补充 background-color 实色兜底；2. 遵循 uni-app x 原生规范，将 font-weight: 500/600 统一为 bold]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 51
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[按指令清除日历日期选择(pickDay)与月份翻页(prevMonth/nextMonth)中的 vibrateShort 触觉震动，避免微信模拟器窗口剧烈抖动，待后续按需开启]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 57
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[对齐修复：餐次卡 .lr-mcard 内部图标、标题、热量行及脚部项数行全量实现水平轴心对齐居中（align-items: center / justify-content: center），消除视觉偏左偏差]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 63
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[将 getCalorieStatus 改为从 goal store 直接引入，消除独立 utils 模块在小程序运行期 module is not defined 导致页面崩溃的严重Bug]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 69
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Gemini 系列
  修改内容：[实施方案A：页底预留高度升级为动态安全区全避让。
    .lr-bottom-space 由固定 78px 改为 92px 并在小程序端结合 calc(82px + env(safe-area-inset-bottom))，
    消除全面屏下 24px~38px 的内容遮挡，确保「主要食物」卡片滚到底后完整外露于 Tabbar 上方并保留 14px 呼吸间距]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 77
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[升级为一「日历」一级 Tab 页（Boss 拍板第 4 条）：
    1. Tabbar 由 active="home" 改 active="records"，本页成为三槽胶囊的中间 Tab；
    2. 删头图左上返回箭（lr-back ＋ goBack）与常驻导航栏的返回热区（rec-nav-back），
        跨阈出栏只保留标题「最近记录」——一级 Tab 页无返回语义（稿面标题不动，Tab 文案用「日历」）；
    3. 删 #29 tabFade（渐显废弃），onPageScroll 仅保留 rec-nav 两态阈值；
    4. .lr-bottom-space 由 40 恢复 78＝悬浮胶囊实占（高 56 ＋ 离底 22，即无小白条机型）；
        带小白条机型离底＝safeBottom+12（iPhone 模拟器实测 46 → 实占 102），内容仍会穿到栏下，
        属 Boss 拍板「常态穿到栏下」取舍的既知代价，勿据此再改预留值]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 90
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[#29 配套（Boss 拍板「缩页底预留位」）：.lr-bottom-space 高由 90 压到 40，
    让内容常态穿到玻璃 Tabbar（高约 76）之下，玻璃才有东西可透;
    2. #29 续（Boss：「我想要的 tabbar 是 scroll-fade-navbar 那种效果」）：onPageScroll 内按 0→60px
    线性算 tabFade（0.05 量化）并透传给 Tabbar，底槽由常开玻璃改为随滚动渐显
    （2026-09-22 胶囊化后 fade 已按 Boss 指令废弃，此条留作追溯）]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 100
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[#28 常驻导航栏（Boss 拍板三端固定顶部）：删除 P1 两件套（rec-st-mask 顶遮罩＋rec-fx-back 常驻返回钮），
    合并为单个 fixed 导航栏 rec-nav（z45，滚动 >40 出现＝渐变末色 #39AD95 实底＋返回箭＋白色粗标题＋下投影）；
    onPageScroll 去 MP-WEIXIN 条件编译改三端生效，仍跨阈值才写 ref]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 108
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[滚动遮罩弃 StickyTop 组件改页内内联 fixed 视图：该组件实测双故障——其 v-if 遮罩视图在 mp-weixin
    端不渲染，且其宿主节点内会再渲染一份整页模板的幻影副本（插值全空、页高虚增）；内联视图与 fx-back 同机制已验证]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 115
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[组件标签一律成对书写（禁自闭合）＋StickyTop 置模板最末：实测本工程 mp-weixin VDOM 产物中任一自闭合
    组件标签会在该宿主内以空作用域重渲染整页模板（幻影副本：插值全空、wx:for 空、页高虚增，首个自闭合标签决定幻影位置）；
    fixed 遮罩与文档序无关，末位安全]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 123
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[P1 滚动防穿透（Boss 拍板 B-lite：头部随内容滚走＋返回钮常驻）：
    接 StickyTop 两态遮罩（scrollTop>80 显示，色取 Header 渐变末色 #39AD95，高 sbH+58）；
    新增常驻返回钮 rec-fx-back（fixed z45，44×44 热区中心对准稿面 lr-back 图标中心 (25, sbH+15)）；
    onPageScroll 走 MP-WEIXIN 条件编译，仅跨阈值写 ref]
-->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 132
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[新建：还原 Pencil「最近记录」页 bTPUq（绿色渐变 Header + 月历卡〔前后月导航/记录圆点/选中渐变 pill/今日浅 mint pill〕
    + 选中日汇总卡〔火焰总量/超标 pill/目标刻度能量条〕+ 三餐摄入四小卡 + 主要食物四卡）；
    入口＝首页日历图标 / 个人中心「查看全部」；「查看详情」→ 单日详情页（带日参）。]
-->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[彻底根除编译器报错 Identifier 'sbH' has already been declared：清理 script 尾部冗余声明的 let sbH 块，保持统一的 sbH 响应式状态管理]
-->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 7
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[基于 ai-worldclass-design 落地高颜值全局顶栏：1. 淘汰粗硬的 hd-arc 几何圆切线与高斯光晕；2. 统一接入纯矢量有机双层贝塞尔水波 liquid_wave.svg；3. 浅色模式升级为全 App 统一双色温薄荷水体渐变 (#4EE2B6 -> #1FBF8F -> #0A7A5C)，深色模式保持 #162924 静谧暗夜；4. 调整偏好分组标题呼吸留白]
-->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 13
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[1. 彻底修复 Android 端顶部背景丢失 Bug：重构 header 为状态栏独立占位层并恢复绿色双波浪渐变；2. 全量将 settings 内所有 PNG 位图升级为高清晰矢量 SVG（chev_back/icon_moon/icon_bell/icon_target/icon_mega/icon_down/icon_up/icon_shield/icon_trash/icon_leaf）]
-->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 19
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[全面升级向右箭头为高清晰矢量 SVG（chev_right.svg），保持与全局矢量图标规范一致]
-->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 25
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：Gemini 系列
  修改内容：[全量换算为 750rpx 规范（1px = 2rpx），头图波浪、弧线、卡片、开关、图标与字号全量自适应大屏]
-->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 31
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-23
  AI模型：OpenCode / Gemini 底层
  修改内容：[按指令清除切换深色模式开关(toggleDark)时的 vibrateShort 触觉震动，避免微信模拟器窗口剧烈抖动，待后续按需开启]
-->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 37
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[#28 常驻导航栏：P1 遮罩（set-st-mask z40）＋独立返回钮（set-fx-back z45）两件套合并为整栏
    .set-nav（末色底 #39AD95／暗 #162924＋返回箭＋白标题 17/700＋轻阴影，z45，模板最末）；
    onPageScroll 去 MP-only 条件编译（三端通用），阈值 >40 两态不变]
-->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 45
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[P2 设置页暗黑＋状态栏字色反转（Boss 指令）：根节点 page-dark 绑 settings.darkMode，MP-WEIXIN 后代
    覆盖块按薄荷深色板（底 #0E211C/卡 #162924/chip #1E3B33/主字 #EAF9F3/强调 #52D6AC·#8FE8CB/危 #3A221C+#FF8266）；
    暗里头图改实色 #162924＋隐光晕（配状态栏白字，setNavigationBarColor 于 onShow 与切换后同步；App 端 plus.navigator 待实测）；
    滚动遮罩色随暗黑 #162924]
-->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 54
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[滚动遮罩弃 StickyTop 组件改页内内联 fixed 视图：该组件实测双故障——其 v-if 遮罩视图在 mp-weixin
    端不渲染，且其宿主节点内会再渲染一份整页模板的幻影副本（插值全空、页高虚增）；内联视图与 fx-back 同机制已验证]
-->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 61
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[组件标签一律成对书写（禁自闭合）＋StickyTop 置模板最末：实测本工程 mp-weixin VDOM 产物中任一自闭合
    组件标签会在该宿主内以空作用域重渲染整页模板（幻影副本：插值全空、wx:for 空、页高虚增，首个自闭合标签决定幻影位置）；
    fixed 遮罩与文档序无关，末位安全]
-->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 69
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[P1 滚动防穿透（Boss 拍板 B-lite：头部随内容滚走＋返回钮常驻）：
    接入 StickyTop 两态遮罩（scrollTop>80 显示，色取头图实色 #39AD95，高 sbH+58 盖到状态栏＋导航带）；
    新增常驻返回钮 fx-back（fixed，z 45 在遮罩之上，滚过阈值才 v-if 出现，点击 goBack）；
    onPageScroll 仅 MP-WEIXIN 条件编译，只在跨阈值时改 ref 不做逐帧透明度]
-->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 78
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-22
  AI模型：Qoder (Claude)
  修改内容：[头图按 Pencil 最新稿 T0IUr 重建（Boss：设置页顶部还原度不够）：
    竖渐变 #5CC4AC→#39AD95 ＋ 径向光晕椭圆 ＋ 双白弧 ＋ 388×159 大波浪（白10%，新资产 dbWL6@4x 覆写 header_wave.png）；
    返回钮 41px 白圆＋8×14 箭 改为 44px 透明热区＋6×10.5 裸白箭（新资产 jWqeB@4x 覆写 chev_back.png）；
    标题 19→18/700 @(36,46)、副题改白80% @(36,74)（原 x=69）；头图高改 sbH+113（稿 140 含 27 状态栏）；
    首组标题距头图 19→10（稿 150-140）；
    波浪资产改名 header_wave.png→settings_wave.png（模拟器对同路径旧图有强缓存，覆写后仍渲染旧字节，改名破缓存）；
    终案：弃用波浪贴图（模拟器端该 image 恒渲染为不透明薄荷色帽、遮盖渐变），稿面底部波浪带即双白弧椭圆，纯 CSS 实现]
-->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 90
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[「深色模式」行开关由稿面静态改接 settings.darkMode：点击 toggleDark →
    settings.setDarkMode + vibrateShort（Boss 指令第 5 项：点击切换个人中心暗黑主题）]
-->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 97
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
<!--
  [变更日志]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[页面无法滚动修复：删除 .page 的 flex:1（uni-app x 运行时强制 page{height:100%}，
    flex:1 把根节点钉为视口高＋view 默认 overflow:hidden 裁切 → 文档永不超屏原生滚动不触发；
    删后内容自然撑高恢复滚动）。未引入 scroll-view。]
  修改时间：2026-09-21
  AI模型：Qoder (Claude)
  修改内容：[还原度修复（对照 Ardot 画板 11:3 ×0.794 换算）：
    返回钮按稿回滚为半透明白圆+白箭（chev_back.png）；头图收窄（波浪资产裁掉顶部透明区，
    高度 80→49，行底距 52→42）；深色模式行标题包 row-text 修复与开关重叠；
    分隔线对齐稿面从卡边起；箭头 6×11；即将上线 pill 61×21 比例；危险区 chip 34/行高 52]
  修改时间：2026-09-21
  AI模型：Muse Spark
  修改内容：[目标管理行开 GoalModal（保存调 setGoal）；开关保持稿面静态]
  修改时间：2026-09-21
  AI模型：Muse Spark
  修改内容：[目标管理行接 goal 读数；开关保持稿面静态（见 script 说明）]
  修改时间：2026-09-20
  AI模型：Muse Spark
  修改内容：[新建：按 v2 设计稿（727788215940571 · 11:3）1:1 还原设置页 P3：
    渐变头图/偏好组/目标管理组/数据管理组/危险区/页脚]
-->
```

### 文件: `app/stores/device.ts`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Muse Spark
 * 修改内容：[手脚架重建后恢复：从 git 历史取回实现并接线（新文件头；food.ts 数据源路径改为 src/data；其余逻辑原样）]
 */
```

### 文件: `app/stores/food.ts`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[「最近记录/单日详情」两页数据支撑：新增导出 dayKeyOf(ts)（YYYY-MM-DD 日键）与
 *           dayRange(key)（该日 [起,止) 毫秒区间）；store 新增 getter dayTotals
 *           （日键→当日总 kcal，供月历圆点/超标判定一次遍历）；state 新增 viewDay
 *           （Records→DayDetail 跳转传日，免 URL options 兼容问题）；
 *           amountText 改为导出（单日详情行份量用）；MEAL_LABELS.snack 修正为「夜宵」
 *           （对齐 Pencil 稿 MC_夜宵/Meal_夜宵 命名，原「加餐」与稿不符）。]
 */
```

### 文件: `app/stores/food.ts`
- **行号**: 12
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[1. FoodBase 增 py 拼音索引（build.py 新产物字段）；searchFoods 支持
 *            名称子串 / 全拼 / 首字母三种匹配，供弹层⓪ 食物选择列表搜索。
 *          2. 新增导出 vesselLabelOf()：取器具模板中文名（碗/杯/盘…），
 *            供 FoodPicker 副行「一碗约 200g」拼句。]
/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Muse Spark
 * 修改内容：[增补计数步进器三件套 MAX_COUNT/DEFAULT_COUNT/portionRatio/portionLevel（设计稿规格）]
﻿/**
 * [变更日志]
 * 修改时间：2026-09-20
 * AI模型：CodeBuddy
 * 修改内容：[1. 【P0-Bug 修复】按「个/片/串」计的食物热量算错约 80 倍——原 computeEntry
 *            一律按 amount/100 缩放，而这类食物 vessel 档位 amount=1（单位「个」），
 *            base 却是每 100g，必须先乘 pieceWeight 再缩放。实测馒头(p017,pw=75)
 *            正确 167 kcal 却算出 2 kcal。影响面 piece 170 条 / pieceWeight 非空 102 条。
 *            改法：新增导出的 COUNT_UNITS + gramsOf()，computeEntry 增加 unit 入参，
 *            遇计数单位时先 gramsOf 折算 grams 再缩放。g/ml 类行为保持不变（回归项）。
 *          2. 【P0-Bug 修复】sweetOptsOf() 硬返回 []，而 AddSheet 判断写的是
 *            "sweets !== null" → [] !== null 恒真 → 甜度段对所有食物都渲染且内部空。
 *            改法：库解析补读 optTpl（此前只读了 vesselTpl），新增 optGroupsOf(food)
 *            按条目 opts 字段真读模板；AddSheet 改按 groups 渲染且空则不渲染整段。
 *          3. 明细行结构化：MealRow.details 由 string[] 改为 FoodLine[]
 *            （含 img / amountText / kcal / time），供首页每条食物显示自身时分秒 + 缩略图。
 *            Home.uvue 模板同步改造（v-for key 改 d.key）。
 *          4. 选项真正计入热量：OptGroup 补 scale / baseAmount（来自 opts_tpl.yaml
 *             的 scale: by_capacity + base_amount: 500），新增 optDeltaOf()；
 *             computeEntry 增第 5 参 extraKcal——此前选「全糖」热量纹丝不动。]
 */
```

### 文件: `app/stores/food.ts`
- **行号**: 47
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-19
 * AI模型：CodeBuddy
 * 修改内容：[1. 食物 store——库解析（347 条一次，模块级缓存）+ 当日记录（entries）
 *           + 宏量营养素总计（protein/carb/fat，供首页营养素卡）;
 *           2. 接入 app/data/food_library.json 真实数据（含 protein/carb/fat，
 *              由 build.py 从 nutrition_v1.yaml 合并，2026-09-19 补入 base 字段）;
 *           3. 演示数据全部删除，改为从 JSON 加载。
 *           4. 修复：漏 import pinia 的 defineStore，编译产物输出裸全局引用，
 *              运行时 ReferenceError: defineStore is not defined（拖垮 AddSheet/MealIcon）。
 *           5. 修复：mealRows 返回字段（label/entries）与 Home 模板消费字段（name/
 *              active/details）不一致，m.details.length 报 reading 'length'；已对齐
 *              MealRow 结构（key/name/active/cal/details），details 恒为数组。
 *           6. 灌演示数据（Boss 授权）：SEED_PLAN 七天（今日四餐 + 前 6 天），
 *              热量全走 computeEntry 按库值计算；所有统计 getter 改为按日过滤
 *              （todayEntries / weekTotals 新增）；totalCal 从 state 改 getter
 *              （保证与 entries 恒一致，删 totalCal 手工加减的重复状态）。
 *           7. UI 还原度评审 Round1 修复：FoodEntry 增 amount/unit、MealRow 增
 *              time（餐次最早记录 HH:MM）、明细改「名称 份量 · kcal」格式——
 *              对齐设计稿「早餐 · 07:30」「燕麦片 40g · 150 kcal」。]
 * 触发重编译：2026-09-19T22:02
 * ⚠️ 用 .ts 而非 .uts：UTS 编译器会破坏 .uts 里的中文字符串，.ts 编译产物中文完好。
 */
```

### 文件: `app/stores/goal.ts`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Gemini 系列
 * 修改内容：[将 getCalorieStatus 函数收拢至 goal store，彻底解决独立 utils 文件在小程序运行期 module is not defined 导致页面崩溃不加载的致命Bug]
 */
```

### 文件: `app/stores/goal.ts`
- **行号**: 7
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Muse Spark
 * 修改内容：[手脚架重建后恢复：从 git 历史取回实现并接线（新文件头；food.ts 数据源路径改为 src/data；其余逻辑原样）]
 */
```

### 文件: `app/stores/goal.ts`
- **行号**: 13
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-19
 * AI模型：CodeBuddy (GLM-5.3-Flash)
 * 修改内容：[新建：目标 store——每日热量目标（默认 1800，设计稿演示值）。
 *           首页液体/大数字、设置页「目标管理」共用。持久化待接 storage。]
 */
```

### 文件: `app/stores/settings.ts`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-23
 * AI模型：Gemini 系列
 * 修改内容：[根据指令彻底清理 pour 倒水音效类型、音频路径映射与相关定时器逻辑]
 */
```

### 文件: `app/stores/settings.ts`
- **行号**: 7
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-23
 * AI模型：Gemini 系列
 * 修改内容：[升级 playSound 为双缓冲音频实例轮转池机制，设置 mixWithOther 属性并在触发时强制 seek(0)，彻底解决快速连点/连续切换卡片时底层音频实例忙导致吞音与不响的缺陷]
 */
```

### 文件: `app/stores/settings.ts`
- **行号**: 13
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Gemini 系列
 * 修改内容：[1. 新增 shake（水瓶晃动）、slide（拖动滑块）、card（切换卡片/选项）音效类型与音频路径映射；2. 增加倒水音频 pour 配合动画在 2 秒后自动停止机制]
 */
```

### 文件: `app/stores/settings.ts`
- **行号**: 19
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Gemini 系列
 * 修改内容：[新增 pour 倒水音效类型与 /static/audio/pour.mp3 映射，支撑食物结算后水瓶注水物理动效]
 */
```

### 文件: `app/stores/settings.ts`
- **行号**: 25
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Gemini 系列
 * 修改内容：[将 playSound 音效逻辑集中集成在 settings store 中，彻底解决独立 composables 文件在小程序运行期 module is not defined 导致页面崩溃不加载的致命Bug]
 */
```

### 文件: `app/stores/settings.ts`
- **行号**: 31
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[darkMode 解除「v1.0 恒关」锁定：加载时不再强制 false（Boss 拍板个人中心深色模式），
 *   新增 setDarkMode()（持久化 + 供 Settings 开关点击）。]
 */
```

### 文件: `app/stores/settings.ts`
- **行号**: 38
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Muse Spark
 * 修改内容：[新建：设置 store——偏好开关（深色模式 v1.0 置灰、用餐提醒）/ 音效 / 触觉，
 *   本地存储持久化；USER_FOOD_ENABLED=false 集中在此，不散落各处 if]
 */
```

### 文件: `app/stores/user.ts`
- **行号**: 1
- **分类**: A类
- **处理建议**: 删除
- **原注释**:
```
/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Muse Spark
 * 修改内容：[新建：用户 store——昵称/连续记录天数/头像，本地存储持久化；
 *   个人中心头图与统计共用]
 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 190
- **分类**: B类
- **处理建议**: 迁移到 docs/decisions/
- **原注释**:
```
/**
 * 设置每日热量目标（Pencil qnNST 整卡量取重建）。
 * 横向滑条：Track x48 宽 239（值域 1200–2400 吸附 100），Fill/Thumb 由 ratio 驱动；
 * 拖拽用 touch clientX − Dial 卡页面左偏移换算，Dial 左偏移在弹窗打开时查询一次，
 * 查询失败仅禁用拖拽（−/＋钮与快速选择始终可用）。保存 emit 给父调 setGoal。
 */
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 25
- **分类**: B类
- **处理建议**: 迁移到 docs/decisions/
- **原注释**:
```
/** 是否尝试 backdrop-filter（iOS 13+ / Android 部分支持） */
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 433
- **分类**: B类
- **处理建议**: 迁移到 docs/decisions/
- **原注释**:
```
TabBar 随滚动渐显（#29）已于 2026-09-22 随液态玻璃胶囊重构整体废弃：新胶囊恒常可见，
本页因此不再需要任何滚动监听（#28 定案的常驻标题块 .hm-nav 无阈值）
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 345
- **分类**: B类
- **处理建议**: 迁移到 docs/decisions/
- **原注释**:
```
三端生效（原包在 MP-WEIXIN 内，App／Web 端滚动时状态栏遮罩无响应是既有缺口）
#29 的 tabFade 渐显已随 2026-09-22 液态玻璃胶囊重构废弃（新胶囊恒常可见）
```

### 文件: `app/stores/food.ts`
- **行号**: 538
- **分类**: B类
- **处理建议**: 迁移到 docs/decisions/
- **原注释**:
```
/** 从本地存储恢复记录；失败或为空则回落演示种子（Boss 授权灌入） */
```

### 文件: `app/stores/food.ts`
- **行号**: 556
- **分类**: B类
- **处理建议**: 迁移到 docs/decisions/
- **原注释**:
```
存储失败不阻塞记录
```

### 文件: `app/stores/goal.ts`
- **行号**: 49
- **分类**: B类
- **处理建议**: 迁移到 docs/decisions/
- **原注释**:
```
存储失败不阻塞
```

### 文件: `app/stores/settings.ts`
- **行号**: 96
- **分类**: B类
- **处理建议**: 迁移到 docs/decisions/
- **原注释**:
```
存储失败不阻塞
```

### 文件: `app/stores/user.ts`
- **行号**: 42
- **分类**: B类
- **处理建议**: 迁移到 docs/decisions/
- **原注释**:
```
存储失败不阻塞
```

### 文件: `app/App.uvue`
- **行号**: 16
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
触发 device store 初始化（state 内自调 detectDeviceCapability，无单独 detect 方法）
```

### 文件: `app/App.uvue`
- **行号**: 19
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
检查并处理隐私授权状态
```

### 文件: `app/App.uvue`
- **行号**: 33
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 全局单类热量状态颜色 */
```

### 文件: `app/App.uvue`
- **行号**: 41
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 原生按压交互类 (配合 hover-class="ui-pressed") */
```

### 文件: `app/App.uvue`
- **行号**: 43
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/App.uvue`
- **行号**: 45
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/App.uvue`
- **行号**: 51
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 按下时极快进入 */
```

### 文件: `app/App.uvue`
- **行号**: 52
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/App.uvue`
- **行号**: 54
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/App.uvue`
- **行号**: 60
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/App.uvue`
- **行号**: 62
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 256
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 公共添加食物弹层（pencil 弹窗①–⑥⑧ 统一结构）。
 * 奶茶有甜度组，其余只有分量＋餐次；计件类（个/片/串）分量区走步进器，其余走底槽分段。
 * multi 型选项组（加料）本轮不渲染；确认只 emit payload，不写库。
 */
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 284
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 器皿素材元数据（pencil 对照A/B/C/D 定案）：
 * natW/natH = 素材原始像素比；contact = 接触宽（设计稿实测仅 瓶0.93/罐0.93/碗0.64/盘0.49/杯0.64/串0.13，
 * 未实测器形取 0.64 保守值）；solid = 实心不透明素材（金属砝码，未选中压暗 0.85 而非 0.62）；
 * unitFixed = 按份计数类（单颗尺寸固定 33×30，只变颗数不变单体）。
 */
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 317
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 设计定案：三档=同一张图 scale 0.60/0.80/1.00；两档按容量立方根；单档 1.0 */
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 321
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 甜度电量格数映射（展示层：三分/五分/七分/全糖 = 3/5/7/10 格） */
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 428
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
砝码类：单颗固定 33×30，小份/一份/大份 = 1/2/3 颗
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 474
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 白胶囊在 5 等分段间做 x 位移（段不动只动胶囊） */
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 494
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 头部副行：计件类=每单位热量，其余=每100单位热量 */
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 502
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 「已按 X 计算」：器皿档名+克量；步进器带「约 Ng」 */
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 605
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/components/AddFood.uvue`
- **行号**: 607
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/components/CountStepper.uvue`
- **行号**: 102
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 计数步进器（个/片/串）。
 * 能量条 p(n) = ln(1+n)/ln(101)；阈值 mint≤4 / amber 5–24 / coral≥25；
 * 上/下界按钮置灰＋轨道抖 4px；点数字进入键入态，clamp 到 [1,100]。
 */
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 177
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 弹层⓪ 食物选择与添加单流程整合容器（pencil 画板 n3dgv + 弹窗①）。
 * 内部 step 在 list 和 detail 原地切换，全流程仅使用一个原生 page-container 容器。
 */
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 200
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 分类 chips：全部 + 库内真实分类（按首次出现顺序去重） */
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 211
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 打开时把选中行滚进视野 */
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 234
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 副行：热量 + 一条有用提示（优先级：可选项 > 默认份量克重） */
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 242
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
计件类（个/片/串）档位单位不是 g/ml，不加后缀，与稿面香蕉/苹果行一致
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 273
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 原生蒙层点按时回传 show=false 触发离场动画 */
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 278
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 原生蒙层点按/系统返回触发 page-container 离场，动画结束后重置并回传关闭态 */
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 288
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 每次打开重置搜索、分类与步骤（选中回显由 selectedId 驱动） */
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 338
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 340
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 356
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 358
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 367
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/components/FoodPicker.uvue`
- **行号**: 369
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/components/FoodToast.uvue`
- **行号**: 59
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 添加成功 toast（设计稿 弹窗③）。
 * 出现即 L3 反馈（长触觉；音效资产缺失暂略）；2s 自动消失，点按立即关闭。
 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 216
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 稿面 Dial 卡内：Track 左缘 x48、宽 239 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 222
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** Dial 卡相对页面的左偏移；-1 = 未取到，拖拽禁用 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 281
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
震动已按指令统一移除
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 348
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 原生蒙层不自动关闭，点按时回传 show=false 触发离场动画 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 353
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** page-container 离场结束（含系统返回拦截），兜底同步父级关闭态 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 402
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 稿面 D3308：高 560 顶部圆角 34（容器外观已迁 page-container custom-style） */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 406
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 408
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 410
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 头部：徽章与标题 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 417
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 稿面 qhjRQ：44×44 $mintsoft r14，target 图标 22 居中 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 436
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 稿面 q0iCfa：17/700 $ink */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 442
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 稿面 e2vUw：12 $muted */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 448
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 稿面 cPaDA：32 白圆 r16 阴影 #0A4F3D24，x 图标 16 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 463
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 稿面 V5LOp：335×150 $bg r20（页宽 375−左右 20＝自然满宽） */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 473
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 稿面 uI0Rz/E72bQ：44×44 白圆 r22，x44 / x287（卡内），y14 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 496
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 稿面 DUI7r：整卡宽居中，BigNum 46/700 与 unit 13.5/600 底部对齐，gap6；
   左右让开 −/＋钮 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 521
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 拖拽热区：覆盖 Track 上下留白，宽整卡 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 529
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 饱满胶囊轨道：高度 24rpx，圆角 12rpx，背景浅薄荷 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 539
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 填充轨道：高度 24rpx，饱满圆角 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 548
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 550
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 573
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 增大为 52rpx 直径白底滑钮，带精致立体阴影与 3.5px 强调环 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 585
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 587
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 589
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 刻度行：严格对齐 5 个档位 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 616
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 快速选择：废除灰色大托盘，改为 5 个独立的圆角胶囊药丸并排 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 635
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 快速选择选中态：纯白底 + 明显柔和投影 + 翠绿细边框 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 659
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 提示卡片 */
```

### 文件: `app/components/GoalModal.uvue`
- **行号**: 695
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 保存按钮：饱和深翠绿渐变，白字 4.8:1 超强对比度 */
```

### 文件: `app/components/OptionTray.uvue`
- **行号**: 101
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 单选底槽（分量/糖包等单选组通用）。
 * 设计哲学（pOYw3）：「去卡片、用体积与光」——选中件不套白卡，靠 抬升＋光晕＋落地影＋文字加粗 表达；
 * 光晕/落地影按素材体积公式动态算（接触宽逐素材，由调用方随 TrayOption.contact 传入）。
 * 未选中压暗：透明/浅色素材 0.62，实心不透明素材（金属砝码）0.85。
 * 动效：220ms 位移/透明过渡；选中 scale 0.94→1 弹性入场。
 */
```

### 文件: `app/components/OptionTray.uvue`
- **行号**: 118
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 并排颗数（砝码类 1/2/3 颗；常规为 1） */
```

### 文件: `app/components/OptionTray.uvue`
- **行号**: 120
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 接触宽系数（设计实测：瓶0.93/罐0.93/碗0.64/盘0.49/杯0.64/串0.13） */
```

### 文件: `app/components/OptionTray.uvue`
- **行号**: 122
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 实心不透明素材（未选中压暗 0.85 而非 0.62） */
```

### 文件: `app/components/OptionTray.uvue`
- **行号**: 135
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 组宽：多颗砝码按整排算（颗间 4px） */
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 76
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 环形进度画布：正中 296rpx 正方居中，底轨与进度条由 Canvas 一体化绘制，彻底消除左上角圆圈 -->
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 98
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 弹层③ 结算徽章（Pencil Dz3YV 结构 + MU1O4 动效时间轴）。
 * 单一 progress（0..1，140ms 起 620ms easeOutCubic）同驱：环扫角、中心计数、到位触感帧。
 * 严格 2160ms 自动关（无点按关闭）。low 档只留淡入淡出、直落终值。
 */
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 121
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
—— MU1O4 时间轴常量（ms） ——
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 139
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
画布尺寸状态记录
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 157
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 千位空格分隔（稿面「1 120 / 1 800」），双端安全的手工实现 */
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 172
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
—— Canvas 绘制逻辑 ——
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 176
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#ifdef APP
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 188
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#endif
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 192
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#ifdef MP-WEIXIN
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 213
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#endif
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 231
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
1. 完整底轨圆环（浅薄荷透明绿）
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 238
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
2. 顺时针进度条（带圆头，饱满轻律翡翠绿或超标暖橙）
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 255
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
异步容错补测
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 257
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#ifdef APP
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 259
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#endif
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 275
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 离场结束，兜底同步父级关闭态 */
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 351
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* —— L2 徽章：528×512 r56 —— */
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 378
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* —— 环形画布：正中精准定位 —— */
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 387
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* —— 中心数字栈 —— */
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 411
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* —— L4 今日行 —— */
```

### 文件: `app/components/SettleBadge.uvue`
- **行号**: 430
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* —— L5 夜宵行与图标 —— */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 87
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 选中气泡：稿面完全内嵌于胶囊（上下各留 6、左右各留 4），几何由 :style 逐帧下发 -->
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 109
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 当前激活页：home | records | profile */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 111
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 深色底（个人中心／设置暗黑主题时由页面传入；默认 false=稿面浅底） */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 115
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
── 稿面几何（DesignTokens §7.2，按 750rpx 规范自适应，基准宽 750rpx 对应 375dp）────
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 121
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 气泡飞行起点（上一个 Tab 的下标）跨页载体：redirectTo 会重挂载组件，模块级状态在小程序端不可靠 */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 137
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
一次性消费：读完即清，冷启动才不会拿上次会话的残留起点乱飞
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 140
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
存储不可用时不做飞入动画
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 149
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
同上，起点丢了只是这一次不飞
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 158
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
── 运行时尺寸（严格按 750rpx 比例等比映射到实际屏幕宽度）：──────────────────────
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 161
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
32rpx 左右边距
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 162
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
112rpx 胶囊高
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 163
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
192rpx 气泡静止宽
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 164
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
88rpx 气泡静止高
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 166
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
移动：横向拉伸
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 167
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
移动：纵向压扁
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 179
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 按下态气泡所在槽（＝上一页的 Tab）；其余阶段气泡恒指向本页槽位 */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 181
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** rest | press | travel | settle —— 与稿面四关键帧一一对应 */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 184
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
入场起点必须在 setup 内同步定：首帧就得画在「上一页那一格」，
放 onMounted 会让气泡先在目标槽闪一帧再跳回起点（automator 采样实测到）
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 196
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
有小白条＝贴在安全区上方 24rpx（稿面「距 Home 指示条 12px」）；无小白条＝44rpx 离底
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 216
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
左边缘由宽反算＝压扁／拉伸天然居中
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 222
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
底色在运行时下发（不写成 .a.b 复合类选择器：App 端只认单类），取值＝DesignTokens §7.2
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 227
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#ifdef MP-WEIXIN
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 232
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#endif
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 262
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 入场时间线：起点态已在 setup 内就位（press＋anchorIdx），此处只推进 移动→落位→静止 三段 */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 283
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
L1 反馈（切 Tab）：按下压扁动画，震动已按指令统一移除
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 287
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
90ms＝稿面「静止→按下」时长，让压扁被看见一瞬再换页（换页后由新页继续飞入→落位）
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 295
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* ── 胶囊：悬浮、四周留空气，靠朝上柔影与背景模糊撑起体积 ── */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 303
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 玻璃档（backdropBlur=true）：底 #FFFFFF 60% ＋ 顶部折光 ＋ 白 80% 描边 ＋ 向上柔影 */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 318
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 323
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 324
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 降级档（low 机／无模糊能力）：稿面「胶囊改不透明 #F8FCFA」，折光与投影保留 */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 330
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 暗黑档：卡色 token #162924 加 alpha（玻璃面不丢 alpha），描边白 10%，投影改向下黑 */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 341
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* ── 三颗 Tab：图标在左、文字在右 ── */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 355
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 源图留白不等，按稿面逐个回调到视觉等大 */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 378
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* ── 选中气泡 ── */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 384
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 389
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 图标／文字高亮比气泡晚 40ms */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 395
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 411
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 416
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 427
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 428
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 暗黑文字（后代选择器只在 MP 端生效；App 端须改逐元素 :class，见 AGENTS 深色模式条款） */
```

### 文件: `app/components/Tabbar.uvue`
- **行号**: 435
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 7
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
useDeviceCapability.ts — 设备能力检测
按平台 + 机型 + 系统版本分档，决定哪些反馈可以开。
不依赖任何运行时探测，纯静态规则，改规则改这里就行。
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 13
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
── 类型 ──────────────────────────────────────────────
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 19
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 是否支持触觉反馈 */
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 21
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 是否播放液体波纹动画 */
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 23
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 是否播放音效 */
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 29
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
── iOS 机型分代（A 系列芯片）────────────────────────
分界：A11 (iPhone X, 2017) 及以前 = low；A12/A13 = mid；A14+ = high
未在列表中的机型（如 iPhone9,3 SE2）走系统版本兜底
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 33
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
iPhone 6s / 6s Plus (A9, 2015)
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 35
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
iPhone 7 / 7 Plus (A10, 2016)
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 37
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
iPhone 8 / 8 Plus (A10, 2017)
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 39
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
iPhone SE 1 代 (A9, 2016)
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 41
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
iPhone 7 / 7 Plus (iOS 16+ 重新标识)
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 43
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
iPhone 8 / 8 Plus (iOS 16+ 重新标识)
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 45
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
iPhone X (A11, 2017)
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 50
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
iPhone XS / XS Max (A12, 2018)
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 52
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
iPhone 11 / 11 Pro / 11 Pro Max (A13, 2019)
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 56
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
── Android 低性能机型特征 ──────────────────────────
判断逻辑：系统版本 + 芯片特征（从 model 字符串推断）
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 58
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
Android 7.1.2 及以下
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 59
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
Android 9 及以下算 mid
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 61
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
已知低端芯片关键词（MediaTek Helio / Snapdragon 4xx / 旧款 Exynos / 紫光展锐）
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 66
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
2016 旗舰，现在算低端
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 71
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
── 检测函数 ─────────────────────────────────────────
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 73
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#ifdef APP-PLUS
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 76
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#endif
H5 / 其他端默认 android
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 82
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#ifdef APP-PLUS
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 92
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#endif
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 97
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
机型判断优先
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 101
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
未识别机型用版本推断（SE2/SE3 等不在列表中的走这里）
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 111
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
芯片关键词判断
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 119
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
── 对外接口 ─────────────────────────────────────────
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 121
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 检测当前设备能力，返回完整 DeviceCapability 对象 */
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 129
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
触觉：low 档关，mid/high 开
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 131
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
液体波纹：low 档关，mid/high 开
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 133
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
音效：所有档都开（音效开销极小）
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 135
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
backdrop-filter：low 档关，mid/high 开
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 140
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 预计算实例（App 启动时用一次），供非 Vue 上下文使用 */
```

### 文件: `app/composables/useDeviceCapability.ts`
- **行号**: 143
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 在组件中响应式获取（如果以后支持动态切换） */
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 267
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 标题与操作栏（顶栏常驻+日期整合，对齐设计图规范，保证日期完全外露） -->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 284
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 顶栏文档流占位层（为常驻导航栏腾出充足空间，确保日期完全外露不被切） -->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 287
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- Hero（常驻标题块：紧接导航栏下方，纯净绿色渐变底） -->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 289
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 独立底层背景：柔和底色渐变 + 流体斑块 + 装饰气泡星芒（bg.svg） -->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 291
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 左侧独立叶子（yezi-zuo.svg，旋转支点在茎底，自然微风往复微摆） -->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 299
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 右侧独立叶子（yezi-you.svg，旋转支点在茎底，自然微风错相往复微摆） -->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 307
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 倒水水流视觉条（pour 时激活，从左上切入瓶口） -->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 309
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 水瓶交互主体：底层内胆流体 + 表层纯净瓶身本体（pingzi.svg，独立物理动效） -->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 313
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 双层无缝正弦波浪液面 -->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 316
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 液体深层流动晶莹反光带 -->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 318
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 向上漂浮微气泡 -->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 323
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 纯净瓶身 SVG（含刻度线、侧高光、瓶盖与投影，完全无叶子粘连） -->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 345
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 宏量卡 -->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 366
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 今日餐次 -->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 406
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 底部 Tab（共享组件：液态玻璃悬浮胶囊，三 Tab 首页／日历／我的） -->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 409
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 弹层⓪ 食物选择与添加单流程（列表+详情内部无缝切换） -->
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 419
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 演示数据（稿面静态值，store 重建后再接真实数据）。
 * 缩放系数 0.794：v2 画布 472px → 应用 375px。
 */
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 424
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
状态栏高度（自定义导航时顶栏避让）
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 436
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
右上加号位置：默认稿面位置；小程序端放到胶囊左侧防遮挡
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 439
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#ifdef MP-WEIXIN
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 448
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
取不到胶囊信息时保持默认位置
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 450
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#endif
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 463
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 接 store 读数（今日种子精确还原 v2 行：早 420 / 午 560 / 晚 390，宏量 68/156/42）。
 * 稿面「已摄入 1270 / 还能吃 530」自身与餐和 1370 矛盾，以 store 真值（1368/432）为准。
 */
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 477
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
瓶身内胆几何参数与最高水位硬约束（Boss 规则：最高不超过 80% 高度）
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 478
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
与 CSS .bottle-cavity (236rpx) 一致
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 481
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
瓶身流体动效状态
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 486
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
波浪微振位移 (rpx)
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 487
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
倒水注入时的弹性超冲位移 (rpx)
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 488
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
倒水水流条纹是否激活
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 498
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
树叶自然往复微风摆动状态
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 505
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
水面波浪往复流动状态
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 528
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
入场注水动效：进页面先置为底部 (CAVITY_HEIGHT - 12)，挂载后平滑注水落位到真实水位
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 550
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
液位高度计算：内腔有效高度 236rpx，根据已摄入/目标百分比映射为 translateY
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 553
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
初始极低水位，等待注水升起
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 556
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
水位限制在 0.06 ~ 0.80 之间，严格遵守 80% 限高规则，预留 20% 注水冲击空腔
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 558
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
translateY = CAVITY_HEIGHT * (1 - ratio) + 微波动效偏移 + 倒水超冲位移
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 564
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
水体受瓶身倾斜反作用力的惯性剪切（瓶身右倾时液体向左下倾斜）
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 572
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
液体颜色与全局卡路里状态联动（保持薄荷治愈系清透轻绿设计）
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 597
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
fluid-interaction-expert: 二阶欠阻尼钟摆甩水模型（总历时约 385ms）
1. 先向左蓄势 -14°
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 603
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
2. 猛烈反向甩动过冲 +24°
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 607
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
3. 回摆 -16°
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 611
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
4. 余摆 +8°
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 615
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
5. 微摆 -3°
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 619
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
6. 归零平息
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 647
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
fluid-interaction-expert: 28Hz 高频密集微平移（纯 translateX: ±8rpx，不旋转不缩放）
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 703
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 弹层⓪ 选择并添加食物（确认写库＋弹弹层③ 结算徽章）；Pill 铅笔 → GoalModal */
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 717
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
Records 已升级为一级 Tab 页（无返回钮）→ 用 redirectTo 换页，不压栈
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 749
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
落库（2026-09-21 Boss 拍板：确认即写真实记录，供首页/最近记录/单日详情消费）
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 761
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
结算徽章完全退场，不播放倒水特效（根据用户要求移除）
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 765
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
激活水流条纹视觉（从左滑入瓶口，CSS animation 自动执行 1.3s 后自动隐藏）
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 771
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
3. 物理倒水注水模拟：水柱重力冲入液面，水面下砸凹陷（-28rpx）→ 回弹涌浪（+24rpx）→ 阻尼平息
先延迟 180ms 让水流条纹先切入瓶口，再触发水面重力下砸
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 774
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
冲击下凹：translateY 增加 28rpx（视觉凹陷）
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 780
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
冲击反冲涌浪：translateY 减少 24rpx（视觉上浮涌浪）
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 830
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 832
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 834
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 常驻标题块导航栏（#28 方案A：Boss 拍板三端固定顶部，替代 P1 hm-st-mask 两态遮罩）：
   z45 全时段置顶，底色同页面底 #F2FAF5（非透明→无状态栏带穿透，也无需滚动阈值） */
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 895
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 顶栏文档流占位层 */
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 908
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 独立底层背景：柔和底色渐变 + 流体斑块 + 装饰气泡星芒（bg.svg） */
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 917
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 左侧叶子：尺寸雅致（128x128），从瓶身左后方向左上方舒展，旋转支点在茎部右下方（112rpx 122rpx） */
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 930
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 右侧叶子：尺寸雅致（124x124），从瓶身右后方向右上方舒展，旋转支点在茎部左下方（14rpx 118rpx） */
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 943
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 倒水水流条：pour 动效激活时从左侧倾倒 */
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 987
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 主题色清透轻绿治愈系水体质感 */
```

### 文件: `app/pages/home/Home.uvue`
- **行号**: 1000
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 液体内部高光反光带，赋予水体真实晶莹通透折射感 */
```

### 文件: `app/pages/privacy/PrivacyDialog.uvue`
- **行号**: 19
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- #ifdef MP-WEIXIN -->
```

### 文件: `app/pages/privacy/PrivacyDialog.uvue`
- **行号**: 21
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- #endif -->
```

### 文件: `app/pages/privacy/PrivacyDialog.uvue`
- **行号**: 22
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- #ifndef MP-WEIXIN -->
```

### 文件: `app/pages/privacy/PrivacyDialog.uvue`
- **行号**: 24
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- #endif -->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 127
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 头图（全App统一薄荷液滴水体渐变 + 纯矢量双水波） -->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 140
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 设置齿轮：挂在页面根上相对 .page 定位（小程序端 .header 内的 absolute 基准实测会偏移一个状态栏高度） -->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 145
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 今日热量卡 -->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 210
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 达标 Banner：支持达标绿态与超额橙态状态机自适应 -->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 224
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 本周概览 -->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 245
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 热量趋势 -->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 280
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 最近记录 -->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 308
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 底部 Tab（共享组件，我的激活） -->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 311
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 滚动防穿透遮罩：页内内联 fixed 视图（StickyTop 组件实测双故障：遮罩不渲染＋宿主内渲染整页幻影副本） -->
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 319
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#ifdef MP-WEIXIN
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 321
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#endif
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 328
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 接 store 读数（种子精确还原：历史 1950超+150/1720达/1580达；趋势 1580…1950/1368；
 * 周 dots 按 1800 判定，6/7 达标——稿面 4/7 与自家数据矛盾，以真值为准）。
 */
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 343
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
滚动防穿透两态：跨阈值才翻一次，避免逐帧 setData
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 348
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
遮罩阈值＝头图高 sbH+89 − sbH：内容将穿透状态栏带才盖
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 353
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
设置齿轮位置：默认稿面（右 25、状态栏下 13）；小程序端移到胶囊左侧、与胶囊垂直居中对齐
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 356
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#ifdef MP-WEIXIN
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 361
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
窗口尺寸切换瞬间胶囊 rect 可能越界（left≥窗宽），校验后再用；onShow 重算兜底
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 364
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
齿轮挂在页面根上，页面坐标系即屏幕坐标；模拟器/真机对胶囊 top 的基准不一致，
小于半个状态栏高度视为「状态栏下相对值」，补回 sbH 再定位
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 373
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
取不到胶囊信息时保持默认位置
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 377
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
状态栏字色随暗黑反转（Boss P2 指令）：小程序走 setNavigationBarColor；
TODO App 原生端改 plus.navigator.setStatusBarStyle 实测后补
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 386
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#endif
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 397
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
Records 已升级为一级 Tab 页（无返回钮）→ 用 redirectTo 换页，不压栈
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 411
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 圆环样式字符串：100% 满额时直接使用实色 color，低于 100% 时使用 conic-gradient，彻底解决全满时圆环消失问题 */
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 420
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 今日吃过的有效餐次数 */
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 425
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 达标 Banner 状态机：
 * 1. 达标：至少记录 2 个餐次且未超额（food.totalCal <= goal.calorieGoal && activeMealCount >= 2 && food.totalCal > 0）
 * 2. 不达标：超额（food.totalCal > goal.calorieGoal）-> 橙色图标，请减少进食，加油啊
 * 3. 记录中：未超额但不足 2 餐
 */
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 476
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
连续 7 天位置标签一..日；三态：绿底白勾达标 / 珊瑚底白「!」超标 / 灰圈空缺
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 491
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
柱高 = val / 2400 * 200rpx（稿面纵轴）；日期取实际 M/D
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 514
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
最近 3 天（不含今天）：日期/周几/总量/达标态（超标态徽章内含超出值，按 Pencil 稿「超标 150 kcal」）
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 536
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 538
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 1064
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* ===== 深色模式（Boss 拍板：Settings 开关点击切换；色板为薄荷深色临时方案，Pencil 暂无暗色稿） =====
   后代选择器仅 mp 端生效——uvue 原生端不支持，App 端适配时须改逐元素 :class 方案 */
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 1066
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/pages/profile/Profile.uvue`
- **行号**: 1156
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 104
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- Header（全App统一薄荷液滴水体渐变 + 纯矢量有机双水波） -->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 111
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 统一纯矢量双层水波 -->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 115
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 今日热量卡 -->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 178
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 餐次记录 -->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 216
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 今日饮食总结 -->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 232
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 常驻导航栏（#28：替代 P1 遮罩＋fx-back 两件套）：滚动跨阈后整栏出现＝末色底＋返回箭＋日期标题，三端生效 -->
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 252
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 单日详情（Pencil VEWYt 逐节点量取）。
 * 查看日＝food.viewDay（Records 跳转前写入，空则今日）；
 * 记录行长按 → uni.showActionSheet「删除这条记录」→ removeEntry（Boss 拍板）。
 */
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 264
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
常驻导航栏高度计算：58px (116rpx) 内容高 + 状态栏高，避免跨端 calc(rpx+px) 错误
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 267
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
常驻导航栏两态（#28，三端生效；跨阈值才写 ref 避免逐帧 setData）：>40 整栏出现＝
头图渐变末色 #39AD95 实底＋返回箭＋日期标题，与滚动中的头图无缝接续
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 308
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 进度环：MP 端 conic-gradient（SettleBadge 同款通路），App 端 canvas 未接（真机待验，见 DayDetail.md） */
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 383
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 长按删除（Boss 拍板：uni.showActionSheet 底部菜单加删除项） */
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 394
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
===== 添加食物链路（方案 A 单流程） =====
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 428
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* ===== Header（全App统一薄荷液滴水体：渐变 + 纯矢量水波） ===== */
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 463
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* ===== 今日热量卡 348×229 r16，统一自然浮岛层叠 ===== */
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 645
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* ===== 餐次记录分区 ===== */
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 680
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* ===== 餐次卡 347 r16（高随行数：122 + 46*(n-1)） ===== */
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 775
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* ===== 今日饮食总结 347×76 r16 ===== */
```

### 文件: `app/pages/records/DayDetail.uvue`
- **行号**: 814
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 常驻导航栏（#28：替代 P1 顶遮罩＋fx-back 两件套）：z45；标题动态＝日期·星期（headerTitle） */
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 143
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- Header（纯净自然的高级绿色平滑渐变） -->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 145
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 状态栏独立占位层，杜绝跨端 calc(rpx+px) 塌陷 -->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 155
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 月历卡 -->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 174
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 选中日汇总卡 -->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 202
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 三餐摄入 -->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 228
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 主要食物 -->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 253
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 常驻导航栏（#28）：本页已升为一级 Tab 页，跨阈出栏只留标题，无返回钮（Boss 拍板第 4 条） -->
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 267
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 最近记录（Pencil bTPUq 逐节点量取）。
 * 月历按周一起始 7 列 flex:1（列心 24.79+i*49.57 与稿面一致）；
 * 圆点/汇总/小卡全部由选中日 selKey 驱动，数据源＝food store 全量 entries。
 */
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 279
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
常驻导航栏高度计算：58px (116rpx) 内容高 + 状态栏高，避免跨端 calc(rpx+px) 错误
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 282
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
常驻导航栏两态（#28，三端生效；跨阈值才写 ref 避免逐帧 setData）：>40 整栏出现＝
头图渐变末色 #39AD95 实底＋标题，与滚动中的头图无缝接续
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 292
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
页面级滚动备用兼容
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 303
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
0-based
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 320
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 6 行 × 7 列网格（末行整行为出月则裁掉，稿面 5 行为准） */
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 325
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
周一起始的前置天数
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 398
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 选中日全部记录（按时间升序） */
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 418
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 319px 宽，最大跨度 2x goal */
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 430
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 能量条：轨道 = max(总量, 目标) 满轨；白刻度钉在目标位 */
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 489
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 主要食物 = 选中日按热量降序前 4 条（同名合并展示留待真机复核） */
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 529
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* ===== Header（普通自然的高级绿色平滑渐变） ===== */
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 543
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 一级 Tab 页无返回箭：标题直接居左呼吸排列 */
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 562
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* ===== 月历卡 347×292 r18，自然上叠保留呼吸感 ===== */
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 663
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* ===== 选中日汇总卡 347×92 r16 ===== */
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 782
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* ===== 分区标题 ===== */
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 816
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* ===== 餐次小卡（4张卡片自适应呼吸排版，消除拥挤感） ===== */
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 892
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* ===== 食物卡 80×104 r14 ===== */
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 936
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 938
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/pages/records/Records.uvue`
- **行号**: 940
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 常驻导航栏（#28）：z45 在 Tabbar（z30）之上；本页升为一级 Tab 页后栏内无返回钮，只剩标题 */
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 124
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 头图（全App统一薄荷液滴水体渐变 + 纯矢量有机双水波） -->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 126
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 状态栏独立占位，杜绝混合 calc(rpx+px) 塌陷 -->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 139
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 统一纯矢量双层水波 -->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 143
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 偏好 -->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 172
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 目标管理 -->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 198
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 数据管理 -->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 224
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 本机声明 -->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 230
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 危险区 -->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 238
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 页脚 -->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 246
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 每日热量目标弹窗 -->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 249
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
<!-- 常驻导航栏（#28：替代 P1 遮罩＋fx-back 两件套）：滚动跨阈后整栏出现＝末色底＋返回箭＋标题，三端生效 -->
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 260
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 接 store 读数：目标管理行读 goal；深色模式开关接 settings.setDarkMode（Boss 拍板：
 * 点击切换，个人中心按该值渲染暗黑主题）。
 * 缩放系数 0.794：v2 画布 472px → 应用 375px。
 */
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 269
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#ifdef MP-WEIXIN
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 271
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#endif
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 282
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
常驻导航栏高度计算：58px (116rpx) 内容高 + 状态栏高，避免跨端 calc(rpx+px) 错误
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 285
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
状态栏字色随暗黑反转（Boss P2 指令）：小程序走 setNavigationBarColor；
TODO App 原生端改 plus.navigator.setStatusBarStyle 实测后补
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 288
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#ifdef MP-WEIXIN
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 290
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#endif
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 292
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#ifdef MP-WEIXIN
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 296
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#endif
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 298
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
常驻导航栏两态（跨阈值才写 ref，避免逐帧触发 setData）：>40 即整栏出现——
该滚位头图渐变已近末色 #39AD95，栏底实色与稿面无缝；onPageScroll 三端通用（#28 去 MP-only）
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 377
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 常驻导航栏（#28）：滚动后整栏出现，返回箭＋标题，z45 压顶遮罩档与 Tabbar */
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 560
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* ===== 深色模式（Boss P2：与个人中心同薄荷深色板；后代选择器仅 mp 端生效，App 端须改逐元素 :class） ===== */
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 561
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #ifdef MP-WEIXIN */
```

### 文件: `app/pages/settings/Settings.uvue`
- **行号**: 610
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* #endif */
```

### 文件: `app/stores/device.ts`
- **行号**: 7
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
stores/device.ts — 设备能力 Pinia store
全局单例，App 启动时检测一次，所有组件通过 useDeviceStore() 读取。
检测逻辑来自 composables/useDeviceCapability.ts，这里只做存储和暴露。
```

### 文件: `app/stores/device.ts`
- **行号**: 28
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 运行时重新检测（极少需要，如插拔蓝牙键盘后） */
```

### 文件: `app/stores/food.ts`
- **行号**: 75
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
===== 类型定义 =====
```

### 文件: `app/stores/food.ts`
- **行号**: 76
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 搜索拼音索引（build.py 生成）：f=全拼连写，i=首字母串 */
```

### 文件: `app/stores/food.ts`
- **行号**: 86
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
每 100g / 100ml 热量
```

### 文件: `app/stores/food.ts`
- **行号**: 87
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
g 或 ml
```

### 文件: `app/stores/food.ts`
- **行号**: 88
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
g / 100g|ml
```

### 文件: `app/stores/food.ts`
- **行号**: 91
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
按个计食物的克重
```

### 文件: `app/stores/food.ts`
- **行号**: 96
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 数据来源标识（composition_table / recipe_estimate / rough_estimate），记录快照用 */
```

### 文件: `app/stores/food.ts`
- **行号**: 98
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 搜索拼音索引（全拼 f + 首字母 i），build.py 生成 */
```

### 文件: `app/stores/food.ts`
- **行号**: 123
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 是否为量级估算（toolchain/sources/opts_tpl.yaml 的 estimate 字段） */
```

### 文件: `app/stores/food.ts`
- **行号**: 127
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 选项模板组（对应 opts_tpl.yaml 的一个 opt_templates 条目） */
```

### 文件: `app/stores/food.ts`
- **行号**: 132
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
single | multi
```

### 文件: `app/stores/food.ts`
- **行号**: 134
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** delta_kcal 的缩放方式：by_capacity（按容量线性）/ none（定值） */
```

### 文件: `app/stores/food.ts`
- **行号**: 136
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** scale=by_capacity 时的基准量（ml），opts_tpl.yaml sweet.base_amount=500 */
```

### 文件: `app/stores/food.ts`
- **行号**: 142
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 计数类单位：这类单位的 amount 是「几个」，必须借 pieceWeight 折算成克 */
```

### 文件: `app/stores/food.ts`
- **行号**: 145
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 计数步进器上限（设计稿 CountStepper 规格：n ∈ [1, 100]，默认 3） */
```

### 文件: `app/stores/food.ts`
- **行号**: 148
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 默认计数（步进器首次打开） */
```

### 文件: `app/stores/food.ts`
- **行号**: 151
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 份量能量条：对数刻度，返回 0..1 的条宽比例 */
```

### 文件: `app/stores/food.ts`
- **行号**: 157
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 条色阈值：0 mint（≤4）/ 1 amber（5–24）/ 2 coral（≥25） */
```

### 文件: `app/stores/food.ts`
- **行号**: 164
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 把「计数单位 × 个数」折算成等效克/ml；g/ml 类原样返回 */
```

### 文件: `app/stores/food.ts`
- **行号**: 182
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
记录时的等效 g/ml（计数类已折算），明细行展示用
```

### 文件: `app/stores/food.ts`
- **行号**: 183
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
展示单位（计数类已归一为 g）
```

### 文件: `app/stores/food.ts`
- **行号**: 184
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
"<catKey>/<id>.webp"
```

### 文件: `app/stores/food.ts`
- **行号**: 185
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 冗余快照（AGENTS.md 数据约束）：不存纯 foodId，改版/删库后记录仍可读 */
```

### 文件: `app/stores/food.ts`
- **行号**: 191
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 计数类单位：这类单位的 amount 是「几个」，必须借 pieceWeight 折算成克 */
```

### 文件: `app/stores/food.ts`
- **行号**: 193
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 首页餐次下的单条食物明细（结构化，替代原 string[] —— 供图片 + 时分秒展示） */
```

### 文件: `app/stores/food.ts`
- **行号**: 195
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
真实的记录 ID，供删除/修改使用
```

### 文件: `app/stores/food.ts`
- **行号**: 196
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
同餐同名会重复，必须带唯一后缀
```

### 文件: `app/stores/food.ts`
- **行号**: 197
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
"<catKey>/<id>.webp"，App 前缀 static/icons/
```

### 文件: `app/stores/food.ts`
- **行号**: 199
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
"40g" / "1 个" / "350ml"
```

### 文件: `app/stores/food.ts`
- **行号**: 201
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
"08:12:34"（时分秒；多次添加同一食物靠它区分）
```

### 文件: `app/stores/food.ts`
- **行号**: 207
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 该餐次最早记录时间 HH:MM（无记录为空串），设计稿「早餐 · 07:30」格式 */
```

### 文件: `app/stores/food.ts`
- **行号**: 214
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
===== 常量 =====
```

### 文件: `app/stores/food.ts`
- **行号**: 223
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
===== 库数据（模块级缓存） =====
```

### 文件: `app/stores/food.ts`
- **行号**: 272
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
从 vesselTpl 构建 vessels 索引（key → { label, sizes }）
```

### 文件: `app/stores/food.ts`
- **行号**: 278
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
从 optTpl 构建选项索引（此前漏读 —— 这正是「甜度段永远空」的根因）
```

### 文件: `app/stores/food.ts`
- **行号**: 303
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
===== 查询函数 =====
```

### 文件: `app/stores/food.ts`
- **行号**: 306
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
模块加载时立即从 JSON 初始化（确保 FoodPickerSheet 等组件拿到数据）
```

### 文件: `app/stores/food.ts`
- **行号**: 319
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 器具模板中文名（碗/杯/盘/瓶…），无模板返回空串 */
```

### 文件: `app/stores/food.ts`
- **行号**: 325
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 按食物条目的 opts 字段真实取选项模板组（替换原硬返回 [] 的 sweetOptsOf）。
 * 例：珍珠奶茶 opts=['sweet','topping'] → 返回甜度组 + 加料组；米饭 opts 为空 → 返回 []。
 */
```

### 文件: `app/stores/food.ts`
- **行号**: 340
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 选项项的附加热量（kcal）。
 * opts_tpl.yaml 里只有 sweet 声明了 scale: by_capacity + base_amount: 500，
 * 即「全糖 +110 kcal」是 500ml 的口径，实际按容量线性缩放；其余组为定值（scale: none）。
 */
```

### 文件: `app/stores/food.ts`
- **行号**: 352
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** @deprecated 恒返回空数组（历史遗留），保留仅为避免外部误引；请改用 optGroupsOf */
```

### 文件: `app/stores/food.ts`
- **行号**: 357
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 按分类筛选食物 */
```

### 文件: `app/stores/food.ts`
- **行号**: 362
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 搜索食物（名称子串 / 全拼 / 首字母，均不区分大小写） */
```

### 文件: `app/stores/food.ts`
- **行号**: 372
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/**
 * 计算一条记录的营养素（按实际分量缩放）
 * ⚠️ amount 的语义由 unit 决定：计数单位（个/片/串）需先经 gramsOf 折算，
 *    否则「1 个馒头」会按 1/100 缩放得到 2 kcal（正确值 167 kcal）。
 * @param extraKcal 选项附加热量（甜度/加料/糖包/糖浆），无则传 0
 */
```

### 文件: `app/stores/food.ts`
- **行号**: 380
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
base 是每 100g/100ml
```

### 文件: `app/stores/food.ts`
- **行号**: 400
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
===== 演示数据（Boss 授权灌入）=====
热量/营养全部经 computeEntry 按库内 base 值实时计算，不手写任何 kcal；
食材/克重选择为演示场景值。7 天 = 今天 + 前 6 天，供首页今日餐次与「我的」页周概览。
```

### 文件: `app/stores/food.ts`
- **行号**: 408
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 6 天前（回测 1581，趋势柱 1） */
```

### 文件: `app/stores/food.ts`
- **行号**: 416
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 5 天前（回测 1722，趋势柱 2） */
```

### 文件: `app/stores/food.ts`
- **行号**: 423
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 4 天前（回测 1649，趋势柱 3） */
```

### 文件: `app/stores/food.ts`
- **行号**: 431
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 3 天前（回测 1579，历史 R3 达标） */
```

### 文件: `app/stores/food.ts`
- **行号**: 437
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 2 天前（回测 1719，历史 R2 达标） */
```

### 文件: `app/stores/food.ts`
- **行号**: 445
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 昨天（回测 1948，历史 R1 超标） */
```

### 文件: `app/stores/food.ts`
- **行号**: 453
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/* 今天（v2 稿行菜：早 420 / 午 560 / 晚 390，合计 1368；行热量走库值精确还原） */
```

### 文件: `app/stores/food.ts`
- **行号**: 473
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 日键 YYYY-MM-DD（最近记录月历 / 单日详情共用） */
```

### 文件: `app/stores/food.ts`
- **行号**: 487
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 日键 → 该日 [起, 止) 毫秒区间 */
```

### 文件: `app/stores/food.ts`
- **行号**: 497
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 按 SEED_PLAN 生成 7 天记录（ts 落在对应日期的对应餐点时刻） */
```

### 文件: `app/stores/food.ts`
- **行号**: 515
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
===== Store =====
```

### 文件: `app/stores/food.ts`
- **行号**: 517
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** HH:MM:SS（补零）—— Boss 要求每条食物显示自身时分秒，用于区分多次添加同一食物 */
```

### 文件: `app/stores/food.ts`
- **行号**: 524
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 份量展示文案：g/ml 紧贴数值，计数单位留空格（设计稿「水煮蛋 1 个」格式） */
```

### 文件: `app/stores/food.ts`
- **行号**: 532
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 单日详情页查看日（YYYY-MM-DD）：Records 跳转前写入，页面间传参走 store 免 URL options 兼容问题 */
```

### 文件: `app/stores/food.ts`
- **行号**: 547
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
存储不可用时回落种子数据
```

### 文件: `app/stores/food.ts`
- **行号**: 568
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 今日条目（所有统计按日过滤，7 天历史不串入今日） */
```

### 文件: `app/stores/food.ts`
- **行号**: 574
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 今日总热量 */
```

### 文件: `app/stores/food.ts`
- **行号**: 584
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
餐次时间 = 该餐最早记录（设计稿「早餐 · 07:30」）
```

### 文件: `app/stores/food.ts`
- **行号**: 596
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
字段必须与 Home.uvue 模板消费一致（m.name/m.time/m.active/m.cal/m.details），
details 恒为数组：模板有 m.details.length 判断，undefined 会在 v-for 渲染时炸
```

### 文件: `app/stores/food.ts`
- **行号**: 604
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
结构化明细：每条食物自带图片 / 份量 / 热量 / 时分秒
（原 string[] 承载不了图片与时间；同餐同名的多条靠 index 保证 key 唯一）
```

### 文件: `app/stores/food.ts`
- **行号**: 619
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 总蛋白质 (g)（今日） */
```

### 文件: `app/stores/food.ts`
- **行号**: 624
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 总碳水 (g)（今日） */
```

### 文件: `app/stores/food.ts`
- **行号**: 629
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 总脂肪 (g)（今日） */
```

### 文件: `app/stores/food.ts`
- **行号**: 634
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 近 7 天逐日总量（含无记录日，0 占位）；Profile 周概览/趋势消费 */
```

### 文件: `app/stores/food.ts`
- **行号**: 649
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 日键 → 当日总 kcal（全部历史一次遍历；月历圆点 / 超标判定共用） */
```

### 文件: `app/stores/food.ts`
- **行号**: 671
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 清空今日记录（保留历史，供「数据管理」危险项用） */
```

### 文件: `app/stores/food.ts`
- **行号**: 678
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 初始化：从 JSON 加载 347 条食物库 */
```

### 文件: `app/stores/goal.ts`
- **行号**: 34
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
存储不可用时用默认值
```

### 文件: `app/stores/goal.ts`
- **行号**: 40
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 每日热量目标 kcal（设计稿演示场景值；设置页「目标管理」可改） */
```

### 文件: `app/stores/settings.ts`
- **行号**: 51
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** v1.0 功能开关：自建食物不做 */
```

### 文件: `app/stores/settings.ts`
- **行号**: 75
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
存储不可用时用默认值
```

### 文件: `app/stores/settings.ts`
- **行号**: 136
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
PC 开发工具环境拦截：防止模拟器窗口剧烈抖动
```

### 文件: `app/stores/settings.ts`
- **行号**: 146
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
类型声明可能缺失
```

### 文件: `app/stores/settings.ts`
- **行号**: 156
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
兜底不带参数的调用
```

### 文件: `app/stores/settings.ts`
- **行号**: 196
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#ifdef MP-WEIXIN
```

### 文件: `app/stores/settings.ts`
- **行号**: 203
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
#endif
```

### 文件: `app/stores/user.ts`
- **行号**: 24
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
存储不可用时用默认值
```

### 文件: `app/stores/user.ts`
- **行号**: 30
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 昵称（设计稿演示值） */
```

### 文件: `app/stores/user.ts`
- **行号**: 32
- **分类**: C类
- **处理建议**: 保留
- **原注释**:
```
/** 连续记录天数（设计稿演示值；真实连击统计后续接 food entries 推导） */
```

