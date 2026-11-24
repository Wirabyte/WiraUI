# Navbar

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`<wu-navbar>` · `WuNavbarModule` (also brings `WuTemplate`) / `WuNavbar` from `@wirabyte/ui/navbar`

Responsive top app bar: brand, links from a model (dropdowns for items with `items`), end actions; folds into a menu button + panel on narrow screens. Choose it for a site/app header; pair it with AsideMenu for an admin shell.

```html
<wu-navbar [model]="links" [activeItem]="current" ariaLabel="เมนูหลัก">
  <a wuNavbarBrand routerLink="/">วิระ</a>
  <button wuNavbarEnd wuButton type="button" label="เข้าสู่ระบบ" size="small"></button>
</wu-navbar>
```
```ts
import { WuMenuItem } from '@wirabyte/ui/menu';

links: WuMenuItem[] = [
  { label: 'หน้าแรก', routerLink: '/', routerLinkActiveOptions: { exact: true } },
  { label: 'ข่าวสาร', routerLink: '/news', badge: '3' },
  { label: 'บริการ', items: [{ label: 'ตารางเรียน', routerLink: '/timetable' }, { separator: true }, { label: 'ปิดปรับปรุง', disabled: true }] },
  { label: 'เกี่ยวกับเรา', command: (event) => this.openAbout(event) },
];
current: WuMenuItem | null = null;   // only for apps without a router
```

**Inputs**
- `model`: `WuMenuItem[]` — links; items with `items` are dropdowns (popup wu-menu under the button; Arrow Down opens; a dropdown holding the current page is active too). `routerLink` / `url` / `command`, `icon`, `badge`, `disabled`, `visible:false` work.
- `activeItem`: `WuMenuItem | null` — current page when no router (routerLink items use routerLinkActive)
- `breakpoint`: `string | number` = `'960px'` — at or below this width links fold into a panel (number = px)
- `sticky`: `boolean` = `false` — stays at top while scrolling; host gets `wu-navbar-scrolled` + shadow once scrolled
- `variant`: `'solid' | 'glass' | 'transparent'` = `'solid'` — solid = card colour + line (default); glass = translucent blur; transparent = no background until the page scrolls (over a hero image)
- `aside`: `WuAsideMenu` — the side menu the menu button controls (see app shell below)
- `asideCollapse`: `boolean` = `true` — with `aside`: on wide screens the button collapses / expands it (`false`: button only on narrow screens)
- `ariaLabel`, `menuButtonAriaLabel`: `string` = locale — names of the nav landmark / menu button
- `menuIcon`, `closeIcon`: `string` — icon classes of the menu button, closed / open
- `styleClass`, `style`: `string`, `object` — on the nav element

**Outputs** — `(onMenuToggle)`: `boolean` — narrow-screen panel opened (true) / closed (false). It closes on Esc (focus back to the button), a link press, a press outside, focus leaving, or the window growing past the breakpoint.

**Slots** — attribute slots: `wuNavbarBrand` (logo), `wuNavbarLinks` (extra links after the model's; give them class `wu-navbar-link`), `wuNavbarEnd` (actions). Templates: `start` (brand), `end`, `item` (`let-item`, content of each link), plus `menuIcon` / `closeIcon` inputs. v3: `<ng-template #start>`, `#item let-item`, `#end`.

**Methods** — `toggle()`, `open()`, `close()` (open does nothing on wide screens); state getters `mobile`, `menuOpen`, `scrolled`: `boolean`.

**Types** — `type WuNavbarVariant = 'solid' | 'glass' | 'transparent'`. Host classes `wu-navbar-sticky|scrolled|menu-open`; nav `wu-navbar-solid|glass|transparent|mobile|open`.

**Tokens** — `--wu-navbar-bg`, `-color`, `-border-width`, `-border-color`, `-height`, `-padding`, `-max-width` (none = full width), `-gap`, `-z-index`, `-scrolled-shadow`, `-brand-size`, `-brand-weight`, `-links-justify`, `-link-gap`, `-link-padding`, `-link-radius`, `-link-color`, `-link-weight`, `-link-hover-bg`, `-link-active-bg`, `-link-active-color`, `-toggle-size`, `-toggle-radius`, `-panel-bg`, `-panel-shadow`, `-panel-padding`, `-panel-max-height`, `-panel-item-min-height` (all prefixed `--wu-navbar`).

**Gotchas**
- Ready-made looks: one class passed to `styleClass` that sets `--wu-navbar-*` tokens (e.g. `.navbar-dark { --wu-navbar-bg: #0f172a; --wu-navbar-color: #f8fafc; --wu-navbar-panel-bg: #0f172a }`). Put the CSS in app-wide `styles.css/scss`; component-scoped CSS cannot reach inside. On a coloured bar also set `--wu-navbar-panel-bg` (narrow panel) and override `--wu-primary-*` on `.<class> .wu-navbar-end, .<class> .wu-navbar-badge` for white buttons.
- `routerLink` links get active class + `aria-current="page"` by themselves; give `'/'` `routerLinkActiveOptions: { exact: true }`.
- User menu on the right: `<button wuNavbarEnd type="button" class="wu-navbar-link" aria-label="บัญชีของฉัน" (click)="userMenu.toggle($event)"><wu-avatar label="ส" shape="circle"></wu-avatar></button>` plus `<wu-menu #userMenu [model]="userItems" [popup]="true"></wu-menu>` anywhere in the template ([menu.md](menu.md)). `wu-avatar` itself is not clickable, so wrap it in a button.
- Replacing a hand-built menubar + hamburger: model to `[model]`, logo to `wuNavbarBrand`, user button to `wuNavbarEnd`, delete mobile toggle code and media queries.
- Slots: v3 `#start`; v1/v2 `wuTemplate="start"`.

---
