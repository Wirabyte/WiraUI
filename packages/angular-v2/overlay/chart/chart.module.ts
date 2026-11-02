import { NgModule } from '@angular/core';
import { WuChart } from './chart.component';

/** For NgModule apps. Standalone apps can import `WuChart` directly. */
@NgModule({
  imports: [WuChart],
  exports: [WuChart],
})
export class WuChartModule {}
