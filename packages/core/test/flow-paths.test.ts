import { describe, expect, it } from 'vitest';
import {
  cubicPoint,
  fmt,
  getBezierPath,
  getEdgeCenter,
  getEdgePath,
  getEdgePathWithRoom,
  markerLength,
  getSimpleBezierPath,
  getSmoothStepPath,
  getStepPath,
  getStepPoints,
  getStraightPath,
  polylineMidpoint,
  roundedPolylinePath,
  simplifyPolyline,
} from '../src/flow';

const r3 = (v: number) => Math.round(v * 1000) / 1000 + 0;
const pts = (list: { x: number; y: number }[]) => list.map((p) => [r3(p.x), r3(p.y)]);

describe('flow paths: numbers and helpers', () => {
  it('formats path numbers with up to three decimals and no negative zero', () => {
    expect(fmt(1)).toBe('1');
    expect(fmt(1.23456)).toBe('1.235');
    expect(fmt(-0)).toBe('0');
    expect(fmt(-0.0001)).toBe('0');
    expect(fmt(-12.5)).toBe('-12.5');
  });

  it('finds the centre of a straight line and its offsets from the source', () => {
    expect(getEdgeCenter(0, 0, 100, 50)).toEqual([50, 25, 50, 25]);
    expect(getEdgeCenter(100, 50, 0, 0)).toEqual([50, 25, 50, 25]);
  });

  it('evaluates a cubic curve', () => {
    const p = cubicPoint({ x: 0, y: 0 }, { x: 0, y: 100 }, { x: 100, y: 100 }, { x: 100, y: 0 }, 0.5);
    expect([r3(p.x), r3(p.y)]).toEqual([50, 75]);
    expect(cubicPoint({ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 6 }, { x: 7, y: 8 }, 0)).toEqual({ x: 1, y: 2 });
    expect(cubicPoint({ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 6 }, { x: 7, y: 8 }, 1)).toEqual({ x: 7, y: 8 });
  });

  it('simplifies a polyline: repeated points and straight runs collapse', () => {
    const out = simplifyPolyline([
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 10 },
      { x: 0, y: 20 },
      { x: 10, y: 20 },
    ]);
    expect(pts(out)).toEqual([
      [0, 0],
      [0, 20],
      [10, 20],
    ]);
    // A U-turn is not a straight run: the point where it turns back stays.
    expect(pts(simplifyPolyline([{ x: 0, y: 0 }, { x: 0, y: 10 }, { x: 0, y: 5 }]))).toEqual([
      [0, 0],
      [0, 10],
      [0, 5],
    ]);
  });

  it('finds the point halfway along a polyline', () => {
    expect(polylineMidpoint([{ x: 0, y: 0 }, { x: 0, y: 50 }, { x: 100, y: 50 }, { x: 100, y: 100 }])).toEqual({ x: 50, y: 50 });
    expect(polylineMidpoint([{ x: 0, y: 0 }, { x: 10, y: 0 }])).toEqual({ x: 5, y: 0 });
    expect(polylineMidpoint([{ x: 3, y: 4 }])).toEqual({ x: 3, y: 4 });
    expect(polylineMidpoint([])).toEqual({ x: 0, y: 0 });
  });

  it('rounds corners only as far as the segments allow', () => {
    const d = roundedPolylinePath([{ x: 0, y: 0 }, { x: 0, y: 4 }, { x: 100, y: 4 }], 10);
    // The first segment is 4 long, so the radius drops to 2.
    expect(d).toBe('M0,0 L0,2 Q0,4 2,4 L100,4');
    expect(roundedPolylinePath([{ x: 0, y: 0 }, { x: 0, y: 50 }, { x: 50, y: 50 }], 0)).toBe('M0,0 L0,50 L50,50');
    expect(roundedPolylinePath([], 5)).toBe('');
  });
});

