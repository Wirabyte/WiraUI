/**
 * wt-flow: the decisions behind dragging, box selection, connecting and the keyboard, kept here (pure) so they are
 * tested once and the component only wires them to events.
 */
import { clampPosition, flowClamp, handlesCompatible, connectionBetween, getBoundsOfRects, snapPosition } from './geometry';
import { getNodesInside } from './graph';
import type { FlowSizeLookup } from './graph';
import type {
  FlowConnection,
  FlowConnectionMode,
  FlowCoordinateExtent,
  FlowDimensions,
  FlowEdge,
  FlowHandleType,
  FlowNode,
  FlowRect,
  FlowViewport,
  FlowXY,
} from './types';

// ---------- dragging ----------

/** A node taking part in a drag, as it was when the drag started. */
export interface FlowDragItem {
  id: string;
  /** Absolute position at the start. */
  start: FlowXY;
  size: FlowDimensions;
  /** Parent's absolute position and size (child nodes only). */
  parentPosition?: FlowXY | null;
  parentSize?: FlowDimensions | null;
  extent?: 'parent' | FlowCoordinateExtent | null;
  expandParent?: boolean;
}

export interface FlowDragOptions {
  /** Snap each node's position to this grid. */
  snapGrid?: readonly [number, number] | null;
  /** Where top-level nodes may go (flow coordinates). */
  nodeExtent?: FlowCoordinateExtent | null;
}

export interface FlowDragResult {
  /** Relative to the parent for child nodes. */
  position: FlowXY;
  absolute: FlowXY;
}

/**
 * Where each dragged node goes when the pointer has moved `delta` flow units: snapped to the grid, kept inside its
 * parent (`extent: 'parent'`; with `expandParent` only the top / left border holds, the parent grows the other way),
 * inside its own extent (relative to the parent for children) or the flow's `nodeExtent` (top-level nodes).
 */
export function dragPositions(items: readonly FlowDragItem[], delta: FlowXY, options: FlowDragOptions = {}): Map<string, FlowDragResult> {
  const out = new Map<string, FlowDragResult>();
  for (const it of items) {
    let abs = { x: it.start.x + delta.x, y: it.start.y + delta.y };
    if (options.snapGrid) abs = snapPosition(abs, options.snapGrid);
    const parent = it.parentPosition || null;
    let rel = parent ? { x: abs.x - parent.x, y: abs.y - parent.y } : abs;
    if (parent && it.extent === 'parent' && it.parentSize) {
      if (it.expandParent) rel = { x: Math.max(0, rel.x), y: Math.max(0, rel.y) };
      else
        rel = clampPosition(
          rel,
          [
            [0, 0],
            [it.parentSize.width, it.parentSize.height],
          ],
          it.size
        );
    } else if (Array.isArray(it.extent)) {
      rel = clampPosition(rel, it.extent, it.size);
    } else if (!parent && options.nodeExtent) {
      rel = clampPosition(rel, options.nodeExtent, it.size);
    }
    abs = parent ? { x: rel.x + parent.x, y: rel.y + parent.y } : rel;
    out.set(it.id, { position: { x: rel.x + 0, y: rel.y + 0 }, absolute: { x: abs.x + 0, y: abs.y + 0 } });
  }
  return out;
}

/** The size a parent needs to hold a child at `child` (relative) of `childSize`, or null when it fits. Grows right / down. */
export function parentGrowth(child: FlowXY, childSize: FlowDimensions, parentSize: FlowDimensions): FlowDimensions | null {
  const width = Math.max(parentSize.width, child.x + childSize.width);
  const height = Math.max(parentSize.height, child.y + childSize.height);
  return width > parentSize.width + 1e-9 || height > parentSize.height + 1e-9 ? { width, height } : null;
}

/** The pointer moved far enough (in screen px) to count as a drag rather than a click. */
export function pastThreshold(start: FlowXY, now: FlowXY, threshold: number): boolean {
  return Math.hypot(now.x - start.x, now.y - start.y) > Math.max(0, threshold);
}

// ---------- selection ----------

