import { describe, expect, it } from 'vitest';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  collectMarkers,
  diffItems,
  flowDeepEqual,
  flowEdgeId,
  getEdgeEnds,
  markerId,
  markerShape,
  normalizeMarker,
  reconnectEdge,
  selectionChanges,
  updateEdge,
} from '../src/flow';
import type { FlowEdge, FlowNode, FlowNodeChange } from '../src/flow';

const nodes: FlowNode[] = [
  { id: 'a', position: { x: 0, y: 0 } },
  { id: 'b', position: { x: 10, y: 10 } },
  { id: 'c', position: { x: 20, y: 20 } },
];
const edges: FlowEdge[] = [
  { id: 'ab', source: 'a', target: 'b' },
  { id: 'bc', source: 'b', target: 'c' },
];

describe('flow changes: nodes', () => {
  it('moves a node and copies only that one', () => {
    const out = applyNodeChanges([{ type: 'position', id: 'b', position: { x: 50, y: 60 }, dragging: true }], nodes);
    expect(out).not.toBe(nodes);
    expect(out[0]).toBe(nodes[0]);
    expect(out[2]).toBe(nodes[2]);
    expect(out[1]).toEqual({ id: 'b', position: { x: 50, y: 60 }, dragging: true });
    expect(nodes[1].position).toEqual({ x: 10, y: 10 });
  });

  it('records measured sizes, and sets width / height only when asked', () => {
    const measured = applyNodeChanges([{ type: 'dimensions', id: 'a', dimensions: { width: 150, height: 40 } }], nodes);
    expect(measured[0]).toEqual({ id: 'a', position: { x: 0, y: 0 }, measured: { width: 150, height: 40 } });
    const resized = applyNodeChanges([{ type: 'dimensions', id: 'a', dimensions: { width: 200, height: 80 }, setAttributes: true, resizing: true }], nodes);
    expect(resized[0]).toMatchObject({ width: 200, height: 80, resizing: true, measured: { width: 200, height: 80 } });
    const wide = applyNodeChanges([{ type: 'dimensions', id: 'a', dimensions: { width: 200, height: 80 }, setAttributes: 'width' }], nodes);
    expect(wide[0].width).toBe(200);
    expect(wide[0].height).toBeUndefined();
  });

  it('selects, removes, adds and replaces', () => {
    const changes: FlowNodeChange[] = [
      { type: 'select', id: 'a', selected: true },
      { type: 'remove', id: 'b' },
      { type: 'add', item: { id: 'd', position: { x: 1, y: 1 } } },
      { type: 'add', item: { id: 'first', position: { x: 2, y: 2 } }, index: 0 },
      { type: 'replace', id: 'c', item: { id: 'c', position: { x: 99, y: 99 }, data: { label: 'ใหม่' } } },
    ];
    const out = applyNodeChanges(changes, nodes);
    expect(out.map((n) => n.id)).toEqual(['first', 'a', 'c', 'd']);
    expect(out[1].selected).toBe(true);
    expect(out[2]).toEqual({ id: 'c', position: { x: 99, y: 99 }, data: { label: 'ใหม่' } });
  });

  it('applies several changes to one node in order, copying it once', () => {
    const out = applyNodeChanges(
      [
        { type: 'position', id: 'a', position: { x: 5, y: 5 } },
        { type: 'select', id: 'a', selected: true },
        { type: 'position', id: 'a', position: { x: 7, y: 8 }, dragging: false },
      ],
      nodes
    );
    expect(out[0]).toEqual({ id: 'a', position: { x: 7, y: 8 }, selected: true, dragging: false });
    expect(nodes[0]).toEqual({ id: 'a', position: { x: 0, y: 0 } });
  });

  it('changes nothing for an empty list or an unknown id, and still returns a new array', () => {
    const same = applyNodeChanges([], nodes);
    expect(same).toEqual(nodes);
    expect(same).not.toBe(nodes);
    expect(applyNodeChanges([{ type: 'select', id: 'zzz', selected: true }], nodes)).toEqual(nodes);
  });
});

describe('flow changes: edges', () => {
  it('selects, removes, adds and replaces edges', () => {
    const out = applyEdgeChanges(
      [
        { type: 'select', id: 'ab', selected: true },
        { type: 'remove', id: 'bc' },
        { type: 'add', item: { id: 'ca', source: 'c', target: 'a' } },
      ],
      edges
    );
    expect(out.map((e) => e.id)).toEqual(['ab', 'ca']);
    expect(out[0].selected).toBe(true);
    expect(edges[0].selected).toBeUndefined();
    const replaced = applyEdgeChanges([{ type: 'replace', id: 'ab', item: { id: 'ab', source: 'a', target: 'c' } }], edges);
    expect(replaced[0]).toEqual({ id: 'ab', source: 'a', target: 'c' });
  });
});

