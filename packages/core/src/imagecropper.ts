/**
 * Image cropper maths. The crop rectangle lives in pixels of the *oriented* image (the picture after rotation and
 * flips, plus any padding), so it survives window resizes and layout changes. Zoom is a window onto that image:
 * at zoom 1 the whole image shows, at zoom 2 a window half as wide and half as tall. The crop box always stays
 * inside the window, and the window inside the image. Framework-free; the Angular component draws and listens.
 */

/** Corners of a crop rectangle in image pixels: x1,y1 top-left, x2,y2 bottom-right. */
export interface CropperPosition {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface CropDimensions {
  width: number;
  height: number;
}

/** The part of the crop box being dragged: an edge (n, e, s, w) or a corner. */
export type CropHandle = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

/**
 * Size limits in image pixels (0 or missing = no limit). `ratio` is width / height while the aspect ratio is kept;
 * leave it out (or null) for a free crop.
 */
export interface CropLimits {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  ratio?: number | null;
}

/** How the source picture is turned: degrees clockwise, then mirrored on screen (left-right, top-bottom). */
export interface CropOrientation {
  rotate: number;
  flipH: boolean;
  flipV: boolean;
}

/** What is in view: zoom (1 = whole image) and the centre of the visible window in image pixels. */
export interface CropView {
  zoom: number;
  cx: number;
  cy: number;
}

/** A 2D affine matrix in canvas order: x' = a·x + c·y + e, y' = b·x + d·y + f. */
export type CropMatrix = [number, number, number, number, number, number];

/** Smallest crop box, in image pixels, whatever the limits say. */
const MIN_SIZE = 1;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const positive = (v: unknown): number => {
  const n = Number(v);
  return isFinite(n) && n > 0 ? n : 0;
};
const ratioOf = (limits?: CropLimits): number | null => {
  const r = limits ? Number(limits.ratio) : NaN;
  return isFinite(r) && r > 0 ? r : null;
};

export function cropWidth(r: CropperPosition): number {
  return r.x2 - r.x1;
}

export function cropHeight(r: CropperPosition): number {
  return r.y2 - r.y1;
}

/** The whole area of a `width` × `height` image as a crop rectangle. */
export function cropArea(size: CropDimensions): CropperPosition {
  return { x1: 0, y1: 0, x2: size.width, y2: size.height };
}

/** Corners in order (x1 ≤ x2, y1 ≤ y2), numbers only; null when the value is not a rectangle. */
export function normalizeCrop(r: unknown): CropperPosition | null {
  if (!r || typeof r !== 'object') return null;
  const o = r as Record<string, unknown>;
  const n = [o['x1'], o['y1'], o['x2'], o['y2']].map(Number);
  if (n.some((v) => !isFinite(v))) return null;
  return { x1: Math.min(n[0], n[2]), y1: Math.min(n[1], n[3]), x2: Math.max(n[0], n[2]), y2: Math.max(n[1], n[3]) };
}

/** Same rectangle within half a pixel (so a rounded copy written back by two-way binding is not a change). */
export function sameCrop(a: CropperPosition | null | undefined, b: CropperPosition | null | undefined, tolerance = 0.5): boolean {
  if (!a || !b) return a === b;
  return Math.abs(a.x1 - b.x1) <= tolerance && Math.abs(a.y1 - b.y1) <= tolerance && Math.abs(a.x2 - b.x2) <= tolerance && Math.abs(a.y2 - b.y2) <= tolerance;
}

/** Whole pixels, for events and two-way binding. */
export function roundCrop(r: CropperPosition): CropperPosition {
  return { x1: Math.round(r.x1), y1: Math.round(r.y1), x2: Math.round(r.x2), y2: Math.round(r.y2) };
}

/** An aspect ratio from a number or a string like `'4/3'`, `'16:9'` or `'1.5'`; null when there is none. */
export function parseAspectRatio(v: unknown): number | null {
  if (typeof v === 'number') return isFinite(v) && v > 0 ? v : null;
  if (typeof v !== 'string' || !v.trim()) return null;
  const m = /^\s*([\d.]+)\s*[/:]\s*([\d.]+)\s*$/.exec(v);
  const r = m ? Number(m[1]) / Number(m[2]) : Number(v);
  return isFinite(r) && r > 0 ? r : null;
}

/**
 * The widths and heights a crop box may take when it has `roomW` × `roomH` pixels of space. With a ratio the height
 * follows the width, so both ranges describe the same boxes.
 */
export function cropSizeRange(roomW: number, roomH: number, limits: CropLimits = {}): { minW: number; maxW: number; minH: number; maxH: number } {
  const ratio = ratioOf(limits);
  let maxW = Math.min(positive(limits.maxWidth) || Infinity, Math.max(MIN_SIZE, roomW));
  let maxH = Math.min(positive(limits.maxHeight) || Infinity, Math.max(MIN_SIZE, roomH));
  let minW = Math.max(positive(limits.minWidth), MIN_SIZE);
  let minH = Math.max(positive(limits.minHeight), MIN_SIZE);
  if (ratio) {
    maxW = Math.min(maxW, maxH * ratio);
    minW = Math.max(minW, minH * ratio);
    maxH = maxW / ratio;
    minH = minW / ratio;
  }
  // A minimum that does not fit gives way to the room there is: the box stays inside the image.
  if (minW > maxW) minW = maxW;
  if (minH > maxH) minH = maxH;
  return { minW, maxW, minH, maxH };
}

/** The starting crop box: as large as the limits allow inside `area`, centred (the whole area for a free crop). */
export function initialCrop(area: CropperPosition, limits: CropLimits = {}): CropperPosition {
  const ratio = ratioOf(limits);
  const range = cropSizeRange(cropWidth(area), cropHeight(area), limits);
  const w = range.maxW;
  const h = ratio ? w / ratio : range.maxH;
  const x1 = area.x1 + (cropWidth(area) - w) / 2;
  const y1 = area.y1 + (cropHeight(area) - h) / 2;
  return { x1, y1, x2: x1 + w, y2: y1 + h };
}

/**
 * Brings any rectangle inside `area` and within the limits, keeping its centre where it can. With a ratio the width
 * is kept and the height follows; a box that would then be too big shrinks.
 */
export function clampCrop(rect: CropperPosition, area: CropperPosition, limits: CropLimits = {}): CropperPosition {
  const r = normalizeCrop(rect) || initialCrop(area, limits);
  const ratio = ratioOf(limits);
  const range = cropSizeRange(cropWidth(area), cropHeight(area), limits);
  const w = clamp(cropWidth(r), range.minW, range.maxW);
  const h = ratio ? w / ratio : clamp(cropHeight(r), range.minH, range.maxH);
  const cx = (r.x1 + r.x2) / 2;
  const cy = (r.y1 + r.y2) / 2;
  const x1 = clamp(cx - w / 2, area.x1, area.x2 - w);
  const y1 = clamp(cy - h / 2, area.y1, area.y2 - h);
  return { x1, y1, x2: x1 + w, y2: y1 + h };
}

/** Moves the box by `dx`, `dy` image pixels without changing its size; it stops at the edges of `area`. */
export function moveCrop(rect: CropperPosition, dx: number, dy: number, area: CropperPosition): CropperPosition {
  const w = cropWidth(rect);
  const h = cropHeight(rect);
  const x1 = clamp(rect.x1 + dx, area.x1, Math.max(area.x1, area.x2 - w));
  const y1 = clamp(rect.y1 + dy, area.y1, Math.max(area.y1, area.y2 - h));
  return { x1, y1, x2: x1 + w, y2: y1 + h };
}

/**
 * Resizes the box `start` by dragging `handle` by `dx`, `dy` image pixels. The opposite side (or corner) stays put.
 * With a ratio, a corner follows whichever direction the pointer moved further; an edge changes the other side
 * evenly around the middle (moving the box if it reaches the image edge). The box never turns inside out.
 */
export function resizeCrop(
  start: CropperPosition,
  handle: CropHandle,
  dx: number,
  dy: number,
  area: CropperPosition,
  limits: CropLimits = {}
): CropperPosition {
  const ratio = ratioOf(limits);
  const west = handle.indexOf('w') >= 0;
  const east = handle.indexOf('e') >= 0;
  const north = handle.indexOf('n') >= 0;
  const south = handle.indexOf('s') >= 0;
  const w0 = cropWidth(start);
  const h0 = cropHeight(start);
  let w = w0 + (east ? dx : west ? -dx : 0);
  let h = h0 + (south ? dy : north ? -dy : 0);
  const roomW = east ? area.x2 - start.x1 : west ? start.x2 - area.x1 : cropWidth(area);
  const roomH = south ? area.y2 - start.y1 : north ? start.y2 - area.y1 : cropHeight(area);
  const range = cropSizeRange(roomW, roomH, limits);
  if (ratio) {
    if ((east || west) && (north || south)) {
      if (Math.abs(w - w0) >= Math.abs(h - h0) * ratio) h = w / ratio;
      else w = h * ratio;
    } else if (east || west) {
      h = w / ratio;
    } else {
      w = h * ratio;
    }
    w = clamp(w, range.minW, range.maxW);
    h = w / ratio;
  } else {
    w = clamp(w, range.minW, range.maxW);
    h = clamp(h, range.minH, range.maxH);
  }
  let x1 = east ? start.x1 : west ? start.x2 - w : (start.x1 + start.x2) / 2 - w / 2;
  let y1 = south ? start.y1 : north ? start.y2 - h : (start.y1 + start.y2) / 2 - h / 2;
  x1 = clamp(x1, area.x1, Math.max(area.x1, area.x2 - w));
  y1 = clamp(y1, area.y1, Math.max(area.y1, area.y2 - h));
  return { x1, y1, x2: x1 + w, y2: y1 + h };
}

/**
 * Grows (positive `amount`) or shrinks the box around its centre, keeping its shape: `amount` is added to the width
 * and the height changes in proportion. Used by the + / − keys.
 */
export function growCrop(rect: CropperPosition, amount: number, area: CropperPosition, limits: CropLimits = {}): CropperPosition {
  const w = Math.max(MIN_SIZE, cropWidth(rect));
  const h = Math.max(MIN_SIZE, cropHeight(rect));
  const range = cropSizeRange(cropWidth(area), cropHeight(area), limits);
  const lo = Math.max(range.minW / w, range.minH / h);
  const hi = Math.min(range.maxW / w, range.maxH / h);
  const k = clamp((w + amount) / w, Math.min(lo, hi), hi);
  const nw = w * k;
  const nh = h * k;
  const cx = (rect.x1 + rect.x2) / 2;
  const cy = (rect.y1 + rect.y2) / 2;
  const x1 = clamp(cx - nw / 2, area.x1, Math.max(area.x1, area.x2 - nw));
  const y1 = clamp(cy - nh / 2, area.y1, Math.max(area.y1, area.y2 - nh));
  return { x1, y1, x2: x1 + nw, y2: y1 + nh };
}

// ---------- orientation ----------

/** Degrees in [0, 360). */
export function normalizeAngle(deg: number): number {
  const d = Number(deg) || 0;
  return ((d % 360) + 360) % 360;
}

const isQuarter = (deg: number) => Math.abs(normalizeAngle(deg) % 90) < 1e-9;

/** cos / sin of an angle, exact for quarter turns (no 6e-17 left over). */
function cosSin(deg: number): [number, number] {
  const d = normalizeAngle(deg);
  if (isQuarter(d)) {
    const q = Math.round(d / 90) % 4;
    return [[1, 0, -1, 0][q], [0, 1, 0, -1][q]];
  }
  const rad = (d * Math.PI) / 180;
  return [Math.cos(rad), Math.sin(rad)];
}

/** Size of a `width` × `height` picture once turned by `deg` degrees (its bounding box). */
export function rotatedSize(width: number, height: number, deg: number): CropDimensions {
  const [c, s] = cosSin(deg);
  return { width: Math.abs(width * c) + Math.abs(height * s), height: Math.abs(width * s) + Math.abs(height * c) };
}

/** Grows a box to `ratio` (width / height) by adding room around it, the picture centred: for fitting a whole photo. */
export function padToRatio(size: CropDimensions, ratio: number | null | undefined): CropDimensions {
  const r = Number(ratio);
  if (!isFinite(r) || r <= 0 || !size.width || !size.height) return { width: size.width, height: size.height };
  return size.width / size.height > r ? { width: size.width, height: size.width / r } : { width: size.height * r, height: size.height };
}

/** The 2 × 2 part of an orientation: rotate first, then mirror on screen. */
function linearOf(o: CropOrientation): [number, number, number, number] {
  const [c, s] = cosSin(o.rotate);
  const fx = o.flipH ? -1 : 1;
  const fy = o.flipV ? -1 : 1;
  return [fx * c, fy * s, -fx * s, fy * c];
}

/**
 * The matrix that draws a `srcW` × `srcH` source in oriented space: turned, mirrored and centred in `out`
 * (by default the turned picture's own bounding box). Use with `ctx.transform(...m)` before `drawImage(src, 0, 0)`.
 */
export function orientationMatrix(srcW: number, srcH: number, o: CropOrientation, out?: CropDimensions): CropMatrix {
  const size = out || rotatedSize(srcW, srcH, o.rotate);
  const [a, b, c, d] = linearOf(o);
  const e = size.width / 2 - (a * srcW) / 2 - (c * srcH) / 2;
  const f = size.height / 2 - (b * srcW) / 2 - (d * srcH) / 2;
  return [a, b, c, d, e, f];
}

export function applyMatrix(m: CropMatrix, x: number, y: number): { x: number; y: number } {
  return { x: m[0] * x + m[2] * y + m[4], y: m[1] * x + m[3] * y + m[5] };
}

/**
 * The orientation after turning the picture on screen by `quarterTurns` (+1 = 90° clockwise). While exactly one mirror
 * is on, a turn of the source runs the other way on screen, so the mirrors swap to keep the turn on screen clockwise.
 */
export function rotateOrientation(o: CropOrientation, quarterTurns: number): CropOrientation {
  const q = Math.round(quarterTurns) || 0;
  const swap = Math.abs(q) % 2 === 1 && o.flipH !== o.flipV;
  return { rotate: normalizeAngle(o.rotate + q * 90), flipH: swap ? o.flipV : o.flipH, flipV: swap ? o.flipH : o.flipV };
}

/**
 * Carries a point from one orientation's space (`fromSize`) to another's (`toSize`), about the centres. Null when the
 * change is not a whole quarter turn or a mirror (the caller then starts the crop afresh).
 */
export function remapPoint(
  x: number,
  y: number,
  fromSize: CropDimensions,
  from: CropOrientation,
  toSize: CropDimensions,
  to: CropOrientation
): { x: number; y: number } | null {
  const s = screenChange(from, to);
  if (!s) return null;
  const px = x - fromSize.width / 2;
  const py = y - fromSize.height / 2;
  return { x: s[0] * px + s[2] * py + toSize.width / 2, y: s[1] * px + s[3] * py + toSize.height / 2 };
}

/**
 * Carries the crop box along when the picture turns or mirrors, so the same part of the photo stays selected. With
 * `keepShape` (a kept aspect ratio) only the centre moves and the box keeps its width and height; otherwise the box
 * turns with the picture. Null when the change is not a quarter turn or a mirror. Clamp the result afterwards.
 */
export function remapCrop(
  rect: CropperPosition,
  fromSize: CropDimensions,
  from: CropOrientation,
  toSize: CropDimensions,
  to: CropOrientation,
  keepShape = false
): CropperPosition | null {
  const a = remapPoint(rect.x1, rect.y1, fromSize, from, toSize, to);
  const b = remapPoint(rect.x2, rect.y2, fromSize, from, toSize, to);
  if (!a || !b) return null;
  if (!keepShape) return { x1: Math.min(a.x, b.x), y1: Math.min(a.y, b.y), x2: Math.max(a.x, b.x), y2: Math.max(a.y, b.y) };
  const cx = (a.x + b.x) / 2;
  const cy = (a.y + b.y) / 2;
  const w = cropWidth(rect);
  const h = cropHeight(rect);
  return { x1: cx - w / 2, y1: cy - h / 2, x2: cx + w / 2, y2: cy + h / 2 };
}

/** How the screen changes between two orientations (a signed permutation matrix), or null for an odd angle. */
function screenChange(from: CropOrientation, to: CropOrientation): [number, number, number, number] | null {
  const m = linearOf(to);
  const f = linearOf(from);
  // f is orthogonal: its inverse is its transpose.
  const inv: [number, number, number, number] = [f[0], f[2], f[1], f[3]];
  const s: [number, number, number, number] = [
    m[0] * inv[0] + m[2] * inv[1],
    m[1] * inv[0] + m[3] * inv[1],
    m[0] * inv[2] + m[2] * inv[3],
    m[1] * inv[2] + m[3] * inv[3],
  ];
  const rounded = s.map((v) => Math.round(v)) as [number, number, number, number];
  return rounded.every((v, i) => Math.abs(v - s[i]) < 1e-6) ? rounded : null;
}

// ---------- zoom and pan ----------

/** Keeps zoom within [1, maxZoom] and the window inside the image. */
export function clampView(size: CropDimensions, view: CropView, maxZoom = 10): CropView {
  const zoom = clamp(Number(view.zoom) || 1, 1, Math.max(1, maxZoom));
  const hw = size.width / zoom / 2;
  const hh = size.height / zoom / 2;
  const cx = isFinite(view.cx) ? view.cx : size.width / 2;
  const cy = isFinite(view.cy) ? view.cy : size.height / 2;
  return { zoom, cx: clamp(cx, hw, size.width - hw), cy: clamp(cy, hh, size.height - hh) };
}

/** The visible part of the image, in image pixels. */
export function viewWindow(size: CropDimensions, view: CropView): CropperPosition {
  const v = clampView(size, view, Math.max(1, view.zoom));
  const w = size.width / v.zoom;
  const h = size.height / v.zoom;
  const x1 = v.cx - w / 2;
  const y1 = v.cy - h / 2;
  return { x1, y1, x2: x1 + w, y2: y1 + h };
}

/**
 * Zooms to `zoom` the way a photo grows under a frame: the crop box keeps its place and size on screen, so in image
 * pixels it gets smaller when zooming in (more detail) and larger when zooming out. Zoom stops where the window would
 * be smaller than the smallest box the limits allow.
 */
export function zoomCrop(
  size: CropDimensions,
  view: CropView,
  crop: CropperPosition,
  zoom: number,
  limits: CropLimits = {},
  maxZoom = 10
): { view: CropView; crop: CropperPosition } {
  const range = cropSizeRange(size.width, size.height, limits);
  const cap = Math.max(1, Math.min(maxZoom, size.width / range.minW, size.height / range.minH));
  const v0 = clampView(size, view, cap);
  const z1 = clamp(Number(zoom) || 1, 1, cap);
  const win0 = viewWindow(size, v0);
  const k = v0.zoom / z1;
  const cx = (crop.x1 + crop.x2) / 2;
  const cy = (crop.y1 + crop.y2) / 2;
  // Keep the crop centre at the same spot on screen.
  const wx = cx - (cx - win0.x1) * k;
  const wy = cy - (cy - win0.y1) * k;
  const w1 = size.width / z1;
  const h1 = size.height / z1;
  const v1 = clampView(size, { zoom: z1, cx: wx + w1 / 2, cy: wy + h1 / 2 }, cap);
  const win1 = viewWindow(size, v1);
  const cw = cropWidth(crop) * k;
  const ch = cropHeight(crop) * k;
  const next = clampCrop({ x1: cx - cw / 2, y1: cy - ch / 2, x2: cx + cw / 2, y2: cy + ch / 2 }, win1, limits);
  return { view: v1, crop: next };
}

/**
 * Pans the window by `dx`, `dy` image pixels (positive = towards the right / bottom of the image). The crop box keeps
 * its place on screen, so it moves over the image by the same amount.
 */
export function panCrop(size: CropDimensions, view: CropView, crop: CropperPosition, dx: number, dy: number): { view: CropView; crop: CropperPosition } {
  const v0 = clampView(size, view, view.zoom);
  const win0 = viewWindow(size, v0);
  const v1 = clampView(size, { zoom: v0.zoom, cx: v0.cx + dx, cy: v0.cy + dy }, v0.zoom);
  const win1 = viewWindow(size, v1);
  const ax = win1.x1 - win0.x1;
  const ay = win1.y1 - win0.y1;
  return { view: v1, crop: { x1: crop.x1 + ax, y1: crop.y1 + ay, x2: crop.x2 + ax, y2: crop.y2 + ay } };
}

// ---------- output ----------

/** Canvas area browsers reliably allocate (iOS Safari's limit, 4096 × 4096). */
export const MAX_CANVAS_AREA = 16777216;

export interface CropOutputOptions {
  /** Output width in pixels; 0 = the crop's own width. */
  resizeToWidth?: number;
  /** Output height in pixels; 0 = the crop's own height. With both, the image fits inside both. */
  resizeToHeight?: number;
  /** Never enlarge a crop smaller than the requested size. */
  onlyScaleDown?: boolean;
  /** Kept aspect ratio: the height is worked out from the width so rounding cannot drift by a pixel. */
  ratio?: number | null;
  /** Largest output area in pixels. Default `MAX_CANVAS_AREA`. */
  maxArea?: number;
}

/** The size of the cropped image: the crop's pixels, resized to `resizeToWidth` / `resizeToHeight` when asked. */
export function outputSize(cropW: number, cropH: number, options: CropOutputOptions = {}): CropDimensions {
  const w = Math.max(MIN_SIZE, cropW);
  const h = Math.max(MIN_SIZE, cropH);
  const ratios: number[] = [];
  const rw = positive(options.resizeToWidth);
  const rh = positive(options.resizeToHeight);
  if (rw) ratios.push(rw / w);
  if (rh) ratios.push(rh / h);
  let scale = ratios.length ? Math.min(...ratios) : 1;
  if (scale > 1 && options.onlyScaleDown) scale = 1;
  const maxArea = positive(options.maxArea) || MAX_CANVAS_AREA;
  if (w * scale * h * scale > maxArea) scale = Math.sqrt(maxArea / (w * h));
  const ratio = Number(options.ratio);
  const width = Math.max(1, Math.round(w * scale));
  const height = isFinite(ratio) && ratio > 0 ? Math.max(1, Math.round(width / ratio)) : Math.max(1, Math.round(h * scale));
  return { width, height };
}

// ---------- reading files ----------

/**
 * The EXIF orientation (1–8) of a JPEG from its first bytes; 1 when there is none or the data is not a JPEG.
 * 64 KB from the start of the file is enough: the EXIF block comes first.
 */
export function readExifOrientation(data: ArrayBuffer | Uint8Array): number {
  try {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return 1;
    let offset = 2;
    while (offset + 4 <= view.byteLength) {
      const marker = view.getUint16(offset);
      if ((marker & 0xff00) !== 0xff00 || marker === 0xffda) return 1;
      const length = view.getUint16(offset + 2);
      if (marker === 0xffe1 && view.getUint32(offset + 4) === 0x45786966 && view.getUint16(offset + 8) === 0) {
        const tiff = offset + 10;
        const little = view.getUint16(tiff) === 0x4949;
        const ifd = tiff + view.getUint32(tiff + 4, little);
        const entries = view.getUint16(ifd, little);
        for (let i = 0; i < entries; i++) {
          const entry = ifd + 2 + i * 12;
          if (view.getUint16(entry, little) === 0x0112) {
            const o = view.getUint16(entry + 8, little);
            return o >= 1 && o <= 8 ? o : 1;
          }
        }
        return 1;
      }
      if (length < 2) return 1;
      offset += 2 + length;
    }
  } catch {
    // A truncated or odd file: treat as upright.
  }
  return 1;
}

/** What an EXIF orientation asks for: turn clockwise by `rotate`, then mirror left-right when `flip`. */
export function exifTransform(orientation: number): { rotate: number; flip: boolean } {
  switch (orientation) {
    case 2:
      return { rotate: 0, flip: true };
    case 3:
      return { rotate: 180, flip: false };
    case 4:
      return { rotate: 180, flip: true };
    case 5:
      return { rotate: 90, flip: true };
    case 6:
      return { rotate: 90, flip: false };
    case 7:
      return { rotate: 270, flip: true };
    case 8:
      return { rotate: 270, flip: false };
    default:
      return { rotate: 0, flip: false };
  }
}

/**
 * A Blob from a data URL (`data:image/png;base64,…`) or bare base64 (read as PNG unless `type` says otherwise).
 * Named like the helper apps already call to turn a cropped base64 image into an uploadable file.
 */
export function base64ToFile(base64: string, type?: string): Blob {
  const m = /^data:([^;,]*)(;base64)?,/.exec(base64);
  const mime = type || (m && m[1]) || 'image/png';
  const body = m ? base64.slice(m[0].length) : base64;
  // A data URL without ;base64 is URL-encoded text (an SVG, say): Blob writes it as UTF-8.
  if (m && !m[2]) return new Blob([decodeURIComponent(body)], { type: mime });
  const binary = atob(body.replace(/\s/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}
