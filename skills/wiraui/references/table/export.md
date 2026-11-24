# Table: export to CSV and Excel

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

## Export CSV and Excel

```html
<wu-table #dt [value]="students" [columns]="exportColumns" [(selection)]="pickedStudents" dataKey="id" exportFilename="students" [exportFunction]="exportCell">
  <ng-template #caption>
    <wu-button label="ส่งออก CSV" icon="wi wi-download" (onClick)="dt.exportCSV()"></wu-button>
    <wu-button label="ส่งออกที่เลือก" [disabled]="!pickedStudents.length" (onClick)="dt.exportCSV({ selectionOnly: true })"></wu-button>
    <wu-button label="ส่งออก Excel" icon="wi wi-file-excel" (onClick)="dt.exportExcel()"></wu-button>
  </ng-template>
  ...
</wu-table>
```

```ts
exportColumns = [
  { field: 'code', header: 'รหัส' }, { field: 'score', header: 'คะแนน', exportFormat: '0.00' },
  { field: 'id', header: 'id', exportable: false },   // left out of the file
];
exportCell = this.formatCell.bind(this);              // bind once
formatCell(cell: { data: unknown; field: string }): string { return cell.field === 'score' ? Number(cell.data).toFixed(2) : String(cell.data ?? ''); }
```

CSV: `dt.exportCSV(options?)` downloads the rows the search/sort leave; `{ selectionOnly: true }` = selected only; `{ allValues: true }` = every row ignoring search. Columns from `[columns]` (`{ field, header, exportable }`) or every top-level field when absent. File: `exportFilename` (no `.csv`, default `download`), `exportHeader` (column property used as header, default `header`), `csvSeparator` (`,`), `[exportFunction]`. UTF-8 with BOM, so Excel shows Thai. `dt.toCSV()` returns the text.

Excel: `dt.exportExcel(options?)` downloads a real .xlsx, no extra library. Rows/columns chosen as for CSV; numbers stay numbers, dates stay dates, leading zeros survive. Defaults: bold shaded header, frozen header, filter buttons, borders, auto width, header repeated on every printed page. Options (`WuTableExcelOptions` from `@wirabyte/ui/table`): `fileName`, `title`, `subtitle`, `headerStyle`, `striped`, `borders`, `cellStyle` / `rowStyle` (conditional style), `totals` (SUBTOTAL formulas following the filter: `sum average count min max`), `totalLabel`, `fontName`, `fontSize`, `calendar: 'buddhist'`, `customize(sheet, at)` (add rows, merge via `colSpan`/`rowSpan`, own formulas; `at.column('score')` = column letter, `at.firstRow`, `at.lastRow`). Style = flat object `{ bold, italic, color, fill, fontName, fontSize, border, align, valign, wrap, format }`. Column extras: `exportFormat` (`'#,##0.00'`, `'0%'`, `'dd/mm/yyyy'`), `exportWidth` (characters), `exportStyle`, `exportTotal`. `dt.toExcel()` returns bytes (to upload); `dt.toExcelSheet()` returns a sheet to combine tables in `buildExcel()` (see [helpers/excel.md](../helpers/excel.md)).

Excel gotchas: `calendar: 'buddhist'` only changes the *default* date formats, so leave `exportFormat` off date columns (an explicit `'dd/mm/yyyy'` exports Gregorian years; for an own B.E. format write `'[$-th-TH,107]dd/mm/yyyy'`). `[exportFunction]` applies to `exportExcel()` as well as CSV: codes come out as the labels it returns.

```ts
report: WuTableExcelOptions = {
  fileName: 'score-report', title: 'รายงานคะแนนสอบ', subtitle: 'ภาคเรียนที่ 2/2569',
  headerStyle: { fill: '#0f766e', color: '#ffffff', align: 'center' }, striped: true, calendar: 'buddhist',
  totals: { score: 'average' }, totalLabel: 'ค่าเฉลี่ย',
  cellStyle: ({ field, value }) => (field === 'score' && Number(value) < 70 ? { color: '#dc2626', bold: true } : null),
  customize: (sheet, at) => {
    const score = at.column('score');
    sheet.rows.push([], [{ value: 'ผ่าน (70 ขึ้นไป)', colSpan: 4, style: { align: 'right' } },
      { formula: `COUNTIF(${score}${at.firstRow}:${score}${at.lastRow},">=70")` }]);
  },
};   // <wu-button (onClick)="dt.exportExcel(report)">
```
