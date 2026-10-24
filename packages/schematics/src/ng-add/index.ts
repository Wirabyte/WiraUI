import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { posix } from 'path';
import { FONTS, normalize, toCSS, toSCSS } from '../core';
import {
  Edit,
  findBootstrapModule,
  findBootstrapOptions,
  findConfigObject,
  findNgModuleObject,
  importEdit,
  importPathOf,
  parse,
  providersEdit,
} from '../utils/ast';
import { addGlobalStyle, angularMajor, getProject, hasDependency, ProjectInfo } from '../utils/workspace';
import * as ts from 'typescript';
import { NgAddOptions } from './schema';

const GENERATOR = 'ng add wiratheme';

const OVERRIDES_TEMPLATE = `// WiraTheme · wiratheme.overrides.ts
// ค่าในไฟล์นี้ทับธีมหลัก (ไฟล์ SCSS/CSS) ผ่าน @layer wiratheme.overrides โดยไม่ต้องใช้ !important
// Values here win over the main theme file through @layer wiratheme.overrides, no !important needed.
import { defineOverrides } from 'wiratheme/config';

export const wiraOverrides = defineOverrides({
  // semantic: { radius: '8px', density: 'compact' },
  // components: { card: { bodyGap: '0px' }, button: { radius: '999px' } },
});
`;

export function ngAdd(options: NgAddOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const log = context.logger;
    assertAngularVersion(tree, options.angularRange || ownAngularRange());

    const project = getProject(tree, options.project);
    let style = options.style === 'auto' ? detectStyle(project) : options.style;
    const scssEntry = project.styles.find((s) => /\.(scss|sass)$/.test(s));
    if (style === 'scss' && !scssEntry) {
      log.warn('ไม่พบ styles.scss ในโปรเจค จึงใช้ไฟล์ธีมแบบ CSS แทน / No global .scss file found, using the CSS theme instead.');
      style = 'css';
    }
    const structure = options.structure === 'auto' ? detectStructure(tree, project) : options.structure;
    const fontChoice = options.font === 'auto' || options.font === 'none' ? undefined : options.font;
    const config = normalize({
      preset: options.preset,
      primary: options.primary ? options.primary.trim() : undefined,
      fontFamily: fontChoice,
      darkMode: options.darkMode,
    });
    if (options.primary && config.primary !== options.primary.trim().toLowerCase()) {
      log.warn(`"${options.primary}" ไม่ใช่ HEX จึงใช้สีของ preset / "${options.primary}" is not a hex colour; using the preset's colour.`);
    }

    const themeDir = `${project.sourceRoot}/theme`;
    const done: string[] = [];
    if (style === 'scss') {
      done.push(writeIfMissing(tree, `${themeDir}/wiratheme.theme.scss`, toSCSS(config, { generator: GENERATOR }), log));
      done.push(addScssUse(tree, scssEntry as string, `${themeDir}/wiratheme.theme`));
    } else {
      done.push(writeIfMissing(tree, `${themeDir}/wiratheme.theme.css`, toCSS(config, { generator: GENERATOR }), log));
      addGlobalStyle(tree, project.name, `${themeDir}/wiratheme.theme.css`);
      done.push(`angular.json: เพิ่ม ${themeDir}/wiratheme.theme.css ใน styles`);
    }
    done.push(writeIfMissing(tree, `${themeDir}/wiratheme.overrides.ts`, OVERRIDES_TEMPLATE, log));

    const [locale, calendar] =
      options.locale === 'en' ? ['en', 'gregorian'] : options.locale === 'th-gregorian' ? ['th', 'gregorian'] : ['th', 'buddhist'];
    const provider = `provideWiraTheme({ overrides: wiraOverrides, locale: '${locale}', calendar: '${calendar}', darkMode: '${options.darkMode}' })`;
    done.push(structure === 'module' ? addToModule(tree, project, themeDir, provider) : addToStandalone(tree, project, themeDir, provider));

    if (options.font !== 'none') done.push(addFont(tree, project, fontChoice || config.fontFamily));

    log.info('');
    log.info(`WiraTheme: ${style === 'scss' ? 'SCSS' : 'CSS'} · ${structure === 'module' ? 'NgModule' : 'Standalone'} · preset ${config.preset} · ${config.primary}`);
    for (const line of done.filter(Boolean)) log.info('  ✔ ' + line);
    if (hasDependency(tree, 'primeng')) {
      log.info('  ℹ พบ PrimeNG ในโปรเจค ใช้คู่กันได้ระหว่างย้าย (wt-* ไม่ชนกับ p-*) / PrimeNG found: both can run side by side while you migrate.');
    }
    log.info('ขั้นต่อไป / Next: import WtButtonModule (NgModule) หรือ WtButton (standalone) จาก wiratheme/button แล้วใช้ <wt-button label="บันทึก"></wt-button>');
  };
}

