# Tabbar.uvue — 共享底部 Tab

## 💡 核心思想

v2 稿只有两 Tab（首页／我的，加号在右上，不存在 midbutton 问题），做成共享组件供两页复用，
保证视觉与行为一致。切换用 `redirectTo`（不堆栈）；图标 `:src` 运行时绑定。

## 💻 使用示例

```html
<Tabbar active="home" />
<Tabbar active="profile" />
```

## 依赖

- `app/static/home/tab_home.png` / `tab_profile.png`；被 Home／Profile 引用

## 设计决策

- 不用原生 tabBar（要 1:1 白底＋顶线＋指定字色，原生定制不足）
- 非激活页图标不变色（稿面只给单态图），仅标签变灰

## 边界与降级

- 点击当前页无操作；`redirectTo` 失败（如路由缺失）静默停留

## 与设计稿的对应

- v2 10:333：BG `#F8FCFA` h78／顶线 `#E3EFE8`／图标 29×27·25×25／字 11px（激活 `#17916B`／灰 `#5C7570`）
- 不一致：Home Indicator 为系统条，不自绘
