/**
 * wu-flow: edge shapes as SVG path data. Every function returns `[path, labelX, labelY, offsetX, offsetY]`: the `d`
 * attribute, where the label goes (the middle of the edge), and how far that is from the source on each axis.
 */
import { positionVector } from './geometry';
import type { FlowPosition, FlowXY } from './types';

export type FlowPathResult = [path: string, labelX: number, labelY: number, offsetX: number, offsetY: number];

export interface FlowPathParams {
  sourceX: number;
  sourceY: number;
  /** Which way the edge leaves the source. Default `'bottom'`. */
  sourcePosition?: FlowPosition;
  targetX: number;
  targetY: number;
  /** Which way the edge enters the target (the side of the target handle). Default `'top'`. */
  targetPosition?: FlowPosition;
}

export interface FlowBezierParams extends FlowPathParams {
  /** How far the curve swings out when the target lies behind the source. Default 0.25. */
  curvature?: number;
}

export interface FlowSmoothStepParams extends FlowPathParams {
  /** Corner radius. Default 5; 0 draws square corners (the `step` edge). */
  borderRadius?: number;
  /** How far the edge runs straight out of each handle before turning. Default 20. */
  offset?: number;
  /** Where the middle segment runs (default: halfway between the ends). */
  centerX?: number;
  centerY?: number;
}

/** Up to 3 decimals, no `-0`: short, stable path strings. */
export function fmt(n: number): string {
  const r = Math.round(n * 1000) / 1000;
  return String(r === 0 ? 0 : r);
}

const pt = (p: FlowXY) => `${fmt(p.x)},${fmt(p.y)}`;

function result(path: string, label: FlowXY, sx: number, sy: number): FlowPathResult {
  return [path, label.x, label.y, Math.abs(label.x - sx), Math.abs(label.y - sy)];
}

/** The middle of a straight line between the ends, with its offsets from the source. */
export function getEdgeCenter(sourceX: number, sourceY: number, targetX: number, targetY: number): [number, number, number, number] {
  const cx = (sourceX + targetX) / 2;
  const cy = (sourceY + targetY) / 2;
  return [cx, cy, Math.abs(cx - sourceX), Math.abs(cy - sourceY)];
}

export function getStraightPath(p: FlowPathParams): FlowPathResult {
  const [cx, cy] = getEdgeCenter(p.sourceX, p.sourceY, p.targetX, p.targetY);
  return result(`M${fmt(p.sourceX)},${fmt(p.sourceY)} L${fmt(p.targetX)},${fmt(p.targetY)}`, { x: cx, y: cy }, p.sourceX, p.sourceY);
}

/** A point on a cubic curve. */
export function cubicPoint(p0: FlowXY, p1: FlowXY, p2: FlowXY, p3: FlowXY, t: number): FlowXY {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return { x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y };
}

/**
 * The control point of a curve leaving (x, y) towards `other` on `position`: half the distance ahead along the handle's
 * direction, or (when `other` is behind) a swing that grows with the square root of how far behind it is.
 */
function bezierControl(position: FlowPosition, from: FlowXY, other: FlowXY, curvature: number): FlowXY {
  const dir = positionVector(position);
  const ahead = (other.x - from.x) * dir.x + (other.y - from.y) * dir.y;
  const reach = ahead >= 0 ? ahead / 2 : curvature * 25 * Math.sqrt(-ahead);
  return { x: from.x + dir.x * reach, y: from.y + dir.y * reach };
}

export function getBezierPath(p: FlowBezierParams): FlowPathResult {
  const s = { x: p.sourceX, y: p.sourceY };
  const t = { x: p.targetX, y: p.targetY };
  const curvature = typeof p.curvature === 'number' && isFinite(p.curvature) ? p.curvature : 0.25;
  const c1 = bezierControl(p.sourcePosition || 'bottom', s, t, curvature);
  const c2 = bezierControl(p.targetPosition || 'top', t, s, curvature);
  const label = cubicPoint(s, c1, c2, t, 0.5);
  return result(`M${pt(s)} C${pt(c1)} ${pt(c2)} ${pt(t)}`, label, s.x, s.y);
}

/** A bezier whose control points sit halfway between the ends along each handle's axis: a gentler S-curve. */
export function getSimpleBezierPath(p: FlowPathParams): FlowPathResult {
  const s = { x: p.sourceX, y: p.sourceY };
  const t = { x: p.targetX, y: p.targetY };
  const control = (pos: FlowPosition, from: FlowXY): FlowXY =>
    pos === 'left' || pos === 'right' ? { x: (s.x + t.x) / 2, y: from.y } : { x: from.x, y: (s.y + t.y) / 2 };
  const c1 = control(p.sourcePosition || 'bottom', s);
  const c2 = control(p.targetPosition || 'top', t);
  const label = cubicPoint(s, c1, c2, t, 0.5);
  return result(`M${pt(s)} C${pt(c1)} ${pt(c2)} ${pt(t)}`, label, s.x, s.y);
}

