import { inject, Injectable, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WtAlertIcon, WtAlertService } from 'wiratheme/alert';
import { WtConfirmation, WtConfirmEventType } from './confirmdialog.types';

const ALERT_ICONS: [RegExp, WtAlertIcon][] = [
  [/exclamation|warn/, 'warning'],
  [/question/, 'question'],
  [/info/, 'info'],
  [/check|success/, 'success'],
  [/times|ban|trash|error|danger/, 'error'],
];

/**
 * Asks a question in `<wt-confirmdialog>`: `confirmation.confirm({ message: 'ลบรายการนี้?', accept: () => … })`.
 * Provided in root, and can also be provided per component as apps already do. When no `<wt-confirmdialog>` with that
 * key is on the page, the question opens as a ready-made alert instead, so it is never silently lost.
 */
@Injectable({ providedIn: 'root' })
export class WtConfirmationService {
  private readonly requireSource = new Subject<WtConfirmation | null>();
  private readonly acceptSource = new Subject<WtConfirmation | null>();
  /** Emits each confirmation (null to close). `<wt-confirmdialog>` listens. */
  readonly requireConfirmation$: Observable<WtConfirmation | null> = this.requireSource.asObservable();
  readonly accept: Observable<WtConfirmation | null> = this.acceptSource.asObservable();
  private readonly listeners = new Map<string, number>();
  private readonly injector = inject(Injector);

  confirm(confirmation: WtConfirmation): this {
    if (this.listeners.get(confirmation.key ?? '')) this.requireSource.next(confirmation);
    else this.fallback(confirmation);
    return this;
  }

  close(): this {
    this.requireSource.next(null);
    return this;
  }

  onAccept(): void {
    this.acceptSource.next(null);
  }

  /** Internal: a dialog with this key is listening (returns the function that stops it). */
  ɵlisten(key: string | undefined): () => void {
    const k = key ?? '';
    this.listeners.set(k, (this.listeners.get(k) || 0) + 1);
    return () => this.listeners.set(k, (this.listeners.get(k) || 1) - 1);
  }

  private fallback(c: WtConfirmation): void {
    const icon = c.icon ? ALERT_ICONS.find(([re]) => re.test(c.icon as string))?.[1] ?? 'question' : 'question';
    this.injector
      .get(WtAlertService)
      .fire({
        title: c.header,
        text: c.message,
        icon,
        showConfirmButton: c.acceptVisible !== false,
        showCancelButton: c.rejectVisible !== false,
        confirmButtonText: c.acceptLabel,
        cancelButtonText: c.rejectLabel,
        allowOutsideClick: !!c.dismissableMask,
        allowEscapeKey: c.closeOnEscape !== false,
        focusCancel: c.defaultFocus === 'reject',
      })
      .then((r) => {
        if (r.isConfirmed) c.accept?.();
        else c.reject?.(r.dismiss === 'cancel' ? WtConfirmEventType.REJECT : WtConfirmEventType.CANCEL);
      });
  }
}
