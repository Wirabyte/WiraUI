/**
 * wt-chart: stream, waterfall, dumbbell, timeline, funnel, box plot, histogram, sunburst / icicle, unit (waffle, dots,
 * people) and slope charts. They draw with plain shapes (`model.shapes`) and texts (`model.texts`), each hover target
 * carries its own tooltip and is found with `chartHit()`, and `variant` picks a look. `chartSwapTypes()` lists the kinds
 * the same data can be shown as (the chart's type switcher).
 */
import { formatChartValue } from './format';
import type {
  ChartBoxStats,
  ChartHoverBand,
  ChartModel,
  ChartModelOptions,
  ChartNode,
  ChartRange,
  ChartSeries,
  ChartShape,
  ChartText,
  ChartTip,
  ChartType,
} from './model';
import { arcSpan } from './more';
import { arcPath, areaPath, bandPath, barPath, fitArc, linePath, polar } from './paths';
import { bands, niceScale, scaleLinear } from './scale';

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const approx = (text: string, size: number) => text.length * size * 0.56;
const UP = 'var(--wt-chart-up)';
const DOWN = 'var(--wt-chart-down)';
const TOTAL = 'var(--wt-chart-total)';
const MUTED = 'var(--wt-chart-muted)';
const TURN = Math.PI * 2;
const r2 = (n: number) => Math.round(n * 100) / 100;

const WORDS = {
  th: {
    change: 'เปลี่ยนแปลง',
    running: 'ยอดสะสม',
    total: 'รวม',
    min: 'ต่ำสุด',
    q1: 'ควอไทล์ 1',
    median: 'มัธยฐาน',
    q3: 'ควอไทล์ 3',
    max: 'สูงสุด',
    mean: 'ค่าเฉลี่ย',
    count: 'จำนวน',
    start: 'เริ่ม',
    end: 'สิ้นสุด',
    length: 'ระยะเวลา',
    ofFirst: 'ของขั้นแรก',
    ofPrevious: 'ของขั้นก่อน',
    share: 'สัดส่วน',
    difference: 'ส่วนต่าง',
    days: 'วัน',
    hours: 'ชม.',
    minutes: 'นาที',
  },
  en: {
    change: 'Change',
    running: 'Running total',
    total: 'Total',
    min: 'Min',
    q1: 'Q1',
    median: 'Median',
    q3: 'Q3',
    max: 'Max',
    mean: 'Mean',
    count: 'Count',
    start: 'Start',
    end: 'End',
    length: 'Length',
    ofFirst: 'of the first',
    ofPrevious: 'of the previous',
    share: 'Share',
    difference: 'Difference',
    days: 'days',
    hours: 'h',
    minutes: 'min',
  },
};

interface Kit {
  fontSize: number;
  lineH: number;
  measure: (text: string, size: number) => number;
  fmt: (v: number) => string;
  pct: (v: number) => string;
  words: (typeof WORDS)['th'];
  lang: string;
}

function kit(o: ChartModelOptions): Kit {
  const fontSize = o.fontSize || 12;
  const lang = String(o.formatOptions?.lang || 'th');
  return {
    fontSize,
    lineH: fontSize * 1.4,
    measure: o.measure || approx,
    fmt: (v) => formatChartValue(v, o.format, o.formatOptions),
    pct: (v) => formatChartValue(v, 'percent', { lang, decimals: v > 0 && v < 0.1 ? 1 : 0 }),
    words: lang.toLowerCase().startsWith('en') ? WORDS.en : WORDS.th,
    lang,
  };
}

const colorOf = (s: ChartSeries | undefined, i: number, palette: string[]) => s?.color || palette[i % palette.length];
const valuesOf = (s: ChartSeries | undefined): (number | null)[] => (s ? (s.data as unknown[]).map((v) => num(v)) : []);

/** Moves label centres apart so no two are closer than `gap`, inside `lo` … `hi`, staying near where they were. */
export function relaxLabels(ys: number[], gap: number, lo: number, hi: number): number[] {
  const order = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  const out = order.map((p) => p.y);
  for (let pass = 0; pass < 3; pass++) {
    if (out.length && out[0] < lo) out[0] = lo;
    for (let k = 1; k < out.length; k++) if (out[k] - out[k - 1] < gap) out[k] = out[k - 1] + gap;
    if (out.length && out[out.length - 1] > hi) {
      out[out.length - 1] = hi;
      for (let k = out.length - 2; k >= 0; k--) if (out[k + 1] - out[k] < gap) out[k] = out[k + 1] - gap;
    }
  }
  const res: number[] = new Array(ys.length);
  order.forEach((p, k) => (res[p.i] = out[k]));
  return res;
}

// ---------------------------------------------------------------- axes shared by the kinds

interface AxesSpec {
  /** Category labels: along the bottom, or down the left when `across`. */
  cats: string[];
  across?: boolean;
  lo: number;
  hi: number;
  zero?: boolean;
  fmt: (v: number) => string;
  /** Ticks to use as they are (a time axis). */
  ticks?: number[];
  /** Categories as points from edge to edge (lines), not bands. */
  edge?: boolean;
  padding?: number;
  valueAxis?: boolean;
  grid?: boolean;
  /** A numeric axis along the bottom instead of categories (histogram). */
  numericX?: { min: number; max: number; ticks: number[]; fmt: (v: number) => string };
  /** Room for text on the far side of the value axis (values at the end of bars across). */
  farRoom?: number;
}

interface Axes {
  plot: { x: number; y: number; w: number; h: number };
  /** Value → px on the value axis. */
  val: (v: number) => number;
  /** Category → centre px on the category axis. */
  cat: (k: number) => number;
  /** A category's band: its start and thickness. */
  offset: (k: number) => number;
  bw: number;
  step: number;
  /** Histogram: value → px along the bottom. */
  nx: (v: number) => number;
  min: number;
  max: number;
}

function axes(o: ChartModelOptions, model: ChartModel, spec: AxesSpec): Axes {
  const { width, height } = model;
  const { fontSize, lineH, measure } = kit(o);
  const pad = 8;
  const across = !!spec.across;
  const count = Math.max(2, Math.min(10, Math.floor((across ? width : height) / (across ? 90 : 44))));
  let scale: { min: number; max: number; ticks: number[] };
  if (spec.ticks) scale = { min: spec.lo, max: spec.hi, ticks: spec.ticks };
  else {
    scale = niceScale(o.min ?? spec.lo, o.max ?? spec.hi, count, !!spec.zero);
    if (o.min !== undefined) scale.min = o.min;
    if (o.max !== undefined) scale.max = o.max;
    const given = o.scales?.left;
    if (given && Number.isFinite(given.min) && Number.isFinite(given.max) && given.max > given.min) scale = { min: given.min, max: given.max, ticks: [...given.ticks] };
    scale.ticks = scale.ticks.filter((t) => t >= scale.min - 1e-9 && t <= scale.max + 1e-9);
  }
  model.scales = { left: { min: scale.min, max: scale.max, ticks: [...scale.ticks] }, right: null };
  const showVal = spec.valueAxis !== false;
  const widest = (t: string[]) => t.reduce((w, s) => Math.max(w, measure(s, fontSize)), 0);
  const valTexts = showVal ? scale.ticks.map(spec.fmt) : [];
  const top = pad + (o.showValues && !across ? lineH : fontSize / 2);
  let left = pad;
  let bottom = pad;
  let right = pad;
  if (across) {
    if (spec.cats.length) left += Math.min(width * 0.35, widest(spec.cats)) + pad;
    if (showVal) bottom += lineH + 4;
    right += Math.max(spec.farRoom ?? 0, valTexts.length ? measure(valTexts[valTexts.length - 1], fontSize) / 2 : 0);
  } else {
    if (showVal) left += widest(valTexts) + pad;
    if (spec.cats.length || spec.numericX) bottom += lineH + 4;
  }
  if (o.xTitle) bottom += lineH + 2;
  if (o.yTitle) left += lineH + 2;
  const plot = { x: left, y: top, w: Math.max(10, width - left - right), h: Math.max(10, height - top - bottom) };
  model.plot = plot;
  const n = spec.cats.length;
  const b = bands(Math.max(1, n), across ? plot.y : plot.x, across ? plot.y + plot.h : plot.x + plot.w, spec.padding ?? 0.3);
  const cat = (k: number) =>
    spec.edge && n > 1 ? (across ? plot.y + (plot.h * k) / (n - 1) : plot.x + (plot.w * k) / (n - 1)) : b.offset(k) + b.width / 2;
  const val = across ? (v: number) => scaleLinear(v, scale.min, scale.max, plot.x, plot.x + plot.w) : (v: number) => scaleLinear(v, scale.min, scale.max, plot.y + plot.h, plot.y);
  const grid = o.grid !== false && spec.grid !== false;
  for (const t of scale.ticks) {
    const at = val(t);
    if (across) {
      if (grid) model.grid.push({ x1: at, y1: plot.y, x2: at, y2: plot.y + plot.h });
      if (showVal) model.xTicks.push({ x: at, y: plot.y + plot.h + pad / 2, text: spec.fmt(t), anchor: 'middle', baseline: 'hanging' });
    } else {
      if (grid) model.grid.push({ x1: plot.x, y1: at, x2: plot.x + plot.w, y2: at });
      if (showVal) model.yTicks.push({ x: plot.x - pad / 2, y: at, text: spec.fmt(t), anchor: 'end', baseline: 'middle' });
    }
  }
  if (showVal && scale.min < 0 && scale.max > 0) {
    const z = val(0);
    model.zero = across ? { x1: z, y1: plot.y, x2: z, y2: plot.y + plot.h } : { x1: plot.x, y1: z, x2: plot.x + plot.w, y2: z };
  }
  const nxr = spec.numericX;
  const nx = (v: number) => (nxr ? scaleLinear(v, nxr.min, nxr.max, plot.x, plot.x + plot.w) : plot.x);
  if (nxr) {
    const space = plot.w / Math.max(1, nxr.ticks.length - 1);
    const every = Math.max(1, Math.ceil((widest(nxr.ticks.map(nxr.fmt)) + pad) / Math.max(1, space)));
    nxr.ticks.forEach((t, k) => {
      if (k % every === 0) model.xTicks.push({ x: nx(t), y: plot.y + plot.h + pad / 2, text: nxr.fmt(t), anchor: 'middle', baseline: 'hanging' });
    });
  } else if (n) {
    if (across) {
      const every = Math.max(1, Math.ceil((lineH + 2) / Math.max(1, b.step)));
      for (let k = 0; k < n; k += every) model.yTicks.push({ x: plot.x - pad / 2, y: cat(k), text: spec.cats[k], anchor: 'end', baseline: 'middle' });
    } else {
      const space = spec.edge && n > 1 ? plot.w / (n - 1) : b.step;
      const every = Math.max(1, Math.ceil((widest(spec.cats) + pad) / Math.max(1, space)));
      for (let k = 0; k < n; k += every) {
        const anchor = spec.edge && n > 1 && k === 0 ? 'start' : spec.edge && n > 1 && k === n - 1 ? 'end' : 'middle';
        model.xTicks.push({ x: cat(k), y: plot.y + plot.h + pad / 2, text: spec.cats[k], anchor, baseline: 'hanging' });
      }
    }
  }
  if (o.xTitle) model.titles.push({ x: plot.x + plot.w / 2, y: height - pad, text: o.xTitle, anchor: 'middle', baseline: 'auto' });
  if (o.yTitle) model.titles.push({ x: pad + fontSize * 0.7, y: plot.y + plot.h / 2, text: o.yTitle, anchor: 'middle', baseline: 'middle', rotate: -90 });
  return { plot, val, cat, offset: b.offset, bw: b.width, step: b.step, nx, min: scale.min, max: scale.max };
}

