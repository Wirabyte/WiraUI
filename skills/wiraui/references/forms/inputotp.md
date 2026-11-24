# InputOtp

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-inputOtp` · `WuInputOtpModule` / `WuInputOtp` from `@wirabyte/ui/inputotp` · forms: ngModel / formControlName (value is one string, e.g. `'482915'`)
Also accepted: tags `wu-inputotp`, `wu-input-otp`. The NgModule also brings `wuTemplate`.

One-time-code boxes, one character each: typing moves on, Backspace goes back, a whole code can be pasted into any box, first box has `autocomplete="one-time-code"` so phones offer the SMS code.

```html
<label id="otp-label">รหัสยืนยัน 6 หลักจาก SMS</label>
<wu-inputOtp name="code" [(ngModel)]="code" [length]="6" [integerOnly]="true" ariaLabelledBy="otp-label"
  (onChange)="codeChanged($event)"></wu-inputOtp>
<wu-button label="ยืนยันรหัส" icon="wi wi-check" [disabled]="code.length < 6" (onClick)="verify()"></wu-button>
```
```ts
code = '';
codeChanged(event: { value: string }): void {
  if (event.value.length === 6) this.verify();
}
```

**Inputs**
- `ngModel` · `formControlName`: `string` — the whole code
- `length`: `number` = `4` — number of boxes; `integerOnly`: `boolean` = `false` — digits only (number pad; non-digits skipped on paste); `mask`: `boolean` = `false` — dots like a password
- `size`: `'small' | 'large'`; `variant`: `'outlined' | 'filled'` = `'outlined'`
- `invalid` · `required`: `boolean` = `false`; `readonly` · `disabled`: `boolean` = `false`; `autofocus`: `boolean` = `false` (first box on load)
- `tabindex`: `number`; `name`: `string`
- `ariaLabel` · `ariaLabelledBy`: `string` = from locale — name of the group (`role="group"`); each box announces "Character n of N"
- `styleClass`: `string` — class of each box; `style`: `object` — style of the whole

**Outputs** — `(onChange)`: `{ originalEvent, value }` code changed · `(onFocus)` / `(onBlur)`: Event a box gained/lost focus
**Slots** — `input`: `$implicit` (token, the character), `events`, `index` (starts at 1). Wire `(input)`, `(keydown)`, `(paste)`, `(focus)`, `(blur)` to `events.input/keydown/paste/focus/blur` or moving and pasting break.
```html
<wu-inputOtp name="code" [(ngModel)]="code" [length]="6" [integerOnly]="true" ariaLabel="รหัสยืนยัน 6 หลักจาก SMS">
  <ng-template #input let-token let-events="events" let-index="index">
    <input class="otp-box" type="text" inputmode="numeric" maxlength="1" [value]="token"
      (input)="events.input($event)" (keydown)="events.keydown($event)" (paste)="events.paste($event)"
      (focus)="events.focus($event)" (blur)="events.blur($event)" />
    @if (index === 3) { <span class="otp-dash">-</span> }
  </ng-template>
</wu-inputOtp>
```
Classic (v1/v2): `<ng-template wuTemplate="input" let-token let-events="events" let-index="index">` with `*ngIf`. `pTemplate="input"` also works.
**Keyboard** — ←/→ move, Home/End first/last, Backspace clears and goes back, Delete clears the box.
**Tokens** — --wu-inputotp-gap, --wu-inputotp-input-width, --wu-inputotp-input-sm-width, --wu-inputotp-input-lg-width

**Gotchas**
- Model is a string; when empty it is `''`, so `code.length < 6` is a safe completeness test.
- Without `integerOnly` any character is accepted.
- Custom `input` slot must wire all five `events.*` handlers.
