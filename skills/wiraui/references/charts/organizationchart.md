# OrganizationChart

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: which chart component to use on which major.

`wu-organizationChart` · `WuOrganizationChartModule` (brings `wuTemplate`) / `WuOrganizationChart` from `@wirabyte/ui/organizationchart`
Also accepted: `wu-organizationchart`, `wu-organization-chart`; migrating from PrimeNG `<p-organizationChart>` (inputs, events and `pTemplate="person"` keep their names; same `TreeNode` data).

Org chart drawn top down with boxes joined by lines: your own box templates by data type, single/multiple selection, foldable branches, keyboard, scrolls sideways inside its own box on phones. Data is `TreeNode` from `@wirabyte/ui/api`. For a freely draggable/editable diagram use Flow instead.

```html
<wu-organizationChart [value]="chart" ariaLabel="ผังองค์กรโรงเรียนวิระ">
  <ng-template wuTemplate="person" let-node>
    <div class="person">
      <wu-avatar [label]="node.data.initial" shape="circle"></wu-avatar>
      <b>{{ node.data.name }}</b>
      <small>{{ node.data.title }}</small>
    </div>
  </ng-template>
</wu-organizationChart>
```
```ts
import type { TreeNode } from '@wirabyte/ui/api';

chart: TreeNode[] = [
  {
    label: 'ผู้อำนวยการ',
    type: 'person',
    expanded: true,   // children show only while expanded is true
    data: { name: 'อรุณี ทองดี', title: 'ผู้อำนวยการ', initial: 'อ' },
    children: [
      { label: 'รองผู้อำนวยการฝ่ายวิชาการ', type: 'person', expanded: true, data: { name: 'ประเสริฐ มั่นคง', title: 'รอง', initial: 'ป' }, children: [{ label: 'กลุ่มสาระวิทยาศาสตร์' }] },
    ],
  },
];
```
```html
<!-- selection (v3 form; v1/v2 use *ngIf) -->
<wu-organizationChart [value]="units" selectionMode="single" [(selection)]="picked" (onNodeSelect)="selected($event)"></wu-organizationChart>
<wu-organizationChart [value]="units" selectionMode="multiple" [(selection)]="team"></wu-organizationChart>
<!-- foldable -->
<wu-organizationChart [value]="units" [collapsible]="true" [preserveSpace]="false" (onNodeExpand)="opened($event)" (onNodeCollapse)="closed($event)"></wu-organizationChart>
```
```ts
picked: TreeNode | null = null;
team: TreeNode[] = [];
selected(event: { node: TreeNode }): void { console.log(event.node.label); }
```

**Inputs**
- `value`: `TreeNode[]` — the chart, top box first
- `selectionMode`: `'single' | 'multiple'` — pick one box or many (multiple binds an array)
- `selection`: `TreeNode | TreeNode[]` — picked box(es), two-way `[(selection)]`
- `collapsible`: `boolean` = `false` — fold button under boxes with children (flips `node.expanded`)
- `preserveSpace`: `boolean` = `true` — keep children's room while folded; `false` folds it away
- `ariaLabel` · `ariaLabelledBy`: `string` = locale — name of the chart
- `styleClass` · `style` (STYLE_ROW)

**Outputs**
- `(onNodeSelect)` · `(onNodeUnselect)`: `{ originalEvent, node }` — box picked / dropped (click a picked box again to drop it)
- `(onNodeExpand)` · `(onNodeCollapse)`: `{ originalEvent, node }` — branch opened / folded
- `(selectionChange)`: `TreeNode | TreeNode[]` — for `[(selection)]`

**Slots** (name after the box `type`) — `wuTemplate="<type>"` draws boxes with that `type` (`let-node`, `$implicit` = node); `wuTemplate="default"` draws all others; `togglericon` draws the fold button icon (`let-expanded`, also `#togglericon` in v3). Without any template a box shows `label`.

**TreeNode fields the chart reads** — `label`: `string` (text without a template) · `children`: `TreeNode[]` · `expanded`: `boolean` (children show only while true) · `type`: `string` (picks the template) · `selectable`: `boolean` (false = cannot be picked) · `styleClass`: `string` (box class) · `data`: `any` (app's own data)

**Keyboard** — `role="tree"`: Tab in; `↓` opens a box or goes to its first child; `↑` folds it or goes to parent; `←`/`→` along a row; `Home`/`End`; `Enter`/`Space` pick.

**Tokens** — `--wu-organizationchart-padding`, `--wu-organizationchart-gutter`, `--wu-organizationchart-connector-height`, `--wu-organizationchart-connector-color`, `--wu-organizationchart-connector-radius`, `--wu-organizationchart-node-bg`, `--wu-organizationchart-node-color`, `--wu-organizationchart-node-border-color`, `--wu-organizationchart-node-padding`, `--wu-organizationchart-node-toggleable-padding`, `--wu-organizationchart-node-radius`, `--wu-organizationchart-node-hover-bg`, `--wu-organizationchart-node-selected-bg`, `--wu-organizationchart-node-selected-color`, `--wu-organizationchart-toggle-size`, `--wu-organizationchart-toggle-bg`, `--wu-organizationchart-toggle-color`, `--wu-organizationchart-toggle-hover-bg`, `--wu-organizationchart-toggle-hover-color`

**Gotchas**
- **A box's children show only while it has `expanded: true`.** A `TreeNode` without it renders no children: set it on every box that should start open.
- Box templates are matched by name, not `#ref`: use `wuTemplate="person"` (or `pTemplate`) in EVERY major, including v3. Do not write `<ng-template #person>` for box types.
- `TreeNode` is an index-signature type (`import type { TreeNode } from '@wirabyte/ui/api'`); declare custom node shapes as a `type` alias, not an `interface`.
