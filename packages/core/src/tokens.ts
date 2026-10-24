import { COMPONENT_TOKENS, ComponentTokenSpec, DENSITY, DensityId, PRESETS, SEMANTIC_KEYS, SemanticKey, SHADOWS, ShadowId, SURFACES, SurfaceId } from './catalog';
import { DarkMode, FocusRing, Material, ThemeConfig } from './config';
import { contrast, generatePalette, Palette, SHADES } from './color';

/** Token name (without `--wt-`) → CSS value. */
export type TokenMap = Record<string, string>;
export interface ThemeTokens {
  /** Applies in both modes unless `dark` redefines it. */
  light: TokenMap;
  /** Only the tokens that differ in dark mode. */
  dark: TokenMap;
}

export const SURFACE_DARK_REF = 'var(--wt-surface-950)';

export function emptyTokens(): ThemeTokens {
  return { light: {}, dark: {} };
}
export function mergeTokens(target: ThemeTokens, ...sources: ThemeTokens[]): ThemeTokens {
  for (const s of sources) {
    Object.assign(target.light, s.light);
    Object.assign(target.dark, s.dark);
  }
  return target;
}

/** White or the darkest surface, whichever reads better on `bg`. Same rule as `wt-best-on()` in Sass. */
export function bestOn(bg: string, surface950: string): string {
  return contrast('#ffffff', bg) >= contrast(surface950, bg) ? '#ffffff' : SURFACE_DARK_REF;
}

export function surfacePalette(surface: SurfaceId | Palette): Record<string, string> {
  const scale = typeof surface === 'string' ? SURFACES[surface] : SHADES.map((s) => surface[s]);
  const out: Record<string, string> = { '0': '#ffffff' };
  SHADES.forEach((s, i) => (out[String(s)] = scale[i]));
  return out;
}

// ---------- field tokens: one function per config field ----------

export function surfaceTokens(surface: SurfaceId | Palette): ThemeTokens {
  const p = surfacePalette(surface);
  const light: TokenMap = {};
  for (const k of Object.keys(p)) light['surface-' + k] = p[k];
  return { light, dark: {} };
}

export function primaryTokens(p: Palette, surface950: string): ThemeTokens {
  const light: TokenMap = {};
  for (const s of SHADES) light['primary-' + s] = p[s];
  light['primary-contrast'] = bestOn(p[500], surface950);
  return { light, dark: { 'primary-contrast': bestOn(p[400], surface950) } };
}

export function semanticTokens(key: SemanticKey, base: string | Palette, surface950: string): ThemeTokens {
  const p = typeof base === 'string' ? generatePalette(base) : base;
  const light: TokenMap = {};
  for (const s of SHADES) light[`${key}-${s}`] = p[s];
  light[key + '-contrast'] = bestOn(p[600], surface950);
  return { light, dark: { [key + '-contrast']: bestOn(p[400], surface950) } };
}

export function fontTokens(c: { fontFamily?: string; fontSize?: number; lineHeight?: number }): ThemeTokens {
  const light: TokenMap = {};
  if (c.fontFamily !== undefined) light['font-family'] = `'${c.fontFamily}', sans-serif`;
  if (c.fontSize !== undefined) light['font-size'] = c.fontSize + 'px';
  if (c.lineHeight !== undefined) light['line-height'] = String(c.lineHeight);
  return { light, dark: {} };
}

export function radiusTokens(r: number): ThemeTokens {
  return {
    light: {
      'radius-sm': Math.round(r * 0.66) + 'px',
      'radius-md': r + 'px',
      'radius-lg': Math.round(r * 1.5) + 'px',
      'radius-xl': Math.round(r * 2.5) + 'px',
      'radius-full': '9999px',
    },
    dark: {},
  };
}

export function densityTokens(id: DensityId): ThemeTokens {
  const d = DENSITY[id];
  return {
    light: {
      'field-padding-y': d.fieldPy + 'px',
      'field-padding-x': d.fieldPx + 'px',
      'button-padding-y': d.btnPy + 'px',
      gap: d.gap + 'px',
      'density-button-padding-x': d.btnPx + 'px',
      'density-card-padding': d.cardPad + 'px',
      'density-row-height': d.row + 'px',
    },
    dark: {},
  };
}

export function shadowTokens(id: ShadowId): ThemeTokens {
  const s = SHADOWS[id];
  return { light: { 'shadow-sm': s[0], 'shadow-md': s[1], 'shadow-lg': s[2] }, dark: {} };
}

export function focusRingTokens(mode: FocusRing): ThemeTokens {
  const ring =
    mode === 'outline'
      ? '0 0 0 2px var(--wt-card-bg), 0 0 0 4px var(--wt-primary-color)'
      : '0 0 0 3px color-mix(in srgb, var(--wt-primary-color) 30%, transparent)';
  return { light: { 'focus-ring': ring }, dark: {} };
}

