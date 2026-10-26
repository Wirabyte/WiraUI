import { describe, expect, it } from 'vitest';
import { imageCompareAt, imageCompareClamp, imageCompareKey } from '../src/index';

describe('image compare divider', () => {
  it('keeps positions in 0 … 100', () => {
    expect(imageCompareClamp(30)).toBe(30);
    expect(imageCompareClamp('75')).toBe(75);
    expect(imageCompareClamp(140)).toBe(100);
    expect(imageCompareClamp(-3)).toBe(0);
    expect(imageCompareClamp(undefined)).toBe(50);
    expect(imageCompareClamp('x', 20)).toBe(20);
  });

  it('reads the position under the pointer, both directions', () => {
    expect(imageCompareAt(150, 100, 200)).toBe(25);
    expect(imageCompareAt(50, 100, 200)).toBe(0);
    expect(imageCompareAt(400, 100, 200)).toBe(100);
    expect(imageCompareAt(150, 100, 200, true)).toBe(75);
    expect(imageCompareAt(133.333, 100, 200)).toBe(16.7);
    expect(imageCompareAt(10, 0, 0)).toBe(50);
  });

  it('moves with the keys; right to left the arrows follow the screen', () => {
    expect(imageCompareKey('ArrowRight', 50)).toBe(51);
    expect(imageCompareKey('ArrowLeft', 50, 5)).toBe(45);
    expect(imageCompareKey('ArrowRight', 50, 1, true)).toBe(49);
    expect(imageCompareKey('PageUp', 95)).toBe(100);
    expect(imageCompareKey('Home', 50)).toBe(0);
    expect(imageCompareKey('End', 50)).toBe(100);
    expect(imageCompareKey('Tab', 50)).toBeNull();
  });
});
