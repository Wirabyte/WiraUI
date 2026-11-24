# ToggleSwitch

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-toggleswitch` · `WuToggleSwitchModule` / `WuToggleSwitch` from `@wirabyte/ui/toggleswitch` · forms: ngModel / formControlName
Also accepted: `wu-toggleSwitch`, `wu-inputSwitch`, `wu-inputswitch`, `wu-toggle-switch` (so moving from PrimeNG `p-inputSwitch` is a prefix change).

On / off switch with a built-in label; underneath is a real checkbox with `role="switch"`.

```html
<wu-toggleswitch name="newsletter" [(ngModel)]="newsletter" label="รับข่าวสารทางอีเมล"></wu-toggleswitch>

<wu-toggleswitch name="status" [(ngModel)]="status" trueValue="active" falseValue="inactive" label="เปิดใช้งานบัญชี"></wu-toggleswitch>

<form [formGroup]="form">
  <wu-toggleswitch formControlName="email" label="แจ้งเตือนทางอีเมล"></wu-toggleswitch>
</form>
```
```ts
form = new FormGroup({ email: new FormControl(true), sms: new FormControl(false) });
// this.form.controls.sms.disable() shows the switch as disabled
```

**Inputs** — `label`: `string` · `trueValue`: `unknown` = `true` · `falseValue`: `unknown` = `false` · `name` · `inputId`: `string` · `disabled` · `readonly` · `invalid`: `boolean` = `false` · `ariaLabel`: `string` (when no label) · `size`: `'small' | 'large' | 'sm' | 'lg'` · `styleClass`: `string` · `style`: `object`

**Outputs** — `(onChange)`: `WuToggleSwitchChangeEvent` toggled

**Types**
```ts
interface WuToggleSwitchChangeEvent { checked: boolean; originalEvent: Event }
```

**Tokens** — `--wu-switch-width`, `--wu-switch-height`, `--wu-switch-track-bg`, `--wu-switch-track-checked-bg`, `--wu-switch-track-hover-bg`, `--wu-switch-handle-bg`, `--wu-switch-handle-size`, `--wu-switch-handle-shadow`, `--wu-switch-border-color`, `--wu-control-focus-shadow`, `--wu-transition`

**Gotchas**
- Unlike Checkbox there is no `binary` input: the model is always `trueValue` / `falseValue` (default boolean).

---
