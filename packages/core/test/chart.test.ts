import { describe, expect, it } from 'vitest';
import { arcPath, barPath, boxStats, chartHit, chartModel, chartSeriesFrom, chartSwapTypes, fitArc, formatChartValue, linePath, monotonePath, niceScale, niceStep, squarify, timeTicks } from '../src/index';

const measure = (t: string, size: number) => t.length * size * 0.5;

describe('chart values', () => {
  it('formats numbers, percents, money and Thai compact units', () => {
    expect(formatChartValue(1234.5)).toBe('1,234.5');
    expect(formatChartValue(1234.5, 'integer')).toBe('1,235');
    expect(formatChartValue(0.1234, 'percent')).toBe('12.3%');
    expect(formatChartValue(1234567, 'currency')).toBe('฿1,234,567');
    expect(formatChartValue(1200, 'compact')).toBe('1.2 พัน');
    expect(formatChartValue(15000, 'compact')).toBe('1.5 หมื่น');
    expect(formatChartValue(250000, 'compact')).toBe('2.5 แสน');
    expect(formatChartValue(98765432, 'compact')).toBe('98.8 ล้าน');
    expect(formatChartValue(2.5e9, 'compact')).toBe('2.5 พันล้าน');
    expect(formatChartValue(1234567, 'compact', { lang: 'en' })).toBe('1.2M');
    expect(formatChartValue(950, 'compact')).toBe('950');
    expect(formatChartValue(42, 'number', { suffix: ' คน' })).toBe('42 คน');
    expect(formatChartValue(3, (v) => `#${v}`)).toBe('#3');
    expect(formatChartValue(NaN)).toBe('');
  });

  it('picks round steps that cover the data', () => {
    expect(niceStep(97, 5)).toBe(20);
    expect(niceScale(3, 97, 5)).toEqual({ min: 0, max: 100, step: 20, ticks: [0, 20, 40, 60, 80, 100] });
    expect(niceScale(12, 13, 5, true).min).toBe(0);
    expect(niceScale(-40, 55, 5).ticks).toEqual([-40, -20, 0, 20, 40, 60]);
    expect(niceScale(0.1, 0.35, 5).ticks).toEqual([0.1, 0.15, 0.2, 0.25, 0.3, 0.35]);
    expect(niceScale(5, 5, 4).ticks.length).toBeGreaterThan(1);
    expect(niceScale(0, 0, 4, true)).toMatchObject({ min: 0, max: 1 });
  });
});

describe('chart paths', () => {
  it('breaks lines at gaps and smooths without overshooting', () => {
    expect(linePath([{ x: 0, y: 10 }, null, { x: 20, y: 5 }, { x: 30, y: 0 }])).toBe('M0 10M20 5L30 0');
    const d = monotonePath([
      { x: 0, y: 50 },
      { x: 10, y: 10 },
      { x: 20, y: 10 },
      { x: 30, y: 60 },
    ]);
    // Every control point stays inside the data's range: a flat stretch stays flat.
    const ys = d.match(/-?\d+(\.\d+)?/g)!.map(Number).filter((_, i) => i % 2 === 1);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(10);
    expect(Math.max(...ys)).toBeLessThanOrEqual(60);
  });

  it('draws slices, whole circles and bars with a rounded end', () => {
    expect(arcPath(50, 50, 0, 40, 0, Math.PI / 2)).toBe('M50 10A40 40 0 0 1 90 50L50 50Z');
    expect(arcPath(50, 50, 20, 40, 0, Math.PI * 2).match(/A/g)!.length).toBe(4);
    expect(barPath(0, 0, 20, 50, 4, 'top')).toBe('M0 50V4a4 4 0 0 1 4 -4H16a4 4 0 0 1 4 4V50Z');
    expect(barPath(0, 0, 20, 2, 4, 'top')).toContain('a2 2');
    expect(barPath(0, 0, 20, 50, 0, 'top')).toBe('M0 0h20v50h-20Z');
  });
});

