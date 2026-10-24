/** The animations, by the names apps already use in `data-aos`. */
export type WtAnimation =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'fade-up-right'
  | 'fade-up-left'
  | 'fade-down-right'
  | 'fade-down-left'
  | 'flip-up'
  | 'flip-down'
  | 'flip-left'
  | 'flip-right'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-in-up'
  | 'zoom-in-down'
  | 'zoom-in-left'
  | 'zoom-in-right'
  | 'zoom-out'
  | 'zoom-out-up'
  | 'zoom-out-down'
  | 'zoom-out-left'
  | 'zoom-out-right';

export interface WtAnimateOptions {
  /** Pixels from the bottom of the screen where an element starts animating. Default 120. */
  offset?: number;
  /** Milliseconds. Default 0. */
  delay?: number;
  /** Milliseconds. Default 400. */
  duration?: number;
  /** A CSS timing function or ease-in-back, ease-out-back, ease-in-out-sine … Default 'ease'. */
  easing?: string;
  /** Play only the first time an element comes into view. Default true. */
  once?: boolean;
  /** Also play out when scrolled past. Default false. */
  mirror?: boolean;
  /** Which part of the element must reach the bottom of the screen: top-bottom (default), center-bottom, bottom-bottom. */
  anchorPlacement?: string;
  /** Show everything without animating. */
  disable?: boolean;
}
