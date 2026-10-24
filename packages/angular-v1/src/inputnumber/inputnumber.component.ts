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
import {
  ɵassertSupportedAngular,
  ɵrefreshOnTranslation,
  ɵsize,
  ɵtoBool,
  ɵuniqueId,
  ɵWT_SKIP_VERSION_CHECK,
  WtConfig,
  WtSize,
  ɵWtStyleLoader,
} from 'wiratheme/config';
import {
  acceptsNumberInput,
  acceptsNumberText,
  clampNumber,
  decimalSeparator,
  editableNumber,
  formatNumber,
  fractionDigits,
  NumberFormatOptions,
  NumberTypingRules,
  parseNumber,
  stepNumber,
} from 'wiratheme/core';
import { ɵWT_INPUTTEXT_CSS } from 'wiratheme/inputtext';
import { WtInputNumberButtonLayout, WtInputNumberInputEvent, WtInputNumberMode } from './inputnumber.types';

const optionalNumber = (v: unknown): number | null => (v === null || v === undefined || v === '' || isNaN(Number(v)) ? null : Number(v));

/**
 * Number field: `<wt-inputnumber [(ngModel)]="price" mode="currency" [min]="0" showButtons>`.
 * Shows the formatted value (`฿1,234.50`) while idle and plain digits while typing; the model is a number or null.
 * ArrowUp/ArrowDown step the value; phones get the numeric keypad.
 */
