/**
 * wt-chart: from data to shapes. `chartModel()` takes series (or Chart.js-shaped data, see `chartSeriesFrom()`), the size
 * and the options, and returns everything a renderer draws: the plot box, axis ticks, grid, bars, lines, areas, dots,
 * slices, radar webs, value labels, reference lines and the hover bands, all in pixels. No DOM: text widths come from
 * the `measure` callback.
 */
import { formatChartValue, ChartFormatOptions, ChartValueFormat } from './format';
import { boxplotModel, dumbbellModel, funnelModel, histogramModel, slopeModel, streamModel, sunburstModel, timelineModel, unitModel, waterfallModel } from './kinds';
import { arcSpan, heatmapModel, radialBarModel, treemapModel } from './more';
import { arcLine, arcPath, areaPath, bandPath, barPath, ChartCurve, ChartPoint, fitArc, linePath, polar } from './paths';
import { bands, niceScale, scaleLinear } from './scale';

export type ChartType =
  | 'bar'
  | 'line'
  | 'area'
  | 'pie'
  | 'doughnut'
  | 'polarArea'
  | 'radialBar'
  | 'radar'
  | 'scatter'
  | 'heatmap'
  | 'treemap'
  | 'stream'
  | 'waterfall'
  | 'dumbbell'
  | 'timeline'
  | 'funnel'
  | 'boxplot'
  | 'histogram'
  | 'sunburst'
  | 'unit'
  | 'slope';
export type ChartSeriesType = 'bar' | 'line' | 'area';

/** A point of a scatter or bubble chart (`r` in px makes a bubble). */
export interface ChartXY {
  x: number;
  y: number;
  r?: number;
}

/** A box plot's five numbers, when the data is not given as raw values. */
export interface ChartBoxStats {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  /** Values past the whiskers, drawn as dots. */
  outliers?: number[];
}

/** One bar of a timeline: on the row `row` (Apex's `x` works too), from `start` to `end` (numbers, dates or ISO text). */
export interface ChartRange {
  row?: string;
  x?: string;
  start: number | string | Date;
  end: number | string | Date;
  name?: string;
  color?: string;
}

/** A node of a sunburst or icicle: a value of its own (leaves), or children that add up. */
export interface ChartNode {
  name: string;
  value?: number;
  color?: string;
  children?: ChartNode[];
}

export interface ChartSeries {
  name?: string;
  /**
   * One value per label (`null` leaves a gap; a waterfall's `null` is a total), `{ x, y, r }` points for scatter, raw
   * values (histogram) or a list of raw values / five numbers per label (box plot), ranges (timeline) or nodes (sunburst).
   */
  data: (number | null | undefined)[] | ChartXY[] | (number[] | ChartBoxStats | null | undefined)[] | ChartRange[] | ChartNode[];
  /** In a bar, line or area chart: draw this series another way (bars and a line together). */
  type?: ChartSeriesType;
  /** CSS colour; default from the palette. */
  color?: string;
  /** A colour per value (pie slices, single-series bars). */
  colors?: (string | null | undefined)[];
  /** `'right'` puts the series on a second value axis. */
  axis?: 'left' | 'right';
  /** Series with the same stack key stack up; `stacked: true` stacks them all. */
  stack?: string;
  hidden?: boolean;
  smooth?: boolean;
  /** `'straight'`, `'smooth'` or `'step'` (wins over `smooth`). */
  curve?: ChartCurve;
  dashed?: boolean;
  /** Fill under a line. */
  fill?: boolean;
}

export interface ChartReferenceLine {
  value: number;
  /** Shade the band from `value` to `to` instead of drawing a line. */
  to?: number;
  label?: string;
  color?: string;
  axis?: 'left' | 'right';
  dashed?: boolean;
}

/** A line (or with `to`, a shaded band) at a label of the category axis: `at` is the label or its index. */
export interface ChartXAnnotation {
  at: string | number;
  to?: string | number;
  label?: string;
  color?: string;
  dashed?: boolean;
}

/** A marked point with a label: the value `value` at the label `at` (or its index). */
export interface ChartPointAnnotation {
  at: string | number;
  value: number;
  label?: string;
  color?: string;
  axis?: 'left' | 'right';
}

/** Notes drawn on a bar, line or area chart: value lines and bands, label lines and bands, marked points. */
export interface ChartAnnotations {
  y?: ChartReferenceLine[];
  x?: ChartXAnnotation[];
  points?: ChartPointAnnotation[];
}

/** A heatmap colour for the values from `from` to `to` (both included); `name` shows in the legend. */
export interface ChartColorRange {
  from: number;
  to: number;
  color: string;
  name?: string;
}

export interface ChartModelOptions {
  type: ChartType;
  labels?: (string | number)[];
  series: ChartSeries[];
  width: number;
  height: number;
  /** Text width in px at a font size: the renderer measures with its real font. */
  measure?: (text: string, fontSize: number) => number;
  fontSize?: number;
  /** Colours for series (or slices) without one, in order. */
  palette?: string[];
  /** Bars across instead of up. */
  horizontal?: boolean;
  stacked?: boolean;
  /** Smooth lines (each series may say otherwise). */
  smooth?: boolean;
  /** `'straight'`, `'smooth'` or `'step'` lines (wins over `smooth`; each series may say otherwise). */
  curve?: ChartCurve;
  /** Areas fade down from the line's colour. Default true; false fills them flat. */
  gradient?: boolean;
  /** A small chart with no axes, grid or text, the marks filling the box (a trend beside a number). */
  sparkline?: boolean;
  /** Where pies, doughnuts and radial bars start and end, degrees clockwise from 12 o'clock. Default 0 and 360; -90 and 90 make a half circle (a gauge). */
  startAngle?: number;
  endAngle?: number;
  /** Lines, bands and points to point things out (`referenceLines` are more `y` ones). */
  annotations?: ChartAnnotations;
  /** Heatmap colours by value instead of shades of one colour. */
  colorRanges?: ChartColorRange[];
  /**
   * The look of a kind: heatmap `'square'` / `'circle'` / `'hex'`; stream `'silhouette'` / `'wiggle'` / `'expand'`;
   * waterfall `'bars'` / `'steps'`; dumbbell `'dots'` / `'arrow'` / `'range'`; timeline `'bars'` / `'thin'`; funnel
   * `'funnel'` / `'bars'` / `'pyramid'`; box plot `'box'` / `'violin'` / `'points'`; histogram `'bars'` / `'density'`;
   * sunburst `'sunburst'` / `'icicle'`; unit `'waffle'` / `'dots'` / `'people'`; slope `'lines'` / `'highlight'`.
   */
  variant?: string;
  /** Histogram bins. Default from the number of values (Sturges), on round edges. */
  bins?: number;
  /** Sunburst: the node shown in the middle (a path of names joined by `/`), after a click drills in. */
  focus?: string;
  /** Value axis ends; default from the data with round steps. */
  min?: number;
  max?: number;
  /** Keep 0 on the value axis. Default true for bars and areas, false for lines and scatter. */
  beginAtZero?: boolean;
  rightMin?: number;
  rightMax?: number;
  /** Values on bars, points and slices. */
  showValues?: boolean;
  /** Dots on line points. Default: when there are 40 points or fewer. */
  points?: boolean;
  grid?: boolean;
  xTitle?: string;
  yTitle?: string;
  y2Title?: string;
  referenceLines?: ChartReferenceLine[];
  format?: ChartValueFormat;
  /** Format of the right axis. Default `format`. */
  rightFormat?: ChartValueFormat;
  formatOptions?: ChartFormatOptions;
  /** Rounded bar ends, px. Default 4. */
  barRadius?: number;
  /** Space between bar groups, 0–1 of a band. Default 0.25. */
  barPadding?: number;
  /** Doughnut hole, 0–1 of the radius. Default 0.62. */
  cutout?: number;
  /** Slices hidden from a pie (legend clicks), by index. */
  hiddenSlices?: number[];
  /**
   * Value axes to use as they are instead of fitting them to the data (an animation keeps the final axes, or slides
   * between two, while the marks move). Ticks outside `min` … `max` are left out.
   */
  scales?: { left?: ChartAxisScale; right?: ChartAxisScale };
  /** How much of a pie's circle is drawn, 0–1 (the slices fan out when it grows). Default 1. */
  sweep?: number;
}

