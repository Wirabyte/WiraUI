export type WtTooltipPosition = 'top' | 'bottom' | 'left' | 'right';
/** `'hover'` also shows on keyboard focus. */
export type WtTooltipEvent = 'hover' | 'focus' | 'both';

export interface WtTooltipOptions {
  tooltipLabel?: string;
  tooltipPosition?: WtTooltipPosition;
  tooltipEvent?: WtTooltipEvent;
  showDelay?: number;
  hideDelay?: number;
  life?: number;
  escape?: boolean;
  disabled?: boolean;
  tooltipStyleClass?: string;
}
