// Publishes one built package with the right npm dist-tag. Usage: node tools/publish.mjs v1|v2|v3|icons [--dry-run]
// Needs its dist folder (pnpm pack:all). npm points `latest` at the first version a package ever publishes, whatever
// tag it was given: publish v3 first, or fix it afterwards with `npm dist-tag add @wirabyte/ui@<3.x> latest`.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// `stable` is DESIGN.md §3; a prerelease goes on `<prefix><its id>`, e.g. 2.0.0-beta.0 on v2-beta.
const TARGETS = {
  v3: { dist: 'packages/angular-v3/dist', major: 3, stable: 'latest', prefix: '' },
  v2: { dist: 'packages/angular-v2/dist', major: 2, stable: 'v2-lts', prefix: 'v2-' },
  v1: { dist: 'packages/angular-v1/dist', major: 1, stable: 'v1-lts', prefix: 'v1-' },
  icons: { dist: 'packages/icons/dist', stable: 'latest', prefix: '' },
};

const [name, ...flags] = process.argv.slice(2);
const target = TARGETS[name];
if (!target) throw new Error(`Usage: node tools/publish.mjs ${Object.keys(TARGETS).join('|')} [--dry-run]`);
const dist = join(root, target.dist);
if (!existsSync(join(dist, 'package.json'))) throw new Error(`${target.dist} has no package.json; run pnpm pack:all first`);

const { name: pkg, version } = JSON.parse(readFileSync(join(dist, 'package.json'), 'utf8'));
if (target.major && !version.startsWith(`${target.major}.`)) throw new Error(`${target.dist} holds ${pkg}@${version}, expected ${target.major}.x`);
const pre = /^\d+\.\d+\.\d+-([a-z]+)/.exec(version);
const tag = pre ? target.prefix + pre[1] : target.stable;

// A scoped package is private unless told otherwise, and the free org cannot hold private ones.
const args = ['publish', '--tag', tag, '--access', 'public', ...flags.filter((f) => f === '--dry-run')];
console.log(`${pkg}@${version} → dist-tag ${tag}${args.includes('--dry-run') ? ' (dry run)' : ''}`);
execFileSync('npm', args, { cwd: dist, stdio: 'inherit', shell: process.platform === 'win32' });

// In the Publish workflow, tag the commit straight after each upload, so a later package failing keeps this tag.
// The upload has already happened by now: a tag that fails must not stop the packages still to come.
if (process.env.GITHUB_ACTIONS && !args.includes('--dry-run')) {
  const release = `${pkg}@${version}`;
  try {
    execFileSync('git', ['tag', release], { cwd: root, stdio: 'inherit' });
    execFileSync('git', ['push', 'origin', release], { cwd: root, stdio: 'inherit' });
  } catch (e) {
    console.warn(`::warning::Published ${release} but could not tag the commit: ${e.message}`);
  }
}
