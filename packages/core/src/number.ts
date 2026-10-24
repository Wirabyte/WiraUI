/** Number formatting and parsing for number inputs. Framework-free so it is unit tested here. */

export interface NumberFormatOptions {
  /** BCP 47 locale, e.g. 'th-TH'. */
  locale?: string;
  mode?: 'decimal' | 'currency';
  /** ISO 4217 code for currency mode, e.g. 'THB'. */
  currency?: string;
  minFractionDigits?: number;
  maxFractionDigits?: number;
  useGrouping?: boolean;
  prefix?: string;
  suffix?: string;
}

/** Fraction digits actually used: currency defaults to 2, decimals to 0–3, and min never exceeds max. */
export function fractionDigits(o: NumberFormatOptions): { min: number; max: number } {
  const min = o.minFractionDigits ?? (o.mode === 'currency' ? 2 : 0);
  const max = Math.max(min, o.maxFractionDigits ?? (o.mode === 'currency' ? 2 : 3));
  return { min, max };
}

/** `1234.5` → `'1,234.50'` / `'฿1,234.50'`, with prefix and suffix. null and NaN give ''. */
export function formatNumber(value: number | null | undefined, o: NumberFormatOptions = {}): string {
  if (value === null || value === undefined || isNaN(value)) return '';
  const { min, max } = fractionDigits(o);
  const text = new Intl.NumberFormat(o.locale || 'th-TH', {
    style: o.mode === 'currency' ? 'currency' : 'decimal',
    currency: o.mode === 'currency' ? o.currency || 'THB' : undefined,
    minimumFractionDigits: min,
    maximumFractionDigits: max,
    useGrouping: o.useGrouping !== false,
  }).format(value);
  return (o.prefix || '') + text + (o.suffix || '');
}

/**
 * The plain text shown while editing: no grouping, no currency, `.` as the decimal point,
 * and no exponent (`1e-7` → `'0.0000001'`).
 */
export function editableNumber(value: number | null | undefined, maxFractionDigits = 20): string {
  if (value === null || value === undefined || isNaN(value)) return '';
  return new Intl.NumberFormat('en-US', { useGrouping: false, maximumFractionDigits: Math.min(20, maxFractionDigits) }).format(value);
}

/**
 * Reads what the user typed or pasted: ignores grouping, spaces, currency signs and the given prefix/suffix,
 * accepts `,` as the decimal point when there is no `.`, and returns null for empty or unreadable text.
 */
export function parseNumber(text: string | null | undefined, o: Pick<NumberFormatOptions, 'prefix' | 'suffix'> = {}): number | null {
  if (text === null || text === undefined) return null;
  let s = String(text).trim();
  if (o.prefix && s.startsWith(o.prefix)) s = s.slice(o.prefix.length);
  if (o.suffix && s.endsWith(o.suffix)) s = s.slice(0, -o.suffix.length);
  // Thai digits typed on a Thai keyboard count too.
  s = s.replace(/[๐-๙]/g, (d) => String(d.charCodeAt(0) - 0x0e50));
  const negative = /^\s*[-−(]/.test(s) || /\)\s*$/.test(s);
  s = s.replace(/[^0-9.,]/g, '');
  if (!s.includes('.') && /,\d{1,2}$/.test(s) && (s.match(/,/g) || []).length === 1) s = s.replace(',', '.');
  else s = s.replace(/,/g, '');
  if (!s || s === '.') return null;
  const n = Number(s);
  if (isNaN(n)) return null;
  return negative ? -n : n;
}

/** Keeps a value inside [min, max] and rounds it to `maxFractionDigits`. */
export function clampNumber(value: number | null, o: { min?: number | null; max?: number | null; maxFractionDigits?: number } = {}): number | null {
  if (value === null || isNaN(value)) return null;
  let v = value;
  if (o.min !== null && o.min !== undefined && v < o.min) v = o.min;
  if (o.max !== null && o.max !== undefined && v > o.max) v = o.max;
  if (o.maxFractionDigits !== undefined) {
    const f = Math.pow(10, o.maxFractionDigits);
    v = Math.round(v * f) / f;
  }
  return v;
}

