import { DOCUMENT } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵfocusable,
  ɵlockScroll,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵuniqueId,
  ɵWU_SKIP_VERSION_CHECK,
  WuConfig,
  WuTemplate,
} from 'wiraui/config';
import { WuLocale } from 'wiraui/core';
import { WuDialogMaximizeEvent } from './dialog.types';

/** Marks projected footer content: `<div wuDialogFooter>…</div>` or `<wu-footer>…</wu-footer>`. */
@Directive({ selector: '[wuDialogFooter], wu-footer', standalone: true })
export class WuDialogFooter {}

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const CORNERS: Record<string, string> = { topleft: 'top-left', topright: 'top-right', bottomleft: 'bottom-left', bottomright: 'bottom-right' };

/**
 * What wu-dialog does, shared by the v1 and v2/v3 templates (they differ only in control flow and era class names).
 * The dialog is a native `<dialog>`: showModal() puts it in the top layer, traps focus and makes the page inert.
 */
@Directive()
export abstract class ɵWuDialogBase implements OnChanges, AfterViewChecked, OnDestroy {
  /** Title text. A `header` template replaces it. */
  @Input() header?: string;
  @Input() set visible(v: unknown) {
    this.setVisible(ɵtoBool(v));
  }
  get visible(): boolean {
    return this._visible;
  }
  /** Dim the page and keep focus in the dialog. Default true. */
  @Input() set modal(v: unknown) { this._modal = v === undefined || ɵtoBool(v); }
  get modal(): boolean { return this._modal; }
  /** The × button, Escape and the mask can close it. Default true. */
  @Input() set closable(v: unknown) { this._closable = v === undefined || ɵtoBool(v); }
  get closable(): boolean { return this._closable; }
  @Input() set closeOnEscape(v: unknown) { this._closeOnEscape = v === undefined || ɵtoBool(v); }
  /** Clicking the dimmed page closes it. Default false. */
  @Input() set dismissableMask(v: unknown) { this._dismissableMask = ɵtoBool(v); }
  /** Stop the page scrolling behind. Default: on for modal dialogs. */
  @Input() set blockScroll(v: unknown) { this._blockScroll = v === undefined || v === null ? null : ɵtoBool(v); }
  /** Move the dialog by its header. Default false. */
  @Input() set draggable(v: unknown) { this._draggable = ɵtoBool(v); }
  get draggable(): boolean { return this._draggable; }
  /** A button that fills the screen with the dialog. */
  @Input() set maximizable(v: unknown) { this._maximizable = ɵtoBool(v); }
  get maximizable(): boolean { return this._maximizable; }
  @Input() set showHeader(v: unknown) { this._showHeader = v === undefined || ɵtoBool(v); }
  get showHeader(): boolean { return this._showHeader; }
  /** Focus an `[autofocus]` element, else the close button, when it opens. Default true. */
  @Input() set focusOnShow(v: unknown) { this._focusOnShow = v === undefined || ɵtoBool(v); }
  /** Styles of the dialog box, e.g. `{ width: '50vw', 'min-width': '360px' }`. Phones always get the screen width. */
  @Input() style?: Record<string, string | number> | null;
  @Input() styleClass?: string;
  @Input() contentStyle?: Record<string, string | number> | null;
  @Input() contentStyleClass?: string;
  @Input() maskStyleClass?: string;
  /** Width per screen size: `{ '960px': '75vw', '640px': '90vw' }`. The smallest matching max-width wins. */
  @Input() breakpoints?: Record<string, string> | null;
  /** center, top, bottom, left, right, topleft, topright, bottomleft, bottomright (top-left … also work). */
  @Input() position = 'center';
  @Input() closeAriaLabel?: string;
  @Input() ariaLabelledBy?: string;
  /** Icon class for the close button instead of the built-in ×, e.g. `pi pi-times`. */
  @Input() closeIcon?: string;
  @Input() maximizeIcon?: string;
  @Input() minimizeIcon?: string;
  /** Accepted for templates moving over. The dialog opens in the top layer, so these have nothing to do. */
  @Input() appendTo: unknown;
  @Input() baseZIndex: unknown;
  @Input() autoZIndex: unknown;
  @Input() resizable: unknown;
  @Input() keepInViewport: unknown;
  @Input() responsive: unknown;
  @Input() transitionOptions: unknown;

  /** Slot templates passed in by components that wrap wu-dialog (wu-confirmdialog); apps use `wuTemplate` or `#name`. */
  @Input() templateHeader?: TemplateRef<unknown> | null;
  @Input() templateFooter?: TemplateRef<unknown> | null;
  @Input() templateHeadless?: TemplateRef<unknown> | null;

