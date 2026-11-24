# IconField

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-iconfield` + `wu-inputicon` · `WuIconFieldModule` / `WuIconField, WuInputIcon` from `@wirabyte/ui/iconfield`
Also accepted: tags `wu-iconField`, `wu-inputIcon`.

An icon inside a field: icon before the input = left, after = right.

```html
<wu-iconfield>
  <wu-inputicon icon="wi wi-search"></wu-inputicon>
  <input wuInputText placeholder="ค้นหา" />
</wu-iconfield>
<wu-iconfield iconPosition="right">
  <wu-inputicon icon="wi wi-envelope"></wu-inputicon>
  <input wuInputText placeholder="อีเมล" />
</wu-iconfield>
```

**Inputs** — `iconPosition` (on `wu-iconfield`): `'left' | 'right'` — wins over markup order · `icon` (on `wu-inputicon`): `string` — icon class, or project an `<svg>` inside · `styleClass` · `style`: `string` · `object` on either element
**Tokens** — same set as FloatLabel (--wu-field-bg, --wu-field-border, --wu-field-padding-x, --wu-input-radius, --wu-field-placeholder, --wu-primary-color)
