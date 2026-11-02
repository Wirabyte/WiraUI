import {
  addMonths,
  CalendarDay,
  calendarWeeks,
  clampDate,
  clampTimeField,
  compareDays,
  DateLimits,
  daysInMonth,
  displayYear,
  from12Hour,
  HourFormat,
  isDaySelectable,
  isMonthSelectable,
  isValidDate,
  isYearSelectable,
  moveDay,
  parseTypedDate,
  sameDay,
  splitDates,
  startOfDay,
  timeFormat,
  TimeUnit,
  to12Hour,
  weekdayOrder,
  wrapStep,
  yearPage,
} from './date';
import { CalendarSystem, formatDate } from './thai/buddhist';
import { TH_LOCALE, WuLocale } from './thai/locale';

export type DateSelectionMode = 'single' | 'multiple' | 'range';
/** What a cell of the panel is: a day, a month or a year. */
export type DatePickerView = 'date' | 'month' | 'year';
/** single: a Date. multiple: Date[]. range: [start, end], end null until it is picked. */
export type DatePickerValue = Date | (Date | null)[] | null;

export interface DatePickerOptions extends DateLimits {
  selectionMode?: DateSelectionMode;
  /** The smallest thing picked: `'month'` picks a month (its 1st day), `'year'` a year (1 January). Default `'date'`. */
  view?: DatePickerView;
  /** 0 = Sunday. Default: the locale's. */
  firstDayOfWeek?: number;
  /** `'buddhist'` shows years as พ.ศ.; values stay ordinary Dates. Default `'gregorian'`. */
  calendar?: CalendarSystem;
  locale?: WuLocale;
  /** `formatDate()` pattern of the date part. Default: the locale's, or `MMMM yyyy` / `yyyy` for the month and year views. */
  dateFormat?: string;
  showTime?: boolean;
  timeOnly?: boolean;
  showSeconds?: boolean;
  hourFormat?: HourFormat;
  stepHour?: number;
  stepMinute?: number;
  stepSecond?: number;
  /** multiple: most dates that can be picked. */
  maxDateCount?: number | null;
  /** Days of the months before and after can be picked (the view moves there). Default true. */
  selectOtherMonths?: boolean;
  /** Years (ค.ศ.) the year view offers, `[first, last]`. Days outside can still be picked from the day view. */
  yearRange?: [number, number] | null;
}

export interface DayCell extends CalendarDay {
  selectable: boolean;
  selected: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  /** Strictly between the start and the end of a range. */
  inRange: boolean;
  /** Takes keyboard focus (the one cell with tabindex 0). */
  focused: boolean;
  /** The whole date, for screen readers. */
  label: string;
}

export interface MonthCell {
  month: number;
  label: string;
  selected: boolean;
  /** The month of today. */
  current: boolean;
  selectable: boolean;
  focused: boolean;
}

export interface YearCell {
  /** ค.ศ. */
  year: number;
  /** As people see it: พ.ศ. for the Buddhist calendar. */
  label: string;
  selected: boolean;
  current: boolean;
  selectable: boolean;
  /** One of the two years at the edges of the page, outside its decade. */
  outside: boolean;
  focused: boolean;
}

/** What a pick did: `changed` the value; `close` means a popup has what it needs and can close. */
export interface PickResult {
  changed: boolean;
  close: boolean;
}

const NOTHING: PickResult = { changed: false, close: false };
const RANK: Record<DatePickerView, number> = { date: 0, month: 1, year: 2 };
const RANGE_SEPARATOR = /\s+-\s+|\s*[–~]\s*/;
const MULTIPLE_SEPARATOR = /\s*,\s*/;

/**
 * Everything a date picker does except drawing it: the month, month and year grids, what is selected, keyboard moves,
 * the time fields, and the text of the input. Framework-free; the Angular components keep one and render from it.
 */
export class DatePickerState {
  value: DatePickerValue = null;
  /** The grid on show. Starts at `options.view` and goes up to months and years from the header. */
  view: DatePickerView = 'date';
  viewYear: number;
  viewMonth: number;
  /** Cell that has keyboard focus, as a day: its month in the month view, its year in the year view. */
  focus: Date;
  /** Time the time fields show, on the 24-hour clock. */
  hour = 0;
  minute = 0;
  second = 0;

