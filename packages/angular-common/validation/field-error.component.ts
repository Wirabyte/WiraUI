import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { AbstractControl, AbstractControlDirective, ControlContainer, FormGroupDirective, NgForm } from '@angular/forms';
import { ɵassertSupportedAngular, ɵtoBool, ɵuniqueId, ɵWU_SKIP_VERSION_CHECK, WuConfig, ɵWuStyleLoader } from '@wirabyte/ui/config';
import { validationMessage } from '@wirabyte/ui/core';
import { ɵWU_INPUTTEXT_CSS } from '@wirabyte/ui/inputtext';

/**
 * The error of one field, in Thai (or the app's language), shown once the field was touched or its form submitted:
 *
 * ```html
 * <input wuInputText formControlName="email" />
 * <wu-field-error for="email" label="อีเมล" />          <!-- กรุณากรอกอีเมล · รูปแบบอีเมลไม่ถูกต้อง -->
 * ```
 * `for` names a control of the surrounding form (reactive or ngModel); `[control]` takes the control itself
 * (`form.controls.email`, or `#m="ngModel"`). Fields turn red on their own at the same moment.
 */
@Component({
  selector: 'wu-field-error',
  standalone: true,
  template: '{{ message }}',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'wu-field-error p-error',
    'aria-live': 'polite',
    '[attr.id]': 'id',
    '[attr.hidden]': 'message ? null : ""',
  },
})
export class WuFieldError {
  /** Name of a control in the surrounding form. */
  @Input('for') name?: string;
  /** The control itself: a FormControl, or a directive such as `#m="ngModel"`. */
  @Input() control?: AbstractControl | AbstractControlDirective | null;
  /** The field's name in messages: `กรุณากรอก{label}`. */
  @Input() label?: string;
  /** Own words per error key: `{ pattern: 'ใช้ตัวเลข 10 หลัก' }`. */
  @Input() messages?: Partial<Record<string, string>>;
  /** Show the error before the field is touched or the form submitted. */
  @Input() set always(v: unknown) { this._always = ɵtoBool(v); }
  /** id to point the field's `aria-describedby` at. Default: generated. */
  @Input() set id(v: string | undefined) { this._id = v || this._id; }
  get id(): string { return this._id; }

  private _always = false;
  private _id = ɵuniqueId('wu-field-error');
  private readonly container = inject(ControlContainer, { optional: true });
  private readonly reactiveForm = inject(FormGroupDirective, { optional: true });
  private readonly templateForm = inject(NgForm, { optional: true });
  private readonly config = inject(WuConfig);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWuStyleLoader).load('inputtext', ɵWU_INPUTTEXT_CSS);
  }

  /** Read on every check: touched has no event to listen to in every Angular version this runs on. */
  get message(): string {
    const c = this.resolve();
    if (!c || !c.invalid) return '';
    const submitted = !!(this.reactiveForm?.submitted || this.templateForm?.submitted);
    if (!this._always && !c.touched && !submitted) return '';
    return validationMessage(c.errors, { locale: this.config.translation, label: this.label, overrides: this.messages });
  }

  private resolve(): AbstractControl | null {
    const c = this.control;
    if (c instanceof AbstractControl) return c;
    if (c instanceof AbstractControlDirective) return c.control;
    if (this.name && this.container?.control) return this.container.control.get(this.name);
    return null;
  }
}
