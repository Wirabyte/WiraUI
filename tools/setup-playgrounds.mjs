// Installs the packed wiratheme into each playground with `ng add`, drops in the shared test page
// and builds it. Usage: node tools/setup-playgrounds.mjs [v1 v2 v3]
// Needs packages/angular-<v>/wiratheme-*.tgz (pnpm build:ng, then `pnpm --filter … pack`).
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fixtures = join(root, 'e2e', 'fixtures');
const versions = process.argv.slice(2).length ? process.argv.slice(2) : ['v1', 'v2', 'v3'];
const env = { ...process.env, NG_CLI_ANALYTICS: 'false' };
const run = (cmd, cwd) => {
  console.log(`\n[${cwd.split(/[\\/]/).pop()}] ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit', env });
};

for (const v of versions) {
  const app = join(root, 'apps', `playground-${v}`);
  const shell = join(root, 'packages', `angular-${v}`);
  const tgz = readdirSync(shell).find((f) => /^wiratheme-.*\.tgz$/.test(f));
  if (!tgz) throw new Error(`${v}: no packed tarball in ${shell}; run its "pack" script first`);
  const src = join(app, 'src', 'app');

  // ng add from the tarball: installs it, then runs the package's own ng-add schematic.
  run(`npx ng add "${join(shell, tgz)}" --skip-confirmation --defaults --dark-mode=class --font=none`, app);

  copyFileSync(join(fixtures, 'app.component.html'), join(src, 'app.component.html'));
  if (v === 'v3') {
    copyFileSync(join(fixtures, 'app.standalone.ts'), join(src, 'app.ts'));
  } else {
    copyFileSync(join(fixtures, 'app.component.module.ts'), join(src, 'app.component.ts'));
    const modFile = join(src, 'app.module.ts');
    let mod = readFileSync(modFile, 'utf8');
    if (!mod.includes('WtButtonModule')) {
      mod = `import { WtButtonModule } from 'wiratheme/button';\n` + mod.replace(/imports:\s*\[/, 'imports: [WtButtonModule, ');
      writeFileSync(modFile, mod);
    }
  }
  const styles = ['styles.scss', 'styles.css'].map((f) => join(app, 'src', f)).find(existsSync);
  const css = readFileSync(join(fixtures, 'playground.css'), 'utf8');
  if (!readFileSync(styles, 'utf8').includes('.pg-gallery')) writeFileSync(styles, readFileSync(styles, 'utf8') + '\n' + css);

  run('npx ng build', app);
}
