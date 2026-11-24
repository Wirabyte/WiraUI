# Flow

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: which chart component to use on which major.

`wu-flow` · `WuFlowModule` (everything + `wuTemplate`) / standalone parts from `@wirabyte/ui/flow`: `WuFlow`, `WuFlowHandle`, `WuFlowNodeTemplate`, `WuFlowEdgeTemplate`, `WuFlowEdgeLabelTemplate`, `WuFlowConnectionLineTemplate`, `WuFlowBackground`, `WuFlowControls`, `WuFlowMinimap`, `WuFlowPanel`, `WuFlowNodeToolbar`, `WuFlowNodeResizer`, `WuFlowHistory`

Node diagram people drag, connect and edit: approval steps, flowcharts, org charts, system maps. Nodes are your own templates; 5 edge shapes; pan/zoom by mouse, keyboard, touch; auto layout; undo/redo; export SVG/JSON. No outside dependencies. Types (`WuFlowNode`, `WuFlowEdge`, `FlowConnection`, `FlowViewport` …) and helpers come from `@wirabyte/ui/flow` too.

```html
<wu-flow [(nodes)]="nodes" [(edges)]="edges" [fitView]="true" [autoConnect]="true" [defaultEdgeOptions]="edgeDefaults"
         ariaLabel="ขั้นตอนอนุมัติคำร้อง" style="height: 24rem">
  <wu-flow-background variant="dots" [gap]="20"></wu-flow-background>
  <wu-flow-controls position="bottom-left"></wu-flow-controls>
  <wu-flow-minimap position="bottom-right"></wu-flow-minimap>
</wu-flow>
```
```ts
import { WuFlowEdge, WuFlowNode } from '@wirabyte/ui/flow';

nodes: WuFlowNode[] = [
  { id: 'submit', type: 'input', position: { x: 0, y: 0 }, data: { label: 'ยื่นคำร้อง' } },
  { id: 'check', position: { x: 0, y: 100 }, data: { label: 'ตรวจเอกสาร' } },
  { id: 'notify', type: 'output', position: { x: 0, y: 200 }, data: { label: 'แจ้งผลทางอีเมล' } },
];
edges: WuFlowEdge[] = [
  { id: 'submit-check', source: 'submit', target: 'check' },
  { id: 'check-notify', source: 'check', target: 'notify', label: 'ครบ', animated: true },
];
edgeDefaults: Partial<WuFlowEdge> = { markerEnd: 'arrowclosed' };   // arrowheads on every edge incl. new connections
```
**Data model**: nodes/edges are plain-object arrays your app holds. Built-in node types: `input` (way out only), `default`, `output` (way in only), `group`; built-in nodes show `data.label`. `[(nodes)]`/`[(edges)]` hand back new arrays on drag/connect/delete. `[autoConnect]="true"` adds the edge for a new connection (otherwise add it in `(connect)` with `addEdge()`). **Always give the flow a height** (min `20rem` by default).

**Custom node templates** — `type` matching `<ng-template wuFlowNode="person" let-node>` is drawn by that template. No-name `<ng-template wuFlowNode let-node>` draws every node without a template. Add `class="wu-flow-node-box"` for the built-in frame. `<wu-flow-handle>` is where edges attach.
```html
<wu-flow [(nodes)]="nodes" [(edges)]="edges" [fitView]="true" [autoConnect]="true" [minZoom]="0.3" ariaLabel="ขั้นตอนการลา" style="height: 22rem">
  <ng-template wuFlowNode="request" let-node>
    <div class="wu-flow-node-box">
      <strong>{{ node.data.name }}</strong>
      <wu-flow-handle type="source" position="right"></wu-flow-handle>
    </div>
  </ng-template>
  <ng-template wuFlowNode="decision" let-node>
    <div class="wu-flow-node-box">
      <wu-flow-handle type="target" position="left"></wu-flow-handle>
      <strong>{{ node.data.question }}</strong>
      <!-- several handles: give each an id, move along the side with a style -->
      <wu-flow-handle type="source" position="right" id="yes" [style.top.%]="30"></wu-flow-handle>
      <wu-flow-handle type="source" position="right" id="no" [style.top.%]="70"></wu-flow-handle>
    </div>
  </ng-template>
</wu-flow>
```
```ts
// edge from a named handle: sourceHandle = the handle's id
{ id: 'rule-hr', source: 'rule', sourceHandle: 'yes', target: 'hr', label: 'ใช่' }
```
Components instead of templates: `[nodeTypes]="{ machine: MachineNodeComponent }"` with `inject(WU_FLOW_NODE)` inside (a `wuFlowNode` template wins; component outputs surface as `(nodeComponentEvent)`).

