import { DOCUMENT } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef, Directive, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { ɵlockScroll, ɵuniqueId, WtConfig } from 'wiratheme/config';
import { WtLocale } from 'wiratheme/core';
import { WtAlertDismissReason, WtAlertIcon, WtAlertOptions, WtAlertResult } from './alert.types';

type Icon = 'success' | 'error' | 'warning' | 'info' | 'question';
const ICONS: Record<WtAlertIcon, Icon> = {
  success: 'success',
  error: 'error',
  danger: 'error',
  warning: 'warning',
  warn: 'warning',
  info: 'info',
  question: 'question',
  help: 'question',
};

/**
 * The popup behind `WtAlert.fire()`: one per app, created on first use and reused. Shared logic of the v1 and
 * v2/v3 templates. A native modal <dialog>, so it opens above everything, dialogs included.
 */
@Directive()
export abstract class ɵWtAlertDialogBase implements AfterViewChecked, OnDestroy {
  @ViewChild('mask') maskRef?: ElementRef<HTMLDialogElement>;
  @ViewChild('popup') popupRef?: ElementRef<HTMLElement>;

  o: WtAlertOptions = {};
  rendered = false;
  leaving = false;
  loading = false;
  icon: Icon | null = null;
  /** What the input holds, as the result will carry it. */
  inputValue: unknown = '';
  validation: string | null = null;
  /** One entry, changed on every fire, so the icon animation plays again. */
  runs: number[] = [0];
  readonly titleId = ɵuniqueId('wt-alert-title');
  readonly textId = ɵuniqueId('wt-alert-text');

  private run = 0;
  private resolveFn: ((r: WtAlertResult) => void) | null = null;
  private pendingShow = false;
  private downOnMask = false;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private unlockScroll: (() => void) | null = null;
  private returnFocus: HTMLElement | null = null;
  protected readonly cdr = inject(ChangeDetectorRef);
  private readonly config = inject(WtConfig);
  private readonly doc = inject(DOCUMENT);

  get t(): WtLocale {
    return this.config.translation;
  }
  get confirmText(): string {
    return this.o.confirmButtonText ?? this.t.accept;
  }
  get cancelText(): string {
    return this.o.cancelButtonText ?? this.t.cancel;
  }
  get denyText(): string {
    return this.o.denyButtonText ?? this.t.no;
  }
  get showConfirm(): boolean {
    return this.o.showConfirmButton !== false;
  }
  /** The buttons in screen and Tab order: cancel, deny, confirm unless `reverseButtons: false`. */
  get actions(): ('confirm' | 'deny' | 'cancel')[] {
    const list: ('confirm' | 'deny' | 'cancel')[] = [];
    if (this.showConfirm) list.push('confirm');
    if (this.o.showDenyButton) list.push('deny');
    if (this.o.showCancelButton) list.push('cancel');
    return this.o.reverseButtons === false ? list : list.reverse();
  }
  get hasActions(): boolean {
    return !this.loading && (this.showConfirm || !!this.o.showCancelButton || !!this.o.showDenyButton);
  }
  get popupWidth(): string | null {
    const w = this.o.width;
    return w === undefined || w === null || w === '' ? null : typeof w === 'number' ? `${w}px` : w;
  }
  get options(): { value: string; label: string }[] {
    return Object.entries(this.o.inputOptions || {}).map(([value, label]) => ({ value, label }));
  }
  get isTextInput(): boolean {
    const i = this.o.input;
    return !!i && i !== 'textarea' && i !== 'select' && i !== 'radio' && i !== 'checkbox';
  }
  /** A class from `customClass` for one part (a plain string goes on the popup). */
  part(name: 'popup' | 'title' | 'htmlContainer' | 'confirmButton' | 'cancelButton' | 'denyButton'): string {
    const c = this.o.customClass;
    if (!c) return '';
    if (typeof c === 'string') return name === 'popup' ? c : '';
    return c[name] || '';
  }

  // ---------- called by WtAlertService ----------

  open(options: WtAlertOptions): Promise<WtAlertResult> {
    // A new alert replaces the one on screen, which resolves as dismissed.
    if (this.resolveFn) this.settle({ isConfirmed: false, isDenied: false, isDismissed: true, dismiss: 'close' }, false);
    this.clearTimers();
    if (!this.rendered || this.leaving) {
      if (!this.rendered) {
        const active = this.doc.activeElement as HTMLElement | null;
        this.returnFocus = active && active !== this.doc.body ? active : null;
      }
      this.leaving = false;
    }
    this.o = { ...options };
    this.icon = options.icon ? ICONS[options.icon] || null : null;
    this.inputValue = options.inputValue ?? (options.input === 'checkbox' ? false : '');
    this.validation = null;
    this.loading = false;
    this.runs = [++this.run];
    this.rendered = true;
    this.pendingShow = true;
    const promise = new Promise<WtAlertResult>((resolve) => (this.resolveFn = resolve));
    this.render();
    // Opened here, not only in ngAfterViewChecked: this popup lives outside the page's view tree, and in zoneless apps
    // nothing else checks it again.
    this.showIfPending();
    return promise;
  }

  /** Closes the alert on screen; it resolves as dismissed. */
  closeAlert(result?: Partial<WtAlertResult>): void {
    if (!this.resolveFn) return;
    this.settle({ isConfirmed: false, isDenied: false, isDismissed: true, ...result });
  }

  setLoading(on: boolean): void {
    this.loading = on;
    if (on) this.validation = null;
    this.render();
  }

  showValidation(message: string | null): void {
    this.validation = message;
    this.render();
  }

  get isOpen(): boolean {
    return this.rendered && !this.leaving;
  }

