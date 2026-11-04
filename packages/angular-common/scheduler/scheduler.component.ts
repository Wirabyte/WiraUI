import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵWU_SKIP_VERSION_CHECK,
  WuConfig,
  WuTemplate,
} from '@wirabyte/ui/config';
import { toDateValue } from '@wirabyte/ui/core';
import {
  WuSchedulerDateClickEvent,
  WuSchedulerEvent,
  WuSchedulerEventChangeEvent,
  WuSchedulerEventClickEvent,
  WuSchedulerView,
  ɵWuPlacedEvent,
} from './scheduler.types';

const DAY = 86400000;
const VIEWS: readonly WuSchedulerView[] = ['day', 'week', 'month'];
const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const toInt = (v: unknown, fallback: number, min: number, max: number): number => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, d.getHours(), d.getMinutes());
const sameDay = (a: Date, b: Date): boolean => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const pad = (n: number): string => String(n).padStart(2, '0');

/** One day column of the day / week views, or one cell of the month grid. */
interface DayCell {
  key: string;
  date: Date;
  today: boolean;
  outside: boolean;
  allDay: ɵWuPlacedEvent[];
  timed: ɵWuPlacedEvent[];
}

/**
 * Appointments on a calendar: `<wu-scheduler [events]="appointments" [(view)]="view" [(date)]="day" [editable]="true"
 * (onEventChange)="move($event)" (onDateClick)="create($event)">`. A month grid, a week or a day of hours
 * (`startHour`–`endHour`), all-day events in their own row, overlapping events side by side, a line at the current
 * time. Years follow the app's calendar (พ.ศ. in Thai). With `editable`, events are dragged to another day or time
 * (snapped to `slotMinutes`); the scheduler emits the new times and the app updates `events`.
 */
@Component({
  selector: 'wu-scheduler',
  standalone: true,
  imports: [NgFor, NgIf, NgTemplateOutlet],
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-scheduler-host' },
})
export class WuScheduler implements OnDestroy {
  @Input() set events(v: WuSchedulerEvent[] | null | undefined) {
    this._events = Array.isArray(v) ? v : [];
    this.cache = null;
  }
  get events(): WuSchedulerEvent[] {
    return this._events;
  }
  @Input() set view(v: WuSchedulerView | null | undefined) {
    this._view = VIEWS.includes(v as WuSchedulerView) ? (v as WuSchedulerView) : 'week';
    this.cache = null;
  }
  get view(): WuSchedulerView {
    return this._view;
  }
  /** The day the view shows (week and month views: the period around it). Default: today. */
  @Input() set date(v: Date | string | number | null | undefined) {
    this._date = startOfDay(toDateValue(v) || new Date());
    this.cache = null;
  }
  get date(): Date {
    return this._date;
  }
  /** The view buttons offered. Default all three. */
  @Input() views: WuSchedulerView[] | null | undefined = ['day', 'week', 'month'];
  /** First and last hour of the day and week views. Default 7–20. */
  @Input() set startHour(v: unknown) { this._startHour = toInt(v, 7, 0, 23); this.cache = null; }
  get startHour(): number { return this._startHour; }
  @Input() set endHour(v: unknown) { this._endHour = toInt(v, 20, 1, 24); this.cache = null; }
  get endHour(): number { return this._endHour; }
  /** Rows of the time grid, and where a dragged event snaps to. Default 30 minutes. */
  @Input() set slotMinutes(v: unknown) { this._slot = toInt(v, 30, 5, 60); this.cache = null; }
  get slotMinutes(): number { return this._slot; }
  /** First day of the week, 0 = Sunday. Default: the locale's. */
  @Input() firstDayOfWeek?: number | null;
  /** Events can be dragged to another day or time. */
  @Input() set editable(v: unknown) { this._editable = ɵtoBool(v); }
  get editable(): boolean { return this._editable; }
  /** Events a month cell lists before "+N more". Default 3. */
  @Input() set maxEventsPerDay(v: unknown) { this._max = toInt(v, 3, 1, 20); }
  get maxEventsPerDay(): number { return this._max; }
  /** Height of the day and week views' hour grid area. Default: the theme's hour height × the hours shown. */
  @Input() height?: string | number | null;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  @Output() readonly viewChange = new EventEmitter<WuSchedulerView>();
  @Output() readonly dateChange = new EventEmitter<Date>();
  @Output() readonly onEventClick = new EventEmitter<WuSchedulerEventClickEvent>();
  @Output() readonly onDateClick = new EventEmitter<WuSchedulerDateClickEvent>();
  @Output() readonly onEventChange = new EventEmitter<WuSchedulerEventChangeEvent>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('event', { descendants: false }) protected eventRef?: unknown;

