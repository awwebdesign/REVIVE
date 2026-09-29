const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const base = 'http://127.0.0.1:8392';
(async () => {
  await fs.mkdir('qa', { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const context = await browser.newContext();
  const errors = [], requests = new Set(), links = new Set(), results = [];
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', request => requests.add(request.url()));
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/algemene-voorwaarden/', '/privacybeleid/', '/cookiebeleid/']) {
      const response = await page.goto(base + path);
      assert.equal(response.status(), 200);
      await page.evaluate(() => document.fonts.ready);
      // Exercise the full page so lazy images are checked and screenshots reflect a visit.
      await page.evaluate(async () => {
        for (const image of document.images) image.loading = 'eager';
        await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
      });
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('h1').isVisible(), true);
      assert.equal(await page.locator('main').count(), 1);
      assert.equal(await page.locator('.footer-legal .legal-links a').count(), 3);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow: ${width} ${path}`);
      const broken = await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || !image.naturalWidth).map(image => image.src));
      assert.deepEqual(broken, [], `Broken images: ${path}`);
      for (const link of await page.locator('a[href]').evaluateAll(elements => elements.map(element => element.href))) if (link.startsWith(locationBase())) links.add(link);
      if (width === 390 || width === 1440) {
        await page.screenshot({ path: `qa/${path === '/' ? 'homepage' : path.split('/')[1]}-${width}.png`, fullPage: true });
      }
      results.push(`${width}px ${path}: OK`);
    }
  }
  // Every internal destination and anchor resolves in the delivered site.
  for (const link of links) {
    const url = new URL(link);
    const response = await page.goto(link);
    if (response) assert.equal(response.status(), 200, link);
    if (url.hash) assert.ok(await page.locator(`[id="${url.hash.slice(1)}"]`).count(), link);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  assert.equal(await page.title(), 'Revive · Sportmassage bij Glenn Versteeven');
  assert.equal(await page.locator('.practice-intro, .hero h1.hero-title').count(), 0);
  assert.equal(await page.locator('.first-visit li').count(), 3);
  for (const card of await page.locator('.t-card').all()) assert.equal(await card.getAttribute('href'), 'https://booking.optios.net/21985/activities');
  assert.equal(await page.locator('.faq-list details').count(), 6);
  const question = page.locator('.faq-list summary').first();
  await question.focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.faq-list details').first().evaluate(element => element.open), true);
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.faq-list details').first().evaluate(element => element.open), false);
  await question.click();
  await page.locator('.faq-list summary').nth(1).click();
  assert.equal(await page.locator('.faq-list details[open]').count(), 1);
  assert.equal(await page.locator('.faq-list details').first().evaluate(element => element.open), false);
  assert.equal(await page.locator('.faq-list details').nth(1).evaluate(element => element.open), true);
  await page.getByRole('button', { name: 'Menu openen' }).click();
  assert.equal(await page.locator('.rv-toggle').getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('main').evaluate(element => element.inert), true);
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    assert.ok(await page.evaluate(() => document.activeElement.closest('#rv-drawer, .rv-toggle') !== null));
  }
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.rv-toggle').getAttribute('aria-expanded'), 'false');
  assert.equal(await page.locator('.rv-toggle').evaluate(element => element === document.activeElement), true);
  await page.getByRole('button', { name: 'Menu openen' }).click();
  await page.locator('#rv-drawer a[href="#behandelingen"]').click();
  assert.equal(await page.locator('.rv-toggle').getAttribute('aria-expanded'), 'false');
  assert.equal(new URL(page.url()).hash, '#behandelingen');
  await page.getByRole('button', { name: 'Menu openen' }).click();
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.waitForFunction(() => !document.body.classList.contains('menu-open'));
  await page.locator('#reviews').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('.review-pause, .review-controls, .review-date').count(), 0);
  await page.locator('.review-viewport').focus();
  const pausedPosition = await page.locator('.review-viewport').evaluate(element => element.scrollLeft);
  await page.waitForTimeout(250);
  assert.equal(await page.locator('.review-viewport').evaluate(element => element.scrollLeft), pausedPosition);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.rv-brand').evaluate(element => element.focus({ preventScroll: true }));
  const reducedPosition = await page.locator('.review-viewport').evaluate(element => element.scrollLeft);
  assert.equal(await page.locator('.review-group[aria-hidden="true"]').isVisible(), true);
  await page.waitForFunction(start => document.querySelector('.review-viewport').scrollLeft > start + 5, reducedPosition);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const normalPosition = await page.locator('.review-viewport').evaluate(element => element.scrollLeft);
  await page.waitForFunction(start => document.querySelector('.review-viewport').scrollLeft > start + 5, normalPosition);
  assert.deepEqual(await context.cookies(), []);
  assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const fallback = await noJS.newPage();
  await fallback.goto(base);
  assert.equal(await fallback.locator('.no-js-navigation').isVisible(), true);
  assert.equal(await fallback.locator('.t-card').count(), 3);
  await fallback.locator('.faq-list summary').first().click();
  assert.equal(await fallback.locator('.faq-answer').first().isVisible(), true);
  await fallback.locator('.faq-list summary').nth(1).click();
  assert.equal(await fallback.locator('.faq-list details[open]').count(), 1);
  assert.equal(await fallback.locator('.faq-answer').first().isVisible(), false);
  assert.equal(await fallback.locator('.faq-answer').nth(1).isVisible(), true);
  assert.equal(await fallback.locator('.footer-legal a[href="/privacybeleid/"]').isVisible(), true);
  const original = await context.request.get(base + '/algemene-voorwaarden');
  assert.equal(original.status(), 200);
  const missing = await context.request.get(base + '/this-page-does-not-exist');
  assert.equal(missing.status(), 404);
  assert.ok((await missing.text()).includes('Even de weg kwijt?'));
  const externalRequests = [...requests].filter(url => !url.startsWith(base));
  assert.deepEqual(externalRequests, [], 'Third-party requests');
  assert.deepEqual(errors, [], 'Browser errors');
  results.push('Original homepage restored; first-visit steps; treatment booking links; FAQ keyboard and no-JS operation: OK', 'Internal links and anchors; original legal URL; 404; mobile menu; focus trap; Escape; breakpoint reset; automatic reviews; focus pause; reduced motion; no-JS fallback: OK', 'Cookies and browser storage: none. Third-party requests: none. Browser errors: none.');
  await fs.writeFile('qa/results.txt', results.join('\n') + '\n');
  console.log(results.join('\n'));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
function locationBase() { return base; }
