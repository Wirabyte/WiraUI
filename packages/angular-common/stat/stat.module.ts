import { NgModule } from '@angular/core';
import { WuStat } from './stat.component';

/** For NgModule apps. Standalone apps can import `WuStat` directly. */
@NgModule({
  imports: [WuStat],
  exports: [WuStat],
})
export class WuStatModule {}
