import {
  COMPONENT_TOKENS,
  DensityId,
  FocusRing,
  MajorVersion,
  MaterialMode,
  PRESETS,
  PresetId,
  presetExportName,
  PRIMARY_SWATCHES,
  Scheme,
  SEMANTIC_KEYS,
  ShadowId,
  SURFACES,
  SurfaceId,
  VERSION_CATALOG,
} from './catalog';
import { ThemeConfig, defaults, themeConfig } from './config';
import { generatePalette, isHex, isPalette, Palette } from './color';
import {
  componentValue,
  computeTokens,
  densityTokens,
  emptyTokens,
  focusTokens,
  fontTokens,
  materialTokens,
  mergeTokens,
  primaryTokens,
  radiusTokens,
  semanticTokens,
  shadowTokens,
  surfaceTokens,
  ThemeTokens,
  transitionTokens,
} from './tokens';

type Size = string | number;

export interface SemanticOverrides {
  primary?: Palette;
  /** `'{slate}'` style reference to a built-in surface, or a full palette. */
  surface?: string | Palette;
  success?: Palette;
  info?: Palette;
  warn?: Palette;
  danger?: Palette;
  help?: Palette;
  /** Text colour on primary buttons, e.g. `'#ffffff'`. */
  primaryContrast?: string;
  fontFamily?: string;
  fontSize?: Size;
  lineHeight?: Size;
  radius?: Size;
  density?: DensityId;
  shadow?: ShadowId;
  focusRing?: FocusRing;
  transition?: Size;
  material?: MaterialMode;
}

export interface ComponentOverrides {
  button?: { fontWeight?: number; radius?: Size; paddingX?: Size };
  input?: { radius?: Size };
  card?: { padding?: Size; radius?: Size; bodyGap?: Size; bordered?: boolean };
  table?: { rowHeight?: Size; striped?: boolean };
  dialog?: { radius?: Size };
  tag?: { pill?: boolean };
}

export interface ThemeOverrideSet {
  semantic?: SemanticOverrides;
  components?: ComponentOverrides;
}

/** Partial theme changes applied on top of the main theme (SCSS/CSS file or a preset). */
export interface ThemeOverrides extends ThemeOverrideSet {
  /** Applied in dark mode only. Anything not listed here applies to both modes. */
  dark?: ThemeOverrideSet;
  /** `definePreset()` only: `'dark'` makes the dark colours the only colours. */
  scheme?: Scheme;
}

export interface ThemePreset {
  readonly wtPreset: true;
  readonly name: string;
  readonly config: ThemeConfig;
  readonly overrides: ThemeOverrides[];
}

/**
 * A 50–950 palette from a hex colour (`'#1e7ae0'`) or a built-in swatch reference (`'{emerald}'`, `'{wira}'`).
 */
export function palette(input: string): Palette {
  const ref = /^\{([a-z]+)\}$/.exec(input.trim());
  if (ref) {
    const sw = PRIMARY_SWATCHES.find((s) => s.id === ref[1]);
    if (!sw) throw new Error(`wiratheme: unknown colour reference ${input}`);
    return generatePalette(sw.hex);
  }
  if (!isHex(input)) throw new Error(`wiratheme: palette() needs a hex colour or {name}, got ${input}`);
  return generatePalette(input);
}

export function defineOverrides(overrides: ThemeOverrides): ThemeOverrides {
  return overrides;
}

function makePreset(id: PresetId): ThemePreset {
  return { wtPreset: true, name: presetExportName(id), config: defaults(id), overrides: [] };
}
// v1 (classic look)
export const SilaClassic = makePreset('sila-classic');
export const Arun = makePreset('arun');
export const Sayan = makePreset('sayan');
export const Ratri = makePreset('ratri');
export const MaterialClassic = makePreset('material-classic');
// v2, v3 (styled look)
export const Mali = makePreset('mali');
export const Sila = makePreset('sila');
export const Material = makePreset('material');
export const Phet = makePreset('phet');
// v3 (WiraTheme's own)
export const Wira = makePreset('wira');
export const Lanna = makePreset('lanna');
export const Siam = makePreset('siam');
export const Nakhon = makePreset('nakhon');
export const Glass = makePreset('glass');
/** ♡ */
export const LL = makePreset('ll');
/** ฅ^•ﻌ•^ฅ */
export const WiraKawaii = makePreset('kawaii');
export const PRESET_LIST: Record<PresetId, ThemePreset> = {
  'sila-classic': SilaClassic,
  arun: Arun,
  sayan: Sayan,
  ratri: Ratri,
  'material-classic': MaterialClassic,
  mali: Mali,
  sila: Sila,
  material: Material,
  phet: Phet,
  wira: Wira,
  lanna: Lanna,
  siam: Siam,
  nakhon: Nakhon,
  glass: Glass,
  ll: LL,
  kawaii: WiraKawaii,
};