/** A hover target over a whole category (band or point), with the pointer guide when `cross`. */
function categoryTarget(a: Axes, k: number, across: boolean, key: string, tip: ChartTip, cross = false, count = 0, edge = false): ChartHoverBand {
  const c = a.cat(k);
  const half = edge && count > 1 ? (across ? a.plot.h : a.plot.w) / (count - 1) / 2 : a.step / 2;
  if (across) return { index: k, key, tip, x: a.plot.x, y: c - half, w: a.plot.w, h: half * 2, cx: a.plot.x + a.plot.w, cy: c, cross };
  const x0 = Math.max(a.plot.x, c - half);
  const x1 = Math.min(a.plot.x + a.plot.w, c + half);
  return { index: k, key, tip, x: x0, y: a.plot.y, w: x1 - x0, h: a.plot.h, cx: c, cy: a.plot.y, cross };
}

// ---------------------------------------------------------------- stream

/** Stacked areas around a middle line: `'silhouette'` (default, even about the middle), `'wiggle'` (least sway) or `'expand'` (shares, 0–100%). */
export function streamModel(o: ChartModelOptions, model: ChartModel, palette: string[]): ChartModel {
  const k = kit(o);
  const variant = o.variant === 'wiggle' || o.variant === 'expand' ? o.variant : 'silhouette';
  const labels = (o.labels || []).map((l) => String(l ?? ''));
  const all = o.series || [];
  model.legend = all.map((s, i) => ({ index: i, name: s.name ?? '', color: colorOf(s, i, palette), hidden: !!s.hidden, shape: 'box' }));
  const shown = all.map((s, i) => ({ s, i, v: valuesOf(s).map((x) => Math.max(0, x ?? 0)) })).filter((p) => !p.s.hidden);
  const count = Math.max(labels.length, ...shown.map((p) => p.v.length), 0);
  const totals = Array.from({ length: count }, (_, j) => shown.reduce((sum, p) => sum + (p.v[j] || 0), 0));
  model.empty = !totals.some((t) => t > 0);
  const share = variant === 'expand';
  const val = (p: { v: number[] }, j: number) => (share ? (totals[j] ? (p.v[j] || 0) / totals[j] : 0) : p.v[j] || 0);
  // The baseline of the lowest layer at each label.
  const base: number[] = new Array(count).fill(0);
  if (variant === 'silhouette') for (let j = 0; j < count; j++) base[j] = -totals[j] / 2;
  if (variant === 'wiggle') {
    for (let j = 1; j < count; j++) {
      let s1 = 0;
      let s2 = 0;
      shown.forEach((p, i) => {
        const now = p.v[j] || 0;
        let s3 = ((p.v[j] || 0) - (p.v[j - 1] || 0)) / 2;
        for (let q = 0; q < i; q++) s3 += (shown[q].v[j] || 0) - (shown[q].v[j - 1] || 0);
        s1 += now;
        s2 += s3 * now;
      });
      base[j] = base[j - 1] - (s1 ? s2 / s1 : 0);
    }
  }
  let lo = 0;
  let hi = share ? 1 : 0;
  if (!share) {
    lo = Infinity;
    hi = -Infinity;
    for (let j = 0; j < count; j++) {
      lo = Math.min(lo, base[j]);
      hi = Math.max(hi, base[j] + totals[j]);
    }
    if (!(lo < hi)) [lo, hi] = [0, 1];
    // Growing in or changing: the axis it ends with.
    const given = o.scales?.left;
    if (given && given.max > given.min) [lo, hi] = [given.min, given.max];
  }
  const a = axes(o, model, {
    cats: labels.slice(0, count),
    edge: true,
    lo,
    hi,
    zero: share,
    fmt: share ? k.pct : k.fmt,
    ticks: share ? [0, 0.25, 0.5, 0.75, 1] : [],
    valueAxis: share,
    grid: share,
  });
  if (!share) model.scales = { left: { min: lo, max: hi, ticks: [] }, right: null };
  const lower = [...base];
  shown.forEach((p) => {
    const up: { x: number; y: number }[] = [];
    const down: { x: number; y: number }[] = [];
    let thick = { at: -1, px: 0, y: 0 };
    for (let j = 0; j < count; j++) {
      const y0 = lower[j];
      const y1 = y0 + val(p, j);
      lower[j] = y1;
      const x = a.cat(j);
      up.push({ x, y: a.val(y1) });
      down.push({ x, y: a.val(y0) });
      const px = Math.abs(a.val(y0) - a.val(y1));
      if (px > thick.px) thick = { at: j, px, y: (a.val(y0) + a.val(y1)) / 2 };
    }
    const color = colorOf(p.s, p.i, palette);
    model.shapes.push({ key: `st${p.i}`, kind: 'path', d: bandPath(up, down, 'smooth'), fill: color, opacity: 0.88, className: 'wt-chart-stream', hover: `s${p.i}` });
    // The name inside the layer, where it is thickest.
    const name = p.s.name ?? '';
    if (name && thick.at >= 0 && thick.px >= k.fontSize + 6) {
      const w = k.measure(name, k.fontSize);
      const x = Math.min(Math.max(a.cat(thick.at), a.plot.x + w / 2 + 4), a.plot.x + a.plot.w - w / 2 - 4);
      model.texts.push({ x, y: thick.y, text: name, anchor: 'middle', baseline: 'middle', tone: 'inside', strong: true, hover: `s${p.i}` });
    }
  });
  for (let j = 0; j < count; j++) {
    const rows = shown.map((p) => ({ color: colorOf(p.s, p.i, palette), name: p.s.name ?? '', value: share ? `${k.pct(val(p, j))} · ${k.fmt(p.v[j] || 0)}` : k.fmt(p.v[j] || 0) }));
    if (!share && shown.length > 1) rows.push({ color: 'transparent', name: k.words.total, value: k.fmt(totals[j]) });
    model.hover.push(categoryTarget(a, j, false, `c${j}`, { title: labels[j] ?? '', rows: rows.reverse() }, true, count, true));
  }
  return model;
}

// ---------------------------------------------------------------- waterfall

/**
 * Changes adding up to a total: each value moves the running total up (green) or down (red); a `null` draws a total bar.
 * `'bars'` (default) floats each change from where the last one ended, joined by dashed lines; `'steps'` draws the
 * running total as a step line over pale change bars.
 */
