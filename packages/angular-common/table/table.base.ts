import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  Directive,
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
  ɵWT_SKIP_VERSION_CHECK,
  WT_VERSION_INFO,
  WtConfig,
  WtTemplate,
} from 'wiratheme/config';
import { filterColumns, filterGlobal, FilterMatchMode, FilterMeta, pageInfo, sameValue, SortMeta, sortRows, WtLocale } from 'wiratheme/core';
import { WtPageEvent } from 'wiratheme/paginator';
import {
  WtTableFilterEvent,
  WtTableHeaderCheckboxToggleEvent,
  WtTableLazyLoadEvent,
  WtTablePageEvent,
  WtTableRowSelectEvent,
  WtTableSelectionMode,
  WtTableSortEvent,
  WtTableSortMode,
  ɵWtTableApi,
} from './table.types';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const toInt = (v: unknown, fallback: number) => (Number.isFinite(Number(v)) && v !== null && v !== '' ? Math.floor(Number(v)) : fallback);

/**
 * What wt-table does, shared by the v1 and v2/v3 templates (they differ only in control flow and era class names).
 *
 * The data flow is filter (global search, column filters) → sort → page, all in the browser; with `lazy` the table
 * only reports what to load (`onLazyLoad`) and shows `value` as it is. Body rows come from the app's own templates
 * (`body`, `header`, `caption`, `emptymessage` …, as `wtTemplate="body"` / `pTemplate="body"` or `#body`), so any
 * markup and components fit in the cells.
 */
@Directive()
export abstract class ɵWtTableBase implements ɵWtTableApi, AfterContentInit, OnDestroy {
  // ---------- data ----------
  @Input() set value(v: readonly unknown[] | null | undefined) { this._value = v ? [...v] : []; this.process(); }
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
  @Input() sortMode: WtTableSortMode = 'single';
  @Input() set multiSortMeta(v: SortMeta[] | null | undefined) { this._multi = v ? [...v] : []; this.process(); }
  get multiSortMeta(): SortMeta[] { return this._multi; }
  /** A third click on a sorted column removes its sort. */
  @Input() set removableSort(v: unknown) { this._removable = ɵtoBool(v); }
  @Input() set defaultSortOrder(v: unknown) { this._defaultOrder = toInt(v, 1) < 0 ? -1 : 1; }
  /** Go back to the first page after sorting. Default true. */
  @Input() set resetPageOnSort(v: unknown) { this._resetOnSort = v === undefined || ɵtoBool(v); }

  // ---------- filtering ----------
  /** Fields the global search looks in (dot paths allowed). Default: every top-level field. */
  @Input() globalFilterFields?: string[] | null;
  /** Wait this long after typing before searching, in ms. Default 300. */
  @Input() set filterDelay(v: unknown) { this._filterDelay = Math.max(0, toInt(v, 300)); }
  @Input() set filters(v: Record<string, FilterMeta> | null | undefined) { this._filters = { ...(v || {}) }; this.process(); }
  get filters(): Record<string, FilterMeta> { return this._filters; }

  // ---------- selection ----------
  @Input() selectionMode?: WtTableSelectionMode | null;
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

  /** Accepted for templates moving over; they have no effect here. */
  @Input() responsive: unknown;
  @Input() autoLayout: unknown;
  @Input() resizableColumns: unknown;
  @Input() reorderableColumns: unknown;
  @Input() columnResizeMode: unknown;
  @Input() virtualScroll: unknown;
  @Input() virtualScrollItemSize: unknown;
  @Input() paginatorDropdownAppendTo: unknown;
  @Input() exportFilename: unknown;
  @Input() exportHeader: unknown;
  @Input() stateStorage: unknown;
  @Input() stateKey: unknown;
  @Input() metaKeySelection: unknown;
  @Input() compareSelectionBy: unknown;
  @Input() customSort: unknown;
  @Input() frozenColumns: unknown;

  @Output() readonly onPage = new EventEmitter<WtTablePageEvent>();
  @Output() readonly onSort = new EventEmitter<WtTableSortEvent>();
  @Output() readonly onFilter = new EventEmitter<WtTableFilterEvent>();
  @Output() readonly onLazyLoad = new EventEmitter<WtTableLazyLoadEvent>();
  @Output() readonly onRowSelect = new EventEmitter<WtTableRowSelectEvent>();
  @Output() readonly onRowUnselect = new EventEmitter<WtTableRowSelectEvent>();
  @Output() readonly onHeaderCheckboxToggle = new EventEmitter<WtTableHeaderCheckboxToggleEvent>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() readonly selectionChange = new EventEmitter<any>();
  @Output() readonly firstChange = new EventEmitter<number>();
  @Output() readonly rowsChange = new EventEmitter<number>();

