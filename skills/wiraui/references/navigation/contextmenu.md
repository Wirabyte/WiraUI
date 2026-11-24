# ContextMenu

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`<wu-contextmenu>` (also `wu-contextMenu`, `wu-context-menu`) · `WuContextMenuModule` / `WuContextMenu` from `@wirabyte/ui/contextmenu`

A menu opened where the right-click happened: on one element, on the whole page, or from code. Items can have submenus like TieredMenu; the keyboard menu key / `Shift`+`F10` opens it at the focused element.

```html
<div #worksheet class="file-card" tabindex="0">ใบงานคณิตศาสตร์ ม.1</div>
<wu-contextMenu [model]="fileActions" [target]="worksheet"></wu-contextMenu>
```
Per-row (know which row was clicked): omit `target`, call `show($event)` from each row's `(contextmenu)`:
```html
@for (file of files; track file.id) {
  <li tabindex="0" (contextmenu)="pickFile(file); fileMenu.show($event)">{{ file.name }}</li>
}
<wu-contextMenu #fileMenu [model]="fileActions"></wu-contextMenu>
```
```ts
fileActions: WuMenuItem[] = [
  { label: 'คัดลอก', icon: 'wi wi-copy', command: (event) => this.run(event) },
  { label: 'แชร์', items: [{ label: 'ให้ครูในกลุ่มสาระ', command: (event) => this.run(event) }] },
  { separator: true },
  { label: 'ลบ', icon: 'wi wi-trash', command: (event) => this.run(event) },
];
```

**Inputs**
- `model`: `WuMenuItem[]` — submenus allowed
- `target`: `HTMLElement | ElementRef | string | component` — right-clicks here open it (string = element id)
- `global`: `boolean` = `false` — right-clicks anywhere on the page
- `triggerEvent`: `string` = `'contextmenu'` — event that opens it on the target (e.g. `"click"`)
- `ariaLabel`: `string`
- `styleClass`, `style`: `string`, `object`
- `appendTo`, `autoZIndex`, `baseZIndex`: `unknown` — accepted, no effect

**Item fields** — same set as TieredMenu (`label icon items command routerLink queryParams url target separator disabled visible badge title styleClass style`).

**Outputs** — `(onShow)`, `(onHide)`: `void`.

**Methods** — `show(event)` (at the event's pointer; keyboard: at the event's element), `hide()`, `toggle(event)`.

**Tokens** — none of its own; uses Menu tokens.

**Gotchas**
- Table (`[contextMenu]` with `wuContextMenuRow`) and Tree (`[contextMenu]`) connect to this menu by themselves.
- Migration from `<p-contextMenu>`: `[model] [target] [global] triggerEvent` and methods keep names; `appendTo` not needed.

---
