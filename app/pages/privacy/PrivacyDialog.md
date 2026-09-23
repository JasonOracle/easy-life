# PrivacyDialog

💡 **核心思想**
应用启动时的全局隐私与权限说明弹窗（Dialog 页面）。设计初衷是拦截未授权用户的访问，同时满足微信小程序的 `agreePrivacyAuthorization` 新规与运行时的二次隐私确认需求。数据流向很简单：用户操作（同意/拒绝）直接调用全局的 `uni.closeDialogPage` 并在必要时调用 `uni.resetPrivacyAuthorization()`，同时借助条件编译兼容微信环境下的事件触发。为防止弹窗干扰正常页面生命周期，特采用 uni-app x 的原生弹窗页面方案。
全量遵循 750rpx 响应式设计（1px = 2rpx），弹窗 560rpx 居中、滚动区 440rpx、按钮 220×88rpx，保证不同屏幕比例均拥有最佳视觉排版。

💻 **使用示例**
```typescript
// 推荐在 App.uvue 的 onLaunch 中调用，或任何需要确认隐私的场景
uni.getPrivacySetting({
  success: (res) => {
    if (res.needAuthorization) {
      uni.openDialogPage({
        url: '/pages/privacy/PrivacyDialog'
      })
    }
  }
})
```
