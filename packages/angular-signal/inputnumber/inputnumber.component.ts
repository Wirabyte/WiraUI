import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  forwardRef,
  inject,
  input,
  numberAttribute,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵassertSupportedAngular, ɵsize, ɵuniqueId, ɵWU_SKIP_VERSION_CHECK, WuConfig, WuSize, ɵWuStyleLoader } from '@wirabyte/ui/config';
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
} from '@wirabyte/ui/core';
import { ɵWU_INPUTTEXT_CSS } from '@wirabyte/ui/inputtext';
import { WuInputNumberButtonLayout, WuInputNumberInputEvent, WuInputNumberMode } from './inputnumber.types';

const optionalNumber = (v: unknown) => (v === null || v === undefined || v === '' ? null : numberAttribute(v));

/**
 * Number field: `<wu-inputnumber [(ngModel)]="price" mode="currency" [min]="0" showButtons>`.
 * Shows the formatted value (`฿1,234.50`) while idle and plain digits while typing; the model is a number or null.
 * ArrowUp/ArrowDown step the value; phones get the numeric keypad.
 */
@Component({
  selector: 'wu-inputnumber, wu-inputNumber, wu-input-number',
  standalone: true,
  templateUrl: './inputnumber.component.html',
  styleUrl: './inputnumber.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuInputNumber), multi: true }],
  host: {
    '[class.wu-inputnumber-sm]': "sizeKey() === 'sm'",
    '[class.p-inputnumber-sm]': "sizeKey() === 'sm'",
    '[class.wu-inputnumber-lg]': "sizeKey() === 'lg'",
    '[class.p-inputnumber-lg]': "sizeKey() === 'lg'",
    '[class.wu-inputnumber-fluid]': 'fluid()',
    '[class.wu-filled]': 'value() !== null',
    '[class.p-inputwrapper-filled]': 'value() !== null',
  },
})
export class WuInputNumber implements ControlValueAccessor {
  readonly mode = input<WuInputNumberMode>('decimal');
  /** ISO 4217 code for currency mode. Default THB. */
  readonly currency = input('THB');
  /** BCP 47 locale. Default: th-TH, or en-US when the app's locale is English. */
  readonly locale = input<string>();
  readonly minFractionDigits = input<number | null, unknown>(null, { transform: optionalNumber });
  readonly maxFractionDigits = input<number | null, unknown>(null, { transform: optionalNumber });
  readonly useGrouping = input(true, { transform: booleanAttribute });
  readonly min = input<number | null, unknown>(null, { transform: optionalNumber });
  readonly max = input<number | null, unknown>(null, { transform: optionalNumber });
  readonly step = input(1, { transform: numberAttribute });
  readonly showButtons = input(false, { transform: booleanAttribute });
  readonly buttonLayout = input<WuInputNumberButtonLayout>('stacked');
  readonly prefix = input<string>();
  readonly suffix = input<string>();
  readonly placeholder = input<string>();
  readonly inputId = input<string>();
  readonly name = input<string>();
  readonly ariaLabel = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  /** `small` or `large` (also `sm` / `lg`). */
  readonly size = input<WuSize>();
  readonly sizeKey = computed(() => ɵsize(this.size()));
  readonly fluid = input(false, { transform: booleanAttribute });

  /** Classes and styles of the text field inside, as before. */
  readonly inputStyleClass = input<string | null | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly inputStyle = input<Record<string, any> | null | undefined>();
  /** Classic button classes and icon classes for the step buttons (`pi pi-plus`). */
  readonly incrementButtonClass = input<string | null | undefined>();
  readonly decrementButtonClass = input<string | null | undefined>();
  readonly incrementButtonIcon = input<string | null | undefined>();
  readonly decrementButtonIcon = input<string | null | undefined>();
  readonly autocomplete = input<string | null | undefined>();
  /** An × inside the field that empties it. */
  readonly showClear = input(false, { transform: booleanAttribute });
  readonly onKeyDown = output<KeyboardEvent>();
  readonly onClear = output<void>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly inputStyleObject = computed(() => (this.inputStyle() && typeof this.inputStyle() === 'object' ? (this.inputStyle() as Record<string, any>) : null));
  readonly showClearButton = computed(() => this.showClear() && this.value() !== null && !this.isDisabled() && !this.readonly());
  private readonly wuConfig = inject(WuConfig);
  readonly onInput = output<WuInputNumberInputEvent>();
  readonly onFocus = output<FocusEvent>();
  readonly onBlur = output<FocusEvent>();

