# AlertDialog

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: top-layer rules (no appendTo / z-index) and slot syntax.

`WuAlertService` (inject) · `WuAlert` (static) · `WuAlertModule` / `WuAlertService` from `@wirabyte/ui/alert`

SweetAlert2 replacement: a ready-made alert opened from code with animated icon, title, text, optional input, confirm/deny/cancel buttons, timer; resolves to a Promise. Nothing goes in a template. `WuAlert.fire(...)` works anywhere but needs `provideWiraUI()` in the app providers. Option names and result shape match SweetAlert2, so existing `Swal.fire({...})` option objects move over unchanged.

```ts
import { inject } from '@angular/core';
import { WuAlertService } from '@wirabyte/ui/alert';

export class OrdersComponent { readonly alert = inject(WuAlertService); }

// or from anywhere:
import { WuAlert } from '@wirabyte/ui/alert';
WuAlert.fire('บันทึกแล้ว', '', 'success');
```

```ts
// ask first; check isConfirmed
const r = await this.alert.fire({ title: 'ลบรายการนี้?', text: 'ลบแล้วกู้คืนไม่ได้', icon: 'warning',
  showCancelButton: true, confirmButtonText: 'ลบเลย', cancelButtonText: 'ยกเลิก', confirmButtonColor: '#dc2626', focusCancel: true });
if (r.isConfirmed) this.alert.fire('ลบแล้ว', '', 'success');

// three choices: showDenyButton + showCancelButton → r.isConfirmed / r.isDenied / r.isDismissed (r.dismiss = 'cancel' | 'esc' | …)

// input + validator (value lands in `value`); input: 'select' takes inputOptions
const { value } = await this.alert.fire({ title: 'ส่งใบเสร็จทางอีเมล', input: 'email', showCancelButton: true,
  inputValidator: (v) => (!v ? 'กรุณากรอกอีเมล' : undefined) });

// preConfirm: spinner while it runs; result becomes r.value; return false to stay open
const r2 = await this.alert.fire({ title: 'ขอใบเสนอราคา', input: 'text', showLoaderOnConfirm: true,
  preConfirm: async (name) => (await this.api.createQuote(name)).id });

// helpers
if (await this.alert.confirm('ออกจากระบบ?', 'งานที่ยังไม่บันทึกจะหายไป')) { /* … */ }
const notify = this.alert.mixin({ icon: 'success', timer: 1500, showConfirmButton: false });
notify.fire({ title: 'คัดลอกลิงก์แล้ว' });
this.alert.showLoading(); await this.api.sync(); this.alert.close();
```

**Methods** (on `WuAlertService` and static `WuAlert`)
- `fire(options)` · `fire(title, text?, icon?)`: `Promise<WuAlertResult>`
- `success` · `error` · `warning` · `info` · `question` `(title, text?)`: `Promise<WuAlertResult>` - icon shortcuts
- `confirm(options | title, text?)`: `Promise<boolean>` - true only on confirm (cancel focused)
- `mixin(defaults)`: `{ fire }` - reusable preset
- `close(result?)` · `showLoading()` · `hideLoading()` · `isLoading` · `isVisible` · `getPopup()` (HTMLElement | null) · `clickConfirm()` · `clickCancel()` · `showValidationMessage()` · `resetValidationMessage()`

**Options**
- `title` · `text` · `html` · `footer`: `string` - `html` is Angular-sanitized (no scripts)
- `icon` · `iconColor`: `WuAlertIcon` · `string`
- `confirmButtonText` · `cancelButtonText` · `denyButtonText`: `string` = locale
- `showConfirmButton` = `true` · `showCancelButton` = `false` · `showDenyButton` = `false` · `showCloseButton` = `false`
- `confirmButtonColor` · `cancelButtonColor` · `denyButtonColor`: any CSS colour
- `reverseButtons`: `boolean` = `true` - cancel left, confirm right (`false` puts confirm left)
- `focusConfirm` · `focusCancel`: `boolean` = `false`
- `allowOutsideClick` · `allowEscapeKey` · `allowEnterKey`: `boolean` = `true`
- `timer` (ms) · `timerProgressBar`: `number` · `boolean` - dismiss reason is `'timer'`
- `input` · `inputValue` · `inputPlaceholder` · `inputLabel` · `inputOptions` · `inputAttributes` - `inputOptions` for select/radio
- `inputValidator` (returns a message to stay open) · `validationMessage`
- `preConfirm` · `showLoaderOnConfirm`
- `didOpen` · `willClose` · `didClose`: hooks
- `width`: `string | number` (phones always get screen width) · `customClass`: `string | object`

```ts
type WuAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question' | 'danger' | 'warn' | 'help';
type WuAlertInput = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'radio' | 'checkbox';
type WuAlertDismissReason = 'cancel' | 'backdrop' | 'close' | 'esc' | 'timer';
interface WuAlertResult<T = any> {
  isConfirmed: boolean; isDenied: boolean; isDismissed: boolean;
  value?: T;   // true on confirm, or the input value / preConfirm result; false on deny
  dismiss?: WuAlertDismissReason;
}
```

**Tokens** - `--wu-alert-width`, `--wu-alert-padding`, `--wu-alert-radius`, `--wu-alert-icon-size`, `--wu-alert-title-size`, plus shared `--wu-dialog-bg`, `--wu-dialog-border`, `--wu-dialog-shadow`

**Gotchas**
- Confirm button is on the right by default (`reverseButtons: true`), like the rest of WiraUI.
- Use `focusCancel: true` for destructive confirms.
- To close with a spinner during work: `showLoading()` then `close()`.
- `WuAlert` (static) needs `provideWiraUI()`; outside Angular DI without it nothing opens.
