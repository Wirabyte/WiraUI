import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  numberAttribute,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵassertSupportedAngular, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtRatingRateEvent } from './rating.types';

/** Star rating for ngModel and reactive forms: `<wt-rating [(ngModel)]="score" [stars]="5">`. Arrow keys move between stars. */
@Component({
  selector: 'wt-rating',
  standalone: true,
  templateUrl: './rating.component.html',
  styleUrl: './rating.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtRating), multi: true }],
})
export class WtRating implements ControlValueAccessor {
  readonly stars = input(5, { transform: numberAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>();

  readonly onRate = output<WtRatingRateEvent>();

  readonly name = ɵuniqueId('wt-rating');
  readonly value = signal<number | null>(null);
  private readonly hover = signal<number | null>(null);
  private readonly formDisabled = signal(false);
  private onModelChange: (value: number | null) => void = () => {};
  onTouched: () => void = () => {};

  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly interactive = computed(() => !this.isDisabled() && !this.readonly());
  readonly starList = computed(() => Array.from({ length: Math.max(0, this.stars() || 0) }, (_, i) => i + 1));
  readonly shown = computed(() => this.hover() ?? this.value() ?? 0);
  /** Classes for the root element, as before (`styleClass="w-full"`). */
  readonly styleClass = input<string | null | undefined>();
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly style = input<Record<string, any> | string | null | undefined>();
  /** The `style` object for the root (a plain style attribute already styles the host). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly rootStyle = computed(() => {
    const s = this.style();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return s && typeof s === 'object' ? (s as Record<string, any>) : null;
  });
  readonly classes = computed(() => [this.baseClasses(), this.styleClass()].filter(Boolean).join(' '));
  readonly baseClasses = computed(() => {
    const c = ['wt-rating', 'p-rating', 'p-component'];
    if (this.readonly()) c.push('wt-rating-readonly', 'p-readonly');
    if (this.isDisabled()) c.push('wt-rating-disabled', 'p-disabled');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  optionClasses(star: number): string {
    return star <= this.shown() ? 'wt-rating-option wt-rating-option-active p-rating-option p-rating-option-active' : 'wt-rating-option p-rating-option';
  }

  preview(star: number | null): void {
    if (this.interactive()) this.hover.set(star);
  }

  rate(star: number, event: Event): void {
    if (!this.interactive()) return;
    this.value.set(star);
    this.onModelChange(star);
    this.onRate.emit({ value: star, originalEvent: event });
  }

  writeValue(value: unknown): void {
    const n = Number(value);
    this.value.set(value === null || value === undefined || isNaN(n) ? null : n);
  }
  registerOnChange(fn: (value: number | null) => void): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
}
