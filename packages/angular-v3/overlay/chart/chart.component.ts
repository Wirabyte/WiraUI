import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  NgZone,
  numberAttribute,
  output,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵWU_SKIP_VERSION_CHECK, WuConfig } from '@wirabyte/ui/config';
import {
  ChartAnnotations,
  ChartAxisScale,
  ChartColorRange,
  ChartCurve,
  chartHit,
  ChartHoverBand,
  chartModel,
  ChartModel,
  ChartModelOptions,
  ChartReferenceLine,
  ChartSeries,
  chartSeriesFrom,
  ChartText,
  ChartType,
  ChartValueFormat,
  chartMovesValues,
  chartSwapTypes,
  chartVariants,
  formatChartValue,
} from '@wirabyte/ui/core';
import { WU_CHART_KINDS, WU_CHART_LOOKS } from './chart.icons';
import { WuChartClickEvent, WuChartLegend, WuChartTipRow, WuChartToggleEvent, WuChartZoomEvent } from './chart.types';

/** The theme's chart colours (`--wu-chart-1` … `-10`), so charts follow the preset and dark mode. */
const PALETTE = Array.from({ length: 10 }, (_, i) => `var(--wu-chart-${i + 1})`);
const ANIMATION_MS = 650;
let uid = 0;

interface Frame {
  labels: string[];
  series: ChartSeries[];
  hiddenSlices: number[];
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const TYPES = Object.keys(WU_CHART_KINDS) as ChartType[];
/** Kinds that hide labels from the legend (not series), without zeroing data that is not numbers. */
const BY_LABELS: ChartType[] = ['funnel', 'unit', 'sunburst'];
const GHOST_MS = 480;
const ALIASES: Record<string, ChartType> = { donut: 'doughnut', bubble: 'scatter', radialbar: 'radialBar', polararea: 'polarArea', gauge: 'radialBar' };
const WORDS = {
  th: { toolbar: 'เครื่องมือของกราฟ', zoomIn: 'ซูมเข้า', zoomOut: 'ซูมออก', reset: 'ดูทั้งหมด', download: 'ดาวน์โหลด', kinds: 'แบบของกราฟ', looks: 'ลักษณะ', back: 'ย้อนกลับ' },
  en: { toolbar: 'Chart tools', zoomIn: 'Zoom in', zoomOut: 'Zoom out', reset: 'Show all', download: 'Download', kinds: 'Chart type', looks: 'Look', back: 'Back' },
};
/** Charts that share a `group`, to show the tooltip at the same label together. */
const GROUPS = new Map<string, Set<WuChart>>();

/**
 * WiraUI's own chart, drawn in SVG with no chart library: `<wu-chart type="bar" [labels]="months" [series]="[{ name: 'รายรับ', data: income }]">`.
 * Bar (grouped, stacked, across), line (smooth, dashed, a second axis), area, pie, doughnut, radar and scatter / bubble,
 * mixed per series. Text is real text in the page's font (Thai shapes properly); `font` and `fontSize` change it for
 * one chart. Values read as numbers, percents, baht or Thai compact units (`format`). The legend shows and hides
 * series, the tooltip follows the pointer or the arrow keys, values grow in when shown and move when they change, and
 * a hidden table gives screen readers the numbers. Chart.js-shaped `[data]` / `[options]` work too, so Chart.js code
 * (`<wu-chartjs>`, `<p-chart>`) moves over as it is; for Chart.js plugins keep `<wu-chartjs>`. Export with `toSVG()`, `toPNG()` or `download()`.
 */
@Component({
  selector: 'wu-chart',
  standalone: true,
  exportAs: 'wuChart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // `title` is an input here: keep it off the host so the chart gets no browser tooltip.
  host: { class: 'wu-chart-host', '[attr.title]': 'null' },
})
export class WuChart {
  /**
   * `bar` (default), `line`, `area`, `pie`, `doughnut`, `polarArea`, `radialBar`, `radar`, `scatter`, `heatmap`, `treemap`,
   * `stream`, `waterfall`, `dumbbell`, `timeline`, `funnel`, `boxplot`, `histogram`, `sunburst`, `unit`, `slope`.
   */
  readonly type = input<ChartType, ChartType | string | null | undefined>('bar', {
    transform: (v) => (TYPES.includes(v as ChartType) ? (v as ChartType) : ALIASES[String(v).toLowerCase()] || 'bar'),
  });
  /** Category labels (the x axis; slices of a pie). */
  readonly labels = input<(string | number)[] | null | undefined>();
  /** `[{ name, data, type?, color?, axis?, stack?, smooth?, dashed?, hidden? }]`. */
  readonly series = input<ChartSeries[] | null | undefined>();
  /** Chart.js-shaped data instead: `{ labels, datasets }`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data = input<any>();
  /** Chart.js-shaped options it understands (indexAxis, stacked scales, min / max, legend, title, cutout). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly options = input<any>();

  readonly title = input<string | null | undefined>();
  readonly subtitle = input<string | null | undefined>();
  /** Height of the drawing: px or any CSS length. Default 320px (pie and doughnut 280px). */
  readonly height = input<string | number | null | undefined>();
  readonly legend = input<WuChartLegend | null | undefined>();
  /** Font family of every text in the chart. Default: the theme's. */
  readonly font = input<string | null | undefined>();
  /** Size of axis and label text, px. Default 12. */
  readonly fontSize = input<number, unknown>(12, { transform: (v) => (Number(v) > 0 ? Number(v) : 12) });

  readonly horizontal = input(false, { transform: booleanAttribute });
  readonly stacked = input(false, { transform: booleanAttribute });
  readonly smooth = input(false, { transform: booleanAttribute });
  /** `'straight'`, `'smooth'` or `'step'` lines (wins over `smooth`). */
  readonly curve = input<ChartCurve | null | undefined>();
  /** Areas fade down from the line's colour; false fills them flat. */
  readonly gradient = input(true, { transform: booleanAttribute });
  /** A small chart with no axes, grid, legend or text: a trend beside a number. */
  readonly sparkline = input(false, { transform: booleanAttribute });
  /** Values on the bars, points and slices. Default off (heatmap and waterfall: on). */
  readonly showValues = input<boolean | undefined, unknown>(undefined, { transform: (v) => (v === undefined || v === null ? undefined : booleanAttribute(v)) });
  /** The look of a kind, e.g. heatmap `'hex'`, funnel `'pyramid'`, box plot `'violin'`, unit `'people'` (see the docs). */
  readonly variant = input<string | null | undefined>();
  /** Histogram bins. Default from the number of values. */
  readonly bins = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  /**
   * (Beta) A type switcher over the chart: `true` offers every kind the same data can be shown as, or name them
   * (`['bar', 'line', 'area']`). The chart moves to the new kind with a cross-fade.
   */
  readonly swap = input<boolean | ChartType[] | null | undefined>();
  /** A look picker over the chart for kinds with several looks (heatmap, stream, funnel, box plot, …). */
  readonly looks = input(false, { transform: booleanAttribute });
  /** Dots on line points; default when there are 40 or fewer. */
  readonly points = input<boolean | undefined, unknown>(undefined, { transform: (v) => (v === undefined || v === null ? undefined : booleanAttribute(v)) });
  readonly grid = input(true, { transform: booleanAttribute });
  readonly tooltip = input(true, { transform: booleanAttribute });
  readonly animate = input(true, { transform: booleanAttribute });

