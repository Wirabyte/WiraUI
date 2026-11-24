# Badge

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: severity values and the style inputs every display component takes.

`wu-badge` and directive `wuBadge` · `WuBadgeModule` / `WuBadge` from `@wirabyte/ui/badge`
Also accepted: directive `pBadge`; directive input alias `badgeSize` for `size`.

A small count or dot (no `value` = dot). The `wuBadge` directive pins a badge to the top-right corner of any element.

```html
<wu-badge value="8"></wu-badge>
<wu-badge severity="success"></wu-badge>
<wu-badge value="4" size="large"></wu-badge>

<span class="notify-icon" wuBadge [value]="unread" severity="danger" [badgeDisabled]="!unread">
  <i class="wi wi-bell"></i>
</span>
```

**Inputs (component)** — `value`: `string | number` — shown value, dot when omitted · `severity`: `WuSeverityInput` = `'primary'` · `size`: `'small' | 'large' | 'xlarge'` · `styleClass` · `style`
**Inputs (directive `wuBadge`/`pBadge`)** — `value` · `severity` = `'primary'` · `size` · `badgeSize`: `'small' | 'large' | 'xlarge'` · `badgeDisabled`: `boolean` = `false` — hide the badge · `badgeStyleClass`: `string` · `badgeStyle`: `object` — class/style of the badge itself
**Types** — `type WuBadgeSize = 'small' | 'large' | 'xlarge';` plus `WuSeverity` / `WuSeverityInput`.
**Tokens** — --wu-badge-size, --wu-badge-dot-size, --wu-badge-padding-x, --wu-badge-font-size, --wu-badge-font-weight, --wu-primary-color, --wu-primary-contrast, --wu-radius-full
**Gotchas**
- The directive comes from the same `WuBadgeModule`; the host element needs positioning room (docs demo uses a `.notify-icon` wrapper of its own).
- Hide a corner badge with `[badgeDisabled]`, not by setting `value` to empty.