const samePoint = (a: FlowXY, b: FlowXY) => Math.abs(a.x - b.x) < 1e-9 && Math.abs(a.y - b.y) < 1e-9;

/** Drops repeated points and the middle of three points on one line. */
export function simplifyPolyline(points: readonly FlowXY[]): FlowXY[] {
  const out: FlowXY[] = [];
  for (const p of points) {
    if (out.length && samePoint(out[out.length - 1], p)) continue;
    if (out.length >= 2) {
      const a = out[out.length - 2];
      const b = out[out.length - 1];
      const cross = (b.x - a.x) * (p.y - b.y) - (b.y - a.y) * (p.x - b.x);
      const sameWay = (b.x - a.x) * (p.x - b.x) + (b.y - a.y) * (p.y - b.y) >= 0;
      if (Math.abs(cross) < 1e-9 && sameWay) {
        out[out.length - 1] = p;
        continue;
      }
    }
    out.push({ x: p.x, y: p.y });
  }
  return out;
}

/**
 * The corner points of a right-angled route from the source to the target. It leaves the source along its handle's
 * direction and enters the target against the target handle's direction; when the ends face each other it turns once
 * in the middle, otherwise it first runs `offset` out of each handle so it never doubles back over a node's side.
 */
export function getStepPoints(p: FlowSmoothStepParams): FlowXY[] {
  const s = { x: p.sourceX, y: p.sourceY };
  const t = { x: p.targetX, y: p.targetY };
  const sp = p.sourcePosition || 'bottom';
  const tp = p.targetPosition || 'top';
  const offset = typeof p.offset === 'number' && isFinite(p.offset) ? Math.max(0, p.offset) : 20;
  const ds = positionVector(sp);
  const dt = positionVector(tp);
  const s1 = { x: s.x + ds.x * offset, y: s.y + ds.y * offset };
  const t1 = { x: t.x + dt.x * offset, y: t.y + dt.y * offset };
  const horizontalS = ds.x !== 0;
  const horizontalT = dt.x !== 0;
  const cx = typeof p.centerX === 'number' && isFinite(p.centerX) ? p.centerX : (s.x + t.x) / 2;
  const cy = typeof p.centerY === 'number' && isFinite(p.centerY) ? p.centerY : (s.y + t.y) / 2;
  let points: FlowXY[];
  if (horizontalS === horizontalT) {
    const facing = horizontalS ? ds.x === -dt.x : ds.y === -dt.y;
    if (facing) {
      // How far the target lies ahead of the source, along the source's direction.
      const ahead = horizontalS ? (t.x - s.x) * ds.x : (t.y - s.y) * ds.y;
      if (ahead >= 0) {
        points = horizontalS ? [s, { x: cx, y: s.y }, { x: cx, y: t.y }, t] : [s, { x: s.x, y: cy }, { x: t.x, y: cy }, t];
      } else {
        // The target is behind: out of the source, across in the middle, round into the target.
        points = horizontalS
          ? [s, s1, { x: s1.x, y: cy }, { x: t1.x, y: cy }, t1, t]
          : [s, s1, { x: cx, y: s1.y }, { x: cx, y: t1.y }, t1, t];
      }
    } else {
      // Both handles face the same way: run out past the further one, across, and back in.
      if (horizontalS) {
        const x = ds.x > 0 ? Math.max(s1.x, t1.x) : Math.min(s1.x, t1.x);
        points = [s, { x, y: s.y }, { x, y: t.y }, t];
      } else {
        const y = ds.y > 0 ? Math.max(s1.y, t1.y) : Math.min(s1.y, t1.y);
        points = [s, { x: s.x, y }, { x: t.x, y }, t];
      }
    }
  } else {
    // One horizontal, one vertical: a single corner when it lies ahead of the source and on the outer side of the target.
    const corner = horizontalS ? { x: t.x, y: s.y } : { x: s.x, y: t.y };
    const aheadOfSource = (corner.x - s.x) * ds.x + (corner.y - s.y) * ds.y > 0;
    const outsideTarget = (corner.x - t.x) * dt.x + (corner.y - t.y) * dt.y > 0;
    if (aheadOfSource && outsideTarget) points = [s, corner, t];
    else points = [s, s1, horizontalS ? { x: s1.x, y: t1.y } : { x: t1.x, y: s1.y }, t1, t];
  }
  return simplifyPolyline(points);
}

/** Total length of a polyline and the point halfway along it. */
export function polylineMidpoint(points: readonly FlowXY[]): FlowXY {
  if (!points.length) return { x: 0, y: 0 };
  if (points.length === 1) return { ...points[0] };
  let total = 0;
  for (let i = 1; i < points.length; i++) total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  let half = total / 2;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (half <= len && len > 0) {
      const k = half / len;
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
    }
    half -= len;
  }
  return { ...points[points.length - 1] };
}

