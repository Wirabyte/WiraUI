import { ChangeDetectorRef, Directive, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ɵtoBool } from '@wirabyte/ui/config';
import { WuMessageService, WuToastMessage } from '@wirabyte/ui/toast';
import { WuMessageSeverity } from './message.types';

/**
 * What wu-messages does, shared by the v1 and v2/v3 templates: a stack of wu-message boxes from an array,
 * `<wu-messages [(value)]="msgs" [closable]="true">`. Closing one removes it from the array.
 * With `enableService` (default true, as before) it also shows what `WuMessageService.add()` sends with the same
 * `key`, so set `[enableService]="false"` when a toast on the page already shows those.
 */
@Directive()
export abstract class ɵWuMessagesBase implements OnInit, OnDestroy {
  /** The messages: `{ severity, summary, detail, closable?, icon?, life? }`. Two-way: `[(value)]`. */
  @Input() set value(v: WuToastMessage[] | null | undefined) {
    this.messages = v ? [...v] : [];
    this.cdr.markForCheck();
  }
  get value(): WuToastMessage[] {
    return this.messages;
  }
  /** Each box has an × button (unless the message says `closable: false`). Default true. */
  @Input() set closable(v: unknown) { this._closable = v === undefined || ɵtoBool(v); }
  get closable(): boolean { return this._closable; }
  /** Also show messages sent with `WuMessageService.add()` that carry this component's `key`. Default true. */
  @Input() set enableService(v: unknown) { this._service = v === undefined || ɵtoBool(v); }
  /** Severity of messages that do not give their own. */
  @Input() severity?: WuMessageSeverity;
  @Input() key?: string;
  /** `false`: summary and detail are HTML (sanitised by Angular). Default true. */
  @Input() set escape(v: unknown) { this._escape = v === undefined || ɵtoBool(v); }
  get escape(): boolean { return this._escape; }
  @Input() styleClass?: string;
  @Input() style?: Record<string, string | number> | null;
  /** Accepted for templates moving over. */
  @Input() showTransitionOptions: unknown;
  @Input() hideTransitionOptions: unknown;

  @Output() readonly valueChange = new EventEmitter<WuToastMessage[]>();
  @Output() readonly onClose = new EventEmitter<WuToastMessage>();

  messages: WuToastMessage[] = [];
  protected readonly cdr = inject(ChangeDetectorRef);
  private readonly service = inject(WuMessageService, { optional: true });
  private _closable = true;
  private _service = true;
  private _escape = true;
  private subs: Subscription[] = [];

  ngOnInit(): void {
    if (!this._service || !this.service) return;
    this.subs.push(
      this.service.messageObserver.subscribe((m) => {
        const list = (Array.isArray(m) ? m : [m]).filter((x) => x && x.key === this.key);
        if (!list.length) return;
        this.messages = [...this.messages, ...list];
        this.cdr.markForCheck();
      }),
      this.service.clearObserver.subscribe((key) => {
        if (key && key !== this.key) return;
        this.messages = [];
        this.cdr.markForCheck();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  severityOf(m: WuToastMessage): WuMessageSeverity {
    return (m.severity || this.severity || 'info') as WuMessageSeverity;
  }
  closableOf(m: WuToastMessage): boolean {
    return this._closable && m.closable !== false;
  }
  iconOf(m: WuToastMessage): string | undefined {
    return (m as { icon?: string }).icon;
  }

  remove(m: WuToastMessage): void {
    this.messages = this.messages.filter((x) => x !== m);
    this.valueChange.emit(this.messages);
    this.onClose.emit(m);
    this.cdr.markForCheck();
  }

  /** Removes every message. */
  clear(): void {
    this.messages = [];
    this.valueChange.emit(this.messages);
    this.cdr.markForCheck();
  }
}
