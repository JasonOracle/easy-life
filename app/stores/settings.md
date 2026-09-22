# settings.ts — 设置 store

<!--
[变更日志]
修改时间：2026-09-22
AI模型：Gemini 系列
修改内容：[扩展音效体系：支持 shake（水瓶晃动）、slide（拖动滑块）、card（切换卡片/分量/甜度/餐次）、pour（倒水）等原生短音效，内置倒水 2 秒定时停止]
-->
<!--
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[校准深色模式随动范围：设计决策「仅个人中心随动」更正为「个人中心＋设置两页随动」。依据 Settings.uvue 根节点 :class="{ 'page-dark': dk }"（dk＝settings.darkMode）＋ .page-dark 覆盖块，设置页本身已随动。]
-->

## 💡 核心思想

偏好开关集中管理（深色模式／用餐提醒／音效／触觉），`USER_FOOD_ENABLED=false` 唯一落点，
本地持久化。集中调度全局 `playSound`（支持 click、shake、slide、card、pour、success 等）。

## 💻 使用示例

```ts
const settings = useSettingsStore()
settings.setSoundEnabled(false)
settings.setDarkMode(true)   // 个人中心暗黑主题开关（Settings 页点击）

// 触发特定反馈音效
playSound('shake') // 水瓶晃动
playSound('slide') // 滑块拖动
playSound('card')  // 选项切换
playSound('pour', 2000) // 倒水灌入（最多放2秒）
```

## 依赖

- 本地存储 `ct_settings_v1`；被设置页「深色模式」开关（toggleDark）与 Profile 页（page-dark 类）消费

## 设计决策

- 自建食物开关放这里，不在各处散落 if（AGENTS 约束）
- 深色模式 2026-09-21 起解除恒关锁定（Boss 指令第 5 项）：`setDarkMode` 持久化；
  个人中心＋设置两页随动（两页根节点各绑 `page-dark`），不走 `uni.setAppTheme`（App 端能力，小程序端无法强制切系统主题）（2026-09-22 校准）

## 边界与降级

- 存储失败用默认值，不阻塞

## 与设计稿的对应

- 设置页偏好组两行；「即将上线」pill 对应 mealReminders 未启用态
- 深色模式开关稿面画的是 ON 态；实际默认 OFF，点击后 ON（状态由 store 驱动，不再稿面静态）
