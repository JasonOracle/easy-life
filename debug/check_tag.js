const automator = require('./node_modules/miniprogram-automator');
(async () => {
  const c = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  await c.reLaunch('/pages/profile/Profile');
  await new Promise(r => setTimeout(r, 5000));
  const p = await c.currentPage();
  console.log('page:', p.path);
  const tag = await p.$('.target-tag');
  const vals = await p.$$('.bar-val');
  if (!tag || vals.length === 0) { console.log('missing elems', !!tag, vals.length); await c.disconnect(); return; }
  const last = vals[vals.length - 1];
  const texts = await p.$$('.target-tag-text');
  for (const t of texts) {
    const ts = await t.size(); const tp = await t.offset();
    const ls = await last.size(); const lp = await last.offset();
    console.log('tagText', JSON.stringify(ts), JSON.stringify(tp));
    const overlapX = tp.left < lp.left + ls.width && lp.left < tp.left + ts.width;
    const overlapY = tp.top < lp.top + ls.height && lp.top < tp.top + ts.height;
    console.log('lastBarVal', JSON.stringify(ls), JSON.stringify(lp), 'overlap:', overlapX && overlapY);
  }
  await c.disconnect();
})().catch(e => { console.error('ERR', e && e.message || e); process.exit(1); });
