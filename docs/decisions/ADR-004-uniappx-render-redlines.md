# ADR-004: uni-app x 原生渲染样式红线（长期约束）

> 状态：长期约束
> 决策者：架构组

## 决策背景
兼容 App 原生端渲染，严格遵守语法红线防编译中断。

## 决策内容
1. 严禁 `min-height: 100%`（仅支持 px，改用 flex: 1）。
2. 严禁带角度的 `linear-gradient`。
3. 严禁后代选择器。
4. 严禁 calc 跨单位动态计算。
5. 严禁使用自闭合标签。
6. `<script setup>` 顶层变量唯一声明。

## 第二部分：实测样式红线（2026-09-28 App 端实机取证）

| 属性 | 实测行为（都是「整条声明被丢」级别） |
|---|---|
| `backdrop-filter` | 只接受 `none` / `blur()`。写 `saturate()` → 报 ERROR **且整条声明失效**（等于没开模糊）；写 `-webkit-backdrop-filter` → WARNING「非标准属性」。带饱和的增强版必须隔离进 `#ifdef MP-WEIXIN`。 |
| `max-height` | 只接受 `number` / `pixel`。写 `90%` 报 ERROR 且**静默失效**。→ 改**运行时下发 px**（`:style="windowHeight*0.9+'px'"`）有效：差异实验把上限临时改 0.5，容器顶边精确落在屏高 **50.0%**（y1385/2772）。 |
| `pointer-events: none` | **父级设了，所有子元素都不响应事件，即使子元素显式 `auto`**（与 Web 规范不同）。→ 想做「透传的装饰层」只能让它自身是**叶子节点**。 |
| `box-shadow` | **值里出现 `inset` → 整条声明被丢弃**（拍平/Vapor 不支持 inset）；且外阴影一定画在元素**身下**，半透元素必然把它显出来（实测深投影会把 52% 白胶囊压得比页面底还暗：内部 215~223 vs 页面 236~246）。浅色半透件要「边缘感」应改用**白色光晕**，要深投影就得提不透明度。 |
| 高度契约 | 「容器高度贴合内容」＝`height:auto` + `max-height`（运行时 px）+ `flex column` + 子层 `min-height:0`。 |
| 底距 | App 端＝设计值 + `safeAreaInsets.bottom`，运行时下发 px；MP-WEIXIN 的 `calc()` + `env()` 在 App 端无效。 |
| `console.log` | 进 logcat（同一行以 tag `JSConsole` 与 `console` 重复出现两次）。 |
