/** wu-flow: rectangles, snapping, extents, handle points, hit-testing, alignment guides and the resizer's maths. */
import type {
  FlowBox,
  FlowConnectionMode,
  FlowCoordinateExtent,
  FlowDimensions,
  FlowHandleBounds,
  FlowHandleType,
  FlowPosition,
  FlowRect,
  FlowXY,
} from './types';

export const flowClamp = (v: number, lo: number, hi: number): number => (hi < lo ? lo : Math.min(hi, Math.max(lo, v)));

const finite = (v: unknown, fallback = 0): number => (typeof v === 'number' && isFinite(v) ? v : fallback);

// ---------- rectangles ----------

export function rectToBox(r: FlowRect): FlowBox {
  return { x: r.x, y: r.y, x2: r.x + r.width, y2: r.y + r.height };
}

export function boxToRect(b: FlowBox): FlowRect {
  return { x: b.x, y: b.y, width: b.x2 - b.x, height: b.y2 - b.y };
}

/** The smallest rectangle holding every rectangle given; `null` for none. */
export function getBoundsOfRects(rects: readonly FlowRect[]): FlowRect | null {
  if (!rects.length) return null;
  let x = Infinity;
  let y = Infinity;
  let x2 = -Infinity;
  let y2 = -Infinity;
  for (const r of rects) {
    x = Math.min(x, r.x);
    y = Math.min(y, r.y);
    x2 = Math.max(x2, r.x + r.width);
    y2 = Math.max(y2, r.y + r.height);
  }
  return { x, y, width: x2 - x, height: y2 - y };
}

/** The rectangle between two corners, whichever way round (a selection box dragged up and left). */
export function rectFromPoints(a: FlowXY, b: FlowXY): FlowRect {
  return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), width: Math.abs(a.x - b.x), height: Math.abs(a.y - b.y) };
}

/** Area the two rectangles share (0 when they only touch). */
export function overlapArea(a: FlowRect, b: FlowRect): number {
  const w = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
}

/** `inner` lies wholly inside `outer` (edges may touch). */
export function rectContains(outer: FlowRect, inner: FlowRect): boolean {
  return inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.width <= outer.x + outer.width && inner.y + inner.height <= outer.y + outer.height;
}

/** The rectangles overlap or touch. A zero-size rectangle (an unmeasured node) counts when it lies on or in the other. */
export function rectsIntersect(a: FlowRect, b: FlowRect): boolean {
  return a.x <= b.x + b.width && b.x <= a.x + a.width && a.y <= b.y + b.height && b.y <= a.y + a.height;
}

export function pointInRect(p: FlowXY, r: FlowRect): boolean {
  return p.x >= r.x && p.x <= r.x + r.width && p.y >= r.y && p.y <= r.y + r.height;
}

export function expandRect(r: FlowRect, by: number): FlowRect {
  return { x: r.x - by, y: r.y - by, width: r.width + by * 2, height: r.height + by * 2 };
}

export function rectCenter(r: FlowRect): FlowXY {
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
}

// ---------- snapping and extents ----------

/** Rounds a position to the grid (`[15, 15]` = every 15 flow units). A grid step of 0 or less leaves that axis alone. */
export function snapPosition(p: FlowXY, grid: readonly [number, number] | number): FlowXY {
  const [gx, gy] = typeof grid === 'number' ? [grid, grid] : grid;
  return {
    x: gx > 0 ? Math.round(p.x / gx) * gx + 0 : p.x,
    y: gy > 0 ? Math.round(p.y / gy) * gy + 0 : p.y,
  };
}

/**
 * Keeps a box of `size` with its top-left at `p` inside `extent`. A box larger than the extent sticks to its top-left.
 * No extent: unchanged.
 */
export function clampPosition(p: FlowXY, extent: FlowCoordinateExtent | null | undefined, size: FlowDimensions = { width: 0, height: 0 }): FlowXY {
  if (!extent) return { x: p.x, y: p.y };
  const [[x1, y1], [x2, y2]] = extent;
  return {
    x: flowClamp(p.x, x1, x2 - size.width),
    y: flowClamp(p.y, y1, y2 - size.height),
  };
}

