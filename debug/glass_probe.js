/**
 * [变更日志]
 * 修改时间：2026-09-22
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：#29 配套验收探针——在「已滚到底」截图的 Tabbar 玻璃带顶缘（图标上方 8px）逐列取平均色，
   排除两个图标列。玻璃若不透明则该带应近乎均匀；列间色差显著即证明「页面内容穿到玻璃之下并被透出」]
 */
const fs = require('fs');
const { PNG } = require('pngjs');

const f = process.argv[2];
if (!f) {
  console.error('用法: node glass_probe.js <滚到底.png>');
  process.exit(1);
}
// 玻璃带顶缘：栏顶 y≈777（栏高约 76），图标从 y≈787 开始，故取 778-786 避开图标与文字
const TOP = 778;
const BOT = 786;
// 两个 Tab 图标所在列（首页 x≈98、我的 x≈295，图标宽约 29）
const skip = (x) => (x > 70 && x < 126) || (x > 268 && x < 324);

const png = PNG.sync.read(fs.readFileSync(f));
const cols = [];
for (let x = 0; x < png.width; x++) {
  if (skip(x)) continue;
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = TOP; y < BOT; y++) {
    const i = (png.width * y + x) << 2;
    r += png.data[i]; g += png.data[i + 1]; b += png.data[i + 2]; n++;
  }
  cols.push({ x: x, rgb: [r / n, g / n, b / n] });
}
let minL = 1e9, maxL = -1e9, minX = -1, maxX = -1;
for (const c of cols) {
  const l = 0.299 * c.rgb[0] + 0.587 * c.rgb[1] + 0.114 * c.rgb[2];
  if (l < minL) { minL = l; minX = c.x; }
  if (l > maxL) { maxL = l; maxX = c.x; }
}
console.log(f + '  玻璃带 y=' + TOP + '-' + BOT + '（已排除图标列）');
console.log('亮度跨度=' + (maxL - minL).toFixed(1) + '  最暗 x=' + minX + ' rgb=' + cols.find((c) => c.x === minX).rgb.map((v) => v.toFixed(0)).join(',') + '  最亮 x=' + maxX + ' rgb=' + cols.find((c) => c.x === maxX).rgb.map((v) => v.toFixed(0)).join(','));
