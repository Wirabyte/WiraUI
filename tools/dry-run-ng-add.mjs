// Runs the real ng-add schematic against an existing app WITHOUT touching it: the app's files are
// read into an in-memory tree and the result is printed as a diff.
// Usage: node tools/dry-run-ng-add.mjs <app-dir> [--key=value …]   e.g. --dark-mode=none
// Needs: pnpm --filter @wiraui/schematics build
import { createRequire } from 'node:module';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(root, 'packages', 'schematics', 'package.json'));
const { HostTree } = require('@angular-devkit/schematics');
const { SchematicTestRunner, UnitTestTree } = require('@angular-devkit/schematics/testing');
const { peerRange, VERSIONS } = await import('./versions.mjs');

const [appDir, ...flags] = process.argv.slice(2);
if (!appDir) {
  console.error('usage: node tools/dry-run-ng-add.mjs <app-dir> [--key=value …]');
  process.exit(1);
}
const SKIP = new Set(['node_modules', 'dist', '.angular', '.git', '.nx', 'coverage']);
const TEXT = /\.(json|ts|html|scss|sass|css|less)$/;

const tree = new UnitTestTree(new HostTree());
const before = new Map();
(function load(dir) {
  for (const e of readdirSync(dir)) {
    if (SKIP.has(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) load(p);
    else if (TEXT.test(e) && statSync(p).size < 2_000_000) {
      const rel = relative(appDir, p).split(sep).join('/');
      const content = readFileSync(p, 'utf8');
      before.set(rel, content);
      tree.create(rel, content);
    }
  }
})(appDir);

// Pick the wiraui major the app's Angular version needs, as `ng add wiraui` would.
const pkg = JSON.parse(before.get('package.json'));
const angular = parseInt(/(\d+)/.exec(pkg.dependencies['@angular/core'])[1], 10);
const [v, spec] = Object.entries(VERSIONS).find(([, s]) => angular >= s.min && (s.max === null || angular < s.max));
const options = { preset: 'wira', primary: '', font: 'auto', locale: 'th-buddhist', darkMode: 'none', style: 'auto', structure: 'auto', angularRange: peerRange(spec) };
for (const f of flags) {
  const [k, val] = f.replace(/^--/, '').split('=');
  options[k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = val;
}

const runner = new SchematicTestRunner('wiraui', join(root, 'packages', 'schematics', 'dist', 'collection.json'));
runner.logger.subscribe((e) => console.log(e.message));
const out = await runner.runSchematic('ng-add', options, tree);

console.log(`\n=== dry run: ${appDir} (Angular ${angular} → wiraui@${spec.major}, ${v}) — nothing was written ===`);
for (const file of out.files.map((f) => f.replace(/^\//, ''))) {
  const now = out.readContent(file);
  const was = before.get(file);
  if (was === undefined) console.log(`\nCREATE ${file}\n${now.split('\n').slice(0, 12).map((l) => '  + ' + l).join('\n')}${now.split('\n').length > 12 ? '\n  …' : ''}`);
  else if (was !== now) {
    console.log(`\nUPDATE ${file}`);
    const a = was.split('\n');
    const b = now.split('\n');
    b.forEach((line, i) => {
      if (!a.includes(line)) console.log(`  + ${i + 1}: ${line}`);
    });
  }
}
