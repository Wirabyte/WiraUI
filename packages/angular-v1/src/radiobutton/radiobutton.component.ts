import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { ɵassertSupportedAngular, ɵsize, ɵtoBool, ɵuniqueId, ɵWU_SKIP_VERSION_CHECK, WuSize } from '@wirabyte/ui/config';
import { ɵWuRadioAccessor, ɵWuRadioRegistry } from './radio-registry';
import { WuRadioButtonClickEvent } from './radiobutton.types';

/**
 * Radio button for ngModel and reactive forms. Give every radio in a group the same `name`
 * (and the same ngModel field or formControlName); each one has its own `value`.
 */
@Component({
  selector: 'wu-radiobutton, wu-radioButton, wu-radio-button',
  standalone: true,
  imports: [NgIf],
  templateUrl: './radiobutton.component.html',
  styleUrls: ['./radiobutton.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuRadioButton), multi: true }],
})
export class WuRadioButton implements ControlValueAccessor, OnInit, OnDestroy, ɵWuRadioAccessor {
  @Input() value: unknown;
  @Input() name?: string;
  @Input() label?: string;
  @Input() inputId?: string;
  @Input() ariaLabel?: string;
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
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  /** `small` or `large` (also `sm` / `lg`). */
  @Input() size?: WuSize;
  @HostBinding('class.wu-radiobutton-sm') @HostBinding('class.p-radiobutton-sm') get sizeSm(): boolean {
    return this.sizeKey === 'sm';
  }
  @HostBinding('class.wu-radiobutton-lg') @HostBinding('class.p-radiobutton-lg') get sizeLg(): boolean {
    return this.sizeKey === 'lg';
  }
  get sizeKey(): 'sm' | 'lg' | null {
    return ɵsize(this.size);
  }
  get invalid(): boolean { return this._invalid; }

  @Output() readonly onClick = new EventEmitter<WuRadioButtonClickEvent>();

  ngControlRef: NgControl | null = null;

  private _disabled = false;
  private _invalid = false;
  private model: unknown = undefined;
  private formDisabled = false;
  private readonly autoId = ɵuniqueId('wu-radiobutton');
  private readonly injector = inject(Injector);
  private readonly registry = inject(ɵWuRadioRegistry);
  private readonly cdr = inject(ChangeDetectorRef);
  private onModelChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  get id(): string {
    return this.inputId || this.autoId;
  }
  get isDisabled(): boolean {
    return this._disabled || this.formDisabled;
  }
  get checked(): boolean {
    return this.model === this.value;
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
    if (this.isDisabled) return;
    this.model = this.value;
    this.onModelChange(this.value);
    this.registry.select(this, this.value);
    this.onClick.emit({ value: this.value, originalEvent: event });
  }

  writeValue(value: unknown): void {
    this.model = value;
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (value: unknown) => void): void {
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
