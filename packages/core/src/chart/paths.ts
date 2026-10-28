/** wt-chart: SVG path data for lines, areas, slices and bars with rounded ends. */

export interface ChartPoint {
  x: number;
  y: number;
}

const r = (n: number) => Math.round(n * 100) / 100;

/** How a line goes from point to point: straight, a smooth curve, or steps (across, then up or down). */
export type ChartCurve = 'straight' | 'smooth' | 'step';

const curveOf = (c: boolean | ChartCurve | undefined): ChartCurve => (c === true ? 'smooth' : !c ? 'straight' : c);

/** One unbroken run of points, from its first point (`back`: drawn right to left, closing an area). */
function segment(run: ChartPoint[], curve: ChartCurve, back = false): string {
  if (curve === 'smooth' && run.length > 2) return monotonePath(run);
  if (curve === 'step') return run.map((p, i) => (!i ? `M${r(p.x)} ${r(p.y)}` : back ? `V${r(p.y)}H${r(p.x)}` : `H${r(p.x)}V${r(p.y)}`)).join('');
  return run.map((p, i) => `${i ? 'L' : 'M'}${r(p.x)} ${r(p.y)}`).join('');
}

/** Segments through the points; `null` gaps break the line. `curve`: `true` / `'smooth'`, `'step'`, else straight. */
export function linePath(points: (ChartPoint | null)[], curve: boolean | ChartCurve = false): string {
  let d = '';
  for (const run of runs(points)) d += segment(run, curveOf(curve));
  return d;
}

/** The line closed down to `baseline` (an area chart). */
export function areaPath(points: (ChartPoint | null)[], baseline: number, curve: boolean | ChartCurve = false): string {
  let d = '';
  for (const run of runs(points)) d += `${segment(run, curveOf(curve))}L${r(run[run.length - 1].x)} ${r(baseline)}L${r(run[0].x)} ${r(baseline)}Z`;
  return d;
}

/** An area between two lines (a stacked area): `upper` left to right, then `lower` back. */
export function bandPath(upper: ChartPoint[], lower: ChartPoint[], curve: boolean | ChartCurve = false): string {
  if (!upper.length) return '';
  const c = curveOf(curve);
  const back = [...lower].reverse();
  return `${segment(upper, c)}${segment(back, c, true).replace(/^M/, 'L')}Z`;
}

function runs(points: (ChartPoint | null)[]): ChartPoint[][] {
  const out: ChartPoint[][] = [];
  let run: ChartPoint[] = [];
  for (const p of points) {
    if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) run.push(p);
    else if (run.length) {
      out.push(run);
      run = [];
    }
  }
  if (run.length) out.push(run);
  return out;
}

/**
 * A smooth curve that never overshoots the data (monotone cubic, Fritsch–Carlson): a peak in the data stays the peak of
 * the curve, unlike a Catmull-Rom spline.
 */
export function monotonePath(p: ChartPoint[]): string {
  const n = p.length;
  if (n < 3) return p.map((q, i) => `${i ? 'L' : 'M'}${r(q.x)} ${r(q.y)}`).join('');
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(p[i + 1].x - p[i].x);
    slope.push(dx[i] === 0 ? 0 : (p[i + 1].y - p[i].y) / dx[i]);
  }
  const m: number[] = [slope[0]];
  for (let i = 1; i < n - 1; i++) m.push(slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2);
  m.push(slope[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / slope[i];
    const b = m[i + 1] / slope[i];
    const h = a * a + b * b;
    if (h > 9) {
      const t = 3 / Math.sqrt(h);
      m[i] = t * a * slope[i];
      m[i + 1] = t * b * slope[i];
    }
  }
  let d = `M${r(p[0].x)} ${r(p[0].y)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${r(p[i].x + h)} ${r(p[i].y + m[i] * h)} ${r(p[i + 1].x - h)} ${r(p[i + 1].y - m[i + 1] * h)} ${r(p[i + 1].x)} ${r(p[i + 1].y)}`;
  }
  return d;
}

/**
 * A pie or doughnut slice: angles in radians clockwise from 12 o'clock, `inner` 0 for a pie. A whole circle is drawn as
 * two halves (one arc cannot start and end at the same point).
 */