// ---------- version lock ----------

function ownAngularRange(): string | undefined {
  try {
    // node_modules/wiratheme/schematics/ng-add/index.js → node_modules/wiratheme/package.json
    return require('../../package.json').peerDependencies['@angular/core'];
  } catch (e) {
    return undefined;
  }
}

function wiraThemeMajorFor(angular: number): number | null {
  if (angular >= 21) return 3;
  if (angular >= 18) return 2;
  if (angular >= 15) return 1;
  return null;
}

function assertAngularVersion(tree: Tree, range: string | undefined): void {
  if (!range) return;
  const m = />=\s*(\d+)[^<]*(?:<\s*(\d+))?/.exec(range);
  const major = angularMajor(tree);
  if (!m || major === null) return;
  const min = parseInt(m[1], 10);
  const max = m[2] ? parseInt(m[2], 10) : null;
  if (major >= min && (max === null || major < max)) return;
  const fit = wiraThemeMajorFor(major);
  const span = max === null ? `${min}+` : `${min}–${max - 1}`;
  throw new SchematicsException(
    `wiratheme รุ่นนี้ใช้ได้กับ Angular ${span} แต่โปรเจคนี้เป็น Angular ${major}. ` +
      (fit ? `ให้ติดตั้ง wiratheme@${fit}: ng add wiratheme@${fit}` : 'ไม่มี wiratheme ที่รองรับ Angular รุ่นนี้') +
      ` / This wiratheme release supports Angular ${span}; this project uses Angular ${major}.` +
      (fit ? ` Use: ng add wiratheme@${fit}` : '')
  );
}

// ---------- detection ----------

function detectStyle(p: ProjectInfo): 'scss' | 'css' {
  const first = p.styles[0] || '';
  const lang = p.componentStyle || p.inlineStyleLanguage || first.slice(first.lastIndexOf('.') + 1);
  return lang === 'scss' || lang === 'sass' ? 'scss' : 'css';
}

function readText(tree: Tree, path: string): string {
  const buf = tree.read(path);
  if (!buf) throw new SchematicsException(`ไม่พบ ${path} / ${path} not found`);
  return buf.toString('utf8');
}

