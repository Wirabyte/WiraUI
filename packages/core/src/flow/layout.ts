/**
 * wu-flow: automatic layout without a third-party library.
 *
 * `layoutFlow()` draws a directed graph in layers: ranks by longest path (cycles are broken first), long edges get
 * placeholder points in the ranks they cross, the order inside each rank is improved by barycentre sweeps (keeping the
 * order with the fewest crossings), and each node is pulled towards its neighbours as far as the spacing allows.
 * `layoutTree()` draws trees (org charts): each parent centred over its children, subtrees packed as close as their
 * outlines allow.
 */
import { nodeLookup, nodeSize } from './graph';
import type { FlowSizeLookup } from './graph';
import type { FlowEdge, FlowNode, FlowPosition, FlowXY } from './types';

export type FlowLayoutDirection = 'TB' | 'BT' | 'LR' | 'RL';

export interface FlowLayoutCommon {
  /** Top to bottom (default), bottom to top, left to right or right to left. */
  direction?: FlowLayoutDirection;
  /** Sizes measured on screen, by node id (the flow passes its own). */
  sizes?: FlowSizeLookup | null;
  /** Size of a node that has not been measured. Default 150 × 40. */
  defaultWidth?: number;
  defaultHeight?: number;
  /** Set each node's `sourcePosition` / `targetPosition` to suit the direction (TB: bottom / top). Default true. */
  setHandlePositions?: boolean;
  /** Where the top-left corner of the result goes. Default (0, 0). */
  origin?: FlowXY;
}

export interface FlowLayoutOptions extends FlowLayoutCommon {
  /** Space between nodes in the same rank. Default 40. */
  nodeSep?: number;
  /** Space between ranks. Default 80. */
  rankSep?: number;
  /** Space between parts of the graph that are not connected. Default twice `nodeSep`. */
  componentSep?: number;
  /** Ordering sweeps. Default 8. */
  iterations?: number;
}

export interface FlowTreeLayoutOptions extends FlowLayoutCommon {
  /** Space between neighbouring boxes on a level. Default 24. */
  nodeSep?: number;
  /** Space between levels. Default 60. */
  levelSep?: number;
  /** Pack subtrees by their outlines (default true); false keeps every subtree in its own column. */
  compact?: boolean;
}

const num = (v: unknown, d: number) => (typeof v === 'number' && isFinite(v) ? v : d);

/** Handle sides that suit a layout direction. */
export function layoutHandlePositions(direction: FlowLayoutDirection): { sourcePosition: FlowPosition; targetPosition: FlowPosition } {
  switch (direction) {
    case 'BT':
      return { sourcePosition: 'top', targetPosition: 'bottom' };
    case 'LR':
      return { sourcePosition: 'right', targetPosition: 'left' };
    case 'RL':
      return { sourcePosition: 'left', targetPosition: 'right' };
    default:
      return { sourcePosition: 'bottom', targetPosition: 'top' };
  }
}

interface Item {
  id: string;
  width: number;
  height: number;
  /** Size across the layout direction and along it. */
  cross: number;
  main: number;
}

/** The nodes taking part (those whose parent is not among them) and a map from every node to the one that stands for it. */
function participants(nodes: readonly FlowNode[], o: FlowLayoutCommon): { items: Item[]; standFor: Map<string, string> } {
  const lookup = nodeLookup(nodes);
  const horizontal = o.direction === 'LR' || o.direction === 'RL';
  const items: Item[] = [];
  const top = new Set<string>();
  for (const n of nodes) {
    if (!n || typeof n.id !== 'string' || top.has(n.id)) continue;
    if (n.parentId && lookup.has(n.parentId)) continue;
    const s = nodeSize(n, o.sizes);
    const width = s.width > 0 ? s.width : num(o.defaultWidth, 150);
    const height = s.height > 0 ? s.height : num(o.defaultHeight, 40);
    items.push({ id: n.id, width, height, cross: horizontal ? height : width, main: horizontal ? width : height });
    top.add(n.id);
  }
  const standFor = new Map<string, string>();
  for (const n of nodes) {
    let cur: FlowNode | undefined = n;
    const seen = new Set<string>();
    while (cur && !top.has(cur.id) && cur.parentId && !seen.has(cur.id)) {
      seen.add(cur.id);
      cur = lookup.get(cur.parentId);
    }
    if (cur && top.has(cur.id)) standFor.set(n.id, cur.id);
  }
  return { items, standFor };
}

