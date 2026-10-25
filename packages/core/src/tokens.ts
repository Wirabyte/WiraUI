import {
  COMPONENT_TOKENS,
  ComponentTokenSpec,
  DENSITY,
  DensityId,
  FAMILY_GENERATION,
  FocusRing,
  MaterialMode,
  PRESETS,
  SEMANTIC_KEYS,
  SemanticKey,
  SHADOWS,
  ShadowId,
  SURFACES,
  SurfaceId,
} from './catalog';
import { compatAliases, STYLED_INPUTS } from './compat';
import { DarkMode, ThemeConfig } from './config';
import { contrast, generatePalette, Palette, SHADES } from './color';
import { FAMILIES } from './families';

/** Token name (without `--wt-`) → CSS value. */
export type TokenMap = Record<string, string>;
export interface ThemeTokens {
  /** Applies in both modes unless `dark` redefines it. */
  light: TokenMap;
  /** Only the tokens that differ in dark mode. */
  dark: TokenMap;
  /** Classic/styled theme variables re-created for migrated apps; keys carry their own `--` (see compat.ts). */
  compat?: TokenMap;
}

export const SURFACE_DARK_REF = 'var(--wt-surface-950)';

export function emptyTokens(): ThemeTokens {
  return { light: {}, dark: {} };
}
export function mergeTokens(target: ThemeTokens, ...sources: ThemeTokens[]): ThemeTokens {
  for (const s of sources) {
    Object.assign(target.light, s.light);
    Object.assign(target.dark, s.dark);
    if (s.compat) target.compat = { ...(target.compat || {}), ...s.compat };
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

/** `primary-contrast-auto` is the readable text colour; families decide whether to use it or fixed white. */
export function primaryTokens(p: Palette, surface950: string): ThemeTokens {
  const light: TokenMap = {};
  for (const s of SHADES) light['primary-' + s] = p[s];
  light['primary-contrast-auto'] = bestOn(p[500], surface950);
  return { light, dark: { 'primary-contrast-auto': bestOn(p[400], surface950) } };
}

export function semanticTokens(key: SemanticKey, base: string | Palette, surface950: string): ThemeTokens {
  const p = typeof base === 'string' ? generatePalette(base) : base;
  const light: TokenMap = {};
  for (const s of SHADES) light[`${key}-${s}`] = p[s];
  light[key + '-contrast-auto'] = bestOn(p[600], surface950);
  return { light, dark: { [key + '-contrast-auto']: bestOn(p[400], surface950) } };
}

/** Font size is emitted in rem so an app that scales the root font size scales components too. */
export function fontTokens(c: { fontFamily?: string; fontSize?: number; lineHeight?: number }): ThemeTokens {
  const light: TokenMap = {};
  if (c.fontFamily !== undefined) light['font-family'] = `'${c.fontFamily}', sans-serif`;
  if (c.fontSize !== undefined) light['font-size'] = c.fontSize / 16 + 'rem';
  if (c.lineHeight !== undefined) light['line-height'] = String(c.lineHeight);
  return { light, dark: {} };
}

/** Radius scale in the usual proportions (r = md): xs r/3, sm 2r/3, lg 4r/3, xl 2r. */
export function radiusTokens(r: number): ThemeTokens {
  return {
    light: {
      'radius-xs': Math.round(r / 3) + 'px',
      'radius-sm': Math.round((r * 2) / 3) + 'px',
      'radius-md': r + 'px',
      'radius-lg': Math.round((r * 4) / 3) + 'px',
      'radius-xl': r * 2 + 'px',
      'radius-full': '9999px',
    },
    dark: {},
  };
}

export function densityTokens(id: DensityId): ThemeTokens {
  return { light: { density: String(DENSITY[id]) }, dark: {} };
}

export function shadowTokens(id: ShadowId): ThemeTokens {
  const s = SHADOWS[id];
  return { light: { 'shadow-sm': s[0], 'shadow-md': s[1], 'shadow-lg': s[2] }, dark: {} };
}

const RING = '0 0 0 0.2rem var(--wt-focus-ring-color)';

/** Focus styles for buttons/checkboxes/switches (control-*) and text fields (field-*). See FOCUS_STYLES. */
export function focusTokens(mode: FocusRing): ThemeTokens {
  const none = { shadow: 'none', outline: 'none', offset: '0px' };
  const control =
    mode === 'ring'
      ? { ...none, shadow: RING }
      : mode === 'outline'
        ? { ...none, outline: '1px solid var(--wt-primary-color)', offset: '2px' }
        : mode === 'bold'
          ? { ...none, outline: '2px solid var(--wt-primary-color)', offset: '2px' }
          : none;
  // Fields turn their border the primary colour; ring and outline add a soft halo that follows the field's radius.
  const field =
    mode === 'inset'
      ? { ...none, shadow: 'inset 0 0 0 1px var(--wt-field-focus-border)' }
      : mode === 'bold'
        ? { ...none, outline: '2px solid var(--wt-primary-color)', offset: '-1px' }
        : { ...none, shadow: RING };
  return {
    light: {
      'control-focus-shadow': control.shadow,
      'control-focus-outline': control.outline,
      'control-focus-offset': control.offset,
      'field-focus-shadow': field.shadow,
      'field-focus-outline': field.outline,
      'field-focus-offset': field.offset,
      'focus-ring-color': 'color-mix(in srgb, var(--wt-primary-color) 24%, transparent)',
    },
    dark: { 'focus-ring-color': 'color-mix(in srgb, var(--wt-primary-color) 20%, transparent)' },
  };
}

export function transitionTokens(ms: number): ThemeTokens {
  return { light: { transition: ms + 'ms' }, dark: {} };
}

export function materialTokens(m: MaterialMode): ThemeTokens {
  if (m !== 'glass') return { light: { material: m }, dark: {} };
  return {
    light: {
      material: m,
      'card-bg': 'var(--wt-glass-bg)',
      'card-backdrop': 'blur(var(--wt-glass-blur)) saturate(var(--wt-glass-saturate))',
      'card-border-width': '1px',
      'card-shadow': 'var(--wt-glass-highlight), var(--wt-glass-shadow)',
      border: 'var(--wt-glass-border)',
    },
    dark: { 'card-bg': 'var(--wt-glass-bg)', border: 'var(--wt-glass-border)' },
  };
}

// ---------- component tokens ----------

/** Tokens for an explicit component value set in the Designer, SCSS `$components` or TS overrides. */
export function componentValue(spec: ComponentTokenSpec, v: number | boolean | string): ThemeTokens {
  if (spec.css === 'card-border-width') return { light: { [spec.css]: v ? '1px' : '0px' }, dark: {} };
  if (spec.css === 'tag-radius') return { light: { [spec.css]: v ? 'var(--wt-radius-full)' : 'var(--wt-radius-md)' }, dark: {} };
  if (spec.css === 'table-stripe-bg') {
    return v
      ? { light: { [spec.css]: 'var(--wt-surface-50)' }, dark: { [spec.css]: 'color-mix(in srgb, var(--wt-surface-700) 40%, var(--wt-surface-800))' } }
      : { light: { [spec.css]: 'var(--wt-table-row-bg)' }, dark: {} };
  }
  if (typeof v === 'string') return { light: { [spec.css]: v }, dark: {} };
  return { light: { [spec.css]: spec.type === 'px' ? v + 'px' : String(v) }, dark: {} };
}

// ---------- whole theme ----------

export function primaryPaletteOf(c: ThemeConfig): Palette {
  return c.primaryShades ? { ...c.primaryShades } : generatePalette(c.primary);
}

export function computeTokens(c: ThemeConfig): ThemeTokens {
  const preset = PRESETS[c.preset];
  const family = FAMILIES[preset.family];
  const generation = FAMILY_GENERATION[preset.family];
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
    focusTokens(c.focusRing),
    transitionTokens(c.transition),
    { light: { ...family.light }, dark: { ...family.dark } },
    materialTokens(c.material)
  );
  if (c.primaryContrast) {
    t.light['primary-contrast'] = c.primaryContrast;
    delete t.dark['primary-contrast'];
  }
  // Styled-mode apps may set e.g. --p-card-body-gap themselves; read it first.
  if (generation === 'styled') {
    for (const key of Object.keys(STYLED_INPUTS)) t.light[key] = `var(${STYLED_INPUTS[key]}, ${t.light[key]})`;
  }
  for (const spec of COMPONENT_TOKENS) {
    const group = c.components[spec.id];
    const v = group ? group[spec.key] : undefined;
    if (v !== undefined) mergeTokens(t, componentValue(spec, v));
  }
  if (c.scheme === 'dark') {
    t.light = { ...t.light, ...t.dark };
    t.dark = {};
  }
  // Read by WtThemeService (overrides on a dark-only theme) and by `color-scheme` in base.css.
  t.light['scheme'] = c.scheme;
  if (c.scheme === 'light') t.dark['scheme'] = 'dark';
  const compat = compatAliases(generation);
  if (Object.keys(compat).length) t.compat = compat;
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

/**
 * Cascade order. `reset` comes first so an app's own element resets (`button { font: inherit }` from a normalize,
 * reboot or preflight file) can sit below the components: wrap them in `@layer reset { … }`. Unlayered app CSS still
 * wins over everything, as intended for the app's own styles.
 */
export const LAYER_ORDER = '@layer reset, wiratheme.tokens, wiratheme.components, wiratheme.utilities, wiratheme.overrides;';

function decls(map: TokenMap, indent: string): string {
  return Object.keys(map)
    .map((k) => `${indent}--wt-${k}: ${map[k]};`)
    .join('\n');
}
function rawDecls(map: TokenMap, indent: string): string {
  return Object.keys(map)
    .map((k) => `${indent}${k}: ${map[k]};`)
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
  if (t.compat && Object.keys(t.compat).length) lines.push(rawDecls(t.compat, i1));
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
  const own = Object.keys(all).map((k) => `--wt-${k}: ${all[k]}`);
  const compat = t.compat ? Object.keys(t.compat).map((k) => `${k}: ${t.compat![k]}`) : [];
  return own.concat(compat).join('; ');
}
