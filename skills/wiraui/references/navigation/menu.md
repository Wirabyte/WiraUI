# Menu

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`<wu-menu>` · `WuMenuModule` (also exports `WuTemplate`) / `WuMenu` from `@wirabyte/ui/menu` · exportAs `wuMenu`

A list of commands and links: a popup opened from a button (profile menu in a header) or placed in the page as a side menu. Items with `items` become group label rows.

```html
<wu-button icon="wi wi-user" [rounded]="true" [text]="true" ariaLabel="บัญชีของฉัน" (onClick)="profileMenu.toggle($event)"></wu-button>
<wu-menu #profileMenu [model]="profileItems" [popup]="true" ariaLabel="บัญชีของฉัน"></wu-menu>
```
```ts
import { MenuItem } from '@wirabyte/ui/api';
profileItems: MenuItem[] = [
  { label: 'โปรไฟล์ของฉัน', icon: 'wi wi-user', command: (event) => this.run(event) },
  { separator: true },
  { label: 'ออกจากระบบ', icon: 'wi wi-sign-out' },
];
```
In the page (no `popup`): `<wu-menu [model]="sideItems" [style]="{ width: '100%', border: 'none' }"></wu-menu>`.

**Inputs**
- `model`: `MenuItem[]` = `[]`
- `popup`: `boolean` = `false` — popup opened with `toggle` / `show`
- `id`: `string` — prefixes item ids
- `ariaLabel`, `ariaLabelledBy`: `string` — name of the `role="menu"` list
- `styleClass`, `style`: `string`, `object` — popup too
- `appendTo`, `autoZIndex`, `baseZIndex`, `showTransitionOptions`, `hideTransitionOptions`: `unknown` — accepted, no effect (popup lives in the top layer)

**Outputs** — `(onShow)` / `(onHide)`: `void` popup opened / closed; `(onFocus)` / `(onBlur)`: `FocusEvent`.

**Slots** — `start`, `end` (content above/below items), `item` (`let-item`), `submenuheader` (`let-item`, group labels).

**Methods** — `toggle(event?)` (open if closed, close if open), `show(event?)` (opens next to the element the event came from), `hide()`. Call via `#menu` ref.

**MenuItem fields it reads** — `label icon`, `items` (makes a group label, one level only), `command`, router fields, `routerLinkActiveOptions` (class `wu-menu-link-active`), `url target`, `disabled visible`, `separator`, `badge badgeStyleClass`, `escape`, `styleClass style iconClass iconStyle`, `title automationId`.

**Tokens** — `--wu-menu-bg`, `-overlay-bg`, `-border-width`, `-overlay-border-width`, `-radius`, `-padding`, `-gap`, `-min-width`, `-shadow`, `-item-padding`, `-item-radius`, `-item-color`, `-item-icon-color`, `-item-hover-bg`, `-item-hover-color`, `-link-active-color`, `-submenu-label-padding`, `-submenu-label-bg`, `-submenu-label-color`, `-submenu-label-weight`, `-separator-color`; plus `--wu-border`.

**Gotchas**
- Popup opens in the top layer: no `appendTo`. Opening focuses the first item; Esc closes and returns focus to the button; Tab closes and moves on.
- Slots: v3 `#item`; v1/v2 `wuTemplate="item"`.

---