/** A value axis: its ends and where its ticks are. */
export interface ChartAxisScale {
  min: number;
  max: number;
  ticks: number[];
}

export interface ChartText {
  x: number;
  y: number;
  text: string;
  anchor: 'start' | 'middle' | 'end';
  baseline?: 'auto' | 'middle' | 'hanging';
  rotate?: number;
  /** `'inside'`: on a coloured mark (light text); `'muted'`: quieter. */
  tone?: 'inside' | 'muted';
  /** Bold (a tile's name). */
  strong?: boolean;
  /** Its own colour. */
  color?: string;
  /** The hover target it belongs to (dims with the others). */
  hover?: string;
}

export interface ChartBar {
  key: string;
  d: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  series: number;
  index: number;
  value: number;
}

export interface ChartLine {
  key: string;
  d: string;
  color: string;
  series: number;
  dashed: boolean;
  /** Filled area under the line, if any. */
  area: string | null;
  /** The area fades down (a gradient from the line's colour). */
  gradient: boolean;
}

export interface ChartDot {
  key: string;
  cx: number;
  cy: number;
  r: number;
  color: string;
  series: number;
  index: number;
  value: number;
  x?: number;
}

export interface ChartSlice {
  key: string;
  d: string;
  color: string;
  index: number;
  value: number;
  percent: number;
  label: string;
  /** Where the slice's label sits, and the slice pushed out a little (hover). */
  labelX: number;
  labelY: number;
  dx: number;
  dy: number;
}

/** One ring of a radial bar: its track and the value's arc over it (open arcs, drawn as `width`-wide strokes). */
export interface ChartRing {
  key: string;
  index: number;
  color: string;
  value: number;
  /** The value as a share of `max`, 0–1. */
  percent: number;
  label: string;
  track: string;
  d: string;
  width: number;
  /** Round ends (a whole circle); a gauge's ends are cut square so they stay inside the box. */
  round: boolean;
}

/** A heatmap cell or a treemap tile. */
export interface ChartCell {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  opacity: number;
  series: number;
  index: number;
  value: number;
  label: string;
  texts: ChartText[];
  /** A circle or a hexagon (heatmap looks) instead of the rounded box. */
  d?: string;
}

/** A plain shape of the newer kinds (stream, waterfall, funnel, …), in pixels. */
export interface ChartShape {
  key: string;
  kind: 'path' | 'rect' | 'circle' | 'line';
  d?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  r?: number;
  x2?: number;
  y2?: number;
  rx?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  dashed?: boolean;
  /** Fill fading down from `fill` (a gradient). */
  fade?: boolean;
  /** A stroke going from one colour to another along the shape (`userSpaceOnUse` ends). */
  gradient?: { x1: number; y1: number; x2: number; y2: number; from: string; to: string };
  /** How it comes in when drawn the first time: grow up, grow across, pop, draw the line, fade. */
  enter?: 'grow' | 'grow-x' | 'pop' | 'draw' | 'fade';
  /** Entrance delay, ms (a ripple across the shapes). */
  delay?: number;
  /** The hover target it belongs to (`ChartHoverBand.key`): lit when that target or one under it is pointed at. */
  hover?: string;
  /** Extra class: `'wt-chart-connector'`, `'wt-chart-whisker'`, … */
  className?: string;
}

/** A tooltip worked out with the shapes. */
export interface ChartTip {
  title: string;
  rows: { color: string; name: string; value: string }[];
}

/** A shaded band of an annotation. */
export interface ChartBand {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label: ChartText | null;
}

/** A marked point of an annotation, its label in a box above it. */
export interface ChartMark {
  x: number;
  y: number;
  color: string;
  label: ChartText | null;
  box: { x: number; y: number; w: number; h: number } | null;
}

export interface ChartRadar {
  rings: string[];
  spokes: { x1: number; y1: number; x2: number; y2: number }[];
  shapes: { key: string; d: string; color: string; series: number }[];
  ringLabels: ChartText[];
}

export interface ChartLegendItem {
  index: number;
  name: string;
  color: string;
  hidden: boolean;
  shape: 'box' | 'line' | 'dot';
}

/** A hover target: one category (all series at that label) or one slice. */
export interface ChartHoverBand {
  index: number;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Where the crosshair and tooltip go. */
  cx: number;
  cy: number;
  /** The series of a heatmap cell or treemap tile. */
  series?: number;
  /** The newer kinds: a key for the target, its tooltip, and how to find it. */
  key?: string;
  tip?: ChartTip;
  /** A ring slice (sunburst): hit by angle and radius. */
  arc?: { cx: number; cy: number; r0: number; r1: number; a0: number; a1: number };
  /** A line (slope): hit near the line. */
  points?: { x: number; y: number }[];
  /** For `(pointClick)` and the middle text. */
  value?: number;
  label?: string;
  /** Sunburst: a node with children (a click goes in). */
  drill?: boolean;
  /** Draw the pointer guide through `cx`. */
  cross?: boolean;
}

