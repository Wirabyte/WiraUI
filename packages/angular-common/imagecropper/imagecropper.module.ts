import { NgModule } from '@angular/core';
import { WtImageCropper } from './imagecropper.component';

/** For NgModule apps. Standalone apps can import `WtImageCropper` directly. */
@NgModule({
  imports: [WtImageCropper],
  exports: [WtImageCropper],
})
export class WtImageCropperModule {}
