/** `(onDataSelect)`: the clicked bar, point or slice and the elements of its dataset. */
export interface WtChartDataSelectEvent {
  originalEvent: MouseEvent;
  element: unknown;
  dataset: unknown[];
}
