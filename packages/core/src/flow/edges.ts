/** wt-flow: where an edge starts and ends, and its arrowheads. */
import { findHandle, handlePoint, isFlowPosition, sidePoint } from './geometry';
import type { FlowEdge, FlowEdgeMarker, FlowMarker, FlowNode, FlowNodeHandles, FlowPosition, FlowRect } from './types';

export interface FlowEdgeEnds {
  sourceX: number;
  sourceY: number;
  sourcePosition: FlowPosition;
  targetX: number;
  targetY: number;
  targetPosition: FlowPosition;
  /** The edge used the handle it names (false: it fell back to the middle of the node's side). */
  sourceHandleFound: boolean;
  targetHandleFound: boolean;
}

/** A node as the edge sees it: the node, its box in flow coordinates and its measured handles. */
export interface FlowEdgeEndNode {
  node: FlowNode;
  rect: FlowRect;
  handles?: FlowNodeHandles | null;
}

function end(n: FlowEdgeEndNode, handleId: string | null | undefined, type: 'source' | 'target'): { x: number; y: number; position: FlowPosition; found: boolean } {
  const h = n.handles;
  const list = h ? [...(type === 'source' ? h.source : h.target), ...(type === 'source' ? h.target : h.source)] : [];
  // A named handle is looked for among both kinds (loose connections end on either); no name takes the first of the kind.
  const handle = handleId ? findHandle(list, handleId) : findHandle(type === 'source' ? (h ? h.source : []) : h ? h.target : [], null);
  if (handle) {
    const p = handlePoint(n.rect, handle);
    return { x: p.x, y: p.y, position: handle.position, found: true };
  }
  const fallback = type === 'source' ? n.node.sourcePosition : n.node.targetPosition;
  const position: FlowPosition = isFlowPosition(fallback) ? fallback : type === 'source' ? 'bottom' : 'top';
  const p = sidePoint(n.rect, position);
  return { x: p.x, y: p.y, position, found: false };
}

/**
 * The two ends of an edge: at the named handles (centred on each, on its outer side), else at the first handle of the
 * right kind, else in the middle of the node's `sourcePosition` / `targetPosition` side (bottom / top by default).
 */
export function getEdgeEnds(edge: Pick<FlowEdge, 'sourceHandle' | 'targetHandle'>, source: FlowEdgeEndNode, target: FlowEdgeEndNode): FlowEdgeEnds {
  const s = end(source, edge.sourceHandle, 'source');
  const t = end(target, edge.targetHandle, 'target');
  return {
    sourceX: s.x,
    sourceY: s.y,
    sourcePosition: s.position,
    targetX: t.x,
    targetY: t.y,
    targetPosition: t.position,
    sourceHandleFound: s.found,
    targetHandleFound: t.found,
  };
}

/** A marker with every field filled in (`color` stays undefined: the edge's own stroke colour). */
export interface FlowResolvedMarker {
  type: 'arrow' | 'arrowclosed';
  color: string | undefined;
  width: number;
  height: number;
  strokeWidth: number;
}

/** `'arrow'` / `'arrowclosed'` / `{ type, color, … }` with defaults, or null for none. */
export function normalizeMarker(marker: FlowMarker | null | undefined): FlowResolvedMarker | null {
  if (!marker) return null;
  const m: FlowEdgeMarker = typeof marker === 'string' ? { type: marker } : marker;
  if (m.type !== 'arrow' && m.type !== 'arrowclosed') return null;
  const n = (v: unknown, d: number) => (typeof v === 'number' && isFinite(v) && v > 0 ? v : d);
  return {
    type: m.type,
    color: typeof m.color === 'string' && m.color ? m.color : undefined,
    width: n(m.width, 14),
    height: n(m.height, 14),
    strokeWidth: n(m.strokeWidth, 1.5),
  };
}

/** A stable element id for a marker (one `<marker>` per distinct look). */
export function markerId(prefix: string, m: FlowResolvedMarker): string {
  const colour = (m.color || 'currentColor').replace(/[^a-zA-Z0-9]+/g, '_');
  return `${prefix}-${m.type}-${colour}-${m.width}x${m.height}-${m.strokeWidth}`.replace(/\./g, '_');
}

/**
 * The arrowhead drawn inside a marker: a 20 × 20 box with the tip at (17, 10), pointing along the edge — short and
 * wide with rounded corners (the path is stroked with round joins), so it reads as part of the line. The closed
 * arrow is filled; the open one is a stroked chevron.
 */
export const FLOW_MARKER_VIEWBOX = '0 0 20 20';
export const FLOW_MARKER_REF = { x: 17, y: 10 };

/** How far back from the end of its edge an arrowhead reaches, in px (a little more, so the curve joins behind it). */
export function markerLength(marker: FlowMarker | null | undefined): number {
  const m = normalizeMarker(marker);
  return m ? (m.width * (FLOW_MARKER_REF.x - 6)) / 20 + 2 : 0;
}
export function markerShape(type: 'arrow' | 'arrowclosed'): string {
  return type === 'arrowclosed' ? 'M6,4.5 L17,10 L6,15.5 Z' : 'M7,4.5 L17,10 L7,15.5';
}

/** The markers a set of edges needs, one per distinct look, with their ids. */
export function collectMarkers(edges: readonly Pick<FlowEdge, 'markerStart' | 'markerEnd'>[], prefix: string, defaultColor?: string): (FlowResolvedMarker & { id: string })[] {
  const out = new Map<string, FlowResolvedMarker & { id: string }>();
  for (const e of edges) {
    for (const m of [e.markerStart, e.markerEnd]) {
      const r = normalizeMarker(m);
      if (!r) continue;
      const resolved = { ...r, color: r.color || defaultColor };
      const id = markerId(prefix, resolved);
      if (!out.has(id)) out.set(id, { ...resolved, id });
    }
  }
  return Array.from(out.values());
}
