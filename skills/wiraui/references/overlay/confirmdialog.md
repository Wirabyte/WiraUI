# ConfirmDialog

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: top-layer rules (no appendTo / z-index) and slot syntax.

`wu-confirmdialog` · `WuConfirmDialogModule` / `WuConfirmDialog` from `@wirabyte/ui/confirmdialog`

A confirmation asked through a service: place `<wu-confirmdialog>` once, then call `WuConfirmationService.confirm()` with message, buttons and callbacks. Service import: see Services above.

```html
<wu-confirmdialog></wu-confirmdialog>
```
```ts
import { WuConfirmationService, WuConfirmEventType } from '@wirabyte/ui/confirmdialog';
// or: import { ConfirmationService, ConfirmEventType } from '@wirabyte/ui/api';
private readonly confirmation = inject(WuConfirmationService);

remove(): void {
  this.confirmation.confirm({
    header: 'ยืนยันการลบ',
    message: 'ต้องการลบลูกค้ารายนี้หรือไม่?',
    icon: 'wi wi-exclamation-triangle',
    defaultFocus: 'reject',
    accept: () => (this.result = 'ลบแล้ว'),
    reject: (type: WuConfirmEventType) => (this.result = type === WuConfirmEventType.CANCEL ? 'ปิดไป' : 'ยกเลิก'),
  });
}
```

**`confirm()` options**
- `message` · `header`: `string`
- `icon`: `string` - warning, question, info, success, error (built-in icons) or an icon class (common classes such as `wi wi-exclamation-triangle` are recognised even without an icon font)
- `accept`: `() => void` - confirmed
- `reject`: `(type: WuConfirmEventType) => void` - REJECT (rejected) or CANCEL (closed via × / Esc)
- `acceptLabel` · `rejectLabel` · `acceptIcon` · `rejectIcon`: `string` = locale
- `acceptVisible` · `rejectVisible`: `boolean` = `true`
- `acceptButtonStyleClass` · `rejectButtonStyleClass`: `string` - button classes (existing class names like `p-button-danger` work)
- `defaultFocus`: `'accept' | 'reject' | 'close' | 'none'` = `'accept'`
- `key`: `string` - picks the `<wu-confirmdialog>` with that key
- `closable` · `closeOnEscape` · `dismissableMask` · `blockScroll`: `boolean`
- `position` · `style` · `styleClass` · `data`: `string` · `object` · `string` · `unknown` - place, styling, data for templates

**`<wu-confirmdialog>` inputs** (defaults when `confirm()` omits them) - `key`; `header` `message` `icon` `acceptLabel` `rejectLabel` `acceptIcon` `rejectIcon`; `acceptVisible` `rejectVisible` `closable` `closeOnEscape` `dismissableMask` `blockScroll`; `defaultFocus` `position` `breakpoints` `style` `styleClass` `maskStyleClass`. Accepted, no effect: `appendTo` `baseZIndex` `autoZIndex` `draggable` `rtl` `transitionOptions` `focusTrap` `modal` (always modal).

**Outputs** - `(onHide)`: `WuConfirmEventType` - closed, with the outcome

**Slots** - `#message` (`let-c` = the confirmation), `#header`, `#footer`, `#headless`. A custom footer calls `cd.accept()` / `cd.reject()` through a template reference (`<wu-confirmdialog #cd>`); older names `onAccept()` / `onReject()` also exist.

**Methods / services** - `WuConfirmationService`: `confirm(confirmation)`: `this`; `close()`: `this`; `requireConfirmation$` / `accept` (Observables, for components drawing their own dialog).

```ts
enum WuConfirmEventType { ACCEPT = 0, REJECT = 1, CANCEL = 2 }
```

**Tokens** - uses Dialog tokens (`--wu-dialog-bg`, `-radius`, `-header-padding`, `-content-padding`, `-footer-padding`) plus `--wu-warn-color`, `--wu-help-color`, `--wu-info-color`, `--wu-success-color`, `--wu-danger-color` (icon colours)

**Gotchas**
- Several dialogs on one page: give `<wu-confirmdialog key="top">` and `confirm({ key: 'top' })` the same `key`; each keeps its own `position`/style.
- If no `<wu-confirmdialog>` with that key is on the page, the question opens as an AlertDialog instead of being lost.
- Same `WuConfirmationService` also comes from `@wirabyte/ui/api` as `ConfirmationService`.
