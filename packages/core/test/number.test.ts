import { describe, expect, it } from 'vitest';
import { acceptsNumberInput, acceptsNumberText, decimalSeparator, clampNumber, editableNumber, formatNumber, fractionDigits, parseNumber, stepNumber } from '../src';

describe('formatNumber', () => {
  it('groups thousands and pads fraction digits', () => {
    expect(formatNumber(1234.5, { minFractionDigits: 2 })).toBe('1,234.50');
    expect(formatNumber(1234.5678)).toBe('1,234.568');
    expect(formatNumber(1234, { useGrouping: false })).toBe('1234');
  });
  it('formats baht in currency mode', () => {
    expect(formatNumber(1234.5, { mode: 'currency' })).toBe('฿1,234.50');
    expect(formatNumber(10, { mode: 'currency', currency: 'USD', locale: 'en-US' })).toBe('$10.00');
  });
  it('adds prefix and suffix, and shows nothing for no value', () => {
    expect(formatNumber(80, { suffix: ' กก.' })).toBe('80 กก.');
    expect(formatNumber(null)).toBe('');
    expect(formatNumber(NaN)).toBe('');
  });
  it('never lets min fraction digits exceed max', () => {
    expect(fractionDigits({ minFractionDigits: 4, maxFractionDigits: 2 })).toEqual({ min: 4, max: 4 });
  });
});

describe('editableNumber', () => {
  it('drops grouping and exponents', () => {
    expect(editableNumber(1234567.25)).toBe('1234567.25');
    expect(editableNumber(1e-7)).toBe('0.0000001');
    expect(editableNumber(null)).toBe('');
  });
});

describe('parseNumber', () => {
  it('reads formatted, pasted and Thai-digit text', () => {
    expect(parseNumber('1,234.50')).toBe(1234.5);
    expect(parseNumber('฿ 1,234.50')).toBe(1234.5);
    expect(parseNumber('๑๒๓.๔')).toBe(123.4);
    expect(parseNumber('-12')).toBe(-12);
    expect(parseNumber('(12)')).toBe(-12);
    expect(parseNumber('12,5')).toBe(12.5);
    expect(parseNumber('80 กก.', { suffix: ' กก.' })).toBe(80);
  });
  it('returns null for empty or unreadable text', () => {
    expect(parseNumber('')).toBeNull();
    expect(parseNumber('abc')).toBeNull();
    expect(parseNumber('.')).toBeNull();
    expect(parseNumber(null)).toBeNull();
  });
});

describe('clampNumber and stepNumber', () => {
  it('clamps and rounds', () => {
    expect(clampNumber(150, { min: 0, max: 100 })).toBe(100);
    expect(clampNumber(-5, { min: 0 })).toBe(0);
    expect(clampNumber(1.23456, { maxFractionDigits: 2 })).toBe(1.23);
    expect(clampNumber(null, { min: 0 })).toBeNull();
  });
  it('steps without float noise and stays in range', () => {
    expect(stepNumber(0.1, 0.2, 1)).toBe(0.3);
    expect(stepNumber(null, 1, 1)).toBe(1);
    expect(stepNumber(10, 5, 1, { max: 12 })).toBe(12);
    expect(stepNumber(null, 1, 1, { min: 5 })).toBe(5);
    expect(stepNumber(0, 1, -1, { min: 0 })).toBe(0);
  });
});

describe('typing into a number field', () => {
  const money = { min: 0, max: 100000, maxFractionDigits: 2, decimal: '.' };
  it('refuses letters and other signs', () => {
    expect(acceptsNumberInput('12', 2, 2, 'a', money)).toBe(false);
    expect(acceptsNumberInput('12', 2, 2, 'ก', money)).toBe(false);
    expect(acceptsNumberInput('12', 2, 2, '3', money)).toBe(true);
    expect(acceptsNumberInput('12', 2, 2, '๓', money)).toBe(true);
  });
  it('locks the decimals', () => {
    expect(acceptsNumberInput('12.5', 4, 4, '0', money)).toBe(true);
    expect(acceptsNumberInput('12.50', 5, 5, '1', money)).toBe(false);
    expect(acceptsNumberInput('12.5', 4, 4, '.', money)).toBe(false);
    expect(acceptsNumberInput('12', 2, 2, '.', { ...money, maxFractionDigits: 0 })).toBe(false);
  });
  it('stops at max but lets a value pass below min on the way', () => {
    expect(acceptsNumberInput('10000', 5, 5, '0', money)).toBe(true);
    expect(acceptsNumberInput('100000', 6, 6, '1', money)).toBe(false);
    expect(acceptsNumberInput('', 0, 0, '5', { ...money, min: 10 })).toBe(true);
  });
  it('allows a minus only when min allows negatives', () => {
    expect(acceptsNumberInput('', 0, 0, '-', money)).toBe(false);
    expect(acceptsNumberInput('', 0, 0, '-', { ...money, min: -50 })).toBe(true);
    expect(acceptsNumberInput('-5', 2, 2, '-', { ...money, min: -50 })).toBe(false);
  });
  it('reads the formatting already in the field', () => {
    expect(acceptsNumberText('฿1,234.50', money)).toBe(true);
    expect(acceptsNumberText('฿1,234.505', money)).toBe(false);
    expect(acceptsNumberText('60 กก.', { min: 0, max: 200, maxFractionDigits: 1, suffix: ' กก.' })).toBe(true);
    expect(acceptsNumberText('1.234,5', { min: 0, max: 1e6, maxFractionDigits: 2, decimal: ',' })).toBe(true);
    expect(decimalSeparator('de-DE')).toBe(',');
    expect(decimalSeparator('th-TH')).toBe('.');
  });
});
