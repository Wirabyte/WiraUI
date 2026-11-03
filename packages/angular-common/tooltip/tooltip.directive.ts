import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, HostListener, inject, Input, OnDestroy } from '@angular/core';
import { ɵassertSupportedAngular, ɵtoBool, ɵuniqueId, ɵWU_SKIP_VERSION_CHECK, ɵWuStyleLoader } from '@wirabyte/ui/config';
import { WU_TOOLTIP_CSS } from './tooltip.styles';
import { WuTooltipEvent, WuTooltipOptions, WuTooltipPosition } from './tooltip.types';

type PopoverElement = HTMLElement & { showPopover(): void; hidePopover(): void };
const GAP = 8;
const MARGIN = 8;
const FLIP: Record<WuTooltipPosition, WuTooltipPosition> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

/**
 * Tooltip: `<button wuTooltip="บันทึก" tooltipPosition="top">`. The `pTooltip` attribute existing templates use works
 * the same. Shown on hover and on keyboard focus; drawn in the top layer, so it shows above dialogs and is never
 * clipped. Flips to the other side when there is no room.
 */
@Directive({
  selector: '[wuTooltip], [pTooltip]',
  standalone: true,
  exportAs: 'wuTooltip',
})
export class WuTooltip implements OnDestroy {
  /** The text. Use `[escape]="false"` for HTML (only formatting tags are kept: b, i, strong, em, u, br, p, span, small, code, ul, ol, li, and http/https/mailto links). */
  @Input() set wuTooltip(v: string | null | undefined) { this.setText(v); }
  @Input() set pTooltip(v: string | null | undefined) { this.setText(v); }
  /** Default `'right'`, as before. */
  @Input() tooltipPosition: WuTooltipPosition = 'right';
  /** `'hover'` (also keyboard focus), `'focus'`, or `'both'`. */
  @Input() tooltipEvent: WuTooltipEvent = 'hover';
  @Input() set showDelay(v: unknown) { this._showDelay = Number(v) || 0; }
  @Input() set hideDelay(v: unknown) { this._hideDelay = Number(v) || 0; }
  /** Hide after this many milliseconds. */
  @Input() set life(v: unknown) { this._life = Number(v) || 0; }
  /** `false` shows the text as HTML. Default true. */
  @Input() set escape(v: unknown) { this._escape = v === undefined || ɵtoBool(v); }
  @Input() set tooltipDisabled(v: unknown) { this._disabled = ɵtoBool(v); if (this._disabled) this.hide(); }
  @Input() tooltipStyleClass?: string;
  /** Show the full text on one line instead of wrapping at the max width. */
  @Input() set fitContent(v: unknown) { this._fit = ɵtoBool(v); }
  /** Extra offsets in px. */
  @Input() set positionTop(v: unknown) { this._dy = Number(v) || 0; }
  @Input() set positionLeft(v: unknown) { this._dx = Number(v) || 0; }
  /** All of the above in one object, as some templates pass them. */
  @Input() set tooltipOptions(o: WuTooltipOptions | null | undefined) {
    if (!o) return;
    if (o.tooltipLabel !== undefined) this.setText(o.tooltipLabel);
    if (o.tooltipPosition) this.tooltipPosition = o.tooltipPosition;
    if (o.tooltipEvent) this.tooltipEvent = o.tooltipEvent;
    if (o.showDelay !== undefined) this.showDelay = o.showDelay;
    if (o.hideDelay !== undefined) this.hideDelay = o.hideDelay;
    if (o.life !== undefined) this.life = o.life;
    if (o.escape !== undefined) this.escape = o.escape;
    if (o.disabled !== undefined) this.tooltipDisabled = o.disabled;
    if (o.tooltipStyleClass) this.tooltipStyleClass = o.tooltipStyleClass;
  }
  /**
   * `true` hides the tooltip as soon as the pointer leaves the target. By default the pointer may move onto the
   * tooltip (to read it, select text or click a link in it) and it stays until the pointer leaves both.
   */
  @Input() set autoHide(v: unknown) { this._autoHide = v !== undefined && v !== null && ɵtoBool(v); }
  /** Accepted for templates moving over; the tooltip is in the top layer. */
  @Input() appendTo: unknown;
  @Input() tooltipZIndex: unknown;
  @Input() positionStyle: unknown;

