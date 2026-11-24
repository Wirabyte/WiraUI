# Carousel

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: severity values and the style inputs every display component takes.

`wu-carousel` · `WuCarouselModule` (brings `wuTemplate`, `<wu-header>`, `<wu-footer>`) / `WuCarousel` from `@wirabyte/ui/carousel`

Shows a few items at a time in a sliding row (news, products) with arrows and page bars. Fewer items on narrow screens, autoplay, circular, swipe, vertical.

```html
<wu-carousel [value]="news" [numVisible]="3" [numScroll]="1" [responsiveOptions]="responsiveOptions">
  <ng-template #item let-news>
    <article class="news-card">
      <img [src]="news.image" [alt]="news.title" />
      <wu-tag [value]="news.tag"></wu-tag>
      <h3>{{ news.title }}</h3>
    </article>
  </ng-template>
</wu-carousel>
```
```ts
responsiveOptions = [
  { breakpoint: '1024px', numVisible: 2, numScroll: 1 },   // at or below 1024px: 2 items; at or below 640px: 1
  { breakpoint: '640px', numVisible: 1, numScroll: 1 },
];
```

**Inputs** — `value`: `any[]` = `[]` · `page`: `number` = `0` — page in view, two-way `[(page)]` · `numVisible`: `number` = `1` · `numScroll`: `number` = `1` · `responsiveOptions`: `CarouselResponsiveOptions[]` — `[{ breakpoint: '768px', numVisible: 1, numScroll: 1 }]`, each applies at or below its breakpoint · `orientation`: `'horizontal' | 'vertical'` = `'horizontal'` · `verticalViewPortHeight`: `string` = `'300px'` · `circular`: `boolean` = `false` (needs more items than fit) · `autoplayInterval`: `number` = `0` — ms between pages (0 = off); loops, pauses on hover/focus, stops for good after user changes page · `showIndicators` · `showNavigators`: `boolean` = `true` · `prevButtonProps` · `nextButtonProps`: `{ icon?, ariaLabel?, styleClass? }` · `contentClass` · `indicatorsContentClass` · `indicatorStyleClass`: `string` · `indicatorsContentStyle` · `indicatorStyle`: `object` · `styleClass` · `style`
**Outputs** — `(onPage)`: `{ page: number }` — page changed · `(pageChange)`: `number` — for `[(page)]`
**Slots** (also `wuTemplate=` / `pTemplate=`) — `item`: `$implicit` (item), `index` · `header` · `footer` (or `<wu-header>` / `<wu-footer>`) · `previousicon` · `nexticon`
**Tokens** — --wu-carousel-content-gap, --wu-carousel-nav-size, --wu-carousel-nav-color, --wu-carousel-nav-hover-bg, --wu-carousel-nav-hover-color, --wu-carousel-indicator-list-padding, --wu-carousel-indicator-gap, --wu-carousel-indicator-width, --wu-carousel-indicator-height, --wu-carousel-indicator-radius, --wu-carousel-indicator-bg, --wu-carousel-indicator-hover-bg, --wu-carousel-indicator-active-bg, --wu-carousel-transition-duration
**Gotchas**
- Item slot: v3 `<ng-template #item let-news>`, v1/v2 `<ng-template wuTemplate="item" let-news>`.
- One page bar per page; `numScroll` controls how many items each move goes by.
- Reduced-motion users get the change without the slide; autoplay doesn't announce every change.
- Vertical: `orientation="vertical" verticalViewPortHeight="320px"`.
- Keyboard: page bars are one Tab stop (←/→/Home/End move, Enter/Space go to page).
- `<p-carousel>` migrates by tag rename; inputs/events keep names.
