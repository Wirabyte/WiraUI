# TieredMenu

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`<wu-tieredmenu>` (also `wu-tieredMenu`, `wu-tiered-menu`) · `WuTieredMenuModule` / `WuTieredMenu` from `@wirabyte/ui/tieredmenu`

A menu whose items open submenus to the side (any depth), in the page or as a popup. Submenus open on hover, click or `→`; on phones they open below their item. Use Menu for flat lists, ContextMenu for right-click.

```html
<wu-button label="จัดการ" icon="wi wi-angle-down" iconPos="right" (onClick)="manageMenu.toggle($event)"></wu-button>
<wu-tieredMenu #manageMenu [model]="items" [popup]="true" ariaLabel="เมนูเอกสาร"></wu-tieredMenu>
```
```ts
items: WuMenuItem[] = [
  { label: 'เอกสาร', icon: 'wi wi-file', items: [
      { label: 'สร้างใหม่', command: (event) => this.run(event) },
      { label: 'ส่งออก', items: [{ label: 'ไฟล์ PDF' }, { label: 'ไฟล์ Excel' }] },
      { separator: true },
  ] },
];
```

**Inputs**
- `model`: `WuMenuItem[]`
- `popup`: `boolean` = `false` — popup opened with `toggle($event)`; opens under the button in the top layer, closes on outside click, a pick or Esc (focus back to the button)
- `autoDisplay`: `boolean` = `true` — submenus open on hover (`false`: click only)
- `disabled`: `boolean` = `false` — whole menu off
- `ariaLabel`, `ariaLabelledBy`: `string`
- `styleClass`, `style`: `string`, `object`
- `appendTo`, `autoZIndex`, `baseZIndex`, `showTransitionOptions`, `hideTransitionOptions`, `tabindex`: `unknown` — accepted, no effect

**Item fields** — `label icon`, `items` (any depth), `command` (`{ originalEvent, item }`), `routerLink queryParams url target`, `separator disabled visible`, `badge title styleClass style`.

**Outputs** — `(onShow)`, `(onHide)`: `void` (popup).

**Slots** — `item` (`let-item`, `let-hasSubmenu="hasSubmenu"`), `submenuicon` (arrow on items with submenu).

**Methods** — `toggle(event?)`, `show(event?)`, `hide()`.

**Tokens** — none of its own; uses the Menu tokens (`--wu-menu-*`).

**Gotchas**
- Keyboard: arrows, `→`/`Enter` open a submenu, `←`/`Esc` close. Submenus flip sides near the window edge.
- Migration from `<p-tieredMenu>`: rename; inputs, events, templates and methods keep names; `p-tieredmenu` and `p-menuitem-*` classes sit beside `wu-*`.
- Slots: v3 `#item`; v1/v2 `wuTemplate="item"`.

---