  private text = '';
  private _showDelay = 0;
  private _hideDelay = 0;
  private _life = 0;
  private _escape = true;
  private _disabled = false;
  private _fit = false;
  private _dx = 0;
  private _dy = 0;
  private _autoHide = false;
  private el: HTMLElement | null = null;
  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private lifeTimer: ReturnType<typeof setTimeout> | null = null;
  private keyboard = false;
  private readonly id = ɵuniqueId('wu-tooltip');
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly doc = inject(DOCUMENT);
  private readonly loader = inject(ɵWuStyleLoader);
  /** Scrolling moves the tooltip with its target, and hides it once the target leaves the screen. */
  private readonly onScroll = () => {
    const r = this.host.getBoundingClientRect();
    const vh = this.doc.documentElement.clientHeight;
    if (r.bottom < 0 || r.top > vh || !this.host.isConnected) this.hide();
    else this.place();
  };

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  get visible(): boolean {
    return !!this.el;
  }

  @HostListener('pointerenter', ['$event'])
  enter(event: PointerEvent): void {
    // Touch has no hover; a tap would otherwise leave a tooltip stuck on screen.
    if (event.pointerType !== 'touch' && this.tooltipEvent !== 'focus') this.scheduleShow();
  }

  @HostListener('pointerleave')
  leave(): void {
    if (this.tooltipEvent !== 'focus') this.scheduleHide(true);
  }

  @HostListener('keydown', ['$event'])
  key(event: KeyboardEvent): void {
    this.keyboard = true;
    if (event.key === 'Escape') this.hide();
  }

  @HostListener('pointerdown')
  press(): void {
    this.keyboard = false;
    if (this.tooltipEvent === 'hover') this.hide();
  }

  @HostListener('focusin')
  focus(): void {
    const keyboard = this.keyboard || this.host.matches(':focus-visible') || !!this.host.querySelector(':focus-visible');
    if (this.tooltipEvent === 'focus' || this.tooltipEvent === 'both' || keyboard) this.scheduleShow();
  }

  @HostListener('focusout')
  blur(): void {
    this.scheduleHide();
  }

  show(): void {
    if (this._disabled || !this.text || this.el) return;
    this.loader.load('tooltip', WU_TOOLTIP_CSS);
    const tip = this.doc.createElement('div');
    tip.id = this.id;
    tip.setAttribute('role', 'tooltip');
    tip.setAttribute('popover', 'manual');
    tip.className = `wu-tooltip p-tooltip p-component ${this.tooltipStyleClass || ''}`;
    if (this._fit) tip.classList.add('wu-tooltip-fit');
    if (!this._autoHide) {
      tip.classList.add('wu-tooltip-hoverable');
      tip.addEventListener('pointerenter', () => this.keep());
      tip.addEventListener('pointerleave', () => this.scheduleHide(true));
    }
    const arrow = this.doc.createElement('div');
    arrow.className = 'wu-tooltip-arrow p-tooltip-arrow';
    const body = this.doc.createElement('div');
    body.className = 'wu-tooltip-text p-tooltip-text';
    if (this._escape) body.textContent = this.text;
    else body.replaceChildren(safeHtml(this.text, this.doc));
    tip.append(arrow, body);
    this.doc.body.appendChild(tip);
    const p = tip as unknown as Partial<PopoverElement>;
    if (typeof p.showPopover === 'function') {
      try {
        p.showPopover();
      } catch {
        // Fixed with a high z-index below.
      }
    }
    this.el = tip;
    this.place();
    this.describes().setAttribute('aria-describedby', this.id);
    this.doc.defaultView?.addEventListener('scroll', this.onScroll, { capture: true, passive: true });
    if (this._life) this.lifeTimer = setTimeout(() => this.hide(), this._life);
  }

  hide(): void {
    this.clearTimers();
    if (!this.el) return;
    this.el.remove();
    this.el = null;
    const described = this.describes();
    if (described.getAttribute('aria-describedby') === this.id) described.removeAttribute('aria-describedby');
    this.doc.defaultView?.removeEventListener('scroll', this.onScroll, { capture: true });
  }

  ngOnDestroy(): void {
    this.hide();
  }

  /** The element screen readers land on: the host, or the button inside a component such as wu-button. */
  private describes(): HTMLElement {
    const focusable = 'button, a[href], input, select, textarea, [tabindex]';
    return this.host.matches(focusable) ? this.host : this.host.querySelector<HTMLElement>(focusable) || this.host;
  }

  private setText(v: string | null | undefined): void {
    this.text = v === null || v === undefined ? '' : String(v);
    if (!this.el) return;
    if (!this.text) this.hide();
    else {
      const body = this.el.querySelector('.wu-tooltip-text') as HTMLElement;
      if (this._escape) body.textContent = this.text;
      else body.replaceChildren(safeHtml(this.text, this.doc));
      this.place();
    }
  }

  private scheduleShow(): void {
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.hideTimer = null;
    if (this.el || this.showTimer) return;
    if (this._showDelay) this.showTimer = setTimeout(() => ((this.showTimer = null), this.show()), this._showDelay);
    else this.show();
  }

