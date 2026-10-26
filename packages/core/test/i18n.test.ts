import { describe, expect, it } from 'vitest';
import { flattenMessages, interpolate, matchLanguage, pickLanguage, translateKey } from '../src/i18n';

describe('flattenMessages', () => {
  it('turns nested messages into dotted keys and keeps flat ones', () => {
    expect(flattenMessages({ menu: { home: 'Home', admin: { users: 'Users' } }, 'บันทึก': 'Save' })).toEqual({
      'menu.home': 'Home',
      'menu.admin.users': 'Users',
      'บันทึก': 'Save',
    });
  });
  it('skips values that are not text and copes with nothing', () => {
    expect(flattenMessages({ a: 1, b: null, c: 'C' } as never)).toEqual({ c: 'C' });
    expect(flattenMessages(null)).toEqual({});
  });
});

describe('interpolate', () => {
  it('fills placeholders and leaves unknown ones', () => {
    expect(interpolate('สวัสดี {name} มี {count} รายการ {other}', { name: 'วิระ', count: 3 })).toBe('สวัสดี วิระ มี 3 รายการ {other}');
    expect(interpolate('{ name }!', { name: 'A' })).toBe('A!');
    expect(interpolate('no params {x}')).toBe('no params {x}');
  });
});

describe('translateKey', () => {
  const dicts = new Map<string, Record<string, string>>([
    ['th', { 'menu.home': 'หน้าแรก' }],
    ['en', { 'บันทึก': 'Save', 'menu.home': 'Home', 'สวัสดี {name}': 'Hello {name}' }],
  ]);
  it('uses the language, then the fallback language, then the key', () => {
    expect(translateKey(dicts, 'en', 'th', 'บันทึก')).toBe('Save');
    expect(translateKey(dicts, 'th', 'th', 'บันทึก')).toBe('บันทึก');
    expect(translateKey(dicts, 'zh', 'th', 'menu.home')).toBe('หน้าแรก');
    expect(translateKey(dicts, 'en', 'th', 'ไม่มี')).toBe('ไม่มี');
  });
  it('fills placeholders in the translated text', () => {
    expect(translateKey(dicts, 'en', 'th', 'สวัสดี {name}', { name: 'Wira' })).toBe('Hello Wira');
    expect(translateKey(dicts, 'th', 'th', 'สวัสดี {name}', { name: 'วิระ' })).toBe('สวัสดี วิระ');
  });
});

describe('matchLanguage / pickLanguage', () => {
  it('matches regional codes to the base language, ignoring case', () => {
    expect(matchLanguage(['th', 'en'], 'en-US')).toBe('en');
    expect(matchLanguage(['th', 'EN'], 'en')).toBe('EN');
    expect(matchLanguage(['th', 'zh-TW'], 'zh-tw')).toBe('zh-TW');
    expect(matchLanguage(['th', 'en'], 'ja')).toBeNull();
  });
  it('starts in the saved language, else the browser one, else the default', () => {
    expect(pickLanguage(['th', 'en'], 'th', 'en', ['th-TH'])).toBe('en');
    expect(pickLanguage(['th', 'en'], 'th', 'fr', ['ja', 'en-GB'])).toBe('en');
    expect(pickLanguage(['th', 'en'], 'th', null, null)).toBe('th');
    expect(pickLanguage(['en', 'th'], 'xx')).toBe('en');
  });
});
