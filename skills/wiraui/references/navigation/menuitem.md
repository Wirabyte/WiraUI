# MenuItem (shared model)

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

Every menu-like component here takes a `MenuItem[]` (`model`), the same shape as PrimeNG's MenuItem, so existing models work unchanged. Import from `@wirabyte/ui/api` (`MenuItem`, `MenuItemCommandEvent`) or `@wirabyte/ui/menu` / `menubar` / `config` (`WuMenuItem`, `WuMenuItemCommandEvent`); same shape, docs use either.

```ts
interface WuMenuItemCommandEvent { originalEvent?: Event; item?: WuMenuItem; index?: number }

interface WuMenuItem {
  label?: string;  icon?: string;  iconStyle?: Record<string, string | number> | null;  iconClass?: string;
  command?(event: WuMenuItemCommandEvent): void;   // runs on click / Enter / Space, after the menu closes
  url?: string;                                    // plain link (href)
  routerLink?: any;                                // '/students' or ['/students', id]; needs the app's router
  routerLinkActiveOptions?: any;                   // { exact: true } or IsActiveMatchOptions
  queryParams?: Record<string, unknown>;  queryParamsHandling?: 'merge' | 'preserve' | '' | null;
  fragment?: string;  preserveFragment?: boolean;  skipLocationChange?: boolean;  replaceUrl?: boolean;
  state?: Record<string, unknown>;  target?: string;
  items?: WuMenuItem[];                            // submenu
  expanded?: boolean;  disabled?: boolean;  visible?: boolean;  separator?: boolean;
  escape?: boolean;                                // false: label is HTML (sanitised by Angular)
  badge?: string;  badgeStyleClass?: string;
  style?: Record<string, string | number> | null;  styleClass?: string;
  title?: string;  id?: string;  automationId?: string;  tabindex?: string;
  tooltip?: string;  tooltipOptions?: unknown;
  [key: string]: unknown;                          // your own fields (shortcut, isNew, color, active …)
}
```

- Activation: a `routerLink` item navigates through the app's router and gets an active class (`routerLinkActive`) plus `aria-current="page"`; a `url` item is a plain `<a href>`; a `command` item has no href so the page stays put. `routerLinkActiveOptions` defaults to `{ exact: false }`: give a home / parent link (`'/'`) `{ exact: true }` or it lights up on every page.
- Apps without a router mark the current page themselves (`[activeItem]` on Navbar / AsideMenu / TabMenu).
- Not every component reads every field (e.g. Steps reads `label subtitle command routerLink url disabled visible styleClass style title`; Breadcrumb reads `disabled` but not `visible`). Each section lists what that component uses.
- `routerLink` needs `@angular/router` (optional peer; Menubar entry uses it).
- Slots: v3 `<ng-template #item let-item>`; v1/v2 `<ng-template wuTemplate="item" let-item>` (`pTemplate` also accepted). Every `item` slot below follows this.

---
