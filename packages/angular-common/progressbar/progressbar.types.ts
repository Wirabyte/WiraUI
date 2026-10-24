export type WtProgressBarMode = 'determinate' | 'indeterminate';

/** Context of `<ng-template #content let-value let-max="max" let-percent="percent">`. */
export interface WtProgressBarContext {
  $implicit: number;
  value: number;
  max: number;
  /** 0–100, rounded. */
  percent: number;
}

const counts = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

/** Share of `max` as 0–100, rounded. */
export function ɵprogressPercent(value: number, max: number): number {
  if (!(max > 0)) return 0;
  return Math.round(Math.min(100, Math.max(0, (value / max) * 100)));
}

/**
 * What the bar says. On the usual 0–100 scale: `64%`. With another `max` the bar counts:
 * `1,000 / 2,500`, followed by the unit when it is a word (`1,000 / 2,500 รายการ`).
 */
export function ɵprogressText(value: number, max: number, unit: string): string {
  if (max === 100) return `${ɵprogressPercent(value, max)}${unit}`;
  const done = Math.min(Math.max(0, value), Math.max(0, max));
  const tail = unit && unit !== '%' ? ` ${unit}` : '';
  return `${counts.format(done)} / ${counts.format(max)}${tail}`;
}
