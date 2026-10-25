import { NgZone } from '@angular/core';

/** What a list component tells the drag helper. Lists are `[data-wt-list="name"]`, their items `[data-wt-index]`. */
export interface ɵWtListDragHost {
  /** The component's root element: lists, the drag image and the drop marks live inside it. */
  readonly root: HTMLElement | null;
  canDrag(): boolean;
  /** The items picked up when dragging the item at `index` of `list`: the selection it belongs to, or just it. */
  itemsFor(list: string, index: number): unknown[];
  /** Whether items of `from` may be dropped on `to`. */
  accepts(from: string, to: string): boolean;
  /** Items were dropped before `index` (counted in the full list) of `to`. */
  drop(from: string, items: unknown[], to: string, index: number, event: Event): void;
}

interface Pending {
  id: number;
  list: string;
  index: number;
  x: number;
  y: number;
  touch: boolean;
  timer: ReturnType<typeof setTimeout> | null;
  item: HTMLElement;
}

interface Active {
  from: string;
  items: unknown[];
  ghost: HTMLElement;
  dx: number;
  dy: number;
  over: { list: string; index: number } | null;
}

const MOUSE_SLOP = 4;
const TOUCH_SLOP = 8;
const LONG_PRESS = 300;
const EDGE = 32;

/**
 * Drag and drop for wt-picklist and wt-orderlist, on Pointer Events so mouse, pen and touch all work: a mouse drags
 * after a few pixels, a finger after a short press (a quick swipe still scrolls the list). The item under the pointer
 * shows a line where the drop lands; Esc cancels. Lists scroll when the pointer nears their top or bottom.
 */
export class ɵWtListDrag {
  private pending: Pending | null = null;
  private active: Active | null = null;
  private suppressClick = false;
  private scrollFrame = 0;
  private lastPoint = { x: 0, y: 0 };
  private readonly listeners: Array<[EventTarget, string, EventListener, AddEventListenerOptions | boolean]> = [];

  constructor(
    private readonly host: ɵWtListDragHost,
    private readonly zone: NgZone | null
  ) {}

  /** Bind to each item: `(pointerdown)="drag.down($event, 'source', i)"`. */
  down(event: PointerEvent, list: string, index: number): void {
    if (this.active || this.pending || !this.host.canDrag()) return;
    if (event.button !== 0 || (event.pointerType === 'mouse' && (event.ctrlKey || event.metaKey || event.shiftKey))) return;
    const item = (event.target as HTMLElement | null)?.closest?.('[data-wt-index]') as HTMLElement | null;
    if (!item) return;
    const touch = event.pointerType === 'touch';
    const pending: Pending = { id: event.pointerId, list, index, x: event.clientX, y: event.clientY, touch, item, timer: null };
    this.pending = pending;
    this.outside(() => {
      if (touch) pending.timer = setTimeout(() => this.start(), LONG_PRESS);
      const doc = item.ownerDocument;
      this.listen(doc, 'pointermove', this.move as EventListener, true);
      this.listen(doc, 'pointerup', this.up as EventListener, true);
      this.listen(doc, 'pointercancel', this.cancel as EventListener, true);
      this.listen(doc, 'keydown', this.key as EventListener, true);
    });
  }

  /** Whether a click right after a drop should be ignored (the click that ends a mouse drag). */
  get swallowClick(): boolean {
    return this.suppressClick;
  }

  get dragging(): boolean {
    return !!this.active;
  }

  destroy(): void {
    this.end();
  }

  private readonly move = (event: PointerEvent): void => {
    const p = this.pending;
    if (p && event.pointerId === p.id && !this.active) {
      const dist = Math.hypot(event.clientX - p.x, event.clientY - p.y);
      if (p.touch) {
        if (dist > TOUCH_SLOP) this.end();
      } else if (dist > MOUSE_SLOP) {
        this.start();
      }
    }
    if (this.active && (!p || event.pointerId === p.id)) {
      event.preventDefault();
      this.track(event.clientX, event.clientY);
    }
  };

  private readonly up = (event: PointerEvent): void => {
    if (this.pending && event.pointerId !== this.pending.id) return;
    const a = this.active;
    if (a?.over) {
      const { list, index } = a.over;
      const items = a.items;
      this.suppressClick = true;
      setTimeout(() => (this.suppressClick = false), 0);
      this.end();
      this.inside(() => this.host.drop(a.from, items, list, index, event));
      return;
    }
    if (a) {
      this.suppressClick = true;
      setTimeout(() => (this.suppressClick = false), 0);
    }
    this.end();
  };

  private readonly cancel = (): void => this.end();

