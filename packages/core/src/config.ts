import {
  CLASSIC_THEMES,
  COMPONENT_TOKENS,
  ComponentId,
  DENSITY,
  DensityId,
  FOCUS_STYLES,
  FocusRing,
  MaterialMode,
  PRESETS,
  PresetId,
  Scheme,
  SEMANTIC_KEYS,
  SemanticKey,
  SHADOWS,
  ShadowId,
  SURFACES,
  SurfaceId,
} from './catalog';
import { hexToRgb, isHex, isPalette, Palette, rgbToHex, SHADES } from './color';

export type DarkMode = 'none' | 'class' | 'media';
export type ComponentValues = Partial<Record<ComponentId, Record<string, number | boolean>>>;

/**
 * Everything a theme is made of. This is the object the Designer edits and every
 * exported file embeds on its `wiraui-config` line.
 */
export interface ThemeConfig {
  v: 1;
  preset: PresetId;
  primary: string;
  /** Hand-edited shades; null means "generate from `primary`". */
  primaryShades: Palette | null;
  surface: SurfaceId;
  /** Text on primary buttons; null keeps the family's choice (white for the classic and styled looks, best contrast for Wira). */
  primaryContrast: string | null;
  semantic: Record<SemanticKey, string>;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  radius: number;
  density: DensityId;
  shadow: ShadowId;
  ripple: boolean;
  focusRing: FocusRing;
  transition: number;
  darkMode: DarkMode;
  /** `dark` makes the dark colours the only colours (Sayan, Ratri, sila-dark-*); dark mode switching then does nothing. */
  scheme: Scheme;
  material: MaterialMode;
  components: ComponentValues;
}

export function isPresetId(value: unknown): value is PresetId {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(PRESETS, value);
}

export function defaults(preset: PresetId | string = 'wira'): ThemeConfig {
  const id: PresetId = isPresetId(preset) ? preset : 'wira';
  const p: (typeof PRESETS)[PresetId] = PRESETS[id];
  return {
    v: 1,
    preset: id,
    primary: p.primary,
    primaryShades: null,
    surface: p.surface,
    primaryContrast: null,
    semantic: { ...p.semantic },
    fontFamily: p.fontFamily,
    fontSize: p.fontSize,
    lineHeight: p.lineHeight,
    radius: p.radius,
    density: p.density,
    shadow: p.shadow,
    ripple: p.ripple,
    focusRing: p.focusRing,
    transition: p.transition,
    darkMode: 'class',
    scheme: p.scheme,
    material: 'material' in p ? p.material : 'solid',
    components: {},
  };
}

export function isThemeName(value: unknown): value is string {
  return typeof value === 'string' && (Object.prototype.hasOwnProperty.call(CLASSIC_THEMES, value) || isPresetId(value));
}

/** Config of a ready-made theme (`'sila-light-teal'`, `'sayan-blue'`, `'mali'` …). */
export function themeConfig(name: string): ThemeConfig {
  if (isPresetId(name)) return defaults(name);
  const t = CLASSIC_THEMES[name];
  if (!t) throw new Error(`wiraui: unknown theme ${name}`);
  const c = defaults(t.preset);
  if (t.primary) c.primary = t.primary;
  if (t.surface) c.surface = t.surface;
  if (t.scheme) c.scheme = t.scheme;
  if (t.primaryContrast) c.primaryContrast = t.primaryContrast;
  return c;
}

/** Lowercase 6-digit hex for every shade, the form the Sass engine always emits. */
function canonicalPalette(p: Palette): Palette {
  const out = {} as Palette;
  for (const s of SHADES) out[s] = rgbToHex(hexToRgb(p[s]));
  return out;
}

function pick<T>(value: unknown, ok: (v: unknown) => boolean, fallback: T): T {
  return ok(value) ? (value as T) : fallback;
}
const isNum = (v: unknown) => typeof v === 'number' && isFinite(v);

