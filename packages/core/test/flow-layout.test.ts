import { describe, expect, it } from 'vitest';
import { countCrossings, layoutFlow, layoutHandlePositions, layoutTree, placeInOrder } from '../src/flow';
import type { FlowEdge, FlowNode } from '../src/flow';

const n = (id: string, extra: Partial<FlowNode> = {}): FlowNode => ({ id, position: { x: 0, y: 0 }, ...extra });
const e = (source: string, target: string): FlowEdge => ({ id: `${source}-${target}`, source, target });
const at = (list: FlowNode[], id: string) => (list.find((x) => x.id === id) as FlowNode).position;
const W = 150;
const H = 40;

/** No two laid-out boxes overlap. */
function noOverlap(list: FlowNode[], w = W, h = H): boolean {
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i].position;
      const b = list[j].position;
      if (a.x < b.x + w && b.x < a.x + w && a.y < b.y + h && b.y < a.y + h) return false;
    }
  }
  return true;
}

/** Crossings in a top-to-bottom layout, reading each rank's order from the x positions. */
function crossingsOf(list: FlowNode[], links: FlowEdge[]): number {
  const ranks = new Map<number, FlowNode[]>();
  for (const node of list) {
    const r = ranks.get(node.position.y);
    if (r) r.push(node);
    else ranks.set(node.position.y, [node]);
  }
  const layers = [...ranks.entries()].sort((a, b) => a[0] - b[0]).map(([, l]) => l.sort((a, b) => a.position.x - b.position.x).map((x) => x.id));
  return countCrossings(layers, links.map((l) => [l.source, l.target] as [string, string]));
}

describe('flow layout: helpers', () => {
  it('counts crossings between neighbouring layers', () => {
    expect(countCrossings([['a', 'b'], ['x', 'y']], [['a', 'y'], ['b', 'x']])).toBe(1);
    expect(countCrossings([['a', 'b'], ['x', 'y']], [['a', 'x'], ['b', 'y']])).toBe(0);
    // Written lower-first works too.
    expect(countCrossings([['a', 'b'], ['x', 'y']], [['y', 'a'], ['x', 'b']])).toBe(1);
    expect(countCrossings([['a']], [])).toBe(0);
  });

  it('places items in order as close to where they want to be as the gaps allow', () => {
    expect(placeInOrder([0, 0], [10])).toEqual([-5, 5]);
    expect(placeInOrder([0, 100], [10])).toEqual([0, 100]);
    expect(placeInOrder([5, 0, 10], [2, 2])).toEqual([1.5, 3.5, 10]);
    expect(placeInOrder([], [])).toEqual([]);
  });

  it('picks handle sides for each direction', () => {
    expect(layoutHandlePositions('TB')).toEqual({ sourcePosition: 'bottom', targetPosition: 'top' });
    expect(layoutHandlePositions('BT')).toEqual({ sourcePosition: 'top', targetPosition: 'bottom' });
    expect(layoutHandlePositions('LR')).toEqual({ sourcePosition: 'right', targetPosition: 'left' });
    expect(layoutHandlePositions('RL')).toEqual({ sourcePosition: 'left', targetPosition: 'right' });
  });
});

