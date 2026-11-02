import { sameValue } from './select';
import { filterGlobal, FilterMatchMode } from './table';

/**
 * Lists the user orders by hand: wu-picklist (two lists, items move between them) and wu-orderlist (one list).
 * The arrays are changed in place, as apps expect: they bind `[source]="available"` and read `available` again in
 * `(onMoveToTarget)`.
 */

/** How two items are told apart: the same object, or the same `dataKey` field when one is given. */
export type ListSame<T = unknown> = (a: T, b: T) => boolean;

export function listSame<T = unknown>(dataKey?: string | null): ListSame<T> {
  return dataKey ? (a, b) => a === b || sameValue(a, b, dataKey) : (a, b) => a === b;
}

const has = <T>(items: readonly T[], item: T, same: ListSame<T>) => items.some((s) => same(s, item));

/** Indexes in `list` of the `selected` items, in list order. */
export function listIndexes<T>(list: readonly T[], selected: readonly T[], same: ListSame<T> = listSame()): number[] {
  const out: number[] = [];
  if (!selected.length) return out;
  list.forEach((item, i) => {
    if (has(selected, item, same)) out.push(i);
  });
  return out;
}

/** The `selected` items in the order they have in `list` (the order they move in). */
export function inListOrder<T>(list: readonly T[], selected: readonly T[], same: ListSame<T> = listSame()): T[] {
  return listIndexes(list, selected, same).map((i) => list[i]);
}

/** Moves the selected items one place up; a block already at the top stays. Returns whether anything moved. */
export function moveUp<T>(list: T[], selected: readonly T[], same: ListSame<T> = listSame()): boolean {
  let floor = 0;
  let moved = false;
  for (const i of listIndexes(list, selected, same)) {
    if (i > floor) {
      [list[i - 1], list[i]] = [list[i], list[i - 1]];
      moved = true;
      floor = i;
    } else {
      floor = i + 1;
    }
  }
  return moved;
}

/** Moves the selected items one place down; a block already at the bottom stays. */
export function moveDown<T>(list: T[], selected: readonly T[], same: ListSame<T> = listSame()): boolean {
  let ceiling = list.length - 1;
  let moved = false;
  const idx = listIndexes(list, selected, same);
  for (let k = idx.length - 1; k >= 0; k--) {
    const i = idx[k];
    if (i < ceiling) {
      [list[i + 1], list[i]] = [list[i], list[i + 1]];
      moved = true;
      ceiling = i;
    } else {
      ceiling = i - 1;
    }
  }
  return moved;
}

/** Moves the selected items to the top, keeping their order. */
export function moveTop<T>(list: T[], selected: readonly T[], same: ListSame<T> = listSame()): boolean {
  const idx = listIndexes(list, selected, same);
  if (!idx.length || idx.every((i, k) => i === k)) return false;
  const picked = idx.map((i) => list[i]);
  const rest = list.filter((_, i) => !idx.includes(i));
  list.splice(0, list.length, ...picked, ...rest);
  return true;
}

/** Moves the selected items to the bottom, keeping their order. */
export function moveBottom<T>(list: T[], selected: readonly T[], same: ListSame<T> = listSame()): boolean {
  const idx = listIndexes(list, selected, same);
  const start = list.length - idx.length;
  if (!idx.length || idx.every((i, k) => i === start + k)) return false;
  const picked = idx.map((i) => list[i]);
  const rest = list.filter((_, i) => !idx.includes(i));
  list.splice(0, list.length, ...rest, ...picked);
  return true;
}

/**
 * Takes `items` out of `from` and puts them into `to` at `at` (the end by default), in the order they had in `from`.
 * Returns the items that moved.
 */
export function transferItems<T>(from: T[], to: T[], items: readonly T[], at: number = to.length, same: ListSame<T> = listSame()): T[] {
  const moved: T[] = [];
  for (let i = 0; i < from.length; ) {
    if (has(items, from[i], same)) moved.push(from.splice(i, 1)[0]);
    else i++;
  }
  to.splice(Math.max(0, Math.min(at, to.length)), 0, ...moved);
  return moved;
}

/**
 * Drag and drop inside one list: puts `items` before the item at `at` (an index counted before they were taken out;
 * `list.length` = the end). Returns whether the order changed.
 */
export function moveItemsTo<T>(list: T[], items: readonly T[], at: number, same: ListSame<T> = listSame()): boolean {
  const idx = listIndexes(list, items, same);
  if (!idx.length) return false;
  const before = idx.filter((i) => i < at).length;
  const target = Math.max(0, Math.min(at, list.length)) - before;
  if (idx.every((i, k) => i === target + k)) return false;
  const picked = idx.map((i) => list[i]);
  const rest = list.filter((_, i) => !idx.includes(i));
  rest.splice(target, 0, ...picked);
  list.splice(0, list.length, ...rest);
  return true;
}

