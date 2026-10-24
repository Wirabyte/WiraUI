import { BUDDHIST_OFFSET, CalendarSystem, fromBuddhistYear, parseDate } from './thai/buddhist';
import { TH_LOCALE, WtLocale } from './thai/locale';

// ---------- day arithmetic (local time; the time of day is kept unless a function says otherwise) ----------

/** A sortable number for the calendar day of `d`, ignoring the time. */
export function dayNumber(d: Date): number {
  return d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();
}

export function sameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return !!a && !!b && dayNumber(a) === dayNumber(b);
}

/** Negative when `a` is an earlier day than `b`, 0 on the same day, positive when later. */
export function compareDays(a: Date, b: Date): number {
  return dayNumber(a) - dayNumber(b);
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d.getTime());
  r.setDate(r.getDate() + n);
  return r;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** The same day `n` months later, kept inside the month: 31 Jan + 1 month → 28 or 29 Feb. */
export function addMonths(d: Date, n: number): Date {
  const first = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const day = Math.min(d.getDate(), daysInMonth(first.getFullYear(), first.getMonth()));
  return new Date(first.getFullYear(), first.getMonth(), day, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
}

export function isValidDate(d: unknown): d is Date {
  return d instanceof Date && !isNaN(d.getTime());
}

// ---------- the month grid ----------

export interface CalendarDay {
  /** Midnight of the day. */
  date: Date;
  day: number;
  /** 0–11 and the ค.ศ. year of the day, as custom day templates expect them. */
  month: number;
  year: number;
  /** Belongs to the month before or after the one shown. */
  otherMonth: boolean;
  today: boolean;
}

/**
 * The six weeks that show `month` (0–11), each starting on `firstDayOfWeek` (0 = Sunday).
 * Always six rows, so the panel keeps its height from month to month.
 */
export function calendarWeeks(year: number, month: number, firstDayOfWeek = 0, today: Date = new Date()): CalendarDay[][] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() - firstDayOfWeek + 7) % 7;
  const weeks: CalendarDay[][] = [];
  for (let w = 0; w < 6; w++) {
    const row: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(first.getFullYear(), first.getMonth(), 1 - lead + w * 7 + i);
      row.push({
        date,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        otherMonth: date.getMonth() !== first.getMonth(),
        today: sameDay(date, today),
      });
    }
    weeks.push(row);
  }
  return weeks;
}

/** Weekday indexes (0 = Sunday) in the order the header row shows them. */
export function weekdayOrder(firstDayOfWeek = 0): number[] {
  return [0, 1, 2, 3, 4, 5, 6].map((i) => (i + firstDayOfWeek) % 7);
}

// ---------- what can be picked ----------

export interface DateLimits {
  /** Earliest day (and time, when the picker shows one) that can be picked. */
  minDate?: Date | null;
  maxDate?: Date | null;
  /** Single days that cannot be picked. */
  disabledDates?: readonly Date[] | null;
  /** Weekdays that cannot be picked, 0 = Sunday. */
  disabledDays?: readonly number[] | null;
}

export function isDaySelectable(date: Date, l: DateLimits): boolean {
  if (isValidDate(l.minDate) && compareDays(date, l.minDate) < 0) return false;
  if (isValidDate(l.maxDate) && compareDays(date, l.maxDate) > 0) return false;
  if (l.disabledDays && l.disabledDays.indexOf(date.getDay()) >= 0) return false;
  if (l.disabledDates && l.disabledDates.some((d) => sameDay(d, date))) return false;
  return true;
}

/** False when the whole month lies outside minDate–maxDate. */
export function isMonthSelectable(year: number, month: number, l: DateLimits): boolean {
  const n = year * 100 + month;
  if (isValidDate(l.minDate) && n < l.minDate.getFullYear() * 100 + l.minDate.getMonth()) return false;
  if (isValidDate(l.maxDate) && n > l.maxDate.getFullYear() * 100 + l.maxDate.getMonth()) return false;
  return true;
}

