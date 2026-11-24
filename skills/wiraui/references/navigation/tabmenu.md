# TabMenu

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`<wu-tabmenu>` (also `wu-tabMenu`) · `WuTabMenuModule` / `WuTabMenu` from `@wirabyte/ui/tabmenu`

A row of tabs from a menu model, for switching views or pages. Looks like wu-tabs, scrolls sideways on overflow. It is the same component as `<wu-tabs [model]="items" [(activeItem)]="activeItem">` (lives in `@wirabyte/ui/tabs`; imports from `@wirabyte/ui/tabmenu` keep working). For tabs with their own panels, use Tabs ([layout/tabs.md](../layout/tabs.md)).

```html
<wu-tabmenu [model]="items" [(activeItem)]="activeItem" ariaLabel="ข้อมูลโรงเรียน"></wu-tabmenu>
```
```ts
items: MenuItem[] = [{ label: 'ภาพรวม', icon: 'wi wi-th-large' }, { label: 'นักเรียน', icon: 'wi wi-users' }];
activeItem: MenuItem = this.items[0];   // the same object as in the model
```

**Inputs**
- `model`: `MenuItem[]` = `[]`
- `activeItem`: `MenuItem | null` = `null` — current tab (same object as in the model); `[(activeItem)]` works. Left out: routerLink items follow the router
- `scrollable`: `unknown` — accepted, not needed (edge arrows appear when tabs overflow)
- `ariaLabel`, `ariaLabelledBy`: `string` — name of the `role="tablist"` row
- `styleClass`, `style`: `string`, `object`

**Outputs** — `(activeItemChange)`: `MenuItem` — user picked another tab (click, Enter, Space).

**Slots** — `item` (`$implicit` MenuItem, `index`).

**MenuItem fields it reads** — all except `items` / `separator`: `label icon command` (gets `{ originalEvent, item, index }`) `badge` `disabled` router fields `url` etc.

**Tokens** — `--wu-tabs-tab-color`, `--wu-tabs-tab-active-color`, `--wu-tabs-tab-weight`, `--wu-tabs-tab-padding-x`, `--wu-tabs-tab-padding-y`, `--wu-tabs-border-width`, `--wu-border`, `--wu-primary-color` (badge bg). Shared with wu-tabs.

**Gotchas**
- Router-driven tabs: give items `routerLink` (+ `queryParams`, `queryParamsHandling: 'merge'`) and omit `activeItem`; compare query params via `routerLinkActiveOptions`, e.g. `{ paths: 'exact', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored' }`.
- Keyboard: `← →` only move focus; `Enter`/`Space` open the tab.
- Migration from `<p-tabMenu>`: `[model] [activeItem] (activeItemChange) [scrollable]` keep names; `pTemplate="item"` works.
- Slot: v3 `#item`; v1/v2 `wuTemplate="item"`.

---
