# Chart (v3 only; v1/v2 see "Chart in v1 / v2" below)

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: which chart component to use on which major.

`wu-chart` · `WuChartModule` / `WuChart` from `@wirabyte/ui/chart` · exportAs `wuChart`

WiraUI's own SVG chart: bar (grouped, stacked, horizontal), line (smooth, step), area, pie, doughnut, radialBar/gauge, polarArea, radar, scatter/bubble, heatmap, treemap, stream, waterfall, dumbbell, timeline (Gantt), funnel, boxplot, histogram, sunburst, unit (waffle), slope. Mixable, with sparklines, annotations, zoom toolbar, synced tooltips. Text is real text in the page font; colours come from the theme (`--wu-chart-1` is the preset's primary), so dark mode and presets just work. Fills the width, 320px high, redraws on resize.

```html
<wu-chart type="bar" [labels]="months" [series]="money" format="currency"></wu-chart>
```
```ts
import { WuChartSeries } from '@wirabyte/ui/chart';

months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'];
money: WuChartSeries[] = [
  { name: 'รายรับ', data: [420000, 380000, 510000, 465000, 530000, 610000] },
  { name: 'รายจ่าย', data: [310000, 295000, 340000, 360000, 330000, 390000] },
];
```
`[labels]` = axis labels (pie: one per slice); `[series]` = `{ name, data }` sets, one value per label (`null` = no value). Pass a new array to `[series]` and bars/lines animate to it.

**Inputs · data**
- `type`: `'bar' | 'line' | 'area' | 'pie' | 'doughnut' | 'polarArea' | 'radialBar' | 'radar' | 'scatter' | 'heatmap' | 'treemap' | 'stream' | 'waterfall' | 'dumbbell' | 'timeline' | 'funnel' | 'boxplot' | 'histogram' | 'sunburst' | 'unit' | 'slope'` = `'bar'` — kind of chart (bind `[type]` to switch with animation)
- `variant`: `string` — the look of a kind (see kinds table)
- `swap`: `boolean | WuChartType[]` — (Beta) type switcher top right: `true` offers every kind the data can be drawn as, or name them `[swap]="['bar','line','area']"`
- `looks`: `boolean` = `false` — look picker for kinds with several looks
- `bins`: `number` = `auto` — histogram bins
- `labels`: `string[]`; `series`: `WuChartSeries[]` — `{ name, data, type?, color?, colors?, axis?, stack?, smooth?, dashed?, fill?, hidden? }`
- `data` · `options`: Chart.js-shaped data/options instead of `labels`/`series` (see "Moving from ChartJS")

**Inputs · look**
- `title` · `subtitle`: `string` — heading above the chart (title is also the accessible name)
- `height`: `number | string` = `'320px'` (pie 280px) — drawing height
- `legend`: `'top' | 'bottom' | 'right' | 'none'` = `'bottom'` (pie/doughnut `'right'`)
- `font` · `fontSize`: `string` · `number` = theme font · `12` — font of every text in the chart
- `horizontal` · `stacked` · `smooth`: `boolean` = `false` — bars across · stacked · smooth lines
- `curve`: `'straight' | 'smooth' | 'step'` = `'straight'` — wins over `smooth`; also per series
- `gradient`: `boolean` = `true` — areas fade down from the line colour (`false` = flat)
- `sparkline`: `boolean` = `false` — no axes/grid/legend, 48px tall, tooltip still works
- `startAngle` · `endAngle`: `number` = `0` · `360` — pie/doughnut/radialBar angles, degrees clockwise from 12 o'clock (`-90`/`90` = half circle gauge); sunburst too
- `colorRanges`: `{ from, to, color, name? }[]` — heatmap colours by value range (legend toggles each range)
- `toolbar`: `boolean` = `false` — zoom in/out/all + download PNG/SVG/CSV buttons
- `zoom`: `boolean` = value of `toolbar` — drag across bar/line/area to zoom
- `group`: `string` — charts with the same group show the tooltip together
- `fileName`: `string` = `'chart'` — toolbar download name
- `showValues` · `points` · `grid`: `boolean` = `false` · auto · `true` — values on marks · dots on lines · grid lines
- `colors`: `string[]` = theme — colours for series without one
- `barRadius` · `cutout`: `number` = `4` · `0.62` — rounded bar ends (px; only the outer end of a stack) · doughnut hole
- `centerValue` · `centerLabel`: `string` = total · `รวม` (locale) — doughnut middle text
- `tooltip` · `animate`: `boolean` = `true`
- `emptyMessage`: `string` = locale; `ariaLabel`: `string` = `title`; `styleClass`/`style` (STYLE_ROW)

