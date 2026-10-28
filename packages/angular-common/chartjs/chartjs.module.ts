import { NgModule } from '@angular/core';
import { WtChartJs } from './chartjs.component';

/** For NgModule apps. Standalone apps can import `WtChartJs` directly. */
@NgModule({
  imports: [WtChartJs],
  exports: [WtChartJs],
})
export class WtChartJsModule {}
