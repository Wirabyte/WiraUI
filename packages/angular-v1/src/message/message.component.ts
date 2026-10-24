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
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵseverity, ɵtoBool, ɵWT_SKIP_VERSION_CHECK, WtConfig } from 'wiratheme/config';
import { WtMessageSeverity, WtMessageSize, WtMessageVariant } from './message.types';

/**
 * Inline status message: `<wt-message severity="warn" text="กรุณาตรวจสอบข้อมูล" closable>`.
 * Projected content follows `text`. `life` (ms) closes it automatically; closing emits `onClose`.
 */
@Component({
  selector: 'wt-message',
  standalone: true,
  imports: [NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './message.component.html',
  styleUrls: ['./message.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtMessage implements OnInit, OnDestroy {
  @Input() severity: WtMessageSeverity = 'info';
  @Input() text?: string;
  /** Icon class instead of the built-in icon, e.g. `pi pi-bell`. */
  @Input() icon?: string;
  @Input() set closable(v: unknown) { this._closable = ɵtoBool(v); }
  get closable(): boolean { return this._closable; }
  /** Close automatically after this many milliseconds. */
  @Input() set life(v: unknown) { this._life = Number(v) || 0; }
  get life(): number { return this._life; }
  @Input() size?: WtMessageSize;
  @Input() variant?: WtMessageVariant;

  @Output() readonly onClose = new EventEmitter<Event | null>();

  @HostBinding('hidden') get hidden(): boolean {
    return !this.visible;
  }

  visible = true;
  private _closable = false;
  private _life = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private readonly config = inject(WtConfig);
  private readonly i18n = ɵrefreshOnTranslation();
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
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
  get classes(): string {
    const sev = this.sev;
    const c = ['wt-message', 'p-inline-message', 'p-component', 'wt-message-' + sev, 'p-inline-message-' + (sev === 'danger' ? 'error' : sev)];
    if (this.size === 'small') c.push('wt-message-sm');
    if (this.size === 'large') c.push('wt-message-lg');
    if (this.variant) c.push('wt-message-' + this.variant);
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
