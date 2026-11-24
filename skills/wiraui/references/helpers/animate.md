# Animate on scroll

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`[data-aos]` · `[wuAnimate]` · `WuAnimateModule` / `WuAnimate` from `@wirabyte/ui/animate`

Elements animate in as they scroll into view. The `data-aos` attributes you already use work as they are, or use the `wuAnimate` directive.

Setup, once:
```ts
// app.config.ts (standalone)
import { provideWuAnimate } from '@wirabyte/ui/animate';
export const appConfig = {
  providers: [provideWiraUI(), provideWuAnimate({ duration: 600, once: true })],
};

// or AppModule
import { WuAnimateModule } from '@wirabyte/ui/animate';
@NgModule({ imports: [WuAnimateModule.forRoot({ duration: 600 })] })
export class AppModule {}
```
```html
<div data-aos="fade-up">…</div>
<div data-aos="fade-up" data-aos-delay="300" data-aos-duration="800" data-aos-easing="ease-out-back">…</div>
<div wuAnimate="zoom-in" [animateDelay]="200" [animateDuration]="600" [animateOnce]="false">…</div>
```

**Attributes / inputs** (attribute · input)
- `data-aos` · `wuAnimate`: `WuAnimation` — animation name
- `data-aos-delay` · `animateDelay`: `number` = `0` — ms
- `data-aos-duration` · `animateDuration`: `number` = `400` — ms
- `data-aos-easing` · `animateEasing`: `string` = `'ease'` — a CSS value or ease-in-back, ease-out-back …
- `data-aos-offset` · `animateOffset`: `number` = `120` — px from the bottom of the screen where it starts
- `data-aos-once` · `animateOnce`: `boolean` = `true` — play only the first time
- `data-aos-mirror` · `animateMirror`: `boolean` = `false` — play out when scrolled past
- `data-aos-anchor-placement` · `animateAnchorPlacement`: `'top-bottom' | 'center-bottom' | 'bottom-bottom'` = `'top-bottom'` — which part must reach the bottom of the screen

**Setup API**
- `provideWuAnimate(options?)`: `WuAnimateOptions` — starts with the app
- `WuAnimateModule.forRoot(options?)`: `WuAnimateOptions` — same for NgModule apps
- `WuAnimateService.init(options?)` · `refresh()` — start by hand / look for new elements
- `disable`: `boolean` = `false` — show everything without animating

**Types**
```ts
type WuAnimation =
  | 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right'
  | 'fade-up-right' | 'fade-up-left' | 'fade-down-right' | 'fade-down-left'
  | 'flip-up' | 'flip-down' | 'flip-left' | 'flip-right'
  | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right'
  | 'zoom-in' | 'zoom-in-up' | 'zoom-in-down' | 'zoom-in-left' | 'zoom-in-right'
  | 'zoom-out' | 'zoom-out-up' | 'zoom-out-down' | 'zoom-out-left' | 'zoom-out-right';
```

**Tokens** — none. Timing comes from the attributes or the `provideWuAnimate()` defaults. CSS lives in `@layer wiraui.utilities`.

**Gotchas**
- Call `provideWuAnimate()` (or `forRoot()`) once: then every `data-aos` element in the page animates, including ones outside Angular templates. Templates using `[wuAnimate]` import `WuAnimateModule` or `WuAnimate`.
- After adding content outside Angular, call `WuAnimateService.refresh()`.
- Reduced-motion users see everything at once. Only watched elements start hidden, so content still shows if the script never runs.
- Demo uses `data-aos-once="false"` to replay on every scroll back into view.