  /** The pointer reached the tooltip: stay. */
  private keep(): void {
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.hideTimer = null;
  }

  /** `pointer`: the pointer left, so give it a moment to cross the gap onto the tooltip. */
  private scheduleHide(pointer = false): void {
    if (this.showTimer) clearTimeout(this.showTimer);
    this.showTimer = null;
    if (!this.el) return;
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.hideTimer = null;
    const delay = pointer && !this._autoHide ? Math.max(this._hideDelay, 150) : this._hideDelay;
    if (delay) this.hideTimer = setTimeout(() => this.hide(), delay);
    else this.hide();
  }

  private clearTimers(): void {
    for (const t of [this.showTimer, this.hideTimer, this.lifeTimer]) if (t) clearTimeout(t);
    this.showTimer = this.hideTimer = this.lifeTimer = null;
  }

  /** Puts the tooltip on the asked side, or the opposite one when it does not fit, and keeps it on screen. */
  private place(): void {
    const tip = this.el;
    const win = this.doc.defaultView;
    if (!tip || !win) return;
    const r = this.host.getBoundingClientRect();
    const vw = this.doc.documentElement.clientWidth;
    const vh = this.doc.documentElement.clientHeight;
    const fits = (pos: WuTooltipPosition, w: number, h: number) =>
      pos === 'top' ? r.top - GAP - h >= MARGIN : pos === 'bottom' ? r.bottom + GAP + h <= vh - MARGIN : pos === 'left' ? r.left - GAP - w >= MARGIN : r.right + GAP + w <= vw - MARGIN;
    let pos = this.tooltipPosition in FLIP ? this.tooltipPosition : 'right';
    this.setSide(tip, pos);
    let w = tip.offsetWidth;
    let h = tip.offsetHeight;
    if (!fits(pos, w, h) && fits(FLIP[pos], w, h)) pos = FLIP[pos];
    // Sideways on a narrow screen: go above or below instead.
    else if (!fits(pos, w, h) && (pos === 'left' || pos === 'right')) pos = fits('top', w, h) ? 'top' : 'bottom';
    this.setSide(tip, pos);
    w = tip.offsetWidth;
    h = tip.offsetHeight;
    let left = pos === 'left' ? r.left - GAP - w : pos === 'right' ? r.right + GAP : r.left + r.width / 2 - w / 2;
    let top = pos === 'top' ? r.top - GAP - h : pos === 'bottom' ? r.bottom + GAP : r.top + r.height / 2 - h / 2;
    left = Math.min(Math.max(MARGIN, left + this._dx), vw - MARGIN - w);
    top = Math.min(Math.max(MARGIN, top + this._dy), vh - MARGIN - h);
    tip.style.left = `${Math.round(left)}px`;
    tip.style.top = `${Math.round(top)}px`;
    // Point the arrow at the middle of the target even when the tooltip was pushed back on screen.
    const arrow = pos === 'top' || pos === 'bottom' ? r.left + r.width / 2 - left : r.top + r.height / 2 - top;
    tip.style.setProperty('--_arrow', `${Math.round(arrow)}px`);
  }

  private setSide(tip: HTMLElement, pos: WuTooltipPosition): void {
    for (const p of ['top', 'bottom', 'left', 'right']) {
      tip.classList.toggle(`wu-tooltip-${p}`, p === pos);
      tip.classList.toggle(`p-tooltip-${p}`, p === pos);
    }
  }
}

const TAGS = new Set(['B', 'I', 'STRONG', 'EM', 'U', 'BR', 'P', 'SPAN', 'SMALL', 'CODE', 'UL', 'OL', 'LI', 'A', 'DIV']);

/** Tooltip HTML rebuilt from an allow-list: formatting tags, text, and http(s)/mailto links. Nothing else survives. */
function safeHtml(html: string, doc: Document): DocumentFragment {
  const out = doc.createDocumentFragment();
  const parsed = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html').body;
  const copy = (from: Node, to: Node) => {
    from.childNodes.forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) to.appendChild(doc.createTextNode(n.textContent || ''));
      else if (n.nodeType === Node.ELEMENT_NODE) {
        const el = n as Element;
        if (!TAGS.has(el.tagName)) return copy(el, to);
        const clean = doc.createElement(el.tagName.toLowerCase());
        const href = el.getAttribute('href');
        if (el.tagName === 'A' && href && /^(https?:|mailto:)/i.test(href.trim())) {
          clean.setAttribute('href', href.trim());
          clean.setAttribute('rel', 'noopener noreferrer');
          clean.setAttribute('target', '_blank');
        }
        copy(el, clean);
        to.appendChild(clean);
      }
    });
  };
  copy(parsed, out);
  return out;
}
