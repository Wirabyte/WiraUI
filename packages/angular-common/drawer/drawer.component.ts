import { DOCUMENT, NgClass, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵlockScroll,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵuniqueId,
  ɵWU_SKIP_VERSION_CHECK,
  ɵWuStyleLoader,
  WuConfig,
  WuTemplate,
} from '@wirabyte/ui/config';
import { ɵbuttonClass, ɵWU_BUTTON_CSS } from '@wirabyte/ui/button';
import { WuLocale } from '@wirabyte/ui/core';

export type WuDrawerPosition = 'left' | 'right' | 'top' | 'bottom' | 'full';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * A panel that slides in from an edge of the window: `<wu-drawer [(visible)]="menuOpen" header="เมนู" position="left">`
 * (`<wu-sidebar>` works too). It is a native `<dialog>`: modal by default (the page behind is inert and dimmed,
 * focus stays inside), closed with the × button, Escape or a click on the dimmed page.
 */
@Component({
  selector: 'wu-drawer, wu-sidebar',
  standalone: true,
  imports: [NgClass, NgIf, NgStyle, NgTemplateOutlet],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuDrawer implements AfterViewChecked, OnDestroy {
  /** Two-way: `[(visible)]`. */
  @Input() set visible(v: unknown) { this.setVisible(ɵtoBool(v)); }
  get visible(): boolean { return this._visible; }
  @Input() position: WuDrawerPosition = 'left';
  /** Covers the whole window (same as `position="full"`). */
  @Input() set fullScreen(v: unknown) { this._fullScreen = ɵtoBool(v); }
  get fullScreen(): boolean { return this._fullScreen; }
  @Input() header?: string;
  /** Dim the page and keep focus in the drawer. Default true. */
  @Input() set modal(v: unknown) { this._modal = v === undefined || ɵtoBool(v); }
  get modal(): boolean { return this._modal; }
  /** A click on the dimmed page closes it. Default true. */
  @Input() set dismissible(v: unknown) { this._dismissible = v === undefined || ɵtoBool(v); }
  /** Stop the page scrolling while open. Default: when modal. */
  @Input() set blockScroll(v: unknown) { this._blockScroll = v === undefined || v === null ? null : ɵtoBool(v); }
  /** The × button. Default true. */
  @Input() set showCloseIcon(v: unknown) { this._closeButton = v === undefined || ɵtoBool(v); }
  @Input() set closable(v: unknown) { this._closeButton = v === undefined || ɵtoBool(v); }
  get closable(): boolean { return this._closeButton; }
  @Input() set closeOnEscape(v: unknown) { this._closeOnEscape = v === undefined || ɵtoBool(v); }
  @Input() closeIcon?: string;
  @Input() ariaCloseLabel?: string;
  @Input() ariaLabel?: string;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | null;
  @Input() maskStyleClass?: string;
  /** Accepted for templates moving over: the drawer is in the top layer. */
  @Input() appendTo: unknown;
  @Input() autoZIndex: unknown;
  @Input() baseZIndex: unknown;
  @Input() transitionOptions: unknown;

  @Output() readonly visibleChange = new EventEmitter<boolean>();
  @Output() readonly onShow = new EventEmitter<void>();
  @Output() readonly onHide = new EventEmitter<void>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('header', { descendants: false }) protected headerRef?: unknown;
  @ContentChild('footer', { descendants: false }) protected footerRef?: unknown;
  @ContentChild('content', { descendants: false }) protected contentRef?: unknown;
  @ContentChild('headless', { descendants: false }) protected headlessRef?: unknown;
  @ContentChild('closeicon', { descendants: false }) protected closeIconRef?: unknown;
  @ViewChild('mask') protected maskRef?: ElementRef<HTMLDialogElement>;

  readonly titleId = ɵuniqueId('wu-drawer-title');
  /** The `<dialog>` is in the DOM (it stays a moment after closing, for the slide-out). */
  rendered = false;
  leaving = false;
  private _visible = false;
  private _fullScreen = false;
  private _modal = true;
  private _dismissible = true;
  private _blockScroll: boolean | null = null;
  private _closeButton = true;
  private _closeOnEscape = true;
  private pendingShow = false;
  private downOnMask = false;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private unlockScroll: (() => void) | null = null;
  private returnFocus: HTMLElement | null = null;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly doc = inject(DOCUMENT);
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWuStyleLoader).load('button', ɵWU_BUTTON_CSS);
  }

  // ---------- what the template reads ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  get side(): WuDrawerPosition {
    return this._fullScreen ? 'full' : this.position || 'left';
  }
  get panelClass(): string {
    const s = this.side;
    return `wu-drawer-${s} p-drawer-${s} p-sidebar-${s}${s === 'full' ? ' p-drawer-full p-sidebar-full' : ''} ${this.styleClass || ''}`;
  }
  get closeClass(): string {
    return ɵbuttonClass('p-button-text p-button-secondary p-button-rounded') + ' wu-btn-icon-only wu-drawer-close p-drawer-close-button p-sidebar-close';
  }
  get headerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.headerRef) || ɵfindTemplate(this.templates, 'header');
  }
  get footerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.footerRef) || ɵfindTemplate(this.templates, 'footer');
  }
  get contentTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.contentRef) || ɵfindTemplate(this.templates, 'content');
  }
  get headlessTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.headlessRef) || ɵfindTemplate(this.templates, 'headless');
  }
  get closeIconTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.closeIconRef) || ɵfindTemplate(this.templates, 'closeicon');
  }
  get labelledBy(): string | null {
    return this.ariaLabel ? null : this.header || this.headerTemplate ? this.titleId : null;
  }

  ngAfterViewChecked(): void {
    if (!this.pendingShow) return;
    const el = this.maskRef?.nativeElement;
    if (!el) return;
    this.pendingShow = false;
    if (!el.open) {
      try {
        if (this._modal) el.showModal();
        else el.show();
      } catch {
        el.setAttribute('open', '');
      }
    }
    if (this._blockScroll ?? this._modal) this.unlockScroll = ɵlockScroll(this.doc);
    if (this._modal) this.doc.dispatchEvent(new CustomEvent('wu-modal-open'));
    const auto = el.querySelector('[autofocus]') as HTMLElement | null;
    if (auto) auto.focus();
    else if (!this._modal) (el.querySelector('.wu-drawer') as HTMLElement | null)?.focus();
    Promise.resolve().then(() => this.onShow.emit());
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.unlockScroll?.();
    const el = this.maskRef?.nativeElement;
    if (el?.open) el.close();
  }

  /** Closes the drawer and tells the model (`visibleChange`). */
  close(event?: Event): void {
    if (!this._visible) return;
    event?.preventDefault();
    this._visible = false;
    this.visibleChange.emit(false);
    this.beginClose();
  }

  /** Opens it from code. */
  show(): void {
    if (this._visible) return;
    this.setVisible(true);
    this.visibleChange.emit(true);
  }

  hide(): void {
    this.close();
  }

  // ---------- template events ----------

  keydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    event.preventDefault();
    if (this._closeOnEscape) this.close(event);
  }

  cancel(event: Event): void {
    event.preventDefault();
    if (this._closeOnEscape) this.close(event);
  }

  nativeClose(): void {
    if (this._visible && !this.leaving) this.close();
  }

  maskPointerdown(event: PointerEvent): void {
    this.downOnMask = event.target === this.maskRef?.nativeElement;
  }

  maskClick(event: MouseEvent): void {
    const onMask = this.downOnMask && event.target === this.maskRef?.nativeElement;
    this.downOnMask = false;
    if (onMask && this._dismissible && this._modal) this.close(event);
  }

  // ---------- internals ----------

  private setVisible(v: boolean): void {
    if (v === this._visible) return;
    this._visible = v;
    if (v) this.beginOpen();
    else this.beginClose();
  }

  private beginOpen(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
      this.leaving = false;
      this.cdr.markForCheck();
      return;
    }
    const active = this.doc.activeElement as HTMLElement | null;
    this.returnFocus = active && active !== this.doc.body ? active : null;
    this.rendered = true;
    this.leaving = false;
    this.pendingShow = true;
    this.cdr.markForCheck();
  }

  private beginClose(): void {
    this.pendingShow = false;
    if (!this.rendered || this.closeTimer) return;
    this.leaving = true;
    this.cdr.markForCheck();
    const win = this.doc.defaultView;
    const reduce = !!win?.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.closeTimer = setTimeout(() => this.finishClose(), reduce ? 0 : 200);
  }

  private finishClose(): void {
    this.closeTimer = null;
    const el = this.maskRef?.nativeElement;
    const hadFocus = !!el && el.contains(this.doc.activeElement);
    if (el?.open) el.close();
    this.unlockScroll?.();
    this.unlockScroll = null;
    this.rendered = false;
    this.leaving = false;
    const back = this.returnFocus;
    this.returnFocus = null;
    if (back && back.isConnected && (hadFocus || this.doc.activeElement === this.doc.body)) back.focus({ preventScroll: true });
    this.cdr.markForCheck();
    this.onHide.emit();
  }
}
