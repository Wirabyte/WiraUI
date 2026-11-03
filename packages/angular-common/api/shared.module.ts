import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';

/** `WuTemplate` (`<ng-template wuTemplate="header">`, also read from `pTemplate`) as a module for NgModule apps. */
@NgModule({
  imports: [WuTemplate],
  exports: [WuTemplate],
})
export class WuSharedModule {}
