import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';

// The 404 document can be served at any depth, so it needs a fixed site root.
// Normal pages use relative paths and work at both / and /REVIVE/.
const errorBase = process.argv.find(arg => arg.startsWith('--base-path='))?.slice('--base-path='.length) || '/REVIVE/';
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(errorBase)) throw new Error('Use a base path such as / or /REVIVE/.');
const home = await readFile('index.html', 'utf8');
const pages = [
  ['algemene-voorwaarden', 'Algemene voorwaarden', 'De algemene voorwaarden voor afspraken, behandelingen en betalingen bij Revive Massage Therapie.'],
  ['privacybeleid', 'Privacybeleid', 'Lees hoe Revive Massage Therapie omgaat met je persoonsgegevens en hoe je je privacyrechten kan uitoefenen.'],
  ['cookiebeleid', 'Cookiebeleid', 'Informatie over cookies, externe links en privacy op de website van Revive Massage & Coaching.'],
];
const navigation = current => pages.map(([slug, title]) => `<a href="/${slug}/"${slug === current ? ' aria-current="page"' : ''}>${title}</a>`).join('');
const header = home.slice(home.indexOf('<a class="skip"'), home.indexOf('<main id="main"'))
  .replace(/\b(href|src)="\.\//g, '$1="/')
  .replaceAll('href="#behandelingen"', 'href="/#behandelingen"').replaceAll('href="#glenn"', 'href="/#glenn"').replaceAll('href="#contact"', 'href="/#contact"')
  .replace('href="#" aria-label="Revive · naar boven"', 'href="/" aria-label="Revive · naar de homepage"');
const footer = current => `<footer class="legal-footer">
<div class="shell legal-contact"><div><p><strong>Revive Massage &amp; Coaching</strong></p><p>Lemanstraat 16 · 2860 Sint-Katelijne-Waver</p><p>Ondernemingsnr. 0787.390.768</p></div><p><a href="mailto:reservaties@revive-massagetherapie.be">reservaties@revive-massagetherapie.be</a></p></div>
<div class="footer-legal"><div class="shell"><span>© <span data-year>2026</span> Revive Massage &amp; Coaching</span><nav class="legal-links" aria-label="Juridische informatie">${navigation(current)}</nav><a class="design-credit" href="https://awwebdesign.be/" target="_blank" rel="noopener noreferrer">Designed by AW WEBDESIGN</a></div></div></footer>`;
function document(title, description, path, main, current = '') {
  const html = `<!doctype html>
<html lang="nl-BE"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · Revive Massage &amp; Coaching</title><meta name="description" content="${description}">
<meta name="theme-color" content="#101110"><meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="robots" content="${path === '/404.html' ? 'noindex,follow' : 'index,follow'}">
${path === '/404.html' ? '' : `<link rel="canonical" href="https://www.revive-massagetherapie.be${path}">`}
<meta property="og:type" content="website"><meta property="og:locale" content="nl_BE"><meta property="og:site_name" content="Revive Massage &amp; Coaching">
<meta property="og:title" content="${title} · Revive"><meta property="og:description" content="${description}"><meta property="og:url" content="https://www.revive-massagetherapie.be${path}">
<meta property="og:image" content="https://www.revive-massagetherapie.be/assets/social-preview.jpg"><meta property="og:image:alt" content="Revive Massage &amp; Coaching"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/fonts/fonts.css"><link rel="stylesheet" href="/style.css?v=14"><link rel="stylesheet" href="/launch.css?v=1">
</head><body class="legal-page">${header}${main}${footer(current)}
<script src="/assets/vendor/lenis.min.js" defer></script><script src="/style.js?v=13" defer></script></body></html>\n`;
  const prefix = path === '/404.html' ? errorBase : '../';
  return html.replace(/\b(href|src)="\/(?!\/)/g, `$1="${prefix}`);
}
for (const [slug, title, description] of pages) {
  const content = await readFile(`content/${slug}.html`, 'utf8');
  const main = `<main id="main" class="legal-main shell" tabindex="-1"><div class="legal-heading"><a class="legal-back" href="/"><span aria-hidden="true">←</span> Terug naar Revive</a><h1>${title}</h1>${slug === 'cookiebeleid' ? '<p>Laatst bijgewerkt: 29 september 2026</p>' : ''}</div><div class="legal-layout"><nav class="legal-nav" aria-label="Beleidsdocumenten">${navigation(slug)}</nav><article class="legal-copy" aria-label="${title}">${content}</article></div></main>`;
  await mkdir(slug, { recursive: true });
  await writeFile(`${slug}/index.html`, document(title, description, `/${slug}/`, main, slug));
}
await writeFile('404.html', document('Pagina niet gevonden', 'Deze pagina bestaat niet. Ga terug naar Revive of boek je afspraak.', '/404.html', '<main id="main" class="legal-main shell" tabindex="-1"><div class="legal-heading"><a class="legal-back" href="/">← Terug naar Revive</a><h1>Even de weg kwijt?</h1></div><div class="error-copy"><p>Deze pagina bestaat niet of is verplaatst. Via de homepage vind je onze behandelingen, contactgegevens en de link om een afspraak te boeken.</p><a class="btn" href="/">Naar de homepage <span aria-hidden="true">→</span></a></div></main>'));
await writeFile('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['', ...pages.map(([slug]) => `${slug}/`)].map(path => `<url><loc>https://www.revive-massagetherapie.be/${path}</loc></url>`).join('')}</urlset>\n`);
await mkdir('dist', { recursive: true });
for (const path of ['index.html', 'style.css', 'launch.css', 'style.js', '404.html', 'robots.txt', 'sitemap.xml', '.htaccess', '_headers', ...pages.map(([slug]) => slug)]) await cp(path, `dist/${path}`, { recursive: true });
await mkdir('dist/assets', { recursive: true });
for (const path of ['fonts', 'vendor', 'favicon.svg', 'apple-touch-icon.png', 'social-preview.jpg', 'header-mark.webp', 'footer-logo.webp', 'hero-lockup.webp', 'treatment.avif', 'deep-tissue.avif', 'cupping.avif', 'glenn.avif']) await cp(`assets/${path}`, `dist/assets/${path}`, { recursive: true });
console.log('Built homepage, 3 legal pages, 404 page and upload folder: dist/');
