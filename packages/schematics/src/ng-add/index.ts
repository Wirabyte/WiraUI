import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { posix } from 'path';
import { FONTS, MajorVersion, normalize, themeConfig, toCSS, toSCSS, VERSION_CATALOG } from '../core';
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

const GENERATOR = 'ng add @wirabyte/ui';

/** Theme names teams know from the theme sets they used before, so a familiar `--theme` still finds WiraUI's own. */
const FAMILIAR_THEME_NAMES: [RegExp, string][] = [
  [/^lara-(light|dark)-/, 'sila-$1-'],
  [/^saga-/, 'arun-'],
  [/^vela-/, 'sayan-'],
  [/^arya-/, 'ratri-'],
  [/^aura$/, 'mali'],
  [/^lara$/, 'sila'],
  [/^nora$/, 'phet'],
];

function ownThemeName(name: string): string {
  const n = name.trim().toLowerCase();
  for (const [from, to] of FAMILIAR_THEME_NAMES) if (from.test(n)) return n.replace(from, to);
  return n;
}

const OVERRIDES_TEMPLATE = `// WiraUI · wiraui.overrides.ts
// Values here win over the main theme file through @layer wiraui.overrides, no !important needed.
import { defineOverrides } from '@wirabyte/ui/config';

export const wiraOverrides = defineOverrides({
  // semantic: { radius: '8px', density: 'compact' },
  // components: { card: { bodyGap: '0px' }, button: { radius: '999px' } },
});
`;

export function ngAdd(options: NgAddOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const log = context.logger;
    assertAngularVersion(tree, options.angularRange || ownAngularRange(), options.releaseVersion || ownVersion());

    const project = getProject(tree, options.project);
    let style = options.style === 'auto' ? detectStyle(project) : options.style;
    const scssEntry = project.styles.find((s) => /\.(scss|sass)$/.test(s));
    if (style === 'scss' && !scssEntry) {
      log.warn('No global .scss file found, using the CSS theme instead.');
      style = 'css';
    }
    const structure = options.structure === 'auto' ? detectStructure(tree, project) : options.structure;
    const fontChoice = options.font === 'auto' || options.font === 'none' ? undefined : options.font;
    // The version lock above guarantees the project's Angular matches this wiraui major.
    const major = (wiraUIMajorFor(angularMajor(tree) ?? 21) ?? 3) as MajorVersion;
    const catalog = VERSION_CATALOG[major];
    const themeName = !options.theme || options.theme === 'auto' ? catalog.defaultTheme : ownThemeName(options.theme);
    if (!catalog.themes.includes(themeName)) {
      throw new SchematicsException(`@wirabyte/ui@${major} has no theme "${themeName}"; choose one of: ${catalog.themes.join(', ')}`);
    }
    const base = themeConfig(themeName);
    const config = normalize({
      ...base,
      primary: options.primary ? options.primary.trim() : base.primary,
      fontFamily: fontChoice,
      darkMode: options.darkMode,
    });
    if (options.primary && config.primary !== options.primary.trim().toLowerCase()) {
      log.warn(`"${options.primary}" is not a hex colour; using the preset's colour.`);
    }

    const themeDir = `${project.sourceRoot}/theme`;
    const done: string[] = [];
    if (style === 'scss') {
      done.push(writeIfMissing(tree, `${themeDir}/wiraui.theme.scss`, toSCSS(config, { generator: GENERATOR }), log));
      done.push(addScssUse(tree, scssEntry as string, `${themeDir}/wiraui.theme`));
    } else {
      done.push(writeIfMissing(tree, `${themeDir}/wiraui.theme.css`, toCSS(config, { generator: GENERATOR }), log));
      addGlobalStyle(tree, project.name, `${themeDir}/wiraui.theme.css`);
      done.push(`angular.json: added ${themeDir}/wiraui.theme.css to styles`);
    }
    done.push(writeIfMissing(tree, `${themeDir}/wiraui.overrides.ts`, OVERRIDES_TEMPLATE, log));
    if (options.utils !== false) {
      if (style === 'scss') {
        done.push(addScssUtils(tree, scssEntry as string));
      } else {
        addGlobalStyle(tree, project.name, UTILS_CSS);
        done.push(`angular.json: added ${UTILS_CSS} to styles`);
      }
    }

    const [locale, calendar] =
      options.locale === 'en' ? ['en', 'gregorian'] : options.locale === 'th-gregorian' ? ['th', 'gregorian'] : ['th', 'buddhist'];
    // --font=none: the app brings its own font files, so the theme must not fetch any from Google either.
    const fonts = options.font === 'none' ? ", fonts: 'none'" : '';
    const provider = `provideWiraUI({ overrides: wiraOverrides, locale: '${locale}', calendar: '${calendar}', darkMode: '${options.darkMode}'${fonts} })`;
    done.push(structure === 'module' ? addToModule(tree, project, themeDir, provider) : addToStandalone(tree, project, themeDir, provider));

    if (options.font !== 'none') done.push(addFont(tree, project, fontChoice || config.fontFamily));

    log.info('');
    log.info(`WiraUI: ${style === 'scss' ? 'SCSS' : 'CSS'} · ${structure === 'module' ? 'NgModule' : 'Standalone'} · ${themeName} · ${config.primary}`);
    for (const line of done.filter(Boolean)) log.info('  ✔ ' + line);
    if (options.utils !== false && hasDependency(tree, 'primeflex')) {
      log.info(
        '  ℹ WiraUI utilities use the same class names as the utility library already installed, so you can remove it when ready.'
      );
    }
    if (hasDependency(tree, 'primeng')) {
      log.info(
        '  ℹ An existing UI library was found: both can run side by side while you migrate, and WiraUI components also carry the p-* classes your CSS targets.'
      );
    }
    log.info('Next: import WuButtonModule (NgModule) or WuButton (standalone) from @wirabyte/ui/button, then use <wu-button label="Save"></wu-button>');
  };
}