/** Fills gaps from the preset and drops anything invalid. Accepts configs from older Designer builds. */
export function normalize(raw: unknown): ThemeConfig {
  if (!raw || typeof raw !== 'object') throw new Error('bad-config');
  const r = raw as Record<string, unknown>;
  const base = defaults(typeof r['preset'] === 'string' ? r['preset'] : 'wira');
  const semIn = (r['semantic'] && typeof r['semantic'] === 'object' ? r['semantic'] : {}) as Record<string, unknown>;
  const semantic = { ...base.semantic };
  for (const k of SEMANTIC_KEYS) if (isHex(semIn[k])) semantic[k] = (semIn[k] as string).toLowerCase();

  const components: ComponentValues = {};
  const compIn = (r['components'] && typeof r['components'] === 'object' ? r['components'] : {}) as Record<string, unknown>;
  for (const spec of COMPONENT_TOKENS) {
    const group = compIn[spec.id] as Record<string, unknown> | undefined;
    const v = group ? group[spec.key] : undefined;
    const valid = spec.type === 'bool' ? typeof v === 'boolean' : isNum(v);
    if (valid) (components[spec.id] = components[spec.id] || {})[spec.key] = v as number | boolean;
  }

  return {
    v: 1,
    preset: base.preset,
    primary: isHex(r['primary']) ? (r['primary'] as string).toLowerCase() : base.primary,
    primaryShades: isPalette(r['primaryShades']) ? canonicalPalette(r['primaryShades'] as Palette) : null,
    surface: pick(r['surface'], (v) => typeof v === 'string' && v in SURFACES, base.surface),
    primaryContrast: isHex(r['primaryContrast']) ? (r['primaryContrast'] as string).toLowerCase() : null,
    semantic,
    fontFamily: pick(r['fontFamily'], (v) => typeof v === 'string' && v.trim() !== '', base.fontFamily),
    fontSize: pick(r['fontSize'], isNum, base.fontSize),
    lineHeight: pick(r['lineHeight'], isNum, base.lineHeight),
    radius: pick(r['radius'], isNum, base.radius),
    density: pick(r['density'], (v) => typeof v === 'string' && v in DENSITY, base.density),
    shadow: pick(r['shadow'], (v) => typeof v === 'string' && v in SHADOWS, base.shadow),
    ripple: pick(r['ripple'], (v) => typeof v === 'boolean', base.ripple),
    focusRing: pick(r['focusRing'], (v) => (FOCUS_STYLES as readonly unknown[]).includes(v), base.focusRing),
    transition: pick(r['transition'], isNum, base.transition),
    darkMode: pick(r['darkMode'], (v) => v === 'none' || v === 'class' || v === 'media', base.darkMode),
    scheme: pick(r['scheme'], (v) => v === 'light' || v === 'dark', base.scheme),
    material: pick(r['material'], (v) => v === 'solid' || v === 'glass', base.material),
    components,
  };
}

export const SCALAR_FIELDS = [
  'primary',
  'surface',
  'primaryContrast',
  'fontFamily',
  'fontSize',
  'lineHeight',
  'radius',
  'density',
  'shadow',
  'focusRing',
  'transition',
  'scheme',
  'material',
] as const;
export type ScalarField = (typeof SCALAR_FIELDS)[number];

export interface ThemeDiff {
  primary?: string;
  primaryShades?: Palette;
  surface?: SurfaceId;
  primaryContrast?: string | null;
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
  radius?: number;
  density?: DensityId;
  shadow?: ShadowId;
  focusRing?: FocusRing;
  transition?: number;
  scheme?: Scheme;
  material?: MaterialMode;
  semantic?: Partial<Record<SemanticKey, string>>;
  components?: ComponentValues;
}

/** What differs from the preset's own defaults. Exporters use this for overrides files. */
export function diff(c: ThemeConfig): ThemeDiff {
  const d = defaults(c.preset);
  const out: ThemeDiff = {};
  const o = out as Record<string, unknown>;
  for (const k of SCALAR_FIELDS) if (c[k] !== d[k]) o[k] = c[k];
  if (c.primaryShades) out.primaryShades = c.primaryShades;
  const sem: Partial<Record<SemanticKey, string>> = {};
  for (const k of SEMANTIC_KEYS) if (c.semantic[k].toLowerCase() !== d.semantic[k].toLowerCase()) sem[k] = c.semantic[k];
  if (Object.keys(sem).length) out.semantic = sem;
  const comps: ComponentValues = {};
  for (const spec of COMPONENT_TOKENS) {
    const group = c.components[spec.id];
    if (group && group[spec.key] !== undefined) (comps[spec.id] = comps[spec.id] || {})[spec.key] = group[spec.key];
  }
  if (Object.keys(comps).length) out.components = comps;
  return out;
}

/** Number of individual values that differ from the preset. */
export function changeCount(c: ThemeConfig): number {
  const d = diff(c);
  let n = 0;
  for (const k of Object.keys(d)) {
    if (k === 'semantic') n += Object.keys(d.semantic || {}).length;
    else if (k === 'components') for (const g of Object.values(d.components || {})) n += Object.keys(g || {}).length;
    else n++;
  }
  return n;
}
