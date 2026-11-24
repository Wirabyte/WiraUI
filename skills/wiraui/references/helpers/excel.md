# Excel (downloadExcel / buildExcel)

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`downloadExcel() · buildExcel()` · plain functions from `@wirabyte/ui/excel` (no module, no component)

Builds Excel files (.xlsx) from your app's data with no extra library: colours, fonts, borders, number formats, merged cells, formulas, several sheets, frozen rows, filters and print settings. Numbers stay numbers, dates stay dates (Buddhist years if you like) and leading zeros survive. `wu-table` uses it for `exportExcel()`. Call from a component, service or anywhere with a `document` (on the server nothing is saved).

```ts
import { downloadExcel, downloadRowsAsExcel, buildExcel, excelSheetFromRows, ExcelStyle } from '@wirabyte/ui/excel';

download(): void {
  downloadExcel(
    {
      rows: [
        ['รหัส', 'ชื่อ', 'คะแนน', 'วันที่ส่ง'],
        ['0001', 'วิระ ใจดี', 18.5, new Date(2026, 9, 28)],
        ['0002', 'มานี มีนา', 15, new Date(2026, 9, 29)],
      ],
    },
    'scores' // file name without .xlsx
  );
}
```
```html
<wu-button label="ดาวน์โหลด" icon="wi wi-file-excel" (onClick)="download()"></wu-button>
```

Styles, merges, formulas:
```ts
const head: ExcelStyle = { bold: true, color: '#ffffff', fill: '#1d4ed8', align: 'center', border: 'thin' };
const money: ExcelStyle = { format: '#,##0.00', border: 'thin' };
downloadExcel({
  name: 'สไตล์',
  columns: [30, 10, 16],
  rows: [
    [{ value: 'รายการ', style: head }, { value: 'จำนวน', style: head }, { value: 'ราคา', style: head }],
    ['ค่าเทอม', 1, { value: 12500, style: money }],
    [{ value: 'หมายเหตุ: …', colSpan: 3, style: { italic: true, wrap: true } }],
    [{ value: 'เกินกำหนด', style: { bold: true, color: '#b91c1c', fill: '#fee2e2', border: { bottom: { style: 'medium', color: '#b91c1c' } } } }],
    [{ value: 'TH Sarabun New 18', style: { fontName: 'TH Sarabun New', fontSize: 18 } }, { value: 0.075, style: { format: '0.0%' } }, { value: 'ตัวหนังสือเอียง 45°', style: { rotate: 45 } }],
  ],
}, 'styles');

// merge: colSpan / rowSpan like an HTML table
[{ value: 'วัน', rowSpan: 2, style: cell }, { value: 'ช่วงเช้า', colSpan: 2, style: cell }, { value: 'ช่วงบ่าย', style: cell }]

// formulas (Excel calculates when the file opens)
['สมุด', 10, 25, { formula: 'B2*C2', style: money }]
[{ value: 'ยอดรวม', colSpan: 3, style: right }, { formula: 'SUM(D2:D4)', style: money }]
[{ value: 'ตัวอักษร', colSpan: 3, style: right }, { formula: 'BAHTTEXT(D7)' }]
```

A report from objects (what `wu-table` does):
```ts
downloadRowsAsExcel(
  this.fees,
  [
    { field: 'code', header: 'รหัส' },
    { field: 'name', header: 'ชื่อ - สกุล' },
    { field: 'amount', header: 'ค่าบำรุง', format: '#,##0.00' },
    { field: 'paidOn', header: 'วันที่ชำระ' },
  ],
  {
    title: 'รายงานค่าบำรุงการศึกษา',
    subtitle: 'ภาคเรียนที่ 2/2569',
    headerStyle: { fill: '#0f766e', color: '#ffffff' },
    striped: true,
    calendar: 'buddhist',
    totals: { amount: 'sum' },
    totalLabel: 'รวม',
    rowStyle: (fee) => (fee.paidOn ? null : { color: '#b45309', fill: '#fffbeb' }),
  },
  'fees'
);
```

Several sheets, file-wide font, Buddhist years, printing, links:
```ts
downloadExcel({
  fontName: 'TH Sarabun New', fontSize: 16, calendar: 'buddhist',
  sheets: [
    {
      name: 'สรุป', tabColor: '#0f766e', columns: [24, 18],
      rows: [
        [{ value: 'สรุปค่าบำรุง', style: { bold: true, fontSize: 22 } }],
        ['จำนวนนักเรียน', { formula: "COUNTA('รายชื่อ'!B2:B100)" }],
        [{ value: 'ดูรายชื่อ', link: "#'รายชื่อ'!A1" }, { value: 'เว็บไซต์', link: 'https://example.com' }],
      ],
    },
    { ...excelSheetFromRows(this.fees, [ /* columns */ ], { sheetName: 'รายชื่อ' }), landscape: true, fitToWidth: true, paper: 'A4' },
  ],
}, 'workbook');
// several tables in one file: buildExcel({ sheets: [dt1.toExcelSheet(), dt2.toExcelSheet()] })
```

