import { describe, expect, it } from 'vitest';
import {
  absolutePosition,
  absolutePositions,
  computeNodeZ,
  dragRoots,
  expandParentBox,
  getConnectedEdges,
  getDescendants,
  getElementsToRemove,
  getIncomers,
  getIntersectingNodes,
  getNodesBounds,
  getNodesInside,
  getOutgoers,
  getVisibleNodeIds,
  hasSize,
  isEdge,
  isEdgeVisible,
  isNode,
  nodeDepth,
  nodeLookup,
  nodeRect,
  nodeSize,
  sortNodesParentsFirst,
} from '../src/flow';
import type { FlowEdge, FlowNode } from '../src/flow';

const node = (id: string, x: number, y: number, extra: Partial<FlowNode> = {}): FlowNode => ({ id, position: { x, y }, width: 100, height: 40, ...extra });

// a → b → c, a → c, d alone; g is a group holding g1 and g2 (g2 inside g1).
const nodes: FlowNode[] = [
  node('a', 0, 0),
  node('b', 200, 0),
  node('c', 400, 0),
  node('d', 0, 200),
  node('g', 600, 100, { type: 'group', width: 300, height: 200 }),
  node('g1', 20, 30, { parentId: 'g', width: 120, height: 100 }),
  node('g2', 10, 10, { parentId: 'g1', width: 50, height: 20 }),
];
const edges: FlowEdge[] = [
  { id: 'ab', source: 'a', target: 'b' },
  { id: 'bc', source: 'b', target: 'c' },
  { id: 'ac', source: 'a', target: 'c' },
  { id: 'cg2', source: 'c', target: 'g2' },
];

describe('flow graph: telling nodes and edges apart', () => {
  it('recognises nodes and edges', () => {
    expect(isNode(nodes[0])).toBe(true);
    expect(isNode(edges[0])).toBe(false);
    expect(isNode({ id: 'x', position: { x: 'a', y: 0 } })).toBe(false);
    expect(isNode({ id: 'x', position: { x: 1, y: 2 }, source: 'a' })).toBe(false);
    expect(isEdge(edges[0])).toBe(true);
    expect(isEdge(nodes[0])).toBe(false);
    expect(isEdge(null)).toBe(false);
  });
});

describe('flow graph: sizes and positions', () => {
  it('prefers the measured size, then the node size, then the initial size', () => {
    const n: FlowNode = { id: 'n', position: { x: 0, y: 0 }, width: 10, height: 20, measured: { width: 30, height: 40 }, initialWidth: 1, initialHeight: 2 };
    expect(nodeSize(n)).toEqual({ width: 30, height: 40 });
    expect(nodeSize(n, new Map([['n', { width: 50, height: 60 }]]))).toEqual({ width: 50, height: 60 });
    expect(nodeSize({ id: 'm', position: { x: 0, y: 0 }, initialWidth: 1, initialHeight: 2 })).toEqual({ width: 1, height: 2 });
    expect(nodeSize({ id: 'z', position: { x: 0, y: 0 } })).toEqual({ width: 0, height: 0 });
    expect(hasSize({ id: 'z', position: { x: 0, y: 0 } })).toBe(false);
    expect(hasSize(n)).toBe(true);
  });

  it('adds up parent positions for child nodes', () => {
    const lookup = nodeLookup(nodes);
    expect(absolutePosition(lookup.get('g2') as FlowNode, lookup)).toEqual({ x: 630, y: 140 });
    const all = absolutePositions(nodes);
    expect(all.get('g1')).toEqual({ x: 620, y: 130 });
    expect(all.get('a')).toEqual({ x: 0, y: 0 });
    expect(nodeRect(lookup.get('g1') as FlowNode, lookup)).toEqual({ x: 620, y: 130, width: 120, height: 100 });
    expect(nodeDepth(lookup.get('g2') as FlowNode, lookup)).toBe(2);
    expect(nodeDepth(lookup.get('a') as FlowNode, lookup)).toBe(0);
  });

  it('survives a missing parent and a loop of parents', () => {
    const loop = [node('p', 5, 5, { parentId: 'q' }), node('q', 1, 1, { parentId: 'p' }), node('o', 3, 4, { parentId: 'missing' })];
    const lookup = nodeLookup(loop);
    expect(absolutePosition(loop[2], lookup)).toEqual({ x: 3, y: 4 });
    expect(absolutePosition(loop[0], lookup)).toEqual({ x: 6, y: 6 });
    expect(absolutePositions(loop).size).toBe(3);
    expect(sortNodesParentsFirst(loop).map((n) => n.id).sort()).toEqual(['o', 'p', 'q']);
  });

  it('measures the bounds of nodes, children placed by their parents', () => {
    expect(getNodesBounds(nodes)).toEqual({ x: 0, y: 0, width: 900, height: 300 });
    expect(getNodesBounds([nodes[5]], { nodes })).toEqual({ x: 620, y: 130, width: 120, height: 100 });
    expect(getNodesBounds([])).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    expect(getNodesBounds([node('h', 1000, 1000, { hidden: true }), nodes[0]], { includeHidden: false })).toEqual({ x: 0, y: 0, width: 100, height: 40 });
  });
});

