import { AfterViewInit, booleanAttribute, Directive, DoCheck, ElementRef, inject, input, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ɵassertSupportedAngular, ɵWT_SKIP_VERSION_CHECK, ɵWtStyleLoader } from 'wiratheme/config';
import { WtInputSize, WtInputVariant, ɵWT_INPUTTEXT_CSS } from 'wiratheme/inputtext';

/**
 * Styles a native <textarea> like wtInputText. `autoResize` grows it with its text, including values
 * set from code through ngModel or a form control.
 */
@Directive({
  selector: 'textarea[wtTextarea], textarea[pTextarea], textarea[wtInputTextarea], textarea[pInputTextarea]',
  standalone: true,
  host: {
    class: 'wt-inputtext wt-textarea p-textarea p-component',
    '[class.wt-textarea-autoresize]': 'autoResize()',
    '[class.p-textarea-resizable]': 'autoResize()',
    '[class.p-variant-filled]': "variant() === 'filled'",
    '[class.p-textarea-fluid]': 'fluid()',
    '[class.p-invalid]': 'invalid()',
    '[class.wt-inputtext-sm]': "wtSize() === 'small'",
    '[class.wt-inputtext-lg]': "wtSize() === 'large'",
    '[class.wt-inputtext-filled]': "variant() === 'filled'",
    '[class.wt-inputtext-fluid]': 'fluid()',
    '[class.wt-invalid]': 'invalid()',
    '[attr.aria-invalid]': 'invalid() || null',
    '[class.wt-filled]': 'filled',
    '[class.p-filled]': 'filled',
    '(input)': 'onInput()',
  },
})
export class WtTextarea implements AfterViewInit, DoCheck, OnDestroy {
  readonly autoResize = input(false, { transform: booleanAttribute });
  readonly wtSize = input<WtInputSize>();
  readonly variant = input<WtInputVariant>('outlined');
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });

  /** True while the field has a value; floating labels read the `wt-filled` / `p-filled` class. */
  filled = false;
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

  ngDoCheck(): void {
    this.filled = !!this.el.nativeElement.value;
  }

  onInput(): void {
    this.filled = !!this.el.nativeElement.value;
    this.resize();
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  resize(): void {
    if (!this.autoResize()) return;
    const t = this.el.nativeElement;
    t.style.height = 'auto';
    t.style.height = t.scrollHeight + 'px';
  }
}
