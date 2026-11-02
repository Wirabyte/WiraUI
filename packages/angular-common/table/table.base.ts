import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  AfterViewChecked,
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  TrackByFunction,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵrefreshOnTranslation,
  ɵsize,
  ɵtoBool,
  ɵWU_SKIP_VERSION_CHECK,
  WU_VERSION_INFO,
  WuConfig,
  WuTemplate,
} from 'wiraui/config';
import {
  buildExcel,
  EXCEL_MIME,
  ExcelSheet,
  excelSheetFromRows,
  ExcelTableColumn,
  ExcelValue,
  filterColumns,
  filterGlobal,
  FilterMatchMode,
  FilterMeta,
  FilterRule,
  optionField,
  pageInfo,
  sameValue,
  SortMeta,
  sortRows,
  WuLocale,
} from 'wiraui/core';
import { WuPageEvent } from 'wiraui/paginator';
import {
  WuTableExcelColumn,
  WuTableExcelOptions,
  WuTableExportFunction,
  WuTableExportOptions,
  WuTableFilterEvent,
  WuTableHeaderCheckboxToggleEvent,
  WuTableLazyLoadEvent,
  WuTablePageEvent,
  WuTableColReorderEvent,
  WuTableColResizeEvent,
  WuTableContextMenuSelectEvent,
  WuTableEditEvent,
  WuTableRowExpandEvent,
  WuTableRowGroupMode,
  WuTableRowReorderEvent,
  WuTableSortFunctionEvent,
  WuTableState,
  WuTableRowSelectEvent,
  WuTableSelectionMode,
  WuTableSortEvent,
  WuTableSortMode,
  ɵWuTableApi,
} from './table.types';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const toInt = (v: unknown, fallback: number) => (Number.isFinite(Number(v)) && v !== null && v !== '' ? Math.floor(Number(v)) : fallback);

/**
 * What wu-table does, shared by the v1 and v2/v3 templates (they differ only in control flow and era class names).
 *
 * The data flow is filter (global search, column filters) → sort → page, all in the browser; with `lazy` the table
 * only reports what to load (`onLazyLoad`) and shows `value` as it is. Body rows come from the app's own templates
 * (`body`, `header`, `caption`, `emptymessage` …, as `wuTemplate="body"` / `pTemplate="body"` or `#body`), so any
 * markup and components fit in the cells.
 */
@Directive()
export abstract class ɵWuTableBase implements ɵWuTableApi, AfterContentInit, AfterViewChecked, OnDestroy {
  // ---------- data ----------
  @Input() set value(v: readonly unknown[] | null | undefined) {
    this._valueRef = Array.isArray(v) ? (v as unknown[]) : null;
    this._value = v ? [...v] : [];
    this.process();
  }
  get value(): unknown[] { return this._value; }
  /** Field that identifies a row (`"id"`): selection and row tracking compare by it. */
  @Input() dataKey?: string;
  /** Passed to the header / body templates as `let-columns`. */
  @Input() columns?: unknown[] | null;
  @Input() rowTrackBy?: TrackByFunction<unknown>;

  // ---------- paging ----------
  @Input() set paginator(v: unknown) { this._paginator = ɵtoBool(v); this.process(); }
  get paginator(): boolean { return this._paginator; }
  @Input() set rows(v: unknown) { this._rows = Math.max(1, toInt(v, 10)); this.process(); }
  get rows(): number { return this._rows; }
  /** Index of the first row shown. Two-way: `[(first)]`. */
  @Input() set first(v: unknown) { this._first = Math.max(0, toInt(v, 0)); this.process(); }
  get first(): number { return this._first; }
  @Input() rowsPerPageOptions?: number[] | null;
  @Input() set showCurrentPageReport(v: unknown) { this._showReport = ɵtoBool(v); }
  get showCurrentPageReport(): boolean { return this._showReport; }
  /** Default: the locale's text, `กำลังแสดง {first} ถึง {last} จาก {totalRecords} รายการ`. */
  @Input() currentPageReportTemplate?: string;
  @Input() pageLinks = 5;
  @Input() paginatorPosition: 'top' | 'bottom' | 'both' = 'bottom';
  @Input() set alwaysShowPaginator(v: unknown) { this._alwaysPaginator = v === undefined || ɵtoBool(v); }
  get alwaysShowPaginator(): boolean { return this._alwaysPaginator; }
  @Input() paginatorStyleClass?: string;
  /** Lazy tables: the number of rows on the server. */
  @Input() set totalRecords(v: unknown) { this._totalInput = v === null || v === undefined || v === '' ? null : Math.max(0, toInt(v, 0)); }

  // ---------- lazy loading ----------
  /** The server pages, sorts and filters: the table emits `onLazyLoad` and shows `value` as given. */
  @Input() set lazy(v: unknown) { this._lazy = ɵtoBool(v); this.process(); }
  get lazy(): boolean { return this._lazy; }
  @Input() set lazyLoadOnInit(v: unknown) { this._lazyOnInit = v === undefined || ɵtoBool(v); }
  @Input() set loading(v: unknown) { this._loading = ɵtoBool(v); }
  get loading(): boolean { return this._loading; }
  /** Show the spinner over the table while loading. Default true (a `loadingbody` template replaces it). */
  @Input() set showLoader(v: unknown) { this._showLoader = v === undefined || ɵtoBool(v); }
  get showLoader(): boolean { return this._showLoader; }
  @Input() loadingIcon?: string;

  // ---------- sorting ----------
  @Input() set sortField(v: string | null | undefined) { this._sortField = v || null; this.process(); }
  get sortField(): string | null { return this._sortField; }
  @Input() set sortOrder(v: unknown) { this._sortOrder = toInt(v, 1) < 0 ? -1 : 1; this.process(); }
  get sortOrder(): number { return this._sortOrder; }
  @Input() sortMode: WuTableSortMode = 'single';
  @Input() set multiSortMeta(v: SortMeta[] | null | undefined) { this._multi = v ? [...v] : []; this.process(); }
  get multiSortMeta(): SortMeta[] { return this._multi; }
  /** A third click on a sorted column removes its sort. Default true; `[removableSort]="false"` keeps toggling. */
  @Input() set removableSort(v: unknown) { this._removable = v === undefined || v === null || ɵtoBool(v); }
  @Input() set defaultSortOrder(v: unknown) { this._defaultOrder = toInt(v, 1) < 0 ? -1 : 1; }
  /** Go back to the first page after sorting. Default true. */
  @Input() set resetPageOnSort(v: unknown) { this._resetOnSort = v === undefined || ɵtoBool(v); }

  // ---------- filtering ----------
  /** Fields the global search looks in (dot paths allowed). Default: every top-level field. */
  @Input() globalFilterFields?: string[] | null;
  /** Wait this long after typing before searching, in ms. `0` searches at once. Default: the app's `delays.filter` (0). */
  @Input() set filterDelay(v: unknown) { this._filterDelay = v === null || v === undefined || v === '' ? null : Math.max(0, toInt(v, 0)); }
  get filterDelay(): number { return this._filterDelay ?? this.config.delays.filter; }
  @Input() set filters(v: Record<string, FilterRule> | null | undefined) { this._filters = { ...(v || {}) }; this.process(); }
  get filters(): Record<string, FilterRule> { return this._filters; }

