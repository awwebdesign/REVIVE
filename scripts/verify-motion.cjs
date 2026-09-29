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
          window.revealLog.push({ className: this.className, frames, options });
          return animate.call(this, frames, options);
        };
      });
      await page.goto('http://127.0.0.1:8392/');
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.hero-mark').evaluate(e => getComputedStyle(e).animationName), 'markReveal');
      assert.equal(await page.locator('.hero-photo img').evaluate(e => getComputedStyle(e).animationName), 'kenburns');
      assert.equal(await page.locator('.rv-nav-inner').evaluate(e => getComputedStyle(e).animationName), 'navIn');
      assert.equal(await page.locator('#treatment-title').textContent(), 'Waar zit het vast?');
      for (const selector of ['#treatment-title', '.t-card:nth-child(1)', '.t-card:nth-child(2)', '.t-card:nth-child(3)', '.about-photo', '.footer-wordmark']) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        await page.waitForFunction(s => document.querySelector(s).dataset.revealed === 'true', selector);
      }
      const log = await page.evaluate(() => window.revealLog);
      assert.ok(log.some(e => e.className === 'rw' && e.options.delay > 0));
      assert.equal(log.filter(e => e.className === 't-card').length, 3);
      assert.ok(log.some(e => e.className.includes('about-photo') && e.frames[0].clipPath));
      assert.ok(log.some(e => e.className.includes('footer-wordmark') && e.frames[0].clipPath));
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(() => !document.documentElement.classList.contains('restored-motion'));
      assert.equal(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length), 0);
      assert.equal(await page.locator('.hero-photo img').evaluate(e => getComputedStyle(e).animationName), 'none');
      assert.equal(await page.locator('.heading-rw .rw').evaluateAll(words => words.every(w => getComputedStyle(w).opacity === '1')), true);
      results.push(`${width}px: hero/nav entrances, hero zoom, staggered words/cards, portrait/footer wipes, reduced-motion cancellation OK.`);
      await page.close();
    }
    await fs.writeFile('qa/motion-results.txt', results.join('\n') + '\n');
    console.log(results.join('\n'));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
