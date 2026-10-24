/** `<wt-checkbox binary>` and `[binary]="true"` both mean true; Angular 15 has no booleanAttribute. */
export function ɵtoBool(value: unknown): boolean {
  return value === '' || value === true || value === 'true';
}

let nextId = 0;
/** Unique id for an inner <input> when the app does not pass inputId, so <label for> keeps working. */
export function ɵuniqueId(prefix: string): string {
  return `${prefix}-${++nextId}`;
}
