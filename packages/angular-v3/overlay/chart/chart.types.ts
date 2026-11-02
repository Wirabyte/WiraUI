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
} from 'wiraui/core';

export type {
  ChartAnnotations as WuChartAnnotations,
  ChartBoxStats as WuChartBoxStats,
  ChartNode as WuChartNode,
  ChartRange as WuChartRange,
  ChartColorRange as WuChartColorRange,
  ChartCurve as WuChartCurve,
  ChartPointAnnotation as WuChartPointAnnotation,
  ChartReferenceLine as WuChartReferenceLine,
  ChartSeries as WuChartSeries,
  ChartSeriesType,
  ChartType as WuChartType,
  ChartValueFormat,
  ChartXAnnotation as WuChartXAnnotation,
  ChartXY,
};

/** Where the legend goes. */
export type WuChartLegend = 'top' | 'bottom' | 'right' | 'none';

/** `(pointClick)`: the bar, point or slice clicked (or chosen with Enter). */
export interface WuChartClickEvent {
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
export interface WuChartToggleEvent {
  index: number;
  name: string;
  hidden: boolean;
}

/** One row of the tooltip. */
export interface WuChartTipRow {
  color: string;
  name: string;
  value: string;
}

/** `(zoomChange)`: the labels zoomed into, by index in the whole data (both included). */
export interface WuChartZoomEvent {
  from: number;
  to: number;
}
