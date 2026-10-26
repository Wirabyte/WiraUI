import { describe, expect, it } from 'vitest';
import {
  alignmentGuides,
  autoPanVelocity,
  boxToRect,
  clampPosition,
  connectionBetween,
  expandRect,
  findHandle,
  flowClamp,
  getBoundsOfRects,
  handlePoint,
  handlesCompatible,
  nearestHandle,
  normalizeExtent,
  oppositePosition,
  overlapArea,
  pointInRect,
  positionVector,
  rectCenter,
  rectContains,
  rectFromPoints,
  rectsIntersect,
  rectToBox,
  resizeBox,
  sameHandle,
  sidePoint,
  snapPosition,
} from '../src/flow';
import type { FlowRect } from '../src/flow';

const r3 = (v: number) => Math.round(v * 1000) / 1000 + 0;
const rect3 = (r: FlowRect) => ({ x: r3(r.x), y: r3(r.y), width: r3(r.width), height: r3(r.height) });

describe('flow geometry: rectangles', () => {
  it('converts between boxes and rectangles', () => {
    expect(rectToBox({ x: 1, y: 2, width: 3, height: 4 })).toEqual({ x: 1, y: 2, x2: 4, y2: 6 });
    expect(boxToRect({ x: 1, y: 2, x2: 4, y2: 6 })).toEqual({ x: 1, y: 2, width: 3, height: 4 });
  });

  it('finds the bounds of several rectangles', () => {
    expect(getBoundsOfRects([])).toBeNull();
    expect(getBoundsOfRects([{ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: -5, width: 5, height: 5 }])).toEqual({ x: 0, y: -5, width: 25, height: 15 });
  });

  it('builds a rectangle from two corners in any order', () => {
    expect(rectFromPoints({ x: 50, y: 10 }, { x: 10, y: 40 })).toEqual({ x: 10, y: 10, width: 40, height: 30 });
  });

  it('measures overlap, containment and intersection', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    expect(overlapArea(a, { x: 5, y: 5, width: 10, height: 10 })).toBe(25);
    expect(overlapArea(a, { x: 10, y: 0, width: 5, height: 5 })).toBe(0);
    expect(rectContains(a, { x: 2, y: 2, width: 8, height: 8 })).toBe(true);
    expect(rectContains(a, { x: 2, y: 2, width: 9, height: 8 })).toBe(false);
    expect(rectsIntersect(a, { x: 10, y: 10, width: 1, height: 1 })).toBe(true);
    expect(rectsIntersect(a, { x: 11, y: 0, width: 1, height: 1 })).toBe(false);
    expect(pointInRect({ x: 10, y: 0 }, a)).toBe(true);
    expect(pointInRect({ x: 10.1, y: 0 }, a)).toBe(false);
    expect(expandRect(a, 5)).toEqual({ x: -5, y: -5, width: 20, height: 20 });
    expect(rectCenter({ x: 10, y: 20, width: 40, height: 10 })).toEqual({ x: 30, y: 25 });
  });

  it('clamps numbers, with the lower limit winning when the range is empty', () => {
    expect(flowClamp(5, 0, 3)).toBe(3);
    expect(flowClamp(-1, 0, 3)).toBe(0);
    expect(flowClamp(5, 10, 3)).toBe(10);
  });
});

describe('flow geometry: snapping and extents', () => {
  it('snaps to the grid', () => {
    expect(snapPosition({ x: 22, y: 8 }, [15, 15])).toEqual({ x: 15, y: 15 });
    expect(snapPosition({ x: 23, y: 7 }, [15, 15])).toEqual({ x: 30, y: 0 });
    expect(snapPosition({ x: 23, y: -7 }, 10)).toEqual({ x: 20, y: -10 });
    expect(snapPosition({ x: 23, y: 7 }, [0, 5])).toEqual({ x: 23, y: 5 });
    expect(Object.is(snapPosition({ x: -2, y: -2 }, [15, 15]).x, -0)).toBe(false);
  });

  it('keeps a box inside an extent', () => {
    const extent: [[number, number], [number, number]] = [
      [0, 0],
      [100, 100],
    ];
    expect(clampPosition({ x: -10, y: 50 }, extent, { width: 20, height: 20 })).toEqual({ x: 0, y: 50 });
    expect(clampPosition({ x: 95, y: 95 }, extent, { width: 20, height: 20 })).toEqual({ x: 80, y: 80 });
    // A box bigger than the extent sticks to its top-left.
    expect(clampPosition({ x: 50, y: 50 }, extent, { width: 200, height: 20 })).toEqual({ x: 0, y: 50 });
    expect(clampPosition({ x: -10, y: -10 }, null)).toEqual({ x: -10, y: -10 });
  });

  it('reads an extent from app input', () => {
    expect(normalizeExtent([[10, 20], [0, 5]])).toEqual([[0, 5], [10, 20]]);
    expect(normalizeExtent([[-Infinity, 0], [Infinity, 100]])).toEqual([[-Infinity, 0], [Infinity, 100]]);
    expect(normalizeExtent([1, 2])).toBeNull();
    expect(normalizeExtent([['a', 0], [1, 1]])).toBeNull();
    expect(normalizeExtent(null)).toBeNull();
  });
});

