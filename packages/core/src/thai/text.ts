/** Thai text helpers behind the `wiratheme/thai` pipes: amounts in words, Thai digits, phone numbers, date formats. */
import { CalendarSystem } from './buddhist';

const DIGIT_WORDS = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const PLACE_WORDS = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน'];

/** Up to six digits in words; `higher`: a non-zero digit stands before them, so a final 1 reads เอ็ด. */
function readGroup(digits: string, higher: boolean): string {
  let out = '';
  const len = digits.length;
  const before = /[1-9]/.test(digits.slice(0, -1));
  for (let i = 0; i < len; i++) {
    const d = digits.charCodeAt(i) - 48;
    const place = len - 1 - i;
    if (!d) continue;
    if (place === 0 && d === 1 && (higher || before)) out += 'เอ็ด';
    else if (place === 1 && d === 1) out += 'สิบ';
    else if (place === 1 && d === 2) out += 'ยี่สิบ';
    else out += DIGIT_WORDS[d] + PLACE_WORDS[place];
  }
  return out;
}

/** A whole number written in digits, in Thai words: `'1000001'` → `หนึ่งล้านเอ็ด`. */
export function thaiNumberText(digits: string): string {
  const s = String(digits).replace(/^0+/, '');
  if (!s) return DIGIT_WORDS[0];
  const groups: string[] = [];
  for (let end = s.length; end > 0; end -= 6) groups.unshift(s.slice(Math.max(0, end - 6), end));
  let out = '';
  let higher = false;
  groups.forEach((g, i) => {
    out += readGroup(g, higher);
    if (/[1-9]/.test(g)) higher = true;
    if (i < groups.length - 1) out += 'ล้าน';
  });
  return out;
}

/**
 * An amount of money in Thai words, as Excel's BAHTTEXT writes it: `1234.5` → `หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบสตางค์`,
 * `21` → `ยี่สิบเอ็ดบาทถ้วน`, `-1` → `ลบหนึ่งบาทถ้วน`. Satang are rounded to two places. Text that is not a number → `''`.
 */
export function bahtText(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') return '';
  const n = typeof amount === 'number' ? amount : Number(String(amount).replace(/[,\s฿]/g, ''));
  if (!Number.isFinite(n)) return '';
  const satangTotal = Math.round(Math.abs(n) * 100);
  const baht = Math.floor(satangTotal / 100);
  const satang = satangTotal % 100;
  const sign = n < 0 && satangTotal > 0 ? 'ลบ' : '';
  if (!baht && !satang) return 'ศูนย์บาทถ้วน';
  const bahtWords = baht ? thaiNumberText(String(baht)) + 'บาท' : '';
  const satangWords = satang ? thaiNumberText(String(satang)) + 'สตางค์' : 'ถ้วน';
  return sign + bahtWords + satangWords;
}

const THAI_DIGITS = '๐๑๒๓๔๕๖๗๘๙';

/** Arabic digits in Thai: `'2569'` → `'๒๕๖๙'`. */
export function toThaiDigits(text: unknown): string {
  return text === null || text === undefined ? '' : String(text).replace(/[0-9]/g, (d) => THAI_DIGITS[d.charCodeAt(0) - 48]);
}

/** Thai digits in Arabic: `'๒๕๖๙'` → `'2569'`. */
export function fromThaiDigits(text: unknown): string {
  return text === null || text === undefined ? '' : String(text).replace(/[๐-๙]/g, (d) => String(THAI_DIGITS.indexOf(d)));
}

/**
 * A Thai phone number with dashes: mobiles `081-234-5678`, Bangkok `02-123-4567`, other areas `053-123-456`;
 * `+66` / `66` become `0`. Thai digits are read. Anything else comes back as it was (trimmed).
 */
export function formatThaiPhone(value: unknown, separator = '-'): string {
  if (value === null || value === undefined) return '';
  const raw = String(value).trim();
  let d = fromThaiDigits(raw).replace(/[^\d+]/g, '');
  if (d.startsWith('+66')) d = '0' + d.slice(3);
  else if (d.startsWith('66') && d.length === 11) d = '0' + d.slice(2);
  if (!/^0\d+$/.test(d)) return raw;
  const s = separator;
  if (d.length === 10 && /^0[689]/.test(d)) return `${d.slice(0, 3)}${s}${d.slice(3, 6)}${s}${d.slice(6)}`;
  if (d.length === 9 && d.startsWith('02')) return `${d.slice(0, 2)}${s}${d.slice(2, 5)}${s}${d.slice(5)}`;
  if (d.length === 9) return `${d.slice(0, 3)}${s}${d.slice(3, 6)}${s}${d.slice(6)}`;
  return raw;
}

/** A date from what apps hold: a Date, a time in ms, or text (`'2012-05-14'` is that day here, not UTC midnight). */
export function toDateValue(value: unknown): Date | null {
  if (value === null || value === undefined || value === '') return null;
  if (Object.prototype.toString.call(value) === '[object Date]') return isNaN((value as Date).getTime()) ? null : (value as Date);
  if (typeof value === 'number') return Number.isFinite(value) ? new Date(value) : null;
  const text = String(value).trim();
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  const d = day ? new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3])) : new Date(text);
  return isNaN(d.getTime()) ? null : d;
}

/** Named date formats of the `wtDate` pipe. */
export type ThaiDateFormat = 'short' | 'medium' | 'long' | 'full' | 'time' | 'shortDateTime' | 'dateTime';

/**
 * The pattern (for `formatDate()`) of a named format in a language: Thai `full` is `วันอังคารที่ 28 ตุลาคม พ.ศ. 2569`,
 * `time` is `14:30 น.`. Anything that is not a name is a pattern already.
 */
export function datePattern(format: string, lang: string, calendar: CalendarSystem): string {
  const th = lang === 'th';
  const era = calendar === 'buddhist' ? "'พ.ศ.'" : "'ค.ศ.'";
  switch (format) {
    case 'short':
      return 'dd/MM/yyyy';
    case 'medium':
      return 'd MMM yyyy';
    case 'long':
      return 'd MMMM yyyy';
    case 'full':
      return th ? `'วัน'EEEE'ที่' d MMMM ${era} yyyy` : 'EEEE, d MMMM yyyy';
    case 'time':
      return th ? "HH:mm 'น.'" : 'HH:mm';
    case 'shortDateTime':
      return 'dd/MM/yyyy HH:mm';
    case 'dateTime':
      return th ? "d MMM yyyy HH:mm 'น.'" : 'd MMM yyyy HH:mm';
    default:
      return format;
  }
}

/**
 * How long ago (or until) a time, in words: `5 นาทีที่ผ่านมา`, `เมื่อวาน`, `in 3 days`. Under a minute is "now"
 * (`ขณะนี้` / `now`). Uses the platform's Intl.RelativeTimeFormat; `''` without it.
 */
export function timeAgo(value: unknown, lang = 'th', now: Date = new Date()): string {
  const date = toDateValue(value);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Rtf = (globalThis as any).Intl?.RelativeTimeFormat;
  if (!date || typeof Rtf !== 'function') return '';
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const abs = Math.abs(seconds);
  const rtf = new Rtf(lang, { numeric: 'auto' });
  if (abs < 60) return rtf.format(0, 'second');
  const units: [string, number][] = [
    ['minute', 60],
    ['hour', 3600],
    ['day', 86400],
    ['week', 604800],
    ['month', 2629800],
    ['year', 31557600],
  ];
  let unit = units[0];
  for (const u of units) if (abs >= u[1]) unit = u;
  return rtf.format(Math.round(seconds / unit[1]), unit[0]);
}
