import { NgFor } from '@angular/common';
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
import {
  ɵassertSupportedAngular,
  ɵoptionDisabled,
  ɵoptionLabel,
  ɵoptionValue,
  ɵsameValue,
  ɵsize,
  ɵtoBool,
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
  standalone: true,
  imports: [NgFor],
  templateUrl: './selectbutton.component.html',
  styleUrls: ['./selectbutton.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtSelectButton), multi: true }],
})
export class WtSelectButton implements ControlValueAccessor {
  @Input() options: readonly unknown[] | null | undefined = [];
  @Input() optionLabel?: string;
  @Input() optionValue?: string;
  @Input() optionDisabled?: string;
  /** Compare object values by this property instead of identity. */
  @Input() dataKey?: string;
  @Input() ariaLabelledBy?: string;
  @Input() set multiple(v: unknown) { this._multiple = ɵtoBool(v); }
  get multiple(): boolean { return this._multiple; }
  /** Clicking the chosen option again clears it. Default true. */
  @Input() set allowEmpty(v: unknown) { this._allowEmpty = v === undefined || ɵtoBool(v); }
  get allowEmpty(): boolean { return this._allowEmpty; }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  /** `small` or `large` (also `sm` / `lg`). */
  @Input() size?: WtSize;
  @HostBinding('class.wt-selectbutton-sm') @HostBinding('class.p-selectbutton-sm') get sizeSm(): boolean {
    return this.sizeKey === 'sm';
  }
  @HostBinding('class.wt-selectbutton-lg') @HostBinding('class.p-selectbutton-lg') get sizeLg(): boolean {
    return this.sizeKey === 'lg';
  }
  get sizeKey(): 'sm' | 'lg' | null {
    return ɵsize(this.size);
  }
  get invalid(): boolean { return this._invalid; }

  @Output() readonly onChange = new EventEmitter<WtSelectButtonChangeEvent>();
  @Output() readonly onOptionClick = new EventEmitter<WtSelectButtonOptionClickEvent>();

  private _multiple = false;
  private _allowEmpty = true;
  private _disabled = false;
  private _invalid = false;
  private model: unknown = null;
  private formDisabled = false;
  private readonly cdr = inject(ChangeDetectorRef);
  private onModelChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  get isDisabled(): boolean {
    return this._disabled || this.formDisabled;
  }
  get classes(): string {
    return 'wt-selectbutton p-selectbutton p-buttonset p-component' + (this._invalid ? ' wt-invalid' : '');
  }

  labelOf(option: unknown): string {
    return ɵoptionLabel(option, this.optionLabel);
  }
  isOptionDisabled(option: unknown): boolean {
    return ɵoptionDisabled(option, this.optionDisabled);
  }
  isSelected(option: unknown): boolean {
    const value = ɵoptionValue(option, this.optionValue);
    if (this._multiple) return Array.isArray(this.model) && this.model.some((v) => ɵsameValue(v, value, this.dataKey));
    return ɵsameValue(this.model, value, this.dataKey);
  }
  /** Our classes plus the classic-era names: `p-button`, with `p-highlight` on the chosen ones. */
  optionClasses(option: unknown): string {
    return this.isSelected(option)
      ? 'wt-selectbutton-option wt-selectbutton-option-checked p-button p-component p-highlight'
      : 'wt-selectbutton-option p-button p-component';
  }

  select(option: unknown, index: number, event: Event): void {
    if (this.isDisabled || this.isOptionDisabled(option)) return;
    const value = ɵoptionValue(option, this.optionValue);
    const selected = this.isSelected(option);
    let next: unknown;
    if (this._multiple) {
      const current = Array.isArray(this.model) ? (this.model as unknown[]) : [];
      if (selected && !this._allowEmpty && current.length === 1) return;
      next = selected ? current.filter((v) => !ɵsameValue(v, value, this.dataKey)) : [...current, value];
    } else {
      if (selected && !this._allowEmpty) return;
      next = selected ? null : value;
    }
    this.model = next;
    this.onModelChange(next);
    this.onOptionClick.emit({ option, index, originalEvent: event });
    this.onChange.emit({ value: next, originalEvent: event });
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
