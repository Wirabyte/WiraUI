import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import * as core from '../../core/src';
import { renderScssData } from '../scripts/scss-data.mjs';

/**
 * The Sass theme must emit exactly the tokens the TS engine computes, on the oldest Sass we
 * support (1.58.3, Angular 15) and the current one, without a single warning.
 */

const require = createRequire(import.meta.url);
const COMPILERS: [string, any][] = [require('sass-158'), require('sass')].map((sass) => [`sass ${sass.info.split('\t')[1]}`, sass]);

const SCSS_DIR = new URL('../scss/', import.meta.url);
const PREFIX = 'wiratheme/theme';

/** Resolves `wiratheme/theme[/x]` to packages/themes/scss, as the published package does. */
const importer = {
  findFileUrl(url: string) {
    if (url !== PREFIX && !url.startsWith(PREFIX + '/')) return null;
    return new URL(url.slice(PREFIX.length + 1) || 'index', SCSS_DIR);
  },
};

function compile(sass: any, source: string): string {
  const warnings: string[] = [];
  const log = (message: string) => warnings.push(message);
  const { css } = sass.compileString(source, { importers: [importer], logger: { warn: log, debug: log } });
  expect(warnings, 'Sass warnings').toEqual([]);
  return css;
}

interface ParsedCss {
  statements: string[];
  /** Selector path (`@layer x > :root`) → declarations in order. */
  blocks: Record<string, [string, string][]>;
}

/** Just enough CSS parsing for token files: no comments, no braces or semicolons inside values. */
function parseCss(css: string): ParsedCss {
  const out: ParsedCss = { statements: [], blocks: {} };
  const stack: string[] = [];
  let buf = '';
  for (const ch of css.replace(/^@charset[^;]*;/, '')) {
    if (ch === '{') {
      stack.push(buf.trim().replace(/\s+/g, ' '));
      out.blocks[stack.join(' > ')] ??= [];
      buf = '';
    } else if (ch === '}') {
      if (buf.trim()) throw new Error(`unterminated declaration: ${buf.trim()}`);
      stack.pop();
      buf = '';
    } else if (ch === ';') {
      const text = buf.trim();
      if (!stack.length) out.statements.push(text.replace(/\s+/g, ' '));
      else {
        const i = text.indexOf(':');
        out.blocks[stack.join(' > ')].push([text.slice(0, i).trim(), text.slice(i + 1).trim()]);
      }
      buf = '';
    } else buf += ch;
  }
  if (stack.length || buf.trim()) throw new Error('unbalanced CSS');
  return out;
}

function expectedCss(c: core.ThemeConfig): string {
  const body = core.tokensToCss(core.computeTokens(c), { darkMode: c.darkMode, extra: { 'theme-source': 'scss' } });
  return core.LAYER_ORDER + '\n\n' + body;
}

const DARK_PATH: Record<core.DarkMode, string | null> = {
  none: null,
  class: '@layer wiratheme.tokens > :root.wt-dark',
  media: '@layer wiratheme.tokens > @media (prefers-color-scheme: dark) > :root',
};

function tokensOf(decls: [string, string][] | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of decls || []) {
    expect(name.startsWith('--wt-'), name).toBe(true);
    out[name.slice(5)] = value;
  }
  return out;
}

/** Same tokens, values, order and block structure as tokensToCss() for this config. */
function expectParity(css: string, c: core.ThemeConfig) {
  const got = parseCss(css);
  const t = core.computeTokens(c);
  expect(tokensOf(got.blocks['@layer wiratheme.tokens > :root'])).toEqual({ 'theme-source': 'scss', ...t.light });
  const dark = DARK_PATH[c.darkMode];
  if (dark) expect(tokensOf(got.blocks[dark])).toEqual(t.dark);
  expect(got).toEqual(parseCss(expectedCss(c)));
}

// ---------- configs ----------

