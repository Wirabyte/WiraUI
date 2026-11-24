# ColorPicker

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-colorpicker` · `WuColorPickerModule` / `WuColorPicker` from `@wirabyte/ui/colorpicker` · forms: ngModel / formControlName
Also accepted: `wu-colorPicker`, `wu-color-picker`.

Colour panel (saturation/brightness area, hue strip, hex field), opened from a swatch or placed inline. Value is `#rrggbb`, `{ r, g, b }` or `{ h, s, b }`.

```html
<label for="schoolColor">สีประจำโรงเรียน</label>
<wu-colorPicker inputId="schoolColor" name="schoolColor" [(ngModel)]="schoolColor"></wu-colorPicker>
```
```ts
schoolColor = '#0f766e';   // from the API
```
```html
<wu-colorPicker name="noticeColor" [(ngModel)]="noticeColor" format="rgb" [inline]="true" ariaLabel="สีป้ายประกาศ"></wu-colorPicker>
<wu-colorPicker name="headerColor" [(ngModel)]="headerColor" format="hsb" defaultColor="0f766e" ariaLabel="สีหัวเกียรติบัตร"></wu-colorPicker>
```
```ts
noticeColor = { r: 234, g: 88, b: 12 };
headerColor: { h: number; s: number; b: number } | null = null;
```

**Inputs**
- `format`: `'hex' | 'rgb' | 'hsb'` = `'hex'` — shape of the value going OUT (any of the three shapes is read coming in)
- `inline`: `boolean` = `false` — panel on the page, no swatch
- `defaultColor`: `string` = `'ff0000'` — shown while there is no value
- `disabled`: `boolean` = `false`
- `inputId`: `string` — id of the swatch, for `<label for>`
- `ariaLabel`: `string` (default from locale) · `tabindex`: `number`
- `styleClass` · `style`: extra class/style on the outer element
- `appendTo`, `autoZIndex`, `baseZIndex`, `showTransitionOptions`, `hideTransitionOptions`, `autofocus`: accepted, no effect

**Outputs**
- `(onChange)`: `WuColorPickerChangeEvent` — on every change
- `(onShow)` / `(onHide)`: `void` — panel opened / closed

**Types**
```ts
interface WuColorPickerChangeEvent {
  originalEvent: Event;
  value: string | { r: number; g: number; b: number } | { h: number; s: number; b: number };
}
```
Ranges: rgb 0–255; hsb h 0–360, s and b 0–100.

**Keyboard** — `Enter`/`Space` on the swatch opens; arrows move the focused handle (`Shift` = ten); `Home`/`End` on the hue strip; `Esc` closes and refocuses the swatch.

**Tokens** — `--wu-colorpicker-preview-size`, `--wu-colorpicker-panel-width`, `--wu-colorpicker-panel-padding`, `--wu-colorpicker-area-height`

**Gotchas**
- The hex value has a leading `#` (`'#0f766e'`) but `defaultColor` has none (`'ff0000'`).
- With `format="rgb"|"hsb"` the model is an object; `null`/empty until picked unless you set it.
- Panel opens in the top layer: no `appendTo`.

---
