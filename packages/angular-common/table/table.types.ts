import { InjectionToken } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ExcelSheet, ExcelStyle, ExcelTableOptions, ExcelTotal, FilterMatchMode, FilterMeta, FilterRule, SortMeta } from 'wiratheme/core';

export type { FilterMatchMode, FilterMeta, FilterRule, SortMeta };
export type WtTableSelectionMode = 'single' | 'multiple';
export type WtTableSortMode = 'single' | 'multiple';

export interface WtTablePageEvent {
  first: number;
  rows: number;
}

/** `(onSort)`: one field (single mode) or every level (multiple mode). */
export interface WtTableSortEvent {
  field?: string;
  order?: number;
  multisortmeta?: SortMeta[];
}

export interface WtTableFilterEvent {
  filters: Record<string, FilterRule>;
  globalFilter: string | null;
  /** Rows left after filtering (client-side tables). */
  filteredValue: unknown[];
}

/** `(onLazyLoad)`: what to ask the server for. `page` is 1-based for APIs that count pages. */
export interface WtTableLazyLoadEvent {
  first: number;
  rows: number;
  page: number;
  sortField?: string | null;
  sortOrder?: number;
  multiSortMeta?: SortMeta[];
  filters: Record<string, FilterRule>;
  globalFilter: string | null;
}

export interface WtTableRowSelectEvent {
  originalEvent: Event;
  data: unknown;
  index?: number;
  type: 'row' | 'checkbox' | 'radio';
}

export interface WtTableHeaderCheckboxToggleEvent {
  originalEvent: Event;
  checked: boolean;
}

/** `(onRowExpand)` / `(onRowCollapse)`. */
export interface WtTableRowExpandEvent {
  originalEvent?: Event;
  data: unknown;
}

/** `dt.exportCSV({ selectionOnly: true })`: only the selected rows, or (`allValues`) every row whatever the search. */
export interface WtTableExportOptions {
  selectionOnly?: boolean;
  allValues?: boolean;
}

/** `[exportFunction]`: the text a cell exports as. */
export type WtTableExportFunction = (cell: { data: unknown; field: string }) => unknown;

/**
 * `dt.exportExcel({ title: 'รายงาน', totals: { amount: 'sum' } })`: which rows (as for CSV), how the sheet looks
 * (title, header style, stripes, borders, colours per cell or row, totals, frozen header, filter buttons, `customize` for
 * anything else) and the workbook's font and dates. Columns may carry `exportWidth`, `exportFormat`, `exportStyle` and
 * `exportTotal` next to `field` and `header`.
 */
export interface WtTableExcelOptions extends WtTableExportOptions, Omit<ExcelTableOptions, 'value'> {
  /** File name without `.xlsx`. Default `[exportFilename]`, then `download`. */
  fileName?: string;
  /** Font of the workbook, e.g. `'TH Sarabun New'` with `fontSize: 16`. Default Calibri 11. */
  fontName?: string;
  fontSize?: number;
  /** `'buddhist'` shows dates with พ.ศ. years. */
  calendar?: 'gregorian' | 'buddhist';
  /** Number format of dates, e.g. `'d mmm yyyy'`. */
  dateFormat?: string;
  /** More sheets after the table's, e.g. a summary or another table's `toExcelSheet()`. */
  sheets?: ExcelSheet[];
}

/** The export keys a column of `[columns]` may carry for Excel. */
export interface WtTableExcelColumn {
  field?: string;
  header?: unknown;
  exportable?: boolean;
  /** Characters. */
  exportWidth?: number;
  /** Number format: `'#,##0.00'`, `'0%'`, `'dd/mm/yyyy'`. */
  exportFormat?: string;
  exportStyle?: ExcelStyle;
  exportTotal?: ExcelTotal | string | number;
}

export type WtTableRowGroupMode = 'subheader' | 'rowspan';

