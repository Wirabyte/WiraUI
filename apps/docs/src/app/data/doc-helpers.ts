import { ApiRow, TokenRow } from '../core/component-doc';

/** Shorthands for the component data files. */
export const row = (name: string, type: string, def: string | undefined, th: string, en: string): ApiRow =>
  def === undefined ? { name, type, description: { th, en } } : { name, type, default: def, description: { th, en } };

export const tok = (name: string, th: string, en: string): TokenRow => ({ name, description: { th, en } });

export const importText = {
  th: 'ใช้ได้ทั้ง NgModule (<code>WuXxxModule</code>) และ standalone',
  en: 'Works as an NgModule (<code>WuXxxModule</code>) or standalone.',
};

export const SEVERITY_TYPE = `type WuSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast';
// 'warning' และ 'error' ใช้ได้ด้วย (= 'warn' และ 'danger')
type WuSeverityInput = WuSeverity | 'warning' | 'error' | null | undefined;`;

/** The `styleClass` / `style` pair every component takes (style is an object with unquoted keys). */
export const STYLE_ROW = row(
  'styleClass · style',
  'string · object',
  undefined,
  "class และ style เพิ่มที่ element นอกสุดของ component (style เป็น object เช่น { width: '20rem' })",
  "Extra class and style on the component's outer element (style is an object, e.g. { width: '20rem' })"
);
