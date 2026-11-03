import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { isThaiPhone, isValidThaiId } from '@wirabyte/ui/core';

const empty = (v: unknown) => v === null || v === undefined || v === '';

/** Each control checked by `match` and the control it is compared with, so a change on either side re-checks it. */
const matched = new WeakMap<AbstractControl, AbstractControl>();

/** Validators for Thai forms. Empty values pass: pair them with `Validators.required`. */
export class WuValidators {
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

/** `<input wuInputText name="id" [(ngModel)]="id" wuThaiId>`: the Thai ID validator for template forms. */
@Directive({
  selector: '[wuThaiId][ngModel], [wuThaiId][formControlName], [wuThaiId][formControl]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => WuThaiIdValidator), multi: true }],
})
export class WuThaiIdValidator implements Validator {
  validate(c: AbstractControl): ValidationErrors | null {
    return WuValidators.thaiId(c);
  }
}

/** `<input wuInputText name="phone" [(ngModel)]="phone" wuThaiPhone>`: the Thai phone validator for template forms. */
@Directive({
  selector: '[wuThaiPhone][ngModel], [wuThaiPhone][formControlName], [wuThaiPhone][formControl]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => WuThaiPhoneValidator), multi: true }],
})
export class WuThaiPhoneValidator implements Validator {
  validate(c: AbstractControl): ValidationErrors | null {
    return WuValidators.thaiPhone(c);
  }
}

/** `<input name="confirm" [(ngModel)]="confirm" wuMatch="password">`: equal to the control named `password`. */
@Directive({
  selector: '[wuMatch][ngModel], [wuMatch][formControlName], [wuMatch][formControl]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => WuMatchValidator), multi: true }],
})
export class WuMatchValidator implements Validator {
  @Input() wuMatch = '';
  validate(c: AbstractControl): ValidationErrors | null {
    return WuValidators.match(this.wuMatch)(c);
  }
}