  private o: DatePickerOptions = {};

  constructor(options: DatePickerOptions = {}, private readonly now: () => Date = () => new Date()) {
    const today = now();
    this.viewYear = today.getFullYear();
    this.viewMonth = today.getMonth();
    this.focus = startOfDay(today);
    this.configure(options);
    this.syncTime();
  }

  configure(options: DatePickerOptions): void {
    const modeChanged = (options.selectionMode || 'single') !== this.mode;
    this.o = { ...options };
    if (RANK[this.view] < RANK[this.baseView]) this.view = this.baseView;
    if (modeChanged) this.value = this.normalize(this.value);
  }

  get options(): Readonly<DatePickerOptions> {
    return this.o;
  }
  get mode(): DateSelectionMode {
    return this.o.selectionMode || 'single';
  }
  get baseView(): DatePickerView {
    return this.o.timeOnly ? 'date' : this.o.view || 'date';
  }
  get locale(): WuLocale {
    return this.o.locale || TH_LOCALE;
  }
  get calendar(): CalendarSystem {
    return this.o.calendar || 'gregorian';
  }
  get hourFormat(): HourFormat {
    return this.o.hourFormat === '12' ? '12' : '24';
  }
  get firstDayOfWeek(): number {
    return this.o.firstDayOfWeek ?? this.locale.firstDayOfWeek ?? 0;
  }
  get hasTime(): boolean {
    return !!(this.o.showTime || this.o.timeOnly);
  }
  get pm(): boolean {
    return this.hour >= 12;
  }

  // ---------- value ----------

  /** Takes a value from the model: Dates, ISO strings (`2026-03-12`, `2026-03-12T14:30`) or timestamps. */
  setValue(v: unknown): void {
    this.value = this.normalize(v);
    this.syncTime();
    const anchor = this.anchor();
    if (anchor) this.showDate(anchor);
  }

  /** The picked dates, in order. */
  get dates(): Date[] {
    const v = this.value;
    if (!v) return [];
    return v instanceof Date ? [v] : (v.filter((d) => !!d) as Date[]);
  }

  /** Text for the input box. Ranges are joined with ` - `, several dates with `, `. */
  text(): string {
    const v = this.value;
    if (!v) return '';
    if (v instanceof Date) return this.format(v);
    if (this.mode === 'range') return v[0] ? this.format(v[0]) + (v[1] ? ' - ' + this.format(v[1]) : '') : '';
    return this.dates.map((d) => this.format(d)).join(', ');
  }

  format(date: Date): string {
    return formatDate(date, this.pattern, { locale: this.locale, calendar: this.calendar });
  }

  /** The whole pattern of one date in the input, time included. */
  get pattern(): string {
    if (this.o.timeOnly) return this.timePattern;
    return this.o.showTime ? this.datePattern + ' ' + this.timePattern : this.datePattern;
  }
  get datePattern(): string {
    if (this.o.dateFormat) return this.o.dateFormat;
    const base = this.baseView;
    return base === 'year' ? 'yyyy' : base === 'month' ? 'MMMM yyyy' : this.locale.dateFormat;
  }
  get timePattern(): string {
    return timeFormat({ hourFormat: this.hourFormat, showSeconds: this.o.showSeconds });
  }

