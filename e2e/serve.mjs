// Tiny static server for a built playground: node serve.mjs <dir> <port>
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const [dir, port] = process.argv.slice(2);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

createServer((req, res) => {
  const path = normalize(decodeURIComponent((req.url || '/').split('?')[0])).replace(/^([\\/])+/, '');
  let file = join(dir, path);
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(dir, 'index.html');
  res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
  res.end(readFileSync(file));
}).listen(Number(port), '127.0.0.1', () => console.log(`serving ${dir} on http://127.0.0.1:${port}`));
