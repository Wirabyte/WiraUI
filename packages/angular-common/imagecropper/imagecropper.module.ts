import { NgModule } from '@angular/core';
import { WuImageCropper } from './imagecropper.component';

/** For NgModule apps. Standalone apps can import `WuImageCropper` directly. */
@NgModule({
  imports: [WuImageCropper],
  exports: [WuImageCropper],
})
export class WuImageCropperModule {}
