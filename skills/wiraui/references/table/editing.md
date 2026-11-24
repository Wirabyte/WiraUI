# Table: cell and row editing

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

## Cell editing and row editing

```html
<!-- cell mode (default editMode="cell") -->
<wu-table [value]="students" dataKey="id" (onEditComplete)="cellSaved($event)">
  ...
  <ng-template #body let-s let-i="rowIndex">
    <tr>
      <td [wuEditableColumn]="s" wuEditableColumnField="score" [wuEditableColumnRowIndex]="i">
        <wu-cellEditor>
          <ng-template #input><wu-inputnumber name="score" [(ngModel)]="s.score" [min]="0" [max]="100"></wu-inputnumber></ng-template>
          <ng-template #output>{{ s.score }}</ng-template>
        </wu-cellEditor>
      </td>
    </tr>
  </ng-template>
</wu-table>
```

Click or Enter/F2 starts editing; Enter or click-away keeps; Tab moves to the next editable cell; Esc leaves. Outputs `(onEditInit) (onEditComplete) (onEditCancel)` give `{ field, data, index, originalEvent }`. Edits write into the row via `[(ngModel)]`.

```html
<!-- row mode -->
<wu-table [value]="students" dataKey="id" editMode="row" [editingRowKeys]="editingRows">
  ...
  <ng-template #body let-s let-editing="editing">
    <tr [wuEditableRow]="s">
      <td><wu-cellEditor>
        <ng-template #input><input wuInputText name="name" [(ngModel)]="s.name" required /></ng-template>
        <ng-template #output>{{ s.name }}</ng-template>
      </wu-cellEditor></td>
      <td>
        @if (!editing) {
          <button type="button" wuButton wuInitEditableRow icon="wi wi-pencil" [text]="true" [rounded]="true" aria-label="แก้ไข" (click)="startEdit(s)"></button>
        } @else {
          <button type="button" wuButton wuSaveEditableRow icon="wi wi-check" [text]="true" [rounded]="true" aria-label="บันทึก" (click)="saveRow(s)"></button>
          <button type="button" wuButton wuCancelEditableRow icon="wi wi-times" severity="secondary" [text]="true" [rounded]="true" aria-label="ยกเลิก" (click)="cancelRow(s)"></button>
        }
      </td>
    </tr>
  </ng-template>
</wu-table>
```

Save stays in edit mode while a field is `ng-invalid`. Cancel does NOT restore values for you: keep a clone in `startEdit` and `Object.assign` it back in `cancelRow` (the doc example). `initRowEdit(row) / saveRowEdit(row, rowElement?) / cancelRowEdit(row)` work from code. v1/v2: `*ngIf="!editing"` / `*ngIf="editing"` on the buttons.
