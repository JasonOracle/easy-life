/**
 * [变更日志]
 * 修改时间：2026-09-21
 * AI模型：Qoder (Claude)
 * 修改内容：[新建：零依赖 PNG 裁剪/放大工具（zlib inflate/deflate + 反滤波），
 *   用于把模拟器截图局部裁出放大查看。用法: node debug/png_crop.js <in.png> <x> <y> <w> <h> <scale> <out.png>]
 */
const fs = require('fs')
const zlib = require('zlib')

function decode(buf) {
  let pos = 8
  let w = 0, h = 0, channels = 4
  const idat = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString('ascii', pos + 4, pos + 8)
    const data = buf.subarray(pos + 8, pos + 8 + len)
    if (type === 'IHDR') {
      w = data.readUInt32BE(0)
      h = data.readUInt32BE(4)
      if (data[8] !== 8 || (data[9] !== 6 && data[9] !== 2)) throw new Error('only 8bit RGB/RGBA supported, got depth=' + data[8] + ' color=' + data[9])
      channels = data[9] === 6 ? 4 : 3
    } else if (type === 'IDAT') idat.push(data)
    else if (type === 'IEND') break
    pos += 12 + len
  }
  const raw = zlib.inflateSync(Buffer.concat(idat))
  const bpp = channels
  const stride = w * channels
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
  if (channels === 3) {
    const rgba = Buffer.alloc(h * w * 4)
    for (let i = 0; i < w * h; i++) {
      rgba[i * 4] = px[i * 3]
      rgba[i * 4 + 1] = px[i * 3 + 1]
      rgba[i * 4 + 2] = px[i * 3 + 2]
      rgba[i * 4 + 3] = 255
    }
    return { w, h, px: rgba }
  }
  return { w, h, px }
}

function encode(w, h, px) {
  const stride = w * 4
  const raw = Buffer.alloc((stride + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0
    px.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8; ihdr[9] = 6
  function chunk(type, data) {
    const b = Buffer.alloc(8 + data.length + 4)
    b.writeUInt32BE(data.length, 0)
    b.write(type, 4, 'ascii')
    data.copy(b, 8)
    b.writeUInt32BE(zlib.crc32 ? zlib.crc32(b.subarray(4, 8 + data.length)) : crc32(b.subarray(4, 8 + data.length)), 8 + data.length)
    return b
  }
  let crcTable = null
  function crc32(buf) {
    if (!crcTable) {
      crcTable = new Int32Array(256)
      for (let n = 0; n < 256; n++) {
        let c = n
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
        crcTable[n] = c
      }
    }
    let c = 0xffffffff
    for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 255] ^ (c >>> 8)
    return (c ^ 0xffffffff) >>> 0
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const [, , file, xs, ys, ws, hs, ss, out] = process.argv
const [x, y, w, h, s] = [xs, ys, ws, hs, ss].map(Number)
const { w: iw, h: ih, px } = decode(fs.readFileSync(file))
const ow = w * s, oh = h * s
const crop = Buffer.alloc(ow * oh * 4)
for (let oy = 0; oy < oh; oy++) {
  const sy = Math.min(ih - 1, y + Math.floor(oy / s))
  for (let ox = 0; ox < ow; ox++) {
    const sx = Math.min(iw - 1, x + Math.floor(ox / s))
    const si = (sy * iw + sx) * 4
    const di = (oy * ow + ox) * 4
    crop[di] = px[si]; crop[di + 1] = px[si + 1]; crop[di + 2] = px[si + 2]; crop[di + 3] = px[si + 3]
  }
}
fs.writeFileSync(out, encode(ow, oh, crop))
console.log('CROP ' + iw + 'x' + ih + ' -> ' + out + ' (' + ow + 'x' + oh + ')')
