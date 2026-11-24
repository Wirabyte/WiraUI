# Chip

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: severity values and the style inputs every display component takes.

`wu-chip` · `WuChipModule` / `WuChip` from `@wirabyte/ui/chip`

Compact pill for a piece of data, with icon or image, optionally removable.

```html
<wu-chip label="ส่งแล้ว" icon="wi wi-send"></wu-chip>
<wu-chip label="สมชาย ใจดี" image="assets/avatar.png" alt="สมชาย"></wu-chip>
@for (t of tags; track t) {
  <wu-chip [label]="t" [removable]="true" (onRemove)="remove(t)"></wu-chip>
}
```
```ts
tags = ['ด่วน', 'ลูกค้าใหม่', 'รอโทรกลับ'];
remove(tag: string): void { this.tags = this.tags.filter((t) => t !== tag); }
```
(classic `*ngFor="let t of tags"`.)

**Inputs** — `label`: `string` · `icon`: `string` — icon class · `image`: `string` — leading image URL · `alt`: `string` — image alt · `removable`: `boolean` = `false` — shows remove button · `styleClass` · `style`
**Outputs** — `(onRemove)`: `Event` — remove pressed · `(onImageError)`: `Event` — image failed
**Tokens** — --wu-chip-bg, --wu-chip-color, --wu-chip-padding-x, --wu-chip-padding-y, --wu-chip-radius, --wu-chip-gap, --wu-control-focus-shadow
**Gotchas**
- Pressing remove hides the chip itself and emits `(onRemove)`; you must still remove the item from your own list.
- Chip has no `severity`; use Tag for coloured status labels.
