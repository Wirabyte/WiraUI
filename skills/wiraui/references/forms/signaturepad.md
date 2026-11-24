# SignaturePad

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-signature-pad` · `WuSignaturePadModule` / `WuSignaturePad` from `@wirabyte/ui/signaturepad` (entry is `signaturepad`, no hyphen) · forms: ngModel / formControlName
Also accepted: `wu-signaturePad`, `wu-signature`.

Box to sign in (consent, delivery, approval forms) with mouse, pen (harder press = thicker line) or finger. Model is a PNG data URL, `null` while empty.

```html
<wu-signature-pad name="signature" [(ngModel)]="signature"></wu-signature-pad>
@if (signature) { <img [src]="signature" alt="ลายเซ็น" class="signature-preview" /> }   <!-- v1/v2: *ngIf -->
<!-- disabled pad drawing a stored value back -->
<wu-signature-pad name="copy" [ngModel]="signature" [disabled]="true" [height]="120"></wu-signature-pad>
```
```ts
signature: string | null = null;   // data:image/png;base64,… or null while empty
```

Required in a form:
```html
<form #consentForm="ngForm" (ngSubmit)="submit(consentForm.valid)">
  <wu-signature-pad name="signature" [(ngModel)]="consent.signature" required #sig="ngModel"
    [invalid]="submitted && !!sig.invalid" ariaLabel="ลายมือชื่อผู้ยินยอม"></wu-signature-pad>
  @if (submitted && sig.invalid) { <small class="field-error">กรุณาเซ็นชื่อก่อนส่ง</small> }
  <wu-button type="submit" label="ส่งแบบฟอร์ม" icon="wi wi-send"></wu-button>
</form>
```

Own buttons and export:
```html
<wu-signature-pad #pad name="approver" [(ngModel)]="approver" [showButtons]="false" (onBegin)="began = began + 1" (onEnd)="ended = ended + 1" (onClear)="cleared = cleared + 1"></wu-signature-pad>
<wu-button label="ย้อนกลับ" (onClick)="pad.undo()"></wu-button>
<wu-button label="ล้าง" (onClick)="pad.clear()"></wu-button>
<wu-button label="JPEG" (onClick)="jpeg = pad.toDataURL('image/jpeg', 0.9)"></wu-button>
```
```ts
import { WuSignaturePad } from '@wirabyte/ui/signaturepad';   // type for the template ref in code
```

**Inputs**
- `height`: `number | string` = theme (`12rem`) — number = px, or any CSS length
- `penColor`: `string` = theme (`--wu-signature-ink`, the text colour)
- `penWidth`: `number` = `2.5` (px at normal pressure)
- `exportBackground`: `string` — e.g. `'#ffffff'` painted into the file (none = transparent)
- `placeholder`: `string` = locale — hint in the empty box
- `showGuide`: `boolean` = `true` — line to sign on
- `showButtons`: `boolean` = `true` — undo and clear in the corner (shown once something is drawn)
- `disabled`: `boolean` = `false` (also from the form control; stops drawing, hides buttons)
- `invalid`: `boolean` = `false` — red border
- `ariaLabel`: `string` = locale
- `styleClass` · `style`: outer element

**Outputs**
- `(onBegin)`: `PointerEvent` — stroke began
- `(onEnd)`: `string | null` — pen lifted, with the new value
- `(onClear)`: `void` — box cleared

**Methods** (template ref) — `clear()` removes the drawing; `undo()` removes the last stroke; `toDataURL(type = 'image/png', quality?)`: `string | null` (null while empty).

**Tokens** — `--wu-signature-height`, `--wu-signature-ink`, `--wu-signature-line`, `--wu-field-bg`, `--wu-field-border`, `--wu-field-hover-border`, `--wu-input-radius`, `--wu-field-placeholder`, `--wu-danger-color`

**Gotchas**
- Model updates on pen lift, not per stroke point. A data URL written into the model is drawn back.
- `required` works because an empty pad is `null`. Inside a form it also turns red by itself once an invalid pad was touched or the form submitted; `[invalid]` forces it.
- JPEG export always gets a white background; PNG is transparent unless `exportBackground` is set.
- The page does not scroll while signing; the drawing survives the box resizing.
- Selector is `wu-signature-pad` (hyphen) but the entry path is `@wirabyte/ui/signaturepad`.
