# 食物缩略图「画框托底」——实现文档（暗黑模式）

> 2026-09-22 ｜ 设计稿：Pencil `pencil-new.pen`，暗黑 5 处已落实；**浅色原稿与项目代码本次均未改动**
> 色值以 `design/DesignTokens.md` 与 Mint Dark 令牌表为准，本文只引用、不重复定义色板。

## 0. 一句话结论

- 353 张食物图标**保留「白底 + 柔和投影」原样，不抠图、不改流水线**。
- 暗黑模式下的「白方块」问题在**视图层**解决：缩略图加 **4px 内缩 + recessed 托底**，让白底图读作一张有意为之的「小画框」，而不是一个没上色的占位块。
- 素材、`compress_icons.py`、`build.py` **零改动**，包体不涨一字节。

---

## 1. 为什么不抠图（实测记录，防止反复再议）

同一批 10 张白底图，三条路线都真跑过：

| 路线 | 实测结果 | 结论 |
|---|---|---|
| 文生图直出透明 | 20/20 张输出全为 **RGB 无 alpha**；prompt 写 `transparent background` 得到的是黑底、画进画面的棋盘格、或被直接忽略 | ❌ 不可行。Agnes 接口没有 alpha / 背景 / 格式开关 |
| rembg（u2net）抠图 | 176MB 模型；10 张里 **2 张语义翻车**——烤鸭连白瓷盘一起被抠掉、红酒杯上半留一坨不透明白；半透明羽化像素占 **11.9%–44.5%**；重压 512 RGBA webp 平均 **24.8KB/张 → 353 张 8.6MB** | ❌ 不划算。与 `toolchain/README.md` B.1 当年拒绝它的理由（细边易毛糙）一致，本次实测确认成立 |
| 泛洪填充抠图（零依赖） | 质量与 rembg 接近，但把「柔和投影」留在原地成一摊灰影（10 张中 8 张）；**21.1KB/张 → 353 张 7.3MB** | ❌ 同样要改流水线、同样涨体积，效果还更差 |
| **视图层托底** | 0 新增依赖、0 体积增量、不碰素材 | ✅ **采用** |

对照基线：现在产物 16.3KB/张、353 张 5.6MB，`docs/FoodLibraryPlan.md` 与 `toolchain/README.md` B.4 的「白底 + 柔和投影」规格原样保住。

---

## 2. 规格

统一规则：**内缩固定 4px（不是百分比）；托底 = 原槽位尺寸与原圆角；图片圆角 = 托底圆角 − 4**。

| 档位 | 槽位（=托底） | 图片 | 设计稿节点 | 代码消费点 |
|---|---|---|---|---|
| 48 | 48×48 `r16` | 40×40 `r12` | `Thumb_苹果` 等 5 个（弹层⓪ `F2SECy`） | `FoodPicker.uvue:67` `.row-thumb` |
| 64 | 64×64 `r12` | 56×56 `r8` | `Food_*` 内 `Ph`（最近记录 `MRV3b`） | `Records.uvue:138` `.lr-fphoto` |
| 37 | 36.6×36.6 `r10` | 28.6×28.6 `r6` | 首页 `Plate_*`（`MleCt` 早/午餐卡） | `Home.uvue:171` `.meal-thumb` |
| 32 | 32×32 `r10` | 24×24 `r6` | `Meal_*` 内 `Ph_*`（三餐详情 `PLo0t`） | `DayDetail.uvue:139` `.dd-row-ph` |

三条硬规定：

1. **托底色一律用 recessed 令牌 `#0A1612`**（与搜索框底、滑杆底槽、分量背板同一语义层）。
   **不要用 `#1A3B2F`**——那是「选中行底色」，铺到每个缩略图底上会把选中语言冲淡。弹层⓪ 原稿 5 个 tile 正是 `#1A3B2F`，本次已统一改到 `#0A1612`。
2. **`mode` 从 `aspectFill` 改 `aspectFit`**。源图 512×512 正方形、槽位也是正方形，两者当前结果一致；但 fit 对未来的非正方形源不会裁掉食物，且白底保证铺满四角。
3. **白底图自带的柔和投影保留**。它在 `#0A1612` 上读作「照片压在槽里」，正是画框感的一部分——这也是不能抠图的原因之一。

