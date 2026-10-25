/** Colour picker maths: the picker holds hue / saturation / brightness and reads or writes hex, rgb or hsb values. */
import { hexToRgb, rgbToHex } from './color';

/** Hue 0–360, saturation and brightness 0–100. */
export interface ColorHsb {
  h: number;
  s: number;
  b: number;
}
/** Channels 0–255. */
export interface ColorRgb {
  r: number;
  g: number;
  b: number;
}
export type ColorFormat = 'hex' | 'rgb' | 'hsb';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function hsbToRgb(c: ColorHsb): ColorRgb {
  const h = (((c.h % 360) + 360) % 360) / 60;
  const s = clamp(c.s, 0, 100) / 100;
  const v = clamp(c.b, 0, 100) / 100;
  const k = (n: number) => (n + h) % 6;
  const f = (n: number) => v - v * s * Math.max(0, Math.min(k(n), 4 - k(n), 1));
  return { r: Math.round(f(5) * 255), g: Math.round(f(3) * 255), b: Math.round(f(1) * 255) };
}

export function rgbToHsb(c: ColorRgb): ColorHsb {
  const r = clamp(c.r, 0, 255) / 255;
  const g = clamp(c.g, 0, 255) / 255;
  const b = clamp(c.b, 0, 255) / 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  // Not rounded, so a hex value read and written again comes back the same.
  return { h, s: max ? (d / max) * 100 : 0, b: max * 100 };
}

export function hsbToHex(c: ColorHsb): string {
  const { r, g, b } = hsbToRgb(c);
  return rgbToHex([r, g, b]);
}

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
const RGB_TEXT = /^rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})/i;
const num = (v: unknown) => (typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN);

/**
 * A picker value in any form apps keep: `'#6466f1'`, `'6466f1'`, `'#fff'`, `'rgb(100, 102, 241)'`,
 * `{ r, g, b }` or `{ h, s, b }`. `null` when it is not a colour.
 */
export function parseColor(value: unknown): ColorHsb | null {
  if (typeof value === 'string') {
    const t = value.trim();
    if (HEX.test(t)) {
      const [r, g, b] = hexToRgb(t.startsWith('#') ? t : '#' + t);
      return rgbToHsb({ r, g, b });
    }
    const m = RGB_TEXT.exec(t);
    return m ? rgbToHsb({ r: +m[1], g: +m[2], b: +m[3] }) : null;
  }
  if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>;
    if ('h' in o && 's' in o && 'b' in o) {
      const [h, s, b] = [num(o['h']), num(o['s']), num(o['b'])];
      return [h, s, b].every(Number.isFinite) ? { h: clamp(h, 0, 360), s: clamp(s, 0, 100), b: clamp(b, 0, 100) } : null;
    }
    if ('r' in o && 'g' in o && 'b' in o) {
      const [r, g, b] = [num(o['r']), num(o['g']), num(o['b'])];
      return [r, g, b].every(Number.isFinite) ? rgbToHsb({ r, g, b }) : null;
    }
  }
  return null;
}

/** The value a picker hands back in `format`: `'#rrggbb'`, `{ r, g, b }` or `{ h, s, b }`. */
export function formatColor(c: ColorHsb, format: ColorFormat = 'hex'): string | ColorRgb | ColorHsb {
  if (format === 'rgb') return hsbToRgb(c);
  if (format === 'hsb') return { h: Math.round(c.h), s: Math.round(c.s), b: Math.round(c.b) };
  return hsbToHex(c);
}