export interface ChartModel {
  type: ChartType;
  width: number;
  height: number;
  plot: { x: number; y: number; w: number; h: number };
  xTicks: ChartText[];
  yTicks: ChartText[];
  y2Ticks: ChartText[];
  grid: { x1: number; y1: number; x2: number; y2: number }[];
  /** The value axis' zero line, when 0 is inside the axis. */
  zero: { x1: number; y1: number; x2: number; y2: number } | null;
  titles: ChartText[];
  bars: ChartBar[];
  lines: ChartLine[];
  dots: ChartDot[];
  slices: ChartSlice[];
  rings: ChartRing[];
  cells: ChartCell[];
  radar: ChartRadar | null;
  valueLabels: ChartText[];
  references: { x1: number; y1: number; x2: number; y2: number; color: string; dashed: boolean; label: ChartText | null }[];
  bands: ChartBand[];
  marks: ChartMark[];
  /** Shapes and texts of the newer kinds, and that they hit-test with `chartHit()`. */
  shapes: ChartShape[];
  texts: ChartText[];
  generic: boolean;
  /** Fade what is not pointed at (funnel, unit, slope, sunburst). */
  dimOthers: boolean;
  /** The middle text (sunburst): the focused node and its value. */
  centerText: { value: string; label: string } | null;
  hover: ChartHoverBand[];
  legend: ChartLegendItem[];
  /** Hole of a doughnut or radial bar, for text in the middle (`lift`: a half circle, the text sits above its centre). */
  center: { x: number; y: number; r: number; lift: boolean } | null;
  /** The value axes drawn (null where there is none), to hold or slide them in an animation. */
  scales: { left: ChartAxisScale | null; right: ChartAxisScale | null };
  empty: boolean;
}

/** The default palette: ten colours that read apart in light and dark (overridden by the theme's `--wt-chart-*`). */
export const CHART_PALETTE = ['#0f766e', '#f59e0b', '#6366f1', '#ef4444', '#0ea5e9', '#84cc16', '#d946ef', '#f97316', '#14b8a6', '#64748b'];

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const isXY = (v: unknown): v is ChartXY => !!v && typeof v === 'object' && Number.isFinite((v as ChartXY).x) && Number.isFinite((v as ChartXY).y);
const approx = (text: string, size: number) => text.length * size * 0.56;

/**
 * Series from Chart.js-shaped data (`{ labels, datasets: [{ label, data, backgroundColor, borderColor, type, yAxisID,
 * stack, hidden, tension, fill, borderDash }] }`), so `<wt-chartjs>` (Chart.js) data works in `<wt-chart>` as it is.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function chartSeriesFrom(data: any, type: ChartType = 'bar'): { labels: (string | number)[]; series: ChartSeries[] } {
  const labels: (string | number)[] = Array.isArray(data?.labels) ? data.labels.map((l: unknown) => (Array.isArray(l) ? l.join(' ') : (l as string))) : [];
  const sets = Array.isArray(data?.datasets) ? data.datasets : [];
  const colorOf = (c: unknown): string | undefined => (typeof c === 'string' ? c : undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const series: ChartSeries[] = sets.map((d: any) => {
    const kind = d?.type === 'line' || d?.type === 'bar' ? d.type : undefined;
    const isLine = (kind || type) === 'line';
    return {
      name: d?.label ?? '',
      data: Array.isArray(d?.data) ? d.data : [],
      type: kind === 'line' && d?.fill ? 'area' : kind,
      color: isLine ? colorOf(d?.borderColor) ?? colorOf(d?.backgroundColor) : colorOf(d?.backgroundColor) ?? colorOf(d?.borderColor),
      colors: Array.isArray(d?.backgroundColor) ? d.backgroundColor : undefined,
      axis: typeof d?.yAxisID === 'string' && /right|y1|y2/i.test(d.yAxisID) ? 'right' : undefined,
      stack: typeof d?.stack === 'string' ? d.stack : undefined,
      hidden: !!d?.hidden,
      smooth: typeof d?.tension === 'number' ? d.tension > 0 : undefined,
      dashed: Array.isArray(d?.borderDash) && d.borderDash.length > 0,
      fill: !!d?.fill,
    };
  });
  return { labels, series };
}

/** The shapes of a chart (see the file comment). */
export function chartModel(o: ChartModelOptions): ChartModel {
  const width = Math.max(0, o.width || 0);
  const height = Math.max(0, o.height || 0);
  const palette = o.palette && o.palette.length ? o.palette : CHART_PALETTE;
  const series = o.series || [];
  const model: ChartModel = {
    type: o.type,
    width,
    height,
    plot: { x: 0, y: 0, w: width, h: height },
    xTicks: [],
    yTicks: [],
    y2Ticks: [],
    grid: [],
    zero: null,
    titles: [],
    bars: [],
    lines: [],
    dots: [],
    slices: [],
    rings: [],
    cells: [],
    radar: null,
    valueLabels: [],
    references: [],
    bands: [],
    marks: [],
    shapes: [],
    texts: [],
    generic: false,
    dimOthers: false,
    centerText: null,
    hover: [],
    legend: [],
    center: null,
    scales: { left: null, right: null },
    empty: true,
  };
  if (o.type === 'pie' || o.type === 'doughnut' || o.type === 'polarArea') return pieModel(o, model, palette);
  if (o.type === 'radialBar') return radialBarModel(o, model, palette);
  if (o.type === 'heatmap') return heatmapModel(o, model, palette);
  if (o.type === 'treemap') return treemapModel(o, model, palette);
  const kinds: Partial<Record<ChartType, (o: ChartModelOptions, model: ChartModel, palette: string[]) => ChartModel>> = {
    stream: streamModel,
    waterfall: waterfallModel,
    dumbbell: dumbbellModel,
    timeline: timelineModel,
    funnel: funnelModel,
    boxplot: boxplotModel,
    histogram: histogramModel,
    sunburst: sunburstModel,
    unit: unitModel,
    slope: slopeModel,
  };
  const kind = kinds[o.type];
  if (kind) {
    model.generic = true;
    return kind(o, model, palette);
  }
  model.legend = series.map((s, i) => ({
    index: i,
    name: s.name ?? '',
    color: s.color || palette[i % palette.length],
    hidden: !!s.hidden,
    shape: o.type === 'scatter' ? 'dot' : (s.type || o.type) === 'line' ? 'line' : 'box',
  }));
  if (o.type === 'radar') return radarModel(o, model, palette);
  return cartesianModel(o, model, palette);
}

// ---------------------------------------------------------------- bar / line / area / scatter

interface Prepared {
  i: number;
  s: ChartSeries;
  kind: ChartSeriesType | 'scatter';
  color: string;
  right: boolean;
  stackKey: string;
  values: (number | null)[];
  /** Bottom and top of each value once stacked. */
  lo: (number | null)[];
  hi: (number | null)[];
}