**Edges** — `type`: `default` (bezier), `smoothstep`, `step`, `straight`, `simplebezier`, or your template name. `label`; `markerEnd`/`markerStart`: `'arrow' | 'arrowclosed' | { type, color, width, height }`; `animated` (runs even under reduced motion); `style`; `pathOptions`. `<ng-template wuFlowEdgeLabel="type" let-edge>` = HTML label; `wuFlowEdge="type"` draws the whole edge with `<svg:path [attr.d]="edge.path">`. Select an edge, then drag the circle at an end to another handle to reconnect (`autoConnect` moves it, or handle `(reconnect)` with `reconnectEdge()`).

**Connecting** — drag handle to handle, or click one then the other (`connectOnClick`); drops snap within `connectionRadius`. `connectionMode`: `strict` (way out → way in) or `loose` (any). `[isValidConnection]` = your rule (bind the function once: `canConnect = this.check.bind(this)`); `[connectionLimit]="1"` on a handle; valid handles turn green, invalid red.
```ts
import { addEdge, FlowConnection, WuFlowConnectEndEvent } from '@wirabyte/ui/flow';
assign(c: FlowConnection): void { this.edges = addEdge({ ...c, type: 'smoothstep' }, this.edges); }   // (connect)="assign($event)"
connectEnded(e: WuFlowConnectEndEvent): void { /* e.isValid */ }                                       // (connectEnd)
```

**Controlled changes** — `[applyChanges]="false"`: the flow only reports `(nodeChanges)`/`(edgeChanges)` (types `position`, `select`, `dimensions`, `remove`, `add`, `replace`); you build arrays with `applyNodeChanges(changes, nodes)` / `applyEdgeChanges(changes, edges)` (adjust, drop or record a change first). In two-way mode `(nodeChanges)` still streams every drag step while `[(nodes)]` updates at drag end.

**Selecting / deleting** — click; Shift/Ctrl/⌘+click multi; Shift+drag draws a box (or `[selectionOnDrag]="true"`, then pan with middle button or Space+drag); `selectionMode="partial"`; Delete/Backspace deletes, Ctrl+A selects all. `[beforeDelete]` is asked first: return `false` to cancel or the part to delete (Promise OK, e.g. confirm dialog).

**Groups / sub-flows** — `type: 'group'` node is a frame; a child sets `parentId` and its `position` counts from the frame corner (list the frame BEFORE its children). Dragging/deleting the frame moves/deletes children. `extent: 'parent'` keeps a child inside; `expandParent: true` grows the frame.

**Node toolbar / resizer** — inside a node template: `<wu-flow-node-toolbar position="top">…buttons…</wu-flow-node-toolbar>` (shown while this node is the only one selected) and `<wu-flow-node-resizer [minWidth]="140" [minHeight]="72">` (writes node `width`/`height`; Alt+arrows resize). Call `flow.updateNodeData()` / `deleteElements()` via a `#board` reference.

**Context menus** — `(nodeContextMenu)` `(edgeContextMenu)` `(paneContextMenu)` give `{ event, node|edge }`; open a `<wu-contextMenu>` with `menu.show($event.event)`. Pane: add a node at the click with `screenToFlowPosition()` + `addNodes()`. Keyboard: Menu key / Shift+F10.

**Viewport / drag-in palette** — `[(viewport)]` = `{ x, y, zoom }`; methods `fitView()`, `zoomTo()`, `zoomIn()`, `setCenter()`, `setViewport()` (`{ duration }` glides). Palette drop: `screenToFlowPosition()` then `addNodes()`. On narrow screens lower `minZoom` (say 0.3) so `fitView` can shrink wide diagrams.

**Layout** — `chart.layout({ direction: 'TB' | 'LR' | 'BT' | 'RL', algorithm?: 'tree', nodeSep, rankSep, fitView, duration })` (default layered algorithm; `'tree'` for org charts uses `levelSep`; built-in nodes turn their handles to match direction). Before showing (e.g. API data with no positions): `this.nodes = layoutFlow(nodes, edges, { direction: 'LR', nodeSep: 30, rankSep: 70 })` or `layoutTree(...)` from `@wirabyte/ui/flow`.