  /**
   * Reads typed text. `ok` is false when a date does not parse or cannot be picked (outside minDate–maxDate, disabled);
   * pass `check = false` to read a model string without those limits. Empty text is a valid "nothing".
   */
  parse(text: string, check = true): { ok: boolean; value: DatePickerValue } {
    const t = String(text ?? '').trim();
    if (!t) return { ok: true, value: null };
    const one = (s: string) => {
      const d = parseTypedDate(s, this.pattern, {
        locale: this.locale,
        calendar: this.calendar,
        time: !!this.o.showTime,
        timeOnly: !!this.o.timeOnly,
        hourFormat: this.hourFormat,
        datePattern: this.datePattern,
        base: this.timeTarget || this.now(),
      });
      return d && (!check || this.allowed(d)) ? d : null;
    };
    const fail = { ok: false, value: this.value };
    if (this.mode === 'single') {
      const d = one(t);
      return d ? { ok: true, value: d } : fail;
    }
    const parts = splitDates(t, this.mode === 'range' ? RANGE_SEPARATOR : MULTIPLE_SEPARATOR, one);
    if (!parts || !parts.length) return fail;
    const dates = parts.map((p) => one(p) as Date);
    if (this.mode === 'range') {
      if (dates.length > 2 || (dates[1] && dates[1].getTime() < dates[0].getTime())) return fail;
      return { ok: true, value: [dates[0], dates[1] || null] };
    }
    const max = this.o.maxDateCount;
    return max && dates.length > max ? fail : { ok: true, value: dates };
  }

  // ---------- opening and moving around ----------

  /** Resets the panel for opening: the grid of `options.view`, showing the picked date, `defaultDate` or today. */
  open(defaultDate?: Date | null): void {
    this.view = this.baseView;
    const start = this.anchor() || (isValidDate(defaultDate) ? defaultDate : null) || this.now();
    const shown = this.clampDay(startOfDay(start));
    this.showDate(shown);
    this.focus = shown;
    this.syncTime(isValidDate(defaultDate) ? defaultDate : null);
  }

  /** Header text: the month name, the year, and the decade of the year view (`2560 – 2569`). */
  get monthLabel(): string {
    return this.locale.monthNames[this.viewMonth];
  }
  get yearLabel(): string {
    return String(displayYear(this.viewYear, this.calendar));
  }
  get decadeLabel(): string {
    const page = yearPage(this.viewYear, this.calendar);
    return `${displayYear(page.first, this.calendar)} – ${displayYear(page.last, this.calendar)}`;
  }

  /** False when the page before (-1) or after (1) has nothing that can be picked. */
  canGo(direction: 1 | -1): boolean {
    if (this.view === 'date') {
      const d = new Date(this.viewYear, this.viewMonth + direction, 1);
      return isMonthSelectable(d.getFullYear(), d.getMonth(), this.o);
    }
    if (this.view === 'month') return this.yearAllowed(this.viewYear + direction);
    return yearPage(this.viewYear + 10 * direction, this.calendar)
      .years.slice(1, 11)
      .some((y) => this.yearAllowed(y));
  }

  /** Previous / next month, year or decade, depending on the grid on show. */
  go(direction: 1 | -1): void {
    const months = this.view === 'date' ? 1 : this.view === 'month' ? 12 : 120;
    if (this.view === 'date') {
      const first = new Date(this.viewYear, this.viewMonth + direction, 1);
      this.focus = new Date(first.getFullYear(), first.getMonth(), Math.min(this.focus.getDate(), daysInMonth(first.getFullYear(), first.getMonth())));
    } else {
      this.focus = addMonths(this.focus, months * direction);
    }
    this.showDate(this.focus);
  }

  /** Header buttons: the month name opens the month grid, the year opens the year grid. */
  showView(view: DatePickerView): void {
    if (RANK[view] < RANK[this.baseView]) view = this.baseView;
    this.view = view;
    this.focus = new Date(this.viewYear, this.viewMonth, Math.min(this.focus.getDate(), daysInMonth(this.viewYear, this.viewMonth)));
  }

  /** Header labels of the week, starting on `firstDayOfWeek`. */
  weekdays(): { day: number; short: string; long: string }[] {
    return weekdayOrder(this.firstDayOfWeek).map((day) => ({ day, short: this.locale.dayNamesMin[day], long: this.locale.dayNames[day] }));
  }