  @Output() readonly visibleChange = new EventEmitter<boolean>();
  @Output() readonly onShow = new EventEmitter<void>();
  @Output() readonly onHide = new EventEmitter<void>();
  @Output() readonly onMaximize = new EventEmitter<WuDialogMaximizeEvent>();

  @ContentChildren(WuTemplate) templates?: QueryList<WuTemplate>;
  @ContentChild('header', { descendants: false }) headerRef?: unknown;
  @ContentChild('footer', { descendants: false }) footerRef?: unknown;
  @ContentChild('content', { descendants: false }) contentRef?: unknown;
  @ContentChild('headless', { descendants: false }) headlessRef?: unknown;
  @ContentChild('closeicon', { descendants: false }) closeIconRef?: unknown;
  @ContentChild(WuDialogFooter) footerProjected?: WuDialogFooter;

  @ViewChild('mask') maskRef?: ElementRef<HTMLDialogElement>;
  @ViewChild('panel') panelRef?: ElementRef<HTMLElement>;

  /** The `<dialog>` is in the DOM (it stays a moment after closing, for the fade-out). */
  rendered = false;
  leaving = false;
  maximized = false;
  /** Styles of the dialog box: `style` plus the width `breakpoints` pick. */
  panelStyle: Record<string, string | number> | null = null;
  readonly titleId = ɵuniqueId('wu-dialog-title');

