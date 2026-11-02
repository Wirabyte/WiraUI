/** wu-chart: how values read on axes, labels and tooltips. */

/**
 * `'number'` 1,234.5 · `'integer'` 1,235 · `'percent'` 12.3% (0.123 in) · `'currency'` ฿1,234 · `'compact'` 1.2 พัน /
 * 2.5 แสน / 98.8 ล้าน in Thai (1.2K / 98.8M in English) · `'date'` 14 พ.ค. 2569 (a time in ms) · or a function of your own.
 */
export type ChartValueFormat = 'number' | 'integer' | 'percent' | 'currency' | 'compact' | 'date' | ((value: number) => string);

export interface ChartFormatOptions {
  /** `'th'` or `'en'` (any BCP 47 tag works for Intl). Default `'th'`. */
  lang?: string;
  /** Currency code for `'currency'`. Default `'THB'`. */
  currency?: string;
  /** Digits after the point; default: up to 2 (0 for `integer`, 1 for `percent` and `compact`). */
  decimals?: number;
  /** Text before / after every value: `suffix: ' คน'`. */
  prefix?: string;
  suffix?: string;
}

const THAI_UNITS: [number, string][] = [
  [1e12, 'ล้านล้าน'],
  [1e9, 'พันล้าน'],
  [1e6, 'ล้าน'],
  [1e5, 'แสน'],
  [1e4, 'หมื่น'],
  [1e3, 'พัน'],
];
const LATIN_UNITS: [number, string][] = [
  [1e12, 'T'],
  [1e9, 'B'],
  [1e6, 'M'],
  [1e3, 'K'],
];

const intlTag = (lang: string) => (lang === 'th' ? 'th-TH' : lang === 'en' ? 'en-US' : lang);

function number(value: number, lang: string, min: number, max: number): string {
  return new Intl.NumberFormat(intlTag(lang), { minimumFractionDigits: min, maximumFractionDigits: max }).format(value);
}

/** A value as the chart writes it. Not a number → `''`. */
export function formatChartValue(value: number | null | undefined, format: ChartValueFormat | null | undefined = 'number', o: ChartFormatOptions = {}): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '';
  if (typeof format === 'function') return format(value);
  const lang = o.lang || 'th';
  const d = o.decimals;
  let text: string;
  switch (format) {
    case 'integer':
      text = number(Math.round(value), lang, 0, 0);
      break;
    case 'date':
      // A time in ms: day, short month and year (Thai: the Buddhist year).
      text = new Intl.DateTimeFormat(intlTag(lang), { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
      break;
    case 'percent':
      text = new Intl.NumberFormat(intlTag(lang), { style: 'percent', minimumFractionDigits: d ?? 0, maximumFractionDigits: d ?? 1 }).format(value);
      break;
    case 'currency':
      text = new Intl.NumberFormat(intlTag(lang), {
        style: 'currency',
        currency: o.currency || 'THB',
        // ฿ in every language (en-US would write "THB").
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: d ?? 0,
        maximumFractionDigits: d ?? 2,
      }).format(value);
      break;
    case 'compact': {
      const abs = Math.abs(value);
      const unit = (lang === 'th' ? THAI_UNITS : LATIN_UNITS).find(([size]) => abs >= size);
      if (!unit) {
        text = number(value, lang, 0, d ?? 1);
        break;
      }
      const short = number(value / unit[0], lang, 0, d ?? 1);
      text = lang === 'th' ? `${short} ${unit[1]}` : short + unit[1];
      break;
    }
    default:
      text = number(value, lang, d ?? 0, d ?? 2);
  }
  return (o.prefix || '') + text + (o.suffix || '');
}