  weeks(): DayCell[][] {
    const [start, end] = this.mode === 'range' && Array.isArray(this.value) ? this.value : [null, null];
    const today = this.now();
    const otherMonths = this.o.selectOtherMonths !== false;
    const dates = this.dates;
    return calendarWeeks(this.viewYear, this.viewMonth, this.firstDayOfWeek, today).map((row) =>
      row.map((c) => ({
        ...c,
        selectable: isDaySelectable(c.date, this.o) && (otherMonths || !c.otherMonth),
        selected: dates.some((d) => sameDay(d, c.date)),
        rangeStart: !!start && sameDay(start, c.date),
        rangeEnd: !!end && sameDay(end, c.date),
        inRange: !!start && !!end && compareDays(c.date, start) > 0 && compareDays(c.date, end) < 0,
        focused: sameDay(this.focus, c.date),
        label: formatDate(c.date, 'EEEE d MMMM yyyy', { locale: this.locale, calendar: this.calendar }),
      })),
    );
  }

  months(): MonthCell[] {
    const today = this.now();
    return this.locale.monthNamesShort.map((label, month) => ({
      month,
      label,
      selected: this.dates.some((d) => d.getFullYear() === this.viewYear && d.getMonth() === month),
      current: today.getFullYear() === this.viewYear && today.getMonth() === month,
      selectable: isMonthSelectable(this.viewYear, month, this.o),
      focused: this.focus.getFullYear() === this.viewYear && this.focus.getMonth() === month,
    }));
  }

  years(): YearCell[] {
    const page = yearPage(this.viewYear, this.calendar);
    const thisYear = this.now().getFullYear();
    return page.years.map((year) => ({
      year,
      label: String(displayYear(year, this.calendar)),
      selected: this.dates.some((d) => d.getFullYear() === year),
      current: year === thisYear,
      selectable: this.yearAllowed(year),
      outside: year < page.first || year > page.last,
      focused: this.focus.getFullYear() === year,
    }));
  }

  // ---------- picking ----------

  pickDay(date: Date): PickResult {
    const day = startOfDay(date);
    if (!isDaySelectable(day, this.o)) return NOTHING;
    if (day.getMonth() !== this.viewMonth || day.getFullYear() !== this.viewYear) {
      if (this.o.selectOtherMonths === false) return NOTHING;
      this.showDate(day);
    }
    this.focus = day;
    return this.select(day);
  }

  /** In the month grid: picks the month when months are what is picked, else opens that month's days. */
  pickMonth(month: number): PickResult {
    if (!isMonthSelectable(this.viewYear, month, this.o)) return NOTHING;
    const first = new Date(this.viewYear, month, 1);
    if (this.baseView === 'month') {
      this.focus = first;
      return this.select(first);
    }
    this.viewMonth = month;
    this.view = 'date';
    this.focus = new Date(this.viewYear, month, Math.min(this.focus.getDate(), daysInMonth(this.viewYear, month)));
    return NOTHING;
  }

  /** In the year grid: picks the year when years are what is picked, else opens that year's months. */
  pickYear(year: number): PickResult {
    if (!this.yearAllowed(year)) return NOTHING;
    if (this.baseView === 'year') {
      this.viewYear = year;
      this.focus = new Date(year, 0, 1);
      return this.select(this.focus);
    }
    this.viewYear = year;
    this.view = 'month';
    const m = this.focus.getMonth();
    this.focus = new Date(year, m, Math.min(this.focus.getDate(), daysInMonth(year, m)));
    return NOTHING;
  }

  /** The today button: today's day, month or year with the time the fields show. */
  pickToday(): PickResult {
    const today = startOfDay(this.now());
    this.showDate(today);
    if (this.baseView === 'year') return this.pickYear(today.getFullYear());
    if (this.baseView === 'month') return this.pickMonth(today.getMonth());
    return this.pickDay(today);
  }

  clear(): boolean {
    const had = this.dates.length > 0;
    this.value = null;
    this.syncTime();
    return had;
  }