export interface FlowBoxSelectOptions {
  /** `'full'`: a node must lie wholly inside the box (default); `'partial'`: touching it is enough. */
  mode?: 'full' | 'partial';
  sizes?: FlowSizeLookup | null;
  /** Ids that stay selected whatever the box covers (Shift held when it started). */
  keep?: Iterable<string>;
  /** Whether a node / edge can be selected at all. */
  nodeSelectable?: (n: FlowNode) => boolean;
  edgeSelectable?: (e: FlowEdge) => boolean;
}

/** What a selection box covers: the nodes inside it, and the edges with both ends selected. */
export function boxSelection(nodes: readonly FlowNode[], edges: readonly FlowEdge[], rect: FlowRect, options: FlowBoxSelectOptions = {}): { nodes: Set<string>; edges: Set<string> } {
  const canNode = options.nodeSelectable || ((n: FlowNode) => n.selectable !== false);
  const canEdge = options.edgeSelectable || ((e: FlowEdge) => e.selectable !== false);
  const keep = new Set(options.keep || []);
  const picked = new Set<string>();
  for (const id of keep) picked.add(id);
  for (const n of getNodesInside(nodes, rect, { partially: options.mode === 'partial', sizes: options.sizes })) if (canNode(n)) picked.add(n.id);
  const nodeIds = new Set(nodes.filter((n) => picked.has(n.id)).map((n) => n.id));
  const edgeIds = new Set<string>();
  for (const e of edges) {
    if (keep.has(e.id) || (nodeIds.has(e.source) && nodeIds.has(e.target) && !e.hidden && canEdge(e))) edgeIds.add(e.id);
  }
  return { nodes: nodeIds, edges: edgeIds };
}

/**
 * A click on an item: with a multi-select key it toggles that item and keeps the rest; without, it becomes the only
 * selected item.
 */
