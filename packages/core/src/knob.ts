/** Knob (wu-knob): the dial's arcs in its 100 × 100 viewBox, the value under a pointer, and key steps. */

/** The dial runs from the bottom left (240°) round the top to the bottom right (-60°). Radians, counter-clockwise. */
export const KNOB_MIN_RADIANS = (4 * Math.PI) / 3;
export const KNOB_MAX_RADIANS = -Math.PI / 3;
const RADIUS = 40;
const MID = 50;

const decimalsOf = (n: number): number => {
  const s = String(n);
  const e = s.indexOf('e-');
  if (e >= 0) return Number(s.slice(e + 2));
  return (s.split('.')[1] || '').length;
};
const tidy = (n: number): number => Math.round(n * 10000) / 10000;

function mapRange(x: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return inMax === inMin ? outMin : ((x - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function knobClamp(value: number, min: number, max: number): number {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return Math.min(hi, Math.max(lo, value));
}

/** Rounds to the step counted from `min` (0 or less: any value), without float noise (0.1 + 0.2), inside min … max. */
export function knobSnap(value: number, min: number, max: number, step: number): number {
  if (!Number.isFinite(value)) return knobClamp(min, min, max);
  if (!(step > 0)) return knobClamp(value, min, max);
  const n = Math.round((value - min) / step) * step + min;
  const decimals = Math.max(decimalsOf(step), decimalsOf(min));
  return knobClamp(Number(n.toFixed(Math.min(20, decimals))), min, max);
}

/**
 * The value under a point of the dial, in viewBox units (0–100 both ways), snapped to the step. The bottom gap between
 * the two ends gives `null` (a press there does nothing), or with `toEnds` the nearer end, so a drag past an end sticks
 * to it instead of stopping a step short.
 */
export function knobValueAt(x: number, y: number, min: number, max: number, step: number, toEnds = false): number | null {
  const angle = Math.atan2(MID - y, x - MID);
  const gapStart = -Math.PI / 2 - Math.PI / 6;
  let mapped: number;
  if (angle > KNOB_MAX_RADIANS) mapped = mapRange(angle, KNOB_MIN_RADIANS, KNOB_MAX_RADIANS, min, max);
  else if (angle < gapStart) mapped = mapRange(angle + 2 * Math.PI, KNOB_MIN_RADIANS, KNOB_MAX_RADIANS, min, max);
  else if (toEnds) mapped = angle < -Math.PI / 2 ? min : max;
  else return null;
  return knobSnap(mapped, min, max, step);
}

/**
 * The SVG paths: `range` is the whole track, `value` the filled arc from zero (or from `min` / `max` when zero is outside
 * the range) to the value.
 */
export function knobPaths(value: number, min: number, max: number): { range: string; value: string } {
  const angleOf = (v: number) => mapRange(knobClamp(v, min, max), min, max, KNOB_MIN_RADIANS, KNOB_MAX_RADIANS);
  const point = (a: number) => `${tidy(MID + Math.cos(a) * RADIUS)} ${tidy(MID - Math.sin(a) * RADIUS)}`;
  const zero = angleOf(0);
  const at = angleOf(Number.isFinite(value) ? value : min);
  const largeArc = Math.abs(zero - at) < Math.PI ? 0 : 1;
  const sweep = at > zero ? 0 : 1;
  return {
    range: `M ${point(KNOB_MIN_RADIANS)} A ${RADIUS} ${RADIUS} 0 1 1 ${point(KNOB_MAX_RADIANS)}`,
    value: `M ${point(zero)} A ${RADIUS} ${RADIUS} 0 ${largeArc} ${sweep} ${point(at)}`,
  };
}

/** The text in the middle: `'{value}%'` → `'40%'`. */
export function knobText(template: string | null | undefined, value: number): string {
  return String(template ?? '{value}')
    .split('{value}')
    .join(String(value));
}

/**
 * The value after a key on a slider-like control: arrows ± `step`, Page Up / Page Down ± `pageStep` (10 steps), Home / End
 * to the ends. `null` for any other key.
 */
export function rangeKeyValue(key: string, value: number, min: number, max: number, step: number, pageStep?: number): number | null {
  const s = step > 0 ? step : (Math.abs(max - min) || 1) / 100;
  const page = pageStep && pageStep > 0 ? pageStep : s * 10;
  let next: number;
  switch (key) {
    case 'ArrowRight':
    case 'ArrowUp':
      next = value + s;
      break;
    case 'ArrowLeft':
    case 'ArrowDown':
      next = value - s;
      break;
    case 'PageUp':
      next = value + page;
      break;
    case 'PageDown':
      next = value - page;
      break;
    case 'Home':
      return Math.min(min, max);
    case 'End':
      return Math.max(min, max);
    default:
      return null;
  }
  return knobSnap(next, min, max, step);
}
