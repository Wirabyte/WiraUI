/**
 * wt-chart: radial bars (rings and gauges), heatmaps and treemaps. Called by `chartModel()`; same model, same rules (no
 * DOM, text widths from `measure`).
 */
import { formatChartValue } from './format';
import type { ChartCell, ChartModel, ChartModelOptions, ChartRing, ChartText } from './model';
import { arcLine, fitArc, polar } from './paths';

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const r2 = (n: number) => Math.round(n * 100) / 100;
const approx = (text: string, size: number) => text.length * size * 0.56;

/** Where a round chart starts (radians), how far it goes, and whether it leaves out the bottom (a half circle). */
export function arcSpan(o: Pick<ChartModelOptions, 'startAngle' | 'endAngle'>): { start: number; span: number; lift: boolean } {
  const deg = Math.PI / 180;
  const first = Number.isFinite(o.startAngle) ? o.startAngle! : 0;
  const start = first * deg;
  const end = (Number.isFinite(o.endAngle) ? o.endAngle! : first + 360) * deg;
  const span = Math.min(Math.PI * 2, Math.max(0.01, end - start));
  // Is the bottom (π, 3π, …) inside the arc?
  const k = Math.ceil((start - Math.PI) / (Math.PI * 2));
  const bottom = Math.PI + k * Math.PI * 2 <= start + span + 1e-9;
  return { start, span, lift: !bottom };
}

/**
 * Tiles for `values` in the box, each tile's area in proportion to its value and as square as it can be (squarified
 * treemap). Index for index with `values`; values of 0 or less get an empty tile.
 */
export function squarify(values: number[], x: number, y: number, w: number, h: number): { x: number; y: number; w: number; h: number }[] {
  const out = values.map(() => ({ x, y, w: 0, h: 0 }));
  const items = values
    .map((v, i) => ({ i, v: v > 0 && Number.isFinite(v) ? v : 0 }))
    .filter((t) => t.v > 0)
    .sort((a, b) => b.v - a.v);
  const total = items.reduce((sum, t) => sum + t.v, 0);
  if (!total || w <= 0 || h <= 0) return out;
  const scale = (w * h) / total;
  const rect = { x, y, w, h };
  const worst = (row: typeof items, side: number) => {
    const areas = row.map((t) => t.v * scale);
    const sum = areas.reduce((a, b) => a + b, 0);
    return Math.max((side * side * Math.max(...areas)) / (sum * sum), (sum * sum) / (side * side * Math.min(...areas)));
  };
  const place = (row: typeof items) => {
    const sum = row.reduce((a, t) => a + t.v * scale, 0);
    if (rect.w >= rect.h) {
      // A column on the left.
      const cw = sum / rect.h;
      let at = rect.y;
      for (const t of row) {
        const th = (t.v * scale) / cw;
        out[t.i] = { x: rect.x, y: at, w: cw, h: th };
        at += th;
      }
      rect.x += cw;
      rect.w -= cw;
    } else {
      // A row on top.
      const rh = sum / rect.w;
      let at = rect.x;
      for (const t of row) {
        const tw = (t.v * scale) / rh;
        out[t.i] = { x: at, y: rect.y, w: tw, h: rh };
        at += tw;
      }
      rect.y += rh;
      rect.h -= rh;
    }
  };
  let row: typeof items = [];
  for (const t of items) {
    const side = Math.min(rect.w, rect.h);
    if (!row.length || worst([...row, t], side) <= worst(row, side)) row.push(t);
    else {
      place(row);
      row = [t];
    }
  }
  if (row.length) place(row);
  return out;
}

// ---------------------------------------------------------------- radial bar

/**
 * One ring per label, the first outside: `series[0].data` are the values out of `max` (default 100, so percents read as
 * they are). `startAngle` / `endAngle` make a gauge.
 */
