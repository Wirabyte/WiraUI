import { searchText } from './select';

/** What the menu helpers read from an item (the MenuItem shape apps already use). */
export interface MenuItemLike {
  label?: string;
  disabled?: boolean;
  visible?: boolean;
  separator?: boolean;
  items?: readonly MenuItemLike[] | null;
}

/** The items to draw: `visible: false` ones are left out. */
export function menuVisible<T extends MenuItemLike>(items: readonly T[] | null | undefined): T[] {
  return (items || []).filter((it) => !!it && it.visible !== false);
}

/** Items the keyboard can land on: not separators, not disabled. */
export function menuFocusable(item: MenuItemLike | undefined): boolean {
  return !!item && !item.separator && !item.disabled && item.visible !== false;
}

/** Whether the item opens a submenu (it has at least one item to show). */
export function menuHasSubmenu(item: MenuItemLike | undefined): boolean {
  return !!item && !item.separator && menuVisible(item.items).length > 0;
}

/** Next (dir 1) or previous (dir -1) focusable item, wrapping round; -1 when there is none. */
export function menuStep(items: readonly MenuItemLike[], from: number, dir: 1 | -1): number {
  const n = items.length;
  for (let k = 1; k <= n; k++) {
    const i = (((from + dir * k) % n) + n) % n;
    if (menuFocusable(items[i])) return i;
  }
  return -1;
}

export function menuFirst(items: readonly MenuItemLike[]): number {
  return items.findIndex(menuFocusable);
}

export function menuLast(items: readonly MenuItemLike[]): number {
  for (let i = items.length - 1; i >= 0; i--) if (menuFocusable(items[i])) return i;
  return -1;
}

/**
 * The item a typed letter moves to: the next one whose label starts with it, after `from`, wrapping round.
 * Thai labels match as typed (and Thai digits as 0–9); pressing the same letter again cycles through the matches.
 */
export function menuTypeahead(items: readonly MenuItemLike[], text: string, from: number): number {
  const q = searchText(text);
  if (!q) return -1;
  const same = q.length > 1 && [...q].every((c) => c === q[0]);
  const prefix = same ? q[0] : q;
  const n = items.length;
  const start = same || q.length === 1 ? from + 1 : Math.max(from, 0);
  for (let k = 0; k < n; k++) {
    const i = (((start + k) % n) + n) % n;
    if (menuFocusable(items[i]) && searchText(items[i].label || '').startsWith(prefix)) return i;
  }
  return -1;
}

/** Path keys: `"2"` is the third root item, `"2_0"` the first item of its submenu. */
export function menuKey(parent: string, index: number): string {
  return parent ? `${parent}_${index}` : String(index);
}

/** `"2_0_1"` → `["2", "2_0", "2_0_1"]`: the key and every key above it. */
export function menuKeyPath(key: string): string[] {
  if (!key) return [];
  const parts = key.split('_');
  return parts.map((_, i) => parts.slice(0, i + 1).join('_'));
}

/** The item a key points at, walking the visible items; undefined when the menu changed under it. */
export function menuItemAt<T extends MenuItemLike>(items: readonly T[] | null | undefined, key: string): T | undefined {
  if (!key) return undefined;
  let list: readonly T[] = menuVisible(items);
  let found: T | undefined;
  for (const part of key.split('_')) {
    found = list[Number(part)];
    if (!found) return undefined;
    list = menuVisible(found.items as readonly T[] | null | undefined);
  }
  return found;
}
