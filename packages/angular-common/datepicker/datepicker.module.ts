import { NgModule } from '@angular/core';
import { WuDatePicker } from './datepicker.component';

/** For NgModule apps. Standalone apps can import `WuDatePicker` directly. */
@NgModule({
  imports: [WuDatePicker],
  exports: [WuDatePicker],
})
export class WuDatePickerModule {}
