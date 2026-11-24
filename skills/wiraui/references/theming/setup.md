# Theming

## Basics

A theme is a set of design tokens that becomes one set of `--wu-*` CSS variables. Component CSS only reads `var(--wu-*)`, so theme files hold nothing but token values. Pick ONE route for the main theme (SCSS, CSS or TS `preset`; loading a theme file and a `preset` together logs a dev-mode warning), then optionally adjust with TS `overrides`.

`ng add` sets up: SCSS apps get `src/theme/wiraui.theme.scss` + `@use 'theme/wiraui.theme';` on line 1 of `styles.scss`; CSS apps get the prebuilt file in angular.json; both get `src/theme/wiraui.overrides.ts` (empty `defineOverrides`) wired into `provideWiraUI({ overrides })`. SCSS needs Sass 1.58+.

## Presets / themes per major

| Major | Presets (`$preset` / `preset`) | Default | Notes |
|---|---|---|---|
| v1 | `sila-classic`, `arun`, `sayan`, `ratri`, `material-classic` | `sila-classic` (theme `sila-light-teal`) | Classic looks. `sayan`, `ratri` are dark-only |
| v2 | `mali`, `sila`, `material`, `phet` | `mali` | Light + dark built in |
| v3 | `wira`, `lanna`, `siam`, `nakhon`, `glass`, `mali`, `sila`, `material`, `phet` | `wira` | `glass` = Liquid Glass (`$material: 'glass'`). `siam` has ripple |

v1 ready-made theme names (`$theme`, `themes/<name>/theme.css`, `themePreset('<name>')`), from the catalog: `sila-light-blue`, `sila-light-indigo`, `sila-light-purple`, `sila-light-teal`, `sila-light-wira`, `sila-dark-blue`, `sila-dark-indigo`, `sila-dark-purple`, `sila-dark-teal`, `arun-blue|green|orange|purple`, `sayan-blue|green|orange|purple`, `ratri-blue|green|orange|purple`, `md-light-indigo`, `md-light-deeppurple`, `md-dark-indigo`, `md-dark-deeppurple` (plus the preset names `sila-classic`, `arun`, `material-classic`). `sila-dark-*`, `sayan-*`, `ratri-*` are dark-only. Folder names match what existing apps already use.

`ng add --theme` takes these names per major (default v1 `sila-light-teal`, v2 `mali`, v3 `wira`).

## Route 1: SCSS

```scss
// src/theme/wiraui.theme.scss
@use '@wirabyte/ui/theme' with (
  $preset: 'wira',                      // v3 default; v2: mali · sila · material · phet
  $primary: #06b6d4,                    // one colour: shades 50–950 are generated
  $primary-contrast: #ffffff,           // text on primary buttons
  $scheme: 'light',                     // 'dark' = dark-only theme
  $surface: 'slate',
  $font-family: ('Kanit', sans-serif),
  $radius: 6px,
  $density: 'comfortable',              // 'compact' | 'normal' | 'comfortable'
  $components: (
    card:   (body-gap: 0),
    button: (font-weight: 600),
  )
);
// @use '@wirabyte/ui/theme';           // no with (…) = the version's default preset
```
```scss
// src/styles.scss, first line
@use 'theme/wiraui.theme';
```

v1 variant: name a ready-made theme, or start from a `$preset`:
```scss
@use '@wirabyte/ui/theme' with ($theme: 'sila-light-teal');   // no with (…) at all also gives sila-light-teal in v1
// or: ($preset: 'sila-classic', $primary: #00a86b, $primary-contrast: #ffffff, $scheme: 'light', $font-family: ('Kanit', sans-serif), $components: (card: (body-gap: 0)))
```