export function radialBarModel(o: ChartModelOptions, model: ChartModel, palette: string[]): ChartModel {
  const s = (o.series || [])[0];
  const labels = (o.labels || []).map((l) => String(l ?? ''));
  const values = s ? (s.data as unknown[]).map((v) => num(v)) : [];
  const hidden = new Set(o.hiddenSlices || []);
  const colorOf = (k: number) => s?.colors?.[k] || palette[k % palette.length];
  model.legend = values.map((_, k) => ({ index: k, name: labels[k] ?? '', color: colorOf(k), hidden: hidden.has(k), shape: 'box' }));
  const shown = values.map((v, k) => ({ v, k })).filter((p) => p.v !== null && !hidden.has(p.k));
  model.empty = !shown.length;
  const max = o.max !== undefined && o.max > 0 ? o.max : 100;
  const { start, span, lift } = arcSpan(o);
  const fit = fitArc(model.width, model.height, start, start + span, 8);
  const outer = fit.radius;
  const n = Math.max(1, shown.length);
  const hollow = outer * Math.min(0.9, Math.max(0, o.cutout ?? (n === 1 ? 0.7 : 0.38)));
  const per = (outer - hollow) / n;
  const width = n === 1 ? outer - hollow : per * 0.68;
  model.plot = { x: fit.cx - outer, y: fit.cy - outer, w: outer * 2, h: outer * 2 };
  model.center = { x: fit.cx, y: fit.cy, r: hollow, lift };
  const sweep = Math.min(1, Math.max(0, o.sweep ?? 1));
  shown.forEach(({ v, k }, j) => {
    const radius = n === 1 ? (outer + hollow) / 2 : outer - per * j - per / 2;
    const percent = Math.min(1, Math.max(0, v! / max));
    const end = start + span * percent * sweep;
    const ring: ChartRing = {
      key: `g${k}`,
      index: k,
      color: colorOf(k),
      value: v!,
      percent,
      label: labels[k] ?? '',
      track: arcLine(fit.cx, fit.cy, radius, start, start + span),
      d: arcLine(fit.cx, fit.cy, radius, start, end),
      width,
      round: span >= Math.PI * 2 - 1e-6,
    };
    model.rings.push(ring);
    const tip = polar(fit.cx, fit.cy, radius, end);
    model.hover.push({ index: k, x: tip.x, y: tip.y, w: 0, h: 0, cx: tip.x, cy: tip.y });
  });
  return model;
}

// ---------------------------------------------------------------- heatmap

/**
 * A grid of cells: a row per series (top to bottom), a column per label. Each cell is a shade of one colour by value
 * (the palette's first, or the row's own `color`), or the colour of the `colorRanges` its value falls in (the legend
 * then lists the ranges; without ranges the rows are named on the axis and there is no legend).
 */
