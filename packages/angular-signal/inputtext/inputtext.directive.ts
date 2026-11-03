import { booleanAttribute, Directive, DoCheck, ElementRef, inject, input } from '@angular/core';
import { ɵassertSupportedAngular, ɵWU_SKIP_VERSION_CHECK, ɵWuStyleLoader } from '@wirabyte/ui/config';
import { WU_INPUTTEXT_CSS } from './inputtext.styles';
import { WuInputSize, WuInputVariant } from './inputtext.types';

/**
 * Styles a native <input> as an attribute directive. ngModel and formControl work unchanged because
 * the input keeps Angular's own value accessor. Turns red when the control is invalid and touched.
 */
@Directive({
  selector: 'input[wuInputText], input[pInputText], textarea[wuInputText], textarea[pInputText]',
  standalone: true,
  host: {
    class: 'wu-inputtext p-inputtext p-component',
    '[class.wu-inputtext-sm]': "wuSize() === 'small'",
    '[class.p-inputtext-sm]': "wuSize() === 'small'",
    '[class.wu-inputtext-lg]': "wuSize() === 'large'",
    '[class.p-inputtext-lg]': "wuSize() === 'large'",
    '[class.wu-inputtext-filled]': "variant() === 'filled'",
    '[class.p-variant-filled]': "variant() === 'filled'",
    '[class.wu-inputtext-fluid]': 'fluid()',
    '[class.p-inputtext-fluid]': 'fluid()',
    '[class.wu-invalid]': 'invalid()',
    '[class.p-invalid]': 'invalid()',
    '[attr.aria-invalid]': 'invalid() || null',
    '[class.wu-filled]': 'filled',
    '[class.p-filled]': 'filled',
    '(input)': 'updateFilled()',
  },
})
export class WuInputText implements DoCheck {
  readonly wuSize = input<WuInputSize>();
  readonly variant = input<WuInputVariant>('outlined');
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });

  /** True while the field has a value; floating labels read the `wu-filled` / `p-filled` class. */
  filled = false;
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWuStyleLoader).load('inputtext', WU_INPUTTEXT_CSS);
  }

  ngDoCheck(): void {
    this.updateFilled();
  }

  updateFilled(): void {
    this.filled = !!this.el.nativeElement.value;
  }
}
