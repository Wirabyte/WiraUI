/** wt-flow: saving and loading a diagram as JSON, and drawing it as a standalone SVG. */
import { collectMarkers, FLOW_MARKER_REF, FLOW_MARKER_VIEWBOX, getEdgeEnds, markerId, markerShape, normalizeMarker } from './edges';
import { absolutePositions, nodeLookup, nodeSize, sortNodesParentsFirst } from './graph';
import type { FlowSizeLookup } from './graph';
import { fmt, getEdgePath } from './paths';
import { FLOW_DEFAULT_VIEWPORT, normalizeViewport } from './viewport';
import type { FlowEdge, FlowJSON, FlowNode, FlowNodeHandles, FlowViewport } from './types';

const TRANSIENT = ['dragging', 'resizing'];

/** A plain-data copy: functions and other non-JSON values are dropped, dates become ISO strings. */
function plain<T>(v: T): T {
  try {
    return JSON.parse(JSON.stringify(v)) as T;
  } catch {
    // A loop in `data`: fall back to a shallow copy.
    return (Array.isArray(v) ? v.slice() : v && typeof v === 'object' ? { ...v } : v) as T;
  }
}

/** `{ nodes, edges, viewport }` ready for JSON.stringify (drag / resize flags left out). */
export function flowToJSON<N extends FlowNode, E extends FlowEdge>(nodes: readonly N[], edges: readonly E[], viewport: FlowViewport = FLOW_DEFAULT_VIEWPORT): FlowJSON<N, E> {
  const clean = <T extends object>(item: T): T => {
    const out = plain(item) as Record<string, unknown>;
    for (const k of TRANSIENT) delete out[k];
    return out as T;
  };
  return { nodes: (nodes || []).map(clean), edges: (edges || []).map(clean), viewport: normalizeViewport(viewport) };
}

export interface FlowFromJSONOptions {
  /** Leave out edges whose source or target node is missing. Default true. */
  dropDangling?: boolean;
}

/**
 * Reads what `flowToJSON` wrote (an object or its JSON text). Broken entries are left out: nodes need an id and a
 * position (a number id becomes text), edges an id, source and target; the first of two equal ids wins. Null when the
 * input is not a diagram at all.
 */
export function flowFromJSON<N extends FlowNode = FlowNode, E extends FlowEdge = FlowEdge>(input: unknown, options: FlowFromJSONOptions = {}): FlowJSON<N, E> | null {
  let v: unknown = input;
  if (typeof v === 'string') {
    try {
      v = JSON.parse(v);
    } catch {
      return null;
    }
  }
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  const o = v as { nodes?: unknown; edges?: unknown; viewport?: unknown };
  if (o.nodes !== undefined && !Array.isArray(o.nodes)) return null;
  if (o.edges !== undefined && !Array.isArray(o.edges)) return null;
  const idText = (x: unknown): string | null => (typeof x === 'string' && x ? x : typeof x === 'number' && isFinite(x) ? String(x) : null);
  const nodes: N[] = [];
  const nodeIds = new Set<string>();
  for (const raw of (o.nodes as unknown[]) || []) {
    if (!raw || typeof raw !== 'object') continue;
    const r = raw as Record<string, unknown>;
    const id = idText(r['id']);
    const p = r['position'] as Record<string, unknown> | undefined;
    if (!id || nodeIds.has(id) || !p || typeof p !== 'object') continue;
    const x = Number(p['x']);
    const y = Number(p['y']);
    if (!isFinite(x) || !isFinite(y)) continue;
    const node = { ...r, id, position: { x, y } } as unknown as N;
    if (r['parentId'] !== undefined) {
      const pid = idText(r['parentId']);
      if (pid) node.parentId = pid;
      else delete node.parentId;
    }
    nodeIds.add(id);
    nodes.push(node);
  }
  // A parent that is not in the file: the node becomes top-level (its position stays as written).
  for (const n of nodes) if (n.parentId && !nodeIds.has(n.parentId)) delete n.parentId;
  const edges: E[] = [];
  const edgeIds = new Set<string>();
  for (const raw of (o.edges as unknown[]) || []) {
    if (!raw || typeof raw !== 'object') continue;
    const r = raw as Record<string, unknown>;
    const id = idText(r['id']);
    const source = idText(r['source']);
    const target = idText(r['target']);
    if (!id || !source || !target || edgeIds.has(id)) continue;
    if (options.dropDangling !== false && (!nodeIds.has(source) || !nodeIds.has(target))) continue;
    edgeIds.add(id);
    edges.push({ ...r, id, source, target } as unknown as E);
  }
  return { nodes, edges, viewport: normalizeViewport(o.viewport) };
}