export function waterfallModel(o: ChartModelOptions, model: ChartModel, palette: string[]): ChartModel {
  const k = kit(o);
  const steps = o.variant === 'steps';
  const labels = (o.labels || []).map((l) => String(l ?? ''));
  const s = (o.series || []).find((x) => !x.hidden);
  const raw = s ? (s.data as unknown[]) : [];
  const count = Math.max(labels.length, raw.length);
  model.legend = [];
  const parts: { from: number; to: number; total: boolean; change: number }[] = [];
  let run = 0;
  for (let j = 0; j < count; j++) {
    const v = num(raw[j]);
    if (v === null) parts.push({ from: 0, to: run, total: true, change: run });
    else {
      parts.push({ from: run, to: run + v, total: false, change: v });
      run += v;
    }
  }
  model.empty = !parts.some((p) => p.to !== p.from);
  let lo = 0;
  let hi = 0;
  for (const p of parts) {
    lo = Math.min(lo, p.from, p.to);
    hi = Math.max(hi, p.from, p.to);
  }
  const a = axes(o, model, { cats: labels.slice(0, count), lo, hi, zero: true, fmt: k.fmt, padding: 0.32 });
  const signed = (v: number) => (v > 0 ? '+' : v < 0 ? '−' : '') + k.fmt(Math.abs(v));
  const showValues = o.showValues ?? true;
  const line: { x: number; y: number }[] = [];
  parts.forEach((p, j) => {
    const color = p.total ? TOTAL : p.change >= 0 ? UP : DOWN;
    const x = a.offset(j);
    const y0 = a.val(Math.max(p.from, p.to));
    const y1 = a.val(Math.min(p.from, p.to));
    const h = Math.max(1, y1 - y0);
    model.shapes.push({ key: `w${j}`, kind: 'rect', x, y: y0, w: a.bw, h, rx: 3, fill: color, opacity: steps && !p.total ? 0.32 : 1, hover: `c${j}` });
    if (steps) {
      line.push({ x, y: a.val(p.to) }, { x: x + a.bw, y: a.val(p.to) });
    } else if (j < parts.length - 1) {
      // Dashed joint from this bar's end to the next bar.
      const y = a.val(p.to);
      model.shapes.push({ key: `wj${j}`, kind: 'line', x: x + a.bw, y, x2: a.offset(j + 1), y2: y, stroke: MUTED, strokeWidth: 1, dashed: true, className: 'wt-chart-connector' });
    }
    if (showValues) {
      const up = p.total || p.change >= 0;
      model.valueLabels.push({ x: x + a.bw / 2, y: up ? y0 - 4 : y1 + 4, text: p.total ? k.fmt(p.to) : signed(p.change), anchor: 'middle', baseline: up ? 'auto' : 'hanging' });
    }
    const rows = p.total
      ? [{ color, name: k.words.total, value: k.fmt(p.to) }]
      : [
          { color, name: k.words.change, value: signed(p.change) },
          { color: TOTAL, name: k.words.running, value: k.fmt(p.to) },
        ];
    model.hover.push(categoryTarget(a, j, false, `c${j}`, { title: labels[j] ?? '', rows }));
  });
  if (steps && line.length) {
    model.shapes.push({ key: 'wline', kind: 'path', d: linePath(line), stroke: TOTAL, strokeWidth: 2.5, className: 'wt-chart-line-shape' });
    parts.forEach((p, j) => {
      if (p.total) model.shapes.push({ key: `wd${j}`, kind: 'circle', x: a.cat(j), y: a.val(p.to), r: 4.5, fill: 'var(--wt-chart-dot-fill)', stroke: TOTAL, strokeWidth: 2.5 });
    });
  }
  return model;
}

// ---------------------------------------------------------------- dumbbell

/**
 * Two values per row (the first two series), from one to the other: `'dots'` (default; a line fading from one colour
 * to the other), `'arrow'` (green when it went up, red when down) or `'range'` (a pale bar between the dots).
 */
export function dumbbellModel(o: ChartModelOptions, model: ChartModel, palette: string[]): ChartModel {
  const k = kit(o);
  const variant = o.variant === 'arrow' || o.variant === 'range' ? o.variant : 'dots';
  const labels = (o.labels || []).map((l) => String(l ?? ''));
  const all = o.series || [];
  model.legend = all.slice(0, 2).map((s, i) => ({ index: i, name: s.name ?? '', color: colorOf(s, i, palette), hidden: !!s.hidden, shape: 'dot' }));
  const [sa, sb] = [all[0], all[1]];
  const va = sa && !sa.hidden ? valuesOf(sa) : [];
  const vb = sb && !sb.hidden ? valuesOf(sb) : [];
  const count = Math.max(labels.length, va.length, vb.length);
  let lo = Infinity;
  let hi = -Infinity;
  for (const v of [...va, ...vb]) {
    if (v === null) continue;
    lo = Math.min(lo, v);
    hi = Math.max(hi, v);
  }
  model.empty = !(lo <= hi);
  if (model.empty) [lo, hi] = [0, 1];
  const ca = colorOf(sa, 0, palette);
  const cb = colorOf(sb, 1, palette);
  const a = axes(o, model, { cats: labels.slice(0, count), across: true, lo, hi, zero: false, fmt: k.fmt, padding: 0.4, farRoom: o.showValues ? 40 : 0 });
  for (let j = 0; j < count; j++) {
    const x0v = va[j] ?? null;
    const x1v = vb[j] ?? null;
    const y = a.cat(j);
    const rows: ChartTip['rows'] = [];
    if (x0v !== null) rows.push({ color: ca, name: sa?.name ?? '', value: k.fmt(x0v) });
    if (x1v !== null) rows.push({ color: cb, name: sb?.name ?? '', value: k.fmt(x1v) });
    if (x0v !== null && x1v !== null) {
      const x0 = a.val(x0v);
      const x1 = a.val(x1v);
      const diff = x1v - x0v;
      rows.push({ color: diff >= 0 ? UP : DOWN, name: k.words.difference, value: (diff > 0 ? '+' : diff < 0 ? '−' : '') + k.fmt(Math.abs(diff)) });
      if (variant === 'range') {
        const h = Math.max(6, Math.min(16, a.bw * 0.5));
        model.shapes.push({ key: `dr${j}`, kind: 'rect', x: Math.min(x0, x1), y: y - h / 2, w: Math.max(1, Math.abs(x1 - x0)), h, rx: h / 2, fill: cb, opacity: 0.22, enter: 'grow-x', hover: `r${j}` });
      } else if (variant === 'arrow') {
        const color = diff >= 0 ? UP : DOWN;
        const dir = x1 >= x0 ? 1 : -1;
        const tip = x1 - dir * 2;
        if (Math.abs(x1 - x0) > 10) {
          model.shapes.push({ key: `dl${j}`, kind: 'line', x: x0, y, x2: tip - dir * 8, y2: y, stroke: color, strokeWidth: 3, hover: `r${j}` });
          model.shapes.push({ key: `da${j}`, kind: 'path', d: `M${r2(tip)} ${r2(y)}L${r2(tip - dir * 11)} ${r2(y - 6)}L${r2(tip - dir * 11)} ${r2(y + 6)}Z`, fill: color, hover: `r${j}` });
        }
        model.shapes.push({ key: `dp${j}`, kind: 'circle', x: x0, y, r: 4.5, fill: 'var(--wt-chart-dot-fill)', stroke: color, strokeWidth: 2.5, hover: `r${j}` });
      } else {
        model.shapes.push({
          key: `dl${j}`,
          kind: 'line',
          x: x0,
          y,
          x2: x1,
          y2: y,
          stroke: ca,
          strokeWidth: 3,
          gradient: Math.abs(x1 - x0) > 1 ? { x1: x0, y1: y, x2: x1, y2: y, from: ca, to: cb } : undefined,
          hover: `r${j}`,
        });
      }
      if (o.showValues) {
        const [left, right] = x0 <= x1 ? [x0v, x1v] : [x1v, x0v];
        model.valueLabels.push({ x: Math.min(x0, x1) - 9, y, text: k.fmt(left), anchor: 'end', baseline: 'middle' });
        model.valueLabels.push({ x: Math.max(x0, x1) + 9, y, text: k.fmt(right), anchor: 'start', baseline: 'middle' });
      }
    }
    if (variant !== 'arrow') {
      if (x0v !== null) model.shapes.push({ key: `da${j}`, kind: 'circle', x: a.val(x0v), y, r: 6, fill: ca, stroke: 'var(--wt-chart-dot-fill)', strokeWidth: 2, enter: 'pop', hover: `r${j}` });
      if (x1v !== null) model.shapes.push({ key: `db${j}`, kind: 'circle', x: a.val(x1v), y, r: 6, fill: cb, stroke: 'var(--wt-chart-dot-fill)', strokeWidth: 2, enter: 'pop', delay: 120, hover: `r${j}` });
    }
    if (rows.length) model.hover.push(categoryTarget(a, j, true, `r${j}`, { title: labels[j] ?? '', rows }));
  }
  return model;
}

// ---------------------------------------------------------------- timeline

const MINUTE = 60000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const TIME_STEPS = [MINUTE, 5 * MINUTE, 15 * MINUTE, 30 * MINUTE, HOUR, 3 * HOUR, 6 * HOUR, 12 * HOUR, DAY, 2 * DAY, 7 * DAY, 14 * DAY, 30 * DAY, 91 * DAY, 182 * DAY, 365 * DAY];

/** Round ticks for a time axis from `lo` to `hi` (ms): minutes, hours, local midnights, Mondays-agnostic weeks or the 1st of months. */
export function timeTicks(lo: number, hi: number, count = 6): { ticks: number[]; step: number } {
  const span = Math.max(1, hi - lo);
  const step = TIME_STEPS.find((s) => span / s <= count) ?? 365 * DAY * Math.ceil(span / (count * 365 * DAY));
  const ticks: number[] = [];
  if (step >= 30 * DAY) {
    const months = Math.max(1, Math.round(step / (30 * DAY)));
    const d = new Date(lo);
    d.setHours(0, 0, 0, 0);
    d.setDate(1);
    if (d.getTime() < lo) d.setMonth(d.getMonth() + 1);
    while (d.getMonth() % months !== 0) d.setMonth(d.getMonth() + 1);
    for (let i = 0; d.getTime() <= hi && i < 400; i++) {
      ticks.push(d.getTime());
      d.setMonth(d.getMonth() + months);
    }
  } else if (step >= DAY) {
    const days = Math.round(step / DAY);
    const d = new Date(lo);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() < lo) d.setDate(d.getDate() + 1);
    for (let i = 0; d.getTime() <= hi && i < 400; i++) {
      ticks.push(d.getTime());
      d.setDate(d.getDate() + days);
    }
  } else {
    const offset = -new Date(lo).getTimezoneOffset() * MINUTE;
    for (let t = Math.ceil((lo + offset) / step) * step - offset, i = 0; t <= hi && i < 400; t += step, i++) ticks.push(t);
  }
  return { ticks, step };
}

const toMs = (v: unknown): number | null => {
  if (v instanceof Date) return Number.isFinite(v.getTime()) ? v.getTime() : null;
  if (typeof v === 'string') {
    const t = Date.parse(v);
    return Number.isFinite(t) ? t : null;
  }
  return num(v);
};

