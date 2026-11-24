# Utility classes: `@wirabyte/ui/utils`

Ready-made, mobile-first classes for layout, spacing, sizing, type and colour, bundled with `@wirabyte/ui` (no separate utility library). Class names match what existing apps already use. Colours and radii read `--wu-*` tokens, so they follow preset and dark mode. They are off unless you include them (`ng add` asks; skip with `--utils=false`).

```scss
// src/styles.scss: whole set
@use '@wirabyte/ui/utils';

// or pick
@use '@wirabyte/ui/utils' with (
  $groups: (palette: false, shadows: false),   // drop groups you do not use
  $prefix: 'u-',                               // .u-flex, .md:u-col-6 (run next to another utility library)
  $responsive: true,                           // false = no sm: md: lg: xl: variants
  $breakpoints: (sm: 576px, md: 768px, lg: 992px, xl: 1200px),
  $layer: false,                               // false = not inside @layer
  $important: false
);
```
Plain CSS: add `"node_modules/@wirabyte/ui/utils/utils.min.css"` to angular.json `styles`.

Other options in the source (`utils/_index.scss`): `$columns` (default 12), `$gutter` (default 0.5rem), `$layer` default `'wiraui.utilities'`. `$groups` keys (all on by default): `display, flex, grid, forms, spacing, sizing, typography, colors, palette, borders, shadows, position, overflow, misc`; unknown key or non-boolean value is a compile error.

Layer: classes live in `@layer wiraui.utilities`, so they beat component styles and lose to the app's own CSS.

Responsive prefixes (min-width): `sm:` 576px · `md:` 768px · `lg:` 992px · `xl:` 1200px, e.g. `col-12 md:col-6 lg:col-3`.

**Class families**
- **Grid** (12-column flexbox): `grid` on the wrapper, `col-1 … col-12`, `col` (equal share), `col-fixed` (content width), `col-offset-N`, `grid-nogutter`; gutter via `--wu-grid-gutter` (e.g. `.dense { --wu-grid-gutter: 0.25rem }`)
- **Flex**: `flex · inline-flex`, `flex-row · flex-column (-reverse)`, `flex-wrap · flex-nowrap`, `justify-content-start|center|end|between|around|evenly`, `align-items-start|center|end|stretch|baseline`, `align-self-*`, `gap-0 … gap-8` (+ `row-gap-*`, `column-gap-*`), `flex-order-0 … flex-order-6`, `flex-1 · flex-auto · flex-none · flex-grow-* · flex-shrink-*`
- **Spacing**: padding/margin scale 0–8 = 0, .25, .5, 1, 1.5, 2, 3, 4, 5rem; `p-* pt-* pr-* pb-* pl-* px-* py-*`, `m-* mt-* mx-* …`, `m-auto · mx-auto · ml-auto`, negative `-m-1 … -m-8`, `-mt-*`
- **Sizing**: `w-full · w-screen · w-auto · w-min · w-max · w-fit`, `w-1 … w-12` (share of 12), `w-1rem … w-30rem`; `h-*` same; `min-w-0 · min-w-full · min-h-screen`, `max-w-full · max-h-screen`
- **Typography**: `text-xs|sm|base|lg|xl|2xl … 8xl`, `font-light|normal|medium|semibold|bold`, `line-height-1 … 4`, `text-left|center|right|justify`, `uppercase · lowercase · capitalize`, `underline · line-through · no-underline · font-italic`, `white-space-nowrap · text-overflow-ellipsis`
- **Colours**: `text-color · text-color-secondary · text-primary · bg-primary`; surfaces `surface-ground · surface-section · surface-card · surface-overlay · surface-hover · surface-border`, `surface-0 … surface-950`; `text- / bg- / border-primary-50 … 950`; `text- / bg- / border-gray-*` (= theme surface); semantic `text- / bg- / border-success|info|warn|danger|help`
- **Palette** (fixed colours, ignore the theme; shades 50–900): blue, green, yellow, cyan, pink, indigo, teal, orange, bluegray, purple, red, emerald, lime, sky, violet, fuchsia, rose, amber, e.g. `bg-teal-100 text-teal-800`
- **Borders and shadows**: `border-1|2|3 · border-none`, `border-top-* · right · bottom · left · x · y`, `border-solid|dashed|dotted`, `border-round` (`-xs … -xl`, `-left|right|top|bottom`), `border-circle`, `shadow-1 … shadow-8`, `shadow-sm|md|lg` (the theme's elevation)
- **Position / misc**: `static · relative · absolute · fixed · sticky`, `top-0 · right-0 · bottom-0 · left-0`, `z-0 … z-5`, `overflow-auto|hidden|visible|scroll|clip (-x/-y)`, `cursor-pointer|default|text|move|wait|not-allowed`, `select-none|text|all|auto`, `opacity-0 … opacity-100`, `sr-only`, `hidden · block · inline · inline-block`
- **Forms**: `field` (label + field group with bottom spacing), `formgrid grid` (multi-column form), `field-checkbox · field-radiobutton` (box next to its text), `formgroup-inline` (fields in a row)

```html
<div class="grid">
  <div class="col-12 md:col-6"><div class="field"><label>ชื่อ</label><input wuInputText /></div></div>
  <div class="col-12 md:col-6 flex align-items-center gap-2 p-3 surface-card border-1 surface-border border-round-lg shadow-1">…</div>
</div>
```
