import { describe, expect, it } from 'vitest';
import { otpAccepts, otpCleanPaste, otpFill, otpTokens, otpValue } from '../src/index';

describe('one-time code boxes', () => {
  it('splits a model value into boxes', () => {
    expect(otpTokens('1234', 4)).toEqual(['1', '2', '3', '4']);
    expect(otpTokens(123456, 4)).toEqual(['1', '2', '3', '4']);
    expect(otpTokens(['a', 'b'], 4)).toEqual(['a', 'b']);
    expect(otpTokens(null, 4)).toEqual([]);
    expect(otpTokens('', 6)).toEqual([]);
  });

  it('joins the boxes back into the value', () => {
    expect(otpValue(['1', '2', '3'], 4)).toBe('123');
    expect(otpValue(['1', '', '3', '4'], 4)).toBe('134');
    expect(otpValue(['1', '2', '3', '4', '5'], 4)).toBe('1234');
  });

  it('takes digits only when integerOnly, and never white space', () => {
    expect(otpAccepts('7', true)).toBe(true);
    expect(otpAccepts('a', true)).toBe(false);
    expect(otpAccepts('a', false)).toBe(true);
    expect(otpAccepts('ก', false)).toBe(true);
    expect(otpAccepts(' ', false)).toBe(false);
    expect(otpAccepts('12', false)).toBe(false);
  });

  it('cleans pasted codes', () => {
    expect(otpCleanPaste('123 456', true)).toEqual(['1', '2', '3', '4', '5', '6']);
    expect(otpCleanPaste('12-34', true)).toEqual(['1', '2', '3', '4']);
    expect(otpCleanPaste('12a4', true)).toBeNull();
    expect(otpCleanPaste('AB12', false)).toEqual(['A', 'B', '1', '2']);
    expect(otpCleanPaste('   ', false)).toBeNull();
  });

  it('fills from the box, a whole code from the first box', () => {
    expect(otpFill(['1', '', '', ''], 1, ['2', '3'], 4)).toEqual({ tokens: ['1', '2', '3', ''], focus: 3 });
    expect(otpFill(['9', '9', '', ''], 2, ['1', '2', '3', '4'], 4)).toEqual({ tokens: ['1', '2', '3', '4'], focus: 3 });
    expect(otpFill([], 3, ['5', '6'], 4)).toEqual({ tokens: ['', '', '', '5'], focus: 3 });
    expect(otpFill([], 0, ['1', '2', '3', '4', '5', '6', '7'], 6).tokens).toEqual(['1', '2', '3', '4', '5', '6']);
  });
});