describe('flow layout: layered graphs', () => {
  const chain = [n('a'), n('b'), n('c')];
  const chainEdges = [e('a', 'b'), e('b', 'c')];

  it('puts a chain in ranks, one below the other', () => {
    const out = layoutFlow(chain, chainEdges);
    expect(out.map((x) => x.position)).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 120 },
      { x: 0, y: 240 },
    ]);
    expect(out[0]).toMatchObject({ sourcePosition: 'bottom', targetPosition: 'top' });
    // The input is not touched.
    expect(chain[1].position).toEqual({ x: 0, y: 0 });
  });

  it('lays out in every direction', () => {
    expect(layoutFlow(chain, chainEdges, { direction: 'LR' }).map((x) => x.position)).toEqual([
      { x: 0, y: 0 },
      { x: 230, y: 0 },
      { x: 460, y: 0 },
    ]);
    expect(layoutFlow(chain, chainEdges, { direction: 'BT' }).map((x) => x.position.y)).toEqual([240, 120, 0]);
    expect(layoutFlow(chain, chainEdges, { direction: 'RL' }).map((x) => x.position.x)).toEqual([460, 230, 0]);
    expect(layoutFlow(chain, chainEdges, { direction: 'LR' })[1]).toMatchObject({ sourcePosition: 'right', targetPosition: 'left' });
  });

  it('uses the spacing and sizes it is given', () => {
    const sizes = new Map([
      ['a', { width: 100, height: 60 }],
      ['b', { width: 100, height: 20 }],
    ]);
    const out = layoutFlow([n('a'), n('b')], [e('a', 'b')], { rankSep: 10, sizes });
    expect(at(out, 'b')).toEqual({ x: 0, y: 70 });
    const measured = layoutFlow([n('a', { measured: { width: 80, height: 30 } }), n('b')], [e('a', 'b')], { rankSep: 10 });
    // b has no size: the default 150 × 40; a (80 wide) is centred over it.
    expect(at(measured, 'a')).toEqual({ x: 35, y: 0 });
    expect(at(measured, 'b')).toEqual({ x: 0, y: 40 });
  });

  it('centres a parent over its children', () => {
    const out = layoutFlow([n('a'), n('b'), n('c')], [e('a', 'b'), e('a', 'c')]);
    const a = at(out, 'a');
    const b = at(out, 'b');
    const c = at(out, 'c');
    expect(b.y).toBe(c.y);
    expect(a.x + W / 2).toBeCloseTo((b.x + c.x) / 2 + W / 2);
    expect(Math.abs(c.x - b.x)).toBeGreaterThanOrEqual(W + 40);
    expect(noOverlap(out)).toBe(true);
  });

  it('reorders a rank to remove a crossing', () => {
    const nodes = [n('a'), n('b'), n('x'), n('y')];
    const links = [e('a', 'x'), e('a', 'y'), e('b', 'x')];
    const out = layoutFlow(nodes, links);
    expect(crossingsOf(out, links)).toBe(0);
    expect(noOverlap(out)).toBe(true);
  });

  it('lays out a bigger graph without overlaps and with fewer crossings than the given order', () => {
    const ids = ['r', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const nodes = ids.map((id) => n(id));
    const links = [e('r', 'a'), e('r', 'b'), e('r', 'c'), e('a', 'f'), e('b', 'd'), e('c', 'e'), e('a', 'e'), e('c', 'd'), e('d', 'g'), e('e', 'h'), e('f', 'h'), e('b', 'g')];
    const out = layoutFlow(nodes, links);
    expect(noOverlap(out)).toBe(true);
    const naive = countCrossings([['r'], ['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h']], links.map((l) => [l.source, l.target] as [string, string]));
    expect(crossingsOf(out, links)).toBeLessThanOrEqual(naive);
    // Every edge points down the page.
    for (const l of links) expect(at(out, l.target).y).toBeGreaterThan(at(out, l.source).y);
  });

  it('gives a long edge room: the node it skips past does not sit on it', () => {
    const out = layoutFlow([n('a'), n('b'), n('c'), n('d')], [e('a', 'b'), e('b', 'c'), e('a', 'c'), e('a', 'd'), e('d', 'c')]);
    expect(noOverlap(out)).toBe(true);
    expect(at(out, 'c').y).toBe(240);
  });

  it('breaks cycles instead of looping', () => {
    const out = layoutFlow([n('a'), n('b'), n('c')], [e('a', 'b'), e('b', 'c'), e('c', 'a')]);
    expect(out.map((x) => x.position.y)).toEqual([0, 120, 240]);
  });

  it('puts parts that are not connected side by side', () => {
    const out = layoutFlow([n('a'), n('b'), n('c'), n('d'), n('lone')], [e('a', 'b'), e('c', 'd')]);
    expect(noOverlap(out)).toBe(true);
    expect(at(out, 'a').x).toBeLessThan(at(out, 'c').x);
    expect(at(out, 'c').x).toBeLessThan(at(out, 'lone').x);
    expect(at(out, 'lone').y).toBe(0);
    // The gap between parts is twice nodeSep by default.
    expect(at(out, 'c').x - at(out, 'a').x).toBe(W + 80);
  });

  it('leaves child nodes in their parent, and links to a child count for its parent', () => {
    const child = n('g1', { parentId: 'g', position: { x: 10, y: 20 } });
    const nodes = [n('a'), n('g', { type: 'group', width: 300, height: 200 }), child];
    const out = layoutFlow(nodes, [e('a', 'g1')]);
    expect(out[2]).toBe(child);
    expect(at(out, 'g').y).toBe(120);
  });

  it('honours the origin and can leave the handle sides alone', () => {
    const out = layoutFlow(chain, chainEdges, { origin: { x: 50, y: 25 }, setHandlePositions: false });
    expect(out[0].position).toEqual({ x: 50, y: 25 });
    expect(out[0].sourcePosition).toBeUndefined();
    expect(layoutFlow([], [])).toEqual([]);
  });

  it('ignores edges to nodes it was not given, and hidden edges', () => {
    const out = layoutFlow([n('a'), n('b')], [e('a', 'zzz'), { ...e('a', 'b'), hidden: true }]);
    expect(at(out, 'a').y).toBe(0);
    expect(at(out, 'b').y).toBe(0);
  });
});