  private _visible = false;
  private _modal = true;
  private _closable = true;
  private _closeOnEscape = true;
  private _dismissableMask = false;
  private _blockScroll: boolean | null = null;
  private _draggable = false;
  private _maximizable = false;
  private _showHeader = true;
  private _focusOnShow = true;
  private pendingShow = false;
  private downOnMask = false;
  private bpWidth: string | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private unlockScroll: (() => void) | null = null;
  private returnFocus: HTMLElement | null = null;
  private stopResize: (() => void) | null = null;
  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly config = inject(WuConfig);
  private readonly doc = inject(DOCUMENT);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  get t(): WuLocale {
    return this.config.translation;
  }
  get headerTemplate(): TemplateRef<unknown> | null {
    return this.templateHeader || asTemplate(this.headerRef) || ɵfindTemplate(this.templates, 'header');
  }
  get footerTemplate(): TemplateRef<unknown> | null {
    return this.templateFooter || asTemplate(this.footerRef) || ɵfindTemplate(this.templates, 'footer');
  }
  get contentTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.contentRef) || ɵfindTemplate(this.templates, 'content');
  }
  get headlessTemplate(): TemplateRef<unknown> | null {
    return this.templateHeadless || asTemplate(this.headlessRef) || ɵfindTemplate(this.templates, 'headless');
  }
  get closeIconTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.closeIconRef) || ɵfindTemplate(this.templates, 'closeicon');
  }
  get hasFooter(): boolean {
    return !!this.footerTemplate || !!this.footerProjected;
  }
  get labelledBy(): string | null {
    return this.ariaLabelledBy || (this.header || this.headerTemplate ? this.titleId : null);
  }
  /** `topleft` for `top-left` and the like. */
  get positionKey(): string {
    return (this.position || 'center').replace('-', '').toLowerCase();
  }
  /** Position class names of the era; v1 and v2/v3 both use the dashed corner names. */
  get positionClasses(): string {
    const key = this.positionKey;
    if (key === 'center') return '';
    return `wu-dialog-${key} p-dialog-${CORNERS[key] || key}`;
  }

  ngOnChanges(): void {
    this.updatePanelStyle();
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
    // Toasts on screen move back above this modal.
    if (this._modal) this.doc.dispatchEvent(new CustomEvent('wu-modal-open'));
    this.watchBreakpoints();
    if (this._focusOnShow) this.focusFirst();
    // After this check: listeners may change state the parent shows.
    Promise.resolve().then(() => this.onShow.emit());
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.stopResize?.();
    this.unlockScroll?.();
    const el = this.maskRef?.nativeElement;
    if (el?.open) el.close();
  }

  /** Closes the dialog and tells the model (`visibleChange`). */
  close(event?: Event): void {
    if (!this._visible) return;
    event?.preventDefault();
    this._visible = false;
    this.visibleChange.emit(false);
    this.beginClose();
  }

  toggleMaximize(): void {
    this.maximized = !this.maximized;
    const panel = this.panelRef?.nativeElement;
    if (panel) panel.style.translate = '';
    this.onMaximize.emit({ maximized: this.maximized });
    this.cdr.markForCheck();
  }

  // ---------- template events ----------

  keydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    // Handled here so the browser does not close the <dialog> behind our back.
    event.preventDefault();
    if (this._closeOnEscape && this._closable) this.close(event);
  }

  /** The browser's own close request (Escape on some platforms): always ours to decide. */
  cancel(event: Event): void {
    event.preventDefault();
    if (this._closeOnEscape && this._closable) this.close(event);
  }

  /** The `<dialog>` closed by itself (a form with method="dialog", or a browser forcing it). */
  nativeClose(): void {
    if (!this._visible || this.leaving) return;
    const el = this.maskRef?.nativeElement;
    if (this._closable) this.close();
    else if (el && !el.open) this._modal ? el.showModal() : el.show();
  }

  maskPointerdown(event: PointerEvent): void {
    this.downOnMask = event.target === this.maskRef?.nativeElement;
  }

  maskClick(event: MouseEvent): void {
    // Both press and release on the mask: a text selection dragged out of the dialog does not close it.
    const onMask = this.downOnMask && event.target === this.maskRef?.nativeElement;
    this.downOnMask = false;
    if (onMask && this._dismissableMask && this._closable && this._modal) this.close(event);
  }

  headerPointerdown(event: PointerEvent): void {
    const panel = this.panelRef?.nativeElement;
    if (!this._draggable || this.maximized || !panel || event.button !== 0) return;
    if ((event.target as HTMLElement).closest('button, a, input, select, textarea')) return;
    event.preventDefault();
    const [x0, y0] = (panel.style.translate || '0px 0px').split(' ').map((v) => parseFloat(v) || 0);
    const startX = event.clientX - x0;
    const startY = event.clientY - y0;
    const move = (e: PointerEvent) => (panel.style.translate = `${e.clientX - startX}px ${e.clientY - startY}px`);
    const up = () => {
      this.doc.removeEventListener('pointermove', move);
      this.doc.removeEventListener('pointerup', up);
    };
    this.doc.addEventListener('pointermove', move);
    this.doc.addEventListener('pointerup', up);
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
      // Reopened during the fade-out: keep the dialog that is still there.
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
    this.closeTimer = setTimeout(() => this.finishClose(), reduce ? 0 : 120);
  }

  private finishClose(): void {
    this.closeTimer = null;
    const el = this.maskRef?.nativeElement;
    const hadFocus = !!el && el.contains(this.doc.activeElement);
    if (el?.open) el.close();
    this.unlockScroll?.();
    this.unlockScroll = null;
    this.stopResize?.();
    this.stopResize = null;
    this.rendered = false;
    this.leaving = false;
    this.maximized = false;
    const back = this.returnFocus;
    this.returnFocus = null;
    if (back && back.isConnected && (hadFocus || this.doc.activeElement === this.doc.body)) back.focus({ preventScroll: true });
    this.cdr.markForCheck();
    this.onHide.emit();
  }

  private focusFirst(): void {
    const panel = this.panelRef?.nativeElement;
    if (!panel) return;
    const auto = panel.querySelector<HTMLElement>('[autofocus]');
    // The close button rather than the first field, so phones do not raise the keyboard on open.
    const target = auto || panel.querySelector<HTMLElement>('.wu-dialog-header-actions button') || ɵfocusable(panel)[0] || panel;
    target.focus({ preventScroll: true });
  }

  private watchBreakpoints(): void {
    const win = this.doc.defaultView;
    if (!this.breakpoints || !win) return;
    const update = () => {
      const width = this.matchBreakpoint();
      if (width !== this.bpWidth) {
        this.bpWidth = width;
        this.updatePanelStyle();
        this.cdr.markForCheck();
      }
    };
    update();
    win.addEventListener('resize', update, { passive: true });
    this.stopResize = () => win.removeEventListener('resize', update);
  }

  private matchBreakpoint(): string | null {
    const win = this.doc.defaultView;
    if (!this.breakpoints || !win?.matchMedia) return null;
    const sorted = Object.entries(this.breakpoints).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
    for (const [max, width] of sorted) if (win.matchMedia(`(max-width: ${max})`).matches) return width;
    return null;
  }

  private updatePanelStyle(): void {
    this.panelStyle = this.bpWidth ? { ...(this.style || {}), width: this.bpWidth } : this.style || null;
  }
}
