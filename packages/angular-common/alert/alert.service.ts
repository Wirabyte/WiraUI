import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, Injectable, OnDestroy } from '@angular/core';
import { ɵwtRootInjector } from 'wiratheme/config';
import { WtAlertDialog } from './alert-dialog.component';
import { WtAlertDismissReason, WtAlertIcon, WtAlertOptions, WtAlertResult } from './alert.types';

/**
 * Ready-made alerts and questions: an animated icon, a title, text or HTML, optional input, and buttons.
 *
 * ```ts
 * const r = await alert.fire({ title: 'ลบรายการนี้?', icon: 'warning', showCancelButton: true });
 * if (r.isConfirmed) …
 * alert.fire('บันทึกแล้ว', '', 'success');
 * ```
 * The same calls work statically through `WtAlert`, so code written for a global alert function moves over by
 * changing its import.
 */
@Injectable({ providedIn: 'root' })
export class WtAlertService implements OnDestroy {
  private host: ComponentRef<WtAlertDialog> | null = null;
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);
  private readonly doc = inject(DOCUMENT);

  fire<T = any>(options: WtAlertOptions): Promise<WtAlertResult<T>>;
  fire<T = any>(title?: string, text?: string, icon?: WtAlertIcon): Promise<WtAlertResult<T>>;
  fire<T = any>(a?: string | WtAlertOptions, text?: string, icon?: WtAlertIcon): Promise<WtAlertResult<T>> {
    const options = typeof a === 'object' && a !== null ? a : { title: a, text, icon };
    return this.dialog().open(options) as Promise<WtAlertResult<T>>;
  }

  success(title: string, text?: string): Promise<WtAlertResult> {
    return this.fire({ title, text, icon: 'success' });
  }
  error(title: string, text?: string): Promise<WtAlertResult> {
    return this.fire({ title, text, icon: 'error' });
  }
  warning(title: string, text?: string): Promise<WtAlertResult> {
    return this.fire({ title, text, icon: 'warning' });
  }
  info(title: string, text?: string): Promise<WtAlertResult> {
    return this.fire({ title, text, icon: 'info' });
  }
  question(title: string, text?: string): Promise<WtAlertResult> {
    return this.fire({ title, text, icon: 'question' });
  }

  /** A yes/no question that resolves to true only on confirm. Cancel is focused, so Enter does not confirm by accident. */
  async confirm(options: WtAlertOptions | string, text?: string): Promise<boolean> {
    const o = typeof options === 'string' ? { title: options, text } : options;
    const r = await this.fire({ icon: 'question', showCancelButton: true, focusCancel: true, ...o });
    return r.isConfirmed;
  }

  /** A preset that later calls build on: `const toastLike = alert.mixin({ timer: 2000 })`. */
  mixin(defaults: WtAlertOptions): Pick<WtAlertService, 'fire'> {
    return {
      fire: ((a?: string | WtAlertOptions, text?: string, icon?: WtAlertIcon) =>
        this.fire({ ...defaults, ...(typeof a === 'object' && a !== null ? a : { title: a, text, icon }) })) as WtAlertService['fire'],
    };
  }

  /** Closes the alert on screen (it resolves as dismissed). */
  close(result?: Partial<WtAlertResult>): void {
    this.host?.instance.closeAlert(result);
  }

  /** A spinner in place of the buttons. Opens an alert with only the spinner when none is showing. */
  showLoading(): void {
    const d = this.dialog();
    if (!d.isOpen) d.open({ showConfirmButton: false, allowOutsideClick: false, allowEscapeKey: false });
    d.setLoading(true);
  }
  hideLoading(): void {
    this.host?.instance.setLoading(false);
  }
  isLoading(): boolean {
    return !!this.host?.instance.loading;
  }
  isVisible(): boolean {
    return !!this.host?.instance.isOpen;
  }
  /** The popup element, or null. */
  getPopup(): HTMLElement | null {
    return this.isVisible() ? this.host?.instance.popupRef?.nativeElement ?? null : null;
  }
  clickConfirm(): void {
    this.host?.instance.confirm();
  }
  clickCancel(): void {
    this.host?.instance.dismiss('cancel');
  }
  showValidationMessage(message: string): void {
    this.host?.instance.showValidation(message);
  }
  resetValidationMessage(): void {
    this.host?.instance.showValidation(null);
  }

  ngOnDestroy(): void {
    this.host?.destroy();
    this.host = null;
  }

  private dialog(): WtAlertDialog {
    if (!this.host) {
      this.host = createComponent(WtAlertDialog, { environmentInjector: this.injector });
      this.appRef.attachView(this.host.hostView);
      this.doc.body.appendChild(this.host.location.nativeElement);
    }
    return this.host.instance;
  }
}

function service(): WtAlertService {
  const injector = ɵwtRootInjector();
  if (!injector) throw new Error('WtAlert needs provideWiraTheme() (or WiraThemeModule.forRoot()) in the app providers.');
  return injector.get(WtAlertService);
}

const DISMISS: Record<WtAlertDismissReason, WtAlertDismissReason> = { cancel: 'cancel', backdrop: 'backdrop', close: 'close', esc: 'esc', timer: 'timer' };

/**
 * `WtAlertService` without injection, for code that calls an alert from anywhere:
 * `import { WtAlert as Swal } from 'wiratheme/alert'` keeps `Swal.fire(...)` calls working as they are.
 */
export const WtAlert = {
  fire: ((a?: string | WtAlertOptions, text?: string, icon?: WtAlertIcon) => service().fire(a as string, text, icon)) as WtAlertService['fire'],
  success: (title: string, text?: string) => service().success(title, text),
  error: (title: string, text?: string) => service().error(title, text),
  warning: (title: string, text?: string) => service().warning(title, text),
  info: (title: string, text?: string) => service().info(title, text),
  question: (title: string, text?: string) => service().question(title, text),
  confirm: (options: WtAlertOptions | string, text?: string) => service().confirm(options, text),
  mixin: (defaults: WtAlertOptions) => service().mixin(defaults),
  close: (result?: Partial<WtAlertResult>) => service().close(result),
  showLoading: () => service().showLoading(),
  hideLoading: () => service().hideLoading(),
  isLoading: () => service().isLoading(),
  isVisible: () => service().isVisible(),
  getPopup: () => service().getPopup(),
  clickConfirm: () => service().clickConfirm(),
  clickCancel: () => service().clickCancel(),
  showValidationMessage: (message: string) => service().showValidationMessage(message),
  resetValidationMessage: () => service().resetValidationMessage(),
  DismissReason: DISMISS,
};