/** A well-formed extent from app input (`[[x1, y1], [x2, y2]]`), else null. Infinite values are allowed. */
export function normalizeExtent(v: unknown): FlowCoordinateExtent | null {
  if (!Array.isArray(v) || v.length !== 2 || !Array.isArray(v[0]) || !Array.isArray(v[1])) return null;
  const nums = [v[0][0], v[0][1], v[1][0], v[1][1]].map(Number);
  if (nums.some((n) => isNaN(n))) return null;
  const [a, b, c, d] = nums;
  return [
    [Math.min(a, c), Math.min(b, d)],
    [Math.max(a, c), Math.max(b, d)],
  ];
}

// ---------- handles ----------

/** The way out of a handle on `position`, as a unit vector. */
export function positionVector(position: FlowPosition): FlowXY {
  switch (position) {
    case 'top':
      return { x: 0, y: -1 };
    case 'bottom':
      return { x: 0, y: 1 };
    case 'left':
      return { x: -1, y: 0 };
    default:
      return { x: 1, y: 0 };
  }
}

export function oppositePosition(position: FlowPosition): FlowPosition {
  return position === 'top' ? 'bottom' : position === 'bottom' ? 'top' : position === 'left' ? 'right' : 'left';
}

export function isFlowPosition(v: unknown): v is FlowPosition {
  return v === 'top' || v === 'right' || v === 'bottom' || v === 'left';
}

/**
 * Where an edge meets a handle: centred on the handle, on its outer side (the side facing away from the node), so an
 * arrowhead stays visible next to the dot. `node` is the node's absolute top-left.
 */
export function handlePoint(node: FlowXY, handle: Pick<FlowHandleBounds, 'x' | 'y' | 'width' | 'height' | 'position'>): FlowXY {
  const cx = node.x + handle.x + handle.width / 2;
  const cy = node.y + handle.y + handle.height / 2;
  switch (handle.position) {
    case 'top':
      return { x: cx, y: node.y + handle.y };
    case 'bottom':
      return { x: cx, y: node.y + handle.y + handle.height };
    case 'left':
      return { x: node.x + handle.x, y: cy };
    default:
      return { x: node.x + handle.x + handle.width, y: cy };
  }
}

/** The middle of a node's side: where an edge attaches to a node that has no handle of the type it needs. */
export function sidePoint(rect: FlowRect, position: FlowPosition): FlowXY {
  switch (position) {
    case 'top':
      return { x: rect.x + rect.width / 2, y: rect.y };
    case 'bottom':
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height };
    case 'left':
      return { x: rect.x, y: rect.y + rect.height / 2 };
    default:
      return { x: rect.x + rect.width, y: rect.y + rect.height / 2 };
  }
}

/** A handle of a node, with the node it is on and its centre in flow coordinates (for hit-testing). */
export interface FlowHandleRef {
  nodeId: string;
  id: string | null;
  type: FlowHandleType;
  position: FlowPosition;
  /** Centre of the handle in flow coordinates. */
  x: number;
  y: number;
}

/** The handle on `nodeId` with `id` (any handle of `type` when id is null), else null. */
export function findHandle<H extends { id: string | null; type: FlowHandleType }>(handles: readonly H[], id: string | null | undefined, type?: FlowHandleType): H | null {
  const want = id === undefined || id === '' ? null : id;
  if (want === null) {
    return (type ? handles.find((h) => h.type === type) : handles[0]) || null;
  }
  return handles.find((h) => h.id === want && (!type || h.type === type)) || handles.find((h) => h.id === want) || null;
}

/** Same handle (node, id and type). */
export function sameHandle(a: Pick<FlowHandleRef, 'nodeId' | 'id' | 'type'> | null | undefined, b: Pick<FlowHandleRef, 'nodeId' | 'id' | 'type'> | null | undefined): boolean {
  return !!a && !!b && a.nodeId === b.nodeId && (a.id ?? null) === (b.id ?? null) && a.type === b.type;
}

