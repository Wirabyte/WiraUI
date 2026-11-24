# Avatar

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: severity values and the style inputs every display component takes.

`wu-avatar`, `wu-avatar-group` · `WuAvatarModule` / `WuAvatar` + `WuAvatarGroup` from `@wirabyte/ui/avatar`

A picture, icon or initials for a person. If `image` fails to load, `label` shows instead.

```html
<wu-avatar label="ส"></wu-avatar>
<wu-avatar icon="wi wi-user"></wu-avatar>
<wu-avatar image="assets/avatar.png" ariaLabel="สมชาย ใจดี"></wu-avatar>
<wu-avatar icon="wi wi-check-circle" severity="success" ariaLabel="ปิดงานแล้ว"></wu-avatar>
<wu-avatar-group>
  <wu-avatar label="ส" shape="circle"></wu-avatar>
  <wu-avatar label="+5" shape="circle"></wu-avatar>
</wu-avatar-group>
```

**Inputs** — `label`: `string` — text (also the fallback for a failed image) · `icon`: `string` — icon class · `image`: `string` — image URL · `size`: `'normal' | 'large' | 'xlarge'` = `'normal'` · `shape`: `'square' | 'circle'` = `'square'` · `severity`: `'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast'` — soft colour tile behind icon/letters (an `image` gets no tile; good for KPI icons/status markers) · `ariaLabel`: `string` — accessible name · `styleClass` · `style`
**Outputs** — `(onImageError)`: `Event` — image failed to load
**Tokens** — --wu-avatar-size, --wu-avatar-bg, --wu-avatar-color, --wu-avatar-font-size, --wu-avatar-radius, --wu-tag-soft-mix, --wu-card-bg (ring between grouped avatars)
**Gotchas**
- `WuAvatarGroup` ships in `WuAvatarModule`; wrap avatars in `wu-avatar-group` to overlap them.
- Default shape is `square`; set `shape="circle"` for round avatars.
- Icon-only/image avatars need `ariaLabel`.