  private readonly config = inject(WuConfig);
  /** Bumped by `WuConfig.setTranslation()`; read by the computeds that show UI strings. */
  private readonly language = signal(0);
  private readonly autoId = ɵuniqueId('wu-inputnumber');
  readonly value = signal<number | null>(null);
  private readonly editing = signal(false);
  private readonly draft = signal('');
  private readonly formDisabled = signal(false);
  private repeat: ReturnType<typeof setTimeout> | null = null;
  private onModelChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  readonly id = computed(() => this.inputId() || this.autoId);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly options = computed<NumberFormatOptions>(() => {
    this.language();
    return {
      locale: this.locale() || (this.config.translation.code === 'en' ? 'en-US' : 'th-TH'),
      mode: this.mode(),
      currency: this.currency(),
      minFractionDigits: this.minFractionDigits() ?? undefined,
      maxFractionDigits: this.maxFractionDigits() ?? undefined,
      useGrouping: this.useGrouping(),
      prefix: this.prefix(),
      suffix: this.suffix(),
    };
  });
  readonly maxDigits = computed(() => fractionDigits(this.options()).max);
  readonly display = computed(() => (this.editing() ? this.draft() : formatNumber(this.value(), this.options())));
  readonly atMin = computed(() => this.min() !== null && this.value() !== null && (this.value() as number) <= (this.min() as number));
  readonly atMax = computed(() => this.max() !== null && this.value() !== null && (this.value() as number) >= (this.max() as number));
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
    const c = ['wu-inputnumber', 'p-inputnumber', 'p-component', 'p-inputwrapper'];
    if (this.showButtons()) {
      c.push('wu-inputnumber-' + this.buttonLayout(), 'p-inputnumber-' + this.buttonLayout());
    }
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    // computed() caches, so language changes have to reach it through a signal.
    const i18n = this.config.translationChange.subscribe(() => this.language.update((n) => n + 1));
    inject(DestroyRef).onDestroy(() => i18n.unsubscribe());
    inject(ɵWuStyleLoader).load('inputtext', ɵWU_INPUTTEXT_CSS);
    inject(DestroyRef).onDestroy(() => this.stopRepeat());
  }

  focus(event: FocusEvent): void {
    // Keep the text as it is on focus: changing it here would drop the selection that Tab, a click,
    // autofill or a test runner's fill() just made. Typing is parsed leniently (฿ and commas are ignored)
    // and the field is reformatted on blur.
    this.draft.set((event.target as HTMLInputElement).value);
    this.editing.set(true);
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
    if (!acceptsNumberInput(el.value, start, el.selectionEnd ?? start, event.data, this.rules())) event.preventDefault();
  }

  /** What may be typed: see acceptsNumberText(). */
  readonly rules = computed<NumberTypingRules>(() => {
    const o = this.options();
    return { min: this.min(), max: this.max(), maxFractionDigits: this.maxDigits(), prefix: o.prefix, suffix: o.suffix, decimal: decimalSeparator(o.locale) };
  });

  typed(event: Event): void {
    const el = event.target as HTMLInputElement;
    const e = event as InputEvent;
    const bulk = e.inputType === 'insertFromPaste' || e.inputType === 'insertFromDrop' || e.inputType === 'insertReplacementText' || (e.data?.length ?? 0) > 1;
    if (bulk) {
      // Pasted text may carry formatting (฿1,234.50): read it as a number and keep what fits.
      const pasted = clampNumber(parseNumber(el.value, this.options()), { max: this.max(), maxFractionDigits: this.maxDigits() });
      el.value = pasted === null ? this.draft() : editableNumber(pasted, this.maxDigits());
    } else if (!acceptsNumberText(el.value, this.rules())) {
      // Some phone keyboards cannot be stopped beforehand: put back what was there.
      const caret = Math.max(0, (el.selectionStart ?? 0) - (el.value.length - this.draft().length));
      el.value = this.draft();
      el.setSelectionRange(caret, caret);
      return;
    }
    const text = el.value;
    this.draft.set(text);
    const n = parseNumber(text, this.options());
    this.value.set(n);
    this.onModelChange(n);
    this.onInput.emit({ value: n, originalEvent: event });
  }

  blur(event: FocusEvent): void {
    this.editing.set(false);
    const v = clampNumber(this.value(), { min: this.min(), max: this.max(), maxFractionDigits: this.maxDigits() });
    if (v !== this.value()) {
      this.value.set(v);
      this.onModelChange(v);
    }
    this.onTouched();
    this.onBlur.emit(event);
  }

  clearLabel(): string {
    return this.wuConfig.translation.clear;
  }

  /** Empties the field (the × of `showClear`). */
  clear(): void {
    this.value.set(null);
    if (this.editing()) this.draft.set('');
    this.onModelChange(null);
    this.onClear.emit();
  }

  keydown(event: KeyboardEvent): void {
    this.onKeyDown.emit(event);
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.spin(event.key === 'ArrowUp' ? 1 : -1);
    }
  }

  spin(direction: 1 | -1): void {
    if (this.isDisabled() || this.readonly()) return;
    const next = stepNumber(this.value(), this.step(), direction, { min: this.min(), max: this.max() });
    this.value.set(next);
    if (this.editing()) this.draft.set(formatNumber(next, this.options()));
    this.onModelChange(next);
  }

  /** Press and hold a step button to keep stepping. */
  startRepeat(event: PointerEvent, direction: 1 | -1): void {
    event.preventDefault();
    this.stopRepeat();
    this.spin(direction);
    const again = (delay: number) => {
      this.repeat = setTimeout(() => {
        // A button that hits the limit becomes disabled and may never see pointerup.
        if (direction > 0 ? this.atMax() : this.atMin()) return this.stopRepeat();
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
    this.value.set(n === null || isNaN(n) ? null : n);
    if (this.editing()) this.draft.set(formatNumber(this.value(), this.options()));
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
