# RadioButton

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-radiobutton` · `WuRadioButtonModule` / `WuRadioButton` from `@wirabyte/ui/radiobutton` · forms: ngModel / formControlName
Also accepted: `wu-radioButton`, `wu-radio-button` (source).

Single choice. Give every radio in a group the same `name` and the same field / `formControlName`; each has its own `value`.

```html
<wu-radiobutton name="plan" value="free" [(ngModel)]="plan" label="Free"></wu-radiobutton>
<wu-radiobutton name="plan" value="pro" [(ngModel)]="plan" label="Pro"></wu-radiobutton>

<form [formGroup]="form">
  <wu-radiobutton name="billing" value="monthly" formControlName="billing" label="รายเดือน"></wu-radiobutton>
  <wu-radiobutton name="billing" value="yearly" formControlName="billing" label="รายปี"></wu-radiobutton>
</form>

<!-- layout: wrap in <div class="flex flex-column gap-2"> or <div class="flex flex-wrap gap-4"> (@wirabyte/ui/utils) -->

@for (s of sizes; track s.value) {
<wu-radiobutton name="size" [value]="s.value" [label]="s.label" [(ngModel)]="size"></wu-radiobutton>
}
```
```ts
form = new FormGroup({ billing: new FormControl('', Validators.required) });
// radios share one FormControl; picking one clears the others, also with form.patchValue({ billing: 'yearly' })
```

**Inputs** — `value`: `unknown` (this option's value) · `name`: `string` (group name, same for every radio in the group) · `label`: `string` · `inputId`: `string` · `disabled` · `invalid`: `boolean` = `false` · `ariaLabel`: `string` · `size`: `'small' | 'large' | 'sm' | 'lg'` · `styleClass`: `string` · `style`: `object`

**Outputs** — `(onClick)`: `WuRadioButtonClickEvent` this option was picked

**Types**
```ts
interface WuRadioButtonClickEvent { value: unknown; originalEvent: Event }
```

**Tokens** — `--wu-radio-size`, `--wu-radio-border-width`, `--wu-radio-checked-bg`, `--wu-radio-checked-border`, `--wu-radio-dot-color`, `--wu-radio-dot-size`, `--wu-field-bg`, `--wu-field-border`, `--wu-control-focus-shadow`, `--wu-text`

**Gotchas**
- There is no group wrapper component and no `options` input: repeat `<wu-radiobutton>` yourself (or loop).
- Forgetting the shared `name` on every radio breaks grouping; all radios must also bind the same model / control.
- `readonly` is not documented for RadioButton (it is for Checkbox / ToggleSwitch).
- For a one-of-few choice shown as joined buttons or cards use SelectButton instead.

---
