import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import {
  ɵassertSupportedAngular,
  ɵrefreshOnTranslation,
  ɵsize,
  ɵtoBool,
  ɵuniqueId,
  ɵWU_SKIP_VERSION_CHECK,
  WuConfig,
  ɵWuStyleLoader,
} from '@wirabyte/ui/config';
import {
  caretAfter,
  fillMask,
  formatMask,
  MaskBuffer,
  maskComplete,
  maskEmpty,
  MaskSlot,
  parseMask,
  typedBefore,
  unmaskedValue,
  WuLocale,
} from '@wirabyte/ui/core';
import { ɵWU_INPUTTEXT_CSS } from '@wirabyte/ui/inputtext';

/**
 * What wu-inputmask does, shared by the v1 and v2/v3 templates. A text field that types the literals of a mask for the
 * user (`mask="9-9999-99999-99-9"` for a Thai ID). The field shows `_` for empty slots while it has focus; on blur an
 * incomplete value is cleared (`autoClear`, default true). The model gets the formatted text, or only the typed
 * characters with `[unmask]="true"`. Thai digits count as 0–9, and digit-only masks bring up the number keypad.
 */
@Directive()
export abstract class ɵWuInputMaskBase implements ControlValueAccessor, OnDestroy {
  /** `9` digit, `a` letter, `*` letter or digit, `?` starts the optional part; anything else is typed for the user. */
  @Input() set mask(v: string | null | undefined) {
    this._mask = v || '';
    this.reparse();
  }
  get mask(): string {
    return this._mask;
  }
  /** What `a` accepts, as a regular expression class (default `[A-Za-z]`). */
  @Input() set characterPattern(v: string | null | undefined) {
    this._charPattern = v || undefined;
    this.reparse();
  }
  /** Shown in empty slots while the field has focus. Default `_`. */
  @Input() slotChar = '_';
  /** Clear an incomplete value when the field loses focus. Default true. */
  @Input() set autoClear(v: unknown) { this._autoClear = v === undefined || ɵtoBool(v); }
  get autoClear(): boolean { return this._autoClear; }
  /** The model gets only the typed characters (`1103700012345`), not the formatted text. */
  @Input() set unmask(v: unknown) { this._unmask = ɵtoBool(v); }
  get unmask(): boolean { return this._unmask; }
  /** Accepted for templates moving over: the typed characters are always kept while the field has focus. */
  @Input() keepBuffer: unknown;
  @Input() placeholder?: string;
  @Input() type = 'text';
  @Input() name?: string;
  @Input() inputId?: string;
  @Input() styleClass?: string;
  @Input() style?: Record<string, string | number> | null;
  @Input() maxlength?: number | null;
  @Input() tabindex?: number | string;
  @Input() title?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() set ariaRequired(v: unknown) { this._ariaRequired = ɵtoBool(v); }
  get ariaRequired(): boolean { return this._ariaRequired; }
  @Input() set required(v: unknown) { this._required = ɵtoBool(v); }
  get required(): boolean { return this._required; }
  @Input() set readonly(v: unknown) { this._readonly = ɵtoBool(v); }
  get readonly(): boolean { return this._readonly; }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled || this.formDisabled; }
  @Input() autocomplete?: string;
  @Input() set showClear(v: unknown) { this._showClear = ɵtoBool(v); }
  /** `'small'` / `'large'` (or `sm` / `lg`). */
  @Input() size?: string;
  @Input() variant?: 'outlined' | 'filled';
  @Input() set fluid(v: unknown) { this._fluid = ɵtoBool(v); }
  get fluid(): boolean { return this._fluid || /(^|\s)w-full(\s|$)/.test(this.styleClass || ''); }
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  get invalid(): boolean { return this._invalid; }
  @Input() autoFocus: unknown;

  @Output() readonly onComplete = new EventEmitter<Event>();
  @Output() readonly onFocus = new EventEmitter<FocusEvent>();
  @Output() readonly onBlur = new EventEmitter<FocusEvent>();
  @Output() readonly onInput = new EventEmitter<Event>();
  @Output() readonly onKeydown = new EventEmitter<KeyboardEvent>();
  @Output() readonly onClear = new EventEmitter<void>();

  @ViewChild('field', { static: true }) protected inputRef?: ElementRef<HTMLInputElement>;

  readonly baseId = ɵuniqueId('wu-inputmask');
  focused = false;
  /** What the model holds. */
  value: string | null = null;

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();
  private _mask = '';
  private _charPattern?: string;
  private _autoClear = true;
  private _unmask = false;
  private _ariaRequired = false;
  private _required = false;
  private _readonly = false;
  private _disabled = false;
  private _showClear = false;
  private _fluid = false;
  private _invalid = false;
  private formDisabled = false;
  private slots: MaskSlot[] = [];
  private buffer: MaskBuffer = [];
  private onModelChange: (v: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWuStyleLoader).load('inputtext', ɵWU_INPUTTEXT_CSS);
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  // ---------- what the template reads ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  get sizeKey(): 'sm' | 'lg' | null {
    return ɵsize(this.size);
  }
  get filled(): boolean {
    return !maskEmpty(this.buffer);
  }
  get clearable(): boolean {
    return this._showClear && this.filled && !this.disabled && !this._readonly;
  }
  /** Digit-only masks bring up the number keypad on phones. */
  get inputMode(): string | null {
    const typed = this.slots.filter((s) => s.literal === undefined);
    return typed.length && typed.every((s) => s.test?.source === '[0-9]') ? 'numeric' : null;
  }
  /** The placeholder shows only while the field is empty and has no focus (with focus it shows the slots). */
  get placeholderText(): string | null {
    return this.placeholder || null;
  }

  // ---------- events ----------

  focus(event: FocusEvent): void {
    this.focused = true;
    if (!this._readonly && this._mask) {
      this.render();
      // After the browser places the caret for the click: past the first empty slot, it moves back to that slot.
      // Worked out when it runs, so characters typed in the meantime count.
      setTimeout(() => {
        const el = this.inputRef?.nativeElement;
        if (!el || !this.focused || el.selectionStart !== el.selectionEnd) return;
        const caret = caretAfter(this.slots, this.buffer.filter((c) => c !== null).length);
        if ((el.selectionStart ?? 0) > caret) this.setCaret(caret);
      });
    }
    this.onFocus.emit(event);
  }

  blur(event: FocusEvent): void {
    this.focused = false;
    if (this._mask && this._autoClear && this.filled && !maskComplete(this.slots, this.buffer)) {
      this.buffer = this.slots.map(() => null);
      this.updateModel();
    }
    this.render();
    this.onTouched();
    this.onBlur.emit(event);
    this.cdr.markForCheck();
  }

  input(event: Event): void {
    const el = this.inputRef?.nativeElement;
    if (!el) return;
    if (!this._mask) {
      this.setModel(el.value);
      this.onInput.emit(event);
      return;
    }
    const wasComplete = maskComplete(this.slots, this.buffer);
    const typed = typedBefore(this.slots, el.value, el.selectionStart ?? el.value.length);
    this.buffer = fillMask(this.slots, el.value);
    this.render();
    this.setCaret(caretAfter(this.slots, typed));
    this.updateModel();
    this.onInput.emit(event);
    if (!wasComplete && maskComplete(this.slots, this.buffer)) this.onComplete.emit(event);
  }

  /** Backspace and Delete step over the literals the mask types, so they remove a typed character instead. */
  keydown(event: KeyboardEvent): void {
    this.onKeydown.emit(event);
    const el = this.inputRef?.nativeElement;
    if (!el || !this._mask || el.selectionStart !== el.selectionEnd) return;
    let pos = el.selectionStart ?? 0;
    if (event.key === 'Backspace') {
      while (pos > 0 && this.slots[pos - 1]?.literal !== undefined) pos--;
      if (pos !== el.selectionStart) this.setCaret(pos);
    } else if (event.key === 'Delete') {
      while (pos < this.slots.length && this.slots[pos]?.literal !== undefined) pos++;
      if (pos !== el.selectionStart) this.setCaret(pos);
    }
  }

  clear(): void {
    this.buffer = this.slots.map(() => null);
    this.render();
    this.updateModel();
    this.onClear.emit();
    this.inputRef?.nativeElement.focus();
  }

  // ---------- forms ----------

  writeValue(value: unknown): void {
    this.value = value === null || value === undefined ? null : String(value);
    this.buffer = fillMask(this.slots, this.value || '');
    if (!this._mask && this.inputRef) this.inputRef.nativeElement.value = this.value ?? '';
    else this.render();
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (v: unknown) => void): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled = disabled;
    this.cdr.markForCheck();
  }

  // ---------- internals ----------

  private reparse(): void {
    this.slots = parseMask(this._mask, { characterPattern: this._charPattern });
    this.buffer = fillMask(this.slots, this.value || '');
    this.render();
  }

  /** Writes the field's text from the buffer (with slot characters while it has focus). */
  private render(): void {
    const el = this.inputRef?.nativeElement;
    if (!el || !this._mask) return;
    const text = formatMask(this.slots, this.buffer, this.slotChar || '_', this.focused);
    if (el.value !== text) el.value = text;
  }

  private updateModel(): void {
    if (maskEmpty(this.buffer)) return this.setModel('');
    if (this._unmask) return this.setModel(unmaskedValue(this.slots, this.buffer));
    // Like the field itself: the formatted text, with slot characters while it is incomplete.
    const complete = maskComplete(this.slots, this.buffer);
    this.setModel(formatMask(this.slots, this.buffer, this.slotChar || '_', !complete));
  }

  private setModel(v: string): void {
    if (v === this.value) return;
    this.value = v;
    this.onModelChange(v);
    this.cdr.markForCheck();
  }

  private setCaret(pos: number): void {
    const el = this.inputRef?.nativeElement;
    if (!el || this.inputRef?.nativeElement.ownerDocument.activeElement !== el) return;
    try {
      el.setSelectionRange(pos, pos);
    } catch {
      // Some input types (email, number) have no selection API.
    }
  }
}
