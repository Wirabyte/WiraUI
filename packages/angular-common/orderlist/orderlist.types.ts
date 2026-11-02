/** `(onSelectionChange)`: the whole selection after the click or key. */
export interface WuOrderListSelectionChangeEvent {
  originalEvent?: Event;
  value: unknown[];
}

/** `(onFilterEvent)`: the items the search leaves. */
export interface WuOrderListFilterEvent {
  originalEvent?: Event;
  value: unknown[];
}
