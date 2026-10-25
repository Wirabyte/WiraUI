/** One row of a select list: an option, or the heading of a group (`group: true`). */
export interface SelectItem {
  option: unknown;
  label: string;
  value: unknown;
  disabled: boolean;
  /** Heading of a group of options; never picked. */
  group?: boolean;
}

/** Which fields of an option object hold its label, value and so on (`optionLabel="name_th"`). */
export interface SelectFields {
  label?: string | null;
  value?: string | null;
  disabled?: string | null;
  /** Options are groups (`{ label, items: [...] }`). */
  group?: boolean;
  groupLabel?: string | null;
  groupChildren?: string | null;
}

export type SelectMatchMode = 'contains' | 'startsWith' | 'endsWith' | 'equals';

/** A field of an option by path (`'name'`, `'address.city'`); the option itself when there is no path or it is not an object. */
export function optionField(option: unknown, path?: string | null): unknown {
  if (!path || option === null || typeof option !== 'object') return option;
  let v: unknown = option;
  for (const key of path.split('.')) {
    if (v === null || v === undefined || typeof v !== 'object') return undefined;
    v = (v as Record<string, unknown>)[key];
  }
  return v;
}

const asText = (v: unknown): string => (v === null || v === undefined ? '' : String(v));

function item(option: unknown, f: SelectFields): SelectItem {
  const label = f.label ? optionField(option, f.label) : typeof option === 'object' && option !== null ? (option as { label?: unknown }).label ?? option : option;
  const value = f.value ? optionField(option, f.value) : option;
  const disabled = f.disabled ? !!optionField(option, f.disabled) : !!(option && typeof option === 'object' && (option as { disabled?: unknown }).disabled);
  return { option, label: asText(label), value, disabled };
}

/** The rows a select shows, groups flattened into a heading followed by its options. */
export function selectItems(options: readonly unknown[] | null | undefined, f: SelectFields = {}): SelectItem[] {
  const out: SelectItem[] = [];
  for (const o of options || []) {
    if (f.group) {
      const label = asText(optionField(o, f.groupLabel || 'label'));
      out.push({ option: o, label, value: undefined, disabled: true, group: true });
      const children = optionField(o, f.groupChildren || 'items');
      for (const c of Array.isArray(children) ? children : []) out.push(item(c, f));
    } else {
      out.push(item(o, f));
    }
  }
  return out;
}

/** Equal values: the same thing, the same `dataKey`, or objects / arrays / dates with equal contents. */
export function sameValue(a: unknown, b: unknown, dataKey?: string | null): boolean {
  if (a === b) return true;
  if (a === null || b === null || a === undefined || b === undefined) return false;
  if (dataKey && typeof a === 'object' && typeof b === 'object') return optionField(a, dataKey) === optionField(b, dataKey);
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a as object);
  const kb = Object.keys(b as object);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => sameValue((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
}

/** Text to compare when searching: lower case, Thai digits as 0–9, runs of spaces as one, no zero-width characters. */
export function searchText(s: string): string {
  return String(s ?? '')
    .normalize('NFC')
    .replace(/[​-‍﻿]/g, '')
    .replace(/[๐-๙]/g, (d) => String(d.charCodeAt(0) - 0x0e50))
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase();
}

function matches(text: string, query: string, mode: SelectMatchMode): boolean {
  switch (mode) {
    case 'startsWith':
      return text.startsWith(query);
    case 'endsWith':
      return text.endsWith(query);
    case 'equals':
      return text === query;
    default:
      return text.includes(query);
  }
}

/**
 * Rows whose label (or the `filterBy` fields, comma separated as in `filterBy="name_th,code"`) match the query.
 * A group heading stays while any of its options matches.
 */
export function filterItems(items: SelectItem[], query: string, filterBy?: string | null, mode: SelectMatchMode = 'contains'): SelectItem[] {
  const q = searchText(query);
  if (!q) return items;
  const fields = (filterBy || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const hit = (it: SelectItem) =>
    fields.length ? fields.some((f) => matches(searchText(asText(optionField(it.option, f))), q, mode)) : matches(searchText(it.label), q, mode);
  const out: SelectItem[] = [];
  let heading: SelectItem | null = null;
  for (const it of items) {
    if (it.group) {
      heading = it;
      continue;
    }
    if (!hit(it)) continue;
    if (heading) {
      out.push(heading);
      heading = null;
    }
    out.push(it);
  }
  return out;
}

const pickable = (it: SelectItem | undefined) => !!it && !it.group && !it.disabled;

/** The next pickable row from `from` in `step` direction (no wrapping), or `from` when there is none. */
export function stepIndex(items: SelectItem[], from: number, step: number): number {
  let i = from;
  const dir = step < 0 ? -1 : 1;
  let left = Math.abs(step) || 1;
  let found = from;
  while (left > 0) {
    i += dir;
    if (i < 0 || i >= items.length) break;
    if (pickable(items[i])) {
      found = i;
      left--;
    }
  }
  return found;
}

export function firstIndex(items: SelectItem[]): number {
  return items.findIndex(pickable);
}

export function lastIndex(items: SelectItem[]): number {
  for (let i = items.length - 1; i >= 0; i--) if (pickable(items[i])) return i;
  return -1;
}

/** Index of the row holding `value`, or -1. */
export function indexOfValue(items: SelectItem[], value: unknown, dataKey?: string | null): number {
  if (value === null || value === undefined) return -1;
  return items.findIndex((it) => !it.group && sameValue(it.value, value, dataKey));
}

/**
 * Type-to-find: the next pickable row after `from` whose label starts with `text`, wrapping round. Typing one letter
 * again cycles through the rows starting with it, as native selects do.
 */
export function typeaheadIndex(items: SelectItem[], text: string, from: number): number {
  const q = searchText(text);
  if (!q) return -1;
  const same = q.length > 1 && [...q].every((c) => c === q[0]);
  const prefix = same ? q[0] : q;
  const n = items.length;
  const start = same || q.length === 1 ? from + 1 : Math.max(from, 0);
  for (let k = 0; k < n; k++) {
    const i = (start + k + n) % n;
    if (pickable(items[i]) && searchText(items[i].label).startsWith(prefix)) return i;
  }
  return -1;
}
