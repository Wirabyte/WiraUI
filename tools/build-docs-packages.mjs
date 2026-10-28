// Packs the three wiratheme majors for the docs site (apps/docs), which installs them side by side:
//   wiratheme-v1, wiratheme-v2  → renamed builds (their internal 'wiratheme/…' imports renamed too)
//   wiratheme                   → the normal v3 build
//   wiraicon                    → the icon package (packages/icons/dist; run its build first)
// Output: apps/docs/vendor/*.tgz, installed into apps/docs/node_modules.
// Run `pnpm build:ng` first so packages/angular-v3/dist exists, and `npm ci` in apps/docs once.
import { execSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const vendor = join(root, 'apps', 'docs', 'vendor');
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });

rmSync(vendor, { recursive: true, force: true });
mkdirSync(vendor, { recursive: true });

for (const v of ['v1', 'v2']) {
  const shell = join(root, 'packages', `angular-${v}`);
  run(`node ../../tools/sync-sources.mjs ${v} --as wiratheme-${v}`, shell);
  run('npx ng-packagr -p lib-docs/ng-package.json -c lib-docs/tsconfig.lib.json', shell);
  run(`npm pack --pack-destination "${vendor}"`, join(shell, 'dist-docs'));
}
run(`npm pack --pack-destination "${vendor}"`, join(root, 'packages', 'angular-v3', 'dist'));
run(`npm pack --pack-destination "${vendor}"`, join(root, 'packages', 'icons', 'dist'));

// --no-save: the docs lockfile never records these local tarballs, so `npm ci` keeps working.
// WT_NPM lets you swap in a different npm, e.g. WT_NPM="npx -y npm@11".
const docs = join(root, 'apps', 'docs');
// './' matters: without it npm reads `vendor/x.tgz` as a GitHub owner/repo shorthand.
const tarballs = readdirSync(vendor).map((f) => `./vendor/${f}`);
for (const name of ['wiratheme', 'wiratheme-v1', 'wiratheme-v2', 'wiraicon']) rmSync(join(docs, 'node_modules', name), { recursive: true, force: true });
rmSync(join(docs, '.angular', 'cache'), { recursive: true, force: true });
// chart.js is wiratheme/chartjs's optional peer; it goes in the same install (a second --no-save install would prune it).
run(`${process.env.WT_NPM || 'npm'} install --no-save --no-audit --no-fund ${tarballs.join(' ')} chart.js@^4.5.1`, docs);

console.log('docs packages:', readdirSync(vendor).join(', '));