  // ---------- template events ----------

  async confirm(): Promise<void> {
    if (this.loading || !this.resolveFn) return;
    const run = this.run;
    let value: unknown = this.o.input ? this.readInput() : true;
    const field = this.field();
    if (field && 'checkValidity' in field && !field.checkValidity()) {
      this.showValidation(this.o.validationMessage || field.validationMessage);
      field.focus();
      return;
    }
    if (this.o.inputValidator) {
      const message = await this.o.inputValidator(value);
      if (run !== this.run) return;
      if (message) {
        this.showValidation(message);
        field?.focus();
        return;
      }
    }
    if (this.o.preConfirm) {
      this.setLoading(true);
      try {
        const r = await this.o.preConfirm(value);
        if (run !== this.run) return;
        if (r === false) {
          this.setLoading(false);
          return;
        }
        if (r !== undefined) value = r;
      } catch (e) {
        if (run !== this.run) return;
        this.loading = false;
        this.showValidation(e instanceof Error ? e.message : String(e));
        return;
      }
    }
    this.settle({ isConfirmed: true, isDenied: false, isDismissed: false, value });
  }

  deny(): void {
    if (this.loading) return;
    this.settle({ isConfirmed: false, isDenied: true, isDismissed: false, value: false });
  }

  dismiss(reason: WtAlertDismissReason): void {
    this.settle({ isConfirmed: false, isDenied: false, isDismissed: true, dismiss: reason });
  }

  typed(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.inputValue = el.type === 'checkbox' ? el.checked : el.value;
    if (this.validation) this.showValidation(null);
  }

  keydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      // Ours to decide, so the browser does not close the <dialog> by itself.
      event.preventDefault();
      event.stopPropagation();
      if (this.o.allowEscapeKey !== false && !this.loading) this.dismiss('esc');
    } else if (event.key === 'Enter' && this.o.allowEnterKey !== false && !event.isComposing) {
      const t = event.target as HTMLElement;
      if (t.classList.contains('wt-alert-field') && t.tagName === 'INPUT') {
        event.preventDefault();
        this.confirm();
      }
    }
  }

  cancelEvent(event: Event): void {
    event.preventDefault();
    if (this.o.allowEscapeKey !== false && !this.loading) this.dismiss('esc');
  }

  maskPointerdown(event: PointerEvent): void {
    this.downOnMask = event.target === this.maskRef?.nativeElement;
  }

  maskClick(event: MouseEvent): void {
    const onMask = this.downOnMask && event.target === this.maskRef?.nativeElement;
    this.downOnMask = false;
    if (!onMask || this.loading) return;
    const allow = this.o.allowOutsideClick;
    if (allow === undefined || allow === true || (typeof allow === 'function' && allow())) this.dismiss('backdrop');
  }

  // ---------- lifecycle ----------

  ngAfterViewChecked(): void {
    this.showIfPending();
  }

  private showIfPending(): void {
    if (!this.pendingShow) return;
    const el = this.maskRef?.nativeElement;
    const popup = this.popupRef?.nativeElement;
    if (!el || !popup) return;
    this.pendingShow = false;
    if (!el.open) {
      try {
        el.showModal();
      } catch {
        el.setAttribute('open', '');
      }
      this.unlockScroll = this.unlockScroll || ɵlockScroll(this.doc);
      // Toasts on screen move back above this alert.
      this.doc.dispatchEvent(new CustomEvent('wt-modal-open'));
    }
    const field = this.field();
    if (field) for (const [k, v] of Object.entries(this.o.inputAttributes || {})) field.setAttribute(k, v);
    const focus =
      field ||
      popup.querySelector<HTMLElement>(this.o.focusCancel ? '.wt-alert-cancel' : '.wt-alert-confirm') ||
      popup.querySelector<HTMLElement>('.wt-alert-button, .wt-alert-close') ||
      popup;
    focus.focus({ preventScroll: true });
    if (this.o.timer) this.timer = setTimeout(() => this.dismiss('timer'), this.o.timer);
    // Callbacks often change the alert (showLoading in didOpen); run them after this check.
    const didOpen = this.o.didOpen;
    if (didOpen) Promise.resolve().then(() => didOpen(popup));
  }

  ngOnDestroy(): void {
    this.clearTimers();
    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.unlockScroll?.();
  }

  // ---------- internals ----------

  private settle(result: WtAlertResult, animate = true): void {
    const resolve = this.resolveFn;
    this.resolveFn = null;
    this.clearTimers();
    if (animate) this.beginClose();
    resolve?.(result);
  }

  private beginClose(): void {
    const popup = this.popupRef?.nativeElement;
    const o = this.o;
    if (popup) o.willClose?.(popup);
    this.leaving = true;
    this.loading = false;
    this.render();
    const win = this.doc.defaultView;
    const reduce = !!win?.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.closeTimer = setTimeout(() => {
      this.closeTimer = null;
      // A new alert opened during the fade-out takes the popup over.
      if (!this.leaving) return;
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
      this.render();
      o.didClose?.();
    }, reduce ? 0 : 150);
  }

  private readInput(): unknown {
    if (this.o.input === 'checkbox') return this.inputValue ? 1 : 0;
    return this.inputValue === null || this.inputValue === undefined ? '' : this.inputValue;
  }

  private field(): HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null {
    return this.popupRef?.nativeElement.querySelector('.wt-alert-field') ?? null;
  }

  private clearTimers(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }

  /** Draws now when called from app code (outside change detection), and marks the view for the next check too. */
  private render(): void {
    this.cdr.markForCheck();
    try {
      this.cdr.detectChanges();
    } catch {
      // Inside a check already: the mark above draws it.
    }
  }
}