describe('flow changes: adding and reconnecting edges', () => {
  it('turns a connection into an edge with a made-up id and the defaults', () => {
    const out = addEdge({ source: 'a', target: 'c', sourceHandle: null, targetHandle: 'in' }, edges, { type: 'smoothstep', animated: true });
    expect(out).toHaveLength(3);
    expect(out[2]).toEqual({ id: 'e-a-c:in', source: 'a', target: 'c', sourceHandle: null, targetHandle: 'in', type: 'smoothstep', animated: true });
    expect(flowEdgeId({ source: 'x', target: 'y', sourceHandle: 'o' })).toBe('e-x:o-y');
  });

  it('does not add the same link twice, or an incomplete one', () => {
    expect(addEdge({ source: 'a', target: 'b', sourceHandle: null, targetHandle: null }, edges)).toHaveLength(2);
    expect(addEdge({ source: 'a', target: '', sourceHandle: null, targetHandle: null }, edges)).toHaveLength(2);
    // A different handle makes it a different link.
    expect(addEdge({ source: 'a', target: 'b', sourceHandle: 'x', targetHandle: null }, edges)).toHaveLength(3);
  });

  it('keeps a given id unless it is taken', () => {
    expect(addEdge({ id: 'mine', source: 'c', target: 'a' }, edges)[2].id).toBe('mine');
    const clash = addEdge({ id: 'ab', source: 'c', target: 'a' }, edges);
    expect(clash[2].id).toBe('e-c-a');
    const twice = addEdge({ source: 'c', target: 'a', sourceHandle: 'p', targetHandle: null }, [...edges, { id: 'e-c:p-a', source: 'x', target: 'y' }]);
    expect(twice[3].id).toBe('e-c:p-a-2');
  });

  it('moves an end of an edge to new handles', () => {
    const styled: FlowEdge[] = [{ id: 'ab', source: 'a', target: 'b', label: 'สาย', animated: true }, edges[1]];
    const out = reconnectEdge(styled[0], { source: 'a', target: 'c', sourceHandle: null, targetHandle: 't' }, styled);
    expect(out[0]).toEqual({ id: 'e-a-c:t', source: 'a', target: 'c', sourceHandle: null, targetHandle: 't', label: 'สาย', animated: true });
    expect(out[1]).toBe(styled[1]);
    const keep = reconnectEdge('ab', { source: 'c', target: 'b', sourceHandle: null, targetHandle: null }, styled, { shouldReplaceId: false });
    expect(keep[0].id).toBe('ab');
    expect(reconnectEdge('missing', { source: 'c', target: 'b', sourceHandle: null, targetHandle: null }, styled)).toEqual(styled);
    expect(updateEdge).toBe(reconnectEdge);
  });
});

