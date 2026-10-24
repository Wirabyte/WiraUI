// Installs the packed wiratheme into each playground with `ng add`, drops in the shared test page
// and builds it. Usage: node tools/setup-playgrounds.mjs [v1 v2 v3]
// Needs packages/angular-<v>/wiratheme-*.tgz (pnpm build:ng, then `pnpm --filter … pack`).
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
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

  // Install the tarball, then `ng add wiratheme` finds it installed and runs its ng-add schematic.
  // (Angular CLI 21 cannot `ng add` a file: spec directly; real users install by name from the registry.)
  // WT_NPM lets you swap in a different npm, e.g. WT_NPM="npx -y npm@11" when the global npm is broken.
  const tarball = relative(app, join(shell, tgz)).split(sep).join('/');
  // Same version number on every local rebuild, so drop the old copy and the CLI's build cache
  // (Angular 15's webpack cache keys on package versions and would keep serving stale wiratheme code).
  rmSync(join(app, 'node_modules', 'wiratheme'), { recursive: true, force: true });
  rmSync(join(app, '.angular', 'cache'), { recursive: true, force: true });
  // --no-save keeps package.json / package-lock.json free of the local tarball, so `npm ci` keeps working.
  run(`${process.env.WT_NPM || 'npm'} install --no-save --no-audit --no-fund ${tarball}`, app);
  run('npx ng add wiratheme --skip-confirmation --defaults --dark-mode=class --font=none', app);

  copyFileSync(join(fixtures, 'app.component.html'), join(src, 'app.component.html'));
  if (v === 'v3') {
    copyFileSync(join(fixtures, 'app.standalone.ts'), join(src, 'app.ts'));
  } else {
    copyFileSync(join(fixtures, 'app.component.module.ts'), join(src, 'app.component.ts'));
    // What the shared test page needs in an NgModule app.
    const needs = [
      ['FormsModule', '@angular/forms'],
      ['ReactiveFormsModule', '@angular/forms'],
      ['WtButtonModule', 'wiratheme/button'],
      ['WtCardModule', 'wiratheme/card'],
      ['WtInputTextModule', 'wiratheme/inputtext'],
      ['WtTextareaModule', 'wiratheme/textarea'],
      ['WtCheckboxModule', 'wiratheme/checkbox'],
      ['WtRadioButtonModule', 'wiratheme/radiobutton'],
      ['WtToggleSwitchModule', 'wiratheme/toggleswitch'],
    ];
    const modFile = join(src, 'app.module.ts');
    let mod = readFileSync(modFile, 'utf8');
    const missing = needs.filter(([name]) => !new RegExp(`\\b${name}\\b`).test(mod));
    if (missing.length) {
      mod =
        missing.map(([name, from]) => `import { ${name} } from '${from}';\n`).join('') +
        mod.replace(/imports:\s*\[/, `imports: [${missing.map(([name]) => name).join(', ')}, `);
      writeFileSync(modFile, mod);
    }
  }
  // The fixture CSS lives between markers and is replaced on every run, so edits to it always land.
  const styles = ['styles.scss', 'styles.css'].map((f) => join(app, 'src', f)).find(existsSync);
  const START = '/* wiratheme-playground:start */';
  const END = '/* wiratheme-playground:end */';
  const block = `${START}\n${readFileSync(join(fixtures, 'playground.css'), 'utf8')}${END}\n`;
  let current = readFileSync(styles, 'utf8');
  const legacy = current.indexOf('/* Playground page layout.');
  if (!current.includes(START) && legacy >= 0) current = current.slice(0, legacy);
  const s = current.indexOf(START);
  const e = current.indexOf(END);
  current = s >= 0 && e > s ? current.slice(0, s) + block + current.slice(e + END.length + 1) : current.trimEnd() + '\n\n' + block;
  writeFileSync(styles, current);

  run('npx ng build', app);
}
