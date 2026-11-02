import { NgModule } from '@angular/core';
import { WuColorPicker } from './colorpicker.component';

/** For NgModule apps. Standalone apps can import `WuColorPicker` directly. */
@NgModule({
  imports: [WuColorPicker],
  exports: [WuColorPicker],
})
export class WuColorPickerModule {}
