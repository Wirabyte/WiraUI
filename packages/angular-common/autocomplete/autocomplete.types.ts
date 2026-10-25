/** `(completeMethod)` / `(onDropdownClick)`: the text to find suggestions for. */
export interface WtAutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

/** `(onSelect)` / `(onUnselect)`: the suggestion picked (or replaced). */
export interface WtAutoCompleteSelectEvent {
  originalEvent: Event;
  value: unknown;
}