/** Distinct links between participants, in edge order, without self-loops. */
function links(edges: readonly FlowEdge[], standFor: Map<string, string>): [string, string][] {
  const out: [string, string][] = [];
  const seen = new Set<string>();
  for (const e of edges || []) {
    if (!e || e.hidden) continue;
    const a = standFor.get(e.source);
    const b = standFor.get(e.target);
    if (!a || !b || a === b) continue;
    const key = a + '\u0000' + b;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push([a, b]);
  }
  return out;
}

/** Writes the laid-out positions back: abstract (cross centre, main start) to x / y for the direction. */
function finish(nodes: readonly FlowNode[], items: Item[], cross: Map<string, number>, main: Map<string, number>, o: FlowLayoutCommon): FlowNode[] {
  const dir = o.direction || 'TB';
  const placed = new Map<string, FlowXY>();
  let minX = Infinity;
  let minY = Infinity;
  for (const it of items) {
    const c = cross.get(it.id) ?? 0;
    const m = main.get(it.id) ?? 0;
    let p: FlowXY;
    if (dir === 'TB') p = { x: c - it.width / 2, y: m };
    else if (dir === 'BT') p = { x: c - it.width / 2, y: -(m + it.height) };
    else if (dir === 'LR') p = { x: m, y: c - it.height / 2 };
    else p = { x: -(m + it.width), y: c - it.height / 2 };
    placed.set(it.id, p);
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
  }
  const ox = num(o.origin && o.origin.x, 0) - (isFinite(minX) ? minX : 0);
  const oy = num(o.origin && o.origin.y, 0) - (isFinite(minY) ? minY : 0);
  const handles = o.setHandlePositions === false ? null : layoutHandlePositions(dir);
  return nodes.map((n) => {
    const p = n ? placed.get(n.id) : undefined;
    if (!p) return n;
    const position = { x: Math.round((p.x + ox) * 100) / 100 + 0, y: Math.round((p.y + oy) * 100) / 100 + 0 };
    return handles ? { ...n, position, ...handles } : { ...n, position };
  });
}

// ---------- layered layout ----------

/** Crossings between consecutive layers, for links given as [upper, lower] keys. */
export function countCrossings(layers: readonly (readonly string[])[], linkList: readonly (readonly [string, string])[]): number {
  const pos = new Map<string, { layer: number; index: number }>();
  layers.forEach((layer, l) => layer.forEach((k, i) => pos.set(k, { layer: l, index: i })));
  let total = 0;
  for (let l = 0; l < layers.length - 1; l++) {
    const segs: [number, number][] = [];
    for (const [a, b] of linkList) {
      const pa = pos.get(a);
      const pb = pos.get(b);
      if (!pa || !pb) continue;
      if (pa.layer === l && pb.layer === l + 1) segs.push([pa.index, pb.index]);
      else if (pb.layer === l && pa.layer === l + 1) segs.push([pb.index, pa.index]);
    }
    for (let i = 0; i < segs.length; i++) {
      for (let j = i + 1; j < segs.length; j++) {
        const [a1, b1] = segs[i];
        const [a2, b2] = segs[j];
        if ((a1 - a2) * (b1 - b2) < 0) total++;
      }
    }
  }
  return total;
}

/**
 * Positions for items in a fixed order that come as close as possible to `wanted` (least squares) while consecutive
 * items stay at least `gaps[i]` apart (centre to centre). Pool-adjacent-violators on the shifted targets.
 */
