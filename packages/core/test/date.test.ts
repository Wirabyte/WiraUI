import { describe, expect, it } from 'vitest';
import {
  addMonths,
  calendarWeeks,
  classicDateFormat,
  DatePickerState,
  EN_LOCALE,
  formatDate,
  from12Hour,
  isDaySelectable,
  isMonthSelectable,
  moveDay,
  parseDate,
  parseLooseDate,
  parseTypedDate,
  readTimeField,
  splitDates,
  timeFormat,
  to12Hour,
  toDate,
  wrapStep,
  yearPage,
} from '../src';

const ymd = (d: Date | null | undefined) =>
  d ? `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` : null;
const hms = (d: Date | null | undefined) => (d ? `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}` : null);

describe('date formats', () => {
  it('reads the dd/mm/yy style of existing templates', () => {
    expect(classicDateFormat('dd/mm/yy')).toBe('dd/MM/yyyy');
    expect(classicDateFormat('mm/dd/y')).toBe('MM/dd/yy');
    expect(classicDateFormat('d MM yy')).toBe('d MMMM yyyy');
    expect(classicDateFormat('DD, d M yy')).toBe('EEEE, d MMM yyyy');
    expect(classicDateFormat("dd 'of' MM")).toBe("dd' of 'MMMM");
    expect(classicDateFormat('yy-mm-dd')).toBe('yyyy-MM-dd');
  });

  it('builds the time part', () => {
    expect(timeFormat()).toBe('HH:mm');
    expect(timeFormat({ showSeconds: true })).toBe('HH:mm:ss');
    expect(timeFormat({ hourFormat: '12' })).toBe('hh:mm a');
    expect(timeFormat({ hourFormat: '12', showSeconds: true })).toBe('hh:mm:ss a');
  });

  it('formats and parses the 12-hour clock', () => {
    const d = new Date(2026, 2, 12, 14, 5, 9);
    expect(formatDate(d, 'hh:mm:ss a')).toBe('02:05:09 PM');
    expect(formatDate(new Date(2026, 2, 12, 0, 30), 'h:mm a')).toBe('12:30 AM');
    expect(hms(parseDate('12/03/2026 02:05 pm', 'dd/MM/yyyy hh:mm a'))).toBe('14:5:0');
    expect(hms(parseDate('12/03/2026 12:05 AM', 'dd/MM/yyyy hh:mm a'))).toBe('0:5:0');
    expect(parseDate('12/03/2026 13:05 PM', 'dd/MM/yyyy hh:mm a')).toBeNull();
    expect(parseDate('12/03/2026 24:05', 'dd/MM/yyyy HH:mm')).toBeNull();
  });

  it('parses in any letter case, with Thai digits, and takes a ค.ศ. year typed by habit', () => {
    expect(ymd(parseDate('mar 12, 2026', 'MMM d, yyyy', { locale: EN_LOCALE }))).toBe('2026-3-12');
    expect(ymd(parseDate('๑๒/๐๓/๒๕๖๙', 'dd/MM/yyyy', { calendar: 'buddhist' }))).toBe('2026-3-12');
    expect(ymd(parseDate('12/03/2026', 'dd/MM/yyyy', { calendar: 'buddhist' }))).toBe('2026-3-12');
    expect(ymd(parseDate('12/03/2569', 'dd/MM/yyyy', { calendar: 'buddhist' }))).toBe('2026-3-12');
  });

  it('reads dates typed with numbers in the order of the pattern', () => {
    const th = { calendar: 'buddhist' as const };
    expect(ymd(parseLooseDate('12/3/2569', 'd MMMM yyyy', th))).toBe('2026-3-12');
    expect(ymd(parseLooseDate('12-03-69', 'd MMMM yyyy', th))).toBe('2026-3-12');
    expect(ymd(parseLooseDate('12 มี.ค. 2569', 'd MMMM yyyy', th))).toBe('2026-3-12');
    expect(ymd(parseLooseDate('3/12/2026', 'MM/dd/yyyy'))).toBe('2026-3-12');
    expect(parseLooseDate('31/2/2569', 'd MMMM yyyy', th)).toBeNull();
    expect(parseLooseDate('12/3', 'd MMMM yyyy', th)).toBeNull();
    const t = parseLooseDate('12.3.2569 14:30', 'd MMMM yyyy HH:mm', { ...th, time: true });
    expect([ymd(t), hms(t)]).toEqual(['2026-3-12', '14:30:0']);
    const pm = parseLooseDate('12/3/2569 2:30 pm', 'dd/MM/yyyy hh:mm a', { ...th, time: true, hourFormat: '12', locale: EN_LOCALE });
    expect(hms(pm)).toBe('14:30:0');
    const only = parseLooseDate('9:05', 'HH:mm', { timeOnly: true, base: new Date(2026, 2, 12) });
    expect([ymd(only), hms(only)]).toEqual(['2026-3-12', '9:5:0']);
  });

  it('tries the exact pattern, then the date alone, then numbers', () => {
    const o = { calendar: 'buddhist' as const, time: true, datePattern: 'dd/MM/yyyy' };
    expect(hms(parseTypedDate('12/03/2569 08:15', 'dd/MM/yyyy HH:mm', o))).toBe('8:15:0');
    expect(hms(parseTypedDate('12/03/2569', 'dd/MM/yyyy HH:mm', o))).toBe('0:0:0');
    expect(ymd(parseTypedDate('12 3 2569 8 15', 'dd/MM/yyyy HH:mm', o))).toBe('2026-3-12');
  });

  it('splits several dates even when the separator appears inside one', () => {
    const parse = (s: string) => parseDate(s, 'MMM d, yyyy', { locale: EN_LOCALE });
    expect(splitDates('Mar 12, 2024, Mar 15, 2024', /\s*,\s*/, parse)).toEqual(['Mar 12, 2024', 'Mar 15, 2024']);
    expect(splitDates('Mar 12, 2024, junk', /\s*,\s*/, parse)).toBeNull();
  });

  it('reads model strings as local dates', () => {
    expect(hms(toDate('2026-03-12'))).toBe('0:0:0');
    expect(hms(toDate('2026-03-12T14:30'))).toBe('14:30:0');
    expect(toDate('not a date')).toBeNull();
    expect(toDate(null)).toBeNull();
  });
});

