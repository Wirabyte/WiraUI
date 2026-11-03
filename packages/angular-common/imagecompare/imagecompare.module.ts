import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuImageCompare } from './imagecompare.component';

/** For NgModule apps. Standalone apps can import `WuImageCompare` directly. `wuTemplate` (`pTemplate`) comes with it. */
@NgModule({
  imports: [WuImageCompare, WuTemplate],
  exports: [WuImageCompare, WuTemplate],
})
export class WuImageCompareModule {}
