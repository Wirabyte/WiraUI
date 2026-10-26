import { Generation } from './catalog';
import { generatePalette, SHADES } from './color';
import type { TokenMap } from './tokens';

/**
 * CSS variables the classic and styled themes define, re-created on top of WiraTheme tokens so app styles written for
 * those themes keep working after migrating (e.g. `background: var(--surface-ground)` in an app's own styles).
 * Keys are full custom property names (with their own `--`), emitted next to the `--wt-*` tokens.
 */

const v = (name: string) => `var(--wt-${name})`;

/** Colour palettes those themes expose globally (--blue-500, --p-green-500, …). */
export const PALETTE_BASES: Record<string, string> = {
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  cyan: '#06b6d4',
  pink: '#ec4899',
  indigo: '#6366f1',
  teal: '#14b8a6',
  orange: '#f97316',
  bluegray: '#64748b',
  purple: '#a855f7',
  red: '#ef4444',
  emerald: '#10b981',
  lime: '#84cc16',
  sky: '#0ea5e9',
  violet: '#8b5cf6',
  fuchsia: '#d946ef',
  rose: '#f43f5e',
  amber: '#f59e0b',
};

/** Classic theme.css variables (wiratheme v1). */
function classicAliases(): TokenMap {
  const out: TokenMap = {
    '--primary-color': v('primary-color'),
    '--primary-color-text': v('primary-contrast'),
    '--text-color': v('text'),
    '--text-color-secondary': v('text-muted'),
    '--font-family': v('font-family'),
    '--surface-a': v('card-bg'),
    '--surface-b': v('ground'),
    '--surface-c': v('hover-bg'),
    '--surface-d': v('border'),
    '--surface-e': v('card-bg'),
    '--surface-f': v('card-bg'),
    '--surface-ground': v('ground'),
    '--surface-section': v('card-bg'),
    '--surface-card': v('card-bg'),
    '--surface-overlay': v('overlay-bg'),
    '--surface-border': v('border'),
    '--surface-hover': v('hover-bg'),
    '--border-radius': v('radius-md'),
    '--content-padding': '1.25rem',
    '--inline-spacing': '0.5rem',
    '--focus-ring': v('control-focus-shadow'),
    '--maskbg': v('mask'),
    '--highlight-bg': v('primary-soft'),
    '--highlight-text-color': v('primary-soft-text'),
    '--surface-0': v('surface-0'),
  };
  // Classic palettes are numbered 50 and 100–900 (no 950).
  for (const s of SHADES) {
    if (s === 950) continue;
    out[`--surface-${s}`] = v(`surface-${s}`);
    out[`--gray-${s}`] = v(`surface-${s}`);
    out[`--primary-${s}`] = v(`primary-${s}`);
  }
  for (const [name, base] of Object.entries(PALETTE_BASES)) {
    const p = generatePalette(base);
    for (const s of SHADES) if (s !== 950) out[`--${name}-${s}`] = p[s];
  }
  return out;
}

/** Styled-mode `--p-*` variables (wiratheme v2 and v3). */
function styledAliases(): TokenMap {
  const out: TokenMap = {
    '--p-primary-color': v('primary-color'),
    '--p-primary-contrast-color': v('primary-contrast'),
    '--p-primary-hover-color': v('primary-hover'),
    '--p-primary-active-color': v('primary-active'),
    '--p-text-color': v('text'),
    '--p-text-muted-color': v('text-muted'),
    '--p-content-background': v('card-bg'),
    '--p-content-hover-background': v('hover-bg'),
    '--p-content-border-color': v('border'),
    '--p-content-color': v('text'),
    '--p-highlight-background': v('primary-soft'),
    '--p-highlight-color': v('primary-soft-text'),
    '--p-mask-background': v('mask'),
    '--p-content-border-radius': v('radius-md'),
    '--p-focus-ring-color': v('primary-color'),
    '--p-focus-ring-width': '1px',
    '--p-focus-ring-style': 'solid',
    '--p-focus-ring-offset': '2px',
    '--p-focus-ring-shadow': 'none',
    '--p-disabled-opacity': v('disabled-opacity'),
    '--p-transition-duration': v('transition'),
    '--p-icon-size': '1rem',
    '--p-overlay-modal-background': v('overlay-bg'),
    '--p-overlay-popover-background': v('overlay-bg'),
    '--p-overlay-select-background': v('overlay-bg'),
    '--p-form-field-background': v('field-bg'),
    '--p-form-field-filled-background': v('field-filled-bg'),
    '--p-form-field-disabled-background': v('field-disabled-bg'),
    '--p-form-field-border-color': v('field-border'),
    '--p-form-field-hover-border-color': v('field-hover-border'),
    '--p-form-field-focus-border-color': v('field-focus-border'),
    '--p-form-field-color': v('field-color'),
    '--p-form-field-placeholder-color': v('field-placeholder'),
    '--p-form-field-border-radius': v('input-radius'),
    '--p-border-radius-xs': v('radius-xs'),
    '--p-border-radius-sm': v('radius-sm'),
    '--p-border-radius-md': v('radius-md'),
    '--p-border-radius-lg': v('radius-lg'),
    '--p-border-radius-xl': v('radius-xl'),
    '--p-surface-0': v('surface-0'),
  };
  for (const s of SHADES) {
    out[`--p-primary-${s}`] = v(`primary-${s}`);
    out[`--p-surface-${s}`] = v(`surface-${s}`);
  }
  for (const [name, base] of Object.entries(PALETTE_BASES)) {
    const p = generatePalette(base);
    for (const s of SHADES) out[`--p-${name}-${s}`] = p[s];
  }
  return out;
}

const CLASSIC = classicAliases();
const STYLED = styledAliases();

/** Aliases for a generation; WiraTheme's own design has none. */
export function compatAliases(generation: Generation): TokenMap {
  if (generation === 'classic') return { ...CLASSIC };
  if (generation === 'styled') return { ...STYLED };
  return {};
}

/**
 * Component tokens that read a styled-mode `--p-*` override first, so `--p-card-body-gap: 0px` in an app's styles
 * still removes the card's body gap.
 */
export const STYLED_INPUTS: Record<string, string> = {
  'card-body-gap': '--p-card-body-gap',
  'card-padding': '--p-card-body-padding',
  'card-radius': '--p-card-border-radius',
  'button-radius': '--p-button-border-radius',
};
