import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtOrganizationChart } from './organizationchart.component';

/** For NgModule apps. Standalone apps can import `WtOrganizationChart` directly. `wtTemplate` (`pTemplate`) comes with it. */
@NgModule({
  imports: [WtOrganizationChart, WtTemplate],
  exports: [WtOrganizationChart, WtTemplate],
})
export class WtOrganizationChartModule {}
