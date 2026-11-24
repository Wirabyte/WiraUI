# Paginator

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`wu-paginator` · `WuPaginatorModule` / `WuPaginator` from `@wirabyte/ui/paginator`

Page controls for lists and cards outside a table: page numbers, page-size box, and a "Showing … of …" report in the reader's language (wraps onto lines on phones). `wu-table` already uses it internally; import it yourself only to page something else. It does not slice data: you do that in `(onPageChange)`.

```html
<ul>@for (s of pageItems; track s.id) { <li>{{ s.name }} · {{ s.room }}</li> }</ul>
<wu-paginator [first]="first" [rows]="rows" [totalRecords]="students.length" (onPageChange)="changePage($event)"></wu-paginator>
```

```ts
import { WuPageEvent } from '@wirabyte/ui/paginator';
first = 0; rows = 5; pageItems: Student[] = [];
changePage(event: WuPageEvent): void {
  this.first = event.first; this.rows = event.rows;
  this.pageItems = this.students.slice(event.first, event.first + event.rows);
}
```
(v1/v2 list: `<li *ngFor="let s of pageItems">`.)

Page size + report + custom text:

```html
<wu-paginator [first]="first" [rows]="rows" [totalRecords]="1250" [rowsPerPageOptions]="[10, 20, 50]" [showCurrentPageReport]="true"
  currentPageReportTemplate="หน้า {currentPage} จาก {totalPages} · นักเรียน {totalRecords} คน" (onPageChange)="changePage($event)"></wu-paginator>
```

Left/right slots:

```html
<wu-paginator [first]="first" [rows]="10" [totalRecords]="120" (onPageChange)="changePage($event)">
  <ng-template #start><wu-button icon="wi wi-refresh" [rounded]="true" [text]="true" ariaLabel="โหลดใหม่" (onClick)="reload()"></wu-button></ng-template>
  <ng-template #end let-p><span>หน้า {{ p.page + 1 }} / {{ p.pageCount }}</span></ng-template>
</wu-paginator>
```

**Inputs** — `first`: `number` = `0` — index of this page's first row (0-based) · `rows`: `number` = `10` · `totalRecords`: `number` = `0` · `rowsPerPageOptions`: `number[]` · `showCurrentPageReport`: `boolean` = `false` · `currentPageReportTemplate`: `string` = locale (placeholders `{first} {last} {totalRecords} {currentPage} {totalPages} {rows}`) · `pageLinkSize`: `number` = `5` · `alwaysShow`: `boolean` = `true` (false hides the bar with one page) · `showFirstLastIcon`: `boolean` = `true` · `showPageLinks`: `boolean` = `true` · `styleClass`: `string` · `style`: `object` · `ariaLabel`: `string` (the `<nav>` name). Accepted but ignored: `dropdownAppendTo`, `showJumpToPageDropdown`.
**Outputs** — `(onPageChange)`: `WuPageEvent` — page or page size changed.
**Slots** — `start` / `end` (older `paginatorleft` / `paginatorright` as `wuTemplate` / `pTemplate`); context `$implicit` = `WuPageEvent` (`let-p`). Inside `wu-table` use the table's own `paginatorleft` / `paginatorright`.
**Types** — `interface WuPageEvent { page: number /* from 0 */; first: number; rows: number; pageCount: number }`
**Tokens** — `--wu-paginator-bg`, `--wu-paginator-padding`, `--wu-paginator-gap`, `--wu-paginator-border-width`, `--wu-paginator-btn-size`, `--wu-paginator-btn-radius`, `--wu-paginator-btn-color`, `--wu-paginator-btn-hover-bg`, `--wu-paginator-btn-selected-bg`, `--wu-paginator-btn-selected-color`, `--wu-paginator-report-color`.
**Gotchas**
- Standalone paginator is 0-based (`page`, `first`); table lazy `page` is 1-based.
- Table's `pageLinks` / `alwaysShowPaginator` correspond to the paginator's `pageLinkSize` / `alwaysShow`.
- `{ placeholder }` text: set app-wide with `WuConfig.setTranslation({ pageReport })`.
- Slots: v3 `#start`; v1/v2 `wuTemplate="start"`.
