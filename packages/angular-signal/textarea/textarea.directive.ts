import { AfterViewInit, booleanAttribute, Directive, DoCheck, ElementRef, inject, input, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ɵassertSupportedAngular, ɵWU_SKIP_VERSION_CHECK, ɵWuStyleLoader } from '@wirabyte/ui/config';
import { WuInputSize, WuInputVariant, ɵWU_INPUTTEXT_CSS } from '@wirabyte/ui/inputtext';

/**
 * Styles a native <textarea> like wuInputText. `autoResize` grows it with its text, including values
 * set from code through ngModel or a form control.
 */
@Directive({
  selector: 'textarea[wuTextarea], textarea[pTextarea], textarea[wuInputTextarea], textarea[pInputTextarea]',
  standalone: true,
  host: {
    class: 'wu-inputtext wu-textarea p-textarea p-component',
    '[class.wu-textarea-autoresize]': 'autoResize()',
    '[class.p-textarea-resizable]': 'autoResize()',
    '[class.p-variant-filled]': "variant() === 'filled'",
    '[class.p-textarea-fluid]': 'fluid()',
    '[class.p-invalid]': 'invalid()',
    '[class.wu-inputtext-sm]': "wuSize() === 'small'",
    '[class.wu-inputtext-lg]': "wuSize() === 'large'",
    '[class.wu-inputtext-filled]': "variant() === 'filled'",
    '[class.wu-inputtext-fluid]': 'fluid()',
    '[class.wu-invalid]': 'invalid()',
    '[attr.aria-invalid]': 'invalid() || null',
    '[class.wu-filled]': 'filled',
    '[class.p-filled]': 'filled',
    '(input)': 'onInput()',
  },
})
export class WuTextarea implements AfterViewInit, DoCheck, OnDestroy {
  readonly autoResize = input(false, { transform: booleanAttribute });
  readonly wuSize = input<WuInputSize>();
  readonly variant = input<WuInputVariant>('outlined');
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });

  /** True while the field has a value; floating labels read the `wu-filled` / `p-filled` class. */
  filled = false;
  private readonly el = inject<ElementRef<HTMLTextAreaElement>>(ElementRef);
  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private sub?: Subscription;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWuStyleLoader).load('inputtext', ɵWU_INPUTTEXT_CSS);
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