@Component({
  selector: 'wt-inputnumber',
  standalone: true,
  imports: [NgIf],
  templateUrl: './inputnumber.component.html',
  styleUrls: ['./inputnumber.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtInputNumber), multi: true }],
})
export class WtInputNumber implements ControlValueAccessor, OnDestroy {
  @Input() mode: WtInputNumberMode = 'decimal';
  /** ISO 4217 code for currency mode. Default THB. */
  @Input() currency = 'THB';
  /** BCP 47 locale. Default: th-TH, or en-US when the app's locale is English. */
  @Input() locale?: string;
  @Input() set minFractionDigits(v: unknown) { this._minFD = optionalNumber(v); }
  @Input() set maxFractionDigits(v: unknown) { this._maxFD = optionalNumber(v); }
  @Input() set useGrouping(v: unknown) { this._useGrouping = v === undefined || ɵtoBool(v); }
  @Input() set min(v: unknown) { this._min = optionalNumber(v); }
  get min(): number | null { return this._min; }
  @Input() set max(v: unknown) { this._max = optionalNumber(v); }
  get max(): number | null { return this._max; }
  @Input() set step(v: unknown) { this._step = optionalNumber(v) ?? 1; }
  @Input() set showButtons(v: unknown) { this._showButtons = ɵtoBool(v); }
  get showButtons(): boolean { return this._showButtons; }
  @Input() buttonLayout: WtInputNumberButtonLayout = 'stacked';
  @Input() prefix?: string;
  @Input() suffix?: string;
  @Input() placeholder?: string;
  @Input() inputId?: string;
  @Input() name?: string;
  @Input() ariaLabel?: string;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  @Input() set readonly(v: unknown) { this._readonly = ɵtoBool(v); }
  get readonly(): boolean { return this._readonly; }
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  /** `small` or `large` (also `sm` / `lg`). */
  @Input() size?: WtSize;
  @HostBinding('class.wt-inputnumber-sm') @HostBinding('class.p-inputnumber-sm') get sizeSm(): boolean {
    return this.sizeKey === 'sm';
  }
  @HostBinding('class.wt-inputnumber-lg') @HostBinding('class.p-inputnumber-lg') get sizeLg(): boolean {
    return this.sizeKey === 'lg';
  }
  get sizeKey(): 'sm' | 'lg' | null {
    return ɵsize(this.size);
  }
  get invalid(): boolean { return this._invalid; }
  @Input() set fluid(v: unknown) { this._fluid = ɵtoBool(v); }

  @Output() readonly onInput = new EventEmitter<WtInputNumberInputEvent>();
  @Output() readonly onFocus = new EventEmitter<FocusEvent>();
  @Output() readonly onBlur = new EventEmitter<FocusEvent>();

  @HostBinding('class.wt-inputnumber-fluid') get fluidClass(): boolean {
    return this._fluid;
  }
  @HostBinding('class.wt-filled') @HostBinding('class.p-inputwrapper-filled') get filled(): boolean {
    return this.value !== null;
  }

  value: number | null = null;
  private editing = false;
  private draft = '';
  private _minFD: number | null = null;
  private _maxFD: number | null = null;
  private _useGrouping = true;
  private _min: number | null = null;
  private _max: number | null = null;
  private _step = 1;
  private _showButtons = false;
  private _disabled = false;
  private _readonly = false;
  private _invalid = false;
  private _fluid = false;
  private formDisabled = false;
  private repeat: ReturnType<typeof setTimeout> | null = null;
  private readonly autoId = ɵuniqueId('wt-inputnumber');
  private readonly config = inject(WtConfig);
  private readonly i18n = ɵrefreshOnTranslation();
  private readonly cdr = inject(ChangeDetectorRef);
  private onModelChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWtStyleLoader).load('inputtext', ɵWT_INPUTTEXT_CSS);
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    this.stopRepeat();
  }

  get id(): string {
    return this.inputId || this.autoId;
  }
  get isDisabled(): boolean {
    return this._disabled || this.formDisabled;
  }
  get options(): NumberFormatOptions {
    return {
      locale: this.locale || (this.config.translation.code === 'en' ? 'en-US' : 'th-TH'),
      mode: this.mode,
      currency: this.currency,
      minFractionDigits: this._minFD ?? undefined,
      maxFractionDigits: this._maxFD ?? undefined,
      useGrouping: this._useGrouping,
      prefix: this.prefix,
      suffix: this.suffix,
    };
  }
  get maxDigits(): number {
    return fractionDigits(this.options).max;
  }
  get display(): string {
    return this.editing ? this.draft : formatNumber(this.value, this.options);
  }
  get atMin(): boolean {
    return this._min !== null && this.value !== null && this.value <= this._min;
  }
  get atMax(): boolean {
    return this._max !== null && this.value !== null && this.value >= this._max;
  }
  /** Our classes plus the classic-era names (`p-inputnumber-buttons-stacked`). */
  get classes(): string {
    const c = ['wt-inputnumber', 'p-inputnumber', 'p-component'];
    if (this._showButtons) c.push('wt-inputnumber-' + this.buttonLayout, 'p-inputnumber-buttons-' + this.buttonLayout);
    return c.join(' ');
  }

  focus(event: FocusEvent): void {
    // Keep the text as it is on focus: changing it here would drop the selection that Tab, a click,
    // autofill or a test runner's fill() just made. Typing is parsed leniently (฿ and commas are ignored)
    // and the field is reformatted on blur.
    this.draft = (event.target as HTMLInputElement).value;
    this.editing = true;
    this.onFocus.emit(event);
  }

  /**
   * Stops a keystroke the number cannot take: letters, a second decimal mark, a fraction digit too many,
   * a minus when min is 0 or more, or a value past max. Text arriving in one go (paste, autofill) is read leniently in typed().
   */
  guard(event: InputEvent): void {
    if (!event.data || event.data.length > 1 || event.inputType !== 'insertText') return;
    const el = event.target as HTMLInputElement;
    const start = el.selectionStart ?? el.value.length;
    if (!acceptsNumberInput(el.value, start, el.selectionEnd ?? start, event.data, this.rules)) event.preventDefault();
  }

  /** What may be typed: see acceptsNumberText(). */
  get rules(): NumberTypingRules {
    const o = this.options;
    return { min: this._min, max: this._max, maxFractionDigits: this.maxDigits, prefix: o.prefix, suffix: o.suffix, decimal: decimalSeparator(o.locale) };
  }

  typed(event: Event): void {
    const el = event.target as HTMLInputElement;
    const e = event as InputEvent;
    const bulk = e.inputType === 'insertFromPaste' || e.inputType === 'insertFromDrop' || e.inputType === 'insertReplacementText' || (e.data?.length ?? 0) > 1;
    if (bulk) {
      // Pasted text may carry formatting (฿1,234.50): read it as a number and keep what fits.
      const n = clampNumber(parseNumber(el.value, this.options), { max: this._max, maxFractionDigits: this.maxDigits });
      el.value = n === null ? this.draft : editableNumber(n, this.maxDigits);
    } else if (!acceptsNumberText(el.value, this.rules)) {
      // Some phone keyboards cannot be stopped beforehand: put back what was there.
      const caret = Math.max(0, (el.selectionStart ?? 0) - (el.value.length - this.draft.length));
      el.value = this.draft;
      el.setSelectionRange(caret, caret);
      return;
    }
    this.draft = el.value;
    this.value = parseNumber(this.draft, this.options);
    this.onModelChange(this.value);
    this.onInput.emit({ value: this.value, originalEvent: event });
  }

  blur(event: FocusEvent): void {
    this.editing = false;
    const v = clampNumber(this.value, { min: this._min, max: this._max, maxFractionDigits: this.maxDigits });
    if (v !== this.value) {
      this.value = v;
      this.onModelChange(v);
    }
    this.onTouched();
    this.onBlur.emit(event);
  }

  keydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.spin(event.key === 'ArrowUp' ? 1 : -1);
    }
  }

  spin(direction: 1 | -1): void {
    if (this.isDisabled || this._readonly) return;
    this.value = stepNumber(this.value, this._step, direction, { min: this._min, max: this._max });
    if (this.editing) this.draft = formatNumber(this.value, this.options);
    this.onModelChange(this.value);
    this.cdr.markForCheck();
  }

  /** Press and hold a step button to keep stepping. */
  startRepeat(event: PointerEvent, direction: 1 | -1): void {
    event.preventDefault();
    this.stopRepeat();
    this.spin(direction);
    const again = (delay: number) => {
      this.repeat = setTimeout(() => {
        // A button that hits the limit becomes disabled and may never see pointerup.
        if (direction > 0 ? this.atMax : this.atMin) return this.stopRepeat();
        this.spin(direction);
        again(60);
      }, delay);
    };
    again(400);
  }

  stopRepeat(): void {
    if (this.repeat) clearTimeout(this.repeat);
    this.repeat = null;
  }

  writeValue(value: unknown): void {
    const n = value === null || value === undefined || value === '' ? null : Number(value);
    this.value = n === null || isNaN(n) ? null : n;
    if (this.editing) this.draft = formatNumber(this.value, this.options);
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
