import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { ENTRY_RENAMES, NOT_YET, SYMBOLS, WT_MODULES, WT_TAGS, wtName } from './mapping';
import { FromPrimeNgOptions } from './schema';

interface Report {
  files: number;
  imports: number;
  tags: number;
  /** Things left for a person: `file: what`. */
  todo: string[];
}

const PRIMENG_IMPORT = /^primeng\/([a-z]+)$/;

/**
 * `ng g wiratheme:from-primeng`: moves an app's PrimeNG code over in place. TypeScript imports from `primeng/*` become
 * `wiratheme/*` (NgModules and classes renamed: `DropdownModule` → `WtSelectModule`, `Table` → `WtTable`; the services
 * keep their names), and `<p-…>` tags in templates (`.html` files and inline `template:`) become `<wt-…>` where WiraTheme
 * has them. PrimeNG attributes (`pButton`, `pTemplate`, `pTooltip` …) and `p-*` classes stay: WiraTheme reads them.
 * Anything it cannot move is left untouched and listed. Run with `--dry-run` first to see the changes.
 */
export function fromPrimeng(options: FromPrimeNgOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const root = (options.path || '/').replace(/\\/g, '/');
    const report: Report = { files: 0, imports: 0, tags: 0, todo: [] };
    tree.getDir(root).visit((path) => {
      if (/\/(node_modules|dist|\.angular|\.git)\//.test(path)) return;
      if (path.endsWith('.ts') && !path.endsWith('.d.ts')) migrateTs(tree, path, report, options);
      else if (path.endsWith('.html') && options.templates !== false) migrateHtml(tree, path, report);
    });
    const log = context.logger;
    log.info('');
    log.info(`WiraTheme from PrimeNG: ${report.files} file(s), ${report.imports} import(s), ${report.tags} tag(s) changed.`);
    if (report.todo.length) {
      log.warn(`Left for you (${report.todo.length}):`);
      for (const t of report.todo) log.warn('  ' + t);
    }
    log.info('Next: ng add wiratheme (if not done), then remove primeng and its theme CSS from package.json / angular.json when nothing uses them.');
    return tree;
  };
}

// ---------------------------------------------------------------- TypeScript

interface Edit {
  start: number;
  end: number;
  text: string;
}