describe('calendar grid', () => {
  it('always shows six weeks starting on the first day of the week', () => {
    const sun = calendarWeeks(2026, 2, 0, new Date(2026, 2, 12)); // March 2026 starts on a Sunday
    expect(sun).toHaveLength(6);
    expect(sun.every((w) => w.length === 7)).toBe(true);
    expect(ymd(sun[0][0].date)).toBe('2026-3-1');
    expect(sun[0][0].otherMonth).toBe(false);
    expect(sun.flat().find((c) => c.today)?.day).toBe(12);
    const mon = calendarWeeks(2026, 2, 1);
    expect(ymd(mon[0][0].date)).toBe('2026-2-23');
    expect(mon[0][0].otherMonth).toBe(true);
  });

  it('keeps the day inside the month when moving months', () => {
    expect(ymd(addMonths(new Date(2024, 0, 31), 1))).toBe('2024-2-29');
    expect(ymd(addMonths(new Date(2024, 2, 31), -13))).toBe('2023-2-28');
  });

  it('knows what can be picked', () => {
    const l = { minDate: new Date(2026, 2, 10, 15), maxDate: new Date(2026, 3, 5), disabledDays: [0], disabledDates: [new Date(2026, 2, 20)] };
    expect(isDaySelectable(new Date(2026, 2, 10), l)).toBe(true); // the min day itself, whatever its time
    expect(isDaySelectable(new Date(2026, 2, 9), l)).toBe(false);
    expect(isDaySelectable(new Date(2026, 2, 15), l)).toBe(false); // a Sunday
    expect(isDaySelectable(new Date(2026, 2, 20), l)).toBe(false);
    expect(isDaySelectable(new Date(2026, 3, 6), l)).toBe(false);
    expect(isMonthSelectable(2026, 1, l)).toBe(false);
    expect(isMonthSelectable(2026, 3, l)).toBe(true);
  });

  it('pages years by the decade people see', () => {
    const be = yearPage(2026, 'buddhist');
    expect([be.first + 543, be.last + 543]).toEqual([2560, 2569]);
    expect(be.years).toHaveLength(12);
    expect(be.years[0]).toBe(be.first - 1);
    const ce = yearPage(2026);
    expect([ce.first, ce.last]).toEqual([2020, 2029]);
  });

  it('moves focus by key', () => {
    const d = new Date(2026, 2, 12); // Thursday
    expect(ymd(moveDay(d, 'ArrowRight'))).toBe('2026-3-13');
    expect(ymd(moveDay(d, 'ArrowUp'))).toBe('2026-3-5');
    expect(ymd(moveDay(d, 'Home'))).toBe('2026-3-8');
    expect(ymd(moveDay(d, 'Home', { firstDayOfWeek: 1 }))).toBe('2026-3-9');
    expect(ymd(moveDay(d, 'End'))).toBe('2026-3-14');
    expect(ymd(moveDay(d, 'PageDown'))).toBe('2026-4-12');
    expect(ymd(moveDay(d, 'PageUp', { shiftKey: true }))).toBe('2025-3-12');
    expect(moveDay(d, 'a')).toBeNull();
  });
});

