import { describe, expect, it } from 'vitest';
import { ColorHsb, formatColor, hsbToHex, hsbToRgb, parseColor, rgbToHsb } from '../src/index';

const round = (c: ColorHsb | null) => c && { h: Math.round(c.h), s: Math.round(c.s), b: Math.round(c.b) };

describe('colour picker maths', () => {
  it('converts between hsb and rgb', () => {
    expect(hsbToRgb({ h: 0, s: 100, b: 100 })).toEqual({ r: 255, g: 0, b: 0 });
    expect(hsbToRgb({ h: 120, s: 100, b: 50 })).toEqual({ r: 0, g: 128, b: 0 });
    expect(hsbToRgb({ h: 240, s: 0, b: 100 })).toEqual({ r: 255, g: 255, b: 255 });
    expect(round(rgbToHsb({ r: 255, g: 0, b: 0 }))).toEqual({ h: 0, s: 100, b: 100 });
    expect(round(rgbToHsb({ r: 0, g: 0, b: 0 }))).toEqual({ h: 0, s: 0, b: 0 });
    expect(round(rgbToHsb({ r: 100, g: 102, b: 241 }))).toEqual({ h: 239, s: 59, b: 95 });
  });

  it('round-trips hex through hsb', () => {
    for (const hex of ['#6466f1', '#10b981', '#f59e0b', '#000000', '#ffffff']) {
      expect(hsbToHex(parseColor(hex)!)).toBe(hex);
    }
  });

  it('reads every form apps keep', () => {
    expect(round(parseColor('ff0000'))).toEqual({ h: 0, s: 100, b: 100 });
    expect(round(parseColor('#f00'))).toEqual({ h: 0, s: 100, b: 100 });
    expect(round(parseColor('rgb(0, 0, 255)'))).toEqual({ h: 240, s: 100, b: 100 });
    expect(round(parseColor({ r: 0, g: 255, b: 0 }))).toEqual({ h: 120, s: 100, b: 100 });
    expect(parseColor({ h: 30, s: 50, b: 80 })).toEqual({ h: 30, s: 50, b: 80 });
    expect(parseColor('not a colour')).toBeNull();
    expect(parseColor(null)).toBeNull();
    expect(parseColor({ r: 'x', g: 0, b: 0 })).toBeNull();
  });

  it('hands values back in the asked format', () => {
    const red = { h: 0, s: 100, b: 100 };
    expect(formatColor(red)).toBe('#ff0000');
    expect(formatColor(red, 'rgb')).toEqual({ r: 255, g: 0, b: 0 });
    expect(formatColor({ h: 10.4, s: 20.6, b: 30 }, 'hsb')).toEqual({ h: 10, s: 21, b: 30 });
  });
});
