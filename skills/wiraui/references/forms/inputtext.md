# InputText

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`input[wuInputText]` · `WuInputTextModule` / `WuInputText` from `@wirabyte/ui/inputtext` · forms: ngModel / formControlName
Also accepted: `pInputText` attribute, on `<input>` or `<textarea>`.

A directive that styles a real `<input>`. ngModel and formControl keep Angular's own value accessor, so it behaves exactly like a plain input. Use it for every single-line text field.

```html
<input wuInputText name="name" [(ngModel)]="name" placeholder="ชื่อ-นามสกุล" />

<form [formGroup]="form">
  <input wuInputText formControlName="name" placeholder="ชื่อ (ต้องกรอก)" />
  <input wuInputText formControlName="email" type="email" placeholder="อีเมล" />
</form>
```
```ts
form = new FormGroup({
  name: new FormControl('', Validators.required),
  email: new FormControl('', Validators.email),
});
```

**Inputs** — native attributes (`placeholder`, `type`, `maxlength`, `readonly`, `disabled`) work as usual.
- `wuSize`: `'small' | 'large'` — size (not `size`: that is a native `<input>` attribute). Classes `p-inputtext-sm` / `p-inputtext-lg` do the same.
- `variant`: `'outlined' | 'filled'` = `'outlined'`
- `fluid`: `boolean` = `false`
- `invalid`: `boolean` = `false`

**Types** — `type WuInputSize = 'small' | 'large'; type WuInputVariant = 'outlined' | 'filled';`
**Tokens** — --wu-field-bg, --wu-field-color, --wu-field-border, --wu-field-border-width, --wu-field-hover-border, --wu-field-focus-border, --wu-field-focus-shadow, --wu-field-padding-x, --wu-field-padding-y, --wu-control-line-height (fields and buttons same height), --wu-input-radius, --wu-field-placeholder, --wu-field-filled-bg, --wu-field-disabled-bg (disabled/readonly), --wu-danger-color (invalid border) · `overrides: components.input`

**Gotchas**
- Size input is `wuSize`, never `size`.
- No outputs: it is a plain input; use `(input)`, `(blur)`, `(ngModelChange)`.
