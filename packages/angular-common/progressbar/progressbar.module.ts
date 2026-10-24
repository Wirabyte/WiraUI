import { NgModule } from '@angular/core';
import { WtProgressBar } from './progressbar.component';

/** For NgModule apps. Standalone apps can import `WtProgressBar` directly. */
@NgModule({
  imports: [WtProgressBar],
  exports: [WtProgressBar],
})
export class WtProgressBarModule {}
