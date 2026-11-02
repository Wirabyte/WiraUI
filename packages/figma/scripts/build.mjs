// Builds the WiraUI UI Kit plugin for Figma (dist/manifest.json, dist/code.js, dist/ui.html).
//
// Figma needs plain colours and pixels, while the theme CSS speaks var(), color-mix(), calc() and rem. So each v3
// preset's built theme (packages/angular-v3/dist/themes/<preset>/theme.css) is loaded into Chromium and every
// --wu-* token is read back as the browser computes it, once for light (:root) and once for dark (:root.wu-dark).
// The icons come from wiraicon's built SVGs (packages/icons/dist/svg/regular).
//
// Run `pnpm --filter @wiraui-build/angular-v3 build` and `pnpm build:icons` first.
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = join(here, '..');
const root = join(pkg, '..', '..');
const dist = join(pkg, 'dist');
const require = createRequire(import.meta.url);
const core = require(join(root, 'packages', 'core', 'dist', 'cjs', 'index.js'));
const ts = require('typescript');
// Playwright lives in the e2e workspace; borrow it from there.
const { chromium } = createRequire(join(root, 'e2e', 'package.json'))('@playwright/test');

const themesDir = join(root, 'packages', 'angular-v3', 'dist', 'themes');
const iconsDir = join(root, 'packages', 'icons', 'dist', 'svg', 'regular');
for (const need of [themesDir, iconsDir]) if (!existsSync(need)) throw new Error(`Missing ${need}: build it first (see the header of this script).`);

const catalog = core.VERSION_CATALOG[3];

