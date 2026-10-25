import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  input,
  numberAttribute,
  OnDestroy,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  ɵassertSupportedAngular,
  ɵsize,
  ɵuniqueId,
  ɵWT_SKIP_VERSION_CHECK,
  WtConfig,
  ɵWtPopup,
  WtSize,
  ɵWtStyleLoader,
} from 'wiratheme/config';
import { ɵWT_INPUTTEXT_CSS } from 'wiratheme/inputtext';
import { ɵpasswordStrength } from './password.types';

/**
 * Password field with a show/hide button and a strength meter under it:
 * `<wt-password [(ngModel)]="pw" toggleMask>`; `[feedback]="false"` for login forms.
 */
@Component({
  selector: 'wt-password',
  standalone: true,
  templateUrl: './password.component.html',
  styleUrl: './password.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtPassword), multi: true }],
  host: {
    '[class.wt-password-sm]': "sizeKey() === 'sm'",
    '[class.p-password-sm]': "sizeKey() === 'sm'",
    '[class.wt-password-lg]': "sizeKey() === 'lg'",
    '[class.p-password-lg]': "sizeKey() === 'lg'",
    '[class.wt-password-fluid]': 'fluid()',
    '[class.wt-filled]': '!!value()',
    '[class.p-inputwrapper-filled]': '!!value()',
  },
})
export class WtPassword implements ControlValueAccessor, OnDestroy {
  readonly placeholder = input<string>();
  /** Strength meter while typing. Default true. */
  readonly feedback = input(true, { transform: booleanAttribute });
  readonly toggleMask = input(false, { transform: booleanAttribute });
  readonly promptLabel = input<string>();
  readonly weakLabel = input<string>();
  readonly mediumLabel = input<string>();
  readonly strongLabel = input<string>();
  readonly mediumRegex = input<string>();
  readonly strongRegex = input<string>();
  readonly inputId = input<string>();
  readonly name = input<string>();
  readonly autocomplete = input<string>();
  /** Classes and styles of the text field inside, as before. */
  readonly inputStyleClass = input<string | null | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly inputStyle = input<Record<string, any> | null | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly inputStyleObject = computed(() => (this.inputStyle() && typeof this.inputStyle() === 'object' ? (this.inputStyle() as Record<string, any>) : null));
  readonly maxLength = input<number | undefined, unknown>(undefined, { transform: (v: unknown) => (v == null || v === '' ? undefined : numberAttribute(v)) });
  readonly ariaLabel = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  /** `small` or `large` (also `sm` / `lg`). */
  readonly size = input<WtSize>();
  readonly sizeKey = computed(() => ɵsize(this.size()));
  readonly fluid = input(false, { transform: booleanAttribute });

  private readonly config = inject(WtConfig);
  /** Bumped by `WtConfig.setTranslation()`; read by the computeds that show UI strings. */
  private readonly language = signal(0);
  private readonly autoId = ɵuniqueId('wt-password');
  readonly feedbackId = ɵuniqueId('wt-password-feedback');
  readonly value = signal('');
  /** The password shows as text. Readable and settable as a plain property, as before (`pw.unmasked`). */
  readonly unmaskedState = signal(false);
  get unmasked(): boolean {
    return this.unmaskedState();
  }
  set unmasked(v: boolean) {
    this.unmaskedState.set(!!v);
  }
  private readonly focused = signal(false);
  private readonly formDisabled = signal(false);
  private onModelChange: (value: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  readonly id = computed(() => this.inputId() || this.autoId);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly strength = computed(() => ɵpasswordStrength(this.value(), this.mediumRegex(), this.strongRegex()));
  /** The meter opens under the field while it has focus. */
  readonly showFeedback = computed(() => this.feedback() && this.focused());
  private readonly rootRef = viewChild<ElementRef<HTMLElement>>('root');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly cdRef = inject(ChangeDetectorRef);
  private popup: ɵWtPopup | null = null;
  readonly info = computed(() => {
    this.language();
    const t = this.config.translation;
    switch (this.strength()) {
      case 'weak':
        return this.weakLabel() ?? t.weak;
      case 'medium':
        return this.mediumLabel() ?? t.medium;
      case 'strong':
        return this.strongLabel() ?? t.strong;
      default:
        return this.promptLabel() ?? t.passwordPrompt;
    }
  });
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
    const c = ['wt-password', 'p-password', 'p-component', 'p-inputwrapper'];
    if (this.toggleMask()) c.push('wt-password-has-toggle');
    if (this.strength()) c.push('wt-password-' + this.strength());
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    // computed() caches, so language changes have to reach it through a signal.
    const i18n = this.config.translationChange.subscribe(() => this.language.update((n) => n + 1));
    inject(DestroyRef).onDestroy(() => i18n.unsubscribe());
    inject(ɵWtStyleLoader).load('inputtext', ɵWT_INPUTTEXT_CSS);
  }

  toggleLabel(): string {
    return this.unmaskedState() ? this.config.translation.hidePassword : this.config.translation.showPassword;
  }

  onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.value.set(v);
    this.onModelChange(v);
  }
  onFocus(): void {
    this.focused.set(true);
    if (this.feedback()) {
      this.cdRef.detectChanges();
      const panel = this.panelRef()?.nativeElement;
      const anchor = this.rootRef()?.nativeElement;
      if (panel && anchor) {
        this.popup = new ɵWtPopup(anchor, panel, {
          sheet: false,
          gap: 6,
          sheetClass: 'wt-password-sheet',
          modalClass: 'wt-password-modal',
          onOutside: () => {},
          onPosition: (_, box) => (panel.style.minWidth = `${Math.round(box.width)}px`),
        });
        this.popup.open();
      }
    }
  }
  onBlur(): void {
    this.focused.set(false);
    this.popup?.close();
    this.popup = null;
    this.onTouchedFn();
  }

  writeValue(value: unknown): void {
    this.value.set(value == null ? '' : String(value));
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  ngOnDestroy(): void {
    this.popup?.close();
  }
}
