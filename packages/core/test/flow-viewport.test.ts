import { describe, expect, it } from 'vitest';
import {
  clampZoom,
  constrainViewport,
  easeInOutCubic,
  flowToScreen,
  getViewportForBounds,
  interpolateViewport,
  normalizeViewport,
  paddingPx,
  panBy,
  sameViewport,
  screenToFlow,
  viewportForCenter,
  viewRect,
  wheelDeltaPx,
  wheelZoomFactor,
  zoomAt,
} from '../src/flow';
import type { FlowCoordinateExtent, FlowViewport } from '../src/flow';

const r3 = (v: number) => Math.round(v * 1000) / 1000 + 0;
const vp3 = (v: FlowViewport) => ({ x: r3(v.x), y: r3(v.y), zoom: r3(v.zoom) });
const pane = { width: 400, height: 200 };

describe('flow viewport: converting points', () => {
  it('turns pane points into flow points and back', () => {
    const vp = { x: 50, y: 0, zoom: 2 };
    expect(screenToFlow({ x: 150, y: 100 }, vp)).toEqual({ x: 50, y: 50 });
    expect(flowToScreen({ x: 50, y: 50 }, vp)).toEqual({ x: 150, y: 100 });
    for (const p of [{ x: -30, y: 12 }, { x: 999, y: -4 }]) {
      const back = flowToScreen(screenToFlow(p, vp), vp);
      expect([r3(back.x), r3(back.y)]).toEqual([p.x, p.y]);
    }
  });

  it('knows which part of the flow is in view', () => {
    expect(viewRect({ x: -100, y: -50, zoom: 2 }, pane)).toEqual({ x: 50, y: 25, width: 200, height: 100 });
    expect(viewRect({ x: 0, y: 0, zoom: 1 }, pane)).toEqual({ x: 0, y: 0, width: 400, height: 200 });
  });

  it('cleans up viewports from the app and compares them', () => {
    expect(normalizeViewport({ x: 5, zoom: 0 })).toEqual({ x: 5, y: 0, zoom: 1 });
    expect(normalizeViewport(null, { x: 1, y: 2, zoom: 3 })).toEqual({ x: 1, y: 2, zoom: 3 });
    expect(normalizeViewport({ x: NaN, y: 'a', zoom: 2 })).toEqual({ x: 0, y: 0, zoom: 2 });
    expect(sameViewport({ x: 1, y: 2, zoom: 1 }, { x: 1 + 1e-9, y: 2, zoom: 1 })).toBe(true);
    expect(sameViewport({ x: 1, y: 2, zoom: 1 }, { x: 1.1, y: 2, zoom: 1 })).toBe(false);
    expect(sameViewport(null, null)).toBe(true);
    expect(sameViewport(null, { x: 0, y: 0, zoom: 1 })).toBe(false);
  });
});

describe('flow viewport: zooming and panning', () => {
  it('clamps the zoom, also with the limits given the wrong way round', () => {
    expect(clampZoom(5)).toBe(2);
    expect(clampZoom(0.1)).toBe(0.5);
    expect(clampZoom(3, 0.1, 4)).toBe(3);
    expect(clampZoom(3, 4, 0.1)).toBe(3);
    expect(clampZoom(NaN)).toBe(1);
    expect(clampZoom(-2, 0.5, 2)).toBe(1);
  });

  it('zooms about a point, keeping the flow point under it in place', () => {
    const vp = zoomAt({ x: 0, y: 0, zoom: 1 }, 2, { x: 100, y: 100 });
    expect(vp).toEqual({ x: -100, y: -100, zoom: 2 });
    const before = screenToFlow({ x: 37, y: 81 }, { x: 12, y: -30, zoom: 0.8 });
    const after = zoomAt({ x: 12, y: -30, zoom: 0.8 }, 1.7, { x: 37, y: 81 }, 0.1, 4);
    const still = screenToFlow({ x: 37, y: 81 }, after);
    expect([r3(still.x), r3(still.y)]).toEqual([r3(before.x), r3(before.y)]);
  });

  it('stops at the zoom limits while zooming about a point', () => {
    expect(zoomAt({ x: 0, y: 0, zoom: 1 }, 10, { x: 0, y: 0 }, 0.5, 2).zoom).toBe(2);
    expect(zoomAt({ x: 0, y: 0, zoom: 1 }, 0.01, { x: 0, y: 0 }, 0.5, 2).zoom).toBe(0.5);
  });

  it('pans by a screen distance', () => {
    expect(panBy({ x: 10, y: 20, zoom: 3 }, -5, 5)).toEqual({ x: 5, y: 25, zoom: 3 });
  });

  it('keeps the view inside the translate extent', () => {
    const extent: FlowCoordinateExtent = [
      [0, 0],
      [1000, 1000],
    ];
    const box = { width: 500, height: 500 };
    expect(constrainViewport({ x: 100, y: 100, zoom: 1 }, box, extent)).toEqual({ x: 0, y: 0, zoom: 1 });
    expect(constrainViewport({ x: -700, y: -800, zoom: 1 }, box, extent)).toEqual({ x: -500, y: -500, zoom: 1 });
    expect(constrainViewport({ x: -200, y: -300, zoom: 1 }, box, extent)).toEqual({ x: -200, y: -300, zoom: 1 });
    // An extent smaller than the view stays in the middle.
    expect(constrainViewport({ x: 0, y: 0, zoom: 0.25 }, box, extent)).toEqual({ x: 125, y: 125, zoom: 0.25 });
    expect(constrainViewport({ x: 3, y: 4, zoom: 1 }, box, null)).toEqual({ x: 3, y: 4, zoom: 1 });
  });

  it('handles an extent open on one side', () => {
    const extent: FlowCoordinateExtent = [
      [0, -Infinity],
      [Infinity, Infinity],
    ];
    expect(constrainViewport({ x: 50, y: 70, zoom: 1 }, pane, extent)).toEqual({ x: 0, y: 70, zoom: 1 });
    expect(constrainViewport({ x: -5000, y: 70, zoom: 1 }, pane, extent)).toEqual({ x: -5000, y: 70, zoom: 1 });
  });
});

