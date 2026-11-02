import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  ɵassertSupportedAngular,
  ɵrefreshOnTranslation,
  ɵsize,
  ɵtoBool,
  ɵuniqueId,
  ɵWU_SKIP_VERSION_CHECK,
  WuConfig,
  ɵWuPopup,
  WuSize,
  ɵWuStyleLoader,
} from 'wiraui/config';
import { ɵWU_INPUTTEXT_CSS } from 'wiraui/inputtext';
import { ɵpasswordStrength, WuPasswordStrength } from './password.types';

/**
 * Password field with a show/hide button and a strength meter under it:
 * `<wu-password [(ngModel)]="pw" toggleMask>`; `[feedback]="false"` for login forms.
 */
@Component({
  selector: 'wu-password',
  standalone: true,
  imports: [NgIf],
  templateUrl: './password.component.html',
  styleUrls: ['./password.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuPassword), multi: true }],
})
export class WuPassword implements ControlValueAccessor, OnDestroy {
  @Input() placeholder?: string;
  /** Strength meter while typing. Default true. */
  @Input() set feedback(v: unknown) { this._feedback = v === undefined || ɵtoBool(v); }
  get feedback(): boolean { return this._feedback; }
  @Input() set toggleMask(v: unknown) { this._toggleMask = ɵtoBool(v); }
  get toggleMask(): boolean { return this._toggleMask; }
  @Input() promptLabel?: string;
  @Input() weakLabel?: string;
  @Input() mediumLabel?: string;
  @Input() strongLabel?: string;
  @Input() mediumRegex?: string;
  @Input() strongRegex?: string;
  @Input() inputId?: string;
  @Input() name?: string;
  @Input() autocomplete?: string;
  /** Classes and styles of the text field inside, as before. */
  @Input() inputStyleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() inputStyle?: Record<string, any> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get inputStyleObject(): Record<string, any> | null {
    return this.inputStyle && typeof this.inputStyle === 'object' ? this.inputStyle : null;
  }
  @Input() maxLength?: number;
  @Input() ariaLabel?: string;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  /** `small` or `large` (also `sm` / `lg`). */
  @Input() size?: WuSize;
  @HostBinding('class.wu-password-sm') @HostBinding('class.p-password-sm') get sizeSm(): boolean {
    return this.sizeKey === 'sm';
  }
  @HostBinding('class.wu-password-lg') @HostBinding('class.p-password-lg') get sizeLg(): boolean {
    return this.sizeKey === 'lg';
  }
  get sizeKey(): 'sm' | 'lg' | null {
    return ɵsize(this.size);
  }
  get invalid(): boolean { return this._invalid; }
  @Input() set fluid(v: unknown) { this._fluid = ɵtoBool(v); }
  get fluid(): boolean { return this._fluid; }

  @HostBinding('class.wu-password-fluid') get fluidClass(): boolean {
    return this._fluid;
  }
  @HostBinding('class.wu-filled') @HostBinding('class.p-inputwrapper-filled') get filled(): boolean {
    return !!this.value;
  }

  value = '';
  unmasked = false;
  readonly feedbackId = ɵuniqueId('wu-password-feedback');
  private focused = false;
  private popup: ɵWuPopup | null = null;
  @ViewChild('root') private rootRef?: ElementRef<HTMLElement>;
  @ViewChild('panel') private panelRef?: ElementRef<HTMLElement>;
  private _feedback = true;
  private _toggleMask = false;
  private _disabled = false;
  private _invalid = false;
  private _fluid = false;
  private formDisabled = false;
  private readonly autoId = ɵuniqueId('wu-password');
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();
  private readonly cdr = inject(ChangeDetectorRef);
  private onModelChange: (value: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWuStyleLoader).load('inputtext', ɵWU_INPUTTEXT_CSS);
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    this.popup?.close();
  }

  get id(): string {
    return this.inputId || this.autoId;
  }
  get isDisabled(): boolean {
    return this._disabled || this.formDisabled;
  }
  get strength(): WuPasswordStrength {
    return ɵpasswordStrength(this.value, this.mediumRegex, this.strongRegex);
  }
  /** The meter opens under the field while it has focus. */
  get showFeedback(): boolean {
    return this._feedback && this.focused;
  }
  get info(): string {
    const t = this.config.translation;
    switch (this.strength) {
      case 'weak':
        return this.weakLabel ?? t.weak;
      case 'medium':
        return this.mediumLabel ?? t.medium;
      case 'strong':
        return this.strongLabel ?? t.strong;
      default:
        return this.promptLabel ?? t.passwordPrompt;
    }
  }
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
    const c = ['wu-password', 'p-password', 'p-component', 'p-inputwrapper'];
    if (this._toggleMask) c.push('wu-password-has-toggle', 'p-password-mask');
    if (this.strength) c.push('wu-password-' + this.strength);
    return c.join(' ');
  }
  get toggleLabel(): string {
    return this.unmasked ? this.config.translation.hidePassword : this.config.translation.showPassword;
  }

  onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onModelChange(this.value);
  }
  onFocus(): void {
    this.focused = true;
    if (!this._feedback) return;
    this.cdr.detectChanges();
    const panel = this.panelRef?.nativeElement;
    if (!panel || !this.rootRef) return;
    this.popup = new ɵWuPopup(this.rootRef.nativeElement, panel, {
      sheet: false,
      gap: 6,
      sheetClass: 'wu-password-sheet',
      modalClass: 'wu-password-modal',
      onOutside: () => {},
      onPosition: (_, anchor) => (panel.style.minWidth = `${Math.round(anchor.width)}px`),
    });
    this.popup.open();
  }
  onBlur(): void {
    this.focused = false;
    this.popup?.close();
    this.popup = null;
    this.onTouchedFn();
  }

  writeValue(value: unknown): void {
    this.value = value == null ? '' : String(value);
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled = disabled;
    this.cdr.markForCheck();
  }
}
