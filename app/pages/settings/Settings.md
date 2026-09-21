# Settings.uvue — 设置页（v2 稿 P3 还原）

## 💡 核心思想

按 Ardot v2 稿（727788215940571 · 11:3）1:1 还原设置页静态结构：渐变头图（返回＋标题）／
偏好组／目标管理组／数据管理组／本机声明／危险区独立卡／页脚。开关与行点击暂无行为，
等 store 重建后接入。

## 💻 使用示例

`pages.json` 第三路由。个人中心齿轮 `navigateTo` 进入；返回钮 `navigateBack`。

## 依赖

- 静态资源 `app/static/settings/*.png`（11 张：行图标×6＋trash＋shield＋chev_back＋leaf＋wave）
- 行右箭头复用 `app/static/home/chev_right.png`；暂无 store 依赖

## 设计决策

- 头图渐变 `#9DEAD3→#1FBD90`＋导出波浪；白卡 `#FCFFFF` r23；危险卡白底＋珊瑚描边 `#FBA095`
- 深色模式开关按稿面画 ON 态（v1.0 不做真实切换， maintaining 视觉一致）
- 行图标按 y 坐标归属：moon-T1／bell-T2／target-T3／mega-T4／down-T5／up-T6／leaf-页脚

## 边界与降级

- 开关/行点击当前无行为（演示页）；系统字体降级；v-for 未使用，无 r 坑

## 与设计稿的对应

- 文案全对稿：深色模式／用餐提醒＋即将上线／每日热量目标1800／自定义餐次／导出·备份到本地／
  导入·从文件恢复／所有数据仅保存在本机／清空所有数据／轻律生活 CalTrack／v1.0.0
- 不一致：波浪用导出整图（透明区需真机确认边缘）；图标用导出 PNG
