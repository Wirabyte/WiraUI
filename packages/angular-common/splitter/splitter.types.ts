/** `(onResizeStart)` / `(onResizeEnd)`: the event behind it and every panel's size in %. */
export interface WuSplitterResizeStartEvent {
  originalEvent: Event;
  sizes: number[];
}
export type WuSplitterResizeEndEvent = WuSplitterResizeStartEvent;

export type SplitterResizeStartEvent = WuSplitterResizeStartEvent;
export type SplitterResizeEndEvent = WuSplitterResizeStartEvent;
