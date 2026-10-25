import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtOrderList } from './orderlist.component';

/** For NgModule apps: the order list and `wtTemplate` (`pTemplate`). Standalone apps can import `WtOrderList` directly. */
@NgModule({
  imports: [WtOrderList, WtTemplate],
  exports: [WtOrderList, WtTemplate],
})
export class WtOrderListModule {}
