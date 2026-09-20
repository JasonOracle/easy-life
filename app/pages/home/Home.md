# Home.uvue — 首页（手脚架占位）

## 💡 核心思想

App 重写后的最小可运行首页：不依赖任何 store / composable / 组件，只渲染品牌标题，用于验证工程骨架（manifest → main.uts → App.uvue → 路由）编译运行全链路通畅。后续业务按设计稿逐步重建。

## 💻 使用示例

`pages.json` 中已注册为首个页面（启动页）：

```json
{
  "pages": [
    { "path": "pages/home/Home", "style": { "navigationStyle": "custom" } }
  ]
}
```

HBuilderX「运行 → 运行到小程序模拟器 → 微信开发者工具」即可看到薄荷底（`#F2FAF5`）居中的「CalTrack / 手脚架已就绪」。

## 边界与降级

- 无任何数据依赖，空状态即正常状态
- 色值取自 `design/DesignTokens.md`（bg `#F2FAF5` / label-1 `#0A4F3D` / mint-deep `#0A7A5C`）
