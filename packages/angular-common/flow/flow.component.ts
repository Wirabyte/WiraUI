import { DOCUMENT, isPlatformBrowser, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Injector,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  QueryList,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵtoBool, ɵuniqueId, ɵWU_SKIP_VERSION_CHECK, WuConfig, WuTemplate } from '@wirabyte/ui/config';
import {
  absolutePositions,
  alignmentGuides,
  applyEdgeChanges,
  applyNodeChanges,
  arrowStep,
  autoPanVelocity,
  boxSelection,
  clampZoom,
  clickSelection,
  computeNodeZ,
  constrainViewport,
  diffItems,
  dragPositions,
  dragRoots,
  easeInOutCubic,
  edgeZIndex,
  FLOW_EDGE_TYPES,
  FLOW_MARKER_REF,
  FLOW_MARKER_VIEWBOX,
  flowEdgeName,
  flowFormat,
  flowFromJSON,
  flowNodeName,
  flowText,
  flowToJSON,
  flowToScreen,
  flowToSvg,
  getDescendants,
  getEdgeEnds,
  getEdgePath,
  getEdgePathWithRoom,
  getElementsToRemove,
  getIntersectingNodes,
  getViewportForBounds,
  getVisibleNodeIds,
  handleIsFull,
  handlesCompatible,
  interpolateViewport,
  isEdgeVisible,
  isFlowPosition,
  isTypingTarget,
  keyMatches,
  layoutFlow,
  layoutTree,
  markerLength,
  markerShape,
  multiKeyHeld,
  nearestHandle,
  nodeLookup,
  normalizeExtent,
  normalizeMarker,
  normalizeViewport,
  oppositePosition,
  panBy,
  parentGrowth,
  pastThreshold,
  rectFromPoints,
  rectsIntersect,
  addEdge,
  reconnectEdge,
  resizeBox,
  sameViewport,
  screenToFlow,
  selectionChanges,
  sidePoint,
  snapPosition,
  sortNodesParentsFirst,
  validConnection,
  viewportForCenter,
  viewRect,
  wheelDeltaPx,
  wheelZoomFactor,
  zoomAt,
} from '@wirabyte/ui/core';
import type {
  FlowConnection,
  FlowConnectionMode,
  FlowCoordinateExtent,
  FlowDimensions,
  FlowDragItem,
  FlowDragResult,
  FlowEdge,
  FlowEdgeChange,
  FlowGuide,
  FlowHandleBounds,
  FlowHandleType,
  FlowJSON,
  FlowLayoutOptions,
  FlowNode,
  FlowNodeChange,
  FlowPosition,
  FlowRect,
  FlowResizeLimits,
  FlowStyle,
  FlowSvgOptions,
  FlowTextKey,
  FlowTreeLayoutOptions,
  FlowViewport,
  FlowXY,
} from '@wirabyte/ui/core';
import { WuFlowHandle } from './flow-handle.component';
import { ɵWuFlowChange, ɵWuFlowHost, ɵWuFlowNodeBox } from './flow-host';
import { ɵWuFlowNodeComponentOutlet, ɵWuFlowNodeRegistry, ɵWuFlowNodeWrapper } from './flow-node-outlet';
import { WuFlowConnectionLineTemplate, WuFlowEdgeLabelTemplate, WuFlowEdgeTemplate, WuFlowNodeTemplate } from './flow-templates';
import {
  WU_FLOW_NODE,
  WuFlowApi,
  WuFlowBeforeDelete,
  WuFlowConnectEndEvent,
  WuFlowConnectionLineContext,
  WuFlowConnectStartEvent,
  WuFlowDeleteEvent,
  WuFlowEdgeContext,
  WuFlowEdgeEvent,
  WuFlowFitBoundsOptions,
  WuFlowFitViewOptions,
  WuFlowMoveEvent,
  WuFlowNodeComponentEvent,
  WuFlowNodeContext,
  WuFlowNodeDragEvent,
  WuFlowNodeEvent,
  WuFlowNodeRect,
  WuFlowReconnectEndEvent,
  WuFlowReconnectEvent,
  WuFlowReconnectStartEvent,
  WuFlowSelectionChange,
  WuFlowSetCenterOptions,
  WuFlowViewportOptions,
} from './flow.types';

// ---------- what the template draws ----------

/** A node as drawn. One object per node id, kept across renders (so its template context and injector stay put). */
export interface ɵWuFlowNodeView {
  id: string;
  node: FlowNode;
  type: string;
  /** Absolute position and the size used for geometry. */
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  transform: string;
  classes: string;
  styleWidth: number | null;
  styleHeight: number | null;
  style: FlowStyle | null;
  ariaLabel: string;
  label: string;
  draggable: boolean;
  selectable: boolean;
  connectable: boolean;
  focusable: boolean;
  render: 'template' | 'component' | 'builtin';
  template: TemplateRef<unknown> | null;
  component: Type<unknown> | null;
  hasSource: boolean;
  hasTarget: boolean;
  sourcePosition: FlowPosition;
  targetPosition: FlowPosition;
  ctx: WuFlowNodeContext;
  injector: Injector;
}

/** An edge as drawn. */
export interface ɵWuFlowEdgeView {
  id: string;
  edge: FlowEdge;
  type: string;
  path: string;
  labelX: number;
  labelY: number;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  z: number;
  classes: string;
  style: FlowStyle | null;
  markerStart: string | null;
  markerEnd: string | null;
  focusable: boolean;
  selectable: boolean;
  updateSource: boolean;
  updateTarget: boolean;
  interactionWidth: number;
  label: string;
  hasLabel: boolean;
  labelClasses: string;
  labelTransform: string;
  labelStyle: FlowStyle | null;
  labelBoxStyle: FlowStyle | null;
  ariaLabel: string;
  template: TemplateRef<unknown> | null;
  labelTemplate: TemplateRef<unknown> | null;
  ctx: WuFlowEdgeContext;
}

export interface ɵWuFlowEdgeLayer {
  z: number;
  edges: ɵWuFlowEdgeView[];
}

export interface ɵWuFlowMarkerView {
  id: string;
  shape: string;
  width: number;
  height: number;
  className: string;
  fill: string | null;
  stroke: string | null;
  strokeWidth: number;
}

export interface ɵWuFlowConnectionView {
  path: string;
  valid: boolean | null;
  ctx: WuFlowConnectionLineContext;
}

/** `layout()`: `algorithm: 'tree'` for org charts, otherwise layered; `fitView` afterwards unless false. */
export interface WuFlowLayoutOptions extends FlowLayoutOptions, Omit<FlowTreeLayoutOptions, 'nodeSep'> {
  algorithm?: 'layered' | 'tree';
  fitView?: boolean;
  duration?: number;
  padding?: number | string;
}

/** A handle as the connection logic sees it, with where it is in flow coordinates. */
interface HandleInfo {
  nodeId: string;
  id: string | null;
  type: FlowHandleType;
  position: FlowPosition;
  /** Centre (for snapping) and the point an edge meets it. */
  x: number;
  y: number;
  point: FlowXY;
  connectable: boolean;
  connectableStart: boolean;
  connectableEnd: boolean;
  limit: number | null;
  /** No real handle: a drop on a node without handles of that kind. */
  virtual: boolean;
}

/** Handles as measured, with the switches read from their elements. */
interface MeasuredHandle extends FlowHandleBounds {
  connectable: boolean;
  start: boolean;
  end: boolean;
  limit: number | null;
}

interface MeasuredHandles {
  source: MeasuredHandle[];
  target: MeasuredHandle[];
}

interface BaseGesture {
  pointerId: number;
  pointerType: string;
  startClient: FlowXY;
  lastClient: FlowXY;
  event: PointerEvent;
}
interface PendingNodeGesture extends BaseGesture {
  kind: 'node';
  nodeId: string;
  multi: boolean;
  longPressed: boolean;
  /** The press was inside the node's drag handle (or the node has none). */
  canDrag: boolean;
}
interface DragGesture extends BaseGesture {
  kind: 'drag';
  items: FlowDragItem[];
  primaryId: string;
  startFlow: FlowXY;
  current: Map<string, FlowDragResult>;
}
interface PanGesture extends BaseGesture {
  kind: 'pan';
  startVp: FlowViewport;
}
interface SelectGesture extends BaseGesture {
  kind: 'select';
  startPane: FlowXY;
  keep: string[];
}
interface ConnectGesture extends BaseGesture {
  kind: 'connect';
  from: HandleInfo;
  moved: boolean;
  target: HandleInfo | null;
  connection: FlowConnection | null;
  candidates: HandleInfo[];
  reconnect: { edge: FlowEdge; end: 'source' | 'target' } | null;
}
interface ClickGesture extends BaseGesture {
  kind: 'click';
  on: 'pane' | 'edge';
  edgeId: string | null;
  multi: boolean;
  longPressed: boolean;
}
interface PinchGesture {
  kind: 'pinch';
  startDist: number;
  startMid: FlowXY;
  startVp: FlowViewport;
}
type Gesture = PendingNodeGesture | DragGesture | PanGesture | SelectGesture | ConnectGesture | ClickGesture | PinchGesture;

const BUILTIN_NODES = new Set(['default', 'input', 'output', 'group']);
const BUILTIN_EDGES = new Set(FLOW_EDGE_TYPES);
/** Pressing these inside a node does not start a drag. */
const NO_DRAG = 'input, textarea, select, button, a[href], [contenteditable=""], [contenteditable="true"], .nodrag, .wu-flow-nodrag';
const LONG_PRESS_MS = 500;
const WHEEL_END_MS = 150;

const bool = (v: unknown, fallback: boolean) => (v === undefined || v === null ? fallback : ɵtoBool(v));
const num = (v: unknown, fallback: number) => {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  return typeof n === 'number' && isFinite(n) ? n : fallback;
};
const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const safeClass = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '-');
const isObserved = (e: EventEmitter<unknown>): boolean => {
  const s = e as unknown as { observed?: boolean; observers?: unknown[] };
  return typeof s.observed === 'boolean' ? s.observed : !!(s.observers && s.observers.length);
};

/**
 * A node-based diagram editor: `<wu-flow [(nodes)]="nodes" [(edges)]="edges" [fitView]="true">` with
 * `<ng-template wuFlowNode="person" let-node>` templates (or the built-in `default` / `input` / `output` / `group`
 * nodes), `<wu-flow-handle>`s where edges attach, and add-ons inside: `<wu-flow-background>`, `<wu-flow-minimap>`,
 * `<wu-flow-controls>`, `<wu-flow-panel>`.
 *
 * Drag nodes (several when selected; snapping, extents, sub-flows, auto-pan near the border), drag from a handle to
 * connect (or click two handles), drag an edge's end to reconnect it, pan by dragging the pane, zoom with the wheel,
 * a pinch or a double click, Shift + drag (or `selectionOnDrag`) for a selection box. Keyboard: Tab between nodes and
 * edges, Enter / Space selects, arrows move the selection (Shift = ×10, Alt resizes a node with a resizer), Delete
 * removes, C starts a connection from the focused node, Ctrl + A selects all, + / − zoom, arrows on the pane pan,
 * Escape cancels.
 *
 * With `[(nodes)]` / `[(edges)]` the flow applies every change itself and hands back new arrays (a drag reports once it
 * ends; `(nodeChanges)` streams every step). With `[applyChanges]="false"` it only reports `(nodeChanges)` /
 * `(edgeChanges)` and the app applies them (`applyNodeChanges()`), as in the React flow libraries.
 */
@Component({
  selector: 'wu-flow',
  standalone: true,
  imports: [NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet, WuFlowHandle, ɵWuFlowNodeWrapper, ɵWuFlowNodeComponentOutlet],
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: ɵWuFlowHost, useExisting: forwardRef(() => WuFlow) },
    { provide: ɵWuFlowNodeRegistry, useExisting: forwardRef(() => WuFlow) },
  ],
})
export class WuFlow implements WuFlowApi, ɵWuFlowHost, ɵWuFlowNodeRegistry, OnChanges, AfterContentInit, AfterViewInit, OnDestroy {
  // ---------- the diagram ----------

  /** Two-way: `[(nodes)]`. */
  @Input() nodes: FlowNode[] | null | undefined;
  /** Two-way: `[(edges)]`. */
  @Input() edges: FlowEdge[] | null | undefined;
  /** Apply changes and hand back new arrays (default true); false only reports `(nodeChanges)` / `(edgeChanges)`. */
  @Input() set applyChanges(v: unknown) {
    this._apply = bool(v, true);
  }
  get applyChanges(): boolean {
    return this._apply;
  }
  /** Components that draw node types: `{ machine: MachineNodeComponent }` (a `wuFlowNode` template wins). */
  @Input() nodeTypes: Record<string, Type<unknown>> | null | undefined;
  /** Settings every edge starts from (`type`, `animated`, `markerEnd` …); new connections get them too. */
  @Input() defaultEdgeOptions: Partial<FlowEdge> | null | undefined;

  // ---------- connecting ----------

  /** `strict` (source to target, the default) or `loose` (any handle to any other). */
  @Input() connectionMode: FlowConnectionMode = 'strict';
  /** Shape of the line while connecting. Default `'default'` (bezier). */
  @Input() connectionLineType: string = 'default';
  @Input() connectionLineStyle: FlowStyle | null | undefined;
  /** How close (screen px) the pointer must come to a handle to snap to it. Default 20. */
  @Input() connectionRadius: number | string = 20;
  /** The app's rule for which connections are allowed. */
  @Input() isValidConnection: ((connection: FlowConnection) => boolean) | null | undefined;
  /** Click a handle, then another, to connect. Default true. */
  @Input() set connectOnClick(v: unknown) {
    this._clickConnect = bool(v, true);
  }
  get connectOnClick(): boolean {
    return this._clickConnect;
  }
  /** Add the edge for a new connection (and move it on reconnect) without the app doing it. Default false. */
  @Input() set autoConnect(v: unknown) {
    this._autoConnect = bool(v, false);
  }
  get autoConnect(): boolean {
    return this._autoConnect;
  }
  /** Size of the circles at an edge's ends that reconnect it. Default 10. */
  @Input() reconnectRadius: number | string = 10;

  // ---------- switches ----------

  @Input() set nodesDraggable(v: unknown) {
    this._draggable = bool(v, true);
  }
  get nodesDraggable(): boolean {
    return this._draggable;
  }
  @Input() set nodesConnectable(v: unknown) {
    this._connectable = bool(v, true);
  }
  get nodesConnectable(): boolean {
    return this._connectable;
  }
  @Input() set nodesFocusable(v: unknown) {
    this._nodesFocusable = bool(v, true);
  }
  get nodesFocusable(): boolean {
    return this._nodesFocusable;
  }
  @Input() set edgesFocusable(v: unknown) {
    this._edgesFocusable = bool(v, true);
  }
  get edgesFocusable(): boolean {
    return this._edgesFocusable;
  }
  @Input() set elementsSelectable(v: unknown) {
    this._selectable = bool(v, true);
  }
  get elementsSelectable(): boolean {
    return this._selectable;
  }
  @Input() set edgesReconnectable(v: unknown) {
    this._reconnectable = bool(v, true);
  }
  get edgesReconnectable(): boolean {
    return this._reconnectable;
  }
  /** Dragging an unselected node selects it. Default true. */
  @Input() set selectNodesOnDrag(v: unknown) {
    this._selectOnDrag = bool(v, true);
  }
  get selectNodesOnDrag(): boolean {
    return this._selectOnDrag;
  }
  /** Two-way: `[(interactive)]`; false locks dragging, connecting and selecting (the controls' lock button). */
  @Input() set interactive(v: unknown) {
    this._interactive = bool(v, true);
  }
  get interactive(): boolean {
    return this._interactive;
  }
  /** Raise selected nodes above the rest. Default true. */
  @Input() set elevateNodesOnSelect(v: unknown) {
    this._elevateNodes = bool(v, true);
  }
  get elevateNodesOnSelect(): boolean {
    return this._elevateNodes;
  }
  @Input() set elevateEdgesOnSelect(v: unknown) {
    this._elevateEdges = bool(v, false);
  }
  get elevateEdgesOnSelect(): boolean {
    return this._elevateEdges;
  }
  /** Only draw nodes and edges near the view (big diagrams). Default false. */
  @Input() set onlyRenderVisibleElements(v: unknown) {
    this._onlyVisible = bool(v, false);
  }
  get onlyRenderVisibleElements(): boolean {
    return this._onlyVisible;
  }

  // ---------- dragging ----------

  /** Pixels the pointer must move before a press becomes a drag. Default 1. */
  @Input() nodeDragThreshold: number | string = 1;
  @Input() set snapToGrid(v: unknown) {
    this._snap = bool(v, false);
  }
  get snapToGrid(): boolean {
    return this._snap;
  }
  /** Default `[15, 15]`. */
  @Input() snapGrid: [number, number] = [15, 15];
  /** Where nodes may be dragged, in flow coordinates. */
  @Input() nodeExtent: FlowCoordinateExtent | null | undefined;
  /** Pan the view when a drag nears the border. Default true. */
  @Input() set autoPanOnNodeDrag(v: unknown) {
    this._autoPanDrag = bool(v, true);
  }
  get autoPanOnNodeDrag(): boolean {
    return this._autoPanDrag;
  }
  @Input() set autoPanOnConnect(v: unknown) {
    this._autoPanConnect = bool(v, true);
  }
  get autoPanOnConnect(): boolean {
    return this._autoPanConnect;
  }
  /** Most px per frame the auto-pan moves. Default 15. */
  @Input() autoPanSpeed: number | string = 15;
  /** Guide lines and snapping to other nodes' edges and centres while dragging one node. Default false. */
  @Input() set alignmentGuides(v: unknown) {
    this._guides = bool(v, false);
  }
  get alignmentGuides(): boolean {
    return this._guides;
  }
  /** How close (screen px) an edge must be to snap to a guide. Default 6. */
  @Input() alignmentThreshold: number | string = 6;
  /** Flow units an arrow key moves the selection (the grid step when snapping). Default 5. */
  @Input() keyboardStep: number | string = 5;

