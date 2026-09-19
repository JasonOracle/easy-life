# Bottle.uvue — 玻璃瓶组件

## 1. 用途

首页核心视觉：玻璃瓶 + 液体水位。整个 App 的隐喻载体（瓶子=容器，水位=今日摄入）。

## 2. 依赖

| 方向 | 对象 | 说明 |
|---|---|---|
| 依赖 | `design/VisualLanguage.md` §4/§5 | 几何坐标、玻璃材质、水位公式的唯一来源 |
| 依赖 | `design/DesignTokens.md` | 渐变色与珊瑚色 |
| 被依赖 | `pages/home/Home.uvue` | 首页主视觉 |
| 被依赖 | `pages/profile/Profile.uvue`（规划） | 历史趋势的一排小瓶子 |

## 3. 设计决策

- **view+CSS 而非 SVG**：uvue 不支持内联 SVG 标签。Bottle 的全部元素（瓶盖/瓶颈/瓶身/内腔/双高光）恰好都是圆角矩形，CSS 可无损还原。
- **容器 122×171，舞台 120×168**：ScreenSpecs 实测容器 122×171，SVG viewBox 是 120×168，差值用居中吸收。
- **平液面（本版无波纹）**：§5.2 的 34 段正弦波需要 canvas。平液面**同时就是低端机的降级形态**（`useDeviceStore.liquidWave=false`），所以这不是缺陷而是合法状态；canvas 波纹后续叠加。
- **水位只动 `transform`**：`translateY=(1-pct)×132` + `transition 1.15s cubic-bezier(.22,1,.36,1)`，不触发布局重排，低端机也流畅。

## 4. 边界与降级

| 场景 | 处理 |
|---|---|
| `pct > 1` | 钳到 1，显示满瓶（超标时液体转珊瑚表达"溢出"） |
| `pct < 0` | 钳到 0，空瓶 |
| 超标 `over=true` | 液体渐变换珊瑚系 `#FFC9B4→#FF9E7D→#F0835F`（不用纯红） |
| 低端机 | 本组件天然无波纹，无需额外处理 |
| `backdrop-filter` 不支持 | 本组件没用 backdrop，不受影响 |

## 5. 与设计稿的对应

- 几何：`VisualLanguage.md` §4.1（瓶盖 44,2,32×13；瓶身 14,24,92×140 r18；内腔 18,28,84×132 r15）
- 玻璃材质：§4.2（fill 白 42%、stroke 白 90% 1.2px、薄荷投影 0,8,20,14%）
- 高光：主 (9,14,9×92) 55%／次 (78,28,4×58) 32%（相对瓶身）
- 水位：§5.1（translateY=(1-pct)×132，1.15s spring）
- 渐变：§3.1（`#7DEBC7 0% → #1FBF8F 52% → #0D9C73`）
- Ardot 节点：`3:42`（Bottle 122×171）
- **待补**：瓶身外薄荷光晕（radial-gradient + blur，uvue 对 radial 支持待验证）
