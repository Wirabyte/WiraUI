# KeyFilter

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`[wuKeyFilter]` · `WuKeyFilterModule` / `WuKeyFilter` from `@wirabyte/ui/keyfilter` · forms: works with ngModel / form controls
Also accepted: `pKeyFilter`, `pValidateOnly`. Put on `<input>` or `<textarea>`.

Keeps unwanted characters out of a field, whether typed, pasted or dropped (pasted/dropped text with any bad character is refused as a whole). Or, with `wuValidateOnly`, only reports a form error.

```html
<input name="studentId" wuInputText wuKeyFilter="pint" [(ngModel)]="studentId" />
<input name="nameTh" wuInputText wuKeyFilter="thai" [(ngModel)]="nameTh" />
<input name="subject" wuInputText [wuKeyFilter]="subjectChars" [(ngModel)]="subject" />

<input name="phone" wuInputText #phoneModel="ngModel" [wuKeyFilter]="phonePattern" [wuValidateOnly]="true" [(ngModel)]="phone" />
@if (phoneModel.hasError('keyfilter')) { <small class="p-error">รูปแบบเบอร์โทรไม่ถูกต้อง</small> }
```
```ts
subjectChars = /[A-Z0-9-]/;   // tested per character
phonePattern = /^0\d{9}$/;    // with wuValidateOnly: tested on the whole value
```
(Classic: `<small *ngIf="phoneModel.hasError('keyfilter')" class="p-error">`.)

**Inputs**
- `wuKeyFilter` · `pKeyFilter`: `'pint' | 'int' | 'pnum' | 'money' | 'num' | 'hex' | 'email' | 'alpha' | 'alphanum' | 'thai' | RegExp | string` — named filter, or RegExp tested per character (a string like `wuKeyFilter="[A-Z0-9-]"` works too)
- `wuValidateOnly` · `pValidateOnly`: `boolean` = `false` — block nothing; form gets error `keyfilter` (RegExp tests the whole value)

**Named filters** — `pint` positive digits · `int` digits and minus · `pnum` digits and decimal point · `money` digits, points, commas, spaces · `num` digits, points, minus · `hex` 0–9 a–f · `email` · `alpha` English letters · `alphanum` English letters and digits · `thai` Thai letters and spaces (new in WiraUI).
**Form errors** — `keyfilter: true` when the value fails (with `wuValidateOnly`).
**Types** — `import { WU_KEYFILTER_PRESETS, WuKeyFilterPreset } from '@wirabyte/ui/keyfilter'; type WuKeyFilterPreset = 'pint' | ... | 'thai'; const WU_KEYFILTER_PRESETS: Record<WuKeyFilterPreset, RegExp>;`
**Tokens** — none (field keeps InputText tokens).

**Gotchas**
- Angular templates cannot hold a RegExp literal: keep it in the component and bind `[wuKeyFilter]`.
- Not a replacement for validation: it filters keystrokes; pair with validators for completeness (e.g. length).
- A `keyfilter` message is not in the documented built-in list; pass `[messages]` or show your own text.