function dateFormat(lang: string, options: Intl.DateTimeFormatOptions): (v: number) => string {
  const locale = lang.toLowerCase().startsWith('en') ? 'en-GB' : lang.toLowerCase().startsWith('th') ? 'th-TH' : lang;
  const f = new Intl.DateTimeFormat(locale, options);
  return (v) => f.format(new Date(v));
}

/**
 * Bars from start to end on rows (a Gantt chart): `series[i].data` are `{ row, start, end, name?, color? }`, dates or
 * numbers. Bars that overlap on a row take lanes. `'bars'` (default; names inside) or `'thin'` (a slim bar with round ends,
 * the name above).
 */
export function timelineModel(o: ChartModelOptions, model: ChartModel, palette: string[]): ChartModel {
  const k = kit(o);
  const thin = o.variant === 'thin';
  const all = o.series || [];
  model.legend = all.length > 1 ? all.map((s, i) => ({ index: i, name: s.name ?? '', color: colorOf(s, i, palette), hidden: !!s.hidden, shape: 'box' })) : [];
  const items: { row: string; start: number; end: number; name: string; color: string; series: number; i: number; lane: number }[] = [];
  let time = o.format === 'date';
  all.forEach((s, si) => {
    if (s.hidden) return;
    (s.data as unknown[]).forEach((d, i) => {
      if (!d || typeof d !== 'object') return;
      const r = d as ChartRange;
      const start = toMs(r.start);
      const end = toMs(r.end);
      if (start === null || end === null) return;
      if (typeof r.start !== 'number' || typeof r.end !== 'number') time = true;
      items.push({ row: String(r.row ?? r.x ?? ''), start: Math.min(start, end), end: Math.max(start, end), name: r.name ?? '', color: r.color || (all.length > 1 || s.color ? colorOf(s, si, palette) : ''), series: si, i, lane: 0 });
    });
  });
  const rows = o.labels && o.labels.length ? o.labels.map(String) : [...new Set(items.map((it) => it.row))];
  // One series: a colour per row.
  for (const it of items) if (!it.color) it.color = palette[Math.max(0, rows.indexOf(it.row)) % palette.length];
  model.empty = !items.length;
  let lo = items.length ? Math.min(...items.map((it) => it.start)) : 0;
  let hi = items.length ? Math.max(...items.map((it) => it.end)) : 1;
  if (!(lo < hi)) hi = lo + 1;
  // Lanes: a bar takes the first lane on its row that is free by its start.
  const lanes = new Map<string, number>();
  for (const row of rows) {
    const ends: number[] = [];
    items
      .filter((it) => it.row === row)
      .sort((p, q) => p.start - q.start)
      .forEach((it) => {
        let lane = ends.findIndex((e) => e <= it.start);
        if (lane < 0) lane = ends.length;
        ends[lane] = it.end;
        it.lane = lane;
      });
    lanes.set(row, Math.max(1, ends.length));
  }
  let fmt = k.fmt;
  let ticks: number[] | undefined;
  let full = k.fmt;
  if (time) {
    const t = timeTicks(lo, hi, Math.max(2, Math.floor(model.width / 110)));
    ticks = t.ticks;
    fmt = t.step < DAY ? dateFormat(k.lang, { hour: '2-digit', minute: '2-digit' }) : t.step >= 30 * DAY ? dateFormat(k.lang, { month: 'short', year: '2-digit' }) : dateFormat(k.lang, { day: 'numeric', month: 'short' });
    full = dateFormat(k.lang, t.step < DAY ? { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' } : { day: 'numeric', month: 'short', year: 'numeric' });
  }
  const a = axes(o, model, { cats: rows, across: true, lo, hi, fmt, ticks, padding: thin ? 0.2 : 0.28, zero: false });
  const length = (ms: number) =>
    !time ? k.fmt(ms) : ms >= DAY ? `${r2(ms / DAY)} ${k.words.days}` : ms >= HOUR ? `${r2(ms / HOUR)} ${k.words.hours}` : `${Math.round(ms / MINUTE)} ${k.words.minutes}`;
  items.forEach((it, n) => {
    const row = rows.indexOf(it.row);
    if (row < 0) return;
    const laneCount = lanes.get(it.row) || 1;
    const laneH = a.bw / laneCount;
    const y = a.offset(row) + it.lane * laneH;
    const x0 = a.val(it.start);
    const x1 = a.val(it.end);
    const w = Math.max(2, x1 - x0);
    const key = `t${n}`;
    const tip: ChartTip = {
      title: it.name || it.row,
      rows: [
        { color: it.color, name: k.words.start, value: full(it.start) },
        { color: it.color, name: k.words.end, value: full(it.end) },
        { color: it.color, name: k.words.length, value: length(it.end - it.start) },
      ],
    };
    if (thin) {
      const cy = y + laneH * 0.62;
      model.shapes.push({ key: `${key}b`, kind: 'rect', x: x0, y: cy - 3, w, h: 6, rx: 3, fill: it.color, enter: 'grow-x', delay: n * 40, hover: key });
      model.shapes.push({ key: `${key}s`, kind: 'circle', x: x0, y: cy, r: 5, fill: 'var(--wt-chart-dot-fill)', stroke: it.color, strokeWidth: 2.5, enter: 'pop', delay: n * 40, hover: key });
      model.shapes.push({ key: `${key}e`, kind: 'circle', x: x0 + w, y: cy, r: 5, fill: it.color, stroke: 'var(--wt-chart-dot-fill)', strokeWidth: 2, enter: 'pop', delay: n * 40 + 200, hover: key });
      if (it.name) model.texts.push({ x: x0, y: cy - 10, text: it.name, anchor: 'start', baseline: 'auto', strong: true, hover: key });
    } else {
      const h = Math.max(4, laneH - 3);
      model.shapes.push({ key, kind: 'rect', x: x0, y: y + 1.5, w, h, rx: Math.min(6, h / 3), fill: it.color, enter: 'grow-x', delay: n * 40, hover: key });
      if (it.name) {
        const tw = k.measure(it.name, k.fontSize);
        if (tw + 12 <= w) model.texts.push({ x: x0 + 8, y: y + 1.5 + h / 2, text: it.name, anchor: 'start', baseline: 'middle', tone: 'inside', strong: true, hover: key });
        else if (x1 + 6 + tw <= a.plot.x + a.plot.w) model.texts.push({ x: x1 + 6, y: y + 1.5 + h / 2, text: it.name, anchor: 'start', baseline: 'middle', hover: key });
      }
    }
    model.hover.push({ index: it.i, series: it.series, key, tip, x: x0, y, w, h: laneH, cx: x0 + w / 2, cy: y, value: it.end - it.start, label: it.name || it.row });
  });
  return model;
}

// ---------------------------------------------------------------- funnel

/**
 * Stages getting smaller, a value per label: `'funnel'` (default; smooth sides narrowing to the next stage), `'bars'`
 * (centred bars, the share kept between them) or `'pyramid'` (a triangle cut into stages by value).
 */
export function funnelModel(o: ChartModelOptions, model: ChartModel, palette: string[]): ChartModel {
  const k = kit(o);
  const variant = o.variant === 'bars' || o.variant === 'pyramid' ? o.variant : 'funnel';
  const labels = (o.labels || []).map((l) => String(l ?? ''));
  const s = (o.series || [])[0];
  const hidden = new Set(o.hiddenSlices || []);
  const values = valuesOf(s).map((v) => Math.max(0, v ?? 0));
  const stageColor = (j: number) => s?.colors?.[j] || palette[j % palette.length];
  model.legend = values.map((_, j) => ({ index: j, name: labels[j] ?? '', color: stageColor(j), hidden: hidden.has(j), shape: 'box' }));
  model.dimOthers = true;
  const stages = values.map((v, j) => ({ v, j })).filter((p) => !hidden.has(p.j) && p.v > 0);
  model.empty = !stages.length;
  if (model.empty) return model;
  const { width, height } = model;
  const pad = 8;
  const nameW = Math.min(width * 0.3, Math.max(0, ...stages.map((p) => k.measure(labels[p.j] ?? '', k.fontSize)))) + pad * 2;
  const plot = { x: nameW, y: pad, w: Math.max(10, width - nameW - pad), h: Math.max(10, height - pad * 2) };
  model.plot = plot;
  const given = o.scales?.left;
  const top = given && given.max > 0 ? given.max : Math.max(...stages.map((p) => p.v));
  model.scales = { left: { min: 0, max: Math.max(...stages.map((p) => p.v)), ticks: [] }, right: null };
  const first = stages[0].v || 1;
  const n = stages.length;
  const cx = plot.x + plot.w / 2;
  const gap = Math.min(6, plot.h / n / 6);
  const segH = (plot.h - gap * (n - 1)) / n;
  const total = stages.reduce((sum, p) => sum + p.v, 0);
  let acc = 0;
  stages.forEach((p, i) => {
    const color = stageColor(p.j);
    const key = `f${p.j}`;
    let y0 = plot.y + i * (segH + gap);
    let y1 = y0 + segH;
    let d: string;
    let widthAt = 0;
    if (variant === 'pyramid') {
      // A triangle from the apex down, cut at heights by value.
      y0 = plot.y + (acc / total) * plot.h + (i ? gap / 2 : 0);
      acc += p.v;
      y1 = plot.y + (acc / total) * plot.h - (i < n - 1 ? gap / 2 : 0);
      const half = (y: number) => (plot.w / 2) * ((y - plot.y) / plot.h);
      const [h0, h1] = [half(y0), half(y1)];
      widthAt = h1 + h0;
      d = `M${r2(cx - h0)} ${r2(y0)}H${r2(cx + h0)}L${r2(cx + h1)} ${r2(y1)}H${r2(cx - h1)}Z`;
    } else if (variant === 'bars') {
      const w = Math.max(4, (plot.w * p.v) / top);
      widthAt = w;
      const h = segH * 0.78;
      y0 += (segH - h) / 2;
      y1 = y0 + h;
      d = barPath(cx - w / 2, y0, w, h, 0, 'top');
      model.shapes.push({ key, kind: 'rect', x: cx - w / 2, y: y0, w, h, rx: Math.min(10, h / 3), fill: color, enter: 'grow-x', delay: i * 70, hover: key });
      if (i < n - 1) {
        const next = stages[i + 1].v;
        model.texts.push({ x: cx, y: y1 + (segH - h) / 2 + gap / 2, text: `↓ ${k.pct(p.v ? next / p.v : 0)}`, anchor: 'middle', baseline: 'middle', tone: 'muted' });
      }
    } else {
      // Smooth sides from this stage's width to the next one's.
      const w0 = Math.max(4, (plot.w * p.v) / top);
      const w1 = i < n - 1 ? Math.max(4, (plot.w * stages[i + 1].v) / top) : w0 * 0.72;
      widthAt = Math.min(w0, w1);
      const m = segH * 0.5;
      d =
        `M${r2(cx - w0 / 2)} ${r2(y0)}H${r2(cx + w0 / 2)}` +
        `C${r2(cx + w0 / 2)} ${r2(y0 + m)} ${r2(cx + w1 / 2)} ${r2(y1 - m)} ${r2(cx + w1 / 2)} ${r2(y1)}` +
        `H${r2(cx - w1 / 2)}C${r2(cx - w1 / 2)} ${r2(y1 - m)} ${r2(cx - w0 / 2)} ${r2(y0 + m)} ${r2(cx - w0 / 2)} ${r2(y0)}Z`;
    }
    if (variant !== 'bars') model.shapes.push({ key, kind: 'path', d, fill: color, enter: 'fade', delay: i * 70, hover: key });
    const midY = (y0 + y1) / 2;
    const value = k.fmt(p.v);
    const share = k.pct(p.v / first);
    model.texts.push({ x: plot.x - pad, y: midY, text: labels[p.j] ?? '', anchor: 'end', baseline: 'middle', hover: key });
    const inside = `${value} · ${share}`;
    if (k.measure(inside, k.fontSize) + 12 <= widthAt && y1 - y0 >= k.fontSize + 4) model.texts.push({ x: cx, y: midY, text: inside, anchor: 'middle', baseline: 'middle', tone: 'inside', strong: true, hover: key });
    else if (k.measure(value, k.fontSize) + 10 <= widthAt && y1 - y0 >= k.fontSize + 2) model.texts.push({ x: cx, y: midY, text: value, anchor: 'middle', baseline: 'middle', tone: 'inside', strong: true, hover: key });
    const prev = i ? stages[i - 1].v : 0;
    const rows = [{ color, name: labels[p.j] ?? '', value }, { color, name: k.words.ofFirst, value: share }];
    if (i) rows.push({ color, name: k.words.ofPrevious, value: k.pct(prev ? p.v / prev : 0) });
    model.hover.push({ index: p.j, key, tip: { title: '', rows }, x: plot.x, y: y0, w: plot.w, h: Math.max(1, y1 - y0), cx, cy: y0, value: p.v, label: labels[p.j] ?? '' });
  });
  return model;
}

// ---------------------------------------------------------------- box plot

/** The five numbers (and outliers past 1.5 × the box) of raw values. */
export function boxStats(values: number[]): ChartBoxStats & { mean: number } {
  const v = values.filter((x) => Number.isFinite(x)).sort((p, q) => p - q);
  if (!v.length) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [], mean: 0 };
  const q = (p: number) => {
    const at = (v.length - 1) * p;
    const lo = Math.floor(at);
    return v[lo] + (v[Math.min(v.length - 1, lo + 1)] - v[lo]) * (at - lo);
  };
  const q1 = q(0.25);
  const q3 = q(0.75);
  const reach = (q3 - q1) * 1.5;
  const inside = v.filter((x) => x >= q1 - reach && x <= q3 + reach);
  return {
    min: inside[0] ?? v[0],
    q1,
    median: q(0.5),
    q3,
    max: inside[inside.length - 1] ?? v[v.length - 1],
    outliers: v.filter((x) => x < q1 - reach || x > q3 + reach),
    mean: v.reduce((a, b) => a + b, 0) / v.length,
  };
}

/**
 * The spread of values per label (raw values, or `{ min, q1, median, q3, max }`), a box per series: `'box'` (default;
 * box, whiskers and outlier dots), `'violin'` (the shape of the values, from raw values) or `'points'` (every value as
 * a dot over a light box).
 */
export function boxplotModel(o: ChartModelOptions, model: ChartModel, palette: string[]): ChartModel {
  const k = kit(o);
  const variant = o.variant === 'violin' || o.variant === 'points' ? o.variant : 'box';
  const across = !!o.horizontal;
  const labels = (o.labels || []).map((l) => String(l ?? ''));
  const all = o.series || [];
  model.legend = all.length > 1 ? all.map((s, i) => ({ index: i, name: s.name ?? '', color: colorOf(s, i, palette), hidden: !!s.hidden, shape: 'box' })) : [];
  const shown = all.map((s, i) => ({ s, i })).filter((p) => !p.s.hidden);
  const count = Math.max(labels.length, ...shown.map((p) => p.s.data.length), 0);
  type Box = { stats: ChartBoxStats & { mean?: number }; raw: number[] | null };
  const boxes: (Box | null)[][] = shown.map((p) =>
    Array.from({ length: count }, (_, j) => {
      const d = (p.s.data as unknown[])[j];
      if (Array.isArray(d)) {
        const raw = d.filter((x): x is number => num(x) !== null);
        return raw.length ? { stats: boxStats(raw), raw } : null;
      }
      if (d && typeof d === 'object' && num((d as ChartBoxStats).median) !== null) return { stats: d as ChartBoxStats, raw: null };
      return null;
    })
  );
  let lo = Infinity;
  let hi = -Infinity;
  for (const row of boxes) {
    for (const b of row) {
      if (!b) continue;
      for (const v of [b.stats.min, b.stats.max, ...(b.stats.outliers || [])]) {
        lo = Math.min(lo, v);
        hi = Math.max(hi, v);
      }
    }
  }
  model.empty = !(lo <= hi);
  if (model.empty) [lo, hi] = [0, 1];
  const a = axes(o, model, { cats: labels.slice(0, count), across, lo, hi, zero: false, fmt: k.fmt, padding: 0.3 });
  const slot = a.bw / Math.max(1, shown.length);
  // A point at category px `c` and value `v`.
  const at = (c: number, v: number) => (across ? { x: a.val(v), y: c } : { x: c, y: a.val(v) });
  const w = Math.min(slot * 0.62, 56);
  const single = shown.length === 1;
  for (let j = 0; j < count; j++) {
    const rows: ChartTip['rows'] = [];
    shown.forEach((p, n) => {
      const b = boxes[n][j];
      if (!b) return;
      const st = b.stats;
      const color = single && !p.s.color ? palette[j % palette.length] : colorOf(p.s, p.i, palette);
      const c = a.offset(j) + slot * n + slot / 2;
      const key = `b${p.i}-${j}`;
      const hover = `c${j}`;
      const delay = j * 60;
      const box = (v0: number, v1: number, half: number) => {
        const p0 = at(c - half, v0);
        const p1 = at(c + half, v1);
        return { x: Math.min(p0.x, p1.x), y: Math.min(p0.y, p1.y), w: Math.abs(p1.x - p0.x), h: Math.abs(p1.y - p0.y) };
      };
      const seg = (name: string, c0: number, v0: number, c1: number, v1: number, width: number, cls: string) => {
        const p0 = at(c0, v0);
        const p1 = at(c1, v1);
        model.shapes.push({ key: `${key}${name}`, kind: 'line', x: p0.x, y: p0.y, x2: p1.x, y2: p1.y, stroke: color, strokeWidth: width, className: cls, enter: 'fade', delay, hover });
      };
      if (variant === 'violin' && b.raw && b.raw.length > 1) {
        // Gaussian kernel density, Silverman's bandwidth, mirrored about the middle.
        const v = b.raw;
        const mean = v.reduce((x, y) => x + y, 0) / v.length;
        const sd = Math.sqrt(v.reduce((x, y) => x + (y - mean) ** 2, 0) / (v.length - 1)) || (st.q3 - st.q1) / 1.34 || 1;
        const bw = 1.06 * sd * Math.pow(v.length, -0.2);
        const from = Math.min(...v);
        const to = Math.max(...v);
        const steps = 36;
        const dens = Array.from({ length: steps + 1 }, (_, s) => {
          const x = from + ((to - from) * s) / steps;
          return { x, d: v.reduce((sum, y) => sum + Math.exp(-0.5 * ((x - y) / bw) ** 2), 0) };
        });
        const peak = Math.max(...dens.map((p2) => p2.d)) || 1;
        const half = slot * 0.46;
        const side = (sign: number) => dens.map((p2) => at(c + sign * (p2.d / peak) * half, p2.x));
        const right = side(1);
        const left = side(-1).reverse();
        const d = [...right, ...left].map((p2, i) => `${i ? 'L' : 'M'}${r2(p2.x)} ${r2(p2.y)}`).join('') + 'Z';
        model.shapes.push({ key: `${key}v`, kind: 'path', d, fill: color, opacity: 0.32, stroke: color, strokeWidth: 1.5, enter: 'fade', delay, hover });
        const r = box(st.q1, st.q3, 3);
        model.shapes.push({ key: `${key}q`, kind: 'rect', ...r, rx: 2, fill: color, enter: 'fade', delay, hover });
        seg('w', c, st.min, c, st.max, 1.5, 'wt-chart-whisker');
        const m = at(c, st.median);
        model.shapes.push({ key: `${key}m`, kind: 'circle', x: m.x, y: m.y, r: 3.5, fill: 'var(--wt-chart-dot-fill)', stroke: color, strokeWidth: 2, enter: 'pop', delay, hover });
      } else {
        const faint = variant === 'points';
        seg('w', c, st.min, c, st.q1, 1.5, 'wt-chart-whisker');
        seg('W', c, st.q3, c, st.max, 1.5, 'wt-chart-whisker');
        seg('l', c - w / 4, st.min, c + w / 4, st.min, 1.5, 'wt-chart-whisker');
        seg('h', c - w / 4, st.max, c + w / 4, st.max, 1.5, 'wt-chart-whisker');
        const r = box(st.q1, st.q3, w / 2);
        model.shapes.push({ key: `${key}q`, kind: 'rect', ...r, rx: 4, fill: color, opacity: faint ? 0.12 : 0.28, stroke: color, strokeWidth: 1.5, enter: across ? 'grow-x' : 'grow', delay, hover });
        seg('m', c - w / 2, st.median, c + w / 2, st.median, 3, 'wt-chart-median');
        if (faint && b.raw) {
          b.raw.forEach((v, i) => {
            // A steady jitter, the same every time.
            const jitter = ((((i + 1) * 7919) % 101) / 100 - 0.5) * w * 0.8;
            const pt = at(c + jitter, v);
            model.shapes.push({ key: `${key}p${i}`, kind: 'circle', x: pt.x, y: pt.y, r: 2.6, fill: color, opacity: 0.75, enter: 'pop', delay: delay + i * 6, hover });
          });
        } else {
          (st.outliers || []).forEach((v, i) => {
            const pt = at(c, v);
            model.shapes.push({ key: `${key}o${i}`, kind: 'circle', x: pt.x, y: pt.y, r: 3, fill: 'var(--wt-chart-dot-fill)', stroke: color, strokeWidth: 1.5, enter: 'pop', delay, hover });
          });
        }
      }
      if (single) {
        rows.push(
          { color, name: k.words.max, value: k.fmt(st.max) },
          { color, name: k.words.q3, value: k.fmt(st.q3) },
          { color, name: k.words.median, value: k.fmt(st.median) },
          { color, name: k.words.q1, value: k.fmt(st.q1) },
          { color, name: k.words.min, value: k.fmt(st.min) }
        );
      } else rows.push({ color, name: p.s.name ?? '', value: `${k.fmt(st.median)} (${k.fmt(st.q1)} – ${k.fmt(st.q3)})` });
    });
    if (rows.length) model.hover.push(categoryTarget(a, j, across, `c${j}`, { title: labels[j] ?? '', rows }));
  }
  return model;
}

// ---------------------------------------------------------------- histogram

/**
 * How raw values spread, counted in bins on round edges (`bins`, default by Sturges' rule): `'bars'` (default; one
 * series draws solid, several overlap see-through) or `'density'` (a smooth fading curve through the counts). One
 * series also gets a dashed line at its mean.
 */
export function histogramModel(o: ChartModelOptions, model: ChartModel, palette: string[]): ChartModel {
  const k = kit(o);
  const density = o.variant === 'density';
  const all = o.series || [];
  model.legend = all.length > 1 ? all.map((s, i) => ({ index: i, name: s.name ?? '', color: colorOf(s, i, palette), hidden: !!s.hidden, shape: 'box' })) : [];
  const shown = all.map((s, i) => ({ s, i, v: valuesOf(s).filter((x): x is number => x !== null) })).filter((p) => !p.s.hidden);
  const values = shown.flatMap((p) => p.v);
  model.empty = !values.length;
  let lo = values.length ? Math.min(...values) : 0;
  let hi = values.length ? Math.max(...values) : 1;
  if (lo === hi) [lo, hi] = [lo - 0.5, hi + 0.5];
  const want = o.bins && o.bins > 0 ? Math.round(o.bins) : Math.max(5, Math.min(30, Math.ceil(Math.log2(Math.max(1, values.length / Math.max(1, shown.length)))) + 1));
  const edges = niceScale(lo, hi, want, false).ticks;
  if (edges.length < 2) edges.push(edges[0] + 1);
  const binCount = edges.length - 1;
  const binOf = (v: number) => {
    for (let b = 0; b < binCount; b++) if (v < edges[b + 1]) return b;
    return binCount - 1;
  };
  const counts = shown.map((p) => {
    const c = new Array(binCount).fill(0);
    for (const v of p.v) c[binOf(v)]++;
    return c;
  });
  const top = Math.max(1, ...counts.flat());
  const ints = (v: number) => formatChartValue(v, 'integer', o.formatOptions);
  const a = axes(o, model, {
    cats: [],
    lo: 0,
    hi: top,
    zero: true,
    fmt: ints,
    numericX: { min: edges[0], max: edges[binCount], ticks: edges, fmt: k.fmt },
  });
  const overlap = shown.length > 1;
  shown.forEach((p, n) => {
    const color = colorOf(p.s, p.i, palette);
    if (density) {
      const pts = counts[n].map((c, b) => ({ x: a.nx((edges[b] + edges[b + 1]) / 2), y: a.val(c) }));
      const ends = [{ x: a.nx(edges[0]), y: a.val(0) }, ...pts, { x: a.nx(edges[binCount]), y: a.val(0) }];
      model.shapes.push({ key: `hd${p.i}`, kind: 'path', d: areaPath(ends, a.val(0), 'smooth'), fill: color, fade: true, enter: 'fade', hover: `s${p.i}` });
      model.shapes.push({ key: `hl${p.i}`, kind: 'path', d: linePath(ends, 'smooth'), stroke: color, strokeWidth: 2.5, enter: 'draw', className: 'wt-chart-line-shape' });
    } else {
      counts[n].forEach((c, b) => {
        if (!c) return;
        const x0 = a.nx(edges[b]) + 1;
        const x1 = a.nx(edges[b + 1]) - 1;
        const y = a.val(c);
        model.shapes.push({ key: `h${p.i}-${b}`, kind: 'path', d: barPath(x0, y, Math.max(1, x1 - x0), a.val(0) - y, 3, 'top'), fill: color, opacity: overlap ? 0.55 : 1, enter: 'grow', delay: b * 25, hover: `h${b}` });
      });
    }
    if (!overlap && p.v.length) {
      const mean = p.v.reduce((x, y) => x + y, 0) / p.v.length;
      const x = a.nx(mean);
      model.references.push({ x1: x, y1: a.plot.y, x2: x, y2: a.plot.y + a.plot.h, color: 'var(--wt-chart-reference-color)', dashed: true, label: { x: x + 4, y: a.plot.y + 2, text: `${k.words.mean} ${k.fmt(mean)}`, anchor: 'start', baseline: 'hanging' } });
    }
  });
  for (let b = 0; b < binCount; b++) {
    const x0 = a.nx(edges[b]);
    const x1 = a.nx(edges[b + 1]);
    const rows = shown.map((p, n) => ({ color: colorOf(p.s, p.i, palette), name: overlap ? p.s.name ?? '' : k.words.count, value: ints(counts[n][b]) }));
    model.hover.push({ index: b, key: `h${b}`, tip: { title: `${k.fmt(edges[b])} – ${k.fmt(edges[b + 1])}`, rows }, x: x0, y: a.plot.y, w: x1 - x0, h: a.plot.h, cx: (x0 + x1) / 2, cy: a.plot.y, cross: density });
  }
  return model;
}

// ---------------------------------------------------------------- sunburst and icicle

const nodeSum = (n: ChartNode): number => {
  const own = Math.max(0, num(n.value) ?? 0);
  if (!n.children || !n.children.length) return own;
  return Math.max(own, n.children.reduce((sum, c) => sum + nodeSum(c), 0));
};
const nodeDepth = (n: ChartNode): number => 1 + (n.children && n.children.length ? Math.max(...n.children.map(nodeDepth)) : 0);

/**
 * A hierarchy (`series[0].data` are `{ name, value?, children? }` nodes) as rings from the middle out (`'sunburst'`,
 * default; `startAngle` / `endAngle` make a half one) or as stacked columns (`'icicle'`). A click on a node with children
 * goes into it (`focus`); the middle shows where you are.
 */
export function sunburstModel(o: ChartModelOptions, model: ChartModel, palette: string[]): ChartModel {
  const k = kit(o);
  const icicle = o.variant === 'icicle';
  const roots = ((o.series || [])[0]?.data as ChartNode[] | undefined)?.filter((n) => n && typeof n === 'object' && typeof n.name === 'string') || [];
  model.legend = roots.map((n, i) => ({ index: i, name: n.name, color: n.color || palette[i % palette.length], hidden: (o.hiddenSlices || []).includes(i), shape: 'box' }));
  model.dimOthers = true;
  const hidden = new Set(o.hiddenSlices || []);
  // The node in focus (by its path of names), its children drawn first.
  const path = (o.focus || '').split('/').filter(Boolean);
  let level: ChartNode[] = roots.filter((_, i) => !hidden.has(i));
  let focusNode: ChartNode | null = null;
  const trail: string[] = [];
  for (const name of path) {
    const next = level.find((n) => n.name === name);
    if (!next || !next.children || !next.children.length) break;
    focusNode = next;
    trail.push(name);
    level = next.children;
  }
  const topColor = (name: string) => {
    const i = roots.findIndex((n) => n.name === name);
    return roots[i]?.color || palette[Math.max(0, i) % palette.length];
  };
  const total = level.reduce((sum, n) => sum + nodeSum(n), 0);
  const nodeTip = (v: number, keys: string[], color: string): ChartTip => ({ title: keys.join(' › '), rows: [{ color, name: k.pct(total ? v / total : 0), value: k.fmt(v) }] });
  model.empty = !(total > 0);
  const depth = Math.max(1, ...level.map(nodeDepth));
  const shade = (d: number) => [1, 0.78, 0.6, 0.46, 0.36][Math.min(4, d)];
  model.centerText = { value: k.fmt(total), label: focusNode ? focusNode.name : k.words.total };
  if (model.empty) return model;
  const sweep = Math.min(1, Math.max(0, o.sweep ?? 1));
  if (icicle) {
    const plot = { x: 2, y: 2, w: Math.max(0, model.width - 4), h: Math.max(0, model.height - 4) };
    model.plot = plot;
    const colW = plot.w / depth;
    const walk = (nodes: ChartNode[], d: number, y0: number, h: number, keyPath: string[], color: string | null) => {
      let y = y0;
      const sum = nodes.reduce((s2, n) => s2 + nodeSum(n), 0) || 1;
      nodes.forEach((n) => {
        const v = nodeSum(n);
        const nh = (h * v) / sum;
        const keys = [...keyPath, n.name];
        const key = keys.join('/');
        const c = n.color || color || topColor(keys[0]);
        const x = plot.x + d * colW;
        if (nh > 0.5) {
          model.shapes.push({ key: `i${key}`, kind: 'rect', x: x + 1, y: y + 1, w: Math.max(0, colW * sweep - 2), h: Math.max(0, nh - 2), rx: 4, fill: c, opacity: shade(trail.length + d), enter: 'fade', delay: d * 90, hover: key });
          if (nh >= k.fontSize + 8 && k.measure(n.name, k.fontSize) + 16 <= colW) {
            model.texts.push({ x: x + 9, y: y + 8, text: n.name, anchor: 'start', baseline: 'hanging', tone: 'inside', strong: true, hover: key });
            if (nh >= k.fontSize * 2.4 + 10) model.texts.push({ x: x + 9, y: y + 8 + k.fontSize * 1.35, text: k.fmt(v), anchor: 'start', baseline: 'hanging', tone: 'inside', hover: key });
          }
          model.hover.push({ index: 0, key, tip: nodeTip(v, keys, c), x: x + 1, y: y + 1, w: colW - 2, h: nh - 2, cx: x + colW / 2, cy: y, value: v, label: n.name, drill: !!(n.children && n.children.length) });
        }
        if (n.children && n.children.length) walk(n.children, d + 1, y, nh, keys, c);
        y += nh;
      });
    };
    walk(level, 0, plot.y, plot.h, trail, focusNode ? focusNode.color || topColor(trail[0]) : null);
    return model;
  }
  const { start, span, lift } = arcSpan(o);
  const fit = fitArc(model.width, model.height, start, start + span, 6);
  const outer = fit.radius;
  const hole = outer * 0.26;
  const ring = (outer - hole) / depth;
  model.plot = { x: fit.cx - outer, y: fit.cy - outer, w: outer * 2, h: outer * 2 };
  model.center = { x: fit.cx, y: fit.cy, r: hole, lift };
  const walk = (nodes: ChartNode[], d: number, a0: number, a1: number, keyPath: string[], color: string | null) => {
    const sum = nodes.reduce((s2, n) => s2 + nodeSum(n), 0) || 1;
    let a = a0;
    nodes.forEach((n) => {
      const v = nodeSum(n);
      const sweepA = ((a1 - a0) * v) / sum;
      const keys = [...keyPath, n.name];
      const key = keys.join('/');
      const c = n.color || color || topColor(keys[0]);
      const r0 = hole + d * ring;
      const r1 = r0 + ring;
      if (sweepA > 0.002) {
        const gap = Math.min(0.012, sweepA / 4);
        model.shapes.push({ key: `u${key}`, kind: 'path', d: arcPath(fit.cx, fit.cy, r0 + 1, r1 - 1, a + gap / 2, a + sweepA - gap / 2), fill: c, opacity: shade(trail.length + d), className: 'wt-chart-sun', hover: key });
        // The name along the middle of the slice, when the slice is wide and tall enough.
        const mid = a + sweepA / 2;
        const tw = k.measure(n.name, k.fontSize);
        if (tw + 8 <= ring && sweepA * (r0 + ring / 2) >= k.fontSize + 4) {
          const p = polar(fit.cx, fit.cy, r0 + ring / 2, mid);
          let deg = (mid * 180) / Math.PI - 90;
          if (Math.cos(mid - Math.PI / 2) < 0) deg += 180;
          model.texts.push({ x: p.x, y: p.y, text: n.name, anchor: 'middle', baseline: 'middle', tone: 'inside', strong: true, rotate: r2(((deg % 360) + 360) % 360), hover: key });
        } else if (tw + 10 <= sweepA * (r0 + ring / 2) && ring >= k.fontSize + 6) {
          const p = polar(fit.cx, fit.cy, r0 + ring / 2, mid);
          model.texts.push({ x: p.x, y: p.y, text: n.name, anchor: 'middle', baseline: 'middle', tone: 'inside', strong: true, hover: key });
        }
        model.hover.push({
          index: 0,
          key,
          tip: nodeTip(v, keys, c),
          arc: { cx: fit.cx, cy: fit.cy, r0, r1, a0: a, a1: a + sweepA },
          x: fit.cx,
          y: fit.cy,
          w: 0,
          h: 0,
          cx: polar(fit.cx, fit.cy, r1, mid).x,
          cy: polar(fit.cx, fit.cy, r1, mid).y,
          value: v,
          label: n.name,
          drill: !!(n.children && n.children.length),
        });
      }
      if (n.children && n.children.length) walk(n.children, d + 1, a, a + sweepA, keys, c);
      a += sweepA;
    });
  };
  walk(level, 0, start, start + span * sweep, trail, focusNode ? focusNode.color || topColor(trail[0]) : null);
  return model;
}

// ---------------------------------------------------------------- unit

/** A person, `s` px square, top-left at (x, y): a round head over round shoulders. */
function person(x: number, y: number, s: number): string {
  const hr = s * 0.17;
  const hx = x + s / 2;
  const hy = y + s * 0.22;
  const l = x + s * 0.2;
  const r = x + s * 0.8;
  const t = y + s * 0.47;
  const b = y + s * 0.98;
  const rr = (r - l) / 2;
  return (
    `M${r2(hx - hr)} ${r2(hy)}a${r2(hr)} ${r2(hr)} 0 1 0 ${r2(hr * 2)} 0a${r2(hr)} ${r2(hr)} 0 1 0 ${r2(-hr * 2)} 0Z` +
    `M${r2(l)} ${r2(b)}V${r2(t + rr)}A${r2(rr)} ${r2(rr)} 0 0 1 ${r2(r)} ${r2(t + rr)}V${r2(b)}Z`
  );
}

/**
 * Shares as a grid of units, a value per label: `'waffle'` (default; 10 × 10 squares, one per percent), `'dots'` (the
 * same as dots) or `'people'` (50 figures, each 2%). Units fill row by row in label order, coming in as a ripple.
 */
export function unitModel(o: ChartModelOptions, model: ChartModel, palette: string[]): ChartModel {
  const k = kit(o);
  const variant = o.variant === 'dots' || o.variant === 'people' ? o.variant : 'waffle';
  const labels = (o.labels || []).map((l) => String(l ?? ''));
  const s = (o.series || [])[0];
  const hidden = new Set(o.hiddenSlices || []);
  const values = valuesOf(s).map((v) => Math.max(0, v ?? 0));
  const colorAt = (j: number) => s?.colors?.[j] || palette[j % palette.length];
  model.legend = values.map((_, j) => ({ index: j, name: labels[j] ?? '', color: colorAt(j), hidden: hidden.has(j), shape: variant === 'waffle' ? 'box' : 'dot' }));
  model.dimOthers = true;
  const shown = values.map((v, j) => ({ v, j })).filter((p) => !hidden.has(p.j) && p.v > 0);
  const total = shown.reduce((sum, p) => sum + p.v, 0);
  model.empty = !(total > 0);
  if (model.empty) return model;
  const cols = 10;
  const rows = variant === 'people' ? 5 : 10;
  const units = cols * rows;
  // Largest remainders: whole units adding up to the grid.
  const exact = shown.map((p) => (p.v / total) * units);
  const counts = exact.map(Math.floor);
  let left = units - counts.reduce((a, b) => a + b, 0);
  exact
    .map((e, i) => ({ i, f: e - Math.floor(e) }))
    .sort((p, q) => q.f - p.f)
    .forEach((p) => {
      if (left-- > 0) counts[p.i]++;
    });
  const size = Math.min((model.width - 8) / cols, (model.height - 8) / rows);
  const x0 = (model.width - size * cols) / 2;
  const y0 = (model.height - size * rows) / 2;
  model.plot = { x: x0, y: y0, w: size * cols, h: size * rows };
  const gap = size * (variant === 'people' ? 0.06 : 0.12);
  let n = 0;
  shown.forEach((p, i) => {
    const color = colorAt(p.j);
    const key = `u${p.j}`;
    const tip: ChartTip = { title: labels[p.j] ?? '', rows: [{ color, name: k.pct(p.v / total), value: k.fmt(p.v) }] };
    for (let c = 0; c < counts[i]; c++, n++) {
      const x = x0 + (n % cols) * size;
      const y = y0 + Math.floor(n / cols) * size;
      const inner = size - gap;
      const shape: ChartShape =
        variant === 'people'
          ? { key: `${key}-${c}`, kind: 'path', d: person(x + gap / 2, y + gap / 2, inner), fill: color, enter: 'pop', delay: n * 14, hover: key }
          : variant === 'dots'
            ? { key: `${key}-${c}`, kind: 'circle', x: x + size / 2, y: y + size / 2, r: inner / 2, fill: color, enter: 'pop', delay: n * 9, hover: key }
            : { key: `${key}-${c}`, kind: 'rect', x: x + gap / 2, y: y + gap / 2, w: inner, h: inner, rx: inner * 0.18, fill: color, enter: 'pop', delay: n * 9, hover: key };
      model.shapes.push(shape);
      model.hover.push({ index: p.j, key, tip, x, y, w: size, h: size, cx: x + size / 2, cy: y, value: p.v, label: labels[p.j] ?? '' });
    }
  });
  return model;
}

// ---------------------------------------------------------------- slope

/**
 * How each series changed between labels (usually two: before and after), names and values beside the ends:
 * `'lines'` (default; each series its colour) or `'highlight'` (up green, down red, no change grey).
 */
export function slopeModel(o: ChartModelOptions, model: ChartModel, palette: string[]): ChartModel {
  const k = kit(o);
  const highlight = o.variant === 'highlight';
  const labels = (o.labels || []).map((l) => String(l ?? ''));
  const all = o.series || [];
  model.legend = highlight ? [] : all.map((s, i) => ({ index: i, name: s.name ?? '', color: colorOf(s, i, palette), hidden: !!s.hidden, shape: 'line' }));
  model.dimOthers = true;
  const shown = all.map((s, i) => ({ s, i, v: valuesOf(s) })).filter((p) => !p.s.hidden);
  const count = Math.max(2, labels.length, ...shown.map((p) => p.v.length));
  let lo = Infinity;
  let hi = -Infinity;
  for (const p of shown) {
    for (const v of p.v) {
      if (v === null) continue;
      lo = Math.min(lo, v);
      hi = Math.max(hi, v);
    }
  }
  model.empty = !(lo <= hi);
  if (model.empty) return model;
  if (lo === hi) [lo, hi] = [lo - 1, hi + 1];
  const given = o.scales?.left;
  const [min, max] = given && given.max > given.min ? [given.min, given.max] : [lo, hi];
  model.scales = { left: { min: lo, max: hi, ticks: [] }, right: null };
  const firstOf = (p: (typeof shown)[number]) => p.v.find((v) => v !== null) ?? null;
  const lastOf = (p: (typeof shown)[number]) => [...p.v].reverse().find((v) => v !== null) ?? null;
  const text = (p: (typeof shown)[number], v: number | null, side: 'left' | 'right') => {
    const name = p.s.name ?? '';
    const value = v === null ? '' : k.fmt(v);
    return side === 'left' ? `${name}  ${value}` : `${value}  ${name}`;
  };
  const pad = 8;
  const leftW = Math.min(model.width * 0.32, Math.max(0, ...shown.map((p) => k.measure(text(p, firstOf(p), 'left'), k.fontSize)))) + pad * 2;
  const rightW = Math.min(model.width * 0.32, Math.max(0, ...shown.map((p) => k.measure(text(p, lastOf(p), 'right'), k.fontSize)))) + pad * 2;
  const top = pad + k.lineH + 6;
  const plot = { x: leftW, y: top, w: Math.max(10, model.width - leftW - rightW), h: Math.max(10, model.height - top - pad - k.fontSize / 2) };
  model.plot = plot;
  const xOf = (j: number) => plot.x + (plot.w * j) / (count - 1);
  const yOf = (v: number) => scaleLinear(v, min, max, plot.y + plot.h, plot.y);
  for (let j = 0; j < count; j++) {
    const x = xOf(j);
    model.grid.push({ x1: x, y1: plot.y - 4, x2: x, y2: plot.y + plot.h + 4 });
    model.texts.push({ x, y: pad, text: labels[j] ?? '', anchor: j === 0 ? 'end' : j === count - 1 ? 'start' : 'middle', baseline: 'hanging', strong: true });
  }
  const colorFor = (p: (typeof shown)[number]) => {
    if (!highlight) return colorOf(p.s, p.i, palette);
    const [a, b] = [firstOf(p), lastOf(p)];
    return a === null || b === null || a === b ? MUTED : b > a ? UP : DOWN;
  };
  const gapY = k.fontSize + 3;
  const lefts = relaxLabels(shown.map((p) => yOf(firstOf(p) ?? 0)), gapY, plot.y, plot.y + plot.h);
  const rights = relaxLabels(shown.map((p) => yOf(lastOf(p) ?? 0)), gapY, plot.y, plot.y + plot.h);
  shown.forEach((p, n) => {
    const color = colorFor(p);
    const key = `l${p.i}`;
    const pts = p.v.map((v, j) => (v === null ? null : { x: xOf(j), y: yOf(v) }));
    model.shapes.push({ key, kind: 'path', d: linePath(pts), stroke: color, strokeWidth: 2.5, className: 'wt-chart-line-shape', enter: 'draw', delay: n * 50, hover: key });
    pts.forEach((pt, j) => {
      if (pt) model.shapes.push({ key: `${key}d${j}`, kind: 'circle', x: pt.x, y: pt.y, r: 4.5, fill: 'var(--wt-chart-dot-fill)', stroke: color, strokeWidth: 2.5, enter: 'pop', delay: n * 50 + j * 250, hover: key });
    });
    const [a, b] = [firstOf(p), lastOf(p)];
    model.texts.push({ x: plot.x - 10, y: lefts[n], text: text(p, a, 'left'), anchor: 'end', baseline: 'middle', color: highlight ? undefined : color, hover: key });
    model.texts.push({ x: plot.x + plot.w + 10, y: rights[n], text: text(p, b, 'right'), anchor: 'start', baseline: 'middle', color: highlight ? undefined : color, hover: key });
    const rows = p.v.map((v, j) => ({ color, name: labels[j] ?? '', value: v === null ? '–' : k.fmt(v) }));
    if (a !== null && b !== null && a !== 0) rows.push({ color, name: k.words.change, value: `${b >= a ? '+' : '−'}${k.pct(Math.abs((b - a) / a))}` });
    const line = pts.filter((pt): pt is { x: number; y: number } => !!pt);
    model.hover.push({ index: n, series: p.i, key, tip: { title: p.s.name ?? '', rows }, points: line, x: plot.x, y: plot.y, w: 0, h: 0, cx: line[line.length - 1]?.x ?? 0, cy: line[line.length - 1]?.y ?? 0 });
  });
  return model;
}

// ---------------------------------------------------------------- hit test and type switching

/** The hover target under (x, y): ring slices by angle and radius, lines by distance, boxes by being inside, points by distance. */
export function chartHit(model: ChartModel, x: number, y: number): ChartHoverBand | null {
  let best: ChartHoverBand | null = null;
  let bestD = Infinity;
  for (const h of model.hover) {
    if (h.arc) {
      const { cx, cy, r0, r1, a0, a1 } = h.arc;
      const r = Math.hypot(x - cx, y - cy);
      if (r < r0 || r > r1) continue;
      const turn = (((Math.atan2(x - cx, cy - y) - a0) % TURN) + TURN) % TURN;
      if (turn <= a1 - a0) return h;
      continue;
    }
    if (h.points && h.points.length > 1) {
      for (let i = 1; i < h.points.length; i++) {
        const d = segmentDistance(x, y, h.points[i - 1], h.points[i]);
        if (d < 10 && d < bestD) {
          best = h;
          bestD = d;
        }
      }
      continue;
    }
    if (h.w > 0 && h.h > 0) {
      if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h;
      continue;
    }
    const d = Math.hypot(x - h.cx, y - h.cy);
    if (d < 14 && d < bestD) {
      best = h;
      bestD = d;
    }
  }
  return best;
}

function segmentDistance(x: number, y: number, a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = dx * dx + dy * dy;
  const t = len ? Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / len)) : 0;
  return Math.hypot(x - (a.x + t * dx), y - (a.y + t * dy));
}

