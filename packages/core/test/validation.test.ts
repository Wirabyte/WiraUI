import { describe, expect, it } from 'vitest';
import { EN_LOCALE, isThaiPhone, validationMessage } from '../src';

describe('validation messages', () => {
  it('words the first error in Thai, with values from the error', () => {
    expect(validationMessage({ required: true })).toBe('กรุณากรอกข้อมูลนี้');
    expect(validationMessage({ required: true }, { label: 'อีเมล' })).toBe('กรุณากรอกอีเมล');
    expect(validationMessage({ minlength: { requiredLength: 8, actualLength: 3 } })).toBe('ต้องมีอย่างน้อย 8 ตัวอักษร');
    expect(validationMessage({ max: { max: 100, actual: 120 } })).toBe('ต้องไม่เกิน 100');
    expect(validationMessage({ email: true, required: true })).toBe('รูปแบบอีเมลไม่ถูกต้อง');
  });
  it('takes English, overrides, own string messages and unknown keys', () => {
    expect(validationMessage({ required: true }, { locale: EN_LOCALE, label: 'Email' })).toBe('Email is required');
    expect(validationMessage({ pattern: { requiredPattern: '^a' } }, { overrides: { pattern: 'ขึ้นต้นด้วย a' } })).toBe('ขึ้นต้นด้วย a');
    expect(validationMessage({ taken: 'ชื่อนี้ถูกใช้แล้ว' })).toBe('ชื่อนี้ถูกใช้แล้ว');
    expect(validationMessage({ somethingElse: true })).toBe('ข้อมูลไม่ถูกต้อง');
    expect(validationMessage(null)).toBe('');
  });
  it('knows Thai phone numbers', () => {
    expect(isThaiPhone('081-234-5678')).toBe(true);
    expect(isThaiPhone('+66 81 234 5678')).toBe(true);
    expect(isThaiPhone('02-123-4567')).toBe(true);
    expect(isThaiPhone('๐๘๑๒๓๔๕๖๗๘')).toBe(true);
    expect(isThaiPhone('0812345')).toBe(false);
    expect(isThaiPhone('011-234-5678')).toBe(false);
  });
});
