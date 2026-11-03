import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuOrganizationChart } from './organizationchart.component';

/** For NgModule apps. Standalone apps can import `WuOrganizationChart` directly. `wuTemplate` (`pTemplate`) comes with it. */
@NgModule({
  imports: [WuOrganizationChart, WuTemplate],
  exports: [WuOrganizationChart, WuTemplate],
})
export class WuOrganizationChartModule {}