**Undo / redo** — put `wuFlowHistory` on `<wu-flow>`; each finished change is a step (select/measure not). Ctrl/⌘+Z, Ctrl/⌘+Shift+Z, Ctrl+Y while focused.
```html
<wu-flow wuFlowHistory #history="wuFlowHistory" [(nodes)]="nodes" [(edges)]="edges" style="height: 22rem">
  <wu-flow-panel position="top-right">
    <wu-button icon="wi wi-undo" ariaLabel="เลิกทำ" [disabled]="!history.canUndo" (onClick)="history.undo()"></wu-button>
    <wu-button icon="wi wi-redo" ariaLabel="ทำซ้ำ" [disabled]="!history.canRedo" (onClick)="history.redo()"></wu-button>
  </wu-flow-panel>
</wu-flow>
```

**Export** — `flow.toSvg({ title, background, padding, … })`: `string` (edges, markers, labels, each node a named box, current theme colours); `flow.toJSON()` → `{ nodes, edges, viewport }`; `flow.fromJSON(json)` (object or text; `false` if not a diagram). Helpers `flowToSvg()`, `flowToJSON()`, `flowFromJSON()` work without the component. Download: `new Blob([svg], { type: 'image/svg+xml' })` + `URL.createObjectURL()`.

**Big diagrams** — `[onlyRenderVisibleElements]="true"`; give never-drawn nodes `initialWidth`/`initialHeight` for `fitView` and export.

**Keyboard / touch / ARIA** — `role="application"` named by `ariaLabel`; nodes/edges are Tab stops named after `data.label` (or `ariaLabel`), actions announced via aria-live. Keys: Tab/Shift+Tab (nodes then edges); Enter/Space select; arrows move selection (Shift ×10; on empty pane: pan); Alt+arrows resize; Delete/Backspace; Ctrl/⌘+A; `C` → Tab → Enter connects from the focused node; Escape cancels. Touch: tap selects, hold adds, drag pans, two fingers zoom.

**Inputs · diagram** — `nodes`: `WuFlowNode[]` (two-way) · `edges`: `WuFlowEdge[]` (two-way) · `applyChanges`: `boolean` = `true` · `nodeTypes`: `Record<string, Type>` · `defaultEdgeOptions`: `Partial<WuFlowEdge>`
**Inputs · connecting** — `connectionMode`: `'strict' | 'loose'` = `'strict'` · `connectionLineType`: `string` = `'default'` (an edge type) · `connectionLineStyle`: `object` · `connectionRadius`: `number` = `20` · `isValidConnection`: `(connection: FlowConnection) => boolean` · `connectOnClick`: `boolean` = `true` · `autoConnect`: `boolean` = `false` · `reconnectRadius`: `number` = `10`
**Inputs · switches** — `nodesDraggable` · `nodesConnectable` · `nodesFocusable` · `edgesFocusable` · `edgesReconnectable` · `elementsSelectable` · `selectNodesOnDrag`: `boolean` = `true` (each node/edge may override) · `interactive`: `boolean` = `true` (two-way `[(interactive)]`; false locks drag/connect/select) · `elevateNodesOnSelect`: `boolean` = `true` · `elevateEdgesOnSelect`: `boolean` = `false` · `onlyRenderVisibleElements`: `boolean` = `false`
**Inputs · dragging** — `nodeDragThreshold`: `number` = `1` · `snapToGrid`: `boolean` = `false` · `snapGrid`: `[number, number]` = `[15, 15]` · `nodeExtent`: `[[minX, minY], [maxX, maxY]]` · `autoPanOnNodeDrag` · `autoPanOnConnect`: `boolean` = `true` · `autoPanSpeed`: `number` = `15` · `alignmentGuides`: `boolean` = `false` · `alignmentThreshold`: `number` = `6` · `keyboardStep`: `number` = `5`
**Inputs · viewport** — `viewport`: `FlowViewport` (two-way) · `defaultViewport`: `FlowViewport` (when `[(viewport)]` unbound) · `fitView`: `boolean` = `false` · `fitViewOptions`: `WuFlowFitViewOptions` · `minZoom` · `maxZoom`: `number` = `0.5` · `2` · `translateExtent` · `panOnDrag`: `boolean | number[]` = `true` · `panOnScroll`: `boolean` = `false` · `panOnScrollSpeed`: `number` = `0.5` · `panOnScrollMode`: `'free' | 'vertical' | 'horizontal'` = `'free'` · `zoomOnScroll` · `zoomOnPinch` · `zoomOnDoubleClick`: `boolean` = `true` · `preventScrolling`: `boolean` = `true` · `zoomStep`: `number` = `1.2`
**Inputs · selection and keys** — `selectionOnDrag`: `boolean` = `false` · `selectionMode`: `'full' | 'partial'` = `'full'` · `selectionKeyCode`: `string | string[] | null` = `'Shift'` · `multiSelectionKeyCode` = `['Shift', 'Control', 'Meta']` · `deleteKeyCode` = `['Backspace', 'Delete']` (null = off) · `panActivationKeyCode` = `'Space'` · `zoomActivationKeyCode` = `'Meta'` · `beforeDelete`: `(elements) => boolean | { nodes, edges } | Promise` · `ariaLabel`: `string` = locale · `styleClass`/`style`

