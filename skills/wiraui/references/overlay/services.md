# Services (message, confirmation, alert, dialog)

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: top-layer rules (no appendTo / z-index) and slot syntax.

All four services are `providedIn: 'root'`; nothing to add to `providers`. Import from `@wirabyte/ui/api` (one import, with the service names apps already use as aliases) or from the component entry:

| Service | `@wirabyte/ui/api` names | Component entry | Host component (place once in a root template) |
|---|---|---|---|
| Toast messages | `WuMessageService` = `MessageService`; type `Message` (= `WuToastMessage`) | `@wirabyte/ui/toast` | `<wu-toast>` (`WuToastModule`) |
| Confirm questions | `WuConfirmationService` = `ConfirmationService`; `WuConfirmEventType` = `ConfirmEventType`; type `Confirmation` | `@wirabyte/ui/confirmdialog` | `<wu-confirmdialog>` (`WuConfirmDialogModule`) |
| Alerts | `WuAlertService`, `WuAlert` (static); types `WuAlertOptions`, `WuAlertResult` | `@wirabyte/ui/alert` | none, needs `provideWiraUI()` |
| Dialogs from code | not in `/api` | `@wirabyte/ui/dialog` (`DialogService`, `DynamicDialogRef`, `DynamicDialogConfig` aliases) | none |

Full call example (host in `app.component.html`, calls from any component):

```html
<!-- app.component.html -->
<wu-toast></wu-toast>
<wu-confirmdialog></wu-confirmdialog>
<router-outlet></router-outlet>
```
```ts
// app.module.ts: imports: [WuToastModule, WuConfirmDialogModule]   (standalone: add WuToast, WuConfirmDialog to the root component's imports)
import { inject } from '@angular/core';
import { MessageService, ConfirmationService, WuAlert } from '@wirabyte/ui/api';

export class CustomersComponent {
  private readonly messages = inject(MessageService);
  private readonly confirmation = inject(ConfirmationService);

  remove(): void {
    this.confirmation.confirm({ header: 'ยืนยันการลบ', message: 'ลบลูกค้ารายนี้?', accept: () => this.messages.add({ severity: 'success', summary: 'ลบแล้ว' }) });
  }
  oops() { WuAlert.fire('บันทึกไม่สำเร็จ', 'กรุณาลองใหม่อีกครั้ง', 'error'); }
}
```

Choosing: transient notice → Toast; yes/no with callbacks → ConfirmDialog; SweetAlert2-style awaited result/inputs/timer → AlertDialog; your own component from code → WuDialogService; markup-driven modal → Dialog.