describe('flow graph: neighbours', () => {
  it('finds incomers, outgoers and connected edges', () => {
    expect(getIncomers('c', nodes, edges).map((n) => n.id)).toEqual(['a', 'b']);
    expect(getOutgoers({ id: 'a' }, nodes, edges).map((n) => n.id)).toEqual(['b', 'c']);
    expect(getOutgoers('d', nodes, edges)).toEqual([]);
    expect(getConnectedEdges(['b'], edges).map((e) => e.id)).toEqual(['ab', 'bc']);
    expect(getConnectedEdges([nodes[2]], edges).map((e) => e.id)).toEqual(['bc', 'ac', 'cg2']);
  });

  it('finds descendants', () => {
    expect([...getDescendants('g', nodes)].sort()).toEqual(['g1', 'g2']);
    expect([...getDescendants('a', nodes)]).toEqual([]);
  });

  it('orders parents ahead of their children', () => {
    const shuffled = [nodes[6], nodes[0], nodes[5], nodes[4]];
    expect(sortNodesParentsFirst(shuffled).map((n) => n.id)).toEqual(['g', 'g1', 'g2', 'a']);
  });
});

describe('flow graph: stacking', () => {
  it('raises selected nodes and keeps children above parents', () => {
    const list = [node('p', 0, 0), node('c', 0, 0, { parentId: 'p' }), node('s', 0, 0, { selected: true }), node('z', 0, 0, { zIndex: 5 })];
    const z = computeNodeZ(list);
    expect(z.get('p')).toBe(0);
    expect(z.get('c')).toBe(1);
    expect(z.get('s')).toBe(1000);
    expect(z.get('z')).toBe(5);
    const sel = computeNodeZ([node('p', 0, 0, { selected: true }), node('c', 0, 0, { parentId: 'p' })]);
    expect(sel.get('c')).toBe(1001);
    expect(computeNodeZ([node('s', 0, 0, { selected: true })], { elevateOnSelect: false }).get('s')).toBe(0);
  });
});

