import { describe, expect, it } from 'vitest';
import {
  applyMatrix,
  base64ToFile,
  clampCrop,
  clampView,
  cropperToolbarGroups,
  exifTransform,
  growCrop,
  initialCrop,
  moveCrop,
  normalizeCrop,
  orientationMatrix,
  outputSize,
  padToRatio,
  panCrop,
  parseAspectRatio,
  readExifOrientation,
  remapCrop,
  resizeCrop,
  rotatedSize,
  rotateOrientation,
  sameCrop,
  viewWindow,
  zoomCrop,
} from '../src/index';
import type { CropMatrix, CropperPosition } from '../src/index';

/** Rounded to 3 places, -0 turned into 0, so exact comparisons read cleanly. */
const r3 = (v: number) => Math.round(v * 1000) / 1000 + 0;
const rect = (c: CropperPosition) => ({ x1: r3(c.x1), y1: r3(c.y1), x2: r3(c.x2), y2: r3(c.y2) });
const matrix = (m: CropMatrix) => m.map(r3);
const area = (w: number, h: number): CropperPosition => ({ x1: 0, y1: 0, x2: w, y2: h });
const upright = { rotate: 0, flipH: false, flipV: false };

/** A minimal JPEG: SOI, a JFIF APP0, an EXIF APP1 holding only the orientation tag, then SOS. */
function jpeg(orientation: number, little: boolean): Uint8Array {
  const u16 = (v: number) => (little ? [v & 0xff, v >> 8] : [v >> 8, v & 0xff]);
  const u32 = (v: number) => (little ? [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, v >>> 24] : [v >>> 24, (v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff]);
  const tiff = [...(little ? [0x49, 0x49] : [0x4d, 0x4d]), ...u16(42), ...u32(8)];
  const ifd = [...u16(1), ...u16(0x0112), ...u16(3), ...u32(1), ...u16(orientation), 0, 0, ...u32(0)];
  const exif = [0x45, 0x78, 0x69, 0x66, 0, 0, ...tiff, ...ifd];
  const app0 = [0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00];
  const app1 = [0xff, 0xe1, (exif.length + 2) >> 8, (exif.length + 2) & 0xff, ...exif];
  return new Uint8Array([0xff, 0xd8, ...app0, ...app1, 0xff, 0xda, 0x00, 0x02]);
}

describe('image cropper: the starting box and clamping', () => {
  it('starts as large as it can, centred; the whole image for a free crop', () => {
    expect(rect(initialCrop(area(320, 200)))).toEqual({ x1: 0, y1: 0, x2: 320, y2: 200 });
    expect(rect(initialCrop(area(320, 200), { ratio: 1 }))).toEqual({ x1: 60, y1: 0, x2: 260, y2: 200 });
    expect(rect(initialCrop(area(320, 200), { ratio: 4 / 3 }))).toEqual({ x1: 26.667, y1: 0, x2: 293.333, y2: 200 });
    expect(rect(initialCrop(area(320, 200), { ratio: 1, maxWidth: 100 }))).toEqual({ x1: 110, y1: 50, x2: 210, y2: 150 });
  });

  it('brings a box back inside the image and within the limits', () => {
    expect(rect(clampCrop({ x1: -50, y1: -20, x2: 100, y2: 80 }, area(320, 200)))).toEqual({ x1: 0, y1: 0, x2: 150, y2: 100 });
    expect(rect(clampCrop({ x1: 0, y1: 0, x2: 1000, y2: 1000 }, area(320, 200)))).toEqual({ x1: 0, y1: 0, x2: 320, y2: 200 });
    // With a ratio the width is kept (as far as it fits) and the height follows.
    expect(rect(clampCrop({ x1: 0, y1: 0, x2: 300, y2: 100 }, area(320, 200), { ratio: 1 }))).toEqual({ x1: 50, y1: 0, x2: 250, y2: 200 });
    expect(rect(clampCrop({ x1: 10, y1: 10, x2: 20, y2: 20 }, area(320, 200), { minWidth: 40, minHeight: 30 }))).toEqual({ x1: 0, y1: 0, x2: 40, y2: 30 });
    // Corners given the wrong way round are put in order.
    expect(normalizeCrop({ x1: 50, y1: 40, x2: 10, y2: 20 })).toEqual({ x1: 10, y1: 20, x2: 50, y2: 40 });
    expect(normalizeCrop({ x1: 'a', y1: 0, x2: 1, y2: 1 })).toBeNull();
    expect(normalizeCrop(null)).toBeNull();
  });

  it('reads aspect ratios written as numbers or text', () => {
    expect(parseAspectRatio(1)).toBe(1);
    expect(parseAspectRatio('4/3')).toBeCloseTo(4 / 3);
    expect(parseAspectRatio('16:9')).toBeCloseTo(16 / 9);
    expect(parseAspectRatio('1.5')).toBe(1.5);
    expect(parseAspectRatio(0)).toBeNull();
    expect(parseAspectRatio('wide')).toBeNull();
    expect(parseAspectRatio(null)).toBeNull();
  });

  it('treats a rounded copy as the same box', () => {
    expect(sameCrop({ x1: 10.3, y1: 0, x2: 20.4, y2: 5 }, { x1: 10, y1: 0, x2: 20, y2: 5 })).toBe(true);
    expect(sameCrop({ x1: 11, y1: 0, x2: 20, y2: 5 }, { x1: 10, y1: 0, x2: 20, y2: 5 })).toBe(false);
  });
});

describe('image cropper: moving and resizing the box', () => {
  it('moves without resizing and stops at the edges', () => {
    const box = { x1: 60, y1: 0, x2: 260, y2: 200 };
    expect(moveCrop(box, 100, -10, area(320, 200))).toEqual({ x1: 120, y1: 0, x2: 320, y2: 200 });
    expect(moveCrop(box, -15, 0, area(320, 200))).toEqual({ x1: 45, y1: 0, x2: 245, y2: 200 });
  });

  it('keeps the aspect ratio while a corner is dragged, following the larger movement', () => {
    const box = { x1: 60, y1: 0, x2: 260, y2: 200 };
    expect(rect(resizeCrop(box, 'se', -40, -10, area(320, 200), { ratio: 1 }))).toEqual({ x1: 60, y1: 0, x2: 220, y2: 160 });
    expect(rect(resizeCrop(box, 'nw', 20, 50, area(320, 200), { ratio: 1 }))).toEqual({ x1: 110, y1: 50, x2: 260, y2: 200 });
    const wide = resizeCrop({ x1: 100, y1: 100, x2: 220, y2: 190 }, 'sw', -30, 0, area(400, 300), { ratio: 4 / 3 });
    expect(r3((wide.x2 - wide.x1) / (wide.y2 - wide.y1))).toBe(r3(4 / 3));
    expect(rect(wide)).toEqual({ x1: 70, y1: 100, x2: 220, y2: 212.5 });
  });

  it('an edge with a ratio changes the other side evenly, shifting at the image edge', () => {
    const box = { x1: 100, y1: 100, x2: 220, y2: 190 };
    expect(rect(resizeCrop(box, 'e', 40, 0, area(400, 300), { ratio: 4 / 3 }))).toEqual({ x1: 100, y1: 85, x2: 260, y2: 205 });
    expect(rect(resizeCrop({ x1: 0, y1: 0, x2: 120, y2: 90 }, 'e', 1000, 0, area(400, 300), { ratio: 4 / 3 }))).toEqual({ x1: 0, y1: 0, x2: 400, y2: 300 });
  });

  it('a free crop resizes one side at a time, within the image and the limits, never inside out', () => {
    const box = { x1: 100, y1: 100, x2: 220, y2: 190 };
    expect(resizeCrop(box, 's', 0, 1000, area(400, 300))).toEqual({ x1: 100, y1: 100, x2: 220, y2: 300 });
    expect(resizeCrop(box, 'e', -1000, 0, area(400, 300))).toEqual({ x1: 100, y1: 100, x2: 101, y2: 190 });
    expect(resizeCrop(box, 'e', -1000, 0, area(400, 300), { minWidth: 50 })).toEqual({ x1: 100, y1: 100, x2: 150, y2: 190 });
    expect(resizeCrop(box, 'w', -1000, 0, area(400, 300), { maxWidth: 150 })).toEqual({ x1: 70, y1: 100, x2: 220, y2: 190 });
    expect(resizeCrop(box, 'ne', 10, -20, area(400, 300))).toEqual({ x1: 100, y1: 80, x2: 230, y2: 190 });
  });

  it('grows and shrinks around the centre, keeping the shape', () => {
    expect(rect(growCrop({ x1: 100, y1: 50, x2: 200, y2: 150 }, 20, area(320, 200)))).toEqual({ x1: 90, y1: 40, x2: 210, y2: 160 });
    expect(rect(growCrop({ x1: 100, y1: 50, x2: 200, y2: 150 }, -1000, area(320, 200)))).toEqual({ x1: 149.5, y1: 99.5, x2: 150.5, y2: 100.5 });
    expect(rect(growCrop({ x1: 0, y1: 0, x2: 200, y2: 200 }, 1000, area(320, 200), { ratio: 1 }))).toEqual({ x1: 0, y1: 0, x2: 200, y2: 200 });
  });
});

describe('image cropper: turning and mirroring', () => {
  it('works out the turned size and the drawing matrix', () => {
    expect(rotatedSize(320, 200, 90)).toEqual({ width: 200, height: 320 });
    expect(rotatedSize(320, 200, 180)).toEqual({ width: 320, height: 200 });
    const tilted = rotatedSize(100, 100, 45);
    expect(r3(tilted.width)).toBe(r3(Math.SQRT2 * 100));
    // Turned clockwise, the top-left corner lands top-right.
    const m = orientationMatrix(320, 200, { rotate: 90, flipH: false, flipV: false });
    expect(applyMatrix(m, 0, 0)).toEqual({ x: 200, y: 0 });
    expect(applyMatrix(m, 320, 200)).toEqual({ x: 0, y: 320 });
    // Mirrored left-right.
    const f = orientationMatrix(320, 200, { rotate: 0, flipH: true, flipV: false });
    expect(applyMatrix(f, 0, 0)).toEqual({ x: 320, y: 0 });
    // Centred in a larger (padded) box.
    expect(matrix(orientationMatrix(100, 50, upright, { width: 100, height: 100 }))).toEqual([1, 0, 0, 1, 0, 25]);
    expect(padToRatio({ width: 100, height: 50 }, 1)).toEqual({ width: 100, height: 100 });
    expect(padToRatio({ width: 50, height: 100 }, 1)).toEqual({ width: 100, height: 100 });
  });

  it('matches the usual EXIF orientation transforms', () => {
    // [a, b, c, d, e, f] for a 4 × 3 photo, as canvas code fixing EXIF writes them.
    const expected: Record<number, number[]> = {
      1: [1, 0, 0, 1, 0, 0],
      2: [-1, 0, 0, 1, 4, 0],
      3: [-1, 0, 0, -1, 4, 3],
      4: [1, 0, 0, -1, 0, 3],
      5: [0, 1, 1, 0, 0, 0],
      6: [0, 1, -1, 0, 3, 0],
      7: [0, -1, -1, 0, 3, 4],
      8: [0, -1, 1, 0, 0, 4],
    };
    for (let o = 1; o <= 8; o++) {
      const t = exifTransform(o);
      expect(matrix(orientationMatrix(4, 3, { rotate: t.rotate, flipH: t.flip, flipV: false })), 'orientation ' + o).toEqual(expected[o]);
    }
  });

  it('reads the EXIF orientation from a JPEG, either byte order', () => {
    expect(readExifOrientation(jpeg(6, false))).toBe(6);
    expect(readExifOrientation(jpeg(8, true))).toBe(8);
    expect(readExifOrientation(jpeg(3, true).buffer)).toBe(3);
    expect(readExifOrientation(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toBe(1);
    expect(readExifOrientation(new Uint8Array([0xff, 0xd8, 0xff, 0xe1, 0x00]))).toBe(1);
    expect(readExifOrientation(jpeg(42, false))).toBe(1);
  });

  it('carries the box along when the picture turns or mirrors', () => {
    const wide = { width: 320, height: 200 };
    const tall = { width: 200, height: 320 };
    const right = { rotate: 90, flipH: false, flipV: false };
    expect(rect(remapCrop(area(320, 200), wide, upright, tall, right)!)).toEqual({ x1: 0, y1: 0, x2: 200, y2: 320 });
    // The top-left corner of the photo ends up top-right.
    expect(rect(remapCrop({ x1: 0, y1: 0, x2: 100, y2: 50 }, wide, upright, tall, right)!)).toEqual({ x1: 150, y1: 0, x2: 200, y2: 100 });
    // A kept ratio keeps the box's shape; only its centre moves.
    expect(rect(remapCrop({ x1: 60, y1: 0, x2: 260, y2: 200 }, wide, upright, tall, right, true)!)).toEqual({ x1: 0, y1: 60, x2: 200, y2: 260 });
    expect(rect(remapCrop({ x1: 0, y1: 0, x2: 100, y2: 50 }, wide, upright, wide, { rotate: 0, flipH: true, flipV: false })!)).toEqual({
      x1: 220,
      y1: 0,
      x2: 320,
      y2: 50,
    });
    expect(remapCrop(area(320, 200), wide, upright, wide, { rotate: 45, flipH: false, flipV: false })).toBeNull();
  });

  it('turns on screen the same way whether or not the picture is mirrored', () => {
    const mirrored = { rotate: 0, flipH: true, flipV: false };
    const turned = rotateOrientation(mirrored, 1);
    expect(turned).toEqual({ rotate: 90, flipH: false, flipV: true });
    const wide = { width: 320, height: 200 };
    const tall = { width: 200, height: 320 };
    // Same screen movement as turning an upright picture: top-left goes top-right.
    expect(rect(remapCrop({ x1: 0, y1: 0, x2: 100, y2: 50 }, wide, mirrored, tall, turned)!)).toEqual({ x1: 150, y1: 0, x2: 200, y2: 100 });
    expect(rotateOrientation({ rotate: 270, flipH: true, flipV: true }, 1)).toEqual({ rotate: 0, flipH: true, flipV: true });
    expect(rotateOrientation(upright, -1)).toEqual({ rotate: 270, flipH: false, flipV: false });
  });
});

describe('image cropper: zoom and pan', () => {
  const size = { width: 400, height: 300 };

  it('shows a window onto the image and keeps it inside', () => {
    expect(viewWindow(size, { zoom: 1, cx: 0, cy: 0 })).toEqual({ x1: 0, y1: 0, x2: 400, y2: 300 });
    expect(viewWindow(size, { zoom: 2, cx: 200, cy: 150 })).toEqual({ x1: 100, y1: 75, x2: 300, y2: 225 });
    expect(clampView(size, { zoom: 2, cx: 0, cy: 1000 })).toEqual({ zoom: 2, cx: 100, cy: 225 });
    expect(clampView(size, { zoom: 50, cx: 200, cy: 150 }, 8).zoom).toBe(8);
    expect(clampView(size, { zoom: 0.2, cx: 200, cy: 150 }).zoom).toBe(1);
  });

  it('zooming in shrinks the box in image pixels and keeps it in place on screen; zooming out undoes it', () => {
    const start = { x1: 100, y1: 50, x2: 300, y2: 250 };
    const zin = zoomCrop(size, { zoom: 1, cx: 200, cy: 150 }, start, 2);
    expect(zin.view).toEqual({ zoom: 2, cx: 200, cy: 150 });
    expect(rect(zin.crop)).toEqual({ x1: 150, y1: 100, x2: 250, y2: 200 });
    const zout = zoomCrop(size, zin.view, zin.crop, 1);
    expect(rect(zout.crop)).toEqual(start);
    // Off-centre: the box keeps its spot at the window's top-left.
    const corner = zoomCrop(size, { zoom: 1, cx: 200, cy: 150 }, { x1: 0, y1: 0, x2: 100, y2: 100 }, 2);
    expect(rect(corner.crop)).toEqual({ x1: 25, y1: 25, x2: 75, y2: 75 });
    expect(rect(viewWindow(size, corner.view))).toEqual({ x1: 25, y1: 25, x2: 225, y2: 175 });
  });

  it('stops zooming where the window would be smaller than the smallest box', () => {
    const z = zoomCrop(size, { zoom: 1, cx: 200, cy: 150 }, { x1: 100, y1: 50, x2: 300, y2: 250 }, 8, { minWidth: 100 });
    expect(z.view.zoom).toBe(4);
    expect(z.crop.x2 - z.crop.x1).toBeGreaterThanOrEqual(100);
  });

  it('panning moves the window and the box together, up to the image edge', () => {
    const view = { zoom: 2, cx: 200, cy: 150 };
    const box = { x1: 150, y1: 100, x2: 250, y2: 200 };
    expect(panCrop(size, view, box, 50, 0)).toEqual({ view: { zoom: 2, cx: 250, cy: 150 }, crop: { x1: 200, y1: 100, x2: 300, y2: 200 } });
    expect(panCrop(size, view, box, 500, -500)).toEqual({ view: { zoom: 2, cx: 300, cy: 75 }, crop: { x1: 250, y1: 25, x2: 350, y2: 125 } });
  });
});

describe('image cropper: output', () => {
  it('uses the crop size, or resizes to the asked width / height', () => {
    expect(outputSize(300, 200)).toEqual({ width: 300, height: 200 });
    expect(outputSize(300, 200, { resizeToWidth: 150 })).toEqual({ width: 150, height: 100 });
    expect(outputSize(300, 200, { resizeToWidth: 600 })).toEqual({ width: 600, height: 400 });
    expect(outputSize(300, 200, { resizeToWidth: 600, onlyScaleDown: true })).toEqual({ width: 300, height: 200 });
    expect(outputSize(300, 200, { resizeToHeight: 100 })).toEqual({ width: 150, height: 100 });
    // Both: fits inside both.
    expect(outputSize(300, 200, { resizeToWidth: 512, resizeToHeight: 512 })).toEqual({ width: 512, height: 341 });
    expect(outputSize(512.4, 511.7, { resizeToWidth: 512, resizeToHeight: 512, ratio: 1 })).toEqual({ width: 512, height: 512 });
  });

  it('works the height out from a kept ratio and stays within what a canvas can hold', () => {
    expect(outputSize(266, 200, { resizeToWidth: 120, ratio: 4 / 3 })).toEqual({ width: 120, height: 90 });
    expect(outputSize(10000, 10000)).toEqual({ width: 4096, height: 4096 });
    expect(outputSize(1000, 1000, { maxArea: 250000 })).toEqual({ width: 500, height: 500 });
  });

  it('turns base64 and data URLs into blobs', async () => {
    const png = base64ToFile('data:image/png;base64,iVBORw0KGgo=');
    expect(png.type).toBe('image/png');
    expect(png.size).toBe(8);
    expect(Array.from(new Uint8Array(await png.arrayBuffer())).slice(0, 4)).toEqual([0x89, 0x50, 0x4e, 0x47]);
    expect(base64ToFile('iVBORw0KGgo=', 'image/x-test').type).toBe('image/x-test');
    const svg = base64ToFile('data:image/svg+xml,%3Csvg%3E');
    expect(svg.type).toBe('image/svg+xml');
    expect(svg.size).toBe(5);
  });
});

describe('cropperToolbarGroups', () => {
  it('gives the full toolbar by default: zoom tools, then the rest', () => {
    const full = [
      ['zoomOut', 'zoomSlider', 'zoomIn'],
      ['rotateLeft', 'rotateRight', 'flipHorizontal', 'flipVertical', 'reset'],
    ];
    expect(cropperToolbarGroups(undefined)).toEqual(full);
    expect(cropperToolbarGroups('full')).toEqual(full);
  });
  it('gives nothing for none or an empty list', () => {
    expect(cropperToolbarGroups('none')).toEqual([]);
    expect(cropperToolbarGroups([])).toEqual([]);
  });
  it('expands the group names and splits zoom from the rest when no | is given', () => {
    expect(cropperToolbarGroups(['rotate', 'zoomIn', 'reset'])).toEqual([['zoomIn'], ['rotateLeft', 'rotateRight', 'reset']]);
    expect(cropperToolbarGroups(['flip'])).toEqual([['flipHorizontal', 'flipVertical']]);
  });
  it('keeps the groups and order the app gives with |', () => {
    expect(cropperToolbarGroups(['rotateRight', 'zoom', '|', 'reset', '|', '|'])).toEqual([
      ['rotateRight', 'zoomOut', 'zoomSlider', 'zoomIn'],
      ['reset'],
    ]);
  });
  it('skips unknown names and repeats', () => {
    expect(cropperToolbarGroups(['zoomIn', 'crop', 'zoom', 'zoomIn'] as never)).toEqual([['zoomIn', 'zoomOut', 'zoomSlider']]);
  });
});
