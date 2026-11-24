# ProgressBar

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: top-layer rules (no appendTo / z-index) and slot syntax.

`wu-progressbar` · `WuProgressBarModule` / `WuProgressBar` from `@wirabyte/ui/progressbar`

Progress bar, determinate or indeterminate, in percent or as a count against `max`. Set height on the element itself.

```html
<wu-progressbar [value]="64"></wu-progressbar>
<wu-progressbar [value]="1000" [max]="2500" unit="รายการ"></wu-progressbar>
<wu-progressbar mode="indeterminate" style="height: 6px"></wu-progressbar>
<wu-progressbar [value]="60" [animated]="true" [shimmer]="true" color="var(--wu-success-color)" text="กำลังนำเข้า"></wu-progressbar>
<wu-progressbar [value]="50"><ng-template #content let-value>{{ value }}/100</ng-template></wu-progressbar>
```

**Inputs**
- `value`: `number` = `0`; `max`: `number` = `100` (100 = percent)
- `text`: `string` - label instead of the value; `showValue`: `boolean` = `true`
- `unit`: `string` = `'%'` - with a `max` other than 100 it reads `value / max unit`
- `mode`: `'determinate' | 'indeterminate'` = `'determinate'`
- `color`: `string` - bar colour (any CSS colour / `var(--wu-*)`)
- `striped`: `boolean` = `false` - diagonal stripes
- `animated`: `boolean` = `false` - moving stripes (brings its own stripes; still under reduced motion)
- `shimmer`: `boolean` = `false` - glossy bar plus a band of light sweeping about every 2.4 s; works with `color`, stripes and `mode="indeterminate"`; only the gloss under reduced motion
- `ariaLabel`: `string`; `styleClass` · `style`

**Slots** - `content`: context `$implicit` (value; `let-value`), `max`, `percent`.

**Tokens** - `--wu-progressbar-height`, `--wu-progressbar-bg`, `--wu-progressbar-radius`, `--wu-progressbar-label-size`, `--wu-progressbar-label-weight`, `--wu-progressbar-stripe-size`, `--wu-primary-color` (bar), `--wu-primary-contrast` (label on the bar)

**Gotchas**
- `unit` is appended to the value, `text` replaces the whole label.
- Height is on the host: `style="height: 6px"`, not an input.
