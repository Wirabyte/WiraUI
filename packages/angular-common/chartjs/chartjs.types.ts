/** `(onDataSelect)`: the clicked bar, point or slice and the elements of its dataset. */
export interface WtChartJsDataSelectEvent {
  originalEvent: MouseEvent;
  element: unknown;
  dataset: unknown[];
}

/** The name wt-chart used (wiratheme v1 / v2 `wiratheme/chart`, and PrimeNG code moving over). */
export type WtChartDataSelectEvent = WtChartJsDataSelectEvent;
