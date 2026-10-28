import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  CLASSIC_THEMES,
  computeTokens,
  defaults,
  definePreset,
  SilaClassic,
  overridesToTokens,
  PRESET_IDS,
  PRESET_LIST,
  presetExportName,
  presetToTokens,
  presetsFor,
  themeConfig,
  themePreset,
  tokensToCss,
  VERSION_CATALOG,
} from '../src';

const refs = (value: string) => Array.from(value.matchAll(/var\(--wt-([a-z0-9-]+)/g), (m) => m[1]);

describe('preset families', () => {
  it('resolves every var(--wt-…) a theme references, in light and dark', () => {
    for (const name of [...PRESET_IDS, ...Object.keys(CLASSIC_THEMES)]) {
      const t = computeTokens(themeConfig(name));
      const defined = new Set(Object.keys(t.light));
      for (const map of [t.light, t.dark, t.compat || {}]) {
        for (const value of Object.values(map)) for (const r of refs(value)) expect(defined.has(r), `${name}: --wt-${r}`).toBe(true);
      }
    }
  });

  it('defines every token the component stylesheets use', () => {
    const dir = new URL('../../styles/', import.meta.url);
    const used = new Set<string>();
    for (const f of readdirSync(dir)) for (const r of refs(readFileSync(new URL(f, dir), 'utf8'))) used.add(r);
    expect(used.size).toBeGreaterThan(40);
    for (const name of [...PRESET_IDS, ...Object.keys(CLASSIC_THEMES)]) {
      const t = computeTokens(themeConfig(name));
      for (const r of used) expect(t.light[r], `${name}: --wt-${r}`).toBeDefined();
    }
  });

  it('never puts two lengths in one calc() (invalid CSS, the whole declaration drops)', () => {
    for (const name of [...PRESET_IDS, ...Object.keys(CLASSIC_THEMES)]) {
      const t = computeTokens(themeConfig(name));
      for (const map of [t.light, t.dark]) {
        for (const [key, value] of Object.entries(map)) expect(/calc\([^()]*\d(?:rem|px|em|%)\s+-?\d/.test(value), `${name}: --wt-${key}: ${value}`).toBe(false);
      }
    }
  });

  it('gives each PrimeNG era its own metrics', () => {
    const lara15 = computeTokens(defaults('sila-classic')).light;
    const mali = computeTokens(defaults('mali')).light;
    const material15 = computeTokens(defaults('material-classic')).light;
    expect(lara15['button-padding-y']).toBe('calc(0.75rem * var(--wt-density))');
    expect(lara15['button-font-weight']).toBe('700');
    expect(lara15['checkbox-size']).toBe('22px');
    expect(mali['button-padding-y']).toBe('calc(0.5rem * var(--wt-density))');
    expect(mali['button-font-weight']).toBe('500');
    expect(mali['checkbox-size']).toBe('1.25rem');
    expect(material15['button-text-transform']).toBe('uppercase');
  });

  it('keeps dark mode soft: lifted surfaces and off-white text in every family', () => {
    for (const id of PRESET_IDS) {
      const t = computeTokens(defaults(id));
      const dark = { ...t.light, ...t.dark };
      expect(dark['card-bg'], id).toBe(t.light['material'] === 'glass' ? 'var(--wt-glass-bg)' : 'var(--wt-surface-800)');
      expect(dark['text'], id).toBe('var(--wt-surface-200)');
      expect(dark['ground'], id).not.toBe('var(--wt-surface-950)');
    }
  });

  it('emits font size in rem and a radius scale', () => {
    const t = computeTokens(defaults('mali')).light;
    expect(t['font-size']).toBe('1rem');
    expect([t['radius-xs'], t['radius-sm'], t['radius-md'], t['radius-lg'], t['radius-xl']]).toEqual(['2px', '4px', '6px', '8px', '12px']);
  });
});

describe('named themes and version catalogs', () => {
  it('builds sila-dark-teal as a dark-only theme on the navy surface', () => {
    const c = themeConfig('sila-dark-teal');
    expect([c.preset, c.surface, c.scheme, c.primary]).toEqual(['sila-classic', 'navy', 'dark', '#14b8a6']);
    const t = computeTokens(c);
    expect(t.dark).toEqual({});
    expect(t.light['primary-color']).toBe('var(--wt-primary-400)');
    expect(t.light['ground']).toBe('color-mix(in srgb, var(--wt-surface-900) 60%, var(--wt-surface-800))');
    expect(t.light['surface-950']).toBe('#040d19');
    expect(tokensToCss(t)).not.toContain('wt-dark');
  });

  it('lists only presets that exist, with the default first in reach', () => {
    for (const major of [1, 2, 3] as const) {
      const cat = VERSION_CATALOG[major];
      for (const id of cat.presets) expect(PRESET_LIST[id], id).toBeDefined();
      expect(cat.presets).toContain(cat.defaultPreset);
      expect(cat.themes).toContain(cat.defaultTheme);
      for (const name of cat.themes) expect(() => themeConfig(name), name).not.toThrow();
      expect(presetsFor(major).map((p) => p.name)).toEqual(cat.presets.map(presetExportName));
    }
    expect(VERSION_CATALOG[1].presets).not.toContain('mali');
    expect(VERSION_CATALOG[2].presets).not.toContain('wira');
  });

  it('turns a theme name into a preset', () => {
    expect(themePreset('sayan-green').config.scheme).toBe('dark');
    expect(() => themePreset('nope')).toThrow();
    expect(definePreset(SilaClassic, { scheme: 'dark' }).config.scheme).toBe('dark');
  });

  it('flattens overrides on a dark-only theme', () => {
    const t = overridesToTokens({ dark: { components: { card: { radius: 2 } } } }, 'dark');
    expect(t.light['card-radius']).toBe('2px');
    expect(t.dark).toEqual({});
    const p = presetToTokens(definePreset(themePreset('ratri-blue'), { dark: { components: { card: { radius: 2 } } } }));
    expect(p.light['card-radius']).toBe('2px');
  });
});

describe('PrimeNG compatibility variables', () => {
  it('re-creates PrimeNG 15–17 variables for the classic presets', () => {
    const c = computeTokens(defaults('sila-classic')).compat!;
    expect(c['--surface-ground']).toBe('var(--wt-ground)');
    expect(c['--primary-color']).toBe('var(--wt-primary-color)');
    expect(c['--green-500']).toMatch(/^#/);
    expect(c['--p-primary-color']).toBeUndefined();
    expect(tokensToCss(computeTokens(defaults('sila-classic')))).toContain('  --surface-border: var(--wt-border);');
  });

  it('re-creates PrimeNG 18+ variables and reads --p-card-body-gap overrides', () => {
    const t = computeTokens(defaults('mali'));
    expect(t.compat!['--p-primary-color']).toBe('var(--wt-primary-color)');
    expect(t.light['card-body-gap']).toBe('var(--p-card-body-gap, 0.5rem)');
  });

  it('adds nothing for WiraTheme’s own presets', () => {
    expect(computeTokens(defaults('wira')).compat).toBeUndefined();
  });
});
