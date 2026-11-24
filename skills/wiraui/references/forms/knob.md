# Knob

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-knob` · `WuKnobModule` / `WuKnob` from `@wirabyte/ui/knob` · forms: ngModel / formControlName / `[formControl]`

Ring you drag around, click or key to pick a number in a range (volume, percentage).

```html
<wu-knob name="volume" [(ngModel)]="volume" ariaLabel="ระดับเสียงประกาศ" (onChange)="volumeChanged($event)"></wu-knob>
<wu-knob name="progress" [(ngModel)]="progress" [step]="5" valueTemplate="{value}%" ariaLabel="ความคืบหน้าของงาน"></wu-knob>
<wu-knob name="temperature" [(ngModel)]="temperature" [min]="-10" [max]="40" valueTemplate="{value}°C" ariaLabel="อุณหภูมิห้อง"></wu-knob>
<wu-knob name="score" [(ngModel)]="score" [size]="80" valueColor="#16a34a" rangeColor="#dcfce7" textColor="#166534" ariaLabel="คะแนนจิตพิสัย"></wu-knob>
```
```ts
volume = 40;
volumeChanged(value: number): void { this.lastVolume = value; }   // payload is the number itself
```

**Inputs**
- `ngModel` · `formControlName`: `number`
- `min`, `max`: `number` = `0`, `100` (negative works) · `step`: `number` = `1`
- `valueTemplate`: `string` = `'{value}'` — text in the middle, `{value}` = number
- `showValue`: `boolean` = `true`
- `size`: `number` = `100` (px) · `strokeWidth`: `number` = `14`
- `valueColor`, `rangeColor`, `textColor`: `string` = theme token — chosen part · rest of the ring · text
- `readonly`, `disabled`: `boolean` = `false` (readonly stays focusable and readable by screen readers)
- `required`, `invalid`: `boolean` = `false` — red edge like other fields
- `ariaLabel`, `ariaLabelledBy`: `string` · `tabindex`: `number` = `0` · `name`: `string`
- `styleClass`: `string` · `style`: `object`

**Outputs** — `(onChange)`: `number` — the new value (not an event object).

**Keyboard / ARIA** — `role="slider"` with min, max, value and `valueTemplate` text; `↑`/`→` up, `↓`/`←` down by `step`; `Page Up`/`Page Down` ten steps; `Home`/`End` ends.

**Tokens** — `--wu-knob-value-color`, `--wu-knob-range-color`, `--wu-knob-text-color`, `--wu-knob-text-size`

**Gotchas**
- `(onChange)` emits a bare `number`, unlike Slider/ColorPicker which emit an event object.
- Value is always a number; reactive `new FormControl(6, { nonNullable: true })` is the documented form.
- Set `ariaLabel`/`ariaLabelledBy`.

---
