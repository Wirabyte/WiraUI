export interface WtTabsChangeEvent {
  index: number;
  originalEvent: Event;
}

/** Next enabled tab for arrow keys, Home and End (wraps around); null for other keys. */
export function ɵnextTab(key: string, current: number, disabled: readonly boolean[]): number | null {
  const n = disabled.length;
  if (!n) return null;
  const step = key === 'ArrowRight' ? 1 : key === 'ArrowLeft' ? -1 : 0;
  let i: number;
  if (key === 'Home') i = 0;
  else if (key === 'End') i = n - 1;
  else if (step) i = (current + step + n) % n;
  else return null;
  // Home/End search inwards, arrows keep going in their direction.
  const dir = key === 'End' ? -1 : step || 1;
  for (let tries = 0; tries < n; tries++) {
    if (!disabled[i]) return i;
    i = (i + dir + n) % n;
  }
  return null;
}

/** Which edges of a tab row have tabs scrolled out of sight. */
export function ɵtabEdges(list: HTMLElement): { prev: boolean; next: boolean } {
  const max = list.scrollWidth - list.clientWidth;
  return { prev: list.scrollLeft > 1, next: max > 1 && list.scrollLeft < max - 1 };
}

/** Scrolls the tab row so `tab` is fully visible beside the arrow buttons. */
export function ɵrevealTab(list: HTMLElement, tab: HTMLElement | undefined): void {
  if (!tab || list.scrollWidth <= list.clientWidth) return;
  const room = 40;
  const start = tab.offsetLeft;
  const end = start + tab.offsetWidth;
  if (start < list.scrollLeft + room) list.scrollLeft = Math.max(0, start - room);
  else if (end > list.scrollLeft + list.clientWidth - room) list.scrollLeft = end - list.clientWidth + room;
}

/** One page sideways: most of the visible width, so a tab stays in view for context. */
export function ɵpageTabs(list: HTMLElement, direction: -1 | 1): void {
  list.scrollLeft += direction * Math.max(list.clientWidth * 0.75, 80);
}