describe('time fields', () => {
  it('wraps and converts', () => {
    expect(wrapStep(23, 1, 1, 24)).toBe(0);
    expect(wrapStep(0, 5, -1, 60)).toBe(55);
    expect(wrapStep(58, 5, 1, 60)).toBe(3);
    expect(to12Hour(0)).toEqual({ hour: 12, pm: false });
    expect(to12Hour(12)).toEqual({ hour: 12, pm: true });
    expect(to12Hour(15)).toEqual({ hour: 3, pm: true });
    expect(from12Hour(12, false)).toBe(0);
    expect(from12Hour(12, true)).toBe(12);
    expect(from12Hour(3, true)).toBe(15);
  });

  it('reads typed digits and says when the field is full', () => {
    expect(readTimeField('2', 'hour')).toEqual({ value: 2, raw: 2, complete: false });
    expect(readTimeField('3', 'hour')).toEqual({ value: 3, raw: 3, complete: true });
    expect(readTimeField('25', 'hour')).toEqual({ value: null, raw: 25, complete: true });
    expect(readTimeField('0', 'hour', '12')).toEqual({ value: null, raw: 0, complete: false });
    expect(readTimeField('1', 'hour', '12').complete).toBe(false);
    expect(readTimeField('2', 'hour', '12').complete).toBe(true);
    expect(readTimeField('5', 'minute').complete).toBe(false);
    expect(readTimeField('7', 'minute').complete).toBe(true);
    expect(readTimeField('๑๒', 'minute').value).toBe(12);
    expect(readTimeField('', 'second')).toEqual({ value: null, raw: null, complete: false });
  });
});

