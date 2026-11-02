import { NgModule } from '@angular/core';
import { WuResult } from './result.component';

/** For NgModule apps. Standalone apps can import `WuResult` directly. */
@NgModule({
  imports: [WuResult],
  exports: [WuResult],
})
export class WuResultModule {}
