import { NgModule } from '@angular/core';
import { WuSlider } from './slider.component';

/** For NgModule apps. Standalone apps can import `WuSlider` directly. */
@NgModule({
  imports: [WuSlider],
  exports: [WuSlider],
})
export class WuSliderModule {}
