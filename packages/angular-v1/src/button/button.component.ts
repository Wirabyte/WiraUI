import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { isObservable } from 'rxjs';
import { ɵassertSupportedAngular, ɵrippleAt, ɵWT_SKIP_VERSION_CHECK, WtConfig } from 'wiratheme/config';
import { WtButtonAction, WtButtonSeverity, WtButtonSize, WtButtonVariant } from './button.types';

/** Same as `booleanAttribute`, which Angular 15 does not have: `<wt-button outlined>` means true. */
function toBool(value: unknown): boolean {
  return value === '' || value === true || value === 'true';
}

/**
 * Button with PrimeNG-style inputs (`label`, `icon`, `severity`, `outlined`, `text`, `loading`, `(onClick)`)
 * plus `[action]`: pass a function returning a Promise or Observable and the button shows a spinner
 * and ignores repeat clicks until it settles. Renders the same DOM as wiratheme v2/v3.
 */
@Component({
  selector: 'wt-button',
  standalone: true,
  imports: [NgIf],
  templateUrl: './button.component.html',
  styleUrls: ['./button.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtButton {
  @Input() label?: string;
  /** Icon class, e.g. `pi pi-check` or `fa-solid fa-floppy-disk`. */
  @Input() icon?: string;
  @Input() iconPos: 'left' | 'right' = 'left';
  @Input() severity: WtButtonSeverity = 'primary';
  @Input() variant: WtButtonVariant = 'solid';
  @Input() size?: WtButtonSize;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() badge?: string | number;
  @Input() ariaLabel?: string;
  @Input() action?: WtButtonAction;

  @Input() set outlined(v: unknown) { this._outlined = toBool(v); }
  get outlined(): boolean { return this._outlined; }
  @Input() set text(v: unknown) { this._text = toBool(v); }
  get text(): boolean { return this._text; }
  @Input() set raised(v: unknown) { this._raised = toBool(v); }
  get raised(): boolean { return this._raised; }
  @Input() set rounded(v: unknown) { this._rounded = toBool(v); }
  get rounded(): boolean { return this._rounded; }
  @Input() set fluid(v: unknown) { this._fluid = toBool(v); }
  get fluid(): boolean { return this._fluid; }
  @Input() set loading(v: unknown) { this._loading = toBool(v); }
  get loading(): boolean { return this._loading; }
  @Input() set disabled(v: unknown) { this._disabled = toBool(v); }
  get disabled(): boolean { return this._disabled; }

  @Output() readonly onClick = new EventEmitter<MouseEvent>();

  @HostBinding('class.wt-button-fluid') get fluidClass(): boolean {
    return this._fluid;
  }

  private _outlined = false;
  private _text = false;
  private _raised = false;
  private _rounded = false;
  private _fluid = false;
  private _loading = false;
  private _disabled = false;
  private pending = false;

  private readonly config = inject(WtConfig);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  get busy(): boolean {
    return this._loading || this.pending;
  }

  get showIcon(): boolean {
    return !!this.icon && !this.busy;
  }

  get classes(): string {
    const sev = this.severity === 'warning' ? 'warn' : this.severity;
    const variant = this._outlined ? 'outlined' : this._text ? 'text' : this.variant;
    const c = ['wt-btn'];
    if (sev !== 'primary') c.push('wt-btn-' + sev);
    if (variant !== 'solid') c.push('wt-btn-' + variant);
    if (this.size === 'small') c.push('wt-btn-sm');
    if (this.size === 'large') c.push('wt-btn-lg');
    if (this._raised) c.push('wt-btn-raised');
    if (this._rounded) c.push('wt-btn-rounded');
    if (this.busy) c.push('wt-btn-loading');
    if (!this.label && (this.icon || this.busy)) c.push('wt-btn-icon-only');
    return c.join(' ');
  }

  get hasBadge(): boolean {
    return this.badge !== undefined && this.badge !== null && this.badge !== '';
  }

  handleClick(event: MouseEvent): void {
    if (this.busy) return;
    this.onClick.emit(event);
    if (!this.action) return;
    const result = this.action();
    if (result && typeof (result as Promise<unknown>).then === 'function') {
      this.setPending(true);
      (result as Promise<unknown>).then(
        () => this.setPending(false),
        () => this.setPending(false)
      );
    } else if (isObservable(result)) {
      this.setPending(true);
      result.subscribe({ error: () => this.setPending(false), complete: () => this.setPending(false) });
    }
  }

  handlePointerDown(event: PointerEvent): void {
    if (this.config.ripple && !this._disabled && !this.busy) ɵrippleAt(event.currentTarget as HTMLElement, event);
  }

  private setPending(value: boolean): void {
    this.pending = value;
    this.cdr.markForCheck();
  }
}
