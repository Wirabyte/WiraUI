# Ripple

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`[wuRipple]` · `WuRippleModule` / `WuRipple` from `@wirabyte/ui/ripple`
Also accepted: `pRipple`

Ink that spreads from where any element is pressed. It turns on and off for the whole app with the theme's ripple setting (`wu-button` has it built in).

```html
<div class="news-card" wuRipple>
  <b>ข่าวประชาสัมพันธ์</b>
</div>
<ul class="menu-list">
  <li wuRipple>ตารางเรียน</li>
</ul>
<div class="news-card" wuRipple [wuRippleDisabled]="true">no ink here</div>
```
```ts
import { inject } from '@angular/core';
import { WuConfig } from '@wirabyte/ui/config';

private readonly config = inject(WuConfig);
rippleOn = this.config.ripple;
setRipple(on: boolean): void { this.config.ripple = on; }   // whole app at once
```

**Inputs** — `wuRipple` · `pRipple`: attribute — ink on this element · `wuRippleDisabled`: `boolean` = `false` — no ink on this element
**App-wide** — `provideWiraUI({ ripple })`: `boolean` = preset's choice (left out: the preset's) · `WuConfig.ripple`: `boolean` — read and change at run time

**Tokens** — none. Ink is the element's own text colour (`currentColor`), faded; set the element's `color` to change it.

**Gotchas**
- Shows only once ripple is on for the app: `provideWiraUI({ ripple: true })` or `WuConfig.ripple = true` (the Material preset turns it on).
- People who ask their device for reduced motion see no ink.
- Class `p-ripple` sits next to `wu-ripple`. Migrating `pRipple` code: only the import changes.
