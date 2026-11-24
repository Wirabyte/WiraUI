# TreeSelect

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-treeselect` · `WuTreeSelectModule` / `WuTreeSelect` from `@wirabyte/ui/treeselect` · forms: ngModel / formControlName
Also accepted: `wu-treeSelect`, `wu-tree-select`; `p-treeSelect` templates port (inputs, events, templates unchanged; `p-treeselect` class sits next to `wu-treeselect`).

Field that opens a tree to pick one node or several. Searchable, clearable; opening it shows picked nodes with their parents expanded.

```html
<label for="attachment">เอกสารที่แนบ</label>
<wu-treeSelect inputId="attachment" name="attachment" [(ngModel)]="attachment" [options]="folders" placeholder="เลือกเอกสาร"
  [filter]="true" [showClear]="true" [style]="{ width: '20rem' }"></wu-treeSelect>

<wu-treeSelect inputId="myRooms" name="myRooms" [(ngModel)]="myRooms" [options]="roomTree" selectionMode="checkbox"
  display="chip" placeholder="เลือกห้องที่รับผิดชอบ" [style]="{ width: '20rem' }"></wu-treeSelect>
```
```ts
import type { TreeNode } from '@wirabyte/ui/api';
roomTree: TreeNode[] = [
  { key: 'm1', label: 'ชั้น ม.1', children: [{ key: '101', label: 'ห้อง ม.1/1' }, { key: '102', label: 'ห้อง ม.1/2' }] },
];
attachment: TreeNode | null = null;   // single mode: one node
myRooms: TreeNode[] = [];             // checkbox / multiple: array of nodes
```

Custom value: `<ng-template #value let-node let-placeholder="placeholder">@if (node) { {{ node.label }} } @else { {{ placeholder }} }</ng-template>` inside `<wu-treeSelect>`.

**Inputs**
- `options`: `TreeNode[]` — nodes (same shape as wu-tree: `key`, `label`, `children`, `icon`, `expandedIcon`, `collapsedIcon`, `selectable`, `leaf`, `data` …)
- `selectionMode`: `'single' | 'multiple' | 'checkbox'` = `'single'` — a pick closes the panel in single mode
- `placeholder`: `string` · `display`: `'comma' | 'chip'` = `'comma'`
- Search: `filter`: `boolean` = `false` · `filterBy`: `string` = `'label'` · `filterMode`: `'lenient' | 'strict'` = `'lenient'` · `filterPlaceholder`: `string` · `resetFilterOnHide`: `boolean` = `true`
- `showClear`: `boolean` = `false`
- `metaKeySelection`: `boolean` = `false` · `propagateSelectionUp`: `boolean` = `true` · `propagateSelectionDown`: `boolean` = `true` · `dataKey`: `string` — picking as in wu-tree
- `emptyMessage`: `string` = locale · `disabled` · `loading`: `boolean` = `false` · `scrollHeight`: `string` = `'400px'` (tree height)
- `variant`: `'outlined' | 'filled'` · `size`: `'small' | 'large'`
- `panelStyleClass` · `panelClass` · `containerStyleClass` · `labelStyleClass`: `string` · `panelStyle`: `object`
- `inputId` · `ariaLabel` · `ariaLabelledBy`: `string` · `tabindex`: `number` · `styleClass`: `string` · `style`: `object`
- Accepted, no effect: `appendTo`, `fluid`, `showTransitionOptions`, `hideTransitionOptions`, `virtualScroll`, `filterLocale`

**Outputs** — `(onShow)` / `(onHide)`: `void` · `(onClear)`: `void` · `(onFilter)`: `WuTreeFilterEvent` · `(onNodeSelect)` / `(onNodeUnselect)` / `(onNodeExpand)` / `(onNodeCollapse)`: `WuTreeNodeEvent` · `(onFocus)` / `(onBlur)`: `FocusEvent`

**Slots** — `value`: `$implicit` (value), `placeholder` — picked value in the field · `header` / `footer`: `$implicit` (value), `options` — above / below the tree in the panel

**Types**
```ts
interface WuTreeNodeEvent { originalEvent: Event; node: TreeNode }
interface WuTreeFilterEvent { filter: string; filteredValue: TreeNode[] }
```

**Tokens** — none of its own: uses the Select tokens (field, panel) and Tree tokens (rows in the panel).

**Gotchas**
- Model is the `TreeNode` object (or `TreeNode[]`), not the `key` string.
- `selectionMode="checkbox"` spreads ticks to children and parents (control with `propagateSelectionUp` / `propagateSelectionDown`).
- Panel is in the top layer; `appendTo` / `fluid` are ignored. Set width with `[style]="{ width: '20rem' }"`.
- Slot syntax: v3 `#value`, v1/v2 `wuTemplate="value"` (`pTemplate` too).

---
