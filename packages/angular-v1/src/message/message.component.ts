import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵseverity, ɵtoBool, ɵWU_SKIP_VERSION_CHECK, WuConfig } from '@wirabyte/ui/config';
import { WuMessageSeverity, WuMessageSize, WuMessageVariant } from './message.types';

/**
 * Inline status message: `<wu-message severity="warn" text="กรุณาตรวจสอบข้อมูล" closable>`.
 * Projected content follows `text`. `life` (ms) closes it automatically; closing emits `onClose`.
 */
@Component({
  selector: 'wu-message',
  standalone: true,
  imports: [NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './message.component.html',
  styleUrls: ['./message.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuMessage implements OnInit, OnDestroy {
  @Input() severity: WuMessageSeverity = 'info';
  @Input() text?: string;
  /** `[escape]="false"` shows `text` as HTML (sanitised by Angular). Default true. */
  @Input() set escape(v: unknown) { this._escape = v === undefined || ɵtoBool(v); }
  get escape(): boolean { return this._escape; }
  private _escape = true;
  /** Icon class instead of the built-in icon, e.g. `pi pi-bell`. */
  @Input() icon?: string;
  @Input() set closable(v: unknown) { this._closable = ɵtoBool(v); }
  get closable(): boolean { return this._closable; }
  /** Close automatically after this many milliseconds. */
  @Input() set life(v: unknown) { this._life = Number(v) || 0; }
  get life(): number { return this._life; }
  @Input() size?: WuMessageSize;
  @Input() variant?: WuMessageVariant;

  @Output() readonly onClose = new EventEmitter<Event | null>();

  @HostBinding('hidden') get hidden(): boolean {
    return !this.visible;
  }

  visible = true;
  private _closable = false;
  private _life = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnInit(): void {
    if (this._life > 0) this.timer = setTimeout(() => this.close(null), this._life);
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    if (this.timer) clearTimeout(this.timer);
  }

  get sev(): string {
    return ɵseverity(this.severity, 'info');
  }

  /** Our classes plus the classic-era names: the inline message, with danger spelt error. */
  /** Classes for the root element, as before (`styleClass="w-full"`). */
  @Input() styleClass?: string | null;
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  /** The `style` object for the root (a plain style attribute already styles the host). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get classes(): string {
    return [this.baseClasses, this.styleClass].filter(Boolean).join(' ');
  }
  get baseClasses(): string {
    const sev = this.sev;
    const c = ['wu-message', 'p-inline-message', 'p-component', 'wu-message-' + sev, 'p-inline-message-' + (sev === 'danger' ? 'error' : sev)];
    if (this.size === 'small') c.push('wu-message-sm');
    if (this.size === 'large') c.push('wu-message-lg');
    if (this.variant) c.push('wu-message-' + this.variant);
    return c.join(' ');
  }

  get closeLabel(): string {
    return this.config.translation.close;
  }

  close(event: Event | null): void {
    if (!this.visible) return;
    this.visible = false;
    this.onClose.emit(event);
    this.cdr.markForCheck();
  }
}
