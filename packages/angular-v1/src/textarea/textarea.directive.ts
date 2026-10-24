import { AfterViewInit, Directive, ElementRef, inject, Input, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ɵassertSupportedAngular, ɵtoBool, ɵWT_SKIP_VERSION_CHECK, ɵWtStyleLoader } from 'wiratheme/config';
import { WtInputSize, WtInputVariant, ɵWT_INPUTTEXT_CSS } from 'wiratheme/inputtext';

/**
 * Styles a native <textarea> like wtInputText. `autoResize` grows it with its text, including values
 * set from code through ngModel or a form control.
 */
@Directive({
  selector: 'textarea[wtTextarea]',
  standalone: true,
  host: {
    class: 'wt-inputtext wt-textarea',
    '[class.wt-textarea-autoresize]': 'autoResize',
    '[class.wt-inputtext-sm]': "wtSize === 'small'",
    '[class.wt-inputtext-lg]': "wtSize === 'large'",
    '[class.wt-inputtext-filled]': "variant === 'filled'",
    '[class.wt-inputtext-fluid]': 'fluid',
    '[class.wt-invalid]': 'invalid',
    '[attr.aria-invalid]': 'invalid || null',
    '(input)': 'resize()',
  },
})
export class WtTextarea implements AfterViewInit, OnDestroy {
  @Input() set autoResize(v: unknown) { this._autoResize = ɵtoBool(v); }
  get autoResize(): boolean { return this._autoResize; }
  @Input() wtSize?: WtInputSize;
  @Input() variant: WtInputVariant = 'outlined';
  @Input() set fluid(v: unknown) { this._fluid = ɵtoBool(v); }
  get fluid(): boolean { return this._fluid; }
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  get invalid(): boolean { return this._invalid; }

  private _autoResize = false;
  private _fluid = false;
  private _invalid = false;
  private readonly el = inject<ElementRef<HTMLTextAreaElement>>(ElementRef);
  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private sub?: Subscription;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWtStyleLoader).load('inputtext', ɵWT_INPUTTEXT_CSS);
  }

  ngAfterViewInit(): void {
    this.resize();
    const changes = this.ngControl && this.ngControl.valueChanges;
    if (changes) this.sub = changes.subscribe(() => setTimeout(() => this.resize()));
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  resize(): void {
    if (!this._autoResize) return;
    const t = this.el.nativeElement;
    t.style.height = 'auto';
    t.style.height = t.scrollHeight + 'px';
  }
}
