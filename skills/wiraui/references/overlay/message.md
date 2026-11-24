# Message

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: top-layer rules (no appendTo / z-index) and slot syntax.

`wu-message` · `WuMessageModule` (also exported `WuMessagesModule`) / `WuMessage` (one) and `WuMessages` (several) from `@wirabyte/ui/message`

An inline in-page message with severity colours; optionally closable or self-dismissing. `wu-messages` renders an array.

```html
<wu-message text="ระบบจะปิดปรับปรุงคืนนี้ 22:00 น."></wu-message>
<wu-message severity="success" text="บันทึกเรียบร้อย" [closable]="true" [life]="4000" (onClose)="closed = closed + 1"></wu-message>
<wu-message severity="info" variant="outlined" size="small" text="Outlined"></wu-message>
<wu-message severity="warn"><b>อีเมลยังไม่ยืนยัน</b></wu-message>
<wu-message severity="warn" [escape]="false" text="ส่งเอกสารภายใน <b>วันศุกร์นี้</b>"></wu-message>
```

**Inputs (`wu-message`)**
- `severity`: `WuSeverityInput` = `'info'` - primary, secondary, success, info, warn, danger, help, contrast (+ `warning`, `error`)
- `text`: `string` - omit it and put your own content inside the tag
- `icon`: `string` - defaults to one per severity
- `closable`: `boolean` = `false`; `life`: `number` = `0` ms (0 = never closes)
- `size`: `'small' | 'large'`; `variant`: `'outlined' | 'simple'` (bordered / plain with no background)
- `escape`: `boolean` = `true` - `false` renders `text` as sanitized HTML
- `styleClass` · `style`

**Outputs** - `(onClose)`: `Event | null` - closed (null when `life` ran out)

## wu-messages (array)

```html
<wu-messages [(value)]="notices" [enableService]="false"></wu-messages>
<wu-messages key="form"></wu-messages>   <!-- fed by MessageService.add({ key: 'form', ... }) -->
```
```ts
import { Message } from '@wirabyte/ui/api';
notices: Message[] = [{ severity: 'success', summary: 'บันทึกแล้ว', detail: 'ข้อมูลนักเรียนถูกบันทึกเรียบร้อย' }];
```
- `value`: `Message[]` = `[]` - `[(value)]`; closing removes the item from the array
- `closable`: `boolean` = `true` (not on messages with `closable: false`)
- `enableService`: `boolean` = `true` - also shows `MessageService.add()` messages with the same `key`
- `key`: `string`; `escape`: `boolean` = `true` (summary/detail as HTML); `severity`: `WuSeverityInput` = `'info'` (for messages that set none); `styleClass` · `style`
- Outputs: `(valueChange)`: `Message[]` · `(onClose)`: `Message`. Method: `clear()` removes all.
- Accepted, no effect: `showTransitionOptions`, `hideTransitionOptions`
- Each item: `{ severity, summary, detail, closable?, icon?, life? }`

```ts
type WuMessageSize = 'small' | 'large';
type WuMessageVariant = 'outlined' | 'simple';
type WuSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast';
type WuSeverityInput = WuSeverity | 'warning' | 'error' | null | undefined;
```

**Tokens** - `--wu-message-padding-x`, `--wu-message-padding-y`, `--wu-message-radius`, `--wu-message-gap`, `--wu-message-border-width`, `--wu-message-font-weight`, `--wu-info-bg` (success / warn / danger / help alike), `--wu-info-text`, `--wu-info-color`

**Gotchas**
- `enableService` defaults to `true`: an array-driven `wu-messages` without `[enableService]="false"` also shows toast messages sent without a `key`. Set it `false` for array use; give both sides a `key` for service use.
