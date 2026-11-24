# Table: server-side paging and lazy loading

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

## Server-side paging / lazy loading

```html
<wu-table [value]="students" [lazy]="true" (onLazyLoad)="loadStudents($event)" [paginator]="true" [rows]="10"
  [totalRecords]="totalRecords" [loading]="isApiLoading">
  <ng-template #header><tr><th>ลำดับ</th><th wuSortableColumn="name">ชื่อ <wu-sortIcon field="name"></wu-sortIcon></th></tr></ng-template>
  <ng-template #body let-s let-i="rowIndex"><tr><td>{{ i + 1 }}</td><td>{{ s.name }}</td></tr></ng-template>
</wu-table>
```

```ts
import { WuTableLazyLoadEvent } from '@wirabyte/ui/table';
loadStudents(event: WuTableLazyLoadEvent): void {
  this.isApiLoading = true;
  // event.page is 1-based, matching paging APIs
  this.studentService.getPage({ page: event.page, size: event.rows, sort: event.sortField, order: event.sortOrder })
    .subscribe((res) => { this.students = res.items; this.totalRecords = res.total; this.isApiLoading = false; });
}
```

With `[lazy]="true"` the table neither pages, sorts nor filters itself: it emits `(onLazyLoad)` (`first, rows, page (1-based), sortField, sortOrder, multiSortMeta, filters, globalFilter`) and shows `[value]` (this page's rows). Give `[totalRecords]`; `[lazyLoadOnInit]` (true) controls the first emit; use `[loading]` while waiting.

What emits `(onLazyLoad)` in lazy mode (from `table.base.ts`):
- Paging, sorting, `dt.filterGlobal(...)`, `dt.filter(value, field, matchMode)`, column filters, `dt.clear()` / `dt.reset()`.
- Search and filters always go back to page 1. Sorting does too while `[resetPageOnSort]` is true (the default).
- `dt.filterGlobal()` is debounced by `[filterDelay]` (default 0 = immediate; app-wide default via `provideWiraUI({ delays: { filter } })`).
- Removing a sort (third click, `[removableSort]` default true) sends `sortField: null`, `sortOrder: 1`.
- A filter that lives outside the table (e.g. a province `wu-select` above it) should call `dt.filter(provinceId, 'provinceId', 'equals')`: the value arrives in `event.filters['provinceId'].value`, the page resets and the load fires. An empty value removes it.
- `let-i="rowIndex"` is absolute (`first + i`) in lazy mode too, so `{{ i + 1 }}` numbers rows across pages.