export function placeInOrder(wanted: readonly number[], gaps: readonly number[]): number[] {
  const n = wanted.length;
  if (!n) return [];
  const offset: number[] = [0];
  for (let i = 1; i < n; i++) offset[i] = offset[i - 1] + gaps[i - 1];
  const blocks: { sum: number; count: number }[] = [];
  for (let i = 0; i < n; i++) {
    blocks.push({ sum: wanted[i] - offset[i], count: 1 });
    while (blocks.length > 1) {
      const b = blocks[blocks.length - 1];
      const a = blocks[blocks.length - 2];
      if (a.sum / a.count <= b.sum / b.count) break;
      blocks.pop();
      a.sum += b.sum;
      a.count += b.count;
    }
  }
  const out: number[] = [];
  let i = 0;
  for (const b of blocks) {
    const mean = b.sum / b.count;
    for (let k = 0; k < b.count; k++, i++) out.push(mean + offset[i]);
  }
  return out;
}

interface LayerNode {
  key: string;
  /** Size across the direction; 0 for a placeholder. */
  cross: number;
  dummy: boolean;
}

function layoutComponent(ids: string[], items: Map<string, Item>, all: [string, string][], o: FlowLayoutOptions): { cross: Map<string, number>; main: Map<string, number>; width: number } {
  const nodeSep = Math.max(0, num(o.nodeSep, 40));
  const rankSep = Math.max(0, num(o.rankSep, 80));
  const set = new Set(ids);
  const edges = all.filter(([a, b]) => set.has(a) && set.has(b));
  const order = new Map(ids.map((id, i) => [id, i] as [string, number]));

  // 1. Break cycles: links that close a loop in a depth-first walk are turned round.
  const out = new Map<string, string[]>(ids.map((id) => [id, []] as [string, string[]]));
  for (const [a, b] of edges) (out.get(a) as string[]).push(b);
  const state = new Map<string, number>();
  const reversed = new Set<string>();
  const walk = (start: string) => {
    const stack: [string, number][] = [[start, 0]];
    state.set(start, 1);
    while (stack.length) {
      const top = stack[stack.length - 1];
      const succ = out.get(top[0]) as string[];
      if (top[1] >= succ.length) {
        state.set(top[0], 2);
        stack.pop();
        continue;
      }
      const next = succ[top[1]++];
      const s = state.get(next) || 0;
      if (s === 1) reversed.add(top[0] + '\u0000' + next);
      else if (s === 0) {
        state.set(next, 1);
        stack.push([next, 0]);
      }
    }
  };
  // Start from nodes nothing points at, in the given order, so the walk follows the graph's natural direction.
  const hasIn = new Set(edges.map(([, b]) => b));
  for (const id of ids) if (!hasIn.has(id) && !state.get(id)) walk(id);
  for (const id of ids) if (!state.get(id)) walk(id);
  const dag: [string, string][] = edges.map(([a, b]) => (reversed.has(a + '\u0000' + b) ? [b, a] : [a, b]));

  // 2. Ranks: longest path from the sources, then sources pulled down next to what they point at.
  const preds = new Map<string, string[]>(ids.map((id) => [id, []] as [string, string[]]));
  const succs = new Map<string, string[]>(ids.map((id) => [id, []] as [string, string[]]));
  for (const [a, b] of dag) {
    (succs.get(a) as string[]).push(b);
    (preds.get(b) as string[]).push(a);
  }
  const indeg = new Map(ids.map((id) => [id, (preds.get(id) as string[]).length] as [string, number]));
  const queue = ids.filter((id) => indeg.get(id) === 0);
  const topo: string[] = [];
  const rank = new Map<string, number>();
  for (const id of queue) rank.set(id, 0);
  while (queue.length) {
    const id = queue.shift() as string;
    topo.push(id);
    for (const s of succs.get(id) as string[]) {
      rank.set(s, Math.max(rank.get(s) ?? 0, (rank.get(id) ?? 0) + 1));
      indeg.set(s, (indeg.get(s) as number) - 1);
      if (indeg.get(s) === 0) queue.push(s);
    }
  }
  for (let i = topo.length - 1; i >= 0; i--) {
    const id = topo[i];
    const s = succs.get(id) as string[];
    if ((preds.get(id) as string[]).length === 0 && s.length) rank.set(id, Math.min(...s.map((k) => rank.get(k) ?? 0)) - 1);
  }
  const minRank = Math.min(...ids.map((id) => rank.get(id) ?? 0));
  for (const id of ids) rank.set(id, (rank.get(id) ?? 0) - minRank);
  const maxRank = Math.max(...ids.map((id) => rank.get(id) ?? 0));

  // 3. Placeholders along links that skip ranks; every link then joins neighbouring ranks.
  const layers: LayerNode[][] = Array.from({ length: maxRank + 1 }, () => []);
  const nodeOf = new Map<string, LayerNode>();
  const rankOf = new Map<string, number>();
  for (const id of ids) {
    const ln: LayerNode = { key: id, cross: (items.get(id) as Item).cross, dummy: false };
    nodeOf.set(id, ln);
    rankOf.set(id, rank.get(id) as number);
  }
  const segs: [string, string][] = [];
  let dummyCount = 0;
  for (const [a, b] of dag) {
    const ra = rank.get(a) as number;
    const rb = rank.get(b) as number;
    let prev = a;
    for (let r = ra + 1; r < rb; r++) {
      const key = `\u0000d${dummyCount++}`;
      nodeOf.set(key, { key, cross: 0, dummy: true });
      rankOf.set(key, r);
      segs.push([prev, key]);
      prev = key;
    }
    segs.push([prev, b]);
  }
  const up = new Map<string, string[]>();
  const down = new Map<string, string[]>();
  for (const k of nodeOf.keys()) {
    up.set(k, []);
    down.set(k, []);
  }
  for (const [a, b] of segs) {
    (down.get(a) as string[]).push(b);
    (up.get(b) as string[]).push(a);
  }

  // Starting order: depth-first from the top, children in the order given.
  const visited = new Set<string>();
  const visit = (k: string) => {
    if (visited.has(k)) return;
    visited.add(k);
    layers[rankOf.get(k) as number].push(nodeOf.get(k) as LayerNode);
    const kids = (down.get(k) as string[]).slice().sort((x, y) => (order.get(x) ?? 1e9) - (order.get(y) ?? 1e9));
    for (const c of kids) visit(c);
  };
  for (const id of ids.slice().sort((x, y) => (rank.get(x) as number) - (rank.get(y) as number) || (order.get(x) as number) - (order.get(y) as number))) visit(id);

  // 4. Fewer crossings: barycentre sweeps down and up, then neighbour swaps; the best order seen is kept.
  const keysOf = () => layers.map((l) => l.map((n) => n.key));
  let best = keysOf();
  let bestCross = countCrossings(best, segs);
  const iterations = Math.max(0, Math.round(num(o.iterations, 8)));
  const indexIn = (l: LayerNode[]) => new Map(l.map((n, i) => [n.key, i] as [string, number]));
  // Links between layer l and l + 1, for counting crossings around one layer only.
  const between: [string, string][][] = Array.from({ length: Math.max(0, maxRank) }, () => []);
  for (const [a, b] of segs) {
    const ra = rankOf.get(a) as number;
    if (ra < maxRank) between[ra].push([a, b]);
  }
  const index = new Map<string, number>();
  const reindex = (r: number) => layers[r].forEach((n, i) => index.set(n.key, i));
  const pairCross = (l: number): number => {
    if (l < 0 || l >= between.length) return 0;
    const s = between[l];
    let c = 0;
    for (let i = 0; i < s.length; i++) {
      const a1 = index.get(s[i][0]) as number;
      const b1 = index.get(s[i][1]) as number;
      for (let j = i + 1; j < s.length; j++) {
        if ((a1 - (index.get(s[j][0]) as number)) * (b1 - (index.get(s[j][1]) as number)) < 0) c++;
      }
    }
    return c;
  };
  const swapping = nodeOf.size <= 600;
  for (let it = 0; it < iterations && bestCross > 0; it++) {
    const downward = it % 2 === 0;
    const range = downward ? Array.from({ length: maxRank }, (_, i) => i + 1) : Array.from({ length: maxRank }, (_, i) => maxRank - 1 - i);
    for (const r of range) {
      const fixed = indexIn(layers[downward ? r - 1 : r + 1]);
      const layer = layers[r];
      const bary = new Map<string, number>();
      layer.forEach((n, i) => {
        const nb = ((downward ? up : down).get(n.key) as string[]).map((k) => fixed.get(k)).filter((v): v is number => v !== undefined);
        bary.set(n.key, nb.length ? nb.reduce((s, v) => s + v, 0) / nb.length : i);
      });
      const pos = indexIn(layer);
      layer.sort((a, b) => (bary.get(a.key) as number) - (bary.get(b.key) as number) || (pos.get(a.key) as number) - (pos.get(b.key) as number));
    }
    // Swap neighbours while it helps (crossings change only next to the layer being reordered).
    if (swapping) {
      for (let r = 0; r <= maxRank; r++) reindex(r);
      let improved = true;
      let guard = 0;
      while (improved && guard++ < 4) {
        improved = false;
        for (let r = 0; r <= maxRank; r++) {
          const layer = layers[r];
          for (let i = 0; i < layer.length - 1; i++) {
            const before = pairCross(r - 1) + pairCross(r);
            [layer[i], layer[i + 1]] = [layer[i + 1], layer[i]];
            index.set(layer[i].key, i);
            index.set(layer[i + 1].key, i + 1);
            const after = pairCross(r - 1) + pairCross(r);
            if (after < before) improved = true;
            else {
              [layer[i], layer[i + 1]] = [layer[i + 1], layer[i]];
              index.set(layer[i].key, i);
              index.set(layer[i + 1].key, i + 1);
            }
          }
        }
      }
    }
    const c = countCrossings(keysOf(), segs);
    if (c < bestCross) {
      bestCross = c;
      best = keysOf();
    }
  }
  const finalLayers: LayerNode[][] = best.map((keys) => keys.map((k) => nodeOf.get(k) as LayerNode));

  // 5. Across: pack each rank, then pull every node towards its neighbours above and below.
  const pos = new Map<string, number>();
  const gapsOf = (layer: LayerNode[]) =>
    layer.slice(1).map((n, i) => {
      const a = layer[i];
      const gap = a.dummy || n.dummy ? nodeSep / 2 : nodeSep;
      return (a.cross + n.cross) / 2 + gap;
    });
  for (const layer of finalLayers) {
    const placed = placeInOrder(layer.map(() => 0), gapsOf(layer));
    layer.forEach((n, i) => pos.set(n.key, placed[i]));
  }
  for (let pass = 0; pass < 8; pass++) {
    const downward = pass % 2 === 0;
    const range = downward ? finalLayers.map((_, i) => i) : finalLayers.map((_, i) => finalLayers.length - 1 - i);
    for (const r of range) {
      const layer = finalLayers[r];
      const wanted = layer.map((n) => {
        const nb = [...((downward ? up : down).get(n.key) as string[]), ...(pass >= 4 ? ((downward ? down : up).get(n.key) as string[]) : [])];
        const vals = nb.map((k) => pos.get(k)).filter((v): v is number => v !== undefined);
        return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : (pos.get(n.key) as number);
      });
      const placed = placeInOrder(wanted, gapsOf(layer));
      layer.forEach((n, i) => pos.set(n.key, placed[i]));
    }
  }

  // 6. Along: each rank is as deep as its deepest node; nodes are centred in their rank.
  const depth = finalLayers.map((layer) => Math.max(0, ...layer.filter((n) => !n.dummy).map((n) => (items.get(n.key) as Item).main)));
  const start: number[] = [];
  let acc = 0;
  for (let r = 0; r < depth.length; r++) {
    start[r] = acc;
    acc += depth[r] + rankSep;
  }
  const cross = new Map<string, number>();
  const main = new Map<string, number>();
  let lo = Infinity;
  let hi = -Infinity;
  for (const id of ids) {
    const it = items.get(id) as Item;
    const r = rank.get(id) as number;
    const c = pos.get(id) as number;
    cross.set(id, c);
    main.set(id, start[r] + (depth[r] - it.main) / 2);
    lo = Math.min(lo, c - it.cross / 2);
    hi = Math.max(hi, c + it.cross / 2);
  }
  for (const id of ids) cross.set(id, (cross.get(id) as number) - lo);
  return { cross, main, width: hi - lo };
}

