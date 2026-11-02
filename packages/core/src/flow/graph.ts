/** wu-flow: questions about the graph (who links to whom, where nodes are, what is inside a box). */
import { expandRect, getBoundsOfRects, overlapArea, rectsIntersect } from './geometry';
import type { FlowDimensions, FlowEdge, FlowNode, FlowRect, FlowXY } from './types';

/** Sizes the flow measured on screen, by node id (they win over what the node objects say). */
export type FlowSizeLookup = ReadonlyMap<string, FlowDimensions>;

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object';
const finiteNum = (v: unknown): v is number => typeof v === 'number' && isFinite(v);

/** Looks like a node: an id and a position, and no source / target. */
export function isNode(v: unknown): v is FlowNode {
  if (!isObj(v) || typeof v['id'] !== 'string' || 'source' in v || 'target' in v) return false;
  const p = v['position'];
  return isObj(p) && finiteNum(p['x']) && finiteNum(p['y']);
}

/** Looks like an edge: an id, a source and a target. */
export function isEdge(v: unknown): v is FlowEdge {
  return isObj(v) && typeof v['id'] === 'string' && typeof v['source'] === 'string' && typeof v['target'] === 'string';
}

export function nodeLookup<N extends FlowNode>(nodes: readonly N[]): Map<string, N> {
  const map = new Map<string, N>();
  for (const n of nodes) if (n && typeof n.id === 'string') map.set(n.id, n);
  return map;
}

/** Width / height to use for a node: measured on screen, else what the node says, else its initial size, else 0. */
export function nodeSize(node: FlowNode, sizes?: FlowSizeLookup | null): FlowDimensions {
  const m = sizes ? sizes.get(node.id) : undefined;
  const pick = (...vals: unknown[]) => {
    for (const v of vals) if (finiteNum(v) && v >= 0) return v;
    return 0;
  };
  return {
    width: pick(m && m.width, node.measured && node.measured.width, node.width, node.initialWidth),
    height: pick(m && m.height, node.measured && node.measured.height, node.height, node.initialHeight),
  };
}

/** The node has a size to draw with (measured, set or initial). */
export function hasSize(node: FlowNode, sizes?: FlowSizeLookup | null): boolean {
  const s = nodeSize(node, sizes);
  return s.width > 0 && s.height > 0;
}

/**
 * A node's position in flow coordinates, adding up its parents' positions. A parent that does not exist, or a loop of
 * parents, ends the climb.
 */
export function absolutePosition(node: FlowNode, lookup: ReadonlyMap<string, FlowNode>): FlowXY {
  let x = node.position ? Number(node.position.x) || 0 : 0;
  let y = node.position ? Number(node.position.y) || 0 : 0;
  const seen = new Set<string>([node.id]);
  let parent = node.parentId ? lookup.get(node.parentId) : undefined;
  while (parent && !seen.has(parent.id)) {
    seen.add(parent.id);
    x += Number(parent.position && parent.position.x) || 0;
    y += Number(parent.position && parent.position.y) || 0;
    parent = parent.parentId ? lookup.get(parent.parentId) : undefined;
  }
  return { x, y };
}

/** Absolute positions of every node, by id. */
export function absolutePositions(nodes: readonly FlowNode[], lookup: ReadonlyMap<string, FlowNode> = nodeLookup(nodes)): Map<string, FlowXY> {
  const out = new Map<string, FlowXY>();
  const visit = (node: FlowNode, depth: number): FlowXY => {
    const known = out.get(node.id);
    if (known) return known;
    const own = { x: Number(node.position && node.position.x) || 0, y: Number(node.position && node.position.y) || 0 };
    const parent = node.parentId ? lookup.get(node.parentId) : undefined;
    // depth caps a loop of parents.
    const base = parent && parent.id !== node.id && depth < 64 ? visit(parent, depth + 1) : { x: 0, y: 0 };
    const p = { x: base.x + own.x, y: base.y + own.y };
    out.set(node.id, p);
    return p;
  };
  for (const n of nodes) visit(n, 0);
  return out;
}

