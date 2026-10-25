import { booleanAttribute, Directive, DoCheck, ElementRef, inject, input } from '@angular/core';
import { ɵassertSupportedAngular, ɵWT_SKIP_VERSION_CHECK, ɵWtStyleLoader } from 'wiratheme/config';
import { WT_INPUTTEXT_CSS } from './inputtext.styles';
import { WtInputSize, WtInputVariant } from './inputtext.types';

/**
 * Styles a native <input> as an attribute directive. ngModel and formControl work unchanged because
 * the input keeps Angular's own value accessor. Turns red when the control is invalid and touched.
 */
@Directive({
  selector: 'input[wtInputText], input[pInputText], textarea[wtInputText], textarea[pInputText]',
  standalone: true,
  host: {
    class: 'wt-inputtext p-inputtext p-component',
    '[class.wt-inputtext-sm]': "wtSize() === 'small'",
    '[class.p-inputtext-sm]': "wtSize() === 'small'",
    '[class.wt-inputtext-lg]': "wtSize() === 'large'",
    '[class.p-inputtext-lg]': "wtSize() === 'large'",
    '[class.wt-inputtext-filled]': "variant() === 'filled'",
    '[class.p-variant-filled]': "variant() === 'filled'",
    '[class.wt-inputtext-fluid]': 'fluid()',
    '[class.p-inputtext-fluid]': 'fluid()',
    '[class.wt-invalid]': 'invalid()',
    '[class.p-invalid]': 'invalid()',
    '[attr.aria-invalid]': 'invalid() || null',
    '[class.wt-filled]': 'filled',
    '[class.p-filled]': 'filled',
    '(input)': 'updateFilled()',
  },
})
export class WtInputText implements DoCheck {
  readonly wtSize = input<WtInputSize>();
  readonly variant = input<WtInputVariant>('outlined');
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });

  /** True while the field has a value; floating labels read the `wt-filled` / `p-filled` class. */
  filled = false;
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWtStyleLoader).load('inputtext', WT_INPUTTEXT_CSS);
  }

  ngDoCheck(): void {
    this.updateFilled();
  }

  updateFilled(): void {
    this.filled = !!this.el.nativeElement.value;
  }
}
