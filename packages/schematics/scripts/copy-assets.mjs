// Finishes dist/: copies the JSON files tsc does not emit and renames the output to .cjs.
// ng-packagr 17+ marks the whole wiratheme package "type": "module", and npm pack drops nested
// package.json files, so a .cjs extension is the only reliable way to keep the schematics CommonJS.
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
for (const f of ['collection.json', 'migration.json', 'ng-add/schema.json']) {
  cpSync(fileURLToPath(new URL(`../src/${f}`, import.meta.url)), join(dist, f));
}

const jsFiles = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.js')) jsFiles.push(p);
  }
})(dist);

for (const file of jsFiles) {
  const src = readFileSync(file, 'utf8').replace(/require\("(\.{1,2}\/[^"]+)"\)/g, (m, spec) => {
    const target = resolve(dirname(file), spec);
    if (existsSync(target + '.js')) return `require("${spec}.cjs")`;
    if (existsSync(join(target, 'index.js'))) return `require("${spec}/index.cjs")`;
    return m;
  });
  writeFileSync(file.slice(0, -3) + '.cjs', src);
}
for (const file of jsFiles) rmSync(file);
