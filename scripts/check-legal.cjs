const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8392/algemene-voorwaarden/');
  const source = await fs.readFile('qa/original-legal.html', 'utf8');
  const result = await page.evaluate(source => {
    const original = new DOMParser().parseFromString(source, 'text/html');
    const normalize = text => text.replace(/[\u200b\ufeff]/g, '').replace(/\s+/g, ' ').trim();
    const sourceTerms = [...original.querySelectorAll('ol li')].map(item => normalize(item.textContent));
    const copiedTerms = [...document.querySelectorAll('.terms-list li')].map(item => normalize(item.textContent));
    return { sourceTerms, copiedTerms };
  }, source);
  assert.equal(result.sourceTerms.length, 17);
  assert.deepEqual(result.copiedTerms, result.sourceTerms);
  await page.goto('http://127.0.0.1:8392/privacybeleid/');
  const privacy = await page.locator('.legal-copy').innerText();
  assert.ok(!privacy.includes('Bosbeekweg'));
  assert.equal((privacy.match(/Lemanstraat 16/g) || []).length, 3);
  await fs.writeFile('qa/legal-verification.txt', 'All 17 terms match the old website after whitespace normalization. Privacy correspondence uses Lemanstraat 16, as confirmed by Axel.\n');
  console.log('All 17 original terms match; confirmed privacy address applied.');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
