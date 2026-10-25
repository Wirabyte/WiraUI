/** `(onChange)`: the new value (an array) and the option value that was just ticked or unticked. */
export interface WtMultiSelectChangeEvent {
  originalEvent: Event;
  value: unknown[];
  itemValue?: unknown;
}

export interface WtMultiSelectFilterEvent {
  originalEvent: Event;
  filter: string;
}

/** `(onSelectAllChange)`: the header checkbox was ticked or unticked. */
export interface WtMultiSelectSelectAllChangeEvent {
  originalEvent: Event;
  checked: boolean;
}

/** Context of the `selectedItems` template: the chosen values and a function that removes one. */
export interface WtMultiSelectSelectedItemsContext {
  $implicit: unknown[];
  removeChip: (value: unknown, event?: Event) => void;
}