export function transitionTokens(ms: number): ThemeTokens {
  return { light: { transition: ms + 'ms' }, dark: {} };
}

export function materialTokens(m: Material): ThemeTokens {
  return { light: { material: m }, dark: {} };
}

// ---------- tokens that only reference other tokens ----------

const surf = (s: number | string) => `var(--wt-surface-${s})`;
const prim = (s: number) => `var(--wt-primary-${s})`;
const soft = (ref: string) => `color-mix(in srgb, ${ref} 16%, var(--wt-surface-900))`;

function derived(): ThemeTokens {
  const light: TokenMap = {
    'primary-color': prim(500),
    'primary-hover': prim(600),
    'primary-active': prim(700),
    'primary-soft': prim(50),
    'primary-soft-text': prim(700),
    ground: surf(50),
    'card-bg': surf(0),
    'overlay-bg': surf(0),
    text: surf(800),
    'text-muted': surf(500),
    border: surf(200),
    'hover-bg': surf(100),
    'field-bg': surf(0),
    'field-border': surf(300),
    'field-hover-border': surf(400),
    'field-disabled-bg': surf(100),
    mask: 'rgba(0, 0, 0, 0.4)',
    'table-header-bg': surf(50),
    'glass-bg': 'color-mix(in srgb, var(--wt-surface-0) 60%, transparent)',
    'glass-blur': '20px',
    'glass-saturate': '180%',
    'glass-border': 'color-mix(in srgb, var(--wt-surface-0) 65%, transparent)',
    'glass-highlight': 'inset 0 1px 0 rgba(255, 255, 255, 0.7)',
    'glass-shadow': '0 8px 32px rgba(15, 23, 42, 0.18)',
    'primary-gradient': 'linear-gradient(135deg, var(--wt-primary-400), var(--wt-primary-600))',
    backdrop: 'var(--wt-ground)',
  };
  const dark: TokenMap = {
    'primary-color': prim(400),
    'primary-hover': prim(300),
    'primary-active': prim(200),
    'primary-soft': soft(prim(400)),
    'primary-soft-text': prim(200),
    ground: surf(950),
    'card-bg': surf(900),
    'overlay-bg': surf(900),
    text: surf(0),
    'text-muted': surf(400),
    border: surf(700),
    'hover-bg': surf(800),
    'field-bg': surf(950),
    'field-border': surf(600),
    'field-hover-border': surf(500),
    'field-disabled-bg': surf(800),
    mask: 'rgba(0, 0, 0, 0.6)',
    'table-header-bg': surf(800),
    'glass-bg': 'color-mix(in srgb, var(--wt-surface-900) 50%, transparent)',
    'glass-border': 'color-mix(in srgb, var(--wt-surface-0) 14%, transparent)',
    'glass-highlight': 'inset 0 1px 0 rgba(255, 255, 255, 0.18)',
    'glass-shadow': '0 8px 32px rgba(0, 0, 0, 0.4)',
  };
  for (const k of SEMANTIC_KEYS) {
    light[k + '-color'] = `var(--wt-${k}-600)`;
    light[k + '-bg'] = `var(--wt-${k}-50)`;
    light[k + '-text'] = `var(--wt-${k}-800)`;
    dark[k + '-color'] = `var(--wt-${k}-400)`;
    dark[k + '-bg'] = soft(`var(--wt-${k}-400)`);
    dark[k + '-text'] = `var(--wt-${k}-200)`;
  }
  return { light, dark };
}

// ---------- component tokens ----------

/** Value a component token takes when the theme does not set it. */
export function componentDefault(spec: ComponentTokenSpec, c: Pick<ThemeConfig, 'preset'>): ThemeTokens {
  const p = PRESETS[c.preset];
  switch (spec.css) {
    case 'button-font-weight':
      return { light: { [spec.css]: String(p.buttonWeight) }, dark: {} };
    case 'card-border-width':
      return componentValue(spec, p.cardBorder);
    case 'table-stripe-bg':
    case 'tag-radius':
      return componentValue(spec, false);
  }
  const refs: Record<string, string> = {
    'button-radius': 'var(--wt-radius-md)',
    'button-padding-x': 'var(--wt-density-button-padding-x)',
    'input-radius': 'var(--wt-radius-md)',
    'card-padding': 'var(--wt-density-card-padding)',
    'card-radius': 'var(--wt-radius-lg)',
    'card-body-gap': '8px',
    'table-row-height': 'var(--wt-density-row-height)',
    'dialog-radius': 'var(--wt-radius-xl)',
  };
  return { light: { [spec.css]: refs[spec.css] }, dark: {} };
}

