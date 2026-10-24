/** How a popup is laid out: under its anchor, as a bottom sheet (phones), or centred with a backdrop. */
export type ɵWtPopupLayout = 'anchored' | 'sheet' | 'modal';

export interface ɵWtPopupOptions {
  /** Pointer pressed outside the anchor and the panel. */
  onOutside: (event: Event) => void;
  /** The anchor scrolled out of sight. Default: same as onOutside. */
  onLost?: () => void;
  /** `'touch'` keeps a centred modal on wide screens, as `touchUI` does; phones get the sheet either way. */
  touch?: boolean;
  /** Classes the panel gets for the sheet and modal layouts. */
  sheetClass: string;
  modalClass: string;
  /** Phones get a bottom sheet. Default true; small popups (popovers) stay by their anchor. */
  sheet?: boolean;
  /** Space between the anchor and the panel, in px. Default 4. */
  gap?: number;
  /** Escape pressed anywhere while the panel is open (focus may still be on the anchor). */
  onEscape?: (event: KeyboardEvent) => void;
  /** Called after each placement under or over the anchor (e.g. to point an arrow at it). */
  onPosition?: (popup: ɵWtPopup, anchor: DOMRect) => void;
}

const PHONE = '(max-width: 575.98px)';
const GAP = 4;
const MARGIN = 8;

/** Older TypeScript DOM typings (Angular 15) do not know the Popover API yet. */
type PopoverElement = HTMLElement & { showPopover(): void; hidePopover(): void };

function supportsPopover(el: HTMLElement): el is PopoverElement {
  return typeof (el as Partial<PopoverElement>).showPopover === 'function';
}

/**
 * Shows a panel element next to its anchor. Panels carry `popover="manual"`, so where the browser has popovers they
 * sit in the top layer: above dialogs and sticky headers, never clipped by `overflow: hidden` parents. Elsewhere the
 * panel is `position: fixed` with a high z-index. The panel stays where it is in the DOM, so focus order, events and
 * styles keep working; there is nothing to append to `<body>`.
 *
 * Under the anchor it flips above when there is no room below, and follows the anchor on scroll and resize.
 * On phones it is a bottom sheet that stays above the on-screen keyboard (visualViewport).
 */
export class ɵWtPopup {
  layout: ɵWtPopupLayout = 'anchored';
  /** Where the anchored panel ended up. */
  placement: 'below' | 'above' = 'below';
  private readonly win: Window | null;
  private readonly cleanups: (() => void)[] = [];

  constructor(
    private readonly anchor: HTMLElement,
    private readonly panel: HTMLElement,
    private readonly o: ɵWtPopupOptions,
  ) {
    this.win = anchor.ownerDocument.defaultView;
  }

  open(): void {
    if (supportsPopover(this.panel)) {
      try {
        this.panel.showPopover();
      } catch {
        // Already open, or not connected yet: positioning below still applies.
      }
    }
    this.position();
    const win = this.win;
    if (!win) return;
    const reposition = () => this.position(true);
    const outside = (e: Event) => {
      const t = e.target as Node | null;
      if (t && (this.anchor.contains(t) || this.panel.contains(t))) return;
      this.o.onOutside(e);
    };
    this.listen(win, 'scroll', reposition, { capture: true, passive: true });
    this.listen(win, 'resize', reposition, { passive: true });
    if (win.visualViewport) {
      this.listen(win.visualViewport, 'resize', reposition, { passive: true });
      this.listen(win.visualViewport, 'scroll', reposition, { passive: true });
    }
    this.listen(win.document, 'pointerdown', outside, { capture: true });
    const escape = this.o.onEscape;
    if (escape) {
      this.listen(win.document, 'keydown', ((e: KeyboardEvent) => {
        if (e.key === 'Escape' && !e.defaultPrevented) escape(e);
      }) as EventListener, {});
    }
  }

  /** Hides the panel at once, so a Tab pressed in the same keystroke skips it. */
  close(): void {
    for (const off of this.cleanups.splice(0)) off();
    if (supportsPopover(this.panel)) {
      try {
        this.panel.hidePopover();
      } catch {
        // Not open.
      }
    }
    this.panel.style.visibility = 'hidden';
  }

  position(fromScroll = false): void {
    const win = this.win;
    if (!win) return;
    const phone = this.o.sheet !== false && !!win.matchMedia && win.matchMedia(PHONE).matches;
    this.layout = phone ? 'sheet' : this.o.touch ? 'modal' : 'anchored';
    const st = this.panel.style;
    this.panel.classList.toggle(this.o.sheetClass, this.layout === 'sheet');
    this.panel.classList.toggle(this.o.modalClass, this.layout === 'modal');
    st.visibility = '';
    // Measure at full height; keep the panel's own scroll position across repositions.
    const scrolled = this.panel.scrollTop;
    st.maxHeight = '';

    if (this.layout === 'sheet') {
      // What the on-screen keyboard covers. clientHeight, not innerHeight: a horizontal scrollbar is not covered.
      const vv = win.visualViewport;
      const layout = win.document.documentElement.clientHeight || win.innerHeight;
      const hidden = vv ? Math.max(0, Math.round(layout - (vv.offsetTop + vv.height))) : 0;
      st.top = 'auto';
      st.left = '0px';
      st.bottom = `${hidden}px`;
      return;
    }
    if (this.layout === 'modal') {
      st.top = st.left = st.bottom = '';
      return;
    }

    const r = this.anchor.getBoundingClientRect();
    const vw = win.document.documentElement.clientWidth || win.innerWidth;
    const vh = win.document.documentElement.clientHeight || win.innerHeight;
    if (fromScroll && (r.bottom < 0 || r.top > vh)) {
      (this.o.onLost || (() => this.o.onOutside(new Event('scroll'))))();
      return;
    }
    const w = this.panel.offsetWidth;
    const h = this.panel.offsetHeight;
    const gap = this.o.gap ?? GAP;
    const below = vh - MARGIN - (r.bottom + gap);
    const above = r.top - gap - MARGIN;
    let top: number;
    this.placement = 'below';
    if (h <= below) top = r.bottom + gap;
    else if (h <= above) {
      top = r.top - gap - h;
      this.placement = 'above';
    } else if (below >= above) {
      // Fits neither way: take the roomier side and scroll inside the panel rather than cover the field.
      top = r.bottom + gap;
      st.maxHeight = `${Math.max(0, Math.floor(below))}px`;
    } else {
      top = MARGIN;
      st.maxHeight = `${Math.max(0, Math.floor(above))}px`;
      this.placement = 'above';
    }
    const rtl = win.getComputedStyle(this.anchor).direction === 'rtl';
    let left = rtl ? r.right - w : r.left;
    left = Math.min(Math.max(MARGIN, left), Math.max(MARGIN, vw - MARGIN - w));
    st.bottom = 'auto';
    st.top = `${Math.round(top)}px`;
    st.left = `${Math.round(left)}px`;
    if (scrolled) this.panel.scrollTop = scrolled;
    this.o.onPosition?.(this, r);
  }

  private listen(target: EventTarget, type: string, fn: EventListener, opts: AddEventListenerOptions): void {
    target.addEventListener(type, fn, opts);
    this.cleanups.push(() => target.removeEventListener(type, fn, opts));
  }
}

/** Elements Tab can reach inside `root`, in order. */
export function ɵfocusable(root: HTMLElement): HTMLElement[] {
  const sel = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
  return Array.from(root.querySelectorAll<HTMLElement>(sel)).filter(
    (el) => el.tabIndex >= 0 && !el.hasAttribute('hidden') && el.getClientRects().length > 0,
  );
}
