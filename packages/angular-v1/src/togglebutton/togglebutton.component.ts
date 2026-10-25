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
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵsize, ɵtoBool, ɵWT_SKIP_VERSION_CHECK, WtConfig, WtSize } from 'wiratheme/config';
import { WtToggleButtonChangeEvent } from './togglebutton.types';

/** On/off button for a boolean in ngModel or reactive forms: `<wt-togglebutton [(ngModel)]="bold" onLabel="ตัวหนา" offLabel="ปกติ">`. */
@Component({
  selector: 'wt-togglebutton, wt-toggleButton, wt-toggle-button',
  standalone: true,
  imports: [NgIf],
  templateUrl: './togglebutton.component.html',
  styleUrls: ['./togglebutton.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtToggleButton), multi: true }],
})
export class WtToggleButton implements ControlValueAccessor, OnDestroy {
  /** Label when on / off. Default: the locale's yes / no. Pass '' for an icon-only button. */
  @Input() onLabel?: string;
  @Input() offLabel?: string;
  @Input() onIcon?: string;
  @Input() offIcon?: string;
  @Input() iconPos: 'left' | 'right' = 'left';
  @Input() inputId?: string;
  @Input() ariaLabel?: string;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  /** `small` or `large` (also `sm` / `lg`). */
  @Input() size?: WtSize;
  @HostBinding('class.wt-togglebutton-sm') @HostBinding('class.p-togglebutton-sm') get sizeSm(): boolean {
    return this.sizeKey === 'sm';
  }
  @HostBinding('class.wt-togglebutton-lg') @HostBinding('class.p-togglebutton-lg') get sizeLg(): boolean {
    return this.sizeKey === 'lg';
  }
  get sizeKey(): 'sm' | 'lg' | null {
    return ɵsize(this.size);
  }
  get invalid(): boolean { return this._invalid; }

  @Output() readonly onChange = new EventEmitter<WtToggleButtonChangeEvent>();

  checked = false;
  private _disabled = false;
  private _invalid = false;
  private formDisabled = false;
  private readonly config = inject(WtConfig);
  private readonly i18n = ɵrefreshOnTranslation();
  private readonly cdr = inject(ChangeDetectorRef);
  private onModelChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  get isDisabled(): boolean {
    return this._disabled || this.formDisabled;
  }
  get label(): string {
    return this.checked ? this.onLabel ?? this.config.translation.yes : this.offLabel ?? this.config.translation.no;
  }
  get icon(): string | undefined {
    return this.checked ? this.onIcon : this.offIcon;
  }
  /** Our classes plus the classic-era names: a `p-button` that gets `p-highlight` when on. */
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
    const c = ['wt-togglebutton', 'p-button', 'p-togglebutton', 'p-component'];
    if (this.checked) c.push('wt-togglebutton-checked', 'p-highlight');
    if (this._invalid) c.push('wt-invalid');
    return c.join(' ');
  }

  toggle(event: Event): void {
    if (this.isDisabled) return;
    this.checked = !this.checked;
    this.onModelChange(this.checked);
    this.onChange.emit({ checked: this.checked, originalEvent: event });
  }

  writeValue(value: unknown): void {
    this.checked = !!value;
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (value: boolean) => void): void {
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