export function isYearSelectable(year: number, l: DateLimits): boolean {
  if (isValidDate(l.minDate) && year < l.minDate.getFullYear()) return false;
  if (isValidDate(l.maxDate) && year > l.maxDate.getFullYear()) return false;
  return true;
}

/** `date` moved inside minDate–maxDate (to the exact limit, time included). */
export function clampDate(date: Date, l: Pick<DateLimits, 'minDate' | 'maxDate'>): Date {
  if (isValidDate(l.minDate) && date.getTime() < l.minDate.getTime()) return new Date(l.minDate.getTime());
  if (isValidDate(l.maxDate) && date.getTime() > l.maxDate.getTime()) return new Date(l.maxDate.getTime());
  return date;
}

// ---------- year pages ----------

/** Year shown to people: พ.ศ. for `'buddhist'`. */
export function displayYear(year: number, calendar: CalendarSystem = 'gregorian'): number {
  return calendar === 'buddhist' ? year + BUDDHIST_OFFSET : year;
}

/**
 * The 12 years one page of the year view shows, as ค.ศ. years: a decade of the years people see (2560–2569 in พ.ศ.)
 * plus one on each side, the way a wall calendar shows the edges of the next month.
 */
export function yearPage(year: number, calendar: CalendarSystem = 'gregorian'): { years: number[]; first: number; last: number } {
  const shown = displayYear(year, calendar);
  const start = Math.floor(shown / 10) * 10 - (shown - year);
  const years: number[] = [];
  for (let y = start - 1; y <= start + 10; y++) years.push(y);
  return { years, first: start, last: start + 9 };
}

// ---------- keyboard ----------

/**
 * The day focus moves to for a key in the day grid, or null for keys the grid leaves alone.
 * Arrows move by a day or a week, Home / End go to the start / end of the week, PageUp / PageDown change the month,
 * and with Shift the year.
 */
export function moveDay(date: Date, key: string, o: { shiftKey?: boolean; firstDayOfWeek?: number } = {}): Date | null {
  const intoWeek = (date.getDay() - (o.firstDayOfWeek || 0) + 7) % 7;
  switch (key) {
    case 'ArrowLeft':
      return addDays(date, -1);
    case 'ArrowRight':
      return addDays(date, 1);
    case 'ArrowUp':
      return addDays(date, -7);
    case 'ArrowDown':
      return addDays(date, 7);
    case 'Home':
      return addDays(date, -intoWeek);
    case 'End':
      return addDays(date, 6 - intoWeek);
    case 'PageUp':
      return addMonths(date, o.shiftKey ? -12 : -1);
    case 'PageDown':
      return addMonths(date, o.shiftKey ? 12 : 1);
  }
  return null;
}

// ---------- time ----------

export type HourFormat = '12' | '24';
export type TimeUnit = 'hour' | 'minute' | 'second';

/** Steps a clock field and wraps around: 23 + 1 → 0, 0 − 5 minutes → 55. */
export function wrapStep(value: number, step: number, direction: 1 | -1, size: number): number {
  return (((value + step * direction) % size) + size) % size;
}

/** 0–23 → 12, 1–11 with AM/PM. */
export function to12Hour(hour: number): { hour: number; pm: boolean } {
  return { hour: hour % 12 || 12, pm: hour >= 12 };
}

/** 12-hour clock back to 0–23: 12 AM → 0, 12 PM → 12. */
export function from12Hour(hour: number, pm: boolean): number {
  return (hour % 12) + (pm ? 12 : 0);
}

/** Smallest and largest value a time field takes, as shown: hours 0–23 or 1–12, minutes and seconds 0–59. */
export function timeFieldRange(unit: TimeUnit, hourFormat: HourFormat = '24'): [number, number] {
  if (unit !== 'hour') return [0, 59];
  return hourFormat === '12' ? [1, 12] : [0, 23];
}

