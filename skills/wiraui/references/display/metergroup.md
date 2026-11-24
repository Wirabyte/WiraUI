# MeterGroup

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: severity values and the style inputs every display component takes.

`wu-metergroup` · `WuMeterGroupModule` / `WuMeterGroup` from `@wirabyte/ui/metergroup`

Several values on one bar with a legend (e.g. storage by type). Without `color` the parts take the theme's primary, info, success, warn, danger, help colours in turn.

```html
<wu-metergroup [value]="storage" ariaLabel="พื้นที่จัดเก็บ"></wu-metergroup>
<wu-metergroup [value]="tickets" [max]="50" [showValue]="true" [clickable]="true"
  ariaLabel="Ticket ตามสถานะ" (onItemClick)="openStatus($event)"></wu-metergroup>
```
```ts
import { WuMeterItem, WuMeterItemClickEvent } from '@wirabyte/ui/metergroup';
storage: WuMeterItem[] = [
  { label: 'รูปภาพ', value: 24 },
  { label: 'วิดีโอ', value: 16, icon: 'wi wi-video' },
];
```

**Inputs** — `value`: `WuMeterItem[]` = `[]` · `min` · `max`: `number` = `0` · `100` — range values are read against (set `max` to capacity/total for real units) · `orientation`: `'horizontal' | 'vertical'` = `'horizontal'` (vertical fills the element height: give it e.g. `style="height: 20rem"`) · `reverse`: `boolean` = `false` — fill from the other end (right to left, or bottom to top); legend order unchanged · `labelPosition`: `'start' | 'end'` = `'end'` — legend before/after bar · `labelOrientation`: `'horizontal' | 'vertical'` = `'horizontal'` · `showValue`: `boolean` = `false` — legend shows raw value too: "Open 12 (24%)" · `clickable`: `boolean` = `false` — legend items are buttons emitting `(onItemClick)` · `ariaLabel`: `string` (role="meter") · `styleClass` · `style`
**Outputs** — `(onItemClick)`: `WuMeterItemClickEvent` `{ originalEvent, item, index }` — legend item pressed (with `clickable`)
**Slots** — `label`: `$implicit` (items), `totalPercent`, `percentages` (whole legend) · `meter`: `$implicit` (item), `index`, `size`, `class`, `orientation` (each part) · `start` / `end`: `$implicit` (items), `totalPercent`, `percentages` (before/after bar) · `icon`: `$implicit` (item), `icon` (legend marker)
**Types**
```ts
interface WuMeterItem { label?: string; value: number; color?: string /* any CSS colour */; icon?: string }
interface WuMeterItemClickEvent { originalEvent: Event; item: WuMeterItem; index: number }
type WuMeterOrientation = 'horizontal' | 'vertical';
type WuMeterLabelPosition = 'start' | 'end';
```
**Tokens** — --wu-metergroup-size, --wu-metergroup-gap, --wu-metergroup-radius, --wu-metergroup-bg
**Gotchas**
- Slots: v3 `<ng-template #label let-value let-percentages="percentages">`; v1/v2 `<ng-template wuTemplate="label" ...>`.
- `icon` on an item replaces the colour dot in the legend.
