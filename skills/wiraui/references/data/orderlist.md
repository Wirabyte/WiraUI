# OrderList

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: slot syntax per major.

`wu-orderlist` · `WuOrderListModule` (brings `wuTemplate`) / `WuOrderList` from `@wirabyte/ui/orderlist`
Also accepted: `wu-orderList`

One list people put in order with up/down/top/bottom buttons, the keyboard or a drag (e.g. electives by preference). Shares look and tokens with PickList.

```html
<wu-orderlist [value]="electives" header="ลำดับวิชาเลือกที่ต้องการ" dataKey="id"
  [listStyle]="{ height: '18rem' }" [trackBy]="trackById" (onReorder)="reordered()">
  <ng-template #item let-e let-i="index">
    <div class="font-semibold">{{ i + 1 }}. {{ e.name }}</div>
    <small class="text-color-secondary">{{ e.teacher }}</small>
  </ng-template>
</wu-orderlist>
```
```ts
electives: Elective[] = [ { id: 1, name: 'หุ่นยนต์เบื้องต้น', teacher: 'ครูวิชัย' } ];
trackById(index: number, e: Elective): number { return e.id; }
reordered(): void { /* this.electives already in new order */ }
```
Drag + bound selection, search/empty templates:
```html
<wu-orderlist [value]="electives" dataKey="id" [dragdrop]="true" [(selection)]="selectedElectives" controlsPosition="right">
  <ng-template #item let-e>{{ e.name }}</ng-template>
</wu-orderlist>

<wu-orderlist [value]="electives" dataKey="id" filterBy="name,teacher" filterPlaceholder="ค้นหาวิชา">
  <ng-template #header>วิชาเลือก ({{ electives.length }})</ng-template>
  <ng-template #item let-e>{{ e.name }}</ng-template>
  <ng-template #emptyfilter>ไม่พบวิชาที่ค้นหา</ng-template>
  <ng-template #empty>ยังไม่มีวิชาเลือก</ng-template>
</wu-orderlist>
```

**Inputs**
- `value`: `any[]` = `[]` — reordered in place (also emitted as `valueChange`)
- `selection`: `any[]` = `[]` — `[(selection)]` works
- `header`: `string` — title
- `optionLabel`: `string` = `'label'`, then `'name'` — field shown without an `item` template
- `dataKey`: `string`, `trackBy`: `TrackByFunction`
- `filterBy`: `string` (shows the search box), `filterMatchMode`: `'contains' | …` = `'contains'`, `filterPlaceholder`, `ariaFilterLabel`: `string`
- `dragdrop`: `boolean` = `false`
- `metaKeySelection`: `boolean` = v1 `true`, v2/v3 `false` (as PickList)
- `controlsPosition`: `'left' | 'right'` = `'left'`
- `disabled`, `stripedRows`: `boolean` = `false`
- `breakpoint`: `string` = `'960px'` — buttons move above the list at/below this
- `scrollHeight`: `string`, `listStyle`: `object`
- `style`, `styleClass`, `id`, `tabindex`
- `ariaLabel`, `ariaLabelledBy`: `string`
- `upButtonAriaLabel`, `topButtonAriaLabel`, `downButtonAriaLabel`, `bottomButtonAriaLabel`: `string` = locale
- Accepted, no effect: `responsive`, `filterLocale`, `autoOptionFocus`

**Outputs** — `(onReorder)`: `unknown[]` (items that moved) · `(selectionChange)`: `any[]` · `(onSelectionChange)`: `WuOrderListSelectionChangeEvent` · `(onFilterEvent)`: `WuOrderListFilterEvent` (`value` = items the search leaves) · `(onFocus)`, `(onBlur)`: `Event` · `(valueChange)`: `any[]`

**Slots** — `item`: `$implicit`, `index`, `selected` · `header` · `filter`: `options` (`filter(text)`, `reset()`) · `empty` (no items) · `emptyfilter` (no match; default "No results found")

**Types**
```ts
interface WuOrderListSelectionChangeEvent { originalEvent?: Event; value: unknown[] }
interface WuOrderListFilterEvent { originalEvent?: Event; value: unknown[] }
```

**Tokens** — same as PickList (`--wu-picklist-*`).

**Gotchas**
- While searching, order buttons and dragging are disabled (order belongs to the whole list).
- Extra keyboard: `Alt`+`↑`/`↓` moves selected items; name the list with `header`, `ariaLabel` or `ariaLabelledBy`.
- From `<p-orderList>`: `dataKey`, `listStyle`, `onReorder`, `trackBy`, `filterBy` keep names; `pTemplate="item"` works.