describe('flow changes: selection, diffs, equality', () => {
  it('lists only the select changes that make a difference', () => {
    const list = [
      { id: 'a', selected: true },
      { id: 'b' },
      { id: 'c', selectable: false },
    ];
    expect(selectionChanges(list, ['b', 'c'])).toEqual([
      { type: 'select', id: 'a', selected: false },
      { type: 'select', id: 'b', selected: true },
    ]);
    expect(selectionChanges(list, ['a'])).toEqual([]);
  });

  it('compares plain data deeply', () => {
    expect(flowDeepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toBe(true);
    expect(flowDeepEqual({ a: 1, b: undefined }, { a: 1 })).toBe(true);
    expect(flowDeepEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(flowDeepEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(flowDeepEqual(NaN, NaN)).toBe(true);
    expect(flowDeepEqual(new Date(1), new Date(1))).toBe(false);
    expect(flowDeepEqual({ a: [] }, { a: {} })).toBe(false);
  });

  it('describes the difference between two lists as changes', () => {
    const before = [{ id: 'a', v: 1 }, { id: 'b', v: 2 }, { id: 'c', v: 3 }];
    const after = [{ id: 'a', v: 1 }, { id: 'c', v: 30 }, { id: 'd', v: 4 }];
    expect(diffItems(before, after)).toEqual([
      { type: 'remove', id: 'b' },
      { type: 'replace', id: 'c', item: { id: 'c', v: 30 } },
      { type: 'add', item: { id: 'd', v: 4 }, index: 2 },
    ]);
    // Applying the diff gives the new list.
    const n = before.map((x) => ({ ...x, position: { x: 0, y: 0 } }));
    const m = after.map((x) => ({ ...x, position: { x: 0, y: 0 } }));
    expect(applyNodeChanges(diffItems(n, m) as FlowNodeChange[], n)).toEqual(m);
  });
});

describe('flow edges: where edges attach', () => {
  const rect = { x: 100, y: 100, width: 100, height: 50 };
  const handles = {
    source: [
      { id: 'out', type: 'source' as const, position: 'right' as const, x: 95, y: 20, width: 10, height: 10 },
      { id: 'down', type: 'source' as const, position: 'bottom' as const, x: 45, y: 45, width: 10, height: 10 },
    ],
    target: [{ id: 'in', type: 'target' as const, position: 'left' as const, x: -5, y: 20, width: 10, height: 10 }],
  };
  const n: FlowNode = { id: 'n', position: { x: 100, y: 100 } };

  it('uses the named handles', () => {
    const ends = getEdgeEnds({ sourceHandle: 'down', targetHandle: 'in' }, { node: n, rect, handles }, { node: n, rect, handles });
    expect(ends).toMatchObject({ sourceX: 150, sourceY: 155, sourcePosition: 'bottom', targetX: 95, targetY: 125, targetPosition: 'left', sourceHandleFound: true, targetHandleFound: true });
  });

  it('uses the first handle of the right kind when none is named', () => {
    const ends = getEdgeEnds({}, { node: n, rect, handles }, { node: n, rect, handles });
    expect(ends).toMatchObject({ sourceX: 205, sourceY: 125, sourcePosition: 'right', targetX: 95, targetY: 125 });
  });

  it('finds a named handle of the other kind (loose connections)', () => {
    const ends = getEdgeEnds({ sourceHandle: 'in' }, { node: n, rect, handles }, { node: n, rect, handles });
    expect(ends).toMatchObject({ sourceX: 95, sourceY: 125, sourcePosition: 'left', sourceHandleFound: true });
  });

  it('falls back to the middle of the node side', () => {
    const bare: FlowNode = { id: 'b', position: { x: 0, y: 0 } };
    const ends = getEdgeEnds({}, { node: bare, rect, handles: null }, { node: { ...bare, targetPosition: 'left' }, rect, handles: null });
    expect(ends).toMatchObject({ sourceX: 150, sourceY: 150, sourcePosition: 'bottom', targetX: 100, targetY: 125, targetPosition: 'left', sourceHandleFound: false, targetHandleFound: false });
    const missing = getEdgeEnds({ sourceHandle: 'nope' }, { node: bare, rect, handles }, { node: bare, rect, handles });
    expect(missing.sourceHandleFound).toBe(false);
    expect(missing.sourcePosition).toBe('bottom');
  });
});

describe('flow edges: arrowheads', () => {
  it('fills in marker defaults', () => {
    expect(normalizeMarker('arrow')).toEqual({ type: 'arrow', color: undefined, width: 14, height: 14, strokeWidth: 1.5 });
    expect(normalizeMarker({ type: 'arrowclosed', color: '#f00', width: 20 })).toEqual({ type: 'arrowclosed', color: '#f00', width: 20, height: 14, strokeWidth: 1.5 });
    expect(normalizeMarker(undefined)).toBeNull();
    expect(normalizeMarker({ type: 'circle' as never })).toBeNull();
  });

  it('gives each distinct marker one id that is safe in a URL', () => {
    const m = normalizeMarker({ type: 'arrowclosed', color: 'rgb(1, 2, 3)', width: 12.5 });
    expect(markerId('p', m as NonNullable<typeof m>)).toBe('p-arrowclosed-rgb_1_2_3_-12_5x14-1_5');
    const list = collectMarkers(
      [
        { markerEnd: 'arrow' },
        { markerEnd: 'arrow', markerStart: 'arrow' },
        { markerEnd: { type: 'arrowclosed', color: 'red' } },
      ],
      'wu',
      '#999'
    );
    expect(list.map((x) => x.id)).toEqual(['wu-arrow-_999-14x14-1_5', 'wu-arrowclosed-red-14x14-1_5']);
    expect(markerShape('arrowclosed').endsWith('Z')).toBe(true);
    expect(markerShape('arrow').includes('Z')).toBe(false);
  });
});
