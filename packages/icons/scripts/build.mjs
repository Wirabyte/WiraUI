// Builds the wiraicon package into packages/icons/dist:
//   wiraicon.css          the `wi wi-<name>` classes (one icon font per weight, loaded only when a weight is used)
//   fonts/*.woff2         one font per weight
//   svg/<weight>/*.svg    every icon as its own file
//   data/<weight>         icon drawings for the <wi-icon> component (one entry per weight, loaded on first use)
//   icons.json            names, aliases, categories and code points, for docs and tools
//   index (TS)            names, aliases and helpers; `@wirabyte/icons/angular` is the <wi-icon> component
// Usage: node scripts/build.mjs            build
//        node scripts/build.mjs --check    only check the icon list against the Phosphor drawings
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { CATEGORIES, ICONS, WEIGHTS } from '../icons.mjs';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const phosphor = join(root, 'node_modules', '@phosphor-icons', 'core');
const lib = join(root, 'lib');
const VERSION = JSON.parse(readFileSync(join(root, 'version.json'), 'utf8')).version;
const FAMILY = { regular: 'wiraicon', thin: 'wiraicon-thin', light: 'wiraicon-light', bold: 'wiraicon-bold', fill: 'wiraicon-fill' };

// ---------- the list ----------

const problems = [];
const byName = new Map();
for (const [name, ph, aliases = [], category, weight] of ICONS) {
  for (const n of [name, ...aliases]) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(n)) problems.push(`bad name "${n}"`);
    if (byName.has(n)) problems.push(`"${n}" is used by both ${byName.get(n)} and ${name}`);
    byName.set(n, name);
  }
  if (!CATEGORIES[category]) problems.push(`${name}: unknown category ${category}`);
  if (weight && !WEIGHTS.includes(weight)) problems.push(`${name}: unknown weight ${weight}`);
  // `wi-<weight>` classes switch the weight, so no icon may be called like a weight.
  for (const n of [name, ...aliases]) if (WEIGHTS.includes(n) || n === 'fw' || n === 'spin') problems.push(`"${n}" clashes with the wi-${n} class`);
  for (const w of weight ? [weight] : WEIGHTS) if (!existsSync(drawingFile(ph, w))) problems.push(`${name}: no ${w} drawing ${ph}`);
}

// Code points are kept in codepoints.json so a name keeps its glyph from release to release.
const cpFile = join(root, 'codepoints.json');
const codepoints = existsSync(cpFile) ? JSON.parse(readFileSync(cpFile, 'utf8')) : {};
let next = Math.max(0xe000 - 1, ...Object.values(codepoints)) + 1;
for (const [name] of ICONS) if (codepoints[name] === undefined) codepoints[name] = next++;

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`wiraicon: ${ICONS.length} icons, ${byName.size} names with aliases, ${WEIGHTS.length} weights`);
if (process.argv.includes('--check')) process.exit(0);

writeFileSync(cpFile, JSON.stringify(Object.fromEntries(Object.entries(codepoints).sort((a, b) => a[1] - b[1])), null, 2) + '\n');

// ---------- drawings ----------

function drawingFile(ph, weight) {
  return join(phosphor, 'assets', weight, `${ph}${weight === 'regular' ? '' : '-' + weight}.svg`);
}
/** The markup inside the <svg> of a Phosphor file (all drawn on a 256 × 256 grid, filled with currentColor). */
function drawing(ph, weight) {
  const svg = readFileSync(drawingFile(ph, weight), 'utf8');
  if (!/viewBox="0 0 256 256"/.test(svg)) throw new Error(`${ph} (${weight}): unexpected viewBox`);
  return svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
}
const svgFile = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">${body}</svg>\n`;

rmSync(lib, { recursive: true, force: true });
for (const dir of ['src', 'angular', 'data', 'fonts', ...WEIGHTS.map((w) => join('svg', w))]) mkdirSync(join(lib, dir), { recursive: true });

const data = {};
for (const w of WEIGHTS) {
  data[w] = {};
  for (const [name, ph, , , weight] of ICONS) {
    const body = drawing(ph, weight || w);
    data[w][name] = body;
    writeFileSync(join(lib, 'svg', w, `${name}.svg`), svgFile(body));
  }
  const constName = `WIRAICON_${w.toUpperCase()}`;
  mkdirSync(join(lib, 'data', w), { recursive: true });
  writeFileSync(join(lib, 'data', w, 'ng-package.json'), JSON.stringify({ lib: { entryFile: 'public-api.ts' } }, null, 2) + '\n');
  writeFileSync(
    join(lib, 'data', w, 'public-api.ts'),
    `/** wiraicon ${w} drawings: the markup inside a 256 × 256 <svg> (fill currentColor), keyed by main name. Built on Phosphor Icons (MIT). */\n` +
      `export const ${constName}: Readonly<Record<string, string>> = ${JSON.stringify(data[w])};\n`,
  );
}

// ---------- fonts ----------

const { SVGIcons2SVGFontStream } = require('svgicons2svgfont');
const svg2ttf = require('svg2ttf');
const ttf2woff2Module = require('ttf2woff2');
const ttf2woff2 = ttf2woff2Module.default || ttf2woff2Module;

