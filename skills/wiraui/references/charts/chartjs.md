# ChartJS

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: which chart component to use on which major.

`wu-chartjs` (also `wu-chartJs`) · `WuChartJsModule` / `WuChartJs` from `@wirabyte/ui/chartjs` · exportAs `wuChartJs`

**Requires** `npm install chart.js` (Chart.js **3 or 4**, optional peer dependency; the component loads `chart.js/auto`, so every chart type is available). Apps without charts never need it.

Chart.js drawn on a canvas; takes the theme font and text colour, never wider than its container. Use for Chart.js plugins/kinds, or in v1/v2 as the chart.

```html
<wu-chartjs type="bar" [data]="salesData" height="280px" ariaLabel="รายรับและรายจ่ายรายเดือน"></wu-chartjs>
```
```ts
import { ChartData } from 'chart.js';

salesData: ChartData<'bar'> = {
  labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'],
  datasets: [
    { label: 'รายรับ', data: [52, 61, 70, 66, 74, 80], backgroundColor: '#3b82f6' },
    { label: 'รายจ่าย', data: [40, 45, 52, 48, 55, 58], backgroundColor: '#f59e0b' },
  ],
};
```

**Inputs** (a new `type`, `data` or `options` value rebuilds the chart)
- `type`: `'bar' | 'line' | 'pie' | 'doughnut' | 'polarArea' | 'radar' | 'bubble' | 'scatter'` = `'bar'`
- `data`: `ChartData` — Chart.js `{ labels, datasets }`
- `options`: `ChartOptions` — Chart.js options
- `plugins`: `Plugin[]` = `[]` — Chart.js plugins for this chart (an inline object with an `id` works; options are read by plugin id, e.g. `options.plugins.centerText`)
- `width` · `height`: `string` — e.g. `'480px'`, `'100%'`; with a height a responsive chart fills the width at that height; `width` caps width
- `responsive`: `boolean` = `true` — `false` = fixed size
- `ariaLabel` · `ariaLabelledBy`: `string` — canvas is `role="img"`
- `styleClass` · `style`: `string` · `object`

**Outputs** — `(onDataSelect)`: `WuChartJsDataSelectEvent` `{ originalEvent: MouseEvent, element: unknown /* Chart.js: { datasetIndex, index, element } */, dataset: unknown[] }` — bar/point/slice clicked. In v1/v2 `@wirabyte/ui/chart` also re-exports `WuChartDataSelectEvent`.

**Methods** (via `#c="wuChartJs"` or `@ViewChild(WuChartJs)`): `refresh()`: `void` (redraw after in-place data changes) · `reinit()`: `void` (rebuild from scratch) · `getCanvas()`: `HTMLCanvasElement | null` · `getBase64Image()`: `string | null` (PNG data URL) · `chart`: `Chart | null` (property, the Chart.js instance) · `generateLegend()` kept for old code.

**Snippets**
```html
<wu-chartjs type="bar" [data]="scoreData" [options]="scoreOptions" height="260px" ariaLabel="…" (onDataSelect)="pick($event)"></wu-chartjs>
<wu-chartjs #c="wuChartJs" type="line" [data]="attendance" height="240px" ariaLabel="…"></wu-chartjs>
```
```ts
import { WuChartJsDataSelectEvent } from '@wirabyte/ui/chartjs';
pick(e: WuChartJsDataSelectEvent) { const { datasetIndex, index } = e.element as { datasetIndex: number; index: number }; }
addWeek(c: WuChartJs) { this.attendance.labels!.push('สัปดาห์ 6'); this.attendance.datasets[0].data.push(1190); c.refresh(); }
```
Horizontal/stacked: `options = { indexAxis: 'y', scales: { x: { stacked: true }, y: { stacked: true } } }`. Bars + line: a dataset's own `type` overrides the chart's.

**Tokens** — no tokens of its own; reads `--wu-font-family` (font), `--wu-text-muted` (text colour), `--wu-border` (grid/border) when building, unless the app set `Chart.defaults` or passes `font`/`color`/`borderColor` in options. For dataset colours read a variable yourself: `getComputedStyle(document.documentElement).getPropertyValue('--wu-primary-color').trim()` (also `--wu-primary-300`).

**Gotchas**
- Chart.js is the app's own install (3 or 4); not bundled.
- Mutating `data` in place is not noticed: call `refresh()`; assigning a new object rebuilds by itself.
- Theme/dark-mode change does not recolour datasets: build a new `data` object after the change.
- `p-chart` → `wu-chartjs`: inputs and `(onDataSelect)` keep their names.

---