/** A node's box in flow coordinates. */
export function nodeRect(node: FlowNode, lookup?: ReadonlyMap<string, FlowNode> | null, sizes?: FlowSizeLookup | null): FlowRect {
  const p = lookup ? absolutePosition(node, lookup) : { x: Number(node.position && node.position.x) || 0, y: Number(node.position && node.position.y) || 0 };
  const s = nodeSize(node, sizes);
  return { x: p.x, y: p.y, width: s.width, height: s.height };
}

export interface FlowBoundsOptions {
  /** All nodes, so child nodes in `nodes` are placed by their parents (default: `nodes` itself). */
  nodes?: readonly FlowNode[];
  sizes?: FlowSizeLookup | null;
  /** Count hidden nodes too. Default true (React-style helpers count every node passed in). */
  includeHidden?: boolean;
}

/** The box around the nodes, in flow coordinates; `{ x: 0, y: 0, width: 0, height: 0 }` for none. */
export function getNodesBounds(nodes: readonly FlowNode[], options: FlowBoundsOptions = {}): FlowRect {
  const lookup = nodeLookup(options.nodes || nodes);
  const rects = nodes.filter((n) => n && (options.includeHidden !== false || !n.hidden)).map((n) => nodeRect(n, lookup, options.sizes));
  return getBoundsOfRects(rects) || { x: 0, y: 0, width: 0, height: 0 };
}

const idOf = (v: string | { id: string }): string => (typeof v === 'string' ? v : v.id);

/** Nodes with an edge into `node`. */
export function getIncomers<N extends FlowNode>(node: string | { id: string }, nodes: readonly N[], edges: readonly FlowEdge[]): N[] {
  const id = idOf(node);
  const from = new Set(edges.filter((e) => e.target === id).map((e) => e.source));
  return nodes.filter((n) => from.has(n.id));
}

/** Nodes `node` has an edge to. */
export function getOutgoers<N extends FlowNode>(node: string | { id: string }, nodes: readonly N[], edges: readonly FlowEdge[]): N[] {
  const id = idOf(node);
  const to = new Set(edges.filter((e) => e.source === id).map((e) => e.target));
  return nodes.filter((n) => to.has(n.id));
}

/** Edges that start or end at any of the nodes. */
export function getConnectedEdges<E extends FlowEdge>(nodes: readonly (string | { id: string })[], edges: readonly E[]): E[] {
  const ids = new Set(nodes.map(idOf));
  return edges.filter((e) => ids.has(e.source) || ids.has(e.target));
}

/** The ids of a node's children, grandchildren and so on. */
export function getDescendants(id: string, nodes: readonly FlowNode[]): Set<string> {
  const children = new Map<string, string[]>();
  for (const n of nodes) {
    if (!n.parentId) continue;
    const list = children.get(n.parentId);
    if (list) list.push(n.id);
    else children.set(n.parentId, [n.id]);
  }
  const out = new Set<string>();
  const stack = [...(children.get(id) || [])];
  while (stack.length) {
    const c = stack.pop() as string;
    if (out.has(c) || c === id) continue;
    out.add(c);
    stack.push(...(children.get(c) || []));
  }
  return out;
}

/** Number of parents above a node (0 for a top-level node). */
export function nodeDepth(node: FlowNode, lookup: ReadonlyMap<string, FlowNode>): number {
  let depth = 0;
  const seen = new Set<string>([node.id]);
  let p = node.parentId ? lookup.get(node.parentId) : undefined;
  while (p && !seen.has(p.id)) {
    seen.add(p.id);
    depth++;
    p = p.parentId ? lookup.get(p.parentId) : undefined;
  }
  return depth;
}

