import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuImage } from './image.component';

/** For NgModule apps. Standalone apps can import `WuImage` directly. */
@NgModule({
  imports: [WuImage, WuTemplate],
  exports: [WuImage, WuTemplate],
})
export class WuImageModule {}
