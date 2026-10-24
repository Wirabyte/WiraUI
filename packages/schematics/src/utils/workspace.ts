import { SchematicsException, Tree } from '@angular-devkit/schematics';

/* angular.json read and written as plain JSON so the same code runs in every CLI from 15 up. */

export interface ProjectInfo {
  name: string;
  root: string;
  sourceRoot: string;
  main: string | null;
  styles: string[];
  inlineStyleLanguage: string | null;
  componentStyle: string | null;
}

type Json = Record<string, any>;

export function readJson(tree: Tree, path: string): Json {
  const buf = tree.read(path);
  if (!buf) throw new SchematicsException(`ไม่พบ ${path} / ${path} not found`);
  try {
    return JSON.parse(buf.toString('utf8'));
  } catch (e) {
    throw new SchematicsException(`อ่าน ${path} ไม่ได้ / Could not parse ${path}`);
  }
}

function buildTarget(project: Json): Json | null {
  const targets = project.architect || project.targets || {};
  return targets.build || null;
}

export function getProject(tree: Tree, requested?: string): ProjectInfo {
  const ws = readJson(tree, 'angular.json');
  const projects: Json = ws.projects || {};
  const name =
    requested && projects[requested]
      ? requested
      : Object.keys(projects).find((n) => (projects[n].projectType || 'application') === 'application');
  if (!name) throw new SchematicsException('ไม่พบ application ใน angular.json / No application project in angular.json');
  const p = projects[name];
  const root: string = p.root || '';
  const opts: Json = (buildTarget(p) || {}).options || {};
  const styles = (opts.styles || []).map((s: string | Json) => (typeof s === 'string' ? s : s.input)).filter(Boolean);
  const comp = (p.schematics || {})['@schematics/angular:component'] || {};
  return {
    name,
    root,
    sourceRoot: p.sourceRoot || (root ? `${root}/src` : 'src'),
    main: opts.main || opts.browser || null,
    styles,
    inlineStyleLanguage: opts.inlineStyleLanguage || null,
    componentStyle: comp.style || null,
  };
}

/** Puts `stylePath` first in the build (and test) styles of the project. */
export function addGlobalStyle(tree: Tree, projectName: string, stylePath: string): void {
  const ws = readJson(tree, 'angular.json');
  const p = ws.projects[projectName];
  const targets = p.architect || p.targets || {};
  for (const t of ['build', 'test']) {
    const opts = targets[t] && targets[t].options;
    if (!opts) continue;
    const list: (string | Json)[] = opts.styles || (opts.styles = []);
    if (!list.some((s) => (typeof s === 'string' ? s : s.input) === stylePath)) list.unshift(stylePath);
  }
  tree.overwrite('angular.json', JSON.stringify(ws, null, 2) + '\n');
}

/** Major version of @angular/core: the installed one if present, else from package.json. */
export function angularMajor(tree: Tree): number | null {
  const installed = tree.read('node_modules/@angular/core/package.json');
  if (installed) {
    const v = JSON.parse(installed.toString('utf8')).version as string;
    return parseInt(v, 10);
  }
  const pkg = readJson(tree, 'package.json');
  const spec: string | undefined = (pkg.dependencies || {})['@angular/core'] || (pkg.devDependencies || {})['@angular/core'];
  const m = spec && /(\d+)/.exec(spec);
  return m ? parseInt(m[1], 10) : null;
}

export function hasDependency(tree: Tree, name: string): boolean {
  const pkg = readJson(tree, 'package.json');
  return !!((pkg.dependencies || {})[name] || (pkg.devDependencies || {})[name]);
}