**Outputs**
- `(nodesChange)` `(edgesChange)` `(viewportChange)` `(interactiveChange)` — two-way bindings
- `(nodeChanges)`: `FlowNodeChange[]` · `(edgeChanges)`: `FlowEdgeChange[]` — every change (each drag step)
- `(selectionChange)`: `{ nodes, edges }` · `(delete)`: `{ nodes, edges }`
- `(nodeClick)` `(nodeDoubleClick)` `(nodeContextMenu)` `(nodeMouseEnter)` `(nodeMouseLeave)`: `{ event, node }`
- `(nodeDragStart)` `(nodeDrag)` `(nodeDragStop)`: `{ event, node, nodes }` (nodes = all moving)
- `(edgeClick)` `(edgeDoubleClick)` `(edgeContextMenu)` `(edgeMouseEnter)` `(edgeMouseLeave)`: `{ event, edge }`
- `(paneClick)` `(paneContextMenu)`: `MouseEvent`
- `(moveStart)` `(move)` `(moveEnd)`: `{ event, viewport }`
- `(connect)`: `FlowConnection` `{ source, target, sourceHandle, targetHandle }` · `(connectStart)`: `{ event, nodeId, handleId, handleType }` · `(connectEnd)`: `{ event, connection, isValid }`
- `(reconnect)`: `{ edge, connection }` · `(reconnectStart)`: `{ event, edge, handleType }` · `(reconnectEnd)`: `{ event, edge, connection }`
- `(init)`: `WuFlow` (carries all methods) · `(nodesInitialized)`: `WuFlowNode[]` (all measured) · `(nodeComponentEvent)`: `{ node, name, value }`

**Methods** (via `#ref`, `@ViewChild(WuFlow)` or `(init)`)
- read: `getNodes()` `getEdges()` `getNode(id)` `getEdge(id)`
- write: `setNodes(nodes | fn)` `setEdges(edges | fn)` `addNodes(n)` `addEdges(e)`; `updateNode(id, update, { replace })` `updateNodeData(id, update)` `updateEdge(id, update)`; `deleteElements({ nodes, edges })`: `Promise<{ deletedNodes, deletedEdges }>` (children and connected edges too; `beforeDelete` asked)
- select: `select({ nodes, edges })` `selectAll()` `clearSelection()`
- geometry: `getIntersectingNodes(target, partially)` `isNodeIntersecting(target, area, partially)`
- view: `getViewport()` `getZoom()` `setViewport(viewport, { duration })` `zoomIn()` `zoomOut()` `zoomTo(zoom, { duration })` `fitView({ padding, nodes, minZoom, maxZoom, duration })` `fitBounds(rect, options)` `setCenter(x, y, { zoom, duration })` `panBy({ x, y })` (Promise<boolean> mostly)
- coordinates: `screenToFlowPosition({ x, y }, { snapToGrid })` `flowToScreenPosition({ x, y })`
- `layout({ direction, algorithm, nodeSep, rankSep, fitView, duration })`: `Promise<boolean>`; `toJSON()` `toObject()` `fromJSON(json)`: `boolean`; `toSvg({ title, background, padding, … })`: `string`; `setInteractive(on)`; `updateNodeInternals(ids)` (re-measure handles after a template changed)