function apply(text: string, edits: Edit[]): string {
  let out = text;
  for (const e of [...edits].sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return out;
}

function migrateTs(tree: Tree, path: string, report: Report, options: FromPrimeNgOptions): void {
  const buffer = tree.read(path);
  if (!buffer) return;
  const text = buffer.toString('utf8');
  if (!text.includes('primeng') && !(options.templates !== false && /template\s*:/.test(text) && /<p-[a-zA-Z]/.test(text))) return;
  const sf = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const edits: Edit[] = [];
  /** Local names renamed by this file's imports, to rename where they are used. */
  const renamed = new Map<string, string>();
  let changedImports = 0;

  for (const stmt of sf.statements) {
    if (!ts.isImportDeclaration(stmt) || !ts.isStringLiteral(stmt.moduleSpecifier)) continue;
    const m = PRIMENG_IMPORT.exec(stmt.moduleSpecifier.text);
    if (!m) continue;
    const entry = m[1];
    const named = stmt.importClause?.namedBindings;
    if (!named || !ts.isNamedImports(named) || stmt.importClause?.name) {
      report.todo.push(`${path}: import from 'primeng/${entry}' (not named imports)`);
      continue;
    }
    // Each name goes to its WiraTheme entry; one import line per entry, in place of this one.
    const byEntry = new Map<string, string[]>();
    const left: string[] = [];
    for (const el of named.elements) {
      const imported = (el.propertyName || el.name).text;
      const local = el.name.text;
      const target = mapSymbol(entry, imported);
      if (!target) {
        left.push(el.getText(sf));
        report.todo.push(`${path}: ${imported} from 'primeng/${entry}' has no WiraTheme counterpart`);
        continue;
      }
      const [name, wtEntry] = target;
      const spec = el.propertyName ? `${name} as ${local}` : name;
      if (!el.propertyName && name !== imported) renamed.set(local, name);
      const list = byEntry.get(wtEntry) || [];
      list.push((el.isTypeOnly ? 'type ' : '') + spec);
      byEntry.set(wtEntry, list);
    }
    if (!byEntry.size) continue;
    const typeOnly = stmt.importClause?.isTypeOnly ? 'type ' : '';
    const lines = [...byEntry].map(([e, names]) => `import ${typeOnly}{ ${names.join(', ')} } from 'wiratheme/${e}';`);
    if (left.length) lines.push(`import ${typeOnly}{ ${left.join(', ')} } from 'primeng/${entry}';`);
    edits.push({ start: stmt.getStart(sf), end: stmt.getEnd(), text: lines.join('\n') });
    changedImports += byEntry.size;
  }

  // Uses of renamed names: identifiers that are not property names of something else.
  if (renamed.size) {
    const visit = (node: ts.Node): void => {
      if (ts.isImportDeclaration(node)) return;
      if (ts.isIdentifier(node) && renamed.has(node.text)) {
        const parent = node.parent;
        const isMember = parent && ts.isPropertyAccessExpression(parent) && parent.name === node;
        const isKey = parent && (ts.isPropertyAssignment(parent) || ts.isPropertyDeclaration(parent) || ts.isMethodDeclaration(parent)) && parent.name === node;
        if (!isMember && !isKey) edits.push({ start: node.getStart(sf), end: node.getEnd(), text: renamed.get(node.text)! });
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }

  // Inline templates.
  let tags = 0;
  if (options.templates !== false) {
    const visit = (node: ts.Node): void => {
      if (
        ts.isPropertyAssignment(node) &&
        ts.isIdentifier(node.name) &&
        node.name.text === 'template' &&
        (ts.isNoSubstitutionTemplateLiteral(node.initializer) || ts.isStringLiteral(node.initializer))
      ) {
        const lit = node.initializer;
        const start = lit.getStart(sf) + 1;
        const end = lit.getEnd() - 1;
        const result = migrateTemplate(text.slice(start, end), path, report);
        if (result.count) {
          edits.push({ start, end, text: result.text });
          tags += result.count;
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }

  if (!edits.length) return;
  tree.overwrite(path, apply(text, edits));
  report.files++;
  report.imports += changedImports;
  report.tags += tags;
}

/** The WiraTheme name and entry of a name imported from `primeng/<entry>`, or null. */
function mapSymbol(entry: string, name: string): [string, string] | null {
  const known = (SYMBOLS[entry] || []).find(([prime]) => prime === name);
  if (known) return [known[1], known[2]];
  if (name.endsWith('Module')) {
    const wtEntry = ENTRY_RENAMES[entry] || entry;
    const wt = wtName(name);
    if (WT_MODULES[wtEntry]?.includes(wt)) return [wt, wtEntry];
  }
  return null;
}

// ---------------------------------------------------------------- templates

function migrateHtml(tree: Tree, path: string, report: Report): void {
  const buffer = tree.read(path);
  if (!buffer) return;
  const text = buffer.toString('utf8');
  if (!/<\/?p-[a-zA-Z]/.test(text)) return;
  const result = migrateTemplate(text, path, report);
  if (!result.count) return;
  tree.overwrite(path, result.text);
  report.files++;
  report.tags += result.count;
}

/** `<p-x …>` / `</p-x>` → `<wt-x …>` / `</wt-x>` where WiraTheme has `wt-x`; the rest is listed. */
export function migrateTemplate(text: string, path: string, report: Report): { text: string; count: number } {
  let count = 0;
  const missing = new Set<string>();
  const out = text.replace(/<(\/?)p-([a-zA-Z][\w-]*)(?=[\s/>])/g, (whole, slash: string, name: string) => {
    if (WT_TAGS.has(name)) {
      if (!slash) count++;
      return `<${slash}wt-${name}`;
    }
    missing.add(`p-${name}`);
    return whole;
  });
  for (const tag of missing) {
    const why = NOT_YET.some((n) => n.toLowerCase() === tag.slice(2).toLowerCase()) ? 'not in WiraTheme yet' : 'no WiraTheme tag';
    report.todo.push(`${path}: <${tag}> (${why})`);
  }
  return { text: out, count };
}
