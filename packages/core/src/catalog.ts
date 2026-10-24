/** Fixed design data. packages/themes/scripts/gen-scss-data.mjs writes the Sass copy of these tables. */

export const PRIMARY_SWATCHES = [
  /** Wirabyte brand blue (wirabyte.com --wb-primary). */
  { id: 'wira', hex: '#1e7ae0' },
  { id: 'emerald', hex: '#10b981' },
  { id: 'green', hex: '#22c55e' },
  { id: 'lime', hex: '#84cc16' },
  { id: 'teal', hex: '#14b8a6' },
  { id: 'cyan', hex: '#06b6d4' },
  { id: 'sky', hex: '#0ea5e9' },
  { id: 'blue', hex: '#3b82f6' },
  { id: 'indigo', hex: '#6366f1' },
  { id: 'violet', hex: '#8b5cf6' },
  { id: 'purple', hex: '#a855f7' },
  { id: 'fuchsia', hex: '#d946ef' },
  { id: 'pink', hex: '#ec4899' },
  { id: 'rose', hex: '#f43f5e' },
  { id: 'red', hex: '#ef4444' },
  { id: 'orange', hex: '#f97316' },
  { id: 'amber', hex: '#f59e0b' },
  { id: 'yellow', hex: '#eab308' },
] as const;
export type SwatchId = (typeof PRIMARY_SWATCHES)[number]['id'];

/** Surface scales: index 0 is shade 50, index 10 is shade 950. Shade 0 is always white. */
export const SURFACES = {
  slate: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', '#020617'],
  gray: ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827', '#030712'],
  zinc: ['#fafafa', '#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#52525b', '#3f3f46', '#27272a', '#18181b', '#09090b'],
  neutral: ['#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626', '#171717', '#0a0a0a'],
  stone: ['#fafaf9', '#f5f5f4', '#e7e5e4', '#d6d3d1', '#a8a29e', '#78716c', '#57534e', '#44403c', '#292524', '#1c1917', '#0c0a09'],
  /** The grays of the classic Sila and Arun themes (text #495057, borders #ced4da / #dee2e6). */
  classic: ['#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', '#6c757d', '#495057', '#343a40', '#212529', '#1a1d21', '#0f1114'],
  /** Sayan: the classic dim blue-gray dark theme (card #1f2d40, ground #17212f). */
  sayan: ['#f1f5f9', '#dfe7ef', '#c7d2e0', '#9fb1c9', '#6f87a8', '#4c6587', '#3a5070', '#304562', '#1f2d40', '#17212f', '#0e1622'],
  /** Ratri: the classic neutral dark theme (card #1e1e1e, ground #121212). */
  ratri: ['#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#383838', '#1e1e1e', '#121212', '#0a0a0a'],
  /** Classic Sila dark (card #071426, ground #040d19, borders #0b213f). */
  navy: ['#f0f4fa', '#dde6f2', '#c2d0e5', '#94abcc', '#6683ad', '#3e5c87', '#28456b', '#163050', '#0b213f', '#071426', '#040d19'],
  /** Wirabyte's neutrals (wirabyte.com): cool off-white page, navy darks. */
  ink: ['#f6f8fc', '#eef2f9', '#e3e8f1', '#cfd7e4', '#98a5b8', '#556274', '#334155', '#2a3a52', '#1c2839', '#0e1624', '#070b14'],
} as const;
export type SurfaceId = keyof typeof SURFACES;

export const FONTS = ['Kanit', 'Sarabun', 'Prompt', 'Noto Sans Thai', 'IBM Plex Sans Thai', 'Anuphan', 'Inter', 'Roboto'] as const;

/** Density multiplies every padding a preset defines (1 = the preset's own spacing). */
export const DENSITY: Record<'compact' | 'normal' | 'comfortable', number> = {
  compact: 0.8,
  normal: 1,
  comfortable: 1.2,
};
export type DensityId = keyof typeof DENSITY;