// Colours the CSS mixes on the fly (color-mix with a percentage token), computed here so Figma gets them as plain
// colours: the outlined border and hover tint of each button colour, the tag fills, the message borders.
const SEVERITIES = ['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'help', 'contrast'];
const tone = (s) => (s === 'primary' ? 'var(--wu-primary-color)' : s === 'secondary' ? 'var(--wu-button-secondary-tone)' : s === 'contrast' ? 'var(--wu-text)' : `var(--wu-${s}-color)`);
const tagParts = (s) =>
  s === 'primary'
    ? ['var(--wu-primary-color)', 'var(--wu-primary-contrast)', 'var(--wu-primary-soft)', 'var(--wu-primary-soft-text)']
    : s === 'secondary'
      ? ['var(--wu-button-secondary-bg)', 'var(--wu-button-secondary-color)', 'var(--wu-chip-bg)', 'var(--wu-chip-color)']
      : s === 'contrast'
        ? ['var(--wu-text)', 'var(--wu-card-bg)', 'var(--wu-text)', 'var(--wu-card-bg)']
        : [`var(--wu-${s}-color)`, `var(--wu-${s}-contrast)`, `var(--wu-${s}-bg)`, `var(--wu-${s}-text)`];
const DERIVED = {};
for (const s of SEVERITIES) {
  DERIVED[`kit-button-${s}-outlined-border`] = `color-mix(in srgb, ${tone(s)} var(--wu-button-outlined-border-mix), transparent)`;
  DERIVED[`kit-button-${s}-tint`] = `color-mix(in srgb, ${tone(s)} var(--wu-button-tint), transparent)`;
  DERIVED[`kit-button-${s}-tone`] = tone(s);
  const [solid, onSolid, soft, onSoft] = tagParts(s);
  DERIVED[`kit-tag-${s}-bg`] = `color-mix(in srgb, ${solid} var(--wu-tag-fill), ${soft})`;
  DERIVED[`kit-tag-${s}-color`] = `color-mix(in srgb, ${onSolid} var(--wu-tag-fill), ${onSoft})`;
}
for (const s of ['success', 'info', 'warn', 'danger', 'help']) DERIVED[`kit-message-${s}-border`] = `color-mix(in srgb, var(--wu-${s}-color) 40%, transparent)`;
const presets = catalog.presets;

/** Runs in the page: every --wu-* token of the loaded theme, as concrete values, for the current root class. */
function readTokens({ names, derived }) {
  const probe = document.getElementById('probe');
  const rootStyle = getComputedStyle(document.documentElement);
  const parseColor = (text) => {
    let m = /^rgba?\(([^)]+)\)$/.exec(text);
    if (m) {
      const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
      return [p[0] / 255, p[1] / 255, p[2] / 255, p.length > 3 ? p[3] : 1];
    }
    m = /^color\(srgb ([^)]+)\)$/.exec(text);
    if (m) {
      const p = m[1].split(/[\s/]+/).filter(Boolean).map(Number);
      return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
    }
    return null;
  };
  const splitTop = (text) => {
    const out = [];
    let depth = 0;
    let cur = '';
    for (const ch of text) {
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === ',' && depth === 0) {
        out.push(cur.trim());
        cur = '';
      } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  };
  const out = {};
  for (const name of names) {
    const raw = rootStyle.getPropertyValue(`--wu-${name}`).trim();
    if (!raw) continue;
    // Colours
    if (CSS.supports('color', raw)) {
      probe.style.color = raw;
      const c = parseColor(getComputedStyle(probe).color);
      if (c) {
        out[name] = { t: 'color', v: c.map((n) => Math.round(n * 10000) / 10000) };
        continue;
      }
    }
    // Bare numbers (weights, line heights, density, opacity)
    if (/^-?\d*\.?\d+$/.test(raw)) {
      out[name] = { t: 'number', v: Number(raw) };
      continue;
    }
    // Lengths (px, rem, calc); percentages are left out, they mean nothing without a box
    if (!raw.includes('%') && CSS.supports('width', raw)) {
      probe.style.width = '';
      probe.style.width = raw;
      const px = parseFloat(getComputedStyle(probe).width);
      if (Number.isFinite(px)) {
        out[name] = { t: 'length', v: Math.round(px * 100) / 100 };
        continue;
      }
    }
    // Shadows
    if (raw !== 'none' && CSS.supports('box-shadow', raw) && /\d/.test(raw)) {
      probe.style.boxShadow = raw;
      const layers = splitTop(getComputedStyle(probe).boxShadow).map((layer) => {
        const inset = /\binset\b/.test(layer);
        const colorText = (/(rgba?\([^)]*\)|color\([^)]*\))/.exec(layer) || [])[1] || 'rgba(0, 0, 0, 0.1)';
        const nums = layer.replace(colorText, '').replace('inset', '').trim().split(/\s+/).map(parseFloat);
        return { inset, color: parseColor(colorText), x: nums[0] || 0, y: nums[1] || 0, blur: nums[2] || 0, spread: nums[3] || 0 };
      });
      out[name] = { t: 'shadow', v: layers };
      continue;
    }
    // Frosted glass: the blur of a backdrop-filter, as a length the plugin turns into a background blur
    if (/backdrop$/.test(name) && /blur\(/.test(raw)) {
      probe.style.backdropFilter = raw;
      const m = /blur\(([\d.]+)px\)/.exec(getComputedStyle(probe).backdropFilter || '') || /blur\(([\d.]+)px\)/.exec(raw);
      if (m) out[`kit-${name}-blur`] = { t: 'length', v: Number(m[1]) };
      continue;
    }
    // Font families
    if (/family/.test(name)) out[name] = { t: 'font', v: raw.split(',')[0].trim().replace(/^['"]|['"]$/g, '') };
  }
  for (const [name, expr] of Object.entries(derived)) {
    probe.style.color = '';
    probe.style.color = expr;
    const c = parseColor(getComputedStyle(probe).color);
    if (c) out[name] = { t: 'color', v: c.map((n) => Math.round(n * 10000) / 10000) };
  }
  return out;
}

const browser = await chromium.launch();
const page = await browser.newPage();
const data = { generated: new Date().toISOString(), version: 3, defaultPreset: catalog.defaultPreset, presets: [] };
for (const id of presets) {
  const css = readFileSync(join(themesDir, id, 'theme.css'), 'utf8');
  const names = [...new Set([...css.matchAll(/--wu-([a-z0-9-]+)\s*:/g)].map((m) => m[1]))];
  await page.setContent(`<!doctype html><html><head><style>${css}</style></head><body><div id="probe"></div></body></html>`);
  const light = await page.evaluate(readTokens, { names, derived: DERIVED });
  await page.evaluate(() => document.documentElement.classList.add('wu-dark'));
  const dark = await page.evaluate(readTokens, { names, derived: DERIVED });
  const config = core.defaults(id);
  data.presets.push({ id, label: core.PRESET_NAMES[id] || id, fontFamily: config.fontFamily, fontSize: config.fontSize, lineHeight: config.lineHeight, scheme: config.scheme, light, dark });
  console.log(`${id}: ${Object.keys(light).length} tokens (${Object.values(light).filter((t) => t.t === 'color').length} colours)`);
}
await browser.close();

// Icons: the regular weight, as SVG text, by name.
data.icons = readdirSync(iconsDir)
  .filter((f) => f.endsWith('.svg'))
  .sort()
  .map((f) => [f.replace(/\.svg$/, ''), readFileSync(join(iconsDir, f), 'utf8').trim()]);
console.log(`icons: ${data.icons.length}`);

mkdirSync(dist, { recursive: true });
const code = ts.transpileModule(readFileSync(join(pkg, 'src', 'code.ts'), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.None, removeComments: false },
}).outputText;
writeFileSync(join(dist, 'code.js'), `// Generated by packages/figma/scripts/build.mjs: do not edit.\nvar WU_DATA = ${JSON.stringify(data)};\n${code}`);
const ui = readFileSync(join(pkg, 'src', 'ui.html'), 'utf8').replace(
  '/*PRESETS*/[]',
  JSON.stringify(data.presets.map((p) => ({ id: p.id, label: p.label, font: p.fontFamily, primary: p.light['primary-color']?.v, isDefault: p.id === data.defaultPreset }))),
);
writeFileSync(join(dist, 'ui.html'), ui);
// The same tokens as W3C Design Tokens (DTCG) files, one per preset and mode, for tools that read that format.
const hex = (c) => '#' + c.map((n, i) => (i < 3 || n < 1 ? Math.round(n * 255).toString(16).padStart(2, '0') : '')).join('');
const groupOf = (name) => {
  const pal = /^(primary|surface|success|info|warn|danger|help)-(\d+)$/.exec(name);
  if (pal) return ['palette', pal[1], pal[2]];
  const i = name.indexOf('-');
  return i < 0 ? ['base', name] : [name.slice(0, i), name.slice(i + 1)];
};
mkdirSync(join(dist, 'tokens'), { recursive: true });
for (const p of data.presets)
  for (const mode of ['light', 'dark']) {
    const doc = { $description: `WiraUI ${p.label} (${mode}): the --wu-* tokens as the browser computes them.` };
    for (const [name, t] of Object.entries(p[mode])) {
      if (name.startsWith('kit-')) continue;
      const token =
        t.t === 'color'
          ? { $type: 'color', $value: hex(t.v) }
          : t.t === 'length'
            ? { $type: 'dimension', $value: `${t.v}px` }
            : t.t === 'number'
              ? { $type: 'number', $value: t.v }
              : t.t === 'font'
                ? { $type: 'fontFamily', $value: t.v }
                : { $type: 'shadow', $value: t.v.map((l) => ({ color: hex(l.color || [0, 0, 0, 0.1]), offsetX: `${l.x}px`, offsetY: `${l.y}px`, blur: `${l.blur}px`, spread: `${l.spread}px`, inset: l.inset })) };
      let node = doc;
      const path = groupOf(name);
      for (const seg of path.slice(0, -1)) node = node[seg] ??= {};
      node[path[path.length - 1]] = { ...token, $extensions: { 'com.wiraui': { css: `--wu-${name}` } } };
    }
    writeFileSync(join(dist, 'tokens', `${p.id}.${mode}.json`), JSON.stringify(doc, null, 2) + '\n');
  }
console.log(`dist/tokens: ${data.presets.length * 2} DTCG files`);

const manifest = JSON.parse(readFileSync(join(pkg, 'manifest.json'), 'utf8'));
manifest.main = 'code.js';
manifest.ui = 'ui.html';
writeFileSync(join(dist, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`dist/code.js ${(readFileSync(join(dist, 'code.js')).length / 1024).toFixed(0)} KB`);
