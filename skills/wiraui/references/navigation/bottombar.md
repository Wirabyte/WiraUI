# BottomBar

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`<wu-bottombar>` (also `wu-bottom-bar`, `wu-bottomBar`) · `WuBottomBarModule` / `WuBottomBar` from `@wirabyte/ui/bottombar` · all majors

A phone app's main menu along the bottom of the screen: icons with names, badges, selected item in primary colour. Three looks; stays above the iPhone home indicator and can hide on scroll down.

```html
<wu-bottombar [model]="tabs" [(activeIndex)]="tab"></wu-bottombar>
<wu-bottombar [model]="tabs" look="fab" [action]="{ icon: 'wi wi-plus', label: 'สร้างโพสต์' }"></wu-bottombar>
```
```ts
tab = 0;
tabs: MenuItem[] = [
  { label: 'หน้าแรก', icon: 'wi wi-home', routerLink: '/', routerLinkActiveOptions: { exact: true } },
  { label: 'ข้อความ', icon: 'wi wi-comments', routerLink: '/messages', badge: '3' },
];
```

**Inputs**
- `model`: `MenuItem[]` — `label icon routerLink url command badge disabled`
- `activeIndex`: `number` = route — selected item; `[(activeIndex)]` two-way; with `routerLink` items it follows the route (closest match)
- `look`: `'standard' | 'pill' | 'fab'` = `'standard'` — pill: floating, the selected item opens out and shows its name; fab: notch + raised round middle button from `action`
- `labels`: `'always' | 'active' | 'never'` = `'always'` (pill: `'active'`) — which names show (hidden ones still read out)
- `action`: `MenuItem` — round middle button (`look="fab"`)
- `fixed`: `boolean` = `true` — fixed to the bottom of the screen (`false` to keep it in its container)
- `hideOnScroll`: `boolean` = `false` — slides away when the page scrolls down, back with a little scroll up
- `ariaLabel`: `string` = locale
- `styleClass`, `style`: `string`, `object`

**Outputs** — `(activeIndexChange)`: `number`; `(onItemClick)`: `WuBottomBarItemClickEvent` (`{ originalEvent, item, index }`; the middle button gives `index` -1).

**Slots** — `item` (`$implicit`: MenuItem, `active`, `index`).

**Tokens** — `--wu-bottombar-height`, `-z`; `-bg`, `-border`, `-shadow`, `-pill-shadow`; `-color`, `-active-color`, `-indicator-bg`; `-fab-size`, `-fab-bg`, `-fab-color`, `-fab-shadow`.

**Gotchas**
- Leave page-end room: `body { padding-bottom: calc(var(--wu-bottombar-height) + env(safe-area-inset-bottom)) }`.
- iPhone home indicator: add `viewport-fit=cover` to the viewport meta so `env(safe-area-inset-bottom)` applies.
- Give the home `routerLink` item `routerLinkActiveOptions: { exact: true }` (closest-match routing).
- Slot: v3 `#item`; v1/v2 `wuTemplate="item"`.

---
