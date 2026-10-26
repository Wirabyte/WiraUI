import { describe, expect, it } from 'vitest';
import {
  arrowStep,
  backgroundPattern,
  boxSelection,
  clickSelection,
  dragPositions,
  edgeZIndex,
  handleConnectionCount,
  handleIsFull,
  isTypingTarget,
  keyMatches,
  minimapLayout,
  minimapMaskPath,
  minimapToFlow,
  multiKeyHeld,
  parentGrowth,
  pastThreshold,
  validConnection,
} from '../src/flow';
import type { FlowEdge, FlowNode } from '../src/flow';

const size = { width: 100, height: 40 };

describe('flow interaction: dragging', () => {
  it('moves every node by the pointer delta', () => {
    const out = dragPositions(
      [
        { id: 'a', start: { x: 0, y: 0 }, size },
        { id: 'b', start: { x: 200, y: 50 }, size },
      ],
      { x: 15, y: -5 }
    );
    expect(out.get('a')).toEqual({ position: { x: 15, y: -5 }, absolute: { x: 15, y: -5 } });
    expect(out.get('b')).toEqual({ position: { x: 215, y: 45 }, absolute: { x: 215, y: 45 } });
  });

  it('snaps each node to the grid', () => {
    const out = dragPositions([{ id: 'a', start: { x: 3, y: 0 }, size }], { x: 10, y: 22 }, { snapGrid: [15, 15] });
    expect(out.get('a')?.position).toEqual({ x: 15, y: 15 });
  });

  it('gives child positions relative to the parent and keeps them inside it', () => {
    const child = { id: 'c', start: { x: 110, y: 110 }, size: { width: 50, height: 20 }, parentPosition: { x: 100, y: 100 }, parentSize: { width: 200, height: 100 }, extent: 'parent' as const };
    expect(dragPositions([child], { x: 20, y: 10 }).get('c')).toEqual({ position: { x: 30, y: 20 }, absolute: { x: 130, y: 120 } });
    expect(dragPositions([child], { x: 500, y: -500 }).get('c')).toEqual({ position: { x: 150, y: 0 }, absolute: { x: 250, y: 100 } });
    // A child that may grow its parent only stops at the top and left.
    expect(dragPositions([{ ...child, expandParent: true }], { x: 500, y: -500 }).get('c')?.position).toEqual({ x: 510, y: 0 });
    // Without an extent a child can leave its parent's box.
    expect(dragPositions([{ ...child, extent: null }], { x: -50, y: 0 }).get('c')?.position).toEqual({ x: -40, y: 10 });
  });

  it('keeps nodes inside their own extent or the flow extent', () => {
    const extent: [[number, number], [number, number]] = [
      [0, 0],
      [300, 300],
    ];
    expect(dragPositions([{ id: 'a', start: { x: 0, y: 0 }, size }], { x: -50, y: 400 }, { nodeExtent: extent }).get('a')?.position).toEqual({ x: 0, y: 260 });
    expect(dragPositions([{ id: 'a', start: { x: 0, y: 0 }, size, extent }], { x: 400, y: 0 }).get('a')?.position).toEqual({ x: 200, y: 0 });
    // nodeExtent is for top-level nodes; a child follows its parent instead.
    const child = { id: 'c', start: { x: 10, y: 10 }, size, parentPosition: { x: 0, y: 0 }, parentSize: { width: 50, height: 50 } };
    expect(dragPositions([child], { x: 900, y: 0 }, { nodeExtent: extent }).get('c')?.position).toEqual({ x: 910, y: 10 });
  });

  it('says how big a parent must grow', () => {
    expect(parentGrowth({ x: 10, y: 10 }, size, { width: 200, height: 200 })).toBeNull();
    expect(parentGrowth({ x: 150, y: 10 }, size, { width: 200, height: 200 })).toEqual({ width: 250, height: 200 });
    expect(parentGrowth({ x: 150, y: 190 }, size, { width: 200, height: 200 })).toEqual({ width: 250, height: 230 });
  });

  it('tells a drag from a click', () => {
    expect(pastThreshold({ x: 0, y: 0 }, { x: 1, y: 0 }, 1)).toBe(false);
    expect(pastThreshold({ x: 0, y: 0 }, { x: 1, y: 1 }, 1)).toBe(true);
    expect(pastThreshold({ x: 0, y: 0 }, { x: 0.5, y: 0 }, 0)).toBe(true);
  });
});

