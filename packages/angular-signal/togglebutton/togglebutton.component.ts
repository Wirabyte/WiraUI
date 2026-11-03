import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵassertSupportedAngular, ɵsize, ɵWU_SKIP_VERSION_CHECK, WuConfig, WuSize } from '@wirabyte/ui/config';
import { WuToggleButtonChangeEvent } from './togglebutton.types';

/** On/off button for a boolean in ngModel or reactive forms: `<wu-togglebutton [(ngModel)]="bold" onLabel="ตัวหนา" offLabel="ปกติ">`. */
@Component({
  selector: 'wu-togglebutton, wu-toggleButton, wu-toggle-button',
  host: {
    '[class.wu-togglebutton-sm]': "sizeKey() === 'sm'",
    '[class.p-togglebutton-sm]': "sizeKey() === 'sm'",
    '[class.wu-togglebutton-lg]': "sizeKey() === 'lg'",
    '[class.p-togglebutton-lg]': "sizeKey() === 'lg'",
  },
  standalone: true,
  templateUrl: './togglebutton.component.html',
  styleUrl: './togglebutton.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuToggleButton), multi: true }],
})
export class WuToggleButton implements ControlValueAccessor {
  /** Label when on / off. Default: the locale's yes / no. Pass '' for an icon-only button. */
  readonly onLabel = input<string>();
  readonly offLabel = input<string>();
  readonly onIcon = input<string>();
  readonly offIcon = input<string>();
  readonly iconPos = input<'left' | 'right'>('left');
  readonly inputId = input<string>();
  readonly ariaLabel = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  /** `small` or `large` (also `sm` / `lg`). */
  readonly size = input<WuSize>();
  readonly sizeKey = computed(() => ɵsize(this.size()));

  readonly onChange = output<WuToggleButtonChangeEvent>();

  private readonly config = inject(WuConfig);
  /** Bumped by `WuConfig.setTranslation()`; read by the computeds that show UI strings. */
  private readonly language = signal(0);
  readonly checked = signal(false);
  private readonly formDisabled = signal(false);
  private onModelChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly label = computed(() => {
    this.language();
    return this.checked() ? this.onLabel() ?? this.config.translation.yes : this.offLabel() ?? this.config.translation.no;
  });
  readonly icon = computed(() => (this.checked() ? this.onIcon() : this.offIcon()));
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
    const c = ['wu-togglebutton', 'p-togglebutton', 'p-component'];
    if (this.checked()) c.push('wu-togglebutton-checked', 'p-togglebutton-checked');
    if (this.invalid()) c.push('wu-invalid', 'p-invalid');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    // computed() caches, so language changes have to reach it through a signal.
    const i18n = this.config.translationChange.subscribe(() => this.language.update((n) => n + 1));
    inject(DestroyRef).onDestroy(() => i18n.unsubscribe());
  }

  toggle(event: Event): void {
    if (this.isDisabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onModelChange(next);
    this.onChange.emit({ checked: next, originalEvent: event });
  }

  writeValue(value: unknown): void {
    this.checked.set(!!value);
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
}