/** One step up or down from `value` (or from 0, or `min`, when empty), without float noise like 0.30000000000000004. */
export function stepNumber(value: number | null, step: number, direction: 1 | -1, o: { min?: number | null; max?: number | null } = {}): number {
  const start = value ?? (o.min !== null && o.min !== undefined && o.min > 0 ? o.min - step * direction : 0);
  const decimals = Math.max(decimalPlaces(start), decimalPlaces(step));
  const f = Math.pow(10, decimals);
  const next = Math.round((start + step * direction) * f) / f;
  return clampNumber(next, o) as number;
}

function decimalPlaces(n: number): number {
  const s = String(n);
  const e = /e-(\d+)$/.exec(s);
  if (e) return Number(e[1]);
  const i = s.indexOf('.');
  return i < 0 ? 0 : s.length - i - 1;
}

/** What a number field lets people type. */
export interface NumberTypingRules {
  min?: number | null;
  max?: number | null;
  /** Fraction digits allowed; 0 means no decimal point at all. */
  maxFractionDigits: number;
  prefix?: string;
  suffix?: string;
  /** The decimal mark of the locale. Default '.'. */
  decimal?: string;
}

/** The decimal mark of a locale: `'.'` for th-TH and en-US, `','` for de-DE. */
export function decimalSeparator(locale = 'th-TH'): string {
  return new Intl.NumberFormat(locale).formatToParts(1.5).find((p) => p.type === 'decimal')?.value || '.';
}

/**
 * Whether a number field may hold `text` while it is being typed: digits (Thai digits too), one decimal mark only
 * when fractions are allowed and no more fraction digits than allowed, a leading minus only when min allows
 * negatives, and nothing above max. Formatting already in the field (prefix, suffix, currency sign, grouping) is
 * ignored. Below min is allowed while typing (12 on the way to 120) and corrected on blur.
 */
export function acceptsNumberText(text: string, r: NumberTypingRules): boolean {
  const decimal = r.decimal || '.';
  let s = latin(String(text ?? ''));
  if (r.prefix) s = s.split(r.prefix).join('');
  if (r.suffix) s = s.split(r.suffix).join('');
  // Keep the number's own characters; what is left of the formatting goes.
  s = s.split(decimal).join('\u0001').replace(/[^0-9\u0001-]/g, '').replace(/\u0001/g, '.');
  const negatives = r.min === null || r.min === undefined || r.min < 0;
  const minus = negatives ? '-?' : '';
  const fraction = r.maxFractionDigits > 0 ? `(\\.\\d{0,${Math.floor(r.maxFractionDigits)}})?` : '';
  if (!new RegExp(`^${minus}\\d*${fraction}$`).test(s)) return false;
  const n = Number(s.replace(/^-?\.?$/, '0').replace(/\.$/, ''));
  return r.max === null || r.max === undefined || isNaN(n) || n <= r.max;
}

/**
 * Whether typing `inserted` over the selection [start, end) of `current` gives text the field may hold
 * (see `acceptsNumberText`). Letters and other signs are refused outright.
 */
export function acceptsNumberInput(current: string, start: number, end: number, inserted: string, r: NumberTypingRules): boolean {
  const decimal = r.decimal || '.';
  const group = decimal === '.' ? ',' : '.';
  const typed = latin(inserted).split(decimal).join('').split(group).join('').replace(/[\s-]/g, '');
  if (/[^0-9]/.test(typed)) return false;
  return acceptsNumberText(current.slice(0, start) + inserted + current.slice(end), r);
}

function latin(s: string): string {
  return s.replace(/[๐-๙]/g, (d) => String(d.charCodeAt(0) - 0x0e50));
}
