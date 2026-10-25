import { describe, expect, it } from 'vitest';
import { caretAfter, fillMask, formatMask, maskComplete, maskEmpty, parseMask, typedBefore, unmaskedValue } from '../src';

const ID = parseMask('9-9999-99999-99-9');
const PHONE = parseMask('999-999-9999');

describe('input masks', () => {
  it('fills slots from typed or pasted text, skipping literals and dropping what does not fit', () => {
    const b = fillMask(ID, '1103700012345');
    expect(formatMask(ID, b)).toBe('1-1037-00012-34-5');
    expect(maskComplete(ID, b)).toBe(true);
    expect(unmaskedValue(ID, b)).toBe('1103700012345');
    // Pasting the formatted text, or with spaces and letters mixed in, gives the same.
    expect(unmaskedValue(ID, fillMask(ID, '1-1037-00012-34-5'))).toBe('1103700012345');
    expect(unmaskedValue(PHONE, fillMask(PHONE, '08 1 23x4-5678 9'))).toBe('0812345678');
  });

  it('counts Thai digits as 0–9', () => {
    expect(formatMask(PHONE, fillMask(PHONE, '๐๘๑๒๓๔๕๖๗๘'))).toBe('081-234-5678');
  });

  it('shows slot characters while editing, stops after the last filled slot otherwise', () => {
    const b = fillMask(PHONE, '0812');
    expect(formatMask(PHONE, b, '_', true)).toBe('081-2__-____');
    expect(formatMask(PHONE, b)).toBe('081-2');
    expect(maskComplete(PHONE, b)).toBe(false);
    expect(formatMask(PHONE, fillMask(PHONE, ''))).toBe('');
    expect(maskEmpty(fillMask(PHONE, '---'))).toBe(true);
  });

  it('letters, letters or digits, and an optional tail after ?', () => {
    const plate = parseMask('aa-9999');
    expect(formatMask(plate, fillMask(plate, 'kk1234'))).toBe('kk-1234');
    expect(unmaskedValue(plate, fillMask(plate, '12kk'))).toBe('kk');
    const thai = parseMask('aa', { characterPattern: '[ก-๙]' });
    expect(unmaskedValue(thai, fillMask(thai, 'กขA'))).toBe('กข');
    const ext = parseMask('99-99?99');
    expect(maskComplete(ext, fillMask(ext, '1234'))).toBe(true);
    expect(formatMask(ext, fillMask(ext, '1234'))).toBe('12-34');
    expect(formatMask(ext, fillMask(ext, '123456'))).toBe('12-3456');
    const any = parseMask('**');
    expect(unmaskedValue(any, fillMask(any, 'a1'))).toBe('a1');
  });

  it('puts the caret after the characters typed so far', () => {
    expect(caretAfter(PHONE, 3)).toBe(4);
    expect(caretAfter(PHONE, 0)).toBe(0);
    expect(typedBefore(PHONE, '081-2__-____', 5)).toBe(4);
    expect(caretAfter(ID, 1)).toBe(2);
  });
});