**Inputs · axes and numbers**
- `format` · `rightFormat`: `'number' | 'integer' | 'percent' | 'currency' | 'compact' | (v) => string` = `'number'` — `percent` 0.12 → 12%; `currency` ฿1,234; `compact` 1.2 พัน / 2.5 แสน / 98.8 ล้าน (English: 1.2K / 98.8M)
- `currency` · `decimals` · `prefix` · `suffix` · `lang`: `string` · `number` = `'THB'` — currency, decimals, text before/after, language of numbers (default: app language)
- `min` · `max` · `beginAtZero`: `number` · `boolean` = auto — value axis range (`max` is also the full scale of radialBar, default 100, and radar)
- `rightMin` · `rightMax`: `number` = auto
- `xTitle` · `yTitle` · `y2Title`: `string` — axis titles
- `referenceLines`: `{ value, to?, label?, color?, axis?, dashed? }[]` — dashed line at a value (`to` = band); axis always includes it
- `annotations`: `{ y?, x?, points? }` — `y` lines/bands at values, `x` lines/bands at labels (text or index), `points` labelled points

**Outputs**
- `(pointClick)`: `WuChartClickEvent` `{ series, seriesName, index, label, value, originalEvent }` — click or Enter on a point/bar/slice
- `(seriesToggle)`: `WuChartToggleEvent` `{ index, name, hidden }` — legend hides/shows a series
- `(zoomChange)`: `WuChartZoomEvent | null` `{ from, to }` labels zoomed into (null = all)
- `(typeChange)`: `WuChartType` — kind picked in the switcher; `(variantChange)`: `string` — look picked in the look picker

**Methods** (via `#c="wuChart"`): `download(fileName = 'chart', 'png' | 'svg' | 'csv')`: `Promise<void>` · `toCSV()`: `string` (row per label, column per series) · `toPNG(scale = 2, background?)`: `Promise<string>` data URL · `toSVG()`: `string` (colours/fonts inlined) · `refresh()`: `void` (after mutating series in place). Pictures use fonts installed on the machine, not web fonts.

**Kinds and variants** (all use `<wu-chart type="…" [labels] [series]>`; add `[looks]="true"` to let users switch variant)

| type | data shape | variants / notes |
|---|---|---|
| bar | `data: number[]` per series | `stacked`, or `stack: 'key'` per series (groups side by side); `horizontal`; series may be `type: 'line'` and `axis: 'right'` (own scale, with `rightFormat`); lines draw over bars |
| line / area | same | `smooth`, `curve`, per series `dashed`, `fill`, `smooth`; area `stacked` |
| pie / doughnut | ONE series, one value per slice | doughnut shows total in middle |
| polarArea | one series | equal-width slices, radius = value |
| radialBar | `[{ data: [87] }]`, one ring per label, value out of `max` (default 100) | half circle: `[startAngle]="-90" [endAngle]="90"` |
| radar | several series | `[max]="5"` |
| scatter | `data: { x, y, r? }[]` | `r` makes bubbles; no `labels` needed; `xTitle`/`yTitle` |
| heatmap | one series per row, `labels` = columns | `'square'`, `'circle'`, `'hex'`; or `colorRanges` |
| treemap | one series, `labels` = items | several series group into blocks |
| stream | several series over labels | `'silhouette'`, `'wiggle'`, `'expand'` (0–100%) |
| waterfall | one series of changes; `null` = total there | `'bars'`, `'steps'` |
| dumbbell | first two series = start and end per row | `'dots'`, `'arrow'`, `'range'` |
| timeline | `data: { row, start, end, name?, color? }[]` (Date, ISO text or number); no labels | `'bars'`, `'thin'` |
| funnel | one series, `labels` = stages | `'funnel'`, `'bars'`, `'pyramid'` |
| boxplot | per label: raw `number[]` (quartiles/outliers computed) or `{ min, q1, median, q3, max }` | `'box'`, `'violin'`, `'points'`; `[horizontal]` |
| histogram | raw values in one series (several overlap) | `bins`; `'bars'`, `'density'` |
| sunburst | `data: WuChartNode[]` = `{ name, value?, children? }[]` | `'sunburst'`, `'icicle'`; click to drill in, centre/Esc to go out; `startAngle`/`endAngle` for half |
| unit | one series of counts (rounded to add up) | `'waffle'` (100 squares), `'dots'`, `'people'` (50) |
| slope | each series = line from first to last label | `'lines'`, `'highlight'` (green up, red down, grey same) |

