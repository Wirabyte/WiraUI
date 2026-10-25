import { NgModule } from '@angular/core';
import { WtColorPicker } from './colorpicker.component';

/** For NgModule apps. Standalone apps can import `WtColorPicker` directly. */
@NgModule({
  imports: [WtColorPicker],
  exports: [WtColorPicker],
})
export class WtColorPickerModule {}
