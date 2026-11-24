# Icons: `@wirabyte/icons` (wiraicon)

A separate package; works without `@wirabyte/ui` and with Angular 15+ (every WiraUI major). Drawings come from Phosphor Icons (MIT); wiraicon is MIT.

```bash
npm install @wirabyte/icons
```
```jsonc
// angular.json → projects.<app>.architect.build.options
"styles": [
  "node_modules/@wirabyte/icons/wiraicon.css",
  "src/styles.scss"
]
```
```html
<i class="wi wi-check"></i>
<i class="wi wi-times"></i>
<i class="wi wi-heart wi-thin"></i> <i class="wi wi-heart wi-light"></i> <i class="wi wi-heart"></i>
<i class="wi wi-heart wi-bold"></i> <i class="wi wi-heart wi-fill"></i>
<i class="wi wi-star wi-fill" style="font-size: 2rem; color: var(--wu-warn-color)"></i>
<i class="wi wi-spinner wi-spin" style="font-size: 1.5rem"></i>
<li><i class="wi wi-home wi-fw"></i> หน้าแรก</li>
```
- Names: `wi wi-<name>`. Full list with categories and aliases: `node_modules/@wirabyte/icons/icons.json` (search it rather than guessing). Main names match the `pi-*` names apps already use (`check`, `times`, `exclamation-triangle`, `cog`, `save`, `trash`, `search`, `bell`, `calendar`, `users`, `graduation-cap`, `file-excel`, `home`, `spinner`, `bars`, `info-circle`). Font Awesome / Phosphor spellings work as aliases (`wi-xmark` = `wi-times`).
- Weights: `wi-thin`, `wi-light`, regular (no class), `wi-bold`, `wi-fill`. Each weight is its own font; a page downloads only the weights it uses.
- Size follows `font-size`, colour follows `color` (theme tokens work). `wi-spin` rotates (slower under reduced motion); `wi-fw` gives every icon the same width.
- WiraUI components' `icon` input takes the classes: `<wu-button label="บันทึก" icon="wi wi-save">`, `icon="wi wi-trash wi-bold"`. An icon-only button always needs `ariaLabel`.
- From a `pi pi-` icon font: replace `pi pi-` with `wi wi-` across the project (templates, menu data, `icon="…"`). Names that are missing: search the docs gallery by the old name.

`<wi-icon>` component (inline SVG, no font) from `@wirabyte/icons/angular`: standalone `WiIcon`, or `WiIconModule`:
```html
<wi-icon name="check"></wi-icon>
<wi-icon name="trash" weight="bold" [size]="24" color="var(--wu-danger-color)"></wi-icon>
<wi-icon name="info-circle" [size]="24" label="ข้อมูลเพิ่มเติม"></wi-icon>
<wi-icon name="spinner" [size]="24" [spin]="true"></wi-icon>
```
- Inputs: `name` (same names/aliases), `weight` (`thin | light | regular | bold | fill`), `[size]` (number = px, or any CSS length; default `1em`), `color`, `[spin]`, `label` (none = decorative, skipped by screen readers; set = read as a named image).
- App defaults: `provideWiraIcon({ weight: 'bold', size: 18 })` from `@wirabyte/icons/angular` (in `providers` of AppModule or `app.config.ts`; can also be set on the component).
- NgModule: `imports: [WiIconModule]`.
