# Timeline

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: slot syntax per major.

`wu-timeline` · `WuTimelineModule` (also exports `WuTemplate`) / `WuTimeline` from `@wirabyte/ui/timeline`

Events along a line (order statuses, edit history): marker, content and optional opposite side, vertical or horizontal.

```html
<wu-timeline [value]="orders">
  <ng-template #opposite let-e><small class="text-color-secondary">{{ e.date }}</small></ng-template>
  <ng-template #marker let-e>
    <span class="flex align-items-center justify-content-center w-2rem h-2rem border-circle text-white" [style.background-color]="e.color">
      <i [class]="e.icon"></i>
    </span>
  </ng-template>
  <ng-template #content let-e let-i="index">{{ i + 1 }}. {{ e.status }}</ng-template>
</wu-timeline>
```
```ts
orders = [{ status: 'สั่งซื้อแล้ว', date: '12 มี.ค. 2569 10:30', icon: 'wi wi-shopping-cart', color: '#6366f1' }, /* … */];
```
Variants: `<wu-timeline [value]="orders" align="right">` / `align="alternate"`; horizontal: `<wu-timeline [value]="orders" layout="horizontal" align="top">` (or `"bottom"`).

**Inputs**
- `value`: `unknown[]` = `[]` — the events
- `align`: `'left' | 'right' | 'alternate' | 'top' | 'bottom'` = `'left'` — side of the content (`top`/`bottom` for horizontal)
- `layout`: `'vertical' | 'horizontal'` = `'vertical'`
- `styleClass`, `style`: `string`, `object`

**Slots** — `content`, `opposite`, `marker`: each `$implicit` (event), `index`. Without `opposite` the content takes the whole row (except `alternate`, which always keeps both sides). `marker` replaces the dot.

**Types**
```ts
type WuTimelineAlign = 'left' | 'right' | 'alternate' | 'top' | 'bottom';
type WuTimelineLayout = 'vertical' | 'horizontal';
interface WuTimelineContext { $implicit: unknown; index: number }
```

**Tokens** — `--wu-timeline-event-min-height`, `--wu-timeline-content-padding`, `--wu-timeline-horizontal-padding`, `--wu-timeline-marker-size`, `--wu-timeline-marker-border-width`, `--wu-timeline-marker-border-color`, `--wu-timeline-marker-bg`, `--wu-timeline-connector-size`, `--wu-timeline-connector-color`

**Gotchas**
- The `content` template is what makes it show anything; events are untyped (`unknown`), so type `let-e` yourself.
- Slots: `#content` in v3, `wuTemplate="content"` / `pTemplate` in v1/v2.
- From `<p-timeline>`: `value`, `align`, `layout` and the three templates carry over; `p-timeline-*` classes beside `wu-timeline-*`.
