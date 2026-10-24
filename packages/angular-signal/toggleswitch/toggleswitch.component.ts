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
import { ɵassertSupportedAngular, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtToggleSwitchChangeEvent } from './toggleswitch.types';

/** On/off switch for ngModel and reactive forms (PrimeNG's ToggleSwitch / InputSwitch), with an optional `label`. */
@Component({
  selector: 'wt-toggleswitch',
  standalone: true,
  templateUrl: './toggleswitch.component.html',
  styleUrl: './toggleswitch.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtToggleSwitch), multi: true }],
})
export class WtToggleSwitch implements ControlValueAccessor {
  readonly label = input<string>();
  readonly inputId = input<string>();
  readonly name = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly trueValue = input<unknown>(true);
  readonly falseValue = input<unknown>(false);
  readonly ariaLabel = input<string>();

  readonly onChange = output<WtToggleSwitchChangeEvent>();

  private readonly model = signal<unknown>(false);
  private readonly formDisabled = signal(false);
  private readonly autoId = ɵuniqueId('wt-toggleswitch');
  private onModelChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  readonly id = computed(() => this.inputId() || this.autoId);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly checked = computed(() => this.model() === this.trueValue());

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
    const value = next ? this.trueValue() : this.falseValue();
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