describe('flow layout: trees', () => {
  it('centres a parent over its children and lines each level up', () => {
    const out = layoutTree([n('r'), n('a'), n('b'), n('c')], [e('r', 'a'), e('r', 'b'), e('r', 'c')]);
    expect(at(out, 'r')).toEqual({ x: 174, y: 0 });
    expect(at(out, 'a')).toEqual({ x: 0, y: 100 });
    expect(at(out, 'b')).toEqual({ x: 174, y: 100 });
    expect(at(out, 'c')).toEqual({ x: 348, y: 100 });
    expect(out[0]).toMatchObject({ sourcePosition: 'bottom', targetPosition: 'top' });
  });

  it('packs subtrees by their outlines unless told not to', () => {
    const nodes = [n('r'), n('a'), n('b'), n('a1'), n('a2'), n('a3')];
    const links = [e('r', 'a'), e('r', 'b'), e('a', 'a1'), e('a', 'a2'), e('a', 'a3')];
    const tight = layoutTree(nodes, links);
    const loose = layoutTree(nodes, links, { compact: false });
    const width = (list: FlowNode[]) => Math.max(...list.map((x) => x.position.x + W)) - Math.min(...list.map((x) => x.position.x));
    expect(noOverlap(tight)).toBe(true);
    expect(noOverlap(loose)).toBe(true);
    expect(at(tight, 'b').x - at(tight, 'a').x).toBe(W + 24);
    expect(at(loose, 'b').x - at(loose, 'a').x).toBeGreaterThan(W + 24);
    expect(width(tight)).toBeLessThanOrEqual(width(loose));
  });

  it('keeps cousins apart on deeper levels', () => {
    const nodes = ['r', 'a', 'b', 'a1', 'a2', 'b1', 'b2'].map((id) => n(id));
    const out = layoutTree(nodes, [e('r', 'a'), e('r', 'b'), e('a', 'a1'), e('a', 'a2'), e('b', 'b1'), e('b', 'b2')]);
    expect(noOverlap(out)).toBe(true);
    expect(at(out, 'b1').x - at(out, 'a2').x).toBeGreaterThanOrEqual(W + 24);
  });

  it('lines a level up under its tallest box', () => {
    const sizes = new Map([['r', { width: 150, height: 90 }]]);
    const out = layoutTree([n('r'), n('a')], [e('r', 'a')], { sizes, levelSep: 30 });
    expect(at(out, 'a').y).toBe(120);
  });

  it('takes the first parent and survives loops', () => {
    const out = layoutTree([n('a'), n('b'), n('c')], [e('a', 'c'), e('b', 'c'), e('c', 'a')]);
    expect(at(out, 'c').y).toBe(100);
    expect(at(out, 'a').y).toBe(0);
    expect(at(out, 'c').x).toBe(at(out, 'a').x);
    const loop = layoutTree([n('p'), n('q')], [e('p', 'q'), e('q', 'p')]);
    expect(at(loop, 'q').y).toBe(100);
  });

  it('places several trees side by side', () => {
    const out = layoutTree([n('a'), n('b'), n('a1')], [e('a', 'a1')]);
    expect(at(out, 'a').y).toBe(0);
    expect(at(out, 'b').y).toBe(0);
    expect(at(out, 'b').x - at(out, 'a').x).toBe(W + 24);
  });

  it('draws left to right and right to left', () => {
    const lr = layoutTree([n('r'), n('a'), n('b')], [e('r', 'a'), e('r', 'b')], { direction: 'LR' });
    expect(at(lr, 'r').x).toBe(0);
    expect(at(lr, 'a').x).toBe(210);
    expect(at(lr, 'b').y - at(lr, 'a').y).toBe(H + 24);
    expect(at(lr, 'r').y).toBe((at(lr, 'a').y + at(lr, 'b').y) / 2);
    const rl = layoutTree([n('r'), n('a')], [e('r', 'a')], { direction: 'RL' });
    expect(at(rl, 'r').x).toBe(210);
    expect(at(rl, 'a').x).toBe(0);
    expect(rl[0]).toMatchObject({ sourcePosition: 'left', targetPosition: 'right' });
  });
});