/** The same nodes with every parent ahead of its children (otherwise in the given order). */
export function sortNodesParentsFirst<N extends FlowNode>(nodes: readonly N[]): N[] {
  const lookup = nodeLookup(nodes);
  const out: N[] = [];
  const placed = new Set<string>();
  const place = (n: N, guard: Set<string>) => {
    if (placed.has(n.id) || guard.has(n.id)) return;
    guard.add(n.id);
    const parent = n.parentId ? lookup.get(n.parentId) : undefined;
    if (parent) place(parent, guard);
    placed.add(n.id);
    out.push(n);
  };
  for (const n of nodes) place(n, new Set());
  return out;
}

export interface FlowZOptions {
  /** Raise selected nodes above the rest. Default true. */
  elevateOnSelect?: boolean;
  /** How much a selected node is raised. Default 1000. */
  selectedZ?: number;
}

/** The stacking order of each node: its `zIndex`, raised when selected, and always above its parent. */
export function computeNodeZ(nodes: readonly FlowNode[], options: FlowZOptions = {}): Map<string, number> {
  const lookup = nodeLookup(nodes);
  const elevate = options.elevateOnSelect !== false;
  const bump = finiteNum(options.selectedZ) ? options.selectedZ : 1000;
  const out = new Map<string, number>();
  const visit = (n: FlowNode, depth: number): number => {
    const known = out.get(n.id);
    if (known !== undefined) return known;
    let z = (finiteNum(n.zIndex) ? n.zIndex : 0) + (elevate && n.selected ? bump : 0);
    const parent = n.parentId ? lookup.get(n.parentId) : undefined;
    if (parent && parent.id !== n.id && depth < 64) z = Math.max(z, visit(parent, depth + 1) + 1);
    out.set(n.id, z);
    return z;
  };
  for (const n of nodes) visit(n, 0);
  return out;
}

export interface FlowInsideOptions {
  /** Count a node that only overlaps the box. Default false: it must lie wholly inside. */
  partially?: boolean;
  nodes?: readonly FlowNode[];
  sizes?: FlowSizeLookup | null;
  /** Leave out hidden nodes. Default true. */
  excludeHidden?: boolean;
}

/** Nodes inside a box in flow coordinates (box selection). */
export function getNodesInside<N extends FlowNode>(nodes: readonly N[], rect: FlowRect, options: FlowInsideOptions = {}): N[] {
  const lookup = nodeLookup(options.nodes || nodes);
  return nodes.filter((n) => {
    if (options.excludeHidden !== false && n.hidden) return false;
    const r = nodeRect(n, lookup, options.sizes);
    const area = r.width * r.height;
    if (area <= 0) return r.x >= rect.x && r.y >= rect.y && r.x <= rect.x + rect.width && r.y <= rect.y + rect.height;
    const shared = overlapArea(r, rect);
    return options.partially ? shared > 0 : shared >= area - 1e-6;
  });
}

/**
 * Nodes overlapping `target` (a node, its id, or a box), not counting the node itself. `partially` false asks for
 * nodes wholly inside it.
 */
export function getIntersectingNodes<N extends FlowNode>(target: string | FlowNode | FlowRect, nodes: readonly N[], partially = true, sizes?: FlowSizeLookup | null): N[] {
  const lookup = nodeLookup(nodes);
  let rect: FlowRect | null = null;
  let selfId: string | null = null;
  if (typeof target === 'string') {
    const n = lookup.get(target);
    if (!n) return [];
    selfId = n.id;
    rect = nodeRect(n, lookup, sizes);
  } else if (isNode(target)) {
    selfId = target.id;
    rect = nodeRect(lookup.get(target.id) || target, lookup, sizes);
  } else {
    rect = target as FlowRect;
  }
  const box = rect;
  return nodes.filter((n) => {
    if (n.id === selfId || n.hidden) return false;
    const r = nodeRect(n, lookup, sizes);
    const shared = overlapArea(r, box);
    return partially ? shared > 0 : shared >= r.width * r.height - 1e-6 && r.width * r.height > 0;
  });
}