describe('flow viewport: fitting content', () => {
  const bounds = { x: 0, y: 0, width: 100, height: 50 };

  it('fits bounds whole and centred', () => {
    expect(getViewportForBounds(bounds, 400, 200, 0.1, 10, 0)).toEqual({ x: 0, y: 0, zoom: 4 });
    expect(vp3(getViewportForBounds(bounds, 400, 200, 0.1, 10, 0.1))).toEqual({ x: 20, y: 10, zoom: 3.6 });
    expect(vp3(getViewportForBounds({ x: 100, y: 100, width: 100, height: 100 }, 400, 200, 0.1, 10, 0))).toEqual({ x: -100, y: -200, zoom: 2 });
  });

  it('reads padding as a fraction or in pixels', () => {
    expect(paddingPx(0.1, pane)).toEqual({ x: 20, y: 10 });
    expect(paddingPx('24px', pane)).toEqual({ x: 24, y: 24 });
    expect(paddingPx('0.2', pane)).toEqual({ x: 40, y: 20 });
    expect(paddingPx(undefined, pane)).toEqual({ x: 20, y: 10 });
    expect(paddingPx(-1, pane)).toEqual({ x: 0, y: 0 });
    expect(vp3(getViewportForBounds(bounds, 400, 200, 0.1, 10, '20px'))).toEqual({ x: 40, y: 20, zoom: 3.2 });
  });

  it('respects the zoom limits when fitting', () => {
    expect(getViewportForBounds({ x: 0, y: 0, width: 1, height: 1 }, 400, 200, 0.5, 2, 0).zoom).toBe(2);
    expect(getViewportForBounds({ x: 0, y: 0, width: 100000, height: 100000 }, 400, 200, 0.5, 2, 0).zoom).toBe(0.5);
    // Zero-size bounds (a single unmeasured node) do not divide by zero.
    const v = getViewportForBounds({ x: 10, y: 10, width: 0, height: 0 }, 400, 200, 0.5, 2, 0);
    expect(v).toEqual({ x: 180, y: 80, zoom: 2 });
  });

  it('centres the view on a point', () => {
    expect(viewportForCenter(100, 50, 2, pane)).toEqual({ x: 0, y: 0, zoom: 2 });
  });
});

describe('flow viewport: animation and the wheel', () => {
  it('interpolates the view: the middle moves evenly, the zoom on a log scale', () => {
    const from = { x: 0, y: 0, zoom: 1 };
    const to = viewportForCenter(400, 300, 4, pane);
    expect(interpolateViewport(from, to, 0, pane)).toEqual(from);
    expect(interpolateViewport(from, to, 1, pane)).toEqual(to);
    const mid = interpolateViewport(from, to, 0.5, pane);
    expect(r3(mid.zoom)).toBe(2);
    const centre = screenToFlow({ x: 200, y: 100 }, mid);
    expect([r3(centre.x), r3(centre.y)]).toEqual([300, 200]);
  });

  it('eases in and out', () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.5)).toBe(0.5);
    expect(easeInOutCubic(0.25)).toBe(0.0625);
    expect(easeInOutCubic(2)).toBe(1);
  });

  it('turns wheel deltas into pixels and zoom factors', () => {
    expect(wheelDeltaPx(3, 1)).toBe(48);
    expect(wheelDeltaPx(1, 2)).toBe(400);
    expect(wheelDeltaPx(7, 0)).toBe(7);
    expect(wheelZoomFactor(-100, 0, false)).toBeCloseTo(Math.exp(0.2));
    expect(wheelZoomFactor(100, 0, false)).toBeLessThan(1);
    // A pinch is more sensitive; a huge flick is capped.
    expect(wheelZoomFactor(-10, 0, true)).toBeGreaterThan(wheelZoomFactor(-10, 0, false));
    expect(wheelZoomFactor(-10000, 0, false)).toBeCloseTo(Math.exp(0.4));
  });
});
