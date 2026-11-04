import { NgModule } from '@angular/core';
import { WuScheduler } from './scheduler.component';

/** For NgModule apps. Standalone apps can import `WuScheduler` directly. */
@NgModule({
  imports: [WuScheduler],
  exports: [WuScheduler],
})
export class WuSchedulerModule {}
