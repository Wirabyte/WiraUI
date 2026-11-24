# Textarea

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`textarea[wuTextarea]` · `WuTextareaModule` / `WuTextarea` from `@wirabyte/ui/textarea` · forms: ngModel / formControlName
Also accepted: `wuInputTextarea`, `pInputTextarea`, `pTextarea` (and `wuInputText` / `pInputText`) on a `<textarea>`.

Styles a `<textarea>` like `wuInputText`, with `autoResize` that grows with the text, including values set from code (`patchValue`, ngModel).

```html
<textarea wuTextarea name="note" [(ngModel)]="note" rows="3" placeholder="ข้อความถึงทีมงาน"></textarea>
<textarea wuTextarea [autoResize]="true" rows="1" name="address" [(ngModel)]="address"
  placeholder="ที่อยู่สำหรับจัดส่ง (ขยายตามข้อความ)"></textarea>
```

**Inputs** — native `rows`, `maxlength`, `disabled` work as usual.
- `autoResize`: `boolean` = `false` — grows with the text (hides the scrollbar and resize handle)
- `wuSize`: `'small' | 'large'`; `variant`: `'outlined' | 'filled'` = `'outlined'`; `fluid`: `boolean` = `false`; `invalid`: `boolean` = `false`

**Tokens** — same as InputText (without --wu-control-line-height) · `overrides: components.input`

**Gotchas**
- Use `rows="1"` or `rows="2"` as the starting height with `autoResize`.
