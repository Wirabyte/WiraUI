# Checkbox

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-checkbox` · `WuCheckboxModule` / `WuCheckbox` from `@wirabyte/ui/checkbox` · forms: ngModel / formControlName
Also accepted: `wu-checkBox`, `wu-check-box` (source).

Two modes. Binary (`[binary]="true"`): model is `trueValue` / `falseValue` (default `true` / `false`). Group (no `binary`): model is an array; checking adds the box's `value`, unchecking removes it.

```html
<wu-checkbox name="agree" [(ngModel)]="agree" [binary]="true" label="ยอมรับเงื่อนไขการใช้งาน"></wu-checkbox>

<!-- group: model is an array -->
@for (t of topics; track t.value) {
<wu-checkbox name="topic" [value]="t.value" [label]="t.label" [(ngModel)]="selected"></wu-checkbox>
}

<!-- stored as 'Y' / 'N' -->
<wu-checkbox name="newsletter" [(ngModel)]="newsletter" [binary]="true" trueValue="Y" falseValue="N" label="รับข่าวสารทางอีเมล"></wu-checkbox>

<form [formGroup]="form">
  <wu-checkbox formControlName="terms" [binary]="true" label="ยอมรับเงื่อนไขการใช้งาน"></wu-checkbox>
</form>
```
```ts
topics = [{ value: 'news', label: 'ข่าวสาร' }, { value: 'deals', label: 'โปรโมชัน' }];
selected: string[] = ['deals'];
form = new FormGroup({ terms: new FormControl(false, Validators.requiredTrue) });
```
(Classic group: `<wu-checkbox *ngFor="let t of topics" ...>`.)

**Inputs** — `binary`: `boolean` = `false` · `value`: `unknown` (this box's value in group mode) · `label`: `string` (clicking it toggles) · `trueValue`: `unknown` = `true` · `falseValue`: `unknown` = `false` · `name`: `string` (name of inner input) · `inputId`: `string` (generated when left out) · `disabled` · `readonly` · `invalid`: `boolean` = `false` · `ariaLabel`: `string` (when there is no label) · `size`: `'small' | 'large' | 'sm' | 'lg'` · `styleClass`: `string` · `style`: `object`

**Outputs** — `(onChange)`: `WuCheckboxChangeEvent` checked or unchecked

**Types**
```ts
interface WuCheckboxChangeEvent { checked: boolean; originalEvent: Event }
```

**Tokens** — `--wu-checkbox-size`, `--wu-checkbox-radius`, `--wu-checkbox-border-width`, `--wu-checkbox-hover-border`, `--wu-checkbox-icon-size`, `--wu-field-bg`, `--wu-field-border`, `--wu-primary-color`, `--wu-primary-contrast`, `--wu-control-focus-shadow`, `--wu-text`

**Gotchas**
- Forgetting `[binary]="true"` makes the model an array (group mode): a lone boolean checkbox must have `binary`.
- In group mode all boxes of a group share the same `[(ngModel)]` array and each needs its own `[value]`.
- `Validators.requiredTrue` is the way to force a checked binary box.
- Turns red by itself when invalid and touched; `[invalid]` forces it. Needs `label` or `ariaLabel` for accessibility.

---
