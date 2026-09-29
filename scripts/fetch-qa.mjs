import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('qa', { recursive: true });
for (const [url, destination] of [
  ['https://cdn.jsdelivr.net/npm/axe-core@4.10.3/axe.min.js', 'qa/axe.min.js'],
  ['https://www.revive-massagetherapie.be/algemene-voorwaarden', 'qa/original-legal.html']
]) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  await writeFile(destination, await response.text());
}
console.log('Saved accessibility checker and original legal source for verification.');
