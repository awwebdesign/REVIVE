import { mkdir, writeFile } from 'node:fs/promises';

const get = async url => {
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' } });
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return response;
};
await mkdir('assets/fonts', { recursive: true });
await mkdir('assets/vendor', { recursive: true });
const families = [
  ['barlow-condensed', 'Barlow+Condensed:wght@500;600;700', 'barlowcondensed'],
  ['dm-sans', 'DM+Sans:wght@400;500;600;700', 'dmsans'],
  ['grenze-gotisch', 'Grenze+Gotisch:wght@400;500;600;700;800', 'grenzegotisch'],
];
let styles = '/* Self-hosted Google Fonts. Licenses are included alongside each family. */\n';
for (const [name, query, licenseFolder] of families) {
  const css = await (await get(`https://fonts.googleapis.com/css2?family=${query}&display=swap`)).text();
  const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(match => match[1]))];
  let local = css;
  for (const [index, url] of urls.entries()) {
    const filename = `${name}-${index}.${url.endsWith('.woff2') ? 'woff2' : 'ttf'}`;
    await writeFile(`assets/fonts/${filename}`, Buffer.from(await (await get(url)).arrayBuffer()));
    local = local.replaceAll(url, filename);
  }
  styles += local + '\n';
  await writeFile(`assets/fonts/${name}-LICENSE.txt`, await (await get(`https://raw.githubusercontent.com/google/fonts/main/ofl/${licenseFolder}/OFL.txt`)).text());
}
await writeFile('assets/fonts/fonts.css', styles);
await writeFile('assets/vendor/lenis.min.js', await (await get('https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js')).text());
await writeFile('assets/vendor/lenis-LICENSE.txt', await (await get('https://cdn.jsdelivr.net/npm/lenis@1.3.4/LICENSE')).text());
console.log('Fonts, Lenis and licenses saved locally.');