function svgFont(weight) {
  return new Promise((resolve, reject) => {
    const font = new SVGIcons2SVGFontStream({ fontName: FAMILY[weight], fontHeight: 1000, normalize: true, centerHorizontally: true, log: () => {} });
    let out = '';
    font.on('data', (d) => (out += d)).on('end', () => resolve(out)).on('error', reject);
    for (const [name] of ICONS) {
      const glyph = Readable.from([svgFile(data[weight][name])]);
      glyph.metadata = { name, unicode: [String.fromCodePoint(codepoints[name])] };
      font.write(glyph);
    }
    font.end();
  });
}
for (const w of WEIGHTS) {
  const ttf = Buffer.from(svg2ttf(await svgFont(w), { ts: 0, description: 'wiraicon, WiraUI icons built on Phosphor Icons (MIT)', url: 'https://github.com/Wirabyte/WiraUI' }).buffer);
  writeFileSync(join(lib, 'fonts', `${FAMILY[w]}.woff2`), ttf2woff2(ttf));
}

// ---------- CSS ----------

const hex = (cp) => cp.toString(16);
const css = [
  `/* wiraicon ${VERSION} · WiraUI icons, built on Phosphor Icons (MIT). <i class="wi wi-check"></i>, weights: wi-thin, wi-light, wi-bold, wi-fill. */`,
  ...WEIGHTS.map(
    (w) => `@font-face {\n  font-family: '${FAMILY[w]}';\n  src: url('./fonts/${FAMILY[w]}.woff2') format('woff2');\n  font-weight: normal;\n  font-style: normal;\n  font-display: block;\n}`,
  ),
  `.wi {\n  display: inline-block;\n  font-family: 'wiraicon' !important;\n  font-style: normal;\n  font-weight: normal !important;\n  font-variant: normal;\n  line-height: 1;\n  text-transform: none;\n  speak: never;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}`,
  ...WEIGHTS.filter((w) => w !== 'regular').map((w) => `.wi.wi-${w} {\n  font-family: '${FAMILY[w]}' !important;\n}`),
  `.wi.wi-fw {\n  width: 1.25em;\n  text-align: center;\n}`,
  `.wi.wi-spin {\n  animation: wi-spin 1s linear infinite;\n}\n@keyframes wi-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .wi.wi-spin {\n    animation-duration: 3s;\n  }\n}`,
  ...ICONS.map(([name, , aliases = []]) => `${[name, ...aliases].map((n) => `.wi-${n}::before`).join(',\n')} {\n  content: '\\${hex(codepoints[name])}';\n}`),
].join('\n');
writeFileSync(join(lib, 'wiraicon.css'), css + '\n');

// ---------- metadata and the TypeScript entry ----------

const meta = {
  version: VERSION,
  weights: WEIGHTS,
  categories: Object.fromEntries(Object.entries(CATEGORIES).map(([k, [th, en]]) => [k, { th, en }])),
  icons: ICONS.map(([name, , aliases = [], category, weight]) => ({ name, aliases, category, ...(weight ? { weight } : {}), codepoint: hex(codepoints[name]) })),
};
writeFileSync(join(lib, 'icons.json'), JSON.stringify(meta) + '\n');

const aliases = Object.fromEntries([...byName].filter(([n, main]) => n !== main));
const fixed = Object.fromEntries(ICONS.filter((i) => i[4]).map((i) => [i[0], i[4]]));
writeFileSync(
  join(lib, 'src', 'icons.ts'),
  `// Generated by packages/icons/scripts/build.mjs from icons.mjs. Do not edit.\n` +
    `export const WIRAICON_NAMES = ${JSON.stringify(ICONS.map((i) => i[0]))} as const;\n` +
    `/** Other names for an icon (Font Awesome and Phosphor spellings, older names) → its main name. */\n` +
    `export const WIRAICON_ALIASES: Readonly<Record<string, string>> = ${JSON.stringify(aliases)};\n` +
    `/** Icons whose name is a weight (\`star-fill\`): always drawn in that weight. */\n` +
    `export const WIRAICON_FIXED_WEIGHT: Readonly<Record<string, string>> = ${JSON.stringify(fixed)};\n` +
    `export const WIRAICON_VERSION = ${JSON.stringify(VERSION)};\n`,
);
cpSync(join(root, 'src'), join(lib, 'src'), { recursive: true });
cpSync(join(root, 'angular'), join(lib, 'angular'), { recursive: true });
for (const f of ['ng-package.json', 'tsconfig.lib.json', 'README.md']) cpSync(join(root, 'config', f), join(lib, f));
writeFileSync(
  join(lib, 'LICENSE'),
  readFileSync(join(root, '..', '..', 'LICENSE'), 'utf8').trimEnd() +
    '\n\n---\n\nThe icon drawings come from Phosphor Icons (https://phosphoricons.com), used under the MIT License:\n\n' +
    readFileSync(join(phosphor, 'LICENSE'), 'utf8'),
);
const pkg = JSON.parse(readFileSync(join(root, 'config', 'package.json'), 'utf8'));
pkg.version = VERSION;
writeFileSync(join(lib, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

// ---------- Angular build, then the package's own files ----------

rmSync(join(root, 'dist'), { recursive: true, force: true });
execSync(`node "${require.resolve('ng-packagr/cli/main.js')}" -p lib/ng-package.json -c lib/tsconfig.lib.json`, { cwd: root, stdio: 'inherit' });
const dist = join(root, 'dist');
const out = JSON.parse(readFileSync(join(dist, 'package.json'), 'utf8'));
out.exports = {
  ...out.exports,
  './wiraicon.css': './wiraicon.css',
  './icons.json': './icons.json',
  './fonts/*': './fonts/*',
  './svg/*': './svg/*',
};
out.style = 'wiraicon.css';
writeFileSync(join(dist, 'package.json'), JSON.stringify(out, null, 2) + '\n');
console.log('wiraicon: built dist/');
