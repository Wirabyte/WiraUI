import { InjectionToken } from '@angular/core';
import type {
  FlowConnection,
  FlowEdge,
  FlowNode,
  FlowPadding,
  FlowPosition,
  FlowRect,
  FlowViewport,
  FlowXY,
} from 'wiratheme/core';

export type {
  FlowBox,
  FlowConnection,
  FlowConnectionMode,
  FlowCoordinateExtent,
  FlowDimensions,
  FlowEdge,
  FlowEdgeChange,
  FlowEdgeMarker,
  FlowEdgeType,
  FlowHandleBounds,
  FlowHandleType,
  FlowJSON,
  FlowLayoutDirection,
  FlowLayoutOptions,
  FlowMarker,
  FlowMarkerType,
  FlowNode,
  FlowNodeChange,
  FlowPadding,
  FlowPathOptions,
  FlowPathResult,
  FlowPosition,
  FlowRect,
  FlowStyle,
  FlowSvgOptions,
  FlowTreeLayoutOptions,
  FlowViewport,
  FlowXY,
} from 'wiratheme/core';

/** Shorter names for templates and apps: `WtFlowNode<Person>` is a `FlowNode<Person>`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WtFlowNode<T = any> = FlowNode<T>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WtFlowEdge<T = any> = FlowEdge<T>;

/**
 * What a node template gets: `<ng-template wtFlowNode="person" let-node>` makes `node` this object
 * (`node.data`, `node.selected`, `node.id` …); each field is also available by name (`let-data="data"`).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface WtFlowNodeContext<T = any> {
  $implicit: WtFlowNodeContext<T>;
  /** The node object as the app gave it (with the flow's latest position / selection). */
  node: FlowNode<T>;
  id: string;
  type: string;
  data: T;
  selected: boolean;
  dragging: boolean;
  /** The node may start and take connections now (its own setting, the flow's, and the lock). */
  isConnectable: boolean;
  /** Position in flow coordinates, adding up the parents. */
  positionAbsoluteX: number;
  positionAbsoluteY: number;
  /** Measured size in px (0 until measured). */
  width: number;
  height: number;
  zIndex: number;
  sourcePosition: FlowPosition;
  targetPosition: FlowPosition;
  parentId: string | null;
}

/**
 * What an edge template gets: `<ng-template wtFlowEdge="special" let-edge>` (draw with `<svg:path [attr.d]="edge.path">`),
 * and `wtFlowEdgeLabel` templates (HTML at `labelX`, `labelY`).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface WtFlowEdgeContext<T = any> {
  $implicit: WtFlowEdgeContext<T>;
  edge: FlowEdge<T>;
  id: string;
  type: string;
  data: T;
  /** The path the edge's shape gives (a bezier for custom types). */
  path: string;
  labelX: number;
  labelY: number;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: FlowPosition;
  targetPosition: FlowPosition;
  selected: boolean;
  animated: boolean;
  label: string;
  /** `url(#…)` for `marker-start` / `marker-end`, or null. */
  markerStart: string | null;
  markerEnd: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style: Record<string, any> | null;
  interactionWidth: number;
}

/** What a `wtFlowConnectionLine` template gets while a connection is dragged. */
export interface WtFlowConnectionLineContext {
  $implicit: WtFlowConnectionLineContext;
  /** The path of the built-in line, for templates that only restyle it. */
  path: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  fromPosition: FlowPosition;
  toPosition: FlowPosition;
  /** Over a handle the connection may end on; null while over nothing. */
  valid: boolean | null;
  fromNodeId: string;
  fromHandleId: string | null;
}

/** Where a panel, the minimap or the controls sit in the pane. */
export type WtFlowPanelPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center-left' | 'center-right';

// ---------- events ----------

export interface WtFlowNodeEvent {
  event: MouseEvent | PointerEvent | KeyboardEvent;
  node: FlowNode;
}

export interface WtFlowNodeDragEvent {
  event: PointerEvent | KeyboardEvent | null;
  /** The node under the pointer. */
  node: FlowNode;
  /** Every node moving with it. */
  nodes: FlowNode[];
}

export interface WtFlowEdgeEvent {
  event: MouseEvent | PointerEvent | KeyboardEvent;
  edge: FlowEdge;
}

export interface WtFlowMoveEvent {
  event: Event | null;
  viewport: FlowViewport;
}

