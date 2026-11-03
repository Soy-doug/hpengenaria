import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const PORT = Number(process.env.PORT) || 8000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
    const filePath = join(root, urlPath.replace(/^\/+/, ''));

    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      return res.end('403 Forbidden');
    }

    const fileStat = await stat(filePath).catch(() => null);
    if (!fileStat || !fileStat.isFile()) {
      res.writeHead(404);
      return res.end('404 Not Found');
    }

    const ext = extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch {
    res.writeHead(500);
    res.end('500 Internal Server Error');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\nServidor de desenvolvimento ativo em: http://127.0.0.1:${PORT} (ou http://localhost:${PORT})`);
  console.log(`Pressione Ctrl+C para encerrar.\n`);
});