function cartesianModel(o: ChartModelOptions, model: ChartModel, palette: string[]): ChartModel {
  const { width, height } = model;
  const fontSize = o.fontSize || 12;
  const measure = o.measure || approx;
  const fmt = (v: number, right = false) => formatChartValue(v, right ? o.rightFormat ?? o.format : o.format, o.formatOptions);
  const scatter = o.type === 'scatter';
  const horizontal = !!o.horizontal && !scatter;
  const labels = (o.labels || []).map((l) => String(l ?? ''));
  const all: Prepared[] = (o.series || []).map((s, i) => {
    const kind: Prepared['kind'] = scatter ? 'scatter' : s.type || (o.type === 'area' ? 'area' : o.type === 'line' ? 'line' : 'bar');
    const values = scatter ? [] : (s.data as unknown[]).map((v) => num(v));
    return {
      i,
      s,
      kind,
      color: s.color || palette[i % palette.length],
      right: s.axis === 'right' && !horizontal,
      stackKey: s.stack ?? (o.stacked ? '*' : `#${i}`),
      values,
      lo: [],
      hi: [],
    };
  });
  const shown = all.filter((p) => !p.s.hidden);
  const count = Math.max(labels.length, ...all.map((p) => p.values.length), 0);
  model.empty = scatter ? !shown.some((p) => (p.s.data as unknown[]).some(isXY)) : !shown.some((p) => p.values.some((v) => v !== null));

  // Stacks: positive values pile up from 0, negative ones down, per axis, stack key and kind of mark.
  const piles = new Map<string, { pos: number[]; neg: number[] }>();
  for (const p of shown) {
    if (p.kind === 'scatter') continue;
    const stacks = p.stackKey !== `#${p.i}` && (p.kind === 'bar' || p.kind === 'area' || o.stacked);
    const key = `${p.right}|${p.kind === 'bar' ? 'bar' : 'line'}|${stacks ? p.stackKey : '#' + p.i}`;
    let pile = piles.get(key);
    if (!pile) piles.set(key, (pile = { pos: [], neg: [] }));
    p.values.forEach((v, k) => {
      if (v === null) {
        p.lo[k] = null;
        p.hi[k] = null;
        return;
      }
      const side = v >= 0 ? pile!.pos : pile!.neg;
      const base = side[k] || 0;
      p.lo[k] = base;
      p.hi[k] = base + v;
      side[k] = base + v;
    });
  }

  // Value domains (the annotations' values inside them).
  const yNotes = [...(o.referenceLines || []), ...(o.annotations?.y || [])].filter((r) => Number.isFinite(r.value));
  const extent = (right: boolean) => {
    let lo = Infinity;
    let hi = -Infinity;
    for (const p of shown) {
      if (p.right !== right) continue;
      if (p.kind === 'scatter') {
        for (const d of p.s.data as unknown[]) {
          if (!isXY(d)) continue;
          lo = Math.min(lo, d.y);
          hi = Math.max(hi, d.y);
        }
        continue;
      }
      for (let k = 0; k < p.values.length; k++) {
        for (const v of [p.lo[k], p.hi[k]]) {
          if (v === null || v === undefined) continue;
          lo = Math.min(lo, v);
          hi = Math.max(hi, v);
        }
      }
    }
    for (const ref of yNotes) {
      if ((ref.axis === 'right') !== right) continue;
      for (const v of [ref.value, ref.to]) {
        if (typeof v !== 'number' || !Number.isFinite(v)) continue;
        lo = Math.min(lo, v);
        hi = Math.max(hi, v);
      }
    }
    for (const pt of o.annotations?.points || []) {
      if ((pt.axis === 'right') !== right || !Number.isFinite(pt.value)) continue;
      lo = Math.min(lo, pt.value);
      hi = Math.max(hi, pt.value);
    }
    return lo <= hi ? [lo, hi] : [0, 1];
  };
  const hasBars = shown.some((p) => p.kind === 'bar');
  // A sparkline shows the trend: its areas need not start from 0.
  const zero = o.beginAtZero ?? (hasBars || (!o.sparkline && shown.some((p) => p.kind === 'area')));
  const hasRight = !horizontal && shown.some((p) => p.right);

  // Margins: titles, tick text, and room above for value labels.
  const lineH = fontSize * 1.4;
  const pad = 8;
  let top = pad + (o.showValues ? lineH : fontSize / 2);
  let bottom = pad + lineH + 4;
  if (o.xTitle) bottom += lineH + 2;

  // A first value scale guess, to know how wide its tick text is.
  const valueSpan = horizontal ? width : height - top - bottom;
  const tickCount = Math.max(2, Math.min(10, Math.floor(valueSpan / (horizontal ? 90 : 44))));
  const [l0, l1] = extent(false);
  const left = niceScale(o.min ?? l0, o.max ?? l1, tickCount, zero);
  if (o.min !== undefined) left.min = o.min;
  if (o.max !== undefined) left.max = o.max;
  const [r0, r1] = extent(true);
  const right = niceScale(o.rightMin ?? r0, o.rightMax ?? r1, tickCount, zero);
  for (const [scale, given] of [
    [left, o.scales?.left],
    [right, o.scales?.right],
  ] as const) {
    if (given && Number.isFinite(given.min) && Number.isFinite(given.max) && given.max > given.min) {
      scale.min = given.min;
      scale.max = given.max;
      scale.ticks = [...given.ticks];
    }
    scale.ticks = scale.ticks.filter((t) => t >= scale.min - 1e-9 && t <= scale.max + 1e-9);
  }

  let xScale = { min: 0, max: 1, ticks: [] as number[] };
  if (scatter) {
    let lo = Infinity;
    let hi = -Infinity;
    for (const p of shown) {
      for (const d of p.s.data as unknown[]) {
        if (!isXY(d)) continue;
        lo = Math.min(lo, d.x);
        hi = Math.max(hi, d.x);
      }
    }
    xScale = niceScale(lo <= hi ? lo : 0, lo <= hi ? hi : 1, Math.max(2, Math.floor(width / 90)), false);
  }

  const widest = (texts: string[]) => texts.reduce((w, t) => Math.max(w, measure(t, fontSize)), 0);
  let leftW: number;
  if (horizontal) leftW = Math.min(width * 0.4, widest(labels)) + pad;
  else leftW = widest(left.ticks.map((v) => fmt(v))) + pad;
  if (o.yTitle) leftW += lineH + 2;
  let rightW = hasRight ? widest(right.ticks.map((v) => fmt(v, true))) + pad : pad;
  if (hasRight && o.y2Title) rightW += lineH + 2;
  if (horizontal && o.showValues) rightW += widest(shown.flatMap((p) => p.values.map((v) => (v === null ? '' : fmt(v))))) + 4;
  // The last category or value label must not stick out on the right.
  const spark = !!o.sparkline;
  // A sparkline fills the box, leaving only room for the line's width and its dots.
  const plot = spark
    ? { x: 3, y: o.showValues ? lineH : 3, w: Math.max(10, width - 6), h: Math.max(10, height - (o.showValues ? lineH : 3) - 3) }
    : { x: pad + leftW, y: top, w: Math.max(10, width - pad * 2 - leftW - rightW), h: Math.max(10, height - top - bottom) };
  model.plot = plot;
  model.scales = { left: { min: left.min, max: left.max, ticks: [...left.ticks] }, right: hasRight ? { min: right.min, max: right.max, ticks: [...right.ticks] } : null };

  const yOf = (v: number, isRight: boolean) => {
    const sc = isRight ? right : left;
    return scaleLinear(v, sc.min, sc.max, plot.y + plot.h, plot.y);
  };
  const xOfValue = (v: number) => scaleLinear(v, left.min, left.max, plot.x, plot.x + plot.w);

  // Category positions: bands when there are bars, otherwise points from edge to edge.
  const band = bands(count, horizontal ? plot.y : plot.x, horizontal ? plot.y + plot.h : plot.x + plot.w, hasBars ? o.barPadding ?? 0.25 : 0);
  const centerOf = (k: number) => (hasBars || count < 2 ? band.offset(k) + band.width / 2 : plot.x + (plot.w * k) / (count - 1));

  // Grid and value ticks.
  const showGrid = o.grid !== false;
  if (horizontal) {
    for (const v of left.ticks) {
      const x = xOfValue(v);
      if (showGrid) model.grid.push({ x1: x, y1: plot.y, x2: x, y2: plot.y + plot.h });
      model.xTicks.push({ x, y: plot.y + plot.h + pad / 2, text: fmt(v), anchor: 'middle', baseline: 'hanging' });
    }
    if (left.min < 0 && left.max > 0) model.zero = { x1: xOfValue(0), y1: plot.y, x2: xOfValue(0), y2: plot.y + plot.h };
  } else {
    for (const v of left.ticks) {
      const y = yOf(v, false);
      if (showGrid) model.grid.push({ x1: plot.x, y1: y, x2: plot.x + plot.w, y2: y });
      model.yTicks.push({ x: plot.x - pad / 2, y, text: fmt(v), anchor: 'end', baseline: 'middle' });
    }
    if (hasRight) for (const v of right.ticks) model.y2Ticks.push({ x: plot.x + plot.w + pad / 2, y: yOf(v, true), text: fmt(v, true), anchor: 'start', baseline: 'middle' });
    if (left.min < 0 && left.max > 0) model.zero = { x1: plot.x, y1: yOf(0, false), x2: plot.x + plot.w, y2: yOf(0, false) };
  }

  // Category ticks (every k-th when they would touch).
  if (scatter) {
    for (const v of xScale.ticks) {
      const x = scaleLinear(v, xScale.min, xScale.max, plot.x, plot.x + plot.w);
      if (showGrid) model.grid.push({ x1: x, y1: plot.y, x2: x, y2: plot.y + plot.h });
      model.xTicks.push({ x, y: plot.y + plot.h + pad / 2, text: fmt(v), anchor: 'middle', baseline: 'hanging' });
    }
  } else if (horizontal) {
    const every = Math.max(1, Math.ceil((lineH + 2) / Math.max(1, band.step)));
    for (let k = 0; k < count; k += every) model.yTicks.push({ x: plot.x - pad / 2, y: centerOf(k), text: labels[k] ?? '', anchor: 'end', baseline: 'middle' });
  } else {
    const space = hasBars || count < 2 ? band.step : plot.w / Math.max(1, count - 1);
    const every = Math.max(1, Math.ceil((widest(labels) + pad) / Math.max(1, space)));
    for (let k = 0; k < count; k += every) {
      const x = centerOf(k);
      const anchor = !hasBars && count > 1 && k === 0 ? 'start' : !hasBars && count > 1 && k === count - 1 ? 'end' : 'middle';
      model.xTicks.push({ x, y: plot.y + plot.h + pad / 2, text: labels[k] ?? '', anchor, baseline: 'hanging' });
    }
  }

  if (spark) {
    model.xTicks = [];
    model.yTicks = [];
    model.y2Ticks = [];
    model.grid = [];
    model.zero = null;
  }

  // Axis titles.
  if (o.xTitle && !spark) model.titles.push({ x: plot.x + plot.w / 2, y: height - pad, text: o.xTitle, anchor: 'middle', baseline: 'auto' });
  if (o.yTitle && !spark) model.titles.push({ x: pad + fontSize * 0.7, y: plot.y + plot.h / 2, text: o.yTitle, anchor: 'middle', baseline: 'middle', rotate: -90 });
  if (hasRight && o.y2Title && !spark) model.titles.push({ x: width - pad - fontSize * 0.7, y: plot.y + plot.h / 2, text: o.y2Title, anchor: 'middle', baseline: 'middle', rotate: 90 });

  // Bars: one slot per bar stack in each band.
  const barGroups = [...new Set(shown.filter((p) => p.kind === 'bar').map((p) => `${p.right}|${p.stackKey}`))];
  const slot = barGroups.length ? band.width / barGroups.length : 0;
  const radius = o.barRadius ?? 4;
  for (const p of shown) {
    if (p.kind !== 'bar') continue;
    const g = barGroups.indexOf(`${p.right}|${p.stackKey}`);
    const single = shown.length === 1;
    p.values.forEach((v, k) => {
      const lo = p.lo[k];
      const hi = p.hi[k];
      if (v === null || lo === null || hi === null || lo === undefined || hi === undefined) return;
      const color = (single && p.s.colors?.[k]) || p.color;
      const start = band.offset(k) + g * slot + slot * 0.06;
      const thick = slot * 0.88;
      // Only the outer end of a stack is rounded.
      const isEnd = !shown.some((q) => q !== p && q.kind === 'bar' && q.right === p.right && q.stackKey === p.stackKey && q.i > p.i && q.values[k] !== null && Math.sign(q.values[k]!) === Math.sign(v));
      if (horizontal) {
        const x0 = xOfValue(Math.min(lo, hi));
        const x1 = xOfValue(Math.max(lo, hi));
        const box = { x: x0, y: start, w: Math.max(0, x1 - x0), h: thick };
        model.bars.push({ key: `b${p.i}-${k}`, d: barPath(box.x, box.y, box.w, box.h, isEnd ? radius : 0, v >= 0 ? 'right' : 'left'), ...box, color, series: p.i, index: k, value: v });
        if (o.showValues && isEnd) model.valueLabels.push({ x: (v >= 0 ? x1 + 4 : x0 - 4), y: start + thick / 2, text: fmt(p.hi[k]!), anchor: v >= 0 ? 'start' : 'end', baseline: 'middle' });
      } else {
        const y0 = yOf(Math.max(lo, hi), p.right);
        const y1 = yOf(Math.min(lo, hi), p.right);
        const box = { x: start, y: y0, w: thick, h: Math.max(0, y1 - y0) };
        model.bars.push({ key: `b${p.i}-${k}`, d: barPath(box.x, box.y, box.w, box.h, isEnd ? radius : 0, v >= 0 ? 'top' : 'bottom'), ...box, color, series: p.i, index: k, value: v });
        if (o.showValues && isEnd) model.valueLabels.push({ x: start + thick / 2, y: v >= 0 ? y0 - 4 : y1 + 4, text: fmt(p.hi[k]!, p.right), anchor: 'middle', baseline: v >= 0 ? 'auto' : 'hanging' });
      }
    });
  }

  // Lines and areas (drawn over the bars), then dots.
  const dotsWanted = o.points ?? (!o.sparkline && count <= 40);
  for (const p of shown) {
    if (p.kind === 'bar') continue;
    if (p.kind === 'scatter') {
      (p.s.data as unknown[]).forEach((d, k) => {
        if (!isXY(d)) return;
        model.dots.push({
          key: `d${p.i}-${k}`,
          cx: scaleLinear(d.x, xScale.min, xScale.max, plot.x, plot.x + plot.w),
          cy: yOf(d.y, false),
          r: d.r && d.r > 0 ? d.r : 4.5,
          color: p.color,
          series: p.i,
          index: k,
          value: d.y,
          x: d.x,
        });
      });
      continue;
    }
    const smooth: ChartCurve = p.s.curve ?? (p.s.smooth === undefined ? o.curve ?? (o.smooth ? 'smooth' : 'straight') : p.s.smooth ? 'smooth' : 'straight');
    const top = p.values.map((v, k) => (v === null || p.hi[k] === null || p.hi[k] === undefined ? null : { x: centerOf(k), y: yOf(p.hi[k]!, p.right) }));
    let area: string | null = null;
    if (p.kind === 'area' || p.s.fill) {
      const stacked = p.lo.some((v) => v !== null && v !== undefined && v !== 0);
      if (stacked) {
        const upper: ChartPoint[] = [];
        const lower: ChartPoint[] = [];
        p.values.forEach((v, k) => {
          if (v === null) return;
          upper.push({ x: centerOf(k), y: yOf(p.hi[k]!, p.right) });
          lower.push({ x: centerOf(k), y: yOf(p.lo[k]!, p.right) });
        });
        area = bandPath(upper, lower, smooth);
      } else {
        const sc = p.right ? right : left;
        area = areaPath(top, yOf(Math.min(Math.max(0, sc.min), sc.max), p.right), smooth);
      }
    }
    model.lines.push({ key: `l${p.i}`, d: linePath(top, smooth), color: p.color, series: p.i, dashed: !!p.s.dashed, area, gradient: !!area && o.gradient !== false });
    top.forEach((pt, k) => {
      if (!pt) return;
      model.dots.push({ key: `d${p.i}-${k}`, cx: pt.x, cy: pt.y, r: dotsWanted ? 3.5 : 0, color: p.color, series: p.i, index: k, value: p.values[k]! });
      if (o.showValues) model.valueLabels.push({ x: pt.x, y: pt.y - 8, text: fmt(p.hi[k]!, p.right), anchor: 'middle', baseline: 'auto' });
    });
  }

  // Reference lines and bands.
  for (const ref of yNotes) {
    const isRight = ref.axis === 'right' && hasRight;
    const color = ref.color || 'var(--wt-chart-reference-color)';
    if (typeof ref.to === 'number' && Number.isFinite(ref.to)) {
      const [a, b] = [Math.min(ref.value, ref.to), Math.max(ref.value, ref.to)];
      if (horizontal) {
        const x0 = Math.max(plot.x, xOfValue(a));
        const x1 = Math.min(plot.x + plot.w, xOfValue(b));
        model.bands.push({ x: x0, y: plot.y, w: Math.max(0, x1 - x0), h: plot.h, color, label: ref.label ? { x: x0 + 6, y: plot.y + 4, text: ref.label, anchor: 'start', baseline: 'hanging' } : null });
      } else {
        const y0 = Math.max(plot.y, yOf(b, isRight));
        const y1 = Math.min(plot.y + plot.h, yOf(a, isRight));
        model.bands.push({ x: plot.x, y: y0, w: plot.w, h: Math.max(0, y1 - y0), color, label: ref.label ? { x: plot.x + 6, y: y0 + 4, text: ref.label, anchor: 'start', baseline: 'hanging' } : null });
      }
      continue;
    }
    if (horizontal) {
      const x = xOfValue(ref.value);
      model.references.push({ x1: x, y1: plot.y, x2: x, y2: plot.y + plot.h, color, dashed: ref.dashed !== false, label: ref.label ? { x: x + 4, y: plot.y + 2, text: ref.label, anchor: 'start', baseline: 'hanging' } : null });
    } else {
      const y = yOf(ref.value, isRight);
      model.references.push({ x1: plot.x, y1: y, x2: plot.x + plot.w, y2: y, color, dashed: ref.dashed !== false, label: ref.label ? { x: plot.x + plot.w - 4, y: y - 4, text: ref.label, anchor: 'end', baseline: 'auto' } : null });
    }
  }

  // Lines and bands at labels, and marked points.
  const indexOf = (at: string | number) => (typeof at === 'number' ? (Number.isInteger(at) && at >= 0 && at < count ? at : -1) : labels.indexOf(String(at)));
  if (!scatter) {
    for (const note of o.annotations?.x || []) {
      const k = indexOf(note.at);
      if (k < 0) continue;
      const color = note.color || 'var(--wt-chart-reference-color)';
      const k2 = note.to === undefined ? -1 : indexOf(note.to);
      if (k2 >= 0) {
        const [a, b] = [Math.min(k, k2), Math.max(k, k2)];
        const from = hasBars || count < 2 ? band.offset(a) : centerOf(a);
        const to = hasBars || count < 2 ? band.offset(b) + band.width : centerOf(b);
        if (horizontal) model.bands.push({ x: plot.x, y: from, w: plot.w, h: to - from, color, label: note.label ? { x: plot.x + plot.w - 6, y: from + 4, text: note.label, anchor: 'end', baseline: 'hanging' } : null });
        else model.bands.push({ x: from, y: plot.y, w: to - from, h: plot.h, color, label: note.label ? { x: from + 6, y: plot.y + 4, text: note.label, anchor: 'start', baseline: 'hanging' } : null });
        continue;
      }
      const c = centerOf(k);
      if (horizontal) model.references.push({ x1: plot.x, y1: c, x2: plot.x + plot.w, y2: c, color, dashed: note.dashed !== false, label: note.label ? { x: plot.x + plot.w - 4, y: c - 4, text: note.label, anchor: 'end', baseline: 'auto' } : null });
      else model.references.push({ x1: c, y1: plot.y, x2: c, y2: plot.y + plot.h, color, dashed: note.dashed !== false, label: note.label ? { x: c + 4, y: plot.y + 2, text: note.label, anchor: 'start', baseline: 'hanging' } : null });
    }
    for (const pt of o.annotations?.points || []) {
      const k = indexOf(pt.at);
      if (k < 0 || !Number.isFinite(pt.value)) continue;
      const color = pt.color || 'var(--wt-chart-mark-color)';
      const x = horizontal ? xOfValue(pt.value) : centerOf(k);
      const y = horizontal ? centerOf(k) : yOf(pt.value, pt.axis === 'right' && hasRight);
      let label: ChartText | null = null;
      let box: ChartMark['box'] = null;
      if (pt.label) {
        const w = measure(pt.label, fontSize) + 14;
        const h = fontSize + 10;
        // Above the point, kept inside the drawing.
        const bx = Math.min(Math.max(2, x - w / 2), width - w - 2);
        const by = y - 12 - h < 2 ? y + 12 : y - 12 - h;
        box = { x: bx, y: by, w, h };
        label = { x: bx + w / 2, y: by + h / 2, text: pt.label, anchor: 'middle', baseline: 'middle', tone: 'inside' };
      }
      model.marks.push({ x, y, color, label, box });
    }
  }

  // Hover bands: one per category (scatter: per point).
  if (scatter) {
    for (const d of model.dots) model.hover.push({ index: d.index, x: d.cx - 10, y: d.cy - 10, w: 20, h: 20, cx: d.cx, cy: d.cy });
  } else {
    for (let k = 0; k < count; k++) {
      const c = centerOf(k);
      const half = hasBars || count < 2 ? band.step / 2 : plot.w / Math.max(1, count - 1) / 2;
      if (horizontal) model.hover.push({ index: k, x: plot.x, y: c - half, w: plot.w, h: half * 2, cx: plot.x + plot.w, cy: c });
      else {
        const x0 = Math.max(plot.x, c - half);
        const x1 = Math.min(plot.x + plot.w, c + half);
        model.hover.push({ index: k, x: x0, y: plot.y, w: x1 - x0, h: plot.h, cx: c, cy: plot.y });
      }
    }
  }
  return model;
}

