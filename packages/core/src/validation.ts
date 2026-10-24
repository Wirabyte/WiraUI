import { TH_LOCALE, WtLocale, WtValidationMessages } from './thai/locale';

/** The errors of a form control, as Angular gives them (`{ required: true, minlength: { requiredLength: 8 } }`). */
export type ValidationErrorsLike = Record<string, unknown> | null | undefined;

/**
 * The message for the first error of a control, in the locale's words:
 * `validationMessage({ minlength: { requiredLength: 8, actualLength: 3 } })` → `ต้องมีอย่างน้อย 8 ตัวอักษร`.
 * `overrides` (by error key) win over the locale; an error whose value is a string is used as its own message.
 */
export function validationMessage(
  errors: ValidationErrorsLike,
  o: { locale?: WtLocale; label?: string; overrides?: Partial<Record<string, string>> } = {},
): string {
  if (!errors) return '';
  const keys = Object.keys(errors);
  if (!keys.length) return '';
  const key = keys[0];
  const detail = errors[key];
  const m: WtValidationMessages = (o.locale || TH_LOCALE).validation || TH_LOCALE.validation;
  const own = o.overrides?.[key];
  let text: string;
  if (own) text = own;
  else if (typeof detail === 'string') text = detail;
  else if (key === 'required') text = o.label ? m.requiredLabel : m.required;
  else if (key in m) text = m[key as keyof WtValidationMessages];
  else text = m.invalid;
  const values: Record<string, unknown> = { label: o.label ?? '', ...(typeof detail === 'object' && detail ? (detail as Record<string, unknown>) : {}) };
  return text.replace(/\{(\w+)\}/g, (_, name: string) => (values[name] === undefined ? '' : String(values[name])));
}

/**
 * A Thai phone number: mobile (06, 08, 09 + 8 digits) or landline (02–07 + 7 digits), with or without
 * dashes and spaces, or +66 in place of the leading 0. Thai digits count.
 */
export function isThaiPhone(value: string): boolean {
  let d = String(value || '')
    .replace(/[๐-๙]/g, (c) => String(c.charCodeAt(0) - 0x0e50))
    .replace(/[\s().-]/g, '');
  if (d.startsWith('+66')) d = '0' + d.slice(3);
  return /^0[689]\d{8}$/.test(d) || /^0[2-7]\d{7}$/.test(d);
}