describe('flow geometry: handles', () => {
  it('knows which way each side faces', () => {
    expect(positionVector('top')).toEqual({ x: 0, y: -1 });
    expect(positionVector('right')).toEqual({ x: 1, y: 0 });
    expect(positionVector('bottom')).toEqual({ x: 0, y: 1 });
    expect(positionVector('left')).toEqual({ x: -1, y: 0 });
    expect(oppositePosition('top')).toBe('bottom');
    expect(oppositePosition('left')).toBe('right');
  });

  it('attaches edges at the outer side of a handle, centred on it', () => {
    const node = { x: 100, y: 50 };
    // A 10 × 10 handle straddling the top border of a 150 wide node.
    expect(handlePoint(node, { x: 70, y: -5, width: 10, height: 10, position: 'top' })).toEqual({ x: 175, y: 45 });
    expect(handlePoint(node, { x: 70, y: 35, width: 10, height: 10, position: 'bottom' })).toEqual({ x: 175, y: 95 });
    expect(handlePoint(node, { x: -5, y: 15, width: 10, height: 10, position: 'left' })).toEqual({ x: 95, y: 70 });
    expect(handlePoint(node, { x: 145, y: 15, width: 10, height: 10, position: 'right' })).toEqual({ x: 255, y: 70 });
  });

  it('falls back to the middle of a side', () => {
    const r = { x: 0, y: 0, width: 100, height: 40 };
    expect(sidePoint(r, 'top')).toEqual({ x: 50, y: 0 });
    expect(sidePoint(r, 'bottom')).toEqual({ x: 50, y: 40 });
    expect(sidePoint(r, 'left')).toEqual({ x: 0, y: 20 });
    expect(sidePoint(r, 'right')).toEqual({ x: 100, y: 20 });
  });

  it('finds a handle by id, or the first of a type', () => {
    const handles = [
      { id: 'a', type: 'source' as const },
      { id: null, type: 'target' as const },
      { id: 'b', type: 'target' as const },
    ];
    expect(findHandle(handles, 'b')).toBe(handles[2]);
    expect(findHandle(handles, null, 'target')).toBe(handles[1]);
    expect(findHandle(handles, undefined, 'source')).toBe(handles[0]);
    expect(findHandle(handles, 'zzz')).toBeNull();
    expect(findHandle(handles, 'a', 'target')).toBe(handles[0]);
  });

  it('decides which handles may connect', () => {
    const src = { nodeId: 'a', id: null, type: 'source' as const };
    const tgt = { nodeId: 'b', id: null, type: 'target' as const };
    const src2 = { nodeId: 'b', id: 'x', type: 'source' as const };
    expect(handlesCompatible(src, tgt)).toBe(true);
    expect(handlesCompatible(src, src2)).toBe(false);
    expect(handlesCompatible(src, src2, 'loose')).toBe(true);
    expect(handlesCompatible(src, { ...src }, 'loose')).toBe(false);
    expect(sameHandle(src, { nodeId: 'a', id: null, type: 'source' })).toBe(true);
    expect(sameHandle(src, null)).toBe(false);
  });

  it('puts the source end first whichever end the drag started from', () => {
    expect(connectionBetween({ nodeId: 'a', id: 's', type: 'source' }, { nodeId: 'b', id: 't', type: 'target' })).toEqual({ source: 'a', sourceHandle: 's', target: 'b', targetHandle: 't' });
    expect(connectionBetween({ nodeId: 'b', id: 't', type: 'target' }, { nodeId: 'a', id: 's', type: 'source' })).toEqual({ source: 'a', sourceHandle: 's', target: 'b', targetHandle: 't' });
    expect(connectionBetween({ nodeId: 'a', id: null, type: 'source' }, { nodeId: 'b', id: null, type: 'source' })).toEqual({ source: 'a', sourceHandle: null, target: 'b', targetHandle: null });
  });

  it('snaps to the nearest acceptable handle within the radius', () => {
    const hs = [
      { id: 1, x: 0, y: 0 },
      { id: 2, x: 12, y: 0 },
      { id: 3, x: 30, y: 0 },
    ];
    expect(nearestHandle({ x: 10, y: 0 }, hs, 20)?.id).toBe(2);
    expect(nearestHandle({ x: 10, y: 0 }, hs, 20, (h) => h.id !== 2)?.id).toBe(1);
    expect(nearestHandle({ x: 100, y: 0 }, hs, 20)).toBeNull();
    expect(nearestHandle({ x: 6, y: 0 }, hs, 20)?.id).toBe(1);
  });
});