describe('flow graph: hit-testing', () => {
  it('finds nodes wholly or partly inside a box', () => {
    const box = { x: -10, y: -10, width: 260, height: 60 };
    expect(getNodesInside(nodes, box).map((n) => n.id)).toEqual(['a']);
    expect(getNodesInside(nodes, box, { partially: true }).map((n) => n.id)).toEqual(['a', 'b']);
    // A child is tested where it is drawn.
    expect(getNodesInside(nodes, { x: 625, y: 135, width: 100, height: 50 }, { partially: true }).map((n) => n.id)).toEqual(['g', 'g1', 'g2']);
    expect(getNodesInside([node('h', 0, 0, { hidden: true })], box)).toEqual([]);
  });

  it('counts an unmeasured node by its corner', () => {
    const bare: FlowNode = { id: 'u', position: { x: 5, y: 5 } };
    expect(getNodesInside([bare], { x: 0, y: 0, width: 10, height: 10 })).toEqual([bare]);
    expect(getNodesInside([bare], { x: 6, y: 0, width: 10, height: 10 })).toEqual([]);
  });

  it('finds nodes that overlap a node or a box', () => {
    const list = [node('a', 0, 0), node('b', 50, 20), node('c', 300, 0)];
    expect(getIntersectingNodes('a', list).map((n) => n.id)).toEqual(['b']);
    expect(getIntersectingNodes(list[0], list).map((n) => n.id)).toEqual(['b']);
    expect(getIntersectingNodes({ x: -50, y: -50, width: 500, height: 200 }, list, false).map((n) => n.id)).toEqual(['a', 'b', 'c']);
    expect(getIntersectingNodes('missing', list)).toEqual([]);
  });

  it('picks the nodes worth drawing for the view', () => {
    const list = [node('in', 0, 0), node('out', 5000, 0), { id: 'new', position: { x: 9000, y: 9000 } } as FlowNode, node('hid', 0, 0, { hidden: true })];
    const ids = getVisibleNodeIds(list, { x: -100, y: -100, width: 500, height: 500 });
    expect([...ids].sort()).toEqual(['in', 'new']);
    expect(getVisibleNodeIds(list, { x: 4500, y: -100, width: 100, height: 100 }, { buffer: 450 }).has('out')).toBe(true);
    expect(isEdgeVisible({ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 50, y: 50, width: 10, height: 10 })).toBe(true);
    expect(isEdgeVisible({ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 50, y: 50, width: 10, height: 10 }, 10)).toBe(false);
  });
});

describe('flow graph: removing and dragging', () => {
  it('removes children of a removed group and every edge left hanging', () => {
    const out = getElementsToRemove({ nodesToRemove: ['g'], nodes, edges });
    expect(out.nodes.map((n) => n.id)).toEqual(['g', 'g1', 'g2']);
    expect(out.edges.map((e) => e.id)).toEqual(['cg2']);
  });

  it('keeps nodes and edges marked not deletable', () => {
    const list = [node('a', 0, 0, { deletable: false }), node('b', 0, 0)];
    const links: FlowEdge[] = [
      { id: 'x', source: 'a', target: 'b' },
      { id: 'y', source: 'b', target: 'a', deletable: false },
      { id: 'z', source: 'a', target: 'a' },
    ];
    expect(getElementsToRemove({ nodesToRemove: [{ id: 'a' }], nodes: list, edges: links })).toEqual({ nodes: [], edges: [] });
    const both = getElementsToRemove({ nodesToRemove: ['b'], edgesToRemove: ['y', 'z'], nodes: list, edges: links });
    expect(both.nodes.map((n) => n.id)).toEqual(['b']);
    // y touches b, so it goes even though it is not deletable on its own; z goes as asked.
    expect(both.edges.map((e) => e.id)).toEqual(['x', 'y', 'z']);
  });

  it('drags only the topmost of nodes that move together', () => {
    const lookup = nodeLookup(nodes);
    expect(dragRoots(['g', 'g2', 'a'], lookup).sort()).toEqual(['a', 'g']);
    expect(dragRoots(['g1', 'g2'], lookup)).toEqual(['g1']);
  });

  it('grows a parent to hold a child dragged past its border', () => {
    expect(expandParentBox({ x: 10, y: 10 }, { width: 20, height: 20 }, { width: 100, height: 100 })).toBeNull();
    expect(expandParentBox({ x: 90, y: 10 }, { width: 20, height: 20 }, { width: 100, height: 100 })).toEqual({ x: 0, y: 0, width: 110, height: 100 });
    expect(expandParentBox({ x: -15, y: -5 }, { width: 20, height: 20 }, { width: 100, height: 100 })).toEqual({ x: -15, y: -5, width: 115, height: 105 });
  });
});
