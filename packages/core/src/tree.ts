/** Trees (wu-tree, wu-treeSelect): the node shape apps already use, search, and check-box selection that spreads. */
import { optionField, searchText } from './select';

/** One node of a tree. The same fields TreeNode has in the apps moving over. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TreeNode<T = any> {
  label?: string;
  data?: T;
  icon?: string;
  expandedIcon?: string;
  collapsedIcon?: string;
  children?: TreeNode<T>[];
  /** `false`: has children still to load (an arrow shows; `(onNodeExpand)` loads them). */
  leaf?: boolean;
  expanded?: boolean;
  /** Picks the template (`wuTemplate="url"`); `'default'` otherwise. */
  type?: string;
  parent?: TreeNode<T>;
  partialSelected?: boolean;
  style?: Record<string, string | number> | null;
  styleClass?: string;
  /** `false`: shown but cannot be picked. */
  selectable?: boolean;
  key?: string;
  loading?: boolean;
  draggable?: boolean;
  droppable?: boolean;
  [field: string]: unknown;
}

export type TreeFilterMode = 'lenient' | 'strict';
export type TreeCheckState = 'checked' | 'partial';

/** The same node: the same object, or the same `dataKey` field (`'key'`, `'data.id'`). */
export function sameNode(a: TreeNode | null | undefined, b: TreeNode | null | undefined, dataKey?: string | null): boolean {
  if (a === b) return true;
  if (!a || !b || !dataKey) return false;
  const x = optionField(a, dataKey);
  return x !== undefined && x === optionField(b, dataKey);
}

/** Visits every node, parents before children. */
export function walkTree(nodes: readonly TreeNode[] | null | undefined, visit: (node: TreeNode, parent: TreeNode | null, depth: number) => void, parent: TreeNode | null = null, depth = 0): void {
  for (const n of nodes || []) {
    if (!n) continue;
    visit(n, parent, depth);
    walkTree(n.children, visit, n, depth + 1);
  }
}

/** Each node's parent (from where it sits, not from `node.parent`). */
export function treeParents(nodes: readonly TreeNode[] | null | undefined): Map<TreeNode, TreeNode | null> {
  const out = new Map<TreeNode, TreeNode | null>();
  walkTree(nodes, (n, p) => out.set(n, p));
  return out;
}

/**
 * The nodes a search leaves, or `null` when there is no search. A node matches on its label (or the `filterBy`
 * fields, comma separated). `lenient` keeps a match's whole subtree; `strict` keeps only matches. Either way the
 * ancestors of a match stay, so it can be reached.
 */
export function filterTree(nodes: readonly TreeNode[] | null | undefined, query: string, filterBy?: string | null, mode: TreeFilterMode = 'lenient'): Set<TreeNode> | null {
  const q = searchText(query);
  if (!q) return null;
  const fields = (filterBy || 'label')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const hit = (n: TreeNode) => fields.some((f) => searchText(String(optionField(n, f) ?? '')).includes(q));
  const keep = new Set<TreeNode>();
  const addAll = (n: TreeNode) => {
    keep.add(n);
    for (const c of n.children || []) if (c) addAll(c);
  };
  // True when the node or something under it stays.
  const visit = (n: TreeNode): boolean => {
    if (hit(n)) {
      if (mode === 'lenient') addAll(n);
      else {
        keep.add(n);
        for (const c of n.children || []) if (c) visit(c);
      }
      return true;
    }
    let any = false;
    for (const c of n.children || []) if (c && visit(c)) any = true;
    if (any) keep.add(n);
    return any;
  };
  for (const n of nodes || []) if (n) visit(n);
  return keep;
}

/** Which nodes show a ticked or a half-ticked box for this selection. */
export function treeCheckStates(nodes: readonly TreeNode[] | null | undefined, selection: readonly TreeNode[] | null | undefined, dataKey?: string | null): Map<TreeNode, TreeCheckState> {
  const out = new Map<TreeNode, TreeCheckState>();
  const sel = selection || [];
  const picked = (n: TreeNode) => sel.some((s) => sameNode(s, n, dataKey));
  // Returns 'checked', 'partial' or null for a node, filling the map on the way.
  const visit = (n: TreeNode): TreeCheckState | null => {
    let state: TreeCheckState | null = picked(n) ? 'checked' : null;
    const kids = (n.children || []).filter(Boolean);
    if (kids.length) {
      const states = kids.map(visit);
      // All children ticked shows ticked; some shows half.
      if (!state && states.some((s) => s)) state = states.every((s) => s === 'checked') ? 'checked' : 'partial';
    }
    if (state) out.set(n, state);
    return state;
  };
  for (const n of nodes || []) if (n) visit(n);
  return out;
}

/**
 * The selection after ticking (or unticking) a node's box. `down`: its whole subtree follows; `up`: a parent is
 * ticked when all its children are, and unticked otherwise. Nodes with `selectable: false` are left as they are.
 */
export function toggleTreeCheck(
  nodes: readonly TreeNode[] | null | undefined,
  selection: readonly TreeNode[] | null | undefined,
  node: TreeNode,
  check: boolean,
  opts: { up?: boolean; down?: boolean; dataKey?: string | null } = {},
): TreeNode[] {
  const { up = true, down = true, dataKey } = opts;
  let out = [...(selection || [])];
  const has = (n: TreeNode) => out.some((s) => sameNode(s, n, dataKey));
  const set = (n: TreeNode, on: boolean) => {
    if (n.selectable === false) return;
    if (on && !has(n)) out.push(n);
    if (!on && has(n)) out = out.filter((s) => !sameNode(s, n, dataKey));
  };
  set(node, check);
  if (down) {
    const spread = (n: TreeNode) => {
      for (const c of n.children || []) {
        if (!c) continue;
        set(c, check);
        spread(c);
      }
    };
    spread(node);
  }
  if (up) {
    const parents = treeParents(nodes);
    let p = parents.get(node) ?? null;
    while (p) {
      const kids = (p.children || []).filter((c) => c && c.selectable !== false);
      set(p, kids.length > 0 && kids.every(has));
      p = parents.get(p) ?? null;
    }
  }
  return out;
}
