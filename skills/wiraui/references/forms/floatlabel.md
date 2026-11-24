# FloatLabel

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-floatlabel` · `WuFloatLabelModule` / `WuFloatLabel` from `@wirabyte/ui/floatlabel`

A label that sits in the field and floats away on focus or once there is a value. Put the `<label>` after the field. `wuInputText` / `wuTextarea` add `wu-filled` for you.

```html
<wu-floatlabel>
  <input wuInputText id="fl-name" name="name" [(ngModel)]="name" />
  <label for="fl-name">ชื่อ-นามสกุล</label>
</wu-floatlabel>
<wu-floatlabel variant="on">…</wu-floatlabel>
```

**Inputs** — `variant`: `'over' | 'on' | 'in'` = `'over'` — floated label above the field / on the border / inside a taller field; `styleClass` · `style`: `string` · `object`
**Tokens** — --wu-field-bg, --wu-field-border, --wu-field-padding-x (icons and labels follow it), --wu-input-radius, --wu-field-placeholder (icon and resting label colour), --wu-primary-color (floated label on focus)

**Gotchas**
- Label must come after the field in the DOM.
- Verified for `wuInputText` / `wuTextarea`; other controls are not documented.