export function heatmapModel(o: ChartModelOptions, model: ChartModel, palette: string[]): ChartModel {
  const { width, height } = model;
  const fontSize = o.fontSize || 12;
  const measure = o.measure || approx;
  const labels = (o.labels || []).map((l) => String(l ?? ''));
  const series = o.series || [];
  const ranges = (o.colorRanges || []).filter((r) => Number.isFinite(r.from) && Number.isFinite(r.to) && r.color);
  const hidden = new Set(o.hiddenSlices || []);
  model.legend = ranges.map((r, k) => ({
    index: k,
    name: r.name ?? `${formatChartValue(r.from, o.format, o.formatOptions)} – ${formatChartValue(r.to, o.format, o.formatOptions)}`,
    color: r.color,
    hidden: hidden.has(k),
    shape: 'box',
  }));
  const rows = series.map((s, i) => ({ s, i })).filter((r) => !r.s.hidden);
  const count = Math.max(labels.length, ...rows.map((r) => r.s.data.length), 0);
  let lo = Infinity;
  let hi = -Infinity;
  for (const r of rows) {
    for (const v of r.s.data as unknown[]) {
      if (num(v) === null) continue;
      lo = Math.min(lo, num(v)!);
      hi = Math.max(hi, num(v)!);
    }
  }
  model.empty = !rows.length || !(lo <= hi);
  const pad = 8;
  const lineH = fontSize * 1.4;
  const leftW = Math.min(width * 0.35, Math.max(0, ...rows.map((r) => measure(r.s.name ?? '', fontSize)))) + pad;
  const plot = { x: pad + leftW, y: pad / 2, w: Math.max(10, width - pad * 2 - leftW), h: Math.max(10, height - pad / 2 - lineH - pad) };
  model.plot = plot;
  if (model.empty) return model;
  const variant = o.variant === 'circle' || o.variant === 'hex' ? o.variant : 'square';
  const n = rows.length;
  // Where cell (row, k) sits: a grid of squares (or circles in them), or a honeycomb with every other row moved half a cell.
  let cw = plot.w / Math.max(1, count);
  let ch = plot.h / n;
  let center = (row: number, k: number) => ({ x: plot.x + k * cw + cw / 2, y: plot.y + row * ch + ch / 2 });
  let hexR = 0;
  if (variant === 'hex') {
    hexR = Math.min(plot.w / (Math.sqrt(3) * (count + 0.5)), plot.h / (1.5 * n + 0.5));
    const hw = Math.sqrt(3) * hexR;
    const ox = plot.x + (plot.w - hw * (count + 0.5)) / 2 + hw / 2;
    const oy = plot.y + (plot.h - hexR * (1.5 * n + 0.5)) / 2 + hexR;
    cw = hw;
    ch = hexR * 1.5;
    center = (row, k) => ({ x: ox + k * hw + (row % 2 ? hw / 2 : 0), y: oy + row * 1.5 * hexR });
  }
  const gap = variant === 'hex' ? Math.max(1.5, hexR * 0.08) : Math.min(3, cw * 0.08, ch * 0.08);
  const rangeOf = (v: number) => ranges.findIndex((r) => v >= r.from && v <= r.to);
  const showValues = o.showValues ?? true;
  rows.forEach(({ s, i }, row) => {
    const color = s.color || palette[0];
    model.yTicks.push({ x: plot.x - pad / 2, y: center(row, 0).y, text: s.name ?? '', anchor: 'end', baseline: 'middle' });
    (s.data as unknown[]).forEach((raw, k) => {
      const v = num(raw);
      if (v === null || k >= count) return;
      const r = ranges.length ? rangeOf(v) : -1;
      if (r >= 0 && hidden.has(r)) return;
      const shade = hi > lo ? (v - lo) / (hi - lo) : 1;
      const opacity = ranges.length && r >= 0 ? 1 : 0.14 + shade * 0.86;
      const c = center(row, k);
      let box = { x: c.x - cw / 2 + gap / 2, y: c.y - ch / 2 + gap / 2, w: Math.max(0, cw - gap), h: Math.max(0, ch - gap) };
      let d: string | undefined;
      let room = Math.min(box.w, box.h);
      if (variant === 'circle') {
        // The circle's size shows the value too.
        const rad = (Math.min(box.w, box.h) / 2) * (0.35 + 0.65 * Math.sqrt(Math.max(0, shade)));
        d = `M${r2(c.x - rad)} ${r2(c.y)}a${r2(rad)} ${r2(rad)} 0 1 0 ${r2(rad * 2)} 0a${r2(rad)} ${r2(rad)} 0 1 0 ${r2(-rad * 2)} 0Z`;
        room = rad * 2;
      } else if (variant === 'hex') {
        const rad = hexR - gap / 2;
        d = Array.from({ length: 6 }, (_, q) => {
          const a = (Math.PI / 180) * (60 * q - 30);
          return `${q ? 'L' : 'M'}${r2(c.x + rad * Math.cos(a))} ${r2(c.y + rad * Math.sin(a))}`;
        }).join('') + 'Z';
        box = { x: c.x - (Math.sqrt(3) / 2) * rad, y: c.y - rad, w: Math.sqrt(3) * rad, h: rad * 2 };
        room = Math.sqrt(3) * rad * 0.9;
      }
      const cell: ChartCell = {
        key: `c${i}-${k}`,
        ...box,
        d,
        color: r >= 0 ? ranges[r].color : color,
        opacity: variant === 'circle' && !ranges.length ? 0.3 + shade * 0.7 : opacity,
        series: i,
        index: k,
        value: v,
        label: labels[k] ?? '',
        texts: [],
      };
      if (showValues) {
        const text = formatChartValue(v, o.format, o.formatOptions);
        if (measure(text, fontSize) + 6 <= room && fontSize + 4 <= Math.min(box.h, room)) {
          cell.texts.push({ x: c.x, y: c.y, text, anchor: 'middle', baseline: 'middle', tone: cell.opacity > 0.5 ? 'inside' : undefined });
        }
      }
      model.cells.push(cell);
      model.hover.push({ index: k, series: i, x: box.x, y: box.y, w: box.w, h: box.h, cx: c.x, cy: box.y });
    });
  });
  const every = Math.max(1, Math.ceil((Math.max(0, ...labels.map((l) => measure(l, fontSize))) + pad) / Math.max(1, cw)));
  const bottom = variant === 'hex' ? center(n - 1, 0).y + hexR + pad / 2 : plot.y + plot.h + pad / 2;
  for (let k = 0; k < count; k += every) model.xTicks.push({ x: center(0, k).x + (variant === 'hex' && n > 1 ? cw / 4 : 0), y: bottom, text: labels[k] ?? '', anchor: 'middle', baseline: 'hanging' });
  return model;
}

