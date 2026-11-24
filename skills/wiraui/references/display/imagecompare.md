# ImageCompare

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: severity values and the style inputs every display component takes.

`wu-imageCompare` · `WuImageCompareModule` (brings `wuTemplate`) / `WuImageCompare` from `@wirabyte/ui/imagecompare`
Also accepted: `wu-imagecompare`, `wu-image-compare`; `pTemplate="left|right"`.

Two pictures in one frame with a draggable divider (before/after). Mouse, pen, touch (sideways swipe first, so vertical swipes still scroll) or keyboard. Frame is 16:9 by default.

```html
<!-- the after picture (left) fills the frame; the before picture (right) shows from the left edge to the divider -->
<wu-imageCompare [(value)]="divider" [step]="5" ariaLabel="เทียบภาพก่อนและหลังปรับสี" [style]="{ maxWidth: '36rem' }">
  <ng-template #left><img src="photos/school-colour.jpg" alt="ภาพสีหลังปรับ" /></ng-template>
  <ng-template #right><img src="photos/school-old.jpg" alt="ภาพขาวดำก่อนปรับสี" /></ng-template>
</wu-imageCompare>
```
```ts
divider = 30;   // divider position, 0–100 from the left edge
```

**Inputs** — `value`: `number` = `50` — divider position in % from the start edge, two-way `[(value)]` · `step`: `number` = `1` — % per arrow key · `tabindex`: `number` = `0` — Tab order of the handle · `ariaLabel` · `ariaLabelledby`: `string` = locale (`ariaLabelledBy` works too) · `styleClass` · `style`
**Outputs** — `(valueChange)`: `number` — divider moved (for `[(value)]`)
**Slots** — `left`: picture filling the frame (seen RIGHT of the divider) · `right`: picture shown from the start edge to the divider (seen LEFT of it)
**Keyboard** — handle is `role="slider"` and the only Tab stop: arrows move by `step`, Page Up/Down by 10, Home/End to edges. RTL pages: start edge is right, arrows swap automatically.
**Tokens** — --wu-imagecompare-aspect-ratio (16 / 9), --wu-imagecompare-radius, --wu-imagecompare-bg, --wu-imagecompare-divider-width, --wu-imagecompare-divider-color, --wu-imagecompare-handle-size, --wu-imagecompare-handle-bg, --wu-imagecompare-handle-color, --wu-imagecompare-handle-shadow
**Gotchas**
- **Slot names feel backwards**: to read "before | after" left to right, put the BEFORE picture in `right` and the AFTER picture in `left`.
- An `<img>` inside fills the frame (`object-fit: cover`).
- Slots: v3 `<ng-template #left>`, v1/v2 `wuTemplate="left"`.
