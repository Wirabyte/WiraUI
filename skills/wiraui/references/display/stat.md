# Stat

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: severity values and the style inputs every display component takes.

`wu-stat` · `WuStatModule` / `WuStat` from `@wirabyte/ui/stat`

KPI card for dashboards: icon tile, label, big number (thousands separators in the app's language), trend ▲/▼ coloured by good/bad, hint. Can be a button and shimmers while loading. Uses Card tokens.

```html
<wu-stat label="Ticket ที่เปิดอยู่" [value]="12" icon="wi wi-ticket" severity="info"
  [trend]="-8" trendGood="down" trendLabel="จากเดือนก่อน" hint="รอช่างรับงาน 3 รายการ"></wu-stat>
<wu-stat label="รายรับเดือนนี้" [value]="128400" prefix="฿" icon="wi wi-money-bill" severity="success"></wu-stat>
<wu-stat label="รอการอนุมัติ" [value]="5" icon="wi wi-hourglass" severity="warn" [clickable]="true"
  ariaLabel="รอการอนุมัติ 5 รายการ เปิดรายการ" (onClick)="openList('pending')"></wu-stat>
```
Lay several in your own CSS grid (equal width/height per row), e.g. `grid-template-columns: repeat(var(--kpi-columns), minmax(0, 1fr))` with 1/2/4 columns by breakpoint.

**Inputs** — `label`: `string` · `value`: `number | string` — number gets thousands separators via `toLocaleString` (up to 3 decimals, trailing zeros dropped: 2345678.50 shows 2,345,678.5; for fixed decimals pass a string, e.g. `amount | number:'1.2-2'`), string shown as-is, none shows – · `prefix` · `unit`: `string` — small text before/after the figure (฿, คน) · `icon`: `string` — e.g. `'wi wi-ticket'` · `severity`: `WuStatSeverity` = `'primary'` — icon tile colour · `hint`: `string` — muted line under figure · `trend`: `number | string` — number gets sign + `trendSuffix`, string shown as-is · `trendSuffix`: `string` = `'%'` · `trendGood`: `'up' | 'down'` = `'up'` — which direction is green · `trendLabel`: `string` — words after trend ("vs last month") · `clickable`: `boolean` = `false` — whole card is a `<button>` emitting `(onClick)` · `loading`: `boolean` = `false` — shimmer instead of figures (label and icon stay) · `ariaLabel`: `string` (say where a clickable card goes) · `styleClass` · `style`
**Outputs** — `(onClick)`: `MouseEvent` — card pressed (with `clickable`)
**Slots** — content inside the tag goes under the figures and trend (sparkline, progress bar, link).
**Types** — `type WuStatSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast';`
**Tokens** — --wu-stat-gap, --wu-stat-icon-size, --wu-stat-label-size, --wu-stat-value-size, --wu-stat-value-weight, --wu-card-padding, --wu-card-radius, --wu-card-bg, --wu-card-shadow, --wu-card-border-width, --wu-tag-soft-mix, --wu-success-text, --wu-danger-text
**Gotchas**
- For figures that should fall (open tickets, waiting time, costs) use `trendGood="down"` so a drop is green.
- `trend="+0.2"` (string) and `trendSuffix=""` are the ways to avoid the `%`.
- Stat has no `warning`/`error` severity aliases (only the eight values).
