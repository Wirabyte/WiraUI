import { buildExcel, EXCEL_MIME, ExcelSheet, excelSheetFromRows, ExcelTableColumn, ExcelTableOptions, ExcelWorkbook } from 'wiratheme/core';

/** `downloadExcel()` options besides the workbook. */
export interface WtExcelDownloadOptions {
  /** File name without `.xlsx`. Default `download`. */
  fileName?: string;
  /** The document to save through (server rendering: nothing is saved). Default the global `document`. */
  document?: Document;
}

/** The workbook (or one sheet) as a Blob, to upload or attach. */
export async function excelBlob(source: ExcelWorkbook | ExcelSheet): Promise<Blob> {
  const bytes = await buildExcel(source);
  return new Blob([bytes as BlobPart], { type: EXCEL_MIME });
}

/**
 * Builds the workbook (or one sheet) and saves it as `<fileName>.xlsx`:
 * `downloadExcel({ rows: [['ชื่อ', 'คะแนน'], ['วิระ', 18]] }, { fileName: 'scores' })`.
 */
export async function downloadExcel(source: ExcelWorkbook | ExcelSheet, options: WtExcelDownloadOptions | string = {}): Promise<void> {
  const o = typeof options === 'string' ? { fileName: options } : options;
  const doc = o.document ?? (typeof document === 'undefined' ? null : document);
  const win = doc?.defaultView;
  if (!doc || !win?.URL?.createObjectURL) return;
  const url = win.URL.createObjectURL(await excelBlob(source));
  const a = doc.createElement('a');
  a.href = url;
  a.download = `${o.fileName || 'download'}.xlsx`;
  a.style.display = 'none';
  doc.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => win.URL.revokeObjectURL(url), 0);
}

/**
 * Rows of objects straight to a styled report file (title, bold header with filters, borders, totals …):
 * `downloadRowsAsExcel(students, [{ field: 'name', header: 'ชื่อ' }, { field: 'score', header: 'คะแนน' }], { title: 'คะแนนสอบ', totals: { score: 'average' } }, 'scores')`.
 */
export function downloadRowsAsExcel<T = unknown>(
  rows: readonly T[],
  columns: readonly ExcelTableColumn[],
  options: ExcelTableOptions<T> & { fontName?: string; fontSize?: number; calendar?: 'gregorian' | 'buddhist' } = {},
  download: WtExcelDownloadOptions | string = {}
): Promise<void> {
  const { fontName, fontSize, calendar, ...sheet } = options;
  return downloadExcel({ sheets: [excelSheetFromRows(rows, columns, sheet)], fontName, fontSize, calendar }, download);
}
