import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵassertSupportedAngular, ɵtoBool, ɵuniqueId, ɵWU_SKIP_VERSION_CHECK } from '@wirabyte/ui/config';
import { WuRatingRateEvent } from './rating.types';

/** Star rating for ngModel and reactive forms: `<wu-rating [(ngModel)]="score" [stars]="5">`. Arrow keys move between stars. */
@Component({
  selector: 'wu-rating',
  standalone: true,
  imports: [NgFor],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuRating), multi: true }],
})
export class WuRating implements ControlValueAccessor {
  @Input() set stars(v: unknown) {
    const n = Math.max(0, Number(v) || 0);
    this._stars = n;
    this.starList = Array.from({ length: n }, (_, i) => i + 1);
  }
  get stars(): number { return this._stars; }
  @Input() set readonly(v: unknown) { this._readonly = ɵtoBool(v); }
  get readonly(): boolean { return this._readonly; }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  @Input() ariaLabel?: string;

  @Output() readonly onRate = new EventEmitter<WuRatingRateEvent>();

  readonly name = ɵuniqueId('wu-rating');
  value: number | null = null;
  starList = [1, 2, 3, 4, 5];
  private _stars = 5;
  private _readonly = false;
  private _disabled = false;
  private hover: number | null = null;
  private formDisabled = false;
  private readonly cdr = inject(ChangeDetectorRef);
  private onModelChange: (value: number | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  get isDisabled(): boolean {
    return this._disabled || this.formDisabled;
  }
  get interactive(): boolean {
    return !this.isDisabled && !this._readonly;
  }
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
    const c = ['wu-rating', 'p-rating', 'p-component'];
    if (this._readonly) c.push('wu-rating-readonly', 'p-readonly');
    if (this.isDisabled) c.push('wu-rating-disabled', 'p-disabled');
    return c.join(' ');
  }

  /** Our classes plus the classic-era names (`p-rating-item-active`). */
  optionClasses(star: number): string {
    const shown = this.hover ?? this.value ?? 0;
    return star <= shown ? 'wu-rating-option wu-rating-option-active p-rating-item p-rating-item-active' : 'wu-rating-option p-rating-item';
  }

  preview(star: number | null): void {
    if (this.interactive) this.hover = star;
  }

  rate(star: number, event: Event): void {
    if (!this.interactive) return;
    this.value = star;
    this.onModelChange(star);
    this.onRate.emit({ value: star, originalEvent: event });
  }

  writeValue(value: unknown): void {
    const n = Number(value);
    this.value = value === null || value === undefined || isNaN(n) ? null : n;
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (value: number | null) => void): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled = disabled;
    this.cdr.markForCheck();
  }
}
