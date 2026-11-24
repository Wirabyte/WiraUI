# Password

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-password` · `WuPasswordModule` / `WuPassword` from `@wirabyte/ui/password` · forms: ngModel / formControlName

Password field with a strength meter that opens as a floating panel under the field while focused (never pushes content down) and a show/hide toggle.

```html
<wu-password name="password" [(ngModel)]="password" placeholder="รหัสผ่าน" ariaLabel="รหัสผ่าน"></wu-password>
<wu-password name="pin" [(ngModel)]="pin" [feedback]="false" [toggleMask]="true" placeholder="PIN" ariaLabel="PIN"></wu-password>
<wu-password name="secret" [(ngModel)]="secret" promptLabel="ตั้งรหัสอย่างน้อย 8 ตัว" weakLabel="ง่ายไป"
  mediumLabel="พอใช้" strongLabel="ดีมาก" strongRegex="^(?=.*[A-Z])(?=.*[0-9]).{10,}$"></wu-password>
```

**Inputs**
- `feedback`: `boolean` = `true` — strength meter; `toggleMask`: `boolean` = `false` — show/hide button
- `promptLabel`: `string` (locale default); `weakLabel` · `mediumLabel` · `strongLabel`: `string` (locale default); `mediumRegex` · `strongRegex`: `string` — rules for medium/strong
- `size`: `'small' | 'large'` (`sm`/`lg` work too)
- `placeholder`: `string`; `inputId` · `name` · `autocomplete`: `string`; `maxLength`: `number`; `ariaLabel`: `string`
- `disabled` · `invalid` · `fluid`: `boolean` = `false`
- `inputStyleClass`: `string` · `inputStyle`: `object` — inner input; `styleClass` · `style` — outer element

**Properties** (via template ref `#pw`) — `unmasked`: `boolean` = `false` — text visible (`pw.unmasked = true`).
**Tokens** — --wu-password-meter-bg, --wu-password-meter-height, --wu-danger-color (weak), --wu-warn-color (medium), --wu-success-color (strong)

**Gotchas**
- The meter is only advisory; enforce rules with `Validators.minLength` etc.
- For a confirm field use `[feedback]="false"` and `WuValidators.match('password')`.
- Outputs are not documented.
