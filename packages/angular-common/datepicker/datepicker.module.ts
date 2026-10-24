import { NgModule } from '@angular/core';
import { WtDatePicker } from './datepicker.component';

/** For NgModule apps. Standalone apps can import `WtDatePicker` directly. */
@NgModule({
  imports: [WtDatePicker],
  exports: [WtDatePicker],
})
export class WtDatePickerModule {}
