/** Colour roles shared by Tag, Badge, Message and Button. */
export type WuSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast';
/** Also takes the older spellings `'warning'` (= warn) and `'error'` (= danger), so migrated templates keep compiling. */
export type WuSeverityInput = WuSeverity | 'warning' | 'error' | null | undefined;

const KNOWN: readonly string[] = ['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'help', 'contrast'];

export function ɵseverity(value: WuSeverityInput, fallback: WuSeverity = 'primary'): WuSeverity {
  if (value === 'warning') return 'warn';
  if (value === 'error') return 'danger';
  return value && KNOWN.includes(value) ? (value as WuSeverity) : fallback;
}
