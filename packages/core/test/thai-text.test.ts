import { describe, expect, it } from 'vitest';
import { bahtText, datePattern, formatDate, formatThaiPhone, fromThaiDigits, thaiNumberText, timeAgo, toDateValue, toThaiDigits, EN_LOCALE } from '../src/index';

describe('baht text', () => {
  // Each line checked against Excel's BAHTTEXT.
  const cases: [number | string, string][] = [
    [0, 'ศูนย์บาทถ้วน'],
    [1, 'หนึ่งบาทถ้วน'],
    [10, 'สิบบาทถ้วน'],
    [11, 'สิบเอ็ดบาทถ้วน'],
    [20, 'ยี่สิบบาทถ้วน'],
    [21, 'ยี่สิบเอ็ดบาทถ้วน'],
    [101, 'หนึ่งร้อยเอ็ดบาทถ้วน'],
    [110, 'หนึ่งร้อยสิบบาทถ้วน'],
    [1234.5, 'หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบสตางค์'],
    [0.01, 'หนึ่งสตางค์'],
    [0.21, 'ยี่สิบเอ็ดสตางค์'],
    [0.5, 'ห้าสิบสตางค์'],
    [1000000, 'หนึ่งล้านบาทถ้วน'],
    [1000001, 'หนึ่งล้านเอ็ดบาทถ้วน'],
    [21000000, 'ยี่สิบเอ็ดล้านบาทถ้วน'],
    [100000000000, 'หนึ่งแสนล้านบาทถ้วน'],
    [1000000000000, 'หนึ่งล้านล้านบาทถ้วน'],
    [-1, 'ลบหนึ่งบาทถ้วน'],
    [3530.75, 'สามพันห้าร้อยสามสิบบาทเจ็ดสิบห้าสตางค์'],
    [12.345, 'สิบสองบาทสามสิบห้าสตางค์'],
    ['1,250.00', 'หนึ่งพันสองร้อยห้าสิบบาทถ้วน'],
  ];
  it.each(cases)('%s', (n, words) => expect(bahtText(n)).toBe(words));

  it('gives nothing for what is not a number', () => {
    expect(bahtText(null)).toBe('');
    expect(bahtText('abc')).toBe('');
    expect(bahtText(NaN)).toBe('');
    expect(thaiNumberText('007')).toBe('เจ็ด');
  });
});

describe('thai digits and phones', () => {
  it('swaps digits both ways', () => {
    expect(toThaiDigits('พ.ศ. 2569 เวลา 14:30')).toBe('พ.ศ. ๒๕๖๙ เวลา ๑๔:๓๐');
    expect(fromThaiDigits('๐๘๑-๒๓๔-๕๖๗๘')).toBe('081-234-5678');
    expect(toThaiDigits(null)).toBe('');
  });

  it('puts dashes in Thai phone numbers', () => {
    expect(formatThaiPhone('0812345678')).toBe('081-234-5678');
    expect(formatThaiPhone('+66 81 234 5678')).toBe('081-234-5678');
    expect(formatThaiPhone('66812345678')).toBe('081-234-5678');
    expect(formatThaiPhone('021234567')).toBe('02-123-4567');
    expect(formatThaiPhone('053123456')).toBe('053-123-456');
    expect(formatThaiPhone('๐๘๑๒๓๔๕๖๗๘')).toBe('081-234-5678');
    expect(formatThaiPhone('0812345678', ' ')).toBe('081 234 5678');
    expect(formatThaiPhone('1669')).toBe('1669');
    expect(formatThaiPhone(' call me ')).toBe('call me');
  });
});

describe('dates for the pipes', () => {
  it('reads dates as apps hold them', () => {
    expect(toDateValue('2012-05-14')).toEqual(new Date(2012, 4, 14));
    expect(toDateValue(new Date(2026, 9, 28))).toEqual(new Date(2026, 9, 28));
    expect(toDateValue(0)?.getTime()).toBe(0);
    expect(toDateValue('not a date')).toBeNull();
    expect(toDateValue(new Date(NaN))).toBeNull();
    expect(toDateValue('')).toBeNull();
  });

  it('names formats in Thai and English', () => {
    const d = new Date(2026, 9, 27, 14, 30);
    const th = (f: string, c: 'buddhist' | 'gregorian' = 'buddhist') => formatDate(d, datePattern(f, 'th', c), { calendar: c });
    expect(th('short')).toBe('27/10/2569');
    expect(th('medium')).toBe('27 ต.ค. 2569');
    expect(th('long')).toBe('27 ตุลาคม 2569');
    expect(th('full')).toBe('วันอังคารที่ 27 ตุลาคม พ.ศ. 2569');
    expect(th('full', 'gregorian')).toBe('วันอังคารที่ 27 ตุลาคม ค.ศ. 2026');
    expect(th('time')).toBe('14:30 น.');
    expect(th('dateTime')).toBe('27 ต.ค. 2569 14:30 น.');
    expect(th('d MMM yy')).toBe('27 ต.ค. 69');
    expect(formatDate(d, datePattern('full', 'en', 'gregorian'), { locale: EN_LOCALE })).toBe('Tuesday, 27 October 2026');
  });

  it('says how long ago', () => {
    const now = new Date(2026, 9, 28, 12, 0);
    expect(timeAgo(new Date(2026, 9, 28, 11, 55), 'en', now)).toBe('5 minutes ago');
    expect(timeAgo(new Date(2026, 9, 27, 12, 0), 'en', now)).toBe('yesterday');
    expect(timeAgo(new Date(2026, 9, 28, 11, 59, 40), 'en', now)).toBe('now');
    expect(timeAgo(new Date(2026, 9, 31, 12, 0), 'en', now)).toBe('in 3 days');
    expect(timeAgo(new Date(2026, 9, 28, 9, 0), 'th', now)).toMatch(/^3 ชั่วโมง/);
    expect(timeAgo(null, 'th', now)).toBe('');
  });
});
