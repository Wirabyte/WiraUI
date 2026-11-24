# InputMask

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-inputmask` · `WuInputMaskModule` / `WuInputMask` from `@wirabyte/ui/inputmask` · forms: ngModel / formControlName
Also accepted: `wu-inputMask` (migration from `p-inputMask` is a prefix change).

A field that follows a pattern (Thai ID, phone, car plate). Types the separators for you, accepts Thai digits (stored as 0–9), digit-only masks set `inputmode="numeric"`. Paste works with or without the literals. `Backspace`/`Delete` step over literals.

```html
<label for="idCard">เลขบัตรประชาชน</label>
<wu-inputmask inputId="idCard" name="idCard" [(ngModel)]="idCard" mask="9-9999-99999-99-9"
  placeholder="เลขบัตรประชาชน 13 หลัก"></wu-inputmask>

<wu-inputmask name="phone" [(ngModel)]="phone" mask="999-999-9999" ariaLabel="เบอร์มือถือ"></wu-inputmask>
<wu-inputmask name="office" [(ngModel)]="office" mask="(999) 999-9999? x99999" ariaLabel="เบอร์ที่ทำงาน (มีเบอร์ต่อได้)"></wu-inputmask>
<wu-inputmask name="plate" [(ngModel)]="plate" mask="9aa 9999" characterPattern="[ก-ฮ]" ariaLabel="ทะเบียนรถ"></wu-inputmask>
<wu-inputmask name="idRaw" [(ngModel)]="idRaw" mask="9-9999-99999-99-9" [unmask]="true" ariaLabel="เฉพาะตัวที่พิมพ์"></wu-inputmask>
<wu-inputmask name="memberId" [(ngModel)]="memberId" mask="9-9999-99999-99-9" [showClear]="true"
  (onComplete)="lookUp()" (onClear)="clearLookup()"></wu-inputmask>
```

**Mask characters** — `9` digit (0–9; Thai digits stored as 0–9) · `a` letter `[A-Za-z]` (change with `characterPattern`) · `*` letter or digit · `?` the slots after it are optional · anything else (`- / ( ) . x …`) is a literal the field types for you.

**Inputs**
- `mask`: `string`; `characterPattern`: `string` = `'[A-Za-z]'` (what `a` accepts, a regex class); `slotChar`: `string` = `'_'` (shown in empty slots while focused; several characters map by position, e.g. `dd/mm/yyyy`)
- `autoClear`: `boolean` = `true` — clear an incomplete value on blur (so it fails `required`); `[autoClear]="false"` keeps it
- `unmask`: `boolean` = `false` — model gets only typed characters (`1103700012345`), not the formatted text (`1-1037-00012-34-5`); API values without literals still display formatted
- `placeholder`: `string` — shown while empty and not focused; `showClear`: `boolean` = `false`
- `size` · `variant` · `fluid`: `'small'|'large'` · `'outlined'|'filled'` · `boolean` (`styleClass="w-full"` also gives full width)
- `invalid` · `disabled` · `readonly` · `required`: `boolean` = `false`
- `inputId` · `name` · `type` · `maxlength` · `tabindex` · `title` · `autocomplete`: `string` — passed to inner `<input>`
- `ariaLabel` · `ariaLabelledBy`: `string`; `ariaRequired`: `boolean`
- `styleClass` · `style`: `string` · `object` — class/style of the `<input>`
- `keepBuffer` · `autoFocus`: accepted, no effect

**Outputs** — `(onComplete)`: Event required part filled · `(onInput)`: Event typed/pasted · `(onFocus)` / `(onBlur)`: `FocusEvent` · `(onKeydown)`: `KeyboardEvent` (lowercase d) · `(onClear)`: void × pressed (needs `showClear`)
**Tokens** — --wu-field-bg, --wu-field-color, --wu-field-border, --wu-field-hover-border, --wu-field-focus-border, --wu-field-focus-shadow, --wu-field-padding-x, --wu-field-padding-y, --wu-input-radius, --wu-field-placeholder (also the × button), --wu-field-filled-bg, --wu-field-disabled-bg, --wu-danger-color · `overrides: components.input`

**Gotchas**
- By default the model is the formatted text, with `_` in empty slots while incomplete. Use `unmask` for API values.
- Incomplete value is cleared on blur by default; pair `Validators.required` with it knowingly.
- Event name is `(onKeydown)` here but `(onKeyDown)` on InputNumber.
- `characterPattern` default is English letters only; set it for Thai letters.
