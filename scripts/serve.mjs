import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const port = Number(process.env.PORT || 8392);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.xml': 'application/xml', '.txt': 'text/plain' };
const headers = Object.fromEntries((await readFile('_headers', 'utf8')).split('\n').filter(line => line.startsWith('  ')).map(line => { const index = line.indexOf(':'); return [line.slice(0, index).trim(), line.slice(index + 1).trim()]; }));
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    let path = resolve(root, '.' + decodeURIComponent(url.pathname));
    if (path !== root && !path.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
    if ((await stat(path)).isDirectory()) {
      if (!url.pathname.endsWith('/')) { response.writeHead(301, { Location: url.pathname + '/' + url.search }); response.end(); return; }
      path = resolve(path, 'index.html');
    }
    const body = await readFile(path);
    response.writeHead(200, { ...headers, 'Content-Type': types[extname(path)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404, { ...headers, 'Content-Type': 'text/html; charset=utf-8' });
    response.end(await readFile(resolve(root, '404.html')));
  }
}).listen(port, '127.0.0.1', () => console.log(`Revive preview: http://127.0.0.1:${port}`));
