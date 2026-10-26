import { describe, expect, it } from 'vitest';
import { carouselClampPage, carouselFirst, carouselIsCircular, carouselLayout, carouselPageCount, carouselRepage, carouselStep } from '../src/index';

const responsive = [
  { breakpoint: '1400px', numVisible: 3, numScroll: 1 },
  { breakpoint: '767px', numVisible: 2, numScroll: 2 },
  { breakpoint: '575px', numVisible: 1, numScroll: 1 },
];

describe('carousel paging', () => {
  it('picks what shows at a window width', () => {
    expect(carouselLayout(1600, 4, 4, responsive)).toEqual({ numVisible: 4, numScroll: 4 });
    expect(carouselLayout(1200, 4, 4, responsive)).toEqual({ numVisible: 3, numScroll: 1 });
    expect(carouselLayout(700, 4, 4, responsive)).toEqual({ numVisible: 2, numScroll: 2 });
    expect(carouselLayout(360, 4, 4, responsive)).toEqual({ numVisible: 1, numScroll: 1 });
    expect(carouselLayout(null, 3, 1, responsive)).toEqual({ numVisible: 3, numScroll: 1 });
    expect(carouselLayout(800, 0, undefined, null)).toEqual({ numVisible: 1, numScroll: 1 });
  });

  it('counts pages, the last one full', () => {
    expect(carouselPageCount(9, 3, 3)).toBe(3);
    expect(carouselPageCount(10, 3, 3)).toBe(4);
    expect(carouselPageCount(6, 3, 1)).toBe(4);
    expect(carouselPageCount(2, 3, 1)).toBe(1);
    expect(carouselPageCount(0, 3, 1)).toBe(0);
    expect(carouselFirst(1, 10, 3, 3)).toBe(3);
    // Page 3 of 10 items, 3 at a time: pulled back so items 7 … 9 fill it.
    expect(carouselFirst(3, 10, 3, 3)).toBe(7);
    expect(carouselFirst(9, 2, 3, 1)).toBe(0);
  });

  it('steps between pages, wrapping only when circular', () => {
    expect(carouselStep(0, 1, 4, false)).toBe(1);
    expect(carouselStep(3, 1, 4, false)).toBeNull();
    expect(carouselStep(3, 1, 4, true)).toBe(0);
    expect(carouselStep(0, -1, 4, true)).toBe(3);
    expect(carouselStep(0, -1, 1, true)).toBeNull();
    expect(carouselIsCircular(true, 5, 3)).toBe(true);
    expect(carouselIsCircular(true, 3, 3)).toBe(false);
    expect(carouselIsCircular(false, 9, 3)).toBe(false);
  });

  it('keeps the page in range and in place when the step changes', () => {
    expect(carouselClampPage(7, 4)).toBe(3);
    expect(carouselClampPage(-2, 4)).toBe(0);
    expect(carouselClampPage('2', 4)).toBe(2);
    expect(carouselClampPage(1, 0)).toBe(0);
    expect(carouselRepage(2, 3, 1, 8)).toBe(6);
    expect(carouselRepage(6, 1, 3, 3)).toBe(2);
  });
});
