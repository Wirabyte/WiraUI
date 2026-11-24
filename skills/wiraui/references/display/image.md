# Image

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: severity values and the style inputs every display component takes.

`wu-image` · `WuImageModule` (also exports `WuTemplate`) / `WuImage` from `@wirabyte/ui/image`

A picture that opens full screen on demand (rotate, zoom 0.5–1.5×; Esc / close button / click beside the picture closes). The full-screen view can load a larger file. Opens in a modal `<dialog>` in the top layer; never wider than its container.

```html
<wu-image src="samples/school-thumb.svg" previewImageSrc="samples/school-large.svg" alt="อาคารเรียนของโรงเรียน"
  width="240" [preview]="true" (onShow)="..." (onHide)="..."></wu-image>

<wu-image [preview]="true" (onImageError)="useStandIn()">
  <ng-template #image let-errorCallback="errorCallback">
    <img [src]="photoSrc" alt="รูปนักเรียน" width="160" height="160" (error)="errorCallback($event)" />
  </ng-template>
</wu-image>
```

**Inputs** — `src` · `alt`: `string` — picture and alt text (alt also names the full-screen view: always set it) · `srcSet` · `sizes`: `string` — as on `<img>` · `width` · `height`: `string | number` — size of the `<img>` · `loading`: `'lazy' | 'eager'` · `imageClass` · `imageStyle`: `string` · `object` — on the `<img>` · `styleClass` · `style` — on the box around it · `preview`: `boolean` = `false` — button over picture opening full screen · `previewImageSrc` · `previewImageSrcSet` · `previewImageSizes`: `string` = `src` — file(s) for the full-screen view · `appendTo` · `showTransitionOptions` · `hideTransitionOptions`: `unknown` — accepted, ignored
**Outputs** — `(onShow)`: `void` — full-screen opened · `(onHide)`: `void` — closed · `(onImageError)`: `Event` — picture failed to load
**Slots** (also `wuTemplate=` / `pTemplate=`) — `indicator`: content of the open button (replaces eye icon) · `image`: context `errorCallback` — draw the `<img>` yourself; wire `(error)` to `errorCallback` so `(onImageError)` still runs · `preview`: `$implicit` (src), `class`, `style` (carries rotation/zoom), `previewCallback` (closes the view)
**Tokens** — --wu-image-indicator-bg, --wu-image-indicator-color, --wu-image-mask-bg, --wu-image-action-bg, --wu-image-action-hover-bg, --wu-transition
**Gotchas**
- `styleClass`/`style` hit the wrapper box; `imageClass`/`imageStyle` hit the `<img>`.
- `appendTo` and transition options are accepted-but-ignored (top layer).
- `<p-image>` migrates by tag rename; `pTemplate="indicator|image|preview"` still works.
- Slot syntax: v3 `<ng-template #preview ...>`, v1/v2 `wuTemplate="preview"`.