**Child parts**
- `wu-flow-handle`: `type`: `'source' | 'target'` = `'source'` · `position`: `'top' | 'right' | 'bottom' | 'left'` = target `top`, source `bottom` · `id` · `handleId`: `string` · `isConnectable` · `isConnectableStart` · `isConnectableEnd`: `boolean` = `true` · `connectionLimit`: `number` · `styleClass`
- `wu-flow-background`: `variant`: `'dots' | 'lines' | 'cross' | 'image'` = `'dots'` (stack several) · `gap` · `size` · `lineWidth` · `offset`: `number | [x, y]` = `20` · `1`/`6` · `1` · `0` · `color` · `bgColor` · `src` `imageX` `imageY` `imageWidth` `imageHeight` `imageOpacity` (variant image: picture under diagram, e.g. floor plan)
- `wu-flow-controls`: `position`: `WuFlowPanelPosition` = `'bottom-left'` · `orientation`: `'vertical' | 'horizontal'` = `'vertical'` · `showZoom` · `showFitView` · `showInteractive`: `boolean` = `true` · `fitViewOptions` · `duration`: `number` = `200` · `(zoomInClick)` `(zoomOutClick)` `(fitViewClick)` `(interactiveChange)`
- `wu-flow-minimap`: `position` = `'bottom-right'` · `width` · `height`: `number` = `200` · `150` · `nodeColor` · `nodeStrokeColor` · `nodeClassName`: `string | (node) => string` · `nodeBorderRadius` · `nodeStrokeWidth` = `5` · `maskColor` · `maskStrokeColor` · `maskStrokeWidth` · `bgColor` · `pannable` = `true` · `zoomable` = `true` · `inversePan` = `false` · `offsetScale` = `5`
- `wu-flow-panel`: `position`: `'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center-left' | 'center-right'` = `'top-left'` — anything over the diagram (does not pan/zoom)
- `wu-flow-node-toolbar`: `isVisible`: `boolean` · `position`: `'top' | 'right' | 'bottom' | 'left'` = `'top'` · `align`: `'start' | 'center' | 'end'` = `'center'` · `offset`: `number` = `10` · `nodeId` · `ariaLabel` · `styleClass`
- `wu-flow-node-resizer`: `minWidth` · `minHeight` = `10` · `maxWidth` · `maxHeight` · `keepAspectRatio` = `false` · `isVisible` · `color` · `handleClass` · `lineClass` · `nodeId` · `(resizeStart)` `(resize)` `(resizeEnd)`: `{ event, x, y, width, height }`
- `wuFlowHistory` (directive on `wu-flow`): `historyLimit`: `number` = `100` · `historyKeyboard`: `boolean` = `true` · `(historyChange)`: `{ canUndo, canRedo }` · via `#h="wuFlowHistory"`: `canUndo` `canRedo` `undo()` `redo()` `clear()`

**Templates and contexts** (`WU_FLOW_NODE` = InjectionToken of the node context, for components in `nodeTypes`)
- `wuFlowNode="type" let-node` → `WuFlowNodeContext`: `node`, `id`, `type`, `data`, `selected`, `dragging`, `isConnectable`, `positionAbsoluteX/Y` (in flow, parent included), `width`/`height` (measured, 0 until then), `zIndex`, `sourcePosition`/`targetPosition` (`'top'|'right'|'bottom'|'left'`), `parentId`
- `wuFlowEdge="type"` / `wuFlowEdgeLabel="type"` `let-edge` → `WuFlowEdgeContext`: `edge`, `id`, `type`, `data`, `path` (for `<svg:path [attr.d]="edge.path">`), `labelX`, `labelY`, `sourceX/Y`, `targetX/Y`, `selected`, `animated`, `label`, `markerStart`/`markerEnd` (`url(#…)` or null)
- `wuFlowConnectionLine let-line` → `{ path, fromX, fromY, toX, toY, valid: boolean | null, fromNodeId, fromHandleId }`

**Helpers** (from `@wirabyte/ui/flow`): `applyNodeChanges` · `applyEdgeChanges` · `addEdge(edgeOrConnection, edges, defaults)` (no duplicates, sets id) · `reconnectEdge(oldEdge, connection, edges)` · `getIncomers` · `getOutgoers` · `getConnectedEdges(nodes, edges)` · `getNodesBounds` · `getNodesInside(nodes, rect)` · `getIntersectingNodes(target, nodes)` · `getViewportForBounds(bounds, width, height, minZoom, maxZoom, padding)` · `getBezierPath` `getSmoothStepPath` `getStepPath` `getStraightPath` `getSimpleBezierPath` `getEdgePath(type, p)` → `[path, labelX, labelY, offsetX, offsetY]` · `getEdgeCenter` · `layoutFlow` · `layoutTree` · `flowToJSON` · `flowFromJSON` · `flowToSvg` · `new FlowHistory({ limit })` · `flowHistoryKey(event)` · `isNode` · `isEdge`

