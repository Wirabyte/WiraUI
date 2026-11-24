// Checks skills/wiraui (the Claude Code skill that ships in @wirabyte/ui) against the source, so the skill cannot
// name something the library does not have (DESIGN.md §12.30). It fails when:
//   - a `wu-*` tag or class, a `Wu*` symbol, a `--wu-*` token or an `@wirabyte/ui/<entry>` import is not in the source
//   - a relative link points at no file, or a reference file is not listed in SKILL.md
//   - SKILL.md lost its frontmatter or the version text the schematic stamps
//   - the previous UI library is named outside references/migration.md (DESIGN.md §12.27)
// It does not check behaviour (defaults, input types): read the reference file again when a component changes.
// Usage: node tools/check-skill.mjs
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skill = join(root, 'skills', 'wiraui');
const pkg = (...p) => join(root, 'packages', ...p);

/** Must match SKILL_VERSION_PLACEHOLDER in packages/schematics/src/utils/claude-skill.ts. */
const VERSION_PLACEHOLDER = '@wirabyte/ui 0.0.0';
/** Placeholders the skill uses when it explains a naming pattern. */
const PLACEHOLDER_SYMBOLS = new Set(['WuXxx', 'WuXxxModule']);
/** Entry points tools/sync-sources.mjs assembles from somewhere other than a component folder. */
const BUILT_ENTRIES = ['core', 'theme', 'themes', 'utils'];
const SKIP_DIRS = new Set(['node_modules', 'dist', 'lib', 'lib-docs', 'dist-docs', '.angular']);

function walk(dir, exts, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(p, exts, out);
    } else if (exts.some((e) => name.endsWith(e))) out.push(p);
  }
  return out;
}

// Where each major's components, styles, tokens and schematics are written (tools/sync-sources.mjs).
const SOURCE_DIRS = [
  pkg('angular-common'),
  pkg('angular-signal'),
  pkg('angular-v1', 'src'),
  pkg('angular-v2', 'overlay'),
  pkg('angular-v3', 'overlay'),
  pkg('core', 'src'),
  pkg('styles'),
  pkg('themes'),
  pkg('schematics', 'src'),
  pkg('icons'),
];
const source = SOURCE_DIRS.flatMap((d) => walk(d, ['.ts', '.scss', '.css', '.html', '.json', '.mjs']))
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');
// Words of the source, so a name is found whole: `wu-table` must not pass because `wu-tables` exists.
const sourceWords = new Set(source.match(/[A-Za-z0-9_-]+/g));
// Component tokens are written in camelCase (`card.bodyGap`) and become `--wu-card-body-gap` in the built CSS.
const kebab = (s) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
const sourceKebab = new Set([...sourceWords].map(kebab));

const entries = new Set(BUILT_ENTRIES);
for (const d of SOURCE_DIRS.slice(0, 5)) {
  if (existsSync(d)) for (const name of readdirSync(d)) if (statSync(join(d, name)).isDirectory()) entries.add(name);
}

const files = walk(skill, ['.md']);
const rel = (f) => relative(skill, f).replace(/\\/g, '/');
const problems = [];
const report = (file, what) => problems.push(`${file}: ${what}`);
const uniq = (text, re) => [...new Set(text.match(re) || [])];

function tokenKnown(token) {
  if (sourceWords.has(token)) return true;
  // `--wu-card-body-gap` = component `card` + token `bodyGap`: accept when every part after the prefix is a source word.
  const parts = token.slice('--wu-'.length);
  for (let i = parts.indexOf('-'); i > 0; i = parts.indexOf('-', i + 1)) {
    if (sourceKebab.has(parts.slice(0, i)) && sourceKebab.has(parts.slice(i + 1))) return true;
  }
  return sourceKebab.has(parts);
}

const skillMd = readFileSync(join(skill, 'SKILL.md'), 'utf8');
// The index names a component as `InputText` and its file is the entry, `inputtext.md`.
const index = skillMd.toLowerCase().replace(/[^a-z0-9]/g, '');
if (!/^---\nname: wiraui\ndescription: .+\n---\n/.test(skillMd.replace(/\r\n/g, '\n'))) report('SKILL.md', 'frontmatter must start with name: wiraui and a one-line description');
if (!skillMd.includes(VERSION_PLACEHOLDER)) report('SKILL.md', `must contain "${VERSION_PLACEHOLDER}" for the schematic to stamp`);

for (const file of files) {
  const name = rel(file);
  const text = readFileSync(file, 'utf8');

  for (const entry of uniq(text, /@wirabyte\/ui\/[a-z0-9-]+/g).map((m) => m.slice('@wirabyte/ui/'.length))) {
    if (!entries.has(entry)) report(name, `@wirabyte/ui/${entry} is not an entry point`);
  }
  for (const tag of uniq(text, /(?<![\w-])wu-[a-zA-Z][\w-]*/g)) {
    const word = tag.replace(/-+$/, '');
    if (!sourceWords.has(word)) report(name, `${word} is not in the source`);
  }
  for (const symbol of uniq(text, /\bWu[A-Z]\w+/g)) {
    if (!PLACEHOLDER_SYMBOLS.has(symbol) && !sourceWords.has(symbol)) report(name, `${symbol} is not in the source`);
  }
  for (const token of uniq(text, /--wu-[a-z0-9-]+/g).map((t) => t.replace(/-+$/, ''))) {
    if (token !== '--wu' && !tokenKnown(token)) report(name, `${token} is not a token in the source`);
  }
  for (const m of text.matchAll(/\]\(([^)#\s]+\.md)(?:#[^)]*)?\)/g)) {
    if (!/^[a-z]+:/.test(m[1]) && !existsSync(join(dirname(file), m[1]))) report(name, `link to ${m[1]} points at no file`);
  }
  if (name !== 'references/migration.md') {
    const named = text.replace(/from-primeng/g, '').match(/prime\s?(ng|flex)/i);
    if (named) report(name, `names the previous UI library ("${named[0]}"); only references/migration.md may (DESIGN.md §12.27)`);
  }
  if (name.startsWith('references/')) {
    const base = name.split('/').pop();
    if (base !== '_shared.md' && !index.includes(base.replace(/\.md$/, '').replace(/[^a-z0-9]/g, ''))) {
      report(name, 'is not listed in the SKILL.md component index');
    }
  }
}

if (problems.length) {
  console.error(`skills/wiraui: ${problems.length} problem(s)`);
  for (const p of problems) console.error('  ✘ ' + p);
  process.exit(1);
}
console.log(`skills/wiraui: ${files.length} files agree with the source (${entries.size} entry points checked)`);
