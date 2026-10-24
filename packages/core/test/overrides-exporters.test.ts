import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import {
  computeTokens,
  defaults,
  definePreset,
  defineOverrides,
  normalize,
  overridesToTokens,
  palette,
  parseImport,
  PRESET_IDS,
  presetToTokens,
  toCSS,
  toJSON,
  toSCSS,
  toTSOverrides,
  toTSPreset,
  Wira,
} from '../src';

function loadPrototypeExporters(): any {
  const ctx: any = { window: {} };
  for (const f of ['engine.js', 'exporters.js']) {
    runInNewContext(readFileSync(new URL(`../../../prototype/theme-designer/${f}`, import.meta.url), 'utf8'), ctx);
  }
  return ctx.window.WT;
}

describe('overrides', () => {
  it('only emits the tokens an override touches', () => {
    const t = overridesToTokens(defineOverrides({ semantic: { primary: palette('#2563eb') }, components: { card: { bodyGap: '0px' } } }));
    expect(t.light['primary-500']).toBe('#2563eb');
    expect(t.light['primary-contrast-auto']).toBe('#ffffff');
    expect(t.light['card-body-gap']).toBe('0px');
    expect(t.light['surface-0']).toBeUndefined();
    expect(t.light['primary-color']).toBeUndefined();
  });

  it('accepts the shapes the prototype Designer exports', () => {
    const t = overridesToTokens({
      semantic: { surface: '{zinc}', fontFamily: "'Prompt', sans-serif", fontSize: '15px', lineHeight: '1.7', radius: '10px', density: 'compact', transition: '200ms' },
      components: { button: { fontWeight: 600, radius: '999px' }, tag: { pill: true } },
    });
    expect(t.light['surface-950']).toBe('#09090b');
    expect(t.light['font-family']).toBe("'Prompt', sans-serif");
    expect(t.light['radius-md']).toBe('10px');
    expect(t.light['radius-lg']).toBe('13px');
    expect(t.light['density']).toBe('0.8');
    expect(t.light['font-size']).toBe('15px');
    expect(t.light['button-font-weight']).toBe('600');
    expect(t.light['tag-radius']).toBe('var(--wt-radius-full)');
  });

  it('puts dark-only overrides into the dark map', () => {
    const t = overridesToTokens({ dark: { semantic: { surface: palette('#0f1d1a') } } });
    expect(Object.keys(t.light)).toHaveLength(0);
    expect(t.dark['surface-900']).toMatch(/^#/);
  });

  it('resolves {name} colour references and rejects junk', () => {
    expect(palette('{emerald}')[500]).toBe('#10b981');
    expect(() => palette('{nope}')).toThrow();
    expect(() => palette('teal')).toThrow();
  });

  it('builds a full token set from definePreset()', () => {
    const t = presetToTokens(definePreset(Wira, { semantic: { primary: palette('{indigo}') } }));
    expect(t.light['primary-500']).toBe('#6366f1');
    expect(t.light['surface-0']).toBe('#ffffff');
  });
});

describe('exporters', () => {
  const date = new Date(2026, 9, 24, 15, 0);

  it('round-trips every preset through every format', () => {
    for (const id of PRESET_IDS) {
      const c = normalize({ preset: id, primary: '#d946ef', components: { card: { bodyGap: 4 } } });
      for (const out of [toSCSS(c, { date }), toCSS(c, { date }), toTSOverrides(c, { date }), toTSPreset(c, { date }), toJSON(c, { date })]) {
        expect(parseImport(out)).toEqual(c);
      }
    }
  });

  it('dates files in the Buddhist era', () => {
    expect(toSCSS(defaults(), { date })).toContain('24/10/2569 15:00');
  });

  it('writes CSS with the layer order, theme-source marker and dark block', () => {
    const css = toCSS(defaults(), { date });
    expect(css).toContain('@layer reset, wiratheme.tokens, wiratheme.components, wiratheme.utilities, wiratheme.overrides;');
    expect(css).toContain('--wt-theme-source: css;');
    expect(css).toContain(':root.wt-dark {');
  });

  it('imports every file the prototype Designer exports', () => {
    const P = loadPrototypeExporters();
    const proto = P.normalize({ preset: 'lanna', primary: '#2563eb', components: { card: { bodyGap: 0 } } });
    for (const out of [P.toSCSS(proto), P.toCSS(proto), P.toTSOverrides(proto), P.toTSPreset(proto), P.toJSON(proto)]) {
      const c = parseImport(out);
      expect(c.preset).toBe('lanna');
      expect(c.primary).toBe('#2563eb');
      expect(c.material).toBe('solid');
      expect(c.components.card?.bodyGap).toBe(0);
    }
  });

  it('explains what went wrong on bad input', () => {
    expect(() => parseImport('')).toThrow('empty');
    expect(() => parseImport('body { color: red }')).toThrow('no-config');
    expect(() => parseImport('// wiratheme-config {oops}')).toThrow('bad-config');
  });

  it('only lists changed values in the TS overrides file', () => {
    expect(toTSOverrides(defaults('siam'), { date })).toContain('nothing differs from the Siam preset yet');
    const ts = toTSOverrides(normalize({ preset: 'wira', surface: 'zinc' }), { date });
    expect(ts).toContain("surface: '{zinc}',");
    expect(ts).toContain("import { defineOverrides } from 'wiratheme/config';");
    expect(computeTokens(defaults()).light['surface-950']).toBe('#070b14');
  });
});