**Snippets**
```html
<wu-chart type="area" [labels]="days30" [series]="daily" [toolbar]="true" fileName="visitors" (zoomChange)="zoomed = $event"></wu-chart>
<wu-chart group="school" type="line" [labels]="months" [series]="visitors" height="200"></wu-chart>   <!-- same group = synced tooltip -->
<wu-chart type="line" title="รายรับรายจ่าย" subtitle="หน่วย: บาท" [labels]="months" [series]="money" [referenceLines]="[{ value: 400000, label: 'งบประมาณ' }]" format="compact"></wu-chart>
<wu-chart #c="wuChart" type="doughnut" [labels]="channels" [series]="applicants"></wu-chart>
<wu-button label="PNG" (onClick)="c.download('applicants')"></wu-button>   <!-- c.download('applicants', 'svg') for SVG -->
```
```ts
import { WuChartAnnotations, WuChartClickEvent, WuChartNode, WuChartSeries, WuChartType, WuChartZoomEvent } from '@wirabyte/ui/chart';

notes: WuChartAnnotations = {
  y: [{ value: 20000, to: 26000, label: 'ช่วงเป้าหมาย', color: '#16a34a' }],
  x: [{ at: 'เม.ย.', to: 'พ.ค.', label: 'ปิดภาคเรียน' }],
  points: [{ at: 'มิ.ย.', value: 30400, label: 'สูงสุด' }],
};   // bind [annotations]="notes"
```

**Moving from ChartJS**: Chart.js-shaped `[data]` (`{ labels, datasets }`) works as is: `label`, `data`, `backgroundColor`/`borderColor` (one colour or one per slice), `type`, `yAxisID`, `stack`, `hidden`, `tension`, `fill`, `borderDash`. Understood `[options]`: `indexAxis: 'y'`, `scales.*.stacked`, `scales.y.min/max/beginAtZero`, `plugins.legend`, `plugins.title`, `cutout`. So `<wu-chartjs type="bar" [data] [options]>` (or `p-chart`) → `<wu-chart type="bar" [data] [options]>` and `chart.js` can go. Keep `wu-chartjs` for plugins or unsupported kinds.

**Keyboard**: `←` `→` (bars across `↑` `↓`) step label by label; `Home`/`End`; `Enter` fires `(pointClick)`; `Esc` closes tooltip. Screen readers get a hidden data table.

**Tokens** — `--wu-chart-1 … --wu-chart-10` (series colours, 1 = primary), `--wu-chart-font-family`, `--wu-chart-font-size`, `--wu-chart-text`, `--wu-chart-title-color`, `--wu-chart-title-size`, `--wu-chart-title-weight`, `--wu-chart-grid`, `--wu-chart-axis`, `--wu-chart-crosshair`, `--wu-chart-line-width`, `--wu-chart-area-opacity`, `--wu-chart-dot-fill`, `--wu-chart-dim-opacity`, `--wu-chart-value-color`, `--wu-chart-value-inside-color`, `--wu-chart-slice-border`, `--wu-chart-reference-color`, `--wu-chart-center-size`, `--wu-chart-legend-color`, `--wu-chart-tooltip-bg`, `--wu-chart-tooltip-color`, `--wu-chart-tooltip-border`, `--wu-chart-tooltip-radius`, `--wu-chart-tooltip-shadow`, `--wu-chart-tooltip-padding`, `--wu-chart-gradient-from`, `--wu-chart-gradient-to`, `--wu-chart-track`, `--wu-chart-band-opacity`, `--wu-chart-mark-color`, `--wu-chart-selection`, `--wu-chart-toolbar-color`, `--wu-chart-up`, `--wu-chart-down`, `--wu-chart-total`, `--wu-chart-muted`, `--wu-chart-gap`

**Gotchas**
- v3 only. In v1/v2 this tag is Chart.js: do not write `labels`/`series` there.
- Switchable chart from your own UI: bind `[type]` (and `[variant]`); or use `[swap]="true"` / `[looks]="true"`; `(typeChange)` / `(variantChange)` tell what users picked (store and pass back).
- Mutating `series` in place needs `refresh()`; assigning a new array animates by itself. `[animate]="false"` turns animation off; reduced-motion users get none.
- `curve` wins over `smooth`. `swap` is Beta.
- Exported PNG/SVG use machine fonts, not web fonts.

## Chart in v1 / v2 (Chart.js wrapper)

`wu-chart` · `WuChartModule` / `WuChart` from `@wirabyte/ui/chart` (v1: `standalone: true`, extends the same base as `wu-chartjs`) · exportAs `wuChart`. Same inputs, outputs and methods as ChartJS below, and `@wirabyte/ui/chartjs` must be resolvable; the app installs `chart.js` 3 or 4.

```html
<wu-chart type="bar" [data]="salesData" [options]="options" height="280px" ariaLabel="รายรับและรายจ่ายรายเดือน"></wu-chart>
```
Upgrading to v3 turns this tag into the own chart (accepts the same `[data]`/`[options]` subset); use `<wu-chartjs>` to stay on Chart.js.

---
