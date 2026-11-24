# Table: frozen columns, scrolling, resize, reorder, saved state

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

## Frozen columns, frozen rows, scrolling

```html
<wu-table [value]="students" [tableStyle]="{ 'min-width': '80rem' }">
  <ng-template #header><tr><th wuFrozenColumn>รหัส</th><th>ห้อง</th><th wuFrozenColumn alignFrozen="right">จัดการ</th></tr></ng-template>
  <ng-template #body let-s><tr><td wuFrozenColumn>{{ s.code }}</td><td>{{ s.room }}</td><td wuFrozenColumn alignFrozen="right">...</td></tr></ng-template>
</wu-table>
```

Put `wuFrozenColumn` on both `th` and `td`; each frozen cell sits after the previous frozen ones; `alignFrozen="right"` pins right; `[frozen]="false"` releases a column. Stack cards (below) freeze nothing.

Vertical scroll: `[scrollable]="true" scrollHeight="240px"` (or `"flex"` to fill a flex parent) keeps the head sticky. `[tableStyle]="{ 'min-width': '50rem' }"` stops column squeeze; narrow screens scroll sideways inside the table.

Frozen rows: `[frozenValue]="totals"` + template `frozenbody` (context has `frozen: true`; falls back to `body`) draws rows pinned under the header while the body scrolls (needs `[scrollable]="true"`).

## Column resize, column reorder, row reorder

```html
<wu-table [value]="students" [columns]="cols" [resizableColumns]="true" columnResizeMode="expand" [reorderableColumns]="true"
  (onColResize)="colResized($event)" (onColReorder)="colMoved($event)">
  <ng-template #header let-columns><tr>@for (col of columns; track col.field) { <th wuResizableColumn wuReorderableColumn>{{ col.header }}</th> }</tr></ng-template>
  <ng-template #body let-s let-columns="columns"><tr>@for (col of columns; track col.field) { <td>{{ s[col.field] }}</td> }</tr></ng-template>
</wu-table>
```

Drag a header's right edge to resize (`columnResizeMode` `'fit'` default keeps table width, `'expand'` grows it); drag a header sideways to move it (the `columns` array is reordered in place). The example binds `[columns]` and loops it in header/body. Directives go on `<th>`.

Row reorder (drag):

```html
<wu-table [value]="students" (onRowReorder)="rowMoved($event)">
  ...
  <ng-template #body let-s let-i="rowIndex"><tr [wuReorderableRow]="i"><td><span class="wi wi-bars" wuReorderableRowHandle></span></td>...</tr></ng-template>
</wu-table>
```
`value` is reordered in place; `(onRowReorder)` gives `{ dragIndex, dropIndex }`. Esc cancels; Up/Down on a focused grip move by keyboard.

## Remembering state (stateKey)

```html
<wu-table #dt [value]="students" stateKey="students-table" stateStorage="session" [paginator]="true" [rows]="5" (onStateRestore)="stateRestored()"> ... </wu-table>
```

Keeps page, page size, sort, filters, search, selection and expanded rows and restores them on return. `stateStorage` `'session'` (default) or `'local'`. Methods `saveState() restoreState() clearState()`; outputs `(onStateSave) (onStateRestore)`.
