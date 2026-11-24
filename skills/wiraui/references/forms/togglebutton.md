# ToggleButton

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-togglebutton` · `WuToggleButtonModule` / `WuToggleButton` from `@wirabyte/ui/togglebutton` · forms: ngModel / formControlName
Also accepted: `wu-toggleButton`, `wu-toggle-button` (source).

Button that toggles a boolean, with its own label and icon per state.

```html
<wu-togglebutton name="following" [(ngModel)]="following" onLabel="ติดตามแล้ว" offLabel="ติดตาม"
  onIcon="wi wi-check" offIcon="wi wi-plus"></wu-togglebutton>

<form [formGroup]="form">
  <wu-togglebutton formControlName="notify" onLabel="แจ้งเตือนเปิด" offLabel="แจ้งเตือนปิด"></wu-togglebutton>
</form>
```
```ts
form = new FormGroup({ notify: new FormControl(true) });
```

**Inputs** — `onLabel`: `string` = `ใช่ / yes` (shown in the app language) · `offLabel`: `string` = `ไม่ / no` · `onIcon` · `offIcon`: `string` · `iconPos`: `'left' | 'right'` = `'left'` · `inputId` · `ariaLabel`: `string` · `disabled` · `invalid`: `boolean` = `false` · `size`: `'small' | 'large' | 'sm' | 'lg'` · `styleClass`: `string` · `style`: `object`

**Outputs** — `(onChange)`: `WuToggleButtonChangeEvent` toggled

**Types**
```ts
interface WuToggleButtonChangeEvent { checked: boolean; originalEvent: Event }
```

**Tokens** — `--wu-togglebutton-bg`, `--wu-togglebutton-border`, `--wu-togglebutton-color`, `--wu-togglebutton-hover-color`, `--wu-togglebutton-checked-bg`, `--wu-togglebutton-checked-color`, `--wu-togglebutton-chip-bg`, `--wu-togglebutton-padding`, `--wu-togglebutton-content-padding-x`

**Gotchas**
- Model is a boolean only; there are no `trueValue` / `falseValue` or `label` inputs, only `onLabel` / `offLabel`.
- `ariaLabel` sets the accessible name.

---
