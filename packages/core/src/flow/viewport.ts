/** wu-flow: pan and zoom maths. Screen points here are relative to the pane's top-left corner, in CSS pixels. */
import { flowClamp } from './geometry';
import type { FlowCoordinateExtent, FlowDimensions, FlowRect, FlowViewport, FlowXY } from './types';

export const FLOW_DEFAULT_VIEWPORT: FlowViewport = { x: 0, y: 0, zoom: 1 };

export function clampZoom(zoom: number, minZoom = 0.5, maxZoom = 2): number {
  const lo = Math.min(minZoom, maxZoom);
  const hi = Math.max(minZoom, maxZoom);
  return flowClamp(isFinite(zoom) && zoom > 0 ? zoom : 1, lo, hi);
}

/** A viewport from app input (missing or broken values fall back to `fallback`). */
export function normalizeViewport(v: unknown, fallback: FlowViewport = FLOW_DEFAULT_VIEWPORT): FlowViewport {
  const o = (v && typeof v === 'object' ? v : {}) as Partial<FlowViewport>;
  const n = (x: unknown, d: number) => (typeof x === 'number' && isFinite(x) ? x : d);
  const zoom = n(o.zoom, fallback.zoom);
  return { x: n(o.x, fallback.x), y: n(o.y, fallback.y), zoom: zoom > 0 ? zoom : fallback.zoom };
}

export function sameViewport(a: FlowViewport | null | undefined, b: FlowViewport | null | undefined, epsilon = 1e-6): boolean {
  if (!a || !b) return a === b;
  return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon && Math.abs(a.zoom - b.zoom) <= epsilon;
}

/** A point in the pane to flow coordinates. */
export function screenToFlow(p: FlowXY, vp: FlowViewport): FlowXY {
  return { x: (p.x - vp.x) / vp.zoom, y: (p.y - vp.y) / vp.zoom };
}

/** A flow point to its place in the pane. */
export function flowToScreen(p: FlowXY, vp: FlowViewport): FlowXY {
  return { x: p.x * vp.zoom + vp.x, y: p.y * vp.zoom + vp.y };
}

/** The part of the flow the pane shows, in flow coordinates. */
export function viewRect(vp: FlowViewport, pane: FlowDimensions): FlowRect {
  return { x: -vp.x / vp.zoom + 0, y: -vp.y / vp.zoom + 0, width: pane.width / vp.zoom, height: pane.height / vp.zoom };
}

/** Zooms to `zoom` keeping the flow point under `anchor` (a pane point, e.g. the pointer) where it is. */
export function zoomAt(vp: FlowViewport, zoom: number, anchor: FlowXY, minZoom = 0.5, maxZoom = 2): FlowViewport {
  const z = clampZoom(zoom, minZoom, maxZoom);
  const f = screenToFlow(anchor, vp);
  return { x: anchor.x - f.x * z, y: anchor.y - f.y * z, zoom: z };
}

export function panBy(vp: FlowViewport, dx: number, dy: number): FlowViewport {
  return { x: vp.x + dx, y: vp.y + dy, zoom: vp.zoom };
}

/**
 * Keeps the view inside `extent` (flow coordinates): it cannot be panned past the extent's borders, and an extent
 * smaller than the view stays centred.
 */
export function constrainViewport(vp: FlowViewport, pane: FlowDimensions, extent: FlowCoordinateExtent | null | undefined): FlowViewport {
  if (!extent) return vp;
  const [[x1, y1], [x2, y2]] = extent;
  const axis = (offset: number, size: number, lo: number, hi: number): number => {
    if (!isFinite(lo) && !isFinite(hi)) return offset;
    // Screen positions of the extent's two borders.
    const a = lo * vp.zoom;
    const b = hi * vp.zoom;
    if (isFinite(lo) && isFinite(hi) && b - a <= size) return (size - (a + b)) / 2;
    let o = offset;
    if (isFinite(hi) && o + b < size) o = size - b;
    if (isFinite(lo) && o + a > 0) o = -a;
    return o;
  };
  return { x: axis(vp.x, pane.width, x1, x2) + 0, y: axis(vp.y, pane.height, y1, y2) + 0, zoom: vp.zoom };
}

