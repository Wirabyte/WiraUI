export type WuInputNumberMode = 'decimal' | 'currency';
/** stacked: up/down on the right; horizontal: minus on the left, plus on the right. */
export type WuInputNumberButtonLayout = 'stacked' | 'horizontal';

export interface WuInputNumberInputEvent {
  value: number | null;
  originalEvent: Event;
}
