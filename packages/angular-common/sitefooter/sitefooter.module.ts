import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuSiteFooter } from './sitefooter.component';

/** For NgModule apps (with `WuTemplate` for the `brand`, `end` and `bottom` slots). Standalone apps can import `WuSiteFooter` directly. */
@NgModule({
  imports: [WuSiteFooter, WuTemplate],
  exports: [WuSiteFooter, WuTemplate],
})
export class WuSiteFooterModule {}