/** Padding around fitted content: a fraction of the pane (`0.1` = 10%, the default) or pixels (`'24px'`). */
export type FlowPadding = number | string;

/** Padding in px on each side for a pane of this size. */
export function paddingPx(padding: FlowPadding | null | undefined, pane: FlowDimensions): { x: number; y: number } {
  if (typeof padding === 'string') {
    const m = /^\s*(-?\d+(?:\.\d+)?)\s*px\s*$/i.exec(padding);
    if (m) return { x: Math.max(0, Number(m[1])), y: Math.max(0, Number(m[1])) };
    const n = Number(padding);
    if (isFinite(n)) return paddingPx(n, pane);
    return paddingPx(0.1, pane);
  }
  const f = typeof padding === 'number' && isFinite(padding) ? Math.max(0, padding) : 0.1;
  return { x: (pane.width * f) / 2, y: (pane.height * f) / 2 };
}

/**
 * The viewport that shows `bounds` whole and centred in a pane of `width` × `height`, zoomed as far as the padding and
 * the zoom limits allow.
 */
export function getViewportForBounds(bounds: FlowRect, width: number, height: number, minZoom = 0.5, maxZoom = 2, padding: FlowPadding = 0.1): FlowViewport {
  const pad = paddingPx(padding, { width, height });
  const availW = Math.max(1, width - pad.x * 2);
  const availH = Math.max(1, height - pad.y * 2);
  const bw = Math.max(bounds.width, 1e-6);
  const bh = Math.max(bounds.height, 1e-6);
  const zoom = clampZoom(Math.min(availW / bw, availH / bh), minZoom, maxZoom);
  const cx = bounds.x + bounds.width / 2;
  const cy = bounds.y + bounds.height / 2;
  return { x: width / 2 - cx * zoom, y: height / 2 - cy * zoom, zoom };
}

/** The viewport with flow point (x, y) in the middle of the pane at `zoom`. */
export function viewportForCenter(x: number, y: number, zoom: number, pane: FlowDimensions): FlowViewport {
  return { x: pane.width / 2 - x * zoom, y: pane.height / 2 - y * zoom, zoom };
}

/**
 * A step of an animated move from `from` to `to` (t from 0 to 1): the middle of the view travels in a straight line
 * while the zoom changes evenly on a log scale, so zooming out and back in looks steady.
 */
export function interpolateViewport(from: FlowViewport, to: FlowViewport, t: number, pane: FlowDimensions): FlowViewport {
  if (t <= 0) return { ...from };
  if (t >= 1) return { ...to };
  const c0 = screenToFlow({ x: pane.width / 2, y: pane.height / 2 }, from);
  const c1 = screenToFlow({ x: pane.width / 2, y: pane.height / 2 }, to);
  const zoom = Math.exp(Math.log(from.zoom) + (Math.log(to.zoom) - Math.log(from.zoom)) * t);
  const cx = c0.x + (c1.x - c0.x) * t;
  const cy = c0.y + (c1.y - c0.y) * t;
  return viewportForCenter(cx, cy, zoom, pane);
}

/** Slow start, slow end. */
export function easeInOutCubic(t: number): number {
  const v = flowClamp(t, 0, 1);
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
}

/** A wheel delta in pixels, whatever unit the device reports (lines and pages too). */
export function wheelDeltaPx(delta: number, deltaMode: number): number {
  return deltaMode === 1 ? delta * 16 : deltaMode === 2 ? delta * 400 : delta;
}

/**
 * How much one wheel event zooms: a factor above 1 zooms in. A trackpad pinch (Ctrl + wheel) is more sensitive than a
 * mouse wheel; a single big step is capped so a fast flick does not jump.
 */
export function wheelZoomFactor(deltaY: number, deltaMode: number, pinch: boolean): number {
  const d = flowClamp(wheelDeltaPx(deltaY, deltaMode), -200, 200);
  return Math.exp(-d * (pinch ? 0.01 : 0.002));
}
