# Tree

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: slot syntax per major.

`wu-tree` · `WuTreeModule` / `WuTree` from `@wirabyte/ui/tree` · node type `TreeNode` from `@wirabyte/ui/api`

Levels that open and close (document folders, org structure). Pick one node, several, or tick boxes that spread to children and parents; search; load children when a node opens.

```html
<wu-tree [value]="folders" selectionMode="single" [(selection)]="pickedFile" dataKey="key" ariaLabel="เอกสารของโรงเรียน"></wu-tree>
<wu-tree [value]="folders" selectionMode="checkbox" [(selection)]="tickedFiles" ariaLabel="เอกสารของโรงเรียน"></wu-tree>
<wu-tree [value]="folders" [filter]="true" filterMode="lenient" filterPlaceholder="ค้นหาเอกสาร" scrollHeight="18rem" ariaLabel="เอกสารของโรงเรียน"></wu-tree>
```
```ts
import type { TreeNode } from '@wirabyte/ui/api';
folders: TreeNode[] = [
  { key: 'a', label: 'ฝ่ายวิชาการ', expandedIcon: 'wi wi-folder-open', collapsedIcon: 'wi wi-folder',
    children: [{ key: 'a1x', label: 'หลักสูตรสถานศึกษา', icon: 'wi wi-file-pdf', type: 'file', data: '2.4 MB' }] },
];
pickedFile: TreeNode | null = null;   // single: node; multiple/checkbox: TreeNode[]
tickedFiles: TreeNode[] = [];
```

Lazy children: give an unloaded node `leaf: false`, then fill it in `(onNodeExpand)`:
```html
<wu-tree [value]="grades" (onNodeExpand)="loadRooms($event)" ariaLabel="ห้องเรียน"></wu-tree>
```
```ts
import { WuTreeNodeEvent } from '@wirabyte/ui/tree';
grades: TreeNode[] = [{ key: 'm1', label: 'ชั้น ม.1', leaf: false }];
loadRooms(event: WuTreeNodeEvent): void {
  const node = event.node;
  if (node.children) return;
  node.loading = true;
  this.roomService.listRooms(node.key).subscribe((rooms) => {
    node.children = rooms.map((r) => ({ key: r.code, label: 'ห้อง ' + r.name, icon: 'wi wi-users' }));
    node.loading = false;
  });
}
```

Templates by node `type` + context menu:
```html
<wu-tree [value]="folders" selectionMode="single" [(selection)]="pickedFile" [contextMenu]="fileMenu"
  (onNodeContextMenuSelect)="pickNode($event)" (onNodeDoubleClick)="openFile($event)" ariaLabel="เอกสารของโรงเรียน">
  <ng-template wuTemplate="default" let-node><b>{{ node.label }}</b></ng-template>
  <ng-template wuTemplate="file" let-node><span>{{ node.label }}</span><small>{{ node.data }}</small></ng-template>
</wu-tree>
<wu-contextMenu #fileMenu [model]="fileActions"></wu-contextMenu>
```
`fileActions: WuMenuItem[]` (from `@wirabyte/ui/menu`); `pickNode(event: WuTreeNodeEvent) { this.pickedFile = event.node; }`.

**Inputs**
- `value`: `TreeNode[]` — top-level nodes
- `selectionMode`: `'single' | 'multiple' | 'checkbox'` — none = not pickable
- `selection`: `TreeNode | TreeNode[]` — two-way `[(selection)]`
- `propagateSelectionDown`, `propagateSelectionUp`: `boolean` = `true` — ticks spread to children / up to parents
- `metaKeySelection`: `boolean` = `false` — plain click picks one, Ctrl/⌘+click adds (multiple)
- `dataKey`: `string` — compare nodes by this field (use when data reloads)
- `filter`: `boolean` = `false`, `filterBy`: `string` = `'label'`, `filterMode`: `'lenient' | 'strict'` = `'lenient'`, `filterPlaceholder`: `string` — search box (lenient = match + whole path + all children; strict = path but not non-matching children)
- `emptyMessage`: `string` = locale — no nodes (a search with no result uses the locale's `emptyFilterMessage`)
- `loading`: `boolean` = `false` — whole tree loading
- `scrollHeight`: `string` — height before scrolling
- `contextMenu`: `wu-contextMenu` — menu for right-click on a node
- `ariaLabel`, `ariaLabelledBy`, `togglerAriaLabel`: `string`
- `styleClass`, `style`
- Accepted, no effect: `layout`, `lazy`, `virtualScroll`, `virtualScrollItemSize`, `draggableNodes`, `droppableNodes`, `validateDrop`, `filterLocale`, `trackBy`, `indentation`

**Node fields** — `label`, `data`, `key` · `children`, `leaf` (`false` = children still to load) · `expanded`, `loading` · `icon`, `expandedIcon`, `collapsedIcon` · `type` (default `'default'`, picks the template of that name) · `selectable`, `styleClass`, `style`

**Outputs** — `(selectionChange)`: `TreeNode | TreeNode[]` · `(onNodeSelect)` / `(onNodeUnselect)` / `(onNodeExpand)` / `(onNodeCollapse)` / `(onNodeDoubleClick)` / `(onNodeContextMenuSelect)`: `WuTreeNodeEvent` · `(onFilter)`: `WuTreeFilterEvent`

**Slots** — `default` and `<type>`: `let-node` ($implicit) · `header`, `footer` (no context) · `empty` (no nodes / nothing found) · `togglericon`: `$implicit` (open). Type templates are `wuTemplate="<type>"`/`pTemplate`; `header`/`footer`/`empty`/`togglericon` may be `#name`.

**Methods** — `resetFilter()`

**Types**
```ts
interface WuTreeNodeEvent { originalEvent: Event; node: TreeNode }
interface WuTreeFilterEvent { filter: string; filteredValue: TreeNode[] }
```

**Tokens** — `--wu-tree-padding`, `--wu-tree-bg`, `--wu-tree-border-width`, `--wu-tree-gap`, `--wu-tree-node-padding-x`, `--wu-tree-node-padding-y`, `--wu-tree-node-radius`

**Gotchas**
- Expanding and ticking mutate the node objects in place; pass fresh copies if the same array feeds several trees.
- Keyboard: arrows move, `→` opens / first child, `←` closes / parent, `Home`/`End`, `Enter`/`Space` pick.
- Checkbox mode: `selection` holds only fully ticked nodes; partial parents show `aria-checked="mixed"`.
- From `<p-tree>`: names kept (`pTemplate="default"` works). Node drag/drop, `virtualScroll`, `layout="horizontal"` are accepted but not built.
- Classes `p-tree`, `p-treenode`, `p-highlight` sit beside the `wu-*` ones.