describe('chart model', () => {
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.'];

  it('reads Chart.js data as it is', () => {
    const { labels, series } = chartSeriesFrom(
      {
        labels: ['a', ['b', 'c']],
        datasets: [
          { label: 'Sales', data: [1, 2], backgroundColor: '#f00' },
          { type: 'line', label: 'Trend', data: [1, 3], borderColor: '#00f', yAxisID: 'y1', tension: 0.4, fill: true, borderDash: [4, 4] },
          { label: 'Slices', data: [1, 2], backgroundColor: ['#111', '#222'], hidden: true, stack: 's1' },
        ],
      },
      'bar'
    );
    expect(labels).toEqual(['a', 'b c']);
    expect(series[0]).toMatchObject({ name: 'Sales', color: '#f00', type: undefined });
    expect(series[1]).toMatchObject({ name: 'Trend', color: '#00f', type: 'area', axis: 'right', smooth: true, dashed: true });
    expect(series[2]).toMatchObject({ colors: ['#111', '#222'], hidden: true, stack: 's1' });
  });

  it('groups bars side by side, rounds their ends and adds hover bands', () => {
    const m = chartModel({
      type: 'bar',
      labels: months,
      series: [
        { name: 'รายรับ', data: [10, 20, 30, 40] },
        { name: 'รายจ่าย', data: [5, 15, null, 35] },
      ],
      width: 400,
      height: 240,
      measure,
    });
    expect(m.empty).toBe(false);
    expect(m.bars.length).toBe(7);
    const [a, b] = [m.bars.find((x) => x.key === 'b0-0')!, m.bars.find((x) => x.key === 'b1-0')!];
    expect(b.x).toBeGreaterThan(a.x);
    expect(a.y + a.h).toBeCloseTo(b.y + b.h);
    expect(a.d).toContain('a4 4');
    expect(m.hover.length).toBe(4);
    expect(m.xTicks.map((t) => t.text)).toEqual(months);
    expect(m.yTicks[0].text).toBe('0');
    expect(m.legend.map((l) => l.shape)).toEqual(['box', 'box']);
  });

  it('stacks bars, rounding only the top of each stack', () => {
    const m = chartModel({
      type: 'bar',
      labels: ['x'],
      stacked: true,
      series: [
        { name: 'a', data: [10] },
        { name: 'b', data: [20] },
      ],
      width: 300,
      height: 300,
      measure,
    });
    const [a, b] = m.bars;
    expect(a.x).toBe(b.x);
    expect(b.y + b.h).toBeCloseTo(a.y);
    expect(a.d).not.toContain('a');
    expect(b.d).toContain('a4 4');
    expect(m.yTicks.map((t) => t.text).pop()).toBe('30');
  });

  it('puts bars across with categories on the left', () => {
    const m = chartModel({ type: 'bar', horizontal: true, labels: months, series: [{ data: [1, 2, 3, 4] }], width: 400, height: 300, measure, showValues: true });
    expect(m.yTicks.map((t) => t.text)).toEqual(months);
    expect(m.bars[3].w).toBeGreaterThan(m.bars[0].w);
    expect(m.valueLabels.map((l) => l.text)).toEqual(['1', '2', '3', '4']);
  });

  it('draws bars and a line on a second axis together', () => {
    const m = chartModel({
      type: 'bar',
      labels: months,
      series: [
        { name: 'ยอดขาย', data: [100, 200, 300, 400] },
        { name: 'อัตราเติบโต', type: 'line', axis: 'right', data: [0.1, 0.2, 0.15, 0.3] },
      ],
      width: 500,
      height: 300,
      measure,
      rightFormat: 'percent',
    });
    expect(m.lines.length).toBe(1);
    expect(m.y2Ticks.some((t) => t.text.endsWith('%'))).toBe(true);
    // The line's points sit in the middle of the bars' bands.
    const bar = m.bars.find((x) => x.key === 'b0-1')!;
    const dot = m.dots.find((d) => d.key === 'd1-1')!;
    expect(dot.cx).toBeCloseTo(bar.x + bar.w / 2, 0);
    expect(m.legend[1].shape).toBe('line');
  });

  it('runs a line from edge to edge, with an area and a reference line', () => {
    const m = chartModel({
      type: 'area',
      labels: months,
      series: [{ name: 'ผู้ใช้', data: [5, 8, 3, 9] }],
      referenceLines: [{ value: 7, label: 'เป้าหมาย' }],
      width: 400,
      height: 240,
      measure,
    });
    expect(m.dots[0].cx).toBeCloseTo(m.plot.x);
    expect(m.dots[3].cx).toBeCloseTo(m.plot.x + m.plot.w);
    expect(m.lines[0].area).toMatch(/Z$/);
    expect(m.references[0].label?.text).toBe('เป้าหมาย');
    expect(m.xTicks[0].anchor).toBe('start');
  });

  it('leaves hidden series out of the axis and shapes but keeps them in the legend', () => {
    const m = chartModel({
      type: 'line',
      labels: months,
      series: [
        { name: 'a', data: [1, 2, 3, 4] },
        { name: 'b', data: [100, 200, 300, 400], hidden: true },
      ],
      width: 400,
      height: 240,
      measure,
    });
    expect(m.lines.length).toBe(1);
    expect(Number(m.yTicks[m.yTicks.length - 1].text)).toBeLessThan(10);
    expect(m.legend[1].hidden).toBe(true);
  });

  it('makes slices that add up to the whole, with percent labels', () => {
    const m = chartModel({ type: 'doughnut', labels: ['ไทย', 'อังกฤษ', 'จีน'], series: [{ data: [50, 30, 20] }], width: 300, height: 300, showValues: true, formatOptions: { suffix: ' คน' } });
    expect(m.slices.map((s) => s.percent)).toEqual([0.5, 0.3, 0.2]);
    expect(m.valueLabels.map((l) => l.text)).toEqual(['50%', '30%', '20%']);
    expect(m.center?.r).toBeGreaterThan(0);
    const hidden = chartModel({ type: 'pie', labels: ['a', 'b'], series: [{ data: [1, 3] }], width: 200, height: 200, hiddenSlices: [0] });
    expect(hidden.slices.length).toBe(1);
    expect(hidden.slices[0].percent).toBe(1);
    expect(hidden.legend[0].hidden).toBe(true);
  });

  it('shows a slice percent only where it fits inside the slice', () => {
    const ring = (size: number) => chartModel({ type: 'doughnut', labels: ['a', 'b', 'c'], series: [{ data: [80, 12, 8] }], width: size, height: size, fontSize: 24, measure, showValues: true });
    expect(ring(400).valueLabels.map((l) => l.text)).toEqual(['80%', '12%', '8%']);
    expect(ring(160).valueLabels).toEqual([]);
  });

  it('keeps the axes it is given while the values move, and fans a pie out', () => {
    const base = { type: 'bar' as const, labels: months, series: [{ data: [10, 20, 30, 40] }], width: 400, height: 240, measure };
    const end = chartModel(base);
    expect(end.scales.left?.ticks).toEqual(end.yTicks.map((t) => Number(t.text)));
    const growing = chartModel({ ...base, series: [{ data: [1, 2, 3, 4] }], scales: end.scales });
    expect(growing.yTicks.map((t) => t.text)).toEqual(end.yTicks.map((t) => t.text));
    expect(growing.bars[3].h).toBeCloseTo(end.bars[3].h / 10, 0);
    const sliding = chartModel({ ...base, scales: { left: { ...end.scales.left!, max: end.scales.left!.max / 2 } } });
    expect(sliding.yTicks.length).toBeLessThan(end.yTicks.length);
    const pie = (sweep: number) => chartModel({ type: 'pie', labels: ['a', 'b'], series: [{ data: [1, 1] }], width: 200, height: 200, sweep });
    expect(pie(1).hover[1].cx).toBeLessThan(100);
    expect(pie(0.5).hover[1].cx).toBeGreaterThan(100);
  });

  it('draws steps, fading areas, sparklines and annotations', () => {
    expect(linePath([{ x: 0, y: 10 }, { x: 10, y: 0 }, { x: 20, y: 5 }], 'step')).toBe('M0 10H10V0H20V5');
    const area = chartModel({ type: 'area', labels: months, series: [{ data: [5, 8, 3, 9], curve: 'step' }], width: 400, height: 240, measure });
    expect(area.lines[0].d).toContain('H');
    expect(area.lines[0].gradient).toBe(true);
    expect(chartModel({ type: 'area', labels: months, series: [{ data: [5, 8, 3, 9] }], width: 400, height: 240, gradient: false }).lines[0].gradient).toBe(false);
    const spark = chartModel({ type: 'line', labels: months, series: [{ data: [5, 8, 3, 9] }], width: 120, height: 40, sparkline: true, measure });
    expect([spark.xTicks.length, spark.yTicks.length, spark.grid.length]).toEqual([0, 0, 0]);
    expect(spark.plot.w).toBeGreaterThan(110);
    const notes = chartModel({
      type: 'bar',
      labels: months,
      series: [{ data: [10, 20, 30, 40] }],
      width: 400,
      height: 240,
      measure,
      annotations: { y: [{ value: 50, to: 60, label: 'เป้า' }], x: [{ at: 'ก.พ.', label: 'โปร' }, { at: 2, to: 3 }], points: [{ at: 'เม.ย.', value: 40, label: 'สูงสุด' }] },
    });
    // The band's values are on the axis.
    expect(Number(notes.yTicks[notes.yTicks.length - 1].text)).toBeGreaterThanOrEqual(60);
    expect(notes.bands.length).toBe(2);
    expect(notes.bands[0].label?.text).toBe('เป้า');
    expect(notes.references[0].x1).toBe(notes.references[0].x2);
    expect(notes.marks[0].label?.text).toBe('สูงสุด');
    expect(notes.marks[0].box!.y + notes.marks[0].box!.h).toBeLessThan(notes.marks[0].y);
  });

  it('draws radial bars, gauges and polar areas', () => {
    const rings = chartModel({ type: 'radialBar', labels: ['a', 'b'], series: [{ data: [75, 40] }], width: 300, height: 300 });
    expect(rings.rings.map((r) => r.percent)).toEqual([0.75, 0.4]);
    expect(rings.rings[0].track).toMatch(/A/);
    expect(rings.center?.lift).toBe(false);
    const gauge = chartModel({ type: 'radialBar', labels: ['CPU'], series: [{ data: [50] }], width: 300, height: 200, startAngle: -90, endAngle: 90 });
    expect(gauge.center?.lift).toBe(true);
    // A half circle sits on the bottom: its centre is low in the box.
    expect(gauge.center!.y).toBeGreaterThan(150);
    expect(fitArc(200, 120, -Math.PI / 2, Math.PI / 2, 0)).toEqual({ cx: 100, cy: 110, radius: 100 });
    const semi = chartModel({ type: 'doughnut', labels: ['a', 'b'], series: [{ data: [1, 1] }], width: 300, height: 200, startAngle: -90, endAngle: 90 });
    expect(semi.center?.lift).toBe(true);
    const polarArea = chartModel({ type: 'polarArea', labels: ['a', 'b', 'c'], series: [{ data: [10, 20, 40] }], width: 300, height: 300 });
    expect(polarArea.slices.length).toBe(3);
    expect(polarArea.radar?.rings.length).toBeGreaterThan(1);
    expect(polarArea.slices[0].d).not.toBe(polarArea.slices[2].d);
  });

  it('shades heatmap cells and lays out treemap tiles by value', () => {
    const heat = chartModel({
      type: 'heatmap',
      labels: ['จ.', 'อ.', 'พ.'],
      series: [
        { name: 'เช้า', data: [1, 5, 9] },
        { name: 'บ่าย', data: [2, null, 4] },
      ],
      width: 300,
      height: 160,
      measure,
      showValues: true,
    });
    expect(heat.cells.length).toBe(5);
    expect(heat.cells.find((c) => c.value === 9)!.opacity).toBe(1);
    expect(heat.cells.find((c) => c.value === 1)!.opacity).toBeCloseTo(0.14);
    expect(heat.yTicks.map((t) => t.text)).toEqual(['เช้า', 'บ่าย']);
    expect(heat.legend).toEqual([]);
    expect(new Set(heat.cells.map((c) => c.color)).size).toBe(1);
    const ranged = chartModel({ type: 'heatmap', labels: ['a', 'b'], series: [{ data: [1, 8] }], width: 200, height: 100, colorRanges: [{ from: 0, to: 5, color: '#0f0', name: 'ต่ำ' }, { from: 6, to: 10, color: '#f00' }], hiddenSlices: [1] });
    expect(ranged.legend.map((l) => l.name)).toEqual(['ต่ำ', '6 – 10']);
    expect(ranged.cells.map((c) => c.color)).toEqual(['#0f0']);

    const tiles = squarify([6, 6, 4, 3, 2, 2, 1], 0, 0, 600, 400);
    expect(tiles.reduce((sum, t) => sum + t.w * t.h, 0)).toBeCloseTo(240000);
    expect((tiles[0].w * tiles[0].h) / (tiles[6].w * tiles[6].h)).toBeCloseTo(6);
    const tree = chartModel({ type: 'treemap', labels: ['ก', 'ข', 'ค'], series: [{ data: [50, 30, 20] }], width: 400, height: 300, measure });
    expect(tree.cells.length).toBe(3);
    expect(new Set(tree.cells.map((c) => c.color)).size).toBe(3);
    expect(tree.cells[0].texts[0]).toMatchObject({ text: 'ก', strong: true });
    expect(tree.legend).toEqual([]);
    const groups = chartModel({ type: 'treemap', labels: ['a', 'b'], series: [{ name: 'x', data: [1, 2] }, { name: 'y', data: [3, 4] }], width: 400, height: 300 });
    expect(groups.legend.length).toBe(2);
    expect(groups.cells.filter((c) => c.series === 1).reduce((s, c) => s + (c.w + 2) * (c.h + 2), 0)).toBeGreaterThan(groups.cells.filter((c) => c.series === 0).reduce((s, c) => s + (c.w + 2) * (c.h + 2), 0));
  });

  it('draws a radar web and scatter dots', () => {
    const r = chartModel({ type: 'radar', labels: ['ฟัง', 'พูด', 'อ่าน', 'เขียน', 'คิด'], series: [{ data: [3, 4, 5, 2, 4] }], width: 360, height: 300, measure });
    expect(r.radar?.spokes.length).toBe(5);
    expect(r.radar?.shapes.length).toBe(1);
    expect(r.radar!.rings.length).toBeGreaterThan(1);
    const s = chartModel({ type: 'scatter', series: [{ data: [{ x: 1, y: 2 }, { x: 3, y: 9, r: 10 }] }], width: 300, height: 200, measure });
    expect(s.dots.map((d) => d.r)).toEqual([4.5, 10]);
    expect(Number(s.yTicks[s.yTicks.length - 1].text)).toBeGreaterThanOrEqual(9);
    expect(s.legend[0].shape).toBe('dot');
  });

  it('knows when there is nothing to draw', () => {
    expect(chartModel({ type: 'bar', labels: ['a'], series: [{ data: [null] }], width: 100, height: 100 }).empty).toBe(true);
    expect(chartModel({ type: 'pie', series: [{ data: [0, 0] }], width: 100, height: 100 }).empty).toBe(true);
    expect(chartModel({ type: 'line', series: [], width: 100, height: 100 }).empty).toBe(true);
  });
});

