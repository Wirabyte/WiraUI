import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuNavbar } from './navbar.component';

/** For NgModule apps (with `WuTemplate` for `wuTemplate="start"` / `"end"` / `"item"`). Standalone apps can import `WuNavbar` directly. */
@NgModule({
  imports: [WuNavbar, WuTemplate],
  exports: [WuNavbar, WuTemplate],
})
export class WuNavbarModule {}
