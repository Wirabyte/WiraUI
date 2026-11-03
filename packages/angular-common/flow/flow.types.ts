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
} from '@wirabyte/ui/core';

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
} from '@wirabyte/ui/core';

/** Shorter names for templates and apps: `WuFlowNode<Person>` is a `FlowNode<Person>`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WuFlowNode<T = any> = FlowNode<T>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WuFlowEdge<T = any> = FlowEdge<T>;

/**
 * What a node template gets: `<ng-template wuFlowNode="person" let-node>` makes `node` this object
 * (`node.data`, `node.selected`, `node.id` …); each field is also available by name (`let-data="data"`).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface WuFlowNodeContext<T = any> {
  $implicit: WuFlowNodeContext<T>;
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
 * What an edge template gets: `<ng-template wuFlowEdge="special" let-edge>` (draw with `<svg:path [attr.d]="edge.path">`),
 * and `wuFlowEdgeLabel` templates (HTML at `labelX`, `labelY`).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface WuFlowEdgeContext<T = any> {
  $implicit: WuFlowEdgeContext<T>;
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

/** What a `wuFlowConnectionLine` template gets while a connection is dragged. */
export interface WuFlowConnectionLineContext {
  $implicit: WuFlowConnectionLineContext;
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
export type WuFlowPanelPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center-left' | 'center-right';

// ---------- events ----------

export interface WuFlowNodeEvent {
  event: MouseEvent | PointerEvent | KeyboardEvent;
  node: FlowNode;
}

export interface WuFlowNodeDragEvent {
  event: PointerEvent | KeyboardEvent | null;
  /** The node under the pointer. */
  node: FlowNode;
  /** Every node moving with it. */
  nodes: FlowNode[];
}

export interface WuFlowEdgeEvent {
  event: MouseEvent | PointerEvent | KeyboardEvent;
  edge: FlowEdge;
}

export interface WuFlowMoveEvent {
  event: Event | null;
  viewport: FlowViewport;
}

export interface WuFlowConnectStartEvent {
  event: PointerEvent | KeyboardEvent | null;
  nodeId: string;
  handleId: string | null;
  handleType: 'source' | 'target';
}

export interface WuFlowConnectEndEvent {
  event: PointerEvent | KeyboardEvent | null;
  /** The connection made, or null when the drag ended over nothing it could connect to. */
  connection: FlowConnection | null;
  isValid: boolean;
}

export interface WuFlowReconnectEvent {
  edge: FlowEdge;
  connection: FlowConnection;
}

export interface WuFlowReconnectStartEvent {
  event: PointerEvent;
  edge: FlowEdge;
  /** The end being moved. */
  handleType: 'source' | 'target';
}

export interface WuFlowReconnectEndEvent {
  event: PointerEvent | null;
  edge: FlowEdge;
  connection: FlowConnection | null;
}

export interface WuFlowSelectionChange {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface WuFlowDeleteEvent {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

/** An output of a node component (`nodeTypes`): which node, which output, what it sent. */
export interface WuFlowNodeComponentEvent {
  node: FlowNode;
  name: string;
  value: unknown;
}

// ---------- method options ----------

export interface WuFlowViewportOptions {
  /** Animation length in ms (0 = jump; skipped when the user asks for reduced motion). */
  duration?: number;
}

export interface WuFlowFitViewOptions extends WuFlowViewportOptions {
  /** Fraction of the pane (`0.1`, the default) or px (`'24px'`). */
  padding?: FlowPadding;
  includeHiddenNodes?: boolean;
  minZoom?: number;
  maxZoom?: number;
  /** Fit these nodes only (ids or nodes). */
  nodes?: (string | { id: string })[];
}

export interface WuFlowSetCenterOptions extends WuFlowViewportOptions {
  /** Default: the current zoom. */
  zoom?: number;
}

export interface WuFlowFitBoundsOptions extends WuFlowViewportOptions {
  padding?: FlowPadding;
}

/** `beforeDelete`: return false to keep everything, or the subset to delete. */
export type WuFlowBeforeDelete = (elements: { nodes: FlowNode[]; edges: FlowEdge[] }) => boolean | { nodes: FlowNode[]; edges: FlowEdge[] } | Promise<boolean | { nodes: FlowNode[]; edges: FlowEdge[] }>;

/** A node's box as add-ons see it. */
export interface WuFlowNodeRect extends FlowRect {
  id: string;
  node: FlowNode;
  selected: boolean;
}

/**
 * The flow as `(init)` hands it over and `@ViewChild(WuFlow)` sees it: viewport, node and edge methods. Every method
 * works before the first render too (it then applies once the flow is measured).
 */
export interface WuFlowApi {
  getNodes(): FlowNode[];
  getEdges(): FlowEdge[];
  getNode(id: string): FlowNode | undefined;
  getEdge(id: string): FlowEdge | undefined;
  setNodes(nodes: FlowNode[] | ((nodes: FlowNode[]) => FlowNode[])): void;
  setEdges(edges: FlowEdge[] | ((edges: FlowEdge[]) => FlowEdge[])): void;
  addNodes(nodes: FlowNode | FlowNode[]): void;
  addEdges(edges: FlowEdge | FlowEdge[]): void;
  getViewport(): FlowViewport;
  setViewport(viewport: Partial<FlowViewport>, options?: WuFlowViewportOptions): Promise<boolean>;
  getZoom(): number;
  zoomIn(options?: WuFlowViewportOptions): Promise<boolean>;
  zoomOut(options?: WuFlowViewportOptions): Promise<boolean>;
  zoomTo(zoom: number, options?: WuFlowViewportOptions): Promise<boolean>;
  fitView(options?: WuFlowFitViewOptions): Promise<boolean>;
  fitBounds(bounds: FlowRect, options?: WuFlowFitBoundsOptions): Promise<boolean>;
  setCenter(x: number, y: number, options?: WuFlowSetCenterOptions): Promise<boolean>;
  screenToFlowPosition(point: FlowXY, options?: { snapToGrid?: boolean }): FlowXY;
  flowToScreenPosition(point: FlowXY): FlowXY;
}

/**
 * Injected inside a node template or node component: the node's context, kept up to date
 * (`inject(WU_FLOW_NODE).selected`).
 */
export const WU_FLOW_NODE = new InjectionToken<WuFlowNodeContext>('WU_FLOW_NODE');