export function clickSelection(selected: ReadonlySet<string>, id: string, multi: boolean): Set<string> {
  if (!multi) return new Set([id]);
  const next = new Set(selected);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

// ---------- connecting ----------

/** A handle as the connection logic sees it. */
export interface FlowConnectHandle {
  nodeId: string;
  id: string | null;
  type: FlowHandleType;
  /** The handle may start a connection / take one. Default true. */
  connectableStart?: boolean;
  connectableEnd?: boolean;
  /** Most edges the handle takes (null / 0 = no limit). */
  limit?: number | null;
}

/** Edges already attached to a handle (either end, for loose connections). */
export function handleConnectionCount(edges: readonly FlowEdge[], h: Pick<FlowConnectHandle, 'nodeId' | 'id' | 'type'>, ignoreEdgeId?: string | null): number {
  let count = 0;
  for (const e of edges) {
    if (ignoreEdgeId && e.id === ignoreEdgeId) continue;
    const atSource = e.source === h.nodeId && (e.sourceHandle ?? null) === (h.id ?? null);
    const atTarget = e.target === h.nodeId && (e.targetHandle ?? null) === (h.id ?? null);
    if ((h.type === 'source' && atSource) || (h.type === 'target' && atTarget)) count++;
  }
  return count;
}

/** A handle is full when it has `limit` edges already. */
export function handleIsFull(edges: readonly FlowEdge[], h: FlowConnectHandle, ignoreEdgeId?: string | null): boolean {
  const limit = typeof h.limit === 'number' && h.limit > 0 ? h.limit : 0;
  return limit > 0 && handleConnectionCount(edges, h, ignoreEdgeId) >= limit;
}

export interface FlowConnectRules {
  mode?: FlowConnectionMode;
  edges?: readonly FlowEdge[];
  /** The app's own rule. */
  isValidConnection?: ((c: FlowConnection) => boolean) | null;
  /** While reconnecting: the edge being moved (it does not count against limits or as a duplicate). */
  ignoreEdgeId?: string | null;
  /** Allow a second edge between the same two handles. Default false. */
  allowDuplicates?: boolean;
}

/**
 * The connection a drag from `from` would make by ending on `to`, or null when it may not: the same handle, two
 * sources in strict mode, a handle that does not take connections or is full, a link that is already there, or the
 * app's `isValidConnection` says no.
 */
export function validConnection(from: FlowConnectHandle, to: FlowConnectHandle, rules: FlowConnectRules = {}): FlowConnection | null {
  if (!handlesCompatible(from, to, rules.mode || 'strict')) return null;
  if (to.connectableEnd === false) return null;
  const edges = rules.edges || [];
  if (handleIsFull(edges, to, rules.ignoreEdgeId)) return null;
  const c = connectionBetween(from, to);
  if (!rules.allowDuplicates) {
    const dup = edges.some(
      (e) =>
        e.id !== rules.ignoreEdgeId &&
        e.source === c.source &&
        e.target === c.target &&
        (e.sourceHandle ?? null) === c.sourceHandle &&
        (e.targetHandle ?? null) === c.targetHandle
    );
    if (dup) return null;
  }
  if (rules.isValidConnection) {
    try {
      if (!rules.isValidConnection(c)) return null;
    } catch {
      return null;
    }
  }
  return c;
}

// ---------- stacking ----------

/**
 * An edge's stacking order: its `zIndex` (raised when selected, with `elevateOnSelect`), and for edges between nodes
 * inside groups at least the level of those nodes, so the edge is not hidden behind the group's box.
 */
export function edgeZIndex(edge: Pick<FlowEdge, 'zIndex' | 'selected'>, sourceZ: number, targetZ: number, nested: boolean, elevateOnSelect = false): number {
  let z = typeof edge.zIndex === 'number' && isFinite(edge.zIndex) ? edge.zIndex : 0;
  if (elevateOnSelect && edge.selected) z += 1000;
  if (nested) z = Math.max(z, sourceZ, targetZ);
  return z;
}

// ---------- keys ----------

/** A key matches one of `codes` (by `key`, or by `code` for letters on any keyboard layout). `null` matches nothing. */
export function keyMatches(e: { key: string; code?: string }, codes: string | readonly string[] | null | undefined): boolean {
  if (codes === null || codes === undefined) return false;
  const list = typeof codes === 'string' ? [codes] : codes;
  return list.some((c) => c === e.key || c === e.code || (c.length === 1 && e.code === 'Key' + c.toUpperCase()) || (c === 'Space' && e.key === ' '));
}

/** A multi-select modifier is held (Shift, Ctrl or ⌘ by default). */
export function multiKeyHeld(e: { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean }, keys: string | readonly string[] | null | undefined = ['Shift', 'Control', 'Meta']): boolean {
  if (!keys) return false;
  const list = typeof keys === 'string' ? [keys] : keys;
  return list.some((k) => (k === 'Shift' && !!e.shiftKey) || ((k === 'Control' || k === 'Ctrl') && !!e.ctrlKey) || ((k === 'Meta' || k === 'Cmd') && !!e.metaKey) || (k === 'Alt' && !!e.altKey));
}

/** Arrow keys as a step: `{ x, y }` in units of `step` (Shift = ten times), or null for any other key. */
export function arrowStep(e: { key: string; shiftKey?: boolean }, step = 5): FlowXY | null {
  const s = e.shiftKey ? step * 10 : step;
  switch (e.key) {
    case 'ArrowLeft':
      return { x: -s, y: 0 };
    case 'ArrowRight':
      return { x: s, y: 0 };
    case 'ArrowUp':
      return { x: 0, y: -s };
    case 'ArrowDown':
      return { x: 0, y: s };
    default:
      return null;
  }
}

/** The key event comes from somewhere the user is typing (an input, a text area, an editable element). */
export function isTypingTarget(target: unknown): boolean {
  const el = target as { tagName?: string; isContentEditable?: boolean; getAttribute?: (n: string) => string | null } | null;
  if (!el || typeof el.tagName !== 'string') return false;
  const tag = el.tagName.toLowerCase();
  if (tag === 'textarea' || tag === 'select') return true;
  if (tag === 'input') {
    const type = (el.getAttribute ? el.getAttribute('type') : '') || 'text';
    return !/^(button|checkbox|radio|range|submit|reset|color|file|image)$/i.test(type);
  }
  return !!el.isContentEditable;
}

// ---------- minimap ----------

export interface FlowMinimapLayout {
  /** The part of the flow the minimap shows, in flow coordinates (its SVG viewBox). */
  viewBox: FlowRect;
  /** Flow units per minimap pixel. */
  scale: number;
}

/**
 * What a minimap of `width` × `height` px shows: the nodes and the view, whole, centred, with `margin` px to spare.
 */
export function minimapLayout(content: FlowRect | null, view: FlowRect, width: number, height: number, margin = 5): FlowMinimapLayout {
  const all = getBoundsOfRects(content && content.width + content.height > 0 ? [content, view] : [view]) as FlowRect;
  const w = Math.max(1, width);
  const h = Math.max(1, height);
  const scale = Math.max(all.width / w, all.height / h, 1e-6);
  const vw = w * scale;
  const vh = h * scale;
  const pad = margin * scale;
  return {
    viewBox: { x: all.x - (vw - all.width) / 2 - pad, y: all.y - (vh - all.height) / 2 - pad, width: vw + pad * 2, height: vh + pad * 2 },
    scale: (vw + pad * 2) / w,
  };
}

/** The mask over everything but the view: an outer rectangle with the view cut out (fill-rule evenodd). */
export function minimapMaskPath(viewBox: FlowRect, view: FlowRect): string {
  const r = (n: number) => Math.round(n * 100) / 100 + 0;
  const o = viewBox;
  return (
    `M${r(o.x - o.width)},${r(o.y - o.height)}h${r(o.width * 3)}v${r(o.height * 3)}h${r(-o.width * 3)}z` +
    `M${r(view.x)},${r(view.y)}h${r(view.width)}v${r(view.height)}h${r(-view.width)}z`
  );
}

/** A point on the minimap (px from its top-left) in flow coordinates. */
export function minimapToFlow(p: FlowXY, layout: FlowMinimapLayout): FlowXY {
  return { x: layout.viewBox.x + p.x * layout.scale, y: layout.viewBox.y + p.y * layout.scale };
}

// ---------- background ----------

export type FlowBackgroundVariant = 'dots' | 'lines' | 'cross';

export interface FlowBackgroundPattern {
  /** Tile size and where the tiling starts, in screen px. */
  width: number;
  height: number;
  x: number;
  y: number;
  /** Dots: radius; lines / cross: path data (in tile coordinates). */
  radius: number;
  path: string;
}

/**
 * The repeating tile of a background for the viewport: dots, lines or crosses every `gap` flow units, lined up with the
 * flow's origin (plus `offset`), scaled with the zoom.
 */
export function backgroundPattern(vp: FlowViewport, variant: FlowBackgroundVariant, gap: number | readonly [number, number] = 20, size?: number, offset: number | readonly [number, number] = 0): FlowBackgroundPattern {
  const [gx0, gy0] = typeof gap === 'number' ? [gap, gap] : gap;
  const [ox, oy] = typeof offset === 'number' ? [offset, offset] : offset;
  const gx = Math.max(1, gx0) * vp.zoom;
  const gy = Math.max(1, gy0) * vp.zoom;
  const mod = (a: number, m: number) => ((a % m) + m) % m;
  const x = mod(vp.x + ox * vp.zoom, gx) - gx / 2;
  const y = mod(vp.y + oy * vp.zoom, gy) - gy / 2;
  const cx = gx / 2;
  const cy = gy / 2;
  const r = (n: number) => Math.round(n * 1000) / 1000 + 0;
  if (variant === 'lines') {
    return { width: gx, height: gy, x, y, radius: 0, path: `M${r(cx)},0V${r(gy)}M0,${r(cy)}H${r(gx)}` };
  }
  if (variant === 'cross') {
    const s = (typeof size === 'number' && size > 0 ? size : 6) * vp.zoom * 0.5;
    const half = Math.min(s, gx / 2, gy / 2);
    return { width: gx, height: gy, x, y, radius: 0, path: `M${r(cx - half)},${r(cy)}H${r(cx + half)}M${r(cx)},${r(cy - half)}V${r(cy + half)}` };
  }
  const dot = typeof size === 'number' && size > 0 ? size : 1;
  return { width: gx, height: gy, x, y, radius: Math.max(0.5, flowClamp((dot * vp.zoom) / 2, 0, Math.min(gx, gy) / 2)), path: '' };
}