  /**
   * Handles a key pressed on a grid cell. Returns whether it was handled (the caller then prevents the default and
   * focuses the cell with `focused`), and the pick that Enter or Space made.
   */
  key(key: string, shiftKey = false): { handled: boolean; result?: PickResult } {
    if (key === 'Enter' || key === ' ') {
      const result =
        this.view === 'date'
          ? this.pickDay(this.focus)
          : this.view === 'month'
            ? this.pickMonth(this.focus.getMonth())
            : this.pickYear(this.focus.getFullYear());
      return { handled: true, result };
    }
    let next: Date | null = null;
    if (this.view === 'date') {
      next = moveDay(this.focus, key, { shiftKey, firstDayOfWeek: this.firstDayOfWeek });
    } else {
      // Month and year grids are 3 cells wide; one cell is a month or a year.
      const unit = this.view === 'month' ? 1 : 12;
      const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 };
      if (steps[key]) next = addMonths(this.focus, steps[key] * unit);
      else if (key === 'PageUp' || key === 'PageDown') next = addMonths(this.focus, (key === 'PageUp' ? -1 : 1) * unit * (this.view === 'month' ? 12 : 10));
      else if (key === 'Home' || key === 'End') {
        const end = key === 'End';
        if (this.view === 'month') next = new Date(this.viewYear, end ? 11 : 0, 1);
        else {
          const page = yearPage(this.viewYear, this.calendar);
          next = new Date(end ? page.last : page.first, this.focus.getMonth(), 1);
        }
      }
    }
    if (!next) return { handled: false };
    this.focus = this.clampDay(next);
    this.showDate(this.focus);
    return { handled: true };
  }

  // ---------- time ----------

  /** A time field's text, two digits: the hour on the 12-hour clock when `hourFormat` is `'12'`. */
  timeText(unit: TimeUnit): string {
    const n = unit === 'hour' ? (this.hourFormat === '12' ? to12Hour(this.hour).hour : this.hour) : unit === 'minute' ? this.minute : this.second;
    return n < 10 ? '0' + n : String(n);
  }

  /** Up / down on a time field, wrapping around (23 → 0). Returns whether the value changed. */
  stepTime(unit: TimeUnit, direction: 1 | -1): boolean {
    const step = Math.max(1, Math.round((unit === 'hour' ? this.o.stepHour : unit === 'minute' ? this.o.stepMinute : this.o.stepSecond) || 1));
    if (unit === 'hour') this.hour = wrapStep(this.hour, step, direction, 24);
    else if (unit === 'minute') this.minute = wrapStep(this.minute, step, direction, 60);
    else this.second = wrapStep(this.second, step, direction, 60);
    return this.applyTime();
  }

  /** A typed time field, as shown (1–12 for hours on the 12-hour clock); out-of-range numbers are clamped. */
  setTimeField(unit: TimeUnit, shown: number): boolean {
    const n = clampTimeField(shown, unit, this.hourFormat);
    if (unit === 'hour') this.hour = this.hourFormat === '12' ? from12Hour(n, this.pm) : n;
    else if (unit === 'minute') this.minute = n;
    else this.second = n;
    return this.applyTime();
  }

  setPm(pm: boolean): boolean {
    if (pm === this.pm) return false;
    this.hour = (this.hour + 12) % 24;
    return this.applyTime();
  }

  // ---------- internals ----------

  /** The date the time fields edit: the single value, the end (or start) of a range, the last of several. */
  private get timeTarget(): Date | null {
    const v = this.value;
    if (!v) return null;
    if (v instanceof Date) return v;
    if (this.mode === 'range') return v[1] || v[0] || null;
    return v.length ? v[v.length - 1] : null;
  }

  private anchor(): Date | null {
    const v = this.value;
    if (!v) return null;
    if (v instanceof Date) return v;
    return this.mode === 'range' ? v[0] || null : v.length ? v[v.length - 1] : null;
  }

  private select(day: Date): PickResult {
    const picked = clampDate(this.withTime(day), this.o);
    if (this.mode === 'single') {
      this.value = picked;
    } else if (this.mode === 'multiple') {
      const list = this.dates.slice();
      const at = list.findIndex((d) => this.sameUnit(d, day));
      if (at >= 0) list.splice(at, 1);
      else if (this.o.maxDateCount && list.length >= this.o.maxDateCount) return NOTHING;
      else list.push(picked);
      this.value = list.sort((a, b) => a.getTime() - b.getTime());
      this.syncTime();
      return { changed: true, close: false };
    } else {
      const [start, end] = Array.isArray(this.value) ? this.value : [null, null];
      if (!start || end || this.compareUnit(day, start) < 0) {
        this.value = [picked, null];
        this.syncTime();
        return { changed: true, close: false };
      }
      this.value = [start, picked];
    }
    this.syncTime();
    return { changed: true, close: !this.hasTime };
  }

  /** Puts the fields' time on the value, or on today when nothing is picked yet. */
  private applyTime(): boolean {
    if (!this.hasTime) return false;
    const target = this.timeTarget;
    const before = target ? target.getTime() : NaN;
    const next = clampDate(this.withTime(target || this.clampDay(startOfDay(this.now()))), this.o);
    if (this.mode === 'single') this.value = next;
    else if (this.mode === 'range') {
      const [start, end] = Array.isArray(this.value) ? this.value : [null, null];
      this.value = end ? [start, next] : [next, null];
    } else {
      const list = this.dates.slice();
      list[list.length ? list.length - 1 : 0] = next;
      this.value = list;
    }
    this.syncTime();
    return next.getTime() !== before;
  }

  private withTime(day: Date): Date {
    if (!this.hasTime) return startOfDay(day);
    return new Date(day.getFullYear(), day.getMonth(), day.getDate(), this.hour, this.minute, this.o.showSeconds ? this.second : 0);
  }

  /** The time fields follow the value; with nothing picked they show `fallback` or now. */
  private syncTime(fallback?: Date | null): void {
    const t = this.timeTarget || fallback || this.now();
    this.hour = t.getHours();
    this.minute = t.getMinutes();
    this.second = this.o.showSeconds ? t.getSeconds() : 0;
  }

  private showDate(d: Date): void {
    this.viewYear = d.getFullYear();
    this.viewMonth = d.getMonth();
  }

  /** `d` moved onto minDate's or maxDate's day when it lies outside them. */
  private clampDay(d: Date): Date {
    if (isValidDate(this.o.minDate) && compareDays(d, this.o.minDate) < 0) return startOfDay(this.o.minDate);
    if (isValidDate(this.o.maxDate) && compareDays(d, this.o.maxDate) > 0) return startOfDay(this.o.maxDate);
    return d;
  }

  private yearAllowed(year: number): boolean {
    const r = this.o.yearRange;
    return isYearSelectable(year, this.o) && (!r || (year >= r[0] && year <= r[1]));
  }

  /** Whether a typed date may be picked: by day, month or year, and with a time inside minDate–maxDate. */
  private allowed(d: Date): boolean {
    const base = this.baseView;
    if (base === 'year') return this.yearAllowed(d.getFullYear());
    if (base === 'month') return isMonthSelectable(d.getFullYear(), d.getMonth(), this.o);
    if (!isDaySelectable(d, this.o)) return false;
    return !this.hasTime || clampDate(d, this.o).getTime() === d.getTime();
  }

  private sameUnit(a: Date, b: Date): boolean {
    return this.compareUnit(a, b) === 0;
  }

  private compareUnit(a: Date, b: Date): number {
    const base = this.baseView;
    if (base === 'year') return a.getFullYear() - b.getFullYear();
    if (base === 'month') return a.getFullYear() * 12 + a.getMonth() - (b.getFullYear() * 12 + b.getMonth());
    return compareDays(a, b);
  }

  private normalize(v: unknown): DatePickerValue {
    if (v === null || v === undefined || v === '') return null;
    const list = Array.isArray(v) ? v : [v];
    if (this.mode === 'single') return toDate(list[0]);
    if (this.mode === 'multiple') return list.map(toDate).filter((d): d is Date => !!d);
    const start = toDate(list[0]);
    const end = toDate(list[1]);
    if (!start) return null;
    if (end && end.getTime() < start.getTime()) return [end, start];
    return [start, end];
  }
}

/** A Date from a Date, a timestamp or an ISO string; a date-only string (`2026-03-12`) is local midnight, not UTC. */
export function toDate(x: unknown): Date | null {
  if (isValidDate(x)) return new Date(x.getTime());
  if (typeof x === 'number') return isFinite(x) ? new Date(x) : null;
  if (typeof x !== 'string' || !x.trim()) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(x.trim());
  const d = m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(x);
  return isValidDate(d) ? d : null;
}
