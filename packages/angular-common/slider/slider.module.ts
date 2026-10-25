import { NgModule } from '@angular/core';
import { WtSlider } from './slider.component';

/** For NgModule apps. Standalone apps can import `WtSlider` directly. */
@NgModule({
  imports: [WtSlider],
  exports: [WtSlider],
})
export class WtSliderModule {}
