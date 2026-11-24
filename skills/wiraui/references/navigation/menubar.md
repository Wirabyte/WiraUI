# Menubar

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`<wu-menubar>` · `WuMenubarModule` (also exports `WuTemplate`) / `WuMenubar` from `@wirabyte/ui/menubar` · all majors

A horizontal bar with start/end slots; submenus drop under items and nest; keyboard throughout; folds into a menu button on narrow screens. Also the plain page header bar when you give no `[model]`. For responsive site navigation with sticky/glass variants prefer Navbar.

```html
<wu-menubar [model]="items" ariaLabel="เมนูหลัก">
  <ng-template #start><span class="font-semibold"><i class="wi wi-book"></i> WiraSchool</span></ng-template>
  <ng-template #end><wu-button label="ออกจากระบบ" icon="wi wi-sign-out" severity="secondary" [text]="true"></wu-button></ng-template>
</wu-menubar>
```
```ts
import { MenuItem } from '@wirabyte/ui/api';
items: MenuItem[] = [
  { label: 'หน้าแรก', icon: 'wi wi-home' },
  { label: 'นักเรียน', icon: 'wi wi-users', items: [
      { label: 'รายชื่อนักเรียน', icon: 'wi wi-list' }, { separator: true }, { label: 'นำเข้าจาก Excel', icon: 'wi wi-upload' },
  ] },
];
```
Header bar only: omit `[model]` (content placed directly inside the tag lands at the end; no menu button on narrow screens).

**Inputs**
- `model`: `MenuItem[]` = `[]` — optional
- `breakpoint`: `string` = `'960px'` — at or below, items fold into the menu button (accessible name from locale "Menu"; submenus open in place under the bar)
- `autoDisplay`: `boolean` = v1 `false` · v2/v3 `true` — open bar submenus on hover
- `autoHide`: `boolean` = `false` — close menus when the pointer leaves the bar
- `autoHideDelay`: `number` = `100` — ms before closing (autoHide)
- `id`: `string` — bar id, prefixes item ids
- `ariaLabel`, `ariaLabelledBy`: `string` — name of the `role="menubar"` row
- `styleClass`, `style`: `string`, `object`
- `autoZIndex`, `baseZIndex`: `unknown` — accepted, no effect

**Outputs** — `(onFocus)`: `FocusEvent` focus came into the bar; `(onBlur)`: `FocusEvent` focus left the whole bar.

**Slots** — `start`, `end` (no context), `item` (`let-item`, `let-root="root"`, `let-hasSubmenu="hasSubmenu"`: content of each item in place of icon/label/badge/arrow), `menuicon` (narrow-screen button icon), `submenuicon` (arrow of items with a submenu).

**MenuItem fields it reads** — `label icon` · `items` (nested) · `command` · router fields · `routerLinkActiveOptions` (class `wu-menubar-link-active`) · `url target` · `disabled visible` · `separator` (upright line in the bar) · `badge badgeStyleClass` · `escape` · `styleClass style iconClass iconStyle` · `title automationId`.

**Types**
```ts
interface WuMenubarItemContext { $implicit: MenuItem; root: boolean; hasSubmenu: boolean }
```

**Tokens** — `--wu-menubar-bg`, `-border-width`, `-radius`, `-padding`, `-gap`, `-root-gap`, `-item-padding`, `-item-radius`, `-item-color`, `-item-icon-color`, `-item-hover-bg`, `-item-hover-color`, `-item-active-bg` (submenu open), `-item-active-color`, `-link-active-color`, `-submenu-bg`, `-submenu-border-width`, `-submenu-radius`, `-submenu-shadow`, `-submenu-padding`, `-submenu-gap`, `-submenu-offset`, `-submenu-min-width`, `-submenu-item-padding`, `-submenu-item-radius`, `-separator-color`, `-button-size`, `-button-radius`; plus `--wu-border` (border colour).

**Gotchas**
- Migrating from `<p-menubar>`: rename the tag; models and `pTemplate="start|end|item"` work; `p-menubar-*` classes sit next to `wu-menubar-*`.
- `autoDisplay` default differs by major (v1 off, v2/v3 on). When hover opened a menu, the following click keeps it open.
- To highlight only the picked section when routing by fragment, compare it: `{ paths: 'exact', queryParams: 'ignored', fragment: 'exact', matrixParams: 'ignored' }` as `routerLinkActiveOptions`.
- Keyboard: whole bar is one Tab stop; `← →` along the bar, `↓ ↑ Enter Space` open a submenu, `Esc` steps back one level, typing a letter (Thai too) jumps to the next match. Name the bar with `ariaLabel`/`ariaLabelledBy`.
- Slots: v3 `#start`; v1/v2 `wuTemplate="start"`.

---
