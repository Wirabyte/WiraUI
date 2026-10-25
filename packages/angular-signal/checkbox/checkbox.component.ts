import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵassertSupportedAngular, ɵsize, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK, WtSize } from 'wiratheme/config';
import { WtCheckboxChangeEvent } from './checkbox.types';

/**
 * Checkbox for ngModel and reactive forms, with two modes:
 * `binary` (the model is `trueValue` / `falseValue`) or a group (the model is an array and `value` is added or removed).
 */
@Component({
  selector: 'wt-checkbox, wt-checkBox, wt-check-box',
  host: {
    '[class.wt-checkbox-sm]': "sizeKey() === 'sm'",
    '[class.p-checkbox-sm]': "sizeKey() === 'sm'",
    '[class.wt-checkbox-lg]': "sizeKey() === 'lg'",
    '[class.p-checkbox-lg]': "sizeKey() === 'lg'",
  },
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtCheckbox), multi: true }],
})
export class WtCheckbox implements ControlValueAccessor {
  readonly value = input<unknown>();
  readonly binary = input(false, { transform: booleanAttribute });
  readonly label = input<string>();
  readonly inputId = input<string>();
  readonly name = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  /** `small` or `large` (also `sm` / `lg`). */
  readonly size = input<WtSize>();
  readonly sizeKey = computed(() => ɵsize(this.size()));
  readonly trueValue = input<unknown>(true);
  readonly falseValue = input<unknown>(false);
  readonly ariaLabel = input<string>();
  /** Classes for the root element, as before (`styleClass="w-full"`). */
  readonly styleClass = input<string | null | undefined>();
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly style = input<Record<string, any> | string | null | undefined>();
  /** The `style` object for the root (a plain style attribute already styles the host). */
  readonly rootStyle = computed(() => {
    const s = this.style();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return s && typeof s === 'object' ? (s as Record<string, any>) : null;
  });

  readonly onChange = output<WtCheckboxChangeEvent>();

  private readonly model = signal<unknown>(null);
  private readonly formDisabled = signal(false);
  private readonly autoId = ɵuniqueId('wt-checkbox');
  private onModelChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  readonly id = computed(() => this.inputId() || this.autoId);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly checked = computed(() => {
    const m = this.model();
    return this.binary() ? m === this.trueValue() : Array.isArray(m) && m.includes(this.value());
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  toggle(event: Event): void {
    const box = event.target as HTMLInputElement;
    if (this.isDisabled() || this.readonly()) {
      box.checked = this.checked();
      return;
    }
    const next = !this.checked();
    let value: unknown;
    if (this.binary()) {
      value = next ? this.trueValue() : this.falseValue();
    } else {
      const current = Array.isArray(this.model()) ? (this.model() as unknown[]) : [];
      value = next ? [...current, this.value()] : current.filter((v) => v !== this.value());
    }
    this.model.set(value);
    this.onModelChange(value);
    this.onChange.emit({ checked: next, originalEvent: event });
  }

  writeValue(value: unknown): void {
    this.model.set(value);
  }
  registerOnChange(fn: (value: unknown) => void): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
}