const SHADES_INDIGO = {
  50: '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1',
  600: '#4f46e5',
  700: '#4338ca',
  800: '#3730a3',
  900: '#312e81',
  950: '#1e1b4b',
};

const RAW_CONFIGS: Record<string, unknown>[] = [
  ...core.PRESET_IDS.map((preset) => ({ preset })),
  ...['#0ea5e9', '#eab308', '#00a86b', '#ffffff', '#FFF', '#000000', '#fefefe', '#808080', '#ff0000', '#123456'].map((primary) => ({ primary })),
  ...core.PRIMARY_SWATCHES.map((s) => ({ preset: 'lanna', primary: s.hex })),
  { preset: 'siam', primaryShades: SHADES_INDIGO },
  { primary: '#0ea5e9', primaryShades: { ...SHADES_INDIGO, 500: '#ffffff', 400: '#000000' } },
  ...Object.keys(core.SURFACES).map((surface) => ({ surface, primary: '#eab308' })),
  ...Object.keys(core.DENSITY).map((density) => ({ preset: 'nakhon', density })),
  ...Object.keys(core.SHADOWS).map((shadow) => ({ shadow })),
  { focusRing: 'outline' },
  { preset: 'siam', focusRing: 'ring' },
  { darkMode: 'none' },
  { darkMode: 'media', preset: 'lanna' },
  { material: 'glass', darkMode: 'media' },
  { semantic: { success: '#16a34a', danger: '#DC2626', help: '#000' } },
  { fontFamily: 'Noto Sans Thai', fontSize: 16, lineHeight: 1.45, transition: 0 },
  ...[0, 1, 3, 5, 6.5, 7, 9, 13, 25, 75].map((radius) => ({ radius })),
  {
    preset: 'nakhon',
    components: {
      button: { fontWeight: 700, radius: 10, paddingX: 24 },
      input: { radius: 0 },
      card: { padding: 32, radius: 20, bodyGap: 0, bordered: false },
      table: { rowHeight: 40, striped: true },
      dialog: { radius: 4 },
      tag: { pill: true },
    },
  },
  { preset: 'lanna', darkMode: 'media', components: { card: { bordered: true }, table: { striped: false }, tag: { pill: false } } },
  { darkMode: 'none', components: { table: { striped: true }, button: { fontWeight: 400 } } },
];

/** Hand-written `with()` blocks beyond what toSCSS() writes; each must equal the config next to it. */
const HAND_WRITTEN: [string, Record<string, unknown>][] = [
  ['', {}],
  ["$preset: 'lanna'", { preset: 'lanna' }],
  ["$preset: siam, $dark-mode: 'media'", { preset: 'siam', darkMode: 'media' }],
  ['$primary: #0EA5E9', { primary: '#0ea5e9' }],
  ['$primary: #fff', { primary: '#ffffff' }],
  ["$primary: '#eab308'", { primary: '#eab308' }],
  ["$primary: 'sky'", { primary: '#0ea5e9' }],
  ["$primary: '{red}'", { primary: '#ef4444' }],
  ['$primary: (50: #eef2ff, 100: #e0e7ff, 200: #c7d2fe, 300: #a5b4fc, 400: #818cf8, 500: #6366f1, 600: #4f46e5, 700: #4338ca, 800: #3730a3, 900: #312e81, 950: #1e1b4b)', { primaryShades: SHADES_INDIGO }],
  ['$surface: gray', { surface: 'gray' }],
  ["$surface: '{stone}'", { surface: 'stone' }],
  ['$semantic: (warn: #eab308)', { semantic: { warn: '#eab308' } }],
  ['$semantic: ()', {}],
  ["$font-family: 'Sarabun', $font-size: 15, $line-height: 1.7, $radius: 8", { fontFamily: 'Sarabun', fontSize: 15, lineHeight: 1.7, radius: 8 }],
  ['$transition: 0.2s', { transition: 200 }],
  ['$ripple: true', {}],
  ['$components: (card: (body-gap: 0), table: (row-height: 44px, striped: true))', { components: { card: { bodyGap: 0 }, table: { rowHeight: 44, striped: true } } }],
  ['$components: (card: (bodyGap: 4px), button: (paddingX: 18, font-weight: 600))', { components: { card: { bodyGap: 4 }, button: { paddingX: 18, fontWeight: 600 } } }],
];