  /** How values read: `'number'`, `'integer'`, `'percent'`, `'currency'`, `'compact'` or a function. */
  readonly format = input<ChartValueFormat>('number');
  /** Format of the right-hand axis. Default `format`. */
  readonly rightFormat = input<ChartValueFormat | null | undefined>();
  readonly currency = input('THB');
  readonly decimals = input<number | undefined, unknown>(undefined, { transform: (v) => (v === null || v === undefined || v === '' ? undefined : numberAttribute(v)) });
  readonly prefix = input<string | null | undefined>();
  readonly suffix = input<string | null | undefined>();
  /** Language of numbers and built-in text. Default: the app's. */
  readonly lang = input<string | null | undefined>();

  readonly min = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  readonly max = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  readonly beginAtZero = input<boolean | undefined, unknown>(undefined, { transform: (v) => (v === undefined || v === null ? undefined : booleanAttribute(v)) });
  readonly rightMin = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  readonly rightMax = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  readonly xTitle = input<string | null | undefined>();
  readonly yTitle = input<string | null | undefined>();
  readonly y2Title = input<string | null | undefined>();
  /** Horizontal lines at values: `[{ value: 80, label: 'เป้าหมาย' }]` (`to` shades a band). */
  readonly referenceLines = input<ChartReferenceLine[] | null | undefined>();
  /** Notes on bar, line and area charts: `{ y: [{ value, to?, label }], x: [{ at, to?, label }], points: [{ at, value, label }] }`. */
  readonly annotations = input<ChartAnnotations | null | undefined>();
  /** Heatmap colours by value: `[{ from: 0, to: 10, color: '#…', name: 'ต่ำ' }]`. */
  readonly colorRanges = input<ChartColorRange[] | null | undefined>();
  /** Where pie, doughnut and radial bars start and end, degrees clockwise from 12 o'clock: -90 and 90 make a half circle (a gauge). */
  readonly startAngle = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  readonly endAngle = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  /** Buttons over the chart: zoom (bar, line and area) and download as PNG, SVG or CSV. */
  readonly toolbar = input(false, { transform: booleanAttribute });
  /** Drag across labels to zoom into them (bar, line and area). Default: on with the toolbar. */
  readonly zoom = input<boolean | undefined, unknown>(undefined, { transform: (v) => (v === undefined || v === null ? undefined : booleanAttribute(v)) });
  /** Charts with the same group show the tooltip at the same label together. */
  readonly group = input<string | null | undefined>();
  /** Name of the toolbar's downloads, without the extension. */
  readonly fileName = input('chart');
  /** Colours for series (or slices) without their own, instead of the theme's. */
  readonly colors = input<string[] | null | undefined>();
  readonly barRadius = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  /** Doughnut hole, 0–1 of the radius. Default 0.62. */
  readonly cutout = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  /** Doughnut middle: big text and the line under it. Default: the total and "รวม". */
  readonly centerValue = input<string | number | null | undefined>();
  readonly centerLabel = input<string | null | undefined>();
  /** Shown when there is nothing to draw. Default: the locale's "no data". */
  readonly emptyMessage = input<string | null | undefined>();
  readonly ariaLabel = input<string | null | undefined>();
  readonly styleClass = input<string | null | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly style = input<Record<string, any> | string | null | undefined>();

  /** A bar, point or slice was clicked (or chosen with Enter). */
  readonly pointClick = output<WuChartClickEvent>();
  /** The legend showed or hid a series (pie: a slice). */
  readonly seriesToggle = output<WuChartToggleEvent>();
  /** Zoomed into labels `from` … `to` (indexes), or back to all of them (null). */
  readonly zoomChange = output<WuChartZoomEvent | null>();
  /** The type switcher picked another kind. */
  readonly typeChange = output<ChartType>();
  /** The look picker picked another look. */
  readonly variantChange = output<string>();

  /** The kind drawn: `type`, or what the switcher picked. */
  readonly kind = linkedSignal<ChartType>(() => this.type());
  /** The look drawn: `variant`, or what the picker picked. */
  readonly chosenLook = linkedSignal<string | undefined>(() => this.variant() || undefined);

  readonly id = `wu-chart-${++uid}`;
  /** Series (pie: slices) hidden from the legend. */
  readonly hidden = signal<ReadonlySet<number>>(new Set());
  /** The label (or slice) under the pointer or keyboard. */
  readonly hovered = signal<number | null>(null);
  /** The newer kinds: the hover target under the pointer or keyboard (its key). */
  readonly hoverKey = signal<string | null>(null);
  /** Sunburst: the node drilled into (a path of names). */
  readonly focus = signal<string | null>(null);
  /** The series whose legend item is under the pointer: the others fade. */
  readonly focusSeries = signal<number | null>(null);
  /** Pointer position in the drawing, for the tooltip. */
  readonly pointer = signal<{ x: number; y: number } | null>(null);
  readonly liveText = signal('');
  /** The labels zoomed into (indexes, both included), or null for all. */
  readonly zoomed = signal<[number, number] | null>(null);
  /** Labels being dragged across to zoom. */
  private readonly selecting = signal<{ from: number; to: number } | null>(null);
  /** The toolbar's download menu is open. */
  readonly menu = signal(false);

