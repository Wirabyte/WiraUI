import { InjectionToken } from '@angular/core';
import type { Observable } from 'rxjs';
import type { FilterMatchMode, FilterMeta, FilterRule, SortMeta } from 'wiratheme/core';

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
