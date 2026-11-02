import { HostTree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const collection = fileURLToPath(new URL('../dist/collection.json', import.meta.url));
const runner = new SchematicTestRunner('wiraui', collection);

/** Shaped like a typical v1 app: Angular 15, NgModule, styles.scss that already imports Kanit and PrimeNG. */
function moduleApp(angular = '^15.2.0'): UnitTestTree {
  const t = new UnitTestTree(new HostTree());
  t.create('package.json', JSON.stringify({ dependencies: { '@angular/core': angular, primeng: '^15.4.0' } }));
  t.create(
    'angular.json',
    JSON.stringify({
      version: 1,
      projects: {
        app: {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          architect: {
            build: { options: { main: 'src/main.ts', index: 'src/index.html', styles: ['src/styles.scss'] } },
            test: { options: { styles: ['src/styles.scss'] } },
          },
        },
      },
    })
  );
  t.create(
    'src/main.ts',
    `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';\nimport { AppModule } from './app/app.module';\n\nplatformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.error(err));\n`
  );
  t.create(
    'src/app/app.module.ts',
    `import { NgModule } from '@angular/core';\nimport { BrowserModule } from '@angular/platform-browser';\nimport { MessageService } from 'primeng/api';\nimport { AppComponent } from './app.component';\n\n@NgModule({\n  declarations: [AppComponent],\n  imports: [BrowserModule],\n  providers: [MessageService],\n  bootstrap: [AppComponent],\n})\nexport class AppModule {}\n`
  );
  t.create('src/styles.scss', `@import 'primeng/resources/primeng.css';\n@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;700&display=swap');\n`);
  t.create('src/index.html', '<!doctype html>\n<html>\n<head>\n  <title>App</title>\n</head>\n<body><app-root></app-root></body>\n</html>\n');
  return t;
}

/** Shaped like a fresh Angular 21 app: standalone, app.config.ts, plain CSS. */
function standaloneApp(): UnitTestTree {
  const t = new UnitTestTree(new HostTree());
  t.create('package.json', JSON.stringify({ dependencies: { '@angular/core': '^21.2.0' } }));
  t.create(
    'angular.json',
    JSON.stringify({
      version: 1,
      projects: {
        web: {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          architect: { build: { options: { browser: 'src/main.ts', styles: ['src/styles.css'] } } },
        },
      },
    })
  );
  t.create(
    'src/main.ts',
    `import { bootstrapApplication } from '@angular/platform-browser';\nimport { appConfig } from './app/app.config';\nimport { App } from './app/app';\n\nbootstrapApplication(App, appConfig).catch((err) => console.error(err));\n`
  );
  t.create(
    'src/app/app.config.ts',
    `import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [provideZonelessChangeDetection()],\n};\n`
  );
  t.create('src/styles.css', 'body { margin: 0; }\n');
  t.create('src/index.html', '<!doctype html>\n<html>\n<head>\n  <title>Web</title>\n</head>\n<body><app-root></app-root></body>\n</html>\n');
  return t;
}

const base = { theme: 'auto', utils: true, primary: '', font: 'auto', locale: 'th-buddhist', darkMode: 'none', angularRange: '>=15.0.0 <18.0.0' };

describe('ng add wiraui', () => {
  it('sets up an NgModule + SCSS app', async () => {
    const t = await runner.runSchematic('ng-add', { ...base, style: 'auto', structure: 'auto' }, moduleApp());
    const theme = t.readContent('src/theme/wiraui.theme.scss');
    expect(theme).toContain("@use 'wiraui/theme' with (");
    expect(theme).toContain('wiraui-config {');
    // Angular 15 → wiraui@1, whose default is the classic teal look (sila-light-teal).
    expect(theme).toContain("$preset: 'sila-classic',");
    expect(theme).toContain('    500: #14b8a6,');
    expect(t.readContent('src/styles.scss').startsWith("@use 'theme/wiraui.theme';\n@use 'wiraui/utils';\n@import")).toBe(true);
    const mod = t.readContent('src/app/app.module.ts');
    expect(mod).toContain("import { provideWiraUI } from 'wiraui/config';");
    expect(mod).toContain("import { wiraOverrides } from '../theme/wiraui.overrides';");
    expect(mod).toContain("providers: [MessageService, provideWiraUI({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist', darkMode: 'none' })],");
    expect(t.exists('src/theme/wiraui.overrides.ts')).toBe(true);
    // Kanit is already imported in styles.scss, so no second <link>.
    expect(t.readContent('src/index.html')).not.toContain('fonts.googleapis.com');
  });

  it('is safe to run twice', async () => {
    const once = await runner.runSchematic('ng-add', { ...base, style: 'auto', structure: 'auto' }, moduleApp());
    const twice = await runner.runSchematic('ng-add', { ...base, style: 'auto', structure: 'auto' }, once);
    expect(twice.readContent('src/app/app.module.ts').match(/provideWiraUI\(/g)).toHaveLength(1);
    expect(twice.readContent('src/styles.scss').match(/wiraui\.theme/g)).toHaveLength(1);
    expect(twice.readContent('src/styles.scss').match(/wiraui\/utils/g)).toHaveLength(1);
  });

  it('sets up a standalone + CSS app with the chosen preset, colour and font', async () => {
    const t = await runner.runSchematic(
      'ng-add',
      { ...base, angularRange: '>=21.0.0', style: 'auto', structure: 'auto', theme: 'siam', primary: '#2563EB', font: 'Sarabun', darkMode: 'class' },
      standaloneApp()
    );
    const css = t.readContent('src/theme/wiraui.theme.css');
    expect(css).toContain('--wu-primary-500: #2563eb;');
    expect(css).toContain("--wu-font-family: 'Sarabun', sans-serif;");
    expect(css).toContain(':root.wu-dark {');
    const ws = JSON.parse(t.readContent('angular.json'));
    expect(ws.projects.web.architect.build.options.styles).toEqual(['node_modules/wiraui/utils/utils.css', 'src/theme/wiraui.theme.css', 'src/styles.css']);
    const cfg = t.readContent('src/app/app.config.ts');
    expect(cfg).toContain("import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';\nimport { provideWiraUI } from 'wiraui/config';");
    expect(cfg).toContain("providers: [provideZonelessChangeDetection(), provideWiraUI({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist', darkMode: 'class' })],");
    expect(t.readContent('src/index.html')).toContain('family=Sarabun:wght@400;500;600;700');
  });

  it('leaves the utilities out with --utils=false', async () => {
    const t = await runner.runSchematic('ng-add', { ...base, utils: false, style: 'auto', structure: 'auto' }, moduleApp());
    expect(t.readContent('src/styles.scss')).not.toContain('wiraui/utils');
    const css = await runner.runSchematic('ng-add', { ...base, utils: false, angularRange: '>=21.0.0', style: 'auto', structure: 'auto' }, standaloneApp());
    expect(JSON.parse(css.readContent('angular.json')).projects.web.architect.build.options.styles).not.toContain('node_modules/wiraui/utils/utils.css');
  });

  it('offers each major its own themes', async () => {
    const sayan = await runner.runSchematic('ng-add', { ...base, style: 'css', structure: 'auto', theme: 'sayan-blue' }, moduleApp());
    const css = sayan.readContent('src/theme/wiraui.theme.css');
    expect(css).toContain('--surface-ground: var(--wu-ground);');
    expect(css).toContain('--wu-scheme: dark;');
    expect(css).not.toContain('wu-dark');
    await expect(runner.runSchematic('ng-add', { ...base, style: 'css', structure: 'auto', theme: 'mali' }, moduleApp())).rejects.toThrow(
      /wiraui@1 has no theme "mali"; choose one of: sila-light-blue/
    );
    // v3 starts from WiraUI's own Wira preset, which has no --p-* aliases (apps that need them pick mali).
    const wira = await runner.runSchematic('ng-add', { ...base, angularRange: '>=21.0.0', style: 'auto', structure: 'auto' }, standaloneApp());
    const wiraCss = wira.readContent('src/theme/wiraui.theme.css');
    expect(wiraCss).toContain('--wu-primary-500: #1e7ae0;');
    expect(wiraCss).not.toContain('--p-primary-color');
    const mali = await runner.runSchematic('ng-add', { ...base, angularRange: '>=21.0.0', style: 'css', structure: 'auto', theme: 'mali' }, standaloneApp());
    expect(mali.readContent('src/theme/wiraui.theme.css')).toContain('--p-primary-color: var(--wu-primary-color);');
  });

  it('accepts the theme names teams already know and maps them to WiraUI names', async () => {
    const v1 = await runner.runSchematic('ng-add', { ...base, style: 'css', structure: 'auto', theme: 'lara-light-blue' }, moduleApp());
    expect(v1.readContent('src/theme/wiraui.theme.css')).toContain('--wu-primary-500: #3b82f6;');
    const v3 = await runner.runSchematic('ng-add', { ...base, angularRange: '>=21.0.0', style: 'css', structure: 'auto', theme: 'Aura' }, standaloneApp());
    expect(v3.readContent('src/theme/wiraui.theme.css')).toContain('--wu-primary-500: #10b981;');
  });

  it('reads angular.json with comments and trailing commas, like the Angular CLI does', async () => {
    const t = moduleApp();
    const ws = t.readContent('angular.json').replace('"styles":["src/styles.scss"]', '"styles":["src/styles.scss",] /* app styles */');
    t.overwrite('angular.json', '// workspace\n' + ws.replace('}}}}}', '},}}}}'));
    const out = await runner.runSchematic('ng-add', { ...base, style: 'auto', structure: 'auto' }, t);
    expect(out.readContent('src/app/app.module.ts')).toContain('provideWiraUI(');
  });

  it('refuses an Angular version outside its range and names the right major', async () => {
    await expect(runner.runSchematic('ng-add', { ...base, style: 'auto', structure: 'auto' }, moduleApp('^18.2.0'))).rejects.toThrow(
      /Angular 15–17.*Angular 18.*ng add wiraui@2/s
    );
    await expect(runner.runSchematic('ng-add', { ...base, angularRange: '>=21.0.0', style: 'auto', structure: 'auto' }, moduleApp('^19.0.0'))).rejects.toThrow(
      /wiraui@2/
    );
  });

  it('names the dist-tag instead of the major when this release is a prerelease', async () => {
    const refusal = (angular: string, angularRange: string) =>
      runner.runSchematic('ng-add', { ...base, angularRange, releaseVersion: '1.0.0-beta.0', style: 'auto', structure: 'auto' }, moduleApp(angular));
    await expect(refusal('^19.0.0', '>=15.0.0 <18.0.0')).rejects.toThrow(/Use: ng add wiraui@v2-beta$/);
    await expect(refusal('^21.0.0', '>=15.0.0 <18.0.0')).rejects.toThrow(/Use: ng add wiraui@beta$/);
    await expect(refusal('^15.0.0', '>=21.0.0')).rejects.toThrow(/Use: ng add wiraui@v1-beta$/);
  });

  it('takes Angular 22 and every newer major on wiraui@3', async () => {
    for (const angular of ['^21.0.0', '^22.2.0', '^23.0.0']) {
      const out = await runner.runSchematic('ng-add', { ...base, angularRange: '>=21.0.0', style: 'auto', structure: 'auto' }, moduleApp(angular));
      expect(out.readContent('src/app/app.module.ts')).toContain('provideWiraUI(');
    }
  });
});
