import { NgModule } from '@angular/core';
import { WuChartJs } from './chartjs.component';

/** For NgModule apps. Standalone apps can import `WuChartJs` directly. */
@NgModule({
  imports: [WuChartJs],
  exports: [WuChartJs],
})
export class WuChartJsModule {}
