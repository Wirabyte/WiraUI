import { describe, expect, it } from 'vitest';
import { EN_LOCALE, formatDate, formatThaiId, isValidThaiId, parseDate, thaiIdCheckDigit, toBuddhistYear } from '../src';

describe('Thai national ID', () => {
  it('computes the check digit', () => {
    expect(thaiIdCheckDigit('110370234567')).toBe(9);
    expect(isValidThaiId('1-1037-02345-67-9')).toBe(true);
    expect(isValidThaiId('1103702345678')).toBe(false);
    expect(isValidThaiId('123')).toBe(false);
  });
  it('formats while typing', () => {
    expect(formatThaiId('11037')).toBe('1-1037');
    expect(formatThaiId('1103702345679999')).toBe('1-1037-02345-67-9');
  });
});

describe('Buddhist calendar', () => {
  const d = new Date(2013, 2, 12);
  it('formats in พ.ศ.', () => {
    expect(toBuddhistYear(2026)).toBe(2569);
    expect(formatDate(d, 'd MMMM yyyy', { calendar: 'buddhist' })).toBe('12 มีนาคม 2556');
    expect(formatDate(d, 'dd/MM/yyyy', { calendar: 'buddhist' })).toBe('12/03/2556');
    expect(formatDate(d, "EEEE'ที่' d MMM yy", { calendar: 'buddhist' })).toBe('อังคารที่ 12 มี.ค. 56');
    expect(formatDate(d, 'MMM d, yyyy', { locale: EN_LOCALE })).toBe('Mar 12, 2013');
  });
  it('parses พ.ศ. back to an ordinary Date', () => {
    expect(parseDate('12/03/2556', 'dd/MM/yyyy', { calendar: 'buddhist' })?.getTime()).toBe(d.getTime());
    expect(parseDate('12 มีนาคม 2556', 'd MMMM yyyy', { calendar: 'buddhist' })?.getTime()).toBe(d.getTime());
    expect(parseDate('12/03/2013', 'dd/MM/yyyy')?.getTime()).toBe(d.getTime());
  });
  it('rejects text that is not a real day', () => {
    expect(parseDate('31/02/2556', 'dd/MM/yyyy', { calendar: 'buddhist' })).toBeNull();
    expect(parseDate('hello', 'dd/MM/yyyy')).toBeNull();
  });
});
