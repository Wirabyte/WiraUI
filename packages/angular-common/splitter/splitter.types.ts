/** `(onResizeStart)` / `(onResizeEnd)`: the event behind it and every panel's size in %. */
export interface WtSplitterResizeStartEvent {
  originalEvent: Event;
  sizes: number[];
}
export type WtSplitterResizeEndEvent = WtSplitterResizeStartEvent;

export type SplitterResizeStartEvent = WtSplitterResizeStartEvent;
export type SplitterResizeEndEvent = WtSplitterResizeStartEvent;
