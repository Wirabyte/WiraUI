// Packs the three wiraui majors for the docs site (apps/docs), which installs them side by side:
//   wiraui-v1, wiraui-v2  → renamed builds (their internal '@wirabyte/ui/…' imports renamed too)
//   wiraui                   → the normal v3 build
//   wiraicon                    → the icon package (packages/icons/dist; run its build first)
// Output: apps/docs/vendor/*.tgz, installed into apps/docs/node_modules.
// Run `pnpm build:ng` first so packages/angular-v3/dist exists, and `npm ci` in apps/docs once.
//
// The first time (or with a package missing) it installs them all with npm. After that it only swaps in the packages
// whose tarball changed, each unpacked beside the old one and moved into place in one rename: a running `ng serve`
// never finds a package (say @wirabyte/icons/wiraicon.css) half gone, and unchanged packages are not touched at all.
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const vendor = join(root, 'apps', 'docs', 'vendor');
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });

rmSync(vendor, { recursive: true, force: true });
mkdirSync(vendor, { recursive: true });

for (const v of ['v1', 'v2']) {
  const shell = join(root, 'packages', `angular-${v}`);
  run(`node ../../tools/sync-sources.mjs ${v} --as wiraui-${v}`, shell);
  run('npx ng-packagr -p lib-docs/ng-package.json -c lib-docs/tsconfig.lib.json', shell);
  run(`npm pack --pack-destination "${vendor}"`, join(shell, 'dist-docs'));
}
run(`npm pack --pack-destination "${vendor}"`, join(root, 'packages', 'angular-v3', 'dist'));
run(`npm pack --pack-destination "${vendor}"`, join(root, 'packages', 'icons', 'dist'));

const docs = join(root, 'apps', 'docs');
const modules = join(docs, 'node_modules');
const files = readdirSync(vendor);
/** `wiraui-v1-1.0.0-beta.0.tgz` → `wiraui-v1`; npm packs `@wirabyte/ui` as `wirabyte-ui-…tgz`. */
const nameOf = (file) => file.replace(/-\d+\.\d+\.\d+[^/]*\.tgz$/, '').replace(/^wirabyte-/, '@wirabyte/');
const hashOf = (file) => createHash('sha256').update(readFileSync(join(vendor, file))).digest('hex');
/** Where the hash of the tarball a package came from is kept. */
const stampOf = (name) => join(modules, name, '.wu-pack');
const readStamp = (name) => (existsSync(stampOf(name)) ? readFileSync(stampOf(name), 'utf8').trim() : '');

const missing = files.some((f) => !existsSync(join(modules, nameOf(f), 'package.json'))) || !existsSync(join(modules, 'chart.js', 'package.json'));

if (missing) {
  // --no-save: the docs lockfile never records these local tarballs, so `npm ci` keeps working.
  // WU_NPM lets you swap in a different npm, e.g. WU_NPM="npx -y npm@11".
  // './' matters: without it npm reads `vendor/x.tgz` as a GitHub owner/repo shorthand.
  for (const f of files) rmSync(join(modules, nameOf(f)), { recursive: true, force: true });
  rmSync(join(docs, '.angular', 'cache'), { recursive: true, force: true });
  // chart.js is @wirabyte/ui/chartjs's optional peer; it goes in the same install (a second --no-save install would prune it).
  run(`${process.env.WU_NPM || 'npm'} install --no-save --no-audit --no-fund ${files.map((f) => `./vendor/${f}`).join(' ')} chart.js@^4.5.1`, docs);
  for (const f of files) writeFileSync(stampOf(nameOf(f)), hashOf(f));
  console.log('docs packages (installed):', files.join(', '));
} else {
  const changed = [];
  for (const f of files) {
    const name = nameOf(f);
    const hash = hashOf(f);
    if (readStamp(name) === hash) continue;
    swap(name, join(vendor, f));
    writeFileSync(stampOf(name), hash);
    changed.push(name);
  }
  // The dev server's prebundled packages are stale once a package changes.
  if (changed.length) rmSync(join(docs, '.angular', 'cache'), { recursive: true, force: true });
  console.log(`docs packages: ${changed.length ? `updated ${changed.join(', ')}` : 'all unchanged'} (${files.join(', ')})`);
}

/** Unpack `tgz` beside the installed package, then move it into place (a copy over it when a watcher holds the folder). */
function swap(name, tgz) {
  const dest = join(modules, name);
  // Beside it, in the same folder (a scoped name's scope folder), so each move stays a rename.
  const fresh = join(dirname(dest), `.wu-new-${basename(dest)}`);
  const old = join(dirname(dest), `.wu-old-${basename(dest)}`);
  rmSync(fresh, { recursive: true, force: true });
  rmSync(old, { recursive: true, force: true });
  mkdirSync(fresh, { recursive: true });
  // Relative, forward-slash paths: GNU tar reads `D:\…` as a remote host.
  const rel = (p) => relative(modules, p).split('\\').join('/');
  execSync(`tar -xzf "${rel(tgz)}" -C "${rel(fresh)}" --strip-components=1`, { cwd: modules });
  try {
    renameSync(dest, old);
    renameSync(fresh, dest);
  } catch {
    if (!existsSync(dest)) renameSync(old, dest);
    cpSync(fresh, dest, { recursive: true, force: true });
    rmSync(fresh, { recursive: true, force: true });
  }
  rmSync(old, { recursive: true, force: true });
}
