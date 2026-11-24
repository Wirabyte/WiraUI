# ImageCropper

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: severity values and the style inputs every display component takes.

`wu-imagecropper` · `WuImageCropperModule` / `WuImageCropper` from `@wirabyte/ui/imagecropper`
Also accepted: tags `wu-imageCropper`, `wu-image-cropper` and **`image-cropper`** (drop-in for apps that already use the `<image-cropper>` tag/inputs/events).

Crops a picture before upload (profile photo, cover). Source from an `<input type=file>` event, `File`, URL or base64; drag the box, zoom, turn, mirror; result is a Blob or base64 at the size you ask for. Phone-camera JPEGs are turned upright from EXIF automatically. No extra library.

```html
<input type="file" accept="image/*" (change)="fileChangeEvent($event)" />
<wu-imagecropper [imageChangedEvent]="imageChangedEvent" [aspectRatio]="1"
  (imageCropped)="imageCropped($event)" (loadImageFailed)="loadImageFailed()"></wu-imagecropper>
@if (croppedUrl) { <img [src]="croppedUrl" alt="รูปที่ตัดแล้ว" width="160" /> }
```
```ts
import { WuImageCroppedEvent } from '@wirabyte/ui/imagecropper';
imageChangedEvent: Event | null = null;
croppedUrl = '';
fileChangeEvent(event: Event): void { this.imageChangedEvent = event; }
imageCropped(event: WuImageCroppedEvent): void {
  this.croppedUrl = event.objectUrl ?? '';   // the component frees the old URL itself
}
```
(classic: `@if` -> `*ngIf`.)

**Blob vs base64 output**
- `output="blob"` (default): `event.blob` + `event.objectUrl` (drop straight into `<img [src]>`); upload with `FormData` (`formData.append('photo', event.blob, 'profile.png')`).
- `output="base64"`: `event.base64` is a data URL (`data:image/png;base64,…`) for text/JSON. Turn back into a file with `base64ToFile(event.base64 ?? '')`.
- Per call: `await cropper.crop('base64')` or `crop('blob')` overrides the input once.
- App-wide defaults: `provideImageCropperOptions({ output: 'base64', format: 'jpeg', imageQuality: 85, toolbar: ['zoom', '|', 'rotate'] })` in `app.config.ts` providers (v3) / NgModule `providers` (v1/v2); inputs on the component always win.