/** Path data through `points` with each corner rounded by up to `radius` (less where the segments are short). */
export function roundedPolylinePath(points: readonly FlowXY[], radius: number): string {
  if (!points.length) return '';
  let d = `M${pt(points[0])}`;
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1];
    const p = points[i];
    const b = points[i + 1];
    const lenIn = Math.hypot(p.x - a.x, p.y - a.y);
    const lenOut = Math.hypot(b.x - p.x, b.y - p.y);
    const r = Math.max(0, Math.min(radius, lenIn / 2, lenOut / 2));
    if (r <= 0 || lenIn === 0 || lenOut === 0) {
      d += ` L${pt(p)}`;
      continue;
    }
    const start = { x: p.x - ((p.x - a.x) / lenIn) * r, y: p.y - ((p.y - a.y) / lenIn) * r };
    const end = { x: p.x + ((b.x - p.x) / lenOut) * r, y: p.y + ((b.y - p.y) / lenOut) * r };
    d += ` L${pt(start)} Q${pt(p)} ${pt(end)}`;
  }
  if (points.length > 1) d += ` L${pt(points[points.length - 1])}`;
  return d;
}

export function getSmoothStepPath(p: FlowSmoothStepParams): FlowPathResult {
  const points = getStepPoints(p);
  const radius = typeof p.borderRadius === 'number' && isFinite(p.borderRadius) ? Math.max(0, p.borderRadius) : 5;
  return result(roundedPolylinePath(points, radius), polylineMidpoint(points), p.sourceX, p.sourceY);
}

/** `smoothstep` with square corners. */
export function getStepPath(p: FlowSmoothStepParams): FlowPathResult {
  return getSmoothStepPath({ ...p, borderRadius: 0 });
}

/** The built-in edge shapes. */
export const FLOW_EDGE_TYPES: readonly string[] = ['default', 'bezier', 'straight', 'step', 'smoothstep', 'simplebezier'];

/**
 * The path for an edge of `type` (unknown types, such as custom templates, get the bezier the template can use or
 * ignore). `options` carries `curvature`, `borderRadius` and `offset`.
 */
/**
 * `getEdgePath()` with room for arrowheads. A marker is drawn along the path's last (or first) few pixels, turned only
 * to the very end's direction, so on a curve that still bends there the line sticks out of the arrow's side. Curved
 * edges therefore stop `room.end` px before the target, out along its handle, and run straight in (the same at the
 * source with `room.start`): the arrowhead lies on a straight piece, and the curve meets it without a kink because it
 * already ends in that direction. Straight and right-angled edges already end straight and are left as they are.
 */
export function getEdgePathWithRoom(
  type: string | null | undefined,
  p: FlowPathParams,
  options: { curvature?: number; borderRadius?: number; offset?: number } = {},
  room: { start?: number; end?: number } = {}
): FlowPathResult {
  const curved = !type || type === 'default' || type === 'bezier' || type === 'simplebezier';
  const span = Math.hypot(p.targetX - p.sourceX, p.targetY - p.sourceY);
  // Never more than a third of the edge each, so short edges keep a curve.
  const start = curved ? Math.min(Math.max(0, room.start || 0), span / 3) : 0;
  const end = curved ? Math.min(Math.max(0, room.end || 0), span / 3) : 0;
  if (!start && !end) return getEdgePath(type, p, options);
  const ds = positionVector(p.sourcePosition || 'bottom');
  const dt = positionVector(p.targetPosition || 'top');
  const inner: FlowPathParams = {
    ...p,
    sourceX: p.sourceX + ds.x * start,
    sourceY: p.sourceY + ds.y * start,
    targetX: p.targetX + dt.x * end,
    targetY: p.targetY + dt.y * end,
  };
  const [path] = getEdgePath(type, inner, options);
  // The label stays where it is without arrowheads: the middle of the whole edge.
  const [, lx, ly] = getEdgePath(type, p, options);
  let d = path;
  if (start) d = `M${fmt(p.sourceX)},${fmt(p.sourceY)} L${d.slice(1)}`;
  if (end) d += ` L${fmt(p.targetX)},${fmt(p.targetY)}`;
  return [d, lx, ly, Math.abs(lx - p.sourceX), Math.abs(ly - p.sourceY)];
}

export function getEdgePath(type: string | null | undefined, p: FlowPathParams, options: { curvature?: number; borderRadius?: number; offset?: number } = {}): FlowPathResult {
  switch (type) {
    case 'straight':
      return getStraightPath(p);
    case 'step':
      return getStepPath({ ...p, offset: options.offset });
    case 'smoothstep':
      return getSmoothStepPath({ ...p, borderRadius: options.borderRadius, offset: options.offset });
    case 'simplebezier':
      return getSimpleBezierPath(p);
    default:
      return getBezierPath({ ...p, curvature: options.curvature });
  }
}