/**
 * Whether a connection dragged from `from` may end on `to`: never the same handle; in strict mode only a source onto a
 * target (or the other way round); in loose mode anything else.
 */
export function handlesCompatible(from: Pick<FlowHandleRef, 'nodeId' | 'id' | 'type'>, to: Pick<FlowHandleRef, 'nodeId' | 'id' | 'type'>, mode: FlowConnectionMode = 'strict'): boolean {
  if (sameHandle(from, to)) return false;
  return mode === 'loose' ? true : from.type !== to.type;
}

/**
 * The connection between two handles, the source end first: dragging from a target handle makes the handle it ends on
 * the source.
 */
export function connectionBetween(from: Pick<FlowHandleRef, 'nodeId' | 'id' | 'type'>, to: Pick<FlowHandleRef, 'nodeId' | 'id' | 'type'>): { source: string; sourceHandle: string | null; target: string; targetHandle: string | null } {
  return from.type === 'source'
    ? { source: from.nodeId, sourceHandle: from.id ?? null, target: to.nodeId, targetHandle: to.id ?? null }
    : { source: to.nodeId, sourceHandle: to.id ?? null, target: from.nodeId, targetHandle: from.id ?? null };
}

/**
 * The nearest handle to `p` within `radius` (flow units) that `accept` takes, or null. Ties go to the handle listed first.
 */
export function nearestHandle<H extends { x: number; y: number }>(p: FlowXY, handles: readonly H[], radius: number, accept?: (h: H) => boolean): H | null {
  let best: H | null = null;
  let bestD = radius;
  for (const h of handles) {
    const d = Math.hypot(h.x - p.x, h.y - p.y);
    if (d <= bestD && (!accept || accept(h))) {
      if (!best || d < bestD) {
        best = h;
        bestD = d;
      }
    }
  }
  return best;
}

// ---------- auto-pan ----------

/**
 * How far to pan per frame while a drag is near the pane's border: up to `speed` px, more the closer to the border
 * (within `margin` px). The pane moves the other way so what is under the pointer keeps up. `p` and `pane` are in screen
 * pixels relative to the pane.
 */
export function autoPanVelocity(p: FlowXY, pane: FlowDimensions, speed = 15, margin = 40): FlowXY {
  const axis = (v: number, size: number): number => {
    if (size <= margin * 2) return 0;
    if (v < margin) return (flowClamp(margin - v, 0, margin) / margin) * speed;
    if (v > size - margin) return -(flowClamp(v - (size - margin), 0, margin) / margin) * speed;
    return 0;
  };
  return { x: axis(p.x, pane.width) + 0, y: axis(p.y, pane.height) + 0 };
}

// ---------- alignment guides ----------

/** A guide line drawn while dragging: vertical (`x`, from `from` to `to` on y) or horizontal (`y`, from / to on x). */
export interface FlowGuide {
  orientation: 'vertical' | 'horizontal';
  /** x of a vertical guide, y of a horizontal one. */
  at: number;
  from: number;
  to: number;
}

export interface FlowAlignment {
  /** Move the dragged box by this much to line it up (0 when nothing is close enough). */
  dx: number;
  dy: number;
  guides: FlowGuide[];
}

/**
 * Lines a dragged box up with the others: the nearest left / centre / right (and top / middle / bottom) edge within
 * `threshold` wins on each axis. Returns the nudge and the guide lines to draw (spanning both boxes).
 */
