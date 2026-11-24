# PanelMenu

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`<wu-panelmenu>` (also `wu-panelMenu`) · `WuPanelMenuModule` (also exports `WuTemplate`) / `WuPanelMenu` from `@wirabyte/ui/panelmenu`

A side menu of collapsible panels: root items are headers, their `items` open under them and nest. The open state lives in each item's `expanded` flag. Fills the box it sits in. Simpler than AsideMenu (no rail/off-canvas).

```html
<wu-panelmenu [model]="items"></wu-panelmenu>
```
```ts
items: MenuItem[] = [
  { label: 'นักเรียน', icon: 'wi wi-users', expanded: true, items: [
      { label: 'รายชื่อนักเรียน' },
      { label: 'นำเข้าข้อมูล', items: [{ label: 'จากไฟล์ Excel' }] },
  ] },
  { label: 'ตารางเรียน', items: [{ label: 'ตารางสอนครู' }] },
];
```

**Inputs**
- `model`: `MenuItem[]` = `[]` — root items are headers
- `multiple`: `boolean` = v1 `true` · v2/v3 `false` — several root panels stay open (nested items always open on their own)
- `styleClass`, `style`: `string`, `object` — whole menu (e.g. `[style]="{ width: '100%' }"`)
- `id`: `string` — prefixes header/item ids
- `tabindex`: `number | string`
- `transitionOptions`: `unknown` — accepted, no effect

**Slots** — `item` (`let-item`, `let-root="root"`: content of every header and item, replaces icon/label/badge/arrow), `submenuicon` (arrow only; turns by itself when open).

**MenuItem fields it reads** — `label icon`, `items`, `expanded` (default `false`; the menu writes it back on your model), `command` (leaf items), router fields, `routerLinkActiveOptions` (class `wu-panelmenu-link-active`), `url target`, `disabled visible`, `separator`, `badge badgeStyleClass`, `styleClass style`, `title`.

**Types** — `interface ItemContext { $implicit: MenuItem; root: boolean }`.

**Tokens** — `--wu-panelmenu-gap`, `-panel-bg`, `-panel-border-width`, `-panel-radius`, `-panel-padding`, `-header-padding`, `-header-border-width`, `-header-radius`, `-header-active-radius`, `-header-bg`, `-header-color`, `-header-weight`, `-content-bg`, `-content-border-width`, `-content-padding`, `-submenu-indent`, `-item-padding`, `-item-radius`, `-item-color`, `-item-icon-color`, `-item-hover-bg`, `-icon-order` (arrow right `1` / left `-1`, v1); plus `--wu-border`.

**Gotchas**
- `expanded` is mutated on the model objects: give two menus separate arrays (don't share one array between menus).
- `multiple` default flips between v1 and v2/v3; set it explicitly if behaviour matters.
- Migration from `<p-panelMenu>`: rename tag; models incl. `expanded` work; `pTemplate="item"|"submenuicon"` work.
- Slots: v3 `#item`; v1/v2 `wuTemplate="item"`.

---