describe('flow geometry: auto-pan', () => {
  const box = { width: 400, height: 300 };

  it('pans faster the nearer the pointer is to the border', () => {
    expect(autoPanVelocity({ x: 200, y: 150 }, box)).toEqual({ x: 0, y: 0 });
    expect(autoPanVelocity({ x: 0, y: 150 }, box)).toEqual({ x: 15, y: 0 });
    expect(autoPanVelocity({ x: 20, y: 150 }, box)).toEqual({ x: 7.5, y: 0 });
    expect(autoPanVelocity({ x: 400, y: 300 }, box)).toEqual({ x: -15, y: -15 });
    // Past the border counts as on it.
    expect(autoPanVelocity({ x: -50, y: 150 }, box)).toEqual({ x: 15, y: 0 });
    expect(autoPanVelocity({ x: 0, y: 0 }, box, 30, 60).x).toBe(30);
  });

  it('does not pan in a pane too small for the margins', () => {
    expect(autoPanVelocity({ x: 0, y: 0 }, { width: 60, height: 60 })).toEqual({ x: 0, y: 0 });
  });
});

describe('flow geometry: alignment guides', () => {
  const other = { x: 100, y: 100, width: 100, height: 50 };

  it('lines up left edges within the threshold', () => {
    const a = alignmentGuides({ x: 103, y: 300, width: 80, height: 40 }, [other], 5);
    expect(a.dx).toBe(-3);
    expect(a.dy).toBe(0);
    expect(a.guides).toEqual([{ orientation: 'vertical', at: 100, from: 100, to: 340 }]);
  });

  it('lines up centres and bottoms, picking the closest', () => {
    const a = alignmentGuides({ x: 400, y: 112, width: 60, height: 40 }, [other], 6);
    // Middle 132 vs 125 is 7 away, bottom 152 vs 150 is 2 away.
    expect(a.dy).toBe(-2);
    expect(a.guides[0]).toEqual({ orientation: 'horizontal', at: 150, from: 100, to: 460 });
    const c = alignmentGuides({ x: 122, y: 400, width: 60, height: 20 }, [other], 4);
    // Centre 152 vs 150.
    expect(c.dx).toBe(-2);
  });

  it('does nothing when nothing is close', () => {
    expect(alignmentGuides({ x: 400, y: 400, width: 10, height: 10 }, [other], 5)).toEqual({ dx: 0, dy: 0, guides: [] });
    expect(alignmentGuides({ x: 400, y: 400, width: 10, height: 10 }, [], 5)).toEqual({ dx: 0, dy: 0, guides: [] });
  });
});

describe('flow geometry: the resizer', () => {
  const start = { x: 0, y: 0, width: 100, height: 50 };

  it('grows from the bottom-right corner, keeping the top-left', () => {
    expect(resizeBox(start, 'bottom-right', 20, 10)).toEqual({ x: 0, y: 0, width: 120, height: 60 });
  });

  it('moves the box when dragging the top-left corner', () => {
    expect(resizeBox(start, 'top-left', 20, 10)).toEqual({ x: 20, y: 10, width: 80, height: 40 });
  });

  it('changes one side only for side handles', () => {
    expect(resizeBox(start, 'right', 30, 999)).toEqual({ x: 0, y: 0, width: 130, height: 50 });
    expect(resizeBox(start, 'top', 999, -20)).toEqual({ x: 0, y: -20, width: 100, height: 70 });
    expect(resizeBox(start, 'left', -10, 0)).toEqual({ x: -10, y: 0, width: 110, height: 50 });
  });

  it('respects min and max sizes, keeping the opposite side put', () => {
    expect(resizeBox(start, 'left', 95, 0)).toEqual({ x: 90, y: 0, width: 10, height: 50 });
    expect(resizeBox(start, 'bottom-right', 500, 500, { maxWidth: 200, maxHeight: 80 })).toEqual({ x: 0, y: 0, width: 200, height: 80 });
    expect(resizeBox(start, 'top-left', 90, 45, { minWidth: 40, minHeight: 30 })).toEqual({ x: 60, y: 20, width: 40, height: 30 });
  });

  it('keeps the aspect ratio', () => {
    expect(rect3(resizeBox(start, 'bottom-right', 100, 0, { keepAspectRatio: true }))).toEqual({ x: 0, y: 0, width: 200, height: 100 });
    expect(rect3(resizeBox(start, 'bottom-right', 0, 25, { keepAspectRatio: true }))).toEqual({ x: 0, y: 0, width: 150, height: 75 });
    // A side handle grows the other side about the middle.
    expect(rect3(resizeBox(start, 'right', 100, 0, { keepAspectRatio: true }))).toEqual({ x: 0, y: -25, width: 200, height: 100 });
    // Limits hold the pair together.
    expect(rect3(resizeBox(start, 'bottom-right', 300, 0, { keepAspectRatio: true, maxWidth: 160 }))).toEqual({ x: 0, y: 0, width: 160, height: 80 });
    expect(rect3(resizeBox(start, 'top-left', 95, 0, { keepAspectRatio: true, minWidth: 20, minHeight: 20 }))).toEqual({ x: 60, y: 30, width: 40, height: 20 });
  });
});