describe('flow paths: straight and bezier edges', () => {
  it('draws a straight edge with its label in the middle', () => {
    expect(getStraightPath({ sourceX: 0, sourceY: 0, targetX: 100, targetY: 50 })).toEqual(['M0,0 L100,50', 50, 25, 50, 25]);
  });

  it('draws a bezier from a bottom handle down to a top handle', () => {
    const [d, lx, ly, ox, oy] = getBezierPath({ sourceX: 0, sourceY: 0, sourcePosition: 'bottom', targetX: 0, targetY: 100, targetPosition: 'top' });
    expect(d).toBe('M0,0 C0,50 0,50 0,100');
    expect([lx, ly, ox, oy]).toEqual([0, 50, 0, 50]);
  });

  it('defaults to leaving at the bottom and entering at the top', () => {
    expect(getBezierPath({ sourceX: 0, sourceY: 0, targetX: 0, targetY: 100 })[0]).toBe('M0,0 C0,50 0,50 0,100');
  });

  it('draws a left-to-right bezier with the label at the curve midpoint', () => {
    const [d, lx, ly, ox, oy] = getBezierPath({ sourceX: 0, sourceY: 0, sourcePosition: 'right', targetX: 200, targetY: 100, targetPosition: 'left' });
    expect(d).toBe('M0,0 C100,0 100,100 200,100');
    expect([r3(lx), r3(ly), r3(ox), r3(oy)]).toEqual([100, 50, 100, 50]);
  });

  it('swings out when the target is behind the source, more with more curvature', () => {
    const [d, , ly] = getBezierPath({ sourceX: 0, sourceY: 0, sourcePosition: 'bottom', targetX: 0, targetY: -100, targetPosition: 'top' });
    // 0.25 × 25 × √100 = 62.5 out of each handle.
    expect(d).toBe('M0,0 C0,62.5 0,-162.5 0,-100');
    expect(r3(ly)).toBe(-50);
    const loose = getBezierPath({ sourceX: 0, sourceY: 0, sourcePosition: 'bottom', targetX: 0, targetY: -100, targetPosition: 'top', curvature: 0.5 });
    expect(loose[0]).toBe('M0,0 C0,125 0,-225 0,-100');
  });

  it('draws a simple bezier with control points halfway along each handle axis', () => {
    const [d, lx, ly] = getSimpleBezierPath({ sourceX: 0, sourceY: 0, sourcePosition: 'bottom', targetX: 100, targetY: 200, targetPosition: 'top' });
    expect(d).toBe('M0,0 C0,100 100,100 100,200');
    expect([r3(lx), r3(ly)]).toEqual([50, 100]);
    const side = getSimpleBezierPath({ sourceX: 0, sourceY: 0, sourcePosition: 'right', targetX: 200, targetY: 100, targetPosition: 'left' });
    expect(side[0]).toBe('M0,0 C100,0 100,100 200,100');
  });
});

