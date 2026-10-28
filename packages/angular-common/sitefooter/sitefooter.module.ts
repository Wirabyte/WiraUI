import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtSiteFooter } from './sitefooter.component';

/** For NgModule apps (with `WtTemplate` for the `brand`, `end` and `bottom` slots). Standalone apps can import `WtSiteFooter` directly. */
@NgModule({
  imports: [WtSiteFooter, WtTemplate],
  exports: [WtSiteFooter, WtTemplate],
})
export class WtSiteFooterModule {}
