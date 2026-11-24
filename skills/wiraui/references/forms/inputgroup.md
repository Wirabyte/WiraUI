# InputGroup

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-inputgroup` + `wu-inputgroup-addon` · `WuInputGroupModule` / `WuInputGroup, WuInputGroupAddon` from `@wirabyte/ui/inputgroup`
Also accepted: tags `wu-inputGroup`, `wu-inputGroupAddon`.

Joins fields, add-ons and buttons into one row with shared borders.

```html
<wu-inputgroup>
  <wu-inputgroup-addon>฿</wu-inputgroup-addon>
  <input wuInputText placeholder="ราคา" />
  <wu-inputgroup-addon>.00</wu-inputgroup-addon>
</wu-inputgroup>
<wu-inputgroup>
  <input wuInputText placeholder="ค้นหาคำสั่งซื้อ" />
  <wu-button label="ค้นหา" icon="wi wi-search"></wu-button>
</wu-inputgroup>
```

**Inputs** — `styleClass` · `style`: `string` · `object` on `wu-inputgroup` / `wu-inputgroup-addon`. Add-on holds text or an icon (`<i class="wi wi-user"></i>`).
**Tokens** — --wu-field-bg, --wu-field-border (shared), --wu-field-padding-x (add-on), --wu-input-radius (both ends), --wu-field-placeholder (add-on colour)
