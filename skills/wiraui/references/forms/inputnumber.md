# InputNumber

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-inputnumber` · `WuInputNumberModule` / `WuInputNumber` from `@wirabyte/ui/inputnumber` · forms: ngModel / formControlName
Also accepted: tags `wu-inputNumber`, `wu-input-number`.

A number field whose model is a real `number` (or `null`). Shows the formatted value (฿1,234.50, 60 กก.), reads typed/pasted text ignoring ฿ and commas (Thai digits too), reformats on blur. Phones open the number keypad.

```html
<wu-inputnumber name="quantity" [(ngModel)]="quantity" placeholder="จำนวน" ariaLabel="จำนวน"></wu-inputnumber>
<wu-inputnumber name="price" [(ngModel)]="price" mode="currency" [min]="0"></wu-inputnumber>
<wu-inputnumber name="weight" [(ngModel)]="weight" [min]="0" [max]="200" [maxFractionDigits]="1" suffix=" กก."></wu-inputnumber>
<wu-inputnumber name="seats" [(ngModel)]="seats" [showButtons]="true" buttonLayout="horizontal" [min]="1" [max]="10"></wu-inputnumber>
```
```ts
quantity: number | null = 1200;
```

**Inputs**
- `mode`: `'decimal' | 'currency'` = `'decimal'`; `currency`: `string` = `'THB'` (ISO 4217, with mode="currency"); `locale`: `string` = `'th-TH'` / `'en-US'` (follows app language)
- `minFractionDigits`: `number` = `0` (currency: 2); `maxFractionDigits`: `number` = `3` (currency: 2), rounded on blur; `useGrouping`: `boolean` = `true`
- `min` · `max`: `number` — range, applied on blur and by the buttons; values past `max` are refused while typing; with `[min]="0"` a minus cannot be typed
- `step`: `number` = `1`; `showButtons`: `boolean` = `false`; `buttonLayout`: `'stacked' | 'horizontal'` = `'stacked'` (stacked right, or minus left / plus right). Hold a button to repeat; ↑ ↓ keys step.
- `prefix` · `suffix`: `string`; `placeholder`: `string`; `inputId` · `name`: `string` (inner input); `ariaLabel`: `string`; `autocomplete`: `string`
- `size`: `'small' | 'large'` (`sm`/`lg` work too; default follows app UI size)
- `disabled` · `readonly` · `invalid` · `fluid`: `boolean` = `false`
- `showClear`: `boolean` = `false` — × once there is a value (emits `onClear`)
- `inputStyleClass`: `string` · `inputStyle`: `object` — class/style of the inner input
- `incrementButtonClass` · `decrementButtonClass`: `string` (e.g. `p-button-success`); `incrementButtonIcon` · `decrementButtonIcon`: `string`
- `styleClass` · `style`: `string` · `object` — outer element

**Outputs** — `(onInput)`: `WuInputNumberInputEvent` typed (with parsed value) · `(onFocus)` / `(onBlur)`: `FocusEvent` · `(onClear)`: void · `(onKeyDown)`: `KeyboardEvent` any key in the field

**Methods / services** (from `@wirabyte/ui/core`, default locale th-TH):
```ts
import { clampNumber, formatNumber, parseNumber, stepNumber } from '@wirabyte/ui/core';
formatNumber(1234.5, { mode: 'currency' });   // '฿1,234.50'
formatNumber(60, { suffix: ' กก.' });          // '60 กก.'
formatNumber(0.5, { locale: 'en-US', minFractionDigits: 2 }); // '0.50'
parseNumber('๑,๒๓๔.๕๐');                       // 1234.5
parseNumber('฿1,234.50');                      // 1234.5
stepNumber(0.2, 0.1, 1);                       // 0.3
clampNumber(120, { max: 100 });                // 100
```
**Types** — `type WuInputNumberMode = 'decimal' | 'currency'; type WuInputNumberButtonLayout = 'stacked' | 'horizontal'; interface WuInputNumberInputEvent { value: number | null; originalEvent: Event; }`
**Tokens** — --wu-inputnumber-button-width, --wu-inputnumber-button-bg, --wu-inputnumber-button-hover-bg, --wu-inputnumber-button-color, --wu-inputnumber-button-hover-color, --wu-inputnumber-button-border, --wu-input-radius, --wu-danger-color

**Gotchas**
- Size is `size` here (a component, not a directive on `<input>`).
- Pasted/autofilled text is parsed leniently; typed letters are blocked, decimals stop at `maxFractionDigits`.
- Bind the model as `number | null`; do not bind strings.
- Name the field for a11y with `ariaLabel` (the host is not the input).