  private readonly config = inject(WuConfig);
  private readonly zone = inject(NgZone);
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly body = viewChild<ElementRef<HTMLElement>>('body');
  private readonly svgRef = viewChild<ElementRef<SVGSVGElement>>('svg');
  private readonly size = signal({ width: 0, height: 0 });
  private readonly frame = signal<Frame | null>(null);
  private readonly i18n = ɵrefreshOnTranslation();
  private readonly lang$ = signal(this.config.translation.code || 'th');
  private canvas: CanvasRenderingContext2D | null = null;
  private fontFamily = '';
  private raf = 0;
  /** The next frame shows without animating (zooming). */
  private instant = false;
  /** The frame last animated to, so the data effect does not start it again. */
  private lastTarget: Frame | null = null;
  /** The pointer dragged (a zoom), so the click that follows is not a click on data. */
  private dragged = false;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    const destroy = inject(DestroyRef);
    const sub = this.config.translationChange.subscribe((t) => this.lang$.set(t.code || 'th'));
    destroy.onDestroy(() => {
      sub.unsubscribe();
      this.i18n.unsubscribe();
      if (this.raf) cancelAnimationFrame(this.raf);
    });
    // Watch the drawing area's size.
    afterNextRender(() => {
      const el = this.body()?.nativeElement;
      if (!el) return;
      const read = () => {
        this.fontFamily = getComputedStyle(this.svgRef()?.nativeElement || el).fontFamily;
        this.size.set({ width: Math.floor(el.clientWidth), height: Math.floor(el.clientHeight) });
      };
      read();
      const doc = this.host.ownerDocument;
      // Web fonts change text widths once they arrive.
      doc.fonts?.ready?.then(() => read()).catch(() => undefined);
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => this.zone.run(read));
      observer.observe(el);
      destroy.onDestroy(() => observer.disconnect());
    });
    // Join the group, to show the tooltip together.
    effect((onCleanup) => {
      const name = this.group();
      if (!name) return;
      let set = GROUPS.get(name);
      if (!set) GROUPS.set(name, (set = new Set()));
      set.add(this);
      onCleanup(() => {
        set!.delete(this);
        if (!set!.size) GROUPS.delete(name);
      });
    });
    // The app changed [type] or [variant]: move over the way the switcher does.
    let seen: [ChartType, string | null | undefined] | null = null;
    effect(() => {
      const now: [ChartType, string | null | undefined] = [this.type(), this.variant()];
      const before = seen;
      seen = now;
      if (!before || (before[0] === now[0] && before[1] === now[1])) return;
      untracked(() => this.transition(() => undefined, before[0] !== now[0]));
    });
    // Move to new data (or grow in the first time) over a few frames.
    effect(() => {
      const target = this.target();
      if (target === this.lastTarget) return;
      untracked(() => this.animateTo(target));
    });
  }

  // ---------- inputs, read together ----------

  /** Labels and series from whichever inputs were given, with Chart.js options folded in. */
  private readonly source = computed(() => {
    const series = this.series();
    if (series) return { labels: (this.labels() || []).map(String), series };
    const from = chartSeriesFrom(this.data(), this.kind());
    return { labels: (this.labels() || from.labels).map(String), series: from.series };
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly opt = computed(() => this.options() || ({} as any));
  readonly isPie = computed(() => this.kind() === 'pie' || this.kind() === 'doughnut');
  /** One series, a value per label (pie, doughnut, polar area, radial bar): the legend shows and hides labels. */
  readonly isRound = computed(() => this.isPie() || this.kind() === 'polarArea' || this.kind() === 'radialBar');
  /** Heatmap and treemap: the pointer and the keys go cell by cell. */
  readonly isCells = computed(() => this.kind() === 'heatmap' || this.kind() === 'treemap');
  /** A heatmap coloured by `colorRanges`: the legend shows and hides ranges. */
  private readonly byRanges = computed(() => this.kind() === 'heatmap' && !!this.colorRanges()?.length);
  readonly zoomable = computed(() => (this.zoom() ?? this.toolbar()) && ['bar', 'line', 'area'].includes(this.kind()) && !this.isHorizontal() && !this.sparkline());
  /** Kinds the switcher offers (none: no switcher). */
  readonly swapKinds = computed<ChartType[]>(() => {
    const own = this.swap();
    if (!own) return [];
    const { labels, series } = this.source();
    const list = Array.isArray(own) ? own.filter((t) => TYPES.includes(t)) : chartSwapTypes(this.type(), series, labels);
    return list.length > 1 ? list : [];
  });
  readonly kindsInfo = WU_CHART_KINDS;
  /** Looks the picker offers for the kind drawn (none: no picker), and the one drawn. */
  readonly lookList = computed(() => (this.looks() ? chartVariants(this.kind()) : []));
  readonly activeLook = computed(() => {
    const list = chartVariants(this.kind());
    const now = this.chosenLook();
    return now && list.includes(now) ? now : list[0];
  });
  lookName(look: string): string {
    const name = WU_CHART_LOOKS[look];
    return name ? (this.language().toLowerCase().startsWith('th') ? name.th : name.en) : look;
  }
  readonly words = computed(() => (this.language().toLowerCase().startsWith('th') ? WORDS.th : WORDS.en));
  readonly isHorizontal = computed(() => this.horizontal() || this.opt().indexAxis === 'y');
  readonly isStacked = computed(() => this.stacked() || !!this.opt().scales?.x?.stacked || !!this.opt().scales?.y?.stacked);
  readonly legendPos = computed<WuChartLegend>(() => {
    const own = this.legend();
    if (own) return own;
    if (this.sparkline()) return 'none';
    // One ring names itself in the middle.
    if (this.kind() === 'radialBar' && this.source().labels.length < 2) return 'none';
    const l = this.opt().plugins?.legend;
    if (l?.display === false) return 'none';
    if (l?.position === 'top' || l?.position === 'right' || l?.position === 'bottom') return l.position;
    if (l?.position === 'left') return 'right';
    return this.isRound() && this.kind() !== 'radialBar' ? 'right' : 'bottom';
  });
  readonly heading = computed(() => this.title() || (typeof this.opt().plugins?.title?.text === 'string' ? this.opt().plugins.title.text : ''));
  readonly heightCss = computed(() => {
    const h = this.height() ?? this.opt().height;
    if (typeof h === 'number' || (typeof h === 'string' && /^\d+(\.\d+)?$/.test(h))) return `${h}px`;
    return (h as string) || (this.sparkline() ? '48px' : this.isRound() ? '280px' : '320px');
  });
  readonly language = computed(() => this.lang() || this.lang$());

  /** The source, cut to the labels zoomed into. */
  private readonly view = computed(() => {
    const src = this.source();
    const z = this.zoomable() ? this.zoomed() : null;
    if (!z) return src;
    const [a, b] = z;
    return { labels: src.labels.slice(a, b + 1), series: src.series.map((s) => ({ ...s, data: (s.data as unknown[]).slice(a, b + 1) as ChartSeries['data'] })) };
  });

  /** What the chart should show now: the source with the legend's hidden series applied. */
  private readonly target = computed<Frame>(() => {
    const { labels, series } = this.view();
    const hidden = this.hidden();
    if (this.byRanges() || BY_LABELS.includes(this.kind())) return { labels, series, hiddenSlices: [...hidden] };
    if (this.isRound()) {
      const s = series[0];
      const data = s ? (s.data as unknown[]).map((v, k) => (hidden.has(k) ? 0 : Number(v) || 0)) : [];
      return { labels, series: s ? [{ ...s, data }] : [], hiddenSlices: [...hidden] };
    }
    return { labels, series: series.map((s, i) => ({ ...s, hidden: !!s.hidden || hidden.has(i) })), hiddenSlices: [] };
  });

  readonly palette = computed(() => (this.colors()?.length ? this.colors()! : PALETTE));

  /** Everything the drawing takes except the data and its size. */
  private readonly look = computed<Omit<ChartModelOptions, 'labels' | 'series' | 'width' | 'height'>>(() => {
    const o = this.opt();
    const y = o.scales?.y || o.scales?.x || {};
    return {
      type: this.kind(),
      measure: (t, size) => this.measure(t, size),
      fontSize: this.fontSize(),
      palette: this.palette(),
      horizontal: this.isHorizontal(),
      stacked: this.isStacked(),
      smooth: this.smooth(),
      min: this.min() ?? optionalNumber(y.min),
      max: this.max() ?? optionalNumber(y.max),
      beginAtZero: this.beginAtZero() ?? (typeof y.beginAtZero === 'boolean' ? y.beginAtZero : undefined),
      rightMin: this.rightMin(),
      rightMax: this.rightMax(),
      showValues: this.showValues(),
      points: this.points(),
      grid: this.grid(),
      xTitle: this.xTitle() || undefined,
      yTitle: this.yTitle() || undefined,
      y2Title: this.y2Title() || undefined,
      referenceLines: this.referenceLines() || undefined,
      format: this.format(),
      rightFormat: this.rightFormat() || undefined,
      formatOptions: this.formatOptions(),
      barRadius: this.barRadius(),
      cutout: this.cutout() ?? cutoutOf(o.cutout),
      curve: this.curve() || undefined,
      gradient: this.gradient(),
      sparkline: this.sparkline(),
      startAngle: this.startAngle() ?? optionalNumber(o.rotation),
      // Chart.js: rotation (start) and circumference (how far), in degrees.
      endAngle: this.endAngle() ?? (optionalNumber(o.circumference) !== undefined ? (this.startAngle() ?? optionalNumber(o.rotation) ?? 0) + Number(o.circumference) : undefined),
      annotations: this.shiftedNotes(),
      colorRanges: this.colorRanges() || undefined,
      variant: this.chosenLook() || undefined,
      bins: this.bins(),
      focus: this.focus() || undefined,
    };
  });

  /** Annotations that name a label by its index, moved with the zoom. */
  private readonly shiftedNotes = computed<ChartAnnotations | undefined>(() => {
    const a = this.annotations();
    const z = this.zoomable() ? this.zoomed() : null;
    if (!a || !z) return a || undefined;
    const at = <T extends string | number | undefined>(v: T): T => (typeof v === 'number' ? ((v - z[0]) as T) : v);
    return { y: a.y, x: a.x?.map((n) => ({ ...n, at: at(n.at), to: at(n.to) })), points: a.points?.map((n) => ({ ...n, at: at(n.at) })) };
  });

  /** The drawing at the end of the animation: its axes stay put while the marks move. */
  private readonly finalModel = computed<ChartModel | null>(() => {
    const { width, height } = this.size();
    if (!width || !height) return null;
    const f = this.target();
    return chartModel({ ...this.look(), labels: f.labels, series: f.series, hiddenSlices: f.hiddenSlices, width, height });
  });

  readonly model = computed<ChartModel | null>(() => {
    const frame = this.frame();
    const { width, height } = this.size();
    if (!frame || !width || !height) return null;
    if (!this.animating() && frame === this.target()) return this.finalModel();
    // Growing in: the final axes from the start. Changing: the axes slide from the old to the new.
    const t = this.progress();
    const end = this.finalModel()?.scales;
    const from = this.scalesFrom();
    const scales = end ? { left: slide(from?.left, end.left, t), right: slide(from?.right, end.right, t) } : undefined;
    return chartModel({
      ...this.look(),
      labels: frame.labels,
      series: frame.series,
      hiddenSlices: frame.hiddenSlices,
      width,
      height,
      scales,
      sweep: this.entering() ? t : 1,
    });
  });

  private readonly formatOptions = computed(() => ({
    lang: this.language(),
    currency: this.currency(),
    decimals: this.decimals(),
    prefix: this.prefix() || undefined,
    suffix: this.suffix() || undefined,
  }));

  // ---------- what the template reads ----------

  /** Legend items, with the hidden state the legend set (slices shrink before they go). */
  readonly legendItems = computed(() => {
    const m = this.model();
    const hidden = this.hidden();
    return (m?.legend || []).map((item) => ({ ...item, hidden: item.hidden || hidden.has(item.index) }));
  });

  readonly classes = computed(() =>
    [
      'wu-chart',
      `wu-chart-type-${this.kind()}`,
      `wu-chart-legend-${this.legendPos()}`,
      this.sparkline() ? 'wu-chart-sparkline' : '',
      this.focusSeries() !== null ? 'wu-chart-focusing' : '',
      this.entering() ? 'wu-chart-entering' : '',
      this.styleClass() || '',
    ]
      .filter(Boolean)
      .join(' ')
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly rootStyle = computed(() => {
    const s = this.style();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return s && typeof s === 'object' ? (s as Record<string, any>) : null;
  });

  readonly empty = computed(() => {
    const m = this.model();
    return !!m && m.empty && !this.animating();
  });
  readonly emptyText = computed(() => this.emptyMessage() || this.config.translation.emptyMessage);
  private readonly animating = signal(false);
  /** How far the animation is, 0–1 (eased). */
  private readonly progress = signal(1);
  /** The axes shown when the animation began (null: growing in). */
  private readonly scalesFrom = signal<ChartModel['scales'] | null>(null);
  /** Growing in the first time: the axes are final, pies fan out, values wait until the end. */
  readonly entering = signal(false);

  /** The doughnut's middle text (radial bars: the ring under the pointer, else the first). */
  readonly center = computed(() => {
    const m = this.model();
    if (!m?.center || m.empty) return null;
    const own = this.centerValue();
    if (m.centerText) {
      const band = this.hoverBand();
      // The node pointed at, else the node drilled into (or the total).
      const value = band ? formatChartValue(band.value ?? 0, this.format(), this.formatOptions()) : own !== undefined && own !== null ? String(own) : m.centerText.value;
      const label = band ? band.label ?? '' : this.centerLabel() ?? m.centerText.label;
      return { ...m.center, value, label, back: !!this.focus() && !band };
    }
    if (this.kind() === 'radialBar') {
      const ring = m.rings.find((r) => r.index === this.hovered()) || m.rings[0];
      if (!ring) return null;
      const value = own !== undefined && own !== null ? String(own) : formatChartValue(ring.percent, 'percent', { lang: this.language() });
      return { ...m.center, value, label: this.centerLabel() ?? ring.label };
    }
    const total = this.target().series[0] ? (this.target().series[0].data as unknown[]).reduce((sum: number, v) => sum + (Number(v) || 0), 0) : 0;
    const value = own !== undefined && own !== null ? String(own) : formatChartValue(total, this.format(), this.formatOptions());
    return { ...m.center, value, label: this.centerLabel() ?? this.config.translation.total };
  });

  /** The tooltip: title, a row per series (or the slice) and where it goes. */
  readonly tip = computed(() => {
    const m = this.model();
    const i = this.hovered();
    const at = this.pointer();
    if (m?.generic) {
      const band = this.hoverBand();
      if (!band?.tip || !this.tooltip() || m.empty) return null;
      const x = at ? at.x : band.cx;
      const y = at ? at.y : band.cy + band.h / 2;
      return { title: band.tip.title, rows: band.tip.rows, x, y, flip: x > m.width / 2 };
    }
    if (!m || i === null || !this.tooltip() || m.empty) return null;
    const { labels, series } = this.target();
    const fmt = (v: number, right: boolean) => formatChartValue(v, right ? this.rightFormat() || this.format() : this.format(), this.formatOptions());
    let title = labels[i] ?? '';
    const rows: WuChartTipRow[] = [];
    if (this.kind() === 'radialBar') {
      const ring = m.rings.find((r) => r.index === i);
      if (!ring) return null;
      title = '';
      rows.push({ color: ring.color, name: ring.label, value: fmt(ring.value, false) });
    } else if (this.isRound()) {
      const slice = m.slices.find((s) => s.index === i);
      if (!slice) return null;
      rows.push({ color: slice.color, name: formatChartValue(slice.percent, 'percent', { lang: this.language() }), value: fmt(slice.value, false) });
    } else if (this.isCells()) {
      const cell = m.cells.find((c) => c.index === i && c.series === this.hoveredSeries());
      if (!cell) return null;
      const name = series[cell.series]?.name ?? '';
      title = this.kind() === 'heatmap' || series.length > 1 ? name : '';
      rows.push({ color: cell.color, name: cell.label, value: fmt(cell.value, false) });
    } else if (this.kind() === 'scatter') {
      const dot = m.dots.find((d) => d.index === i && this.hoveredSeries() === d.series) || m.dots.find((d) => d.index === i);
      if (!dot) return null;
      title = series[dot.series]?.name ?? '';
      rows.push({ color: dot.color, name: 'x', value: fmt(dot.x ?? 0, false) }, { color: dot.color, name: 'y', value: fmt(dot.value, false) });
    } else {
      series.forEach((s, k) => {
        if (s.hidden) return;
        const v = (s.data as unknown[])[i];
        if (typeof v !== 'number' || !Number.isFinite(v)) return;
        rows.push({ color: m.legend[k]?.color || this.palette()[k % this.palette().length], name: s.name ?? '', value: fmt(v, s.axis === 'right') });
      });
    }
    if (!rows.length) return null;
    const band = m.hover.find((h) => h.index === i && (h.series === undefined || h.series === this.hoveredSeries()));
    const x = at ? at.x : band?.cx ?? 0;
    const y = at ? at.y : band ? band.cy + (this.isRound() ? 0 : band.h / 2) : 0;
    return { title, rows, x, y, flip: x > m.width / 2 };
  });
  /** The series of the hovered scatter dot, heatmap cell or treemap tile. */
  readonly hoveredSeries = signal<number | null>(null);

  /** The newer kinds: the hover target pointed at. */
  readonly hoverBand = computed<ChartHoverBand | null>(() => {
    const m = this.model();
    const key = this.hoverKey();
    return m?.generic && key !== null ? m.hover.find((h) => h.key === key) ?? null : null;
  });

  /** The vertical (or horizontal) line through the hovered category. */
  readonly crosshair = computed(() => {
    const m = this.model();
    const i = this.hovered();
    if (m?.generic) {
      const band = this.hoverBand();
      return band?.cross ? { x1: band.cx, y1: m.plot.y, x2: band.cx, y2: m.plot.y + m.plot.h } : null;
    }
    if (!m || i === null || this.isRound() || this.isCells() || this.kind() === 'radar' || this.kind() === 'scatter' || m.bars.length) return null;
    const band = m.hover.find((h) => h.index === i);
    return band ? { x1: band.cx, y1: m.plot.y, x2: band.cx, y2: m.plot.y + m.plot.h } : null;
  });

  /** The box being dragged across to zoom. */
  readonly selection = computed(() => {
    const m = this.model();
    const sel = this.selecting();
    if (!m || !sel) return null;
    const [a, b] = [Math.min(sel.from, sel.to), Math.max(sel.from, sel.to)];
    const first = m.hover.find((h) => h.index === a);
    const last = m.hover.find((h) => h.index === b);
    return first && last ? { x: first.x, y: m.plot.y, w: last.x + last.w - first.x, h: m.plot.h } : null;
  });

  /** Rows of the screen-reader table. */
  readonly table = computed(() => {
    const { labels, series } = this.source();
    const fmt = (v: unknown) => (typeof v === 'number' ? formatChartValue(v, this.format(), this.formatOptions()) : '');
    if (this.kind() === 'scatter') return { head: ['x', 'y'], rows: series.flatMap((s) => (s.data as { x: number; y: number }[]).map((p) => [s.name ?? '', fmt(p?.x), fmt(p?.y)])) };
    const count = Math.max(labels.length, ...series.map((s) => s.data.length), 0);
    return {
      head: series.map((s) => s.name ?? ''),
      rows: Array.from({ length: count }, (_, k) => [labels[k] ?? '', ...series.map((s) => fmt((s.data as unknown[])[k]))]),
    };
  });

  readonly summary = computed(() => {
    const own = this.ariaLabel() || this.heading();
    const names = this.source().series.map((s) => s.name).filter(Boolean);
    return [own, names.join(', ')].filter(Boolean).join(': ');
  });

  dim(series: number): boolean {
    const f = this.focusSeries();
    return f !== null && f !== series;
  }
  dimSlice(index: number): boolean {
    const f = this.focusSeries();
    const h = this.hovered();
    return (f !== null && f !== index) || (f === null && h !== null && h !== index);
  }
  dotR(d: { r: number; index: number }): number {
    return this.hovered() === d.index ? Math.max(d.r, 3.5) + 1.5 : d.r;
  }
  dy(t: ChartText): string | null {
    return t.baseline === 'hanging' ? '0.9em' : t.baseline === 'middle' ? '0.35em' : null;
  }
  rotate(t: ChartText): string | null {
    return t.rotate ? `rotate(${t.rotate} ${t.x} ${t.y})` : null;
  }
  sliceShift(s: { index: number; dx: number; dy: number }): string | null {
    return this.hovered() === s.index ? `translate(${s.dx}px, ${s.dy}px)` : null;
  }

  // ---------- pointer and keyboard ----------

  move(event: PointerEvent): void {
    const m = this.model();
    const svg = this.svgRef()?.nativeElement;
    if (!m || !svg || m.empty) return;
    const r = svg.getBoundingClientRect();
    const x = event.clientX - r.left;
    const y = event.clientY - r.top;
    this.pointer.set({ x, y });
    if (m.generic) {
      this.hoverKey.set(chartHit(m, x, y)?.key ?? null);
      return;
    }
    if (this.isRound()) {
      // Slices and rings light up as the pointer enters them; empty space around them lets go.
      if (!(event.target as Element | null)?.closest?.('.wu-chart-slice, .wu-chart-ring, .wu-chart-track')) this.hovered.set(null);
      return;
    }
    if (this.isCells()) {
      const cell = m.hover.find((h) => x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h);
      this.hoveredSeries.set(cell?.series ?? null);
      this.hovered.set(cell ? cell.index : null);
      return;
    }
    if (this.kind() === 'scatter') {
      let best: { index: number; series: number; d: number } | null = null;
      for (const d of m.dots) {
        const dist = Math.hypot(d.cx - x, d.cy - y) - d.r;
        if (dist < 16 && (!best || dist < best.d)) best = { index: d.index, series: d.series, d: dist };
      }
      this.hoveredSeries.set(best?.series ?? null);
      this.hovered.set(best?.index ?? null);
      return;
    }
    if (this.kind() === 'radar') {
      const cx = m.plot.x + m.plot.w / 2;
      const cy = m.plot.y + m.plot.h / 2;
      const count = m.hover.length;
      const angle = (Math.atan2(x - cx, cy - y) + Math.PI * 2) % (Math.PI * 2);
      this.hovered.set(count ? Math.round(angle / ((Math.PI * 2) / count)) % count : null);
      return;
    }
    const sel = this.selecting();
    if (sel) {
      const k = m.hover.find((h) => x >= h.x && x <= h.x + h.w)?.index;
      if (k !== undefined && k !== sel.to) {
        this.selecting.set({ from: sel.from, to: k });
        this.dragged = true;
      }
    }
    const band = m.hover.find((h) => x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h);
    this.hovered.set(band ? band.index : null);
    this.share(band ? band.index : null);
  }

  hoverSlice(index: number): void {
    this.hovered.set(index);
  }

  leave(): void {
    this.hoverKey.set(null);
    this.hovered.set(null);
    this.pointer.set(null);
    this.hoveredSeries.set(null);
    this.share(null);
  }

  /** Pointer down: start dragging across labels to zoom. */
  down(event: PointerEvent): void {
    const m = this.model();
    const svg = this.svgRef()?.nativeElement;
    if (!m || !svg || !this.zoomable() || event.button !== 0 || m.empty) return;
    const x = event.clientX - svg.getBoundingClientRect().left;
    const k = m.hover.find((h) => x >= h.x && x <= h.x + h.w)?.index;
    if (k === undefined) return;
    this.dragged = false;
    this.selecting.set({ from: k, to: k });
    svg.setPointerCapture?.(event.pointerId);
  }

  /** Pointer up: zoom into the labels dragged across. */
  up(): void {
    const sel = this.selecting();
    this.selecting.set(null);
    if (!sel || sel.from === sel.to) return;
    const offset = this.zoomed()?.[0] ?? 0;
    this.setZoom(offset + Math.min(sel.from, sel.to), offset + Math.max(sel.from, sel.to));
  }

  click(event: MouseEvent): void {
    if (this.dragged) {
      this.dragged = false;
      return;
    }
    const m = this.model();
    if (m?.generic) {
      this.pick(event);
      return;
    }
    const target = (event.target as Element | null)?.closest?.('[data-series]');
    const series = target ? Number(target.getAttribute('data-series')) : this.firstShownSeries();
    const index = target ? Number(target.getAttribute('data-index')) : this.hovered();
    if (index === null || index === undefined || !Number.isFinite(index)) return;
    this.emitClick(series, index, event);
  }

  /** ← → (↑ ↓ across) move between labels, Home / End, Enter or Space picks, Escape leaves. */
  key(event: KeyboardEvent): void {
    const m = this.model();
    if (!m || m.empty) return;
    if (m.generic) {
      this.keyGeneric(event, m);
      return;
    }
    // The stops the keys go through: labels, slices, rings, dots or cells.
    const stops: { index: number; series?: number }[] = this.isRound()
      ? (m.slices.length ? m.slices : m.rings).map((s) => ({ index: s.index }))
      : this.kind() === 'scatter'
        ? m.dots.map((d) => ({ index: d.index, series: d.series }))
        : m.hover.map((h) => ({ index: h.index, series: h.series }));
    if (!stops.length) return;
    const now = this.hovered();
    const at = now === null ? -1 : stops.findIndex((s) => s.index === now && (s.series === undefined || s.series === this.hoveredSeries()));
    let next: { index: number; series?: number } | null = null;
    const back = this.isHorizontal() ? 'ArrowUp' : 'ArrowLeft';
    const fwd = this.isHorizontal() ? 'ArrowDown' : 'ArrowRight';
    if (event.key === fwd || (event.key === 'ArrowRight' && this.isHorizontal()) || (event.key === 'ArrowDown' && !this.isHorizontal())) next = stops[Math.min(stops.length - 1, at + 1)];
    else if (event.key === back || (event.key === 'ArrowLeft' && this.isHorizontal()) || (event.key === 'ArrowUp' && !this.isHorizontal())) next = stops[Math.max(0, at <= 0 ? 0 : at - 1)];
    else if (event.key === 'Home') next = stops[0];
    else if (event.key === 'End') next = stops[stops.length - 1];
    else if ((event.key === 'Enter' || event.key === ' ') && now !== null) {
      event.preventDefault();
      this.emitClick(this.isCells() ? this.hoveredSeries() ?? 0 : this.firstShownSeries(), now, event);
      return;
    } else if (event.key === 'Escape') {
      this.leave();
      return;
    } else return;
    event.preventDefault();
    this.pointer.set(null);
    if (next.series !== undefined) this.hoveredSeries.set(next.series);
    this.hovered.set(next.index);
    this.share(next.index);
    const tip = this.tip();
    this.liveText.set(tip ? [tip.title, ...tip.rows.map((r) => `${r.name} ${r.value}`)].filter(Boolean).join(', ') : '');
  }

  /** Legend click: show or hide a series (pie: a slice). */
  toggle(index: number): void {
    const next = new Set(this.hidden());
    if (next.has(index)) next.delete(index);
    else next.add(index);
    this.hidden.set(next);
    const item = this.model()?.legend.find((l) => l.index === index);
    this.seriesToggle.emit({ index, name: item?.name ?? '', hidden: next.has(index) });
  }

  /** The newer kinds: ← → ↑ ↓ go target by target, Enter picks (a sunburst goes in), Escape leaves (and comes back out). */
  private keyGeneric(event: KeyboardEvent, m: ChartModel): void {
    const keys = [...new Set(m.hover.map((h) => h.key).filter((k): k is string => !!k))];
    if (!keys.length) return;
    const at = keys.indexOf(this.hoverKey() ?? '');
    let next: string | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = keys[Math.min(keys.length - 1, at + 1)];
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = keys[Math.max(0, at - 1)];
    else if (event.key === 'Home') next = keys[0];
    else if (event.key === 'End') next = keys[keys.length - 1];
    else if ((event.key === 'Enter' || event.key === ' ') && at >= 0) {
      event.preventDefault();
      this.pick(event);
      return;
    } else if (event.key === 'Escape') {
      if (this.focus()) this.drillOut();
      this.leave();
      return;
    } else return;
    event.preventDefault();
    this.pointer.set(null);
    this.hoverKey.set(next);
    const tip = this.tip();
    this.liveText.set(tip ? [tip.title, ...tip.rows.map((r) => `${r.name} ${r.value}`)].filter(Boolean).join(', ') : '');
  }

  /** A click (or Enter) on a newer kind: a sunburst node with children goes in, the middle comes back out; else `(pointClick)`. */
  private pick(event: Event): void {
    const m = this.model();
    const band = this.hoverBand();
    const at = this.pointer();
    if (m?.center && m.centerText && at && !band && Math.hypot(at.x - m.center.x, at.y - m.center.y) <= m.center.r) {
      this.drillOut();
      return;
    }
    if (!band) return;
    if (band.drill && band.key) {
      this.drillTo(band.key);
      this.liveText.set(band.label ?? '');
      return;
    }
    this.pointClick.emit({ series: band.series ?? 0, seriesName: '', index: band.index, label: band.label ?? band.tip?.title ?? '', value: band.value ?? NaN, originalEvent: event });
  }

  /** Sunburst: one level back out. */
  drillOut(): void {
    const path = (this.focus() || '').split('/').filter(Boolean);
    path.pop();
    this.drillTo(path.length ? path.join('/') : null);
  }

  /** Sunburst: show `key` in the middle, its rings fanning out again. */
  private drillTo(key: string | null): void {
    this.hoverKey.set(null);
    this.focus.set(key);
    this.frame.set(null);
    this.animateTo(this.target());
  }

  /** Shape classes: its own, how it comes in, and lit or faded by the pointer. */
  shapeClass(s: { className?: string; enter?: string; hover?: string; dashed?: boolean }, dimOthers: boolean): string {
    const key = this.hoverKey();
    const lit = !!key && !!s.hover && (key === s.hover || key.startsWith(s.hover + '/'));
    return [
      'wu-chart-shape',
      s.className || '',
      s.enter ? `wu-chart-in-${s.enter}` : '',
      s.dashed ? 'wu-chart-dashed' : '',
      lit ? 'wu-chart-lit' : '',
      dimOthers && key && s.hover && !lit ? 'wu-chart-dim' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  /** The type switcher: draw the same data as another kind, cross-fading from the old drawing. */
  setKind(next: ChartType): void {
    if (next === this.kind()) return;
    this.transition(() => {
      this.kind.set(next);
      this.typeChange.emit(next);
    });
  }

  /** The look picker: draw the same kind another way, cross-fading. */
  setLook(next: string): void {
    if (next === this.activeLook()) return;
    this.transition(() => {
      this.chosenLook.set(next);
      this.variantChange.emit(next);
    }, false);
  }

  /**
   * A new kind or look: the old drawing stays on top a moment, fading out, while the new one comes in under it as the
   * first time. `fresh` also forgets what the legend hid, the zoom and a sunburst's drill (they belong to the old kind).
   */
  private transition(apply: () => void, fresh = true): void {
    const svg = this.svgRef()?.nativeElement;
    const body = this.body()?.nativeElement;
    const motion = this.browser && this.animate() && !this.host.ownerDocument.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (motion && svg && body) {
      // The old drawing stays on top a moment, fading out, while the new one comes in under it.
      const ghost = svg.cloneNode(true) as SVGSVGElement;
      ghost.removeAttribute('tabindex');
      ghost.removeAttribute('role');
      ghost.removeAttribute('aria-label');
      ghost.removeAttribute('aria-labelledby');
      ghost.setAttribute('aria-hidden', 'true');
      ghost.classList.add('wu-chart-ghost');
      body.appendChild(ghost);
      setTimeout(() => ghost.remove(), GHOST_MS);
    }
    this.leave();
    if (fresh) {
      this.hidden.set(new Set());
      this.focus.set(null);
      this.zoomed.set(null);
    }
    apply();
    // Come in as the first time.
    this.frame.set(null);
    this.animateTo(this.target());
  }

  // ---------- toolbar ----------

  zoomIn(): void {
    const [a, b] = this.zoomed() || [0, this.labelCount() - 1];
    const cut = Math.max(1, Math.floor((b - a) / 4));
    if (b - cut > a + cut) this.setZoom(a + cut, b - cut);
  }

  zoomOut(): void {
    const z = this.zoomed();
    if (!z) return;
    const grow = Math.max(1, Math.ceil((z[1] - z[0]) / 2));
    this.setZoom(z[0] - grow, z[1] + grow);
  }

  resetZoom(): void {
    if (this.zoomed()) this.setZoom(0, this.labelCount() - 1);
  }

  /** The toolbar's download menu: save as PNG, SVG or CSV. */
  save(format: 'png' | 'svg' | 'csv'): void {
    this.menu.set(false);
    void this.download(this.fileName() || 'chart', format);
  }

  /** Focus left the toolbar: close its menu. */
  toolbarOut(event: FocusEvent): void {
    const into = event.relatedTarget as Node | null;
    if (!into || !(event.currentTarget as HTMLElement).contains(into)) this.menu.set(false);
  }

  /** Another chart of the group points at `index`: show the same label here. */
  ɵfollow(index: number | null): void {
    if (this.isRound() || this.isCells()) return;
    this.pointer.set(null);
    this.hovered.set(index);
  }

  // ---------- public ----------

  /** The chart as an SVG document, colours and fonts written in (for files and e-mail). */
  toSVG(): string {
    const svg = this.svgRef()?.nativeElement;
    if (!svg) return '';
    const clone = svg.cloneNode(true) as SVGSVGElement;
    const live = [svg, ...Array.from(svg.querySelectorAll<SVGElement>('*'))];
    const copies = [clone, ...Array.from(clone.querySelectorAll<SVGElement>('*'))];
    const props = ['fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-opacity', 'stroke-linecap', 'stop-color', 'stop-opacity', 'opacity', 'font-family', 'font-size', 'font-weight', 'transform'];
    live.forEach((el, i) => {
      const css = getComputedStyle(el);
      const copy = copies[i];
      for (const p of props) {
        const v = css.getPropertyValue(p);
        if (v && !(p === 'transform' && v === 'none')) copy.style.setProperty(p, v);
      }
      copy.removeAttribute('class');
      copy.removeAttribute('tabindex');
    });
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    return new XMLSerializer().serializeToString(clone);
  }

  /** The chart as a PNG data URL, `scale` times the size on screen, on `background` (default: the theme's card colour). */
  async toPNG(scale = 2, background?: string): Promise<string> {
    const m = this.model();
    const svg = this.toSVG();
    if (!m || !svg) return '';
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    await img.decode();
    const canvas = this.host.ownerDocument.createElement('canvas');
    canvas.width = Math.round(m.width * scale);
    canvas.height = Math.round(m.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.fillStyle = background || getComputedStyle(this.host).getPropertyValue('--wu-card-bg').trim() || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  }

  /** The numbers as CSV: a row per label, a column per series (scatter: series, x, y). Excel opens it with Thai intact. */
  toCSV(): string {
    const { labels, series } = this.source();
    const cell = (v: unknown) => {
      const t = v === null || v === undefined ? '' : String(v);
      return /[",\r\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
    };
    let rows: unknown[][];
    if (this.kind() === 'scatter') {
      rows = [['', 'x', 'y'], ...series.flatMap((s) => (s.data as { x: number; y: number }[]).map((p) => [s.name ?? '', p?.x, p?.y]))];
    } else {
      const count = Math.max(labels.length, ...series.map((s) => s.data.length), 0);
      rows = [['', ...series.map((s) => s.name ?? '')], ...Array.from({ length: count }, (_, k) => [labels[k] ?? '', ...series.map((s) => (s.data as unknown[])[k])])];
    }
    return rows.map((r) => r.map(cell).join(',')).join('\r\n');
  }

  /** Saves the chart as `<fileName>.png`, `.svg` or `.csv` (the numbers). */
  async download(fileName = 'chart', format: 'png' | 'svg' | 'csv' = 'png'): Promise<void> {
    const doc = this.host.ownerDocument;
    const url =
      format === 'csv'
        ? 'data:text/csv;charset=utf-8,' + encodeURIComponent('\ufeff' + this.toCSV())
        : format === 'svg'
          ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(this.toSVG())
          : await this.toPNG();
    if (!url) return;
    const a = doc.createElement('a');
    a.href = url;
    a.download = `${fileName}.${format}`;
    a.style.display = 'none';
    doc.body.appendChild(a);
    a.click();
    a.remove();
  }

  /** Draws again (after changing `series` in place). */
  refresh(): void {
    this.lastTarget = this.target();
    this.frame.set(this.lastTarget);
  }

  // ---------- internals ----------

  private labelCount(): number {
    const { labels, series } = this.source();
    return Math.max(labels.length, ...series.map((s) => s.data.length), 0);
  }

  /** Zoom into labels `a` … `b` (all of them: back out), at once. */
  private setZoom(a: number, b: number): void {
    const last = this.labelCount() - 1;
    const from = Math.max(0, Math.min(a, b));
    const to = Math.min(last, Math.max(a, b));
    const all = from <= 0 && to >= last;
    if (to <= from && !all) return;
    this.instant = true;
    this.leave();
    this.zoomed.set(all ? null : [from, to]);
    this.zoomChange.emit(all ? null : { from, to });
  }

  /** Point the group's other charts at `index`. */
  private share(index: number | null): void {
    const name = this.group();
    if (!name) return;
    for (const other of GROUPS.get(name) || []) if (other !== this) other.ɵfollow(index);
  }

  private firstShownSeries(): number {
    const i = this.source().series.findIndex((s, k) => !s.hidden && !this.hidden().has(k));
    return Math.max(0, i);
  }

  private emitClick(series: number, index: number, event: Event): void {
    const { labels, series: all } = this.target();
    const s = all[series];
    if (!s) return;
    const raw = (s.data as unknown[])[index];
    const value = typeof raw === 'number' ? raw : raw && typeof raw === 'object' ? Number((raw as { y?: number }).y) : NaN;
    if (!Number.isFinite(value)) return;
    // The index in the whole data, not in the zoomed part.
    const offset = this.zoomable() ? this.zoomed()?.[0] ?? 0 : 0;
    this.pointClick.emit({ series, seriesName: s.name ?? '', index: index + offset, label: labels[index] ?? '', value, originalEvent: event });
  }

  private measure(text: string, size: number): number {
    if (!this.browser) return text.length * size * 0.56;
    if (!this.canvas) this.canvas = this.host.ownerDocument.createElement('canvas').getContext('2d');
    if (!this.canvas) return text.length * size * 0.56;
    this.canvas.font = `${size}px ${this.font() || this.fontFamily || 'sans-serif'}`;
    return this.canvas.measureText(text).width;
  }

  private animateTo(target: Frame): void {
    this.lastTarget = target;
    if (this.raf) cancelAnimationFrame(this.raf);
    const from = this.frame();
    const instant = this.instant;
    this.instant = false;
    const still =
      instant ||
      !this.browser ||
      !this.animate() ||
      typeof requestAnimationFrame === 'undefined' ||
      !!this.host.ownerDocument.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    // Raw values, ranges, nodes and units do not move value by value: their shapes come in on their own, and the
    // sunburst fans out.
    const moves = chartMovesValues(this.kind());
    if (still || (!moves && this.kind() !== 'sunburst')) {
      this.raf = 0;
      this.animating.set(false);
      this.entering.set(false);
      this.progress.set(1);
      this.frame.set(target);
      return;
    }
    // New labels start from nothing; the same labels move from where they are.
    const start = from && from.labels.length === target.labels.length ? from : null;
    // A pie fans out with its final slices, cells and tiles come in as they are; everything else moves its values.
    const fan = !moves || (!start && ((this.isRound() && this.kind() !== 'radialBar') || this.isCells()));
    const at = (t: number) => (t >= 1 || fan ? target : between(start, target, t));
    this.scalesFrom.set(start ? this.model()?.scales ?? null : null);
    this.entering.set(!start);
    this.progress.set(0);
    this.animating.set(true);
    const t0 = performance.now();
    const step = () => {
      const t = Math.min(1, (performance.now() - t0) / ANIMATION_MS);
      this.progress.set(ease(t));
      this.frame.set(at(ease(t)));
      if (t < 1) {
        this.raf = requestAnimationFrame(step);
      } else {
        this.raf = 0;
        this.animating.set(false);
        this.entering.set(false);
        this.scalesFrom.set(null);
      }
    };
    this.frame.set(at(0));
    this.raf = requestAnimationFrame(step);
  }
}

/** An axis part-way (`t` 0–1) from `from` to `to`; the ticks are the final ones, moving into place. */
function slide(from: ChartAxisScale | null | undefined, to: ChartAxisScale | null | undefined, t: number): ChartAxisScale | undefined {
  if (!to) return undefined;
  if (!from) return to;
  return { min: from.min + (to.min - from.min) * t, max: from.max + (to.max - from.max) * t, ticks: to.ticks };
}

function optionalNumber(v: unknown): number | undefined {
  return v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? undefined : Number(v);
}

/** Chart.js `cutout: '60%'` → 0.6. */
function cutoutOf(v: unknown): number | undefined {
  if (typeof v === 'number') return v > 1 ? undefined : v;
  if (typeof v === 'string' && /%$/.test(v)) return Number(v.slice(0, -1)) / 100;
  return undefined;
}

/**
 * The frame part-way (`t` 0–1) from `from` to `to`: shown values move from where they were (or from 0), a series being
 * hidden shrinks to nothing before it goes, and pie slices being hidden shrink the same way (their value is 0 in `to`).
 */
function between(from: Frame | null, to: Frame, t: number): Frame {
  const series = to.series.map((s, i) => {
    const prev = from?.series[i];
    const wasShown = !!prev && !prev.hidden;
    if (s.hidden && !wasShown) return s;
    const data = (s.data as unknown[]).map((v, k) => {
      const p = wasShown ? (prev!.data as unknown[])[k] : 0;
      const a = typeof p === 'number' && Number.isFinite(p) ? p : 0;
      if (s.hidden) return a * (1 - t);
      return typeof v === 'number' ? a + (v - a) * t : (v as null);
    });
    return { ...s, data, hidden: false } as ChartSeries;
  });
  // Slices hidden before and after stay hidden; ones on their way out shrink first.
  const hiddenSlices = from ? from.hiddenSlices.filter((k) => to.hiddenSlices.includes(k)) : to.hiddenSlices;
  return { labels: to.labels, series, hiddenSlices };
}