  // ---------- selection ----------
  @Input() selectionMode?: WuTableSelectionMode | null;
  /**
   * Two-way: `[(selection)]`. A row in single mode, an array in multiple mode. Typed `any` so app fields keep their
   * own types (`selected: Student[]`).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() set selection(v: any) { this._selection = v; this.notify(); }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get selection(): any { return this._selection; }
  /** The header checkbox selects only the rows of the current page. */
  @Input() set selectionPageOnly(v: unknown) { this._pageOnly = ɵtoBool(v); }
  /** A wu-contextMenu (anything with `show(event)`) opened by a right-click on a `wuContextMenuRow`. */
  @Input() contextMenu?: { show(event: Event): void } | null;
  /** Two-way: `[(contextMenuSelection)]`, the row last right-clicked (it gets an outline). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() set contextMenuSelection(v: any) { this._ctxSelection = v; this.notify(); }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get contextMenuSelection(): any { return this._ctxSelection; }
  /** `'separate'` (default): kept apart from the selection; `'joint'`: a right-click also selects the row. */
  @Input() contextMenuSelectionMode: 'separate' | 'joint' = 'separate';

  // ---------- look ----------
  @Input() styleClass?: string;
  @Input() style?: Record<string, string | number> | null;
  @Input() tableStyle?: Record<string, string | number> | null;
  @Input() tableStyleClass?: string;
  /** `'small'` / `'large'` (or `sm` / `lg`); the `p-datatable-sm` class works too. */
  @Input() size?: string;
  @Input() set showGridlines(v: unknown) { this._gridlines = ɵtoBool(v); }
  get showGridlines(): boolean { return this._gridlines || /(^|\s)p-datatable-gridlines(\s|$)/.test(this.styleClass || ''); }
  @Input() set stripedRows(v: unknown) { this._striped = ɵtoBool(v); }
  get stripedRows(): boolean { return this._striped || /(^|\s)p-datatable-striped(\s|$)/.test(this.styleClass || ''); }
  @Input() set rowHover(v: unknown) { this._rowHover = ɵtoBool(v); }
  get rowHover(): boolean { return this._rowHover || !!this.selectionMode; }
  /** Fixed-height body that scrolls under a sticky header: `[scrollable]="true" scrollHeight="400px"` (or `"flex"`). */
  @Input() set scrollable(v: unknown) { this._scrollable = ɵtoBool(v); }
  get scrollable(): boolean { return this._scrollable || !!this.scrollHeight; }
  @Input() scrollHeight?: string;
  /** `'scroll'` (default) scrolls sideways on narrow screens; `'stack'` turns each row into a card below `breakpoint`. */
  @Input() responsiveLayout: 'scroll' | 'stack' = 'scroll';
  @Input() set breakpoint(v: string | undefined) { this._breakpoint = v || '960px'; this.watchStack(); }

  // ---------- row expansion ----------
  /** Rows open under their `rowexpansion` template, by `dataKey` value: `{ 7: true }`. Kept up to date in place. */
  @Input() set expandedRowKeys(v: Record<string, boolean> | null | undefined) { this._expandedKeys = v || {}; this.notify(); }
  get expandedRowKeys(): Record<string, boolean> { return this._expandedKeys; }
  /** `'multiple'` (default) keeps every opened row open; `'single'` closes the others. */
  @Input() rowExpandMode: 'multiple' | 'single' = 'multiple';

  // ---------- row groups ----------
  /** `'subheader'`: a `groupheader` (and `groupfooter`) row around each group; `'rowspan'`: `let-rowgroup="rowgroup" let-rowspan="rowspan"`. */
  @Input() rowGroupMode?: WuTableRowGroupMode | null;
  /** Field that groups rows (dot path). Rows of a group must be next to each other (sort by it). */
  @Input() groupRowsBy?: string;

  // ---------- export ----------
  /** File name of `exportCSV()`, without `.csv`. Default `download`. */
  @Input() exportFilename?: string;
  /** Column property used as the CSV header. Default `header`. */
  @Input() exportHeader?: string;
  @Input() csvSeparator = ',';
  @Input() exportFunction?: WuTableExportFunction;

  /** Accepted for templates moving over; they have no effect here. */
  @Input() responsive: unknown;
  @Input() autoLayout: unknown;
  /** Header cells marked `wuResizableColumn` get a grip on their right edge. */
  @Input() set resizableColumns(v: unknown) { this._resizable = ɵtoBool(v); }
  get resizableColumns(): boolean { return this._resizable; }
  /** Header cells marked `wuReorderableColumn` can be dragged sideways; `columns` changes in place. */
  @Input() set reorderableColumns(v: unknown) { this._reorderable = ɵtoBool(v); }
  get reorderableColumns(): boolean { return this._reorderable; }
  /** `'fit'` (default): the next column gives up the width; `'expand'`: the table grows. */
  @Input() columnResizeMode: 'fit' | 'expand' = 'fit';
  @Input() virtualScroll: unknown;
  @Input() virtualScrollItemSize: unknown;
  @Input() paginatorDropdownAppendTo: unknown;
  @Input() frozenColumns: unknown;

  // ---------- selection extras ----------
  /** A click picks only that row and Ctrl / ⌘ + click adds (true), or each click toggles (false, default). Shift + click picks a range. */
  @Input() set metaKeySelection(v: unknown) { this._metaKey = ɵtoBool(v); }
  /** `(e) => boolean`: rows it answers false for cannot be selected. */
  @Input() rowSelectable?: ((e: { data: unknown; index?: number }) => boolean) | null;
  /** `'deepEquals'` (default: same contents count as the same row) or `'equals'` (the same object only), without `dataKey`. */
  @Input() compareSelectionBy: 'deepEquals' | 'equals' = 'deepEquals';

  // ---------- custom sort ----------
  /** The app sorts: `(sortFunction)` gets the rows to sort in place. */
  @Input() set customSort(v: unknown) { this._customSort = ɵtoBool(v); this.process(); }

  // ---------- column resize and reorder ----------

