# Table: API reference

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

**Inputs, data and paging** — `value`: `unknown[]` = `[]` (lazy: this page's rows) · `dataKey`: `string` — row identity for selection/tracking · `columns`: `unknown[]` — passed to templates as `let-columns`, and the export columns (`{ field, header, exportable }`) · `rowTrackBy`: `TrackByFunction` (defaults to dataKey) · `paginator`: `boolean` = `false` · `rows`: `number` = `10` (`[(rows)]`) · `first`: `number` = `0` (`[(first)]`) · `rowsPerPageOptions`: `number[]` · `showCurrentPageReport`: `boolean` = `false` · `currentPageReportTemplate`: `string` = locale · `pageLinks`: `number` = `5` · `paginatorPosition`: `'top'|'bottom'|'both'` = `'bottom'` · `alwaysShowPaginator`: `boolean` = `true` · `paginatorStyleClass`: `string` · `lazy`: `boolean` = `false` · `lazyLoadOnInit`: `boolean` = `true` · `totalRecords`: `number` · `loading`: `boolean` = `false` · `showLoader`: `boolean` = `true` · `loadingIcon`: `string`.

**Inputs, sort and search** — `sortField`: `string` · `sortOrder`: `1|-1` = `1` · `sortMode`: `'single'|'multiple'` = `'single'` · `multiSortMeta`: `SortMeta[]` = `[]` · `removableSort`: `boolean` = `true` · `defaultSortOrder`: `1|-1` = `1` · `resetPageOnSort`: `boolean` = `true` · `globalFilterFields`: `string[]` = every top-level field · `filterDelay`: `number` = `0` ms (app default `provideWiraUI({ delays: { filter } })`) · `filters`: `Record<string, FilterMeta>` = `{}` · `customSort`: `boolean` = `false`.

**Inputs, selection** — `selectionMode`: `'single'|'multiple'` · `selection`: `any` = `null` (`[(selection)]`) · `selectionPageOnly`: `boolean` = `false` · `metaKeySelection`: `boolean` = `false` · `rowSelectable`: `(row: { data, index }) => boolean` · `compareSelectionBy`: `'deepEquals'|'equals'` = `'deepEquals'` · `contextMenu`: `wu-contextMenu` · `contextMenuSelection`: `any` (`[(contextMenuSelection)]`) · `contextMenuSelectionMode`: `'separate'|'joint'` = `'separate'`.

**Inputs, look** — `size`: `'small'|'large'|'sm'|'lg'` · `showGridlines`, `stripedRows`, `rowHover`: `boolean` = `false` · `scrollable`: `boolean` = `false` · `scrollHeight`: `string|'flex'` · `responsiveLayout`: `'scroll'|'stack'` = `'scroll'` · `breakpoint`: `string` = `'960px'` · `styleClass`, `style`, `tableStyle`, `tableStyleClass`.

**Inputs, expansion / groups / export / edit / columns / state** — `expandedRowKeys`: `Record<string, boolean>` = `{}` · `rowExpandMode`: `'multiple'|'single'` = `'multiple'` · `rowGroupMode`: `'subheader'|'rowspan'` · `groupRowsBy`: `string` · `exportFilename`: `string` = `'download'` · `exportHeader`: `string` = `'header'` · `csvSeparator`: `string` = `','` · `exportFunction`: `(cell: { data, field }) => unknown` · `columns[].exportFormat|exportWidth|exportStyle|exportTotal` · `editMode`: `'cell'|'row'` = `'cell'` · `editingRowKeys`: `Record<string, boolean>` = `{}` · `resizableColumns`: `boolean` = `false` · `columnResizeMode`: `'fit'|'expand'` = `'fit'` · `reorderableColumns`: `boolean` = `false` · `stateKey`: `string` · `stateStorage`: `'session'|'local'` = `'session'` · `frozenValue`: `unknown[]`.

**Accepted but ignored** — `responsive`, `autoLayout`, `virtualScroll`, `virtualScrollItemSize`, `paginatorDropdownAppendTo`, `frozenColumns`.

**Outputs** — `(onPage)`: `WuTablePageEvent` · `(onSort)`: `WuTableSortEvent` · `(onFilter)`: `WuTableFilterEvent` · `(onLazyLoad)`: `WuTableLazyLoadEvent` · `(onRowSelect)` / `(onRowUnselect)`: `WuTableRowSelectEvent` · `(onContextMenuSelect)`: `WuTableContextMenuSelectEvent` · `(contextMenuSelectionChange)`: `any` · `(onHeaderCheckboxToggle)`: `WuTableHeaderCheckboxToggleEvent` · `(onRowExpand)` / `(onRowCollapse)`: `WuTableRowExpandEvent` · `(onRowReorder)`: `WuTableRowReorderEvent` · `(onEditInit)` / `(onEditComplete)` / `(onEditCancel)`: `WuTableEditEvent` · `(onColResize)`: `WuTableColResizeEvent` · `(onColReorder)`: `WuTableColReorderEvent` · `(sortFunction)`: `WuTableSortFunctionEvent` (customSort) · `(onStateSave)` / `(onStateRestore)`: `WuTableState` · `(selectionChange)` `(firstChange)` `(rowsChange)` = the two-way pairs.

**Slots (templates)** — write as `#name` (v3) / `wuTemplate="name"` / `pTemplate="name"`:
`body` (`$implicit` row, `rowIndex`, `columns`, `expanded`, `rowgroup`/`rowspan` in rowspan mode, `editing` in row-edit mode) · `rowexpansion` / `expandedrow` (`$implicit`, `rowIndex`, `expanded`) · `groupheader`, `groupfooter` (`$implicit`, `rowIndex`) · `frozenbody` (`$implicit`, `rowIndex`, `frozen: true`) · `header`, `footer`, `colgroup` (`$implicit` = columns, `columns`) · `caption`, `summary` (no context; bars above/below) · `emptymessage` (`$implicit` columns) · `loadingbody` (`$implicit` columns) · `paginatorleft`, `paginatorright` (`$implicit` `WuPageEvent`). Inside `wu-columnFilter`: `filter` (`let-value let-filter="filterCallback"`; context also `field`, `type`). Inside `wu-cellEditor`: `input`, `output`.

**Directives / components**
- `[wuSortableColumn]="field"` (+ `…Disabled`) · `wu-sortIcon` (`field`)
- `[wuSelectableRow]="row"` (+ `…Index`, `…Disabled`) · `[wuSelectableRowDblClick]="row"` (+ `…Index`)
- `[wuContextMenuRow]="row"` (+ `…Index`, `…Disabled`)
- `wu-tableCheckbox` (`value, index, disabled, ariaLabel`) · `wu-tableHeaderCheckbox` (`disabled, ariaLabel`) · `wu-tableRadioButton` (`value, index, disabled, ariaLabel`)
- `[wuFrozenColumn]` (`frozen`, `alignFrozen`)
- `[wuRowToggler]="row"` (+ `…Disabled`) · `[wuRowGroupHeader]`
- `wu-columnFilter` (see above) with `display="menu"` extras
- `[wuReorderableRow]="index"` / `[wuReorderableRowHandle]` (+ `…Disabled`)
- `[wuEditableColumn]="row"` (+ `wuEditableColumnField`, `…RowIndex`, `…Disabled`) · `wu-cellEditor` · `[wuEditableRow]="row"` · `[wuInitEditableRow]` / `[wuSaveEditableRow]` / `[wuCancelEditableRow]` (+ `…Disabled`)
- `[wuResizableColumn]` / `[wuReorderableColumn]` (+ `…Disabled`)
All have `p*` aliases.

**Methods** (via `#dt`) — `filterGlobal(value, matchMode = 'contains')` · `filter(value, field, matchMode = 'contains')` · `filterRules(field, rules, 'and'|'or')` · `clear()` / `reset()` · `exportCSV(options?)` · `toCSV(options?): string` · `exportExcel(options?): Promise<void>` · `toExcel(options?): Promise<Uint8Array>` · `toExcelSheet(options?): ExcelSheet` · `toggleRowExpansion(row)` · `initRowEdit(row)` / `saveRowEdit(row, rowElement?)` / `cancelRowEdit(row)` · `saveState()` / `restoreState()` / `clearState()`.

**Types**

```ts
interface WuTableLazyLoadEvent { first: number; rows: number; page: number /* from 1 */; sortField?: string | null; sortOrder?: number;
  multiSortMeta?: SortMeta[]; filters: Record<string, FilterMeta>; globalFilter: string | null }
interface WuTablePageEvent { first: number; rows: number }
interface WuTableSortEvent { field?: string; order?: number; multisortmeta?: SortMeta[] }
interface WuTableFilterEvent { filters: Record<string, FilterMeta>; globalFilter: string | null; filteredValue: unknown[] }
interface WuTableRowSelectEvent { originalEvent: Event; data: unknown; index?: number; type: 'row' | 'checkbox' }
interface WuTableContextMenuSelectEvent { originalEvent: Event; data: unknown; index?: number }
interface WuTableHeaderCheckboxToggleEvent { originalEvent: Event; checked: boolean }
interface WuTableRowExpandEvent { originalEvent?: Event; data: unknown }
interface WuTableExportOptions { selectionOnly?: boolean; allValues?: boolean }
type WuTableExportFunction = (cell: { data: unknown; field: string }) => unknown;
interface WuColumnFilterContext { $implicit: unknown; filterCallback: (value: unknown) => void; field: string; type: string }
interface SortMeta { field: string; order: number }
interface FilterMeta { value: unknown; matchMode?: FilterMatchMode }
type FilterMatchMode = 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notContains' | 'notEquals' | 'lt' | 'lte' | 'gt' | 'gte' | 'in'
  | 'dateIs' | 'dateIsNot' | 'dateBefore' | 'dateAfter';
type FilterRule = FilterMeta | (FilterMeta & { operator?: 'and' | 'or' })[];
interface WuTableRowReorderEvent { dragIndex: number; dropIndex: number }
interface WuTableEditEvent { field: string; data: unknown; index?: number; originalEvent?: Event }
interface WuTableColResizeEvent { element: HTMLElement; delta: number }
interface WuTableColReorderEvent { dragIndex: number; dropIndex: number; columns: unknown[] }
interface WuTableSortFunctionEvent { data: unknown[]; mode: 'single' | 'multiple'; field?: string; order?: number; multiSortMeta?: SortMeta[] }
interface WuTableState { first?: number; rows?: number; sortField?: string | null; sortOrder?: number; filters?: Record<string, FilterRule>;
  globalFilter?: string | null; selection?: unknown; expandedRowKeys?: Record<string, boolean> }
```

**Tokens** — `--wu-table-header-bg`, `--wu-table-header-padding`, `--wu-table-header-weight`, `--wu-table-header-border-width` (caption/summary), `--wu-table-head-bg`, `--wu-table-head-color`, `--wu-table-head-weight`, `--wu-table-head-hover-bg`, `--wu-table-sorted-bg`, `--wu-table-sorted-color`, `--wu-table-row-bg`, `--wu-table-row-height`, `--wu-table-row-hover-bg`, `--wu-table-row-selected-bg`, `--wu-table-row-selected-color`, `--wu-table-row-striped-bg`, `--wu-table-stripe-bg` (even rows of every table, set in theme), `--wu-table-border-color`, `--wu-table-cell-padding-x`, `--wu-table-cell-padding-y`.

**Not built yet** — virtual scroll (`virtualScroll` / `virtualScrollItemSize` are accepted and ignored). For very long lists use `wu-scroller` ([data/scroller.md](../data/scroller.md)), or page / lazy-load.

**Gotchas**
- Templates are mandatory for output: `header` and `body` draw the `<tr>`s yourself; the table does not generate columns from `[columns]`.
- Slots: v3 `#body`; v1/v2 `wuTemplate="body"`. Use the form for the installed major.
- `[rowSelectable]`, `[exportFunction]` take the function itself: `fn = this.fn.bind(this)` once, not an inline arrow or a call.
- `rowGroupMode` needs data already sorted by `groupRowsBy`. `expandedRowKeys`, `editingRowKeys`, `columns` and `value` (after row reorder) are mutated in place.
- `dataKey` is needed for expansion keys, row edit, and reliable selection.
- Docs prose in the migration paragraph lists `resizableColumns` / `reorderableColumns` as ignored; the API table, recipes and source say they work. Use them. Ignored ones: see "Accepted but ignored".
- `onLazyLoad.page` is 1-based; the standalone `wu-paginator` `page` is 0-based.
