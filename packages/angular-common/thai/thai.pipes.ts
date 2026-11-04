import { inject, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { ɵrefreshOnTranslation, WuConfig } from '@wirabyte/ui/config';
import {
  bahtText,
  CalendarSystem,
  datePattern,
  formatDate,
  formatThaiId,
  formatThaiPhone,
  LOCALES,
  ThaiDateFormat,
  timeAgo,
  toDateValue,
  toThaiDigits,
} from '@wirabyte/ui/core';

export type { ThaiDateFormat };

/**
 * A date in the app's language, with พ.ศ. years in Thai: `{{ born | wuDate }}` → `14 พ.ค. 2555`. Formats:
 * `short` 14/05/2555 · `medium` 14 พ.ค. 2555 (default) · `long` 14 พฤษภาคม 2555 · `full` วันจันทร์ที่ 14 พฤษภาคม พ.ศ. 2555
 * · `time` 09:30 น. · `shortDateTime` · `dateTime`, or a pattern (`'d MMM yy'`, `"EEEE d MMMM yyyy 'เวลา' HH:mm"`).
 * Takes a Date, a time in ms or text (`'2012-05-14'` is that day, not UTC midnight). The calendar follows
 * `provideWiraUI({ calendar })` in Thai and is Gregorian in other languages, unless given:
 * `{{ born | wuDate: 'long' : 'gregorian' }}`; a language too: `{{ born | wuDate: 'long' : null : 'en' }}`.
 * Re-renders by itself when the app's language changes (OnPush and zoneless views included).
 */
@Pipe({ name: 'wuDate', standalone: true, pure: false })
export class WuDatePipe implements PipeTransform, OnDestroy {
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();
  private lastKey = '';
  private lastLocale: unknown = null;
  private lastValue = '';

  transform(value: unknown, format: ThaiDateFormat | string = 'medium', calendar?: CalendarSystem | null, lang?: string | null): string {
    const date = toDateValue(value);
    if (!date) return '';
    const own = this.config.translation;
    const language = lang || own.code || 'th';
    const cal: CalendarSystem = calendar || this.config.calendarFor(language);
    const key = `${date.getTime()}|${format}|${cal}|${language}`;
    if (key === this.lastKey && own === this.lastLocale) return this.lastValue;
    const locale = language === own.code ? own : LOCALES[language] || own;
    this.lastKey = key;
    this.lastLocale = own;
    this.lastValue = formatDate(date, datePattern(format || 'medium', language, cal), { locale, calendar: cal });
    return this.lastValue;
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }
}

/** How long ago, in the app's language: `{{ sentAt | wuTimeAgo }}` → `5 นาทีที่ผ่านมา`, `เมื่อวาน`, `in 3 days`. */
@Pipe({ name: 'wuTimeAgo', standalone: true, pure: false })
export class WuTimeAgoPipe implements PipeTransform, OnDestroy {
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  transform(value: unknown, lang?: string | null): string {
    return timeAgo(value, lang || this.config.translation.code || 'th', this.config.now());
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }
}

/** An amount in Thai words, as Excel's BAHTTEXT: `{{ 1250.5 | wuBahtText }}` → `หนึ่งพันสองร้อยห้าสิบบาทห้าสิบสตางค์`. */
@Pipe({ name: 'wuBahtText', standalone: true })
export class WuBahtTextPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    return bahtText(value);
  }
}

/** A Thai phone number with dashes: `{{ '0812345678' | wuThaiPhone }}` → `081-234-5678` (`+66` too). */
@Pipe({ name: 'wuThaiPhone', standalone: true })
export class WuThaiPhonePipe implements PipeTransform {
  transform(value: unknown, separator = '-'): string {
    return formatThaiPhone(value, separator);
  }
}

/** A Thai national ID with dashes: `{{ '1103702345679' | wuThaiId }}` → `1-1037-02345-67-9`. */
@Pipe({ name: 'wuThaiId', standalone: true })
export class WuThaiIdPipe implements PipeTransform {
  transform(value: unknown): string {
    return value === null || value === undefined ? '' : formatThaiId(String(value));
  }
}

/** Thai digits for formal documents: `{{ '2569' | wuThaiDigits }}` → `๒๕๖๙` (works after other pipes too). */
@Pipe({ name: 'wuThaiDigits', standalone: true })
export class WuThaiDigitsPipe implements PipeTransform {
  transform(value: unknown): string {
    return toThaiDigits(value);
  }
}
