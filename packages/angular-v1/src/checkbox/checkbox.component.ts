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
import { ɵassertSupportedAngular, ɵsize, ɵtoBool, ɵuniqueId, ɵWU_SKIP_VERSION_CHECK, WuSize } from 'wiraui/config';
import { WuCheckboxChangeEvent } from './checkbox.types';

/**
 * Checkbox for ngModel and reactive forms, with two modes:
 * `binary` (the model is `trueValue` / `falseValue`) or a group (the model is an array and `value` is added or removed).
 */
@Component({
  selector: 'wu-checkbox, wu-checkBox, wu-check-box',
  standalone: true,
  imports: [NgIf],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuCheckbox), multi: true }],
})
export class WuCheckbox implements ControlValueAccessor {
  @Input() value: unknown;
  @Input() label?: string;
  @Input() inputId?: string;
  @Input() name?: string;
  @Input() trueValue: unknown = true;
  @Input() falseValue: unknown = false;
  @Input() ariaLabel?: string;
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
  @Input() set binary(v: unknown) { this._binary = ɵtoBool(v); }
  get binary(): boolean { return this._binary; }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  @Input() set readonly(v: unknown) { this._readonly = ɵtoBool(v); }
  get readonly(): boolean { return this._readonly; }
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  /** `small` or `large` (also `sm` / `lg`). */
  @Input() size?: WuSize;
  @HostBinding('class.wu-checkbox-sm') @HostBinding('class.p-checkbox-sm') get sizeSm(): boolean {
    return this.sizeKey === 'sm';
  }
  @HostBinding('class.wu-checkbox-lg') @HostBinding('class.p-checkbox-lg') get sizeLg(): boolean {
    return this.sizeKey === 'lg';
  }
  get sizeKey(): 'sm' | 'lg' | null {
    return ɵsize(this.size);
  }
  get invalid(): boolean { return this._invalid; }

  @Output() readonly onChange = new EventEmitter<WuCheckboxChangeEvent>();

  private _binary = false;
  private _disabled = false;
  private _readonly = false;
  private _invalid = false;
  private model: unknown = null;
  private formDisabled = false;
  private readonly autoId = ɵuniqueId('wu-checkbox');
  private readonly cdr = inject(ChangeDetectorRef);
  private onModelChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
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
