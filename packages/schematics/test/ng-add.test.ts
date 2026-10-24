import { HostTree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const collection = fileURLToPath(new URL('../dist/collection.json', import.meta.url));
const runner = new SchematicTestRunner('wiratheme', collection);

/** Shaped like Strisrinan_Apps: Angular 15, NgModule, styles.scss that already imports Kanit and PrimeNG. */
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

const base = { preset: 'wira', primary: '', font: 'auto', locale: 'th-buddhist', darkMode: 'none', angularRange: '>=15.0.0 <18.0.0' };

describe('ng add wiratheme', () => {
  it('sets up an NgModule + SCSS app', async () => {
    const t = await runner.runSchematic('ng-add', { ...base, style: 'auto', structure: 'auto' }, moduleApp());
    const theme = t.readContent('src/theme/wiratheme.theme.scss');
    expect(theme).toContain("@use 'wiratheme/theme' with (");
    expect(theme).toContain('wiratheme-config {');
    expect(t.readContent('src/styles.scss').startsWith("@use 'theme/wiratheme.theme';\n@import")).toBe(true);
    const mod = t.readContent('src/app/app.module.ts');
    expect(mod).toContain("import { provideWiraTheme } from 'wiratheme/config';");
    expect(mod).toContain("import { wiraOverrides } from '../theme/wiratheme.overrides';");
    expect(mod).toContain("providers: [MessageService, provideWiraTheme({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist', darkMode: 'none' })],");
    expect(t.exists('src/theme/wiratheme.overrides.ts')).toBe(true);
    // Kanit is already imported in styles.scss, so no second <link>.
    expect(t.readContent('src/index.html')).not.toContain('fonts.googleapis.com');
  });

  it('is safe to run twice', async () => {
    const once = await runner.runSchematic('ng-add', { ...base, style: 'auto', structure: 'auto' }, moduleApp());
    const twice = await runner.runSchematic('ng-add', { ...base, style: 'auto', structure: 'auto' }, once);
    expect(twice.readContent('src/app/app.module.ts').match(/provideWiraTheme\(/g)).toHaveLength(1);
    expect(twice.readContent('src/styles.scss').match(/wiratheme\.theme/g)).toHaveLength(1);
  });

  it('sets up a standalone + CSS app with the chosen preset, colour and font', async () => {
    const t = await runner.runSchematic(
      'ng-add',
      { ...base, angularRange: '>=21.0.0 <22.0.0', style: 'auto', structure: 'auto', preset: 'siam', primary: '#2563EB', font: 'Sarabun', darkMode: 'class' },
      standaloneApp()
    );
    const css = t.readContent('src/theme/wiratheme.theme.css');
    expect(css).toContain('--wt-primary-500: #2563eb;');
    expect(css).toContain("--wt-font-family: 'Sarabun', sans-serif;");
    expect(css).toContain(':root.wt-dark {');
    const ws = JSON.parse(t.readContent('angular.json'));
    expect(ws.projects.web.architect.build.options.styles).toEqual(['src/theme/wiratheme.theme.css', 'src/styles.css']);
    const cfg = t.readContent('src/app/app.config.ts');
    expect(cfg).toContain("import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';\nimport { provideWiraTheme } from 'wiratheme/config';");
    expect(cfg).toContain("providers: [provideZonelessChangeDetection(), provideWiraTheme({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist', darkMode: 'class' })],");
    expect(t.readContent('src/index.html')).toContain('family=Sarabun:wght@400;500;600;700');
  });

  it('refuses an Angular version outside its range and names the right major', async () => {
    await expect(runner.runSchematic('ng-add', { ...base, style: 'auto', structure: 'auto' }, moduleApp('^18.2.0'))).rejects.toThrow(
      /Angular 15–17.*Angular 18.*ng add wiratheme@2/s
    );
    await expect(runner.runSchematic('ng-add', { ...base, angularRange: '>=21.0.0 <22.0.0', style: 'auto', structure: 'auto' }, moduleApp('^19.0.0'))).rejects.toThrow(
      /wiratheme@2/
    );
  });
});
