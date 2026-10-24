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
import {
  ɵassertSupportedAngular,
  ɵoptionDisabled,
  ɵoptionLabel,
  ɵoptionValue,
  ɵsameValue,
  ɵsize,
  ɵWT_SKIP_VERSION_CHECK,
  WtSize,
} from 'wiratheme/config';
import { WtSelectButtonChangeEvent, WtSelectButtonOptionClickEvent } from './selectbutton.types';

/**
 * Pick one option (or several with `multiple`) from a row of buttons:
 * `<wt-selectbutton [options]="plans" optionLabel="name" optionValue="id" [(ngModel)]="plan">`.
 */
@Component({
  selector: 'wt-selectbutton',
  host: {
    '[class.wt-selectbutton-sm]': "sizeKey() === 'sm'",
    '[class.p-selectbutton-sm]': "sizeKey() === 'sm'",
    '[class.wt-selectbutton-lg]': "sizeKey() === 'lg'",
    '[class.p-selectbutton-lg]': "sizeKey() === 'lg'",
  },
  standalone: true,
  templateUrl: './selectbutton.component.html',
  styleUrl: './selectbutton.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtSelectButton), multi: true }],
})
export class WtSelectButton implements ControlValueAccessor {
  readonly options = input<readonly unknown[] | null | undefined>([]);
  readonly optionLabel = input<string>();
  readonly optionValue = input<string>();
  readonly optionDisabled = input<string>();
  /** Compare object values by this property instead of identity. */
  readonly dataKey = input<string>();
  readonly multiple = input(false, { transform: booleanAttribute });
  /** Clicking the chosen option again clears it. Default true. */
  readonly allowEmpty = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  /** `small` or `large` (also `sm` / `lg`). */
  readonly size = input<WtSize>();
  readonly sizeKey = computed(() => ɵsize(this.size()));
  readonly ariaLabelledBy = input<string>();

  readonly onChange = output<WtSelectButtonChangeEvent>();
  readonly onOptionClick = output<WtSelectButtonOptionClickEvent>();

  private readonly model = signal<unknown>(null);
  private readonly formDisabled = signal(false);
  private onModelChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly classes = computed(() => {
    const c = ['wt-selectbutton', 'p-selectbutton', 'p-component'];
    if (this.invalid()) c.push('wt-invalid', 'p-invalid');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  labelOf(option: unknown): string {
    return ɵoptionLabel(option, this.optionLabel());
  }
  isOptionDisabled(option: unknown): boolean {
    return ɵoptionDisabled(option, this.optionDisabled());
  }
  isSelected(option: unknown): boolean {
    const value = ɵoptionValue(option, this.optionValue());
    const m = this.model();
    if (this.multiple()) return Array.isArray(m) && m.some((v) => ɵsameValue(v, value, this.dataKey()));
    return ɵsameValue(m, value, this.dataKey());
  }
  optionClasses(option: unknown): string {
    return this.isSelected(option)
      ? 'wt-selectbutton-option wt-selectbutton-option-checked p-togglebutton p-togglebutton-checked'
      : 'wt-selectbutton-option p-togglebutton';
  }

  select(option: unknown, index: number, event: Event): void {
    if (this.isDisabled() || this.isOptionDisabled(option)) return;
    const value = ɵoptionValue(option, this.optionValue());
    const selected = this.isSelected(option);
    let next: unknown;
    if (this.multiple()) {
      const current = Array.isArray(this.model()) ? (this.model() as unknown[]) : [];
      if (selected && !this.allowEmpty() && current.length === 1) return;
      next = selected ? current.filter((v) => !ɵsameValue(v, value, this.dataKey())) : [...current, value];
    } else {
      if (selected && !this.allowEmpty()) return;
      next = selected ? null : value;
    }
    this.model.set(next);
    this.onModelChange(next);
    this.onOptionClick.emit({ option, index, originalEvent: event });
    this.onChange.emit({ value: next, originalEvent: event });
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