/**
 * Lays out a directed graph in layers. Nodes inside a parent that is also passed keep their place in it (links to
 * them count as links to the parent). Returns the nodes in the same order with new positions (and handle sides).
 */
export function layoutFlow<N extends FlowNode = FlowNode>(nodes: readonly N[], edges: readonly FlowEdge[], options: FlowLayoutOptions = {}): N[] {
  const o = { ...options, direction: options.direction || 'TB' };
  const { items, standFor } = participants(nodes, o);
  if (!items.length) return nodes.slice();
  const itemMap = new Map(items.map((i) => [i.id, i] as [string, Item]));
  const all = links(edges, standFor);
  // Connected parts, in the order their first node is given.
  const parent = new Map(items.map((i) => [i.id, i.id] as [string, string]));
  const find = (x: string): string => {
    let r = x;
    while (parent.get(r) !== r) r = parent.get(r) as string;
    let c = x;
    while (parent.get(c) !== r) {
      const n = parent.get(c) as string;
      parent.set(c, r);
      c = n;
    }
    return r;
  };
  for (const [a, b] of all) {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(rb, ra);
  }
  const groups = new Map<string, string[]>();
  for (const it of items) {
    const r = find(it.id);
    const g = groups.get(r);
    if (g) g.push(it.id);
    else groups.set(r, [it.id]);
  }
  const componentSep = Math.max(0, num(o.componentSep, num(o.nodeSep, 40) * 2));
  const cross = new Map<string, number>();
  const main = new Map<string, number>();
  let offset = 0;
  for (const ids of groups.values()) {
    const part = layoutComponent(ids, itemMap, all, o);
    for (const id of ids) {
      cross.set(id, (part.cross.get(id) as number) + offset);
      main.set(id, part.main.get(id) as number);
    }
    offset += part.width + componentSep;
  }
  return finish(nodes, items, cross, main, o) as N[];
}