describe('flow interaction: selection', () => {
  const nodes: FlowNode[] = [
    { id: 'a', position: { x: 0, y: 0 }, width: 50, height: 50 },
    { id: 'b', position: { x: 100, y: 0 }, width: 50, height: 50 },
    { id: 'c', position: { x: 300, y: 0 }, width: 50, height: 50, selectable: false },
    { id: 'd', position: { x: 600, y: 0 }, width: 50, height: 50 },
  ];
  const edges: FlowEdge[] = [
    { id: 'ab', source: 'a', target: 'b' },
    { id: 'bc', source: 'b', target: 'c' },
    { id: 'ad', source: 'a', target: 'd' },
    { id: 'ba', source: 'b', target: 'a', selectable: false },
  ];

  it('selects the nodes inside a box and the edges between them', () => {
    const s = boxSelection(nodes, edges, { x: -10, y: -10, width: 400, height: 100 });
    expect([...s.nodes]).toEqual(['a', 'b']);
    expect([...s.edges]).toEqual(['ab']);
  });

  it('can select nodes the box only touches', () => {
    const s = boxSelection(nodes, edges, { x: 25, y: 25, width: 100, height: 10 }, { mode: 'partial' });
    expect([...s.nodes]).toEqual(['a', 'b']);
    const full = boxSelection(nodes, edges, { x: 25, y: 25, width: 100, height: 10 });
    expect([...full.nodes]).toEqual([]);
  });

  it('keeps what was selected when the box started with Shift held', () => {
    const s = boxSelection(nodes, edges, { x: 590, y: -10, width: 100, height: 100 }, { keep: ['a', 'ad'] });
    expect([...s.nodes]).toEqual(['a', 'd']);
    expect([...s.edges]).toEqual(['ad']);
  });

  it('toggles with a multi-select key and replaces without', () => {
    expect([...clickSelection(new Set(['a', 'b']), 'c', false)]).toEqual(['c']);
    expect([...clickSelection(new Set(['a', 'b']), 'c', true)]).toEqual(['a', 'b', 'c']);
    expect([...clickSelection(new Set(['a', 'b']), 'a', true)]).toEqual(['b']);
  });
});

describe('flow interaction: connecting', () => {
  const edges: FlowEdge[] = [
    { id: 'e1', source: 'a', target: 'b', targetHandle: 'in' },
    { id: 'e2', source: 'c', target: 'b', targetHandle: 'in' },
  ];
  const src = { nodeId: 'a', id: null, type: 'source' as const };
  const tgt = (limit?: number) => ({ nodeId: 'b', id: 'in', type: 'target' as const, limit });

  it('counts edges at a handle', () => {
    expect(handleConnectionCount(edges, tgt())).toBe(2);
    expect(handleConnectionCount(edges, tgt(), 'e1')).toBe(1);
    expect(handleConnectionCount(edges, src)).toBe(1);
    expect(handleConnectionCount(edges, { nodeId: 'b', id: null, type: 'target' })).toBe(0);
    expect(handleIsFull(edges, tgt(2))).toBe(true);
    expect(handleIsFull(edges, tgt(3))).toBe(false);
    expect(handleIsFull(edges, tgt(0))).toBe(false);
  });

  it('allows a source onto a free target', () => {
    expect(validConnection(src, { nodeId: 'd', id: null, type: 'target' })).toEqual({ source: 'a', sourceHandle: null, target: 'd', targetHandle: null });
    // Dragged the other way round, the source still comes first.
    expect(validConnection({ nodeId: 'd', id: null, type: 'target' }, src)).toEqual({ source: 'a', sourceHandle: null, target: 'd', targetHandle: null });
  });

  it('refuses two sources in strict mode but not in loose mode', () => {
    const other = { nodeId: 'd', id: null, type: 'source' as const };
    expect(validConnection(src, other)).toBeNull();
    expect(validConnection(src, other, { mode: 'loose' })).toEqual({ source: 'a', sourceHandle: null, target: 'd', targetHandle: null });
  });

  it('refuses full handles, handles that take no connections, and duplicates', () => {
    expect(validConnection({ nodeId: 'x', id: null, type: 'source' }, tgt(2), { edges })).toBeNull();
    expect(validConnection({ nodeId: 'x', id: null, type: 'source' }, tgt(3), { edges })).not.toBeNull();
    expect(validConnection(src, { nodeId: 'd', id: null, type: 'target', connectableEnd: false })).toBeNull();
    expect(validConnection(src, tgt(), { edges })).toBeNull();
    expect(validConnection(src, tgt(), { edges, allowDuplicates: true })).not.toBeNull();
    // Moving e1 itself onto the same handle is fine (it does not count as a duplicate or against the limit).
    expect(validConnection(src, tgt(2), { edges, ignoreEdgeId: 'e1' })).not.toBeNull();
  });

  it('asks the app last, and treats an error as a no', () => {
    const rules = { isValidConnection: (c: { target: string }) => c.target !== 'd' };
    expect(validConnection(src, { nodeId: 'd', id: null, type: 'target' }, rules)).toBeNull();
    expect(validConnection(src, { nodeId: 'e', id: null, type: 'target' }, rules)).not.toBeNull();
    expect(
      validConnection(src, { nodeId: 'e', id: null, type: 'target' }, {
        isValidConnection: () => {
          throw new Error('boom');
        },
      })
    ).toBeNull();
  });
});