const BAD: [string, RegExp][] = [
  ['$primary: red', /\$primary must be a hex colour/],
  ['$primary: #00a86b80', /\$primary must be a hex colour/],
  ["$primary: 'nope'", /\$primary must be a hex colour/],
  ['$primary: (50: #fff)', /\$primary is missing shade 100/],
  ['$primary: (50: #fff, 100: #fff, 200: #fff, 300: #fff, 400: #fff, 500: rgb(1, 2, 3), 600: #fff, 700: #fff, 800: #fff, 900: #fff, 950: #fff)', /\$primary 500 must be a hex colour/],
  ["$preset: 'aurora'", /\$preset must be one of wira, lanna, siam, nakhon/],
  ["$surface: 'blue'", /\$surface must be one of/],
  ["$dark-mode: 'auto'", /\$dark-mode must be one of none, class, media/],
  ["$density: 'cozy'", /\$density must be one of/],
  ['$radius: 1rem', /\$radius must be a px length/],
  ['$transition: 2px', /\$transition must be a time/],
  ['$ripple: 1', /\$ripple must be true or false/],
  ['$semantic: (error: #f00)', /unknown \$semantic key `error`/],
  ['$components: (card: (gap: 0px))', /unknown component token `card.gap`/],
  ['$components: (chip: (radius: 0px))', /unknown component token `chip.radius`/],
  ['$components: (card: (bordered: 1px))', /\$components.card.bordered must be true or false/],
];

