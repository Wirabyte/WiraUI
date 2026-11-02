/** Carousel (wu-carousel): pages of items, what shows at a window width, and moving between pages. */

/** At or below `breakpoint` (a CSS width such as `'768px'`), show `numVisible` items and move `numScroll` at a time. */
export interface CarouselResponsiveOptions {
  breakpoint: string;
  numVisible: number;
  numScroll: number;
}

const count1 = (v: unknown, fallback: number): number => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n >= 1 ? n : fallback;
};

/**
 * Items in view and items per move at a window width: the option with the smallest breakpoint that is still at least
 * the width wins; with none, the component's own numbers. `width` null (no window, e.g. on the server) uses those too.
 */
export function carouselLayout(
  width: number | null | undefined,
  numVisible: unknown,
  numScroll: unknown,
  options?: readonly CarouselResponsiveOptions[] | null
): { numVisible: number; numScroll: number } {
  let out = { numVisible: count1(numVisible, 1), numScroll: count1(numScroll, 1) };
  if (width === null || width === undefined || !options || !options.length) return out;
  const sorted = [...options].filter(Boolean).sort((a, b) => parseInt(String(b.breakpoint), 10) - parseInt(String(a.breakpoint), 10));
  for (const o of sorted) {
    if (parseInt(String(o.breakpoint), 10) >= width) out = { numVisible: count1(o.numVisible, out.numVisible), numScroll: count1(o.numScroll, 1) };
  }
  return out;
}

/** How many pages (indicator dots) `count` items make. One page when they all fit; none when there are no items. */
export function carouselPageCount(count: number, numVisible: number, numScroll: number): number {
  if (!(count > 0)) return 0;
  const v = count1(numVisible, 1);
  const s = count1(numScroll, 1);
  return count <= v ? 1 : Math.ceil((count - v) / s) + 1;
}

/** The first item in view on a page. The last page is pulled back so it is full (no gap after the last item). */
export function carouselFirst(page: number, count: number, numVisible: number, numScroll: number): number {
  const v = count1(numVisible, 1);
  const s = count1(numScroll, 1);
  const p = Math.max(0, Math.floor(Number(page)) || 0);
  return Math.min(p * s, Math.max(0, count - v));
}

/** A page inside 0 … pages - 1. */
export function carouselClampPage(page: unknown, pageCount: number): number {
  const p = Math.floor(Number(page));
  if (!Number.isFinite(p) || pageCount <= 0) return 0;
  return Math.min(Math.max(0, p), pageCount - 1);
}

/** Wrapping round only makes sense when there are more items than fit. */
export function carouselIsCircular(circular: boolean, count: number, numVisible: number): boolean {
  return !!circular && count > count1(numVisible, 1);
}

/** The page after (`dir` 1) or before (`dir` -1) `page`, wrapping when circular; `null` at an end that does not wrap. */
export function carouselStep(page: number, dir: 1 | -1, pageCount: number, circular: boolean): number | null {
  if (pageCount <= 1) return null;
  const next = page + dir;
  if (next >= 0 && next < pageCount) return next;
  if (!circular) return null;
  return next < 0 ? pageCount - 1 : 0;
}

/** The page that keeps roughly the same items in view after `numScroll` changes (window resized past a breakpoint). */
export function carouselRepage(page: number, oldScroll: number, newScroll: number, pageCount: number): number {
  return carouselClampPage(Math.floor((page * count1(oldScroll, 1)) / count1(newScroll, 1)), pageCount);
}
