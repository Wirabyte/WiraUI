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
import { ɵassertSupportedAngular, ɵsize, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK, WtSize } from 'wiratheme/config';
import { ɵWtRadioAccessor, ɵWtRadioRegistry } from './radio-registry';
import { WtRadioButtonClickEvent } from './radiobutton.types';

/**
 * Radio button for ngModel and reactive forms. Give every radio in a group the same `name`
 * (and the same ngModel field or formControlName); each one has its own `value`.
 */
@Component({
  selector: 'wt-radiobutton',
  host: {
    '[class.wt-radiobutton-sm]': "sizeKey() === 'sm'",
    '[class.p-radiobutton-sm]': "sizeKey() === 'sm'",
    '[class.wt-radiobutton-lg]': "sizeKey() === 'lg'",
    '[class.p-radiobutton-lg]': "sizeKey() === 'lg'",
  },
  standalone: true,
  templateUrl: './radiobutton.component.html',
  styleUrl: './radiobutton.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtRadioButton), multi: true }],
})
export class WtRadioButton implements ControlValueAccessor, OnInit, OnDestroy, ɵWtRadioAccessor {
  readonly value = input<unknown>();
  readonly name = input<string>();
  readonly label = input<string>();
  readonly inputId = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  /** `small` or `large` (also `sm` / `lg`). */
  readonly size = input<WtSize>();
  readonly sizeKey = computed(() => ɵsize(this.size()));
  readonly ariaLabel = input<string>();

  readonly onClick = output<WtRadioButtonClickEvent>();

  ngControlRef: NgControl | null = null;

  private readonly injector = inject(Injector);
  private readonly registry = inject(ɵWtRadioRegistry);
  private readonly model = signal<unknown>(undefined);
  private readonly formDisabled = signal(false);
  private readonly autoId = ɵuniqueId('wt-radiobutton');
  private onModelChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  readonly id = computed(() => this.inputId() || this.autoId);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly checked = computed(() => this.model() === this.value());

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
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
