import { optionField, searchText, SelectMatchMode } from './select';

/** One level of a multi-column sort. `order`: 1 ascending, -1 descending. */
export interface SortMeta {
  field: string;
  order: number;
}

export type FilterMatchMode = SelectMatchMode | 'notContains' | 'notEquals' | 'lt' | 'lte' | 'gt' | 'gte' | 'in';

/** A column filter: `{ value: 'ม.1', matchMode: 'equals' }`. */
export interface FilterMeta {
  value: unknown;
  matchMode?: FilterMatchMode;
}

const collator = typeof Intl !== 'undefined' ? new Intl.Collator('th', { numeric: true, sensitivity: 'base' }) : null;
const isEmpty = (v: unknown) => v === null || v === undefined || v === '';

/**
 * Compares two cell values the way people expect in a Thai table: numbers as numbers, dates by time, text in Thai
 * dictionary order with numbers inside it read as numbers ("ห้อง 2" before "ห้อง 10"). Empty values go last.
 */
export function compareValues(a: unknown, b: unknown): number {
  const ea = isEmpty(a);
  const eb = isEmpty(b);
  if (ea || eb) return ea && eb ? 0 : ea ? 1 : -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'boolean' && typeof b === 'boolean') return a === b ? 0 : a ? -1 : 1;
  const sa = String(a);
  const sb = String(b);
  return collator ? collator.compare(sa, sb) : sa < sb ? -1 : sa > sb ? 1 : 0;
}

/** Rows sorted by one or more fields (dot paths allowed). A new array; equal rows keep their order. */
export function sortRows<T>(rows: readonly T[], meta: readonly SortMeta[]): T[] {
  const levels = meta.filter((m) => m.field && m.order);
  if (!levels.length) return rows.slice();
  return rows
    .map((row, i) => ({ row, i }))
    .sort((x, y) => {
      for (const m of levels) {
        const ax = optionField(x.row, m.field);
        const ay = optionField(y.row, m.field);
        // Empty cells stay last whichever way the column is sorted.
        const ex = isEmpty(ax);
        const ey = isEmpty(ay);
        if (ex !== ey) return ex ? 1 : -1;
        const c = compareValues(ax, ay) * (m.order < 0 ? -1 : 1);
        if (c) return c;
      }
      return x.i - y.i;
    })
    .map((x) => x.row);
}

/** Whether a cell value matches a filter value (text compared with searchText: case, Thai digits, spaces). */
export function matchValue(cell: unknown, filter: unknown, mode: FilterMatchMode = 'contains'): boolean {
  if (isEmpty(filter) || (Array.isArray(filter) && !filter.length)) return true;
  switch (mode) {
    case 'in':
      return Array.isArray(filter) && filter.some((f) => compareValues(cell, f) === 0 || searchText(String(cell ?? '')) === searchText(String(f)));
    case 'lt':
      return compareValues(cell, filter) < 0;
    case 'lte':
      return compareValues(cell, filter) <= 0;
    case 'gt':
      return !isEmpty(cell) && compareValues(cell, filter) > 0;
    case 'gte':
      return !isEmpty(cell) && compareValues(cell, filter) >= 0;
  }
  if (cell instanceof Date && filter instanceof Date && (mode === 'equals' || mode === 'notEquals')) {
    const same = cell.getTime() === filter.getTime();
    return mode === 'equals' ? same : !same;
  }
  const c = searchText(String(cell ?? ''));
  const f = searchText(String(filter));
  switch (mode) {
    case 'startsWith':
      return c.startsWith(f);
    case 'endsWith':
      return c.endsWith(f);
    case 'equals':
      return c === f;
    case 'notEquals':
      return c !== f;
    case 'notContains':
      return !c.includes(f);
    default:
      return c.includes(f);
  }
}

/** Rows where any of `fields` (dot paths) matches the search text: the table's global search box. */
export function filterGlobal<T>(rows: readonly T[], value: string, fields: readonly string[], mode: FilterMatchMode = 'contains'): T[] {
  if (isEmpty(value) || !String(value).trim()) return rows.slice();
  const keys = fields.length ? fields : null;
  return rows.filter((row) => {
    if (keys) return keys.some((k) => matchValue(optionField(row, k), value, mode));
    // No fields given: search every top-level value of the row.
    return row !== null && typeof row === 'object' ? Object.values(row as object).some((v) => typeof v !== 'object' && matchValue(v, value, mode)) : matchValue(row, value, mode);
  });
}

/** Rows that pass every column filter (`{ grade: { value: 'ม.1', matchMode: 'equals' } }`). */
export function filterColumns<T>(rows: readonly T[], filters: Readonly<Record<string, FilterMeta | undefined>>): T[] {
  const active = Object.entries(filters).filter(([, f]) => f && !isEmpty(f.value) && !(Array.isArray(f.value) && !f.value.length));
  if (!active.length) return rows.slice();
  return rows.filter((row) => active.every(([field, f]) => matchValue(optionField(row, field), f!.value, f!.matchMode || 'contains')));
}

export interface PageState {
  /** Index of the first row shown (0-based). */
  first: number;
  rows: number;
  totalRecords: number;
}

/** 0-based page number and page count; `first` is pulled back inside the data when rows were removed. */
export function pageInfo(s: PageState): { page: number; pageCount: number; first: number; last: number } {
  const rows = Math.max(1, Math.floor(s.rows) || 1);
  const total = Math.max(0, Math.floor(s.totalRecords) || 0);
  const pageCount = Math.max(1, Math.ceil(total / rows));
  const page = Math.min(Math.max(0, Math.floor((s.first || 0) / rows)), pageCount - 1);
  const first = page * rows;
  return { page, pageCount, first, last: Math.min(first + rows, total) };
}

/** The page numbers (0-based) to show as links: `size` of them around the current page. */
export function pageLinks(page: number, pageCount: number, size = 5): number[] {
  const n = Math.max(1, Math.min(size, pageCount));
  let start = Math.max(0, Math.ceil(page - n / 2));
  const end = Math.min(pageCount - 1, start + n - 1);
  start = Math.max(0, end - n + 1);
  const out: number[] = [];
  for (let p = start; p <= end; p++) out.push(p);
  return out;
}

/**
 * The page report: `'กำลังแสดง {first} ถึง {last} จาก {totalRecords} รายการ'` → `กำลังแสดง 11 ถึง 20 จาก 57 รายการ`.
 * Placeholders: {first}, {last}, {rows}, {totalRecords}, {currentPage}, {totalPages}. Numbers get thousands separators.
 */
export function pageReport(template: string, s: PageState): string {
  const info = pageInfo(s);
  const total = Math.max(0, Math.floor(s.totalRecords) || 0);
  const fmt = (n: number) => n.toLocaleString('en-US');
  const values: Record<string, string> = {
    first: fmt(total ? info.first + 1 : 0),
    last: fmt(info.last),
    rows: fmt(Math.max(1, Math.floor(s.rows) || 1)),
    totalRecords: fmt(total),
    currentPage: fmt(total ? info.page + 1 : 0),
    totalPages: fmt(total ? info.pageCount : 0),
  };
  return template.replace(/\{(\w+)\}/g, (m, k: string) => values[k] ?? m);
}
