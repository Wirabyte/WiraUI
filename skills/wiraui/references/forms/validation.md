# Validation

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-field-error` · `WuValidationModule` / `WuFieldError`, `WuThaiIdValidator`, `WuThaiPhoneValidator`, `WuMatchValidator` from `@wirabyte/ui/validation` · forms: template and reactive

Invalid fields turn red on their own once touched or once the form is submitted, and `<wu-field-error>` shows the message (Thai, or English when locale is English). The module brings `wu-field-error` and the directives `wuThaiId`, `wuThaiPhone`, `wuMatch`; `WuValidators` (static class) is for reactive forms. This is how every WiraUI form shows errors: do not hand-write `ng-dirty`/`ng-touched` checks.

Template form:
```html
<form #profileForm="ngForm" (ngSubmit)="save(profileForm)">
  <input wuInputText id="email" name="email" [(ngModel)]="email" [required]="true" [email]="true" />
  <wu-field-error for="email" label="อีเมล"></wu-field-error>

  <input wuInputText id="phone" name="phone" [(ngModel)]="phone" wuThaiPhone />
  <wu-field-error for="phone"></wu-field-error>

  <wu-button type="submit" label="บันทึก" icon="wi wi-save"></wu-button>
</form>
```
```ts
save(form: NgForm): void {
  if (form.invalid) return;   // invalid fields already show red, with their messages
  // save
}
```
Reactive form:
```html
<form [formGroup]="form" (ngSubmit)="register()">
  <input wuInputText formControlName="thaiId" placeholder="เลขประจำตัวประชาชน" />
  <wu-field-error for="thaiId" label="เลขประจำตัวประชาชน"></wu-field-error>
  <wu-password formControlName="password" [feedback]="false" placeholder="รหัสผ่าน"></wu-password>
  <wu-field-error for="password" label="รหัสผ่าน"></wu-field-error>
  <wu-password formControlName="confirm" [feedback]="false" placeholder="ยืนยันรหัสผ่าน"></wu-password>
  <wu-field-error for="confirm" label="ยืนยันรหัสผ่าน"></wu-field-error>
  <wu-button type="submit" label="สมัคร"></wu-button>
</form>
```
```ts
import { WuValidators } from '@wirabyte/ui/validation';

form = new FormGroup({
  thaiId: new FormControl('', [Validators.required, WuValidators.thaiId]),
  password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  confirm: new FormControl('', [Validators.required, WuValidators.match('password')]),
});
```
Own words, show at once, and pointing at a control (outside a form, or a standalone ngModel):
```html
<input wuInputText name="branchCode" [(ngModel)]="branchCode" #codeModel="ngModel" pattern="[0-9]{10}" placeholder="รหัสสาขา" />
<wu-field-error [control]="codeModel" [messages]="{ pattern: 'ใช้ตัวเลข 10 หลัก' }" [always]="true"></wu-field-error>

<input wuInputText name="nickname" [(ngModel)]="nickname" #nicknameModel="ngModel" [required]="true" />
<wu-field-error [control]="nicknameModel" label="ชื่อเล่น"></wu-field-error>
```

**Inputs (`wu-field-error`)**
- `for`: `string` — name of a control in the surrounding form (reactive or ngModel)
- `control`: `AbstractControl | NgModel` — the control itself, instead of `for` (`form.controls.email`, `#m="ngModel"`)
- `label`: `string` — field name in messages: `กรุณากรอก{label}`
- `messages`: `Partial<Record<string, string>>` — own words per error key
- `always`: `boolean` = `false` — show before the field is touched or the form submitted
- `id`: `string` = generated — id for the field's `aria-describedby`

**WuValidators** (also as directives) — error key in brackets. Empty values pass: always pair with `Validators.required`.
- `WuValidators.thaiId` · `wuThaiId` (`thaiId`): 13-digit Thai ID with valid check digit (dashes allowed)
- `WuValidators.thaiPhone` · `wuThaiPhone` (`phone`): Thai mobile or landline (+66 works)
- `WuValidators.match('password')` · `wuMatch="password"` (`mismatch`): must equal another control (sibling in the same group); changing the other control re-checks this one
- The directives need `ngModel`, `formControlName` or `formControl` on the same element.

**Built-in messages** (Thai; English under an English locale)
| key | message | notes |
|---|---|---|
| `required` | กรุณากรอก{label} | no label: กรุณากรอกข้อมูลนี้. Same wording on pickers (Select, MultiSelect, DatePicker…); for "เลือก" pass `[messages]="{ required: 'กรุณาเลือกประเภทการลา' }"` |
| `email` | รูปแบบอีเมลไม่ถูกต้อง | `Validators.email` |
| `minlength` · `maxlength` | ต้องมีอย่างน้อย {n} ตัวอักษร | uses the error's numbers |
| `min` · `max` | ต้องไม่น้อยกว่า {min} | uses the error's numbers |
| `pattern` | รูปแบบไม่ถูกต้อง | change with `[messages]` |
| `thaiId` · `phone` · `mismatch` | เลขประจำตัวประชาชนไม่ถูกต้อง … | from WuValidators |

**Helpers** (from `@wirabyte/ui/core`):
```ts
import { isThaiPhone, isValidThaiId, validationMessage } from '@wirabyte/ui/core';
isThaiPhone('081-234-5678');                                  // true
isValidThaiId('1-1017-00203-45-0');                            // true
validationMessage({ required: true }, { label: 'อีเมล' });     // 'กรุณากรอกอีเมล'
validationMessage({ minlength: { requiredLength: 8 } });       // 'ต้องมีอย่างน้อย 8 ตัวอักษร'
```
**Tokens** — --wu-danger-color (field border and error text)

**Gotchas**
- `wu-field-error` renders nothing (`hidden`) until the control is invalid AND (touched, form submitted, or `always`). Inside a `<form>` the submit state is picked up from the surrounding `NgForm` / `FormGroupDirective`; outside one, only touched/`always` apply.
- `for` needs the `name` (ngModel) or `formControlName` of a control in the nearest form; otherwise use `[control]`.
- Message text is Thai by default; `label` is spliced into `กรุณากรอก{label}`, so pass a Thai noun, no "please enter".
- The red field style comes from the control itself (ng-invalid + touched/submitted); `wu-field-error` only adds the message.
- Matching only works between controls with a common parent group (`match('password')` looks up `c.parent.get('password')`).
- Host element has classes `wu-field-error p-error` and `aria-live="polite"`.
