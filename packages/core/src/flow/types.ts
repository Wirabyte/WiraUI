/**
 * wu-flow: the data model. Nodes and edges are plain objects the app owns (shaped like the node/edge objects of the
 * popular React flow libraries, so graphs and helpers carry over), and every helper in this folder is a pure function
 * over them. Framework-free: the Angular component renders these and the tests run them without a browser.
 */

/** A side of a node: where a handle sits and which way an edge leaves it. */
export type FlowPosition = 'top' | 'right' | 'bottom' | 'left';

export interface FlowXY {
  x: number;
  y: number;
}

export interface FlowDimensions {
  width: number;
  height: number;
}

/** A rectangle by its top-left corner and size. */
export interface FlowRect extends FlowXY, FlowDimensions {}

/** A rectangle by its corners (`x2`, `y2` = bottom-right). */
export interface FlowBox {
  x: number;
  y: number;
  x2: number;
  y2: number;
}

/** `[[minX, minY], [maxX, maxY]]` in flow coordinates. */
export type FlowCoordinateExtent = [[number, number], [number, number]];

/** Pan and zoom: a flow point `p` shows at `p * zoom + (x, y)` inside the pane. */
export interface FlowViewport {
  x: number;
  y: number;
  zoom: number;
}

export type FlowHandleType = 'source' | 'target';

/** `strict`: source handles connect to target handles only. `loose`: any handle to any other handle. */
export type FlowConnectionMode = 'strict' | 'loose';

/** Edge shapes: `default` is a bezier curve, `step` is `smoothstep` with square corners. */
export type FlowEdgeType = 'default' | 'bezier' | 'straight' | 'step' | 'smoothstep' | 'simplebezier';

export type FlowMarkerType = 'arrow' | 'arrowclosed';

/** An arrowhead on an edge end. Sizes are in flow units (they scale with the zoom). */
export interface FlowEdgeMarker {
  type: FlowMarkerType;
  /** Default: the edge's stroke colour. */
  color?: string;
  /** Default 16. */
  width?: number;
  /** Default 16. */
  height?: number;
  /** Line width of the open arrow. Default 1.5. */
  strokeWidth?: number;
}

export type FlowMarker = FlowMarkerType | FlowEdgeMarker;

/** CSS for an element: `{ 'background-color': '#fff', width: '120px' }` (camelCase keys work too). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FlowStyle = Record<string, any>;

/**
 * A node. `position` is relative to the parent when `parentId` is set (a sub-flow), else to the flow's origin.
 * Everything except `id` and `position` is optional.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FlowNode<T = any> {
  id: string;
  position: FlowXY;
  /** Anything the node's template needs; the built-in nodes show `data.label`. */
  data?: T;
  /** Picks the template: `default` (built-in, a target handle on top and a source handle below), `input` (source only),
   *  `output` (target only), `group` (a box for child nodes) or the name of an app template / component. */
  type?: string;
  /** Fixed size in px; without it the node takes its content's size (measured). The resizer sets these. */
  width?: number;
  height?: number;
  /** The size the flow measured, written back by `dimensions` changes. Read-only for the app. */
  measured?: { width?: number; height?: number };
  /** Size to assume until the node has been measured (off-screen nodes with `onlyRenderVisibleElements`, export). */
  initialWidth?: number;
  initialHeight?: number;
  selected?: boolean;
  /** True while the node is being dragged. */
  dragging?: boolean;
  /** True while the resizer is resizing the node. */
  resizing?: boolean;
  /** Per-node switches; each defaults to the flow's own setting. */
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  deletable?: boolean;
  focusable?: boolean;
  hidden?: boolean;
  /** Stacking order among nodes (children always sit above their parent). */
  zIndex?: number;
  /** The parent node: `position` becomes relative to it and the node moves with it. */
  parentId?: string;
  /** Where the node may be dragged: `'parent'` keeps it inside its parent, or an extent in flow coordinates
   *  (relative to the parent for child nodes). */
  extent?: 'parent' | FlowCoordinateExtent;
  /** Dragging this child past its parent's border grows the parent instead of stopping. */
  expandParent?: boolean;
  /** Side of the built-in source / target handle, and of edges when the node has no handle of that type. */
  sourcePosition?: FlowPosition;
  targetPosition?: FlowPosition;
  className?: string;
  style?: FlowStyle;
  /** Screen-reader name. Default: `data.label`, else the id. */
  ariaLabel?: string;
  /** A CSS selector: only a press inside a matching element starts a drag (a title bar, a grip). */
  dragHandle?: string;
}

