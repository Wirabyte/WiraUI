/** `(onSelectionChange)`: the whole selection after the click or key. */
export interface WtOrderListSelectionChangeEvent {
  originalEvent?: Event;
  value: unknown[];
}

/** `(onFilterEvent)`: the items the search leaves. */
export interface WtOrderListFilterEvent {
  originalEvent?: Event;
  value: unknown[];
}