**All settings** (every one optional; verified in `packages/themes/scss/_index.scss`)
- `$theme`: ready-made theme name (v1 names above, or a preset name). Set `$theme` OR `$preset`, not both (error).
- `$preset`: v1 `'sila-classic' | 'arun' | 'sayan' | 'ratri' | 'material-classic'` · v2 `'mali' | 'sila' | 'material' | 'phet'` · v3 v2's plus `'wira' | 'lanna' | 'siam' | 'nakhon' | 'glass'`
- `$primary`: hex colour, a map `(50: …, …, 950: …)`, or a swatch name in quotes (`'sky'`; the `'{sky}'` form also works). Swatches: wira, emerald, green, lime, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose, red, orange, amber, yellow
- `$surface`: `'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' | 'classic' | 'sayan' | 'ratri' | 'navy'` (the source also lists `'ink'`, Wira's own neutrals)
- `$primary-contrast`: colour, text on primary buttons (null keeps the preset's)
- `$semantic`: `(success: #22c55e, info: …, warn: …, danger: …, help: …)`, any subset; each a hex, shade map or swatch name
- `$font-family`: list like `('Kanit', sans-serif)` (a single name gets `, sans-serif`) · `$heading-font-family`: same, for titles of cards, dialogs, drawers, panels, fieldsets, alerts, empty states, results, error pages (follows `$font-family` if left out)
- `$font-size`: px (emitted in rem) · `$line-height`: number · `$radius`: px · `$transition`: ms (or s)
- `$density`: `'compact' | 'normal' | 'comfortable'` · `$shadow`: `'none' | 'subtle' | 'soft' | 'elevated' | 'material' | 'mali' | 'sila' | 'phet'` · `$focus-ring`: `'ring' | 'outline' | 'inset' | 'bold'`
- `$ripple`: boolean (no token; validated only; turn ripple on with `provideWiraUI({ ripple })`)
- `$dark-mode`: `'none' | 'class' | 'media'` = `'class'` (`.wu-dark` on `<html>`, or `prefers-color-scheme`)
- `$scheme`: `'light' | 'dark'` (dark colours only, like sayan / ratri)
- `$material`: `'solid' | 'glass'`
- `$components`: map of component id → kebab-case (camelCase also accepted) keys. Only these exist: `button` (`font-weight`, `radius`, `padding-x`), `input` (`radius`), `card` (`padding`, `radius`, `body-gap`, `bordered`), `table` (`row-height`, `striped`), `dialog` (`radius`), `tag` (`pill`). Unknown id/key = compile error. `bordered` / `striped` / `pill` are booleans.
- `$tokens`: `('table-head-bg': transparent, 'card-shadow': none)` any token by name WITHOUT `--wu-`, light and dark alike · `$dark-tokens`: dark mode only. A misspelt token name is a compile error.

Heading font + any token:
```scss
@use '@wirabyte/ui/theme' with (
  $font-family: ('Sarabun', sans-serif),
  $heading-font-family: ('Kanit', sans-serif),
  $tokens: ('table-head-bg': transparent, 'card-shadow': none),
  $dark-tokens: ('card-border-width': 1px),
);
```
Fonts are fetched from Google Fonts at run time unless `provideWiraUI({ fonts: 'none' })`.

The theme file emits `@layer wiraui.tokens` and the variables on `:root` (plus `:root.wu-dark` or a `prefers-color-scheme` block).

**SCSS API in component styles** (emits no CSS, safe in many files):
```scss
@use '@wirabyte/ui/theme/api' as wu;

.student-card {
  border-color: wu.token(primary-300);   // → var(--wu-primary-300)
  @include wu.dark { border-color: wu.token(primary-700); }   // :root.wu-dark & ; wu.dark('media') = prefers-color-scheme
  @include wu.media(md) { padding: 1rem; }                    // min-width: sm 576 · md 768 · lg 992 · xl 1200px, or a length
}
```
Also in the API source: `wu.glass` mixin (frosted-glass surface with solid fallback; reads `glass-*` tokens) and `wu.$breakpoints`. The docs page documents only `token`, `dark`, `media`.

Together with TS: keep SCSS as the main theme and adjust a few values with `overrides` in `provideWiraUI()`; TS wins through `wiraui.overrides`.

## Route 2: prebuilt CSS

Add a file to angular.json `styles`; works with CSS, Less and any preprocessor.
```jsonc
// angular.json → projects.<app>.architect.build.options
"styles": [
  "node_modules/@wirabyte/ui/themes/sila-light-teal/theme.css",   // v1: the theme folder name
  // v2: "node_modules/@wirabyte/ui/themes/mali/theme.css"  (or themes/mali/<colour>.css, e.g. cyan.css)
  // v3: "node_modules/@wirabyte/ui/themes/wira/theme.css"  (or themes/wira/<colour>.css, e.g. cyan.css)
  "src/styles.css"
]
```
- v1: `@wirabyte/ui/themes/<theme>/theme.css` (names above; light and dark live in separate folders, as classic themes do). v2/v3: `themes/<preset>/theme.css` (the preset's own colour) or `themes/<preset>/<colour>.css`. A file exported from the WiraUI Studio also works.
- App CSS is not in an `@layer`, so it beats the theme. Adjust on `:root`:
```css
/* src/styles.css */
:root { --wu-primary-contrast: #ffffff; --wu-card-body-gap: 0; }
:root.wu-dark { --wu-ground: #0b1220; }   /* dark mode by class on <html> */
```
- **Do not change the primary colour with `--wu-primary-color` alone**: hover, pressed and selected colours come from the 50–950 shades and would keep the old colour (dev mode warns). Change the whole set: the theme file of that colour, `$primary` (SCSS), `palette()` in overrides, or `WuThemeService.setPrimary()`.
- Dark: v2/v3 files hold light values plus dark values under `:root.wu-dark` (toggle the class or `WuThemeService.setDarkMode(true)`; reuse an existing class via `darkModeSelector`). v1 ships dark-only files (`sila-dark-*`, `sayan-*`, `ratri-*`, no class to toggle); v1 light files also carry dark values under `:root.wu-dark`.

## Route 3: TypeScript

```ts
// src/theme/wiraui.overrides.ts (ng add creates it, empty)
import { defineOverrides, palette } from '@wirabyte/ui/config';

export const wiraOverrides = defineOverrides({
  semantic: {
    primary: palette('#00a86b'),
    primaryContrast: '#ffffff',
    radius: '8px',
  },
  components: {
    card: { bodyGap: '0' },
    button: { radius: '999px' },
  },
  dark: {
    semantic: { surface: palette('#0f1d1a') },   // what is not under `dark` applies to both modes
  },
});
// provideWiraUI({ overrides: wiraOverrides })
```
Overrides land in `@layer wiraui.overrides`, so they beat a theme file.

A theme in TS only (no theme file):
```ts
import { definePreset, palette, provideWiraUI } from '@wirabyte/ui/config';
import { Wira } from '@wirabyte/ui/presets';     // v2: Mali, Sila, Material, Phet; v3 adds Wira, Lanna, Siam, Nakhon, Glass
// v1: import { themePreset } from '@wirabyte/ui/presets';  → themePreset('sila-light-teal') (also works in v2/v3 by name)

const School = definePreset(Wira, {
  // scheme: 'dark',                 // dark-only theme, no class to toggle
  semantic: { primary: palette('{cyan}'), primaryContrast: '#ffffff' },
});
provideWiraUI({ preset: School });
```
Preset constants exported by core: v1 `SilaClassic`, `Arun`, `Sayan`, `Ratri`, `MaterialClassic`; v2/v3 `Mali`, `Sila`, `Material`, `Phet`; v3 `Wira`, `Lanna`, `Siam`, `Nakhon`, `Glass`. Only import the ones your major lists.

**ThemeOverrides shape** (from core types)
- `semantic`: `primary`, `success`, `info`, `warn`, `danger`, `help` (each a `palette()`); `surface` (`'{slate}'` reference or palette); `primaryContrast`; `fontFamily`; `headingFontFamily`; `fontSize`, `lineHeight`, `radius`, `transition` (number or string); `density` (`'compact'|'normal'|'comfortable'`); `shadow` (same ids as `$shadow`); `focusRing`; `material` (`'solid'|'glass'`)
- `components`: `button { fontWeight, radius, paddingX }` · `input { radius }` · `card { padding, radius, bodyGap, bordered }` · `table { rowHeight, striped }` · `dialog { radius }` · `tag { pill }`
- `tokens`: `Record<string, string | number>` any token by name without `--wu-`; applies to light and dark; an unknown token throws when the overrides are applied
- `dark`: `{ semantic?, components?, tokens? }` dark mode only
- `scheme`: `'dark'` (`definePreset()` only)

```ts
defineOverrides({
  semantic: { fontFamily: 'Sarabun', headingFontFamily: 'Kanit' },
  tokens: { 'table-head-bg': 'transparent', 'card-shadow': 'none' },
  dark: { tokens: { 'card-border-width': '1px' } },
});
```

`palette('#00a86b')` builds shades 50–950 from one colour (it becomes shade 500), or use a swatch: `palette('{emerald}')`. Same formula as `wu.palette()` in Sass. Invalid input throws.

**provideWiraUI options that touch the theme**: `preset`, `overrides`, `darkMode: 'none'|'class'|'media'` (default `'class'`), `darkModeSelector` (`'.my-dark'` class on `<html>`, `'system'` = prefers-color-scheme, or `'none'`; wins over `darkMode`; a class that is never added keeps the app light), `scheme: 'dark'` (set when the main theme is dark-only; otherwise read from the theme / `--wu-scheme`), `ripple`, `scale`, `selector` (element the TS tokens apply to, default `:root`), `fonts: 'google'|'none'`.

## Token tiers

| Tier | Examples | CSS variable |
|---|---|---|
| primitive | palettes 50–950, radius and spacing scales | `--wu-primary-500`, `--wu-radius-md` |
| semantic | primary, surface, success/info/warn/danger/help, text, border, focus ring, form fields (light and dark values) | `--wu-primary-color`, `--wu-text`, `--wu-field-padding-y` |
| component | per-component values that can refer to semantic tokens | `--wu-button-padding-x`, `--wu-card-body-gap` |

Each component's docs list the `--wu-*` tokens it reads (`Tokens` line in its reference file).

## Cascade layers: why app CSS wins

WiraUI declares the layer order at the top of `<head>`, so import order does not matter:
```css
@layer reset, wiraui.tokens, wiraui.components, wiraui.utilities, wiraui.overrides;
```
Loses → wins: `wiraui.tokens` (main theme from SCSS/CSS, or TS preset) → `wiraui.components` → `wiraui.utilities` (utility classes) → `wiraui.overrides` (TS overrides / WuThemeService) → the app's own CSS (outside any layer, wins without `!important`).

Broad global rules written plainly in `styles.css` (`* { scrollbar-width: thin }`, `a { color: inherit }`) also beat component styles. Put general app styles in `@layer reset` (below components), theme adjustments in `@layer wiraui.overrides` (above them), and keep unlayered CSS for selectors you mean to win:
```css
@layer reset { * { scrollbar-width: thin; } a { color: inherit; } }
@layer wiraui.overrides { .wu-card-title { letter-spacing: -0.01em; } }
.page-header .wu-btn { min-width: 8rem; }   /* unlayered: beats every component style */
```

## Scoped (per-element) themes

CSS variables inherit, so set them on a wrapping element:
```css
.admin-area {
  --wu-primary-color: #e11d48;
  --wu-primary-hover: #be123c;       /* hover */
  --wu-primary-active: #9f1239;      /* pressed */
  --wu-primary-soft: #fff1f2;        /* selected item background */
  --wu-primary-soft-text: #9f1239;   /* selected item text */
}
```
Here you set the whole primary family together, which avoids the stray-primary warning.

## Scale (UI size)

`scale` sets the root font size: `'sm'` 12px, `'md'` 14px, `'lg'` 16px (browser default), or a number of px; every rem follows. Omit to keep the page's own root size.
```ts
provideWiraUI({ scale: 'md' });        // or WiraUIModule.forRoot({ scale: 'md' })
```

## Runtime: WuThemeService

```ts
import { inject } from '@angular/core';
import { WuThemeService } from '@wirabyte/ui/config';

const theme = inject(WuThemeService);
theme.setPrimary('#2563eb');                       // all shades and tokens that refer to them follow
theme.setDarkMode(true);                           // toggles .wu-dark (or the darkModeSelector class) on <html>
theme.patch({ components: { button: { radius: '999px' } } });
theme.setOverrides({});                            // clear all overrides
theme.setScale('md');                              // 'sm' 12 · 'md' 14 · 'lg' 16 · number px · null = back to the page's size
```
Also in source: `setPreset(preset)`, `isDarkMode()`. These are plain methods, not signals: `isDarkMode()` reads the class on `<html>` when called, so keep your own `signal` for a toggle's state. Nothing is remembered between visits; save the choice yourself (e.g. `localStorage`) and call `setDarkMode()` at start.

## Old CSS variable names (kept for migrated apps)

The theme also writes the variable names existing app CSS reads, as aliases to `--wu-*`, so existing app CSS keeps working:
- v1 (classic look): `--primary-color`, `--primary-color-text`, `--text-color`, `--text-color-secondary`, `--font-family`, `--surface-a` … `--surface-f`, `--surface-ground`, `--surface-section`, `--surface-card`, `--surface-overlay`, `--surface-border`, `--surface-hover`, `--border-radius`, `--content-padding`, `--inline-spacing`, `--focus-ring`, `--maskbg`, `--highlight-bg`, `--highlight-text-color`, `--surface-0 … --surface-900`, `--gray-*`, `--primary-50 … 900`, and colour scales `--<colour>-<50…900>` (blue, green, yellow, cyan, pink, indigo, teal, orange, bluegray, purple, red, emerald, lime, sky, violet, …).
- v2/v3 (styled look): `--p-primary-color`, `--p-primary-contrast-color`, `--p-primary-hover-color`, `--p-primary-active-color`, `--p-text-color`, `--p-text-muted-color`, `--p-content-background`, `--p-content-hover-background`, `--p-content-border-color`, `--p-content-color`, `--p-highlight-*`, `--p-mask-background`, `--p-content-border-radius`, `--p-focus-ring-*`, `--p-disabled-opacity`, `--p-transition-duration`, `--p-overlay-*`, `--p-form-field-*`, `--p-border-radius-xs…xl`, `--p-surface-0…950`, `--p-primary-50…950`, `--p-<colour>-<50…950>`.
- v2/v3 also read these app-set `--p-*` inputs when present: `--p-card-body-gap`, `--p-card-body-padding`, `--p-card-border-radius`, `--p-button-border-radius` (used as the fallback for the matching `--wu-*` token).
- Prefer `--wu-*` tokens in new CSS.

## Dark mode summary

- `'none'` (light values only), `'class'` (`.wu-dark` on `<html>`), `'media'` (`prefers-color-scheme`); or your own class via `darkModeSelector: '.my-dark'`.
- Dark-only themes (v1 `sayan-*`, `ratri-*`, `sila-dark-*`, or `definePreset(…, { scheme: 'dark' })` / `$scheme: 'dark'`) have no light values, so there is no class to toggle; swap to the twin theme instead (`sila-light-teal` ↔ `sila-dark-teal`).
- v2/v3 presets have light and dark built in.
- **Turning dark mode on after `ng add`** (default `--darkMode=none`): the generated theme then holds light values only, so a toggle does nothing until you change BOTH places. SCSS: `$dark-mode: 'class'` in `src/theme/wiraui.theme.scss`, and `darkMode: 'class'` in `provideWiraUI(...)`. CSS: the generated `wiraui.theme.css` has no dark block; regenerate it (delete it, run `ng add @wirabyte/ui --darkMode=class`, which leaves the existing provider alone) and change `darkMode` in the provider. For a new app that needs a toggle, pass `--darkMode=class` up front.

## Gotchas

- Do not set `--wu-primary-color` alone to rebrand; set the whole palette (see Route 2).
- Typos in `$tokens` / `$components` fail at compile time (SCSS) or at app start (TS `tokens`); that is intentional.
- Do not combine a theme file and a TS `preset`; use `overrides` on top of a theme file instead.
- `$theme` and `$preset` are mutually exclusive in SCSS.
- Preset lists differ per major; do not use a v3 preset name (`wira`, `lanna`, …) on v1/v2.
- Utility classes are opt-in and, because they sit in `wiraui.utilities`, any unlayered app CSS overrides them.
- Fonts: the theme font and heading font are linked from Google Fonts unless `fonts: 'none'`.
