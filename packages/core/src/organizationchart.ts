/** Organization chart (wt-organizationChart): leaves, selection, and moving between the boxes with the keys. */
import type { TreeNode } from './tree';

export type OrgChartSelectionMode = 'single' | 'multiple' | null | undefined;

/** A node without children is a leaf, unless `leaf: false` says children are still to come. */
export function orgChartIsLeaf(node: TreeNode | null | undefined): boolean {
  if (!node) return true;
  return node.leaf === false ? false : !(node.children && node.children.length);
}

/** Children show when the node is not a leaf and is `expanded` (the way the chart has always worked). */
export function orgChartIsOpen(node: TreeNode | null | undefined): boolean {
  return !!node && !orgChartIsLeaf(node) && !!node.expanded;
}

export function orgChartIsSelected(selection: unknown, node: TreeNode, mode: OrgChartSelectionMode): boolean {
  if (!mode || !selection) return false;
  if (mode === 'single') return selection === node;
  return Array.isArray(selection) && selection.indexOf(node) >= 0;
}

/**
 * The selection after a click on `node`: picked if it was not, unpicked if it was (single: the only one; multiple:
 * added to / taken out of the list). `null` when nothing changes (no selection mode, or `selectable: false`).
 */
export function orgChartToggleSelection(selection: unknown, node: TreeNode, mode: OrgChartSelectionMode): { selection: unknown; selected: boolean } | null {
  if (!mode || node.selectable === false) return null;
  const was = orgChartIsSelected(selection, node, mode);
  if (mode === 'single') return was ? { selection: null, selected: false } : { selection: node, selected: true };
  const list: TreeNode[] = Array.isArray(selection) ? selection : [];
  return was ? { selection: list.filter((n) => n !== node), selected: false } : { selection: [...list, node], selected: true };
}

/** A box on screen: its node, parent, depth (1 = the root) and its brothers and sisters. */
export interface OrgChartEntry {
  node: TreeNode;
  parent: TreeNode | null;
  level: number;
  siblings: TreeNode[];
}

/** The boxes that show (inside open nodes), parents before children, left to right. */
export function orgChartVisible(root: TreeNode | null | undefined): OrgChartEntry[] {
  const out: OrgChartEntry[] = [];
  const visit = (node: TreeNode, parent: TreeNode | null, level: number, siblings: TreeNode[]) => {
    out.push({ node, parent, level, siblings });
    if (orgChartIsOpen(node)) {
      const kids = (node.children || []).filter(Boolean);
      for (const child of kids) visit(child, node, level + 1, kids);
    }
  };
  if (root) visit(root, null, 1, [root]);
  return out;
}

/** What a key does on the focused box. */
export type OrgChartMove = { focus: TreeNode } | { expand: TreeNode } | { collapse: TreeNode };

/**
 * Keys on a box, the tree keys turned on their side: ↓ opens a closed node (when `collapsible`) or goes to its first
 * child; ↑ closes an open node (when `collapsible`) or goes to the parent; ← / → go to the box beside it under the same
 * parent; Home / End go to the root and the last box that shows. `null` when the key does nothing here.
 */
export function orgChartKey(key: string, node: TreeNode, root: TreeNode | null | undefined, collapsible: boolean): OrgChartMove | null {
  const visible = orgChartVisible(root);
  const entry = visible.find((e) => e.node === node);
  if (!entry) return null;
  const hasChildren = !orgChartIsLeaf(node) && !!(node.children && node.children.length);
  switch (key) {
    case 'ArrowDown':
      if (orgChartIsOpen(node) && hasChildren) return { focus: (node.children as TreeNode[]).filter(Boolean)[0] };
      if (collapsible && !orgChartIsLeaf(node) && !node.expanded) return { expand: node };
      return null;
    case 'ArrowUp':
      if (collapsible && orgChartIsOpen(node)) return { collapse: node };
      return entry.parent ? { focus: entry.parent } : null;
    case 'ArrowLeft':
    case 'ArrowRight': {
      const i = entry.siblings.indexOf(node);
      const j = key === 'ArrowLeft' ? i - 1 : i + 1;
      return j >= 0 && j < entry.siblings.length ? { focus: entry.siblings[j] } : null;
    }
    case 'Home':
      return visible[0].node === node ? null : { focus: visible[0].node };
    case 'End': {
      const last = visible[visible.length - 1].node;
      return last === node ? null : { focus: last };
    }
    default:
      return null;
  }
}
