# Tag

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: severity values and the style inputs every display component takes.

`wu-tag` · `WuTagModule` / `WuTag` from `@wirabyte/ui/tag`

Short label for a status or category, coloured by severity.

```html
<wu-tag value="ใหม่"></wu-tag>
<wu-tag value="เปิดใช้งาน" severity="success" [rounded]="true"></wu-tag>
<wu-tag value="ยืนยันแล้ว" icon="wi wi-check" severity="info"></wu-tag>
<wu-tag severity="warn"><span class="wi wi-bell"></span> รออนุมัติ 3 รายการ</wu-tag>
```

**Inputs** — `value`: `string | number` — text · `severity`: `WuSeverityInput` = `'primary'` · `rounded`: `boolean` = `false` — pill · `icon`: `string` — icon class before the text · `styleClass` · `style`
**Slots** — content inside the tag (leave out `value`) replaces the text.
**Types** — `WuSeverity` / `WuSeverityInput` (see top).
**Tokens** — --wu-tag-padding-x, --wu-tag-padding-y, --wu-tag-radius, --wu-tag-font-size, --wu-tag-font-weight, --wu-tag-gap, --wu-tag-fill (solid or soft), --wu-primary-soft, --wu-success-bg (info/warn/danger/help alike), --wu-radius-full · `overrides: components.tag` e.g. `tag: { pill: true }`
**Gotchas**
- `'warning'` / `'error'` work as `'warn'` / `'danger'`.
- Global pill look via overrides: `components.tag.pill`.
