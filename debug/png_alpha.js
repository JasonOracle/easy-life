const fs = require('fs');
const zlib = require('zlib');

function parsePNG(path) {
  const buf = fs.readFileSync(path);
  let off = 8;
  let w, h, depth, color, idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.slice(off + 8, off + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0); h = data.readUInt32BE(4);
      depth = data[8]; color = data[9];
    } else if (type === 'IDAT') idat.push(data);
    off += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const ch = color === 6 ? 4 : color === 2 ? 3 : color === 0 ? 1 : 4;
  const stride = w * ch;
  const out = Buffer.alloc(h * stride);
  let pos = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[pos++];
    const row = out.slice(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.slice((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? row[x - ch] : 0;
      const b = prev[x];
      const c = x >= ch ? prev[x - ch] : 0;
      let v = raw[pos + x];
      if (f === 1) v = (v + a) & 255;
      else if (f === 2) v = (v + b) & 255;
      else if (f === 3) v = (v + ((a + b) >> 1)) & 255;
      else if (f === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
      row[x] = v;
    }
    pos += stride;
  }
  return { w, h, ch, data: out };
}

const path = process.argv[2];
const { w, h, ch, data } = parsePNG(path);
console.log(path, w, 'x', h, 'channels', ch);
// per-row: fraction of pixels with alpha>8, and mean alpha of those
for (let y = 0; y < h; y += Math.max(1, Math.floor(h / 40))) {
  let n = 0, sum = 0;
  for (let x = 0; x < w; x++) {
    const al = ch === 4 ? data[y * w * ch + x * ch + 3] : 255;
    if (al > 8) { n++; sum += al; }
  }
  console.log('row', String(y).padStart(4), 'cover%', (100 * n / w).toFixed(0).padStart(3), 'meanAlpha', n ? (sum / n).toFixed(0) : '-');
}
