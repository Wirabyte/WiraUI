/** `<wu-checkbox binary>` and `[binary]="true"` both mean true; Angular 15 has no booleanAttribute. */
export function ɵtoBool(value: unknown): boolean {
  return value === '' || value === true || value === 'true';
}

let nextId = 0;
/** Unique id for an inner <input> when the app does not pass inputId, so <label for> keeps working. */
export function ɵuniqueId(prefix: string): string {
  return `${prefix}-${++nextId}`;
}

/** A property of an option, by name or dot path (`'address.city'`). */
export function ɵfield(option: unknown, field: string): unknown {
  return field.split('.').reduce<unknown>((o, k) => (o == null ? o : (o as Record<string, unknown>)[k]), option);
}

/** What an option list shows: `optionLabel`, else an object's `label`, else the option itself. */
export function ɵoptionLabel(option: unknown, field?: string): string {
  const v = field ? ɵfield(option, field) : option !== null && typeof option === 'object' && 'label' in option ? (option as { label: unknown }).label : option;
  return v == null ? '' : String(v);
}

/** What selecting an option writes to the model: `optionValue`, else the whole option. */
export function ɵoptionValue(option: unknown, field?: string): unknown {
  return field ? ɵfield(option, field) : option;
}

export function ɵoptionDisabled(option: unknown, field?: string): boolean {
  if (field) return !!ɵfield(option, field);
  return option !== null && typeof option === 'object' && !!(option as { disabled?: unknown }).disabled;
}

/** Equal by identity, or by `dataKey` for objects that are re-created (e.g. reloaded from a server). */
export function ɵsameValue(a: unknown, b: unknown, dataKey?: string): boolean {
  if (a === b) return true;
  return !!dataKey && a !== null && b !== null && typeof a === 'object' && typeof b === 'object' && ɵfield(a, dataKey) === ɵfield(b, dataKey);
}

/** `size` of a component: small or large (also `sm` / `lg`). Leave out for the regular size. */
export type WuSize = 'small' | 'large' | 'sm' | 'lg';

/** `'sm'`, `'lg'` or null for a `size` input, whichever spelling was used. */
export function ɵsize(v: unknown): 'sm' | 'lg' | null {
  return v === 'small' || v === 'sm' ? 'sm' : v === 'large' || v === 'lg' ? 'lg' : null;
}