/** What removing these really removes: the nodes (if deletable), their children, and every edge left hanging. */
export function getElementsToRemove<N extends FlowNode, E extends FlowEdge>(input: {
  nodesToRemove?: readonly (string | { id: string })[];
  edgesToRemove?: readonly (string | { id: string })[];
  nodes: readonly N[];
  edges: readonly E[];
}): { nodes: N[]; edges: E[] } {
  const wantNodes = new Set((input.nodesToRemove || []).map(idOf));
  const wantEdges = new Set((input.edgesToRemove || []).map(idOf));
  const removed = new Set<string>();
  for (const n of input.nodes) {
    if (wantNodes.has(n.id) && n.deletable !== false) removed.add(n.id);
  }
  for (const id of Array.from(removed)) {
    for (const child of getDescendants(id, input.nodes)) removed.add(child);
  }
  const nodes = input.nodes.filter((n) => removed.has(n.id));
  const edges = input.edges.filter((e) => removed.has(e.source) || removed.has(e.target) || (wantEdges.has(e.id) && e.deletable !== false));
  return { nodes, edges };
}

/** The nodes to move when these are dragged together: a node whose parent (or grandparent…) also moves rides along. */
export function dragRoots(ids: Iterable<string>, lookup: ReadonlyMap<string, FlowNode>): string[] {
  const set = new Set(ids);
  const out: string[] = [];
  for (const id of set) {
    let p = lookup.get(id);
    let inside = false;
    const seen = new Set<string>([id]);
    while (p && p.parentId && !seen.has(p.parentId)) {
      seen.add(p.parentId);
      if (set.has(p.parentId)) {
        inside = true;
        break;
      }
      p = lookup.get(p.parentId);
    }
    if (!inside) out.push(id);
  }
  return out;
}

/**
 * How a parent grows to hold a child at `child` (relative position) of `childSize`: `x` / `y` are how far the parent
 * moves (0 or negative: its children move the other way to stay put), `width` / `height` its new size. Null when the
 * child already fits.
 */
export function expandParentBox(child: FlowXY, childSize: FlowDimensions, parentSize: FlowDimensions): FlowRect | null {
  const x = Math.min(0, child.x);
  const y = Math.min(0, child.y);
  const right = Math.max(parentSize.width, child.x + childSize.width);
  const bottom = Math.max(parentSize.height, child.y + childSize.height);
  const width = right - x;
  const height = bottom - y;
  if (x === 0 && y === 0 && width === parentSize.width && height === parentSize.height) return null;
  return { x: x + 0, y: y + 0, width, height };
}

/**
 * Which nodes to draw for `view` (flow coordinates) with `buffer` flow units to spare. Nodes without a size yet are
 * always drawn, so they can be measured.
 */
export function getVisibleNodeIds(nodes: readonly FlowNode[], view: FlowRect, options: { buffer?: number; sizes?: FlowSizeLookup | null; positions?: ReadonlyMap<string, FlowXY> } = {}): Set<string> {
  const area = expandRect(view, Math.max(0, options.buffer || 0));
  const lookup = options.positions ? null : nodeLookup(nodes);
  const out = new Set<string>();
  for (const n of nodes) {
    if (n.hidden) continue;
    const size = nodeSize(n, options.sizes);
    if (size.width <= 0 || size.height <= 0) {
      out.add(n.id);
      continue;
    }
    const p = options.positions ? options.positions.get(n.id) || n.position : absolutePosition(n, lookup as Map<string, FlowNode>);
    if (rectsIntersect({ x: p.x, y: p.y, width: size.width, height: size.height }, area)) out.add(n.id);
  }
  return out;
}

/** An edge is worth drawing when the box around its ends (plus `margin` for the curve) meets the view. */
export function isEdgeVisible(source: FlowXY, target: FlowXY, view: FlowRect, margin = 50): boolean {
  const box = {
    x: Math.min(source.x, target.x) - margin,
    y: Math.min(source.y, target.y) - margin,
    width: Math.abs(source.x - target.x) + margin * 2,
    height: Math.abs(source.y - target.y) + margin * 2,
  };
  return rectsIntersect(box, view);
}