export interface TypedTimeField {
  /** The typed number when it is in range, else null. */
  value: number | null;
  /** The typed number even when out of range; null while there are no digits. */
  raw: number | null;
  /** No further digit could make a valid value, so focus can move to the next field. */
  complete: boolean;
}

/** Reads what was typed into one time field. Thai digits count; anything else that is not a digit is ignored. */
export function readTimeField(text: string, unit: TimeUnit, hourFormat: HourFormat = '24'): TypedTimeField {
  const digits = latinDigits(text).replace(/\D/g, '').slice(0, 2);
  if (!digits) return { value: null, raw: null, complete: false };
  const [min, max] = timeFieldRange(unit, hourFormat);
  const n = +digits;
  return { value: n >= min && n <= max ? n : null, raw: n, complete: digits.length === 2 || n * 10 > max };
}

export function clampTimeField(n: number, unit: TimeUnit, hourFormat: HourFormat = '24'): number {
  const [min, max] = timeFieldRange(unit, hourFormat);
  return Math.min(max, Math.max(min, Math.round(n)));
}

// ---------- formats ----------

/**
 * Turns a date format in the `dd/mm/yy` style that existing date-picker templates use into a `formatDate()` pattern:
 * d dd (day), m mm (month number), M MM (short / long month name), y yy (2- / 4-digit year), D DD (short / long day name),
 * 'text' (literal). `classicDateFormat('dd/mm/yy')` → `'dd/MM/yyyy'`.
 */
export function classicDateFormat(format: string): string {
  const MAP: Record<string, string> = { d: 'd', dd: 'dd', m: 'M', mm: 'MM', M: 'MMM', MM: 'MMMM', y: 'yy', yy: 'yyyy', D: 'EEE', DD: 'EEEE' };
  let out = '';
  let literal = '';
  const flush = () => {
    if (literal) out += /[A-Za-z]/.test(literal) ? `'${literal}'` : literal;
    literal = '';
  };
  for (let i = 0; i < format.length; ) {
    const c = format.charAt(i);
    if (c === "'") {
      const end = format.indexOf("'", i + 1);
      literal += format.slice(i + 1, end < 0 ? format.length : end);
      i = end < 0 ? format.length : end + 1;
    } else if ('dmyMD'.indexOf(c) >= 0) {
      const pair = format.charAt(i + 1) === c;
      flush();
      out += MAP[pair ? c + c : c];
      i += pair ? 2 : 1;
    } else {
      literal += c;
      i++;
    }
  }
  flush();
  return out;
}

/** `formatDate()` pattern for the time part: `HH:mm`, `HH:mm:ss`, `hh:mm a`, `hh:mm:ss a`. */
export function timeFormat(o: { hourFormat?: HourFormat; showSeconds?: boolean } = {}): string {
  const twelve = o.hourFormat === '12';
  return (twelve ? 'hh' : 'HH') + ':mm' + (o.showSeconds ? ':ss' : '') + (twelve ? ' a' : '');
}

export interface LooseDateOptions {
  locale?: WtLocale;
  calendar?: CalendarSystem;
  /** Read hours, minutes and seconds after the date. */
  time?: boolean;
  /** Only a time is typed (hh:mm[:ss]); the date comes from `base`. */
  timeOnly?: boolean;
  hourFormat?: HourFormat;
  /** Day the time is put on for `timeOnly`. Default today. */
  base?: Date;
}

/**
 * Reads a date typed with numbers in the day / month / year order of `pattern`, whatever the separators:
 * with pattern `d MMMM yyyy`, `12/3/2569`, `12-03-69` and `12.3.2569 14:30` all work. A 2-digit year is put in
 * the current century of the calendar. Returns null when the numbers do not make a real day or time.
 */
