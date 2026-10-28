import { NgModule } from '@angular/core';
import { WtChart } from './chart.component';

/** For NgModule apps. Standalone apps can import `WtChart` directly. */
@NgModule({
  imports: [WtChart],
  exports: [WtChart],
})
export class WtChartModule {}