/** An edge from `source` to `target` (node ids), optionally from / to a particular handle. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FlowEdge<T = any> {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  /** A built-in shape (`default` bezier, `straight`, `step`, `smoothstep`, `simplebezier`) or a custom template name. */
  type?: string;
  data?: T;
  label?: string;
  labelStyle?: FlowStyle;
  /** Background behind the label. Default true. */
  labelShowBg?: boolean;
  labelBgStyle?: FlowStyle;
  /** `[x, y]` padding of the label background in px. */
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  /** Dashes flow along the edge (still dashed, not moving, when the user asks for reduced motion). */
  animated?: boolean;
  hidden?: boolean;
  selected?: boolean;
  selectable?: boolean;
  deletable?: boolean;
  focusable?: boolean;
  /** Drag an end of the edge to another handle: `true` (both ends), `'source'`, `'target'` or `false`. */
  reconnectable?: boolean | FlowHandleType;
  markerStart?: FlowMarker;
  markerEnd?: FlowMarker;
  style?: FlowStyle;
  className?: string;
  /** Width of the invisible path that catches clicks. Default 20. */
  interactionWidth?: number;
  zIndex?: number;
  ariaLabel?: string;
  /** Shape settings: `curvature` (bezier), `borderRadius` and `offset` (smoothstep / step). */
  pathOptions?: FlowPathOptions;
}

export interface FlowPathOptions {
  /** Bezier: how far the curve bends when it has to turn back. Default 0.25. */
  curvature?: number;
  /** Smoothstep: corner radius. Default 5 (0 for `step`). */
  borderRadius?: number;
  /** Smoothstep / step: how far the edge runs straight out of a handle before it turns. Default 20. */
  offset?: number;
}

/** A new link between two handles, as `(connect)` reports it. */
export interface FlowConnection {
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
}

/** A handle as measured: its box relative to the node's top-left, in flow units. */
export interface FlowHandleBounds extends FlowRect {
  id: string | null;
  type: FlowHandleType;
  position: FlowPosition;
}

/** Where a node's handles are, by type. */
export interface FlowNodeHandles {
  source: FlowHandleBounds[];
  target: FlowHandleBounds[];
}

// ---------- changes (what the flow reports, and what applyNodeChanges / applyEdgeChanges apply) ----------

export interface FlowNodePositionChange {
  type: 'position';
  id: string;
  /** Relative to the parent for child nodes. */
  position?: FlowXY;
  positionAbsolute?: FlowXY;
  dragging?: boolean;
}

export interface FlowNodeDimensionChange {
  type: 'dimensions';
  id: string;
  dimensions?: FlowDimensions;
  /** True while the resizer is busy. */
  resizing?: boolean;
  /** Also set `width` / `height` on the node (the resizer does; a plain measurement only sets `measured`). */
  setAttributes?: boolean | 'width' | 'height';
}

export interface FlowSelectChange {
  type: 'select';
  id: string;
  selected: boolean;
}

export interface FlowRemoveChange {
  type: 'remove';
  id: string;
}

export interface FlowAddChange<T> {
  type: 'add';
  item: T;
  /** Insert at this index (default: at the end). */
  index?: number;
}

export interface FlowReplaceChange<T> {
  type: 'replace';
  id: string;
  item: T;
}

export type FlowNodeChange<N extends FlowNode = FlowNode> =
  | FlowNodePositionChange
  | FlowNodeDimensionChange
  | FlowSelectChange
  | FlowRemoveChange
  | FlowAddChange<N>
  | FlowReplaceChange<N>;

export type FlowEdgeChange<E extends FlowEdge = FlowEdge> = FlowSelectChange | FlowRemoveChange | FlowAddChange<E> | FlowReplaceChange<E>;

/** The whole diagram, as `toJSON()` writes it and `fromJSON()` reads it. */
export interface FlowJSON<N extends FlowNode = FlowNode, E extends FlowEdge = FlowEdge> {
  nodes: N[];
  edges: E[];
  viewport: FlowViewport;
}
