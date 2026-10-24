import { NgModule } from '@angular/core';
import { WtMeterGroup } from './metergroup.component';

/** For NgModule apps. Standalone apps can import `WtMeterGroup` directly. */
@NgModule({
  imports: [WtMeterGroup],
  exports: [WtMeterGroup],
})
export class WtMeterGroupModule {}
