const fs = require('node:fs/promises');
const path = require('node:path');
const JSZip = require(process.env.JSZIP_PATH || 'jszip');
(async () => {
  const zip = new JSZip();
  let count = 0;
  async function add(directory, prefix = '') {
    for (const item of await fs.readdir(directory, { withFileTypes: true })) {
      const name = prefix + item.name;
      if (item.isDirectory()) await add(path.join(directory, item.name), name + '/');
      else { zip.file(name, await fs.readFile(path.join(directory, item.name))); count++; }
    }
  }
  await add('dist');
  const output = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } });
  await fs.writeFile('revive-upload.zip', output);
  const check = await JSZip.loadAsync(output);
  for (const name of ['index.html', '.htaccess', 'privacybeleid/index.html', 'algemene-voorwaarden/index.html', 'cookiebeleid/index.html', '404.html', 'robots.txt', 'sitemap.xml']) {
    if (!check.file(name)) throw new Error(`Missing upload file: ${name}`);
  }
  console.log(`Verified revive-upload.zip: ${count} files, ${(output.length / 1024 / 1024).toFixed(2)} MB.`);
})().catch(error => { console.error(error); process.exit(1); });
