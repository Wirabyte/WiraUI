/** `(completeMethod)` / `(onDropdownClick)`: the text to find suggestions for. */
export interface WuAutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

/** `(onSelect)` / `(onUnselect)`: the suggestion picked (or replaced). */
export interface WuAutoCompleteSelectEvent {
  originalEvent: Event;
  value: unknown;
}
