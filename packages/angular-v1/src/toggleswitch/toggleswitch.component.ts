import { NgIf } from '@angular/common';
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
import { ɵassertSupportedAngular, ɵtoBool, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtToggleSwitchChangeEvent } from './toggleswitch.types';

/** On/off switch for ngModel and reactive forms (PrimeNG's ToggleSwitch / InputSwitch), with an optional `label`. */
@Component({
  selector: 'wt-toggleswitch',
  standalone: true,
  imports: [NgIf],
  templateUrl: './toggleswitch.component.html',
  styleUrls: ['./toggleswitch.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtToggleSwitch), multi: true }],
})
export class WtToggleSwitch implements ControlValueAccessor {
  @Input() label?: string;
  @Input() inputId?: string;
  @Input() name?: string;
  @Input() trueValue: unknown = true;
  @Input() falseValue: unknown = false;
  @Input() ariaLabel?: string;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  @Input() set readonly(v: unknown) { this._readonly = ɵtoBool(v); }
  get readonly(): boolean { return this._readonly; }
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  get invalid(): boolean { return this._invalid; }

  @Output() readonly onChange = new EventEmitter<WtToggleSwitchChangeEvent>();

  private _disabled = false;
  private _readonly = false;
  private _invalid = false;
  private model: unknown = false;
  private formDisabled = false;
  private readonly autoId = ɵuniqueId('wt-toggleswitch');
  private readonly cdr = inject(ChangeDetectorRef);
  private onModelChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  get id(): string {
    return this.inputId || this.autoId;
  }
  get isDisabled(): boolean {
    return this._disabled || this.formDisabled;
  }
  get checked(): boolean {
    return this.model === this.trueValue;
  }

  toggle(event: Event): void {
    const box = event.target as HTMLInputElement;
    if (this.isDisabled || this._readonly) {
      box.checked = this.checked;
      return;
    }
    const next = !this.checked;
    const value = next ? this.trueValue : this.falseValue;
    this.model = value;
    this.onModelChange(value);
    this.onChange.emit({ checked: next, originalEvent: event });
  }

  writeValue(value: unknown): void {
    this.model = value;
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (value: unknown) => void): void {
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
