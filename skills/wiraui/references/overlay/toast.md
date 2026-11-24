# Toast

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: top-layer rules (no appendTo / z-index) and slot syntax.

`wu-toast` · `WuToastModule` / `WuToast, WuTemplate` from `@wirabyte/ui/toast`

Short notices that float in at a screen corner and disappear by themselves. Place `<wu-toast>` once, then call `WuMessageService.add()` from anywhere. In the top layer, so toasts show above dialogs. Hover pauses the countdown; on phones they span the screen. Service import: see Services above (`MessageService` from `@wirabyte/ui/api`).

```html
<wu-toast></wu-toast>   <!-- once, e.g. in app.component.html -->
<wu-button label="บันทึก" (onClick)="save()"></wu-button>
```
```ts
private readonly messages = inject(WuMessageService);   // or MessageService from '@wirabyte/ui/api'
save(): void {
  this.messages.add({ severity: 'success', summary: 'บันทึกแล้ว', detail: 'ข้อมูลลูกค้าถูกบันทึกเรียบร้อย' });
}
```

```html
<!-- positions + keys -->
<wu-toast key="bl" position="bottom-left"></wu-toast>
<!-- messages.add({ key: 'bl', severity: 'info', summary: 'ล่างซ้าย' }) -->

<!-- custom template: <wu-toast key="invite"><ng-template #message let-m>{{ m.summary }} {{ m.data.initial }}</ng-template></wu-toast> -->
```

**Message (argument of `add`)**
- `severity`: `'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'` (also `warning`, `danger`) - colour and icon
- `summary` · `detail`: `string`
- `key`: `string` - goes to the `<wu-toast>` with that key
- `life`: `number` = `3000` ms; `sticky`: `boolean` = `false`; `closable`: `boolean` = `true`
- `icon` · `closeIcon`: `string`; `styleClass` · `contentStyleClass` · `id` · `data`

**`<wu-toast>` inputs**
- `key`: `string` - only messages with this key
- `position`: `'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center'` = `'top-right'`
- `life`: `number` = `3000` - default time on screen
- `showTimer`: `boolean` = `true` - countdown line along the bottom
- `preventDuplicates` · `preventOpenDuplicates`: `boolean` = `false` - skip messages shown before / still shown
- `style` · `styleClass`
- Accepted, no effect: `baseZIndex`, `autoZIndex`, `breakpoints`, `*TransitionOptions`

**Outputs** - `(onClose)`: `WuToastCloseEvent` - the user closed a message

**Slots** - `#message` (`let-m` = the message), `#headless` (draw the whole box; close with `closeFn`). The × stays top-right even with custom templates (`closable: false` hides it).

**Methods / services** - `WuMessageService`: `add(message)`, `addAll(messages)`, `clear(key?)` (that key's, or all).

**Tokens** - `--wu-toast-width`, `--wu-toast-radius`, `--wu-toast-border-width` (`0 0 0 6px` = left stripe), `--wu-toast-border-mix`, `--wu-toast-icon-size`, `--wu-toast-summary-weight`, `--wu-toast-padding`, `--wu-toast-shadow`, `--wu-toast-blur`

**Gotchas**
- A `wu-messages` (inline) also listens to `MessageService` by default; see Message.