**Inputs — source** — `imageChangedEvent`: `Event` — `(change)` event of an `input type="file"` (first file opened) · `imageFile`: `File | Blob` · `imageURL`: `string` — same origin or CORS-enabled so the result can be read · `imageBase64`: `string` — data URL or bare base64
**Inputs — result** — `format`: `'png' | 'jpeg' | 'webp' | 'bmp' | 'ico'` = `'png'` (bmp/ico come out as png) · `imageQuality`: `number` = `92` — 0–100, jpeg/webp · `output`: `'blob' | 'base64'` = `'blob'` · `resizeToWidth` · `resizeToHeight`: `number` = `0` — result size px (0 = box size; both = fits inside both) · `onlyScaleDown`: `boolean` = `false` — never enlarge a smaller crop · `backgroundColor`: `string` — fills transparent areas (jpeg without one gets white) · `autoCrop`: `boolean` = `true` — crop after every change (`false`: call `crop()` yourself)
**Inputs — box** — `aspectRatio`: `number | string` = `1` — `1`, `4 / 3`, `'4/3'`, `'16:9'` · `maintainAspectRatio`: `boolean` = `true` · `containWithinAspectRatio`: `boolean` = `false` — pad so the whole picture fits (filled with `backgroundColor`) · `cropperMinWidth` · `cropperMinHeight` · `cropperMaxWidth` · `cropperMaxHeight`: `number` = `0` — image pixels, 0 = none · `cropperStaticWidth` · `cropperStaticHeight`: `number` = `0` — fixed-size box (set both; moves, doesn't resize) · `roundCropper`: `boolean` = `false` — circular box (result still a rectangle: show with `border-radius: 50%`) · `hideResizeSquares`: `boolean` = `false` — hide handles · `cropper`: `CropperPosition` — box in image pixels, two-way `[(cropper)]`
**Inputs — transform** — `canvasRotation`: `number` = `0` — quarter turns clockwise (negative = anticlockwise) · `transform`: `WuImageTransform` — two-way `[(transform)]`, toolbar changes it too · `rotation` · `zoom`: `number` — degrees / zoom (1 = whole picture), override `transform` · `maxZoom`: `number` = `10` · `alignImage`: `'center' | 'left'` = `'center'`
**Inputs — UI** — `showToolbar`: `boolean` = `true` (false hides the whole bar, `tools` template included) · `toolbar`: `WuImageCropperToolbar` = `'full'` — `'full'`, `'none'` (the `tools` template still shows) or a list such as `['zoom', '|', 'rotateLeft', 'rotateRight']`; `'|'` starts a new group · `disabled`: `boolean` = `false` · `ariaLabel` · `imageAltText` · `cropperFrameAriaLabel`: `string` = locale · `styleClass` · `style` · `allowMoveImage` · `initialStepSize` · `checkImageType` · `options`: `unknown` — accepted, ignored (compat)
**Outputs** — `(imageCropped)`: `WuImageCroppedEvent` — after each change with `autoCrop` · `(startCropImage)`: `void` · `(imageLoaded)`: `WuLoadedImage` — sizes + EXIF values · `(cropperReady)`: `CropDimensions` — shown size in CSS px · `(loadImageFailed)`: `void` · `(cropperChange)`: `CropperPosition` — for `[(cropper)]` · `(transformChange)`: `WuImageTransform` — for `[(transform)]`
**Methods** (via template ref) — `crop(output?)`: `Promise<WuImageCroppedEvent | null>` (null while no picture) · `resetCrop()` — box back, zoom 1 · `reset()` — also zoom/turns/mirrors (toolbar reset) · `rotateLeft()` · `rotateRight()` · `flipHorizontal()` · `flipVertical()` · `zoomIn()` · `zoomOut()` (x1.25)
**Slots** — `tools`: `$implicit` = the `WuImageCropper` — app buttons as the toolbar's last group, e.g. `<ng-template #tools let-cropper><wu-button label="ใช้รูปนี้" (onClick)="usePhoto(cropper)"/></ng-template>` (v1/v2: `wuTemplate="tools"`); `cropper.crop()`, `.rotateRight()` etc. callable directly
**Helpers / providers** — `base64ToFile(base64, type?)`: `Blob` (from `@wirabyte/ui/imagecropper` or `@wirabyte/ui/core`) · `provideImageCropperOptions(options)`
**Types**
```ts
type WuImageCropperFormat = 'png' | 'jpeg' | 'webp' | 'bmp' | 'ico';
type WuImageCropperTool = 'zoomOut' | 'zoomSlider' | 'zoomIn' | 'rotateLeft' | 'rotateRight' | 'flipHorizontal' | 'flipVertical' | 'reset'
  | 'zoom' | 'rotate' | 'flip';   // zoom = out+slider+in · rotate = left+right · flip = horizontal+vertical
type WuImageCropperToolbar = 'full' | 'none' | ReadonlyArray<WuImageCropperTool | '|'>;
interface WuImageCropperOptions { output?: 'blob' | 'base64'; format?: WuImageCropperFormat; imageQuality?: number; toolbar?: WuImageCropperToolbar; maxZoom?: number }
interface WuImageCroppedEvent {
  blob?: Blob | null; objectUrl?: string | null; base64?: string | null;
  width: number; height: number;
  cropperPosition: CropperPosition;   // on screen (CSS px)
  imagePosition: CropperPosition;     // in the picture (image px, after rotation)
}
interface WuImageTransform { scale?: number /* 1 = whole */; rotate?: number /* deg clockwise */; flipH?: boolean; flipV?: boolean }
interface WuLoadedImage { original: { size: CropDimensions }; transformed: { size: CropDimensions }; exifTransform: { rotate: number; flip: boolean } }
interface CropperPosition { x1: number; y1: number; x2: number; y2: number }
interface CropDimensions { width: number; height: number }
// old names work too: ImageCroppedEvent, ImageTransform, LoadedImage, Dimensions, OutputFormat
```
**Tokens** — --wu-imagecropper-radius, --wu-imagecropper-border-width, --wu-imagecropper-bg, --wu-imagecropper-mask, --wu-imagecropper-line, --wu-imagecropper-grid-color, --wu-imagecropper-handle-size, --wu-imagecropper-handle-bg, --wu-imagecropper-handle-border, --wu-imagecropper-min-height, --wu-imagecropper-max-height, --wu-imagecropper-toolbar-padding, --wu-imagecropper-toolbar-gap
**Gotchas**
- Migrating from `<image-cropper>`: swap the module import to `WuImageCropperModule`/`WuImageCropper`; tag, inputs, events and type names stay (import path changes to `@wirabyte/ui/imagecropper`). Result is a **blob by default**: code reading `event.base64` must add `output="base64"`. Replace a hand-written base64-to-file with `base64ToFile()`.
- The cropper keeps the height it had when the picture loaded (turning never moves the page).
- Result is capped at 16.7 megapixels (iOS canvas limit).
- Keyboard: Tab to box, arrows move (Shift = 10x), Alt+arrows resize, `+`/`−` grow/shrink; Ctrl+wheel or pinch zooms; while zoomed, dragging outside the box pans.
- With `[autoCrop]="false"` nothing is emitted until you call `crop()`.
- Docs use `<wu-selectbutton>` for ratio switching: bind `[aspectRatio]="ratio" [maintainAspectRatio]="ratio !== 'free'"`.
