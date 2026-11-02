export type WuTooltipPosition = 'top' | 'bottom' | 'left' | 'right';
/** `'hover'` also shows on keyboard focus. */
export type WuTooltipEvent = 'hover' | 'focus' | 'both';

export interface WuTooltipOptions {
  tooltipLabel?: string;
  tooltipPosition?: WuTooltipPosition;
  tooltipEvent?: WuTooltipEvent;
  showDelay?: number;
  hideDelay?: number;
  life?: number;
  escape?: boolean;
  disabled?: boolean;
  tooltipStyleClass?: string;
}
