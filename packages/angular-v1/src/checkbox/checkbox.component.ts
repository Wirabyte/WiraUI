import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵassertSupportedAngular, ɵsize, ɵtoBool, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK, WtSize } from 'wiratheme/config';
import { WtCheckboxChangeEvent } from './checkbox.types';

/**
 * Checkbox for ngModel and reactive forms, with two modes:
 * `binary` (the model is `trueValue` / `falseValue`) or a group (the model is an array and `value` is added or removed).
 */
@Component({
  selector: 'wt-checkbox',
  standalone: true,
  imports: [NgIf],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtCheckbox), multi: true }],
})
export class WtCheckbox implements ControlValueAccessor {
  @Input() value: unknown;
  @Input() label?: string;
  @Input() inputId?: string;
  @Input() name?: string;
  @Input() trueValue: unknown = true;
  @Input() falseValue: unknown = false;
  @Input() ariaLabel?: string;
  @Input() set binary(v: unknown) { this._binary = ɵtoBool(v); }
  get binary(): boolean { return this._binary; }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  @Input() set readonly(v: unknown) { this._readonly = ɵtoBool(v); }
  get readonly(): boolean { return this._readonly; }
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  /** `small` or `large` (also `sm` / `lg`). */
  @Input() size?: WtSize;
  @HostBinding('class.wt-checkbox-sm') @HostBinding('class.p-checkbox-sm') get sizeSm(): boolean {
    return this.sizeKey === 'sm';
  }
  @HostBinding('class.wt-checkbox-lg') @HostBinding('class.p-checkbox-lg') get sizeLg(): boolean {
    return this.sizeKey === 'lg';
  }
  get sizeKey(): 'sm' | 'lg' | null {
    return ɵsize(this.size);
  }
  get invalid(): boolean { return this._invalid; }

  @Output() readonly onChange = new EventEmitter<WtCheckboxChangeEvent>();

  private _binary = false;
  private _disabled = false;
  private _readonly = false;
  private _invalid = false;
  private model: unknown = null;
  private formDisabled = false;
  private readonly autoId = ɵuniqueId('wt-checkbox');
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
    return this._binary ? this.model === this.trueValue : Array.isArray(this.model) && this.model.includes(this.value);
  }

  toggle(event: Event): void {
    const box = event.target as HTMLInputElement;
    if (this.isDisabled || this._readonly) {
      box.checked = this.checked;
      return;
    }
    const next = !this.checked;
    let value: unknown;
    if (this._binary) {
      value = next ? this.trueValue : this.falseValue;
    } else {
      const current = Array.isArray(this.model) ? (this.model as unknown[]) : [];
      value = next ? [...current, this.value] : current.filter((v) => v !== this.value);
    }
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