// ---------- tree layout ----------

interface Outline {
  /** Per level below the subtree's root (0 = the root's own level): leftmost and rightmost extent, relative to the root's centre. */
  left: number[];
  right: number[];
}

/**
 * Lays out a tree (or a forest) for an org chart: an edge from A to B makes A the parent of B (a node's first parent
 * wins; extra links are drawn but do not move anything). Boxes on one level line up by their top edge (left edge for
 * LR). Returns the nodes in the same order with new positions (and handle sides).
 */
export function layoutTree<N extends FlowNode = FlowNode>(nodes: readonly N[], edges: readonly FlowEdge[], options: FlowTreeLayoutOptions = {}): N[] {
  const o = { ...options, direction: options.direction || 'TB' };
  const nodeSep = Math.max(0, num(o.nodeSep, 24));
  const levelSep = Math.max(0, num(o.levelSep, 60));
  const compact = o.compact !== false;
  const { items, standFor } = participants(nodes, o);
  if (!items.length) return nodes.slice();
  const itemMap = new Map(items.map((i) => [i.id, i] as [string, Item]));
  const order = new Map(items.map((i, k) => [i.id, k] as [string, number]));
  const parentOf = new Map<string, string>();
  const isAncestor = (anc: string, of: string) => {
    let c: string | undefined = of;
    const seen = new Set<string>();
    while (c !== undefined && !seen.has(c)) {
      if (c === anc) return true;
      seen.add(c);
      c = parentOf.get(c);
    }
    return false;
  };
  for (const [a, b] of links(edges, standFor)) {
    if (parentOf.has(b) || isAncestor(b, a)) continue;
    parentOf.set(b, a);
  }
  const children = new Map<string, string[]>(items.map((i) => [i.id, []] as [string, string[]]));
  for (const it of items) {
    const p = parentOf.get(it.id);
    if (p) (children.get(p) as string[]).push(it.id);
  }
  for (const list of children.values()) list.sort((a, b) => (order.get(a) as number) - (order.get(b) as number));
  const roots = items.filter((i) => !parentOf.has(i.id)).map((i) => i.id);

  // Offsets of each child's centre from its parent's centre.
  const childOffset = new Map<string, number>();
  const levelOf = new Map<string, number>();

  /** Places `ids` side by side (as close as their outlines allow) and returns their centres and the joint outline. */
  const packRow = (ids: string[], outlines: Outline[]): { centres: number[]; outline: Outline } => {
    const centres: number[] = [];
    const acc: Outline = { left: [], right: [] };
    ids.forEach((_, i) => {
      const ol = outlines[i];
      let shift = 0;
      if (i > 0) {
        if (compact) {
          shift = -Infinity;
          const common = Math.min(acc.right.length, ol.left.length);
          for (let d = 0; d < common; d++) shift = Math.max(shift, acc.right[d] + nodeSep - ol.left[d]);
          if (!isFinite(shift)) shift = 0;
        } else {
          shift = Math.max(...acc.right) + nodeSep - Math.min(...ol.left);
        }
      }
      centres.push(shift);
      for (let d = 0; d < ol.left.length; d++) {
        acc.left[d] = acc.left[d] === undefined ? ol.left[d] + shift : Math.min(acc.left[d], ol.left[d] + shift);
        acc.right[d] = acc.right[d] === undefined ? ol.right[d] + shift : Math.max(acc.right[d], ol.right[d] + shift);
      }
    });
    return { centres, outline: acc };
  };

  const shape = (id: string, level: number, guard: number): Outline => {
    levelOf.set(id, level);
    const it = itemMap.get(id) as Item;
    const kids = guard < 512 ? (children.get(id) as string[]) : [];
    const own: Outline = { left: [-it.cross / 2], right: [it.cross / 2] };
    if (!kids.length) return own;
    const row = packRow(kids, kids.map((k) => shape(k, level + 1, guard + 1)));
    const mid = (row.centres[0] + row.centres[row.centres.length - 1]) / 2;
    kids.forEach((k, i) => childOffset.set(k, row.centres[i] - mid));
    return {
      left: [own.left[0], ...row.outline.left.map((v) => v - mid)],
      right: [own.right[0], ...row.outline.right.map((v) => v - mid)],
    };
  };
  const forest = packRow(roots, roots.map((r) => shape(r, 0, 0)));

  const cross = new Map<string, number>();
  const place = (id: string, centre: number) => {
    cross.set(id, centre);
    for (const k of children.get(id) as string[]) place(k, centre + (childOffset.get(k) as number));
  };
  roots.forEach((r, i) => place(r, forest.centres[i]));

  // Levels: each as deep as its deepest box; boxes line up at the level's start.
  const depthOf: number[] = [];
  for (const it of items) {
    const l = levelOf.get(it.id) ?? 0;
    depthOf[l] = Math.max(depthOf[l] || 0, it.main);
  }
  const start: number[] = [];
  let acc = 0;
  for (let l = 0; l < depthOf.length; l++) {
    start[l] = acc;
    acc += (depthOf[l] || 0) + levelSep;
  }
  const main = new Map<string, number>();
  for (const it of items) main.set(it.id, start[levelOf.get(it.id) ?? 0]);
  return finish(nodes, items, cross, main, o) as N[];
}
