/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：PNG 像素采样（复用 png_crop 解码逻辑），按行打印指定矩形颜色，用于印章配色核验。]
 */
const fs = require('fs')
const zlib = require('zlib')
function decode(buf) {
  let pos = 8, w = 0, h = 0, channels = 4
  const idat = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString('ascii', pos + 4, pos + 8)
    const data = buf.subarray(pos + 8, pos + 8 + len)
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); channels = data[9] === 6 ? 4 : 3 }
    else if (type === 'IDAT') idat.push(data)
    else if (type === 'IEND') break
    pos += 12 + len
  }
  const raw = zlib.inflateSync(Buffer.concat(idat))
  const bpp = channels, stride = w * channels
  const px = Buffer.alloc(h * stride)
  let rp = 0
  for (let y = 0; y < h; y++) {
    const f = raw[rp++]
    const line = raw.subarray(rp, rp + stride)
    rp += stride
    const cur = px.subarray(y * stride, (y + 1) * stride)
    const prev = y > 0 ? px.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride)
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0
      const b = prev[i]
      const c = i >= bpp ? prev[i - bpp] : 0
      let v = line[i]
      if (f === 0) cur[i] = v
      else if (f === 1) cur[i] = (v + a) & 255
      else if (f === 2) cur[i] = (v + b) & 255
      else if (f === 3) cur[i] = (v + ((a + b) >> 1)) & 255
      else if (f === 4) {
        const p = a + b - c
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c)
        const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c
        cur[i] = (v + pr) & 255
      }
    }
  }
  return { w, h, px, stride, channels }
}
const img = decode(fs.readFileSync(process.argv[2]))
const [x0, y0, x1, y1, step] = [3, 4, 5, 6, 7].map(i => +process.argv[i])
for (let y = y0; y <= y1; y += step) {
  let s = y + ': '
  for (let x = x0; x <= x1; x += step) {
    const i = y * img.stride + x * img.channels
    s += '#' + [img.px[i], img.px[i + 1], img.px[i + 2]].map(v => v.toString(16).padStart(2, '0')).join('') + ' '
  }
  console.log(s)
}
