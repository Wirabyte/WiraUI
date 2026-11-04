// Runs dist/code.js against the stand-in Figma API (scripts/mock-figma.mjs), once per preset: every build must finish,
// use only tokens the preset has, and draw every visual entry point of @wirabyte/ui (the coverage check below), so a
// new component cannot be left out of the kit. It cannot judge looks: `pnpm --filter @wiraui-build/figma preview`
// draws the kit as HTML, and the real check is the kit opened in Figma.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { presetsOf, runKit } from './mock-figma.mjs';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const root = join(pkg, '..', '..');
const code = readFileSync(join(process.env.WU_FIGMA_OUT || join(pkg, 'dist'), 'code.js'), 'utf8');

// Entry points with nothing to draw: behaviour, helpers, data and theme plumbing.
const NOT_VISUAL = new Set(['utils', 'core', 'config', 'presets', 'animate', 'api', 'validation', 'ripple', 'keyfilter', 'dragdrop', 'excel', 'thai']);
const exportsOf = JSON.parse(readFileSync(join(root, 'packages', 'angular-v3', 'dist', 'package.json'), 'utf8')).exports;
const entries = Object.keys(exportsOf)
  .filter((k) => /^\.\/[a-z0-9]+$/.test(k) && !k.includes('theme'))
  .map((k) => k.slice(2))
  .filter((e) => !NOT_VISUAL.has(e));

let failed = 0;
let covered = null;
for (const { id: preset } of presetsOf(code)) {
  const { stats, messages, ctx } = await runKit(code, preset);
  const end = messages.find((m) => m.type === 'done' || m.type === 'error');
  const missing = messages.find((m) => m.type === 'progress' && m.text.startsWith('Tokens this preset does not have'));
  const ok = end.type === 'done' && !missing;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${preset.padEnd(9)} ${end.text}  [${stats.nodes} nodes, ${stats.components} components, ${stats.sets} sets, ${stats.instances} instances, ${stats.bound} bindings]${missing ? '\n     ' + missing.text : ''}`);
  covered ??= new Set(vm.runInContext('SECTIONS.flatMap((s) => s.covers)', ctx));
}

const uncovered = entries.filter((e) => !covered.has(e));
const unknown = [...covered].filter((e) => !entries.includes(e));
console.log(`coverage: ${entries.length - uncovered.length}/${entries.length} visual entry points of @wirabyte/ui are in the kit`);
if (uncovered.length) console.error(`  not in the kit: ${uncovered.join(', ')}`);
if (unknown.length) console.error(`  sections claim entries the library does not export: ${unknown.join(', ')}`);
if (failed || uncovered.length || unknown.length) {
  console.error(`${failed} preset(s) failed`);
  process.exit(1);
}
