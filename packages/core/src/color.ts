/**
 * Colour math. Every formula here has a twin in packages/themes/scss/_color.scss;
 * the parity test in packages/themes compiles the Sass and compares the output.
 */

export const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type Shade = (typeof SHADES)[number];
export type Palette = Record<Shade, string>;

/** Share of white mixed into the base colour for the light shades. */
export const TINT: Record<number, number> = { 50: 0.92, 100: 0.8, 200: 0.62, 300: 0.42, 400: 0.2 };
/** Share of black mixed into the base colour for the dark shades. */
export const SHADE_MIX: Record<number, number> = { 600: 0.15, 700: 0.3, 800: 0.45, 900: 0.6, 950: 0.75 };

export function isHex(value: unknown): value is string {
  return typeof value === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function roundChannel(v: number): number {
  return Math.round(Math.max(0, Math.min(255, v)));
}

export function rgbToHex(rgb: readonly number[]): string {
  return '#' + rgb.map((v) => roundChannel(v).toString(16).padStart(2, '0')).join('');
}

/**
 * sRGB mix; `weight` is the share of colour `a`. The sum is done in whole percents so a
 * half-way channel is exactly .5 and rounds up the same way in JS and in Sass.
 */
export function mix(a: string, b: string, weight: number): string {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  const wp = Math.round(weight * 100);
  return rgbToHex(x.map((v, i) => (v * wp + y[i] * (100 - wp)) / 100));
}

export function luminance(hex: string): number {
  const c = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

/** WCAG contrast ratio between two hex colours. */
export function contrast(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** Generates the 50–950 scale from one base colour (the base becomes 500). */
export function generatePalette(base: string): Palette {
  const out = {} as Palette;
  for (const s of SHADES) {
    if (s === 500) out[s] = rgbToHex(hexToRgb(base));
    else if (TINT[s] !== undefined) out[s] = mix('#ffffff', base, TINT[s]);
    else out[s] = mix('#000000', base, SHADE_MIX[s]);
  }
  return out;
}

export function isPalette(value: unknown): value is Palette {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return SHADES.every((s) => isHex(v[String(s)]));
}
