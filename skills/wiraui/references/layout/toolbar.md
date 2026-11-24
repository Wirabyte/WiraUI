# Toolbar

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`wu-toolbar` · `WuToolbarModule` / `WuToolbar` from `@wirabyte/ui/toolbar`

Bar of actions in three groups (start, center, end) that wraps on narrow screens (no media queries).

```html
<wu-toolbar ariaLabel="จัดการเอกสาร">
  <wu-button wuToolbarStart label="สร้างใหม่" icon="wi wi-plus"></wu-button>
  <wu-button wuToolbarStart label="ส่งออก" severity="secondary" [outlined]="true"></wu-button>
  <wu-iconfield wuToolbarCenter>
    <wu-inputicon icon="wi wi-search"></wu-inputicon>
    <input wuInputText placeholder="ค้นหา" />
  </wu-iconfield>
  <wu-button wuToolbarEnd icon="wi wi-bell" ariaLabel="การแจ้งเตือน" [text]="true" [rounded]="true"></wu-button>
</wu-toolbar>
```

**Inputs** — `ariaLabel`: `string` (`role="toolbar"`) · `styleClass`, `style`
**Slots** — attributes `wuToolbarStart` (left; unmarked content goes here too), `wuToolbarCenter`, `wuToolbarEnd` (right); templates `start`, `center`, `end` (`left` / `right` are older names for start/end), via `#start`, `wuTemplate` or `pTemplate`.
**Tokens** — `--wu-toolbar-bg`, `--wu-toolbar-padding`, `--wu-border`, `--wu-radius-md`

**Gotchas** — items within a group are spaced for you; template syntax v3 `#start`, v1/v2 `wuTemplate="start"`.
