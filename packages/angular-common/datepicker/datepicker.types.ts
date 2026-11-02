export type { DatePickerValue, DatePickerView, DateSelectionMode, HourFormat } from 'wiraui/core';

/** `'button'`: a button joined to the right of the field. `'input'`: an icon inside the field. */
export type WuDatePickerIconDisplay = 'button' | 'input';
/** `'date'`: the model is a Date (or Date[]). `'string'`: the text the field shows, in `dateFormat`. */
export type WuDatePickerDataType = 'date' | 'string';

/** `month` is 1–12. */
export interface WuDatePickerMonthChangeEvent {
  month: number;
  year: number;
}
