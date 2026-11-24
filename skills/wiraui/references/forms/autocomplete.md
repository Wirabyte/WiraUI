# AutoComplete

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-autocomplete` · `WuAutoCompleteModule` / `WuAutoComplete` from `@wirabyte/ui/autocomplete` · forms: ngModel / formControlName
Also accepted: `wu-autoComplete`, `wu-auto-complete` (source); `p-autoComplete` templates port: `suggestions`, `completeMethod`, `field` / `optionLabel`, `delay`, `minLength`, `dropdown`, `forceSelection`, `pTemplate="item"` keep their names.

Typing field that suggests options. The page finds the matches itself in `(completeMethod)` (local filter or API) and sets `[suggestions]`. Choose it over Select when the option set is large or server-side.

```html
<label for="province">จังหวัด</label>
<wu-autocomplete name="province" [(ngModel)]="province" [suggestions]="suggestions" (completeMethod)="search($event)"
  optionLabel="name_th" inputId="province" placeholder="พิมพ์ชื่อจังหวัด"></wu-autocomplete>
```
```ts
import { WuAutoCompleteCompleteEvent } from '@wirabyte/ui/autocomplete';

suggestions: Province[] = [];
province: Province | string | null = null;   // picked option (whole object) or the text being typed

search(event: WuAutoCompleteCompleteEvent): void {
  const query = event.query.toLowerCase();
  // a real app calls its API here and sets suggestions when it returns
  this.suggestions = this.provinces.filter((p) => p.name_th.toLowerCase().includes(query));
}
```

More:
```html
<!-- debounce + min length (spinner shows while waiting for suggestions) -->
<wu-autocomplete name="province" [(ngModel)]="province" [suggestions]="slowSuggestions" (completeMethod)="searchSlow($event)"
  optionLabel="name_th" [delay]="500" [minLength]="2" placeholder="พิมพ์อย่างน้อย 2 ตัวอักษร"></wu-autocomplete>
<!-- dropdown button, force a pick -->
<wu-autocomplete ... [dropdown]="true" dropdownMode="current"></wu-autocomplete>
<wu-autocomplete ... [forceSelection]="true"></wu-autocomplete>
<!-- groups: suggestions are { label, items }[]; your search returns only groups with matches -->
<wu-autocomplete ... [suggestions]="regionSuggestions" [group]="true" optionLabel="name_th"></wu-autocomplete>
```

**Inputs**
- `suggestions`: `unknown[]` = `[]` — results of the last query; set again every time `completeMethod` runs
- `optionLabel` · `field`: `string` — field (or dot path) shown; `field` is the older name
- `optionDisabled`: `string` · `group`: `boolean` = `false` · `optionGroupLabel` = `'label'` · `optionGroupChildren` = `'items'` · `dataKey`: `string` (compare the picked option by this field)
- `delay`: `number` = `0` — ms after last key before `completeMethod` (0 = every key at once; app-wide default via `provideWiraUI({ delays: { autoComplete: 300 } })`)
- `minLength`: `number` = `1`
- `dropdown`: `boolean` = `false` · `dropdownMode`: `'blank' | 'current'` = `'blank'` (button asks with empty query, or the current text)
- `forceSelection`: `boolean` = `false` — on blur clear text that was not picked (text equal to a label, ignoring case, picks it)
- `autoHighlight`: `boolean` = `false` — highlight first option when list opens
- `showEmptyMessage`: `boolean` = `true` · `emptyMessage`: `string` = locale
- `scrollHeight`: `string` = `'14rem'`
- `placeholder`: `string` · `showClear`: `boolean` = `false` · `size`: `'small' | 'large'` · `variant`: `'outlined' | 'filled'` · `fluid`: `boolean` = `false` · `disabled` · `readonly` · `required` · `invalid`: `boolean` = `false`
- `inputId` · `name` · `maxlength` · `tabindex`: `string | number` · `ariaLabel` · `ariaLabelledBy`: `string`
- `styleClass` · `inputStyleClass` · `panelStyleClass`: `string` · `style` · `inputStyle` · `panelStyle`: `object`
- Accepted, no effect: `appendTo`, `autoZIndex`, `baseZIndex`, `virtualScroll`, `virtualScrollItemSize`, `multiple`, `completeOnFocus`, `showTransitionOptions`, `hideTransitionOptions`

**Outputs** — `(completeMethod)`: `WuAutoCompleteCompleteEvent` time to find results · `(onSelect)` / `(onUnselect)`: `WuAutoCompleteSelectEvent` picked / a picked value was replaced · `(onDropdownClick)`: `WuAutoCompleteCompleteEvent` · `(onClear)`: `Event | undefined` · `(onFocus)` / `(onBlur)`: `FocusEvent` · `(onKeyUp)`: `KeyboardEvent` · `(onShow)` / `(onHide)`: `void`

**Slots** (`#item` / `wuTemplate` / `pTemplate`) — `item`: `$implicit` (option), `index` · `group`: `$implicit` (group) · `header` · `footer` · `empty`: no context

**Methods** (via `#ac`) — `show()` · `hide()`

**Types**
```ts
import { WuAutoCompleteCompleteEvent, WuAutoCompleteSelectEvent } from '@wirabyte/ui/autocomplete';
interface WuAutoCompleteCompleteEvent { originalEvent: Event; query: string }
interface WuAutoCompleteSelectEvent { originalEvent: Event; value: unknown }
```

**Tokens** — `--wu-select-width`, `--wu-field-bg`, `--wu-field-border`, `--wu-input-radius`, `--wu-select-dropdown-width`, `--wu-select-dropdown-color`, `--wu-overlay-bg`, `--wu-select-overlay-radius`, `--wu-select-overlay-shadow`, `--wu-select-overlay-border-width`, `--wu-select-list-padding`, `--wu-select-option-padding-x`, `--wu-select-option-padding-y`, `--wu-select-option-radius`, `--wu-select-option-hover-bg`, `--wu-select-option-selected-bg`, `--wu-select-option-selected-color`, `--wu-select-group-color`, `--wu-select-group-weight`

**Gotchas**
- NOT BUILT YET: `optionValue` (model is always the whole option object) and `multiple` (accepted, no effect). For several values use MultiSelect.
- Model is the picked object, OR the raw text string while typing without picking. Type it `Option | string | null` and, if a pick is mandatory, set `forceSelection`.
- It never filters by itself: you must set `[suggestions]` in `completeMethod`. Without it the list stays empty.
- `delay` defaults to 0 (ask on every key). Set `delay` / app-wide `delays.autoComplete` when calling an API.
- Empty result shows the locale "no results" text; `[showEmptyMessage]="false"` keeps the list closed instead.

---