function detectStructure(tree: Tree, p: ProjectInfo): 'module' | 'standalone' {
  if (!p.main) throw new SchematicsException('ไม่พบ main.ts ใน angular.json ระบุ --structure เอง / main.ts not found; pass --structure.');
  return /bootstrapApplication\s*\(/.test(readText(tree, p.main)) ? 'standalone' : 'module';
}

// ---------- edits ----------

function writeIfMissing(tree: Tree, path: string, content: string, log: SchematicContext['logger']): string {
  if (tree.exists(path)) {
    log.warn(`มี ${path} อยู่แล้ว ไม่เขียนทับ / ${path} exists, left unchanged.`);
    return '';
  }
  tree.create(path, content);
  return `สร้าง ${path}`;
}

function addScssUse(tree: Tree, stylesFile: string, themeModule: string): string {
  const text = readText(tree, stylesFile);
  if (text.includes('wiratheme.theme')) return '';
  // Sass resolves a plain path like 'theme/wiratheme.theme' relative to the importing file.
  const rel = posix.relative(posix.dirname(stylesFile), themeModule);
  const line = stylesFile.endsWith('.sass') ? `@use '${rel}'\n` : `@use '${rel}';\n`;
  tree.overwrite(stylesFile, line + text);
  return `${stylesFile}: เพิ่ม @use '${rel}'`;
}

function relImport(fromFile: string, target: string): string {
  const rel = posix.relative(posix.dirname(fromFile), target);
  return rel.startsWith('.') ? rel : './' + rel;
}

function apply(tree: Tree, path: string, edits: (Edit | null)[]): void {
  const rec = tree.beginUpdate(path);
  for (const e of edits) if (e) rec.insertLeft(e.pos, e.text);
  tree.commitUpdate(rec);
}

function resolveTs(fromFile: string, spec: string): string {
  return posix.join(posix.dirname(fromFile), spec.endsWith('.ts') ? spec : spec + '.ts');
}

function addToModule(tree: Tree, p: ProjectInfo, themeDir: string, provider: string): string {
  const mainSf = parse(p.main as string, readText(tree, p.main as string));
  const boot = findBootstrapModule(mainSf);
  if (!boot) throw new SchematicsException('หา bootstrapModule(...) ใน main.ts ไม่เจอ ใช้ --structure=standalone หรือเพิ่ม provider เอง');
  const file = resolveTs(p.main as string, boot.from);
  const text = readText(tree, file);
  if (text.includes('provideWiraTheme(')) return `${file}: มี provideWiraTheme() อยู่แล้ว`;
  const sf = parse(file, text);
  const obj = findNgModuleObject(sf, boot.name);
  if (!obj) throw new SchematicsException(`หา @NgModule ของ ${boot.name} ใน ${file} ไม่เจอ / @NgModule for ${boot.name} not found`);
  apply(tree, file, [
    importEdit(sf, 'provideWiraTheme', 'wiratheme/config'),
    importEdit(sf, 'wiraOverrides', relImport(file, `${themeDir}/wiratheme.overrides`)),
    providersEdit(obj, provider),
  ]);
  return `${file}: เพิ่ม provideWiraTheme() ใน providers ของ ${boot.name}`;
}

function addToStandalone(tree: Tree, p: ProjectInfo, themeDir: string, provider: string): string {
  const main = p.main as string;
  const mainSf = parse(main, readText(tree, main));
  const opts = findBootstrapOptions(mainSf);
  let file = main;
  let sf = mainSf;
  let obj: ts.ObjectLiteralExpression | null = null;
  if (opts && ts.isIdentifier(opts)) {
    const from = importPathOf(mainSf, opts.text);
    if (!from) throw new SchematicsException(`หาไฟล์ของ ${opts.text} ไม่เจอ / Could not find where ${opts.text} comes from`);
    file = resolveTs(main, from);
    sf = parse(file, readText(tree, file));
    obj = findConfigObject(sf, opts.text);
  } else if (opts && ts.isObjectLiteralExpression(opts)) {
    obj = opts;
  }
  if (readText(tree, file).includes('provideWiraTheme(')) return `${file}: มี provideWiraTheme() อยู่แล้ว`;
  if (!obj) throw new SchematicsException('หา ApplicationConfig ไม่เจอ เพิ่ม provideWiraTheme() เองใน providers / ApplicationConfig not found; add provideWiraTheme() by hand.');
  apply(tree, file, [
    importEdit(sf, 'provideWiraTheme', 'wiratheme/config'),
    importEdit(sf, 'wiraOverrides', relImport(file, `${themeDir}/wiratheme.overrides`)),
    providersEdit(obj, provider),
  ]);
  return `${file}: เพิ่ม provideWiraTheme() ใน providers`;
}

function addFont(tree: Tree, p: ProjectInfo, family: string): string {
  const index = `${p.sourceRoot}/index.html`;
  if (!tree.exists(index)) return '';
  const haystack = [index, ...p.styles.filter((s) => tree.exists(s))].map((f) => readText(tree, f).toLowerCase()).join('\n');
  if (haystack.includes(family.toLowerCase())) return `ฟอนต์ ${family} โหลดอยู่แล้ว ไม่เพิ่มซ้ำ`;
  if (!(FONTS as readonly string[]).includes(family)) return '';
  const html = readText(tree, index);
  const href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
  const links = `  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="stylesheet" href="${href}">\n`;
  const at = html.toLowerCase().indexOf('</head>');
  if (at < 0) return '';
  tree.overwrite(index, html.slice(0, at) + links + html.slice(at));
  return `${index}: เพิ่มฟอนต์ ${family} จาก Google Fonts`;
}
