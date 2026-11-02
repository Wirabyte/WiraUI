/** Image compare (wu-imageCompare): where the divider sits, from a pointer or a key. Positions are % from the start edge. */
import { knobSnap, rangeKeyValue } from './knob';

/** A position in 0 … 100; anything unreadable is `fallback` (50, the middle). */
export function imageCompareClamp(value: unknown, fallback = 50): number {
  const n = typeof value === 'number' ? value : value === null || value === undefined || value === '' ? NaN : Number(value);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : fallback;
}

/**
 * The position under a pointer at `clientX` over a box starting at `left` and `width` wide, to 0.1 %. Right to left,
 * the start edge is on the right.
 */
export function imageCompareAt(clientX: number, left: number, width: number, rtl = false): number {
  if (!(width > 0)) return 50;
  const ratio = (clientX - left) / width;
  const pct = (rtl ? 1 - ratio : ratio) * 100;
  return Math.round(Math.min(100, Math.max(0, pct)) * 10) / 10;
}

/**
 * The position after a key: ← / → move the divider that way on screen (so right to left they swap), ↑ / ↓ by a step too,
 * Page Up / Page Down by 10, Home / End to the edges. `null` for any other key.
 */
export function imageCompareKey(key: string, value: number, step = 1, rtl = false): number | null {
  const k = rtl && key === 'ArrowLeft' ? 'ArrowRight' : rtl && key === 'ArrowRight' ? 'ArrowLeft' : key;
  const next = rangeKeyValue(k, imageCompareClamp(value), 0, 100, step > 0 ? step : 1, 10);
  return next === null ? null : knobSnap(next, 0, 100, 0);
}