  private readonly key = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.active) {
      event.preventDefault();
      event.stopPropagation();
      this.end();
    }
  };

  private readonly blockTouchScroll = (event: Event): void => {
    if (this.active && event.cancelable) event.preventDefault();
  };

  private start(): void {
    const p = this.pending;
    const root = this.host.root;
    if (!p || !root || this.active) return;
    if (p.timer) clearTimeout(p.timer);
    p.timer = null;
    const items = this.host.itemsFor(p.list, p.index);
    if (!items.length) return this.end();
    const rect = p.item.getBoundingClientRect();
    const ghost = p.item.cloneNode(true) as HTMLElement;
    ghost.removeAttribute('id');
    ghost.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
    ghost.setAttribute('aria-hidden', 'true');
    ghost.removeAttribute('role');
    ghost.classList.add('wt-list-drag-ghost');
    ghost.style.width = `${rect.width}px`;
    if (items.length > 1) {
      const badge = root.ownerDocument.createElement('span');
      badge.className = 'wt-list-drag-count';
      badge.textContent = String(items.length);
      ghost.appendChild(badge);
    }
    root.appendChild(ghost);
    // In the top layer the image stays above dialogs and is not clipped by scrolling parents.
    const pop = ghost as HTMLElement & { showPopover?: () => void };
    if (typeof pop.showPopover === 'function') {
      ghost.setAttribute('popover', 'manual');
      try {
        pop.showPopover();
      } catch {
        /* not connected or unsupported: stays a fixed element */
      }
    }
    this.active = { from: p.list, items, ghost, dx: p.x - rect.left, dy: p.y - rect.top, over: null };
    root.classList.add('wt-list-dragging');
    if (p.touch) this.listen(root.ownerDocument, 'touchmove', this.blockTouchScroll, { passive: false, capture: true });
    this.listen(root.ownerDocument, 'contextmenu', this.blockTouchScroll, true);
    this.track(p.x, p.y);
  }

  private track(x: number, y: number): void {
    const a = this.active;
    const root = this.host.root;
    if (!a || !root) return;
    this.lastPoint = { x, y };
    a.ghost.style.transform = `translate(${Math.round(x - a.dx)}px, ${Math.round(y - a.dy)}px)`;
    const under = root.ownerDocument.elementFromPoint(x, y) as HTMLElement | null;
    const listEl = under?.closest?.('[data-wt-list]') as HTMLElement | null;
    const name = listEl && root.contains(listEl) ? listEl.getAttribute('data-wt-list') : null;
    this.clearMarks();
    if (!listEl || !name || !this.host.accepts(a.from, name)) {
      a.over = null;
      this.stopScroll();
      return;
    }
    const rows = Array.from(listEl.querySelectorAll<HTMLElement>('[data-wt-index]'));
    let index = rows.length ? Number(rows[rows.length - 1].getAttribute('data-wt-index')) + 1 : 0;
    let mark: HTMLElement | null = null;
    let after = false;
    for (const row of rows) {
      const r = row.getBoundingClientRect();
      if (y < r.top + r.height / 2) {
        index = Number(row.getAttribute('data-wt-index'));
        mark = row;
        break;
      }
    }
    if (!mark && rows.length) {
      mark = rows[rows.length - 1];
      after = true;
    }
    a.over = { list: name, index };
    listEl.classList.add('wt-list-dragover');
    if (mark) mark.classList.add(after ? 'wt-list-drop-after' : 'wt-list-drop-before');
    else listEl.classList.add('wt-list-drop-into');
    this.autoScroll(listEl, y);
  }

  private autoScroll(listEl: HTMLElement, y: number): void {
    const r = listEl.getBoundingClientRect();
    const speed = y < r.top + EDGE ? -Math.ceil((r.top + EDGE - y) / 4) : y > r.bottom - EDGE ? Math.ceil((y - (r.bottom - EDGE)) / 4) : 0;
    this.stopScroll();
    if (!speed) return;
    const win = listEl.ownerDocument.defaultView;
    if (!win) return;
    const stepFrame = () => {
      if (!this.active) return;
      const before = listEl.scrollTop;
      listEl.scrollTop += speed;
      if (listEl.scrollTop !== before) {
        this.track(this.lastPoint.x, this.lastPoint.y);
      } else {
        this.scrollFrame = 0;
      }
    };
    this.scrollFrame = win.requestAnimationFrame(stepFrame);
  }

  private stopScroll(): void {
    if (this.scrollFrame) this.host.root?.ownerDocument.defaultView?.cancelAnimationFrame(this.scrollFrame);
    this.scrollFrame = 0;
  }

  private clearMarks(): void {
    const root = this.host.root;
    if (!root) return;
    root.querySelectorAll('.wt-list-drop-before, .wt-list-drop-after').forEach((el) => el.classList.remove('wt-list-drop-before', 'wt-list-drop-after'));
    root.querySelectorAll('.wt-list-dragover, .wt-list-drop-into').forEach((el) => el.classList.remove('wt-list-dragover', 'wt-list-drop-into'));
  }

  private end(): void {
    if (this.pending?.timer) clearTimeout(this.pending.timer);
    this.pending = null;
    this.stopScroll();
    if (this.active) {
      const ghost = this.active.ghost as HTMLElement & { hidePopover?: () => void };
      try {
        if (ghost.hasAttribute('popover')) ghost.hidePopover?.();
      } catch {
        /* already hidden */
      }
      ghost.remove();
      this.active = null;
    }
    this.clearMarks();
    this.host.root?.classList.remove('wt-list-dragging');
    for (const [target, type, fn, opts] of this.listeners.splice(0)) target.removeEventListener(type, fn, opts);
  }

  private listen(target: EventTarget, type: string, fn: EventListener, opts: AddEventListenerOptions | boolean): void {
    target.addEventListener(type, fn, opts);
    this.listeners.push([target, type, fn, opts]);
  }

  private outside(fn: () => void): void {
    if (this.zone) this.zone.runOutsideAngular(fn);
    else fn();
  }

  private inside(fn: () => void): void {
    if (this.zone) this.zone.run(fn);
    else fn();
  }
}
