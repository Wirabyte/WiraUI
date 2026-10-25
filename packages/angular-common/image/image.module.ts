import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtImage } from './image.component';

/** For NgModule apps. Standalone apps can import `WtImage` directly. */
@NgModule({
  imports: [WtImage, WtTemplate],
  exports: [WtImage, WtTemplate],
})
export class WtImageModule {}