  // ---------- viewport ----------

  @Input() minZoom: number | string = 0.5;
  @Input() maxZoom: number | string = 2;
  /** The view can not be panned outside this, in flow coordinates. */
  @Input() translateExtent: FlowCoordinateExtent | null | undefined;
  /** Starting view when `[(viewport)]` is not bound. */
  @Input() defaultViewport: FlowViewport | null | undefined;
  /** Two-way: `[(viewport)]`. */
  @Input() viewport: FlowViewport | null | undefined;
  /** Fit the nodes into view once they are measured. Default false. */
  @Input('fitView') set fitViewOnInit(v: unknown) {
    this._fitOnInit = bool(v, false);
  }
  get fitViewOnInit(): boolean {
    return this._fitOnInit;
  }
  @Input() fitViewOptions: WuFlowFitViewOptions | null | undefined;
  /** Drag the pane to pan: true (left and middle button), false, or the mouse buttons to use (`[1, 2]`). */
  @Input() panOnDrag: boolean | number[] | string = true;
  /** The wheel pans instead of zooming (Ctrl / ⌘ + wheel still zooms). Default false. */
  @Input() set panOnScroll(v: unknown) {
    this._panOnScroll = bool(v, false);
  }
  get panOnScroll(): boolean {
    return this._panOnScroll;
  }
  @Input() panOnScrollSpeed: number | string = 0.5;
  @Input() panOnScrollMode: 'free' | 'vertical' | 'horizontal' = 'free';
  @Input() set zoomOnScroll(v: unknown) {
    this._zoomOnScroll = bool(v, true);
  }
  get zoomOnScroll(): boolean {
    return this._zoomOnScroll;
  }
  @Input() set zoomOnPinch(v: unknown) {
    this._zoomOnPinch = bool(v, true);
  }
  get zoomOnPinch(): boolean {
    return this._zoomOnPinch;
  }
  @Input() set zoomOnDoubleClick(v: unknown) {
    this._zoomOnDouble = bool(v, true);
  }
  get zoomOnDoubleClick(): boolean {
    return this._zoomOnDouble;
  }
  /** Keep the wheel from scrolling the page while over the flow. Default true. */
  @Input() set preventScrolling(v: unknown) {
    this._preventScroll = bool(v, true);
  }
  get preventScrolling(): boolean {
    return this._preventScroll;
  }
  /** Zoom factor of the zoom buttons and keys. Default 1.2. */
  @Input() zoomStep: number | string = 1.2;

  // ---------- selection and keys ----------

  /** Dragging the pane draws a selection box (pan with the middle button or Space + drag). Default false. */
  @Input() set selectionOnDrag(v: unknown) {
    this._selectionOnDrag = bool(v, false);
  }
  get selectionOnDrag(): boolean {
    return this._selectionOnDrag;
  }
  /** `'full'`: the box must cover a node (default); `'partial'`: touching it is enough. */
  @Input() selectionMode: 'full' | 'partial' = 'full';
  /** Held while dragging the pane to draw a selection box. Default `'Shift'`. */
  @Input() selectionKeyCode: string | string[] | null = 'Shift';
  /** Held while clicking to add to / take from the selection. Default Shift, Ctrl and ⌘. */
  @Input() multiSelectionKeyCode: string | string[] | null = ['Shift', 'Control', 'Meta'];
  /** Keys that delete the selection; null turns deleting by key off. */
  @Input() deleteKeyCode: string | string[] | null = ['Backspace', 'Delete'];
  /** Held to pan by dragging even in `selectionOnDrag` mode. Default Space. */
  @Input() panActivationKeyCode: string | string[] | null = 'Space';
  /** Held to zoom with the wheel when `panOnScroll` or `zoomOnScroll` say otherwise. Default ⌘ (Ctrl is a pinch). */
  @Input() zoomActivationKeyCode: string | string[] | null = 'Meta';
  /** Asked before deleting: return false, or the subset to delete (may be async). */
  @Input() beforeDelete: WuFlowBeforeDelete | null | undefined;

  // ---------- look ----------

  @Input() ariaLabel: string | null | undefined;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  // ---------- outputs ----------

  @Output() readonly nodesChange = new EventEmitter<FlowNode[]>();
  @Output() readonly edgesChange = new EventEmitter<FlowEdge[]>();
  @Output() readonly nodeChanges = new EventEmitter<FlowNodeChange[]>();
  @Output() readonly edgeChanges = new EventEmitter<FlowEdgeChange[]>();
  @Output() readonly viewportChange = new EventEmitter<FlowViewport>();
  @Output() readonly interactiveChange = new EventEmitter<boolean>();
  @Output() readonly selectionChange = new EventEmitter<WuFlowSelectionChange>();
  @Output() readonly nodeClick = new EventEmitter<WuFlowNodeEvent>();
  @Output() readonly nodeDoubleClick = new EventEmitter<WuFlowNodeEvent>();
  @Output() readonly nodeContextMenu = new EventEmitter<WuFlowNodeEvent>();
  @Output() readonly nodeMouseEnter = new EventEmitter<WuFlowNodeEvent>();
  @Output() readonly nodeMouseLeave = new EventEmitter<WuFlowNodeEvent>();
  @Output() readonly nodeDragStart = new EventEmitter<WuFlowNodeDragEvent>();
  @Output() readonly nodeDrag = new EventEmitter<WuFlowNodeDragEvent>();
  @Output() readonly nodeDragStop = new EventEmitter<WuFlowNodeDragEvent>();
  @Output() readonly edgeClick = new EventEmitter<WuFlowEdgeEvent>();
  @Output() readonly edgeDoubleClick = new EventEmitter<WuFlowEdgeEvent>();
  @Output() readonly edgeContextMenu = new EventEmitter<WuFlowEdgeEvent>();
  @Output() readonly edgeMouseEnter = new EventEmitter<WuFlowEdgeEvent>();
  @Output() readonly edgeMouseLeave = new EventEmitter<WuFlowEdgeEvent>();
  @Output() readonly paneClick = new EventEmitter<MouseEvent>();
  @Output() readonly paneContextMenu = new EventEmitter<MouseEvent>();
  @Output() readonly moveStart = new EventEmitter<WuFlowMoveEvent>();
  @Output() readonly move = new EventEmitter<WuFlowMoveEvent>();
  @Output() readonly moveEnd = new EventEmitter<WuFlowMoveEvent>();
  @Output() readonly connect = new EventEmitter<FlowConnection>();
  @Output() readonly connectStart = new EventEmitter<WuFlowConnectStartEvent>();
  @Output() readonly connectEnd = new EventEmitter<WuFlowConnectEndEvent>();
  @Output() readonly reconnect = new EventEmitter<WuFlowReconnectEvent>();
  @Output() readonly reconnectStart = new EventEmitter<WuFlowReconnectStartEvent>();
  @Output() readonly reconnectEnd = new EventEmitter<WuFlowReconnectEndEvent>();
  /** The flow is ready; carries the flow itself (its methods are the API). */
  @Output() readonly init = new EventEmitter<WuFlow>();
  /** Every node has been measured once. */
  @Output() readonly nodesInitialized = new EventEmitter<FlowNode[]>();
  @Output() readonly delete = new EventEmitter<WuFlowDeleteEvent>();
  @Output() readonly nodeComponentEvent = new EventEmitter<WuFlowNodeComponentEvent>();

  // ---------- templates ----------

  @ContentChildren(WuFlowNodeTemplate, { descendants: true }) protected nodeTemplates?: QueryList<WuFlowNodeTemplate>;
  @ContentChildren(WuFlowEdgeTemplate, { descendants: true }) protected edgeTemplates?: QueryList<WuFlowEdgeTemplate>;
  @ContentChildren(WuFlowEdgeLabelTemplate, { descendants: true }) protected labelTemplates?: QueryList<WuFlowEdgeLabelTemplate>;
  @ContentChildren(WuFlowConnectionLineTemplate, { descendants: true }) protected lineTemplates?: QueryList<WuFlowConnectionLineTemplate>;
  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('node', { descendants: false }) protected nodeRef?: unknown;
  @ContentChild('edge', { descendants: false }) protected edgeRef?: unknown;
  @ContentChild('edgeLabel', { descendants: false }) protected edgeLabelRef?: unknown;
  @ContentChild('connectionLine', { descendants: false }) protected connectionLineRef?: unknown;
  @ViewChild('root') protected rootRef?: ElementRef<HTMLElement>;
  @ViewChild('pane') protected paneRef?: ElementRef<HTMLElement>;
  @ViewChild('viewportEl') protected viewportRef?: ElementRef<HTMLElement>;
  @ViewChild('live') protected liveRef?: ElementRef<HTMLElement>;

  // ---------- what the template reads ----------

  readonly flowId = ɵuniqueId('wu-flow');
  readonly paneHintId = this.flowId + '-pane-hint';
  readonly nodeHintId = this.flowId + '-node-hint';
  readonly edgeHintId = this.flowId + '-edge-hint';
  readonly markerViewBox = FLOW_MARKER_VIEWBOX;
  readonly markerRef = FLOW_MARKER_REF;
  renderedNodes: ɵWuFlowNodeView[] = [];
  edgeLayers: ɵWuFlowEdgeLayer[] = [];
  labelEdges: ɵWuFlowEdgeView[] = [];
  markers: ɵWuFlowMarkerView[] = [];
  connectionLine: ɵWuFlowConnectionView | null = null;
  guides: FlowGuide[] = [];
  selectionRect: FlowRect | null = null;
  connectionLineTemplate: TemplateRef<unknown> | null = null;

  // ---------- state ----------

  private _apply = true;
  private _clickConnect = true;
  private _autoConnect = false;
  private _draggable = true;
  private _connectable = true;
  private _nodesFocusable = true;
  private _edgesFocusable = true;
  private _selectable = true;
  private _reconnectable = true;
  private _selectOnDrag = true;
  private _interactive = true;
  private _elevateNodes = true;
  private _elevateEdges = false;
  private _onlyVisible = false;
  private _snap = false;
  private _autoPanDrag = true;
  private _autoPanConnect = true;
  private _guides = false;
  private _fitOnInit = false;
  private _panOnScroll = false;
  private _zoomOnScroll = true;
  private _zoomOnPinch = true;
  private _zoomOnDouble = true;
  private _preventScroll = true;
  private _selectionOnDrag = false;

