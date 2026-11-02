import { NgModule } from '@angular/core';
import { WuProgressBar } from './progressbar.component';

/** For NgModule apps. Standalone apps can import `WuProgressBar` directly. */
@NgModule({
  imports: [WuProgressBar],
  exports: [WuProgressBar],
})
export class WuProgressBarModule {}