export interface WtFlowConnectStartEvent {
  event: PointerEvent | KeyboardEvent | null;
  nodeId: string;
  handleId: string | null;
  handleType: 'source' | 'target';
}

export interface WtFlowConnectEndEvent {
  event: PointerEvent | KeyboardEvent | null;
  /** The connection made, or null when the drag ended over nothing it could connect to. */
  connection: FlowConnection | null;
  isValid: boolean;
}

export interface WtFlowReconnectEvent {
  edge: FlowEdge;
  connection: FlowConnection;
}

export interface WtFlowReconnectStartEvent {
  event: PointerEvent;
  edge: FlowEdge;
  /** The end being moved. */
  handleType: 'source' | 'target';
}

export interface WtFlowReconnectEndEvent {
  event: PointerEvent | null;
  edge: FlowEdge;
  connection: FlowConnection | null;
}

export interface WtFlowSelectionChange {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface WtFlowDeleteEvent {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

/** An output of a node component (`nodeTypes`): which node, which output, what it sent. */
export interface WtFlowNodeComponentEvent {
  node: FlowNode;
  name: string;
  value: unknown;
}

// ---------- method options ----------

export interface WtFlowViewportOptions {
  /** Animation length in ms (0 = jump; skipped when the user asks for reduced motion). */
  duration?: number;
}

export interface WtFlowFitViewOptions extends WtFlowViewportOptions {
  /** Fraction of the pane (`0.1`, the default) or px (`'24px'`). */
  padding?: FlowPadding;
  includeHiddenNodes?: boolean;
  minZoom?: number;
  maxZoom?: number;
  /** Fit these nodes only (ids or nodes). */
  nodes?: (string | { id: string })[];
}

export interface WtFlowSetCenterOptions extends WtFlowViewportOptions {
  /** Default: the current zoom. */
  zoom?: number;
}

export interface WtFlowFitBoundsOptions extends WtFlowViewportOptions {
  padding?: FlowPadding;
}

/** `beforeDelete`: return false to keep everything, or the subset to delete. */
export type WtFlowBeforeDelete = (elements: { nodes: FlowNode[]; edges: FlowEdge[] }) => boolean | { nodes: FlowNode[]; edges: FlowEdge[] } | Promise<boolean | { nodes: FlowNode[]; edges: FlowEdge[] }>;

/** A node's box as add-ons see it. */
export interface WtFlowNodeRect extends FlowRect {
  id: string;
  node: FlowNode;
  selected: boolean;
}

/**
 * The flow as `(init)` hands it over and `@ViewChild(WtFlow)` sees it: viewport, node and edge methods. Every method
 * works before the first render too (it then applies once the flow is measured).
 */
export interface WtFlowApi {
  getNodes(): FlowNode[];
  getEdges(): FlowEdge[];
  getNode(id: string): FlowNode | undefined;
  getEdge(id: string): FlowEdge | undefined;
  setNodes(nodes: FlowNode[] | ((nodes: FlowNode[]) => FlowNode[])): void;
  setEdges(edges: FlowEdge[] | ((edges: FlowEdge[]) => FlowEdge[])): void;
  addNodes(nodes: FlowNode | FlowNode[]): void;
  addEdges(edges: FlowEdge | FlowEdge[]): void;
  getViewport(): FlowViewport;
  setViewport(viewport: Partial<FlowViewport>, options?: WtFlowViewportOptions): Promise<boolean>;
  getZoom(): number;
  zoomIn(options?: WtFlowViewportOptions): Promise<boolean>;
  zoomOut(options?: WtFlowViewportOptions): Promise<boolean>;
  zoomTo(zoom: number, options?: WtFlowViewportOptions): Promise<boolean>;
  fitView(options?: WtFlowFitViewOptions): Promise<boolean>;
  fitBounds(bounds: FlowRect, options?: WtFlowFitBoundsOptions): Promise<boolean>;
  setCenter(x: number, y: number, options?: WtFlowSetCenterOptions): Promise<boolean>;
  screenToFlowPosition(point: FlowXY, options?: { snapToGrid?: boolean }): FlowXY;
  flowToScreenPosition(point: FlowXY): FlowXY;
}

/**
 * Injected inside a node template or node component: the node's context, kept up to date
 * (`inject(WT_FLOW_NODE).selected`).
 */
export const WT_FLOW_NODE = new InjectionToken<WtFlowNodeContext>('WT_FLOW_NODE');
