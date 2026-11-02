import { NgModule } from '@angular/core';
import { WuMeterGroup } from './metergroup.component';

/** For NgModule apps. Standalone apps can import `WuMeterGroup` directly. */
@NgModule({
  imports: [WuMeterGroup],
  exports: [WuMeterGroup],
})
export class WuMeterGroupModule {}