**Functions** — returns
- `downloadExcel(source, fileName | { fileName, document })`: `Promise<void>` — build from an `ExcelWorkbook` or `ExcelSheet` and save
- `downloadRowsAsExcel(rows, columns, options?, fileName?)`: `Promise<void>` — report from an array of objects, saved
- `buildExcel(source)`: `Promise<Uint8Array>` — the .xlsx as bytes (to upload, say)
- `excelBlob(source)`: `Promise<Blob>` — the .xlsx as a Blob
- `excelSheetFromRows(rows, columns, options?)`: `ExcelSheet` — a report sheet from an array of objects
- `excelColumnName(i)` (0 → A) · `excelRef(row, col)` (0, 0 → A1): `string`
- `mergeExcelStyles(...styles)`: `ExcelStyle` — later ones win, borders merged side by side

**ExcelWorkbook**: `sheets`: `ExcelSheet[]` · `fontName`: `string` = `'Calibri'` · `fontSize`: `number` = `11` · `calendar`: `'gregorian' | 'buddhist'` = `'gregorian'` (years of the default date formats) · `dateFormat`: `string` = `'dd/mm/yyyy'` · `dateTimeFormat`: `string` = `'dd/mm/yyyy hh:mm'`

**ExcelSheet**
- `rows`: `(ExcelCellInput[] | { cells, height, style, hidden })[]` — rows from A1 down (height in points)
- `name`: `string` = `'Sheet1'` (made valid for you) · `tabColor`: `string`
- `columns`: `(number | { width, style, hidden })[]` — width in characters, style per column
- `autoWidth`: `boolean` = `true` — columns without a width fit their content (Thai vowel and tone marks take no room)
- `merges`: `string[]` — e.g. `['A1:D1']`
- `freeze`: `string` — first cell that scrolls: `'A2'` freezes row 1, `'B2'` row 1 and column A
- `autoFilter`: `string` — filter buttons on a range, e.g. `'A1:F20'`
- `gridLines`: `boolean` = `true`
- `landscape`: `boolean` · `fitToWidth`: `boolean` · `paper`: `'A4' | 'A3' | 'A5' | 'letter' | 'legal'` · `repeatRows`: `string` (`'1:1'`, header on every page)

**ExcelCell** (or a bare `string | number | boolean | Date | null`): `value` (next to a formula: shown before it calculates) · `formula`: `string` (with or without `=`) · `style`: `ExcelStyle` (on top of column's and row's) · `colSpan` / `rowSpan`: `number` = `1` · `link`: `string` (URL, or `"#'Sheet'!A1"`)

**ExcelStyle** (flat object): `bold` `italic` `underline` `strike`: `boolean` = `false` · `color` (text) `fill` (background): `#rgb` / `#rrggbb` · `fontName` · `fontSize` (points) · `border`: `'thin' | { style, color } | { top, right, bottom, left }` (thin medium thick dashed dotted double hair …) · `align`: `'left' | 'center' | 'right' | …` · `valign`: `'top' | 'middle' | 'bottom'` · `wrap` `shrink`: `boolean` · `indent`: `number` · `rotate`: `number` (-90 … 90) · `format`: Excel number format (`'#,##0.00'`, `'0%'`, `'dd/mm/yyyy'`, `'@'` text)

**Report options** (`excelSheetFromRows` / `downloadRowsAsExcel`)
- `columns[]`: `{ field, header, width, format, style, total }` — `field` may be a dot path; `total` is sum average count min max, or a value / cell
- `title` · `subtitle`: `string | ExcelCell` — lines above the table, merged across it
- `headerStyle` · `bodyStyle` · `totalStyle`: `ExcelStyle`
- `striped`: `boolean` = `false` · `borders`: `boolean | string` = `true` (a string picks the colour)
- `cellStyle`: `(cell) => ExcelStyle` · `rowStyle`: `(row, index) => ExcelStyle`
- `totals`: `Record<field, 'sum' | …>` · `totalLabel`: `string` = `'Total'` — SUBTOTAL formulas that follow the filter
- `freezeHeader` · `autoFilter`: `boolean` = `true`
- `value`: `(row, field, raw) => ExcelValue` — the value each cell exports
- `customize`: `(sheet, at) => void` — change the sheet before build; `at = { headerRow, firstRow, lastRow, totalRow, column(field) }`
- `sheetName` is used in the workbook example above.

**Tokens** — none: colours and fonts come from the `style` you pass.

**Gotchas**
- Text always stays text: `0001` does not become 1, and text starting with `=` never becomes a formula. Use `{ formula }` for formulas.
- `calendar: 'buddhist'` only changes display; values stay real dates.
- Writes only. To read uploaded Excel files, or for pictures, Excel charts, conditional formatting or data validation, use SheetJS / ExcelJS alongside.
- Files are compressed with the browser's `CompressionStream`; older browsers get an uncompressed file that opens the same.
- Sheet names with Thai in formulas need quotes: `'รายชื่อ'!D2:D100`.
