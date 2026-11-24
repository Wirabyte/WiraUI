# SiteFooter

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`<wu-site-footer>` · `WuSiteFooterModule` / `WuSiteFooter` from `@wirabyte/ui/sitefooter` · all majors

The foot of a site or app: brand + line, link columns, social icons, bottom row (copyright, policy links, back-to-top). Three looks; on narrow widths columns fold into headings that open. Not `<wu-footer>`, which is the footer slot of cards/dialogs (old `p-footer`).

```html
<wu-site-footer brand="WiraUI" description="ชุด UI สำหรับ Angular ที่เข้าใจงานไทย"
  [model]="columns" [social]="social" [legal]="legal" [backToTop]="true"></wu-site-footer>
```
```ts
columns: MenuItem[] = [{ label: 'ผลิตภัณฑ์', items: [{ label: 'คอมโพเนนต์', routerLink: '/components' }, { label: 'ราคา', url: '/pricing' }] }];
social: MenuItem[] = [{ label: 'GitHub', icon: 'wi wi-github', url: 'https://github.com', target: '_blank' }];
legal: MenuItem[] = [{ label: 'นโยบายความเป็นส่วนตัว', url: '/privacy' }];
```

**Inputs**
- `model`: `MenuItem[]` — items with `items` are columns (their `label` is the heading); items without `items` are plain links (`look="simple"`)
- `social`, `legal`: `MenuItem[]` — icon links (give a `label` to be read out) · links in the bottom row
- `brand`, `logo`, `description`: `string` — name, logo image, a line about it
- `copyright`: `string` = `© <this year> <brand>` — `''` for none
- `look`: `'columns' | 'simple' | 'centered'` = `'columns'` — simple: one row; centered: for landing pages
- `backToTop`: `boolean` = `false`
- `ariaLabel`: `string` — footer name
- `styleClass`, `style`: `string`, `object`

**Outputs** — `(onItemClick)`: `WuSiteFooterItemClickEvent` (`{ originalEvent, item }`) — which link was clicked. Links can be `routerLink`, `url` or `command`.

**Slots** (`wuTemplate`, v3 `#name`) — `brand` (replaces brand + line), `end` (end of the top part: newsletter field, app badges), `bottom` (adds to the bottom row).

**Tokens** — `--wu-site-footer-padding`, `-gap`, `-bg`, `-border`, `-color`, `-heading-color`, `-link-color`, `-link-hover`, `-social-size`, `-social-bg`.

**Gotchas**
- Tag is `wu-site-footer` (not `wu-footer`).
- Slots: v3 `<ng-template #end>`; v1/v2 `wuTemplate="end"`.
