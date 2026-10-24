/** Fixed design data. tools/gen-scss-data.mjs writes the Sass copy of these tables. */

export const PRIMARY_SWATCHES = [
  { id: 'wira', hex: '#00a86b' },
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
} as const;
export type SurfaceId = keyof typeof SURFACES;

export const FONTS = ['Kanit', 'Sarabun', 'Prompt', 'Noto Sans Thai', 'IBM Plex Sans Thai', 'Anuphan'] as const;

export interface DensitySet {
  fieldPy: number;
  fieldPx: number;
  btnPy: number;
  btnPx: number;
  gap: number;
  cardPad: number;
  row: number;
}
export const DENSITY: Record<'compact' | 'normal' | 'comfortable', DensitySet> = {
  compact: { fieldPy: 6, fieldPx: 10, btnPy: 6, btnPx: 12, gap: 8, cardPad: 16, row: 36 },
  normal: { fieldPy: 8, fieldPx: 12, btnPy: 8, btnPx: 16, gap: 12, cardPad: 20, row: 44 },
  comfortable: { fieldPy: 10, fieldPx: 14, btnPy: 10, btnPx: 20, gap: 16, cardPad: 24, row: 52 },
};
export type DensityId = keyof typeof DENSITY;

export const SHADOWS: Record<'none' | 'subtle' | 'soft' | 'elevated', [string, string, string]> = {
  none: ['none', 'none', 'none'],
  subtle: ['0 1px 2px rgba(15, 23, 42, 0.06)', '0 2px 8px rgba(15, 23, 42, 0.08)', '0 12px 32px rgba(15, 23, 42, 0.14)'],
  soft: ['0 2px 6px rgba(15, 23, 42, 0.06)', '0 8px 24px rgba(15, 23, 42, 0.08)', '0 20px 48px rgba(15, 23, 42, 0.14)'],
  elevated: ['0 1px 3px rgba(15, 23, 42, 0.14)', '0 4px 12px rgba(15, 23, 42, 0.18)', '0 16px 40px rgba(15, 23, 42, 0.26)'],
};
export type ShadowId = keyof typeof SHADOWS;

export const SEMANTIC_KEYS = ['success', 'info', 'warn', 'danger', 'help'] as const;
export type SemanticKey = (typeof SEMANTIC_KEYS)[number];
export const SEMANTIC_DEFAULTS: Record<SemanticKey, string> = {
  success: '#22c55e',
  info: '#0ea5e9',
  warn: '#f59e0b',
  danger: '#ef4444',
  help: '#a855f7',
};

export interface PresetDefinition {
  primary: string;
  surface: SurfaceId;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  radius: number;
  density: DensityId;
  shadow: ShadowId;
  ripple: boolean;
  focusRing: 'ring' | 'outline';
  transition: number;
  buttonWeight: number;
  cardBorder: boolean;
}

export const PRESETS = {
  wira: {
    primary: '#00a86b', surface: 'slate', fontFamily: 'Kanit', fontSize: 14, lineHeight: 1.6, radius: 6,
    density: 'normal', shadow: 'subtle', ripple: false, focusRing: 'ring', transition: 150, buttonWeight: 500, cardBorder: true,
  },
  lanna: {
    primary: '#0d9488', surface: 'stone', fontFamily: 'Sarabun', fontSize: 15, lineHeight: 1.7, radius: 12,
    density: 'comfortable', shadow: 'soft', ripple: false, focusRing: 'ring', transition: 200, buttonWeight: 600, cardBorder: false,
  },
  siam: {
    primary: '#6366f1', surface: 'gray', fontFamily: 'Prompt', fontSize: 14, lineHeight: 1.6, radius: 4,
    density: 'normal', shadow: 'elevated', ripple: true, focusRing: 'outline', transition: 200, buttonWeight: 500, cardBorder: false,
  },
  nakhon: {
    primary: '#3b82f6', surface: 'zinc', fontFamily: 'IBM Plex Sans Thai', fontSize: 13, lineHeight: 1.55, radius: 2,
    density: 'compact', shadow: 'none', ripple: false, focusRing: 'outline', transition: 100, buttonWeight: 600, cardBorder: true,
  },
} satisfies Record<string, PresetDefinition>;
export type PresetId = keyof typeof PRESETS;
export const PRESET_NAMES: Record<PresetId, string> = { wira: 'Wira', lanna: 'Lanna', siam: 'Siam', nakhon: 'Nakhon' };

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

/** Per-component tokens the Designer exposes. Defaults live in tokens.ts (`componentDefault`). */
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
