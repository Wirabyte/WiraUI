import { ApiRow, TokenRow } from '../core/component-doc';

/** Shorthands for the component data files. */
export const row = (name: string, type: string, def: string | undefined, th: string, en: string): ApiRow =>
  def === undefined ? { name, type, description: { th, en } } : { name, type, default: def, description: { th, en } };

export const tok = (name: string, th: string, en: string): TokenRow => ({ name, description: { th, en } });

export const importText = {
  th: 'ใช้ได้ทั้ง NgModule (<code>WtXxxModule</code>) และ standalone',
  en: 'Works as an NgModule (<code>WtXxxModule</code>) or standalone.',
};

export const SEVERITY_TYPE = `type WtSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast';
// 'warning' และ 'error' ใช้ได้ด้วย (= 'warn' และ 'danger')
type WtSeverityInput = WtSeverity | 'warning' | 'error' | null | undefined;`;