export function arcPath(cx: number, cy: number, inner: number, outer: number, start: number, end: number): string {
  const sweep = Math.max(0, end - start);
  if (sweep >= Math.PI * 2 - 1e-6) {
    const mid = start + Math.PI;
    return arcPath(cx, cy, inner, outer, start, mid) + arcPath(cx, cy, inner, outer, mid, start + Math.PI * 2);
  }
  const at = (radius: number, a: number) => `${r(cx + radius * Math.sin(a))} ${r(cy - radius * Math.cos(a))}`;
  const large = sweep > Math.PI ? 1 : 0;
  let d = `M${at(outer, start)}A${r(outer)} ${r(outer)} 0 ${large} 1 ${at(outer, end)}`;
  d += inner > 0 ? `L${at(inner, end)}A${r(inner)} ${r(inner)} 0 ${large} 0 ${at(inner, start)}Z` : `L${r(cx)} ${r(cy)}Z`;
  return d;
}

/** An open arc (a stroke, for radial bars and gauge tracks): angles in radians clockwise from 12 o'clock. */
export function arcLine(cx: number, cy: number, radius: number, start: number, end: number): string {
  const sweep = Math.max(0, end - start);
  if (sweep < 1e-6) return '';
  if (sweep >= Math.PI * 2 - 1e-6) return arcLine(cx, cy, radius, start, start + Math.PI) + arcLine(cx, cy, radius, start + Math.PI, start + Math.PI * 2 - 1e-4).replace(/^M[^A]+/, '');
  const at = (a: number) => `${r(cx + radius * Math.sin(a))} ${r(cy - radius * Math.cos(a))}`;
  return `M${at(start)}A${r(radius)} ${r(radius)} 0 ${sweep > Math.PI ? 1 : 0} 1 ${at(end)}`;
}

/**
 * The biggest circle part from `start` to `end` (radians clockwise from 12 o'clock) that fits a `width` × `height` box
 * with `pad` around: its centre and radius. A half circle (a gauge) sits on the bottom edge instead of in the middle.
 */
export function fitArc(width: number, height: number, start: number, end: number, pad = 8): { cx: number; cy: number; radius: number } {
  const xs = [0];
  const ys = [0];
  const whole = end - start >= Math.PI * 2 - 1e-6;
  const angles = whole ? [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2] : [start, end];
  // The circle's far points (top, right, bottom, left) that the arc passes.
  if (!whole) for (let q = Math.ceil(start / (Math.PI / 2)) * (Math.PI / 2); q < end; q += Math.PI / 2) angles.push(q);
  for (const a of angles) {
    xs.push(Math.sin(a));
    ys.push(-Math.cos(a));
  }
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const radius = Math.max(0, Math.min((width - pad * 2) / (x1 - x0 || 1), (height - pad * 2) / (y1 - y0 || 1)));
  return { cx: width / 2 - ((x0 + x1) / 2) * radius, cy: height / 2 - ((y0 + y1) / 2) * radius, radius };
}

/** A point on a circle, angle clockwise from 12 o'clock. */
export function polar(cx: number, cy: number, radius: number, angle: number): ChartPoint {
  return { x: cx + radius * Math.sin(angle), y: cy - radius * Math.cos(angle) };
}

/**
 * A bar with its far end rounded: `x, y, w, h` the box, `radius` capped at half the width / height, `end` the side that is
 * rounded (`'top'` for a positive vertical bar, `'bottom'` negative, `'right'` / `'left'` horizontal).
 */
export function barPath(x: number, y: number, w: number, h: number, radius: number, end: 'top' | 'bottom' | 'left' | 'right'): string {
  const rad = Math.max(0, Math.min(radius, (end === 'top' || end === 'bottom' ? w : h) / 2, end === 'top' || end === 'bottom' ? h : w));
  if (!rad) return `M${r(x)} ${r(y)}h${r(w)}v${r(h)}h${r(-w)}Z`;
  const k = r(rad);
  switch (end) {
    case 'top':
      return `M${r(x)} ${r(y + h)}V${r(y + rad)}a${k} ${k} 0 0 1 ${k} ${-k}H${r(x + w - rad)}a${k} ${k} 0 0 1 ${k} ${k}V${r(y + h)}Z`;
    case 'bottom':
      return `M${r(x)} ${r(y)}V${r(y + h - rad)}a${k} ${k} 0 0 0 ${k} ${k}H${r(x + w - rad)}a${k} ${k} 0 0 0 ${k} ${-k}V${r(y)}Z`;
    case 'right':
      return `M${r(x)} ${r(y)}H${r(x + w - rad)}a${k} ${k} 0 0 1 ${k} ${k}V${r(y + h - rad)}a${k} ${k} 0 0 1 ${-k} ${k}H${r(x)}Z`;
    default:
      return `M${r(x + w)} ${r(y)}H${r(x + rad)}a${k} ${k} 0 0 0 ${-k} ${k}V${r(y + h - rad)}a${k} ${k} 0 0 0 ${k} ${k}H${r(x + w)}Z`;
  }
}
