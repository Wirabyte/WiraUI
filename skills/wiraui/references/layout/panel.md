# Panel

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`wu-panel` · `WuPanelModule` / `WuPanel` from `@wirabyte/ui/panel`

Titled box that can collapse, with slots for header, header icons and footer.

```html
<wu-panel header="ตัวกรองขั้นสูง" [toggleable]="true" [(collapsed)]="filtersClosed">
  <p>ช่วงวันที่ สถานะ และผู้รับผิดชอบ</p>
</wu-panel>
<wu-panel>
  <div wuPanelHeader><b>สมาชิก</b> <wu-badge value="5"></wu-badge></div>
  <wu-button wuPanelIcons icon="wi wi-plus" [text]="true" [rounded]="true" ariaLabel="เพิ่ม"></wu-button>
  <p>เนื้อหา</p>
  <div wuPanelFooter>อัปเดตล่าสุด 5 นาทีที่แล้ว</div>
</wu-panel>
```

**Inputs** — `header`: `string` · `toggleable`: `boolean` = `false` · `collapsed`: `boolean` = `false` (`[(collapsed)]`) · `toggler`: `'icon' | 'header'` = `'icon'` (button, or whole header clickable) · `styleClass`, `style`
**Outputs** — `(collapsedChange)`: `boolean` · `(onToggle)`: `{ collapsed: boolean }` (user collapsed/expanded)
**Slots** — attributes `wuPanelHeader` (custom header instead of `header`), `wuPanelIcons` (right of header), default content, `wuPanelFooter`; elements `wu-header` / `wu-footer` (from `WuCardModule`); templates `header`, `icons`, `footer` (`#name` / `wuTemplate` / `pTemplate`).
**Tokens** — `--wu-panel-header-bg`, `--wu-panel-header-color`, `--wu-panel-header-padding`, `--wu-panel-header-weight`, `--wu-panel-content-padding`, `--wu-panel-radius`, `--wu-panel-border-width`, `--wu-border`, `--wu-card-bg`

**Gotchas**
- Templates: v3 `#header`, v1/v2 `wuTemplate="header"`.
- `[(collapsed)]` writes back when the user toggles.