export interface FlowSvgOptions {
  /** Sizes measured on screen, by node id. */
  sizes?: FlowSizeLookup | null;
  /** Measured handles, by node id (edges then start and end where they do on screen). */
  handles?: ReadonlyMap<string, FlowNodeHandles> | null;
  /** Space around the drawing, in px. Default 20. */
  padding?: number;
  /** Fill behind everything; none (transparent) by default. */
  background?: string | null;
  nodeBackground?: string;
  nodeBorder?: string;
  nodeText?: string;
  /** Corner radius of node boxes. Default 6. */
  nodeRadius?: number;
  groupBackground?: string;
  edgeColor?: string;
  /** Default 1.5. */
  edgeWidth?: number;
  labelBackground?: string;
  labelColor?: string;
  fontFamily?: string;
  /** Default 12. */
  fontSize?: number;
  /** Text of a node box. Default: `data.label`, else the node's aria label, else nothing. */
  nodeLabel?: (node: FlowNode) => string | null | undefined;
  /** Shape for edges without a `type` (default bezier). */
  defaultEdgeType?: string;
  /** Size of a node that has not been measured. Default 150 × 40. */
  defaultWidth?: number;
  defaultHeight?: number;
  /** Also draw hidden nodes and edges. Default false. */
  includeHidden?: boolean;
  /** `<title>` of the drawing (read by screen readers). */
  title?: string;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** About how wide a line of text is: Thai vowel and tone marks above and below the line take no room. */
export function estimateTextWidth(text: string, fontSize: number): number {
  const visible = text.replace(/[ัิ-ฺ็-๎̀-ͯ]/g, '');
  return visible.length * fontSize * 0.58;
}

function labelOf(node: FlowNode): string {
  const d = node.data as { label?: unknown } | undefined;
  if (d && (typeof d.label === 'string' || typeof d.label === 'number')) return String(d.label);
  return node.ariaLabel || '';
}

/**
 * The diagram as an SVG document: edges with their arrowheads and labels, and each node as a rounded box with its
 * label (custom node templates are not reproduced). Colours are plain values so the file looks the same anywhere.
 */
export function flowToSvg(nodes: readonly FlowNode[], edges: readonly FlowEdge[], options: FlowSvgOptions = {}): string {
  const pad = typeof options.padding === 'number' && isFinite(options.padding) ? Math.max(0, options.padding) : 20;
  const fontSize = options.fontSize || 12;
  const font = options.fontFamily || 'sans-serif';
  const edgeColor = options.edgeColor || '#94a3b8';
  const edgeWidth = options.edgeWidth || 1.5;
  const lookup = nodeLookup(nodes);
  const shown = sortNodesParentsFirst(nodes.filter((n) => options.includeHidden || !n.hidden));
  const shownIds = new Set(shown.map((n) => n.id));
  const abs = absolutePositions(nodes, lookup);
  const size = (n: FlowNode) => {
    const s = nodeSize(n, options.sizes);
    return { width: s.width || options.defaultWidth || 150, height: s.height || options.defaultHeight || 40 };
  };
  const rects = new Map(shown.map((n) => {
    const p = abs.get(n.id) || n.position;
    return [n.id, { x: p.x, y: p.y, ...size(n) }] as [string, { x: number; y: number; width: number; height: number }];
  }));
  const drawn = edges.filter((e) => (options.includeHidden || !e.hidden) && shownIds.has(e.source) && shownIds.has(e.target));
  // Bounds over nodes and edge ends (curves rarely leave that box by much; the padding covers it).
  let x1 = Infinity;
  let y1 = Infinity;
  let x2 = -Infinity;
  let y2 = -Infinity;
  for (const r of rects.values()) {
    x1 = Math.min(x1, r.x);
    y1 = Math.min(y1, r.y);
    x2 = Math.max(x2, r.x + r.width);
    y2 = Math.max(y2, r.y + r.height);
  }
  const geometry = drawn.map((e) => {
    const s = lookup.get(e.source) as FlowNode;
    const t = lookup.get(e.target) as FlowNode;
    const ends = getEdgeEnds(
      e,
      { node: s, rect: rects.get(s.id) as { x: number; y: number; width: number; height: number }, handles: options.handles ? options.handles.get(s.id) : null },
      { node: t, rect: rects.get(t.id) as { x: number; y: number; width: number; height: number }, handles: options.handles ? options.handles.get(t.id) : null }
    );
    const type = e.type || options.defaultEdgeType || 'default';
    const [path, lx, ly] = getEdgePath(type, ends, e.pathOptions || {});
    for (const [px, py] of [
      [ends.sourceX, ends.sourceY],
      [ends.targetX, ends.targetY],
    ]) {
      x1 = Math.min(x1, px);
      y1 = Math.min(y1, py);
      x2 = Math.max(x2, px);
      y2 = Math.max(y2, py);
    }
    return { e, path, lx, ly };
  });
  if (!isFinite(x1)) {
    x1 = y1 = 0;
    x2 = y2 = 0;
  }
  const w = x2 - x1 + pad * 2;
  const h = y2 - y1 + pad * 2;
  const ox = pad - x1;
  const oy = pad - y1;
  const markers = collectMarkers(drawn, 'wt-flow-svg-marker', edgeColor);
  const parts: string[] = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${fmt(w)}" height="${fmt(h)}" viewBox="0 0 ${fmt(w)} ${fmt(h)}" font-family="${esc(font)}" font-size="${fontSize}">`);
  if (options.title) parts.push(`<title>${esc(options.title)}</title>`);
  if (markers.length) {
    parts.push('<defs>');
    for (const m of markers) {
      const fill = m.type === 'arrowclosed' ? `fill="${esc(m.color || edgeColor)}"` : 'fill="none"';
      const stroke = `stroke="${esc(m.color || edgeColor)}" stroke-width="${fmt((m.strokeWidth * 20) / m.width)}" stroke-linecap="round" stroke-linejoin="round"`;
      parts.push(
        `<marker id="${m.id}" viewBox="${FLOW_MARKER_VIEWBOX}" refX="${FLOW_MARKER_REF.x}" refY="${FLOW_MARKER_REF.y}" markerWidth="${fmt(m.width)}" markerHeight="${fmt(m.height)}" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="${markerShape(m.type)}" ${fill} ${stroke}/></marker>`
      );
    }
    parts.push('</defs>');
  }
  if (options.background) parts.push(`<rect width="100%" height="100%" fill="${esc(options.background)}"/>`);
  parts.push(`<g transform="translate(${fmt(ox)},${fmt(oy)})">`);
  // Group boxes first, so children and edges sit on top of them.
  const box = (n: FlowNode) => {
    const r = rects.get(n.id) as { x: number; y: number; width: number; height: number };
    const group = n.type === 'group';
    const radius = options.nodeRadius ?? 6;
    const fill = group ? options.groupBackground || 'rgba(100, 116, 139, 0.08)' : options.nodeBackground || '#ffffff';
    const label = (options.nodeLabel ? options.nodeLabel(n) : labelOf(n)) || '';
    let out = `<g data-id="${esc(n.id)}"><rect x="${fmt(r.x)}" y="${fmt(r.y)}" width="${fmt(r.width)}" height="${fmt(r.height)}" rx="${fmt(radius)}" fill="${esc(fill)}" stroke="${esc(options.nodeBorder || '#cbd5e1')}"/>`;
    if (label) {
      const tx = group ? r.x + 8 : r.x + r.width / 2;
      const ty = group ? r.y + fontSize + 4 : r.y + r.height / 2;
      out += `<text x="${fmt(tx)}" y="${fmt(ty)}" fill="${esc(options.nodeText || '#1e293b')}" text-anchor="${group ? 'start' : 'middle'}" dominant-baseline="${group ? 'auto' : 'central'}">${esc(label)}</text>`;
    }
    return out + '</g>';
  };
  for (const n of shown) if (n.type === 'group') parts.push(box(n));
  for (const g of geometry) {
    const start = normalizeMarker(g.e.markerStart);
    const stop = normalizeMarker(g.e.markerEnd);
    const url = (m: NonNullable<ReturnType<typeof normalizeMarker>>) => `url(#${markerId('wt-flow-svg-marker', { ...m, color: m.color || edgeColor })})`;
    const dash = g.e.animated ? ' stroke-dasharray="5 5"' : '';
    const ms = start ? ` marker-start="${url(start)}"` : '';
    const me = stop ? ` marker-end="${url(stop)}"` : '';
    parts.push(`<path d="${g.path}" fill="none" stroke="${esc(edgeColor)}" stroke-width="${fmt(edgeWidth)}"${dash}${ms}${me}/>`);
  }
  for (const n of shown) if (n.type !== 'group') parts.push(box(n));
  for (const g of geometry) {
    if (!g.e.label) continue;
    const tw = estimateTextWidth(g.e.label, fontSize);
    const [px, py] = g.e.labelBgPadding || [4, 2];
    const bw = tw + px * 2;
    const bh = fontSize * 1.4 + py * 2;
    if (g.e.labelShowBg !== false) {
      parts.push(`<rect x="${fmt(g.lx - bw / 2)}" y="${fmt(g.ly - bh / 2)}" width="${fmt(bw)}" height="${fmt(bh)}" rx="${fmt(g.e.labelBgBorderRadius ?? 4)}" fill="${esc(options.labelBackground || '#ffffff')}"/>`);
    }
    parts.push(`<text x="${fmt(g.lx)}" y="${fmt(g.ly)}" fill="${esc(options.labelColor || '#334155')}" text-anchor="middle" dominant-baseline="central">${esc(g.e.label)}</text>`);
  }
  parts.push('</g></svg>');
  return parts.join('');
}