/** Fields to search, from `filterBy="name,code"`. */
export function listFilterFields(filterBy?: string | null): string[] {
  return (filterBy || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Items matching the search box: any `filterBy` field (dot paths), or every top-level value when none is given. */
export function filterListItems<T>(items: readonly T[], query: string, filterBy?: string | null, mode: FilterMatchMode = 'contains'): T[] {
  return filterGlobal(items, query, listFilterFields(filterBy), mode);
}

/**
 * One list's selection, search and keyboard focus. The list itself stays the app's array; `visible()` is what the
 * search leaves. Selection follows the two habits apps know: a click toggles an item, or (`metaKey` selection, the
 * classic default) a click picks only that item and Ctrl / ⌘ + click adds to it.
 */
export class ListState<T = unknown> {
  selection: T[] = [];
  query = '';
  /** Index in the full list of the item the keyboard is on, -1 for none. */
  focus = -1;
  private anchor = -1;
  private cache: { list: readonly T[]; length: number; query: string; key: string; mode: string; visible: Set<T> } | null = null;

  constructor(
    private readonly source: () => readonly T[],
    private readonly options: () => { filterBy?: string | null; matchMode?: FilterMatchMode; dataKey?: string | null } = () => ({})
  ) {}

  get list(): readonly T[] {
    return this.source() || [];
  }
  get same(): ListSame<T> {
    return listSame<T>(this.options().dataKey);
  }

  /** Items the search leaves, in list order. */
  visible(): T[] {
    const list = this.list;
    if (!this.query.trim()) return list.slice();
    return list.filter((item) => this.isVisible(item));
  }

  isVisible(item: T): boolean {
    if (!this.query.trim()) return true;
    const list = this.list;
    const o = this.options();
    const key = o.filterBy || '';
    const mode = o.matchMode || 'contains';
    const c = this.cache;
    if (!c || c.list !== list || c.length !== list.length || c.query !== this.query || c.key !== key || c.mode !== mode) {
      this.cache = { list, length: list.length, query: this.query, key, mode, visible: new Set(filterListItems(list, this.query, key, mode)) };
    }
    return this.cache!.visible.has(item);
  }

  /** Forget the cached search result (after the list changed in place). */
  touch(): void {
    this.cache = null;
  }

  isSelected(item: T): boolean {
    return has(this.selection, item, this.same);
  }

  /** Selected items still in the list and visible, in list order: what the move buttons act on. */
  selectedVisible(): T[] {
    return inListOrder(this.list, this.selection, this.same).filter((item) => this.isVisible(item));
  }

  /** A click (or Space / Enter) on `item`. Returns whether the selection changed. */
  pick(item: T, how: { metaKeySelection?: boolean; meta?: boolean; shift?: boolean } = {}): boolean {
    const list = this.list;
    const index = list.indexOf(item);
    const was = this.isSelected(item);
    if (how.shift && this.anchor >= 0 && this.anchor < list.length && index >= 0) {
      const [a, b] = this.anchor < index ? [this.anchor, index] : [index, this.anchor];
      const range = list.slice(a, b + 1).filter((it) => this.isVisible(it));
      const keep = how.metaKeySelection && !how.meta ? [] : this.selection.filter((s) => !has(range, s, this.same));
      this.selection = [...keep, ...range];
      this.focus = index;
      return true;
    }
    if (how.metaKeySelection && !how.meta) {
      this.selection = [item];
    } else {
      this.selection = was ? this.selection.filter((s) => !this.same(s, item)) : [...this.selection, item];
    }
    this.anchor = index;
    this.focus = index;
    return true;
  }

  /** Ctrl / ⌘ + A: every visible item, or none when they all are already. */
  toggleAll(): void {
    const vis = this.visible();
    const all = vis.length > 0 && vis.every((it) => this.isSelected(it));
    this.selection = all ? this.selection.filter((s) => !has(vis, s, this.same)) : [...this.selection.filter((s) => !has(vis, s, this.same)), ...vis];
  }

  /** Drop items that left the list (moved away or removed by the app). */
  prune(): void {
    const list = this.list;
    this.selection = this.selection.filter((s) => has(list, s, this.same));
    if (this.focus >= list.length) this.focus = list.length - 1;
  }

  /** Keyboard focus: the next / previous visible item from the current one (-1 when the list shows nothing). */
  step(dir: 1 | -1): number {
    const list = this.list;
    if (!list.length) return (this.focus = -1);
    let i = this.focus;
    if (i < 0 || i >= list.length) return (this.focus = dir > 0 ? this.edge(1) : this.edge(-1));
    for (let k = i + dir; k >= 0 && k < list.length; k += dir) {
      if (this.isVisible(list[k])) return (this.focus = k);
    }
    return this.focus;
  }

  /** First (1) or last (-1) visible item, -1 when none. */
  edge(dir: 1 | -1): number {
    const list = this.list;
    if (dir > 0) {
      for (let k = 0; k < list.length; k++) if (this.isVisible(list[k])) return k;
    } else {
      for (let k = list.length - 1; k >= 0; k--) if (this.isVisible(list[k])) return k;
    }
    return -1;
  }

  /** Where the keyboard lands when the list gets focus: the first selected visible item, else the first visible. */
  enter(): number {
    const list = this.list;
    if (this.focus >= 0 && this.focus < list.length && this.isVisible(list[this.focus])) return this.focus;
    const sel = list.findIndex((it) => this.isSelected(it) && this.isVisible(it));
    return (this.focus = sel >= 0 ? sel : this.edge(1));
  }
}