  private _nodes: FlowNode[] = [];
  private _edges: FlowEdge[] = [];
  private shadowNodes: FlowNode[] | null = null;
  private shadowEdges: FlowEdge[] | null = null;
  private vp: FlowViewport = { x: 0, y: 0, zoom: 1 };
  private paneW = 0;
  private paneH = 0;
  private readonly sizes = new Map<string, FlowDimensions>();
  private readonly handles = new Map<string, MeasuredHandles>();
  private readonly nodeEls = new Map<string, HTMLElement>();
  private readonly pendingHandles = new Set<string>();
  private readonly resizers = new Map<string, () => FlowResizeLimits>();
  private views = new Map<string, ɵWuFlowNodeView>();
  private edgeViews = new Map<string, ɵWuFlowEdgeView>();
  private lookup = new Map<string, FlowNode>();
  private dirty = true;
  private nodesToEmit = false;
  private edgesToEmit = false;
  private selectionKey = '';
  private readonly changeSet = new Set<ɵWuFlowChange>();
  private readonly listeners = new Set<(changes: ReadonlySet<ɵWuFlowChange>) => void>();
  private readonly commitListeners = new Set<(external: boolean) => void>();
  private gesture: Gesture | null = null;
  private readonly pointers = new Map<number, FlowXY>();
  private paneRect: DOMRect | null = null;
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private wheelTimer: ReturnType<typeof setTimeout> | null = null;
  private moving = false;
  private anim: { frame: number; resolve: (done: boolean) => void } | null = null;
  private frame = 0;
  private autoPanFrame = 0;
  private clickFrom: HandleInfo | null = null;
  private keyboardFrom: HandleInfo | null = null;
  private highlighted: Element | null = null;
  private hoverNode: string | null = null;
  private hoverEdge: string | null = null;
  private focusedNodeId: string | null = null;
  private lastPointerDown = 0;
  private panKeyHeld = false;
  private viewInit = false;
  private initialFitDone = false;
  private nodesInitDone = false;
  private pendingFits: { options: WuFlowFitViewOptions; resolve: (ok: boolean) => void }[] = [];
  private fitTimer: ReturnType<typeof setTimeout> | null = null;
  private warned = new Set<string>();
  private announceFlip = false;
  private stops: (() => void)[] = [];
  private nodeObserver: ResizeObserver | null = null;
  private paneObserver: ResizeObserver | null = null;
  private destroyed = false;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);
  private readonly config = inject(WuConfig);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly translationSub = this.config.translationChange.subscribe(() => {
    this.dirty = true;
    this.changeSet.add('nodes');
    this.cdr.markForCheck();
    this.requestRender();
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    if (this.browser && typeof ResizeObserver !== 'undefined') {
      this.zone.runOutsideAngular(() => {
        this.nodeObserver = new ResizeObserver((entries) => this.nodesResized(entries));
      });
    }
  }

  // ======================================================================
  // lifecycle
  // ======================================================================

  ngOnChanges(changes: SimpleChanges): void {
    // New data from the app (not the arrays the flow handed back). While a gesture runs in controlled mode every
    // step comes back this way; the gesture's own end is the step that counts.
    if (changes['nodes'] && this.nodes !== this._nodes) {
      this._nodes = Array.isArray(this.nodes) ? this.nodes : [];
      this.shadowNodes = null;
      this.forgetMissing();
      if (this.viewInit && !this.gesture) this.notifyCommit(true);
    }
    if (changes['edges'] && this.edges !== this._edges) {
      this._edges = Array.isArray(this.edges) ? this.edges : [];
      this.shadowEdges = null;
      if (this.viewInit && !this.gesture) this.notifyCommit(true);
    }
    if (!this.viewInit && (changes['defaultViewport'] || changes['viewport'])) {
      this.vp = normalizeViewport(this.viewport || this.defaultViewport);
    } else if (changes['viewport'] && this.viewport && !sameViewport(normalizeViewport(this.viewport, this.vp), this.vp)) {
      this.cancelAnimation();
      this.vp = this.constrain(normalizeViewport(this.viewport, this.vp));
      this.changeSet.add('viewport');
    }
    if (changes['minZoom'] || changes['maxZoom'] || changes['translateExtent']) {
      this.vp = this.constrain(this.vp);
      this.changeSet.add('viewport');
    }
    if (changes['interactive']) this.changeSet.add('interactive');
    this.dirty = true;
    this.rebuild();
    this.changeSet.add('nodes');
    if (this.viewInit) {
      this.writeViewport();
      this.requestRender();
      // A selection the app made (controlled mode) is reported too, after this check.
      Promise.resolve().then(() => this.reportSelection());
    }
  }

  ngAfterContentInit(): void {
    const refresh = () => {
      this.dirty = true;
      this.connectionLineTemplate = this.lineTemplates?.first?.template ?? asTemplate(this.connectionLineRef) ?? ɵfindTemplate(this.templates, 'connectionLine');
      this.rebuild();
      this.cdr.markForCheck();
      this.requestRender();
    };
    refresh();
    for (const q of [this.nodeTemplates, this.edgeTemplates, this.labelTemplates, this.lineTemplates, this.templates]) {
      const sub = q?.changes.subscribe(refresh);
      if (sub) this.stops.push(() => sub.unsubscribe());
    }
  }

  ngAfterViewInit(): void {
    this.viewInit = true;
    if (!this.browser) return;
    const root = this.rootRef?.nativeElement;
    const pane = this.paneRef?.nativeElement;
    if (!root || !pane) return;
    this.zone.runOutsideAngular(() => {
      const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Window, type: K, fn: (e: HTMLElementEventMap[K]) => void, opts?: AddEventListenerOptions) => {
        el.addEventListener(type, fn as EventListener, opts);
        this.stops.push(() => el.removeEventListener(type, fn as EventListener, opts));
      };
      on(pane, 'pointerdown', (e) => this.pointerDown(e));
      on(pane, 'wheel', (e) => this.wheel(e), { passive: false });
      on(pane, 'dblclick', (e) => this.doubleClick(e));
      on(pane, 'contextmenu', (e) => this.contextMenu(e));
      on(pane, 'pointerover', (e) => this.pointerOver(e));
      on(pane, 'pointerleave', () => this.pointerLeave());
      on(root, 'keydown', (e) => this.keyDown(e));
      on(root, 'keyup', (e) => this.keyUp(e));
      on(root, 'focusin', (e) => this.focusIn(e));
      // A focused element outside the view would scroll the clipped pane; keep it at 0 (the viewport pans instead).
      for (const el of [root, pane]) on(el, 'scroll', () => this.resetScroll(el));
      const win = this.doc.defaultView;
      if (win) on(win, 'blur', () => (this.panKeyHeld = false));
      if (typeof ResizeObserver !== 'undefined') {
        this.paneObserver = new ResizeObserver(() => this.paneResized());
        this.paneObserver.observe(pane);
      }
    });
    for (const [, el] of this.nodeEls) this.nodeObserver?.observe(el);
    this.paneResized();
    this.writeViewport();
    this.requestRender();
    Promise.resolve().then(() => {
      if (!this.destroyed) this.emitNow(() => this.init.emit(this));
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.translationSub.unsubscribe();
    for (const stop of this.stops) stop();
    this.stops = [];
    this.stopDocumentListeners();
    this.nodeObserver?.disconnect();
    this.paneObserver?.disconnect();
    if (this.frame) cancelAnimationFrame(this.frame);
    if (this.autoPanFrame) cancelAnimationFrame(this.autoPanFrame);
    if (this.anim) cancelAnimationFrame(this.anim.frame);
    for (const t of [this.longPressTimer, this.wheelTimer, this.fitTimer]) if (t) clearTimeout(t);
    for (const f of this.pendingFits) f.resolve(false);
    this.pendingFits = [];
    this.listeners.clear();
    this.commitListeners.clear();
  }

  // ======================================================================
  // template helpers
  // ======================================================================

  /** A flow text in the app's language (falls back to the built-in Thai / English). */
  text(key: FlowTextKey): string {
    return flowText(this.config.translation, key);
  }
  ɵtext(key: FlowTextKey): string {
    return this.text(key);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  trackById(_: number, item: { id: string }): string {
    return item.id;
  }
  trackLayer(_: number, layer: ɵWuFlowEdgeLayer): number {
    return layer.z;
  }
  trackGuide(i: number): number {
    return i;
  }

  // ======================================================================
  // building what is drawn
  // ======================================================================

  private resolveNode(type: string, cache: Map<string, Pick<ɵWuFlowNodeView, 'render' | 'template' | 'component'>>): Pick<ɵWuFlowNodeView, 'render' | 'template' | 'component'> {
    const known = cache.get(type);
    if (known) return known;
    let out: Pick<ɵWuFlowNodeView, 'render' | 'template' | 'component'> = { render: 'builtin', template: null, component: null };
    const specific = this.nodeTemplates?.find((t) => !!t.type && t.type === type);
    const component = this.nodeTypes && Object.prototype.hasOwnProperty.call(this.nodeTypes, type) ? this.nodeTypes[type] : null;
    const generic =
      this.nodeTemplates?.find((t) => !t.type)?.template ?? asTemplate(this.nodeRef) ?? ɵfindTemplate(this.templates, 'node');
    if (specific) out = { render: 'template', template: specific.template as TemplateRef<unknown>, component: null };
    else if (component) out = { render: 'component', template: null, component };
    else if (BUILTIN_NODES.has(type) && type !== 'default') out = { render: 'builtin', template: null, component: null };
    else if (generic) out = { render: 'template', template: generic as TemplateRef<unknown>, component: null };
    cache.set(type, out);
    return out;
  }

  private newNodeView(id: string): ɵWuFlowNodeView {
    const ctx = { id } as WuFlowNodeContext;
    ctx.$implicit = ctx;
    return {
      id,
      node: { id, position: { x: 0, y: 0 } },
      type: 'default',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      z: 0,
      transform: '',
      classes: '',
      styleWidth: null,
      styleHeight: null,
      style: null,
      ariaLabel: '',
      label: '',
      draggable: false,
      selectable: false,
      connectable: false,
      focusable: false,
      render: 'builtin',
      template: null,
      component: null,
      hasSource: true,
      hasTarget: true,
      sourcePosition: 'bottom',
      targetPosition: 'top',
      ctx,
      // No parent: anything else a template injects still comes from where the template was written.
      injector: Injector.create({ providers: [{ provide: WU_FLOW_NODE, useValue: ctx }] }),
    };
  }

  /** Works out every node and edge view from the current nodes, edges, sizes and handles (no DOM access). */
  private rebuild(): void {
    if (!this.dirty) return;
    this.dirty = false;
    const nodes = this._nodes;
    const lookup = nodeLookup(nodes);
    this.lookup = lookup;
    const abs = absolutePositions(nodes, lookup);
    const zs = computeNodeZ(nodes, { elevateOnSelect: this._elevateNodes });
    const parents = new Set<string>();
    for (const n of nodes) if (n && n.parentId) parents.add(n.parentId);
    const cache = new Map<string, Pick<ɵWuFlowNodeView, 'render' | 'template' | 'component'>>();
    const locked = !this._interactive;
    const next = new Map<string, ɵWuFlowNodeView>();
    const all: ɵWuFlowNodeView[] = [];
    const hiddenIds = new Set<string>();
    for (const node of sortNodesParentsFirst(nodes)) {
      if (!node || typeof node.id !== 'string') continue;
      if (node.hidden || (node.parentId && hiddenIds.has(node.parentId))) {
        hiddenIds.add(node.id);
        continue;
      }
      const v = this.views.get(node.id) || this.newNodeView(node.id);
      const p = abs.get(node.id) || { x: 0, y: 0 };
      const type = node.type || 'default';
      const measured = this.sizes.get(node.id);
      const width = measured ? measured.width : typeof node.width === 'number' ? node.width : node.measured?.width ?? node.initialWidth ?? 0;
      const height = measured ? measured.height : typeof node.height === 'number' ? node.height : node.measured?.height ?? node.initialHeight ?? 0;
      const resolved = this.resolveNode(type, cache);
      v.node = node;
      v.type = type;
      v.x = p.x;
      v.y = p.y;
      v.width = width || 0;
      v.height = height || 0;
      v.z = zs.get(node.id) ?? 0;
      v.transform = `translate(${p.x}px, ${p.y}px)`;
      v.draggable = !locked && this._draggable && node.draggable !== false;
      v.selectable = !locked && this._selectable && node.selectable !== false;
      v.connectable = !locked && this._connectable && node.connectable !== false;
      v.focusable = this._nodesFocusable && node.focusable !== false;
      v.render = resolved.render;
      v.template = resolved.template;
      v.component = resolved.component;
      v.hasSource = type !== 'output' && type !== 'group';
      v.hasTarget = type !== 'input' && type !== 'group';
      v.sourcePosition = isFlowPosition(node.sourcePosition) ? node.sourcePosition : 'bottom';
      v.targetPosition = isFlowPosition(node.targetPosition) ? node.targetPosition : 'top';
      v.styleWidth = typeof node.width === 'number' && isFinite(node.width) ? node.width : null;
      v.styleHeight = typeof node.height === 'number' && isFinite(node.height) ? node.height : null;
      v.style = node.style && typeof node.style === 'object' ? node.style : null;
      const d = node.data as { label?: unknown } | undefined;
      v.label = d && d.label !== undefined && d.label !== null ? String(d.label) : '';
      const name = flowNodeName(node);
      v.ariaLabel = node.selected ? `${name}, ${this.text('flowSelectedState')}` : name;
      const pending = this.keyboardFrom && this.keyboardFrom.nodeId === node.id;
      v.classes = [
        'wu-flow-node-' + safeClass(type),
        v.render === 'builtin' ? 'wu-flow-node-builtin' : 'wu-flow-node-custom',
        node.selected ? 'wu-flow-node-selected' : '',
        node.dragging ? 'wu-flow-node-dragging' : '',
        node.resizing ? 'wu-flow-node-resizing' : '',
        v.draggable ? 'wu-flow-node-draggable' : '',
        v.selectable ? 'wu-flow-node-selectable' : '',
        v.connectable ? 'wu-flow-node-connectable' : '',
        parents.has(node.id) ? 'wu-flow-node-parent' : '',
        pending ? 'wu-flow-node-connect-source' : '',
        node.className || '',
      ]
        .filter(Boolean)
        .join(' ');
      const c = v.ctx;
      c.node = node;
      c.id = node.id;
      c.type = type;
      c.data = node.data;
      c.selected = !!node.selected;
      c.dragging = !!node.dragging;
      c.isConnectable = v.connectable;
      c.positionAbsoluteX = p.x;
      c.positionAbsoluteY = p.y;
      c.width = v.width;
      c.height = v.height;
      c.zIndex = v.z;
      c.sourcePosition = v.sourcePosition;
      c.targetPosition = v.targetPosition;
      c.parentId = node.parentId || null;
      next.set(node.id, v);
      all.push(v);
    }
    this.views = next;
    let rendered = all;
    if (this._onlyVisible && this.paneW > 0 && this.paneH > 0) {
      const view = viewRect(this.vp, { width: this.paneW, height: this.paneH });
      const positions = new Map(all.map((v) => [v.id, { x: v.x, y: v.y }] as [string, FlowXY]));
      const sizes = new Map(all.map((v) => [v.id, { width: v.width, height: v.height }] as [string, FlowDimensions]));
      const ids = getVisibleNodeIds(
        all.map((v) => v.node),
        view,
        { buffer: 200 / this.vp.zoom, sizes, positions }
      );
      rendered = all.filter((v) => ids.has(v.id) || v.node.dragging || v.id === this.focusedNodeId || v.width <= 0);
    }
    this.renderedNodes = rendered;
    this.rebuildEdges();
  }

  private rebuildEdges(): void {
    const defaults = this.defaultEdgeOptions || null;
    const locked = !this._interactive;
    const layers = new Map<number, ɵWuFlowEdgeView[]>();
    const labels: ɵWuFlowEdgeView[] = [];
    const markers = new Map<string, ɵWuFlowMarkerView>();
    const next = new Map<string, ɵWuFlowEdgeView>();
    const view = this._onlyVisible && this.paneW > 0 ? viewRect(this.vp, { width: this.paneW, height: this.paneH }) : null;
    const reconnecting = this.gesture && this.gesture.kind === 'connect' && this.gesture.reconnect && this.gesture.moved ? this.gesture.reconnect.edge.id : null;
    for (const raw of this._edges) {
      if (!raw || typeof raw.id !== 'string' || raw.hidden) continue;
      const s = this.views.get(raw.source);
      const t = this.views.get(raw.target);
      if (!s || !t) {
        if ((!this.lookup.has(raw.source) || !this.lookup.has(raw.target)) && !this.warned.has(raw.id)) {
          this.warned.add(raw.id);
          console.warn(`[wiraui] flow: edge "${raw.id}" refers to a node that does not exist (source "${raw.source}", target "${raw.target}").`);
        }
        continue;
      }
      if ((s.width <= 0 && s.height <= 0) || (t.width <= 0 && t.height <= 0)) continue;
      const e: FlowEdge = defaults ? { ...defaults, ...raw } : raw;
      const ends = getEdgeEnds(
        e,
        { node: s.node, rect: { x: s.x, y: s.y, width: s.width, height: s.height }, handles: this.handles.get(s.id) },
        { node: t.node, rect: { x: t.x, y: t.y, width: t.width, height: t.height }, handles: this.handles.get(t.id) }
      );
      if (view && !isEdgeVisible({ x: ends.sourceX, y: ends.sourceY }, { x: ends.targetX, y: ends.targetY }, view, 200 / this.vp.zoom)) continue;
      const type = e.type || 'default';
      // Curved edges stop short of an arrowhead and run straight into it, so it stays on the line however the curve bends.
      const [path, lx, ly] = getEdgePathWithRoom(BUILTIN_EDGES.has(type) ? type : 'default', ends, e.pathOptions || {}, {
        start: markerLength(e.markerStart),
        end: markerLength(e.markerEnd),
      });
      const v = this.edgeViews.get(raw.id) || this.newEdgeView(raw.id);
      const selected = !!raw.selected;
      v.edge = raw;
      v.type = type;
      v.path = path;
      v.labelX = lx;
      v.labelY = ly;
      v.sourceX = ends.sourceX;
      v.sourceY = ends.sourceY;
      v.targetX = ends.targetX;
      v.targetY = ends.targetY;
      v.z = edgeZIndex(e, s.z, t.z, !!(s.node.parentId || t.node.parentId), this._elevateEdges);
      v.selectable = !locked && this._selectable && e.selectable !== false;
      v.focusable = this._edgesFocusable && e.focusable !== false;
      const reconnectable = !locked && this._reconnectable && e.reconnectable !== false;
      v.updateSource = reconnectable && e.reconnectable !== 'target';
      v.updateTarget = reconnectable && e.reconnectable !== 'source';
      v.interactionWidth = Math.max(0, num(e.interactionWidth, 20));
      v.style = e.style && typeof e.style === 'object' ? e.style : null;
      v.markerStart = this.markerUrl(e.markerStart, selected, markers);
      v.markerEnd = this.markerUrl(e.markerEnd, selected, markers);
      v.template = this.edgeTemplateFor(type);
      v.labelTemplate = this.labelTemplateFor(type);
      v.label = e.label !== undefined && e.label !== null ? String(e.label) : '';
      v.hasLabel = !!v.labelTemplate || v.label !== '';
      v.ariaLabel = flowEdgeName(e, s.node, t.node, this.config.translation) + (selected ? `, ${this.text('flowSelectedState')}` : '');
      v.classes = [
        'wu-flow-edge-' + safeClass(type),
        selected ? 'wu-flow-edge-selected' : '',
        e.animated ? 'wu-flow-edge-animated' : '',
        v.selectable ? 'wu-flow-edge-selectable' : '',
        reconnecting === raw.id ? 'wu-flow-edge-reconnecting' : '',
        e.className || '',
      ]
        .filter(Boolean)
        .join(' ');
      v.labelClasses = [selected ? 'wu-flow-edge-label-selected' : '', e.labelShowBg === false ? 'wu-flow-edge-label-plain' : '', v.labelTemplate ? 'wu-flow-edge-label-custom' : ''].filter(Boolean).join(' ');
      v.labelTransform = `translate(${lx}px, ${ly}px) translate(-50%, -50%)`;
      v.labelStyle = e.labelStyle && typeof e.labelStyle === 'object' ? e.labelStyle : null;
      const box: FlowStyle = { ...(e.labelBgStyle || {}) };
      if (Array.isArray(e.labelBgPadding)) box['padding'] = `${num(e.labelBgPadding[1], 2)}px ${num(e.labelBgPadding[0], 4)}px`;
      if (typeof e.labelBgBorderRadius === 'number') box['border-radius'] = `${e.labelBgBorderRadius}px`;
      v.labelBoxStyle = Object.keys(box).length ? box : null;
      const c = v.ctx;
      c.edge = raw;
      c.id = raw.id;
      c.type = type;
      c.data = raw.data;
      c.path = path;
      c.labelX = lx;
      c.labelY = ly;
      c.sourceX = ends.sourceX;
      c.sourceY = ends.sourceY;
      c.targetX = ends.targetX;
      c.targetY = ends.targetY;
      c.sourcePosition = ends.sourcePosition;
      c.targetPosition = ends.targetPosition;
      c.selected = selected;
      c.animated = !!e.animated;
      c.label = v.label;
      c.markerStart = v.markerStart;
      c.markerEnd = v.markerEnd;
      c.style = v.style;
      c.interactionWidth = v.interactionWidth;
      next.set(raw.id, v);
      const layer = layers.get(v.z);
      if (layer) layer.push(v);
      else layers.set(v.z, [v]);
      if (v.hasLabel) labels.push(v);
    }
    this.edgeViews = next;
    this.edgeLayers = Array.from(layers.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([z, edges]) => ({ z, edges }));
    this.labelEdges = labels;
    this.markers = Array.from(markers.values());
  }

  private newEdgeView(id: string): ɵWuFlowEdgeView {
    const ctx = { id } as WuFlowEdgeContext;
    ctx.$implicit = ctx;
    return {
      id,
      edge: { id, source: '', target: '' },
      type: 'default',
      path: '',
      labelX: 0,
      labelY: 0,
      sourceX: 0,
      sourceY: 0,
      targetX: 0,
      targetY: 0,
      z: 0,
      classes: '',
      style: null,
      markerStart: null,
      markerEnd: null,
      focusable: false,
      selectable: false,
      updateSource: false,
      updateTarget: false,
      interactionWidth: 20,
      label: '',
      hasLabel: false,
      labelClasses: '',
      labelTransform: '',
      labelStyle: null,
      labelBoxStyle: null,
      ariaLabel: '',
      template: null,
      labelTemplate: null,
      ctx,
    };
  }

  private edgeTemplateFor(type: string): TemplateRef<unknown> | null {
    const specific = this.edgeTemplates?.find((t) => !!t.type && t.type === type);
    if (specific) return specific.template as TemplateRef<unknown>;
    if (BUILTIN_EDGES.has(type)) return null;
    const generic = this.edgeTemplates?.find((t) => !t.type)?.template ?? asTemplate(this.edgeRef) ?? ɵfindTemplate(this.templates, 'edge');
    return (generic as TemplateRef<unknown>) || null;
  }

  private labelTemplateFor(type: string): TemplateRef<unknown> | null {
    const specific = this.labelTemplates?.find((t) => !!t.type && t.type === type);
    if (specific) return specific.template as TemplateRef<unknown>;
    const generic = this.labelTemplates?.find((t) => !t.type)?.template ?? asTemplate(this.edgeLabelRef) ?? ɵfindTemplate(this.templates, 'edgeLabel');
    return (generic as TemplateRef<unknown>) || null;
  }

  /** `url(#id)` for a marker, adding its definition to `markers`. Default-coloured markers follow the edge colour. */
  private markerUrl(marker: FlowEdge['markerEnd'], selected: boolean, markers: Map<string, ɵWuFlowMarkerView>): string | null {
    const m = normalizeMarker(marker);
    if (!m) return null;
    const custom = !!m.color;
    const key = [m.type, custom ? m.color : selected ? 'sel' : 'def', m.width, m.height, m.strokeWidth].join('-');
    const id = `${this.flowId}-m-${safeClass(key)}`;
    if (!markers.has(id)) {
      const closed = m.type === 'arrowclosed';
      markers.set(id, {
        id,
        shape: markerShape(m.type),
        width: m.width,
        height: m.height,
        className: custom ? 'wu-flow-marker-custom' : `wu-flow-marker ${closed ? 'wu-flow-marker-closed' : 'wu-flow-marker-open'}${selected ? ' wu-flow-marker-selected' : ''}`,
        fill: custom ? (closed ? (m.color as string) : 'none') : null,
        stroke: custom ? (m.color as string) : null,
        strokeWidth: Math.round(((m.strokeWidth * 20) / m.width) * 1000) / 1000,
      });
    }
    return `url(#${id})`;
  }

  // ======================================================================
  // rendering
  // ======================================================================

  /** Rebuilds and re-renders on the next frame (once per frame, outside Angular). */
  private requestRender(): void {
    if (!this.browser || this.destroyed || this.frame) return;
    this.zone.runOutsideAngular(() => {
      this.frame = requestAnimationFrame(() => {
        this.frame = 0;
        this.flush();
      });
    });
  }

  private flush(): void {
    if (this.destroyed) return;
    if (this.pendingHandles.size) {
      const ids = Array.from(this.pendingHandles);
      this.pendingHandles.clear();
      for (const id of ids) if (this.measureHandles(id)) this.dirty = true;
    }
    if (this.dirty) {
      this.rebuild();
      this.changeSet.add('nodes');
      this.cdr.detectChanges();
    }
    this.writeViewport();
    this.notify();
  }

  private writeViewport(): void {
    const el = this.viewportRef?.nativeElement;
    if (!el) return;
    const v = this.vp;
    el.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.zoom})`;
    this.rootRef?.nativeElement.style.setProperty('--_flow-zoom', String(v.zoom));
  }

  private notify(): void {
    if (!this.changeSet.size) return;
    const changes = new Set(this.changeSet);
    this.changeSet.clear();
    for (const fn of Array.from(this.listeners)) fn(changes);
  }

  private emitNow(fn: () => void): void {
    if (NgZone.isInAngularZone()) fn();
    else this.zone.run(fn);
  }

  private announce(message: string): void {
    const el = this.liveRef?.nativeElement;
    if (!el || !message) return;
    // A trailing invisible character makes a repeated message count as new.
    this.announceFlip = !this.announceFlip;
    el.textContent = message + (this.announceFlip ? '​' : '');
  }
  ɵannounce(message: string): void {
    this.announce(message);
  }

  // ======================================================================
  // applying changes
  // ======================================================================

  private commitNodes(changes: FlowNodeChange[], final: boolean): void {
    if (changes.length) {
      if (this._apply) {
        this._nodes = applyNodeChanges(changes, this._nodes);
        this.nodesToEmit = true;
      } else {
        this.shadowNodes = applyNodeChanges(changes, this.nodesNow());
      }
      this.dirty = true;
      if (!this._apply || final || isObserved(this.nodeChanges as EventEmitter<unknown>)) this.emitNow(() => this.nodeChanges.emit(changes));
    }
    if (final) this.flushArrays();
  }

  private commitEdges(changes: FlowEdgeChange[], final: boolean): void {
    if (changes.length) {
      if (this._apply) {
        this._edges = applyEdgeChanges(changes, this._edges);
        this.edgesToEmit = true;
      } else {
        this.shadowEdges = applyEdgeChanges(changes, this.edgesNow());
      }
      this.dirty = true;
      if (!this._apply || final || isObserved(this.edgeChanges as EventEmitter<unknown>)) this.emitNow(() => this.edgeChanges.emit(changes));
    }
    if (final) this.flushArrays();
  }

  /** Hands the new arrays to `[(nodes)]` / `[(edges)]` and reports a changed selection. */
  private flushArrays(): void {
    if (this.nodesToEmit) {
      this.nodesToEmit = false;
      const nodes = this._nodes;
      this.emitNow(() => this.nodesChange.emit(nodes));
    }
    if (this.edgesToEmit) {
      this.edgesToEmit = false;
      const edges = this._edges;
      this.emitNow(() => this.edgesChange.emit(edges));
    }
    this.reportSelection();
    this.requestRender();
  }

  private reportSelection(): void {
    const nodes = this._nodes.filter((n) => n && n.selected);
    const edges = this._edges.filter((e) => e && e.selected);
    const key = nodes.map((n) => n.id).join('\u0001') + '\u0002' + edges.map((e) => e.id).join('\u0001');
    if (key === this.selectionKey) return;
    this.selectionKey = key;
    this.changeSet.add('selection');
    this.requestRender();
    if (isObserved(this.selectionChange as EventEmitter<unknown>)) this.emitNow(() => this.selectionChange.emit({ nodes, edges }));
  }

  private notifyCommit(external: boolean): void {
    // In controlled mode the app applies the change; the step is recorded when the new arrays come back in.
    if (!external && !this._apply) return;
    for (const fn of Array.from(this.commitListeners)) fn(external);
  }

  /** Drops measurements of nodes that are gone. */
  private forgetMissing(): void {
    const ids = new Set(this._nodes.map((n) => n && n.id));
    for (const id of Array.from(this.sizes.keys())) if (!ids.has(id)) this.sizes.delete(id);
    for (const id of Array.from(this.handles.keys())) if (!ids.has(id)) this.handles.delete(id);
  }

  /** The node as it is now (the lookup is only rebuilt on the next frame). */
  private findNode(id: string): FlowNode | undefined {
    return this._nodes.find((n) => n && n.id === id);
  }

  /**
   * The nodes / edges as the app will have them: in controlled mode the changes sent this frame are not back as inputs
   * yet, so selection logic works on a copy with them applied (dropped as soon as the app's arrays come in).
   */
  private nodesNow(): FlowNode[] {
    return this.shadowNodes || this._nodes;
  }
  private edgesNow(): FlowEdge[] {
    return this.shadowEdges || this._edges;
  }

  private selectedNodeIds(): Set<string> {
    return new Set(this.nodesNow().filter((n) => n && n.selected).map((n) => n.id));
  }
  private selectedEdgeIds(): Set<string> {
    return new Set(this.edgesNow().filter((e) => e && e.selected).map((e) => e.id));
  }

  private nodeCanSelect(n: FlowNode): boolean {
    return this._interactive && this._selectable && n.selectable !== false && !n.hidden;
  }
  private edgeCanSelect(e: FlowEdge): boolean {
    return this._interactive && this._selectable && e.selectable !== false && !e.hidden;
  }

  /** Makes exactly these nodes and edges selected. */
  private setSelection(nodeIds: Set<string>, edgeIds: Set<string>, final: boolean): void {
    const nc = selectionChanges(this.nodesNow(), nodeIds, (n) => this.nodeCanSelect(n as FlowNode));
    const ec = selectionChanges(this.edgesNow(), edgeIds, (e) => this.edgeCanSelect(e as FlowEdge));
    if (nc.length) this.commitNodes(nc, false);
    if (ec.length) this.commitEdges(ec, false);
    if (final) this.flushArrays();
    else this.requestRender();
  }

  private announceSelection(): void {
    const n = this._nodes.filter((x) => x && x.selected).length;
    const e = this._edges.filter((x) => x && x.selected).length;
    this.announce(n + e ? flowFormat(this.text('flowSelected'), { nodes: n, edges: e }) : this.text('flowSelectionCleared'));
  }

  // ======================================================================
  // measuring
  // ======================================================================

  ɵregisterNode(id: string, el: HTMLElement): void {
    this.nodeEls.set(id, el);
    if (this.viewInit) this.nodeObserver?.observe(el);
  }

  ɵunregisterNode(id: string, el: HTMLElement): void {
    if (this.nodeEls.get(id) === el) this.nodeEls.delete(id);
    this.nodeObserver?.unobserve(el);
  }

  ɵhandlesChanged(nodeId: string): void {
    this.pendingHandles.add(nodeId);
    this.requestRender();
  }

  /** Re-measures nodes' handles (all nodes when no ids are given), e.g. after a node template moved its handles. */
  updateNodeInternals(ids?: string | string[]): void {
    const list = ids === undefined ? Array.from(this.nodeEls.keys()) : Array.isArray(ids) ? ids : [ids];
    for (const id of list) this.pendingHandles.add(id);
    this.requestRender();
  }

  ɵnodeComponentEvent(node: FlowNode, name: string, value: unknown): void {
    this.emitNow(() => this.nodeComponentEvent.emit({ node, name, value }));
  }

  /** Reads a node's handles from the DOM; true when they changed. */
  private measureHandles(id: string): boolean {
    const el = this.nodeEls.get(id);
    if (!el || !this.browser) return false;
    const zoom = this.vp.zoom || 1;
    const nr = el.getBoundingClientRect();
    if (!nr.width && !nr.height) return false;
    const out: MeasuredHandles = { source: [], target: [] };
    el.querySelectorAll('.wu-flow-handle').forEach((h) => {
      if (h.closest('.wu-flow-node') !== el) return;
      const r = h.getBoundingClientRect();
      const type: FlowHandleType = h.getAttribute('data-handletype') === 'target' ? 'target' : 'source';
      const pos = h.getAttribute('data-handlepos');
      const limit = Number(h.getAttribute('data-limit'));
      out[type].push({
        id: h.getAttribute('data-handleid') || null,
        type,
        position: isFlowPosition(pos) ? pos : type === 'target' ? 'top' : 'bottom',
        x: (r.left - nr.left) / zoom,
        y: (r.top - nr.top) / zoom,
        width: r.width / zoom,
        height: r.height / zoom,
        connectable: h.getAttribute('data-connectable') !== 'false',
        start: h.getAttribute('data-connectable-start') !== 'false',
        end: h.getAttribute('data-connectable-end') !== 'false',
        limit: isFinite(limit) && limit > 0 ? limit : null,
      });
    });
    const old = this.handles.get(id);
    const same =
      !!old &&
      old.source.length === out.source.length &&
      old.target.length === out.target.length &&
      [...old.source, ...old.target].every((a, i) => {
        const b = [...out.source, ...out.target][i];
        return a.id === b.id && a.position === b.position && Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5 && Math.abs(a.width - b.width) < 0.5 && a.connectable === b.connectable && a.start === b.start && a.end === b.end && a.limit === b.limit;
      });
    if (same) return false;
    this.handles.set(id, out);
    return true;
  }

  /** ResizeObserver (outside Angular): new node sizes are reported and drawn before the frame is painted. */
  private nodesResized(entries: ResizeObserverEntry[]): void {
    if (this.destroyed) return;
    const changed: string[] = [];
    let handlesMoved = false;
    for (const entry of entries) {
      const el = entry.target as HTMLElement;
      const id = el.getAttribute('data-id');
      if (!id || this.nodeEls.get(id) !== el) continue;
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      if (!width && !height) continue;
      const old = this.sizes.get(id);
      if (!old || old.width !== width || old.height !== height) {
        this.sizes.set(id, { width, height });
        changed.push(id);
      }
      if (this.measureHandles(id)) handlesMoved = true;
    }
    if (!changed.length && !handlesMoved) return;
    this.dirty = true;
    if (changed.length) {
      const changes: FlowNodeChange[] = changed.map((id) => ({ type: 'dimensions', id, dimensions: { ...(this.sizes.get(id) as FlowDimensions) } }));
      this.commitNodes(changes, true);
    }
    this.afterMeasure();
    this.flush();
  }

  private paneResized(): void {
    const pane = this.paneRef?.nativeElement;
    if (!pane) return;
    const w = pane.clientWidth;
    const h = pane.clientHeight;
    if (w === this.paneW && h === this.paneH) return;
    this.paneW = w;
    this.paneH = h;
    this.paneRect = null;
    this.vp = this.constrain(this.vp);
    if (this._onlyVisible) this.dirty = true;
    this.changeSet.add('viewport');
    this.afterMeasure();
    this.requestRender();
  }

  /** Every shown node has a size and the pane has room. */
  private allMeasured(ids?: Set<string>): boolean {
    if (!this.paneW || !this.paneH) return false;
    for (const n of this._nodes) {
      if (!n || n.hidden || (ids && !ids.has(n.id))) continue;
      const s = this.sizes.get(n.id);
      if (!s && !(typeof n.width === 'number' && typeof n.height === 'number')) return false;
    }
    return true;
  }

  private afterMeasure(): void {
    if (!this.allMeasured()) return;
    if (!this.nodesInitDone && this._nodes.length) {
      this.nodesInitDone = true;
      const nodes = this._nodes;
      Promise.resolve().then(() => this.emitNow(() => this.nodesInitialized.emit(nodes)));
    }
    if (this._fitOnInit && !this.initialFitDone && this._nodes.length) {
      this.initialFitDone = true;
      this.fitNow({ ...(this.fitViewOptions || {}), duration: 0 });
    }
    if (this.pendingFits.length) {
      const fits = this.pendingFits;
      this.pendingFits = [];
      for (const f of fits) this.fitNow(f.options).then(f.resolve);
    }
  }

  // ======================================================================
  // viewport
  // ======================================================================

  private minZ(): number {
    return num(this.minZoom, 0.5);
  }
  private maxZ(): number {
    return num(this.maxZoom, 2);
  }
  ɵminZoom(): number {
    return this.minZ();
  }
  ɵmaxZoom(): number {
    return this.maxZ();
  }
  ɵpaneSize(): FlowDimensions {
    return { width: this.paneW, height: this.paneH };
  }

  private constrain(v: FlowViewport): FlowViewport {
    const z = clampZoom(v.zoom, this.minZ(), this.maxZ());
    const next = { x: v.x, y: v.y, zoom: z };
    if (!this.paneW || !this.paneH) return next;
    return constrainViewport(next, { width: this.paneW, height: this.paneH }, normalizeExtent(this.translateExtent));
  }

  private beginMove(event: Event | null): void {
    if (this.moving) return;
    this.moving = true;
    if (isObserved(this.moveStart as EventEmitter<unknown>)) this.emitNow(() => this.moveStart.emit({ event, viewport: { ...this.vp } }));
  }

  private endMove(event: Event | null): void {
    if (!this.moving) return;
    this.moving = false;
    const viewport = { ...this.vp };
    this.emitNow(() => {
      this.moveEnd.emit({ event, viewport });
      this.viewportChange.emit(viewport);
    });
  }

  /** Moves the view now (the DOM is written straight away; add-ons hear about it in the same frame). */
  private setVp(next: FlowViewport, event: Event | null): boolean {
    const v = this.constrain(next);
    if (sameViewport(v, this.vp, 1e-9)) return false;
    this.vp = v;
    this.writeViewport();
    this.changeSet.add('viewport');
    if (this._onlyVisible) {
      this.dirty = true;
      this.requestRender();
    } else this.notify();
    if (isObserved(this.move as EventEmitter<unknown>)) this.emitNow(() => this.move.emit({ event, viewport: { ...v } }));
    return true;
  }

  private reducedMotion(): boolean {
    const win = this.doc.defaultView;
    return !!win && typeof win.matchMedia === 'function' && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private cancelAnimation(): void {
    const a = this.anim;
    if (!a) return;
    this.anim = null;
    cancelAnimationFrame(a.frame);
    a.resolve(false);
  }

  /** Moves the view to `target`, animated over `duration` ms (a jump with reduced motion). */
  private animateTo(target: FlowViewport, duration: number | undefined, event: Event | null = null): Promise<boolean> {
    this.cancelAnimation();
    const goal = this.constrain(target);
    const d = Math.max(0, num(duration, 0));
    if (!this.browser || !this.viewInit) {
      this.vp = goal;
      return Promise.resolve(true);
    }
    if (d === 0 || this.reducedMotion()) {
      this.beginMove(event);
      this.setVp(goal, event);
      this.endMove(event);
      return Promise.resolve(true);
    }
    return new Promise<boolean>((resolve) => {
      const from = { ...this.vp };
      const start = performance.now();
      const pane = { width: this.paneW, height: this.paneH };
      this.beginMove(event);
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / d);
        this.setVp(interpolateViewport(from, goal, easeInOutCubic(t), pane), event);
        if (t < 1 && this.anim) {
          this.anim.frame = requestAnimationFrame(step);
          return;
        }
        this.anim = null;
        this.endMove(event);
        resolve(true);
      };
      this.zone.runOutsideAngular(() => {
        this.anim = { frame: requestAnimationFrame(step), resolve };
      });
    });
  }

  getViewport(): FlowViewport {
    return { ...this.vp };
  }

  getZoom(): number {
    return this.vp.zoom;
  }

  setViewport(viewport: Partial<FlowViewport>, options: WuFlowViewportOptions = {}): Promise<boolean> {
    return this.animateTo({ x: num(viewport.x, this.vp.x), y: num(viewport.y, this.vp.y), zoom: num(viewport.zoom, this.vp.zoom) }, options.duration);
  }

  ɵzoomBy(factor: number, anchor?: FlowXY, options: WuFlowViewportOptions = {}): Promise<boolean> {
    const at = anchor || { x: this.paneW / 2, y: this.paneH / 2 };
    return this.animateTo(zoomAt(this.vp, this.vp.zoom * factor, at, this.minZ(), this.maxZ()), options.duration);
  }

  zoomIn(options: WuFlowViewportOptions = {}): Promise<boolean> {
    return this.ɵzoomBy(Math.max(1.01, num(this.zoomStep, 1.2)), undefined, options);
  }

  zoomOut(options: WuFlowViewportOptions = {}): Promise<boolean> {
    return this.ɵzoomBy(1 / Math.max(1.01, num(this.zoomStep, 1.2)), undefined, options);
  }

  zoomTo(zoom: number, options: WuFlowViewportOptions = {}): Promise<boolean> {
    return this.animateTo(zoomAt(this.vp, zoom, { x: this.paneW / 2, y: this.paneH / 2 }, this.minZ(), this.maxZ()), options.duration);
  }

  setCenter(x: number, y: number, options: WuFlowSetCenterOptions = {}): Promise<boolean> {
    const zoom = clampZoom(num(options.zoom, this.vp.zoom), this.minZ(), this.maxZ());
    return this.animateTo(viewportForCenter(x, y, zoom, { width: this.paneW, height: this.paneH }), options.duration);
  }

  fitBounds(bounds: FlowRect, options: WuFlowFitBoundsOptions = {}): Promise<boolean> {
    if (!this.paneW || !this.paneH) return Promise.resolve(false);
    return this.animateTo(getViewportForBounds(bounds, this.paneW, this.paneH, this.minZ(), this.maxZ(), options.padding ?? 0.1), options.duration);
  }

  panBy(delta: FlowXY): boolean {
    this.beginMove(null);
    const moved = this.setVp(panBy(this.vp, delta.x, delta.y), null);
    this.endMove(null);
    return moved;
  }

  /** Fits the nodes (or `options.nodes`) into view; waits for them to be measured first. */
  fitView(options: WuFlowFitViewOptions = {}): Promise<boolean> {
    if (!this.browser) return Promise.resolve(false);
    const ids = options.nodes ? new Set(options.nodes.map((n) => (typeof n === 'string' ? n : n.id))) : undefined;
    if (this.viewInit && this.allMeasured(ids)) return this.fitNow(options);
    return new Promise<boolean>((resolve) => {
      this.pendingFits.push({ options, resolve });
      // Nodes that never get a size (inside something hidden) must not keep the promise waiting forever.
      if (!this.fitTimer) {
        this.zone.runOutsideAngular(() => {
          this.fitTimer = setTimeout(() => {
            this.fitTimer = null;
            const fits = this.pendingFits;
            this.pendingFits = [];
            for (const f of fits) this.fitNow(f.options).then(f.resolve);
          }, 400);
        });
      }
    });
  }

  private fitNow(options: WuFlowFitViewOptions): Promise<boolean> {
    if (!this.paneW || !this.paneH) return Promise.resolve(false);
    this.rebuild();
    const ids = options.nodes ? new Set(options.nodes.map((n) => (typeof n === 'string' ? n : n.id))) : null;
    const rects: FlowRect[] = [];
    const absAll = options.includeHiddenNodes ? absolutePositions(this._nodes, this.lookup) : null;
    for (const n of this._nodes) {
      if (!n || (ids && !ids.has(n.id))) continue;
      const v = this.views.get(n.id);
      if (v) rects.push({ x: v.x, y: v.y, width: v.width, height: v.height });
      else if (absAll && n.hidden) {
        const p = absAll.get(n.id) || n.position;
        const s = this.sizes.get(n.id);
        rects.push({ x: p.x, y: p.y, width: s ? s.width : n.width || 0, height: s ? s.height : n.height || 0 });
      }
    }
    if (!rects.length) return Promise.resolve(false);
    const x1 = Math.min(...rects.map((r) => r.x));
    const y1 = Math.min(...rects.map((r) => r.y));
    const x2 = Math.max(...rects.map((r) => r.x + r.width));
    const y2 = Math.max(...rects.map((r) => r.y + r.height));
    const target = getViewportForBounds(
      { x: x1, y: y1, width: x2 - x1, height: y2 - y1 },
      this.paneW,
      this.paneH,
      num(options.minZoom, this.minZ()),
      num(options.maxZoom, this.maxZ()),
      options.padding ?? 0.1
    );
    return this.animateTo(target, options.duration);
  }

  private paneBox(): DOMRect | null {
    const pane = this.paneRef?.nativeElement;
    if (!pane) return null;
    if (!this.paneRect) this.paneRect = pane.getBoundingClientRect();
    return this.paneRect;
  }

  /** A pointer position (client px) to a point in the pane. */
  private clientToPane(p: FlowXY): FlowXY {
    const r = this.paneBox();
    return r ? { x: p.x - r.left, y: p.y - r.top } : { ...p };
  }

  private clientToFlow(p: FlowXY): FlowXY {
    return screenToFlow(this.clientToPane(p), this.vp);
  }

  screenToFlowPosition(point: FlowXY, options: { snapToGrid?: boolean } = {}): FlowXY {
    this.paneRect = null;
    const p = this.clientToFlow(point);
    return options.snapToGrid ?? false ? snapPosition(p, this.snapGrid) : p;
  }

  flowToScreenPosition(point: FlowXY): FlowXY {
    this.paneRect = null;
    const r = this.paneBox();
    const s = flowToScreen(point, this.vp);
    return r ? { x: s.x + r.left, y: s.y + r.top } : s;
  }

  // ======================================================================
  // pointer
  // ======================================================================

  private ownsElement(el: Element | null): boolean {
    return !!el && el.closest('.wu-flow') === this.rootRef?.nativeElement;
  }

  private panButtons(): number[] {
    const p = this.panOnDrag;
    if (Array.isArray(p)) return p;
    return bool(p, true) ? [0, 1] : [];
  }

  private listening: (() => void) | null = null;

  private listenDocument(): void {
    if (this.listening) return;
    const move = (e: PointerEvent) => this.pointerMove(e);
    const up = (e: PointerEvent) => this.pointerUp(e, false);
    const cancel = (e: PointerEvent) => this.pointerUp(e, true);
    this.zone.runOutsideAngular(() => {
      this.doc.addEventListener('pointermove', move);
      this.doc.addEventListener('pointerup', up);
      this.doc.addEventListener('pointercancel', cancel);
    });
    this.listening = () => {
      this.doc.removeEventListener('pointermove', move);
      this.doc.removeEventListener('pointerup', up);
      this.doc.removeEventListener('pointercancel', cancel);
    };
  }

  private stopDocumentListeners(): void {
    this.listening?.();
    this.listening = null;
  }

  private setRootClass(name: string, on: boolean): void {
    this.rootRef?.nativeElement.classList.toggle(name, on);
  }

  private pointerDown(e: PointerEvent): void {
    if (this.destroyed) return;
    const target = e.target as Element | null;
    if (!target || !this.ownsElement(target)) return;
    this.lastPointerDown = Date.now();
    this.paneRect = null;
    if (e.isPrimary) this.pointers.clear();
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    this.listenDocument();
    if (this.pointers.size === 2) {
      this.startPinch();
      return;
    }
    if (this.pointers.size > 2) return;
    this.cancelAnimation();
    const client = { x: e.clientX, y: e.clientY };
    const base = { pointerId: e.pointerId, pointerType: e.pointerType, startClient: client, lastClient: client, event: e };
    const multi = multiKeyHeld(e, this.multiSelectionKeyCode);
    if (e.pointerType === 'mouse' && e.button !== 0) {
      if (this.panButtons().includes(e.button)) {
        e.preventDefault();
        this.gesture = { ...base, kind: 'pan', startVp: { ...this.vp } };
      }
      return;
    }
    const handleEl = target.closest('.wu-flow-handle');
    const updaterEl = target.closest('.wu-flow-edge-updater');
    const nodeEl = target.closest('.wu-flow-node');
    const edgeEl = target.closest('.wu-flow-edge, .wu-flow-edge-label');
    if (this.panKeyHeld) {
      this.gesture = { ...base, kind: 'pan', startVp: { ...this.vp } };
      return;
    }
    if (handleEl && this.ownsElement(handleEl) && this.startConnect(handleEl, base)) return;
    if (updaterEl && this.startReconnect(updaterEl, base)) return;
    if (nodeEl && this.ownsElement(nodeEl)) {
      const id = nodeEl.getAttribute('data-id');
      const view = id ? this.views.get(id) : undefined;
      if (!view) return;
      const blocked = target.closest(NO_DRAG);
      if (blocked && nodeEl.contains(blocked) && blocked !== nodeEl) return;
      // Outside its drag handle a press still selects the node, but does not drag it.
      const handleSel = view.node.dragHandle;
      const canDrag = !handleSel || !!target.closest(handleSel);
      // A mouse selects straight away for feedback; a multi-select click toggles on release instead. A finger waits:
      // a tap selects on release, a long press adds to the selection.
      if (!multi && e.pointerType !== 'touch' && view.selectable && !view.node.selected) this.setSelection(new Set([view.id]), new Set(), false);
      this.gesture = { ...base, kind: 'node', nodeId: view.id, multi, longPressed: false, canDrag };
      if (e.pointerType === 'touch') this.startLongPress();
      return;
    }
    if (edgeEl && this.ownsElement(edgeEl)) {
      this.gesture = { ...base, kind: 'click', on: 'edge', edgeId: edgeEl.getAttribute('data-id'), multi, longPressed: false };
      return;
    }
    // The pane: a selection box, a pan, or a click.
    const selectKey = multiKeyHeld(e, this.selectionKeyCode);
    if (this._interactive && this._selectable && (this._selectionOnDrag || selectKey)) {
      this.startSelection(base, selectKey);
      return;
    }
    if (this.panButtons().includes(0)) {
      this.gesture = { ...base, kind: 'pan', startVp: { ...this.vp } };
      this.setRootClass('wu-flow-panning', true);
      if (e.pointerType === 'touch') this.startLongPress();
      return;
    }
    this.gesture = { ...base, kind: 'click', on: 'pane', edgeId: null, multi, longPressed: false };
    if (e.pointerType === 'touch') this.startLongPress();
  }

  private startLongPress(): void {
    if (this.longPressTimer) clearTimeout(this.longPressTimer);
    this.zone.runOutsideAngular(() => {
      this.longPressTimer = setTimeout(() => {
        this.longPressTimer = null;
        const g = this.gesture;
        if (!g || g.kind === 'pinch') return;
        if (g.kind === 'node') {
          // A long press on a node adds it to (or takes it from) the selection.
          g.longPressed = true;
          const view = this.views.get(g.nodeId);
          if (view && view.selectable) {
            this.setSelection(clickSelection(this.selectedNodeIds(), g.nodeId, true), this.selectedEdgeIds(), true);
            this.announceSelection();
          }
        } else if ((g.kind === 'pan' && !pastThreshold(g.startClient, g.lastClient, 6)) || (g.kind === 'click' && g.on === 'pane')) {
          // A long press on the pane starts a selection box there.
          this.setRootClass('wu-flow-panning', false);
          if (g.kind === 'pan') this.setVp(g.startVp, null);
          this.startSelection(g, true);
        }
      }, LONG_PRESS_MS);
    });
  }

  private stopLongPress(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  private startSelection(base: BaseGesture, additive: boolean): void {
    const keep = additive ? [...Array.from(this.selectedNodeIds()), ...Array.from(this.selectedEdgeIds())] : [];
    this.gesture = { ...base, kind: 'select', startPane: this.clientToPane(base.startClient), keep };
    this.setRootClass('wu-flow-selecting', true);
  }

  private startPinch(): void {
    const g = this.gesture;
    if (g && g.kind === 'drag') this.endDrag(g, null);
    else if (g && g.kind === 'connect') this.endConnect(g, null, true);
    else if (g && g.kind === 'select') this.endSelection();
    this.stopLongPress();
    const [a, b] = Array.from(this.pointers.values());
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    if (!dist) return;
    this.gesture = { kind: 'pinch', startDist: dist, startMid: this.clientToPane({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }), startVp: { ...this.vp } };
    this.beginMove(null);
  }

  private pointerMove(e: PointerEvent): void {
    if (!this.pointers.has(e.pointerId)) return;
    const client = { x: e.clientX, y: e.clientY };
    this.pointers.set(e.pointerId, client);
    const g = this.gesture;
    if (!g) return;
    if (g.kind === 'pinch') {
      if (this.pointers.size < 2) return;
      e.preventDefault();
      const [a, b] = Array.from(this.pointers.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = this.clientToPane({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
      const zoom = this._zoomOnPinch ? clampZoom(g.startVp.zoom * (dist / g.startDist), this.minZ(), this.maxZ()) : g.startVp.zoom;
      const anchor = screenToFlow(g.startMid, g.startVp);
      this.setVp({ x: mid.x - anchor.x * zoom, y: mid.y - anchor.y * zoom, zoom }, e);
      return;
    }
    if (e.pointerId !== g.pointerId) return;
    g.lastClient = client;
    g.event = e;
    const threshold = Math.max(0, num(this.nodeDragThreshold, 1));
    switch (g.kind) {
      case 'node': {
        if (!pastThreshold(g.startClient, client, g.pointerType === 'touch' ? Math.max(threshold, 6) : threshold)) return;
        this.stopLongPress();
        if (g.longPressed) return;
        const view = this.views.get(g.nodeId);
        if (view && view.draggable && g.canDrag) this.startDrag(g);
        else if (this.panButtons().includes(0)) this.gesture = { ...g, kind: 'pan', startVp: { ...this.vp } };
        break;
      }
      case 'drag':
        e.preventDefault();
        this.dragFrame(g);
        if (this._autoPanDrag) this.autoPan();
        break;
      case 'pan': {
        if (!pastThreshold(g.startClient, client, 1)) return;
        this.stopLongPress();
        e.preventDefault();
        this.beginMove(e);
        this.setVp({ x: g.startVp.x + client.x - g.startClient.x, y: g.startVp.y + client.y - g.startClient.y, zoom: g.startVp.zoom }, e);
        break;
      }
      case 'select':
        e.preventDefault();
        this.selectionFrame(g);
        break;
      case 'connect':
        e.preventDefault();
        if (!g.moved) {
          if (!pastThreshold(g.startClient, client, 2)) return;
          g.moved = true;
          this.beginConnect(g);
        }
        this.connectFrame(g);
        if (this._autoPanConnect) this.autoPan();
        break;
      case 'click':
        if (!pastThreshold(g.startClient, client, g.pointerType === 'touch' ? 6 : 2)) return;
        this.stopLongPress();
        if (this.panButtons().includes(0)) {
          this.gesture = { ...g, kind: 'pan', startVp: { ...this.vp } };
          this.setRootClass('wu-flow-panning', true);
        } else this.gesture = null;
        break;
    }
  }

  private pointerUp(e: PointerEvent, cancelled: boolean): void {
    if (!this.pointers.delete(e.pointerId)) return;
    const g = this.gesture;
    if (g && g.kind === 'pinch') {
      if (this.pointers.size === 0) {
        this.gesture = null;
        this.endMove(e);
        this.stopDocumentListeners();
      }
      return;
    }
    if (this.pointers.size === 0) this.stopDocumentListeners();
    if (!g || g.pointerId !== e.pointerId) return;
    this.gesture = null;
    this.stopLongPress();
    this.setRootClass('wu-flow-panning', false);
    if (cancelled) {
      if (g.kind === 'drag') this.endDrag(g, e);
      else if (g.kind === 'connect') this.endConnect(g, e, true);
      else if (g.kind === 'select') this.endSelection();
      else if (g.kind === 'pan') this.endMove(e);
      return;
    }
    switch (g.kind) {
      case 'node':
        if (!g.longPressed) this.nodeClicked(g, e);
        break;
      case 'drag':
        this.endDrag(g, e);
        break;
      case 'pan':
        if (pastThreshold(g.startClient, g.lastClient, 1)) this.endMove(e);
        else this.paneClicked(e);
        break;
      case 'select':
        if (pastThreshold(g.startClient, g.lastClient, 2)) this.endSelection();
        else {
          this.selectionRect = null;
          this.setRootClass('wu-flow-selecting', false);
          this.paneClicked(e);
        }
        break;
      case 'connect':
        if (g.moved) this.endConnect(g, e, false);
        else if (g.reconnect) this.edgeClicked(g.reconnect.edge.id, e, multiKeyHeld(e, this.multiSelectionKeyCode));
        else this.handleClicked(g.from, e);
        break;
      case 'click':
        if (g.longPressed) break;
        if (g.on === 'edge' && g.edgeId) this.edgeClicked(g.edgeId, e, g.multi);
        else this.paneClicked(e);
        break;
    }
  }

  // ---------- clicks ----------

  private nodeClicked(g: PendingNodeGesture, e: PointerEvent): void {
    const view = this.views.get(g.nodeId);
    if (!view) return;
    if (view.selectable) {
      if (g.multi) this.setSelection(clickSelection(this.selectedNodeIds(), view.id, true), this.selectedEdgeIds(), true);
      else this.setSelection(new Set([view.id]), new Set(), true);
      this.announceSelection();
    }
    if (isObserved(this.nodeClick as EventEmitter<unknown>)) this.emitNow(() => this.nodeClick.emit({ event: e, node: view.node }));
  }

  private edgeClicked(id: string, e: PointerEvent, multi: boolean): void {
    const edge = this._edges.find((x) => x.id === id);
    if (!edge) return;
    if (this.edgeCanSelect(edge)) {
      if (multi) this.setSelection(this.selectedNodeIds(), clickSelection(this.selectedEdgeIds(), id, true), true);
      else this.setSelection(new Set(), new Set([id]), true);
      this.announceSelection();
    }
    if (isObserved(this.edgeClick as EventEmitter<unknown>)) this.emitNow(() => this.edgeClick.emit({ event: e, edge }));
  }

  private paneClicked(e: PointerEvent): void {
    if (this.clickFrom || this.keyboardFrom) {
      this.cancelPendingConnection(true);
    } else if (this._selectable && (this.selectedNodeIds().size || this.selectedEdgeIds().size)) {
      this.setSelection(new Set(), new Set(), true);
      this.announceSelection();
    }
    if (isObserved(this.paneClick as EventEmitter<unknown>)) this.emitNow(() => this.paneClick.emit(e));
  }

  private doubleClick(e: MouseEvent): void {
    const target = e.target as Element | null;
    if (!target || !this.ownsElement(target)) return;
    const nodeEl = target.closest('.wu-flow-node');
    const edgeEl = target.closest('.wu-flow-edge, .wu-flow-edge-label');
    if (nodeEl) {
      const node = this.lookup.get(nodeEl.getAttribute('data-id') || '');
      if (node && isObserved(this.nodeDoubleClick as EventEmitter<unknown>)) this.emitNow(() => this.nodeDoubleClick.emit({ event: e, node }));
      return;
    }
    if (edgeEl) {
      const edge = this._edges.find((x) => x.id === edgeEl.getAttribute('data-id'));
      if (edge && isObserved(this.edgeDoubleClick as EventEmitter<unknown>)) this.emitNow(() => this.edgeDoubleClick.emit({ event: e, edge }));
      return;
    }
    if (!this._zoomOnDouble) return;
    e.preventDefault();
    this.paneRect = null;
    this.ɵzoomBy(e.shiftKey ? 0.5 : 2, this.clientToPane({ x: e.clientX, y: e.clientY }), { duration: 200 });
  }

  private contextMenu(e: MouseEvent): void {
    const target = e.target as Element | null;
    if (!target || !this.ownsElement(target)) return;
    const nodeEl = target.closest('.wu-flow-node');
    const edgeEl = target.closest('.wu-flow-edge, .wu-flow-edge-label');
    if (nodeEl) {
      const node = this.lookup.get(nodeEl.getAttribute('data-id') || '');
      if (node && isObserved(this.nodeContextMenu as EventEmitter<unknown>)) this.emitNow(() => this.nodeContextMenu.emit({ event: e, node }));
    } else if (edgeEl) {
      const edge = this._edges.find((x) => x.id === edgeEl.getAttribute('data-id'));
      if (edge && isObserved(this.edgeContextMenu as EventEmitter<unknown>)) this.emitNow(() => this.edgeContextMenu.emit({ event: e, edge }));
    } else if (isObserved(this.paneContextMenu as EventEmitter<unknown>)) {
      this.emitNow(() => this.paneContextMenu.emit(e));
    }
  }

  private pointerOver(e: PointerEvent): void {
    if (e.pointerType === 'touch') return;
    const target = e.target as Element | null;
    const nodeEl = target?.closest('.wu-flow-node');
    const edgeEl = target?.closest('.wu-flow-edge, .wu-flow-edge-label');
    const nodeId = nodeEl && this.ownsElement(nodeEl) ? nodeEl.getAttribute('data-id') : null;
    const edgeId = !nodeId && edgeEl && this.ownsElement(edgeEl) ? edgeEl.getAttribute('data-id') : null;
    this.hover(nodeId, edgeId, e);
  }

  private pointerLeave(): void {
    this.hover(null, null, null);
  }

  private hover(nodeId: string | null, edgeId: string | null, e: PointerEvent | null): void {
    const ev = e as PointerEvent;
    if (nodeId !== this.hoverNode) {
      const before = this.hoverNode ? this.lookup.get(this.hoverNode) : undefined;
      const after = nodeId ? this.lookup.get(nodeId) : undefined;
      this.hoverNode = nodeId;
      if (before && isObserved(this.nodeMouseLeave as EventEmitter<unknown>)) this.emitNow(() => this.nodeMouseLeave.emit({ event: ev, node: before }));
      if (after && isObserved(this.nodeMouseEnter as EventEmitter<unknown>)) this.emitNow(() => this.nodeMouseEnter.emit({ event: ev, node: after }));
    }
    if (edgeId !== this.hoverEdge) {
      const before = this.hoverEdge ? this._edges.find((x) => x.id === this.hoverEdge) : undefined;
      const after = edgeId ? this._edges.find((x) => x.id === edgeId) : undefined;
      this.hoverEdge = edgeId;
      if (before && isObserved(this.edgeMouseLeave as EventEmitter<unknown>)) this.emitNow(() => this.edgeMouseLeave.emit({ event: ev, edge: before }));
      if (after && isObserved(this.edgeMouseEnter as EventEmitter<unknown>)) this.emitNow(() => this.edgeMouseEnter.emit({ event: ev, edge: after }));
    }
  }

  // ---------- dragging nodes ----------

  private dragItems(ids: string[]): FlowDragItem[] {
    return dragRoots(ids, this.lookup)
      .map((id) => this.views.get(id))
      .filter((v): v is ɵWuFlowNodeView => !!v)
      .map((v) => {
        const parent = v.node.parentId ? this.views.get(v.node.parentId) : undefined;
        return {
          id: v.id,
          start: { x: v.x, y: v.y },
          size: { width: v.width, height: v.height },
          parentPosition: parent ? { x: parent.x, y: parent.y } : null,
          parentSize: parent ? { width: parent.width, height: parent.height } : null,
          extent: v.node.extent ?? null,
          expandParent: !!v.node.expandParent,
        };
      });
  }

  private startDrag(g: PendingNodeGesture): void {
    const view = this.views.get(g.nodeId);
    if (!view) return;
    let selected = this.selectedNodeIds();
    if (!view.node.selected && view.selectable && this._selectOnDrag) {
      selected = g.multi ? new Set([...Array.from(selected), view.id]) : new Set([view.id]);
      this.setSelection(selected, g.multi ? this.selectedEdgeIds() : new Set(), false);
    }
    const ids = selected.has(view.id) ? Array.from(selected).filter((id) => this.views.get(id)?.draggable) : [view.id];
    const items = this.dragItems(ids);
    if (!items.length) return;
    const drag: DragGesture = {
      kind: 'drag',
      pointerId: g.pointerId,
      pointerType: g.pointerType,
      startClient: g.startClient,
      lastClient: g.lastClient,
      event: g.event,
      items,
      primaryId: view.id,
      startFlow: this.clientToFlow(g.startClient),
      current: new Map(),
    };
    this.gesture = drag;
    this.setRootClass('wu-flow-dragging', true);
    if (isObserved(this.nodeDragStart as EventEmitter<unknown>)) {
      const nodes = items.map((it) => this.lookup.get(it.id) as FlowNode);
      this.emitNow(() => this.nodeDragStart.emit({ event: g.event, node: view.node, nodes }));
    }
    this.dragFrame(drag);
  }

  private dragFrame(g: DragGesture): void {
    const flow = this.clientToFlow(g.lastClient);
    const delta = { x: flow.x - g.startFlow.x, y: flow.y - g.startFlow.y };
    const options = { snapGrid: this._snap ? this.snapGrid : null, nodeExtent: normalizeExtent(this.nodeExtent) };
    let res = dragPositions(g.items, delta, options);
    this.guides = [];
    if (this._guides && !this._snap && g.items.length === 1) {
      const it = g.items[0];
      const r = res.get(it.id) as FlowDragResult;
      const skip = getDescendants(it.id, this._nodes);
      skip.add(it.id);
      const others = this.renderedNodes.filter((v) => !skip.has(v.id) && v.width > 0).map((v) => ({ x: v.x, y: v.y, width: v.width, height: v.height }));
      const al = alignmentGuides({ x: r.absolute.x, y: r.absolute.y, width: it.size.width, height: it.size.height }, others, Math.max(0, num(this.alignmentThreshold, 6)) / this.vp.zoom);
      if (al.dx || al.dy) res = dragPositions(g.items, { x: delta.x + al.dx, y: delta.y + al.dy }, options);
      this.guides = al.guides;
    }
    g.current = res;
    const changes: FlowNodeChange[] = [];
    for (const it of g.items) {
      const r = res.get(it.id) as FlowDragResult;
      changes.push({ type: 'position', id: it.id, position: r.position, positionAbsolute: r.absolute, dragging: true });
      const parentId = this.lookup.get(it.id)?.parentId;
      if (it.expandParent && parentId && it.parentSize) {
        const grow = parentGrowth(r.position, it.size, it.parentSize);
        if (grow) {
          it.parentSize = grow;
          changes.push({ type: 'dimensions', id: parentId, dimensions: grow, setAttributes: true });
        }
      }
    }
    this.commitNodes(changes, false);
    if (isObserved(this.nodeDrag as EventEmitter<unknown>)) {
      const node = this.findNode(g.primaryId) as FlowNode;
      const nodes = g.items.map((it) => this.findNode(it.id) as FlowNode);
      this.emitNow(() => this.nodeDrag.emit({ event: g.event, node, nodes }));
    }
    this.requestRender();
  }

  private endDrag(g: DragGesture, e: PointerEvent | null): void {
    this.stopAutoPan();
    this.setRootClass('wu-flow-dragging', false);
    this.guides = [];
    const changes: FlowNodeChange[] = g.items.map((it) => {
      const r = g.current.get(it.id);
      return { type: 'position', id: it.id, position: r ? r.position : undefined, positionAbsolute: r ? r.absolute : undefined, dragging: false };
    });
    this.commitNodes(changes, true);
    const node = this.findNode(g.primaryId);
    if (node && isObserved(this.nodeDragStop as EventEmitter<unknown>)) {
      const nodes = g.items.map((it) => this.findNode(it.id) as FlowNode);
      this.emitNow(() => this.nodeDragStop.emit({ event: e, node, nodes }));
    }
    this.announceMove(g.items.map((it) => it.id));
    this.notifyCommit(false);
  }

  private announceMove(ids: string[]): void {
    if (ids.length === 1) {
      const n = this.findNode(ids[0]);
      if (n) this.announce(flowFormat(this.text('flowMoved'), { name: flowNodeName(n), x: Math.round(n.position.x), y: Math.round(n.position.y) }));
    } else if (ids.length > 1) this.announce(flowFormat(this.text('flowMovedMany'), { count: ids.length }));
  }

  private autoPan(): void {
    if (this.autoPanFrame || !this.browser) return;
    const step = () => {
      this.autoPanFrame = 0;
      const g = this.gesture;
      if (!g || (g.kind !== 'drag' && g.kind !== 'connect')) return;
      const v = autoPanVelocity(this.clientToPane(g.lastClient), { width: this.paneW, height: this.paneH }, Math.max(0, num(this.autoPanSpeed, 15)));
      if (!v.x && !v.y) return;
      this.beginMove(null);
      if (!this.setVp(panBy(this.vp, v.x, v.y), null)) {
        this.endMove(null);
        return;
      }
      if (g.kind === 'drag') this.dragFrame(g);
      else this.connectFrame(g);
      this.autoPanFrame = requestAnimationFrame(step);
    };
    this.zone.runOutsideAngular(() => {
      this.autoPanFrame = requestAnimationFrame(step);
    });
  }

  private stopAutoPan(): void {
    if (this.autoPanFrame) cancelAnimationFrame(this.autoPanFrame);
    this.autoPanFrame = 0;
    this.endMove(null);
  }

  // ---------- selection box ----------

  private selectionFrame(g: SelectGesture): void {
    const now = this.clientToPane(g.lastClient);
    const rect = rectFromPoints(g.startPane, now);
    this.selectionRect = rect;
    const a = screenToFlow({ x: rect.x, y: rect.y }, this.vp);
    const flowRect = { x: a.x, y: a.y, width: rect.width / this.vp.zoom, height: rect.height / this.vp.zoom };
    const sel = boxSelection(this._nodes, this._edges, flowRect, {
      mode: this.selectionMode === 'partial' ? 'partial' : 'full',
      sizes: this.sizes,
      keep: g.keep,
      nodeSelectable: (n) => this.nodeCanSelect(n),
      edgeSelectable: (e) => this.edgeCanSelect(e),
    });
    this.setSelection(sel.nodes, sel.edges, false);
    this.dirty = true;
    this.requestRender();
  }

  private endSelection(): void {
    this.selectionRect = null;
    this.setRootClass('wu-flow-selecting', false);
    this.dirty = true;
    this.flushArrays();
    this.announceSelection();
  }

  // ---------- connecting ----------

  /** Handles of every drawn node, in flow coordinates, as connection targets. */
  private allHandles(): HandleInfo[] {
    const out: HandleInfo[] = [];
    for (const v of this.renderedNodes) {
      const hs = this.handles.get(v.id);
      if (!hs) continue;
      for (const h of [...hs.source, ...hs.target]) {
        out.push(this.handleInfo(v, h));
      }
    }
    return out;
  }

  private handleInfo(v: ɵWuFlowNodeView, h: MeasuredHandle): HandleInfo {
    const point =
      h.position === 'top'
        ? { x: v.x + h.x + h.width / 2, y: v.y + h.y }
        : h.position === 'bottom'
          ? { x: v.x + h.x + h.width / 2, y: v.y + h.y + h.height }
          : h.position === 'left'
            ? { x: v.x + h.x, y: v.y + h.y + h.height / 2 }
            : { x: v.x + h.x + h.width, y: v.y + h.y + h.height / 2 };
    return {
      nodeId: v.id,
      id: h.id,
      type: h.type,
      position: h.position,
      x: v.x + h.x + h.width / 2,
      y: v.y + h.y + h.height / 2,
      point,
      connectable: v.connectable && h.connectable,
      connectableStart: h.start,
      connectableEnd: h.end,
      limit: h.limit,
      virtual: false,
    };
  }

  /** A node's first handle of a type (or a stand-in on its side when it has none). */
  private nodeHandle(nodeId: string, type: FlowHandleType, near?: FlowXY): HandleInfo | null {
    const v = this.views.get(nodeId);
    if (!v) return null;
    const hs = this.handles.get(nodeId);
    const list = hs ? hs[type].map((h) => this.handleInfo(v, h)) : [];
    if (list.length) return near ? nearestHandle(near, list, Infinity) : list[0];
    const anyKind = hs ? [...hs.source, ...hs.target].map((h) => this.handleInfo(v, h)) : [];
    if (anyKind.length && this.connectionMode === 'loose') return near ? nearestHandle(near, anyKind, Infinity) : anyKind[0];
    if (anyKind.length) return null;
    const position = type === 'source' ? v.sourcePosition : v.targetPosition;
    const point = sidePoint({ x: v.x, y: v.y, width: v.width, height: v.height }, position);
    return { nodeId, id: null, type, position, x: point.x, y: point.y, point, connectable: v.connectable, connectableStart: true, connectableEnd: true, limit: null, virtual: true };
  }

  private handleFromElement(el: Element): HandleInfo | null {
    const nodeEl = el.closest('.wu-flow-node');
    const nodeId = nodeEl?.getAttribute('data-id');
    const v = nodeId ? this.views.get(nodeId) : undefined;
    if (!nodeId || !v) return null;
    this.measureHandles(nodeId);
    const type: FlowHandleType = el.getAttribute('data-handletype') === 'target' ? 'target' : 'source';
    const id = el.getAttribute('data-handleid') || null;
    const h = this.handles.get(nodeId)?.[type].find((x) => x.id === id);
    return h ? this.handleInfo(v, h) : null;
  }

  private connectRules(ignoreEdgeId: string | null) {
    return { mode: this.connectionMode, edges: this._edges, isValidConnection: this.isValidConnection || null, ignoreEdgeId };
  }

  private startConnect(el: Element, base: BaseGesture): boolean {
    const from = this.handleFromElement(el);
    if (!from || !from.connectable || !from.connectableStart || handleIsFull(this._edges, from)) return false;
    this.gesture = { ...base, kind: 'connect', from, moved: false, target: null, connection: null, candidates: [], reconnect: null };
    return true;
  }

  private startReconnect(el: Element, base: BaseGesture): boolean {
    const edgeEl = el.closest('.wu-flow-edge');
    const edge = this._edges.find((x) => x.id === edgeEl?.getAttribute('data-id'));
    const end = el.getAttribute('data-end') === 'source' ? 'source' : 'target';
    if (!edge || !this._interactive) return false;
    // The end that stays put is where the new connection starts from.
    const fixedNode = end === 'target' ? edge.source : edge.target;
    const fixedHandle = end === 'target' ? edge.sourceHandle ?? null : edge.targetHandle ?? null;
    const fixedType: FlowHandleType = end === 'target' ? 'source' : 'target';
    const v = this.views.get(fixedNode);
    if (!v) return false;
    const hs = this.handles.get(fixedNode);
    const h = hs ? [...hs[fixedType], ...hs[fixedType === 'source' ? 'target' : 'source']].find((x) => (fixedHandle === null ? x.type === fixedType : x.id === fixedHandle)) : undefined;
    const from = h ? this.handleInfo(v, h) : this.nodeHandle(fixedNode, fixedType);
    if (!from) return false;
    this.gesture = { ...base, kind: 'connect', from: { ...from, connectable: true, connectableStart: true }, moved: false, target: null, connection: null, candidates: [], reconnect: { edge, end } };
    return true;
  }

  private beginConnect(g: ConnectGesture): void {
    g.candidates = this.allHandles();
    this.cancelPendingConnection(false);
    this.setRootClass('wu-flow-connecting', true);
    this.markHandle(g.from, 'wu-flow-handle-connecting', true);
    if (g.reconnect) {
      this.dirty = true;
      const r = g.reconnect;
      if (isObserved(this.reconnectStart as EventEmitter<unknown>)) this.emitNow(() => this.reconnectStart.emit({ event: g.event, edge: r.edge, handleType: r.end }));
    } else if (isObserved(this.connectStart as EventEmitter<unknown>)) {
      this.emitNow(() => this.connectStart.emit({ event: g.event, nodeId: g.from.nodeId, handleId: g.from.id, handleType: g.from.type }));
    }
  }

  /** The handle the pointer is over or near, and the connection it would make. */
  private connectTarget(g: ConnectGesture, p: FlowXY): { target: HandleInfo | null; connection: FlowConnection | null } {
    const mode = this.connectionMode;
    const radius = Math.max(0, num(this.connectionRadius, 20)) / this.vp.zoom;
    let target = nearestHandle(p, g.candidates, radius, (h) => handlesCompatible(g.from, h, mode));
    if (!target) {
      // Dropped on a node's body: its nearest fitting handle (or the node itself when it has none).
      let best: ɵWuFlowNodeView | null = null;
      for (const v of this.renderedNodes) {
        if (v.id === g.from.nodeId || v.width <= 0) continue;
        if (!rectsIntersect({ x: p.x, y: p.y, width: 0, height: 0 }, { x: v.x, y: v.y, width: v.width, height: v.height })) continue;
        if (!best || v.z >= best.z) best = v;
      }
      if (best) {
        const own = g.candidates.filter((h) => h.nodeId === (best as ɵWuFlowNodeView).id && handlesCompatible(g.from, h, mode));
        target = own.length ? nearestHandle(p, own, Infinity) : this.nodeHandle(best.id, g.from.type === 'source' ? 'target' : 'source', p);
      }
    }
    if (!target) return { target: null, connection: null };
    const connection = target.connectable && target.connectableEnd ? validConnection(g.from, target, this.connectRules(g.reconnect ? g.reconnect.edge.id : null)) : null;
    return { target, connection };
  }

  private connectFrame(g: ConnectGesture): void {
    const p = this.clientToFlow(g.lastClient);
    const { target, connection } = this.connectTarget(g, p);
    g.target = target;
    g.connection = connection;
    this.highlight(target, connection);
    const to = target ? target.point : p;
    const toPosition = target ? target.position : oppositePosition(g.from.position);
    const [path] = getEdgePath(BUILTIN_EDGES.has(this.connectionLineType) ? this.connectionLineType : 'default', {
      sourceX: g.from.point.x,
      sourceY: g.from.point.y,
      sourcePosition: g.from.position,
      targetX: to.x,
      targetY: to.y,
      targetPosition: toPosition,
    });
    const valid = target ? !!connection : null;
    const ctx = {
      path,
      fromX: g.from.point.x,
      fromY: g.from.point.y,
      toX: to.x,
      toY: to.y,
      fromPosition: g.from.position,
      toPosition,
      valid,
      fromNodeId: g.from.nodeId,
      fromHandleId: g.from.id,
    } as WuFlowConnectionLineContext;
    ctx.$implicit = ctx;
    this.connectionLine = { path, valid, ctx };
    this.dirty = true;
    this.requestRender();
  }

  private handleElement(h: HandleInfo): Element | null {
    if (h.virtual) return null;
    const nodeEl = this.nodeEls.get(h.nodeId);
    if (!nodeEl) return null;
    const list = Array.from(nodeEl.querySelectorAll(`.wu-flow-handle[data-handletype="${h.type}"]`));
    return list.find((el) => (el.getAttribute('data-handleid') || null) === h.id && el.closest('.wu-flow-node') === nodeEl) || null;
  }

  private markHandle(h: HandleInfo | null, cls: string, on: boolean): void {
    const el = h ? this.handleElement(h) : null;
    el?.classList.toggle(cls, on);
  }

  private highlight(target: HandleInfo | null, connection: FlowConnection | null): void {
    const el = target ? this.handleElement(target) : null;
    if (this.highlighted && this.highlighted !== el) this.highlighted.classList.remove('wu-flow-handle-valid', 'wu-flow-handle-invalid');
    this.highlighted = el;
    if (el) {
      el.classList.toggle('wu-flow-handle-valid', !!connection);
      el.classList.toggle('wu-flow-handle-invalid', !connection);
    }
  }

  private endConnect(g: ConnectGesture, e: PointerEvent | null, cancelled: boolean): void {
    this.stopAutoPan();
    this.highlight(null, null);
    this.markHandle(g.from, 'wu-flow-handle-connecting', false);
    this.setRootClass('wu-flow-connecting', false);
    this.connectionLine = null;
    this.dirty = true;
    const connection = cancelled ? null : g.connection;
    if (g.reconnect) {
      const edge = g.reconnect.edge;
      if (connection) this.applyReconnect(edge, connection);
      if (isObserved(this.reconnectEnd as EventEmitter<unknown>)) this.emitNow(() => this.reconnectEnd.emit({ event: e, edge, connection }));
    } else {
      if (connection) this.applyConnect(connection);
      else if (g.target && !cancelled) this.announce(flowFormat(this.text('flowConnectInvalid'), { name: flowNodeName(this.lookup.get(g.target.nodeId)) }));
      if (isObserved(this.connectEnd as EventEmitter<unknown>)) this.emitNow(() => this.connectEnd.emit({ event: e, connection, isValid: !!connection }));
    }
    this.requestRender();
  }

  private applyConnect(connection: FlowConnection): void {
    this.emitNow(() => this.connect.emit(connection));
    if (this._autoConnect) {
      const defaults = (this.defaultEdgeOptions || {}) as Partial<FlowEdge>;
      const next = addEdge({ ...connection }, this._edges, defaults);
      if (next.length > this._edges.length) this.commitEdges([{ type: 'add', item: next[next.length - 1] }], true);
      this.notifyCommit(false);
    }
    this.announce(flowFormat(this.text('flowConnected'), { source: flowNodeName(this.lookup.get(connection.source)), target: flowNodeName(this.lookup.get(connection.target)) }));
  }

  private applyReconnect(edge: FlowEdge, connection: FlowConnection): void {
    this.emitNow(() => this.reconnect.emit({ edge, connection }));
    if (this._autoConnect) {
      const next = reconnectEdge(edge, connection, this._edges);
      const moved = next.find((x, i) => x !== this._edges[i]);
      if (moved) this.commitEdges([{ type: 'replace', id: edge.id, item: moved }], true);
      this.notifyCommit(false);
    }
    this.announce(flowFormat(this.text('flowReconnected'), { source: flowNodeName(this.lookup.get(connection.source)), target: flowNodeName(this.lookup.get(connection.target)) }));
  }

  /** Click-to-connect: the first handle clicked waits; the second makes the connection. */
  private handleClicked(h: HandleInfo, e: PointerEvent): void {
    if (!this._clickConnect) return;
    const from = this.clickFrom;
    if (!from) {
      this.clickFrom = h;
      this.markHandle(h, 'wu-flow-handle-connecting', true);
      this.announce(flowFormat(this.text('flowConnectStart'), { name: flowNodeName(this.lookup.get(h.nodeId)) }));
      if (isObserved(this.connectStart as EventEmitter<unknown>)) this.emitNow(() => this.connectStart.emit({ event: e, nodeId: h.nodeId, handleId: h.id, handleType: h.type }));
      return;
    }
    this.markHandle(from, 'wu-flow-handle-connecting', false);
    this.clickFrom = null;
    const connection = h.connectableEnd ? validConnection(from, h, this.connectRules(null)) : null;
    if (connection) this.applyConnect(connection);
    else this.announce(flowFormat(this.text('flowConnectInvalid'), { name: flowNodeName(this.lookup.get(h.nodeId)) }));
    if (isObserved(this.connectEnd as EventEmitter<unknown>)) this.emitNow(() => this.connectEnd.emit({ event: e, connection, isValid: !!connection }));
  }

  private cancelPendingConnection(announce: boolean): void {
    if (!this.clickFrom && !this.keyboardFrom) return;
    if (this.clickFrom) this.markHandle(this.clickFrom, 'wu-flow-handle-connecting', false);
    this.clickFrom = null;
    if (this.keyboardFrom) {
      this.keyboardFrom = null;
      this.dirty = true;
      this.requestRender();
    }
    if (announce) this.announce(this.text('flowConnectCancelled'));
  }

  // ======================================================================
  // wheel
  // ======================================================================

  private wheel(e: WheelEvent): void {
    const target = e.target as Element | null;
    if (!target || !this.ownsElement(target) || target.closest('.nowheel, .wu-flow-nowheel')) return;
    this.paneRect = null;
    const at = this.clientToPane({ x: e.clientX, y: e.clientY });
    const pinch = e.ctrlKey;
    const zoomKey = multiKeyHeld(e, this.zoomActivationKeyCode);
    let handled = false;
    if (pinch) {
      if (this._zoomOnPinch) {
        this.wheelMove(e, zoomAt(this.vp, this.vp.zoom * wheelZoomFactor(e.deltaY, e.deltaMode, true), at, this.minZ(), this.maxZ()));
        handled = true;
      }
    } else if (this._panOnScroll && !zoomKey) {
      const k = Math.max(0, num(this.panOnScrollSpeed, 0.5)) * 2;
      let dx = wheelDeltaPx(e.deltaX, e.deltaMode);
      let dy = wheelDeltaPx(e.deltaY, e.deltaMode);
      // Shift + wheel scrolls sideways on mice without a horizontal wheel.
      if (e.shiftKey && !dx) {
        dx = dy;
        dy = 0;
      }
      if (this.panOnScrollMode === 'vertical') dx = 0;
      if (this.panOnScrollMode === 'horizontal') {
        dx = dx || dy;
        dy = 0;
      }
      this.wheelMove(e, panBy(this.vp, -dx * k, -dy * k));
      handled = true;
    } else if (this._zoomOnScroll || zoomKey) {
      this.wheelMove(e, zoomAt(this.vp, this.vp.zoom * wheelZoomFactor(e.deltaY, e.deltaMode, false), at, this.minZ(), this.maxZ()));
      handled = true;
    }
    if (handled || this._preventScroll) e.preventDefault();
  }

  private wheelMove(e: WheelEvent, next: FlowViewport): void {
    this.cancelAnimation();
    this.beginMove(e);
    this.setVp(next, e);
    if (this.wheelTimer) clearTimeout(this.wheelTimer);
    this.zone.runOutsideAngular(() => {
      this.wheelTimer = setTimeout(() => {
        this.wheelTimer = null;
        this.endMove(e);
      }, WHEEL_END_MS);
    });
  }

  // ======================================================================
  // keyboard
  // ======================================================================

  private resetScroll(el: HTMLElement): void {
    if (el.scrollTop || el.scrollLeft) {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    }
  }

  private focusIn(e: FocusEvent): void {
    const target = e.target as Element | null;
    const nodeEl = target?.closest('.wu-flow-node');
    const id = nodeEl && this.ownsElement(nodeEl) && nodeEl === target ? nodeEl.getAttribute('data-id') : null;
    this.focusedNodeId = id;
    if (this.rootRef) this.resetScroll(this.rootRef.nativeElement);
    if (this.paneRef) this.resetScroll(this.paneRef.nativeElement);
    // Reached with the keyboard and partly out of view: bring it in.
    if (id && Date.now() - this.lastPointerDown > 400) {
      const v = this.views.get(id);
      if (!v) return;
      const view = viewRect(this.vp, { width: this.paneW, height: this.paneH });
      const inside = v.x >= view.x && v.y >= view.y && v.x + v.width <= view.x + view.width && v.y + v.height <= view.y + view.height;
      if (!inside) this.setCenter(v.x + v.width / 2, v.y + v.height / 2, { duration: 200 });
    }
  }

  private keyUp(e: KeyboardEvent): void {
    if (keyMatches(e, this.panActivationKeyCode)) {
      this.panKeyHeld = false;
      this.setRootClass('wu-flow-pan-key', false);
    }
  }

  private keyDown(e: KeyboardEvent): void {
    const target = e.target as Element | null;
    if (!target || !this.ownsElement(target) || isTypingTarget(target)) return;
    const root = this.rootRef?.nativeElement;
    const nodeEl = target.closest('.wu-flow-node');
    const edgeEl = target.closest('.wu-flow-edge');
    const onNode = !!nodeEl && nodeEl === target;
    const onEdge = !!edgeEl && edgeEl === target;
    const onPane = target === root;
    const locked = !this._interactive;
    if (onPane && keyMatches(e, this.panActivationKeyCode) && !e.repeat) {
      this.panKeyHeld = true;
      this.setRootClass('wu-flow-pan-key', true);
      e.preventDefault();
      return;
    }
    if (e.key === 'Escape') {
      if (this.cancelGesture()) {
        e.preventDefault();
        return;
      }
      if (this.clickFrom || this.keyboardFrom) {
        this.cancelPendingConnection(true);
        e.preventDefault();
        return;
      }
      if (this.selectedNodeIds().size || this.selectedEdgeIds().size) {
        this.setSelection(new Set(), new Set(), true);
        this.announceSelection();
        e.preventDefault();
      }
      return;
    }
    if (!onNode && !onEdge && !onPane) return;
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && (e.key === 'a' || e.key === 'A' || e.code === 'KeyA')) {
      if (!locked && this._selectable) {
        e.preventDefault();
        this.selectAll();
        this.announceSelection();
      }
      return;
    }
    if (keyMatches(e, this.deleteKeyCode) && !e.ctrlKey && !e.metaKey && !locked) {
      if (this._nodes.some((n) => n.selected) || this._edges.some((x) => x.selected)) {
        e.preventDefault();
        this.emitNow(() => void this.deleteSelected());
      }
      return;
    }
    // A unit direction; arrowKey() applies the step and Shift's ×10.
    const arrow = arrowStep({ key: e.key }, 1);
    if (arrow) {
      e.preventDefault();
      this.arrowKey(e, arrow, onNode ? nodeEl?.getAttribute('data-id') || null : null);
      return;
    }
    if (onPane && (e.key === '+' || e.key === '=' || e.key === '-' || e.key === '_')) {
      e.preventDefault();
      const zoom = e.key === '+' || e.key === '=' ? this.zoomIn({ duration: 150 }) : this.zoomOut({ duration: 150 });
      zoom.then(() => this.announce(flowFormat(this.text('flowZoomLevel'), { zoom: Math.round(this.vp.zoom * 100) })));
      return;
    }
    if ((onNode || onEdge) && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      const id = (onNode ? nodeEl : edgeEl)?.getAttribute('data-id') || '';
      if (onNode && this.keyboardFrom) this.keyboardConnect(id, e);
      else this.keySelect(onNode ? 'node' : 'edge', id, multiKeyHeld(e, this.multiSelectionKeyCode));
      return;
    }
    if (onNode && !e.ctrlKey && !e.metaKey && !e.altKey && keyMatches(e, 'c')) {
      e.preventDefault();
      this.startKeyboardConnect(nodeEl?.getAttribute('data-id') || '', e);
    }
  }

  private keySelect(kind: 'node' | 'edge', id: string, multi: boolean): void {
    if (kind === 'node') {
      const node = this.nodesNow().find((n) => n && n.id === id);
      if (!node || !this.nodeCanSelect(node)) return;
      if (multi) this.setSelection(clickSelection(this.selectedNodeIds(), id, true), this.selectedEdgeIds(), true);
      else this.setSelection(node.selected ? new Set() : new Set([id]), new Set(), true);
    } else {
      const edge = this.edgesNow().find((x) => x.id === id);
      if (!edge || !this.edgeCanSelect(edge)) return;
      if (multi) this.setSelection(this.selectedNodeIds(), clickSelection(this.selectedEdgeIds(), id, true), true);
      else this.setSelection(new Set(), edge.selected ? new Set() : new Set([id]), true);
    }
    this.announceSelection();
  }

  private arrowKey(e: KeyboardEvent, dir: FlowXY, focusedNode: string | null): void {
    // Keys can repeat faster than frames: start from the positions just committed, not the last drawn ones.
    this.rebuild();
    const shift = e.shiftKey ? 10 : 1;
    const locked = !this._interactive;
    // Alt + arrows resize the focused node when it has a resizer.
    if (e.altKey && focusedNode && this.resizers.has(focusedNode) && !locked) {
      const box = this.ɵnodeBox(focusedNode);
      if (!box) return;
      const step = Math.max(1, num(this.keyboardStep, 5)) * shift;
      const limits = (this.resizers.get(focusedNode) as () => FlowResizeLimits)();
      const rect = resizeBox({ x: box.position.x, y: box.position.y, width: box.width, height: box.height }, 'bottom-right', dir.x * step, dir.y * step, limits);
      this.ɵresizeNode(focusedNode, rect, 'end', e);
      return;
    }
    const selected = this._nodes.filter((n) => n.selected && this.views.get(n.id)?.draggable);
    if (selected.length && !locked) {
      const grid = this._snap ? this.snapGrid : null;
      const step = Math.max(1, num(this.keyboardStep, 5));
      const delta = { x: dir.x * (grid ? grid[0] : step) * shift, y: dir.y * (grid ? grid[1] : step) * shift };
      const items = this.dragItems(selected.map((n) => n.id));
      const res = dragPositions(items, delta, { snapGrid: grid, nodeExtent: normalizeExtent(this.nodeExtent) });
      const changes: FlowNodeChange[] = items.map((it) => {
        const r = res.get(it.id) as FlowDragResult;
        return { type: 'position', id: it.id, position: r.position, positionAbsolute: r.absolute, dragging: false };
      });
      this.emitNow(() => {
        this.commitNodes(changes, true);
        const node = this.findNode(items[0].id);
        if (node && isObserved(this.nodeDragStop as EventEmitter<unknown>)) this.nodeDragStop.emit({ event: e, node, nodes: items.map((it) => this.findNode(it.id) as FlowNode) });
      });
      this.announceMove(items.map((it) => it.id));
      this.notifyCommit(false);
      return;
    }
    // Nothing to move: pan the view.
    const pan = 40 * shift;
    this.cancelAnimation();
    this.panBy({ x: -dir.x * pan, y: -dir.y * pan });
  }

  private startKeyboardConnect(nodeId: string, e: KeyboardEvent): void {
    const v = this.views.get(nodeId);
    if (!v || !v.connectable) return;
    const from = this.nodeHandle(nodeId, 'source') || this.nodeHandle(nodeId, 'target');
    if (!from || !from.connectableStart) return;
    this.cancelPendingConnection(false);
    this.keyboardFrom = from;
    this.dirty = true;
    this.requestRender();
    this.announce(flowFormat(this.text('flowConnectStart'), { name: flowNodeName(v.node) }));
    if (isObserved(this.connectStart as EventEmitter<unknown>)) this.emitNow(() => this.connectStart.emit({ event: e, nodeId, handleId: from.id, handleType: from.type }));
  }

  private keyboardConnect(nodeId: string, e: KeyboardEvent): void {
    const from = this.keyboardFrom;
    if (!from) return;
    if (from.nodeId === nodeId) {
      // Enter on the node it started from: nothing to connect to.
      this.cancelPendingConnection(true);
      return;
    }
    this.keyboardFrom = null;
    this.dirty = true;
    this.requestRender();
    const to = this.nodeHandle(nodeId, from.type === 'source' ? 'target' : 'source');
    const connection = to && to.connectable && to.connectableEnd ? validConnection(from, to, this.connectRules(null)) : null;
    if (connection) this.applyConnect(connection);
    else this.announce(flowFormat(this.text('flowConnectInvalid'), { name: flowNodeName(this.lookup.get(nodeId)) }));
    if (isObserved(this.connectEnd as EventEmitter<unknown>)) this.emitNow(() => this.connectEnd.emit({ event: e, connection, isValid: !!connection }));
  }

  /** Stops a drag, box or connection in progress (Escape). */
  private cancelGesture(): boolean {
    const g = this.gesture;
    if (!g) return false;
    this.gesture = null;
    this.stopLongPress();
    this.stopDocumentListeners();
    this.pointers.clear();
    if (g.kind === 'drag') {
      // Back to where the drag started.
      const changes: FlowNodeChange[] = g.items.map((it) => {
        const parent = it.parentPosition;
        return { type: 'position', id: it.id, position: parent ? { x: it.start.x - parent.x, y: it.start.y - parent.y } : { ...it.start }, dragging: false };
      });
      this.stopAutoPan();
      this.setRootClass('wu-flow-dragging', false);
      this.guides = [];
      this.commitNodes(changes, true);
    } else if (g.kind === 'connect') {
      this.endConnect(g, null, true);
      this.announce(this.text('flowConnectCancelled'));
    } else if (g.kind === 'select') {
      this.endSelection();
    } else if (g.kind === 'pan') {
      this.setRootClass('wu-flow-panning', false);
      this.endMove(null);
    }
    this.requestRender();
    return true;
  }

  // ======================================================================
  // the API: nodes and edges
  // ======================================================================

  getNodes(): FlowNode[] {
    return this._nodes.slice();
  }

  getEdges(): FlowEdge[] {
    return this._edges.slice();
  }

  getNode(id: string): FlowNode | undefined {
    return this._nodes.find((n) => n.id === id);
  }

  getEdge(id: string): FlowEdge | undefined {
    return this._edges.find((e) => e.id === id);
  }

  /** Replaces the nodes (or maps them with a function), as a change list for controlled apps. */
  setNodes(nodes: FlowNode[] | ((nodes: FlowNode[]) => FlowNode[])): void {
    const next = typeof nodes === 'function' ? nodes(this._nodes.slice()) : nodes;
    this.replaceNodes(Array.isArray(next) ? next : [], true);
  }

  setEdges(edges: FlowEdge[] | ((edges: FlowEdge[]) => FlowEdge[])): void {
    const next = typeof edges === 'function' ? edges(this._edges.slice()) : edges;
    this.replaceEdges(Array.isArray(next) ? next : [], true);
  }

  addNodes(nodes: FlowNode | FlowNode[]): void {
    const list = Array.isArray(nodes) ? nodes : [nodes];
    this.emitNow(() => this.commitNodes(list.map((item) => ({ type: 'add', item })), true));
    this.notifyCommit(false);
  }

  addEdges(edges: FlowEdge | FlowEdge[]): void {
    const list = Array.isArray(edges) ? edges : [edges];
    this.emitNow(() => this.commitEdges(list.map((item) => ({ type: 'add', item })), true));
    this.notifyCommit(false);
  }

  /** Merges `update` into a node (or replaces it with `{ replace: true }`). */
  updateNode(id: string, update: Partial<FlowNode> | ((node: FlowNode) => Partial<FlowNode>), options: { replace?: boolean } = {}): void {
    const node = this.getNode(id);
    if (!node) return;
    const patch = typeof update === 'function' ? update(node) : update;
    const item = (options.replace ? { ...patch, id } : { ...node, ...patch, id }) as FlowNode;
    this.emitNow(() => this.commitNodes([{ type: 'replace', id, item }], true));
    this.notifyCommit(false);
  }

  /** Merges `update` into a node's `data` (or replaces it with `{ replace: true }`). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateNodeData(id: string, update: Record<string, any> | ((node: FlowNode) => Record<string, any>), options: { replace?: boolean } = {}): void {
    const node = this.getNode(id);
    if (!node) return;
    const patch = typeof update === 'function' ? update(node) : update;
    this.updateNode(id, { data: options.replace ? patch : { ...(node.data || {}), ...patch } });
  }

  updateEdge(id: string, update: Partial<FlowEdge> | ((edge: FlowEdge) => Partial<FlowEdge>), options: { replace?: boolean } = {}): void {
    const edge = this.getEdge(id);
    if (!edge) return;
    const patch = typeof update === 'function' ? update(edge) : update;
    const item = (options.replace ? { ...patch, id } : { ...edge, ...patch, id }) as FlowEdge;
    this.emitNow(() => this.commitEdges([{ type: 'replace', id, item }], true));
    this.notifyCommit(false);
  }

  /** Deletes nodes (with their children and edges) and edges; `beforeDelete` is asked first. */
  async deleteElements(elements: { nodes?: (string | { id: string })[]; edges?: (string | { id: string })[] }): Promise<{ deletedNodes: FlowNode[]; deletedEdges: FlowEdge[] }> {
    let out = getElementsToRemove({ nodesToRemove: elements.nodes || [], edgesToRemove: elements.edges || [], nodes: this._nodes, edges: this._edges });
    if (!out.nodes.length && !out.edges.length) return { deletedNodes: [], deletedEdges: [] };
    if (this.beforeDelete) {
      let answer: boolean | { nodes: FlowNode[]; edges: FlowEdge[] } = false;
      try {
        answer = await this.beforeDelete({ nodes: out.nodes, edges: out.edges });
      } catch {
        answer = false;
      }
      if (answer === false) return { deletedNodes: [], deletedEdges: [] };
      if (answer && typeof answer === 'object') out = { nodes: answer.nodes || [], edges: answer.edges || [] };
    }
    const nodeIds = new Set(out.nodes.map((n) => n.id));
    const edgeIds = new Set(out.edges.map((e) => e.id));
    // Edges of deleted nodes go too, whatever beforeDelete returned.
    for (const e of this._edges) if (nodeIds.has(e.source) || nodeIds.has(e.target)) edgeIds.add(e.id);
    const deletedNodes = this._nodes.filter((n) => nodeIds.has(n.id));
    const deletedEdges = this._edges.filter((e) => edgeIds.has(e.id));
    const focusLost = !!this.focusedNodeId && nodeIds.has(this.focusedNodeId);
    this.emitNow(() => {
      if (deletedEdges.length) this.commitEdges(deletedEdges.map((e) => ({ type: 'remove', id: e.id })), false);
      if (deletedNodes.length) this.commitNodes(deletedNodes.map((n) => ({ type: 'remove', id: n.id })), false);
      this.flushArrays();
      this.delete.emit({ nodes: deletedNodes, edges: deletedEdges });
    });
    for (const id of nodeIds) {
      this.sizes.delete(id);
      this.handles.delete(id);
    }
    if (focusLost) this.rootRef?.nativeElement.focus({ preventScroll: true });
    this.announce(flowFormat(this.text('flowDeleted'), { nodes: deletedNodes.length, edges: deletedEdges.length }));
    this.notifyCommit(false);
    return { deletedNodes, deletedEdges };
  }

  private deleteSelected(): Promise<{ deletedNodes: FlowNode[]; deletedEdges: FlowEdge[] }> {
    return this.deleteElements({ nodes: this._nodes.filter((n) => n.selected), edges: this._edges.filter((e) => e.selected) });
  }

  /** Nodes overlapping a node (or its id, or a box). */
  getIntersectingNodes(target: string | FlowNode | FlowRect, partially = true): FlowNode[] {
    return getIntersectingNodes(target, this._nodes, partially, this.sizes);
  }

  isNodeIntersecting(target: string | FlowNode | FlowRect, area: FlowRect, partially = true): boolean {
    const id = typeof target === 'string' ? target : 'id' in target ? (target as FlowNode).id : null;
    const v = id ? this.views.get(id) : null;
    const r = v ? { x: v.x, y: v.y, width: v.width, height: v.height } : (target as FlowRect);
    if (!partially) return r.x >= area.x && r.y >= area.y && r.x + r.width <= area.x + area.width && r.y + r.height <= area.y + area.height;
    return rectsIntersect(r, area);
  }

  selectAll(): void {
    this.setSelection(new Set(this._nodes.map((n) => n.id)), new Set(this._edges.map((e) => e.id)), true);
  }

  clearSelection(): void {
    this.setSelection(new Set(), new Set(), true);
  }

  /** Selects exactly these nodes and edges. */
  select(selection: { nodes?: string[]; edges?: string[] }): void {
    this.setSelection(new Set(selection.nodes || []), new Set(selection.edges || []), true);
  }

  setInteractive(on: boolean): void {
    if (this._interactive === on) return;
    this._interactive = on;
    if (!on) this.cancelPendingConnection(false);
    this.dirty = true;
    this.changeSet.add('interactive');
    this.cdr.markForCheck();
    this.requestRender();
    this.emitNow(() => this.interactiveChange.emit(on));
  }

  ɵisInteractive(): boolean {
    return this._interactive;
  }

  /** Lays the nodes out (`layoutFlow`, or `layoutTree` with `algorithm: 'tree'`) and fits the view unless told not to. */
  layout(options: WuFlowLayoutOptions = {}): Promise<boolean> {
    const sizes = this.sizes;
    const next = options.algorithm === 'tree' ? layoutTree(this._nodes, this._edges, { ...options, sizes }) : layoutFlow(this._nodes, this._edges, { ...options, sizes });
    this.replaceNodes(next, true);
    if (options.fitView === false) return Promise.resolve(true);
    return this.fitView({ duration: options.duration, padding: options.padding });
  }

  /** The diagram as plain data: `{ nodes, edges, viewport }`. */
  toJSON(): FlowJSON {
    return flowToJSON(this._nodes, this._edges, this.vp);
  }

  /** Another name for `toJSON()`. */
  toObject(): FlowJSON {
    return this.toJSON();
  }

  /** Loads what `toJSON()` wrote (object or text); false when it is not a diagram. */
  fromJSON(json: unknown, options: WuFlowViewportOptions = {}): boolean {
    const data = flowFromJSON(json);
    if (!data) return false;
    this.replaceNodes(data.nodes, false);
    this.replaceEdges(data.edges, false);
    this.notifyCommit(false);
    void this.setViewport(data.viewport, options);
    return true;
  }

  /** The diagram as an SVG document (edges, arrowheads, labels, and each node as a box with its label). */
  toSvg(options: FlowSvgOptions = {}): string {
    const colors = this.themeColors();
    return flowToSvg(this._nodes, this._edges, {
      sizes: this.sizes,
      handles: this.handles,
      title: this.ariaLabel || this.text('flowLabel'),
      defaultEdgeType: this.defaultEdgeOptions?.type,
      ...colors,
      ...options,
    });
  }

  /** Colours of the current theme, read from probe elements so they match the CSS exactly. */
  private themeColors(): Partial<FlowSvgOptions> {
    const host = this.viewportRef?.nativeElement;
    const win = this.doc.defaultView;
    if (!host || !win || !this.browser) return {};
    const probe = this.doc.createElement('div');
    probe.className = 'wu-flow-probe';
    probe.setAttribute('aria-hidden', 'true');
    probe.innerHTML =
      '<div class="wu-flow-node wu-flow-node-default wu-flow-node-builtin"></div>' +
      '<div class="wu-flow-node wu-flow-node-group wu-flow-node-builtin"></div>' +
      '<div class="wu-flow-edge-label"></div>' +
      '<svg class="wu-flow-edges"><path class="wu-flow-edge-path"></path></svg>';
    host.appendChild(probe);
    const [node, group, label] = Array.from(probe.children) as HTMLElement[];
    const path = probe.querySelector('path') as SVGPathElement;
    const n = win.getComputedStyle(node);
    const g = win.getComputedStyle(group);
    const l = win.getComputedStyle(label);
    const p = win.getComputedStyle(path);
    const out: Partial<FlowSvgOptions> = {
      nodeBackground: n.backgroundColor,
      nodeBorder: n.borderTopColor,
      nodeText: n.color,
      nodeRadius: parseFloat(n.borderTopLeftRadius) || 6,
      groupBackground: g.backgroundColor,
      edgeColor: p.stroke,
      edgeWidth: parseFloat(p.strokeWidth) || 1.5,
      labelBackground: l.backgroundColor,
      labelColor: l.color,
      fontFamily: n.fontFamily,
      fontSize: parseFloat(n.fontSize) || 12,
    };
    probe.remove();
    return out;
  }

  private replaceNodes(next: FlowNode[], commit: boolean): void {
    const changes = diffItems(this._nodes, next) as FlowNodeChange[];
    this.emitNow(() => {
      if (this._apply) {
        this._nodes = next;
        this.nodesToEmit = true;
        this.forgetMissing();
      }
      this.dirty = true;
      if (changes.length) this.nodeChanges.emit(changes);
      this.flushArrays();
    });
    if (commit) this.notifyCommit(false);
  }

  private replaceEdges(next: FlowEdge[], commit: boolean): void {
    const changes = diffItems(this._edges, next) as FlowEdgeChange[];
    this.emitNow(() => {
      if (this._apply) {
        this._edges = next;
        this.edgesToEmit = true;
      }
      this.dirty = true;
      if (changes.length) this.edgeChanges.emit(changes);
      this.flushArrays();
    });
    if (commit) this.notifyCommit(false);
  }

  // ======================================================================
  // for the add-ons
  // ======================================================================

  ɵlisten(fn: (changes: ReadonlySet<ɵWuFlowChange>) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /** Called after each finished change (`external`: new nodes / edges came in from the app). Used by `wuFlowHistory`. */
  ɵonCommit(fn: (external: boolean) => void): () => void {
    this.commitListeners.add(fn);
    return () => this.commitListeners.delete(fn);
  }

  /** Puts back a snapshot (undo / redo) without recording it. */
  ɵrestore(nodes: FlowNode[], edges: FlowEdge[]): void {
    const measured = nodes.map((n) => {
      const s = this.sizes.get(n.id);
      return s && !n.measured ? { ...n, measured: { ...s } } : n;
    });
    this.replaceNodes(measured, false);
    this.replaceEdges(edges, false);
  }

  ɵrootElement(): HTMLElement | null {
    return this.rootRef?.nativeElement || null;
  }

  ɵnodeRects(): WuFlowNodeRect[] {
    const out: WuFlowNodeRect[] = [];
    for (const v of this.views.values()) out.push({ id: v.id, node: v.node, selected: !!v.node.selected, x: v.x, y: v.y, width: v.width, height: v.height });
    return out;
  }

  ɵisNodeSelected(id: string): boolean {
    return !!this.lookup.get(id)?.selected;
  }

  ɵselectedNodeCount(): number {
    let n = 0;
    for (const x of this._nodes) if (x && x.selected) n++;
    return n;
  }

  ɵnodeBox(nodeId: string): ɵWuFlowNodeBox | null {
    const v = this.views.get(nodeId);
    if (!v) return null;
    return { position: { ...v.node.position }, absolute: { x: v.x, y: v.y }, width: v.width, height: v.height, parentId: v.node.parentId || null };
  }

  ɵregisterResizer(nodeId: string, limits: () => FlowResizeLimits): () => void {
    this.resizers.set(nodeId, limits);
    return () => {
      if (this.resizers.get(nodeId) === limits) this.resizers.delete(nodeId);
    };
  }

  ɵresizeNode(nodeId: string, rect: FlowRect, phase: 'start' | 'move' | 'end', _event: Event | null): void {
    const v = this.views.get(nodeId);
    const node = this.findNode(nodeId);
    if (!v || !node) return;
    const final = phase === 'end';
    const changes: FlowNodeChange[] = [];
    const dx = rect.x - node.position.x;
    const dy = rect.y - node.position.y;
    if (dx || dy) {
      changes.push({ type: 'position', id: nodeId, position: { x: rect.x, y: rect.y } });
      // Children keep their place on screen while the parent's top-left corner moves.
      for (const n of this._nodes) if (n.parentId === nodeId) changes.push({ type: 'position', id: n.id, position: { x: n.position.x - dx, y: n.position.y - dy } });
    }
    changes.push({ type: 'dimensions', id: nodeId, dimensions: { width: rect.width, height: rect.height }, setAttributes: true, resizing: !final });
    this.sizes.set(nodeId, { width: rect.width, height: rect.height });
    this.emitNow(() => this.commitNodes(changes, final));
    if (final) {
      this.announce(flowFormat(this.text('flowResized'), { name: flowNodeName(node), width: Math.round(rect.width), height: Math.round(rect.height) }));
      this.notifyCommit(false);
    }
    this.requestRender();
  }
}
