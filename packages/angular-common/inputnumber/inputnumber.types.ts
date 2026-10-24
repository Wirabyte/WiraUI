export type WtInputNumberMode = 'decimal' | 'currency';
/** stacked: up/down on the right; horizontal: minus on the left, plus on the right. */
export type WtInputNumberButtonLayout = 'stacked' | 'horizontal';

export interface WtInputNumberInputEvent {
  value: number | null;
  originalEvent: Event;
}