export function alignmentGuides(moving: FlowRect, others: readonly FlowRect[], threshold: number): FlowAlignment {
  const xs = (r: FlowRect) => [r.x, r.x + r.width / 2, r.x + r.width];
  const ys = (r: FlowRect) => [r.y, r.y + r.height / 2, r.y + r.height];
  let bestX: { d: number; other: FlowRect; at: number } | null = null;
  let bestY: { d: number; other: FlowRect; at: number } | null = null;
  const mx = xs(moving);
  const my = ys(moving);
  for (const o of others) {
    for (const a of mx) {
      for (const b of xs(o)) {
        const d = b - a;
        if (Math.abs(d) <= threshold && (!bestX || Math.abs(d) < Math.abs(bestX.d))) bestX = { d, other: o, at: b };
      }
    }
    for (const a of my) {
      for (const b of ys(o)) {
        const d = b - a;
        if (Math.abs(d) <= threshold && (!bestY || Math.abs(d) < Math.abs(bestY.d))) bestY = { d, other: o, at: b };
      }
    }
  }
  const dx = bestX ? bestX.d : 0;
  const dy = bestY ? bestY.d : 0;
  const moved: FlowRect = { x: moving.x + dx, y: moving.y + dy, width: moving.width, height: moving.height };
  const guides: FlowGuide[] = [];
  if (bestX) {
    guides.push({
      orientation: 'vertical',
      at: bestX.at,
      from: Math.min(moved.y, bestX.other.y),
      to: Math.max(moved.y + moved.height, bestX.other.y + bestX.other.height),
    });
  }
  if (bestY) {
    guides.push({
      orientation: 'horizontal',
      at: bestY.at,
      from: Math.min(moved.x, bestY.other.x),
      to: Math.max(moved.x + moved.width, bestY.other.x + bestY.other.width),
    });
  }
  return { dx: dx + 0, dy: dy + 0, guides };
}

// ---------- resizer ----------

/** Which corner or side of the resizer is being dragged. */
export type FlowResizeDirection = 'top-left' | 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left';

export interface FlowResizeLimits {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  /** Keep the starting width / height ratio. */
  keepAspectRatio?: boolean;
}

/**
 * The box after dragging the resizer's `direction` handle by (dx, dy) flow units from `start`. The opposite corner or
 * side stays put; sizes stay within the limits (min 10 × 10 by default) and the ratio holds with `keepAspectRatio`.
 */
export function resizeBox(start: FlowRect, direction: FlowResizeDirection, dx: number, dy: number, limits: FlowResizeLimits = {}): FlowRect {
  const minW = Math.max(1, finite(limits.minWidth, 10));
  const minH = Math.max(1, finite(limits.minHeight, 10));
  const maxW = Math.max(minW, finite(limits.maxWidth, Infinity) || Infinity);
  const maxH = Math.max(minH, finite(limits.maxHeight, Infinity) || Infinity);
  const left = direction.includes('left');
  const right = direction.includes('right');
  const top = direction.startsWith('top');
  const bottom = direction.startsWith('bottom');
  let w = start.width + (right ? dx : left ? -dx : 0);
  let h = start.height + (bottom ? dy : top ? -dy : 0);
  if (limits.keepAspectRatio && start.width > 0 && start.height > 0) {
    const ratio = start.width / start.height;
    const horizontal = left || right;
    const vertical = top || bottom;
    if (horizontal && vertical) {
      // A corner follows whichever way the pointer moved further.
      if (Math.abs(w - start.width) / start.width >= Math.abs(h - start.height) / start.height) h = w / ratio;
      else w = h * ratio;
    } else if (horizontal) h = w / ratio;
    else w = h * ratio;
    // Clamp the pair together so the ratio survives the limits.
    const lo = Math.max(minW / w, minH / h);
    if (lo > 1) {
      w *= lo;
      h *= lo;
    }
    const hi = Math.min(maxW / w, maxH / h);
    if (hi < 1) {
      w *= hi;
      h *= hi;
    }
  } else {
    w = flowClamp(w, minW, maxW);
    h = flowClamp(h, minH, maxH);
  }
  // A side without a horizontal / vertical part (top, bottom / left, right) grows the other way from the centre line
  // only when the ratio forces it; keep that growth centred.
  let x = left ? start.x + start.width - w : start.x;
  let y = top ? start.y + start.height - h : start.y;
  if (limits.keepAspectRatio && !(left || right)) x = start.x + (start.width - w) / 2;
  if (limits.keepAspectRatio && !(top || bottom)) y = start.y + (start.height - h) / 2;
  return { x: x + 0, y: y + 0, width: w, height: h };
}
