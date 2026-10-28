import type {
  ChartAnnotations,
  ChartBoxStats,
  ChartNode,
  ChartRange,
  ChartColorRange,
  ChartCurve,
  ChartPointAnnotation,
  ChartReferenceLine,
  ChartSeries,
  ChartSeriesType,
  ChartType,
  ChartValueFormat,
  ChartXAnnotation,
  ChartXY,
} from 'wiratheme/core';

export type {
  ChartAnnotations as WtChartAnnotations,
  ChartBoxStats as WtChartBoxStats,
  ChartNode as WtChartNode,
  ChartRange as WtChartRange,
  ChartColorRange as WtChartColorRange,
  ChartCurve as WtChartCurve,
  ChartPointAnnotation as WtChartPointAnnotation,
  ChartReferenceLine as WtChartReferenceLine,
  ChartSeries as WtChartSeries,
  ChartSeriesType,
  ChartType as WtChartType,
  ChartValueFormat,
  ChartXAnnotation as WtChartXAnnotation,
  ChartXY,
};

/** Where the legend goes. */
export type WtChartLegend = 'top' | 'bottom' | 'right' | 'none';

/** `(pointClick)`: the bar, point or slice clicked (or chosen with Enter). */
export interface WtChartClickEvent {
  /** Index of the series (pie: 0). */
  series: number;
  seriesName: string;
  /** Index of the label (pie: the slice). */
  index: number;
  label: string;
  value: number;
  originalEvent: Event;
}

/** `(seriesToggle)`: a legend click showed or hid a series (pie: a slice). */
export interface WtChartToggleEvent {
  index: number;
  name: string;
  hidden: boolean;
}

/** One row of the tooltip. */
export interface WtChartTipRow {
  color: string;
  name: string;
  value: string;
}

/** `(zoomChange)`: the labels zoomed into, by index in the whole data (both included). */
export interface WtChartZoomEvent {
  from: number;
  to: number;
}