describe('flow paths: step and smoothstep edges', () => {
  it('turns once in the middle when the handles face each other', () => {
    const p = getStepPoints({ sourceX: 0, sourceY: 0, sourcePosition: 'bottom', targetX: 100, targetY: 100, targetPosition: 'top' });
    expect(pts(p)).toEqual([
      [0, 0],
      [0, 50],
      [100, 50],
      [100, 100],
    ]);
  });

  it('is a straight line when the ends line up', () => {
    const p = getStepPoints({ sourceX: 0, sourceY: 0, sourcePosition: 'bottom', targetX: 0, targetY: 100, targetPosition: 'top' });
    expect(pts(p)).toEqual([
      [0, 0],
      [0, 100],
    ]);
    expect(getSmoothStepPath({ sourceX: 0, sourceY: 0, targetX: 0, targetY: 100 })[0]).toBe('M0,0 L0,100');
  });

  it('runs out of both handles and across when the target is behind', () => {
    const p = getStepPoints({ sourceX: 0, sourceY: 0, sourcePosition: 'bottom', targetX: 100, targetY: -100, targetPosition: 'top' });
    expect(pts(p)).toEqual([
      [0, 0],
      [0, 20],
      [50, 20],
      [50, -120],
      [100, -120],
      [100, -100],
    ]);
    const left = getStepPoints({ sourceX: 0, sourceY: 0, sourcePosition: 'right', targetX: -100, targetY: 100, targetPosition: 'left', offset: 10 });
    expect(pts(left)).toEqual([
      [0, 0],
      [10, 0],
      [10, 50],
      [-110, 50],
      [-110, 100],
      [-100, 100],
    ]);
  });

  it('goes out past the further handle when both face the same way', () => {
    const p = getStepPoints({ sourceX: 0, sourceY: 0, sourcePosition: 'right', targetX: 100, targetY: 50, targetPosition: 'right' });
    expect(pts(p)).toEqual([
      [0, 0],
      [120, 0],
      [120, 50],
      [100, 50],
    ]);
    const up = getStepPoints({ sourceX: 0, sourceY: 0, sourcePosition: 'top', targetX: 80, targetY: -40, targetPosition: 'top' });
    expect(pts(up)).toEqual([
      [0, 0],
      [0, -60],
      [80, -60],
      [80, -40],
    ]);
  });

  it('takes a single corner between a side handle and a top handle when it can', () => {
    const p = getStepPoints({ sourceX: 0, sourceY: 0, sourcePosition: 'right', targetX: 100, targetY: 100, targetPosition: 'top' });
    expect(pts(p)).toEqual([
      [0, 0],
      [100, 0],
      [100, 100],
    ]);
  });

  it('routes round when the single corner would double back', () => {
    const p = getStepPoints({ sourceX: 0, sourceY: 0, sourcePosition: 'right', targetX: -100, targetY: 100, targetPosition: 'top' });
    expect(pts(p)).toEqual([
      [0, 0],
      [20, 0],
      [20, 80],
      [-100, 80],
      [-100, 100],
    ]);
  });

  it('moves the middle segment with centerX / centerY', () => {
    const p = getStepPoints({ sourceX: 0, sourceY: 0, sourcePosition: 'right', targetX: 200, targetY: 100, targetPosition: 'left', centerX: 50 });
    expect(pts(p)).toEqual([
      [0, 0],
      [50, 0],
      [50, 100],
      [200, 100],
    ]);
    const q = getStepPoints({ sourceX: 0, sourceY: 0, sourcePosition: 'bottom', targetX: 100, targetY: 100, targetPosition: 'top', centerY: 80 });
    expect(pts(q)[1]).toEqual([0, 80]);
  });

  it('rounds the corners of a smoothstep edge and puts the label halfway along it', () => {
    const [d, lx, ly, ox, oy] = getSmoothStepPath({ sourceX: 0, sourceY: 0, sourcePosition: 'bottom', targetX: 100, targetY: 100, targetPosition: 'top' });
    expect(d).toBe('M0,0 L0,45 Q0,50 5,50 L95,50 Q100,50 100,55 L100,100');
    expect([lx, ly, ox, oy]).toEqual([50, 50, 50, 50]);
    const big = getSmoothStepPath({ sourceX: 0, sourceY: 0, sourcePosition: 'bottom', targetX: 100, targetY: 100, targetPosition: 'top', borderRadius: 20 });
    expect(big[0]).toBe('M0,0 L0,30 Q0,50 20,50 L80,50 Q100,50 100,70 L100,100');
  });

  it('draws a step edge with square corners', () => {
    expect(getStepPath({ sourceX: 0, sourceY: 0, sourcePosition: 'bottom', targetX: 100, targetY: 100, targetPosition: 'top' })[0]).toBe('M0,0 L0,50 L100,50 L100,100');
    // borderRadius on a step edge is ignored.
    expect(getStepPath({ sourceX: 0, sourceY: 0, targetX: 100, targetY: 100, borderRadius: 9 })[0]).toBe('M0,0 L0,50 L100,50 L100,100');
  });

  it('only ever draws axis-aligned segments, whatever the sides', () => {
    const sides = ['top', 'right', 'bottom', 'left'] as const;
    for (const sp of sides) {
      for (const tp of sides) {
        for (const [tx, ty] of [
          [150, 90],
          [-150, 90],
          [150, -90],
          [-150, -90],
          [0, 0],
        ]) {
          const p = getStepPoints({ sourceX: 0, sourceY: 0, sourcePosition: sp, targetX: tx, targetY: ty, targetPosition: tp });
          expect(p[0]).toEqual({ x: 0, y: 0 });
          expect(p[p.length - 1]).toEqual({ x: tx, y: ty });
          for (let i = 1; i < p.length; i++) expect(p[i].x === p[i - 1].x || p[i].y === p[i - 1].y).toBe(true);
        }
      }
    }
  });
});

