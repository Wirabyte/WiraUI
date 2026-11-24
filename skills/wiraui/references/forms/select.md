# Select

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-select` · `WuSelectModule` / `WuSelect` from `@wirabyte/ui/select` · forms: ngModel / formControlName
Also accepted: `wu-dropdown`; `p-dropdown` / `p-select` templates port with most inputs unchanged.

Pick one value from a list: Thai search, groups, row templates, full keyboard support. The list opens in the top layer.

```html
<label for="province">จังหวัด</label>
<wu-select inputId="province" name="provinceId" [(ngModel)]="provinceId" [options]="provinces"
  optionLabel="name_th" optionValue="id" placeholder="เลือกจังหวัด"></wu-select>
```
```ts
provinces = [{ id: 10, code: 'BKK', name_th: 'กรุงเทพมหานคร', name_en: 'Bangkok' }, /* ... */];
provinceId: number | null = null;
```

Search with several fields, groups, custom rows:
```html
<wu-select name="provinceId" [(ngModel)]="provinceId" [options]="provinces" optionLabel="name_th"
  optionValue="id" [filter]="true" filterBy="name_th,name_en,code" placeholder="ค้นหาจังหวัด"></wu-select>

<wu-select name="province" [(ngModel)]="province" [options]="regions" [group]="true" optionLabel="name_th"
  optionValue="id" placeholder="เลือกตามภาค"></wu-select>
<!-- regions = [{ label: 'ภาคเหนือ', items: [{ id: 50, name_th: 'เชียงใหม่' }] }, ...] -->

<wu-select name="province" [(ngModel)]="province" [options]="provinces" optionLabel="name_th" dataKey="id" placeholder="เลือกจังหวัด">
  <ng-template #item let-p><b>{{ p.code }}</b> {{ p.name_th }}</ng-template>
  <ng-template #selectedItem let-p>{{ p.code }} · {{ p.name_th }}</ng-template>
</wu-select>
```

**Inputs**
- Options: `options`: `unknown[]` = `[]` (options, or groups when `group`) · `optionLabel` · `optionValue` · `optionDisabled`: `string` · `group`: `boolean` = `false` · `optionGroupLabel`: `string` = `'label'` · `optionGroupChildren`: `string` = `'items'` · `dataKey`: `string`
- `placeholder`: `string` · `scrollHeight`: `string` = `'14rem'` (list height before it scrolls)
- `showClear` · `editable` · `loading` · `checkmark`: `boolean` = `false` — clear button · free text (typing an option's label picks it) · spinner and locked field (list will not open, value cannot change, clear hides) · check mark beside the chosen option
- Search: `filter`: `boolean` = `false` · `filterBy`: `string` = `optionLabel` (comma separated fields) · `filterMatchMode`: `'contains' | 'startsWith' | 'endsWith' | 'equals'` = `'contains'` · `filterPlaceholder` · `ariaFilterLabel` · `filterValue`: `string` · `resetFilterOnHide`: `boolean` = `false` · `emptyMessage` · `emptyFilterMessage`: `string` = locale
- Field: `size`: `'small' | 'large' | 'sm' | 'lg'` · `fluid`: `boolean` = `false` · `variant`: `'outlined' | 'filled'` = `'outlined'` · `disabled` · `readonly` · `invalid`: `boolean` = `false` · `required` (used in the docs example) · `inputId` · `ariaLabel` · `ariaLabelledBy` · `tabindex`: `string` · `styleClass`: `string` · `style`: `object` · `panelStyleClass`: `string` · `panelStyle`: `object`
- Accepted, no effect: `appendTo`, `autoZIndex`, `baseZIndex`, `virtualScroll`, `virtualScrollItemSize`, `lazy`, `autoDisplayFirst`, `autofocusFilter`

**Outputs** — `(onChange)`: `WuSelectChangeEvent` value changed · `(onFilter)`: `WuSelectFilterEvent` search typed · `(onShow)` / `(onHide)`: `void` list opened / closed · `(onFocus)` / `(onBlur)`: `FocusEvent` · `(onClear)`: `Event` clear pressed · `(onLazyLoad)`: accepted, never emitted

**Slots** (`item`, `selectedItem`, `group`, `header`, `footer`, `empty`, `emptyfilter`, `dropdownicon`)
- `item`: `$implicit` (option), `selected`, `index` — each row
- `selectedItem`: `$implicit` (option) — value shown in the field
- `group`: `$implicit` (group) — group header
- `header` · `footer` · `empty` · `emptyfilter` · `dropdownicon`: no context — above / below the list, no options, no search match, replaces the arrow

**Types**
```ts
interface WuSelectChangeEvent { originalEvent: Event | null; value: unknown }
interface WuSelectFilterEvent { originalEvent: Event; filter: string }
type WuSelectMatchMode = 'contains' | 'startsWith' | 'endsWith' | 'equals';
```

**Tokens** — `--wu-select-width` (default 14rem, never wider than container; `auto` = size to value), `--wu-field-bg`, `--wu-field-border`, `--wu-input-radius`, `--wu-select-dropdown-width`, `--wu-select-dropdown-color`, `--wu-overlay-bg`, `--wu-select-overlay-radius`, `--wu-select-overlay-shadow`, `--wu-select-overlay-border-width`, `--wu-select-header-padding`, `--wu-select-list-padding`, `--wu-select-option-padding-x`, `--wu-select-option-padding-y`, `--wu-select-option-radius`, `--wu-select-option-hover-bg`, `--wu-select-option-selected-bg`, `--wu-select-option-selected-color`, `--wu-select-group-color`, `--wu-select-group-weight`

**Gotchas**
- Default width is 14rem (`--wu-select-width`); for full width use `[fluid]="true"` or `styleClass="w-full"`.
- No `appendTo` / z-index needed: the list is in the top layer and is never clipped by dialogs or `overflow: hidden`.
- `[loading]="true"` locks the field entirely, not just a spinner.
- Thai search works as typed and Thai digits match 0–9. `filterBy` defaults to `optionLabel` only: pass `filterBy="name_th,name_en,code"` to search more fields.
- Slots: v3 `<ng-template #item let-p>`, v1/v2 `<ng-template wuTemplate="item" let-p>`.
- Keyboard: arrows, Home/End, PageUp/PageDown, Enter/Space pick, Esc closes, Tab keeps the highlighted row and moves on, typing a letter jumps to a matching option. Field is `role="combobox"`, list `role="listbox"`.

---
