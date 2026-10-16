import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);

test('pacote de publicação contém apenas os arquivos públicos e respeita o limite de assets', async () => {
  const files = (await readdir(output, { recursive: true, withFileTypes: true })).filter(entry => entry.isFile());
  assert.equal(files.length, 9);
  assert.deepEqual((await readdir(output)).sort(), ['assets', 'index.html', 'script.js', 'styles.css']);
  for (const entry of files) {
    assert.ok((await stat(join(entry.parentPath, entry.name))).size < 25 * 1024 * 1024);
  }
  const html = await readFile(new URL('index.html', output), 'utf8');
  const assets = new Set([...html.matchAll(/(?:src|data-gallery-image)="(assets\/[^"]+)"/g)].map(match => match[1]));
  for (const asset of assets) await stat(new URL(asset, output));
  const config = JSON.parse(await readFile(new URL('wrangler.jsonc', root), 'utf8'));
  assert.equal(config.assets.directory, './dist');
});
