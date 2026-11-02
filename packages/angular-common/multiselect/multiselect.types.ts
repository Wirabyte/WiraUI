/** `(onChange)`: the new value (an array) and the option value that was just ticked or unticked. */
export interface WuMultiSelectChangeEvent {
  originalEvent: Event;
  value: unknown[];
  itemValue?: unknown;
}

export interface WuMultiSelectFilterEvent {
  originalEvent: Event;
  filter: string;
}

/** `(onSelectAllChange)`: the header checkbox was ticked or unticked. */
export interface WuMultiSelectSelectAllChangeEvent {
  originalEvent: Event;
  checked: boolean;
}

/** Context of the `selectedItems` template: the chosen values and a function that removes one. */
export interface WuMultiSelectSelectedItemsContext {
  $implicit: unknown[];
  removeChip: (value: unknown, event?: Event) => void;
}
