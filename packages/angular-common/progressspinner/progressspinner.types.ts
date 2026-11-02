/** Where the label goes: under the ring (default) or beside it. */
export type WuProgressSpinnerLabelPosition = 'bottom' | 'right';

/** `[multicolor]`: unset = the preset's choice, a bare attribute = true, `"false"` = false. */
export function ɵspinnerMulticolor(v: unknown): boolean | undefined {
  if (v === undefined || v === null) return undefined;
  return v === '' || (v !== false && v !== 'false');
}

/**
 * The four colours the ring cycles through, as CSS variables for the host: own `colors` (repeated to fill four),
 * the theme's colours for `multicolor`, the primary colour only for `multicolor: false`, else nothing (the preset's).
 */
export function ɵspinnerColors(multicolor: boolean | undefined, colors: readonly string[] | null | undefined): Record<string, string> | null {
  const own = (colors || []).filter((c) => typeof c === 'string' && c.trim());
  const list = own.length
    ? own
    : multicolor === true
      ? ['var(--wu-primary-color)', 'var(--wu-info-color)', 'var(--wu-success-color)', 'var(--wu-warn-color)']
      : multicolor === false
        ? ['var(--wu-primary-color)']
        : null;
  if (!list) return null;
  const out: Record<string, string> = {};
  for (let i = 0; i < 4; i++) out[`--wu-spinner-color-${i + 1}`] = list[i % list.length];
  return out;
}
