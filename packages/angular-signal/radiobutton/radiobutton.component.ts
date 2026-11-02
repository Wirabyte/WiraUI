import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  Injector,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { ɵassertSupportedAngular, ɵsize, ɵuniqueId, ɵWU_SKIP_VERSION_CHECK, WuSize } from 'wiraui/config';
import { ɵWuRadioAccessor, ɵWuRadioRegistry } from './radio-registry';
import { WuRadioButtonClickEvent } from './radiobutton.types';

/**
 * Radio button for ngModel and reactive forms. Give every radio in a group the same `name`
 * (and the same ngModel field or formControlName); each one has its own `value`.
 */
@Component({
  selector: 'wu-radiobutton, wu-radioButton, wu-radio-button',
  host: {
    '[class.wu-radiobutton-sm]': "sizeKey() === 'sm'",
    '[class.p-radiobutton-sm]': "sizeKey() === 'sm'",
    '[class.wu-radiobutton-lg]': "sizeKey() === 'lg'",
    '[class.p-radiobutton-lg]': "sizeKey() === 'lg'",
  },
  standalone: true,
  templateUrl: './radiobutton.component.html',
  styleUrl: './radiobutton.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuRadioButton), multi: true }],
})
export class WuRadioButton implements ControlValueAccessor, OnInit, OnDestroy, ɵWuRadioAccessor {
  readonly value = input<unknown>();
  readonly name = input<string>();
  readonly label = input<string>();
  readonly inputId = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  /** `small` or `large` (also `sm` / `lg`). */
  readonly size = input<WuSize>();
  readonly sizeKey = computed(() => ɵsize(this.size()));
  readonly ariaLabel = input<string>();
  /** Classes for the root element, as before (`styleClass="w-full"`). */
  readonly styleClass = input<string | null | undefined>();
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly style = input<Record<string, any> | string | null | undefined>();
  /** The `style` object for the root (a plain style attribute already styles the host). */
  readonly rootStyle = computed(() => {
    const s = this.style();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return s && typeof s === 'object' ? (s as Record<string, any>) : null;
  });

  readonly onClick = output<WuRadioButtonClickEvent>();

  ngControlRef: NgControl | null = null;

  private readonly injector = inject(Injector);
  private readonly registry = inject(ɵWuRadioRegistry);
  private readonly model = signal<unknown>(undefined);
  private readonly formDisabled = signal(false);
  private readonly autoId = ɵuniqueId('wu-radiobutton');
  private onModelChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  readonly id = computed(() => this.inputId() || this.autoId);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly checked = computed(() => this.model() === this.value());

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnInit(): void {
    // Looked up here, not injected: the NgControl itself injects this component as its value accessor.
    this.ngControlRef = this.injector.get(NgControl, null, { self: true });
    this.registry.add(this);
  }

  ngOnDestroy(): void {
    this.registry.remove(this);
  }

  select(event: Event): void {
    if (this.isDisabled()) return;
    const value = this.value();
    this.model.set(value);
    this.onModelChange(value);
    this.registry.select(this, value);
    this.onClick.emit({ value, originalEvent: event });
  }

  writeValue(value: unknown): void {
    this.model.set(value);
  }
  registerOnChange(fn: (value: unknown) => void): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
}
