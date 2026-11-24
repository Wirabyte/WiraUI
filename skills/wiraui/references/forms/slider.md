# Slider

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-slider` · `WuSliderModule` / `WuSlider` from `@wirabyte/ui/slider` · forms: ngModel / formControlName

Drag a handle along a track: one number or a range (two handles), horizontal or vertical. Click the track to jump.

```html
<label id="volume-label">ระดับเสียงประกาศ</label>
<wu-slider name="volume" [(ngModel)]="volume" ariaLabelledBy="volume-label" [style]="{ width: '16rem' }"></wu-slider>
<span>{{ volume }}%</span>
```
```ts
volume = 60;
```
```html
<wu-slider name="passMark" [(ngModel)]="passMark" [min]="40" [max]="80" [step]="5" ariaLabelledBy="pass-label"></wu-slider>
<wu-slider name="scoreRange" [(ngModel)]="scoreRange" [range]="true" ariaLabelledBy="range-label"></wu-slider>   <!-- scoreRange = [60, 80] -->
<wu-slider name="brightness" [(ngModel)]="brightness" orientation="vertical" ariaLabel="ความสว่างจอ" [style]="{ height: '10rem' }"></wu-slider>
<!-- save once the handle is let go -->
<wu-slider name="bellVolume" [(ngModel)]="bellVolume" [step]="10" ariaLabel="ระดับเสียงประกาศ" [disabled]="isApiSaving" (onSlideEnd)="saveVolume($event)"></wu-slider>
```
```ts
import { WuSliderChangeEvent } from '@wirabyte/ui/slider';
saveVolume(event: WuSliderChangeEvent): void { this.api.save(event.value) /* event.values for range */ }
```

**Inputs**
- `min`, `max`: `number` = `0`, `100`
- `step`: `number` = `1` — value snaps to nearest step (`0` = any value)
- `range`: `boolean` = `false` — two handles; value is `[from, to]`, handles cannot cross, a track press moves the nearer one
- `orientation`: `'horizontal' | 'vertical'` = `'horizontal'` (vertical: low at the bottom; set height with `[style]`)
- `disabled`: `boolean` = `false` (or disable the FormControl)
- `ariaLabel`, `ariaLabelledBy`: `string` · `tabindex`: `number` = `0`
- `styleClass` · `style`: outer element
- `animate`, `autofocus`: accepted, no effect

**Outputs**
- `(onChange)`: `WuSliderChangeEvent` — every change, including while dragging
- `(onSlideEnd)`: `WuSliderChangeEvent` — handle let go, or after a key press

**Types**
```ts
interface WuSliderChangeEvent { originalEvent?: Event; event?: Event; value?: number; values?: number[] /* [range]="true" */ }
```

**Keyboard** — arrows ±step, `Page Up`/`Page Down` ±10 steps, `Home`/`End` to min/max.

**Tokens** — `--wu-slider-track-size`, `--wu-slider-track-bg`, `--wu-slider-handle-size`, `--wu-slider-handle-bg`, `--wu-slider-handle-border-width`

**Gotchas**
- Model is `number`, or `number[]` with `[range]="true"`; event has `value` OR `values` (the other is undefined).
- Use `(onSlideEnd)` (not `(onChange)`) to save to an API.
- Always set `ariaLabel` or `ariaLabelledBy`.
- Width is not set by the component: give it one via `[style]`.

---