  private _events: WuSchedulerEvent[] = [];
  private _view: WuSchedulerView = 'week';
  private _date = startOfDay(new Date());
  private _startHour = 7;
  private _endHour = 20;
  private _slot = 30;
  private _editable = false;
  private _max = 3;
  private cache: { key: string; days: DayCell[] } | null = null;
  private dragged: WuSchedulerEvent | null = null;
  private now = new Date();
  private readonly timer = typeof window !== 'undefined' ? window.setInterval(() => this.tick(), 60000) : 0;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();
  private readonly translated = this.config.translationChange.subscribe(() => (this.cache = null));

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    this.i18n.unsubscribe();
    this.translated.unsubscribe();
  }

  // ---------- what the template reads ----------

  get t() {
    return this.config.translation.scheduler;
  }
  get eventTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.eventRef) || ɵfindTemplate(this.templates, 'event');
  }
  get rootClass(): string {
    return ['wu-scheduler', `wu-scheduler-${this._view}`, this._editable ? 'wu-scheduler-editable' : '', this.styleClass || ''].filter(Boolean).join(' ');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> {
    const own = this.style && typeof this.style === 'object' ? this.style : {};
    const h = this.height;
    const height = h === null || h === undefined || h === '' ? undefined : typeof h === 'number' || /^\d+(\.\d+)?$/.test(String(h)) ? `${h}px` : String(h);
    return { ...own, '--_hours': String(this.hours.length), ...(height ? { '--_grid-height': height } : {}) };
  }
  get viewButtons(): WuSchedulerView[] {
    return (this.views || VIEWS).filter((v) => VIEWS.includes(v));
  }
  viewLabel(v: WuSchedulerView): string {
    return this.t?.[v] ?? v;
  }
  get hours(): number[] {
    const out: number[] = [];
    for (let h = this._startHour; h < Math.max(this._startHour + 1, this._endHour); h++) out.push(h);
    return out;
  }
  get weekdayNames(): string[] {
    const names = this.config.translation.dayNamesShort || [];
    const first = this.weekStart;
    return Array.from({ length: 7 }, (_, i) => names[(first + i) % 7] ?? '');
  }
  get days(): DayCell[] {
    const key = `${this._view}|${this._date.getTime()}|${this.weekStart}|${this._startHour}|${this._endHour}|${startOfDay(this.now).getTime()}`;
    if (!this.cache || this.cache.key !== key) this.cache = { key, days: this.build() };
    return this.cache.days;
  }
  /** Month view: the days in rows of seven. */
  get weeks(): DayCell[][] {
    const d = this.days;
    const out: DayCell[][] = [];
    for (let i = 0; i < d.length; i += 7) out.push(d.slice(i, i + 7));
    return out;
  }
  get title(): string {
    const d = this._date;
    if (this._view === 'month') return `${this.monthName(d)} ${this.year(d)}`;
    if (this._view === 'day') return `${this.dayName(d)} ${d.getDate()} ${this.monthName(d)} ${this.year(d)}`;
    const days = this.days;
    const a = days[0].date;
    const b = days[days.length - 1].date;
    if (a.getMonth() === b.getMonth()) return `${a.getDate()}–${b.getDate()} ${this.monthName(b)} ${this.year(b)}`;
    if (a.getFullYear() === b.getFullYear()) return `${a.getDate()} ${this.monthShort(a)} – ${b.getDate()} ${this.monthShort(b)} ${this.year(b)}`;
    return `${a.getDate()} ${this.monthShort(a)} ${this.year(a)} – ${b.getDate()} ${this.monthShort(b)} ${this.year(b)}`;
  }
  dayHeader(cell: DayCell): string {
    return `${this.weekdayShort(cell.date)} ${cell.date.getDate()}`;
  }
  hourLabel(h: number): string {
    return `${pad(h)}:00`;
  }
  /** The current-time line: % down the visible hours, or `null` outside them. */
  nowTop(cell: DayCell): number | null {
    if (!cell.today) return null;
    const minutes = this.now.getHours() * 60 + this.now.getMinutes() - this._startHour * 60;
    const span = (this.hours.length || 1) * 60;
    return minutes < 0 || minutes > span ? null : (minutes / span) * 100;
  }
  visible(cell: DayCell): ɵWuPlacedEvent[] {
    return [...cell.allDay, ...cell.timed].slice(0, this._max);
  }
  hidden(cell: DayCell): number {
    return Math.max(0, cell.allDay.length + cell.timed.length - this._max);
  }
  moreText(n: number): string {
    return (this.t?.more ?? '+{count} more').replace('{count}', String(n));
  }
  eventStyle(p: ɵWuPlacedEvent): Record<string, string> {
    const style: Record<string, string> = {};
    if (p.event.color) {
      style['--_ev'] = p.event.color;
      style['--_ev-bg'] = `color-mix(in srgb, ${p.event.color} 16%, var(--wu-card-bg))`;
    }
    return style;
  }
  placedStyle(p: ɵWuPlacedEvent): Record<string, string> {
    return { ...this.eventStyle(p), top: p.top + '%', height: p.height + '%', left: p.left + '%', width: p.width + '%' };
  }
  canDrag(p: ɵWuPlacedEvent): boolean {
    return this._editable && p.event.editable !== false;
  }
  trackCell(_: number, c: DayCell): string {
    return c.key;
  }
  trackEvent(_: number, p: ɵWuPlacedEvent): string {
    return p.key;
  }

  // ---------- navigation ----------

  setView(v: WuSchedulerView): void {
    if (v === this._view) return;
    this.view = v;
    this.viewChange.emit(v);
  }
  move(step: -1 | 1): void {
    const d = this._date;
    const next =
      this._view === 'month'
        ? new Date(d.getFullYear(), d.getMonth() + step, 1)
        : addDays(d, step * (this._view === 'week' ? 7 : 1));
    this.go(next);
  }
  goToday(): void {
    this.go(new Date());
  }
  /** Month view: a day's "+N more" opens that day. */
  openDay(date: Date): void {
    this.go(date);
    this.setView('day');
  }

  // ---------- clicks and drags ----------

  eventClick(event: Event, p: ɵWuPlacedEvent): void {
    event.stopPropagation();
    this.onEventClick.emit({ originalEvent: event, event: p.event });
  }
  /** A click on an empty month cell. */
  cellClick(event: Event, cell: DayCell): void {
    this.onDateClick.emit({ originalEvent: event, date: new Date(cell.date), allDay: true });
  }
  /** A click on the hour grid: the slot under the pointer. */
  slotClick(event: MouseEvent, cell: DayCell): void {
    this.onDateClick.emit({ originalEvent: event, date: this.timeAt(event, cell), allDay: false });
  }
  allDayClick(event: Event, cell: DayCell): void {
    this.onDateClick.emit({ originalEvent: event, date: new Date(cell.date), allDay: true });
  }
  dragStart(event: DragEvent, p: ɵWuPlacedEvent): void {
    if (!this.canDrag(p)) {
      event.preventDefault();
      return;
    }
    this.dragged = p.event;
    event.dataTransfer?.setData('text/plain', p.event.title);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }
  dragOver(event: DragEvent): void {
    if (!this.dragged) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }
  dragEnd(): void {
    this.dragged = null;
  }
  /** Dropped on a month cell or an all-day row: same time of day, another date. */
  dropOnDay(event: DragEvent, cell: DayCell): void {
    const ev = this.dragged;
    if (!ev) return;
    event.preventDefault();
    const [start, end] = this.range(ev);
    const shift = startOfDay(cell.date).getTime() - startOfDay(start).getTime();
    this.dragged = null;
    if (shift) this.onEventChange.emit({ event: ev, start: new Date(start.getTime() + shift), end: new Date(end.getTime() + shift) });
  }
  /** Dropped on the hour grid: the slot under the pointer, same length. */
  dropOnTime(event: DragEvent, cell: DayCell): void {
    const ev = this.dragged;
    if (!ev) return;
    event.preventDefault();
    const [start, end] = this.range(ev);
    const at = this.timeAt(event, cell);
    this.dragged = null;
    if (at.getTime() !== start.getTime()) this.onEventChange.emit({ event: ev, start: at, end: new Date(at.getTime() + (end.getTime() - start.getTime())) });
  }

  // ---------- internals ----------

  private get weekStart(): number {
    const f = this.firstDayOfWeek ?? this.config.translation.firstDayOfWeek ?? 0;
    return toInt(f, 0, 0, 6);
  }

  private go(date: Date): void {
    this.date = date;
    this.dateChange.emit(new Date(this._date));
    this.cdr.markForCheck();
  }

  private tick(): void {
    this.now = new Date();
    this.cdr.markForCheck();
  }

  /** The slot under the pointer on a day column, snapped to `slotMinutes`. */
  private timeAt(event: MouseEvent, cell: DayCell): Date {
    const el = event.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const span = (this.hours.length || 1) * 60;
    const raw = r.height > 0 ? ((event.clientY - r.top) / r.height) * span : 0;
    const minutes = Math.max(0, Math.min(span - this._slot, Math.floor(raw / this._slot) * this._slot));
    const d = new Date(cell.date);
    d.setHours(this._startHour, minutes, 0, 0);
    return d;
  }

  private range(ev: WuSchedulerEvent): [Date, Date] {
    const start = toDateValue(ev.start) || new Date(NaN);
    const end = toDateValue(ev.end ?? null);
    if (end && end.getTime() > start.getTime()) return [start, end];
    return [start, ev.allDay ? addDays(startOfDay(start), 1) : new Date(start.getTime() + 3600000)];
  }

  private build(): DayCell[] {
    const today = startOfDay(this.now);
    let first: Date;
    let count: number;
    if (this._view === 'day') {
      first = this._date;
      count = 1;
    } else if (this._view === 'week') {
      first = addDays(this._date, -((this._date.getDay() - this.weekStart + 7) % 7));
      count = 7;
    } else {
      const m = new Date(this._date.getFullYear(), this._date.getMonth(), 1);
      first = addDays(m, -((m.getDay() - this.weekStart + 7) % 7));
      count = 42;
    }
    const cells: DayCell[] = [];
    for (let i = 0; i < count; i++) {
      const date = addDays(first, i);
      cells.push({
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        date,
        today: sameDay(date, today),
        outside: this._view === 'month' && date.getMonth() !== this._date.getMonth(),
        allDay: [],
        timed: [],
      });
    }
    const span = (this.hours.length || 1) * 60;
    this._events.forEach((ev, index) => {
      const [start, end] = this.range(ev);
      if (Number.isNaN(start.getTime())) return;
      for (const cell of cells) {
        const dayStart = cell.date.getTime();
        const dayEnd = dayStart + DAY;
        if (start.getTime() >= dayEnd || end.getTime() <= dayStart) continue;
        const multi = !sameDay(start, new Date(end.getTime() - 1));
        const placed: ɵWuPlacedEvent = {
          key: `${ev.id ?? index}@${cell.key}`,
          event: ev,
          start,
          end,
          top: 0,
          height: 0,
          left: 0,
          width: 100,
          time: ev.allDay || multi ? '' : `${pad(start.getHours())}:${pad(start.getMinutes())}`,
        };
        if (ev.allDay || multi || this._view === 'month') {
          if (ev.allDay || multi) cell.allDay.push(placed);
          else cell.timed.push(placed);
          continue;
        }
        const from = Math.max(0, start.getHours() * 60 + start.getMinutes() - this._startHour * 60);
        const to = Math.min(span, (end.getTime() - dayStart) / 60000 - this._startHour * 60);
        if (to <= 0 || from >= span) continue;
        placed.top = (from / span) * 100;
        placed.height = Math.max(((to - from) / span) * 100, (this._slot / 2 / span) * 100);
        cell.timed.push(placed);
      }
    });
    for (const cell of cells) {
      cell.timed.sort((a, b) => a.start.getTime() - b.start.getTime() || b.end.getTime() - a.end.getTime());
      if (this._view !== 'month') lanes(cell.timed);
    }
    return cells;
  }

  private year(d: Date): number {
    return d.getFullYear() + (this.config.calendarFor() === 'buddhist' ? 543 : 0);
  }
  private monthName(d: Date): string {
    return this.config.translation.monthNames?.[d.getMonth()] ?? String(d.getMonth() + 1);
  }
  private monthShort(d: Date): string {
    return this.config.translation.monthNamesShort?.[d.getMonth()] ?? String(d.getMonth() + 1);
  }
  private dayName(d: Date): string {
    return this.config.translation.dayNames?.[d.getDay()] ?? '';
  }
  private weekdayShort(d: Date): string {
    return this.config.translation.dayNamesShort?.[d.getDay()] ?? '';
  }
}

/** Overlapping events share the column: each cluster of overlaps is split into as many equal lanes as it needs. */
function lanes(events: ɵWuPlacedEvent[]): void {
  let cluster: ɵWuPlacedEvent[] = [];
  let clusterEnd = -Infinity;
  const flush = () => {
    const laneEnds: number[] = [];
    const laneOf = new Map<ɵWuPlacedEvent, number>();
    for (const e of cluster) {
      let lane = laneEnds.findIndex((t) => t <= e.top);
      if (lane < 0) lane = laneEnds.push(0) - 1;
      laneEnds[lane] = e.top + e.height;
      laneOf.set(e, lane);
    }
    const n = laneEnds.length || 1;
    for (const e of cluster) {
      e.width = 100 / n;
      e.left = (laneOf.get(e) || 0) * e.width;
    }
    cluster = [];
  };
  for (const e of events) {
    if (cluster.length && e.top >= clusterEnd) flush();
    cluster.push(e);
    clusterEnd = Math.max(clusterEnd === -Infinity ? 0 : clusterEnd, e.top + e.height);
    if (cluster.length === 1) clusterEnd = e.top + e.height;
  }
  if (cluster.length) flush();
}
