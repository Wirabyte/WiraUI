import { TH_LOCALE, WtLocale } from './locale';

/** `'buddhist'` shows and reads years as พ.ศ.; values stay ordinary `Date` objects (ค.ศ.) either way. */
export type CalendarSystem = 'gregorian' | 'buddhist';

export const BUDDHIST_OFFSET = 543;

export function toBuddhistYear(gregorianYear: number): number {
  return gregorianYear + BUDDHIST_OFFSET;
}
export function fromBuddhistYear(buddhistYear: number): number {
  return buddhistYear - BUDDHIST_OFFSET;
}

export interface DateFormatOptions {
  locale?: WtLocale;
  calendar?: CalendarSystem;
}

const TOKEN = /yyyy|yy|MMMM|MMM|MM|M|dd|d|EEEE|EEE|HH|H|hh|h|mm|ss|a|'[^']*'/g;
const pad = (n: number, w = 2) => String(n).padStart(w, '0');

/**
 * Formats with a small pattern language: d dd M MM MMM MMMM yy yyyy EEE EEEE H HH (24-hour), h hh a (12-hour
 * and the locale's AM/PM), mm ss, 'literal'.
 * `formatDate(new Date(2013, 2, 12), 'd MMMM yyyy', { calendar: 'buddhist' })` → `12 มีนาคม 2556`.
 */
export function formatDate(date: Date, pattern: string, o: DateFormatOptions = {}): string {
  const loc = o.locale || TH_LOCALE;
  const year = o.calendar === 'buddhist' ? toBuddhistYear(date.getFullYear()) : date.getFullYear();
  return pattern.replace(TOKEN, (t) => {
    switch (t) {
      case 'yyyy': return String(year);
      case 'yy': return pad(year % 100);
      case 'MMMM': return loc.monthNames[date.getMonth()];
      case 'MMM': return loc.monthNamesShort[date.getMonth()];
      case 'MM': return pad(date.getMonth() + 1);
      case 'M': return String(date.getMonth() + 1);
      case 'dd': return pad(date.getDate());
      case 'd': return String(date.getDate());
      case 'EEEE': return loc.dayNames[date.getDay()];
      case 'EEE': return loc.dayNamesShort[date.getDay()];
      case 'HH': return pad(date.getHours());
      case 'H': return String(date.getHours());
      case 'hh': return pad(date.getHours() % 12 || 12);
      case 'h': return String(date.getHours() % 12 || 12);
      case 'a': return date.getHours() < 12 ? loc.am : loc.pm;
      case 'mm': return pad(date.getMinutes());
      case 'ss': return pad(date.getSeconds());
      default: return t.slice(1, -1);
    }
  });
}

/**
 * Reads text typed in `pattern` back into a Date. Returns null when it does not match or the day is invalid.
 * With `calendar: 'buddhist'` a 4-digit year is read as พ.ศ.; one below 2300 can only be a ค.ศ. year typed by habit and is read as such.
 * Month names and AM/PM match in any letter case, and Thai digits count.
 */
export function parseDate(text: string, pattern: string, o: DateFormatOptions = {}): Date | null {
  const loc = o.locale || TH_LOCALE;
  const parts: string[] = [];
  let re = '';
  let last = 0;
  pattern.replace(TOKEN, (t, offset: number) => {
    re += escape(pattern.slice(last, offset));
    last = offset + t.length;
    if (t.charAt(0) === "'") {
      re += escape(t.slice(1, -1));
      return t;
    }
    parts.push(t);
    if (t === 'MMMM') re += `(${loc.monthNames.map(escape).join('|')})`;
    else if (t === 'MMM') re += `(${loc.monthNamesShort.map(escape).join('|')})`;
    else if (t === 'EEEE' || t === 'EEE') re += '(\\S+)';
    else if (t === 'a') re += `(${[loc.am, loc.pm].map(escape).join('|')})`;
    else if (t === 'yyyy') re += '(\\d{4})';
    else re += '(\\d{1,2})';
    return t;
  });
  re += escape(pattern.slice(last));
  // Thai digits typed on a Thai keyboard count too.
  text = String(text ?? '').replace(/[๐-๙]/g, (c) => String(c.charCodeAt(0) - 0x0e50));
  const m = new RegExp('^\\s*' + re + '\\s*$', 'i').exec(text);
  if (!m) return null;

  let y = new Date().getFullYear();
  let mo = 0;
  let d = 1;
  let h = 0;
  let mi = 0;
  let s = 0;
  let pm: boolean | null = null;
  parts.forEach((t, i) => {
    const v = m[i + 1];
    if (t === 'yyyy') y = o.calendar === 'buddhist' && +v >= 2300 ? fromBuddhistYear(+v) : +v;
    else if (t === 'yy') y = (o.calendar === 'buddhist' ? 2500 : 2000) + +v - (o.calendar === 'buddhist' ? BUDDHIST_OFFSET : 0);
    else if (t === 'MMMM') mo = indexOfName(loc.monthNames, v);
    else if (t === 'MMM') mo = indexOfName(loc.monthNamesShort, v);
    else if (t === 'MM' || t === 'M') mo = +v - 1;
    else if (t === 'dd' || t === 'd') d = +v;
    else if (t === 'HH' || t === 'H' || t === 'hh' || t === 'h') h = +v;
    else if (t === 'a') pm = v.toLowerCase() === loc.pm.toLowerCase();
    else if (t === 'mm') mi = +v;
    else if (t === 'ss') s = +v;
  });
  if (pm !== null) {
    if (h < 1 || h > 12) return null;
    h = (h % 12) + (pm ? 12 : 0);
  }
  if (h > 23 || mi > 59 || s > 59) return null;
  const date = new Date(y, mo, d, h, mi, s);
  if (date.getFullYear() !== y || date.getMonth() !== mo || date.getDate() !== d) return null;
  return date;
}

function indexOfName(names: string[], v: string): number {
  const lower = v.toLowerCase();
  return names.findIndex((n) => n.toLowerCase() === lower);
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
