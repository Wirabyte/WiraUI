/** wt-chart: value axes with round steps, and category bands. */

export interface NiceScale {
  min: number;
  max: number;
  step: number;
  ticks: number[];
}

/** 1, 2, 2.5, 5 or 10 times a power of ten, the smallest that gives at most `count` steps. */
export function niceStep(span: number, count: number): number {
  if (!(span > 0) || !(count > 0)) return 1;
  const raw = span / count;
  const power = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * power >= raw - 1e-12) return m * power;
  return 10 * power;
}

const tidy = (n: number) => Number(n.toPrecision(12));

/**
 * An axis from `lo` to `hi` with about `count` round steps that cover the data: `niceScale(3, 97, 5)` →
 * 0 … 100 by 20. `zero` keeps 0 on the axis (bars). Equal ends get a step of room either side.
 */
export function niceScale(lo: number, hi: number, count = 5, zero = false): NiceScale {
  let min = Number.isFinite(lo) ? lo : 0;
  let max = Number.isFinite(hi) ? hi : 0;
  if (min > max) [min, max] = [max, min];
  if (zero) {
    min = Math.min(0, min);
    max = Math.max(0, max);
  }
  if (min === max) {
    const pad = Math.abs(min) || 1;
    if (zero && min === 0) max = 1;
    else {
      min -= pad / 2;
      max += pad / 2;
      if (zero) {
        min = Math.min(0, min);
        max = Math.max(0, max);
      }
    }
  }
  const step = niceStep(max - min, Math.max(1, count));
  const first = tidy(Math.floor(min / step + 1e-9) * step);
  const last = tidy(Math.ceil(max / step - 1e-9) * step);
  const ticks: number[] = [];
  for (let v = first, i = 0; v <= last + step / 2 && i < 1000; v = tidy(first + ++i * step)) ticks.push(v);
  return { min: first, max: last, step, ticks };
}

/** Maps `value` in `[d0, d1]` onto `[r0, r1]`. */
export function scaleLinear(value: number, d0: number, d1: number, r0: number, r1: number): number {
  return d1 === d0 ? (r0 + r1) / 2 : r0 + ((value - d0) / (d1 - d0)) * (r1 - r0);
}

/** `count` equal bands across `[start, end]`, each with `padding` (0–1) of its width left empty around the bar. */
export function bands(count: number, start: number, end: number, padding = 0.2): { step: number; width: number; offset: (i: number) => number } {
  const step = count > 0 ? (end - start) / count : 0;
  const width = step * (1 - Math.min(0.95, Math.max(0, padding)));
  return { step, width, offset: (i) => start + i * step + (step - width) / 2 };
}