export function parseLooseDate(text: string, pattern: string, o: LooseDateOptions = {}): Date | null {
  const loc = o.locale || TH_LOCALE;
  const s = latinDigits(String(text ?? ''));
  const nums = (s.match(/\d+/g) || []).map(Number);
  const lower = s.toLowerCase();
  const pm = lower.indexOf(loc.pm.toLowerCase()) >= 0 ? true : lower.indexOf(loc.am.toLowerCase()) >= 0 ? false : null;

  let y: number;
  let mo: number;
  let d: number;
  let rest: number[];
  if (o.timeOnly) {
    const base = o.base || new Date();
    [y, mo, d] = [base.getFullYear(), base.getMonth(), base.getDate()];
    rest = nums;
    if (rest.length < 2) return null;
  } else {
    // A month typed as a name (any length, any case) leaves two numbers for the day and the year.
    const named = monthByName(lower, loc);
    const fields = named >= 0 ? (['d', 'y'] as const) : (['d', 'M', 'y'] as const);
    if (nums.length < fields.length) return null;
    // The order day, month and year first appear in the pattern (quoted text left out).
    const bare = pattern.replace(/'[^']*'/g, '');
    const order = fields.map((t) => ({ t, at: bare.indexOf(t) })).sort((a, b) => a.at - b.at);
    if (order.some((x) => x.at < 0)) return null;
    const got: Record<string, number> = {};
    order.forEach((x, i) => (got[x.t] = nums[i]));
    d = got['d'];
    mo = named >= 0 ? named : got['M'] - 1;
    y = got['y'];
    if (y < 100) y += o.calendar === 'buddhist' ? 2500 - BUDDHIST_OFFSET : 2000;
    else if (o.calendar === 'buddhist' && y >= 2300) y = fromBuddhistYear(y);
    rest = o.time ? nums.slice(fields.length) : [];
  }

  let [h, mi, sec] = [rest[0] || 0, rest[1] || 0, rest[2] || 0];
  if (o.hourFormat === '12' && pm !== null && rest.length) {
    if (h < 1 || h > 12) return null;
    h = from12Hour(h, pm);
  }
  if (h > 23 || mi > 59 || sec > 59) return null;
  if (mo < 0 || mo > 11 || d < 1) return null;
  const date = new Date(y, mo, d, h, mi, sec);
  if (date.getFullYear() !== y || date.getMonth() !== mo || date.getDate() !== d) return null;
  return date;
}

/**
 * Reads one typed date: first exactly as `pattern`, then (for a date with a time) the date alone, then
 * by numbers as `parseLooseDate()` does. `formatDate`'s options apply.
 */
export function parseTypedDate(
  text: string,
  pattern: string,
  o: LooseDateOptions & { datePattern?: string } = {},
): Date | null {
  // A time alone has no date to read; it goes on `base`.
  if (o.timeOnly) return parseLooseDate(text, pattern, o);
  const fo = { locale: o.locale, calendar: o.calendar };
  return (
    parseDate(text, pattern, fo) ||
    (o.time && o.datePattern ? parseDate(text, o.datePattern, fo) : null) ||
    parseLooseDate(text, pattern, o)
  );
}

/**
 * Splits text holding several dates joined by `separator` back into one string per date. Pieces are joined again
 * while they do not parse alone, so a separator that also appears inside a date (`Mar 12, 2024, Mar 15, 2024`) still works.
 */
export function splitDates(text: string, separator: RegExp, parse: (s: string) => Date | null): string[] | null {
  const pieces = text.split(separator);
  const out: string[] = [];
  let current = '';
  const joiner = (text.match(separator) || [', '])[0];
  for (const piece of pieces) {
    current = current ? current + joiner + piece : piece;
    if (parse(current)) {
      out.push(current);
      current = '';
    }
  }
  return current.trim() ? null : out;
}

function monthByName(lowerText: string, loc: WtLocale): number {
  for (const names of [loc.monthNames, loc.monthNamesShort]) {
    const i = names.findIndex((n) => lowerText.indexOf(n.toLowerCase()) >= 0);
    if (i >= 0) return i;
  }
  return -1;
}

function latinDigits(s: string): string {
  return s.replace(/[๐-๙]/g, (c) => String(c.charCodeAt(0) - 0x0e50));
}
