# Skeleton

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: top-layer rules (no appendTo / z-index) and slot syntax.

`wu-skeleton` · `WuSkeletonModule` / `WuSkeleton` from `@wirabyte/ui/skeleton`

Placeholder shapes shown while data loads, laid out like the real content.

```html
<wu-skeleton></wu-skeleton>
<wu-skeleton width="10rem" height="2rem"></wu-skeleton>
<wu-skeleton shape="circle" size="3rem"></wu-skeleton>
<wu-skeleton size="3rem" borderRadius="12px"></wu-skeleton>
<wu-skeleton animation="none"></wu-skeleton>
```

**Inputs**
- `shape`: `'rectangle' | 'circle'` = `'rectangle'`
- `size`: `string` - equal width and height, e.g. `3rem`
- `width`: `string` = `'100%'`; `height`: `string` = `'1rem'`
- `borderRadius`: `string`
- `animation`: `'wave' | 'none'` = `'wave'` - shimmer (also off under reduced motion)
- `styleClass` · `style`

**Tokens** - `--wu-skeleton-bg`, `--wu-skeleton-wave`, `--wu-radius-md`

**Gotchas**
- Compose a card placeholder from several skeletons (circle + two lines + block); there is no card preset.
