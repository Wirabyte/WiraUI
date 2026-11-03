# wiraicon

WiraUI's icons: 424 icons in five weights (thin, light, regular, bold, fill), with the names Angular teams already
write (`times`, `exclamation-triangle`, `cog` …) plus Font Awesome and Phosphor spellings as aliases. Works on its own,
without `@wirabyte/ui`. Drawings from [Phosphor Icons](https://phosphoricons.com) (MIT).

```bash
npm install @wirabyte/icons
```

## CSS classes (any framework)

Add the stylesheet once (Angular: `angular.json` → `styles`):

```json
"styles": ["node_modules/@wirabyte/icons/wiraicon.css", "src/styles.scss"]
```

```html
<i class="wi wi-check"></i>
<i class="wi wi-trash wi-bold"></i>        <!-- weights: wi-thin, wi-light, wi-bold, wi-fill -->
<i class="wi wi-spinner wi-spin"></i>
<wu-button icon="wi wi-save" label="บันทึก"></wu-button>
```

Each weight is its own font and is only downloaded when a page uses it.

## Angular component

```ts
import { WiIcon } from '@wirabyte/icons/angular';   // NgModule apps: WiIconModule
```

```html
<wi-icon name="check"></wi-icon>
<wi-icon name="trash" weight="bold" [size]="20" color="var(--wu-danger-color)"></wi-icon>
<wi-icon name="info-circle" label="ข้อมูลเพิ่มเติม"></wi-icon>
```

Inline SVG, coloured by the text colour, 1em by default. Each weight's drawings load on first use.
`provideWiraIcon({ weight: 'bold', size: 18 })` sets app-wide defaults.

## Files

- `svg/<weight>/<name>.svg`: every icon as an SVG file (256 × 256, `fill="currentColor"`).
- `data/<weight>`: the drawings as a JS module, for other frameworks.
- `icons.json`: names, aliases, categories and code points.
- `wiraIconName('xmark')` → `'times'`, `wiraIconSvg(body, 24)` from `@wirabyte/icons`.

## License

MIT. The icon drawings come from Phosphor Icons, MIT License; see LICENSE.