// ---------------------------------------------------------------- pie / doughnut

function pieModel(o: ChartModelOptions, model: ChartModel, palette: string[]): ChartModel {
  const s = (o.series || [])[0];
  const fontSize = o.fontSize || 12;
  const measure = o.measure || approx;
  const labels = (o.labels || []).map((l) => String(l ?? ''));
  const values = s ? (s.data as unknown[]).map((v) => Math.max(0, num(v) ?? 0)) : [];
  const hidden = new Set(o.hiddenSlices || []);
  const colorOf = (k: number) => s?.colors?.[k] || palette[k % palette.length];
  model.legend = values.map((_, k) => ({ index: k, name: labels[k] ?? '', color: colorOf(k), hidden: hidden.has(k), shape: 'box' }));
  const total = values.reduce((sum, v, k) => sum + (hidden.has(k) ? 0 : v), 0);
  model.empty = !(total > 0);
  const polarArea = o.type === 'polarArea';
  const { start, span, lift } = arcSpan(o);
  const fit = fitArc(model.width, model.height, start, start + span, 10);
  const outer = fit.radius;
  const inner = o.type === 'doughnut' ? outer * Math.min(0.95, Math.max(0, o.cutout ?? 0.62)) : 0;
  const { cx, cy } = fit;
  model.plot = { x: cx - outer, y: cy - outer, w: outer * 2, h: outer * 2 };
  if (inner > 0) model.center = { x: cx, y: cy, r: inner, lift };
  // Polar area: equal angles, the radius shows the value (rings mark the scale).
  let rOf = (_: number) => outer;
  if (polarArea) {
    const scale = niceScale(0, Math.max(0, ...values.filter((_, k) => !hidden.has(k))) || 1, 5, true);
    const given = o.scales?.left;
    if (given && given.max > given.min) Object.assign(scale, { min: given.min, max: given.max, ticks: given.ticks.filter((t) => t <= given.max + 1e-9) });
    model.scales = { left: { min: scale.min, max: scale.max, ticks: [...scale.ticks] }, right: null };
    rOf = (v: number) => scaleLinear(Math.min(v, scale.max), 0, scale.max, 0, outer);
    const radar: ChartRadar = { rings: [], spokes: [], shapes: [], ringLabels: [] };
    for (const t of scale.ticks) {
      if (t <= 0) continue;
      radar.rings.push(arcLine(cx, cy, rOf(t), 0, Math.PI * 2));
      radar.ringLabels.push({ x: cx + 4, y: cy - rOf(t), text: formatChartValue(t, o.format, o.formatOptions), anchor: 'start', baseline: 'middle' });
    }
    model.radar = radar;
  }
  if (model.empty) return model;
  const shownCount = values.filter((v, k) => v > 0 && !hidden.has(k)).length;
  const gap = shownCount > 1 ? Math.min(0.02, 1 / Math.max(1, outer)) : 0;
  let angle = start;
  const turn = span * Math.min(1, Math.max(0, o.sweep ?? 1));
  values.forEach((v, k) => {
    if (hidden.has(k) || !(v > 0)) return;
    const sweep = polarArea ? turn / shownCount : (v / total) * turn;
    const a0 = angle + gap / 2;
    const a1 = angle + sweep - gap / 2;
    const mid = angle + sweep / 2;
    angle += sweep;
    const r1 = polarArea ? rOf(v) : outer;
    const labelR = inner > 0 ? (inner + outer) / 2 : r1 * 0.62;
    const at = polar(cx, cy, labelR, mid);
    const push = polar(0, 0, 6, mid);
    const percent = v / total;
    model.slices.push({
      key: `s${k}`,
      d: arcPath(cx, cy, inner, r1, a0, Math.max(a0, a1)),
      color: colorOf(k),
      index: k,
      value: v,
      percent,
      label: labels[k] ?? '',
      labelX: at.x,
      labelY: at.y,
      dx: push.x,
      dy: push.y,
    });
    if (o.showValues) {
      // The share of the whole (no unit, prefix or suffix of the values), only where it fits inside its slice.
      const lang = o.formatOptions?.lang;
      const tenth = percent < 0.1 && Math.round(percent * 1000) % 10 !== 0;
      const texts = [formatChartValue(percent, 'percent', { lang, decimals: tenth ? 1 : 0 }), formatChartValue(percent, 'percent', { lang, decimals: 0 })];
      if (polarArea) texts.unshift(formatChartValue(v, o.format, o.formatOptions));
      const text = texts.find((t) => fitsSlice(cx, cy, at.x, at.y, measure(t, fontSize) + 8, fontSize * 1.2 + 4, inner, r1, a0, a1));
      if (text) model.valueLabels.push({ x: at.x, y: at.y, text, anchor: 'middle', baseline: 'middle', tone: 'inside' });
    }
    model.hover.push({ index: k, x: at.x, y: at.y, w: 0, h: 0, cx: at.x, cy: at.y });
  });
  return model;
}

