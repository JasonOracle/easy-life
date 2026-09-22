# device.ts — 设备能力 store

<!--
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[校准「与设计稿的对应」：标注「液体晃动衰减 0.955」为设计参数、晃动动效尚未落地（全代码 grep 无 0.955、无液体晃动实现，本 store 仅暴露 liquidWave 能力开关）。]
-->

## 💡 核心思想

App 启动检测一次设备分档，全局 getter 供所有组件读取（tier／haptics／liquidWave／sound／backdropBlur／platform）。

## 💻 使用示例

```ts
const device = useDeviceStore()
if (device.haptics) uni.vibrateShort()
```

## 依赖

- `composables/useDeviceCapability.ts` 的 `detectDeviceCapability`；被 App.onLaunch 初始化

## 设计决策

- 检测逻辑与存储分离：规则改 composable，本文件只存取
- low 档关触觉＋波纹＋毛玻璃；音效全档开

## 边界与降级

- 未识别机型按系统版本兜底；小程序端取不到型号默认走版本分支

## 与设计稿的对应

- 反馈三级矩阵（L1/L2/L3）的总开关；液体晃动衰减 0.955 为设计参数（晃动动效尚未落地，本 store 仅提供 `liquidWave` 能力开关）（2026-09-22 校准）
