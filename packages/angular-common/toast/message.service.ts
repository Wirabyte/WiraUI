import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WuToastMessage } from './toast.types';

/**
 * Sends toasts to `<wu-toast>`: `messages.add({ severity: 'success', summary: 'บันทึกแล้ว', detail: '…' })`.
 * Provided in root, and can also be provided per component as apps already do.
 */
@Injectable({ providedIn: 'root' })
export class WuMessageService {
  private readonly messageSource = new Subject<WuToastMessage | WuToastMessage[]>();
  private readonly clearSource = new Subject<string | null>();
  readonly messageObserver: Observable<WuToastMessage | WuToastMessage[]> = this.messageSource.asObservable();
  readonly clearObserver: Observable<string | null> = this.clearSource.asObservable();

  add(message: WuToastMessage): void {
    if (message) this.messageSource.next(message);
  }
  addAll(messages: WuToastMessage[]): void {
    if (messages && messages.length) this.messageSource.next(messages);
  }
  /** Removes the toasts of one key, or all of them. */
  clear(key?: string): void {
    this.clearSource.next(key || null);
  }
}
