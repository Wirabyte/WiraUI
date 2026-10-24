// Packs the three wiratheme majors for the docs site (apps/docs), which installs them side by side:
//   wiratheme-v1, wiratheme-v2  → renamed builds (their internal 'wiratheme/…' imports renamed too)
//   wiratheme                   → the normal v3 build
// Output: apps/docs/vendor/*.tgz. Run `pnpm build:ng` first so packages/angular-v3/dist exists.
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

console.log('docs packages:', readdirSync(vendor).join(', '));
