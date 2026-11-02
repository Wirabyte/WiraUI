/** `(onPageChange)`: 0-based page, the first row index, rows per page and the page count. */
export interface WuPageEvent {
  page: number;
  first: number;
  rows: number;
  pageCount: number;
}
