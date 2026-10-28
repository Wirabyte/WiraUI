import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import Chart from 'chart.js/auto';
import { ɵassertSupportedAngular, ɵtoBool, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtChartJsDataSelectEvent } from './chartjs.types';

/** Chart.js's own defaults: when an app has not changed them, charts take the theme's font and colours instead. */
const CHARTJS_FONT = "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
const CHARTJS_COLOR = '#666';

/**
 * What wt-chartjs does (and wt-chart in wiratheme v1 / v2), shared by the v1 and v2/v3 templates: a canvas with a Chart.js chart, rebuilt when `type`, `data`
 * or `options` change. Charts pick up the theme's font (Thai included) and text colour unless the app set Chart.js
 * defaults itself or passes its own in `options`. Needs `chart.js` (3 or 4) installed in the app.
 */
@Directive()
export abstract class ɵWtChartJsBase implements AfterViewInit, OnDestroy {
  /** `bar`, `line`, `pie`, `doughnut`, `polarArea`, `radar`, `bubble`, `scatter`. */
  @Input() set type(v: string | undefined) {
    this._type = v || 'bar';
    this.reinit();
  }
  get type(): string {
    return this._type;
  }
  /** Chart.js data: `{ labels, datasets }`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() set data(v: any) {
    this._data = v;
    this.reinit();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get data(): any {
    return this._data;
  }
  /** Chart.js options. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() set options(v: any) {
    this._options = v;
    this.reinit();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get options(): any {
    return this._options;
  }
  /** Chart.js plugins for this chart, e.g. a data-labels plugin. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() plugins: any[] = [];
  /** `'400px'`, `'100%'` … Without them a responsive chart fills its container. */
  @Input() width?: string;
  @Input() height?: string;
  /** Resize with the container. Default true. */
  @Input() set responsive(v: unknown) {
    this._responsive = v === undefined || ɵtoBool(v);
    this.reinit();
  }
  get responsive(): boolean {
    return this._responsive;
  }
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() styleClass?: string;
  @Input() style?: Record<string, string | number> | null;

  /** A click on a bar, point or slice. */
  @Output() readonly onDataSelect = new EventEmitter<WtChartJsDataSelectEvent>();

  @ViewChild('canvas') protected canvasRef?: ElementRef<HTMLCanvasElement>;

  /** The Chart.js instance (null before the view exists, and on the server). */
  chart: Chart | null = null;

  private readonly zone = inject(NgZone);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private _type = 'bar';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _options: any;
  private _responsive = true;
  private initialized = false;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngAfterViewInit(): void {
    this.initialized = true;
    this.initChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }

  /** Redraws with the current data (after changing `data` in place). */
  refresh(): void {
    this.liftLines(this.chart?.data);
    this.chart?.update();
  }

  /** Builds the chart again from scratch. */
  reinit(): void {
    if (!this.initialized) return;
    this.chart?.destroy();
    this.chart = null;
    this.initChart();
  }

  getCanvas(): HTMLCanvasElement | null {
    return this.canvasRef?.nativeElement ?? null;
  }

  /** The chart as a PNG data URL. */
  getBase64Image(): string | null {
    return this.chart ? this.chart.toBase64Image() : null;
  }

  /** Kept for templates moving over; Chart.js 3+ draws legends itself. */
  generateLegend(): unknown {
    const c = this.chart as unknown as { generateLegend?: () => unknown } | null;
    return c?.generateLegend ? c.generateLegend() : null;
  }

  onCanvasClick(event: MouseEvent): void {
    const chart = this.chart;
    if (!chart) return;
    const element = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
    const dataset = chart.getElementsAtEventForMode(event, 'dataset', { intersect: true }, false);
    if (element?.length && dataset?.length) {
      this.onDataSelect.emit({ originalEvent: event, element: element[0], dataset });
    }
  }

  get fixedWidth(): string | null {
    return this._responsive && !this.width ? null : this.width || null;
  }
  get fixedHeight(): string | null {
    return this._responsive && !this.height ? null : this.height || null;
  }

  private initChart(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!this.browser || !canvas) return;
    const options = { ...(this._options || {}) };
    options.responsive = this._responsive;
    if (options.responsive && (this.height || this.width) && options.maintainAspectRatio === undefined) options.maintainAspectRatio = false;
    this.themeDefaults(options);
    this.liftLines(this._data);
    this.zone.runOutsideAngular(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.chart = new Chart(canvas, { type: this._type as any, data: this._data || { datasets: [] }, options, plugins: this.plugins || [] });
    });
  }

  /**
   * Bars and lines together: Chart.js draws the first dataset on top, so a line after the bars hides behind them.
   * Unless the app gave any dataset an `order`, lines get the front (order 0) and the rest stay behind (order 1).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private liftLines(data: any): void {
    const sets = data?.datasets;
    if (!Array.isArray(sets)) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const typeOf = (d: any) => (d && d.type) || this._type;
    const lines = sets.filter((d) => typeOf(d) === 'line');
    if (!lines.length || lines.length === sets.length || sets.some((d) => d && d.order !== undefined && !d.__wtOrder)) return;
    for (const d of sets) {
      if (!d) continue;
      d.order = typeOf(d) === 'line' ? 0 : 1;
      // Marks the order as ours, so a later refresh may set it again.
      Object.defineProperty(d, '__wtOrder', { value: true, enumerable: false, configurable: true });
    }
  }

  /** The theme's font and muted text colour, where neither the app's Chart.js defaults nor its options say otherwise. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private themeDefaults(options: any): void {
    const win = this.host.ownerDocument.defaultView;
    if (!win) return;
    const css = win.getComputedStyle(this.host);
    const family = css.getPropertyValue('--wt-font-family').trim();
    const muted = css.getPropertyValue('--wt-text-muted').trim();
    const border = css.getPropertyValue('--wt-border').trim();
    if (family && Chart.defaults.font.family === CHARTJS_FONT && !options.font?.family) {
      options.font = { ...(options.font || {}), family };
    }
    if (muted && Chart.defaults.color === CHARTJS_COLOR && options.color === undefined) options.color = muted;
    if (border && options.borderColor === undefined && Chart.defaults.borderColor === 'rgba(0,0,0,0.1)') options.borderColor = border;
  }
}
