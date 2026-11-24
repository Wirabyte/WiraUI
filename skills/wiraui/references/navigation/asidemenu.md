# AsideMenu

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`<wu-aside-menu>` · `WuAsideMenuModule` (also exports `WuTemplate`) / `WuAsideMenu` from `@wirabyte/ui/asidemenu`

Side navigation for admin-style apps. Wide screens: a sticky full-height column that scrolls on its own, groups expand in place at any depth, collapses to an icon rail. Phones: off-canvas panel. With Navbar it is a ready-made app layout.

```html
<div class="app-layout">
  <wu-aside-menu #side [model]="menu" [activeItem]="currentPage">
    <a wuAsideMenuStart routerLink="/">วิระ</a>
  </wu-aside-menu>
  <main class="app-content">
    @if (side.mobile) { <wu-button icon="wi wi-bars" [text]="true" ariaLabel="เปิดเมนู" (onClick)="side.open()"></wu-button> }
  </main>
</div>
```
`.app-layout { display: flex }` and `.app-content { flex: 1; min-width: 0 }` (the layout must be a flex row; the menu is `100dvh` tall minus `--wu-aside-menu-top`).
```ts
import { WuMenuItem } from '@wirabyte/ui/menu';

menu: WuMenuItem[] = [
  { label: 'แดชบอร์ด', icon: 'wi wi-home', routerLink: '/', routerLinkActiveOptions: { exact: true } },
  { label: 'นักเรียน', icon: 'wi wi-users', items: [
      { label: 'รายชื่อนักเรียน', routerLink: '/students', routerLinkActiveOptions: { exact: true } },  // parent of the next link: exact
      { label: 'เพิ่มนักเรียน', routerLink: '/students/new' },
  ] },
  { label: 'คู่มือ', icon: 'wi wi-book', url: 'https://example.com/guide', target: '_blank' },
  { separator: true },
  { label: 'ออกจากระบบ', icon: 'wi wi-sign-out', command: () => this.signOut() },
];
```

**Inputs**
- `model`: `WuMenuItem[]` = `[]` — items; groups with `items` expand in place at any depth
- `activeItem`: `WuMenuItem | null` — current page when it is a `url` / `command` item; its groups open and highlight (routerLink items use routerLinkActive)
- `multiple`: `boolean` = `true` — several groups per level stay open; `false` folds open siblings
- `sections`: `boolean` = `false` — top-level items with `items` become headings whose items always show
- `collapsed`: `boolean` = `false` — icon rail; two-way `[(collapsed)]`; wide screens only
- `visible`: `boolean` = `false` — phone panel open; two-way `[(visible)]`
- `showCollapseButton`: `boolean` = `false` — "Collapse menu / Expand menu" button at the bottom (wide screens)
- `breakpoint`: `string | number` = `'960px'` — at or below it the menu is the phone panel
- `ariaLabel`: `string` = locale (`sideNavigation`, "Side menu") — nav landmark name
- `styleClass`, `style`: `string`, `object` — on the nav (set width with `--wu-aside-menu-width`, not `style`)

**Item fields it reads** — `label icon title` (rail: label is the tooltip) · `items expanded` (menu sets `expanded` on the model) · `routerLink queryParams fragment routerLinkActiveOptions queryParamsHandling preserveFragment skipLocationChange replaceUrl state` · `url target` · `command` (on phones the panel closes first) · `badge badgeStyleClass` (dot on the rail) · `disabled visible` · `separator` · `escape` · `styleClass style iconStyle` · `automationId` (rendered as `data-automationid`).

**Outputs** — `(visibleChange)`: `boolean`, `(collapsedChange)`: `boolean` (for the two-way bindings).

**Slots** — attribute: `wuAsideMenuStart` (header, e.g. brand), `wuAsideMenuEnd` (footer, above the collapse button). Templates: `start` and `end` get `let-collapsed` (`$implicit` = collapsed, plus `collapsed`); `item` gets `let-item` (`$implicit` item) and `collapsed` (`let-collapsed="collapsed"`); it replaces icon, label, badge and arrow, the link/press/aria stay the component's. Give the parts `wu-aside-menu-icon` and `wu-aside-menu-label` for the usual look (text in `wu-aside-menu-label` is hidden on the rail but still read by screen readers).

