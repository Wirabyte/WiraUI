# SelectButton

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-selectbutton` · `WuSelectButtonModule` / `WuSelectButton` from `@wirabyte/ui/selectbutton` · forms: ngModel / formControlName
Also accepted: `wu-selectButton`, `wu-select-button` (source).

Pick from joined buttons, one or several, wrapping on narrow screens. `variant="chips"` (separate pills, good for status filters with counts) and `variant="cards"` (grid of option cards) are available.

```html
<wu-selectbutton [options]="plans" optionLabel="label" optionValue="value" name="plan" [(ngModel)]="plan"></wu-selectbutton>

<wu-selectbutton [options]="days" name="workdays" [(ngModel)]="workdays" [multiple]="true"></wu-selectbutton>

<wu-selectbutton [options]="['วัน', 'สัปดาห์', 'เดือน']" name="range" [(ngModel)]="range" [allowEmpty]="false"></wu-selectbutton>

<!-- chips with counts -->
<wu-selectbutton name="statuses" [(ngModel)]="statuses" [options]="statusFilters" optionLabel="label" optionValue="value"
  variant="chips" [multiple]="true">
  <ng-template #item let-option>{{ option.label }} <wu-badge [value]="option.count"></wu-badge></ng-template>
</wu-selectbutton>

<!-- cards -->
<span id="channel-label">ช่องทางติดต่อกลับ</span>
<wu-selectbutton name="channel" [(ngModel)]="channel" [options]="channels" optionLabel="label" optionValue="value"
  variant="cards" [allowEmpty]="false" ariaLabelledBy="channel-label"></wu-selectbutton>
```
```ts
plans = [{ label: 'Free', value: 'free' }, { label: 'Pro', value: 'pro' }, { label: 'Enterprise', value: 'ent', disabled: true }];
plan = 'pro';
days = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];  workdays = ['จ', 'อ', 'พ', 'พฤ', 'ศ'];
channels = [{ label: 'อีเมล', value: 'email', icon: 'wi wi-envelope', description: 'ตอบกลับภายใน 1 วันทำการ' }];
```

**Inputs**
- `options`: `unknown[]` = `[]` — strings or objects
- `optionLabel` · `optionValue` · `optionDisabled`: `string` (no `optionValue` = whole option) · `dataKey`: `string`
- `multiple`: `boolean` = `false` (value is an array)
- `allowEmpty`: `boolean` = `true` — clicking the selected option clears it · `unselectable`: `boolean` — older name, the OPPOSITE of `allowEmpty` (`true` = second click keeps it)
- `disabled` · `invalid`: `boolean` = `false`
- `variant`: `'default' | 'chips' | 'cards'` = `'default'`
- `optionIcon`: `string` = `'icon'` · `optionDescription`: `string` = `'description'` — `variant="cards"` only: field with the icon class / the line under the title (title comes from `optionLabel`)
- `ariaLabelledBy`: `string` (id of the group label) · `size`: `'small' | 'large' | 'sm' | 'lg'` · `styleClass`: `string` · `style`: `object`

**Outputs** — `(onChange)`: `WuSelectButtonChangeEvent` value changed · `(onOptionClick)`: `WuSelectButtonOptionClickEvent` an option was clicked

**Slots** — `item`: `$implicit` (option), `index` (`let-option let-i="index"`) — each option

**Types**
```ts
interface WuSelectButtonChangeEvent { value: unknown; originalEvent: Event }
interface WuSelectButtonOptionClickEvent { option: unknown; index: number; originalEvent: Event }
```

**Tokens** — shares ToggleButton tokens: `--wu-togglebutton-bg`, `--wu-togglebutton-border`, `--wu-togglebutton-color`, `--wu-togglebutton-checked-bg`, `--wu-togglebutton-checked-color`, `--wu-togglebutton-content-padding-x`

**Gotchas**
- Clicking the chosen option clears it by default; set `[allowEmpty]="false"` when a value is required (and always for `cards`, which behaves as a radio group).
- `variant="cards"` is single-pick, one card at a time (min 15rem wide, one column on phones).
- `variant="chips"` works with `multiple`.
- Unlike Select there is no `filter`, `group`, `placeholder` or `showClear`.
- Slot syntax: v3 `#item`, v1/v2 `wuTemplate="item"` (`pTemplate` works too).
