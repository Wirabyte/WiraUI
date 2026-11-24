# PickList

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: slot syntax per major.

`wu-picklist` · `WuPickListModule` (brings `wuTemplate`) / `WuPickList` from `@wirabyte/ui/picklist`
Also accepted: `wu-pickList`

Two lists to move items between: select and use the middle buttons, double-click, or drag. Each side can be searched and ordered. Made for user permissions and approval chains.

```html
<wu-picklist [source]="allPermissions" [target]="userPermissions" sourceHeader="สิทธิ์ทั้งหมด"
  targetHeader="สิทธิ์ของผู้ใช้" [sourceStyle]="{ height: '20rem' }" [targetStyle]="{ height: '20rem' }">
  <ng-template #item let-p>
    <div class="font-semibold">{{ p.name }}</div>
    <small class="text-color-secondary">{{ p.module }}</small>
  </ng-template>
</wu-picklist>
```
```ts
allPermissions: Permission[] = [ /* from API */ ];
userPermissions: Permission[] = [ { id: 1, code: 'student.view', name: 'ดูข้อมูลนักเรียน', module: 'งานทะเบียน' } ];
```
`[source]`/`[target]` are changed in place, so `userPermissions` is current right after a move (`[(source)]`/`[(target)]` also work).

Drag/drop + ordering, with async save button:
```html
<wu-picklist [source]="ranks" [target]="flow" sourceHeader="ตำแหน่ง" targetHeader="ลำดับการส่งต่อ"
  [dragdrop]="true" [showSourceControls]="false" [sourceStyle]="{ height: '20rem' }" [targetStyle]="{ height: '20rem' }">
  <ng-template #item let-r><div class="font-semibold">{{ r.rank }}</div></ng-template>
</wu-picklist>
<wu-button label="บันทึก" icon="wi wi-save" [loading]="isApiSaving" (onClick)="saveFlow()"></wu-button>
```
Search (`filterBy` shows the boxes), header/empty templates, methods via template ref:
```html
<wu-picklist #pl="wuPickList" [source]="allPermissions" [target]="userPermissions" filterBy="name,module"
  sourceFilterPlaceholder="ค้นหาสิทธิ์" targetFilterPlaceholder="ค้นหาสิทธิ์"
  (onMoveToTarget)="logMove('onMoveToTarget', $event)" (onTargetReorder)="logMove('onTargetReorder', $event)">
  <ng-template #sourceHeader let-list>สิทธิ์ทั้งหมด ({{ list.length }})</ng-template>
  <ng-template #item let-p let-selected="selected">{{ p.name }}</ng-template>
  <ng-template #emptymessagetarget>ยังไม่ได้ให้สิทธิ์ใด ๆ</ng-template>
  <ng-template #emptyfiltermessagesource>ไม่พบสิทธิ์ที่ค้นหา</ng-template>
</wu-picklist>
<wu-button label="ให้ทุกสิทธิ์" (onClick)="pl.moveAllRight()"></wu-button>
```
```ts
import { WuPickListMoveEvent } from '@wirabyte/ui/picklist';
logMove(name: string, event: WuPickListMoveEvent): void { const codes = (event.items as Permission[]).map((p) => p.code); }
```

**Inputs — lists and search**
- `source`, `target`: `any[]` = `[]` — the two sides; changed in place; also emitted as `sourceChange`/`targetChange`
- `sourceHeader`, `targetHeader`: `string` — side titles
- `optionLabel`: `string` = `'label'`, then `'name'` — field shown without an `item` template (dot paths work)
- `dataKey`: `string` — identifies an item so selections survive new objects
- `trackBy`, `sourceTrackBy`, `targetTrackBy`: `TrackByFunction`
- `filterBy`: `string` — comma-separated fields; search boxes show when set
- `filterMatchMode`: `'contains' | 'startsWith' | 'endsWith' | 'equals'` = `'contains'`
- `showSourceFilter`, `showTargetFilter`: `boolean` = `true` — (with `filterBy`)
- `sourceFilterPlaceholder`, `targetFilterPlaceholder`: `string`
- `ariaSourceFilterLabel`, `ariaTargetFilterLabel`: `string` = placeholder