  @ContentChildren(WtTemplate) protected templates?: QueryList<WtTemplate>;
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

  /** Rows after filtering and sorting (client-side), and the rows of the current page. */
  processed: unknown[] = [];
  pageRows: unknown[] = [];
  /** Start of the current page in `processed` (client paging) or `first` (lazy). */
  pageFirst = 0;
  stacked = false;
  readonly major: number = WT_VERSION_INFO.major;
  readonly changes = new Subject<void>();
  globalFilter: string | null = null;
  readonly trackRow: TrackByFunction<unknown> = (i, row) =>
    this.rowTrackBy ? this.rowTrackBy(i, row) : this.dataKey && row && typeof row === 'object' ? (row as Record<string, unknown>)[this.dataKey] ?? row : row;

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly doc = inject(DOCUMENT);
  protected readonly config = inject(WtConfig);
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
  private _removable = false;
  private _defaultOrder = 1;
  private _resetOnSort = true;
  private _filterDelay = 300;
  private _filters: Record<string, FilterMeta> = {};
  private _selection: unknown = null;
  private _pageOnly = false;
  private _gridlines = false;
  private _striped = false;
  private _rowHover = false;
  private _scrollable = false;
  private _breakpoint = '960px';
  private filterTimer: ReturnType<typeof setTimeout> | null = null;
  private stackQuery: MediaQueryList | null = null;
  private readonly onStackChange = () => {
    this.stacked = !!this.stackQuery?.matches;
    this.cdr.markForCheck();
  };
  private initialized = false;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngAfterContentInit(): void {
    this.initialized = true;
    this.watchStack();
    if (this._lazy && this._lazyOnInit) this.emitLazy();
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    if (this.filterTimer) clearTimeout(this.filterTimer);
    this.stackQuery?.removeEventListener?.('change', this.onStackChange);
  }

  // ---------- what the templates read ----------

  get t(): WtLocale {
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
  /** Context of the body template: `let-row let-i="rowIndex" let-columns="columns"`. rowIndex counts across pages. */
  rowContext(row: unknown, i: number): Record<string, unknown> {
    return { $implicit: row, rowIndex: this.pageFirst + i, columns: this.columns, editing: false, expanded: false, rowgroup: false };
  }
  get columnsContext(): Record<string, unknown> {
    return { $implicit: this.columns, columns: this.columns };
  }

  // ---------- paging ----------

  pageChange(e: WtPageEvent): void {
    const rowsChanged = e.rows !== this._rows;
    this._first = e.first;
    this._rows = e.rows;
    this.process();
    this.firstChange.emit(this._first);
    if (rowsChanged) this.rowsChange.emit(this._rows);
    this.onPage.emit({ first: this._first, rows: this._rows });
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
    if (this._filterDelay) this.filterTimer = setTimeout(run, this._filterDelay);
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

  toggleRow(row: unknown, event: Event, index: number | undefined, type: 'row' | 'checkbox'): void {
    const multiple = this.selectionMode === 'multiple' || type === 'checkbox';
    if (!this.selectionMode && type === 'row') return;
    const was = this.isSelected(row);
    if (multiple) {
      const list = Array.isArray(this._selection) ? (this._selection as unknown[]) : [];
      this._selection = was ? list.filter((s) => !this.sameRow(s, row)) : [...list, row];
    } else {
      this._selection = was ? null : row;
    }
    this.selectionChange.emit(this._selection);
    (was ? this.onRowUnselect : this.onRowSelect).emit({ originalEvent: event, data: row, index, type });
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
    const rows = this.selectableRows;
    const checked = !this.allSelected;
    const list = Array.isArray(this._selection) ? (this._selection as unknown[]) : [];
    const others = list.filter((s) => !rows.some((r) => this.sameRow(s, r)));
    this._selection = checked ? [...others, ...rows] : others;
    this.selectionChange.emit(this._selection);
    this.onHeaderCheckboxToggle.emit({ originalEvent: event, checked });
    this.notify();
  }

  // ---------- internals ----------

  private globalMode: FilterMatchMode = 'contains';

  private sameRow(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    return sameValue(a, b, this.dataKey);
  }

  private afterFilter(): void {
    this._first = 0;
    this.process();
    this.firstChange.emit(0);
    this.onFilter.emit({ filters: { ...this._filters }, globalFilter: this.globalFilter, filteredValue: this.processed });
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
      if (meta.length) rows = sortRows(rows, meta);
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
