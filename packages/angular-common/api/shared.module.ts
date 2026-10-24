import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';

/** `WtTemplate` (`<ng-template wtTemplate="header">`, also read from `pTemplate`) as a module for NgModule apps. */
@NgModule({
  imports: [WtTemplate],
  exports: [WtTemplate],
})
export class WtSharedModule {}
