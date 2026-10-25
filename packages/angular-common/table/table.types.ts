import { InjectionToken } from '@angular/core';
import type { Observable } from 'rxjs';
import type { FilterMatchMode, FilterMeta, SortMeta } from 'wiratheme/core';

export type { FilterMatchMode, FilterMeta, SortMeta };
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
  filters: Record<string, FilterMeta>;
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
  filters: Record<string, FilterMeta>;
  globalFilter: string | null;
}

export interface WtTableRowSelectEvent {
  originalEvent: Event;
  data: unknown;
  index?: number;
  type: 'row' | 'checkbox';
}

export interface WtTableHeaderCheckboxToggleEvent {
  originalEvent: Event;
  checked: boolean;
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
  toggleRow(row: unknown, event: Event, index: number | undefined, type: 'row' | 'checkbox'): void;
  readonly allSelected: boolean;
  readonly someSelected: boolean;
  readonly hasRows: boolean;
  toggleAll(event: Event): void;
}

export const ɵWT_TABLE = new InjectionToken<ɵWtTableApi>('WT_TABLE');