/** A `w` × `h` box centred at (x, y) lies inside the ring slice between `inner` and `outer`, from angle `a0` to `a1`. */
function fitsSlice(cx: number, cy: number, x: number, y: number, w: number, h: number, inner: number, outer: number, a0: number, a1: number): boolean {
  const xs = [x - w / 2, x + w / 2];
  const ys = [y - h / 2, y + h / 2];
  const near = Math.hypot(Math.min(Math.max(cx, xs[0]), xs[1]) - cx, Math.min(Math.max(cy, ys[0]), ys[1]) - cy);
  if (inner > 0 && near < inner + 2) return false;
  const whole = a1 - a0 >= Math.PI * 2 - 0.05;
  const turn = Math.PI * 2;
  for (const cxr of xs) {
    for (const cyr of ys) {
      if (Math.hypot(cxr - cx, cyr - cy) > outer - 2) return false;
      if (whole) continue;
      // The corner's angle from the slice's start, 0 … 2π.
      const angle = (((Math.atan2(cxr - cx, cy - cyr) - a0) % turn) + turn) % turn;
      if (angle > a1 - a0) return false;
    }
  }
  return true;
}

// ---------------------------------------------------------------- radar

function radarModel(o: ChartModelOptions, model: ChartModel, palette: string[]): ChartModel {
  const fontSize = o.fontSize || 12;
  const measure = o.measure || approx;
  const labels = (o.labels || []).map((l) => String(l ?? ''));
  const shown = (o.series || []).map((s, i) => ({ s, i })).filter((p) => !p.s.hidden);
  const count = Math.max(labels.length, ...(o.series || []).map((s) => s.data.length), 0);
  let hi = 0;
  for (const p of shown) for (const v of p.s.data as unknown[]) if (num(v) !== null) hi = Math.max(hi, num(v)!);
  model.empty = count < 3 || !shown.some((p) => (p.s.data as unknown[]).some((v) => num(v) !== null));
  const scale = niceScale(o.min ?? 0, o.max ?? (hi || 1), 4, true);
  const given = o.scales?.left;
  if (given && Number.isFinite(given.min) && Number.isFinite(given.max) && given.max > given.min) {
    scale.min = given.min;
    scale.max = given.max;
    scale.ticks = given.ticks.filter((t) => t >= given.min - 1e-9 && t <= given.max + 1e-9);
  }
  model.scales = { left: { min: scale.min, max: scale.max, ticks: [...scale.ticks] }, right: null };
  const labelRoom = Math.max(0, ...labels.map((l) => measure(l, fontSize))) + 8;
  const radius = Math.max(10, Math.min(model.width / 2 - labelRoom, model.height / 2 - fontSize * 1.6 - 8));
  const cx = model.width / 2;
  const cy = model.height / 2;
  model.plot = { x: cx - radius, y: cy - radius, w: radius * 2, h: radius * 2 };
  if (count < 3) return model;
  const angleOf = (k: number) => (Math.PI * 2 * k) / count;
  const rOf = (v: number) => scaleLinear(Math.max(scale.min, Math.min(scale.max, v)), scale.min, scale.max, 0, radius);
  const radar: ChartRadar = { rings: [], spokes: [], shapes: [], ringLabels: [] };
  for (const t of scale.ticks) {
    if (t <= scale.min) continue;
    const pts = Array.from({ length: count }, (_, k) => polar(cx, cy, rOf(t), angleOf(k)));
    radar.rings.push(pts.map((p, k) => `${k ? 'L' : 'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join('') + 'Z');
    radar.ringLabels.push({ x: cx + 4, y: cy - rOf(t), text: formatChartValue(t, o.format, o.formatOptions), anchor: 'start', baseline: 'middle' });
  }
  for (let k = 0; k < count; k++) {
    const end = polar(cx, cy, radius, angleOf(k));
    radar.spokes.push({ x1: cx, y1: cy, x2: end.x, y2: end.y });
    const at = polar(cx, cy, radius + 8, angleOf(k));
    const sin = Math.sin(angleOf(k));
    const cos = Math.cos(angleOf(k));
    model.xTicks.push({
      x: at.x,
      y: at.y,
      text: labels[k] ?? '',
      anchor: Math.abs(sin) < 0.1 ? 'middle' : sin > 0 ? 'start' : 'end',
      baseline: Math.abs(cos) < 0.1 ? 'middle' : cos > 0 ? 'auto' : 'hanging',
    });
    model.hover.push({ index: k, x: at.x, y: at.y, w: 0, h: 0, cx: polar(cx, cy, radius, angleOf(k)).x, cy: polar(cx, cy, radius, angleOf(k)).y });
  }
  for (const { s, i } of shown) {
    const color = s.color || palette[i % palette.length];
    const pts = Array.from({ length: count }, (_, k) => polar(cx, cy, rOf(num((s.data as unknown[])[k]) ?? 0), angleOf(k)));
    radar.shapes.push({ key: `r${i}`, d: pts.map((p, k) => `${k ? 'L' : 'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join('') + 'Z', color, series: i });
    pts.forEach((p, k) => {
      const v = num((s.data as unknown[])[k]);
      if (v === null) return;
      model.dots.push({ key: `d${i}-${k}`, cx: p.x, cy: p.y, r: 3, color, series: i, index: k, value: v });
      if (o.showValues) model.valueLabels.push({ x: p.x, y: p.y - 7, text: formatChartValue(v, o.format, o.formatOptions), anchor: 'middle', baseline: 'auto' });
    });
  }
  model.radar = radar;
  return model;
}