/** `(onRowReorder)`: the row moved from `dragIndex` to `dropIndex` of `value` (changed in place). */
export interface WtTableRowReorderEvent {
  dragIndex: number;
  dropIndex: number;
}

/** `(sortFunction)` with `[customSort]="true"`: sort `data` in place. */
export interface WtTableSortFunctionEvent {
  data: unknown[];
  mode: 'single' | 'multiple';
  field?: string;
  order?: number;
  multiSortMeta?: SortMeta[];
}

/** `(onColResize)`: the header cell resized and by how many pixels. */
export interface WtTableColResizeEvent {
  element: HTMLElement;
  delta: number;
}

/** `(onColReorder)`: `columns` after the move (changed in place). */
export interface WtTableColReorderEvent {
  dragIndex: number;
  dropIndex: number;
  columns: unknown[];
}

/** `(onContextMenuSelect)`: the row right-clicked. */
export interface WtTableContextMenuSelectEvent {
  originalEvent: Event;
  data: unknown;
  index?: number;
}

/** `(onEditInit)` / `(onEditComplete)` / `(onEditCancel)` of cell editing. */
export interface WtTableEditEvent {
  field: string;
  data: unknown;
  index?: number;
  originalEvent?: Event;
}

/** What `stateKey` keeps between visits. */
export interface WtTableState {
  first?: number;
  rows?: number;
  sortField?: string | null;
  sortOrder?: number;
  multiSortMeta?: SortMeta[];
  filters?: Record<string, FilterRule>;
  globalFilter?: string | null;
  selection?: unknown;
  expandedRowKeys?: Record<string, boolean>;
  columnWidths?: string;
}

/** What the column, row and checkbox directives need from their table. */
export interface ɵWtTableApi {
  readonly major: number;
  readonly changes: Observable<void>;
  sortOrderOf(field: string): number;
  sortIndexOf(field: string): number;
  sortBy(field: string, event: Event): void;
  isSelected(row: unknown): boolean;
  readonly selectionMode?: WtTableSelectionMode | null;
  toggleRow(row: unknown, event: Event, index: number | undefined, type: 'row' | 'checkbox' | 'radio'): void;
  isRowSelectable(row: unknown, index?: number): boolean;
  isContextMenuRow(row: unknown): boolean;
  rowContextMenu(event: Event, row: unknown, index?: number): void;
  readonly editMode: 'cell' | 'row';
  readonly resizableColumns: boolean;
  readonly reorderableColumns: boolean;
  startColumnResize(th: HTMLElement, event: PointerEvent): void;
  startColumnDrag(th: HTMLElement, event: PointerEvent): void;
  isCellEditing(cell: HTMLElement): boolean;
  startCellEdit(cell: HTMLElement, data: unknown, field: string, index: number | undefined, event?: Event): void;
  completeCellEdit(event?: Event, next?: 1 | -1): void;
  cancelCellEdit(event?: Event): void;
  isRowEditing(row: unknown): boolean;
  initRowEdit(row: unknown): void;
  saveRowEdit(row: unknown, rowElement?: HTMLElement | null): void;
  cancelRowEdit(row: unknown): void;
  startRowDrag(row: HTMLElement, index: number, event: PointerEvent): void;
  reorderRows(dragIndex: number, droppedRowIndex: number): void;
  readonly allSelected: boolean;
  readonly someSelected: boolean;
  readonly hasRows: boolean;
  toggleAll(event: Event): void;
  isRowExpanded(row: unknown): boolean;
  toggleRowExpansion(row: unknown, event?: Event): void;
  readonly filters: Record<string, FilterRule>;
  readonly filterDelay: number;
  filter(value: unknown, field: string, matchMode?: FilterMatchMode): void;
  filterRules(field: string, rules: FilterMeta[] | null, operator?: 'and' | 'or'): void;
}

export const ɵWT_TABLE = new InjectionToken<ɵWtTableApi>('WT_TABLE');