describe('DatePickerState', () => {
  const NOW = new Date(2026, 2, 12, 9, 30, 15); // Thursday 12 March 2026 (พ.ศ. 2569)
  const make = (o: ConstructorParameters<typeof DatePickerState>[0] = {}) => {
    const s = new DatePickerState({ calendar: 'buddhist', ...o }, () => new Date(NOW.getTime()));
    s.open();
    return s;
  };

  it('opens on today with the header in พ.ศ.', () => {
    const s = make();
    expect([s.monthLabel, s.yearLabel]).toEqual(['มีนาคม', '2569']);
    expect(s.weeks().flat().filter((c) => c.focused).map((c) => c.day)).toEqual([12]);
    expect(s.weekdays()[0].short).toBe('อา');
    s.showView('year');
    expect(s.decadeLabel).toBe('2560 – 2569');
    expect(s.years().filter((y) => y.outside).map((y) => y.label)).toEqual(['2559', '2570']);
  });

  it('picks one day and closes', () => {
    const s = make({ dateFormat: classicDateFormat('dd/mm/yy') });
    const r = s.pickDay(new Date(2026, 2, 20));
    expect(r).toEqual({ changed: true, close: true });
    expect(hms(s.value as Date)).toBe('0:0:0');
    expect(s.text()).toBe('20/03/2569');
    expect(s.weeks().flat().filter((c) => c.selected).map((c) => c.day)).toEqual([20]);
  });

  it('picks a day of the next month from the grid edge and moves there', () => {
    const s = make();
    s.pickDay(new Date(2026, 3, 2));
    expect(s.monthLabel).toBe('เมษายน');
  });

  it('keeps the panel open with a time, and the time follows the fields', () => {
    const s = make({ showTime: true, showSeconds: true });
    expect([s.timeText('hour'), s.timeText('minute'), s.timeText('second')]).toEqual(['09', '30', '15']);
    expect(s.pickDay(new Date(2026, 2, 20))).toEqual({ changed: true, close: false });
    expect(hms(s.value as Date)).toBe('9:30:15');
    s.stepTime('hour', 1);
    expect(hms(s.value as Date)).toBe('10:30:15');
    s.setTimeField('minute', 75);
    expect(s.timeText('minute')).toBe('59');
    s.setTimeField('hour', 23);
    s.stepTime('hour', 1);
    expect(hms(s.value as Date)).toBe('0:59:15');
    expect(ymd(s.value as Date)).toBe('2026-3-20'); // wrapping the hour does not move the day
  });

  it('drops seconds when they are not shown', () => {
    const s = make({ showTime: true });
    s.pickDay(new Date(2026, 2, 20));
    expect(hms(s.value as Date)).toBe('9:30:0');
    expect(s.pattern).toBe('d MMMM yyyy HH:mm');
  });

  it('steps by stepMinute', () => {
    const s = make({ showTime: true, stepMinute: 15 });
    s.stepTime('minute', 1);
    expect(s.timeText('minute')).toBe('45');
    s.stepTime('minute', 1);
    expect(s.timeText('minute')).toBe('00');
  });

  it('changing the time with nothing picked picks today', () => {
    const s = make({ showTime: true });
    expect(s.stepTime('minute', -1)).toBe(true);
    expect([ymd(s.value as Date), hms(s.value as Date)]).toEqual(['2026-3-12', '9:29:0']);
  });

  it('runs a 12-hour clock', () => {
    const s = make({ showTime: true, hourFormat: '12', locale: EN_LOCALE });
    s.setValue(new Date(2026, 2, 12, 0, 5));
    expect([s.timeText('hour'), s.pm]).toEqual(['12', false]);
    s.setPm(true);
    expect((s.value as Date).getHours()).toBe(12);
    s.setTimeField('hour', 3);
    expect((s.value as Date).getHours()).toBe(15);
    expect(s.text()).toBe('Mar 12, 2569 03:05 PM');
    s.stepTime('hour', 1);
    s.stepTime('hour', 1);
    s.stepTime('hour', 1);
    s.stepTime('hour', 1);
    s.stepTime('hour', 1);
    s.stepTime('hour', 1);
    s.stepTime('hour', 1);
    s.stepTime('hour', 1);
    s.stepTime('hour', 1);
    expect([s.timeText('hour'), s.pm]).toEqual(['12', false]); // 3 PM + 9 hours = 12 AM
  });

  it('keeps a picked time inside minDate and maxDate', () => {
    const s = make({ showTime: true, minDate: new Date(2026, 2, 12, 14, 0), maxDate: new Date(2026, 2, 14, 18, 0) });
    s.pickDay(new Date(2026, 2, 12));
    expect(hms(s.value as Date)).toBe('14:0:0');
    s.pickDay(new Date(2026, 2, 14));
    s.setTimeField('hour', 20);
    expect(hms(s.value as Date)).toBe('18:0:0');
    expect(s.pickDay(new Date(2026, 2, 15))).toEqual({ changed: false, close: false });
    expect(s.canGo(1)).toBe(false);
    expect(s.canGo(-1)).toBe(false);
  });

  it('picks a range: start, then end; an earlier day starts over', () => {
    const s = make({ selectionMode: 'range' });
    expect(s.pickDay(new Date(2026, 2, 10)).close).toBe(false);
    expect(s.pickDay(new Date(2026, 2, 15))).toEqual({ changed: true, close: true });
    const cells = s.weeks().flat().filter((c) => !c.otherMonth);
    expect(cells.filter((c) => c.inRange).map((c) => c.day)).toEqual([11, 12, 13, 14]);
    expect(cells.find((c) => c.rangeStart)?.day).toBe(10);
    expect(cells.find((c) => c.rangeEnd)?.day).toBe(15);
    expect(s.text()).toBe('10 มีนาคม 2569 - 15 มีนาคม 2569');
    s.pickDay(new Date(2026, 2, 8));
    expect((s.value as Date[]).map(ymd)).toEqual(['2026-3-8', null]);
    s.pickDay(new Date(2026, 2, 5));
    expect((s.value as Date[]).map(ymd)).toEqual(['2026-3-5', null]);
  });

  it('toggles several dates, up to maxDateCount', () => {
    const s = make({ selectionMode: 'multiple', maxDateCount: 2 });
    s.pickDay(new Date(2026, 2, 20));
    s.pickDay(new Date(2026, 2, 10));
    expect(s.pickDay(new Date(2026, 2, 25)).changed).toBe(false);
    expect((s.value as Date[]).map(ymd)).toEqual(['2026-3-10', '2026-3-20']);
    s.pickDay(new Date(2026, 2, 10));
    expect((s.value as Date[]).map(ymd)).toEqual(['2026-3-20']);
    s.pickDay(new Date(2026, 2, 20));
    expect(s.value).toEqual([]);
  });

  it('picks months and years when that is the view', () => {
    const m = make({ view: 'month' });
    expect(m.view).toBe('month');
    expect(m.pickMonth(4)).toEqual({ changed: true, close: true });
    expect(m.text()).toBe('พฤษภาคม 2569');
    const y = make({ view: 'year' });
    y.pickYear(2030);
    expect(y.text()).toBe('2573');
  });

  it('drills down from years to months to days', () => {
    const s = make();
    s.showView('year');
    expect(s.pickYear(2027)).toEqual({ changed: false, close: false });
    expect(s.view).toBe('month');
    s.pickMonth(0);
    expect([s.view, s.monthLabel, s.yearLabel]).toEqual(['date', 'มกราคม', '2570']);
  });

  it('moves with the keyboard and picks with Enter', () => {
    const s = make({ maxDate: new Date(2026, 3, 30) });
    s.focus = new Date(2026, 2, 31);
    expect(s.key('ArrowRight').handled).toBe(true);
    expect([ymd(s.focus), s.monthLabel]).toEqual(['2026-4-1', 'เมษายน']);
    s.key('PageDown');
    expect(ymd(s.focus)).toBe('2026-4-30'); // stopped at maxDate
    expect(s.key('Enter').result).toEqual({ changed: true, close: true });
    expect(ymd(s.value as Date)).toBe('2026-4-30');
    s.showView('month');
    s.key('ArrowDown');
    expect(s.months().find((c) => c.focused)?.month).toBe(3); // July is past maxDate, so focus stays in April
    expect(s.key('x').handled).toBe(false);
    const free = make();
    free.showView('month');
    free.key('ArrowDown');
    expect(free.months().find((c) => c.focused)?.month).toBe(5);
    free.key('PageUp');
    expect([free.yearLabel, free.months().find((c) => c.focused)?.month]).toEqual(['2568', 5]);
    free.showView('year');
    free.key('End');
    expect(free.years().find((c) => c.focused)?.label).toBe('2569');
  });

  it('reads typed text, refusing what cannot be picked', () => {
    const s = make({ dateFormat: classicDateFormat('dd/mm/yy'), minDate: new Date(2026, 0, 1) });
    expect(ymd(s.parse('15/03/2569').value as Date)).toBe('2026-3-15');
    expect(ymd(s.parse('15/3/69').value as Date)).toBe('2026-3-15');
    expect(s.parse('15/03/2568').ok).toBe(false);
    expect(s.parse('31/02/2569').ok).toBe(false);
    expect(s.parse('   ')).toEqual({ ok: true, value: null });
    const r = make({ selectionMode: 'range', dateFormat: 'dd/MM/yyyy' });
    expect((r.parse('10/03/2569 - 15/03/2569').value as Date[]).map(ymd)).toEqual(['2026-3-10', '2026-3-15']);
    expect(r.parse('15/03/2569 - 10/03/2569').ok).toBe(false);
    const t = make({ timeOnly: true });
    expect(t.pattern).toBe('HH:mm');
    expect([ymd(t.parse('14:05').value as Date), hms(t.parse('14:05').value as Date)]).toEqual(['2026-3-12', '14:5:0']);
  });

  it('takes model values as Dates, strings or the wrong shape', () => {
    const s = make();
    s.setValue('2026-05-01');
    expect([ymd(s.value as Date), s.monthLabel]).toEqual(['2026-5-1', 'พฤษภาคม']);
    const r = make({ selectionMode: 'range' });
    r.setValue([new Date(2026, 2, 15), new Date(2026, 2, 10)]);
    expect((r.value as Date[]).map(ymd)).toEqual(['2026-3-10', '2026-3-15']);
    r.configure({ selectionMode: 'single', calendar: 'buddhist' });
    expect(ymd(r.value as Date)).toBe('2026-3-10');
  });

  it('clears and picks today', () => {
    const s = make({ showTime: true });
    s.open();
    expect(s.pickToday().changed).toBe(true);
    expect(hms(s.value as Date)).toBe('9:30:0');
    expect(s.clear()).toBe(true);
    expect(s.value).toBeNull();
  });
});