/** Tokens for an explicit component value set in the Designer, SCSS `$components` or TS overrides. */
export function componentValue(spec: ComponentTokenSpec, v: number | boolean | string): ThemeTokens {
  if (spec.css === 'card-border-width') return { light: { [spec.css]: v ? '1px' : '0px' }, dark: {} };
  if (spec.css === 'tag-radius') return { light: { [spec.css]: v ? 'var(--wt-radius-full)' : 'var(--wt-radius-sm)' }, dark: {} };
  if (spec.css === 'table-stripe-bg') {
    return v
      ? { light: { [spec.css]: surf(50) }, dark: { [spec.css]: 'color-mix(in srgb, var(--wt-surface-800) 50%, var(--wt-surface-900))' } }
      : { light: { [spec.css]: 'transparent' }, dark: {} };
  }
  if (typeof v === 'string') return { light: { [spec.css]: v }, dark: {} };
  return { light: { [spec.css]: spec.type === 'px' ? v + 'px' : String(v) }, dark: {} };
}

// ---------- whole theme ----------

export function primaryPaletteOf(c: ThemeConfig): Palette {
  return c.primaryShades ? { ...c.primaryShades } : generatePalette(c.primary);
}

export function computeTokens(c: ThemeConfig): ThemeTokens {
  const s950 = SURFACES[c.surface][10];
  const t = emptyTokens();
  mergeTokens(
    t,
    surfaceTokens(c.surface),
    primaryTokens(primaryPaletteOf(c), s950),
    ...SEMANTIC_KEYS.map((k) => semanticTokens(k, c.semantic[k], s950)),
    fontTokens(c),
    radiusTokens(c.radius),
    densityTokens(c.density),
    shadowTokens(c.shadow),
    focusRingTokens(c.focusRing),
    transitionTokens(c.transition),
    materialTokens(c.material),
    derived()
  );
  for (const spec of COMPONENT_TOKENS) {
    const group = c.components[spec.id];
    const v = group ? group[spec.key] : undefined;
    mergeTokens(t, v === undefined ? componentDefault(spec, c) : componentValue(spec, v));
  }
  return t;
}

// ---------- serialisation ----------

export interface CssOptions {
  /** Where light tokens live. Default `:root`. */
  selector?: string;
  darkMode?: DarkMode;
  /** Selector for class-based dark mode. Default `:root.wt-dark`. */
  darkSelector?: string;
  /** Cascade layer to wrap the rules in; null for none. Default `wiratheme.tokens`. */
  layer?: string | null;
  /** Extra declarations put first in the light block, e.g. `--wt-theme-source: css`. */
  extra?: TokenMap;
  indent?: string;
}

export const LAYER_ORDER = '@layer wiratheme.tokens, wiratheme.components, wiratheme.overrides;';

function decls(map: TokenMap, indent: string): string {
  return Object.keys(map)
    .map((k) => `${indent}--wt-${k}: ${map[k]};`)
    .join('\n');
}

/** Token blocks as CSS text (no header, no layer-order statement). */
export function tokensToCss(t: ThemeTokens, o: CssOptions = {}): string {
  const selector = o.selector || ':root';
  const darkMode = o.darkMode || 'class';
  const layer = o.layer === undefined ? 'wiratheme.tokens' : o.layer;
  const pad = layer ? '  ' : '';
  const i1 = pad + '  ';
  const lines: string[] = [];
  lines.push(`${pad}${selector} {`);
  if (o.extra) lines.push(decls(o.extra, i1));
  lines.push(decls(t.light, i1));
  lines.push(`${pad}}`);
  const darkKeys = Object.keys(t.dark);
  if (darkKeys.length && darkMode === 'class') {
    lines.push('', `${pad}${o.darkSelector || ':root.wt-dark'} {`, decls(t.dark, i1), `${pad}}`);
  } else if (darkKeys.length && darkMode === 'media') {
    lines.push('', `${pad}@media (prefers-color-scheme: dark) {`, `${pad}  ${selector} {`, decls(t.dark, i1 + '  '), `${pad}  }`, `${pad}}`);
  }
  const body = lines.join('\n');
  return layer ? `@layer ${layer} {\n${body}\n}\n` : body + '\n';
}

/** `--wt-x: v; …` for an inline style attribute, with dark values applied when `mode` is dark. */
export function tokensToStyle(t: ThemeTokens, mode: 'light' | 'dark' = 'light'): string {
  const all: TokenMap = { ...t.light, ...(mode === 'dark' ? t.dark : {}) };
  return Object.keys(all)
    .map((k) => `--wt-${k}: ${all[k]}`)
    .join('; ');
}
