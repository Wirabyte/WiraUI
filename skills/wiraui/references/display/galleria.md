# Galleria

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: severity values and the style inputs every display component takes.

`wu-galleria` · `WuGalleriaModule` / `WuGalleria` from `@wirabyte/ui/galleria` (type `WuGalleriaResponsiveOptions`)

Photos one at a time with thumbnails, dots and arrows. Autoplay (pauses on hover), circular, swipe, full-screen layer.

```html
<wu-galleria [value]="photos" [numVisible]="4" [(activeIndex)]="photoIndex" [containerStyle]="{ maxWidth: '40rem' }">
  <ng-template #item let-photo>
    <img [src]="photo.src" [alt]="photo.alt" class="gallery-photo" />
  </ng-template>
  <ng-template #thumbnail let-photo>
    <img [src]="photo.src" [alt]="photo.alt" class="gallery-thumb" />
  </ng-template>
</wu-galleria>

<!-- full screen: open at the photo pressed -->
<wu-galleria [value]="photos" [fullScreen]="true" [(visible)]="galleryOpen" [(activeIndex)]="photoIndex"
  [showThumbnails]="false" [showItemNavigators]="true" [circular]="true">
  <ng-template #item let-photo><img [src]="photo.src" [alt]="photo.alt" class="gallery-full" /></ng-template>
</wu-galleria>
```
```ts
photos = [{ src: 'photos/sports.jpg', alt: 'วันกีฬาสี', title: 'วันกีฬาสี', text: '…' } /* … from API */];
photoIndex = 0; galleryOpen = false;
openPhoto(index: number): void { this.photoIndex = index; this.galleryOpen = true; }
```

**Inputs** — `value`: `any[]` · `activeIndex`: `number` = `0` — two-way `[(activeIndex)]` · `numVisible`: `number` = `3` — thumbnails in view · `responsiveOptions`: `WuGalleriaResponsiveOptions[]` · `showThumbnails` · `showThumbnailNavigators`: `boolean` = `true` · `showIndicators` · `showIndicatorsOnItem` · `changeItemOnIndicatorHover`: `boolean` = `false` — dots, dots on the photo, change on hover · `showItemNavigators` · `showItemNavigatorsOnHover`: `boolean` = `false` · `circular`: `boolean` = `false` · `autoPlay`: `boolean` = `false` · `transitionInterval`: `number` = `4000` ms · `thumbnailsPosition` · `indicatorsPosition`: `'bottom' | 'top' | 'left' | 'right'` = `'bottom'` · `verticalThumbnailViewPortHeight`: `string` = `'300px'` — strip height when at the side · `fullScreen`: `boolean` = `false` · `visible`: `boolean` = `false` — two-way `[(visible)]` opens the layer · `containerStyle`: `object` · `containerClass` · `maskClass`: `string` — frame and full-screen backdrop · `styleClass` · `style` · `baseZIndex` · `transitionOptions` · `showTransitionOptions` · `hideTransitionOptions`: `unknown` — accepted, ignored
**Outputs** — `(activeIndexChange)`: `number` — for `[(activeIndex)]` · `(visibleChange)`: `boolean` — for `[(visible)]` (full-screen layer closed)
**Slots** (also `wuTemplate=` / `pTemplate=`) — `item`: `$implicit` (photo), `index` — big photo · `thumbnail`: `$implicit`, `index` · `caption`: `$implicit` (photo) — on the photo · `indicator`: `$implicit` (index) — each dot · `header` · `footer` — above/below the gallery
**Methods** (template ref) — `startSlideShow()` · `stopSlideShow()` · `isAutoPlayActive()`: `boolean`
**Types** — `interface WuGalleriaResponsiveOptions { breakpoint: string /* '768px': applies up to this window width */; numVisible: number }`
**Tokens** — --wu-galleria-radius, --wu-galleria-nav-size, --wu-galleria-indicator-size, --wu-galleria-indicator-bg, --wu-galleria-indicator-active-bg, --wu-galleria-thumbnail-gap, --wu-galleria-thumbnail-radius
**Gotchas**
- Slots: v3 `<ng-template #item let-photo>`, v1/v2 `wuTemplate="item"`.
- Full screen is a dialog in the top layer (focus trapped; X button, Esc or backdrop click close it and focus returns to the opener): no z-index/`baseZIndex` needed. Set `activeIndex` BEFORE opening to start at a given photo.
- Autoplay pauses while the pointer is over it and stops when the reader changes photo; reduced-motion users see no fade.
- Keyboard: focus the photo and use left/right arrows; swipe on touch.
- `<p-galleria>` migrates by tag rename; `p-galleria-*` classes sit next to `wu-galleria-*`.