describe('flow interaction: stacking and keys', () => {
  it('raises edges between grouped nodes to their level', () => {
    expect(edgeZIndex({}, 0, 0, false)).toBe(0);
    expect(edgeZIndex({ zIndex: 3 }, 0, 0, false)).toBe(3);
    expect(edgeZIndex({}, 1, 2, true)).toBe(2);
    expect(edgeZIndex({ selected: true }, 0, 0, false, true)).toBe(1000);
    expect(edgeZIndex({ selected: true }, 0, 0, false)).toBe(0);
  });

  it('matches keys by name or by key code', () => {
    expect(keyMatches({ key: 'Delete' }, ['Backspace', 'Delete'])).toBe(true);
    expect(keyMatches({ key: 'Delete' }, 'Backspace')).toBe(false);
    expect(keyMatches({ key: 'แ', code: 'KeyC' }, 'c')).toBe(true);
    expect(keyMatches({ key: ' ', code: 'Space' }, 'Space')).toBe(true);
    expect(keyMatches({ key: 'a' }, null)).toBe(false);
  });

  it('knows when a multi-select key is held', () => {
    expect(multiKeyHeld({ shiftKey: true })).toBe(true);
    expect(multiKeyHeld({ ctrlKey: true })).toBe(true);
    expect(multiKeyHeld({ metaKey: true })).toBe(true);
    expect(multiKeyHeld({ altKey: true })).toBe(false);
    expect(multiKeyHeld({ shiftKey: true }, 'Meta')).toBe(false);
    expect(multiKeyHeld({ shiftKey: true }, null)).toBe(false);
  });

  it('turns arrow keys into steps, ten times bigger with Shift', () => {
    expect(arrowStep({ key: 'ArrowLeft' })).toEqual({ x: -5, y: 0 });
    expect(arrowStep({ key: 'ArrowDown', shiftKey: true })).toEqual({ x: 0, y: 50 });
    expect(arrowStep({ key: 'ArrowUp' }, 15)).toEqual({ x: 0, y: -15 });
    expect(arrowStep({ key: 'Enter' })).toBeNull();
  });

  it('notices when the user is typing', () => {
    const el = (tagName: string, type?: string, editable = false) => ({ tagName, isContentEditable: editable, getAttribute: (n: string) => (n === 'type' ? type ?? null : null) });
    expect(isTypingTarget(el('INPUT'))).toBe(true);
    expect(isTypingTarget(el('INPUT', 'checkbox'))).toBe(false);
    expect(isTypingTarget(el('TEXTAREA'))).toBe(true);
    expect(isTypingTarget(el('DIV', undefined, true))).toBe(true);
    expect(isTypingTarget(el('DIV'))).toBe(false);
    expect(isTypingTarget(null)).toBe(false);
  });
});

describe('flow interaction: minimap and background', () => {
  it('fits the nodes and the view into the minimap, centred, with a margin', () => {
    const m = minimapLayout({ x: 0, y: 0, width: 400, height: 100 }, { x: 0, y: 0, width: 200, height: 100 }, 200, 100, 0);
    expect(m.viewBox).toEqual({ x: 0, y: -50, width: 400, height: 200 });
    expect(m.scale).toBe(2);
    expect(minimapToFlow({ x: 100, y: 50 }, m)).toEqual({ x: 200, y: 50 });
    const pad = minimapLayout(null, { x: 0, y: 0, width: 200, height: 100 }, 200, 100, 5);
    expect(pad.viewBox).toEqual({ x: -5, y: -5, width: 210, height: 110 });
    expect(pad.scale).toBeCloseTo(1.05);
  });

  it('cuts the view out of the minimap mask', () => {
    const d = minimapMaskPath({ x: 0, y: 0, width: 100, height: 50 }, { x: 10, y: 10, width: 20, height: 10 });
    expect(d).toBe('M-100,-50h300v150h-300zM10,10h20v10h-20z');
  });

  it('tiles dots on the flow grid, scaled with the zoom', () => {
    const p = backgroundPattern({ x: 0, y: 0, zoom: 1 }, 'dots', 20, 1);
    expect(p).toMatchObject({ width: 20, height: 20, x: -10, y: -10, radius: 0.5 });
    const z = backgroundPattern({ x: 35, y: -5, zoom: 2 }, 'dots', 20, 2);
    expect(z).toMatchObject({ width: 40, height: 40, x: 15, y: 15, radius: 2 });
    // Dot centres land on multiples of the gap in flow coordinates: (x + width / 2 - vp.x) / zoom.
    expect((z.x + z.width / 2 - 35) / 2).toBe(0);
  });

  it('draws lines and crosses, with separate gaps per axis and an offset', () => {
    const l = backgroundPattern({ x: 0, y: 0, zoom: 1 }, 'lines', [20, 10]);
    expect(l).toMatchObject({ width: 20, height: 10, path: 'M10,0V10M0,5H20' });
    const c = backgroundPattern({ x: 0, y: 0, zoom: 1 }, 'cross', 20, 6);
    expect(c.path).toBe('M7,10H13M10,7V13');
    const o = backgroundPattern({ x: 0, y: 0, zoom: 1 }, 'dots', 20, 1, 5);
    expect(o.x).toBe(-5);
  });
});
