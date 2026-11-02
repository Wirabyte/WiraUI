import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵrefreshOnTranslation,
  ɵsize,
  ɵtoBool,
  ɵWU_SKIP_VERSION_CHECK,
  WuConfig,
  WuTemplate,
} from 'wiraui/config';
import { otpAccepts, otpCleanPaste, otpFill, otpTokens, otpValue, WuLocale } from 'wiraui/core';
import { WuInputText } from 'wiraui/inputtext';
import { WuInputOtpChangeEvent, WuInputOtpInputTemplateContext, WuInputOtpTemplateEvents } from './inputotp.types';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * One box per character of a one-time code: `<wu-inputOtp [(ngModel)]="code" [length]="6" [integerOnly]="true">`.
 * Typing moves to the next box, Backspace clears and goes back, ← / → (Home / End) move, and pasting (or the phone's
 * SMS code suggestion) fills every box at once. `mask` hides the characters. The value is the characters joined
 * (`'123456'`). Works with ngModel and reactive forms; a custom field goes in `<ng-template wuTemplate="input" let-token
 * let-events="events" let-index="index">`.
 */
@Component({
  selector: 'wu-inputOtp, wu-inputotp, wu-input-otp',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, WuInputText],
  templateUrl: './inputotp.component.html',
  styleUrls: ['./inputotp.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuInputOtp), multi: true }],
  host: { class: 'wu-inputotp-host' },
})
export class WuInputOtp implements ControlValueAccessor, AfterViewInit, OnDestroy {
  /** Number of boxes. Default 4. */
  @Input() set length(v: unknown) {
    const n = Math.floor(Number(v));
    this._length = Number.isFinite(n) && n >= 1 ? Math.min(n, 64) : 4;
    this.indexes = Array.from({ length: this._length }, (_, i) => i);
    this.contexts = [];
  }
  get length(): number { return this._length; }
  /** Hide the characters (a password field per box). */
  @Input() set mask(v: unknown) { this._mask = ɵtoBool(v); }
  get mask(): boolean { return this._mask; }
  /** Digits only: other keys are ignored and phones show the number pad. */
  @Input() set integerOnly(v: unknown) { this._integerOnly = ɵtoBool(v); }
  get integerOnly(): boolean { return this._integerOnly; }
  @Input() set readonly(v: unknown) { this._readonly = ɵtoBool(v); }
  get readonly(): boolean { return this._readonly; }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled || this.formDisabled; }
  /** Focus the first box when it appears. */
  @Input() set autofocus(v: unknown) { this._autofocus = ɵtoBool(v); }
  get autofocus(): boolean { return this._autofocus; }
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  get invalid(): boolean { return this._invalid; }
  @Input() set required(v: unknown) { this._required = ɵtoBool(v); }
  get required(): boolean { return this._required; }
  @Input() tabindex: number | string | null = null;
  @Input() variant?: 'outlined' | 'filled' | null;
  /** `'small'` or `'large'` (also `'sm'` / `'lg'`). */
  @Input() size?: 'small' | 'large' | 'sm' | 'lg' | null;
  /** Classes for every box, as before. */
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  @Input() name?: string | null;
  /** Label of the group of boxes. Default: the locale's "one-time code". */
  @Input() ariaLabel?: string | null;
  @Input() ariaLabelledBy?: string | null;

  @Output() readonly onChange = new EventEmitter<WuInputOtpChangeEvent>();
  @Output() readonly onFocus = new EventEmitter<Event>();
  @Output() readonly onBlur = new EventEmitter<Event>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('input', { descendants: false }) protected inputRef?: unknown;

  /** What each box holds. */
  tokens: string[] = [];
  indexes: number[] = [0, 1, 2, 3];
  private contexts: WuInputOtpInputTemplateContext[] = [];
  private _length = 4;
  private _mask = false;
  private _integerOnly = false;
  private _readonly = false;
  private _disabled = false;
  private _autofocus = false;
  private _invalid = false;
  private _required = false;
  private formDisabled = false;
  private onModel: (v: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngAfterViewInit(): void {
    if (this._autofocus && !this.disabled) this.boxes()[0]?.focus();
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  // ---------- what the template reads ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get inputTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.inputRef) || ɵfindTemplate(this.templates, 'input');
  }
  get inputSize(): 'small' | 'large' | undefined {
    const s = ɵsize(this.size);
    return s === 'sm' ? 'small' : s === 'lg' ? 'large' : undefined;
  }
  get inputVariant(): 'outlined' | 'filled' {
    return this.variant === 'filled' ? 'filled' : 'outlined';
  }
  get groupLabel(): string | null {
    return this.ariaLabelledBy ? null : this.ariaLabel || this.t.oneTimeCode;
  }
  charLabel(i: number): string {
    return this.t.otpCharacter.replace('{0}', String(i + 1)).replace('{1}', String(this._length));
  }
  trackIndex(i: number): number {
    return i;
  }
  /** The `input` template's context for box `i`; one object per box, so the field is not drawn again on each check. */
  contextOf(i: number): WuInputOtpInputTemplateContext {
    let c = this.contexts[i];
    if (!c) {
      const events: WuInputOtpTemplateEvents = {
        input: (e) => this.onInput(e, i),
        keydown: (e) => this.onKeydown(e as KeyboardEvent, i),
        focus: (e) => this.onInputFocus(e),
        blur: (e) => this.onInputBlur(e),
        paste: (e) => this.onPaste(e as ClipboardEvent, i),
      };
      c = this.contexts[i] = { $implicit: '', events, index: i + 1 };
    }
    c.$implicit = this.tokens[i] || '';
    return c;
  }

  // ---------- typing ----------

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (this.disabled || this._readonly) return;
    const chars = Array.from(input.value || '');
    if (chars.length > 1) {
      // The phone's code suggestion or an input method put several characters in one box: spread them out.
      const clean = otpCleanPaste(input.value, this._integerOnly);
      if (clean) this.fill(clean, index, event);
      else input.value = this.tokens[index] || '';
      return;
    }
    const ch = chars[0] || '';
    if (ch && !otpAccepts(ch, this._integerOnly)) {
      input.value = this.tokens[index] || '';
      return;
    }
    this.setToken(index, ch, event);
    if ((event as InputEvent).inputType === 'deleteContentBackward') this.focusBox(index - 1);
    else if (ch) this.focusBox(index + 1);
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;
    const input = event.target as HTMLInputElement;
    const rtl = this.rtl();
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.focusBox(rtl ? index + 1 : index - 1);
        return;
      case 'ArrowRight':
        event.preventDefault();
        this.focusBox(rtl ? index - 1 : index + 1);
        return;
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        return;
      case 'Home':
        event.preventDefault();
        this.focusBox(0);
        return;
      case 'End':
        event.preventDefault();
        this.focusBox(this._length - 1);
        return;
      case 'Backspace':
        event.preventDefault();
        // A read-only box is not editable, so some browsers (WebKit) would take Backspace as "go back a page".
        if (this.locked) return;
        if (this.tokens[index]) {
          input.value = '';
          this.setToken(index, '', event);
        }
        this.focusBox(index - 1);
        return;
      case 'Delete':
        if (this.locked) return;
        event.preventDefault();
        if (this.tokens[index]) {
          input.value = '';
          this.setToken(index, '', event);
        }
        return;
      default:
        break;
    }
    // A printable key replaces what the box holds, even with the caret after it; phones that send no key value
    // (Unidentified) go through onInput instead.
    if (Array.from(event.key).length !== 1) return;
    if (this.locked) return;
    event.preventDefault();
    if (!otpAccepts(event.key, this._integerOnly)) return;
    input.value = event.key;
    this.setToken(index, event.key, event);
    this.focusBox(index + 1);
  }

  onPaste(event: ClipboardEvent, index: number): void {
    if (this.locked) return;
    event.preventDefault();
    const clean = otpCleanPaste(event.clipboardData?.getData('text') ?? '', this._integerOnly);
    if (clean) this.fill(clean, index, event);
  }

  onInputFocus(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    input?.select?.();
    this.onFocus.emit(event);
  }

  onInputBlur(event: Event): void {
    this.onBlur.emit(event);
  }

  /** Leaving the whole group (not moving between boxes) marks the control touched. */
  focusout(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && this.host.contains(next)) return;
    this.onTouched();
  }

  // ---------- forms ----------

  writeValue(v: unknown): void {
    this.tokens = otpTokens(v, this._length);
    this.syncBoxes();
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (v: unknown) => void): void {
    this.onModel = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled = disabled;
    this.cdr.markForCheck();
  }

  // ---------- internals ----------

  get locked(): boolean {
    return this.disabled || this._readonly;
  }

  private boxes(): HTMLInputElement[] {
    return Array.from(this.host.querySelectorAll<HTMLInputElement>('input'));
  }

  private focusBox(i: number): void {
    if (i < 0 || i >= this._length) return;
    const box = this.boxes()[i];
    if (!box) return;
    box.focus();
    box.select?.();
  }

  private setToken(index: number, ch: string, event: Event): void {
    const next = Array.from({ length: this._length }, (_, i) => this.tokens[i] || '');
    next[index] = ch;
    this.tokens = next;
    this.update(event);
  }

  private fill(chars: string[], index: number, event: Event): void {
    const r = otpFill(this.tokens, index, chars, this._length);
    this.tokens = r.tokens;
    this.syncBoxes();
    this.update(event);
    this.focusBox(r.focus);
  }

  private update(event: Event): void {
    const value = otpValue(this.tokens, this._length);
    this.onModel(value);
    this.onChange.emit({ originalEvent: event, value });
    this.cdr.markForCheck();
  }

  /** The default boxes show the tokens even when a key was refused (the binding alone would not redraw them). */
  private syncBoxes(): void {
    if (this.inputTemplate) return;
    this.boxes().forEach((box, i) => {
      const want = this.tokens[i] || '';
      if (box.value !== want) box.value = want;
    });
  }

  private rtl(): boolean {
    return this.host.closest('[dir]')?.getAttribute('dir') === 'rtl';
  }
}
