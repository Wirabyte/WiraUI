export type WuSchedulerView = 'day' | 'week' | 'month';

export interface WuSchedulerEvent {
  id?: string | number;
  title: string;
  start: Date | string | number;
  /** Default: an hour after `start` (all-day events: the same day). */
  end?: Date | string | number | null;
  allDay?: boolean;
  /** Any CSS colour for the bar and tint. Default: the theme's primary colour. */
  color?: string;
  /** A line under the title in the day and week views. */
  description?: string;
  /** `false` keeps this one in place when the scheduler is `editable`. */
  editable?: boolean;
  /** Anything else the app needs back in the events it gets. */
  data?: unknown;
}

export interface WuSchedulerEventClickEvent {
  originalEvent: Event;
  event: WuSchedulerEvent;
}

/** `(onDateClick)`: an empty day (month view, `allDay`) or a time slot (day and week views) was clicked. */
export interface WuSchedulerDateClickEvent {
  originalEvent: Event;
  date: Date;
  allDay: boolean;
}

/** `(onEventChange)`: an event was dragged to a new time. The app saves it and passes new `events`. */
export interface WuSchedulerEventChangeEvent {
  event: WuSchedulerEvent;
  start: Date;
  end: Date;
}

/** An event placed on the grid (time views: its column lane; month view: just the day). */
export interface ɵWuPlacedEvent {
  key: string;
  event: WuSchedulerEvent;
  start: Date;
  end: Date;
  /** Day and week views: top and height in % of the visible hours; left and width in % of the day column. */
  top: number;
  height: number;
  left: number;
  width: number;
  time: string;
}
