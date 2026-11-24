# Table: basics

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`wu-table` · `WuTableModule` / `WuTable` from `@wirabyte/ui/table`
Also accepted: `wu-datatable`; `p-table` templates (`pTemplate="body"`), `pSortableColumn`, `pSelectableRow`, `pFrozenColumn`, `pRowToggler`, `pRowGroupHeader`, `pReorderableRow`, `pEditableColumn`, `pEditableRow`, `pResizableColumn`, `pReorderableColumn`, `p-tableRadioButton`, `p-cellEditor`, `p-columnFilter` (use the `wu-` prefix), `pContextMenuRow`, and `p-datatable-*` classes (`p-datatable-sm`, `-gridlines`, `-striped`) in `styleClass`.

Data table with paging, sorting, search and row selection built in. Sorting follows Thai dictionary order; search accepts Thai digits. Rows and cells come from your own `<tr>/<td>` templates, so any component fits in a cell. Standalone: import `WuTable` plus the directives you use (`WuSortableColumn`, `WuSortIcon`, `WuSelectableRow`, `WuTableCheckbox`, `WuTableHeaderCheckbox`, `WuFrozenColumn`, `WuRowToggler`, `WuRowGroupHeader`, `WuColumnFilter`); `WuTableModule` brings all directives and `wuTemplate`.

Slot syntax in every example below: v3 `<ng-template #body let-s>`; v1/v2 `<ng-template wuTemplate="body" let-s>` (and `*ngIf` / `*ngFor` instead of `@if` / `@for`). `pTemplate="body"` also works.

Samples use `interface Student { id: number; code: string; name: string; room: string; score: number; club: { name: string }; status: string; }`.

Row variables in slots (`let-row`) are untyped (`any`). Under `strictTemplates`, an `any` key cannot index a typed `Record`, so read labels through a typed method (`statusText(row)`) instead of `labels[row.status]`.

## Basic

```html
<wu-table [value]="students" [tableStyle]="{ 'min-width': '32rem' }">
  <ng-template #header>
    <tr><th>ลำดับ</th><th>รหัส</th><th>ชื่อ - สกุล</th></tr>
  </ng-template>
  <ng-template #body let-s let-i="rowIndex">
    <tr><td>{{ i + 1 }}</td><td>{{ s.code }}</td><td>{{ s.name }}</td></tr>
  </ng-template>
</wu-table>
```

`[value]` = rows; `header` draws the head; `body` draws each row (`$implicit` = row, `rowIndex` carries on across pages). Look: `[showGridlines]` · `[stripedRows]` (off by default) · `[rowHover]` · `size="small|large"` · `styleClass` / `tableStyleClass`.

## Sorting

```html
<wu-table [value]="students" sortField="score" [sortOrder]="-1">
  <ng-template #header>
    <tr>
      <th wuSortableColumn="name">ชื่อ <wu-sortIcon field="name"></wu-sortIcon></th>
      <th wuSortableColumn="club.name">ชุมนุม <wu-sortIcon field="club.name"></wu-sortIcon></th>
      <th wuSortableColumn="score">คะแนน <wu-sortIcon field="score"></wu-sortIcon></th>
    </tr>
  </ng-template>
  <ng-template #body let-s><tr><td>{{ s.name }}</td><td>{{ s.club.name }}</td><td>{{ s.score }}</td></tr></ng-template>
</wu-table>
```

Click / Enter / Space sorts. Dot paths work. Thai text sorts in Thai dictionary order, numbers inside text sort numerically (ม.1/2 before ม.1/10), empty cells go last. Second click = descending, third click removes the sort (`removableSort` true by default; `[removableSort]="false"` toggles up/down only). Needs: `sortField`/`sortOrder` (start), `defaultSortOrder`, `resetPageOnSort`; output `(onSort)`.

Multi-column: `sortMode="multiple"`; Ctrl (⌘ on Mac) + click adds a column, `<wu-sortIcon>` shows the rank; `[multiSortMeta]` = starting order.

Custom sort order: `[customSort]="true" (sortFunction)="sortStudents($event)"`; the handler sorts `event.data` in place (`WuTableSortFunctionEvent`: `data, mode, field, order, multiSortMeta`).

## Paging (client side)

```html
<wu-table [value]="students" [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5, 10, 20]" [showCurrentPageReport]="true"
  currentPageReportTemplate="หน้า {currentPage} จาก {totalPages} · นักเรียน {totalRecords} คน"> ... </wu-table>
```

Inputs: `paginator`, `rows` (10), `first` (`[(first)]`, 0-based index), `rowsPerPageOptions`, `showCurrentPageReport`, `currentPageReportTemplate`, `pageLinks` (5), `paginatorPosition` (`top|bottom|both`), `alwaysShowPaginator` (true), `paginatorStyleClass`. Output `(onPage)`. Report placeholders (all get thousands separators): `{first}` `{last}` `{rows}` `{totalRecords}` `{currentPage}` (from 1) `{totalPages}`. Default text is localized ("Showing 1 to 5 of 23 entries"); change for the whole app (all tables and paginators) with `WuConfig.setTranslation({ pageReport: '...' })`. Left/right bar slots: templates `paginatorleft` / `paginatorright`.

## Responsive layout

```html
<wu-table [value]="students" responsiveLayout="stack" breakpoint="768px">
  ...
  <ng-template #body let-s><tr><td><span class="p-column-title">ชื่อ - สกุล</span>{{ s.name }}</td></tr></ng-template>
</wu-table>
```

Below `breakpoint` (default `'960px'`) each row becomes a card; `<span class="p-column-title">` is the per-cell label (hidden on wide screens). Default `responsiveLayout="scroll"` scrolls sideways.

## Empty and loading states

```html
<wu-table [value]="students" [loading]="isApiLoading">
  ...
  <ng-template #emptymessage><tr><td colspan="2" class="text-center">ยังไม่มีนักเรียนในห้องนี้</td></tr></ng-template>
  <ng-template #loadingbody>   <!-- optional: skeleton rows instead of the spinner veil -->
    @for (n of [1, 2, 3]; track n) { <tr><td><wu-skeleton></wu-skeleton></td><td><wu-skeleton width="4rem"></wu-skeleton></td></tr> }
  </ng-template>
</wu-table>
```

`emptymessage` draws when there is no data or nothing matches (default "No records found" / Thai text). `[loading]` lays a spinner veil (`showLoader` true, `loadingIcon` to swap the spinner) unless `loadingbody` is given. Keep `colspan` equal to the column count.

## Typical admin list (composition)

Caption holds search (`wu-iconfield` + `dt.filterGlobal`) and an add `wu-button`; header uses `wuSortableColumn`; last cell has round icon buttons (`[rounded]="true" [text]="true" ariaLabel`); status as `wu-tag`; confirm deletes with `await WuAlertService.confirm(title, text)` (returns `true`/`false`, no host element needed; see [overlay/alertdialog.md](../overlay/alertdialog.md)). `ConfirmationService.confirm({ accept })` with one `<wu-confirmdialog>` in the root template works too ([overlay/services.md](../overlay/services.md)); pick one per app; dates via `toLocaleDateString('th-TH', ...)` (Buddhist year) or the `wuDate` pipe. Add `[paginator]="true" [rows]="10" [rowsPerPageOptions]="[10, 20, 50]" [showCurrentPageReport]="true"`, `dataKey="id"`, `[globalFilterFields]`, `[tableStyle]="{ 'min-width': '48rem' }"`.
