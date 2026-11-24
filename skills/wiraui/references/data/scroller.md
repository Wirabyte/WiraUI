# Scroller

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: slot syntax per major.

`wu-scroller` · `WuScrollerModule` / `WuScroller` from `@wirabyte/ui/scroller`
Also accepted: `wu-virtualScroller`

Virtual scrolling for very long lists (only rows in view are in the DOM). Vertical or horizontal; can load a range at a time.

```html
<wu-scroller [items]="students" [itemSize]="40" scrollHeight="20rem">
  <ng-template #item let-student let-options="options">
    <div class="student-row" [class.student-row-odd]="options.odd">
      <span>{{ options.index + 1 }}</span> <span>{{ student.name }}</span>
    </div>
  </ng-template>
</wu-scroller>
```
Horizontal: `<wu-scroller [items]="days" [itemSize]="110" orientation="horizontal" scrollWidth="100%">` (`itemSize` = cell width).

Lazy range loading (v3 shown; v1/v2 `wuTemplate="item"`, `*ngIf`):
```html
<wu-scroller [items]="lazyStudents" [itemSize]="40" scrollHeight="20rem" [lazy]="true" [delay]="250"
  [loading]="isApiLoading" [showLoader]="true" (onLazyLoad)="loadStudents($event)">
  <ng-template #item let-student let-options="options">
    @if (student) { <span>{{ student.name }}</span> } @else { <wu-skeleton width="10rem"></wu-skeleton> }
  </ng-template>
</wu-scroller>
```
```ts
import { WuScrollerRange } from '@wirabyte/ui/scroller';
lazyStudents: (Student | undefined)[] = Array.from({ length: 1000 });   // total count from API
isApiLoading = false;
loadStudents(range: WuScrollerRange): void {
  this.isApiLoading = true;
  this.studentService.list(range.first, range.last - range.first).subscribe({
    next: (rows) => {
      const next = [...this.lazyStudents];
      next.splice(range.first, rows.length, ...rows);
      this.lazyStudents = next;
      this.isApiLoading = false;
    },
    error: () => (this.isApiLoading = false),
  });
}
```
From code: `<wu-scroller #list ... (onScrollIndexChange)="rowsInView($event)">` then `list.scrollToIndex(499)`.

**Inputs**
- `items`: `any[]` — all rows
- `itemSize`: `number` = `40` — row height (width when horizontal), px
- `scrollHeight`, `scrollWidth`: `string` — box size
- `orientation`: `'vertical' | 'horizontal'` = `'vertical'`
- `numToleratedItems`: `number` — rows drawn beyond each edge (default half a view)
- `appendOnly`: `boolean` = `false` — keep rows once drawn
- `disabled`: `boolean` = `false` — draw every row (no virtualisation); `inline`: `boolean` = `false` — no scrolling box of its own
- `lazy`: `boolean` = `false`, `delay`: `number` = `0` — ask via `onLazyLoad`; wait after scrolling stops
- `loading`, `showLoader`, `loaderDisabled`: `boolean` = `false`
- `showSpacer`: `boolean` = `true` — spacer making the scrollbar as long as all rows
- `trackBy`: `TrackByFunction` · `tabindex`: `number` = `0` · `styleClass`, `style`
- Accepted, no effect: `step`, `resizeDelay`, `autoSize`, `contentStyleClass`

**Outputs** — `(onLazyLoad)`: `WuScrollerRange` (rows needed; `last` excluded) · `(onScrollIndexChange)`: `WuScrollerRange` (rows in view changed) · `(onScroll)`: `WuScrollerScrollEvent`

**Slots** — `item`: `$implicit` (row), `options` (`WuScrollerItemOptions`) · `content`: `$implicit` (rows drawn), `options` (draw the whole visible set yourself) · `loader`: `options` (replaces the spinner)

**Methods** — `scrollToIndex(index, behavior?)` (row to the top) · `scrollTo(options)` (`ScrollToOptions`) · `getRenderedRange()`: `{ first, last, viewport }`

**Types**
```ts
interface WuScrollerItemOptions { index: number; count: number; first: boolean; last: boolean; even: boolean; odd: boolean }
interface WuScrollerRange { first: number; last: number }   // last excluded
interface WuScrollerScrollEvent { originalEvent: Event }
```

**Tokens** — none (rows are your template, styled with your own classes).

**Gotchas**
- Lazy: keep the array at full length; unloaded rows are `undefined`, so the `item` template must handle that (skeleton).
- Set `scrollHeight` (or `scrollWidth` when horizontal); all docs examples do.
- Rows may be taller than `itemSize` (used only to estimate positions).
- From `<p-scroller>`/`<p-virtualScroller>`: names kept, `pTemplate="item"` works.
