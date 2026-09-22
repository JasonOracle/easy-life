# CalTrack — 卡路里管理 App

轻量级卡路里追踪 App，快速记录饮食，直观展示摄入数据。

<!--
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[「当前状态」的 TabBar 一句滞后更正：原写「玻璃底随滚动渐显」，该 fade 机制已被 Boss 拍板废弃，
  现为「三 Tab 悬浮液态玻璃胶囊＋会跑的选中气泡」，且「最近记录」由二级页升为一级 Tab（真值见 AGENTS.md 玻璃面条与 docs/progress.md 同日进度）]
-->
<!--
[变更日志]
修改时间：2026-09-22
AI模型：Qoder (Claude)
修改内容：[「当前状态」滞后修正（原写「设计完成，开发未开始」，实际 MVP 主体已在微信模拟器跑通）；
  目录表补 design/DesignTokens.md、ScreenSpecs.md、docs/progress.md、app 源码结构、debug/ 与 assets 图标三兄弟，
  并标注 icons-final 已不进版本控制；食物库条数按实际产出修正，交互原型版本号不再硬编码]
-->

## 当前状态

**MVP 主体已落地**：5 页（首页／个人中心／设置／最近记录／单日详情）＋ 8 组件 ＋ 5 store 在微信开发者工具跑通，
353 条食物库内置，弹层走原生 page-container，TabBar＝三 Tab 悬浮液态玻璃胶囊（首页／日历／我的，选中气泡会飞行；「最近记录」已升为一级 Tab）。
当前阶段＝还原度收尾 ＋ 工程化加固（提交闸门 `toolchain/hooks.py` 已上岗）。
动态进度与接手清单见 **`docs/progress.md`**（最高事实来源）。

## 目录

| 路径 | 说明 |
|---|---|
| `AGENTS.md` | 项目静态宪法（规则／约束／踩坑定案），新会话先读 progress.md 再读它 |
| `docs/progress.md` | 动态进度追踪（最高动态事实来源） |
| `docs/PRD.md` | 产品需求文档（`PRD_v1.0_*`／`PRD_v1.1_*` 为历史存档） |
| `docs/Review.md` | 评审复盘 |
| `docs/FoodLibraryPlan.md` | 食物库方案 |
| `design/DesignTokens.md` | ★ 色值／圆角／字号唯一事实来源（Ardot 变量集导出） |
| `design/VisualLanguage.md` | 视觉语言（薄荷液滴） |
| `design/ScreenSpecs.md` | 8 屏开发对照清单（设计稿实测几何） |
| `design/IconPlan.md` | 图标方案 |
| `design/UI_Spec.md` | Figma/Pixso 交付规格 |
| `design/Critique_Lenny.md` | 设计审视 |
| `app/` | 前端（uni-app x 项目根：`pages/`＋`components/`＋`stores/`＋`composables/`＋`static/`） |
| `app/src/data/` | 食物库 JSON（`toolchain/build.py` 产出，严禁手写） |
| `app/prototype/` | 交互原型 HTML |
| `toolchain/` | 食物库数据处理与生图脚本（Python，不进 App 包）＋ 提交闸门 `hooks.py` |
| `debug/` | 零窗口调试脚本（miniprogram-automator 后台截图／探针／取数据） |
| `assets/exports/` | 设计稿 @2x PNG（8 屏 ＋ 1 张首页备选方案） |
| `assets/icons-gen/` | 生图原始 PNG（入库留档，AI 生图有随机性不可复现） |
| `assets/icons-final/` | 压缩中间产物（**已进 .gitignore**，可由 `compress_icons.py` 重跑） |

## 快速上手

```powershell
python toolchain\validate.py           # 六份源文件一致性校验
python toolchain\build.py              # 合并 → app/src/data/ ＋ 同步图标
python toolchain\hooks.py all          # 跑五道闸门
python toolchain\hooks.py install      # 新机器必跑：把闸门装进 .git/hooks
node debug\shot.js out.png             # 连模拟器后台截图（需微信工具已开自动化端口）
```
App 编译在 HBuilderX 图形模式里跑（uni-app x 无独立 npm 构建入口）。

## 技术栈

uni-app x + Vue3 + TS + Pinia，本地存储，无服务器。

## 视觉方向

薄荷液滴（Mint Drop）—— 记完一顿饭，水位涨一截、晃两下、归于平静。