describe('flow paths: by edge type', () => {
  const ends = { sourceX: 0, sourceY: 0, sourcePosition: 'bottom' as const, targetX: 100, targetY: 100, targetPosition: 'top' as const };

  it('picks the shape from the edge type and passes the options on', () => {
    expect(getEdgePath('straight', ends)[0]).toBe('M0,0 L100,100');
    expect(getEdgePath('step', ends)[0]).toBe('M0,0 L0,50 L100,50 L100,100');
    expect(getEdgePath('smoothstep', ends, { borderRadius: 0 })[0]).toBe('M0,0 L0,50 L100,50 L100,100');
    expect(getEdgePath('simplebezier', ends)[0]).toBe(getSimpleBezierPath(ends)[0]);
    expect(getEdgePath('default', ends)[0]).toBe(getBezierPath(ends)[0]);
    expect(getEdgePath('bezier', ends, { curvature: 0.5 })[0]).toBe(getBezierPath({ ...ends, curvature: 0.5 })[0]);
  });

  it('gives custom and missing types the bezier', () => {
    expect(getEdgePath('my-edge', ends)).toEqual(getBezierPath(ends));
    expect(getEdgePath(undefined, ends)).toEqual(getBezierPath(ends));
  });
});

describe('room for arrowheads', () => {
  const ends = { sourceX: 200, sourceY: 0, sourcePosition: 'bottom' as const, targetX: 0, targetY: 110, targetPosition: 'top' as const };

  it('measures an arrowhead from the marker settings', () => {
    expect(markerLength('arrowclosed')).toBeCloseTo((14 * 11) / 20 + 2);
    expect(markerLength({ type: 'arrow', width: 20 })).toBeCloseTo(13);
    expect(markerLength(null)).toBe(0);
    expect(markerLength('dot' as never)).toBe(0);
  });

  it('ends a curve straight into the target along its handle, as long as the arrowhead', () => {
    const [d, lx, ly] = getEdgePathWithRoom('default', ends, {}, { end: 10 });
    // A curve to 10 px above the target, then straight down into it.
    expect(d).toMatch(/^M200,0 C[^L]+ 0,100 L0,110$/);
    expect(d.startsWith(getBezierPath({ ...ends, targetY: 100 })[0])).toBe(true);
    // The label stays in the middle of the whole edge.
    expect([lx, ly]).toEqual(getBezierPath(ends).slice(1, 3));
    // At the source too.
    const [both] = getEdgePathWithRoom('simplebezier', ends, {}, { start: 8, end: 8 });
    expect(both).toMatch(/^M200,0 L200,8 C[^L]+ 0,102 L0,110$/);
  });

  it('leaves straight and right-angled edges, and never takes more than a third of a short edge', () => {
    expect(getEdgePathWithRoom('smoothstep', ends, {}, { end: 10 })[0]).toBe(getEdgePath('smoothstep', ends)[0]);
    expect(getEdgePathWithRoom('straight', ends, {}, { end: 10 })[0]).toBe(getEdgePath('straight', ends)[0]);
    expect(getEdgePathWithRoom('default', ends, {}, {})[0]).toBe(getEdgePath('default', ends)[0]);
    const short = { ...ends, targetX: 200, targetY: 15 };
    expect(getEdgePathWithRoom('default', short, {}, { end: 20 })[0]).toMatch(/ 200,10 L200,15$/);
  });
});