/** A ready-made theme as a preset, e.g. `themePreset('sila-light-teal')` or `themePreset('sayan-green')`. */
export function themePreset(name: string): ThemePreset {
  return { wtPreset: true, name, config: themeConfig(name), overrides: [] };
}

/** Presets a wiratheme major offers, in menu order. */
export function presetsFor(major: MajorVersion): ThemePreset[] {
  return VERSION_CATALOG[major].presets.map((id) => PRESET_LIST[id]);
}

/** A new preset: `base` plus your changes. Use it with `provideWiraTheme({ preset })` when there is no SCSS/CSS theme file. */
export function definePreset(base: ThemePreset, overrides: ThemeOverrides): ThemePreset {
  const config = overrides.scheme ? { ...base.config, scheme: overrides.scheme } : base.config;
  return { wtPreset: true, name: base.name + '+', config, overrides: base.overrides.concat(overrides) };
}

export function isThemePreset(value: unknown): value is ThemePreset {
  return !!value && typeof value === 'object' && (value as ThemePreset).wtPreset === true;
}

const num = (v: Size): number => (typeof v === 'number' ? v : parseFloat(v));

function resolveSurface(s: string | Palette): SurfaceId | Palette {
  if (typeof s !== 'string') return s;
  const id = s.replace(/[{}]/g, '').trim();
  if (!Object.prototype.hasOwnProperty.call(SURFACES, id)) throw new Error(`wiratheme: unknown surface ${s}`);
  return id as SurfaceId;
}
function surface950(s: SurfaceId | Palette | undefined): string {
  if (s === undefined) return SURFACES.slate[10];
  return typeof s === 'string' ? SURFACES[s][10] : s[950];
}

function setTokens(set: ThemeOverrideSet, s950: string): ThemeTokens {
  const t = emptyTokens();
  const sem = set.semantic || {};
  if (sem.surface !== undefined) mergeTokens(t, surfaceTokens(resolveSurface(sem.surface)));
  if (sem.primary !== undefined) {
    if (!isPalette(sem.primary)) throw new Error('wiratheme: semantic.primary must be a palette, use palette()');
    mergeTokens(t, primaryTokens(sem.primary, s950));
  }
  for (const k of SEMANTIC_KEYS) {
    const p = sem[k];
    if (p !== undefined) mergeTokens(t, semanticTokens(k, p, s950));
  }
  if (sem.primaryContrast !== undefined) t.light['primary-contrast'] = sem.primaryContrast;
  if (sem.fontFamily !== undefined) {
    const f = sem.fontFamily;
    t.light['font-family'] = /[,'"]/.test(f) ? f : `'${f}', sans-serif`;
  }
  if (sem.fontSize !== undefined) {
    if (typeof sem.fontSize === 'number') mergeTokens(t, fontTokens({ fontSize: sem.fontSize }));
    else t.light['font-size'] = sem.fontSize;
  }
  if (sem.lineHeight !== undefined) t.light['line-height'] = String(num(sem.lineHeight));
  if (sem.radius !== undefined) mergeTokens(t, radiusTokens(num(sem.radius)));
  if (sem.density !== undefined) mergeTokens(t, densityTokens(sem.density));
  if (sem.shadow !== undefined) mergeTokens(t, shadowTokens(sem.shadow));
  if (sem.focusRing !== undefined) mergeTokens(t, focusTokens(sem.focusRing));
  if (sem.transition !== undefined) mergeTokens(t, transitionTokens(num(sem.transition)));
  if (sem.material !== undefined) mergeTokens(t, materialTokens(sem.material));

  const comps = (set.components || {}) as Record<string, Record<string, Size | boolean> | undefined>;
  for (const spec of COMPONENT_TOKENS) {
    const group = comps[spec.id];
    const v = group ? group[spec.key] : undefined;
    if (v !== undefined) mergeTokens(t, componentValue(spec, v));
  }
  return t;
}

/**
 * Only the tokens an override set touches; derived tokens follow through `var()`.
 * With `scheme: 'dark'` (Sayan, Ratri, sila-dark-*) the dark values are the only values.
 */
export function overridesToTokens(o: ThemeOverrides, scheme: Scheme = 'light'): ThemeTokens {
  const sem = o.semantic || {};
  const s950 = surface950(sem.surface !== undefined ? resolveSurface(sem.surface) : undefined);
  const out = setTokens(o, s950);
  if (o.dark) {
    const d = setTokens(o.dark, s950);
    Object.assign(out.dark, d.light, d.dark);
  }
  if (scheme === 'dark') return { light: { ...out.light, ...out.dark }, dark: {} };
  return out;
}

/** Full token set for a preset made with `definePreset()`. */
export function presetToTokens(preset: ThemePreset): ThemeTokens {
  const t = computeTokens(preset.config);
  for (const o of preset.overrides) mergeTokens(t, overridesToTokens(o, preset.config.scheme));
  return t;
}

export const PRESET_IDS = Object.keys(PRESETS) as PresetId[];
