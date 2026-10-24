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
import { ɵassertSupportedAngular, ɵsize, ɵtoBool, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK, WtSize } from 'wiratheme/config';
import { ɵWtRadioAccessor, ɵWtRadioRegistry } from './radio-registry';
import { WtRadioButtonClickEvent } from './radiobutton.types';

/**
 * Radio button for ngModel and reactive forms. Give every radio in a group the same `name`
 * (and the same ngModel field or formControlName); each one has its own `value`.
 */
@Component({
  selector: 'wt-radiobutton',
  standalone: true,
  imports: [NgIf],
  templateUrl: './radiobutton.component.html',
  styleUrls: ['./radiobutton.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtRadioButton), multi: true }],
})
export class WtRadioButton implements ControlValueAccessor, OnInit, OnDestroy, ɵWtRadioAccessor {
  @Input() value: unknown;
  @Input() name?: string;
  @Input() label?: string;
  @Input() inputId?: string;
  @Input() ariaLabel?: string;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  /** `small` or `large` (also `sm` / `lg`). */
  @Input() size?: WtSize;
  @HostBinding('class.wt-radiobutton-sm') @HostBinding('class.p-radiobutton-sm') get sizeSm(): boolean {
    return this.sizeKey === 'sm';
  }
  @HostBinding('class.wt-radiobutton-lg') @HostBinding('class.p-radiobutton-lg') get sizeLg(): boolean {
    return this.sizeKey === 'lg';
  }
  get sizeKey(): 'sm' | 'lg' | null {
    return ɵsize(this.size);
  }
  get invalid(): boolean { return this._invalid; }

  @Output() readonly onClick = new EventEmitter<WtRadioButtonClickEvent>();

  ngControlRef: NgControl | null = null;

  private _disabled = false;
  private _invalid = false;
  private model: unknown = undefined;
  private formDisabled = false;
  private readonly autoId = ɵuniqueId('wt-radiobutton');
  private readonly injector = inject(Injector);
  private readonly registry = inject(ɵWtRadioRegistry);
  private readonly cdr = inject(ChangeDetectorRef);
  private onModelChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
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
