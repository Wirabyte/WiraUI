export interface WtAccordionTabEvent {
  index: number;
  /** Panels by value: the panel's value. */
  value?: unknown;
}

/**
 * The `gap` input of wt-accordion as a CSS length: `null` keeps the theme's look; `true` / `''` is 0.75rem; a number is
 * px; `false` / `0` joins the panels.
 */
export function ɵaccordionGap(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (v === true || v === '' || v === 'true') return '0.75rem';
  if (v === false || v === 'false') return '0px';
  const n = Number(v);
  if (Number.isFinite(n)) return `${Math.max(0, n)}px`;
  return String(v);
}
