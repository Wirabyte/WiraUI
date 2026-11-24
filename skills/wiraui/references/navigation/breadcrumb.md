# Breadcrumb

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`<wu-breadcrumb>` · `WuBreadcrumbModule` / `WuBreadcrumb` from `@wirabyte/ui/breadcrumb`

Shows where the page sits in the app with a link back to each level. The last item is the current page (`aria-current="page"`, class `wu-breadcrumb-current`).

```html
<wu-breadcrumb [model]="trail" [home]="home" homeAriaLabel="หน้าแรก" (onItemClick)="pressed($event)"></wu-breadcrumb>
```
```ts
import { WuBreadcrumbItemClickEvent } from '@wirabyte/ui/breadcrumb';

home: WuMenuItem = { routerLink: '/' };   // no icon: built-in house
trail: WuMenuItem[] = [{ label: 'ระบบทะเบียน', routerLink: '/reg' }, { label: 'ม.1/1' }];   // last = current page
pressed(event: WuBreadcrumbItemClickEvent): void { /* event.item */ }
```
Above a page title: `<wu-breadcrumb [model]="gradeTrail" [home]="home" variant="plain"></wu-breadcrumb>`.

**Inputs**
- `model`: `WuMenuItem[]` — the trail (last item = current page)
- `home`: `WuMenuItem` — first item; without `icon` it gets the built-in house
- `homeAriaLabel`: `string` = locale — name of home when it has no label
- `ariaLabel`: `string` = locale — name of the whole trail
- `variant`: `'default' | 'plain'` = `'default'` — plain: no box, padding or border
- `styleClass`, `style`: `string`, `object`

**Item fields** — `label icon title` · `routerLink queryParams fragment routerLinkActiveOptions state` · `url target` · `command` (`{ originalEvent, item }`) · `disabled` (`false`; shown but not pressable) · `escape` (`true`) · `styleClass style iconStyle`.

**Outputs** — `(onItemClick)`: `WuBreadcrumbItemClickEvent` — an item was pressed (home too).

**Slots** — `item` (`let-item`; also draws home, so give home an `icon`), `separator` (replaces the arrow between items).

**Types** — `interface WuBreadcrumbItemClickEvent { originalEvent: Event; item: WuMenuItem }`.

**Tokens** — `--wu-breadcrumb-padding`, `-bg`, `-border-width`, `-gap`, `-link-color`, `-link-hover-color`, `-current-color`, `-current-weight`.

**Gotchas**
- From `<p-breadcrumb>`: rename; `pTemplate="item"` still works.
- Slots: v3 `#item` / `#separator`; v1/v2 `wuTemplate=…`.

---