---

## 3. 前端实现方式（做全局暗黑模式时照抄）

关键约束（踩过的坑）：`<image>` 自身的 `background-color` 会被满幅图片盖死——现在 `.row-thumb` 里那句 `#EAF9F3` 就是这么变成死样式的；`padding` 也撑不开 image 的绘制区。**所以必须多包一层 view。**

```html
<view class="thumb-plate">
  <image class="thumb-img" :src="'/static/icons/' + item.img" mode="aspectFit"></image>
</view>
```

```css
.thumb-plate { width: 48px; height: 48px; border-radius: 16px; padding: 4px;
               background-color: #EAF9F3; }          /* 浅色 */
.thumb-img   { width: 40px; height: 40px; border-radius: 12px; }
/* 暗黑：.thumb-plate { background-color: #0A1612; }  —— 两档只差这一个色，尺寸与圆角完全一致 */
```

建议直接抽成 `--thumb-plate` 令牌随主题切换，别在 5 个组件里各写一遍色值。

改动清单（5 处，同一套写法）：

| 文件:行 | 现 class | 槽 → 图 | 备注 |
|---|---|---|---|
| `components/FoodPicker.uvue:67` + CSS:269 | `.row-thumb` | 48 → 40 | 问题原始出处 |
| `components/AddFood.uvue:104` + CSS:585 | `.food-thumb` | 64 → 56 | 现 `r20` → 内层 `r16` |
| `pages/home/Home.uvue:171` + CSS:650 | `.meal-thumb` | 37 → 29 | 现**无**托底色，`r8` → `r10` |
| `pages/records/Records.uvue:138` + CSS:819 | `.lr-fphoto` | 64 → 56 | |
| `pages/records/DayDetail.uvue:139` + CSS:678 | `.dd-row-ph` | 32 → 24 | |

每处四步：外层加 `.thumb-plate` → image 缩到内层尺寸 → `aspectFill` 改 `aspectFit` → 同步该组件的 `.md`（仓库规则：每个 `.uvue` 必须有配套 `.md`）。

---

## 4. 浅色模式

- 浅色原稿（`Yvg8R` / `bTPUq` / `VEWYt` / `n3dgv`）**本次未动**。浅色下白图压白卡本就没有刺眼边界，问题不成立。
- 但要注意：按第 3 节改完后，代码里那句一直「写了看不见」的 `#EAF9F3` 会**真的露出来**，浅色版也随之变成带薄荷描边的画框。这属于浅色视觉的可见变化，**需老板拍板**。
- 若要维持浅色现状：把浅色的 `--thumb-plate` 设成与卡片同色 `#FFFFFF`，尺寸与圆角规则不变即可。

---

## 5. 动效钩子

| 位置 | 属性 | 时长 / 曲线 |
|---|---|---|
| 列表行首次出现 | plate `scale .94→1` + opacity `0→1` | 160ms ease-out；**滚动复用不重放** |
| 换食物（弹层⓪ 选中 → 回显到添加食物头部） | 只 cross-fade 内层 img，**plate 不动** | 120ms；plate 一起闪会白跳一下 |
| 添加成功飞入结算徽章 | 起点 = 弹层⓪ 的 plate 框（含托底），落点 = 首页 37 档 plate 框 | 两端 plate 规格必须一致才接得上，这是本档统一 4px 的硬理由 |
| 选中行 | 行底色 `#162924 → #1A3B2F` | 180ms；plate 与 img 不参与选中态 |

---

## 6. 交付图

| 文件 | 内容 |
|---|---|
| `export/50-picker-sheet-dark-framed.png` | 弹层⓪ 暗黑：5 行食物，48 档画框（末行珍珠奶茶为选中态） |
| `export/51-home-dark-framed.png` | 首页暗黑：早/午餐卡 37 档画框 |
| `export/52-records-dark-framed.png` | 最近记录暗黑：64 档画框 |
| `export/53-daydetail-dark-framed.png` | 三餐详情暗黑：32 档画框 |
| `export/54-plate-spec.png` | 四个档位并排规格图（48 / 64 / 37 / 32） |
