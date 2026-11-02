import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import {
  COMPONENT_TOKENS,
  computeTokens,
  contrast,
  defaults,
  generatePalette,
  hexToRgb,
  normalize,
  PRESETS,
  PRIMARY_SWATCHES,
  SEMANTIC_KEYS,
  SHADES,
  tokensToCss,
} from '../src';

/** The prototype Designer's engine.js, loaded as-is, is the reference the port must match. */
function loadPrototype(): any {
  const ctx: any = { window: {} };
  const src = readFileSync(new URL('../../../prototype/theme-designer/engine.js', import.meta.url), 'utf8');
  runInNewContext(src, ctx);
  return ctx.window.WU;
}

describe('palette', () => {
  const proto = loadPrototype();

  // The prototype rounded float sums (165 × 0.7 = 115.4999… → 115); the engine sums whole
  // percents so it agrees with Sass (115.5 → 116). One step either way is expected.
  it('stays within one step per channel of the prototype for every swatch and preset colour', () => {
    const colours = [...PRIMARY_SWATCHES.map((s) => s.hex), ...Object.values(PRESETS).map((p) => p.primary), '#123456', '#fff', '#000000'];
    for (const hex of colours) {
      const mine = generatePalette(hex);
      const theirs = proto.palette(hex);
      for (const s of SHADES) {
        const a = hexToRgb(mine[s]);
        const b = hexToRgb(theirs[s]);
        a.forEach((v, i) => expect(Math.abs(v - b[i]), `${hex} ${s}`).toBeLessThanOrEqual(1));
      }
    }
  });

  it('rounds half-way channels up', () => {
    // #0ea5e9 → shade 700: blue channel 165 × 70 / 100 = 115.5 → 116 (0x74)
    expect(generatePalette('#0ea5e9')[700]).toBe('#0a74a3');
  });

  it('keeps the base colour as shade 500', () => {
    expect(generatePalette('#00A86B')[500]).toBe('#00a86b');
  });
});

describe('computeTokens', () => {
  const t = computeTokens(defaults('wira'));

  it('emits primitives as hex and derived tokens as var() references', () => {
    expect(t.light['primary-500']).toBe('#1e7ae0');
    expect(t.light['surface-950']).toBe('#070b14');
    expect(t.light['primary-color']).toBe('var(--wu-primary-500)');
    expect(t.dark['primary-color']).toBe('var(--wu-primary-400)');
    expect(t.light['card-radius']).toBe('var(--wu-radius-lg)');
  });

  it('has a full palette and a contrast token for every status colour', () => {
    for (const k of SEMANTIC_KEYS) {
      for (const s of SHADES) expect(t.light[`${k}-${s}`]).toMatch(/^#[0-9a-f]{6}$/);
      expect(t.light[`${k}-contrast`]).toBe(`var(--wu-${k}-contrast-auto)`);
      expect(t.light[`${k}-contrast-auto`]).toBeDefined();
      expect(t.dark[`${k}-contrast-auto`]).toBeDefined();
    }
  });

  it('picks the readable text colour for the primary button in the Wira family', () => {
    const yellow = computeTokens(normalize({ preset: 'wira', primary: '#eab308' }));
    expect(yellow.light['primary-contrast']).toBe('var(--wu-primary-contrast-auto)');
    expect(yellow.light['primary-contrast-auto']).toBe('var(--wu-surface-950)');
    const blue = computeTokens(normalize({ preset: 'wira', primary: '#1d4ed8' }));
    expect(blue.light['primary-contrast-auto']).toBe('#ffffff');
    expect(contrast('#ffffff', '#1d4ed8')).toBeGreaterThan(6);
  });

  it('keeps white text on PrimeNG-look buttons whatever the colour, unless primaryContrast says otherwise', () => {
    expect(computeTokens(normalize({ preset: 'mali', primary: '#eab308' })).light['primary-contrast']).toBe('#ffffff');
    expect(computeTokens(normalize({ preset: 'arun', primary: '#ffc107', primaryContrast: '#212529' })).light['primary-contrast']).toBe('#212529');
  });

  it('uses a literal for component values set by the user and var() otherwise', () => {
    const c = normalize({ preset: 'wira', components: { card: { bodyGap: 0, bordered: false }, table: { striped: true } } });
    const tt = computeTokens(c);
    expect(tt.light['card-body-gap']).toBe('0px');
    expect(tt.light['card-border-width']).toBe('0px');
    expect(tt.light['table-stripe-bg']).toBe('var(--wu-surface-50)');
    expect(tt.dark['table-stripe-bg']).toContain('color-mix');
    expect(tt.light['button-radius']).toBe('var(--wu-radius-md)');
  });

  it('defines every component token', () => {
    for (const spec of COMPONENT_TOKENS) expect(t.light[spec.css], spec.css).toBeDefined();
  });

  it('reserves the glass tokens for v3', () => {
    for (const k of ['glass-bg', 'glass-blur', 'glass-saturate', 'glass-border', 'glass-highlight', 'glass-shadow', 'primary-gradient', 'backdrop']) {
      expect(t.light[k], k).toBeDefined();
    }
    expect(t.light['material']).toBe('solid');
  });
});

describe('tokensToCss', () => {
  const t = computeTokens(defaults('wira'));
  it('wraps tokens in the tokens layer and a class-based dark block', () => {
    const css = tokensToCss(t, { darkMode: 'class' });
    expect(css.startsWith('@layer wiraui.tokens {')).toBe(true);
    expect(css).toContain(':root.wu-dark {');
    expect(css).toContain('--wu-primary-500: #1e7ae0;');
  });
  it('supports media-query dark mode, none, and a custom selector without a layer', () => {
    expect(tokensToCss(t, { darkMode: 'media' })).toContain('@media (prefers-color-scheme: dark)');
    expect(tokensToCss(t, { darkMode: 'none' })).not.toContain('wu-dark');
    const scoped = tokensToCss(t, { selector: '[data-wu-version="v1"]', layer: null });
    expect(scoped.startsWith('[data-wu-version="v1"] {')).toBe(true);
  });
});
