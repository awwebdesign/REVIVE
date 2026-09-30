const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = [];
  try {
    for (const width of [390, 1440]) {
      for (const reducedMotion of ['no-preference', 'reduce']) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto('http://127.0.0.1:8392/');
        await page.evaluate(() => document.fonts.ready);
        await page.waitForFunction(() => document.querySelector('#treatment-title').hasAttribute('data-scroll-reveal'));
        for (const selector of ['#treatment-title', '.t-card', '.about-photo', '#about-title', '#reviews-title', '#faq-title', '.faq-list details', '.footer-wordmark']) {
          assert.equal(await page.locator(selector).first().evaluate(e => getComputedStyle(e).opacity), '0', `${selector} hidden before scrolling at ${width}px`);
        }
        for (const selector of ['#treatment-title', '.about-photo', '#faq-title', '.footer-wordmark']) {
          const target = page.locator(selector);
          await target.evaluate(e => window.scrollTo({ top: scrollY + e.getBoundingClientRect().top - innerHeight / 2, behavior: 'instant' }));
          await page.waitForFunction(s => {
            const e = document.querySelector(s);
            const opacity = Number(getComputedStyle(e).opacity);
            return e.dataset.revealed === 'true' && opacity > 0 && opacity < 1;
          }, selector, { polling: 'raf' });
          const before = await target.evaluate(e => ({ top: e.getBoundingClientRect().top, transform: getComputedStyle(e).transform }));
          await page.waitForFunction(s => getComputedStyle(document.querySelector(s)).opacity === '1', selector);
          const after = await target.evaluate(e => ({ top: e.getBoundingClientRect().top, transform: getComputedStyle(e).transform }));
          assert.equal(before.transform, 'none');
          assert.equal(after.transform, 'none');
          assert.ok(Math.abs(after.top - before.top) < 1, `${selector} must stay still`);
        }
        assert.equal(await page.locator('.about-photo > img').evaluate(e => getComputedStyle(e).animationName), 'none');
        await page.locator('#treatment-title').evaluate(e => e.scrollIntoView({ behavior: 'instant' }));
        assert.equal(await page.locator('#treatment-title').evaluate(e => getComputedStyle(e).opacity), '1', 'no replay on return');
        assert.equal(await page.locator('.ar').evaluateAll(arrows => arrows.every(a => a.querySelector('svg') && !a.textContent.trim())), true);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        assert.deepEqual(errors, []);
        results.push(`${width}px / ${reducedMotion}: hidden before scroll, visible intermediate fade, fully visible afterward, no position shift, no replay, arrows OK.`);
        await page.close();
      }
    }
    const keyboard = await browser.newPage();
    await keyboard.goto('http://127.0.0.1:8392/');
    await keyboard.locator('.about-copy > .btn').focus();
    assert.equal(await keyboard.locator('.about-copy > .btn').evaluate(e => getComputedStyle(e).opacity), '1');
    await keyboard.emulateMedia({ media: 'print' });
    assert.equal(await keyboard.locator('[data-scroll-reveal]').evaluateAll(nodes => nodes.every(e => getComputedStyle(e).opacity === '1')), true);
    await keyboard.close();
    for (const javaScriptEnabled of [false, true]) {
      const page = await browser.newPage({ javaScriptEnabled });
      if (javaScriptEnabled) await page.addInitScript(() => { delete window.IntersectionObserver; });
      await page.goto('http://127.0.0.1:8392/');
      assert.equal(await page.locator('#treatment-title').evaluate(e => getComputedStyle(e).opacity), '1');
      await page.close();
    }
    results.push('Keyboard focus, print, JavaScript disabled and unsupported-observer fallbacks OK.');
    await fs.writeFile('qa/motion-results.txt', results.join('\n') + '\n');
    console.log(results.join('\n'));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
