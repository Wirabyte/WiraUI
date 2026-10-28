import { describe, expect, it } from 'vitest';
import { dockScale } from '../src/index';

describe('dock magnification', () => {
  it('is largest under the pointer and eases to 1 at the reach', () => {
    expect(dockScale(0, 120, 1.8)).toBe(1.8);
    expect(dockScale(60, 120, 1.8)).toBeCloseTo(1.4);
    expect(dockScale(-60, 120, 1.8)).toBeCloseTo(1.4);
    expect(dockScale(120, 120, 1.8)).toBe(1);
    expect(dockScale(500, 120, 1.8)).toBe(1);
    // Closer is never smaller.
    expect(dockScale(20, 120, 1.8)).toBeGreaterThan(dockScale(40, 120, 1.8));
  });

  it('turns off with no reach or no growth', () => {
    expect(dockScale(0, 0, 2)).toBe(1);
    expect(dockScale(0, 100, 1)).toBe(1);
    expect(dockScale(NaN, 100, 2)).toBe(1);
  });
});
