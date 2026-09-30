const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = [];
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
      await page.addInitScript(() => {
        window.revealLog = [];
        const animate = Element.prototype.animate;
        Element.prototype.animate = function (frames, options) {
          window.revealLog.push({ className: this.className, tag: this.tagName, frames, options });
          return animate.call(this, frames, options);
        };
      });
      await page.goto('http://127.0.0.1:8392/');
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.hero-mark').evaluate(e => getComputedStyle(e).animationName), 'markReveal');
      assert.equal(await page.locator('.hero-photo img').evaluate(e => getComputedStyle(e).animationName), 'kenburns');
      assert.equal(await page.locator('.rv-nav-inner').evaluate(e => getComputedStyle(e).animationName), 'navIn');
      assert.equal(await page.locator('#treatment-title').textContent(), 'Waar zit het vast?');
      for (const selector of ['#treatment-title', '.t-card:nth-child(1)', '.t-card:nth-child(2)', '.t-card:nth-child(3)', '.about-photo', '.faq-list details:last-child', '.footer-wordmark']) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        await page.waitForFunction(s => document.querySelector(s).dataset.revealed === 'true', selector);
      }
      const log = await page.evaluate(() => window.revealLog);
      assert.ok(log.some(e => e.tag === 'H2' && e.frames[0].opacity === 0));
      assert.ok(log.some(e => e.tag === 'DETAILS' && e.frames[0].opacity === 0));
      assert.equal(log.filter(e => e.className === 't-card').length, 3);
      assert.ok(log.some(e => e.className.includes('about-photo') && e.frames[0].opacity === 0));
      assert.ok(log.some(e => e.className.includes('footer-wordmark') && e.frames[0].opacity === 0));
      await page.locator('.t-card').first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
      assert.equal(await page.evaluate(() => window.revealLog.filter(e => e.className === 't-card').length), 3, 'reveal only once');
      assert.equal(await page.locator('.ar').evaluateAll(arrows => arrows.every(a => a.querySelector('svg') && !a.textContent.trim())), true);
      assert.equal(await page.locator('.t-go').first().evaluate(e => getComputedStyle(e, '::after').content), '""');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(() => !document.documentElement.classList.contains('restored-motion'));
      assert.equal(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length), 0);
      assert.equal(await page.locator('.hero-photo img').evaluate(e => getComputedStyle(e).animationName), 'none');
      assert.equal(await page.locator('main h2').evaluateAll(headings => headings.every(h => getComputedStyle(h).opacity === '1')), true);
      results.push(`${width}px: hero/nav entrances, hero zoom, section/FAQ fades, once-only cards, SVG arrows, no overflow, reduced-motion cancellation OK.`);
      await page.close();
    }
    await fs.writeFile('qa/motion-results.txt', results.join('\n') + '\n');
    console.log(results.join('\n'));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
