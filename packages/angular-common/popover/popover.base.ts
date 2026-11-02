import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵfocusable, ɵrefreshOnTranslation, ɵtoBool, ɵWU_SKIP_VERSION_CHECK, WuConfig, ɵWuPopup, WuTemplate } from 'wiraui/config';
import { WuLocale } from 'wiraui/core';

/**
 * Shared logic of wu-popover (v1 and v2/v3 templates): a panel with an arrow under (or over) whatever opened it.
 * `#op` + `(click)="op.toggle($event)"`, as existing templates do.
 */
@Directive()
export abstract class ɵWuPopoverBase implements OnDestroy {
  /** A click outside closes it. Default true. */
  @Input() set dismissable(v: unknown) { this._dismissable = v === undefined || ɵtoBool(v); }
  /** An × in the corner. */
  @Input() set showCloseIcon(v: unknown) { this._showCloseIcon = ɵtoBool(v); }
  get showCloseIcon(): boolean { return this._showCloseIcon; }
  @Input() ariaCloseLabel?: string;
  @Input() style?: Record<string, string | number> | null;
  @Input() styleClass?: string;
  /** Move focus into the panel when it opens. Default true. */
  @Input() set focusOnShow(v: unknown) { this._focusOnShow = v === undefined || ɵtoBool(v); }
  /** Accepted for templates moving over; the panel is in the top layer. */
  @Input() appendTo: unknown;
  @Input() baseZIndex: unknown;
  @Input() autoZIndex: unknown;
  @Input() showTransitionOptions: unknown;
  @Input() hideTransitionOptions: unknown;

  @Output() readonly onShow = new EventEmitter<void>();
  @Output() readonly onHide = new EventEmitter<void>();

  @ContentChildren(WuTemplate) protected slotTemplates?: QueryList<WuTemplate>;
  @ContentChild('content', { read: TemplateRef }) protected contentRef?: TemplateRef<unknown>;
  /** A `content` template (`pTemplate="content"` / `#content`), with `let-closeCallback="closeCallback"`. */
  get contentTemplate(): TemplateRef<unknown> | null {
    return this.contentRef || ɵfindTemplate(this.slotTemplates, 'content');
  }
  readonly contentContext = { closeCallback: () => this.hide() };

  @ViewChild('panel') panelRef?: ElementRef<HTMLElement>;

  overlayVisible = false;
  flipped = false;
  private _dismissable = true;
  private _showCloseIcon = false;
  private _focusOnShow = true;
  private target: HTMLElement | null = null;
  private popup: ɵWuPopup | null = null;
  protected readonly cdr = inject(ChangeDetectorRef);
  private readonly config = inject(WuConfig);
  private readonly doc = inject(DOCUMENT);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  get t(): WuLocale {
    return this.config.translation;
  }

  /** Opens under `target` (default: the element that got the event), or closes when already open for it. */
  toggle(event?: Event | null, target?: HTMLElement | EventTarget | null): void {
    const t = this.resolveTarget(event, target);
    if (this.overlayVisible && (!t || t === this.target)) this.hide();
    else this.show(event, t);
  }

  show(event?: Event | null, target?: HTMLElement | EventTarget | null): void {
    const t = this.resolveTarget(event, target);
    if (!t) return;
    if (this.overlayVisible) {
      this.target = t;
      this.popup?.close();
      this.attach();
      return;
    }
    this.target = t;
    this.overlayVisible = true;
    this.cdr.detectChanges();
    this.attach();
    if (this._focusOnShow) {
      const panel = this.panelRef?.nativeElement;
      const first = panel && (panel.querySelector<HTMLElement>('[autofocus]') || ɵfocusable(panel)[0]);
      first?.focus({ preventScroll: true });
    }
    this.onShow.emit();
  }

  hide(): void {
    if (!this.overlayVisible) return;
    this.popup?.close();
    this.popup = null;
    this.overlayVisible = false;
    const panel = this.panelRef?.nativeElement;
    if (panel && panel.contains(this.doc.activeElement)) this.target?.focus({ preventScroll: true });
    this.cdr.markForCheck();
    this.onHide.emit();
  }

  /** Places the panel again, e.g. after its content changed size. */
  align(): void {
    this.popup?.position();
  }

  keydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.hide();
    }
  }

  ngOnDestroy(): void {
    this.popup?.close();
    this.i18n.unsubscribe();
  }

  private attach(): void {
    const panel = this.panelRef?.nativeElement;
    if (!panel || !this.target) return;
    this.popup = new ɵWuPopup(this.target, panel, {
      sheet: false,
      gap: 10,
      sheetClass: 'wu-popover-sheet',
      modalClass: 'wu-popover-modal',
      onOutside: () => {
        if (this._dismissable) this.hide();
      },
      onLost: () => this.hide(),
      onEscape: (e) => {
        e.preventDefault();
        this.hide();
      },
      onPosition: (popup, anchor) => {
        const flipped = popup.placement === 'above';
        panel.classList.toggle('wu-popover-flipped', flipped);
        panel.classList.toggle('p-popover-flipped', flipped);
        panel.classList.toggle('p-overlaypanel-flipped', flipped);
        // The arrow points at the middle of the anchor, wherever the panel was pushed to fit.
        const at = anchor.left + anchor.width / 2 - panel.getBoundingClientRect().left;
        panel.style.setProperty('--_arrow', `${Math.round(Math.min(Math.max(at, 16), panel.offsetWidth - 16))}px`);
      },
    });
    this.popup.open();
  }

  private resolveTarget(event?: Event | null, target?: HTMLElement | EventTarget | null): HTMLElement | null {
    const t = (target || event?.currentTarget || event?.target || null) as HTMLElement | null;
    return t && t.nodeType === 1 ? t : null;
  }
}
