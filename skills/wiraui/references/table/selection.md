# Table: selection, row expansion, row groups, context menu

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

## Selection (single, multiple, checkbox, radio)

```html
<!-- single row click -->
<wu-table [value]="students" selectionMode="single" [(selection)]="selectedStudent" dataKey="id">
  ...
  <ng-template #body let-s let-i="rowIndex">
    <tr [wuSelectableRow]="s" [wuSelectableRowIndex]="i"><td>{{ s.name }}</td></tr>
  </ng-template>
</wu-table>

<!-- checkbox column (selection is an array) -->
<wu-table [value]="students" [(selection)]="selectedStudents" dataKey="id">
  <ng-template #header><tr><th style="width: 3rem"><wu-tableHeaderCheckbox></wu-tableHeaderCheckbox></th><th>ชื่อ</th></tr></ng-template>
  <ng-template #body let-s><tr><td><wu-tableCheckbox [value]="s"></wu-tableCheckbox></td><td>{{ s.name }}</td></tr></ng-template>
</wu-table>

<!-- radio, only some rows pickable -->
<wu-table [value]="students" selectionMode="single" [(selection)]="leader" dataKey="id" [rowSelectable]="canPick">
  ... <td><wu-tableRadioButton [value]="s" [index]="i"></wu-tableRadioButton></td>
</wu-table>
```

```ts
selectedStudent: Student | null = null;  selectedStudents: Student[] = [];
canPick = this.isEnrolled.bind(this);   // [rowSelectable] takes the function itself: bind once
isEnrolled(row: { data: unknown; index?: number }): boolean { return (row.data as Student).status === 'กำลังศึกษา'; }
```

Click, Enter, Space select; arrow keys move between rows. `selectionMode="multiple"` + `[metaKeySelection]="true"`: click picks one, Ctrl/⌘+click adds, Shift+click picks a range. The header checkbox selects every row the search leaves; `[selectionPageOnly]="true"` = this page only. `[wuSelectableRowDblClick]="s"` selects on double click. Always set `dataKey` (rows compared by id; otherwise `compareSelectionBy` `'deepEquals'` default or `'equals'`). Outputs `(onRowSelect) (onRowUnselect) (onHeaderCheckboxToggle)`.

## Row expansion

```html
<wu-table [value]="students" dataKey="id" [expandedRowKeys]="expandedRows" rowExpandMode="single"
  (onRowExpand)="rowOpened($event)" (onRowCollapse)="rowClosed($event)">
  <ng-template #header><tr><th style="width: 3.5rem"></th><th>ชื่อ</th></tr></ng-template>
  <ng-template #body let-s let-expanded="expanded">
    <tr>
      <td><button type="button" wuButton [wuRowToggler]="s" [text]="true" [rounded]="true"
        [icon]="expanded ? 'wi wi-chevron-down' : 'wi wi-chevron-right'" [attr.aria-label]="'รายละเอียดของ ' + s.name"></button></td>
      <td>{{ s.name }}</td>
    </tr>
  </ng-template>
  <ng-template #rowexpansion let-s><tr><td colspan="2">ชุมนุม {{ s.club.name || '-' }}</td></tr></ng-template>
</wu-table>
```

```ts
expandedRows: Record<string, boolean> = { 1: true };   // first row starts open (object kept up to date in place)
```

`wuRowToggler` sets `aria-expanded`. Template `expandedrow` is an alias of `rowexpansion`. `toggleRowExpansion(row)` works from code. Events carry `{ originalEvent, data }`.

## Row grouping

```html
<wu-table [value]="studentsByRoom" rowGroupMode="subheader" groupRowsBy="room" [scrollable]="true" scrollHeight="320px">
  <ng-template #header><tr><th>รหัส</th><th>ชื่อ</th></tr></ng-template>
  <ng-template #groupheader let-s><tr wuRowGroupHeader><td colspan="2">ห้อง {{ s.room }}</td></tr></ng-template>
  <ng-template #body let-s><tr><td>{{ s.code }}</td><td>{{ s.name }}</td></tr></ng-template>
  <ng-template #groupfooter let-s><tr class="wu-rowgroup-footer"><td colspan="2" class="text-right">{{ roomCount(s.room) }} คน</td></tr></ng-template>
</wu-table>
```

Rows of one group must sit together: sort the data by the group field first (`[...students].sort((a, b) => a.room.localeCompare(b.room, 'th', { numeric: true }))`). Header row stays under the head when scrolling. Footer row class `wu-rowgroup-footer` (or `p-rowgroup-footer`).

Merged cells: `rowGroupMode="rowspan" groupRowsBy="room"`; in `body` read `let-rowgroup="rowgroup"` (true on the group's first row) and `let-rowspan="rowspan"`:

```html
<ng-template #body let-s let-rowgroup="rowgroup" let-rowspan="rowspan">
  <tr>@if (rowgroup) { <td [attr.rowspan]="rowspan">{{ s.room }}</td> }<td>{{ s.name }}</td></tr>
</ng-template>
```
(v1/v2: `<td *ngIf="rowgroup" [attr.rowspan]="rowspan">`.)

## Context menu

```html
<wu-table [value]="students" dataKey="id" selectionMode="single" [(selection)]="selectedStudent"
  [contextMenu]="studentMenu" [(contextMenuSelection)]="menuStudent" contextMenuSelectionMode="joint">
  ...
  <ng-template #body let-s let-i="rowIndex"><tr [wuSelectableRow]="s" [wuContextMenuRow]="s" [wuContextMenuRowIndex]="i">...</tr></ng-template>
</wu-table>
<wu-contextMenu #studentMenu [model]="studentActions"></wu-contextMenu>
```

```ts
import { WuMenuItem } from '@wirabyte/ui/menu';
menuStudent: Student | null = null;   // row last right-clicked: menu commands read this
studentActions: WuMenuItem[] = [{ label: 'ดูประวัติ', icon: 'wi wi-eye', command: () => this.viewStudent() }, { separator: true }];
```

The `wu-contextMenu` has NO target of its own (`#studentMenu`, passed to `[contextMenu]`). Right-click opens it at the pointer; the clicked row gets an outline. `contextMenuSelectionMode`: `'separate'` (default) or `'joint'` (right-click also selects). `[wuContextMenuRowDisabled]="true"` disables one row. Output `(onContextMenuSelect)` fires before the menu opens.
