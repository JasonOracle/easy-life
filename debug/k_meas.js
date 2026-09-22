const automator = require('miniprogram-automator');

(async () => {
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  const page = await mp.currentPage();
  console.log('page:', page.path);
  for (const sel of ['.header', '.hd-wave', '.hd-glow', '.hd-arc1', '.hd-back', '.hd-title', '.hd-sub']) {
    try {
      const el = await page.$(sel);
      if (!el) { console.log(sel, 'NOT FOUND'); continue; }
      const sz = await el.size();
      const of = await el.offset();
      console.log(sel, 'size', JSON.stringify(sz), 'offset', JSON.stringify(of));
    } catch (e) { console.log(sel, 'err', e.message); }
  }
  await mp.disconnect();
})();
