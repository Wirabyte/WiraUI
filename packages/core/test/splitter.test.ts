import { describe, expect, it } from 'vitest';
import { splitterBasis, splitterPercent, splitterReadState, splitterResize, splitterSizes } from '../src/index';

describe('splitter sizes', () => {
  it('starts from the given sizes; the others share what is left', () => {
    expect(splitterSizes(2, [25, 75])).toEqual([25, 75]);
    expect(splitterSizes(3)).toEqual([33.3333, 33.3333, 33.3333]);
    expect(splitterSizes(3, [50])).toEqual([50, 25, 25]);
    expect(splitterSizes(2, ['40', null])).toEqual([40, 60]);
    expect(splitterSizes(2, [100])).toEqual([100, 50]);
    expect(splitterSizes(0)).toEqual([]);
  });

  it('moves a gutter within the minimum sizes, keeping the pair total', () => {
    expect(splitterResize([50, 50], 0, 10)).toEqual([60, 40]);
    expect(splitterResize([50, 50], 0, -70)).toEqual([0, 100]);
    expect(splitterResize([50, 50], 0, -45, [10, 0])).toEqual([10, 90]);
    expect(splitterResize([50, 50], 0, 45, [0, 20])).toEqual([80, 20]);
    expect(splitterResize([20, 30, 50], 1, 10, [0, 0, 10])).toEqual([20, 40, 40]);
    expect(splitterResize([50, 50], 1, 10)).toEqual([50, 50]);
  });

  it('reads saved state only when it fits', () => {
    expect(splitterReadState('[30,70]', 2)).toEqual([30, 70]);
    expect(splitterReadState('[30,70]', 3)).toBeNull();
    expect(splitterReadState('not json', 2)).toBeNull();
    expect(splitterReadState('[30,"x"]', 2)).toBeNull();
    expect(splitterReadState(null, 2)).toBeNull();
  });

  it('turns sizes into flex-basis and pixels into points', () => {
    expect(splitterBasis(50, 2, 4)).toBe('calc((100% - 4px) * 0.5)');
    expect(splitterBasis(25, 3, 4)).toBe('calc((100% - 8px) * 0.25)');
    expect(splitterBasis(100, 1, 4)).toBe('100%');
    expect(splitterPercent(102, 1024, 2, 4)).toBe(10);
    expect(splitterPercent(10, 0, 2, 4)).toBe(0);
  });
});
