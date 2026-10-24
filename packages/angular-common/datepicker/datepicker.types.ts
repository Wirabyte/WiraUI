export type { DatePickerValue, DatePickerView, DateSelectionMode, HourFormat } from 'wiratheme/core';

/** `'button'`: a button joined to the right of the field. `'input'`: an icon inside the field. */
export type WtDatePickerIconDisplay = 'button' | 'input';
/** `'date'`: the model is a Date (or Date[]). `'string'`: the text the field shows, in `dateFormat`. */
export type WtDatePickerDataType = 'date' | 'string';

/** `month` is 1–12. */
export interface WtDatePickerMonthChangeEvent {
  month: number;
  year: number;
}
