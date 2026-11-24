# Table: search and column filters

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

## Search (global) and column filters

```html
<wu-table #dt [value]="students" [globalFilterFields]="['code', 'name', 'room', 'club.name']" [filterDelay]="0">
  <ng-template #caption>
    <wu-iconfield>
      <wu-inputicon icon="wi wi-search"></wu-inputicon>
      <input wuInputText placeholder="ค้นหานักเรียน" (input)="dt.filterGlobal($any($event.target).value, 'contains')" />
    </wu-iconfield>
  </ng-template>
  ...header/body...
</wu-table>
```

Needs a template ref (`#dt`); `globalFilterFields` (dot paths; default = every top-level field). Case-insensitive; Thai digits equal 0-9. `filterDelay` default 0 (search per key); app-wide default via `provideWiraUI({ delays: { filter } })`. `dt.clear()` / `dt.reset()` clear search, filters and sort and return to page 1.

Column filters (row display), in a second header row:

```html
<tr>
  <th><wu-columnFilter field="name" placeholder="ค้นหาชื่อ"></wu-columnFilter></th>
  <th>
    <wu-columnFilter field="room" matchMode="equals" [showClearButton]="false">
      <ng-template #filter let-value let-filter="filterCallback">
        <wu-select [ngModel]="value" [options]="rooms" placeholder="ทุกห้อง" [showClear]="true" [fluid]="true" (onChange)="filter($event.value)"></wu-select>
      </ng-template>
    </wu-columnFilter>
  </th>
  <th><wu-columnFilter field="score" type="numeric" matchMode="gte" placeholder="คะแนนขั้นต่ำ"></wu-columnFilter></th>
  <th><wu-columnFilter field="paid" type="boolean"></wu-columnFilter></th>
</tr>
```

`type`: text (default) · `numeric` · `date` · `boolean` (button cycling any, yes, no). `matchMode` defaults: text `contains`, date `dateIs` (same day), others `equals`. `[delay]` (300ms, text only), `[showClearButton]`. Filters combine with global search and paging (back to page 1). Programmatic: `dt.filter(value, field, matchMode = 'contains')` (empty value removes it).

Filter menu (`display="menu"`): button in the header opening a panel with match mode, value box (or `filter` template) and up to `maxConstraints` (2) rules joined by match all/any, Clear/Apply. Menu texts come from the locale.

```html
<th>คะแนน <wu-columnFilter display="menu" field="score" type="numeric"></wu-columnFilter></th>
```

```ts
table.filterRules('score', [{ value: 80, matchMode: 'gte' }, { value: 90, matchMode: 'lt' }], 'and');  // from code; null removes
```

Column-filter inputs: `field · type · matchMode · placeholder · showClearButton · delay · display · ariaLabel`; menu only: `showOperator · showAddButton · showApplyButton` (without it rules apply at once) `· showMatchModes · matchModeOptions · maxConstraints · hideOnClear`. Only the row display is drawn for now (`display="menu"` shows the same box in the menu form). Match modes include `dateIs`, `dateIsNot`, `dateBefore`, `dateAfter`.
