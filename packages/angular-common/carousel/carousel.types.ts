import type { CarouselResponsiveOptions } from 'wiratheme/core';

/** `(onPage)`: the page now in view. */
export interface WtCarouselPageEvent {
  page: number;
}

/** Context of the `item` template: `let-item` (and `let-index="index"`). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface WtCarouselItemTemplateContext<T = any> {
  $implicit: T;
  index: number;
}

/** What `prevButtonProps` / `nextButtonProps` change here: an icon class instead of the chevron, and the label. */
export interface WtCarouselButtonProps {
  icon?: string;
  ariaLabel?: string;
  styleClass?: string;
  [key: string]: unknown;
}

/** At or below `breakpoint` (e.g. `'768px'`), show `numVisible` items and move `numScroll` at a time. */
export type WtCarouselResponsiveOptions = CarouselResponsiveOptions;
export type { CarouselResponsiveOptions };
export type CarouselPageEvent = WtCarouselPageEvent;