  /**
   * Drag on a header cell's grip. On the first drag every column keeps its current width (fixed layout), so the
   * other columns do not jump.
   */
  startColumnResize(th: HTMLElement, event: PointerEvent): void {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const table = th.closest('table') as HTMLTableElement | null;
    if (!table) return;
    const row = th.parentElement as HTMLTableRowElement;
    if (table.style.tableLayout !== 'fixed') {
      const cells = Array.from(row.children) as HTMLElement[];
      const widths = cells.map((c) => c.getBoundingClientRect().width);
      cells.forEach((c, i) => (c.style.width = `${widths[i]}px`));
      table.style.width = `${widths.reduce((a, b) => a + b, 0)}px`;
      table.style.minWidth = '0';
      table.style.tableLayout = 'fixed';
    }
    const next = th.nextElementSibling as HTMLElement | null;
    const startX = event.clientX;
    const w0 = th.getBoundingClientRect().width;
    const n0 = next ? next.getBoundingClientRect().width : 0;
    const t0 = table.getBoundingClientRect().width;
    const min = 24;
    let delta = 0;
    th.classList.add('wu-column-resizing');
    const move = (e: PointerEvent) => {
      delta = e.clientX - startX;
      if (this.columnResizeMode === 'expand' || !next) {
        delta = Math.max(min - w0, delta);
        th.style.width = `${w0 + delta}px`;
        table.style.width = `${t0 + delta}px`;
      } else {
        delta = Math.max(min - w0, Math.min(n0 - min, delta));
        th.style.width = `${w0 + delta}px`;
        next.style.width = `${n0 - delta}px`;
      }
    };
    const up = () => {
      this.doc.removeEventListener('pointermove', move, true);
      this.doc.removeEventListener('pointerup', up, true);
      this.doc.removeEventListener('pointercancel', up, true);
      th.classList.remove('wu-column-resizing');
      // The click that ends a resize must not sort the column. Chromium sends it to the grip (which ignores it), but
      // Firefox sends it to the header cell when the pointer is let go beside the grip.
      const swallow = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
      };
      th.addEventListener('click', swallow, { capture: true, once: true });
      setTimeout(() => th.removeEventListener('click', swallow, { capture: true }), 0);
      if (delta) this.onColResize.emit({ element: th, delta });
    };
    this.doc.addEventListener('pointermove', move, true);
    this.doc.addEventListener('pointerup', up, true);
    this.doc.addEventListener('pointercancel', up, true);
  }

  /** Drag a header cell sideways to move its column (a line shows where it lands). */
  startColumnDrag(th: HTMLElement, event: PointerEvent): void {
    if (event.button !== 0 || !this._reorderable) return;
    const row = th.parentElement as HTMLElement;
    const startX = event.clientX;
    const startY = event.clientY;
    let dragging = false;
    let target: { index: number; after: boolean } | null = null;
    const cells = () => Array.from(row.children).filter((c) => c.classList.contains('wu-reorderable-column')) as HTMLElement[];
    const dragIndex = cells().indexOf(th);
    const clear = () => row.querySelectorAll('.wu-col-drop-before, .wu-col-drop-after').forEach((c) => c.classList.remove('wu-col-drop-before', 'wu-col-drop-after'));
    // Firefox starts selecting the header's text on the press and then never reports the release, so the drop never
    // comes. Holding back the press's default stops that (the click still follows and still sorts when the pointer
    // did not move); the header is focused by hand, as the press would have done. A native drag or selection that
    // starts anyway is refused while the press lasts.
    event.preventDefault();
    th.focus({ preventScroll: true });
    const noNative = (e: Event) => e.preventDefault();
    this.doc.addEventListener('dragstart', noNative, true);
    this.doc.addEventListener('selectstart', noNative, true);
    const move = (e: PointerEvent) => {
      if (!dragging && Math.hypot(e.clientX - startX, e.clientY - startY) < 6) return;
      if (!dragging) {
        dragging = true;
        th.classList.add('wu-column-dragging');
      }
      e.preventDefault();
      clear();
      target = null;
      cells().forEach((c, i) => {
        const b = c.getBoundingClientRect();
        if (e.clientX >= b.left && e.clientX <= b.right) {
          const after = e.clientX > b.left + b.width / 2;
          target = { index: i, after };
          c.classList.add(after ? 'wu-col-drop-after' : 'wu-col-drop-before');
        }
      });
    };
    const up = () => {
      this.doc.removeEventListener('pointermove', move, true);
      this.doc.removeEventListener('pointerup', up, true);
      this.doc.removeEventListener('pointercancel', up, true);
      this.doc.removeEventListener('dragstart', noNative, true);
      this.doc.removeEventListener('selectstart', noNative, true);
      clear();
      th.classList.remove('wu-column-dragging');
      if (!dragging) return;
      // The click that ends the drag must not sort the column.
      const swallow = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
      };
      th.addEventListener('click', swallow, { capture: true, once: true });
      setTimeout(() => th.removeEventListener('click', swallow, { capture: true }), 0);
      const t = target as { index: number; after: boolean } | null;
      if (!t || dragIndex < 0) return;
      let dropIndex = t.index + (t.after ? 1 : 0);
      if (dropIndex > dragIndex) dropIndex--;
      if (dropIndex === dragIndex) return;
      const cols = this.columns;
      if (Array.isArray(cols) && cols.length > Math.max(dragIndex, dropIndex)) {
        const [moved] = cols.splice(dragIndex, 1);
        cols.splice(dropIndex, 0, moved);
      }
      this.onColReorder.emit({ dragIndex, dropIndex, columns: Array.isArray(cols) ? cols : [] });
      this.notify();
    };
    this.doc.addEventListener('pointermove', move, true);
    this.doc.addEventListener('pointerup', up, true);
    this.doc.addEventListener('pointercancel', up, true);
  }

  // ---------- cell editing ----------

  isCellEditing(cell: HTMLElement): boolean {
    return !!this.editing && this.editing.cell === cell;
  }

  /** Opens a cell's `input` template (`wu-cellEditor`). Another open cell closes first. */
  startCellEdit(cell: HTMLElement, data: unknown, field: string, index: number | undefined, event?: Event): void {
    if (this.editing?.cell === cell) return;
    if (this.editing) this.completeCellEdit(event);
    this.editing = { cell, data, field, index };
    this.onEditInit.emit({ field, data, index, originalEvent: event });
    this.notify();
    this.cdr.detectChanges();
    const focusable = cell.querySelector<HTMLElement>('input, textarea, select, [tabindex]:not([tabindex="-1"]), button');
    focusable?.focus();
    if (focusable instanceof HTMLInputElement) {
      // Select the text once ngModel has written it (a microtask) and the view shows it (the next check); not if the
      // user has already typed.
      let typed = false;
      const onInput = () => (typed = true);
      focusable.addEventListener('input', onInput, { once: true });
      Promise.resolve().then(() =>
        setTimeout(() => {
          focusable.removeEventListener('input', onInput);
          if (!typed && this.editing?.cell === cell && this.doc.activeElement === focusable) focusable.select?.();
        })
      );
    }
    const outside = (e: Event) => {
      const t = e.target as Node | null;
      if (this.editing && t && !this.editing.cell.contains(t)) this.completeCellEdit(e);
    };
    this.stopOutside?.();
    this.doc.addEventListener('pointerdown', outside, true);
    this.stopOutside = () => this.doc.removeEventListener('pointerdown', outside, true);
  }

  /** Keeps the edited value (Enter, Tab, a click elsewhere); with `next`, Tab moves to the next editable cell. */
  completeCellEdit(event?: Event, next?: 1 | -1): void {
    const e = this.editing;
    if (!e) return;
    this.closeCellEditor();
    this.onEditComplete.emit({ field: e.field, data: e.data, index: e.index, originalEvent: event });
    this.notify();
    if (next) {
      const cells = Array.from(this.tableHost.querySelectorAll<HTMLElement>('.wu-editable-column'));
      const at = cells.indexOf(e.cell);
      const target = cells[at + next];
      if (target) target.click();
      else e.cell.focus();
    } else {
      e.cell.focus();
    }
  }

  /** Drops the edit (Escape). The app restores the old value in `(onEditCancel)` if it changed the row on the fly. */
  cancelCellEdit(event?: Event): void {
    const e = this.editing;
    if (!e) return;
    this.closeCellEditor();
    this.onEditCancel.emit({ field: e.field, data: e.data, index: e.index, originalEvent: event });
    this.notify();
    e.cell.focus();
  }

  private closeCellEditor(): void {
    this.stopOutside?.();
    this.stopOutside = null;
    this.editing = null;
  }

  // ---------- row editing ----------

  isRowEditing(row: unknown): boolean {
    const key = this.rowKey(row);
    return key === null ? this.editingRows.has(row) : !!this._editingKeys[key];
  }

  /** The row's cell editors show their `input` templates (`pInitEditableRow`). */
  initRowEdit(row: unknown): void {
    const key = this.rowKey(row);
    if (key === null) this.editingRows.add(row);
    else this._editingKeys[key] = true;
    this.notify();
  }

  /** Back to the `output` templates (`pSaveEditableRow`), unless a field in the row is invalid. */
  saveRowEdit(row: unknown, rowElement?: HTMLElement | null): void {
    if (rowElement && rowElement.querySelector('.ng-invalid:not(form)')) return;
    this.endRowEdit(row);
  }

  /** Back to the `output` templates without keeping anything (`pCancelEditableRow`). */
  cancelRowEdit(row: unknown): void {
    this.endRowEdit(row);
  }

  private endRowEdit(row: unknown): void {
    const key = this.rowKey(row);
    if (key === null) this.editingRows.delete(row);
    else delete this._editingKeys[key];
    this.notify();
  }

  // ---------- state ----------
  /** Keeps paging, sorting, filters, selection and expanded rows under this key, and brings them back next visit. */
  @Input() stateKey?: string | null;
  @Input() stateStorage: 'session' | 'local' = 'session';

  // ---------- editing ----------
  /** `'cell'` (default): a `wuEditableColumn` cell edits on click. `'row'`: rows edit as a whole with the row buttons. */
  @Input() editMode: 'cell' | 'row' = 'cell';
  /** Rows being edited, by `dataKey` value: `{ 7: true }`. Kept up to date in place. */
  @Input() set editingRowKeys(v: Record<string, boolean> | null | undefined) { this._editingKeys = v || {}; this.notify(); }
  get editingRowKeys(): Record<string, boolean> { return this._editingKeys; }

  // ---------- frozen rows ----------
  /** Rows kept at the top of the body (under the header) while the rest scrolls; drawn with `frozenbody` (else `body`). */
  @Input() set frozenValue(v: readonly unknown[] | null | undefined) { this._frozenValue = v ? [...v] : []; this.notify(); }
  get frozenValue(): unknown[] { return this._frozenValue; }

  @Output() readonly onPage = new EventEmitter<WuTablePageEvent>();
  @Output() readonly onSort = new EventEmitter<WuTableSortEvent>();
  @Output() readonly onFilter = new EventEmitter<WuTableFilterEvent>();
  @Output() readonly onLazyLoad = new EventEmitter<WuTableLazyLoadEvent>();
  @Output() readonly onRowSelect = new EventEmitter<WuTableRowSelectEvent>();
  @Output() readonly onRowUnselect = new EventEmitter<WuTableRowSelectEvent>();
  @Output() readonly onHeaderCheckboxToggle = new EventEmitter<WuTableHeaderCheckboxToggleEvent>();
  @Output() readonly onRowExpand = new EventEmitter<WuTableRowExpandEvent>();
  @Output() readonly onRowReorder = new EventEmitter<WuTableRowReorderEvent>();
  @Output() readonly onColResize = new EventEmitter<WuTableColResizeEvent>();
  @Output() readonly onColReorder = new EventEmitter<WuTableColReorderEvent>();
  @Output() readonly onEditInit = new EventEmitter<WuTableEditEvent>();
  @Output() readonly onEditComplete = new EventEmitter<WuTableEditEvent>();
  @Output() readonly onEditCancel = new EventEmitter<WuTableEditEvent>();
  @Output() readonly sortFunction = new EventEmitter<WuTableSortFunctionEvent>();
  @Output() readonly onStateSave = new EventEmitter<WuTableState>();
  @Output() readonly onStateRestore = new EventEmitter<WuTableState>();
  @Output() readonly onRowCollapse = new EventEmitter<WuTableRowExpandEvent>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() readonly selectionChange = new EventEmitter<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() readonly contextMenuSelectionChange = new EventEmitter<any>();
  @Output() readonly onContextMenuSelect = new EventEmitter<WuTableContextMenuSelectEvent>();
  @Output() readonly firstChange = new EventEmitter<number>();
  @Output() readonly rowsChange = new EventEmitter<number>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('caption', { descendants: false }) protected captionRef?: unknown;
  @ContentChild('header', { descendants: false }) protected headerRef?: unknown;
  @ContentChild('body', { descendants: false }) protected bodyRef?: unknown;
  @ContentChild('footer', { descendants: false }) protected footerRef?: unknown;
  @ContentChild('emptymessage', { descendants: false }) protected emptyRef?: unknown;
  @ContentChild('summary', { descendants: false }) protected summaryRef?: unknown;
  @ContentChild('loadingbody', { descendants: false }) protected loadingBodyRef?: unknown;
  @ContentChild('paginatorleft', { descendants: false }) protected paginatorLeftRef?: unknown;
  @ContentChild('paginatorright', { descendants: false }) protected paginatorRightRef?: unknown;
  @ContentChild('colgroup', { descendants: false }) protected colgroupRef?: unknown;
  @ContentChild('rowexpansion', { descendants: false }) protected rowExpansionRef?: unknown;
  @ContentChild('expandedrow', { descendants: false }) protected expandedRowRef?: unknown;
  @ContentChild('frozenbody', { descendants: false }) protected frozenBodyRef?: unknown;
  @ContentChild('groupheader', { descendants: false }) protected groupHeaderRef?: unknown;
  @ContentChild('groupfooter', { descendants: false }) protected groupFooterRef?: unknown;

  /** Rows after filtering and sorting (client-side), and the rows of the current page. */
  processed: unknown[] = [];
  pageRows: unknown[] = [];
  /** Start of the current page in `processed` (client paging) or `first` (lazy). */
  pageFirst = 0;
  stacked = false;
  readonly major: number = WU_VERSION_INFO.major;
  readonly changes = new Subject<void>();
  globalFilter: string | null = null;
  readonly trackRow: TrackByFunction<unknown> = (i, row) =>
    this.rowTrackBy ? this.rowTrackBy(i, row) : this.dataKey && row && typeof row === 'object' ? (row as Record<string, unknown>)[this.dataKey] ?? row : row;

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly doc = inject(DOCUMENT);
  protected readonly config = inject(WuConfig);
  protected readonly tableHost: HTMLElement = inject(ElementRef).nativeElement;
  private readonly i18n = ɵrefreshOnTranslation();
  private _value: unknown[] = [];
  private _paginator = false;
  private _rows = 10;
  private _first = 0;
  private _showReport = false;
  private _alwaysPaginator = true;
  private _totalInput: number | null = null;
  private _lazy = false;
  private _lazyOnInit = true;
  private _loading = false;
  private _showLoader = true;
  private _sortField: string | null = null;
  private _sortOrder = 1;
  private _multi: SortMeta[] = [];
  private _removable = true;
  private _defaultOrder = 1;
  private _resetOnSort = true;
  private _filterDelay: number | null = null;
  private _filters: Record<string, FilterRule> = {};
  private _selection: unknown = null;
  private _pageOnly = false;
  private _ctxSelection: unknown = null;
  private _gridlines = false;
  private _striped = false;
  private _rowHover = false;
  private _scrollable = false;
  private _breakpoint = '960px';
  private _expandedKeys: Record<string, boolean> = {};
  private _valueRef: unknown[] | null = null;
  private _resizable = false;
  private _reorderable = false;
  private _editingKeys: Record<string, boolean> = {};
  private readonly editingRows = new Set<unknown>();
  private editing: { cell: HTMLElement; data: unknown; field: string; index?: number } | null = null;
  private stopOutside: (() => void) | null = null;
  private _metaKey = false;
  private _customSort = false;
  private _frozenValue: unknown[] = [];
  private anchorIndex = -1;
  private restoringState = false;
  /** Expanded rows of a table without `dataKey`. */
  private readonly expandedRows = new Set<unknown>();
  private filterTimer: ReturnType<typeof setTimeout> | null = null;
  private stackQuery: MediaQueryList | null = null;
  private readonly onStackChange = () => {
    this.stacked = !!this.stackQuery?.matches;
    this.cdr.markForCheck();
  };
  private initialized = false;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngAfterContentInit(): void {
    this.restoreState();
    this.initialized = true;
    this.watchStack();
    if (this._lazy && this._lazyOnInit) this.emitLazy();
  }

  /** Frozen rows sit right under the sticky header: their offset follows the header's height. */
  ngAfterViewChecked(): void {
    if (!this._frozenValue.length) return;
    const wrapper = this.tableHost.querySelector('.wu-table-wrapper') as HTMLElement | null;
    const head = wrapper?.querySelector('thead') as HTMLElement | null;
    const h = head ? `${head.offsetHeight}px` : '0px';
    if (wrapper && wrapper.style.getPropertyValue('--_table-head-height') !== h) wrapper.style.setProperty('--_table-head-height', h);
  }

  ngOnDestroy(): void {
    this.stopOutside?.();
    this.i18n.unsubscribe();
    if (this.filterTimer) clearTimeout(this.filterTimer);
    this.stackQuery?.removeEventListener?.('change', this.onStackChange);
  }

  // ---------- what the templates read ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  get sizeKey(): 'sm' | 'lg' | null {
    const s = ɵsize(this.size);
    if (s) return s;
    const c = this.styleClass || '';
    return /(^|\s)p-datatable-sm(\s|$)/.test(c) ? 'sm' : /(^|\s)p-datatable-lg(\s|$)/.test(c) ? 'lg' : null;
  }
  /** Rows on the server (lazy) or after filtering (client). */
  get total(): number {
    return this._lazy ? this._totalInput ?? this._value.length : this.processed.length;
  }
  get hasRows(): boolean {
    return this.pageRows.length > 0;
  }
  get isEmpty(): boolean {
    return !this.pageRows.length;
  }
  get showMask(): boolean {
    return this._loading && this._showLoader && !this.loadingBodyTemplate;
  }
  get showLoadingBody(): boolean {
    return this._loading && !!this.loadingBodyTemplate;
  }
  get showPaginatorTop(): boolean {
    return this._paginator && (this.paginatorPosition === 'top' || this.paginatorPosition === 'both');
  }
  get showPaginatorBottom(): boolean {
    return this._paginator && this.paginatorPosition !== 'top';
  }
  get flexScroll(): boolean {
    return this.scrollHeight === 'flex';
  }
  get wrapperMaxHeight(): string | null {
    return this.scrollHeight && this.scrollHeight !== 'flex' ? this.scrollHeight : null;
  }
  get captionTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.captionRef) || ɵfindTemplate(this.templates, 'caption');
  }
  get headerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.headerRef) || ɵfindTemplate(this.templates, 'header');
  }
  get bodyTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.bodyRef) || ɵfindTemplate(this.templates, 'body');
  }
  get footerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.footerRef) || ɵfindTemplate(this.templates, 'footer');
  }
  get emptyTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.emptyRef) || ɵfindTemplate(this.templates, 'emptymessage');
  }
  get summaryTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.summaryRef) || ɵfindTemplate(this.templates, 'summary');
  }
  get loadingBodyTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.loadingBodyRef) || ɵfindTemplate(this.templates, 'loadingbody');
  }
  get paginatorLeftTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.paginatorLeftRef) || ɵfindTemplate(this.templates, 'paginatorleft');
  }
  get paginatorRightTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.paginatorRightRef) || ɵfindTemplate(this.templates, 'paginatorright');
  }
  get colgroupTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.colgroupRef) || ɵfindTemplate(this.templates, 'colgroup');
  }
  /** `rowexpansion`, or `expandedrow` as later templates call it. */
  get rowExpansionTemplate(): TemplateRef<unknown> | null {
    return (
      asTemplate(this.rowExpansionRef) ||
      asTemplate(this.expandedRowRef) ||
      ɵfindTemplate(this.templates, 'rowexpansion') ||
      ɵfindTemplate(this.templates, 'expandedrow')
    );
  }
  get frozenBodyTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.frozenBodyRef) || ɵfindTemplate(this.templates, 'frozenbody') || this.bodyTemplate;
  }
  /** Context of a frozen row: like the body's, with `frozen: true`. */
  frozenContext(row: unknown, i: number): Record<string, unknown> {
    return { $implicit: row, rowIndex: i, columns: this.columns, editing: false, expanded: false, frozen: true };
  }
  get groupHeaderTemplate(): TemplateRef<unknown> | null {
    return this.rowGroupMode === 'subheader' ? asTemplate(this.groupHeaderRef) || ɵfindTemplate(this.templates, 'groupheader') : null;
  }
  get groupFooterTemplate(): TemplateRef<unknown> | null {
    return this.rowGroupMode === 'subheader' ? asTemplate(this.groupFooterRef) || ɵfindTemplate(this.templates, 'groupfooter') : null;
  }
  /**
   * Context of the body template: `let-row let-i="rowIndex" let-columns="columns" let-expanded="expanded"`; rowIndex
   * counts across pages. In `rowGroupMode="rowspan"`, `rowgroup` is true on a group's first row and `rowspan` its size.
   */
  rowContext(row: unknown, i: number): Record<string, unknown> {
    const spans = this.rowGroupMode === 'rowspan' && !!this.groupRowsBy;
    const first = spans && this.isGroupStart(i);
    return {
      $implicit: row,
      rowIndex: this.pageFirst + i,
      columns: this.columns,
      editing: this.isRowEditing(row),
      expanded: this.isRowExpanded(row),
      rowgroup: first,
      rowspan: first ? this.groupSize(i) : undefined,
    };
  }
  /** The row starts a new group on this page (row groups). */
  isGroupStart(i: number): boolean {
    return i === 0 || !this.sameGroup(this.pageRows[i - 1], this.pageRows[i]);
  }
  /** The row ends its group on this page. */
  isGroupEnd(i: number): boolean {
    return i === this.pageRows.length - 1 || !this.sameGroup(this.pageRows[i], this.pageRows[i + 1]);
  }
  /** Rows in the group starting at `i`, on this page. */
  groupSize(i: number): number {
    let n = 1;
    while (i + n < this.pageRows.length && this.sameGroup(this.pageRows[i], this.pageRows[i + n])) n++;
    return n;
  }
  get columnsContext(): Record<string, unknown> {
    return { $implicit: this.columns, columns: this.columns };
  }

  // ---------- paging ----------

  pageChange(e: WuPageEvent): void {
    const rowsChanged = e.rows !== this._rows;
    this._first = e.first;
    this._rows = e.rows;
    this.process();
    this.firstChange.emit(this._first);
    if (rowsChanged) this.rowsChange.emit(this._rows);
    this.onPage.emit({ first: this._first, rows: this._rows });
    this.saveStateIfKept();
    if (this._lazy) this.emitLazy();
  }

  // ---------- sorting ----------

  sortOrderOf(field: string): number {
    if (this.sortMode === 'multiple') return this._multi.find((m) => m.field === field)?.order ?? 0;
    return this._sortField === field ? this._sortOrder : 0;
  }

  sortIndexOf(field: string): number {
    if (this.sortMode !== 'multiple' || this._multi.length < 2) return 0;
    return this._multi.findIndex((m) => m.field === field) + 1;
  }

  /** A sortable header was clicked. Ctrl / ⌘ adds a level in multiple mode. */
  sortBy(field: string, event: Event): void {
    const add = this.sortMode === 'multiple' && (event as MouseEvent).ctrlKey !== undefined && ((event as MouseEvent).ctrlKey || (event as MouseEvent).metaKey);
    if (this.sortMode === 'multiple') {
      const at = this._multi.findIndex((m) => m.field === field);
      const cur = at >= 0 ? this._multi[at] : null;
      const next = !cur ? this._defaultOrder : cur.order === this._defaultOrder ? -cur.order : this._removable ? 0 : -cur.order;
      const levels = add ? this._multi.filter((m) => m.field !== field) : [];
      if (next) {
        if (add && at >= 0) levels.splice(at, 0, { field, order: next });
        else levels.push({ field, order: next });
      }
      this._multi = levels;
      this.onSort.emit({ multisortmeta: [...this._multi] });
    } else {
      const same = this._sortField === field;
      const next = !same ? this._defaultOrder : this._sortOrder === this._defaultOrder ? -this._sortOrder : this._removable ? 0 : -this._sortOrder;
      this._sortField = next ? field : null;
      this._sortOrder = next || this._defaultOrder;
      this.onSort.emit({ field: this._sortField ?? undefined, order: next || undefined });
    }
    this.saveStateIfKept();
    if (this._resetOnSort && this._first !== 0) {
      this._first = 0;
      this.firstChange.emit(0);
    }
    this.process();
    if (this._lazy) this.emitLazy();
  }

  // ---------- filtering ----------

  /** The search box: `(input)="dt.filterGlobal($any($event.target).value, 'contains')"`. */
  filterGlobal(value: unknown, matchMode: FilterMatchMode = 'contains'): void {
    if (this.filterTimer) clearTimeout(this.filterTimer);
    const run = () => {
      this.filterTimer = null;
      const text = value === null || value === undefined ? '' : String(value);
      this.globalFilter = text.trim() ? text : null;
      this.globalMode = matchMode;
      this.afterFilter();
    };
    if (this.filterDelay) this.filterTimer = setTimeout(run, this.filterDelay);
    else run();
  }

  /** One column: `dt.filter(value, 'grade', 'equals')`. An empty value removes the filter. */
  filter(value: unknown, field: string, matchMode: FilterMatchMode = 'contains'): void {
    const next = { ...this._filters };
    if (value === null || value === undefined || value === '' || (Array.isArray(value) && !value.length)) delete next[field];
    else next[field] = { value, matchMode };
    this._filters = next;
    this.afterFilter();
  }

  /** A column's rules from the filter menu, combined with `operator`; null or no rule with a value removes the filter. */
  filterRules(field: string, rules: FilterMeta[] | null, operator: 'and' | 'or' = 'and'): void {
    const next = { ...this._filters };
    const kept = (rules || []).filter((f) => f.value !== null && f.value !== undefined && f.value !== '');
    if (!kept.length) delete next[field];
    else next[field] = kept.map((f, i) => ({ ...f, operator: i === 0 ? operator : f.operator }));
    this._filters = next;
    this.afterFilter();
  }

  /** Removes search, filters and sorting, and goes to the first page. */
  clear(): void {
    this._sortField = null;
    this._sortOrder = this._defaultOrder;
    this._multi = [];
    this._filters = {};
    this.globalFilter = null;
    this._first = 0;
    this.process();
    this.firstChange.emit(0);
    if (this._lazy) this.emitLazy();
  }

  /** The same as clear(). */
  reset(): void {
    this.clear();
  }

  // ---------- selection ----------

  isSelected(row: unknown): boolean {
    const sel = this._selection;
    if (sel === null || sel === undefined) return false;
    if (Array.isArray(sel)) return sel.some((s) => this.sameRow(s, row));
    return this.sameRow(sel, row);
  }

  /** The row the context menu is open for (or was last opened for). */
  isContextMenuRow(row: unknown): boolean {
    return this._ctxSelection !== null && this._ctxSelection !== undefined && this.sameRow(this._ctxSelection, row);
  }

  /** A right-click on a row: remember it, select it in `joint` mode, and open the context menu at the pointer. */
  rowContextMenu(event: Event, row: unknown, index?: number): void {
    if (!this.contextMenu) return;
    if (this.contextMenuSelectionMode === 'joint' && this.selectionMode && !this.isSelected(row) && this.isRowSelectable(row, index)) {
      this._selection = this.selectionMode === 'multiple' ? [row] : row;
      this.selectionChange.emit(this._selection);
      this.onRowSelect.emit({ originalEvent: event, data: row, index, type: 'row' });
    }
    this._ctxSelection = row;
    this.contextMenuSelectionChange.emit(row);
    this.onContextMenuSelect.emit({ originalEvent: event, data: row, index });
    this.contextMenu.show(event);
    this.notify();
  }

  isRowSelectable(row: unknown, index?: number): boolean {
    return !this.rowSelectable || this.rowSelectable({ data: row, index });
  }

  toggleRow(row: unknown, event: Event, index: number | undefined, type: 'row' | 'checkbox' | 'radio'): void {
    if (!this.isRowSelectable(row, index)) return;
    const multiple = (this.selectionMode === 'multiple' && type !== 'radio') || type === 'checkbox';
    if (!this.selectionMode && type === 'row') return;
    const was = this.isSelected(row);
    const mouse = event as MouseEvent;
    const meta = !!(mouse && (mouse.ctrlKey || mouse.metaKey));
    const pageIndex = index === undefined ? -1 : index - this.pageFirst;
    if (type === 'row' && multiple && mouse && mouse.shiftKey && this.anchorIndex >= 0 && pageIndex >= 0) {
      // Shift + click: every row between the last click and this one.
      const [a, b] = this.anchorIndex < pageIndex ? [this.anchorIndex, pageIndex] : [pageIndex, this.anchorIndex];
      const range = this.pageRows.slice(a, b + 1).filter((r, k) => this.isRowSelectable(r, this.pageFirst + a + k));
      const keep = meta ? (Array.isArray(this._selection) ? (this._selection as unknown[]) : []).filter((s) => !range.some((r) => this.sameRow(s, r))) : [];
      this._selection = [...keep, ...range];
      this.selectionChange.emit(this._selection);
      this.onRowSelect.emit({ originalEvent: event, data: row, index, type });
      this.notify();
      return;
    }
    if (pageIndex >= 0) this.anchorIndex = pageIndex;
    if (type === 'radio') {
      if (was) return;
      this._selection = row;
    } else if (type === 'row' && this._metaKey && !meta) {
      // metaKeySelection: a plain click picks only this row (a second click on it clears it in single mode).
      this._selection = multiple ? (was && Array.isArray(this._selection) && this._selection.length === 1 ? [] : [row]) : was ? null : row;
    } else if (multiple) {
      const list = Array.isArray(this._selection) ? (this._selection as unknown[]) : [];
      this._selection = was ? list.filter((s) => !this.sameRow(s, row)) : [...list, row];
    } else {
      this._selection = was ? null : row;
    }
    const now = this.isSelected(row);
    this.selectionChange.emit(this._selection);
    (now ? this.onRowSelect : this.onRowUnselect).emit({ originalEvent: event, data: row, index, type });
    this.saveStateIfKept();
    this.notify();
  }

  /** Rows the header checkbox acts on: the current page, or every row the search leaves. */
  private get selectableRows(): unknown[] {
    return this._pageOnly || this._lazy ? this.pageRows : this.processed;
  }
  get allSelected(): boolean {
    const rows = this.selectableRows;
    return rows.length > 0 && rows.every((r) => this.isSelected(r));
  }
  get someSelected(): boolean {
    return this.selectableRows.some((r) => this.isSelected(r));
  }

  toggleAll(event: Event): void {
    const rows = this.selectableRows.filter((r) => this.isRowSelectable(r));
    const checked = !this.allSelected;
    const list = Array.isArray(this._selection) ? (this._selection as unknown[]) : [];
    const others = list.filter((s) => !rows.some((r) => this.sameRow(s, r)));
    this._selection = checked ? [...others, ...rows] : others;
    this.selectionChange.emit(this._selection);
    this.onHeaderCheckboxToggle.emit({ originalEvent: event, checked });
    this.notify();
  }

  // ---------- row expansion ----------

  isRowExpanded(row: unknown): boolean {
    const key = this.rowKey(row);
    return key === null ? this.expandedRows.has(row) : !!this._expandedKeys[key];
  }

  /** Opens or closes a row's `rowexpansion` template; the row toggler button calls this. */
  toggleRowExpansion(row: unknown, event?: Event): void {
    const open = !this.isRowExpanded(row);
    const key = this.rowKey(row);
    if (open && this.rowExpandMode === 'single') {
      for (const k of Object.keys(this._expandedKeys)) delete this._expandedKeys[k];
      this.expandedRows.clear();
    }
    if (key === null) {
      if (open) this.expandedRows.add(row);
      else this.expandedRows.delete(row);
    } else if (open) {
      this._expandedKeys[key] = true;
    } else {
      delete this._expandedKeys[key];
    }
    (open ? this.onRowExpand : this.onRowCollapse).emit({ originalEvent: event, data: row });
    this.saveStateIfKept();
    this.notify();
  }

  // ---------- export ----------

  /**
   * Downloads the rows as a CSV file Excel opens with Thai intact (UTF-8 with a byte order mark): the rows the search
   * and sort leave (all of them with `allValues`, the selection with `selectionOnly`), the `columns` given to the
   * table (`field`, `header`, `exportable: false` to skip), or every top-level field when there are none.
   */
  exportCSV(options: WuTableExportOptions = {}): void {
    const csv = this.toCSV(options);
    this.download(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }), `${this.exportFilename || 'download'}.csv`);
  }

  /** The CSV text `exportCSV()` saves (without the byte order mark). */
  toCSV(options: WuTableExportOptions = {}): string {
    const { rows, cols, headerKey } = this.exportSource(options);
    const sep = this.csvSeparator || ',';
    const quote = (v: unknown) => `"${(v === null || v === undefined ? '' : v instanceof Date ? v.toISOString() : String(v)).replace(/"/g, '""')}"`;
    const lines = [cols.map((c) => quote(c[headerKey] ?? c.header ?? c.field)).join(sep)];
    for (const row of rows) {
      lines.push(
        cols
          .map((c) => {
            const raw = optionField(row, c.field!);
            return quote(this.exportFunction ? this.exportFunction({ data: raw, field: c.field! }) : raw);
          })
          .join(sep)
      );
    }
    return lines.join('\r\n');
  }

  /**
   * Downloads the rows as an Excel file (.xlsx), the same rows and columns as `exportCSV()` but with Thai, leading
   * zeros, numbers and dates kept as they are, and styled like a report: a bold header that stays in view with filter
   * buttons, borders, widths from the content, and whatever `options` add (title, colours, totals, merged cells,
   * formulas through `customize`). No library needed.
   */
  async exportExcel(options: WuTableExcelOptions = {}): Promise<void> {
    const bytes = await this.toExcel(options);
    this.download(new Blob([bytes as BlobPart], { type: EXCEL_MIME }),`${options.fileName || this.exportFilename || 'download'}.xlsx`);
  }

  /** The .xlsx file `exportExcel()` saves, e.g. to upload it instead. */
  toExcel(options: WuTableExcelOptions = {}): Promise<Uint8Array> {
    return buildExcel({
      sheets: [this.toExcelSheet(options), ...(options.sheets || [])],
      fontName: options.fontName,
      fontSize: options.fontSize,
      calendar: options.calendar,
      dateFormat: options.dateFormat,
    });
  }

  /** The table as one sheet, to put several tables in one workbook with `buildExcel()` from `wiraui/excel`. */
  toExcelSheet(options: WuTableExcelOptions = {}): ExcelSheet {
    const { rows, cols, headerKey } = this.exportSource(options);
    const columns: ExcelTableColumn[] = cols.map((c) => {
      const col = c as WuTableExcelColumn & Record<string, unknown>;
      const header = col[headerKey] ?? col.header ?? col.field;
      return {
        field: col.field!,
        header: header === null || header === undefined ? '' : String(header),
        width: col.exportWidth,
        format: col.exportFormat,
        style: col.exportStyle,
        total: col.exportTotal,
      };
    });
    const exportFunction = this.exportFunction;
    return excelSheetFromRows(rows, columns, {
      totalLabel: this.t.total,
      ...options,
      value: exportFunction ? (_row, field, raw) => exportFunction({ data: raw, field }) as ExcelValue : undefined,
    });
  }

  /** The rows and columns an export writes (see `exportCSV()`), and the column key that names the header. */
  private exportSource(options: WuTableExportOptions): { rows: unknown[]; cols: { field?: string; header?: unknown; [k: string]: unknown }[]; headerKey: string } {
    const sel = this._selection;
    const rows = options.selectionOnly ? (Array.isArray(sel) ? sel : sel ? [sel] : []) : options.allValues ? this._value : this.processed;
    type Col = { field?: string; header?: unknown; exportable?: boolean; [k: string]: unknown };
    let cols: Col[] = ((this.columns || []) as Col[]).filter((c) => c && typeof c === 'object' && c.field && c.exportable !== false);
    if (!cols.length) {
      const first = rows.find((r) => r && typeof r === 'object') as Record<string, unknown> | undefined;
      cols = first ? Object.keys(first).filter((k) => typeof first[k] !== 'object' || first[k] === null || first[k] instanceof Date).map((k) => ({ field: k, header: k })) : [];
    }
    return { rows, cols, headerKey: this.exportHeader || 'header' };
  }

  /** Saves a blob through a temporary link. */
  private download(blob: Blob, name: string): void {
    const win = this.doc.defaultView as (Window & typeof globalThis) | null;
    if (!win?.URL?.createObjectURL) return;
    const url = win.URL.createObjectURL(blob);
    const a = this.doc.createElement('a');
    a.href = url;
    a.download = name;
    a.style.display = 'none';
    this.doc.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => win.URL.revokeObjectURL(url), 0);
  }

  // ---------- row reorder ----------

  /** Drag from a row's handle (`pReorderableRowHandle`): a line shows where the row lands. */
  startRowDrag(row: HTMLElement, index: number, event: PointerEvent): void {
    if (event.button !== 0) return;
    const tbody = row.parentElement;
    if (!tbody) return;
    event.preventDefault();
    let target: { index: number; below: boolean } | null = null;
    row.classList.add('wu-row-dragging');
    const clear = () => tbody.querySelectorAll('.wu-row-drop-above, .wu-row-drop-below').forEach((el) => el.classList.remove('wu-row-drop-above', 'wu-row-drop-below'));
    const move = (e: PointerEvent) => {
      const rows = Array.from(tbody.querySelectorAll<HTMLElement>(':scope > tr[data-wu-row-index]'));
      clear();
      target = null;
      for (const r of rows) {
        const b = r.getBoundingClientRect();
        if (e.clientY < b.top || e.clientY > b.bottom) continue;
        const below = e.clientY > b.top + b.height / 2;
        target = { index: Number(r.getAttribute('data-wu-row-index')), below };
        r.classList.add(below ? 'wu-row-drop-below' : 'wu-row-drop-above');
        break;
      }
    };
    const end = (drop: boolean) => {
      this.doc.removeEventListener('pointermove', move, true);
      this.doc.removeEventListener('pointerup', onUp, true);
      this.doc.removeEventListener('pointercancel', onCancel, true);
      this.doc.removeEventListener('keydown', onKey, true);
      clear();
      row.classList.remove('wu-row-dragging');
      const t = target;
      if (drop && t) this.reorderRows(index, t.index + (t.below ? 1 : 0));
    };
    const onUp = () => end(true);
    const onCancel = () => end(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') end(false);
    };
    this.doc.addEventListener('pointermove', move, true);
    this.doc.addEventListener('pointerup', onUp, true);
    this.doc.addEventListener('pointercancel', onCancel, true);
    this.doc.addEventListener('keydown', onKey, true);
  }

  /**
   * Moves a row, with the same index rules as before: `droppedRowIndex` is the row dropped on (+1 when dropped on its
   * lower half). `value` is changed in place.
   */
  reorderRows(dragIndex: number, droppedRowIndex: number): void {
    const list = this._valueRef || this._value;
    if (dragIndex < 0 || dragIndex >= list.length || droppedRowIndex < 0) return;
    const dropIndex = dragIndex > droppedRowIndex ? droppedRowIndex : droppedRowIndex === 0 ? 0 : droppedRowIndex - 1;
    if (dropIndex === dragIndex || dropIndex >= list.length) return;
    const [moved] = list.splice(dragIndex, 1);
    list.splice(dropIndex, 0, moved);
    this._value = [...list];
    this.process();
    this.onRowReorder.emit({ dragIndex, dropIndex });
  }

  // ---------- state ----------

  private get storage(): Storage | null {
    try {
      const win = this.doc.defaultView;
      return win ? (this.stateStorage === 'local' ? win.localStorage : win.sessionStorage) : null;
    } catch {
      return null;
    }
  }

  /** Saves paging, sorting, filters, selection and expanded rows under `stateKey`. */
  saveState(): void {
    if (!this.stateKey || this.restoringState) return;
    const state: WuTableState = {
      first: this._first,
      rows: this._rows,
      sortField: this._sortField,
      sortOrder: this._sortOrder,
      multiSortMeta: this._multi.length ? [...this._multi] : undefined,
      filters: Object.keys(this._filters).length ? { ...this._filters } : undefined,
      globalFilter: this.globalFilter,
      selection: this._selection ?? undefined,
      expandedRowKeys: Object.keys(this._expandedKeys).length ? { ...this._expandedKeys } : undefined,
    };
    try {
      this.storage?.setItem(this.stateKey, JSON.stringify(state));
    } catch {
      /* storage full or blocked */
    }
    this.onStateSave.emit(state);
  }

  /** Brings back what `saveState()` kept. Runs on its own when the table starts. */
  restoreState(): void {
    if (!this.stateKey) return;
    let state: WuTableState | null = null;
    try {
      const raw = this.storage?.getItem(this.stateKey);
      state = raw ? (JSON.parse(raw) as WuTableState) : null;
    } catch {
      state = null;
    }
    if (!state) return;
    this.restoringState = true;
    if (typeof state.rows === 'number') this._rows = state.rows;
    if (typeof state.first === 'number') this._first = state.first;
    if (state.sortField !== undefined) this._sortField = state.sortField;
    if (typeof state.sortOrder === 'number') this._sortOrder = state.sortOrder;
    if (state.multiSortMeta) this._multi = state.multiSortMeta;
    if (state.filters) this._filters = state.filters;
    if (state.globalFilter) this.globalFilter = state.globalFilter;
    if (state.selection !== undefined) {
      this._selection = state.selection;
      this.selectionChange.emit(this._selection);
    }
    if (state.expandedRowKeys) Object.assign(this._expandedKeys, state.expandedRowKeys);
    this.process();
    this.restoringState = false;
    this.onStateRestore.emit(state);
  }

  /** Forgets the saved state. */
  clearState(): void {
    if (this.stateKey) this.storage?.removeItem(this.stateKey);
  }

  private saveStateIfKept(): void {
    if (this.stateKey) this.saveState();
  }

  // ---------- internals ----------

  private globalMode: FilterMatchMode = 'contains';

  private rowKey(row: unknown): string | null {
    if (!this.dataKey || row === null || typeof row !== 'object') return null;
    const k = optionField(row, this.dataKey);
    return k === null || k === undefined ? null : String(k);
  }

  private sameGroup(a: unknown, b: unknown): boolean {
    if (!this.groupRowsBy) return true;
    return sameValue(optionField(a, this.groupRowsBy), optionField(b, this.groupRowsBy));
  }

  private sameRow(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (!this.dataKey && this.compareSelectionBy === 'equals') return false;
    return sameValue(a, b, this.dataKey);
  }

  private afterFilter(): void {
    this._first = 0;
    this.process();
    this.firstChange.emit(0);
    this.onFilter.emit({ filters: { ...this._filters }, globalFilter: this.globalFilter, filteredValue: this.processed });
    this.saveStateIfKept();
    if (this._lazy) this.emitLazy();
  }

  /** filter → sort → page. Lazy tables show `value` as the server sent it. */
  private process(): void {
    if (this._lazy) {
      this.processed = this._value;
      this.pageFirst = this._first;
      this.pageRows = this._value;
    } else {
      let rows: unknown[] = this._value;
      if (this.globalFilter) rows = filterGlobal(rows, this.globalFilter, this.globalFilterFields || [], this.globalMode);
      rows = filterColumns(rows, this._filters);
      const meta = this.sortMode === 'multiple' ? this._multi : this._sortField ? [{ field: this._sortField, order: this._sortOrder }] : [];
      if (meta.length && this._customSort) {
        rows = rows.slice();
        this.sortFunction.emit({
          data: rows,
          mode: this.sortMode === 'multiple' ? 'multiple' : 'single',
          field: this._sortField ?? undefined,
          order: this._sortOrder,
          multiSortMeta: this.sortMode === 'multiple' ? [...this._multi] : undefined,
        });
      } else if (meta.length) rows = sortRows(rows, meta);
      this.processed = rows;
      if (this._paginator) {
        const info = pageInfo({ first: this._first, rows: this._rows, totalRecords: rows.length });
        // Rows removed or a search narrowed the list: stay on the last page that exists.
        this._first = info.first;
        this.pageFirst = info.first;
        this.pageRows = rows.slice(info.first, info.last);
      } else {
        this.pageFirst = 0;
        this.pageRows = rows;
      }
    }
    this.notify();
  }

  private emitLazy(): void {
    const page = Math.floor(this._first / Math.max(1, this._rows)) + 1;
    this.onLazyLoad.emit({
      first: this._first,
      rows: this._rows,
      page,
      sortField: this.sortMode === 'single' ? this._sortField : undefined,
      sortOrder: this.sortMode === 'single' ? this._sortOrder : undefined,
      multiSortMeta: this.sortMode === 'multiple' ? [...this._multi] : undefined,
      filters: { ...this._filters },
      globalFilter: this.globalFilter,
    });
  }

  private watchStack(): void {
    if (!this.initialized) return;
    this.stackQuery?.removeEventListener?.('change', this.onStackChange);
    this.stackQuery = null;
    const win = this.doc.defaultView;
    if (this.responsiveLayout === 'stack' && win?.matchMedia) {
      this.stackQuery = win.matchMedia(`(max-width: ${this._breakpoint})`);
      this.stackQuery.addEventListener?.('change', this.onStackChange);
    }
    this.onStackChange();
  }

  private notify(): void {
    this.changes.next();
    this.cdr.markForCheck();
  }
}
