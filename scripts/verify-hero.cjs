const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      let mobile;
      for (const width of [390, 820, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion });
        let releaseImage;
        const imageGate = new Promise(resolve => { releaseImage = resolve; });
        await page.route('**/hero-lockup-hq.svg*', async route => {
          await imageGate;
          await route.continue();
        });
        await page.goto('http://127.0.0.1:8392/', { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => document.querySelector('.hero-layout').dataset.heroReveal === 'pending');
        for (const selector of ['.hero-mark', '.hero-layout > .btn']) {
          assert.deepEqual(await page.locator(selector).evaluate(e => ({
            opacity: getComputedStyle(e).opacity,
            animation: getComputedStyle(e).animationName,
          })), { opacity: '0', animation: 'none' }, 'Both elements must wait for the image');
        }
        releaseImage();
        await page.waitForFunction(() => document.querySelector('.hero-layout').dataset.heroReveal === 'ready');
        const sequence = await page.evaluate(() => {
          const nodes = [document.querySelector('.hero-mark'), document.querySelector('.hero-layout > .btn')];
          const animations = nodes.map(e => e.getAnimations()[0]);
          const synchronized = animations[0].startTime === animations[1].startTime;
          animations.forEach(a => a.pause());
          const timing = animations.map(a => ({ name: a.animationName, ...a.effect.getTiming() }));
          const frames = [0, 160, 420, 800, 1400].map(time => {
            animations.forEach(a => { a.currentTime = time; });
            return nodes.map(e => {
              const style = getComputedStyle(e);
              return { opacity: style.opacity, clip: style.clipPath, transform: style.transform };
            });
          });
          return { synchronized, timing, frames };
        });
        assert.equal(sequence.synchronized, true, 'Logo and button share the same start');
        assert.deepEqual(sequence.timing.map(a => [a.duration, a.delay]), [[1100, 160], [850, 420]]);
        assert.deepEqual(sequence.timing.map(a => a.name), reducedMotion === 'reduce' ? ['copy-fade', 'copy-fade'] : ['markReveal', 'fade-up']);
        assert.ok(sequence.frames.at(-1).every(frame => frame.opacity === '1'));
        if (mobile) assert.deepEqual(sequence, mobile, 'Tablet/laptop must match every sampled mobile frame');
        else mobile = sequence;
        console.log(`${width}px / ${reducedMotion}: logo and button timing, shared start and sampled frames match mobile.`);
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
