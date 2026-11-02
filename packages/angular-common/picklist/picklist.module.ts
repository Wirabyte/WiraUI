import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuPickList } from './picklist.component';

/** For NgModule apps: the pick list and `wuTemplate` (`pTemplate`). Standalone apps can import `WuPickList` directly. */
@NgModule({
  imports: [WuPickList, WuTemplate],
  exports: [WuPickList, WuTemplate],
})
export class WuPickListModule {}
