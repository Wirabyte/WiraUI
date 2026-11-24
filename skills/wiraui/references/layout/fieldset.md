# Fieldset

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`wu-fieldset` · `WuFieldsetModule` / `WuFieldset` from `@wirabyte/ui/fieldset`

Group of content with a legend like `<fieldset>`, optionally collapsible.

```html
<wu-fieldset legend="ข้อมูลเพิ่มเติม" [toggleable]="true" [(collapsed)]="moreClosed">
  <p>หมายเหตุสำหรับทีมงาน</p>
</wu-fieldset>
<wu-fieldset>
  <ng-template #header><i class="wi wi-phone"></i> ผู้ติดต่อฉุกเฉิน</ng-template>
  <p>…</p>
</wu-fieldset>
```

**Inputs** — `legend`: `string` · `toggleable`: `boolean` = `false` (click the legend to collapse) · `collapsed`: `boolean` = `false` (`[(collapsed)]`) · `styleClass`, `style`
**Outputs** — `(collapsedChange)`: `boolean` · `(onToggle)`: `{ collapsed: boolean }`
**Slots** — `header` template (`#header` / `wuTemplate` / `pTemplate`) = custom legend.
**Tokens** — `--wu-fieldset-padding`, `--wu-fieldset-radius`, `--wu-fieldset-legend-bg`, `--wu-fieldset-legend-border-width`, `--wu-fieldset-legend-color`, `--wu-fieldset-legend-weight`, `--wu-fieldset-legend-padding-x`, `--wu-fieldset-legend-padding-y`, `--wu-border` (legend bg/border differ in v2/v3 vs v1)

**Gotchas** — template slot syntax as above (v3 `#header`, v1/v2 `wuTemplate="header"`).
