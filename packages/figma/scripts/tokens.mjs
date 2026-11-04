// Lists the tokens the kit can use, as the plugin sees them (after scripts/build.mjs): name, type, the value in one
// preset, and whether every preset has it (the smoke test fails on a token any preset lacks).
// Usage: node scripts/tokens.mjs <regex> [preset]      e.g. node scripts/tokens.mjs '^(datepicker|field)-' wira
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { presetsOf } from './mock-figma.mjs';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const code = readFileSync(join(process.env.WU_FIGMA_OUT || join(pkg, 'dist'), 'code.js'), 'utf8');
const [pattern = '.', presetId = 'wira'] = process.argv.slice(2);
const re = new RegExp(pattern);
const presets = presetsOf(code);
const p = presets.find((x) => x.id === presetId) || presets[0];
const names = new Set(presets.flatMap((x) => Object.keys(x.light)).filter((n) => re.test(n)));
const show = (t) => {
  if (!t) return '—';
  if (t.t === 'color') return `rgba(${t.v.slice(0, 3).map((n) => Math.round(n * 255)).join(', ')}, ${t.v[3]})`;
  if (t.t === 'shadow') return t.v.map((l) => `${l.inset ? 'inset ' : ''}${l.x} ${l.y} ${l.blur} ${l.spread}`).join(', ');
  return String(t.v);
};
for (const n of [...names].sort()) {
  const t = p.light[n];
  const everywhere = presets.every((x) => x.light[n]);
  const kind = t ? t.t : presets.find((x) => x.light[n]).light[n].t;
  console.log(`${everywhere ? ' ' : '!'} ${n.padEnd(44)} ${kind.padEnd(7)} ${show(t).padEnd(28)} dark: ${show(p.dark[n])}`);
}
console.log(`${names.size} tokens; "!" = missing in some preset (do not use those). Preset shown: ${p.id}.`);