const label = (raw: unknown) => JSON.stringify(raw).replace(/"/g, '');

describe.each(COMPILERS)('%s', (_name, sass) => {
  describe('compiles the toSCSS() file to the computeTokens() tokens', () => {
    it.each(RAW_CONFIGS.map((raw) => [label(raw), raw]))('%s', (_l, raw) => {
      const c = core.normalize(raw);
      expectParity(compile(sass, core.toSCSS(c)), c);
    }, 30000);
  });

  describe('accepts hand-written settings', () => {
    it.each(HAND_WRITTEN)('with (%s)', (settings, raw) => {
      const source = settings ? `@use 'wiratheme/theme' with (${settings});` : "@use 'wiratheme/theme';";
      expectParity(compile(sass, source), core.normalize(raw));
    }, 30000);

    it('emits the tokens once however many files load it', () => {
      const css = compile(sass, "@use 'wiratheme/theme' with ($preset: 'siam');\n@use 'wiratheme/theme/index' as again;");
      expect(css.match(/--wt-theme-source/g)).toHaveLength(1);
    });
  });

  describe('rejects bad settings with a clear error', () => {
    it.each(BAD)('with (%s)', (settings, message) => {
      expect(() => compile(sass, `@use 'wiratheme/theme' with (${settings});`)).toThrow(message);
    });
  });

  it('matches color.ts for a few hundred colours', () => {
    let seed = 7;
    const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) % 256;
    const hexes = ['#000000', '#ffffff', '#808080', '#7f7f7f', '#010101', '#fefefe', '#ff0000', '#00ff00', '#0000ff'];
    for (let i = 0; i < 300; i++) hexes.push(core.rgbToHex([rnd(), rnd(), rnd()]));
    // Every other one as an upper-case colour literal, the rest as quoted strings; plus short forms.
    const literals = hexes.map((h, i) => (i % 2 ? h.toUpperCase() : `'${h}'`)).concat(['#abc', "'#F0A'"]);
    const inputs = hexes.concat(['#aabbcc', '#ff00aa']);
    const surfaces = Object.keys(core.SURFACES) as core.SurfaceId[];
    const source = `@use 'sass:list';
@use 'sass:map';
@use 'wiratheme/theme/color';
@use 'wiratheme/theme/data';
$colours: (${literals.join(', ')});
a {
  @for $i from 1 through list.length($colours) {
    $rgb: color.wt-rgb(list.nth($colours, $i));
    --p-#{$i}: #{map.values(color.wt-palette($rgb))};
    @each $id, $scale in data.$surfaces {
      --b-#{$i}-#{$id}: #{color.wt-best-on(color.wt-hex($rgb), list.nth($scale, 11))};
    }
  }
}`;
    const decls = Object.fromEntries(parseCss(compile(sass, source)).blocks['a']);
    inputs.forEach((hex, i) => {
      const p = core.generatePalette(hex);
      expect(decls[`--p-${i + 1}`], hex).toBe(core.SHADES.map((s) => p[s]).join(', '));
      for (const id of surfaces) {
        expect(decls[`--b-${i + 1}-${id}`], `${hex} on ${id}`).toBe(core.bestOn(hex, core.SURFACES[id][10]));
      }
    });
  }, 60000);

  describe('api', () => {
    it('emits nothing when loaded alone', () => {
      expect(compile(sass, "@use 'wiratheme/theme/api' as wt;").trim()).toBe('');
    });

    it('provides token(), dark(), media() and glass()', () => {
      const css = compile(
        sass,
        `@use 'wiratheme/theme/api' as wt;
.card {
  border-color: wt.token(primary-300);
  @include wt.dark { border-color: wt.token(primary-700); }
  @include wt.dark('media') { color: wt.token(text); }
  @include wt.media(md) { padding: 1rem; }
  @include wt.media(1400px) { padding: 2rem; }
}
@include wt.dark { --x: 1; }
.panel { @include wt.glass; }`
      );
      const got = parseCss(css);
      expect(got.blocks['.card']).toEqual([['border-color', 'var(--wt-primary-300)']]);
      expect(got.blocks[':root.wt-dark .card']).toEqual([['border-color', 'var(--wt-primary-700)']]);
      expect(got.blocks['@media (prefers-color-scheme: dark) > .card']).toEqual([['color', 'var(--wt-text)']]);
      expect(got.blocks['@media (min-width: 768px) > .card']).toEqual([['padding', '1rem']]);
      expect(got.blocks['@media (min-width: 1400px) > .card']).toEqual([['padding', '2rem']]);
      expect(got.blocks[':root.wt-dark']).toEqual([['--x', '1']]);
      expect(got.blocks['.panel']).toEqual([['background', 'var(--wt-card-bg)']]);
      const filter = 'blur(var(--wt-glass-blur)) saturate(var(--wt-glass-saturate))';
      expect(got.blocks['@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) > .panel']).toEqual([
        ['background', 'var(--wt-glass-bg)'],
        ['border', '1px solid var(--wt-glass-border)'],
        ['box-shadow', 'var(--wt-glass-highlight), var(--wt-glass-shadow)'],
        ['-webkit-backdrop-filter', filter],
        ['backdrop-filter', filter],
      ]);
      expect(got.blocks['@media (prefers-reduced-transparency: reduce) > .panel']).toEqual([
        ['background', 'var(--wt-card-bg)'],
        ['-webkit-backdrop-filter', 'none'],
        ['backdrop-filter', 'none'],
      ]);
    });

    it('rejects an unknown breakpoint', () => {
      expect(() => compile(sass, "@use 'wiratheme/theme/api' as wt;\na { @include wt.media(xxl) { b: c; } }")).toThrow(/unknown breakpoint `xxl`/);
    });
  });
});

describe('scss/_data.scss', () => {
  it('is what scripts/gen-scss-data.mjs writes for the current core (rebuild core, then `pnpm --filter @wiratheme/themes gen`)', () => {
    const committed = readFileSync(new URL('_data.scss', SCSS_DIR), 'utf8').replace(/\r\n/g, '\n');
    expect(committed).toBe(renderScssData(core));
  });
});
