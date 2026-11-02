import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuOrderList } from './orderlist.component';

/** For NgModule apps: the order list and `wuTemplate` (`pTemplate`). Standalone apps can import `WuOrderList` directly. */
@NgModule({
  imports: [WuOrderList, WuTemplate],
  exports: [WuOrderList, WuTemplate],
})
export class WuOrderListModule {}