/** Kinds whose values do not move from the old to the new (raw values, ranges, nodes, units): they come in with their shapes' own entrance. */
export function chartMovesValues(type: ChartType): boolean {
  return !['timeline', 'boxplot', 'histogram', 'sunburst', 'unit', 'dumbbell', 'slope', 'scatter'].includes(type);
}

/**
 * The kinds the same data can switch to (the type switcher): numbers per label for several series (bar, line, area,
 * stream, radar, heatmap, slope, dumbbell, treemap), for one series (also pie, doughnut, polar area, funnel, treemap,
 * unit), raw values (histogram, box plot). Timeline, sunburst, scatter, waterfall and radial bars stay as they are.
 */
export function chartSwapTypes(type: ChartType, series: ChartSeries[] | null | undefined, labels?: unknown[] | null): ChartType[] {
  const list = series || [];
  const count = Math.max(labels?.length ?? 0, ...list.map((s) => s.data.length), 0);
  const numbers = list.length > 0 && list.every((s) => (s.data as unknown[]).every((v) => v === null || v === undefined || typeof v === 'number'));
  const raw = list.length > 0 && list.every((s) => (s.data as unknown[]).every((v) => v === null || Array.isArray(v)));
  let kinds: ChartType[] = [type];
  if (type === 'histogram' && numbers) kinds = ['histogram'];
  else if (type === 'boxplot' && raw) kinds = ['boxplot'];
  else if (numbers && list.length === 1) kinds = ['bar', 'line', 'area', 'pie', 'doughnut', 'polarArea', 'funnel', 'treemap', 'unit', ...(count >= 3 ? (['radar'] as ChartType[]) : [])];
  else if (numbers && list.length > 1)
    kinds = ['bar', 'line', 'area', 'stream', ...(count >= 3 ? (['radar'] as ChartType[]) : []), 'heatmap', ...(count >= 2 ? (['slope'] as ChartType[]) : []), 'dumbbell', 'treemap'];
  return kinds.includes(type) ? kinds : [type];
}
