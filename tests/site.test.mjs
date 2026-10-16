import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const origin = 'http://127.0.0.1:8000';

test('âncoras internas resolvem e os IDs são únicos', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, 'IDs duplicados');
  for (const [, target] of html.matchAll(/\bhref="#([^"]+)"/g)) {
    assert.ok(ids.includes(target), 'Âncora não encontrada: ' + target);
  }
});

test('home e recursos locais respondem sem erros HTTP', async () => {
  const response = await fetch(origin);
  assert.equal(response.status, 200);
  const resources = new Set([...html.matchAll(/(?:src|href)="((?:assets\/|styles\.css|script\.js)[^"]*)"/g)].map(match => match[1]));
  for (const resource of resources) {
    assert.equal((await fetch(origin + '/' + resource)).status, 200, resource);
  }
});

test('contatos correspondem ao material fornecido, sem contatos fictícios do mockup', async () => {
  const content = await readFile(new URL('src/content.ts', root), 'utf8');
  assert.match(content, /5591991130303/);
  assert.match(content, /5591991131368/);
  assert.match(content, /hpengenharia2019@gmail\.com/);
  assert.doesNotMatch(html, /comercial@hpengenharia\.com\.br|99184-0022|98803-0502/);
});