/** Elevation sets: [cards, raised buttons, overlays]. */
export const SHADOWS: Record<'none' | 'subtle' | 'soft' | 'elevated' | 'material' | 'mali' | 'sila' | 'phet', [string, string, string]> = {
  none: ['none', 'none', 'none'],
  subtle: ['0 1px 2px rgba(15, 23, 42, 0.06)', '0 2px 8px rgba(15, 23, 42, 0.08)', '0 12px 32px rgba(15, 23, 42, 0.14)'],
  soft: ['0 2px 6px rgba(15, 23, 42, 0.06)', '0 8px 24px rgba(15, 23, 42, 0.08)', '0 20px 48px rgba(15, 23, 42, 0.14)'],
  elevated: ['0 1px 3px rgba(15, 23, 42, 0.14)', '0 4px 12px rgba(15, 23, 42, 0.18)', '0 16px 40px rgba(15, 23, 42, 0.26)'],
  material: [
    '0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12)',
    '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
    '0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12)',
  ],
  mali: [
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  ],
  sila: [
    '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
    '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
    '0 1px 3px rgba(0, 0, 0, 0.3)',
  ],
  phet: [
    '0 1px 4px 0 rgba(0, 0, 0, 0.1)',
    '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  ],
};
export type ShadowId = keyof typeof SHADOWS;

/**
 * How focus shows. ring: soft glow (Sila). outline: thin outline with a gap (Mali). inset: a thicker
 * border on fields and no glow on controls (Material). bold: 2px outlines (Phet).
 */
export const FOCUS_STYLES = ['ring', 'outline', 'inset', 'bold'] as const;
export type FocusRing = (typeof FOCUS_STYLES)[number];

export const SEMANTIC_KEYS = ['success', 'info', 'warn', 'danger', 'help'] as const;
export type SemanticKey = (typeof SEMANTIC_KEYS)[number];
export const SEMANTIC_DEFAULTS: Record<SemanticKey, string> = {
  success: '#22c55e',
  info: '#0ea5e9',
  warn: '#f59e0b',
  danger: '#ef4444',
  help: '#a855f7',
};

/**
 * Look families. `classic` is the v1 look (Sila, Arun, Sayan, Ratri, Material themes), `styled` the v2/v3 look (Mali, Sila, Material, Phet presets)
 * (v2 and v3), `wira` is WiraTheme's own design (v3). Each family's tokens live in families.ts.
 */
export type FamilyId = 'sila-classic' | 'arun' | 'material-classic' | 'mali' | 'sila' | 'material' | 'phet' | 'wira';
export type Generation = 'classic' | 'styled' | 'wira';
export const FAMILY_GENERATION: Record<FamilyId, Generation> = {
  'sila-classic': 'classic',
  arun: 'classic',
  'material-classic': 'classic',
  mali: 'styled',
  sila: 'styled',
  material: 'styled',
  phet: 'styled',
  wira: 'wira',
};

export type Scheme = 'light' | 'dark';
/** `glass` turns cards and overlays into frosted Liquid Glass panels (v3). */
export type MaterialMode = 'solid' | 'glass';

export interface PresetDefinition {
  family: FamilyId;
  label: string;
  primary: string;
  surface: SurfaceId;
  semantic: Record<SemanticKey, string>;
  fontFamily: string;
  /** px; emitted as rem so apps that scale the root font size scale components too. */
  fontSize: number;
  lineHeight: number;
  radius: number;
  density: DensityId;
  shadow: ShadowId;
  ripple: boolean;
  focusRing: FocusRing;
  transition: number;
  scheme: Scheme;
  material?: MaterialMode;
}

const PRIME_SEMANTIC_15: Record<SemanticKey, string> = { success: '#22c55e', info: '#3b82f6', warn: '#f59e0b', danger: '#ef4444', help: '#a855f7' };
const ARUN_SEMANTIC: Record<SemanticKey, string> = { success: '#689f38', info: '#0288d1', warn: '#fbc02d', danger: '#d32f2f', help: '#9c27b0' };
// Each styled preset has its own status colours, so switching presets changes the whole feel:
/** Mali: soft, cool tones (emerald, sky, orange, rose, violet). */
const MALI_SEMANTIC: Record<SemanticKey, string> = { success: '#10b981', info: '#0ea5e9', warn: '#f97316', danger: '#f43f5e', help: '#8b5cf6' };
/** Sila: the saturated tones of the 2019–2022 admin look. */
const SILA_SEMANTIC: Record<SemanticKey, string> = { success: '#22c55e', info: '#3b82f6', warn: '#f59e0b', danger: '#ef4444', help: '#a855f7' };
/** Phet: one step darker for crisp contrast. */
const PHET_SEMANTIC: Record<SemanticKey, string> = { success: '#16a34a', info: '#2563eb', warn: '#ea580c', danger: '#dc2626', help: '#9333ea' };
/** Material: the Material Design palette. */
const MATERIAL_SEMANTIC: Record<SemanticKey, string> = { success: '#4caf50', info: '#2196f3', warn: '#ff9800', danger: '#f44336', help: '#9c27b0' };

const classic = { fontFamily: 'Kanit', fontSize: 16, lineHeight: 1.5, density: 'normal', transition: 200, scheme: 'light' } as const;
const styled = { fontFamily: 'Kanit', fontSize: 16, lineHeight: 1.5, density: 'normal', transition: 200, scheme: 'light' } as const;

export const PRESETS = {
  // ---- v1: classic look ----
  'sila-classic': { ...classic, family: 'sila-classic', label: 'Sila', primary: '#14b8a6', surface: 'classic', semantic: PRIME_SEMANTIC_15, radius: 6, shadow: 'material', ripple: false, focusRing: 'ring' },
  arun: { ...classic, family: 'arun', label: 'Arun', primary: '#2196f3', surface: 'classic', semantic: ARUN_SEMANTIC, radius: 3, shadow: 'material', ripple: false, focusRing: 'ring' },
  sayan: { ...classic, family: 'arun', label: 'Sayan', primary: '#2196f3', surface: 'sayan', semantic: ARUN_SEMANTIC, radius: 3, shadow: 'material', ripple: false, focusRing: 'ring', scheme: 'dark' },
  ratri: { ...classic, family: 'arun', label: 'Ratri', primary: '#2196f3', surface: 'ratri', semantic: ARUN_SEMANTIC, radius: 3, shadow: 'material', ripple: false, focusRing: 'ring', scheme: 'dark' },
  'material-classic': { ...classic, family: 'material-classic', label: 'Material', fontFamily: 'Roboto', primary: '#3f51b5', surface: 'gray', semantic: ARUN_SEMANTIC, radius: 4, shadow: 'material', ripple: true, focusRing: 'inset' },
  // ---- v2 / v3: styled look ----
  mali: { ...styled, family: 'mali', label: 'Mali', primary: '#10b981', surface: 'slate', semantic: MALI_SEMANTIC, radius: 6, shadow: 'mali', ripple: false, focusRing: 'outline' },
  sila: { ...styled, family: 'sila', label: 'Sila', primary: '#10b981', surface: 'slate', semantic: SILA_SEMANTIC, radius: 6, shadow: 'sila', ripple: false, focusRing: 'ring' },
  material: { ...styled, family: 'material', label: 'Material', fontFamily: 'Roboto', primary: '#10b981', surface: 'slate', semantic: MATERIAL_SEMANTIC, radius: 6, shadow: 'material', ripple: true, focusRing: 'inset' },
  phet: { ...styled, family: 'phet', label: 'Phet', primary: '#10b981', surface: 'slate', semantic: PHET_SEMANTIC, radius: 6, shadow: 'phet', ripple: false, focusRing: 'bold', transition: 0 },
  // ---- v3: WiraTheme's own ----
  wira: { family: 'wira', label: 'Wira', primary: '#1e7ae0', surface: 'ink', semantic: SEMANTIC_DEFAULTS, fontFamily: 'Kanit', fontSize: 14, lineHeight: 1.6, radius: 6, density: 'normal', shadow: 'subtle', ripple: false, focusRing: 'ring', transition: 150, scheme: 'light' },
  lanna: { family: 'wira', label: 'Lanna', primary: '#0d9488', surface: 'stone', semantic: SEMANTIC_DEFAULTS, fontFamily: 'Sarabun', fontSize: 15, lineHeight: 1.7, radius: 12, density: 'comfortable', shadow: 'soft', ripple: false, focusRing: 'ring', transition: 200, scheme: 'light' },
  siam: { family: 'wira', label: 'Siam', primary: '#6366f1', surface: 'gray', semantic: SEMANTIC_DEFAULTS, fontFamily: 'Prompt', fontSize: 14, lineHeight: 1.6, radius: 4, density: 'normal', shadow: 'elevated', ripple: true, focusRing: 'outline', transition: 200, scheme: 'light' },
  nakhon: { family: 'wira', label: 'Nakhon', primary: '#3b82f6', surface: 'zinc', semantic: SEMANTIC_DEFAULTS, fontFamily: 'IBM Plex Sans Thai', fontSize: 13, lineHeight: 1.55, radius: 2, density: 'compact', shadow: 'none', ripple: false, focusRing: 'outline', transition: 100, scheme: 'light' },
  glass: { family: 'wira', label: 'Glass', primary: '#0a84ff', surface: 'slate', semantic: SEMANTIC_DEFAULTS, fontFamily: 'Anuphan', fontSize: 14, lineHeight: 1.6, radius: 14, density: 'normal', shadow: 'soft', ripple: false, focusRing: 'ring', transition: 250, scheme: 'light', material: 'glass' },
} satisfies Record<string, PresetDefinition>;
export type PresetId = keyof typeof PRESETS;
export const PRESET_NAMES = Object.fromEntries(Object.entries(PRESETS).map(([id, p]) => [id, p.label])) as Record<PresetId, string>;
/** The constant each preset is exported as from `wiratheme/presets` (`'sila-classic'` → `SilaClassic`). */
export function presetExportName(id: PresetId): string {
  return id.replace(/(^|-)([a-z])/g, (_m, _d, c: string) => c.toUpperCase());
}

/**
 * Ready-made classic themes named after the theme folders apps already reference, so `…/themes/sila-light-teal/theme.css`
 * becomes `wiratheme/themes/sila-light-teal/theme.css`. For v2 and v3 every preset is also a theme of its own name.
 */
export interface NamedTheme {
  preset: PresetId;
  primary?: string;
  surface?: SurfaceId;
  scheme?: Scheme;
  /** Text on primary buttons when white does not read well (Arun/Sayan/Ratri orange). */
  primaryContrast?: string;
}
const silaDark = { preset: 'sila-classic', surface: 'navy', scheme: 'dark' } as const;
const mdDark = { preset: 'material-classic', surface: 'ratri', scheme: 'dark' } as const;
export const CLASSIC_THEMES: Record<string, NamedTheme> = {
  'sila-light-blue': { preset: 'sila-classic', primary: '#3b82f6' },
  'sila-light-indigo': { preset: 'sila-classic', primary: '#6366f1' },
  'sila-light-purple': { preset: 'sila-classic', primary: '#8b5cf6' },
  'sila-light-teal': { preset: 'sila-classic', primary: '#14b8a6' },
  /** Sila with the green most existing Wirabyte apps use (not the brand blue: it matches those apps). */
  'sila-light-wira': { preset: 'sila-classic', primary: '#00a86b' },
  'sila-dark-blue': { ...silaDark, primary: '#3b82f6' },
  'sila-dark-indigo': { ...silaDark, primary: '#6366f1' },
  'sila-dark-purple': { ...silaDark, primary: '#8b5cf6' },
  'sila-dark-teal': { ...silaDark, primary: '#14b8a6' },
  'arun-blue': { preset: 'arun', primary: '#2196f3' },
  'arun-green': { preset: 'arun', primary: '#4caf50' },
  'arun-orange': { preset: 'arun', primary: '#ffc107', primaryContrast: '#212529' },
  'arun-purple': { preset: 'arun', primary: '#9c27b0' },
  'sayan-blue': { preset: 'sayan', primary: '#2196f3' },
  'sayan-green': { preset: 'sayan', primary: '#4caf50' },
  'sayan-orange': { preset: 'sayan', primary: '#ffc107', primaryContrast: '#212529' },
  'sayan-purple': { preset: 'sayan', primary: '#9c27b0' },
  'ratri-blue': { preset: 'ratri', primary: '#2196f3' },
  'ratri-green': { preset: 'ratri', primary: '#4caf50' },
  'ratri-orange': { preset: 'ratri', primary: '#ffc107', primaryContrast: '#212529' },
  'ratri-purple': { preset: 'ratri', primary: '#9c27b0' },
  'md-light-indigo': { preset: 'material-classic', primary: '#3f51b5' },
  'md-light-deeppurple': { preset: 'material-classic', primary: '#673ab7' },
  'md-dark-indigo': { ...mdDark, primary: '#3f51b5' },
  'md-dark-deeppurple': { ...mdDark, primary: '#673ab7' },
};

export type MajorVersion = 1 | 2 | 3;
/** What each wiratheme major offers. v1 has the classic looks, v2 the styled ones, v3 adds WiraTheme's own presets. */
export const VERSION_CATALOG: Record<MajorVersion, { presets: PresetId[]; defaultPreset: PresetId; themes: string[]; defaultTheme: string }> = {
  1: {
    presets: ['sila-classic', 'arun', 'sayan', 'ratri', 'material-classic'],
    defaultPreset: 'sila-classic',
    themes: Object.keys(CLASSIC_THEMES),
    defaultTheme: 'sila-light-teal',
  },
  2: { presets: ['mali', 'sila', 'material', 'phet'], defaultPreset: 'mali', themes: ['mali', 'sila', 'material', 'phet'], defaultTheme: 'mali' },
  3: {
    presets: ['mali', 'sila', 'material', 'phet', 'wira', 'lanna', 'siam', 'nakhon', 'glass'],
    defaultPreset: 'mali',
    themes: ['mali', 'sila', 'material', 'phet', 'wira', 'lanna', 'siam', 'nakhon', 'glass'],
    defaultTheme: 'mali',
  },
};

export type ComponentId = 'button' | 'input' | 'card' | 'table' | 'dialog' | 'tag';

export interface ComponentTokenSpec {
  id: ComponentId;
  key: string;
  /** CSS custom property name without the `--wt-` prefix. */
  css: string;
  type: 'px' | 'select' | 'bool';
  min?: number;
  max?: number;
  options?: number[];
}

/** Per-component knobs the Designer exposes. Their default comes from the preset's family. */
export const COMPONENT_TOKENS: ComponentTokenSpec[] = [
  { id: 'button', key: 'fontWeight', css: 'button-font-weight', type: 'select', options: [400, 500, 600, 700] },
  { id: 'button', key: 'radius', css: 'button-radius', type: 'px', min: 0, max: 28 },
  { id: 'button', key: 'paddingX', css: 'button-padding-x', type: 'px', min: 6, max: 36 },
  { id: 'input', key: 'radius', css: 'input-radius', type: 'px', min: 0, max: 24 },
  { id: 'card', key: 'padding', css: 'card-padding', type: 'px', min: 8, max: 48 },
  { id: 'card', key: 'radius', css: 'card-radius', type: 'px', min: 0, max: 32 },
  { id: 'card', key: 'bodyGap', css: 'card-body-gap', type: 'px', min: 0, max: 32 },
  { id: 'card', key: 'bordered', css: 'card-border-width', type: 'bool' },
  { id: 'table', key: 'rowHeight', css: 'table-row-height', type: 'px', min: 28, max: 72 },
  { id: 'table', key: 'striped', css: 'table-stripe-bg', type: 'bool' },
  { id: 'dialog', key: 'radius', css: 'dialog-radius', type: 'px', min: 0, max: 32 },
  { id: 'tag', key: 'pill', css: 'tag-radius', type: 'bool' },
];
