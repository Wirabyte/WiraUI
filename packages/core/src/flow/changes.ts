/**
 * wu-flow: the change lists the flow reports (`(nodeChanges)`, `(edgeChanges)`) and the pure helpers that apply them,
 * for apps that keep the nodes and edges themselves (`[applyChanges]="false"`). Nothing is mutated: changed items are
 * copied, the rest keep their identity, so OnPush views and memoised selectors see exactly what changed.
 */
import type {
  FlowConnection,
  FlowEdge,
  FlowEdgeChange,
  FlowNode,
  FlowNodeChange,
} from './types';

function applyToNode<N extends FlowNode>(node: N, change: FlowNodeChange<N>, copied: boolean): N {
  if (change.type === 'replace') return change.item;
  const n = (copied ? node : { ...node }) as N;
  switch (change.type) {
    case 'position':
      if (change.position) n.position = { x: change.position.x, y: change.position.y };
      if (change.dragging !== undefined) n.dragging = change.dragging;
      break;
    case 'dimensions':
      if (change.dimensions) {
        n.measured = { width: change.dimensions.width, height: change.dimensions.height };
        if (change.setAttributes === true || change.setAttributes === 'width') n.width = change.dimensions.width;
        if (change.setAttributes === true || change.setAttributes === 'height') n.height = change.dimensions.height;
      }
      if (change.resizing !== undefined) n.resizing = change.resizing;
      break;
    case 'select':
      n.selected = change.selected;
      break;
    default:
      break;
  }
  return n;
}

function applyChangesTo<T extends { id: string }, C extends { type: string }>(
  changes: readonly C[],
  items: readonly T[],
  apply: (item: T, change: C, copied: boolean) => T
): T[] {
  if (!changes || !changes.length) return items.slice();
  const byId = new Map<string, C[]>();
  const adds: { item: T; index?: number }[] = [];
  for (const c of changes) {
    if (!c) continue;
    if (c.type === 'add') {
      const a = c as unknown as { item: T; index?: number };
      if (a.item) adds.push({ item: a.item, index: a.index });
      continue;
    }
    const id = (c as unknown as { id: string }).id;
    const list = byId.get(id);
    if (list) list.push(c);
    else byId.set(id, [c]);
  }
  const out: T[] = [];
  for (const item of items) {
    const list = byId.get(item.id);
    if (!list) {
      out.push(item);
      continue;
    }
    if (list.some((c) => c.type === 'remove')) continue;
    let next = item;
    let copied = false;
    for (const c of list) {
      const was = next;
      next = apply(next, c, copied);
      copied = c.type === 'replace' ? false : copied || next !== was;
    }
    out.push(next);
  }
  for (const a of adds) {
    if (typeof a.index === 'number' && a.index >= 0 && a.index < out.length) out.splice(a.index, 0, a.item);
    else out.push(a.item);
  }
  return out;
}

/** Applies node changes (position, dimensions, select, remove, add, replace) and returns the new list. */
export function applyNodeChanges<N extends FlowNode = FlowNode>(changes: readonly FlowNodeChange<N>[], nodes: readonly N[]): N[] {
  return applyChangesTo<N, FlowNodeChange<N>>(changes, nodes || [], applyToNode);
}

function applyToEdge<E extends FlowEdge>(edge: E, change: FlowEdgeChange<E>, copied: boolean): E {
  if (change.type === 'replace') return change.item;
  if (change.type === 'select') {
    const e = (copied ? edge : { ...edge }) as E;
    e.selected = change.selected;
    return e;
  }
  return edge;
}

/** Applies edge changes (select, remove, add, replace) and returns the new list. */
export function applyEdgeChanges<E extends FlowEdge = FlowEdge>(changes: readonly FlowEdgeChange<E>[], edges: readonly E[]): E[] {
  return applyChangesTo<E, FlowEdgeChange<E>>(changes, edges || [], applyToEdge);
}

/** The id `addEdge` gives a connection without one. */
export function flowEdgeId(c: Pick<FlowConnection, 'source' | 'target'> & { sourceHandle?: string | null; targetHandle?: string | null }): string {
  const end = (node: string, handle: string | null | undefined) => (handle ? `${node}:${handle}` : node);
  return `e-${end(c.source, c.sourceHandle)}-${end(c.target, c.targetHandle)}`;
}

const sameLink = (a: FlowEdge | FlowConnection, b: FlowEdge | FlowConnection) =>
  a.source === b.source && a.target === b.target && (a.sourceHandle ?? null) === (b.sourceHandle ?? null) && (a.targetHandle ?? null) === (b.targetHandle ?? null);

