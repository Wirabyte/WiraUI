# Listbox

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-listbox` · `WuListboxModule` / `WuListbox` from `@wirabyte/ui/listbox` · forms: ngModel / formControlName
Also accepted: `wu-listBox`; `p-listbox` templates port (inputs, events, `pTemplate="item"` unchanged; `p-listbox`, `p-listbox-option`, `p-highlight` classes sit next to the `wu-*` ones).

A list that stays open on the page: single or multiple pick (optionally with check boxes), search, groups. Same option fields as Select.

```html
<wu-listbox name="room" [(ngModel)]="room" [options]="rooms" optionLabel="name" optionDisabled="closed"
  ariaLabel="ห้องเรียน" [style]="{ width: '16rem' }"></wu-listbox>

<wu-listbox name="roomCodes" [(ngModel)]="roomCodes" [options]="rooms" optionLabel="name" optionValue="code"
  optionDisabled="closed" [multiple]="true" [checkbox]="true" [striped]="true" ariaLabel="ห้องเรียน"></wu-listbox>
```
```ts
rooms = [{ code: '101', name: 'ม.1/1', teacher: 'ครูสมศรี' }, { code: '201', name: 'ม.2/1', teacher: 'ครูกานดา', closed: true }];
room: Room | null = null;      // whole object (no optionValue)
roomCodes: string[] = ['101'];
```

Search + custom row:
```html
<wu-listbox name="room" [(ngModel)]="room" [options]="rooms" optionLabel="name" [filter]="true" filterBy="name,teacher"
  filterPlaceholder="ค้นหาห้องหรือครู" emptyFilterMessage="ไม่พบห้อง" scrollHeight="12rem" ariaLabel="ห้องเรียน"></wu-listbox>

<wu-listbox name="roomCodes" [(ngModel)]="roomCodes" [options]="rooms" optionValue="code" [multiple]="true"
  ariaLabel="ห้องเรียน" (onDblClick)="openRoom($event)">
  <ng-template #item let-room let-selected="selected">{{ room.name }} @if (selected) { <i class="wi wi-check"></i> }</ng-template>
  <ng-template #footer let-value>เลือกแล้ว {{ value?.length || 0 }} ห้อง</ng-template>
</wu-listbox>
```

**Inputs**
- `options`: `any[]` · `optionLabel` · `optionValue` · `optionDisabled`: `string` · `group`: `boolean` = `false` · `optionGroupLabel` = `'label'` · `optionGroupChildren` = `'items'` · `dataKey`: `string`
- `multiple` = `false` · `checkbox` = `false` · `showToggleAll` = `true`: `boolean` — several picks · check boxes (+ check-all in header) · hide check-all with `false`
- `metaKeySelection`: `boolean` = `false` — plain click picks one, Ctrl/⌘+click adds
- `selectOnFocus`: `boolean` = `false` — arrow moves also pick (single lists)
- `filter`: `boolean` = `false` · `filterBy`: `string` = label · `filterMatchMode`: `string` = `'contains'` (`contains`, `startsWith`, `endsWith`, `equals`) · `filterPlaceholder` · `filterValue`: `string`
- `emptyMessage` · `emptyFilterMessage`: `string` = locale · `scrollHeight`: `string` = `'14rem'`
- `listStyle`: `object` · `listStyleClass`: `string` · `striped`: `boolean` = `false`
- `disabled` · `readonly`: `boolean` = `false`
- `ariaLabel` · `ariaLabelledBy` · `ariaFilterLabel`: `string` · `tabindex`: `number`
- `styleClass`: `string` · `style`: `object`
- Accepted, no effect (every option is drawn): `virtualScroll`, `virtualScrollItemSize`, `virtualScrollOptions`, `lazy`, `filterLocale`, `autoOptionFocus`, `focusOnHover`, `highlightOnSelect`

**Outputs** — `(onChange)`: `WuListboxChangeEvent` · `(onClick)` / `(onDblClick)`: `WuListboxClickEvent` · `(onFilter)`: `WuListboxFilterEvent` · `(onSelectAllChange)`: `WuListboxSelectAllChangeEvent` · `(onFocus)` / `(onBlur)`: `FocusEvent`

**Slots** — `item`: `$implicit` (option), `selected`, `index` · `group`: `$implicit` (group) · `header` / `footer`: `$implicit` (value), `options` · `empty` · `emptyfilter`: no context

**Methods** — `resetFilter()`: clears search, shows every option

**Types**
```ts
interface WuListboxChangeEvent { originalEvent: Event; value: any }
interface WuListboxClickEvent { originalEvent: Event; option: any; value: any }
interface WuListboxFilterEvent { originalEvent: Event; filter: string }
interface WuListboxSelectAllChangeEvent { originalEvent: Event; checked: boolean }
```

**Tokens** — `--wu-listbox-border-width` (colours, background and options use the Select tokens)

**Gotchas**
- Without `optionValue` the value is the whole object; with `multiple` it is an array.
- `optionDisabled="closed"`: options with that field truthy are unpickable and skipped by the keyboard; group headers are unpickable too.
- Keyboard: ↑↓, Enter/Space, Home/End, type-to-jump; multiple: Shift+arrows extends, Ctrl+A picks all.
- Long lists: all options are drawn (no virtual scroll); for very long ones use `wu-scroller`.
- Slot syntax: v3 `#item`, v1/v2 `wuTemplate="item"`; `pTemplate` also works.

---
