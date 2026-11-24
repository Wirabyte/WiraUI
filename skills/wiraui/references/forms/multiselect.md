# MultiSelect

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-multiselect` · `WuMultiSelectModule` / `WuMultiSelect` from `@wirabyte/ui/multiselect` · forms: ngModel / formControlName
Also accepted: `wu-multiSelect`, `wu-multi-select` (source), `p-multiSelect` templates port with most inputs unchanged.

Pick several options; the value is always an array. Search (`filter`) and check-all (`showToggleAll`) are ON by default. Shares field and list with Select.

```html
<label for="provinces">จังหวัด</label>
<wu-multiselect inputId="provinces" name="provinceIds" [(ngModel)]="provinceIds" [options]="provinces"
  optionLabel="name_th" optionValue="id" placeholder="เลือกจังหวัด"></wu-multiselect>
```
```ts
provinceIds: number[] = [];   // always an array
```

Chips, limit, custom selected display:
```html
<wu-multiselect name="provinceIds" [(ngModel)]="provinceIds" [options]="provinces" optionLabel="name_th" optionValue="id"
  display="chip" [maxSelectedLabels]="5" placeholder="เลือกจังหวัด"></wu-multiselect>

<wu-multiselect ... [selectionLimit]="2" (onSelectAllChange)="allChanged($event)"></wu-multiselect>

<wu-multiselect name="picked" [(ngModel)]="picked" [options]="provinces" optionLabel="name_th" dataKey="id">
  <ng-template #selectedItems let-values let-removeChip="removeChip">
    @for (p of values; track p.id) {
      <span>{{ p.code }} <button type="button" aria-label="นำออก" (click)="removeChip(p, $event)">×</button></span>
    }
  </ng-template>
</wu-multiselect>
```
(Classic: `wuTemplate="..."`, `*ngFor` / `*ngIf` instead of `@for` / `@empty`.)

**Inputs**
- Options: `options`: `unknown[]` = `[]` · `optionLabel` · `optionValue` · `optionDisabled`: `string` · `group`: `boolean` = `false` · `optionGroupLabel` = `'label'` · `optionGroupChildren` = `'items'` · `dataKey`: `string`
- `placeholder` · `defaultLabel`: `string` — text before a pick (`defaultLabel` is the older name)
- `display`: `'comma' | 'chip'` = `'comma'`
- `maxSelectedLabels`: `number` = `3` — past this count show `selectedItemsLabel` (chip mode also falls back to count text)
- `selectedItemsLabel`: `string` = locale — count text, `{0}` = count (e.g. `"เลือกแล้ว {0} จังหวัด"`)
- `selectionLimit`: `number` — max picks; other rows blocked, check-all hides
- `showClear` · `loading`: `boolean` = `false`
- `disabled` · `readonly` · `invalid`: `boolean` = `false` · `size`: `'small' | 'large' | 'sm' | 'lg'` · `fluid`: `boolean` = `false` · `variant`: `'outlined' | 'filled'` = `'outlined'`
- `inputId` · `ariaLabel` · `ariaLabelledBy` · `tabindex`: `string` · `styleClass`: `string` · `style`: `object` · `panelStyleClass`: `string` · `panelStyle`: `object` · `scrollHeight`: `string` = `'14rem'`
- List/search: `showHeader`: `boolean` = `true` (header row with check-all and search) · `showToggleAll`: `boolean` = `true` (ticks only rows the search leaves, skips disabled) · `filter`: `boolean` = `true` · `filterBy`: `string` = `optionLabel` · `filterMatchMode`: `'contains' | 'startsWith' | 'endsWith' | 'equals'` = `'contains'` · `filterPlaceholder` · `filterPlaceHolder` (older spelling) · `ariaFilterLabel` · `filterValue`: `string` · `resetFilterOnHide`: `boolean` = `false` · `emptyMessage` · `emptyFilterMessage`: `string` = locale
- Accepted, no effect: `appendTo`, `autoZIndex`, `baseZIndex`, `virtualScroll`, `virtualScrollItemSize`, `lazy`, `autofocusFilter`, `showTransitionOptions`, `hideTransitionOptions`

**Outputs** — `(onChange)`: `WuMultiSelectChangeEvent` ticked / unticked / all ticked / cleared · `(onFilter)`: `WuMultiSelectFilterEvent` · `(onSelectAllChange)`: `WuMultiSelectSelectAllChangeEvent` check-all used (or Ctrl/⌘+A) · `(onPanelShow)` / `(onPanelHide)`: `void` · `(onClear)`: `Event` · `(onFocus)` / `(onBlur)`: `FocusEvent`

**Slots** (also writable as `wuTemplate` / `pTemplate`)
- `selectedItems`: `$implicit` (values array), `removeChip(value, event)` — draws the chosen values in the field
- `item`: `$implicit` (option), `selected`, `index`
- `group`: `$implicit` (group) · `header` · `footer` · `empty` · `emptyfilter` · `dropdownicon`: no context

**Methods** (via template ref, e.g. `#ms`) — `show()` · `hide()` · `toggle()` · `focusField()`

**Types**
```ts
interface WuMultiSelectChangeEvent { originalEvent: Event; value: unknown[]; itemValue?: unknown } // itemValue = value just ticked/unticked
interface WuMultiSelectFilterEvent { originalEvent: Event; filter: string }
interface WuMultiSelectSelectAllChangeEvent { originalEvent: Event; checked: boolean }
interface WuMultiSelectSelectedItemsContext { $implicit: unknown[]; removeChip: (value: unknown, event?: Event) => void }
```

**Tokens** — `--wu-select-width`, `--wu-field-bg`, `--wu-field-border`, `--wu-input-radius`, `--wu-select-dropdown-width`, `--wu-select-dropdown-color`, `--wu-overlay-bg`, `--wu-select-overlay-radius`, `--wu-select-overlay-shadow`, `--wu-select-header-padding`, `--wu-select-list-padding`, `--wu-select-option-padding-x`, `--wu-select-option-padding-y`, `--wu-select-option-hover-bg`, `--wu-select-option-selected-bg`, `--wu-select-option-selected-color`, `--wu-select-group-color`, `--wu-chip-bg`, `--wu-chip-color`, `--wu-chip-radius`, `--wu-primary-color`

**Gotchas**
- Different from Select: `filter` defaults to `true` (turn off with `[filter]="false"` for short lists), and the panel events are `onPanelShow` / `onPanelHide` (not `onShow` / `onHide`).
- The list stays open while you tick; it closes on outside click, Esc, Tab, or a second click on the field.
- Model is an array even with one pick. With no `optionValue` the array holds whole objects: add `dataKey`.
- Slot syntax: v3 `#selectedItems`, v1/v2 `wuTemplate="selectedItems"`.

---
