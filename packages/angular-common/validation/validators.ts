import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { isThaiPhone, isValidThaiId } from 'wiratheme/core';

const empty = (v: unknown) => v === null || v === undefined || v === '';

/** Each control checked by `match` and the control it is compared with, so a change on either side re-checks it. */
const matched = new WeakMap<AbstractControl, AbstractControl>();

/** Validators for Thai forms. Empty values pass: pair them with `Validators.required`. */
export class WtValidators {
  /** เลขประจำตัวประชาชน 13 หลักที่ check digit ถูกต้อง (dashes allowed). Error: `thaiId`. */
  static thaiId: ValidatorFn = (c) => (empty(c.value) || isValidThaiId(String(c.value)) ? null : { thaiId: true });

  /** Thai mobile or landline number. Error: `phone`. */
  static thaiPhone: ValidatorFn = (c) => (empty(c.value) || isThaiPhone(String(c.value)) ? null : { phone: true });

  /**
   * Same value as the sibling control `other` (confirm password, confirm email). Error: `mismatch`.
   * Changing `other` afterwards checks this control again, so the error never lags behind.
   */
  static match(other: string): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      const o = c.parent?.get(other);
      if (o && matched.get(c) !== o) {
        matched.set(c, o);
        o.valueChanges.subscribe(() => c.updateValueAndValidity({ emitEvent: false }));
      }
      if (!o || empty(c.value)) return null;
      return c.value === o.value ? null : { mismatch: true };
    };
  }
}

/** `<input wtInputText name="id" [(ngModel)]="id" wtThaiId>`: the Thai ID validator for template forms. */
@Directive({
  selector: '[wtThaiId][ngModel], [wtThaiId][formControlName], [wtThaiId][formControl]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => WtThaiIdValidator), multi: true }],
})
export class WtThaiIdValidator implements Validator {
  validate(c: AbstractControl): ValidationErrors | null {
    return WtValidators.thaiId(c);
  }
}

/** `<input wtInputText name="phone" [(ngModel)]="phone" wtThaiPhone>`: the Thai phone validator for template forms. */
@Directive({
  selector: '[wtThaiPhone][ngModel], [wtThaiPhone][formControlName], [wtThaiPhone][formControl]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => WtThaiPhoneValidator), multi: true }],
})
export class WtThaiPhoneValidator implements Validator {
  validate(c: AbstractControl): ValidationErrors | null {
    return WtValidators.thaiPhone(c);
  }
}

/** `<input name="confirm" [(ngModel)]="confirm" wtMatch="password">`: equal to the control named `password`. */
@Directive({
  selector: '[wtMatch][ngModel], [wtMatch][formControlName], [wtMatch][formControl]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => WtMatchValidator), multi: true }],
})
export class WtMatchValidator implements Validator {
  @Input() wtMatch = '';
  validate(c: AbstractControl): ValidationErrors | null {
    return WtValidators.match(this.wtMatch)(c);
  }
}
