# useDeviceCapability.ts — 设备能力检测

## 💡 核心思想

纯静态规则判定性能档（iOS 机型表＋版本兜底／Android API Level＋芯片关键词），不做运行时探测，
改规则只改这里。

## 💻 使用示例

```ts
import { detectDeviceCapability } from './useDeviceCapability'
const cap = detectDeviceCapability()
```

## 依赖

- 无；被 device store 消费

## 设计决策

- iPhone X（A11）划 low；Android Helio/SD4xx/旧 Exynos/展锐判 low
- 音效全开（开销极小）；其余能力 low 档全关

## 边界与降级

- 小程序端取不到机型时走版本分支；其他端默认 high

## 与设计稿的对应

- AGENTS.md 设备分档表的唯一实现；帧率实测后续补