**Methods** — `open(opener?)` (phones: opens the panel; `opener` gets focus back on close, default the focused element), `close()`, `toggle(opener?)`, `toggleCollapsed()` (wide: full menu ⇄ rail, fires `collapsedChange`). State: `mobile`, `visible`, `collapsed`, `rail` (collapsed and not phone): `boolean`; `panelId`: `string` (nav id, for `aria-controls` of your own button). Reach them via template ref `#side`.

**Types**
```ts
interface WuAsideMenuSlotContext { $implicit: boolean; collapsed: boolean }   // start / end
interface WuAsideMenuItemContext { $implicit: WuMenuItem; collapsed: boolean } // item
```

**Tokens** — `--wu-aside-menu-width`, `-collapsed-width`, `-mobile-width`, `-top` (offset from top while sticky; height = 100dvh minus this), `-z-index`, `-bg`, `-color`, `-border-width`, `-border-color`, `-padding`, `-mobile-shadow`, `-item-height`, `-item-padding`, `-item-gap`, `-item-radius`, `-item-color`, `-item-icon-color`, `-item-hover-bg`, `-item-active-bg` (accepts `var(--wu-primary-gradient)`), `-item-active-color`, `-group-active-color`, `-indent`, `-section-color`, `-section-size`, `-section-padding`.

**Behaviour details**
- Router: routerLink items get `routerLinkActive` + `aria-current="page"` (default `{ exact: false }`); after each navigation groups holding the new page open and the phone panel closes. Router is looked up only once a routerLink item appears.
- Rail: labels become tooltips; icon-less items show their first consonant; badges become dots; a pressed group opens a flyout (Esc, ArrowLeft, a pick or outside press closes).
- Phone panel: off-canvas over a mask; page behind cannot scroll, focus moves to the current page and stays inside. Closed by ×, Esc (focus back to opener), mask press, a pick, a navigation, or growing past the breakpoint.
- Keyboard: `↓ ↑` items, `→` open/enter group (rail: flyout), `←` close/back to parent, `Home`/`End`, `Enter`/`Space` pick. Folded items are `inert`.

**Gotchas**
- Persist `collapsed` yourself (e.g. localStorage); the component does not.
- Under a sticky top bar set `--wu-aside-menu-top: var(--wu-navbar-height)` (or the bar's height) or the menu overlaps it.
- Moving a hand-built side menu: items to `[model]` (`routerLink`, `expanded` keep working), logo to `wuAsideMenuStart`, user button to `wuAsideMenuEnd`, hamburger via Navbar `[aside]`; delete old mobile code, media queries, height/sticky CSS.
- Slots: v3 `#start/#item/#end`; v1/v2 `wuTemplate="start"` etc.

## App shell: Navbar + AsideMenu

`<wu-navbar [aside]="side">` with `<wu-aside-menu #side>` wires the bar's menu button to the side menu with no code of your own:
- the button moves before the brand;
- narrow screens: it opens the side menu, and the navbar's `[model]` links move into it as its first group;
- wide screens: it collapses / expands the side menu (`[asideCollapse]="false"` limits the button to narrow screens);
- the button's `aria-expanded` / `aria-controls` follow the side menu.

```html
<wu-navbar [model]="links" [aside]="side" [sticky]="true">
  <a wuNavbarBrand routerLink="/">วิระ</a>
</wu-navbar>
<div class="app-layout">
  <wu-aside-menu #side [model]="menu"></wu-aside-menu>
  <main class="app-content"><router-outlet></router-outlet></main>
</div>
```
```css
.app-layout { display: flex }
.app-content { flex: 1; min-width: 0 }
wu-aside-menu { --wu-aside-menu-top: var(--wu-navbar-height) }  /* with sticky navbar */
```
The template ref (`#side`) must be reachable from the navbar's template scope (same template). Use the `[aside]` binding instead of your own hamburger button + `side.open()`.

---