// ---------------------------------------------------------------- treemap

/**
 * Tiles sized by value. One series: a tile per label, each its own colour. Several series: a block per series (sized by
 * its total) split into its labels' tiles, shades of the series' colour; the legend shows and hides series.
 */
export function treemapModel(o: ChartModelOptions, model: ChartModel, palette: string[]): ChartModel {
  const { width, height } = model;
  const fontSize = o.fontSize || 12;
  const measure = o.measure || approx;
  const labels = (o.labels || []).map((l) => String(l ?? ''));
  const series = o.series || [];
  const multi = series.length > 1;
  model.legend = multi ? series.map((s, i) => ({ index: i, name: s.name ?? '', color: s.color || palette[i % palette.length], hidden: !!s.hidden, shape: 'box' })) : [];
  const groups = series.map((s, i) => ({ s, i, values: (s.data as unknown[]).map((v) => Math.max(0, num(v) ?? 0)) })).filter((g) => !g.s.hidden);
  const totals = groups.map((g) => g.values.reduce((a, b) => a + b, 0));
  model.empty = !totals.some((t) => t > 0);
  const plot = { x: 2, y: 2, w: Math.max(0, width - 4), h: Math.max(0, height - 4) };
  model.plot = plot;
  if (model.empty) return model;
  const gap = 2;
  const blocks = squarify(totals, plot.x, plot.y, plot.w, plot.h);
  groups.forEach((g, n) => {
    const b = blocks[n];
    const tiles = squarify(g.values, b.x, b.y, b.w, b.h);
    const top = Math.max(...g.values);
    g.values.forEach((v, k) => {
      const t = tiles[k];
      if (!(v > 0) || t.w <= 0 || t.h <= 0) return;
      const color = multi ? g.s.color || palette[g.i % palette.length] : g.s.colors?.[k] || palette[k % palette.length];
      const cell: ChartCell = {
        key: `t${g.i}-${k}`,
        x: t.x + gap / 2,
        y: t.y + gap / 2,
        w: Math.max(0, t.w - gap),
        h: Math.max(0, t.h - gap),
        color,
        opacity: multi ? 0.55 + 0.45 * (top ? v / top : 1) : 1,
        series: g.i,
        index: k,
        value: v,
        label: labels[k] ?? '',
        texts: [],
      };
      // The name, and the value under it, where they fit.
      const name = cell.label;
      const value = formatChartValue(v, o.format, o.formatOptions);
      const room = cell.w - 16;
      const texts: ChartText[] = [];
      if (name && measure(name, fontSize) <= room && fontSize + 12 <= cell.h) {
        texts.push({ x: cell.x + 8, y: cell.y + 8, text: name, anchor: 'start', baseline: 'hanging', tone: 'inside', strong: true });
        if (measure(value, fontSize) <= room && fontSize * 2.4 + 12 <= cell.h) texts.push({ x: cell.x + 8, y: cell.y + 8 + fontSize * 1.35, text: value, anchor: 'start', baseline: 'hanging', tone: 'inside' });
      }
      cell.texts = texts;
      model.cells.push(cell);
      model.hover.push({ index: k, series: g.i, x: cell.x, y: cell.y, w: cell.w, h: cell.h, cx: cell.x + cell.w / 2, cy: cell.y });
    });
  });
  return model;
}