// ---------- version lock ----------

function ownAngularRange(): string | undefined {
  try {
    // node_modules/@wirabyte/ui/schematics/ng-add/index.js → node_modules/@wirabyte/ui/package.json
    return require('../../package.json').peerDependencies['@angular/core'];
  } catch (e) {
    return undefined;
  }
}

function ownVersion(): string | undefined {
  try {
    return require('../../package.json').version;
  } catch (e) {
    return undefined;
  }
}

/** `@wirabyte/ui@2`, or the dist-tag on a prerelease (tools/publish.mjs): a range such as `@2` never matches a prerelease. */
function installSpec(major: number, version: string | undefined): string {
  const pre = /^\d+\.\d+\.\d+-([a-z]+)/.exec(version || '');
  if (!pre) return `@wirabyte/ui@${major}`;
  return `@wirabyte/ui@${major === 3 ? '' : `v${major}-`}${pre[1]}`;
}

function wiraUIMajorFor(angular: number): number | null {
  if (angular >= 21) return 3;
  if (angular >= 18) return 2;
  if (angular >= 15) return 1;
  return null;
}

function assertAngularVersion(tree: Tree, range: string | undefined, version: string | undefined): void {
  if (!range) return;
  const m = />=\s*(\d+)[^<]*(?:<\s*(\d+))?/.exec(range);
  const major = angularMajor(tree);
  if (!m || major === null) return;
  const min = parseInt(m[1], 10);
  const max = m[2] ? parseInt(m[2], 10) : null;
  if (major >= min && (max === null || major < max)) return;
  const fit = wiraUIMajorFor(major);
  const span = max === null ? `${min}+` : `${min}–${max - 1}`;
  throw new SchematicsException(
    `This @wirabyte/ui release supports Angular ${span}; this project uses Angular ${major}.` +
      (fit ? ` Use: ng add ${installSpec(fit, version)}` : ' No @wirabyte/ui release supports this Angular version.')
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
  if (!buf) throw new SchematicsException(`${path} not found`);
  return buf.toString('utf8');
}

function detectStructure(tree: Tree, p: ProjectInfo): 'module' | 'standalone' {
  if (!p.main) throw new SchematicsException('main.ts not found in angular.json; pass --structure.');
  return /bootstrapApplication\s*\(/.test(readText(tree, p.main)) ? 'standalone' : 'module';
}

// ---------- edits ----------

function writeIfMissing(tree: Tree, path: string, content: string, log: SchematicContext['logger']): string {
  if (tree.exists(path)) {
    log.warn(`${path} exists, left unchanged.`);
    return '';
  }
  tree.create(path, content);
  return `created ${path}`;
}

function addScssUse(tree: Tree, stylesFile: string, themeModule: string): string {
  const text = readText(tree, stylesFile);
  if (text.includes('wiraui.theme')) return '';
  // Sass resolves a plain path like 'theme/wiraui.theme' relative to the importing file.
  const rel = posix.relative(posix.dirname(stylesFile), themeModule);
  const line = stylesFile.endsWith('.sass') ? `@use '${rel}'\n` : `@use '${rel}';\n`;
  tree.overwrite(stylesFile, line + text);
  return `${stylesFile}: added @use '${rel}'`;
}

const UTILS_CSS = 'node_modules/@wirabyte/ui/utils/utils.css';

/** `@use '@wirabyte/ui/utils';` right under the theme's @use (both must come before any @import or rule). */
function addScssUtils(tree: Tree, stylesFile: string): string {
  const text = readText(tree, stylesFile);
  if (text.includes('@wirabyte/ui/utils')) return '';
  const line = stylesFile.endsWith('.sass') ? `@use '@wirabyte/ui/utils'` : `@use '@wirabyte/ui/utils';`;
  const lines = text.split('\n');
  const at = lines.findIndex((l) => l.includes('wiraui.theme'));
  lines.splice(at + 1, 0, line);
  tree.overwrite(stylesFile, lines.join('\n'));
  return `${stylesFile}: added ${line}`;
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
  if (!boot) throw new SchematicsException('bootstrapModule(...) not found in main.ts; use --structure=standalone or add the provider by hand.');
  const file = resolveTs(p.main as string, boot.from);
  const text = readText(tree, file);
  if (text.includes('provideWiraUI(')) return `${file}: provideWiraUI() already there`;
  const sf = parse(file, text);
  const obj = findNgModuleObject(sf, boot.name);
  if (!obj) throw new SchematicsException(`@NgModule for ${boot.name} not found in ${file}`);
  apply(tree, file, [
    importEdit(sf, 'provideWiraUI', '@wirabyte/ui/config'),
    importEdit(sf, 'wiraOverrides', relImport(file, `${themeDir}/wiraui.overrides`)),
    providersEdit(obj, provider),
  ]);
  return `${file}: added provideWiraUI() to the providers of ${boot.name}`;
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
    if (!from) throw new SchematicsException(`Could not find where ${opts.text} comes from`);
    file = resolveTs(main, from);
    sf = parse(file, readText(tree, file));
    obj = findConfigObject(sf, opts.text);
  } else if (opts && ts.isObjectLiteralExpression(opts)) {
    obj = opts;
  }
  if (readText(tree, file).includes('provideWiraUI(')) return `${file}: provideWiraUI() already there`;
  if (!obj) throw new SchematicsException('ApplicationConfig not found; add provideWiraUI() to its providers by hand.');
  apply(tree, file, [
    importEdit(sf, 'provideWiraUI', '@wirabyte/ui/config'),
    importEdit(sf, 'wiraOverrides', relImport(file, `${themeDir}/wiraui.overrides`)),
    providersEdit(obj, provider),
  ]);
  return `${file}: added provideWiraUI() to providers`;
}

function addFont(tree: Tree, p: ProjectInfo, family: string): string {
  const index = `${p.sourceRoot}/index.html`;
  if (!tree.exists(index)) return '';
  const haystack = [index, ...p.styles.filter((s) => tree.exists(s))].map((f) => readText(tree, f).toLowerCase()).join('\n');
  if (haystack.includes(family.toLowerCase())) return `font ${family} already loaded, not added again`;
  if (!(FONTS as readonly string[]).includes(family)) return '';
  const html = readText(tree, index);
  const href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
  const links = `  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="stylesheet" href="${href}">\n`;
  const at = html.toLowerCase().indexOf('</head>');
  if (at < 0) return '';
  tree.overwrite(index, html.slice(0, at) + links + html.slice(at));
  return `${index}: added the ${family} font from Google Fonts`;
}
