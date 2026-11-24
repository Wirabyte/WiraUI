# Drawer

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: top-layer rules (no appendTo / z-index) and slot syntax.

`wu-drawer` · `WuDrawerModule` / `WuDrawer` from `@wirabyte/ui/drawer`
Also accepted: `wu-sidebar` (`WuSidebar` is the same class); `<p-drawer>` / `<p-sidebar>` templates move over unchanged.

A panel that slides in from a window edge (left, right, top, bottom or full screen): side menu, filters, short form. A native dialog: page behind is inert, focus stays inside, closes with ×, Esc or backdrop click. 20rem wide by default, never wider than a phone screen.

```html
<wu-button label="เปิดเมนู" icon="wi wi-bars" (onClick)="menuOpen = true"></wu-button>
<wu-drawer header="เมนู" [(visible)]="menuOpen">
  <wu-menu [model]="menuItems" [style]="{ width: '100%', border: 'none' }" ariaLabel="เมนู"></wu-menu>
</wu-drawer>
```
```html
<!-- header / footer templates; async save button via [loading] -->
<wu-drawer [(visible)]="contactOpen" position="right" [style]="{ width: '24rem' }">
  <ng-template #header><span>สมหญิง ใจดี</span></ng-template>
  …
  <ng-template #footer><wu-button label="บันทึก" [loading]="isApiSaving" (onClick)="saveContact()"></wu-button></ng-template>
</wu-drawer>

<wu-drawer #preview [(visible)]="previewOpen" position="bottom"><ng-template #headless>…</ng-template></wu-drawer>
```

**Inputs**
- `visible`: `boolean` = `false` - `[(visible)]`
- `position`: `'left' | 'right' | 'top' | 'bottom' | 'full'` = `'left'` - top/bottom take full width, set height via `[style]`
- `fullScreen`: `boolean` = `false` - same as `position="full"`
- `header`: `string` - title (also the dialog's name)
- `modal`: `boolean` = `true` - dim backdrop, page inert, focus inside; `false` = page still usable (chat/help panels)
- `dismissible`: `boolean` = `true` - backdrop click closes
- `blockScroll`: `boolean` = `modal`
- `showCloseIcon` · `closable`: `boolean` = `true` - the × button
- `closeOnEscape`: `boolean` = `true`
- `closeIcon` · `ariaCloseLabel`: `string` - icon class, button name (default name from locale)
- `ariaLabel`: `string` - panel name when no `header`
- `styleClass` · `style` · `maskStyleClass`
- Accepted, no effect: `appendTo`, `autoZIndex`, `baseZIndex`, `transitionOptions`

**Outputs** - `(visibleChange)`: boolean · `(onShow)` · `(onHide)`: void - has opened / closed

**Slots** - `header` (replaces title), `content` (or put content straight in the tag), `footer` (bottom bar, stays pinned), `headless` (replaces header+content+footer), `closeicon`. Written `#name`, `wuTemplate="name"` or `pTemplate="name"`. No context variables.

**Methods** - `show()` opens from code; `hide()` closes and emits `visibleChange`.

```ts
type WuDrawerPosition = 'left' | 'right' | 'top' | 'bottom' | 'full';
```

**Tokens** - `--wu-drawer-size` (width left/right, height top/bottom), `--wu-drawer-bg`, `--wu-drawer-border-width`, `--wu-drawer-shadow`, `--wu-drawer-header-padding`, `--wu-drawer-content-padding`, `--wu-drawer-title-size`, `--wu-drawer-title-weight`

**Gotchas**
- Close the drawer yourself after navigation commands (`menuOpen = false`).
- `p-drawer` / `p-sidebar` classes sit beside `wu-drawer`, so old CSS targeting them keeps working.
