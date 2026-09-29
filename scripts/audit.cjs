const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs = require('node:fs/promises');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 320, height: 844 }, reducedMotion: 'reduce', bypassCSP: true });
  const reports = [];
  for (const path of ['/', '/algemene-voorwaarden/', '/privacybeleid/', '/cookiebeleid/']) {
    await page.goto('http://127.0.0.1:8392' + path);
    await page.evaluate(() => document.fonts.ready);
    await page.addScriptTag({ content: await fs.readFile('qa/axe.min.js', 'utf8') });
    const result = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }));
    reports.push({ path, violations: result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
    const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => !e.closest('.review-track, .rv-drawer') && e.getBoundingClientRect().right > innerWidth + 1).map(e => ({ tag: e.tagName, class: e.className, width: e.getBoundingClientRect().width, right: e.getBoundingClientRect().right })));
    console.log(path, 'overflow', overflow);
  }
  console.log(JSON.stringify(reports, null, 2));
  await fs.writeFile('qa/accessibility.json', JSON.stringify(reports, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
