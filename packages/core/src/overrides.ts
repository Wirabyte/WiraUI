import { COMPONENT_TOKENS, DensityId, PRESETS, PresetId, PRIMARY_SWATCHES, SEMANTIC_KEYS, ShadowId, SURFACES, SurfaceId } from './catalog';
import { FocusRing, Material, ThemeConfig, defaults } from './config';
import { generatePalette, isHex, isPalette, Palette } from './color';
import {
  componentValue,
  computeTokens,
  densityTokens,
  emptyTokens,
  focusRingTokens,
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
  fontFamily?: string;
  fontSize?: Size;
  lineHeight?: Size;
  radius?: Size;
  density?: DensityId;
  shadow?: ShadowId;
  focusRing?: FocusRing;
  transition?: Size;
  material?: Material;
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
}

export interface ThemePreset {
  readonly wtPreset: true;
  readonly name: string;
  readonly config: ThemeConfig;
  readonly overrides: ThemeOverrides[];
}

/**
 * A 50–950 palette from a hex colour (`'#00a86b'`) or a built-in swatch reference (`'{emerald}'`).
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
  const name = id.charAt(0).toUpperCase() + id.slice(1);
  return { wtPreset: true, name, config: defaults(id), overrides: [] };
}
export const Wira = makePreset('wira');
export const Lanna = makePreset('lanna');
export const Siam = makePreset('siam');
export const Nakhon = makePreset('nakhon');
export const PRESET_LIST: Record<PresetId, ThemePreset> = { wira: Wira, lanna: Lanna, siam: Siam, nakhon: Nakhon };

/** A new preset: `base` plus your changes. Use it with `provideWiraTheme({ preset })` when there is no SCSS/CSS theme file. */
export function definePreset(base: ThemePreset, overrides: ThemeOverrides): ThemePreset {
  return { wtPreset: true, name: base.name + '+', config: base.config, overrides: base.overrides.concat(overrides) };
}

export function isThemePreset(value: unknown): value is ThemePreset {
  return !!value && typeof value === 'object' && (value as ThemePreset).wtPreset === true;
}

const num = (v: Size): number => (typeof v === 'number' ? v : parseFloat(v));
const size = (v: Size): string => (typeof v === 'number' ? v + 'px' : v);

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
  if (sem.fontFamily !== undefined) {
    const f = sem.fontFamily;
    t.light['font-family'] = /[,'"]/.test(f) ? f : `'${f}', sans-serif`;
  }
  if (sem.fontSize !== undefined) t.light['font-size'] = size(sem.fontSize);
  if (sem.lineHeight !== undefined) t.light['line-height'] = String(num(sem.lineHeight));
  if (sem.radius !== undefined) mergeTokens(t, radiusTokens(num(sem.radius)));
  if (sem.density !== undefined) mergeTokens(t, densityTokens(sem.density));
  if (sem.shadow !== undefined) mergeTokens(t, shadowTokens(sem.shadow));
  if (sem.focusRing !== undefined) mergeTokens(t, focusRingTokens(sem.focusRing));
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

/** Only the tokens an override set touches; derived tokens follow through `var()`. */
export function overridesToTokens(o: ThemeOverrides): ThemeTokens {
  const sem = o.semantic || {};
  const s950 = surface950(sem.surface !== undefined ? resolveSurface(sem.surface) : undefined);
  const out = setTokens(o, s950);
  if (o.dark) {
    const d = setTokens(o.dark, s950);
    Object.assign(out.dark, d.light, d.dark);
  }
  return out;
}

/** Full token set for a preset made with `definePreset()`. */
export function presetToTokens(preset: ThemePreset): ThemeTokens {
  const t = computeTokens(preset.config);
  for (const o of preset.overrides) mergeTokens(t, overridesToTokens(o));
  return t;
}

export const PRESET_IDS = Object.keys(PRESETS) as PresetId[];