describe('newer chart kinds', () => {
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.'];
  const base = { width: 480, height: 300, measure };

  it('streams around the middle, or as shares, with names inside', () => {
    const series = [
      { name: 'ก', data: [10, 20, 30, 20] },
      { name: 'ข', data: [30, 10, 20, 40] },
    ];
    const m = chartModel({ ...base, type: 'stream', labels: months, series });
    expect(m.generic).toBe(true);
    expect(m.shapes.filter((s) => s.className === 'wu-chart-stream').length).toBe(2);
    expect(m.yTicks).toEqual([]);
    expect(m.hover[0].tip?.rows.length).toBe(3);
    const share = chartModel({ ...base, type: 'stream', variant: 'expand', labels: months, series });
    expect(share.yTicks.map((t) => t.text)).toContain('100%');
    expect(chartModel({ ...base, type: 'stream', variant: 'wiggle', labels: months, series }).shapes.length).toBeGreaterThan(1);
  });

  it('floats waterfall changes from the running total, with totals for nulls', () => {
    const m = chartModel({ ...base, type: 'waterfall', labels: ['เริ่ม', 'ขาย', 'คืน', 'รวม'], series: [{ data: [100, 50, -30, null] }] });
    const bars = m.shapes.filter((s) => s.kind === 'rect');
    expect(bars.map((b) => b.fill)).toEqual(['var(--wu-chart-up)', 'var(--wu-chart-up)', 'var(--wu-chart-down)', 'var(--wu-chart-total)']);
    expect(m.valueLabels.map((l) => l.text)).toEqual(['+100', '+50', '−30', '120']);
    expect(m.shapes.filter((s) => s.className === 'wu-chart-connector').length).toBe(3);
    // The total bar ends where the running total is.
    expect(bars[3].y!).toBeCloseTo(bars[2].y! + bars[2].h!, 0);
  });

  it('joins two values per row, as dots, arrows or a range', () => {
    const series = [
      { name: 'ก่อน', data: [40, 70] },
      { name: 'หลัง', data: [65, 55] },
    ];
    const dots = chartModel({ ...base, type: 'dumbbell', labels: ['ก', 'ข'], series });
    expect(dots.shapes.filter((s) => s.kind === 'circle').length).toBe(4);
    expect(dots.shapes.find((s) => s.kind === 'line')?.gradient).toBeTruthy();
    expect(dots.hover[1].tip?.rows[2].value).toBe('−15');
    const arrows = chartModel({ ...base, type: 'dumbbell', variant: 'arrow', labels: ['ก', 'ข'], series });
    expect(arrows.shapes.filter((s) => s.kind === 'path').map((s) => s.fill)).toEqual(['var(--wu-chart-up)', 'var(--wu-chart-down)']);
  });

  it('lays timeline bars on rows, overlapping ones in lanes, on a date axis', () => {
    const day = 86400000;
    const t0 = new Date(2026, 4, 1).getTime();
    const m = chartModel({
      ...base,
      type: 'timeline',
      series: [
        {
          data: [
            { row: 'ออกแบบ', start: new Date(t0), end: new Date(t0 + 5 * day), name: 'ร่าง' },
            { row: 'ออกแบบ', start: new Date(t0 + 2 * day), end: new Date(t0 + 7 * day), name: 'ทบทวน' },
            { row: 'พัฒนา', start: new Date(t0 + 6 * day), end: new Date(t0 + 20 * day), name: 'เขียนโค้ด' },
          ],
        },
      ],
    });
    expect(m.yTicks.map((t) => t.text)).toEqual(['ออกแบบ', 'พัฒนา']);
    const [a, b] = m.shapes.filter((s) => s.kind === 'rect');
    expect(b.y!).toBeGreaterThan(a.y!);
    expect(m.hover[2].tip?.rows[2].value).toBe('14 วัน');
    expect(m.xTicks.length).toBeGreaterThan(1);
    expect(timeTicks(t0, t0 + 20 * day, 5).step).toBe(7 * day);
  });

  it('narrows a funnel stage by stage, as a funnel, bars or a pyramid', () => {
    const o = { ...base, type: 'funnel' as const, labels: ['เข้าชม', 'สนใจ', 'สมัคร'], series: [{ data: [1000, 400, 100] }] };
    const m = chartModel(o);
    expect(m.shapes.length).toBe(3);
    expect(m.hover[2].tip?.rows.map((r) => r.value)).toEqual(['100', '10%', '25%']);
    expect(chartModel({ ...o, variant: 'bars' }).texts.filter((t) => t.text.startsWith('↓')).length).toBe(2);
    expect(chartModel({ ...o, variant: 'pyramid' }).shapes.every((s) => s.kind === 'path')).toBe(true);
    expect(chartModel({ ...o, hiddenSlices: [1] }).shapes.length).toBe(2);
  });

  it('works out box plots from raw values, and draws violins and points', () => {
    expect(boxStats([1, 2, 3, 4, 5, 6, 7, 8, 100])).toMatchObject({ median: 5, q1: 3, q3: 7, max: 8, outliers: [100] });
    const data = [[1, 2, 3, 4, 5, 6, 7, 8, 100], { min: 2, q1: 4, median: 5, q3: 6, max: 9 }];
    const m = chartModel({ ...base, type: 'boxplot', labels: ['ก', 'ข'], series: [{ data }] });
    expect(m.shapes.filter((s) => s.className === 'wu-chart-median').length).toBe(2);
    expect(m.hover[0].tip?.rows.map((r) => r.value)).toEqual(['8', '7', '5', '3', '1']);
    expect(chartModel({ ...base, type: 'boxplot', variant: 'violin', labels: ['ก'], series: [{ data: [data[0]] }] }).shapes.some((s) => s.key.endsWith('v'))).toBe(true);
    expect(chartModel({ ...base, type: 'boxplot', variant: 'points', labels: ['ก'], series: [{ data: [data[0]] }] }).shapes.filter((s) => s.kind === 'circle').length).toBe(9);
  });

  it('counts histogram values into round bins, with the mean marked', () => {
    const values = Array.from({ length: 50 }, (_, i) => 40 + ((i * 37) % 50));
    const m = chartModel({ ...base, type: 'histogram', series: [{ data: values }] });
    const counts = m.hover.map((h) => Number(h.tip!.rows[0].value));
    expect(counts.reduce((a, b) => a + b, 0)).toBe(50);
    expect(m.references[0].label?.text).toMatch(/^ค่าเฉลี่ย /);
    expect(chartModel({ ...base, type: 'histogram', bins: 4, series: [{ data: values }] }).hover.length).toBeLessThanOrEqual(6);
    expect(chartModel({ ...base, type: 'histogram', variant: 'density', series: [{ data: values }] }).shapes.some((s) => s.fade)).toBe(true);
  });

  it('draws a sunburst ring by ring, drills into a node, and stacks an icicle', () => {
    const tree = [
      { name: 'วิชาการ', children: [{ name: 'คณิต', value: 30 }, { name: 'ภาษา', value: 20 }] },
      { name: 'กิจกรรม', value: 50 },
    ];
    const m = chartModel({ ...base, type: 'sunburst', series: [{ data: tree }] });
    expect(m.shapes.length).toBe(4);
    expect(m.centerText).toEqual({ value: '100', label: 'รวม' });
    const hit = chartHit(m, m.center!.x + m.center!.r + 5, m.center!.y + 2);
    expect(hit?.key).toBeTruthy();
    const inner = chartModel({ ...base, type: 'sunburst', focus: 'วิชาการ', series: [{ data: tree }] });
    expect(inner.shapes.length).toBe(2);
    expect(inner.centerText).toEqual({ value: '50', label: 'วิชาการ' });
    expect(chartModel({ ...base, type: 'sunburst', variant: 'icicle', series: [{ data: tree }] }).shapes.every((s) => s.kind === 'rect')).toBe(true);
  });

  it('fills a waffle of 100 units by share, or dots and people', () => {
    const o = { ...base, type: 'unit' as const, labels: ['ก', 'ข', 'ค'], series: [{ data: [1, 1, 1] }] };
    const m = chartModel(o);
    expect(m.shapes.length).toBe(100);
    expect(['u0', 'u1', 'u2'].map((k) => m.shapes.filter((s) => s.hover === k).length)).toEqual([34, 33, 33]);
    expect(chartModel({ ...o, variant: 'people' }).shapes.length).toBe(50);
    expect(chartModel({ ...o, variant: 'dots' }).shapes[0].kind).toBe('circle');
  });

  it('draws slopes with labels kept apart, coloured by direction when highlighted', () => {
    const series = [
      { name: 'ก', data: [50, 70] },
      { name: 'ข', data: [51, 40] },
      { name: 'ค', data: [60, 60] },
    ];
    const m = chartModel({ ...base, type: 'slope', labels: ['2568', '2569'], series });
    const lefts = m.texts.filter((t) => t.anchor === 'end' && t.hover).map((t) => t.y);
    expect(Math.abs(lefts[0] - lefts[1])).toBeGreaterThanOrEqual(14);
    const hi = chartModel({ ...base, type: 'slope', variant: 'highlight', labels: ['2568', '2569'], series });
    expect(hi.shapes.filter((s) => s.kind === 'path').map((s) => s.stroke)).toEqual(['var(--wu-chart-up)', 'var(--wu-chart-down)', 'var(--wu-chart-muted)']);
    expect(chartHit(m, m.hover[0].points![0].x + 1, m.hover[0].points![0].y)?.key).toBe('l0');
  });

  it('draws heatmaps as squares, circles or a honeycomb with the numbers inside', () => {
    const o = { ...base, type: 'heatmap' as const, labels: ['จ.', 'อ.', 'พ.'], series: [{ name: 'a', data: [1, 5, 9] }, { name: 'b', data: [2, 6, 4] }] };
    expect(chartModel(o).cells.every((c) => c.texts.length === 1 && !c.d)).toBe(true);
    const hex = chartModel({ ...o, variant: 'hex' });
    expect(hex.cells[0].d).toMatch(/^M.*L.*Z$/);
    // Every other row moves half a cell.
    expect(hex.cells[3].x - hex.cells[0].x).toBeGreaterThan(5);
    expect(chartModel({ ...o, variant: 'circle' }).cells[0].d).toContain('a');
  });

  it('lists the kinds the same data can switch to', () => {
    const one = [{ data: [1, 2, 3] }];
    const two = [{ data: [1, 2, 3] }, { data: [3, 2, 1] }];
    expect(chartSwapTypes('bar', one, ['a', 'b', 'c'])).toEqual(['bar', 'line', 'area', 'pie', 'doughnut', 'polarArea', 'funnel', 'treemap', 'unit', 'radar']);
    expect(chartSwapTypes('line', two, ['a', 'b', 'c'])).toContain('stream');
    expect(chartSwapTypes('line', two, ['a', 'b', 'c'])).not.toContain('pie');
    expect(chartSwapTypes('waterfall', one)).toEqual(['waterfall']);
    expect(chartSwapTypes('timeline', [{ data: [{ row: 'a', start: 1, end: 2 }] }])).toEqual(['timeline']);
  });
});
