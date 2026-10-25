import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtPickList } from './picklist.component';

/** For NgModule apps: the pick list and `wtTemplate` (`pTemplate`). Standalone apps can import `WtPickList` directly. */
@NgModule({
  imports: [WtPickList, WtTemplate],
  exports: [WtPickList, WtTemplate],
})
export class WtPickListModule {}
