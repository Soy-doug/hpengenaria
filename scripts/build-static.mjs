import { cp, lstat, mkdir, rm } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
// A limpeza só pode atingir a pasta de saída deste projeto.
if (dirname(output) !== resolve(root) || basename(output) !== 'dist') {
  throw new Error('Diretório de saída inválido.');
}
const existing = await lstat(output).catch(error => {
  if (error.code !== 'ENOENT') throw error;
});
if (existing?.isSymbolicLink()) throw new Error('dist não pode ser um link simbólico.');
await rm(output, { recursive: true, force: true });
await mkdir(join(output, 'assets'), { recursive: true });

// Lista explícita: fontes, dependências e documentação nunca são publicadas.
const files = [
  'index.html', 'styles.css', 'script.js',
  'assets/hp-logo-oficial.png',
  'assets/hero-curral.jpg',
  'assets/equipe-campo.jpg',
  'assets/atendimento-escritorio.jpg',
  'assets/visita-propriedade.jpg',
  'assets/paisagem-contexto.jpg'
];
await Promise.all(files.map(file => cp(join(root, file), join(output, file))));
console.log(`Site pronto em dist/: ${files.length} arquivos públicos.`);