**Inputs — selecting and moving**
- `dragdrop`: `boolean` = `false` — drag across and reorder within
- `metaKeySelection`: `boolean` = v1 `true`, v2/v3 `false` — true: click picks one, Ctrl/⌘+click adds; false: click toggles (touch always toggles)
- `showSourceControls`, `showTargetControls`: `boolean` = `true` — order buttons beside each list
- `keepSelection`: `boolean` = `false` — items stay selected after moving
- `disabled`: `boolean` = `false`

**Inputs — look**
- `scrollHeight`: `string` — height of both lists
- `sourceStyle`, `targetStyle`: `object` — e.g. `{ height: '20rem' }`
- `stripedRows`: `boolean` = `false`
- `breakpoint`: `string` = `'960px'` — lists stack at/below this (arrows point down/up)
- `style`, `styleClass` (outer box) · `id`: `string` (prefixes list ids), `tabindex`: `number` = `0`
- `rightButtonAriaLabel`, `allRightButtonAriaLabel`, `leftButtonAriaLabel`, `allLeftButtonAriaLabel`, `upButtonAriaLabel`, `topButtonAriaLabel`, `downButtonAriaLabel`, `bottomButtonAriaLabel`: `string` = locale
- Accepted, no effect: `responsive`, `filterLocale`, `autoOptionFocus`

**Outputs** — `(onMoveToTarget)`, `(onMoveAllToTarget)`, `(onMoveToSource)`, `(onMoveAllToSource)`, `(onSourceReorder)`, `(onTargetReorder)`: `WuPickListMoveEvent` (`items` = those that moved) · `(onSourceSelect)`, `(onTargetSelect)`: `WuPickListSelectEvent` (`items` = whole selection) · `(onSourceFilter)`, `(onTargetFilter)`: `WuPickListFilterEvent` · `(onFocus)`, `(onBlur)`: `Event` · `(sourceChange)`, `(targetChange)`: `any[]`

**Slots** — `item`: `$implicit` (item), `index`, `selected` · `sourceHeader`, `targetHeader`: `$implicit` (list array) · `sourceFilter`, `targetFilter`: `options` (`filter(text)`, `reset()`) · `emptymessagesource`, `emptymessagetarget` (no context; without them nothing shows) · `emptyfiltermessagesource`, `emptyfiltermessagetarget`

**Methods** (via `#pl="wuPickList"`) — `moveRight()`, `moveAllRight()`, `moveLeft()`, `moveAllLeft()`, `resetFilter()`, `resetSourceFilter()`, `resetTargetFilter()`, `selectedItemsSource`, `selectedItemsTarget` (`any[]`, read/write). Move-all moves only items the search leaves.

**Types**
```ts
interface WuPickListMoveEvent { originalEvent?: Event; items: unknown[] }
interface WuPickListSelectEvent { originalEvent?: Event; items: unknown[] }
interface WuPickListFilterEvent { query: string; value: unknown[] }
```

**Tokens** (shared with OrderList) — `--wu-picklist-gap`, `-box-border-width` (v2/v3), `-box-radius`, `-box-bg`, `-header-padding`, `-header-border-width`, `-header-radius` (v1), `-header-bg`, `-header-weight`, `-filter-padding`, `-filter-border-width`, `-filter-bg`, `-list-padding`, `-list-border-width`, `-list-radius`, `-list-height` (when no style/scrollHeight), `-list-min-height`, `-list-max-height`, `-item-gap`, `-item-padding`, `-item-radius`, `-item-stripe-bg` (all prefixed `--wu-picklist`), plus `--wu-select-option-hover-bg`, `--wu-select-option-selected-bg`, `--wu-select-option-selected-color`, `--wu-primary-color` (drop line + drag count)

**Gotchas**
- Arrays mutate in place; if you replace them with new arrays use `[(source)]`/`[(target)]`.
- `metaKeySelection` default differs: v1 true, v2/v3 false.
- While a search is active, order buttons wait until cleared.
- Keyboard: each list one Tab stop; arrows/Home/End move, Shift+arrows select, Space/Enter toggle, Ctrl/⌘+A all visible.
- Touch drag starts after ~300ms press-and-hold; `Esc` cancels a drag.
- From `<p-pickList>`: names kept, `pTemplate="item"` works, `p-picklist-*` classes beside `wu-picklist-*`.