function uniqueId(base: string, edges: readonly FlowEdge[]): string {
  const taken = new Set(edges.map((e) => e.id));
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

/**
 * Adds an edge (or a connection, which becomes an edge with `defaults` such as `type` or `markerEnd`). A link that is
 * already there between the same handles is not added twice; an incomplete one is ignored.
 */
export function addEdge<E extends FlowEdge = FlowEdge>(edge: E | FlowConnection | (Partial<E> & FlowConnection), edges: readonly E[], defaults: Partial<E> = {}): E[] {
  if (!edge || !edge.source || !edge.target) return edges.slice();
  if (edges.some((e) => sameLink(e, edge))) return edges.slice();
  const given = (edge as Partial<E>).id;
  const id = given && !edges.some((e) => e.id === given) ? given : uniqueId(flowEdgeId(edge), edges);
  const next = { ...defaults, ...edge, id, sourceHandle: edge.sourceHandle ?? null, targetHandle: edge.targetHandle ?? null } as E;
  return [...edges, next];
}

/**
 * Moves an end of `oldEdge` (an edge or its id) to the handles of `connection`. The edge keeps its other settings and,
 * unless `shouldReplaceId` is false, gets the id a new connection would. Returns the list unchanged if the edge is
 * not there.
 */
export function reconnectEdge<E extends FlowEdge = FlowEdge>(oldEdge: E | string, connection: FlowConnection, edges: readonly E[], options: { shouldReplaceId?: boolean } = {}): E[] {
  const id = typeof oldEdge === 'string' ? oldEdge : oldEdge.id;
  const index = edges.findIndex((e) => e.id === id);
  if (index < 0 || !connection || !connection.source || !connection.target) return edges.slice();
  const old = edges[index];
  const others = edges.filter((_, i) => i !== index);
  const newId = options.shouldReplaceId === false ? old.id : uniqueId(flowEdgeId(connection), others);
  const next = {
    ...old,
    id: newId,
    source: connection.source,
    target: connection.target,
    sourceHandle: connection.sourceHandle ?? null,
    targetHandle: connection.targetHandle ?? null,
  } as E;
  const out = edges.slice();
  out[index] = next;
  return out;
}

/** The older name of `reconnectEdge`. */
export const updateEdge = reconnectEdge;

/** Select changes that make exactly `ids` selected (only items whose state changes are listed). */
export function selectionChanges(items: readonly { id: string; selected?: boolean; selectable?: boolean }[], ids: Iterable<string>, canSelect: (item: { id: string; selectable?: boolean }) => boolean = (i) => i.selectable !== false): { type: 'select'; id: string; selected: boolean }[] {
  const want = new Set(ids);
  const out: { type: 'select'; id: string; selected: boolean }[] = [];
  for (const item of items) {
    const on = want.has(item.id) && canSelect(item);
    if (!!item.selected !== on) out.push({ type: 'select', id: item.id, selected: on });
  }
  return out;
}

/** Structural equality for plain data (objects, arrays, primitives); other objects compare by identity. */
export function flowDeepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    const bb = b as unknown[];
    return a.length === bb.length && a.every((v, i) => flowDeepEqual(v, bb[i]));
  }
  const pa = Object.getPrototypeOf(a);
  const pb = Object.getPrototypeOf(b);
  if (pa !== pb || (pa !== Object.prototype && pa !== null)) return false;
  const ka = Object.keys(a as object).filter((k) => (a as Record<string, unknown>)[k] !== undefined);
  const kb = Object.keys(b as object).filter((k) => (b as Record<string, unknown>)[k] !== undefined);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => flowDeepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
}

/**
 * The changes that turn `prev` into `next` (by id): `remove` for the ones gone, `replace` for the ones that differ,
 * `add` (at their index) for new ones. Used to report a restore (undo, fromJSON) as a change list.
 */
export function diffItems<T extends { id: string }>(prev: readonly T[], next: readonly T[]): ({ type: 'remove'; id: string } | { type: 'replace'; id: string; item: T } | { type: 'add'; item: T; index: number })[] {
  const before = new Map(prev.map((p) => [p.id, p] as [string, T]));
  const after = new Set(next.map((n) => n.id));
  const out: ({ type: 'remove'; id: string } | { type: 'replace'; id: string; item: T } | { type: 'add'; item: T; index: number })[] = [];
  for (const p of prev) if (!after.has(p.id)) out.push({ type: 'remove', id: p.id });
  next.forEach((n, index) => {
    const old = before.get(n.id);
    if (!old) out.push({ type: 'add', item: n, index });
    else if (old !== n && !flowDeepEqual(old, n)) out.push({ type: 'replace', id: n.id, item: n });
  });
  return out;
}