**Types**
```ts
interface WuFlowNode<T = any> {
  id: string; position: { x: number; y: number };   // from parent frame if parentId
  data?: T;                                          // built-in nodes show data.label
  type?: string;                                     // 'default' | 'input' | 'output' | 'group' | your template name
  width?: number; height?: number;                   // resizer writes these
  initialWidth?: number; initialHeight?: number;     // size used before measured
  selected?: boolean; draggable?: boolean; selectable?: boolean; connectable?: boolean; deletable?: boolean; focusable?: boolean; hidden?: boolean;
  zIndex?: number; parentId?: string; extent?: 'parent' | [[number, number], [number, number]]; expandParent?: boolean;
  sourcePosition?: 'top' | 'right' | 'bottom' | 'left'; targetPosition?: 'top' | 'right' | 'bottom' | 'left';
  className?: string; style?: Record<string, any>; ariaLabel?: string;
  dragHandle?: string;                               // selector of the grip, e.g. '.grip'
}
interface WuFlowEdge<T = any> {
  id: string; source: string; target: string; sourceHandle?: string | null; targetHandle?: string | null;
  type?: string;                                     // 'default' | 'smoothstep' | 'step' | 'straight' | 'simplebezier' | template name
  data?: T; label?: string; labelStyle?: Record<string, any>; labelShowBg?: boolean; labelBgStyle?: Record<string, any>; labelBgPadding?: [number, number]; labelBgBorderRadius?: number;
  animated?: boolean; hidden?: boolean; selected?: boolean; selectable?: boolean; deletable?: boolean; focusable?: boolean;
  reconnectable?: boolean | 'source' | 'target';
  markerStart?: 'arrow' | 'arrowclosed' | { type: 'arrow' | 'arrowclosed'; color?: string; width?: number; height?: number; strokeWidth?: number };
  markerEnd?: /* same as markerStart */;
  style?: Record<string, any>; className?: string; interactionWidth?: number /* 20 */; zIndex?: number; ariaLabel?: string;
  pathOptions?: { curvature?: number; borderRadius?: number; offset?: number };
}
```

**Tokens** (all `--wu-flow-…`; shorthand `{a,b}` = several names) — `bg`, `border-width`, `border-color`, `radius`, `min-height` (20rem), `focus-ring`, `grid-dot-color`, `grid-line-color`; node: `node-{bg,color,border-color,border-width,radius,shadow,padding,width (10rem),font-size,hover-border-color,selected-border-color,selected-ring,dragging-shadow,focus-outline}`; group: `group-{bg,border-color,label-color}`; handle: `handle-{size,bg,border,border-width,hover-bg,valid-bg,invalid-bg,hit,hit-coarse}`; edge: `edge-{color,width,hover-color,selected-color,selected-width,animated-dash,animated-duration,focus-color,updater-bg}`, `edge-label-{bg,color,border,padding,radius,font-size,max-width}`; `connection-{color,width}`; `selection-{bg,border}`; `guide-color`; `panel-margin`; controls: `controls-{bg,color,border,radius,shadow,button-size,button-size-coarse,hover-bg,disabled-opacity}`; minimap: `minimap-{bg,border,radius,shadow,node-bg,node-selected-bg,group-bg,mask,mask-stroke}`; node toolbar: `toolbar-{bg,border,radius,shadow,padding,gap,offset (10px)}`; resizer: `resizer-{color,handle-bg,handle-size}`

**Gotchas**
- Set a height on `<wu-flow>` (`style="height: 24rem"`); without one it is only `20rem` (`--wu-flow-min-height`).
- Flow templates (`wuFlowNode`, `wuFlowEdge`, `wuFlowEdgeLabel`, `wuFlowConnectionLine`) are the same in every major (own structural directives, not `#name` slots); only NgModule apps get `wuTemplate` via `WuFlowModule`.
- `[isValidConnection]` and `[beforeDelete]` take functions: bind a stable reference (`fn = this.fn.bind(this)`), not an inline arrow.
- Group frames must come before their children in `nodes`; child `position` is relative to the frame.
- With `[autoConnect]="false"` (default) a drag-connection does nothing unless you handle `(connect)` and `addEdge()` (or use two-way `[(edges)]` with `autoConnect`).
- Nodes without a template or `nodeTypes` entry fall back to the built-in box showing `data.label`; custom handles are yours to place with `<wu-flow-handle>`.
- Coming from ngx-vflow: `point` becomes `position`, node text moves into `data`.

---
