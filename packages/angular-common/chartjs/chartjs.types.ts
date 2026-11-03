/** `(onDataSelect)`: the clicked bar, point or slice and the elements of its dataset. */
export interface WuChartJsDataSelectEvent {
  originalEvent: MouseEvent;
  element: unknown;
  dataset: unknown[];
}

/** The name wu-chart used (wiraui v1 / v2 `@wirabyte/ui/chart`, and older code moving over). */
export type WuChartDataSelectEvent = WuChartJsDataSelectEvent;
